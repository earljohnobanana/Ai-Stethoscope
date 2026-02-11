import requests
import time

def test_heart_analysis():
    # Test audio file (you can replace this with your actual test file)
    test_file = "test.wav"
    
    # AI service endpoint
    url = "http://127.0.0.1:8001/infer/heart"
    
    try:
        with open(test_file, 'rb') as f:
            files = {'file': (test_file, f, 'audio/wav')}
            
            # Measure response time
            start_time = time.time()
            response = requests.post(url, files=files)
            end_time = time.time()
            
            print(f"Response time: {end_time - start_time:.2f} seconds")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            return response
    
    except Exception as e:
        print(f"Error: {e}")
        return None

# Test the AI service
if __name__ == "__main__":
    print("Testing AI service...")
    response = test_heart_analysis()