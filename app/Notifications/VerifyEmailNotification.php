<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailNotification extends VerifyEmail
{
    protected function buildMailMessage(\): MailMessage
    {
        return (new MailMessage)
            ->subject('Verifica tu cuenta en IntLinker')
            ->view('emails.verify', ['url' => \]);
    }
}
