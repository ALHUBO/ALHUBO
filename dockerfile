FROM php:8.2.3-apache
ARG DEBIAN_FRONTEND=noninteractive
RUN docker-php-ext-install mysqli
# Include alternative DB driver
#RUN docker-php-ext-install pdo
#RUN docker-php-ext-install pdo_mysql
RUN apt-get update
RUN apt-get install -y sendmail libpng-dev
RUN apt-get install -y libzip-dev
RUN apt-get install -y zlib1g-dev
RUN apt-get install -y libonig-dev
RUN rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install zip

RUN docker-php-ext-install mbstring
RUN docker-php-ext-install zip
RUN docker-php-ext-install gd

RUN a2enmod rewrite