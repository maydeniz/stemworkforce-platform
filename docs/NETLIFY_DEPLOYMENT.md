# STEMWorkforce Platform - Supabase + Netlify Deployment Guide

## Overview

This guide walks you through deploying the STEMWorkforce platform using:
- **Supabase** - PostgreSQL database, authentication, and backend APIs
- **Netlify** - Frontend hosting with serverless functions

**Estimated Time:** 45-60 minutes

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Supabase Setup](#2-supabase-setup)
3. [Database Migration](#3-database-migration)
4. [Supabase Authentication](#4-supabase-authentication)
5. [Project Configuration](#5-project-configuration)
6. [Netlify Deployment](#6-netlify-deployment)
7. [Environment Variables](#7-environment-variables)
8. [Custom Domain Setup](#8-custom-domain-setup)
9. [Testing the Deployment](#9-testing-the-deployment)
10. [Netlify Functions (Optional)](#10-netlify-functions-optional)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites

### Required Accounts
- [ ] **GitHub account** - https://github.com
- [ ] **Supabase account** - https://supabase.com (free tier available)
- [ ] **Netlify account** - https://netlify.com (free tier available)

### Local Tools
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- Git (`git --version`)
- Netlify CLI (optional): `npm install -g netlify-cli`

---

## 2. Supabase Setup

### Step 2.1: Create a New Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in the details:
   - **Name:** `stemworkforce`
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to your users (e.g., `East US (North Virginia)`)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to provision

### Step 2.2: Get Your Project Credentials

Once the project is ready, go to **Settings → API** and note down:

```
Project URL:        https://xxxxxxxxxx.supabase.co
API Key (anon):     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API Key (service):  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
```

Go to **Settings → Database** and note down:

```
Host:               db.xxxxxxxxxx.supabase.co
Database name:      postgres
Port:               5432
User:               postgres
Password:           [your database password]

Connection string:  postgresql://postgres:[PASSWORD]@db.xxxxxxxxxx.supabase.co:5432/postgres
```

---

## 3. Database Migration

### Step 3.1: Access the SQL Editor

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**

### Step 3.2: Run the Schema Migration

Copy and paste the complete schema SQL from the **SUPABASE_VERCEL_DEPLOYMENT.md** file (Section 3.2), then click **"Run"**.

The schema includes:
- All enum types (user_role, industry_type, job_status, etc.)
- 15+ tables (users, jobs, events, training_programs, etc.)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps
- Auto-creation of user profiles on signup

### Step 3.3: Run Seed Data

After the schema is created, run the **SEED_DATA.sql** file to populate sample data.

### Step 3.4: Verify Migration

Run this query to verify tables were created:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see: `audit_logs`, `challenge_submissions`, `challenges`, `event_registrations`, `events`, `job_applications`, `jobs`, `notifications`, `organizations`, `saved_jobs`, `state_workforce_data`, `training_enrollments`, `training_programs`, `users`

---

## 4. Supabase Authentication

### Step 4.1: Configure Auth Providers

1. Go to **Authentication → Providers**
2. **Email** is enabled by default
3. Optionally enable OAuth providers:
   - **Google** - Requires Google Cloud Console credentials
   - **GitHub** - Requires GitHub OAuth app
   - **LinkedIn** - Requires LinkedIn app

### Step 4.2: Configure Auth URLs

1. Go to **Authentication → URL Configuration**
2. Set the following (update with your Netlify URL later):

```
Site URL:           https://your-site.netlify.app
Redirect URLs:      https://your-site.netlify.app/auth/callback
                    http://localhost:3000/auth/callback
                    http://localhost:8888/auth/callback
```

> **Note:** Port 8888 is Netlify CLI's default dev server port

---

## 5. Project Configuration

### Step 5.1: Clone/Extract the Project

```bash
# If you have the zip file
unzip STEMWorkforce_Deployable_Project.zip
cd stemworkforce-platform

# Or clone from GitHub
git clone https://github.com/YOUR_USERNAME/stemworkforce.git
cd stemworkforce
```

### Step 5.2: Install Dependencies

```bash
npm install
```

### Step 5.3: Create Environment File

Create `.env.local` in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_URL=http://localhost:3000
VITE_API_VERSION=v1

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_MODE=true
```

### Step 5.4: Create Netlify Configuration

Create `netlify.toml` in the project root:

```toml
[build]
  # Build command
  command = "npm run build"
  
  # Directory to publish
  publish = "dist"
  
  # Functions directory (optional)
  functions = "netlify/functions"

[build.environment]
  # Node version
  NODE_VERSION = "18"
  
  # NPM version
  NPM_VERSION = "9"

# Production context
[context.production]
  environment = { VITE_ENABLE_ANALYTICS = "true", VITE_ENABLE_DEBUG_MODE = "false" }

# Deploy Preview context
[context.deploy-preview]
  environment = { VITE_ENABLE_ANALYTICS = "false", VITE_ENABLE_DEBUG_MODE = "true" }

# Branch deploy context
[context.branch-deploy]
  environment = { VITE_ENABLE_ANALYTICS = "false", VITE_ENABLE_DEBUG_MODE = "true" }

# Dev context (netlify dev)
[context.dev]
  environment = { VITE_ENABLE_ANALYTICS = "false", VITE_ENABLE_DEBUG_MODE = "true" }

# Redirects for SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Cache static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache fonts
[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# API proxy (optional - if you have a backend)
# [[redirects]]
#   from = "/api/*"
#   to = "https://your-api.com/:splat"
#   status = 200
#   force = true
```

### Step 5.5: Create _redirects File (Backup)

Create `public/_redirects`:

```
# SPA fallback
/*    /index.html   200
```

### Step 5.6: Test Locally

```bash
# Start development server
npm run dev

# Or use Netlify CLI for full simulation
netlify dev
```

---

## 6. Netlify Deployment

### Option A: Deploy via Netlify Dashboard (Recommended for First Time)

#### Step 6.1: Push to GitHub

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - STEMWorkforce platform"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/stemworkforce.git
git branch -M main
git push -u origin main
```

#### Step 6.2: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select your `stemworkforce` repository

#### Step 6.3: Configure Build Settings

Netlify should auto-detect Vite. Verify these settings:

| Setting | Value |
|---------|-------|
| **Base directory** | (leave empty) |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Functions directory** | `netlify/functions` |

#### Step 6.4: Add Environment Variables

Before deploying, click **"Show advanced"** → **"New variable"**:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_APP_URL` | `https://your-site.netlify.app` |
| `VITE_ENABLE_MOCK_DATA` | `false` |

#### Step 6.5: Deploy

Click **"Deploy site"**

Netlify will:
1. Clone your repository
2. Install dependencies
3. Run the build command
4. Deploy to CDN

First deploy takes 2-5 minutes.

---

### Option B: Deploy via Netlify CLI

#### Step 6.1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 6.2: Login to Netlify

```bash
netlify login
```

This opens a browser window to authenticate.

#### Step 6.3: Initialize Site

```bash
# In your project directory
netlify init
```

Choose:
- **Create & configure a new site**
- Select your team
- Enter a site name (or leave blank for random)

#### Step 6.4: Set Environment Variables

```bash
# Set each variable
netlify env:set VITE_SUPABASE_URL "https://xxxxxxxxxx.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
netlify env:set VITE_APP_URL "https://your-site.netlify.app"
netlify env:set VITE_ENABLE_MOCK_DATA "false"

# Verify
netlify env:list
```

#### Step 6.5: Deploy

```bash
# Build and deploy
netlify deploy --prod

# Or just trigger a deploy (if connected to Git)
netlify deploy --prod --build
```

---

### Option C: Drag & Drop Deploy (Quick Testing)

1. Build locally: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder to the browser
4. Your site is live!

> **Note:** This method doesn't support environment variables at build time. Use for testing only.

---

## 7. Environment Variables

### Netlify Dashboard Method

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add each variable:

| Variable | Value | Scopes |
|----------|-------|--------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | All |
| `VITE_APP_URL` | `https://your-site.netlify.app` | Production |
| `VITE_APP_URL` | `http://localhost:3000` | Local development |
| `VITE_ENABLE_ANALYTICS` | `true` | Production |
| `VITE_ENABLE_ANALYTICS` | `false` | Deploy Previews, Local |

### Important Notes on Vite Environment Variables

- Variables must be prefixed with `VITE_` to be exposed to the client
- Variables are embedded at **build time**, not runtime
- After changing variables, you must **redeploy** for changes to take effect

### Trigger Redeploy After Adding Variables

```bash
# Via CLI
netlify deploy --prod --build

# Or in Dashboard: Deploys → Trigger deploy → Deploy site
```

---

## 8. Custom Domain Setup

### Step 8.1: Add Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `stemworkforce.com`
4. Click **"Verify"** → **"Add domain"**

### Step 8.2: Configure DNS

#### Option A: Netlify DNS (Recommended)

1. Click **"Set up Netlify DNS"**
2. Add the nameservers to your domain registrar:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

#### Option B: External DNS

Add these records to your DNS provider:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `75.2.60.5` |
| `CNAME` | `www` | `your-site.netlify.app` |

### Step 8.3: Enable HTTPS

1. Go to **Site settings** → **Domain management** → **HTTPS**
2. Click **"Verify DNS configuration"**
3. Click **"Provision certificate"**

Netlify provides free SSL certificates via Let's Encrypt.

### Step 8.4: Update Supabase Redirect URLs

After setting up your custom domain, update Supabase:

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Update:
   ```
   Site URL:       https://stemworkforce.com
   Redirect URLs:  https://stemworkforce.com/auth/callback
                   https://www.stemworkforce.com/auth/callback
                   https://your-site.netlify.app/auth/callback
   ```

### Step 8.5: Update Environment Variable

Update `VITE_APP_URL` in Netlify:
```
VITE_APP_URL=https://stemworkforce.com
```

Redeploy for changes to take effect.

---

## 9. Testing the Deployment

### Step 9.1: Verify Site Loads

1. Open your Netlify URL: `https://your-site.netlify.app`
2. Check that the homepage loads correctly
3. Navigate through different pages

### Step 9.2: Test Authentication

1. Click **"Get Started"** or **"Sign Up"**
2. Create a test account with email/password
3. Check your email for confirmation (if email confirmation is enabled)
4. Sign in with your credentials
5. Verify you reach the dashboard

### Step 9.3: Test Database Connection

1. After signing in, check the dashboard loads user data
2. Browse the jobs listing
3. Try saving a job
4. Check Supabase → **Table Editor** → `users` for your new user

### Step 9.4: Test SPA Routing

1. Navigate to a specific page: `/jobs`
2. Refresh the page (F5)
3. Page should load correctly (not 404)

### Step 9.5: Check Browser Console

Open DevTools (F12) → Console:
- No red errors related to Supabase
- No CORS errors
- API calls returning data

### Step 9.6: Verify Deploy Previews

1. Create a new branch in GitHub
2. Push a small change
3. Open a Pull Request
4. Netlify creates a unique preview URL
5. Test the preview works correctly

---

## 10. Netlify Functions (Optional)

If you need server-side functionality, you can use Netlify Functions (serverless).

### Step 10.1: Create Functions Directory

```bash
mkdir -p netlify/functions
```

### Step 10.2: Create a Sample Function

Create `netlify/functions/hello.ts`:

```typescript
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello from Netlify Functions!",
      timestamp: new Date().toISOString(),
    }),
  };
};

export { handler };
```

### Step 10.3: Create a Supabase Function

Create `netlify/functions/get-stats.ts`:

```typescript
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for server-side
);

const handler: Handler = async (event) => {
  try {
    // Get job count
    const { count: jobCount } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // Get event count
    const { count: eventCount } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "upcoming");

    // Get training count
    const { count: trainingCount } = await supabase
      .from("training_programs")
      .select("*", { count: "exact", head: true })
      .eq("active", true);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        jobs: jobCount || 0,
        events: eventCount || 0,
        training: trainingCount || 0,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch stats" }),
    };
  }
};

export { handler };
```

### Step 10.4: Add Server-Side Environment Variables

In Netlify Dashboard → **Environment variables**, add:

| Variable | Value | Note |
|----------|-------|------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Same as client |
| `SUPABASE_SERVICE_KEY` | `eyJ...service...` | **Service key** (not anon!) |

> ⚠️ **Warning:** Never expose the service key to the client!

### Step 10.5: Install Function Dependencies

```bash
npm install @netlify/functions
```

### Step 10.6: Test Functions Locally

```bash
netlify dev
```

Access functions at:
- `http://localhost:8888/.netlify/functions/hello`
- `http://localhost:8888/.netlify/functions/get-stats`

### Step 10.7: Call Functions from Frontend

```typescript
// In your React code
const fetchStats = async () => {
  const response = await fetch("/.netlify/functions/get-stats");
  const data = await response.json();
  return data;
};
```

---

## 11. Troubleshooting

### Issue: "Page Not Found" on Refresh

**Cause:** SPA routing not configured correctly.

**Solution:** Ensure `netlify.toml` has the redirect rule:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Or create `public/_redirects`:
```
/*    /index.html   200
```

---

### Issue: Environment Variables Not Working

**Cause:** Variables not prefixed with `VITE_` or not rebuilt after adding.

**Solution:**
1. Ensure all client-side variables start with `VITE_`
2. Trigger a new deploy after adding/changing variables
3. Clear cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

### Issue: "Failed to fetch" or CORS Errors

**Cause:** Supabase URL or key is incorrect.

**Solution:**
1. Verify `VITE_SUPABASE_URL` is exactly as shown in Supabase dashboard
2. Verify `VITE_SUPABASE_ANON_KEY` is the **anon** key, not service key
3. Check browser console for actual error messages

---

### Issue: Authentication Redirect Fails

**Cause:** Redirect URL not added to Supabase.

**Solution:**
1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add all possible URLs:
   ```
   https://your-site.netlify.app/auth/callback
   https://deploy-preview-*.your-site.netlify.app/auth/callback
   http://localhost:3000/auth/callback
   ```

---

### Issue: Build Fails with "Cannot find module"

**Cause:** Missing dependencies or wrong Node version.

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Ensure `netlify.toml` specifies Node 18:
   ```toml
   [build.environment]
     NODE_VERSION = "18"
   ```

---

### Issue: Deploy Preview Shows Old Content

**Cause:** Browser cache or CDN cache.

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear Netlify cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

### Issue: Functions Return 500 Error

**Cause:** Missing environment variables or code error.

**Solution:**
1. Check function logs: **Functions** → Select function → **View logs**
2. Verify server-side environment variables are set
3. Test locally with `netlify dev`

---

### Issue: SSL Certificate Not Working

**Cause:** DNS not propagated or misconfigured.

**Solution:**
1. Wait up to 24-48 hours for DNS propagation
2. Check DNS configuration in **Domain management**
3. Click **"Renew certificate"** if expired

---

## 📋 Deployment Checklist

### Before Deploying
- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] Seed data loaded
- [ ] Auth redirect URLs configured in Supabase
- [ ] `netlify.toml` created
- [ ] Code pushed to GitHub

### During Deployment
- [ ] Repository connected to Netlify
- [ ] Build settings verified
- [ ] Environment variables added
- [ ] First deploy successful

### After Deploying
- [ ] Site loads correctly
- [ ] Authentication works
- [ ] Database connection works
- [ ] SPA routing works (refresh test)
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled

---

## 🎉 Deployment Complete!

Your STEMWorkforce platform is now live on Netlify!

**URLs:**
- **Site:** `https://your-site.netlify.app`
- **Deploy Previews:** Automatic for PRs
- **Functions:** `https://your-site.netlify.app/.netlify/functions/[name]`

### Netlify Dashboard Features

- **Analytics:** Traffic and performance data
- **Forms:** Built-in form handling
- **Functions:** Serverless backend
- **Identity:** User management (alternative to Supabase Auth)
- **Split Testing:** A/B testing for deploys

### Next Steps

1. **Set up custom domain** for professional URL
2. **Enable Netlify Analytics** for traffic insights
3. **Configure deploy notifications** in Slack/email
4. **Set up branch deploys** for staging environment
5. **Add more seed data** via Supabase dashboard

### Support Resources

- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- Netlify Community: https://answers.netlify.com
- Supabase Discord: https://discord.supabase.com
