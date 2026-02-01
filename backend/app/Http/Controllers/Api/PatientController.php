<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;

class PatientController extends Controller
{
    // POST /api/athletes
    public function store(Request $request)
    {
        // ✅ Only require name now
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $patient = Patient::create([
            'name' => $validated['name'] ?? 'Guest',
        ]);

        return response()->json([
            'id' => $patient->id,
            'patient' => $patient,
        ], 201);
    }

    // GET /api/athletes/{id}
    public function show($id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($patient);
    }

    // PUT /api/athletes/{id}
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'age' => ['nullable', 'integer', 'min:0', 'max:120'],
            'sex' => ['nullable', 'string', 'in:male,female'],
            'sport' => ['nullable', 'string', 'max:255'],
        ]);

        $patient->update($validated);

        return response()->json($patient);
    }
}
