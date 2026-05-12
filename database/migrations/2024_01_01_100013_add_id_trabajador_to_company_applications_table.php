<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('company_applications', function (Blueprint $table) {
            $table->text('id_trabajador')->nullable()->after('work_card_image');
        });
    }
    public function down(): void {
        Schema::table('company_applications', function (Blueprint $table) {
            $table->dropColumn('id_trabajador');
        });
    }
};
