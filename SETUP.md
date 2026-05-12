# IntLinker — Guía de configuración en nuevo ordenador

Esta guía cubre todo lo necesario para tener el proyecto funcionando desde cero.
El método recomendado es WSL2 porque Docker va significativamente más rápido.

---

## Paso 1 — Instalar los programas necesarios

### Docker Desktop
1. Descarga desde https://www.docker.com/products/docker-desktop/
2. Instala y reinicia el ordenador
3. Ábrelo y espera a que el icono de la ballena en la barra de tareas esté estable

### VS Code
1. Descarga desde https://code.visualstudio.com/
2. Instala con las opciones por defecto

### Git
1. Descarga desde https://git-scm.com/
2. Instala con las opciones por defecto

---

## Paso 2 — Instalar WSL2 con Ubuntu

Abre **PowerShell como administrador** y ejecuta:

```powershell
wsl --install -d Ubuntu
```

- Reinicia el ordenador si lo pide
- Al abrir Ubuntu por primera vez te pedirá crear un **usuario y contraseña** (ponlos y no los olvides)
- Si te pregunta sobre compartir datos con Canonical, escribe `n`

> Si ya tienes WSL2 instalado, salta al Paso 3.

---

## Paso 3 — Conectar Docker Desktop con WSL2

1. Abre Docker Desktop
2. Ve a **Settings** (icono engranaje arriba a la derecha)
3. **General** → activa ✅ *"Use the WSL 2 based engine"*
4. **Resources → WSL Integration** → activa ✅ *Ubuntu*
5. Pulsa **Apply & Restart**

---

## Paso 4 — Instalar la extensión Remote - WSL en VS Code

1. Abre VS Code
2. Ve a Extensiones (`Ctrl+Shift+X`)
3. Busca **Remote - WSL** (de Microsoft) e instálala

---

## Paso 5 — Copiar el proyecto a WSL2

Tienes dos opciones:

### Opción A — Clonar desde Git (recomendado)
Abre Ubuntu y ejecuta:
```bash
cd ~
git clone <URL_DEL_REPO> IntLinker
cd IntLinker
```

### Opción B — Copiar desde Windows
Si tienes el proyecto en Windows (por ejemplo en `D:\IntLinker`), abre Ubuntu y ejecuta:
```bash
cp -r /mnt/d/IntLinker ~/IntLinker
```
> ⚠️ Esto puede tardar varios minutos si `vendor/` y `node_modules/` están incluidos.

---

## Paso 6 — Abrir el proyecto en VS Code desde WSL2

Dentro de Ubuntu:
```bash
cd ~/IntLinker
code .
```

VS Code se abre en Windows pero conectado a los archivos de WSL2.
Verás **`WSL: Ubuntu`** en azul en la esquina inferior izquierda — eso confirma que está bien.

---

## Paso 7 — Arrancar el proyecto

Desde el terminal integrado de VS Code (que ya está en WSL2):

```bash
# Primera vez: construir y arrancar
docker compose up -d --build

# Esperar a que los contenedores estén listos y ejecutar migraciones
docker exec intlinker-app php artisan migrate --seed
```

Abre http://localhost:8000 — debería funcionar.

---

## URLs del proyecto

| Servicio   | URL / Conexión                                      |
|------------|-----------------------------------------------------|
| Aplicación | http://localhost:8000                               |
| Vite (HMR) | http://localhost:5174                               |
| MySQL      | localhost:3307 · usuario: `laravel` · pass: `secret`|

---

## Comandos del día a día

```bash
# Arrancar todo
docker compose up -d

# Parar todo
docker compose down

# Ver logs en tiempo real
docker compose logs -f app

# Ejecutar comandos artisan
docker exec intlinker-app php artisan <comando>

# Acceder al contenedor PHP
docker exec -it intlinker-app bash

# Reconstruir imagen (tras cambios en Dockerfile o composer.json)
docker compose build --no-cache
docker compose up -d
```

---

## Solución de problemas

### Los contenedores no arrancan o dan error al iniciar
```bash
docker compose down -v   # ⚠️ borra volúmenes incluyendo la BD
docker compose up -d --build
docker exec intlinker-app php artisan migrate --seed
```

### Error de permisos en storage
```bash
docker exec intlinker-app chmod -R 775 storage bootstrap/cache
docker exec intlinker-app chown -R www-data:www-data storage bootstrap/cache
```

### La app muestra error 500
```bash
docker exec intlinker-app php artisan config:clear
docker exec intlinker-app php artisan cache:clear
docker exec intlinker-app php artisan view:clear
```

### Docker Desktop no ve Ubuntu en WSL Integration
- Asegúrate de que Ubuntu está corriendo: abre la app Ubuntu al menos una vez
- Reinicia Docker Desktop

### VS Code no conecta con WSL
- Instala la extensión **Remote - WSL** (Microsoft)
- Abre Ubuntu, ve a la carpeta del proyecto y ejecuta `code .`
