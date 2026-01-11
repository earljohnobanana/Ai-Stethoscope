<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
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
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'murmur_detected' => 'boolean',
        'crackles_detected' => 'boolean',
        'wheezes_detected' => 'boolean',
        'confidence' => 'float',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
