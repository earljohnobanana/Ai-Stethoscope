# AI Stethoscope - Complete System Startup Guide

This guide will help you start all three services (Frontend, Backend, AI Service) for the AI Stethoscope application.

## Prerequisites

Before starting, ensure you have:
- Python 3.8+ with virtual environment activated
- PHP 8.1+ with Laravel dependencies installed
- Node.js 16+ with npm dependencies installed
- MySQL database running (if using database features)

## Quick Start - All Services

### Option 1: Manual Start (Recommended for Development)

Open **3 separate terminal windows** and run each command:

#### Terminal 1 - AI Service (Port 8001)
```bash
cd ai_service
python app.py
```

#### Terminal 2 - Backend API (Port 8000)
```bash
cd backend
php artisan serve
```

#### Terminal 3 - Frontend (Port 5173)
```bash
cd frontend
npm run preview -- --port 5173
```

### Option 2: Using PowerShell Script (Windows)

Run the provided PowerShell script:
```powershell
.\start_all_services.ps1
```

### Option 3: Using Batch File (Windows)

Run the provided batch file:
```cmd
start_all_services.bat
```

## Service Details

### 1. AI Service (FastAPI + TensorFlow Lite)
- **Port:** 8001
- **URL:** http://127.0.0.1:8001
- **Health Check:** http://127.0.0.1:8001/health
- **Endpoints:**
  - POST `/infer/heart` - Heart sound analysis
  - POST `/infer/lung` - Lung sound analysis

**Features:**
- Real-time AI inference using TensorFlow Lite models
- Dynamic predictions based on audio input
- Heart rate (BPM) estimation
- Respiratory rate estimation
- Confidence scoring for all predictions

### 2. Backend API (Laravel)
- **Port:** 8000
- **URL:** http://127.0.0.1:8000
- **API Base:** http://127.0.0.1:8000/api
- **Key Endpoints:**
  - POST `/api/infer/heart` - Proxy to AI service for heart analysis
  - POST `/api/infer/lung` - Proxy to AI service for lung analysis
  - GET/POST `/api/patients` - Patient management
  - GET/POST `/api/recordings` - Recording management
  - GET/POST `/api/sessions` - Session history

**Features:**
- RESTful API for frontend communication
- Database persistence for recordings and sessions
- AI service integration and error handling
- Patient data management

### 3. Frontend (React + Vite)
- **Port:** 5173
- **URL:** http://127.0.0.1:5173
- **Framework:** React with TypeScript

**Features:**
- Real-time audio recording from microphone
- WAV file upload for testing
- Live analysis results display
- Session history and management
- Responsive LCD-style UI design

## Testing the Integration

### 1. Test AI Service Directly
```bash
python test_ai_direct.py
```

This will:
- Create a test WAV file
- Send it to both heart and lung endpoints
- Display the AI analysis results

### 2. Test Backend API
```bash
python test_backend_api.py
```

This will:
- Test the backend's integration with the AI service
- Verify the complete request/response flow

### 3. Test Frontend Integration

1. Open browser to http://127.0.0.1:5173
2. Click "Heart Analysis" or "Lung Analysis"
3. Try both features:
   - **Start Analysis:** Records from microphone for up to 20 seconds
   - **Test WAV:** Upload a WAV file for immediate analysis

## Verification Checklist

✅ **AI Service Running:**
- Visit http://127.0.0.1:8001/health
- Should return: `{"status":"ok","heart_model":"heart_model.tflite","lung_model":"lung_model.tflite",...}`

✅ **Backend Running:**
- Visit http://127.0.0.1:8000
- Should show Laravel welcome page or API documentation

✅ **Frontend Running:**
- Visit http://127.0.0.1:5173
- Should show the AI Stethoscope dashboard

✅ **Full Integration:**
- Upload a test WAV file through the frontend
- Verify analysis results appear within seconds
- Check that results are dynamic (not hardcoded)

## Configuration Files

### AI Service Configuration
- **File:** `ai_service/app.py`
- **Port:** 8001 (configurable in main block)
- **Models:** 
  - `ai_service/models/heart_model.tflite`
  - `ai_service/models/lung_model.tflite`

### Backend Configuration
- **File:** `backend/.env`
- **Key Settings:**
  ```
  AI_SERVICE_URL=http://127.0.0.1:8001
  APP_URL=http://localhost:8000
  ```

### Frontend Configuration
- **File:** `frontend/.env`
- **Key Settings:**
  ```
  VITE_API_URL=http://127.0.0.1:8000/api
  ```

## Troubleshooting

### AI Service Issues

**Problem:** Port 8001 already in use
```bash
# Find and kill the process using port 8001
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

**Problem:** TensorFlow Lite model not found
- Ensure models exist in `ai_service/models/`
- Check file names: `heart_model.tflite` and `lung_model.tflite`

### Backend Issues

**Problem:** Port 8000 already in use
```bash
# Use a different port
php artisan serve --port=8080
# Update frontend/.env: VITE_API_URL=http://127.0.0.1:8080/api
```

**Problem:** AI service connection failed
- Verify AI service is running on port 8001
- Check `backend/.env` has correct `AI_SERVICE_URL`
- Test AI service health: http://127.0.0.1:8001/health

### Frontend Issues

**Problem:** Cannot connect to backend
- Verify backend is running on port 8000
- Check `frontend/.env` has correct `VITE_API_URL`
- Clear browser cache and reload

**Problem:** Microphone not working
- Grant microphone permissions in browser
- Use HTTPS or localhost (required for getUserMedia)
- Try the "Test WAV" feature instead

## Key Features Verification

### ✅ Test WAV Feature (Independent Process)
1. Click "Test WAV (Heart)" or "Test WAV (Lung)"
2. Select a WAV file
3. Analysis should complete immediately
4. Results display without additional user action

### ✅ Start Analysis Feature (Independent Process)
1. Click "Start Analysis"
2. Recording begins automatically
3. Timer shows elapsed time (max 20 seconds)
4. Click "Stop" or wait for auto-stop
5. Analysis runs automatically
6. Results display immediately

### ✅ Dynamic AI Predictions
- Each audio file produces unique results
- Confidence scores vary based on input
- Heart rate and respiratory rate are calculated from audio
- No hardcoded responses - all predictions are model-driven

### ✅ Comprehensive Analysis Summaries
- Detailed medical context for findings
- Classification of abnormalities
- Clinical significance explanations
- Actionable recommendations
- Emergency warning signs
- Lifestyle and preventive care advice

## Performance Notes

- **AI Inference Time:** 0.5-6 seconds depending on audio length
- **Heart Analysis:** Typically faster (0.5-2 seconds)
- **Lung Analysis:** Typically faster (0.02-1 seconds)
- **Audio Limit:** 10 seconds processed (longer files are truncated)
- **File Size Limit:** 2MB for WAV uploads

## Security Notes

- This is a **screening tool only**, not a medical diagnostic device
- All analysis includes medical disclaimers
- Patient data is stored locally in the database
- No data is sent to external services
- Audio files are temporarily stored and deleted after processing

## Support

For issues or questions:
1. Check the terminal logs for error messages
2. Verify all services are running on correct ports
3. Test each service independently before testing integration
4. Review configuration files for correct URLs and ports

## Development Tips

- Use `npm run dev` instead of `npm run preview` for frontend hot-reload during development
- Backend logs are in `backend/storage/logs/laravel.log`
- AI service logs appear in the terminal where it's running
- Use browser DevTools Network tab to debug API calls
