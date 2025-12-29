# 🚀 STEMWorkforce Platform

> **Building America's Technology Future** - A comprehensive workforce development platform connecting talent with opportunities across 10 emerging technology sectors.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

STEMWorkforce is a Department of Energy (DOE) CTO Challenge submission - a $15M workforce development ecosystem that connects:

- **Interns & Job Seekers** with career opportunities
- **Educators** with training program management
- **Employers** (Industry, Government, National Labs, Academia, Nonprofits) with talent pipelines
- **Policy Makers** with workforce intelligence data

### 🏭 Supported Industries

| Industry | Growth | Jobs Tracked |
|----------|--------|--------------|
| 💻 Semiconductor | +23% | 245,000 |
| ⚛️ Nuclear Energy | +15% | 89,000 |
| 🤖 Artificial Intelligence | +45% | 312,000 |
| 🔬 Quantum Computing | +67% | 12,000 |
| 🛡️ Cybersecurity | +32% | 567,000 |
| 🚀 Aerospace & Space | +18% | 198,000 |
| 🧬 Biotechnology | +28% | 234,000 |
| 🦾 Robotics | +35% | 156,000 |
| 🌱 Clean Energy | +42% | 178,000 |
| 🏭 Advanced Manufacturing | +12% | 423,000 |

---

## ✨ Features

### For Job Seekers
- 🔍 Advanced job search with 10+ filters
- 📊 AI-powered job matching
- 📚 850+ training programs
- 📅 Career events & job fairs
- 📈 Application tracking dashboard

### For Employers/Partners
- 📝 Job posting management
- 👥 Applicant tracking system
- 📊 Analytics dashboard
- 🏆 Challenges & innovation hub
- 🔗 ATS integrations

### For Educators
- 📚 Training program management
- 👨‍🎓 Student tracking
- 📊 Placement rate analytics
- 🤝 Employer partnerships

### Platform Features
- 🗺️ Interactive Workforce Intelligence Map (18 states)
- 🔐 Role-based access control (5 roles)
- 📝 Comprehensive audit logging
- ♿ WCAG 2.1 AA accessibility
- 🌙 Dark mode interface
- 📱 Responsive design

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Zod** for validation
- **Recharts** for visualizations

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Prisma** ORM
- **Auth0** authentication
- **Redis** for caching
- **Winston** for logging

### Infrastructure
- **AWS** (ECS, RDS, S3, CloudFront)
- **Docker** containerization
- **Terraform** infrastructure as code
- **GitHub Actions** CI/CD

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+ or pnpm 8+
- PostgreSQL 15+ (or Docker)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/stemworkforce/platform.git
cd stemworkforce-platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Copy environment files
cp .env.example .env.local
cp server/.env.example server/.env

# Start PostgreSQL (via Docker)
docker run -d \
  --name stemworkforce-db \
  -e POSTGRES_USER=stemworkforce \
  -e POSTGRES_PASSWORD=localdev123 \
  -e POSTGRES_DB=stemworkforce \
  -p 5432:5432 \
  postgres:15

# Run database migrations
cd server
npx prisma migrate dev
npx prisma db seed
cd ..

# Start development servers
npm run dev          # Frontend on :3000
cd server && npm run dev  # Backend on :8000
```

### Access the Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000/api/v1
- **API Health:** http://localhost:8000/health
- **Prisma Studio:** `cd server && npx prisma studio`

---

## 📁 Project Structure

```
stemworkforce-platform/
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── pages/          # Page components
│   ├── config/             # Configuration files
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── server/                 # Backend source
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   └── prisma/             # Database schema
├── docs/                   # Documentation
│   ├── API_SPECIFICATION.md
│   └── DEPLOYMENT.md
├── infrastructure/         # IaC & DevOps
│   ├── terraform/
│   ├── docker/
│   └── k8s/
└── public/                 # Static assets
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Specification](docs/API_SPECIFICATION.md) | REST API endpoints & schemas |
| [Deployment Guide](docs/DEPLOYMENT.md) | AWS, Vercel, Docker deployment |
| [Database Schema](server/prisma/schema.prisma) | Prisma database models |

---

## 🔐 Security

This platform implements enterprise-grade security:

- ✅ Auth0 JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Secure session management
- ✅ Comprehensive audit logging
- ✅ Security headers (Helmet)

---

## 📊 Platform Statistics

| Metric | Value |
|--------|-------|
| Total Jobs Tracked | 1.2M+ |
| Active Employers | 8,500+ |
| Training Programs | 850+ |
| States Covered | 18 |
| Placement Rate | 87% |

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Department of Energy CTO Challenge
- National Laboratories
- Educational Partners
- Industry Collaborators

---

<p align="center">
  <strong>Built with ❤️ for America's STEM Workforce</strong>
</p>

<p align="center">
  <a href="https://stemworkforce.gov">Website</a> •
  <a href="https://docs.stemworkforce.gov">Documentation</a> •
  <a href="https://twitter.com/stemworkforce">Twitter</a>
</p>
