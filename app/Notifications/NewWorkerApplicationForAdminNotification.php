<?php

namespace App\Notifications;

use App\Models\CompanyApplication;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewWorkerApplicationForAdminNotification extends Notification
{
    public function __construct(protected CompanyApplication $application) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $user = $this->application->user;

        $mail = (new MailMessage)
            ->subject('Nueva solicitud de trabajador pendiente de revisión')
            ->greeting('Hola administrador,')
            ->line("Se ha recibido una nueva solicitud de trabajador de {$user->name} ({$user->email}).")
            ->line("Empresa solicitada: {$this->application->company_name}")
            ->line("Posición: {$this->application->position}")
            ->line("ID trabajador: {$this->application->id_trabajador}")
            ->line('Revisa y aprueba o rechaza la solicitud en el panel de administración.');

        if ($url = $this->adminUrl()) {
            $mail->action('Ver solicitudes de empresa', $url);
        }

        if ($this->isBase64Image($this->application->work_card_image)) {
            $data = $this->base64ImageData($this->application->work_card_image);
            $mail->attachData($data, 'carnet_trabajador.jpg', ['mime' => 'image/jpeg']);
        }

        return $mail;
    }

    protected function isBase64Image(?string $value): bool
    {
        return is_string($value) && str_starts_with($value, 'data:image/');
    }

    protected function base64ImageData(string $base64): string
    {
        $parts = explode(',', $base64, 2);
        return base64_decode($parts[1]);
    }

    protected function adminUrl(): ?string
    {
        try {
            return route('admin.company-applications.index');
        } catch (\Throwable) {
            return null;
        }
    }
}
