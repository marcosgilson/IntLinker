<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMail extends Command
{
    protected $signature = 'mail:test {email}';
    protected $description = 'Send a test email';

    public function handle()
    {
        Mail::raw('Test desde IntLinker. El servicio de email funciona correctamente.', function ($m) {
            $m->to($this->argument('email'))->subject('Test IntLinker');
        });
        $this->info('Email enviado a ' . $this->argument('email'));
    }
}
