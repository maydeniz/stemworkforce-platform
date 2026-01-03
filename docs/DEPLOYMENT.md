# STEMWorkforce Platform - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Authentication Setup (Auth0)](#authentication-setup-auth0)
6. [Deployment Options](#deployment-options)
   - [AWS Deployment](#aws-deployment)
   - [Vercel + Railway](#vercel--railway)
   - [Docker Deployment](#docker-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Observability](#monitoring--observability)
9. [Security Checklist](#security-checklist)
10. [Performance Optimization](#performance-optimization)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18.0+ (LTS recommended)
- **npm** 9.0+ or **pnpm** 8.0+
- **PostgreSQL** 15+ (or managed service)
- **Git** 2.30+

### Recommended Tools
- Docker Desktop 4.0+
- AWS CLI 2.0+
- Terraform 1.5+

---

## Local Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/stemworkforce/platform.git
cd stemworkforce-platform

# Install dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your local values
nano .env.local
```

### 3. Database Setup

```bash
# Start PostgreSQL (Docker)
docker run -d \
  --name stemworkforce-db \
  -e POSTGRES_USER=stemworkforce \
  -e POSTGRES_PASSWORD=localdev123 \
  -e POSTGRES_DB=stemworkforce \
  -p 5432:5432 \
  postgres:15

# Run migrations
cd server
npx prisma migrate dev
npx prisma db seed
```

### 4. Start Development Servers

```bash
# Terminal 1: Frontend (port 3000)
npm run dev

# Terminal 2: Backend (port 8000)
cd server && npm run dev
```

### 5. Access Application

- Frontend: http://localhost:3000
- API: http://localhost:8000/api/v1
- API Docs: http://localhost:8000/docs

---

## Environment Configuration

### Frontend (.env.local)

```env
# API
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1

# Auth0
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.stemworkforce.gov

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=true
```

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stemworkforce"

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.stemworkforce.gov

# Redis (session/cache)
REDIS_URL=redis://localhost:6379

# Storage (S3)
AWS_S3_BUCKET=stemworkforce-uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# Email (SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Database Setup

### PostgreSQL (Production)

#### Option A: AWS RDS

```bash
aws rds create-db-instance \
  --db-instance-identifier stemworkforce-prod \
  --db-instance-class db.r6g.large \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password <secure-password> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name stemworkforce-subnet \
  --multi-az \
  --storage-encrypted \
  --backup-retention-period 7
```

#### Option B: Supabase

1. Create project at https://supabase.com
2. Get connection string from Settings → Database
3. Update `DATABASE_URL` in environment

### Migrations

```bash
# Generate migration from schema changes
npx prisma migrate dev --name description

# Apply migrations to production
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

---

## Authentication Setup (Auth0)

### 1. Create Auth0 Application

1. Go to https://manage.auth0.com
2. Applications → Create Application
3. Select "Single Page Application"
4. Configure:
   - Allowed Callback URLs: `https://stemworkforce.gov/callback`
   - Allowed Logout URLs: `https://stemworkforce.gov`
   - Allowed Web Origins: `https://stemworkforce.gov`

### 2. Create API

1. APIs → Create API
2. Name: STEMWorkforce API
3. Identifier: `https://api.stemworkforce.gov`
4. Signing Algorithm: RS256

### 3. Configure Roles

Create roles in Auth0 Dashboard → User Management → Roles:

| Role | Description |
|------|-------------|
| intern | Student interns |
| jobseeker | Job seekers |
| educator | Educational institution users |
| partner | Employer/partner organizations |
| admin | Platform administrators |

### 4. Social Connections (Optional)

Enable in Authentication → Social:
- Google
- LinkedIn
- GitHub
- Microsoft (for .gov/.edu SSO)

---

## Deployment Options

### AWS Deployment

#### Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  CloudFront │────▶│   S3 Static  │     │   Route 53  │
│    (CDN)    │     │   (Frontend) │     │    (DNS)    │
└─────────────┘     └──────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│     ALB     │────▶│     ECS      │────▶│    RDS      │
│(Load Balancer)    │   (Backend)  │     │ (PostgreSQL)│
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ ElastiCache  │
                    │   (Redis)    │
                    └──────────────┘
```

#### 1. Infrastructure Setup (Terraform)

```hcl
# infrastructure/terraform/main.tf

provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "stemworkforce-vpc"
  cidr   = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = false
}

# RDS PostgreSQL
module "rds" {
  source = "terraform-aws-modules/rds/aws"
  
  identifier = "stemworkforce-prod"
  engine     = "postgres"
  engine_version = "15.4"
  instance_class = "db.r6g.large"
  
  allocated_storage     = 100
  max_allocated_storage = 500
  
  db_name  = "stemworkforce"
  username = "admin"
  port     = "5432"
  
  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  backup_retention_period = 7
  deletion_protection     = true
  storage_encrypted       = true
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "stemworkforce-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# S3 for Frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "stemworkforce-frontend-prod"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3Origin"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.main.arn
    ssl_support_method  = "sni-only"
  }
}
```

#### 2. Deploy Commands

```bash
# Initialize Terraform
cd infrastructure/terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan

# Build and push Docker image
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin xxx.dkr.ecr.us-east-1.amazonaws.com

docker build -t stemworkforce-api ./server
docker tag stemworkforce-api:latest xxx.dkr.ecr.us-east-1.amazonaws.com/stemworkforce-api:latest
docker push xxx.dkr.ecr.us-east-1.amazonaws.com/stemworkforce-api:latest

# Build and deploy frontend
npm run build
aws s3 sync dist/ s3://stemworkforce-frontend-prod --delete
aws cloudfront create-invalidation --distribution-id EXXX --paths "/*"
```

---

### Vercel + Railway

A simpler deployment option for faster iteration.

#### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard
4. Deploy

#### Backend (Railway)

1. Create new project at https://railway.app
2. Add PostgreSQL database
3. Deploy from GitHub repo (`/server` directory)
4. Configure environment variables
5. Set up custom domain

---

### Docker Deployment

#### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://api:8000
    depends_on:
      - api

  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/stemworkforce
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=stemworkforce

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Dockerfile.frontend

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### server/Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 8000
CMD ["node", "dist/index.js"]
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  AWS_REGION: 'us-east-1'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - run: npm ci
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy-staging:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - run: aws s3 sync dist/ s3://stemworkforce-staging --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_STAGING }} --paths "/*"

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - run: aws s3 sync dist/ s3://stemworkforce-prod --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_PROD }} --paths "/*"
```

---

## Monitoring & Observability

### Recommended Stack

| Service | Purpose |
|---------|---------|
| **Sentry** | Error tracking & performance |
| **DataDog** | Infrastructure monitoring |
| **CloudWatch** | AWS metrics & logs |
| **PagerDuty** | Incident management |

### Sentry Setup

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
  environment: import.meta.env.MODE,
});
```

### Health Check Endpoints

```
GET /health          → Basic health
GET /health/ready    → Ready for traffic
GET /health/live     → Liveness probe
```

---

## Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables (not code)
- [ ] HTTPS enforced everywhere
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection headers
- [ ] CSRF tokens for state-changing operations
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Dependencies updated (`npm audit`)
- [ ] Penetration testing completed

### Post-Deployment

- [ ] SSL certificate valid and auto-renewing
- [ ] Database backups configured
- [ ] Audit logging enabled
- [ ] Monitoring alerts configured
- [ ] Incident response plan documented
- [ ] Regular security scans scheduled

---

## Performance Optimization

### Frontend

1. **Code Splitting** - Already configured with lazy loading
2. **Image Optimization** - Use WebP, lazy load images
3. **CDN** - CloudFront for static assets
4. **Caching** - Service worker for offline support

### Backend

1. **Database Indexing** - See schema.prisma indexes
2. **Query Optimization** - Use Prisma query analyzer
3. **Caching** - Redis for session and query caching
4. **Connection Pooling** - PgBouncer for database

### Infrastructure

1. **Auto-scaling** - ECS service auto-scaling
2. **Multi-AZ** - RDS and ECS across zones
3. **Edge Caching** - CloudFront for global performance

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"

# Check migrations
npx prisma migrate status
```

#### 2. Auth0 Token Errors

- Verify audience matches API identifier
- Check token expiration
- Validate CORS settings

#### 3. Build Failures

```bash
# Clear caches
rm -rf node_modules dist .next
npm ci
npm run build
```

#### 4. Memory Issues (Node)

```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Support Contacts

- **Technical Issues:** devops@stemworkforce.gov
- **Security Concerns:** security@stemworkforce.gov
- **On-Call:** PagerDuty escalation

---

## Appendix: Quick Reference

### Useful Commands

```bash
# Development
npm run dev           # Start frontend
npm run dev:server    # Start backend

# Building
npm run build         # Build frontend
npm run build:server  # Build backend

# Testing
npm run test          # Run tests
npm run test:e2e      # E2E tests
npm run lint          # Lint code

# Database
npx prisma studio     # Database GUI
npx prisma migrate    # Run migrations
npx prisma db seed    # Seed data

# Deployment
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production
```

### Environment Matrix

| Environment | Frontend URL | API URL | Database |
|-------------|-------------|---------|----------|
| Local | localhost:3000 | localhost:8000 | localhost:5432 |
| Staging | staging.stemworkforce.gov | api-staging.stemworkforce.gov | RDS Staging |
| Production | stemworkforce.gov | api.stemworkforce.gov | RDS Production |
