FROM php:8.3-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libzip-dev libicu-dev \
    zip unzip git curl nodejs npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# Copy and install PHP deps
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy and install Node deps + build assets
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php artisan migrate --force && php artisan db:seed --force ; php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
