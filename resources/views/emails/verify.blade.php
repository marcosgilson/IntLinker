<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><title>Verifica tu cuenta</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;">
            <img src="https://intlinker.up.railway.app/intlinker_logo.svg" alt="IntLinker" style="height:48px;width:auto;" />
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 12px;font-size:24px;color:#111827;">Bienvenido/a</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              Gracias por registrarte en <strong style="color:#4f46e5;">IntLinker</strong>.
              Para activar tu cuenta confirma tu correo electronico.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#4f46e5;border-radius:10px;">
                  <a href="{{ $url }}" style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">
                    Verificar mi cuenta
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 16px;font-size:13px;color:#6b7280;">
              Este enlace expira en <strong>60 minutos</strong>. Si no solicitaste esta cuenta, ignora este correo.
            </p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Si el boton no funciona, copia este enlace:<br />
              <a href="{{ $url }}" style="color:#4f46e5;word-break:break-all;">{{ $url }}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; {{ date('Y') }} IntLinker &middot; No respondas a este correo</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>

