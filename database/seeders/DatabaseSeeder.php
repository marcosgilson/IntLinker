<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ── Admin account ─────────────────────────────────────────────────
        $admin = User::factory()->create([
            'name'     => 'Admin',
            'email'    => 'admin@intlinker.test',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        // ── Test user (normal) ────────────────────────────────────────────
        $user = User::factory()->create([
            'name'  => 'Test User',
            'email' => 'test@example.com',
        ]);

        // ── Test schools ──────────────────────────────────────────────────
        School::insert([
            ['name' => 'Universidad Politécnica de Madrid', 'country' => 'España', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Universidad Complutense de Madrid', 'country' => 'España', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'MIT',                               'country' => 'USA',    'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── Test company ──────────────────────────────────────────────────
        $company = Company::create([
            'name'              => 'Siemens Mobility',
            'description'       => 'Empresa líder en movilidad y transporte.',
            'applications_email' => 'jobs@siemens.test',
        ]);

        $company->employees()->attach($admin->id);
    }
}

