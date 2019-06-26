FROM mobtitude/php-xdebug:7.2-apache

COPY ./xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini
COPY . /var/www/html/

RUN chmod 777 /tmp
RUN chmod 777 /var

RUN a2enmod rewrite

EXPOSE 80
