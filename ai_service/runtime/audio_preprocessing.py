# ai_service/runtime/audio_preprocessing.py
"""
Audio preprocessing module for noise reduction and signal enhancement.
Includes band-pass filtering, notch filtering, and light denoising.
"""

import numpy as np
from scipy import signal
from scipy.signal import butter, filtfilt, iirnotch


def bandpass_filter(audio: np.ndarray, sr: int, lowcut: float = 20.0, highcut: float = 2000.0, order: int = 5) -> np.ndarray:
    """
    Apply band-pass filter to remove frequencies outside the range of interest.
    
    For heart sounds: 20-2000 Hz (captures S1, S2, murmurs)
    For lung sounds: 20-2000 Hz (captures normal breath sounds, crackles, wheezes)
    
    Args:
        audio: Input audio signal
        sr: Sample rate
        lowcut: Low frequency cutoff (Hz)
        highcut: High frequency cutoff (Hz)
        order: Filter order (higher = steeper rolloff)
    
    Returns:
        Filtered audio signal
    """
    nyquist = sr / 2.0
    low = lowcut / nyquist
    high = highcut / nyquist
    
    # Ensure frequencies are in valid range
    low = max(0.001, min(low, 0.999))
    high = max(0.001, min(high, 0.999))
    
    if low >= high:
        # If invalid range, return original audio
        return audio
    
    b, a = butter(order, [low, high], btype='band')
    filtered = filtfilt(b, a, audio)
    
    return filtered.astype(np.float32)


def notch_filter(audio: np.ndarray, sr: int, freq: float = 60.0, quality: float = 30.0) -> np.ndarray:
    """
    Apply notch filter to remove specific frequency (e.g., 50/60 Hz power line noise).
    
    Args:
        audio: Input audio signal
        sr: Sample rate
        freq: Frequency to remove (Hz) - typically 50 Hz (Europe) or 60 Hz (US/Asia)
        quality: Quality factor (higher = narrower notch)
    
    Returns:
        Filtered audio signal
    """
    nyquist = sr / 2.0
    w0 = freq / nyquist
    
    # Ensure frequency is in valid range
    if w0 <= 0 or w0 >= 1:
        return audio
    
    b, a = iirnotch(w0, quality)
    filtered = filtfilt(b, a, audio)
    
    return filtered.astype(np.float32)


def spectral_subtraction_denoise(audio: np.ndarray, sr: int, noise_duration: float = 0.1) -> np.ndarray:
    """
    Apply light spectral subtraction denoising.
    Estimates noise from the first portion of the audio and subtracts it.
    
    Args:
        audio: Input audio signal
        sr: Sample rate
        noise_duration: Duration (seconds) to use for noise estimation
    
    Returns:
        Denoised audio signal
    """
    # Estimate noise from first portion
    noise_samples = int(noise_duration * sr)
    noise_samples = min(noise_samples, len(audio) // 4)  # Use max 25% of audio
    
    if noise_samples < 100:
        # Too short to estimate noise reliably
        return audio
    
    # Compute noise spectrum
    noise_segment = audio[:noise_samples]
    noise_fft = np.fft.rfft(noise_segment)
    noise_magnitude = np.abs(noise_fft)
    
    # Process audio in overlapping windows
    window_size = 2048
    hop_size = window_size // 2
    
    # Pad audio to ensure we can process all of it
    padded_length = len(audio) + window_size
    padded_audio = np.pad(audio, (0, padded_length - len(audio)), mode='constant')
    
    # Output buffer
    output = np.zeros_like(padded_audio)
    window_count = np.zeros_like(padded_audio)
    
    # Hanning window for smooth transitions
    window = np.hanning(window_size)
    
    # Process each window
    for start in range(0, len(audio) - window_size + 1, hop_size):
        # Extract window
        segment = padded_audio[start:start + window_size] * window
        
        # FFT
        segment_fft = np.fft.rfft(segment)
        segment_magnitude = np.abs(segment_fft)
        segment_phase = np.angle(segment_fft)
        
        # Spectral subtraction (conservative)
        # Interpolate noise magnitude to match segment length
        if len(noise_magnitude) != len(segment_magnitude):
            noise_mag_interp = np.interp(
                np.linspace(0, 1, len(segment_magnitude)),
                np.linspace(0, 1, len(noise_magnitude)),
                noise_magnitude
            )
        else:
            noise_mag_interp = noise_magnitude
        
        # Subtract noise (with floor to avoid over-subtraction)
        alpha = 1.5  # Over-subtraction factor
        beta = 0.1   # Spectral floor (prevents complete removal)
        cleaned_magnitude = np.maximum(
            segment_magnitude - alpha * noise_mag_interp,
            beta * segment_magnitude
        )
        
        # Reconstruct signal
        cleaned_fft = cleaned_magnitude * np.exp(1j * segment_phase)
        cleaned_segment = np.fft.irfft(cleaned_fft, n=window_size)
        
        # Add to output with windowing
        output[start:start + window_size] += cleaned_segment * window
        window_count[start:start + window_size] += window
    
    # Normalize by window overlap
    window_count = np.maximum(window_count, 1e-8)
    output = output / window_count
    
    # Trim to original length
    output = output[:len(audio)]
    
    return output.astype(np.float32)


def preprocess_audio(audio: np.ndarray, sr: int, mode: str = "heart") -> np.ndarray:
    """
    Complete audio preprocessing pipeline:
    1. Band-pass filter (20-2000 Hz)
    2. Notch filter (60 Hz power line noise)
    3. Light spectral subtraction denoising
    
    Args:
        audio: Input audio signal
        sr: Sample rate
        mode: "heart" or "lung" (for mode-specific tuning)
    
    Returns:
        Preprocessed audio signal
    """
    # Step 1: Band-pass filter
    if mode == "heart":
        # Heart sounds: 20-2000 Hz (S1 ~30-45 Hz, S2 ~50-70 Hz, murmurs up to 500 Hz)
        audio = bandpass_filter(audio, sr, lowcut=20.0, highcut=2000.0, order=5)
    else:  # lung
        # Lung sounds: 20-2000 Hz (normal breath 100-1000 Hz, crackles 100-2000 Hz, wheezes 100-1000 Hz)
        audio = bandpass_filter(audio, sr, lowcut=20.0, highcut=2000.0, order=5)
    
    # Step 2: Notch filter for power line noise (60 Hz for US/Asia, 50 Hz for Europe)
    audio = notch_filter(audio, sr, freq=60.0, quality=30.0)
    
    # Step 3: Light denoising (spectral subtraction)
    audio = spectral_subtraction_denoise(audio, sr, noise_duration=0.1)
    
    # Normalize after preprocessing
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / (max_val + 1e-9)
    
    return audio.astype(np.float32)
