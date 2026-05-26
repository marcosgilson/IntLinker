<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint \) {
            \->json('portfolio')->nullable()->after('applications_email');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint \) {
            \->dropColumn('portfolio');
        });
    }
};
