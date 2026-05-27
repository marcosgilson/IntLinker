<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('school_name')->nullable();
            $table->string('school_email')->nullable();
            $table->text('id_alumno')->nullable();
            $table->string('docupipe_document_id')->nullable();
            $table->string('docupipe_job_id')->nullable();
            $table->string('docupipe_standardization_id')->nullable();
            $table->string('docupipe_status')->nullable();
            $table->text('docupipe_failure_reason')->nullable();
            $table->text('student_card_image')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
