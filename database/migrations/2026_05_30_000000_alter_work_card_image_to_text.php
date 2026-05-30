<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Change column type to text to allow large base64 blobs
        DB::statement("ALTER TABLE company_applications ALTER COLUMN work_card_image TYPE text");
    }

    public function down(): void
    {
        // Revert to varchar(255)
        DB::statement("ALTER TABLE company_applications ALTER COLUMN work_card_image TYPE character varying(255)");
    }
};
