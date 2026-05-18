<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // profile photos and logos can now hold Base64 data URLs
        Schema::table('users', function (Blueprint $table) {
            $table->text('profile_photo')->nullable()->change();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->text('logo')->nullable()->change();
        });

        Schema::table('students', function (Blueprint $table) {
            $table->text('student_card_image')->nullable()->change();
        });

        Schema::table('company_employees', function (Blueprint $table) {
            $table->text('work_card_image')->nullable()->change();
        });

        Schema::table('student_schools', function (Blueprint $table) {
            $table->text('student_card_image')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_photo')->nullable()->change();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->string('logo')->nullable()->change();
        });

        Schema::table('students', function (Blueprint $table) {
            $table->string('student_card_image')->nullable()->change();
        });

        Schema::table('company_employees', function (Blueprint $table) {
            $table->string('work_card_image')->nullable()->change();
        });

        Schema::table('student_schools', function (Blueprint $table) {
            $table->string('student_card_image')->nullable()->change();
        });
    }
};
