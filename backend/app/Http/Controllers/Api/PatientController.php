<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'age'   => ['required', 'integer', 'min:1', 'max:120'],
            'sport' => ['required', 'string', 'max:255'],
        ]);

        $patient = Patient::create([
            'name'  => $data['name'],
            'age'   => $data['age'],
            'sport' => $data['sport'],
        ]);

        return response()->json([
            'id' => $patient->id,
            'name' => $patient->name,
            'age' => $patient->age,
            'sport' => $patient->sport,
        ], 201);
    }
}
