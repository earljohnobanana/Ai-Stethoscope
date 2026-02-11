import requests
import time
from pathlib import Path

def test_ai_service(file_path, mode='heart'):
    """
    Test the AI service directly with a WAV file
    
    Args:
        file_path: Path to the WAV file
        mode: 'heart' or 'lung'
    """
    if not Path(file_path).exists():
        print(f"Error: File {file_path} not found")
        return False
    
    url = f"http://127.0.0.1:8001/infer/{mode}"
    
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (Path(file_path).name, f, 'audio/wav')}
            
            print(f"Testing {mode} analysis for file: {file_path}")
            print(f"Calling endpoint: {url}")
            
            # Measure response time
            start_time = time.time()
            response = requests.post(url, files=files, timeout=300)
            end_time = time.time()
            
            print(f"Response time: {end_time - start_time:.2f} seconds")
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Analysis successful!")
                print(f"Result: {result}")
            else:
                print(f"❌ Error: {response.text}")
                
            return response.status_code == 200
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

# Test with your WAV file
if __name__ == "__main__":
    # Replace with your test WAV file path
    test_file = "test.wav"  # Make sure this file exists in the current directory
    
    if not Path(test_file).exists():
        print(f"Error: Test file {test_file} not found in current directory")
        print("Please place your test WAV file in the same directory as this script")
    else:
        # Test heart analysis
        success = test_ai_service(test_file, 'heart')
        if success:
            print("\n" + "-"*50 + "\n")
            # Test lung analysis (optional)
            test_ai_service(test_file, 'lung')
