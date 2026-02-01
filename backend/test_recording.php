<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Foundation\Application;
use App\Models\Recording;
use Carbon\Carbon;

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $recording = Recording::create([
        'patient_id' => 2,
        'mode' => 'lung',
        'status' => 'Completed',
        'started_at' => Carbon::now(),
        'ended_at' => Carbon::now()->addSeconds(30),
        'duration_seconds' => 30,
        'breathing_rate' => 18,
        'crackles_detected' => false,
        'wheezes_detected' => false,
        'confidence' => 0.85,
        'label' => 'Normal',
        'summary' => 'Lung analysis completed. No crackles or wheezes detected. Respiratory rate is within normal range (12-20 BrPM).',
    ]);

    echo "Recording created successfully!\n";
    var_dump($recording->toArray());
} catch (Exception $e) {
    echo "Error creating recording: " . $e->getMessage() . "\n";
    var_dump($e->getTraceAsString());
}
