@echo off
REM AI Stethoscope - Start All Services
REM This batch file starts the AI Service, Backend, and Frontend in separate windows

echo ========================================
echo   AI Stethoscope - Starting All Services
echo ========================================
echo.

REM Check if we're in the correct directory
if not exist "ai_service" (
    echo ERROR: ai_service directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "backend" (
    echo ERROR: backend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Starting services in separate windows...
echo.

REM Start AI Service (Port 8001)
echo [1/3] Starting AI Service on port 8001...
start "AI Service (Port 8001)" cmd /k "cd ai_service && echo AI Service Starting... && python app.py"

timeout /t 2 /nobreak >nul

REM Start Backend (Port 8000)
echo [2/3] Starting Backend API on port 8000...
start "Backend API (Port 8000)" cmd /k "cd backend && echo Backend API Starting... && php artisan serve"

timeout /t 2 /nobreak >nul

REM Start Frontend (Port 5173)
echo [3/3] Starting Frontend on port 5173...
start "Frontend (Port 5173)" cmd /k "cd frontend && echo Frontend Starting... && npm run preview -- --port 5173"

echo.
echo ========================================
echo   All services are starting!
echo ========================================
echo.
echo Service URLs:
echo   - AI Service:  http://127.0.0.1:8001
echo   - Backend API: http://127.0.0.1:8000
echo   - Frontend:    http://127.0.0.1:5173
echo.
echo Health Checks:
echo   - AI Service:  http://127.0.0.1:8001/health
echo.
echo Wait 10-15 seconds for all services to fully start,
echo then open your browser to: http://127.0.0.1:5173
echo.
pause
