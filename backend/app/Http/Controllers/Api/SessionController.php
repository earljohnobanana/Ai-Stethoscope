<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Recording;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function dashboard($patientId)
    {
        $patient = Patient::find($patientId);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        // Latest recording (if any)
        $latest = Recording::where('patient_id', $patientId)
            ->orderByDesc('id')
            ->first();

        return response()->json([
            'athlete' => $patient->name,
            'heart_rate' => $latest?->heart_rate ?? 0,
            'breathing_rate' => $latest?->breathing_rate ?? 0,
            'status' => $latest?->status ?? 'Idle',
            'confidence' => (float) ($latest?->confidence ?? 0),
            'last_updated' => $latest?->updated_at ?? now(),
        ]);
    }

    public function history($patientId)
    {
        $patient = Patient::find($patientId);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $rows = Recording::where('patient_id', $patientId)
            ->orderByDesc('started_at')
            ->limit(50)
            ->get();

        return response()->json([
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->name,
                'age' => $patient->age,
                'sport' => $patient->sport,
            ],
            'history' => $rows,
        ]);
    }
}
