# FlocknGo Web Portal - Production Docker Deployment Guide

This repository includes a multi-stage Docker build pipeline optimized for production deployment of the Vite + React Single Page Application (SPA).

---

## Architecture Overview

1. **Stage 1 (Builder)**: `node:22-alpine` compiles production assets into optimized static JavaScript/CSS/HTML chunks (`/app/dist`).
2. **Stage 2 (Production)**: `nginx:1.27-alpine` serves static files with Gzip compression, SPA fallback routing (`try_files`), security headers, and asset caching.

---

## Quick Start (Docker Compose)

The fastest way to build and run the production container locally:

```bash
# Build and run container in detached mode
docker compose up --build -d

# Check status & health
docker compose ps

# View logs
docker compose logs -f

# Stop container
docker compose down
```

Once running, access the portal at: **`http://localhost:8080`**

---

## NPM Docker Scripts

Convenient commands added to `package.json`:

```bash
# Build Docker image tagged flockngo-web-portal:latest
npm run docker:build

# Run container on port 8080
npm run docker:run

# Launch via Docker Compose
npm run docker:compose
```

---

## Manual Docker Commands

### 1. Build Docker Image

```bash
docker build \
  --build-arg VITE_API_BASE_URL="https://api.flockngo.com/campaign_api/v1" \
  --build-arg VITE_IMAGE_URL="https://du27z4qz38jyx.cloudfront.net" \
  -t flockngo-web-portal:latest .
```

### 2. Run Container

```bash
docker run -d \
  -p 8080:80 \
  --name flockngo-web-portal \
  --restart always \
  flockngo-web-portal:latest
```

---

## Health Check & Verification

The container exposes a lightweight health check endpoint at `/healthz`:

```bash
curl -f http://localhost:8080/healthz
# Returns: OK (200)
```

---

## Cloud Deployment Recommendations

### AWS ECS / Fargate
1. Push image to Amazon ECR:
   ```bash
   aws ecr get-login-password | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
   docker tag flockngo-web-portal:latest <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/flockngo-web-portal:latest
   docker push <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/flockngo-web-portal:latest
   ```
2. Create an ECS Task Definition with container port `80` mapped to target group / ALB.

### GCP Cloud Run
```bash
gcloud builds submit --tag gcr.io/<PROJECT_ID>/flockngo-web-portal
gcloud run deploy flockngo-web-portal --image gcr.io/<PROJECT_ID>/flockngo-web-portal --platform managed --port 80
```

### Kubernetes (K8s)
Deployment snippet:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flockngo-web-portal
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flockngo-web-portal
  template:
    metadata:
      labels:
        app: flockngo-web-portal
    spec:
      containers:
      - name: web-portal
        image: flockngo-web-portal:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
```
