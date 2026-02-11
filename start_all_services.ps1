# AI Stethoscope - Start All Services
# This script starts the AI Service, Backend, and Frontend in separate windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Stethoscope - Starting All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "ai_service") -or -not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "ERROR: Please run this script from the project root directory!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Starting services in separate windows..." -ForegroundColor Green
Write-Host ""

# Start AI Service (Port 8001)
Write-Host "[1/3] Starting AI Service on port 8001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\ai_service'; Write-Host 'AI Service Starting...' -ForegroundColor Cyan; python app.py"

Start-Sleep -Seconds 2

# Start Backend (Port 8000)
Write-Host "[2/3] Starting Backend API on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend API Starting...' -ForegroundColor Cyan; php artisan serve"

Start-Sleep -Seconds 2

# Start Frontend (Port 5173)
Write-Host "[3/3] Starting Frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Starting...' -ForegroundColor Cyan; npm run preview -- --port 5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All services are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  - AI Service:  http://127.0.0.1:8001" -ForegroundColor White
Write-Host "  - Backend API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  - Frontend:    http://127.0.0.1:5173" -ForegroundColor White
Write-Host ""
Write-Host "Health Checks:" -ForegroundColor Cyan
Write-Host "  - AI Service:  http://127.0.0.1:8001/health" -ForegroundColor White
Write-Host ""
Write-Host "Wait 10-15 seconds for all services to fully start," -ForegroundColor Yellow
Write-Host "then open your browser to: http://127.0.0.1:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
pause
