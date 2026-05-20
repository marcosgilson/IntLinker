<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><title>Solicitud rechazada - IntLinker</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;">
            <span style="color:#fff;font-size:24px;font-weight:800;">IntLinker</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 12px;font-size:24px;color:#111827;">Hola, {{ $name }}</h1>
            <p style="margin:0 0 16px;font-size:15px;color:#6b7280;line-height:1.6;">
              Tu solicitud como <strong style="color:#4f46e5;">alumno</strong> en
              <strong style="color:#4f46e5;">IntLinker</strong> ha sido
              <strong style="color:#dc2626;">rechazada</strong> por el siguiente motivo:
            </p>
            <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;border-radius:8px;margin:0 0 24px;">
              <p style="margin:0;font-size:15px;color:#991b1b;font-weight:500;">{{ $reason }}</p>
            </div>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
              Puedes volver a intentarlo desde tu perfil con un carnet valido.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#4f46e5;border-radius:10px;">
                  <a href="{{ $url }}" style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">
                    Ir a mi perfil
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; {{ date('Y') }} IntLinker</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>