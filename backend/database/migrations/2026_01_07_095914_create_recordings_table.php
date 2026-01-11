<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('recordings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->onDelete('cascade');

            $table->string('recording_name')->nullable(); // optional UI name
            $table->string('label')->default('Normal');   // display label/status

            $table->string('status')->default('Recording');
            $table->dateTime('started_at')->nullable();
            $table->dateTime('ended_at')->nullable();
            $table->integer('duration_seconds')->nullable();

            // simulated outputs (later replaced by AI)
            $table->integer('heart_rate')->nullable();
            $table->integer('breathing_rate')->nullable();
            $table->boolean('murmur_detected')->default(false);
            $table->boolean('crackles_detected')->default(false);
            $table->boolean('wheezes_detected')->default(false);
            $table->decimal('confidence', 5, 3)->default(0.950);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recordings');
    }
};
