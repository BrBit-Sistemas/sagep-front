# Step 1: Build the Vite React app
FROM node:18-alpine AS build

# Toolchain e git (necessários para nativos e dependências via git)
RUN apk add --no-cache git python3 make g++ pkgconfig libc6-compat

WORKDIR /app

# Se usar pacotes privados, descomente:
# COPY .npmrc ./

# Build args para .env de build do Vite
ARG VITE_SERVER_URL
ARG VITE_ASSETS_DIR
ARG VITE_MAPBOX_API_KEY
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APPID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_AWS_AMPLIFY_USER_POOL_ID
ARG VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID
ARG VITE_AWS_AMPLIFY_REGION
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CALLBACK_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Cria .env para o build do Vite
RUN echo "VITE_SERVER_URL=${VITE_SERVER_URL}" > .env && \
    echo "VITE_ASSETS_DIR=${VITE_ASSETS_DIR}" >> .env && \
    echo "VITE_MAPBOX_API_KEY=${VITE_MAPBOX_API_KEY}" >> .env && \
    echo "VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}" >> .env && \
    echo "VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}" >> .env && \
    echo "VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}" >> .env && \
    echo "VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}" >> .env && \
    echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}" >> .env && \
    echo "VITE_FIREBASE_APPID=${VITE_FIREBASE_APPID}" >> .env && \
    echo "VITE_FIREBASE_MEASUREMENT_ID=${VITE_FIREBASE_MEASUREMENT_ID}" >> .env && \
    echo "VITE_AWS_AMPLIFY_USER_POOL_ID=${VITE_AWS_AMPLIFY_USER_POOL_ID}" >> .env && \
    echo "VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID=${VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID}" >> .env && \
    echo "VITE_AWS_AMPLIFY_REGION=${VITE_AWS_AMPLIFY_REGION}" >> .env && \
    echo "VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}" >> .env && \
    echo "VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}" >> .env && \
    echo "VITE_AUTH0_CALLBACK_URL=${VITE_AUTH0_CALLBACK_URL}" >> .env && \
    echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" >> .env && \
    echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" >> .env

# Copie apenas os manifests para aproveitar cache
COPY package.json package-lock.json ./

# (Opcional) alinhar versão do npm ao seu lockfile
# RUN npm i -g npm@8   # se seu lock foi gerado no npm 8

# Instala dependências (sem --silent para ver erro)
RUN npm install --package-lock-only --no-audit --no-fund \
  && npm ci --loglevel=info \
  && npm cache clean --force

# Copie o restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Step 2: Nginx para servir
FROM nginx:alpine

# Necessário para o HEALTHCHECK que usa curl
RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=build /app/dist /usr/share/nginx/html

# Config do nginx
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

RUN chown -R nextjs:nodejs /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && chown -R nextjs:nodejs /var/run/nginx.pid && \
    sed -i.bak 's/user nginx/user nextjs/' /etc/nginx/nginx.conf

USER nextjs
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
