import requests

print("Testing backend API accessibility...")

# Test 1: Check if backend server is running
try:
    response = requests.get("http://localhost:8000/api/athletes/1")
    print(f"\n[Test 1] Athletes endpoint status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"\n[Test 1] Error: {type(e).__name__}: {e}")

# Test 2: Check if AI service endpoint is accessible
try:
    response = requests.get("http://localhost:8001/health")
    print(f"\n[Test 2] AI service health endpoint status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"\n[Test 2] Error: {type(e).__name__}: {e}")

# Test 3: Try to start a recording (create a new session)
try:
    data = {
        "patient_id": 1,
        "mode": "heart"
    }
    response = requests.post("http://localhost:8000/api/recording/start", json=data)
    print(f"\n[Test 3] Start recording endpoint status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"\n[Test 3] Error: {type(e).__name__}: {e}")

# Test 4: Check recording save endpoint
try:
    response = requests.post("http://localhost:8000/api/recording/1/save", json={"recording_name": "Test Recording"})
    print(f"\n[Test 4] Save recording endpoint status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"\n[Test 4] Error: {type(e).__name__}: {e}")

print("\n--- Test completed ---")
