<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkerVerifiedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private string $companyName) {}

    public function via(object $notifiable): array
    {
        return [''mail''];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(''¡Tu cuenta de trabajador ha sido verificada! - IntLinker'')
            ->view(''emails.worker_verified'', [
                ''name''        => $notifiable->name,
                ''companyName'' => $this->companyName,
                ''url''         => url(''/dashboard''),
            ]);
    }
}
