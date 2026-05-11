<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_schools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('student_card_image');
            $table->boolean('verified')->default(false);
            $table->timestamps();

            $table->unique(['student_id', 'school_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_schools');
    }
};
