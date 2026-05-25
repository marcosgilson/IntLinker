<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentRejectedNotification extends Notification
{
    public function __construct(private readonly string $reason) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Solicitud de alumno rechazada - IntLinker')
            ->view('emails.student_rejected', [
                'name'   => $notifiable->name,
                'reason' => $this->reason,
                'url'    => url('/profile'),
            ]);
    }
}