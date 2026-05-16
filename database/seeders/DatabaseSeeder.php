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
        // ── Admin account ─────────────────────────────────────────────────
        $admin = User::create([
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

        // ── Attach admin to Siemens Mobility ──────────────────────────────
        $siemens = Company::where('name', 'Siemens Mobility')->first();
        if ($siemens) {
            $siemens->employees()->attach($admin->id);
        }
    }
}
