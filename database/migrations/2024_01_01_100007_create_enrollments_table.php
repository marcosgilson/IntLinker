<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            // waiting = en espera (negro), accepted = candidato aceptado (verde), cancelled = eliminado/cancelado (rojo)
            $table->enum('status', ['waiting', 'accepted', 'cancelled'])->default('waiting');
            // who cancelled: student | company (only set when status = cancelled)
            $table->enum('cancelled_by', ['student', 'company'])->nullable();
            $table->timestamps();

            // One record per student-company pair (ever), prevents re-application after cancellation
            $table->unique(['student_id', 'company_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
