<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkerVerifiedNotification extends Notification
{
    public function __construct(
        private string \,
        private ?string \ = null,
    ) {}

    public function via(object \): array
    {
        return ['mail'];
    }

    public function toMail(object \): MailMessage
    {
        return (new MailMessage)
            ->subject('Tu cuenta de trabajador ha sido verificada - IntLinker')
            ->view('emails.worker_verified', [
                'name'        => \->name,
                'companyName' => \->companyName,
                'companyLogo' => \->companyLogo,
                'url'         => url('/dashboard'),
            ]);
    }
}
