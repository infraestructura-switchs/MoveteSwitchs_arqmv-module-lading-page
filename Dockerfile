# =============================
# Stage 1 - Build frontend
# =============================
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# =============================
# Stage 2 - Nginx
# =============================
FROM nginx:1.21.0

RUN mkdir -p /usr/share/nginx/arqmv-module-landing-page-qr-app-frontend

COPY --from=builder /app/dist /usr/share/nginx/arqmv-module-landing-page-qr-app-frontend

COPY ./default.conf /etc/nginx/conf.d/
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
