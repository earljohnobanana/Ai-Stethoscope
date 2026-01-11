<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\RecordingController;
use App\Http\Controllers\Api\SessionController;

Route::post('/athletes', [PatientController::class, 'store']);

Route::post('/recording/start', [RecordingController::class, 'start']);
Route::post('/recording/stop',  [RecordingController::class, 'stop']);

Route::get('/dashboard/{patientId}', [SessionController::class, 'dashboard']);
Route::get('/history/{patientId}',   [SessionController::class, 'history']);
