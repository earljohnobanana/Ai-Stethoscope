<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recording;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RecordingController extends Controller
{
    public function start(Request $request)
    {
        $data = $request->validate([
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'mode' => ['required', 'in:heart,lung'],
        ]);

        $patient = Patient::findOrFail($data['patient_id']);

        $rec = Recording::create([
            'patient_id' => $data['patient_id'],
            'mode' => $data['mode'], // 'heart' or 'lung'
            'status' => 'Recording',
            'started_at' => Carbon::now(),
        ]);

        return response()->json([
            'session_id' => $rec->id,
            'status'     => $rec->status,
            'started_at' => $rec->started_at,
        ], 201);
    }

    public function stop(Request $request)
    {
        $data = $request->validate([
            'session_id' => ['required', 'integer', 'exists:recordings,id'],
            'heart_rate' => ['nullable', 'integer'],
            'breathing_rate' => ['nullable', 'integer'],
            'murmur_detected' => ['nullable', 'boolean'],
            'crackles_detected' => ['nullable', 'boolean'],
            'wheezes_detected' => ['nullable', 'boolean'],
            'confidence' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'label' => ['nullable', 'string'],
            'summary' => ['nullable', 'string'],
        ]);

        $rec = Recording::findOrFail($data['session_id']);

        if ($rec->ended_at) {
            return response()->json([
                'session_id' => $rec->id,
                'status'     => $rec->status,
                'message'    => 'Already stopped',
                'ended_at'   => $rec->ended_at,
            ], 200);
        }

        $ended   = Carbon::now();
        $started = $rec->started_at ?? $ended;
        $duration = max(1, $ended->diffInSeconds($started));

        // Use provided values or fallback to simulated results
        $heart = $data['heart_rate'] ?? rand(60, 160);
        $breath = $data['breathing_rate'] ?? rand(12, 28);
        $murmur = $data['murmur_detected'] ?? (rand(1, 10) <= 2);
        $crackles = $data['crackles_detected'] ?? (rand(1, 10) <= 2);
        $wheezes = $data['wheezes_detected'] ?? (rand(1, 10) <= 2);
        $confidence = $data['confidence'] ?? round(rand(900, 990) / 1000, 3);
        $label = $data['label'] ?? (($murmur || $crackles || $wheezes) ? 'Warning' : 'Normal');

        $rec->update([
            'status'           => 'Completed',
            'ended_at'         => $ended,
            'duration_seconds' => $duration,
            'heart_rate'       => $heart,
            'breathing_rate'   => $breath,
            'murmur_detected'  => $murmur,
            'crackles_detected'=> $crackles,
            'wheezes_detected' => $wheezes,
            'confidence'       => $confidence,
            'label'            => $label,
            'summary'          => $data['summary'] ?? null,
        ]);

        return response()->json([
            'session_id'       => $rec->id,
            'status'           => $rec->status,
            'label'            => $rec->label,
            'duration_seconds' => $rec->duration_seconds,
            'confidence'       => $rec->confidence,
            'heart_rate'       => $rec->heart_rate,
            'breathing_rate'   => $rec->breathing_rate,
        ], 200);
    }

    public function save($id, Request $request)
{
    $request->validate([
        'recording_name' => 'required|string|max:255',
    ]);

    $rec = Recording::findOrFail($id);
    $rec->recording_name = $request->recording_name;
    $rec->save();

    return response()->json(['ok' => true, 'recording' => $rec]);
}
}
