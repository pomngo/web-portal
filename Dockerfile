# ==========================================
# STAGE 1: Build Stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_API_BASE_URL=http://127.0.0.1:8000/campaign_api/v1
ARG VITE_IMAGE_URL=https://du27z4qz38jyx.cloudfront.net

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_IMAGE_URL=$VITE_IMAGE_URL
ENV NODE_ENV=production

# Install dependencies cleanly
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copy application source files
COPY . .

# Build production bundle
RUN npm run build

# ==========================================
# STAGE 2: Production Stage
# ==========================================
FROM nginx:1.27-alpine AS production

# Install curl for container healthchecks
RUN apk add --no-cache curl

# Copy custom Nginx configuration for React SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
