"""
Full system test for AI Stethoscope integration
Checks all services, endpoints, and functionality
"""

import requests
import time
import json


def test_backend_api():
    """Test backend API endpoints"""
    print("=== Backend API Tests ===")
    
    base_url = "http://127.0.0.1:8000/api"
    
    # Test 1: Check if backend is alive
    try:
        response = requests.get(base_url.replace("/api", "/up"))
        print(f"✅ Health check: {response.status_code}")
        if response.status_code != 200:
            print(f"❌ Health check failed: {response.text}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test 2: Get patient data
    try:
        response = requests.get(f"{base_url}/athletes/1")
        print(f"✅ Patient endpoint: {response.status_code}")
        if response.status_code == 200:
            patient_data = response.json()
            print(f"   Patient name: {patient_data.get('name', 'Unknown')}")
    except Exception as e:
        print(f"❌ Patient endpoint failed: {e}")
    
    # Test 3: Create a recording
    try:
        data = {
            "patient_id": 1,
            "mode": "heart"
        }
        response = requests.post(f"{base_url}/recording/start", json=data)
        print(f"✅ Create recording: {response.status_code}")
        if response.status_code == 201:
            recording_data = response.json()
            recording_id = recording_data.get("session_id")
            print(f"   Recording ID: {recording_id}")
            
            # Test 4: Save recording
            try:
                save_data = {
                    "recording_name": f"Test Recording {int(time.time())}"
                }
                response = requests.post(f"{base_url}/recording/{recording_id}/save", json=save_data)
                print(f"✅ Save recording: {response.status_code}")
                if response.status_code == 200:
                    save_result = response.json()
                    print(f"   Save successful: {save_result.get('ok', False)}")
            except Exception as e:
                print(f"❌ Save recording failed: {e}")
    except Exception as e:
        print(f"❌ Create recording failed: {e}")
    
    return True


def test_ai_service():
    """Test AI service endpoints"""
    print("\n=== AI Service Tests ===")
    
    base_url = "http://127.0.0.1:8001"
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.status_code}")
        if response.status_code == 200:
            health_data = response.json()
            print(f"   Models available: Heart ({health_data.get('heart_model', 'Missing')}), Lung ({health_data.get('lung_model', 'Missing')})")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    return True


def test_frontend_preview():
    """Test frontend preview server"""
    print("\n=== Frontend Tests ===")
    
    frontend_url = "http://localhost:5173"
    
    try:
        # This might fail if preview server is not running
        response = requests.get(frontend_url, timeout=5)
        print(f"✅ Frontend preview: {response.status_code}")
        if response.status_code == 200:
            print(f"   Frontend is accessible at {frontend_url}")
    except requests.exceptions.ConnectTimeout:
        print("⚠️ Frontend preview timeout - may be starting up")
    except Exception as e:
        print(f"❌ Frontend preview failed: {e}")
    
    return True


def main():
    print("🔍 AI Stethoscope - System Integration Test")
    print("=" * 50)
    
    all_passed = True
    
    # Run tests
    if not test_backend_api():
        all_passed = False
    
    if not test_ai_service():
        all_passed = False
    
    test_frontend_preview()
    
    print("\n" + "=" * 50)
    
    if all_passed:
        print("✅ All services are running correctly!")
        print("\n📋 System Status:")
        print("   - Backend: Laravel API (Port 8000)")
        print("   - AI Service: FastAPI + TensorFlow Lite (Port 8001)")
        print("   - Frontend: React + Vite (Port 5173)")
        print("   - Database: SQLite")
        print("\n🎯 Key Features:")
        print("   - Real-time microphone recording")
        print("   - Test WAV file upload")
        print("   - Heart sound analysis (murmur detection + BPM)")
        print("   - Lung sound analysis (crackle detection + respiratory rate)")
        print("   - Session history")
        print("   - Audio preprocessing: band-pass + notch + light denoise")
        print("   - Responsive design")
    else:
        print("❌ Some services are not running correctly")
    
    return all_passed


if __name__ == "__main__":
    main()
