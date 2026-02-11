import wave
import struct
import random
import time

def create_test_wav(file_name, duration=2, sample_rate=16000, frequency=440):
    """
    Create a simple test WAV file
    
    Args:
        file_name: Output file name
        duration: Duration in seconds
        sample_rate: Sample rate
        frequency: Frequency in Hz
    """
    with wave.open(file_name, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        
        num_samples = int(duration * sample_rate)
        
        for i in range(num_samples):
            # Generate a simple sine wave
            value = int(32767 * (0.3 * random.random() + 0.2) * 
                      (1 + 0.5 * random.random() * 
                      (i / (duration * sample_rate))))
            data = struct.pack('<h', value)
            wav_file.writeframes(data)
            
    print(f"Created test WAV file: {file_name}")
    print(f"Duration: {duration} seconds")
    print(f"Sample rate: {sample_rate} Hz")

if __name__ == "__main__":
    # Create a 2-second test WAV file
    create_test_wav("test.wav", duration=2, sample_rate=16000)
