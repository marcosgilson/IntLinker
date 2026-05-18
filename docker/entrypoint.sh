#!/bin/bash
set -e

echo "==> Clearing bootstrap cache..."
php artisan cache:clear --quiet 2>/dev/null || true
php artisan config:clear --quiet 2>/dev/null || true
php artisan route:clear --quiet 2>/dev/null || true

echo "==> Regenerating package cache..."
php artisan package:discover --ansi

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Linking storage..."
php artisan storage:link --quiet 2>/dev/null || true

echo "==> Caching config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Fixing Apache MPM and enabling rewrite..."
a2enmod rewrite 2>/dev/null || true
rm -f /etc/apache2/mods-enabled/mpm_event.conf
rm -f /etc/apache2/mods-enabled/mpm_event.load
rm -f /etc/apache2/mods-enabled/mpm_worker.conf
rm -f /etc/apache2/mods-enabled/mpm_worker.load
ln -sf /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load 2>/dev/null || true
ln -sf /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf 2>/dev/null || true

echo "==> Starting queue worker in background..."
php artisan queue:work --sleep=3 --tries=3 &

echo "==> Starting Apache..."
exec apache2-foreground
