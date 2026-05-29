<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><title>Cuenta verificada - Trabajador</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;">
            <img src="https://intlinker.up.railway.app/intlinker_logo.svg" alt="IntLinker" style="height:40px;width:auto;" />
          </td>
        </tr>
        @if($companyLogo)
        <tr>
          <td style="padding:28px 40px 0;text-align:center;">
            <img src="{{ $companyLogo }}" alt="{{ $companyName }}"
              style="height:64px;width:auto;max-width:180px;object-fit:contain;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.10);" />
            <p style="margin:10px 0 0;font-size:14px;font-weight:700;color:#111827;">{{ $companyName }}</p>
          </td>
        </tr>
        @endif
        <tr>
          <td style="padding:32px 40px 40px;">
            <h1 style="margin:0 0 12px;font-size:24px;color:#111827;">!Enhorabuena, {{ $name }}!</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              Tu solicitud como <strong style="color:#4f46e5;">trabajador</strong> en
              <strong style="color:#4f46e5;">{{ $companyName }}</strong> ha sido revisada y
              <strong style="color:#16a34a;">aprobada</strong>.
              Ya eres parte oficial del equipo.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#4f46e5;border-radius:10px;">
                  <a href="{{ $url }}" style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">
                    Ir a mi cuenta
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:13px;color:#6b7280;">
              Si tienes alguna duda, contacta con nosotros respondiendo a este correo.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; {{ now()->year }} IntLinker &middot; No respondas a este correo</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
