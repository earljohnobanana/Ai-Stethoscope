from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import tempfile
import numpy as np
import librosa
import os
import traceback

from runtime.tflite_runner import TFLiteRunner

app = FastAPI(title="AI Stethoscope Inference Service")

# -------------------------
# Paths / Models
# -------------------------
BASE_DIR = Path(__file__).resolve().parent

MODEL_HEART = BASE_DIR / "models" / "heart_model.tflite"
MODEL_LUNG  = BASE_DIR / "models" / "lung_model.tflite"   # <- matches your folder

if not MODEL_HEART.exists():
    raise FileNotFoundError(f"Missing heart model: {MODEL_HEART}")
if not MODEL_LUNG.exists():
    raise FileNotFoundError(f"Missing lung model: {MODEL_LUNG}")

runner_heart = TFLiteRunner(str(MODEL_HEART))
runner_lung  = TFLiteRunner(str(MODEL_LUNG))

# -------------------------
# Audio / Feature params
# -------------------------
SAMPLE_RATE = 16000
N_FFT = 1024
HOP = 512

# -------------------------
# Utilities
# -------------------------
def _runner_expected_hw(runner):
    """
    Expect model input shape like (1, H, W, C)
    Returns (H, W, C) as ints.
    """
    shape = tuple(int(v) for v in runner.input_shape)
    if len(shape) != 4:
        raise ValueError(f"Model input shape must be rank-4 (1,H,W,C). Got: {shape}")
    _, H, W, C = shape
    return H, W, C

def load_wav_mono_16k(path: str) -> np.ndarray:
    y, _ = librosa.load(path, sr=SAMPLE_RATE, mono=True)
    # normalize safely
    y = y / (np.max(np.abs(y)) + 1e-9)
    return y.astype(np.float32)

def to_features(audio: np.ndarray, runner) -> np.ndarray:
    """
    Build log-mel features that MATCH the model's expected H (n_mels) and W (frames).
    This is the #1 fix for heart working but lung crashing.
    """
    H, W, C = _runner_expected_hw(runner)

    if C != 1:
        raise ValueError(f"Expected channel C=1, got C={C}. Model shape mismatch.")

    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=SAMPLE_RATE,
        n_mels=H,        # <- match model height
        n_fft=N_FFT,
        hop_length=HOP,
        power=2.0,
    )
    mel_db = librosa.power_to_db(mel, ref=np.max)

    # pad/crop time axis to match model width
    if mel_db.shape[1] < W:
        mel_db = np.pad(mel_db, ((0, 0), (0, W - mel_db.shape[1])))
    else:
        mel_db = mel_db[:, :W]

    x = mel_db[np.newaxis, ..., np.newaxis].astype(runner.input_dtype)

    expected_shape = (1, H, W, 1)
    if x.shape != expected_shape:
        raise ValueError(f"Feature shape {x.shape} != expected {expected_shape}")

    return x

def predict(runner, x):
    """
    Supports different runner method names.
    """
    if hasattr(runner, "predict_proba"):
        return runner.predict_proba(x)
    if hasattr(runner, "predict"):
        return runner.predict(x)
    if hasattr(runner, "run"):
        return runner.run(x)
    raise AttributeError("TFLiteRunner missing predict method (predict_proba/predict/run)")

def sigmoid_to_result(p, threshold=0.30):
    """
    Convert scalar probability to (detected, confidence_pct, prob)
    confidence_pct is "model confidence", not medical certainty.
    """
    p = float(np.array(p).reshape(-1)[0])
    detected = p > threshold
    conf = p if detected else 1.0 - p
    return detected, int(round(conf * 100)), p

def estimate_bpm(audio: np.ndarray):
    """
    Very rough BPM estimator (works better on clean heart sounds).
    Safe: returns None if it cannot estimate.
    """
    onset_env = librosa.onset.onset_strength(y=audio, sr=SAMPLE_RATE, hop_length=HOP)
    ac = np.correlate(onset_env, onset_env, mode="full")
    ac = ac[len(ac)//2:]

    min_bpm, max_bpm = 40, 200
    min_lag = int((60 / max_bpm) * (SAMPLE_RATE / HOP))
    max_lag = int((60 / min_bpm) * (SAMPLE_RATE / HOP))

    if max_lag <= min_lag or max_lag >= len(ac):
        return None

    seg = ac[min_lag:max_lag]
    peak = np.argmax(seg) + min_lag
    if peak <= 0:
        return None

    bpm = 60.0 / (peak * (HOP / SAMPLE_RATE))
    return int(round(bpm))

def estimate_respiratory_rate(audio: np.ndarray):
    """
    Rough respiratory rate (breaths per minute) estimator.
    Safe: returns None if it cannot estimate.
    """
    onset_env = librosa.onset.onset_strength(y=audio, sr=SAMPLE_RATE, hop_length=HOP)
    ac = np.correlate(onset_env, onset_env, mode="full")
    ac = ac[len(ac)//2:]

    min_rr, max_rr = 8, 30
    min_lag = int((60 / max_rr) * (SAMPLE_RATE / HOP))
    max_lag = int((60 / min_rr) * (SAMPLE_RATE / HOP))

    if max_lag <= min_lag or max_lag >= len(ac):
        return None

    seg = ac[min_lag:max_lag]
    peak = np.argmax(seg) + min_lag
    if peak <= 0:
        return None

    rr = 60.0 / (peak * (HOP / SAMPLE_RATE))
    return int(round(rr))

def _error_500(detail: str, tb: str):
    """
    Return readable error JSON to Swagger + print traceback in terminal.
    """
    print("=== INFERENCE ERROR ===")
    print(tb)
    return JSONResponse(
        status_code=500,
        content={"status": "error", "detail": detail}
    )

# -------------------------
# Endpoints
# -------------------------
@app.get("/health")
def health():
    # useful for Laravel checks / monitoring
    return {
        "status": "ok",
        "heart_model": "heart_model.tflite",
        "lung_model": "lung_model.tflite",
        "heart_input_shape": [int(v) for v in runner_heart.input_shape],
        "lung_input_shape": [int(v) for v in runner_lung.input_shape],
    }

@app.post("/infer/heart")
async def infer_heart(file: UploadFile = File(...)):
    tmp_path = None
    try:
        # save upload to temp wav
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        y = load_wav_mono_16k(tmp_path)

        bpm = estimate_bpm(y)

        x = to_features(y, runner_heart)
        proba = predict(runner_heart, x)
        murmur_detected, confidence_pct, murmur_prob = sigmoid_to_result(proba, threshold=0.30)

        # normalized response (UI-friendly)
        return JSONResponse({
            "mode": "heart",
            "status": "completed",
            "result": "abnormal" if murmur_detected else "normal",
            "bpm": bpm,
            "ai_confidence_pct": confidence_pct,
            "murmur_detected": murmur_detected,
            "debug": {
                "murmur_probability": murmur_prob
            }
        })

    except Exception as e:
        tb = traceback.format_exc()
        return _error_500(str(e), tb)

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except:
                pass

@app.post("/infer/lung")
async def infer_lung(file: UploadFile = File(...)):
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        y = load_wav_mono_16k(tmp_path)

        resp_rate = estimate_respiratory_rate(y)

        x = to_features(y, runner_lung)
        proba = predict(runner_lung, x)
        crackle_detected, confidence_pct, crackle_prob = sigmoid_to_result(proba, threshold=0.30)

        return JSONResponse({
            "mode": "lung",
            "status": "completed",
            "result": "abnormal" if crackle_detected else "normal",
            "resp_rate": resp_rate,
            "ai_confidence_pct": confidence_pct,
            "crackle_detected": crackle_detected,
            "debug": {
                "crackle_probability": crackle_prob
            }
        })

    except Exception as e:
        tb = traceback.format_exc()
        return _error_500(str(e), tb)

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except:
                pass
