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

echo "==> Starting Apache..."
exec apache2-foreground
