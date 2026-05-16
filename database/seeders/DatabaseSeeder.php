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
        // ── Admin principal (vinculado a todas las empresas, oculto en ellas) ──
        $admin = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@admin.com',
            'password' => bcrypt('admin'),
            'is_admin' => true,
        ]);

        // ── Admin legacy ──────────────────────────────────────────────────
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@intlinker.test',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        // ── Test user (normal) ────────────────────────────────────────────
        User::create([
            'name'     => 'Test User',
            'email'    => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // ── Test schools ──────────────────────────────────────────────────
        School::insert([
            ['name' => 'Universidad Politécnica de Madrid', 'country' => 'España', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Universidad Complutense de Madrid', 'country' => 'España', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'MIT',                               'country' => 'USA',    'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── Seed companies ────────────────────────────────────────────────
        $this->call(CompanySeeder::class);

        // ── Vincular admin a TODAS las empresas (aparece oculto por is_admin) ──
        $allCompanyIds = Company::pluck('id');
        $admin->companies()->attach($allCompanyIds);
    }
}
