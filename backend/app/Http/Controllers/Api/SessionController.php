<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recording;

class SessionController extends Controller
{
    public function history($patientId)
    {
        $rows = Recording::where('patient_id', $patientId)
            ->orderByDesc('created_at')
            ->get([
                'id',
                'patient_id',
                'mode',
                'recording_name',
                'status',
                'started_at',
                'ended_at',
                'duration_seconds',
                'heart_rate',
                'breathing_rate',
                'murmur_detected',
                'crackles_detected',
                'wheezes_detected',
                'confidence',
                'label',
                'summary',
                'created_at',
            ]);

        return response()->json($rows);
    }

    public function show($sessionId)
    {
        $rec = Recording::findOrFail($sessionId);

        return response()->json($rec);
    }

    public function dashboard($patientId)
    {
        // simple dashboard sample (optional)
        $latest = Recording::where('patient_id', $patientId)
            ->orderByDesc('created_at')
            ->first();

        return response()->json([
            'latest' => $latest,
        ]);
    }
}
