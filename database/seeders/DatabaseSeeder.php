<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ── Admin principal ──────────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'              => 'Admin',
                'password'          => bcrypt('admin'),
                'is_admin'          => true,
                'email_verified_at' => now(),
            ]
        );

        // ── Test user ────────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name'     => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // ── Test schools ─────────────────────────────────────────────────────
        $schools = [
            ['name' => 'Universidad Politécnica de Madrid', 'country' => 'España'],
            ['name' => 'Universidad Complutense de Madrid', 'country' => 'España'],
            ['name' => 'MIT',                               'country' => 'USA'],
        ];
        foreach ($schools as $school) {
            School::firstOrCreate(['name' => $school['name']], $school);
        }

        // ── Seed companies ───────────────────────────────────────────────────
        $this->call(CompanySeeder::class);

        // ── Vincular admin a TODAS las empresas ──────────────────────────────
        $allCompanyIds = Company::pluck('id');
        $admin->companies()->syncWithoutDetaching($allCompanyIds);
    }
}
