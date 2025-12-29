# STEMWorkforce Platform - Supabase + Vercel Deployment Guide

## Overview

This guide walks you through deploying the STEMWorkforce platform using:
- **Supabase** - PostgreSQL database, authentication, and backend APIs
- **Vercel** - Frontend hosting with edge functions

**Estimated Time:** 45-60 minutes

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Supabase Setup](#2-supabase-setup)
3. [Database Migration](#3-database-migration)
4. [Supabase Authentication](#4-supabase-authentication)
5. [Project Configuration](#5-project-configuration)
6. [Vercel Deployment](#6-vercel-deployment)
7. [Environment Variables](#7-environment-variables)
8. [Testing the Deployment](#8-testing-the-deployment)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

### Required Accounts
- [ ] **GitHub account** - https://github.com
- [ ] **Supabase account** - https://supabase.com (free tier available)
- [ ] **Vercel account** - https://vercel.com (free tier available)

### Local Tools (for testing)
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- Git (`git --version`)

---

## 2. Supabase Setup

### Step 2.1: Create a New Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in the details:
   - **Name:** `stemworkforce`
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to your users (e.g., `East US` or `West US`)
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

Copy and paste the following SQL into the editor, then click **"Run"**:

```sql
-- ===========================================
-- STEMWORKFORCE DATABASE SCHEMA
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE user_role AS ENUM ('intern', 'jobseeker', 'educator', 'partner', 'admin');
CREATE TYPE clearance_level AS ENUM ('none', 'public_trust', 'secret', 'top_secret', 'top_secret_sci');
CREATE TYPE organization_type AS ENUM ('industry', 'government', 'national_lab', 'academia', 'nonprofit');
CREATE TYPE industry_type AS ENUM ('semiconductor', 'nuclear', 'ai', 'quantum', 'cybersecurity', 'aerospace', 'biotech', 'robotics', 'clean_energy', 'manufacturing');
CREATE TYPE job_type AS ENUM ('internship', 'full_time', 'part_time', 'contract', 'fellowship');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'closed', 'expired');
CREATE TYPE salary_period AS ENUM ('hourly', 'monthly', 'yearly');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE event_type AS ENUM ('conference', 'job_fair', 'networking', 'workshop', 'webinar', 'hackathon');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE registration_status AS ENUM ('registered', 'attended', 'cancelled', 'no_show');
CREATE TYPE training_format AS ENUM ('online', 'in_person', 'hybrid', 'self_paced');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'in_progress', 'completed', 'dropped');
CREATE TYPE challenge_status AS ENUM ('draft', 'open', 'judging', 'completed');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'application', 'event', 'system');
CREATE TYPE audit_severity AS ENUM ('info', 'warning', 'error');

-- ===========================================
-- TABLES
-- ===========================================

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type organization_type NOT NULL,
    logo TEXT,
    website TEXT,
    description TEXT,
    headquarters VARCHAR(255),
    locations TEXT[],
    industries industry_type[],
    size VARCHAR(50),
    founded INTEGER,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (linked to Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar TEXT,
    phone VARCHAR(50),
    role user_role DEFAULT 'jobseeker',
    organization VARCHAR(255),
    organization_id UUID REFERENCES organizations(id),
    clearance_level clearance_level DEFAULT 'none',
    bio TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    skills TEXT[],
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    benefits TEXT[],
    organization_id UUID NOT NULL REFERENCES organizations(id),
    posted_by_id UUID NOT NULL REFERENCES users(id),
    industry industry_type NOT NULL,
    type job_type NOT NULL,
    location VARCHAR(255) NOT NULL,
    remote BOOLEAN DEFAULT FALSE,
    clearance clearance_level DEFAULT 'none',
    skills TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'USD',
    salary_period salary_period DEFAULT 'yearly',
    status job_status DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    availability VARCHAR(200),
    expected_salary INTEGER,
    referral VARCHAR(200),
    answers JSONB,
    status application_status DEFAULT 'pending',
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Saved Jobs
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    organizer VARCHAR(255) NOT NULL,
    type event_type NOT NULL,
    industries industry_type[],
    location VARCHAR(255) NOT NULL,
    virtual BOOLEAN DEFAULT FALSE,
    virtual_url TEXT,
    capacity INTEGER,
    image TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ NOT NULL,
    status event_status DEFAULT 'upcoming',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status registration_status DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended_at TIMESTAMPTZ,
    UNIQUE(user_id, event_id)
);

-- Training Programs
CREATE TABLE training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    format training_format NOT NULL,
    level skill_level NOT NULL,
    industries industry_type[],
    skills TEXT[],
    cost DECIMAL(10,2) DEFAULT 0,
    placement_rate DECIMAL(5,2),
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    certification_type VARCHAR(255),
    start_dates TIMESTAMPTZ[],
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Enrollments
CREATE TABLE training_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'enrolled',
    progress INTEGER DEFAULT 0,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, program_id)
);

-- Challenges
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    sponsor VARCHAR(255) NOT NULL,
    prize DECIMAL(12,2) NOT NULL,
    categories industry_type[],
    requirements TEXT[],
    deadline TIMESTAMPTZ NOT NULL,
    status challenge_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Submissions
CREATE TABLE challenge_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    files TEXT[],
    score INTEGER,
    feedback TEXT,
    rank INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- State Workforce Data
CREATE TABLE state_workforce_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(2) UNIQUE NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    total_jobs INTEGER DEFAULT 0,
    top_industry industry_type NOT NULL,
    growth_rate DECIMAL(5,2) DEFAULT 0,
    average_salary INTEGER DEFAULT 0,
    training_programs INTEGER DEFAULT 0,
    universities INTEGER DEFAULT 0,
    national_labs TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    details JSONB NOT NULL,
    severity audit_severity DEFAULT 'info',
    session_id VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_organization_id ON users(organization_id);

CREATE INDEX idx_jobs_industry ON jobs(industry);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX idx_jobs_organization_id ON jobs(organization_id);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_remote ON jobs(remote);

CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at);

CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);

CREATE INDEX idx_training_programs_format ON training_programs(format);
CREATE INDEX idx_training_programs_level ON training_programs(level);
CREATE INDEX idx_training_programs_active ON training_programs(active);

CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_deadline ON challenges(deadline);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = auth_id);

-- Jobs policies (public read, authenticated write)
CREATE POLICY "Jobs are viewable by everyone" ON jobs
    FOR SELECT USING (status = 'active' AND expires_at > NOW());

CREATE POLICY "Partners can create jobs" ON jobs
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('partner', 'admin'))
    );

-- Job applications policies
CREATE POLICY "Users can view their own applications" ON job_applications
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

CREATE POLICY "Users can create applications" ON job_applications
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

-- Saved jobs policies
CREATE POLICY "Users can manage their saved jobs" ON saved_jobs
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

-- Events policies (public read)
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

-- Event registrations policies
CREATE POLICY "Users can manage their registrations" ON event_registrations
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

-- Training programs (public read)
CREATE POLICY "Training programs are viewable by everyone" ON training_programs
    FOR SELECT USING (active = true);

-- Training enrollments policies
CREATE POLICY "Users can manage their enrollments" ON training_enrollments
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    );

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (auth_id, email, first_name, last_name, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- SEED DATA
-- ===========================================

-- Insert sample organizations
INSERT INTO organizations (name, slug, type, industries, description, verified) VALUES
('Intel Corporation', 'intel', 'industry', ARRAY['semiconductor']::industry_type[], 'Leading semiconductor manufacturer', true),
('SpaceX', 'spacex', 'industry', ARRAY['aerospace']::industry_type[], 'Space exploration company', true),
('Los Alamos National Laboratory', 'lanl', 'national_lab', ARRAY['nuclear', 'quantum']::industry_type[], 'DOE National Laboratory', true),
('MIT', 'mit', 'academia', ARRAY['ai', 'quantum']::industry_type[], 'Massachusetts Institute of Technology', true),
('Department of Energy', 'doe', 'government', ARRAY['nuclear', 'clean_energy']::industry_type[], 'US Department of Energy', true);

-- Insert state workforce data
INSERT INTO state_workforce_data (state_code, state_name, total_jobs, top_industry, growth_rate, average_salary, training_programs, universities, national_labs) VALUES
('CA', 'California', 245000, 'ai', 23.5, 145000, 450, 32, ARRAY['LLNL', 'LBNL', 'SLAC']),
('TX', 'Texas', 189000, 'semiconductor', 18.2, 125000, 320, 28, ARRAY['Sandia']),
('WA', 'Washington', 156000, 'ai', 21.0, 140000, 280, 15, ARRAY['PNNL']),
('MA', 'Massachusetts', 98000, 'biotech', 19.5, 135000, 220, 45, ARRAY['MIT Lincoln Lab']),
('VA', 'Virginia', 134000, 'cybersecurity', 25.0, 130000, 190, 22, ARRAY[]),
('CO', 'Colorado', 87000, 'aerospace', 16.8, 120000, 175, 18, ARRAY['NREL']),
('NY', 'New York', 167000, 'ai', 20.3, 150000, 340, 52, ARRAY['BNL']),
('NM', 'New Mexico', 45000, 'nuclear', 12.5, 105000, 85, 8, ARRAY['LANL', 'Sandia']);

COMMIT;
```

### Step 3.3: Verify Migration

Run this query to verify tables were created:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all the tables listed.

---

## 4. Supabase Authentication

### Step 4.1: Configure Auth Providers

1. Go to **Authentication → Providers**
2. Enable **Email** provider (enabled by default)
3. Optionally enable:
   - **Google** (requires Google Cloud credentials)
   - **GitHub** (requires GitHub OAuth app)
   - **LinkedIn** (requires LinkedIn app)

### Step 4.2: Configure Auth Settings

1. Go to **Authentication → URL Configuration**
2. Set the following URLs:

```
Site URL:           https://your-app.vercel.app
Redirect URLs:      https://your-app.vercel.app/auth/callback
                    http://localhost:3000/auth/callback
```

### Step 4.3: Email Templates (Optional)

Go to **Authentication → Email Templates** to customize:
- Confirmation email
- Password reset email
- Magic link email

---

## 5. Project Configuration

### Step 5.1: Update Environment Variables

Create/update `.env.local` in your project root:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Config
VITE_APP_URL=http://localhost:3000
VITE_API_VERSION=v1

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=false
```

### Step 5.2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 5.3: Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types from your database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'intern' | 'jobseeker' | 'educator' | 'partner' | 'admin';
          // ... add other fields
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string;
          // ... add other fields
        };
      };
      // ... add other tables
    };
  };
};
```

### Step 5.4: Update Auth Context

Replace the Auth0 implementation with Supabase in `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Step 5.5: Update API Services

Update `src/services/api.ts` to use Supabase:

```typescript
import { supabase } from '@/lib/supabase';

// Jobs API
export const jobsApi = {
  list: async (filters?: any) => {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        organizations (id, name, logo)
      `)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString());

    if (filters?.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters?.remote !== undefined) {
      query = query.eq('remote', filters.remote);
    }
    if (filters?.query) {
      query = query.ilike('title', `%${filters.query}%`);
    }

    const { data, error, count } = await query
      .order('posted_at', { ascending: false })
      .range(
        ((filters?.page || 1) - 1) * (filters?.pageSize || 20),
        (filters?.page || 1) * (filters?.pageSize || 20) - 1
      );

    if (error) throw error;
    return { data, count };
  },

  get: async (id: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        organizations (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  apply: async (jobId: string, application: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        user_id: profile.id,
        ...application,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  save: async (jobId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    const { error } = await supabase
      .from('saved_jobs')
      .upsert({ user_id: profile.id, job_id: jobId });

    if (error) throw error;
  },

  unsave: async (jobId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', profile.id)
      .eq('job_id', jobId);

    if (error) throw error;
  },
};

// Events API
export const eventsApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gt('start_date', new Date().toISOString())
      .order('start_date');

    if (error) throw error;
    return { data };
  },

  register: async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    const { error } = await supabase
      .from('event_registrations')
      .insert({ user_id: profile.id, event_id: eventId });

    if (error) throw error;
  },
};

// Training API
export const trainingApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('training_programs')
      .select('*')
      .eq('active', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return { data };
  },

  enroll: async (programId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    const { error } = await supabase
      .from('training_enrollments')
      .insert({ user_id: profile.id, program_id: programId });

    if (error) throw error;
  },
};

// Workforce Map API
export const workforceApi = {
  getStates: async () => {
    const { data, error } = await supabase
      .from('state_workforce_data')
      .select('*')
      .order('total_jobs', { ascending: false });

    if (error) throw error;
    return { data };
  },
};

// User API
export const userApi = {
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  updateProfile: async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('auth_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getDashboardStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    const [applications, savedJobs, events, trainings] = await Promise.all([
      supabase.from('job_applications').select('id', { count: 'exact' }).eq('user_id', profile.id),
      supabase.from('saved_jobs').select('id', { count: 'exact' }).eq('user_id', profile.id),
      supabase.from('event_registrations').select('id', { count: 'exact' }).eq('user_id', profile.id),
      supabase.from('training_enrollments').select('id', { count: 'exact' }).eq('user_id', profile.id),
    ]);

    return {
      activeApplications: applications.count || 0,
      savedJobs: savedJobs.count || 0,
      upcomingEvents: events.count || 0,
      completedTrainings: trainings.count || 0,
    };
  },
};
```

### Step 5.6: Create Auth Callback Page

Create `src/pages/AuthCallback.tsx`:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { PageLoader } from '@/components/common';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });
  }, [navigate]);

  return <PageLoader message="Completing sign in..." />;
};

export default AuthCallback;
```

Add the route to `App.tsx`:

```typescript
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 6. Vercel Deployment

### Step 6.1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - STEMWorkforce platform"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/stemworkforce.git
git branch -M main
git push -u origin main
```

### Step 6.2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `stemworkforce` repository
4. Configure the project:

```
Framework Preset:     Vite
Root Directory:       ./
Build Command:        npm run build
Output Directory:     dist
Install Command:      npm install
```

5. Click **"Deploy"**

### Step 6.3: Add Environment Variables

In Vercel dashboard → Your Project → **Settings → Environment Variables**

Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxxxx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production, Preview, Development |
| `VITE_APP_URL` | `https://your-app.vercel.app` | Production |
| `VITE_APP_URL` | `http://localhost:3000` | Development |

### Step 6.4: Update Supabase Redirect URLs

Go back to Supabase → **Authentication → URL Configuration**

Update:
```
Site URL:       https://your-app.vercel.app
Redirect URLs:  https://your-app.vercel.app/auth/callback
                https://your-app-git-*.vercel.app/auth/callback
```

### Step 6.5: Redeploy

After adding environment variables, redeploy:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

Or use Vercel dashboard → **Deployments → Redeploy**

---

## 7. Environment Variables Summary

### Supabase Dashboard
```
Project URL:      https://xxxxxxxxxx.supabase.co
Anon Key:         eyJhbGci...
Service Key:      eyJhbGci... (keep secret, for server-side only)
```

### Vercel Environment Variables
```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_APP_URL=https://your-app.vercel.app
```

### Local Development (.env.local)
```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_APP_URL=http://localhost:3000
VITE_ENABLE_MOCK_DATA=false
```

---

## 8. Testing the Deployment

### Step 8.1: Test Authentication

1. Go to your deployed URL
2. Click "Get Started" or "Sign Up"
3. Create a test account
4. Check email for confirmation
5. Sign in with your credentials
6. Verify you can access the dashboard

### Step 8.2: Test Database Connection

1. Go to Supabase → **Table Editor**
2. Check that the `users` table has your new user
3. Verify the trigger created the user profile

### Step 8.3: Test Core Features

- [ ] Browse jobs listing
- [ ] View job details
- [ ] Apply to a job (requires auth)
- [ ] Save/unsave jobs
- [ ] View events
- [ ] View training programs
- [ ] View workforce map data
- [ ] Update user profile

### Step 8.4: Check Logs

**Vercel Logs:**
- Project Dashboard → **Functions** → View logs

**Supabase Logs:**
- Dashboard → **Database** → **Logs**

---

## 9. Troubleshooting

### Issue: "Invalid API key"
**Solution:** Double-check your `VITE_SUPABASE_ANON_KEY` is correct and starts with `eyJ...`

### Issue: "relation does not exist"
**Solution:** Run the database migration SQL again in Supabase SQL Editor

### Issue: Auth redirect not working
**Solution:** Ensure your Vercel URL is added to Supabase redirect URLs (including preview URLs with wildcards)

### Issue: CORS errors
**Solution:** Supabase handles CORS automatically. If issues persist, check your Supabase project URL.

### Issue: User profile not created on signup
**Solution:** Check if the `handle_new_user` function and trigger exist:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: RLS blocking queries
**Solution:** For testing, you can temporarily disable RLS:
```sql
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
```
Remember to re-enable for production!

---

## 🎉 Deployment Complete!

Your STEMWorkforce platform should now be live at:
- **Frontend:** `https://your-app.vercel.app`
- **Database:** `https://xxxxxxxxxx.supabase.co`

### Next Steps

1. **Add sample job data** via Supabase Table Editor
2. **Configure custom domain** in Vercel settings
3. **Enable additional auth providers** (Google, LinkedIn)
4. **Set up Supabase Storage** for file uploads (resumes)
5. **Configure Edge Functions** for complex backend logic

### Support Resources

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Discord: https://discord.supabase.com
