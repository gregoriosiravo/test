FROM laravelsail/php83-composer

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_NO_INTERACTION=1

RUN docker-php-ext-enable pdo_mysql || docker-php-ext-install pdo_mysql

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .

RUN if [ ! -f .env ]; then cp .env.example .env; fi

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

RUN composer run-script post-autoload-dump

RUN php artisan key:generate --force

RUN php artisan config:cache \
    && php artisan route:cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

