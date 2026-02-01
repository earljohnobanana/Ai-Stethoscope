<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\RecordingController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\InferenceController;

// AI inference (already ok)
Route::post('/infer/{mode}', [InferenceController::class, 'infer']);

// Athletes (patients)
Route::post('/athletes', [PatientController::class, 'store']);
Route::get('/athletes/{id}', [PatientController::class, 'show']);
Route::put('/athletes/{id}', [PatientController::class, 'update']);

// Recording
Route::post('/recording/start', [RecordingController::class, 'start']);
Route::post('/recording/stop',  [RecordingController::class, 'stop']);
Route::post('/recording/{id}/save', [RecordingController::class, 'save']);

// Sessions
Route::get('/dashboard/{patientId}', [SessionController::class, 'dashboard']);
Route::get('/history/{patientId}',   [SessionController::class, 'history']);
Route::get('/sessions/{id}', [SessionController::class, 'show']);
