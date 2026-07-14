# =============================================================================
# Frontend (React + Vite) - imagem para o cluster / teste com docker-compose.
# Build multi-stage: compila o React e serve o resultado estatico via nginx.
# =============================================================================

# ---- Stage 1: build ----
FROM node:22-slim AS build
WORKDIR /app

# URL da API embutida no bundle em tempo de build.
# O navegador roda no host, entao aponta para a porta publicada da API (host:3000).
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Instala dependencias a partir do lockfile (build reproduzivel).
COPY package.json package-lock.json ./
RUN npm ci

# Copia o codigo e gera o build de producao em /app/dist
COPY . .
RUN npm run build

# ---- Stage 2: serve ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
