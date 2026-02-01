# THESIS/runtime/postprocess/recommendation.py

from dataclasses import dataclass
from typing import List

@dataclass
class WindowPrediction:
    label: str           # "normal" | "murmur" | "crackles" | "wheeze"
    confidence: float    # 0..1
    window_seconds: float

@dataclass
class RecommendationOutput:
    status: str
    confidence_pct: int
    consistency_text: str
    recommendation: str

def build_recommendation(
    mode: str,  # "heart" or "lung"
    history: List[WindowPrediction],
    lookback_seconds: float = 30.0
) -> RecommendationOutput:
    if not history:
        return RecommendationOutput(
            status="Listening...",
            confidence_pct=0,
            consistency_text=f"0s of last {int(lookback_seconds)}s abnormal",
            recommendation="Start a recording to generate analysis."
        )

    def is_abnormal(label: str) -> bool:
        if mode == "heart":
            return label == "murmur"
        return label in ("crackles", "wheeze")

    # take recent windows covering lookback_seconds
    recent = []
    covered = 0.0
    for w in reversed(history):
        if covered >= lookback_seconds:
            break
        recent.append(w)
        covered += w.window_seconds

    abnormal_seconds = sum(w.window_seconds for w in recent if is_abnormal(w.label))
    last_seconds = min(lookback_seconds, covered)

    abnormal_conf = [w.confidence for w in recent if is_abnormal(w.label)]
    peak_conf = max(abnormal_conf) if abnormal_conf else history[-1].confidence

    latest = history[-1]
    if mode == "heart":
        status = "Murmur Detected" if latest.label == "murmur" else "Normal"
    else:
        status = "Normal" if latest.label == "normal" else f"{latest.label.title()} Detected"

    confidence_pct = int(max(0.0, min(1.0, peak_conf)) * 100)
    consistency_text = f"{int(round(abnormal_seconds))}s of last {int(round(last_seconds))}s abnormal"

    # Severity rules (tune later)
    if abnormal_seconds >= 20 and peak_conf >= 0.90:
        severity = "high"
    elif abnormal_seconds >= 10 and peak_conf >= 0.75:
        severity = "moderate"
    elif abnormal_seconds > 0 and peak_conf >= 0.60:
        severity = "low"
    else:
        severity = "none"

    base = "This tool is for screening only and does not provide a medical diagnosis."

    if severity == "none":
        reco = f"No persistent abnormal pattern detected. Continue monitoring. {base}"
    else:
        if mode == "heart":
            if severity == "low":
                reco = f"Possible abnormal heart sound detected. Retake recording in a quiet environment. If this repeats, consider consulting a healthcare professional. {base}"
            elif severity == "moderate":
                reco = f"Abnormal heart sound pattern detected with moderate confidence. Consider consulting a healthcare professional for proper evaluation, especially if this repeats. {base}"
            else:
                reco = f"Persistent abnormal heart sound detected with high confidence. It is recommended to consult a healthcare professional for proper evaluation. {base}"
        else:
            if severity == "low":
                reco = f"Possible abnormal lung sound detected. Retake recording and monitor symptoms. If you have cough, fever, or shortness of breath, consider consulting a healthcare professional. {base}"
            elif severity == "moderate":
                reco = f"Abnormal lung sound detected with moderate confidence. If symptoms persist or worsen, consider consulting a healthcare professional. {base}"
            else:
                reco = f"Persistent abnormal lung sound detected with high confidence. If breathing is difficult or symptoms are worsening, seek medical attention promptly. {base}"

    return RecommendationOutput(
        status=status,
        confidence_pct=confidence_pct,
        consistency_text=consistency_text,
        recommendation=reco
    )
