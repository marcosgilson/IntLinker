#!/bin/bash
set -e

echo "==> Clearing bootstrap cache..."
rm -f bootstrap/cache/packages.php bootstrap/cache/services.php

echo "==> Regenerating package cache..."
php artisan package:discover --ansi

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Linking storage..."
php artisan storage:link || true

echo "==> Caching config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Starting queue worker in background..."
php artisan queue:work --sleep=3 --tries=3 --timeout=60 --daemon &

echo "==> Ensuring only mpm_prefork is loaded..."
rm -f /etc/apache2/mods-enabled/mpm_event.conf /etc/apache2/mods-enabled/mpm_event.load
rm -f /etc/apache2/mods-enabled/mpm_worker.conf /etc/apache2/mods-enabled/mpm_worker.load

echo "==> Starting Apache..."
exec apache2-foreground