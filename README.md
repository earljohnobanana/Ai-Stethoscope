# AI Stethoscope System

An AI-powered stethoscope system designed to assist in heart and lung sound analysis.  
This project is developed as part of a Computer Engineering thesis.

---

## 📌 Project Overview

The AI Stethoscope system captures heart and lung sounds, processes them using machine learning models (TensorFlow Lite), and displays comprehensive analysis results through a user-friendly interface. The system provides real-time AI inference with dynamic predictions, heart rate estimation, respiratory rate calculation, and detailed medical recommendations.

The system is composed of three integrated services:
- **Frontend** (React + TypeScript + Vite) - User interface with real-time audio recording and analysis display
- **Backend** (Laravel PHP) - RESTful API for data persistence and AI service integration
- **AI Service** (FastAPI + TensorFlow Lite) - Real-time inference engine for heart and lung sound analysis

---

## 📂 Project Structure

```
AI-Stethoscope/
├── frontend/              # React/Vite frontend application
│   ├── src/
│   │   ├── ui/           # UI components (Heart, Lung, Session)
│   │   ├── services/     # API services and audio recording
│   │   ├── screens/      # Main application screens
│   │   └── navigation/   # Routing logic
│   └── .env              # Frontend configuration
├── backend/              # Laravel backend API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API controllers
│   │   ├── Services/              # AI service integration
│   │   └── Models/                # Database models
│   ├── routes/api.php    # API routes
│   └── .env              # Backend configuration
├── ai_service/           # FastAPI AI inference service
│   ├── models/           # TensorFlow Lite models
│   │   ├── heart_model.tflite
│   │   └── lung_model.tflite
│   ├── runtime/          # TFLite runner and postprocessing
│   └── app.py            # FastAPI application
├── start_all_services.ps1   # PowerShell startup script
├── start_all_services.bat   # Batch startup script
├── START_ALL_SERVICES.md    # Comprehensive startup guide
└── README.md
```

---

## 🧠 Features

### Core Functionality
- ✅ **Real-time Heart Sound Analysis** - Murmur detection with confidence scoring
- ✅ **Real-time Lung Sound Analysis** - Crackles and wheezes detection
- ✅ **Heart Rate Estimation** - BPM calculation from audio signals
- ✅ **Respiratory Rate Estimation** - Breaths per minute calculation
- ✅ **Dynamic AI Predictions** - Model-driven results (not hardcoded)
- ✅ **Comprehensive Medical Summaries** - Detailed analysis with clinical context

### User Interface
- ✅ **Two Independent Analysis Modes:**
  - **Start Analysis** - Records from microphone (up to 20 seconds)
  - **Test WAV** - Upload WAV files for immediate analysis
- ✅ **Session History** - Save and review past recordings
- ✅ **Patient Management** - Track patient information
- ✅ **Responsive LCD-style Design** - Modern, intuitive interface

### Technical Features
- ✅ **Full System Integration** - Frontend ↔ Backend ↔ AI Service
- ✅ **RESTful API Architecture** - Clean separation of concerns
- ✅ **Real-time Audio Processing** - Browser-based microphone recording
- ✅ **TensorFlow Lite Inference** - Optimized for performance
- ✅ **Automatic Audio Preprocessing** - Mel-spectrogram feature extraction
- ✅ **Error Handling & Resilience** - Graceful degradation on failures

---

## 🛠 Technologies Used

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Web Audio API** - Microphone recording and WAV generation

### Backend
- **Laravel 11** - PHP framework
- **MySQL** - Database for persistence
- **Guzzle HTTP** - AI service communication

### AI Service
- **FastAPI** - High-performance Python web framework
- **TensorFlow Lite** - Optimized ML inference
- **Librosa** - Audio signal processing
- **NumPy** - Numerical computations
- **Uvicorn** - ASGI server

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ with virtual environment
- PHP 8.1+ with Composer
- Node.js 16+ with npm
- MySQL database (optional, for persistence)

### Option 1: Automated Startup (Recommended)

**Windows PowerShell:**
```powershell
.\start_all_services.ps1
```

**Windows Command Prompt:**
```cmd
start_all_services.bat
```

### Option 2: Manual Startup

Open 3 separate terminals:

**Terminal 1 - AI Service (Port 8001):**
```bash
cd ai_service
python app.py
```

**Terminal 2 - Backend (Port 8000):**
```bash
cd backend
php artisan serve
```

**Terminal 3 - Frontend (Port 5173):**
```bash
cd frontend
npm run preview -- --port 5173
```

### Access the Application

Open your browser to: **http://127.0.0.1:5173**

---

## 📖 Detailed Documentation

For comprehensive setup instructions, troubleshooting, and configuration details, see:
- **[START_ALL_SERVICES.md](START_ALL_SERVICES.md)** - Complete startup guide

---

## ✅ System Verification

### Health Checks
- **AI Service:** http://127.0.0.1:8001/health
- **Backend:** http://127.0.0.1:8000
- **Frontend:** http://127.0.0.1:5173

### Test Scripts
```bash
# Test AI service directly
python test_ai_direct.py

# Test backend integration
python test_backend_api.py

# Create test WAV file
python create_test_wav.py
```

---

## 🔬 AI Model Details

### Heart Model
- **Input:** Mel-spectrogram (64 x 256 x 1)
- **Output:** Murmur probability (sigmoid)
- **Features:** Heart rate (BPM) estimation
- **Threshold:** 0.30 for murmur detection

### Lung Model
- **Input:** Mel-spectrogram (64 x 192 x 1)
- **Output:** Crackle probability (sigmoid)
- **Features:** Respiratory rate estimation
- **Threshold:** 0.30 for abnormality detection

Both models use:
- Sample rate: 16kHz
- FFT size: 1024
- Hop length: 512
- Dynamic audio preprocessing

---

## 📊 Performance Metrics

- **AI Inference Time:** 0.5-6 seconds
- **Heart Analysis:** 0.5-2 seconds (typical)
- **Lung Analysis:** 0.02-1 seconds (typical)
- **Audio Processing Limit:** 10 seconds
- **File Upload Limit:** 2MB

---

## 🔒 Important Disclaimers

⚠️ **This is a screening tool only and does NOT provide medical diagnoses.**

- All analysis results include comprehensive medical disclaimers
- Users are advised to consult healthcare professionals for proper evaluation
- Emergency symptoms require immediate medical attention
- The system is designed for educational and research purposes

---

## 📖 Configuration

### Backend Configuration (`backend/.env`)
```env
AI_SERVICE_URL=http://127.0.0.1:8001
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=stethoscope
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### AI Service Configuration
- Port: 8001 (configurable in `ai_service/app.py`)
- Models: Located in `ai_service/models/`

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find process using port
netstat -ano | findstr :8001
# Kill process
taskkill /PID <PID> /F
```

**AI Service Connection Failed:**
- Verify AI service is running: http://127.0.0.1:8001/health
- Check `backend/.env` has correct `AI_SERVICE_URL`

**Microphone Not Working:**
- Grant browser microphone permissions
- Use HTTPS or localhost (required for getUserMedia)
- Try "Test WAV" feature as alternative

For more troubleshooting, see [START_ALL_SERVICES.md](START_ALL_SERVICES.md)

---

## 📝 Recent Improvements

### System Integration (February 2026)
- ✅ Fixed backend AI service URL configuration
- ✅ Verified all three services communicate correctly
- ✅ Confirmed Test WAV and Start Analysis work independently
- ✅ Validated AI predictions are dynamic and model-driven

### Enhanced Analysis Summaries
- ✅ Comprehensive medical context for all findings
- ✅ Detailed clinical significance explanations
- ✅ Actionable recommendations based on results
- ✅ Emergency warning signs and symptoms
- ✅ Lifestyle and preventive care advice
- ✅ Proper medical disclaimers

### Developer Experience
- ✅ Created automated startup scripts (PowerShell & Batch)
- ✅ Added comprehensive documentation
- ✅ Included test scripts for verification
- ✅ Improved error handling and logging

👨‍💻 Author

Earl John O.
Computer Engineering Thesis Project

📄 License

This project is for academic and research purposes.


---

## What to do next
1️⃣ Save this as `README.md` in the **root of the repo**  
2️⃣ Commit and push:
```powershell
git add README.md
git commit -m "Add project README"
git push
