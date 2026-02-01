<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\Response;

class AiService
{
    private string $baseUrl;

    public function __construct()
    {
        // backend/config/services.php must contain:
        // 'ai_service' => ['url' => env('AI_SERVICE_URL', 'http://127.0.0.1:8001')],
        $this->baseUrl = rtrim((string) config('services.ai_service.url'), '/');

        if ($this->baseUrl === '') {
            throw new \RuntimeException(
                'AI service URL is not configured. Set AI_SERVICE_URL in backend/.env'
            );
        }
    }

    /**
     * Analyze an audio file by mode.
     *
     * Your FastAPI endpoints are:
     *  - POST {baseUrl}/infer/heart  (multipart field name: "file")
     *  - POST {baseUrl}/infer/lung   (multipart field name: "file")
     *
     * @param string $mode     'heart' or 'lung'
     * @param string $audioPath full path to wav
     * @return array decoded JSON response from AI service
     */
    public function infer(string $mode, string $audioPath): array
    {
        $mode = strtolower(trim($mode));

        if (!in_array($mode, ['heart', 'lung'], true)) {
            throw new \InvalidArgumentException("Invalid mode: {$mode}. Expected 'heart' or 'lung'.");
        }

        if (!is_file($audioPath)) {
            throw new \RuntimeException("Audio file not found: {$audioPath}");
        }

        $endpoint = "{$this->baseUrl}/infer/{$mode}";

        try {
            /** @var Response $response */
            $response = Http::timeout(90)
                ->asMultipart()
                ->attach(
                    // IMPORTANT: FastAPI expects UploadFile param named "file"
                    'file',
                    file_get_contents($audioPath),
                    basename($audioPath)
                )
                ->post($endpoint);

            if (!$response->successful()) {
                Log::error('AI Service HTTP error', [
                    'endpoint' => $endpoint,
                    'mode' => $mode,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \RuntimeException("AI service error (HTTP {$response->status()}).");
            }

            $json = $response->json();

            if (!is_array($json)) {
                Log::error('AI Service returned invalid JSON', [
                    'endpoint' => $endpoint,
                    'mode' => $mode,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \RuntimeException('AI service returned invalid JSON.');
            }

            // Normalize output for frontend consistency (optional but recommended)
            // Your AI returns ai_confidence_pct already.
            $json['mode'] = $json['mode'] ?? $mode;

            return $json;

        } catch (\Throwable $e) {
            Log::error('AI Service call failed', [
                'endpoint' => $endpoint,
                'mode' => $mode,
                'audioPath' => $audioPath,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Optional: Add a /health endpoint in FastAPI, then use this.
     */
    public function health(): bool
    {
        try {
            /** @var Response $response */
            $response = Http::timeout(5)->get("{$this->baseUrl}/health");
            return $response->successful();
        } catch (\Throwable $e) {
            return false;
        }
    }
}
