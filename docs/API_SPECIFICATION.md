# STEMWorkforce Platform - Backend API Specification

## Overview

This document defines the REST API specification for the STEMWorkforce platform backend. The API follows RESTful principles with JSON payloads and uses JWT-based authentication via Auth0.

**Base URL:** `https://api.stemworkforce.gov/v1`

---

## Authentication

### Auth0 Integration

The platform uses Auth0 for authentication. All protected endpoints require a valid JWT token in the Authorization header.

```
Authorization: Bearer <access_token>
```

### Token Endpoints

These are handled by Auth0. The frontend uses the Auth0 SPA SDK.

---

## API Endpoints

### 1. Users

#### Get Current User Profile
```
GET /user/profile
Authorization: Required

Response 200:
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker",
  "organization": "Company Inc",
  "avatar": "https://cdn.../avatar.png",
  "clearanceLevel": "secret",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-12-01T14:22:00Z",
  "preferences": {
    "notifications": true,
    "emailDigest": "weekly",
    "theme": "dark",
    "industries": ["ai", "quantum"],
    "locations": ["CA", "WA"]
  }
}
```

#### Update User Profile
```
PATCH /user/profile
Authorization: Required
Content-Type: application/json

Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "organization": "New Company",
  "preferences": {
    "notifications": false
  }
}

Response 200: Updated user object
```

#### Get Dashboard Stats
```
GET /user/dashboard/stats
Authorization: Required

Response 200:
{
  "totalJobs": 1245,
  "activeApplications": 5,
  "savedJobs": 23,
  "upcomingEvents": 3,
  "completedTrainings": 8,
  "profileViews": 156,
  "matchScore": 87
}
```

---

### 2. Jobs

#### List Jobs
```
GET /jobs
Query Parameters:
  - page: number (default: 1)
  - pageSize: number (default: 20, max: 100)
  - query: string (search term)
  - industries: string[] (comma-separated)
  - locations: string[] (comma-separated)
  - remote: boolean
  - clearance: string[] (comma-separated)
  - jobTypes: string[] (comma-separated)
  - salaryMin: number
  - salaryMax: number
  - postedAfter: ISO date string
  - sortBy: string (postedAt, salary, company)
  - sortOrder: asc | desc

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "title": "Quantum Computing Researcher",
      "company": "IBM Research",
      "companyLogo": "https://cdn.../ibm.png",
      "location": "San Jose, CA",
      "remote": true,
      "type": "full-time",
      "industry": "quantum",
      "salary": {
        "min": 150000,
        "max": 250000,
        "currency": "USD",
        "period": "yearly"
      },
      "clearance": "none",
      "skills": ["Python", "Qiskit", "Linear Algebra"],
      "description": "...",
      "applicantsCount": 45,
      "postedAt": "2024-11-20T10:00:00Z",
      "expiresAt": "2025-01-20T10:00:00Z",
      "status": "active"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 62,
    "totalItems": 1234,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Job Details
```
GET /jobs/:id

Response 200: Full job object with requirements and benefits
```

#### Create Job (Partner/Admin only)
```
POST /jobs
Authorization: Required (partner, admin)
Content-Type: application/json

Request:
{
  "title": "Senior AI Engineer",
  "location": "Remote",
  "remote": true,
  "type": "full-time",
  "industry": "ai",
  "salary": {
    "min": 180000,
    "max": 280000,
    "currency": "USD",
    "period": "yearly"
  },
  "clearance": "none",
  "skills": ["Python", "PyTorch", "Transformers"],
  "description": "...",
  "requirements": ["5+ years ML experience", "PhD preferred"],
  "benefits": ["Health insurance", "401k", "Remote work"]
}

Response 201: Created job object
```

#### Apply to Job
```
POST /jobs/:id/apply
Authorization: Required
Content-Type: application/json

Request:
{
  "resumeUrl": "https://storage.../resume.pdf",
  "coverLetter": "Dear hiring manager...",
  "linkedInUrl": "https://linkedin.com/in/user",
  "portfolioUrl": "https://portfolio.dev",
  "availability": "2 weeks notice",
  "expectedSalary": 200000
}

Response 201:
{
  "id": "uuid",
  "jobId": "job-uuid",
  "userId": "user-uuid",
  "status": "pending",
  "appliedAt": "2024-12-01T10:00:00Z",
  "updatedAt": "2024-12-01T10:00:00Z"
}
```

#### Save/Unsave Job
```
POST /jobs/:id/save
Authorization: Required
Response 201: { "saved": true }

DELETE /jobs/:id/save
Authorization: Required
Response 200: { "saved": false }
```

#### Get User's Applications
```
GET /jobs/applications
Authorization: Required

Response 200: Array of application objects with job details
```

#### Get Saved Jobs
```
GET /jobs/saved
Authorization: Required

Response 200: Array of saved job objects
```

---

### 3. Events

#### List Events
```
GET /events
Query Parameters:
  - page, pageSize
  - type: string (conference, job-fair, workshop, etc.)
  - industries: string[]
  - virtual: boolean
  - startAfter: ISO date
  - startBefore: ISO date

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "title": "National STEM Career Fair 2025",
      "description": "...",
      "type": "job-fair",
      "date": "2025-03-15T09:00:00Z",
      "endDate": "2025-03-15T17:00:00Z",
      "location": "Washington, DC",
      "virtual": true,
      "virtualUrl": "https://events.../fair2025",
      "capacity": 5000,
      "attendeesCount": 3245,
      "organizer": "DOE",
      "industries": ["all"],
      "registrationDeadline": "2025-03-10T23:59:59Z",
      "status": "upcoming"
    }
  ],
  "meta": {...}
}
```

#### Register/Unregister for Event
```
POST /events/:id/register
Authorization: Required
Response 201: { "registered": true }

DELETE /events/:id/register
Authorization: Required
Response 200: { "registered": false }
```

---

### 4. Training Programs

#### List Training Programs
```
GET /training
Query Parameters:
  - page, pageSize
  - industries: string[]
  - format: string (online, in-person, hybrid, self-paced)
  - level: string (beginner, intermediate, advanced, expert)
  - isFree: boolean
  - maxCost: number

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "title": "AWS Solutions Architect Certification",
      "provider": "Amazon Web Services",
      "description": "...",
      "duration": "6 weeks",
      "format": "online",
      "level": "intermediate",
      "industries": ["ai", "cybersecurity"],
      "skills": ["AWS", "Cloud Architecture"],
      "cost": 300,
      "isFree": false,
      "placementRate": 92,
      "certificationType": "Professional Certification",
      "startDates": ["2025-01-15", "2025-02-15"],
      "enrollmentCount": 12500,
      "rating": 4.8,
      "reviewsCount": 3420
    }
  ],
  "meta": {...}
}
```

#### Enroll in Training
```
POST /training/:id/enroll
Authorization: Required
Response 201: { "enrolled": true }
```

---

### 5. Workforce Map

#### Get All States Data
```
GET /workforce/states

Response 200:
{
  "data": [
    {
      "id": "CA",
      "name": "California",
      "abbreviation": "CA",
      "totalJobs": 245000,
      "topIndustry": "ai",
      "growth": 23,
      "averageSalary": 145000,
      "topEmployers": [...],
      "trainingPrograms": 450,
      "universities": 32,
      "nationalLabs": ["LLNL", "LBNL", "SLAC"]
    }
  ]
}
```

#### Get State Details
```
GET /workforce/states/:id

Response 200: Full state data with detailed employer and program lists
```

---

### 6. Partners

#### List Partners
```
GET /partners
Query Parameters:
  - type: string (industry, government, national-lab, academia, nonprofit)
  - industries: string[]

Response 200: Array of partner objects
```

#### Get Partner Dashboard Stats (Partner role)
```
GET /partners/dashboard/stats
Authorization: Required (partner)

Response 200:
{
  "activePostings": 12,
  "totalApplications": 456,
  "hiredCount": 23,
  "pendingReviews": 34,
  "averageTimeToHire": 21,
  "profileViews": 1234
}
```

---

### 7. Challenges (Innovation Hub)

#### List Challenges
```
GET /challenges

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "title": "Quantum Error Correction Challenge",
      "description": "...",
      "sponsor": "DARPA",
      "prize": 500000,
      "deadline": "2025-06-01T23:59:59Z",
      "categories": ["quantum"],
      "requirements": [...],
      "submissions": 156,
      "status": "open"
    }
  ]
}
```

#### Submit to Challenge
```
POST /challenges/:id/submit
Authorization: Required
Content-Type: multipart/form-data

Request: Form data with submission files

Response 201: { "submitted": true, "submissionId": "uuid" }
```

#### Get Leaderboard
```
GET /challenges/leaderboard

Response 200:
{
  "data": [
    {
      "userId": "uuid",
      "userName": "John Doe",
      "organization": "MIT",
      "points": 2500,
      "challengesWon": 3,
      "rank": 1
    }
  ]
}
```

---

### 8. Audit Logging

#### Submit Audit Entries (Internal)
```
POST /audit
Authorization: Required
Content-Type: application/json

Request:
{
  "entries": [
    {
      "id": "uuid",
      "timestamp": "2024-12-01T10:00:00Z",
      "action": "job.apply",
      "details": {...},
      "severity": "info",
      "sessionId": "sess_xxx",
      "userAgent": "Mozilla/5.0...",
      "url": "/jobs"
    }
  ]
}

Response 202: { "accepted": true }
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Invalid email format"],
      "salary": ["Must be a positive number"]
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid auth token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

- **Authenticated requests:** 1000 requests/hour
- **Unauthenticated requests:** 100 requests/hour
- **Search endpoints:** 60 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1701432000
```

---

## Pagination

All list endpoints support pagination:

```
GET /jobs?page=2&pageSize=20
```

Response includes `meta` object with pagination info.

---

## Versioning

API version is included in the URL path: `/v1/`, `/v2/`

Breaking changes trigger a new major version. Old versions are supported for 12 months after deprecation.
