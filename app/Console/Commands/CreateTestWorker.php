<?php
namespace App\Console\Commands;

use App\Models\Company;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateTestWorker extends Command
{
    protected $signature = 'dev:create-test-worker';
    protected $description = 'Crea usuario trabajador de prueba verificado en Prosegur';

    public function handle(): void
    {
        $company = Company::whereRaw('LOWER(name) LIKE ?', ['%prosegur%'])->first();

        if (! $company) {
            $this->error('No se encontro ninguna empresa con nombre Prosegur.');
            return;
        }

        $user = User::updateOrCreate(
            ['email' => 'trabajador@trabajador.com'],
            [
                'name'              => 'Trabajador Test',
                'password'          => Hash::make('trabajador'),
                'email_verified_at' => now(),
            ]
        );

        DB::table('company_employees')->updateOrInsert(
            ['user_id' => $user->id, 'company_id' => $company->id],
            ['verified' => true, 'updated_at' => now(), 'created_at' => now()]
        );

        $this->info('Usuario creado: ' . $user->email . ' (ID ' . $user->id . ')');
        $this->info('Vinculado en: ' . $company->name . ' (ID ' . $company->id . ')');
    }
}