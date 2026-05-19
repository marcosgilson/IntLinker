<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentVerifiedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return [''mail''];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(''¡Tu cuenta de alumno ha sido verificada! - IntLinker'')
            ->view(''emails.student_verified'', [
                ''name'' => $notifiable->name,
                ''url''  => url(''/dashboard''),
            ]);
    }
}
