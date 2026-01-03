# STEMWorkforce Premium v10 - Deployment Guide

## Complete GitHub → Netlify → Supabase Deployment

This guide walks you through deploying STEMWorkforce Premium v10 from scratch, based on our actual deployment experience and lessons learned.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Upload to GitHub](#2-upload-to-github)
3. [Supabase Setup](#3-supabase-setup)
4. [Netlify Deployment](#4-netlify-deployment)
5. [Environment Variables](#5-environment-variables)
6. [Database Schema Setup](#6-database-schema-setup)
7. [Authentication Configuration](#7-authentication-configuration)
8. [Post-Deployment Verification](#8-post-deployment-verification)
9. [Common Issues & Solutions](#9-common-issues--solutions)

---

## 1. Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Netlify account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Git installed locally
- [ ] Node.js 18+ installed (for local testing)

---

## 2. Upload to GitHub

### Option A: New Repository (Recommended for Fresh Start)

```bash
# 1. Extract the zip file
unzip STEMWorkforce_Premium_v10.zip -d stemworkforce-v10
cd stemworkforce-v10

# 2. Initialize git repository
git init
git add .
git commit -m "Initial commit: STEMWorkforce Premium v10"

# 3. Create repository on GitHub (via web interface)
# Go to https://github.com/new
# Name: stemworkforce-platform (or your preferred name)
# Keep it private or public as needed
# Do NOT initialize with README (we already have one)

# 4. Connect and push
git remote add origin https://github.com/YOUR_USERNAME/stemworkforce-platform.git
git branch -M main
git push -u origin main
```

### Option B: Update Existing Repository

```bash
# 1. Clone your existing repo
git clone https://github.com/YOUR_USERNAME/stemworkforce-platform.git
cd stemworkforce-platform

# 2. Remove old files (keep .git folder)
ls -la  # verify .git exists
rm -rf src/ dist/ server/ docs/ public/ netlify/
rm -f package.json package-lock.json vite.config.ts tsconfig.json

# 3. Extract new files
unzip ../STEMWorkforce_Premium_v10.zip -d temp
cp -r temp/* .
rm -rf temp

# 4. Commit and push
git add .
git commit -m "Upgrade to STEMWorkforce Premium v10 - Partner Portal & Dashboards"
git push origin main
```

---

## 3. Supabase Setup

### Step 3.1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `stemworkforce-production` (or your preference)
   - **Database Password**: Generate a strong password and **SAVE IT**
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 3.2: Get Your API Keys

Once the project is ready:

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Netlify):

```
Project URL:        https://xxxxxxxxxx.supabase.co
anon (public) key:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
```

### Step 3.3: Get Database Connection String

1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxx.supabase.co:5432/postgres
```
5. **Replace `[YOUR-PASSWORD]`** with your actual database password

---

## 4. Netlify Deployment

### Step 4.1: Connect Repository

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub**
4. Authorize Netlify if prompted
5. Select your `stemworkforce-platform` repository

### Step 4.2: Configure Build Settings

On the deploy configuration page, set:

| Setting | Value |
|---------|-------|
| **Base directory** | _(leave empty)_ |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Functions directory** | `netlify/functions` |

### Step 4.3: Add Environment Variables

**CRITICAL**: Click **"Show advanced"** before deploying, then **"New variable"** for each:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` (your anon key) |
| `VITE_APP_ENV` | `production` |
| `NODE_VERSION` | `18` |

> ⚠️ **Important**: Variables prefixed with `VITE_` are exposed to the frontend. Never put secret keys here.

### Step 4.4: Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (usually 1-2 minutes)
3. Note your site URL: `https://random-name-12345.netlify.app`

---

## 5. Environment Variables

### Complete Variable Reference

**In Netlify (Site settings → Environment variables):**

```bash
# Required - Supabase Connection
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required - App Configuration
VITE_APP_ENV=production
VITE_APP_URL=https://your-site.netlify.app

# Required - Node Version
NODE_VERSION=18

# Optional - Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# For Netlify Functions (if using server-side features)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### Updating Environment Variables

After changing environment variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. This rebuilds with new variables

---

## 6. Database Schema Setup

### Step 6.1: Access SQL Editor

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**

### Step 6.2: Run Schema Migration

Copy and run the following SQL (this is the core schema):

```sql
-- =============================================
-- STEMWORKFORCE DATABASE SCHEMA v10
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'job_seeker' CHECK (role IN ('job_seeker', 'intern', 'learner', 'educator', 'education_provider', 'partner', 'employer', 'admin')),
  organization_name TEXT,
  organization_type TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('federal', 'national-lab', 'municipality', 'academic', 'private', 'nonprofit')),
  description TEXT,
  website TEXT,
  logo_url TEXT,
  location TEXT,
  employee_count TEXT,
  industry TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_type TEXT DEFAULT 'yearly',
  job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'fellowship')),
  industry TEXT,
  clearance_level TEXT DEFAULT 'none',
  citizenship_required TEXT,
  remote_type TEXT DEFAULT 'on-site' CHECK (remote_type IN ('on-site', 'remote', 'hybrid')),
  experience_level TEXT,
  skills TEXT[],
  benefits TEXT[],
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  resume_url TEXT,
  notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Saved Jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  format TEXT DEFAULT 'in-person' CHECK (format IN ('in-person', 'virtual', 'hybrid')),
  location TEXT,
  venue TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  registration_url TEXT,
  price TEXT,
  capacity INTEGER,
  attendees_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  industries TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered',
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Training Programs table
CREATE TABLE IF NOT EXISTS public.training_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  format TEXT,
  duration TEXT,
  price TEXT,
  skill_level TEXT,
  industries TEXT[],
  skills TEXT[],
  certification TEXT,
  enrollment_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Enrollments table
CREATE TABLE IF NOT EXISTS public.training_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES public.training_programs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(program_id, user_id)
);

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;

-- Users: Users can read all, update their own
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Organizations: Public read, owners can update
CREATE POLICY "Organizations are viewable by everyone" ON public.organizations FOR SELECT USING (true);

-- Jobs: Public read, org members can manage
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);

-- Job Applications: Users can manage their own
CREATE POLICY "Users can view own applications" ON public.job_applications FOR SELECT USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));
CREATE POLICY "Users can create applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));
CREATE POLICY "Users can update own applications" ON public.job_applications FOR UPDATE USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

-- Saved Jobs: Users can manage their own
CREATE POLICY "Users can view own saved jobs" ON public.saved_jobs FOR SELECT USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));
CREATE POLICY "Users can save jobs" ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));
CREATE POLICY "Users can unsave jobs" ON public.saved_jobs FOR DELETE USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

-- Events: Public read
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);

-- Event Registrations: Users can manage their own
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

-- Training Programs: Public read
CREATE POLICY "Training programs are viewable by everyone" ON public.training_programs FOR SELECT USING (true);

-- Training Enrollments: Users can manage their own
CREATE POLICY "Users can view own enrollments" ON public.training_enrollments FOR SELECT USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));
CREATE POLICY "Users can enroll in programs" ON public.training_enrollments FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON public.jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Function to handle user creation on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

3. Click **"Run"** to execute

### Step 6.3: Verify Tables

Go to **Table Editor** and verify these tables exist:
- users
- organizations
- jobs
- job_applications
- saved_jobs
- events
- event_registrations
- training_programs
- training_enrollments

---

## 7. Authentication Configuration

### Step 7.1: Configure Auth Providers

1. In Supabase, go to **Authentication** → **Providers**
2. **Email** is enabled by default
3. (Optional) Enable other providers like Google, GitHub, etc.

### Step 7.2: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-site.netlify.app`
3. Add **Redirect URLs**:
   ```
   https://your-site.netlify.app/auth/callback
   https://your-site.netlify.app/dashboard
   http://localhost:5173/auth/callback (for local development)
   ```

### Step 7.3: Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the confirmation and reset password emails
3. Update the **Confirm signup** template redirect to:
   ```
   {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup
   ```

---

## 8. Post-Deployment Verification

### Checklist

After deployment, verify:

- [ ] **Homepage loads**: Visit `https://your-site.netlify.app`
- [ ] **Navigation works**: Click through Jobs, Events, Training, Map, Partners
- [ ] **Sign up works**: Create a test account
- [ ] **Sign in works**: Log in with test account
- [ ] **Dashboard loads**: After login, dashboard appears based on role
- [ ] **Jobs page loads**: Job listings display (empty is OK initially)
- [ ] **Partners page loads**: All 6 partner types visible
- [ ] **Pricing page loads**: Tabs switch correctly

### Quick Test URLs

```
https://your-site.netlify.app/           # Homepage
https://your-site.netlify.app/jobs       # Jobs page
https://your-site.netlify.app/events     # Events page
https://your-site.netlify.app/map        # Workforce Map
https://your-site.netlify.app/training   # Training page
https://your-site.netlify.app/partners   # Partner Portal
https://your-site.netlify.app/pricing    # Pricing page
https://your-site.netlify.app/login      # Login page
https://your-site.netlify.app/register   # Registration page
https://your-site.netlify.app/dashboard  # Dashboard (requires login)
```

---

## 9. Common Issues & Solutions

### Issue 1: Build Fails with "Module not found"

**Symptoms**: Netlify build fails with import errors

**Solution**:
```bash
# Ensure all dependencies are installed
npm install

# Check for typos in imports
# All imports should use @/ prefix for src/ files
```

### Issue 2: "Invalid API Key" or Supabase Connection Errors

**Symptoms**: Console shows Supabase authentication errors

**Solution**:
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
2. Check for extra spaces or quotes in the values
3. Ensure you're using the **anon** key, not the service role key
4. Redeploy after fixing environment variables

### Issue 3: Authentication Redirect Fails

**Symptoms**: After login, user is not redirected or gets an error

**Solution**:
1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add your Netlify URL to **Redirect URLs**:
   ```
   https://your-site.netlify.app/auth/callback
   ```
3. Make sure **Site URL** matches your Netlify domain

### Issue 4: Database Tables Don't Exist

**Symptoms**: "relation does not exist" errors

**Solution**:
1. Go to Supabase **SQL Editor**
2. Run the schema migration SQL from Step 6.2
3. Verify tables in **Table Editor**

### Issue 5: Row Level Security Blocking Queries

**Symptoms**: Queries return empty results even with data

**Solution**:
1. Check RLS policies in **Authentication** → **Policies**
2. For testing, you can temporarily disable RLS:
   ```sql
   ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
   ```
3. Re-enable after testing with proper policies

### Issue 6: "NODE_VERSION" Not Recognized

**Symptoms**: Build uses old Node version

**Solution**:
1. In Netlify, add environment variable:
   - Key: `NODE_VERSION`
   - Value: `18`
2. Alternatively, add `.nvmrc` file to repo root:
   ```
   18
   ```

### Issue 7: Functions Not Working

**Symptoms**: Netlify functions return 404 or errors

**Solution**:
1. Verify `netlify.toml` has correct functions directory:
   ```toml
   [functions]
     directory = "netlify/functions"
   ```
2. Check function logs in Netlify dashboard under **Functions**

### Issue 8: Styles Not Loading (Blank/Unstyled Page)

**Symptoms**: Page loads but looks broken, no CSS

**Solution**:
1. Check that `dist/assets/` contains `.css` files
2. Verify **Publish directory** is set to `dist`
3. Clear browser cache and hard refresh

---

## Quick Reference

### Netlify Build Settings
```
Base directory:       (empty)
Build command:        npm run build
Publish directory:    dist
Functions directory:  netlify/functions
```

### Required Environment Variables
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_APP_ENV=production
NODE_VERSION=18
```

### Supabase URLs to Configure
```
Site URL:        https://your-site.netlify.app
Redirect URLs:   https://your-site.netlify.app/auth/callback
```

---

## Support

If you encounter issues not covered here:
1. Check Netlify deploy logs for build errors
2. Check browser console for runtime errors
3. Check Supabase logs for database/auth errors
4. Verify all environment variables are set correctly

---

*Last updated: December 2024 - STEMWorkforce Premium v10*
