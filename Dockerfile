FROM php:8.2-apache

# 1. Extensiones necesarias + redis
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libzip-dev libicu-dev zip unzip git curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. OPcache (enorme mejora de rendimiento en Laravel)
RUN docker-php-ext-enable opcache
COPY docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# 3. Configuración de Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && a2enmod rewrite

# 4. Composer e instalación de dependencias
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html
COPY . /var/www/html

RUN composer install --optimize-autoloader

# 5. Permisos finales
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
