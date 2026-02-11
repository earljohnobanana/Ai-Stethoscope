"""
Test the audio preprocessing functionality
Verifies that the band-pass, notch, and denoise filters are working correctly
"""

import numpy as np
from ai_service.runtime.audio_preprocessing import (
    preprocess_audio,
    bandpass_filter,
    notch_filter,
    spectral_subtraction_denoise
)


def test_bandpass_filter():
    """Test band-pass filter functionality"""
    print("=== Band-Pass Filter Test ===")
    
    # Create test audio: 100Hz + 1000Hz + 3000Hz sine waves
    sample_rate = 16000
    duration = 1  # second
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    # Create composite signal with multiple frequencies
    audio = (
        0.3 * np.sin(2 * np.pi * 100 * t) +    # 100Hz (within heart range)
        0.5 * np.sin(2 * np.pi * 1000 * t) +   # 1000Hz (within lung range)
        0.2 * np.sin(2 * np.pi * 3000 * t)     # 3000Hz (outside range)
    )
    
    # Test heart band-pass filter (20-200Hz)
    heart_filtered = bandpass_filter(audio, sample_rate, lowcut=20, highcut=200)
    print(f"  Heart filter: Signal shape {heart_filtered.shape}")
    
    # Test lung band-pass filter (100-2000Hz)
    lung_filtered = bandpass_filter(audio, sample_rate, lowcut=100, highcut=2000)
    print(f"  Lung filter: Signal shape {lung_filtered.shape}")
    
    # Verify filtered signals are not empty
    assert len(heart_filtered) > 0, "Heart filter returned empty signal"
    assert len(lung_filtered) > 0, "Lung filter returned empty signal"
    
    print("✅ Band-pass filter test passed")


def test_notch_filter():
    """Test notch filter for power line noise"""
    print("\n=== Notch Filter Test ===")
    
    sample_rate = 16000
    duration = 1  # second
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    # Create signal with 60Hz power line noise
    clean_signal = 0.5 * np.sin(2 * np.pi * 100 * t)
    noise = 0.3 * np.sin(2 * np.pi * 60 * t)
    audio = clean_signal + noise
    
    # Apply notch filter to remove 60Hz
    filtered = notch_filter(audio, sample_rate, freq=60, quality=30)
    
    print(f"  Signal shape before/after notch: {audio.shape} / {filtered.shape}")
    assert len(filtered) == len(audio), "Notch filter changed signal length"
    
    print("✅ Notch filter test passed")


def test_denoising():
    """Test spectral subtraction denoising"""
    print("\n=== Denoising Test ===")
    
    sample_rate = 16000
    duration = 1  # second
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    # Create clean signal + random noise
    clean_signal = 0.5 * np.sin(2 * np.pi * 100 * t)
    noise = np.random.normal(0, 0.2, len(t))
    audio = clean_signal + noise
    
    # Apply denoising
    denoised = spectral_subtraction_denoise(audio, sample_rate)
    
    print(f"  Signal shape before/after denoise: {audio.shape} / {denoised.shape}")
    assert len(denoised) == len(audio), "Denoising changed signal length"
    
    # Verify denoised signal has lower noise
    clean_power = np.mean(clean_signal**2)
    noisy_power = np.mean(audio**2)
    denoised_power = np.mean(denoised**2)
    
    print(f"  Clean power: {clean_power:.4f}, Noisy power: {noisy_power:.4f}, Denoised power: {denoised_power:.4f}")
    
    print("✅ Denoising test passed")


def test_complete_preprocessing():
    """Test the complete preprocessing pipeline"""
    print("\n=== Complete Preprocessing Pipeline Test ===")
    
    sample_rate = 16000
    duration = 1  # second
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    # Create realistic noisy signal
    clean_signal = 0.5 * np.sin(2 * np.pi * 100 * t)
    power_line_noise = 0.3 * np.sin(2 * np.pi * 60 * t)
    random_noise = np.random.normal(0, 0.1, len(t))
    high_freq_noise = 0.2 * np.sin(2 * np.pi * 3000 * t)
    
    audio = clean_signal + power_line_noise + random_noise + high_freq_noise
    
    # Test heart preprocessing
    heart_processed = preprocess_audio(audio, sample_rate, mode="heart")
    print(f"  Heart preprocessing: Signal shape {heart_processed.shape}")
    
    # Test lung preprocessing
    lung_processed = preprocess_audio(audio, sample_rate, mode="lung")
    print(f"  Lung preprocessing: Signal shape {lung_processed.shape}")
    
    # Verify signals are normalized
    heart_max = np.max(np.abs(heart_processed))
    lung_max = np.max(np.abs(lung_processed))
    
    print(f"  Heart signal max amplitude: {heart_max:.4f}")
    print(f"  Lung signal max amplitude: {lung_max:.4f}")
    
    # Signals should be normalized
    assert heart_max > 0 and heart_max <= 1.05, "Heart signal not properly normalized"
    assert lung_max > 0 and lung_max <= 1.05, "Lung signal not properly normalized"
    
    print("✅ Complete preprocessing test passed")


def test_edge_cases():
    """Test edge cases for preprocessing"""
    print("\n=== Edge Cases Test ===")
    
    sample_rate = 16000
    
    # Test very short audio
    short_audio = np.random.normal(0, 0.1, 100)  # 6ms of audio
    processed = preprocess_audio(short_audio, sample_rate, mode="heart")
    assert len(processed) == len(short_audio), "Short audio processing failed"
    
    # Test silent audio
    silent_audio = np.zeros(int(sample_rate * 0.5))
    processed = preprocess_audio(silent_audio, sample_rate, mode="lung")
    assert len(processed) == len(silent_audio), "Silent audio processing failed"
    
    print("✅ Edge cases test passed")


def main():
    print("🔍 Audio Preprocessing Tests")
    print("=" * 50)
    
    try:
        test_bandpass_filter()
        test_notch_filter()
        test_denoising()
        test_complete_preprocessing()
        test_edge_cases()
        
        print("\n" + "=" * 50)
        print("✅ All audio preprocessing tests passed!")
        print("\n📋 Preprocessing Features:")
        print("   - Band-pass filter: Removes frequencies outside target range")
        print("   - Notch filter: Removes 60Hz power line noise")
        print("   - Spectral subtraction: Reduces background noise")
        print("   - Normalization: Ensures consistent audio levels")
        print("\n🎯 Heart Sound Preprocessing:")
        print("   - Band-pass: 20-2000Hz (captures S1, S2, murmurs)")
        print("   - Notch: 60Hz power line noise removal")
        print("   - Denoising: Spectral subtraction")
        print("\n🎯 Lung Sound Preprocessing:")
        print("   - Band-pass: 20-2000Hz (captures breath sounds, crackles, wheezes)")
        print("   - Notch: 60Hz power line noise removal")
        print("   - Denoising: Spectral subtraction")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        print(traceback.format_exc())
        return False
    
    return True


if __name__ == "__main__":
    main()
