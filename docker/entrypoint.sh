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
php artisan queue:work --sleep=3 --tries=3 --timeout=60 &

echo "==> Apache MPM modules loaded:"
ls /etc/apache2/mods-enabled/mpm_* 2>&1 || echo "(none)"

echo "==> Testing Apache config..."
apache2ctl configtest 2>&1 || true

echo "==> Starting Apache..."
exec apache2-foreground