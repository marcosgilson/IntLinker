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

echo "==> Seeding database (if empty)..."
php artisan db:seed --force 2>/dev/null || true

echo "==> Linking storage..."
php artisan storage:link --quiet 2>/dev/null || true

echo "==> Caching config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Fixing Apache MPM and enabling rewrite..."
a2enmod rewrite 2>/dev/null || true
a2enconf mpm_prefork_tune 2>/dev/null || true
rm -f /etc/apache2/mods-enabled/mpm_event.conf /etc/apache2/mods-enabled/mpm_event.load
rm -f /etc/apache2/mods-enabled/mpm_worker.conf /etc/apache2/mods-enabled/mpm_worker.load
ln -sf /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load 2>/dev/null || true
ln -sf /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf 2>/dev/null || true

echo "==> Configuring Apache port (PORT=${PORT:-80})..."
PORT="${PORT:-80}"
sed -i "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-enabled/*.conf

echo "==> Starting scheduler in background..."
(while true; do
    php artisan schedule:run --no-interaction
    sleep 60
done) &

echo "==> Starting queue worker in background..."
(while true; do
    php -d memory_limit=128M artisan queue:work --sleep=10 --tries=3 --max-time=1800 --max-jobs=50
    echo "==> Queue worker exited, restarting..."
    sleep 2
done) &

echo "==> Starting Apache..."
exec apache2-foreground
