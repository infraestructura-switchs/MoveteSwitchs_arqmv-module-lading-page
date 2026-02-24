# =============================
# Etapa 1 - Build del frontend
# =============================
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# =============================
# Etapa 2 - Servir con nginx
# =============================
FROM nginx:1.21.0

## Raíz para los modulos compilados
RUN mkdir -p /usr/share/nginx/arqmv-module-landing-page-qr-app-frontend

## Raíz para el root
RUN echo 'alias ll="ls -lha"' >> ~/.bashrc


COPY ./dist /usr/share/nginx/arqmv-module-landing-page-qr-app-frontend

COPY ./default.conf /etc/nginx/conf.d/
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

