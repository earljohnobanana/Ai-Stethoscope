<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InferenceController extends Controller
{
    /**
     * POST /api/infer/{mode}
     * Body: multipart/form-data with key "file" (type File) = .wav
     */
    public function infer(string $mode, Request $request, AiService $ai)
    {
        $mode = strtolower(trim($mode));

        if (!in_array($mode, ['heart', 'lung'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => "Invalid mode: {$mode}. Use 'heart' or 'lung'.",
            ], 422);
        }

        // Validate upload
        $request->validate([
            'file' => ['required', 'file', 'mimes:wav', 'max:2048'], // Only accept .wav files up to 2MB
        ]);

        $uploaded = $request->file('file');

        // Ensure temp folder exists (storage/app/temp_audio)
        Storage::disk('local')->makeDirectory('temp_audio');

        // Store with unique filename to avoid collisions
        $filename = uniqid('rec_', true) . '_' . preg_replace('/\s+/', '_', $uploaded->getClientOriginalName());

        // Save on local disk (storage/app/temp_audio/...)
        $relativePath = $uploaded->storeAs('temp_audio', $filename, 'local');

        // Convert to absolute OS path (Windows-safe)
        $fullPath = Storage::disk('local')->path($relativePath);

        if (!file_exists($fullPath)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Stored audio file not found.',
                'path' => $fullPath,
            ], 500);
        }

        try {
            // Call FastAPI via AiService
            $result = $ai->infer($mode, $fullPath);

            // Cleanup temp file
            @unlink($fullPath);

            return response()->json($result);

        } catch (\Throwable $e) {
            // Cleanup temp file even if AI call fails
            @unlink($fullPath);

            return response()->json([
                'status' => 'error',
                'message' => 'AI inference failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
