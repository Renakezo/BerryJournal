FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
libzip-dev \
zip \
unzip \
telnet \
iputils-ping \
openssl \
ca-certificates \
&& docker-php-ext-install pdo_mysql zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html


COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY .env /var/www/html/.env
COPY . .

RUN composer dump-autoload --optimize && \
php artisan package:discover --ansi

RUN chown -R www-data:www-data storage bootstrap/cache && \
chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

