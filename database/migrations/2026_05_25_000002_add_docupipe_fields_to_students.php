<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('docupipe_document_id')->nullable()->after('id_alumno');
            $table->string('docupipe_job_id')->nullable()->after('docupipe_document_id');
            $table->string('docupipe_standardization_id')->nullable()->after('docupipe_job_id');
            $table->string('docupipe_status')->nullable()->after('docupipe_standardization_id');
            $table->text('docupipe_failure_reason')->nullable()->after('docupipe_status');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'docupipe_document_id',
                'docupipe_job_id',
                'docupipe_standardization_id',
                'docupipe_status',
                'docupipe_failure_reason',
            ]);
        });
    }
};