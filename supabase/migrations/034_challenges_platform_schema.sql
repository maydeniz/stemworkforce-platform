-- ===========================================
-- Innovation Challenges Platform Schema
-- Migration: 034_challenges_platform_schema.sql
-- Comprehensive challenge system for employers/partners
-- ===========================================

-- Challenge Sponsors table
CREATE TABLE IF NOT EXISTS challenge_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    type TEXT NOT NULL CHECK (type IN ('company', 'government', 'national-lab', 'university', 'nonprofit', 'consortium')),
    website TEXT,
    description TEXT,
    contact_email TEXT,
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main Challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID NOT NULL REFERENCES challenge_sponsors(id) ON DELETE CASCADE,

    -- Basic Info
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ideation', 'prototype', 'solution', 'research', 'hackathon', 'grand-challenge')),

    -- Timeline
    registration_deadline TIMESTAMPTZ NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    judging_start TIMESTAMPTZ NOT NULL,
    judging_end TIMESTAMPTZ NOT NULL,
    winners_announced_date TIMESTAMPTZ NOT NULL,
    current_phase INTEGER DEFAULT 0,

    -- Eligibility (stored as JSONB)
    eligibility JSONB NOT NULL DEFAULT '{
        "mustAcceptTerms": true,
        "ipAssignment": "shared",
        "ndaRequired": false
    }'::jsonb,

    -- Requirements (stored as JSONB)
    requirements JSONB NOT NULL DEFAULT '{
        "deliverables": [],
        "documentationRequired": true,
        "videoRequired": false,
        "openSourceRequired": false,
        "repositoryRequired": false
    }'::jsonb,

    -- Judging criteria (stored as JSONB)
    judging_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Solver Configuration
    solver_types TEXT[] NOT NULL DEFAULT ARRAY['open'],
    team_size_min INTEGER DEFAULT 1,
    team_size_max INTEGER DEFAULT 10,
    max_submissions_per_solver INTEGER DEFAULT 1,

    -- Categories
    industries TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',

    -- Awards
    total_prize_pool DECIMAL(12, 2) NOT NULL DEFAULT 0,
    non_monetary_benefits TEXT[] DEFAULT '{}',

    -- Status & Metrics
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending-approval', 'registration-open', 'active',
        'submission-closed', 'judging', 'winners-announced', 'completed', 'cancelled'
    )),
    submissions_count INTEGER DEFAULT 0,
    registered_solvers_count INTEGER DEFAULT 0,
    teams_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,

    -- Settings
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invite-only')),
    discussion_enabled BOOLEAN DEFAULT TRUE,
    team_formation_enabled BOOLEAN DEFAULT TRUE,

    -- Slack Integration
    slack_channel_id TEXT,
    slack_channel_url TEXT,

    -- Images
    banner_image TEXT,
    thumbnail_image TEXT,

    -- Meta
    featured_rank INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Challenge Phases table
CREATE TABLE IF NOT EXISTS challenge_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    phase_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    prize_amount DECIMAL(12, 2),
    winners_count INTEGER,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'judging', 'completed')),
    requirements TEXT[],
    deliverables TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, phase_number)
);

-- Challenge Co-Sponsors table
CREATE TABLE IF NOT EXISTS challenge_co_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    sponsor_id UUID NOT NULL REFERENCES challenge_sponsors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, sponsor_id)
);

-- Challenge Awards table
CREATE TABLE IF NOT EXISTS challenge_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    title TEXT NOT NULL,
    prize_amount DECIMAL(12, 2) NOT NULL,
    additional_benefits TEXT[],
    winners_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, rank)
);

-- Challenge Resources table
CREATE TABLE IF NOT EXISTS challenge_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('dataset', 'api', 'documentation', 'tutorial', 'tool', 'mentor', 'credits')),
    url TEXT,
    access_instructions TEXT,
    restricted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Solvers (registrations) table
CREATE TABLE IF NOT EXISTS challenge_solvers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'team-member')),
    team_id UUID,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    eligibility_verified BOOLEAN DEFAULT FALSE,
    agreed_to_terms BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'active', 'submitted', 'disqualified', 'withdrawn')),
    skills TEXT[],
    UNIQUE(challenge_id, user_id)
);

-- Challenge Teams table
CREATE TABLE IF NOT EXISTS challenge_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 5,
    is_recruiting BOOLEAN DEFAULT TRUE,
    skills_needed TEXT[],
    slack_channel_id TEXT,
    status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'complete', 'active', 'submitted', 'disqualified')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, name)
);

-- Add foreign key for team_id in challenge_solvers
ALTER TABLE challenge_solvers
ADD CONSTRAINT fk_challenge_solvers_team
FOREIGN KEY (team_id) REFERENCES challenge_teams(id) ON DELETE SET NULL;

-- Challenge Team Members table
CREATE TABLE IF NOT EXISTS challenge_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES challenge_teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'member')),
    skills TEXT[],
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    UNIQUE(team_id, user_id)
);

-- Challenge Submissions table
CREATE TABLE IF NOT EXISTS challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES challenge_phases(id) ON DELETE SET NULL,
    solver_id UUID NOT NULL,  -- Can be user_id or team_id
    solver_type TEXT NOT NULL CHECK (solver_type IN ('individual', 'team')),

    -- Content
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Deliverables (stored as JSONB)
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Links
    repository_url TEXT,
    demo_url TEXT,
    video_url TEXT,

    -- AI Evaluation (stored as JSONB)
    ai_evaluation JSONB,

    -- Meta
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'under-review', 'passed-screening',
        'in-judging', 'scored', 'winner', 'finalist', 'rejected', 'disqualified'
    )),

    -- Judging
    final_score DECIMAL(5, 2),
    rank INTEGER,
    feedback TEXT
);

-- Submission Scores table
CREATE TABLE IF NOT EXISTS submission_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES challenge_submissions(id) ON DELETE CASCADE,
    judge_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    criteria_id TEXT NOT NULL,
    criteria_name TEXT,
    score DECIMAL(5, 2) NOT NULL,
    max_score DECIMAL(5, 2) NOT NULL,
    comments TEXT,
    scored_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(submission_id, judge_id, criteria_id)
);

-- Challenge Judges table
CREATE TABLE IF NOT EXISTS challenge_judges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'judge' CHECK (role IN ('screener', 'judge', 'lead-judge')),
    expertise TEXT[],
    assigned_submissions UUID[],
    status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'confirmed', 'declined', 'active', 'completed')),
    conflicts_of_interest UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- Challenge Comments/Discussions table
CREATE TABLE IF NOT EXISTS challenge_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES challenge_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_announcement BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Announcements table
CREATE TABLE IF NOT EXISTS challenge_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'deadline', 'update', 'winner')),
    sent_to_slack BOOLEAN DEFAULT FALSE,
    sent_to_email BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Views tracking
CREATE TABLE IF NOT EXISTS challenge_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Saves/Bookmarks
CREATE TABLE IF NOT EXISTS challenge_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- AI Evaluation Logs (for audit trail)
CREATE TABLE IF NOT EXISTS ai_evaluation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES challenge_submissions(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('claude', 'gemini', 'chatgpt')),
    prompt_hash TEXT NOT NULL,
    response_hash TEXT NOT NULL,
    tokens_used INTEGER,
    evaluation_result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slack Integration Logs
CREATE TABLE IF NOT EXISTS slack_integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,
    team_id UUID REFERENCES challenge_teams(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    channel_id TEXT,
    message_ts TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_challenges_sponsor ON challenges(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_industries ON challenges USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_challenges_skills ON challenges USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON challenges(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_challenges_featured ON challenges(featured_rank) WHERE featured_rank IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_challenge_solvers_challenge ON challenge_solvers(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_solvers_user ON challenge_solvers(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_teams_challenge ON challenge_teams(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_solver ON challenge_submissions(solver_id);
CREATE INDEX IF NOT EXISTS idx_challenge_comments_challenge ON challenge_comments(challenge_id);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE challenge_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_solvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_saves ENABLE ROW LEVEL SECURITY;

-- Public read access for published challenges
CREATE POLICY "Public read access for challenges"
ON challenges FOR SELECT
TO public
USING (visibility = 'public' AND status NOT IN ('draft', 'pending-approval'));

-- Sponsors can manage their own challenges
CREATE POLICY "Sponsors can manage own challenges"
ON challenges FOR ALL
TO authenticated
USING (
    sponsor_id IN (
        SELECT id FROM challenge_sponsors WHERE user_id = auth.uid()
    )
);

-- Public read for sponsors
CREATE POLICY "Public read access for challenge sponsors"
ON challenge_sponsors FOR SELECT
TO public
USING (active = TRUE);

-- Users can register as solvers
CREATE POLICY "Users can register as solvers"
ON challenge_solvers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can view their own solver registrations
CREATE POLICY "Users can view own solver registrations"
ON challenge_solvers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can manage their own teams
CREATE POLICY "Users can manage own teams"
ON challenge_teams FOR ALL
TO authenticated
USING (leader_id = auth.uid());

-- Team members can view their teams
CREATE POLICY "Team members can view teams"
ON challenge_teams FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT team_id FROM challenge_team_members WHERE user_id = auth.uid()
    )
);

-- Users can manage their own submissions
CREATE POLICY "Users can manage own submissions"
ON challenge_submissions FOR ALL
TO authenticated
USING (
    solver_id = auth.uid()::text OR
    solver_id IN (
        SELECT id::text FROM challenge_teams WHERE leader_id = auth.uid()
    )
);

-- Judges can view assigned submissions
CREATE POLICY "Judges can view assigned submissions"
ON challenge_submissions FOR SELECT
TO authenticated
USING (
    challenge_id IN (
        SELECT challenge_id FROM challenge_judges WHERE user_id = auth.uid()
    )
);

-- Users can save challenges
CREATE POLICY "Users can manage own saves"
ON challenge_saves FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Public read for comments on public challenges
CREATE POLICY "Public read access for challenge comments"
ON challenge_comments FOR SELECT
TO public
USING (
    challenge_id IN (
        SELECT id FROM challenges WHERE visibility = 'public'
    )
);

-- Users can create comments
CREATE POLICY "Users can create comments"
ON challenge_comments FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Update challenge metrics
CREATE OR REPLACE FUNCTION update_challenge_metrics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'challenge_solvers' THEN
        UPDATE challenges SET
            registered_solvers_count = (
                SELECT COUNT(*) FROM challenge_solvers WHERE challenge_id = COALESCE(NEW.challenge_id, OLD.challenge_id)
            ),
            updated_at = NOW()
        WHERE id = COALESCE(NEW.challenge_id, OLD.challenge_id);
    ELSIF TG_TABLE_NAME = 'challenge_teams' THEN
        UPDATE challenges SET
            teams_count = (
                SELECT COUNT(*) FROM challenge_teams WHERE challenge_id = COALESCE(NEW.challenge_id, OLD.challenge_id)
            ),
            updated_at = NOW()
        WHERE id = COALESCE(NEW.challenge_id, OLD.challenge_id);
    ELSIF TG_TABLE_NAME = 'challenge_submissions' THEN
        UPDATE challenges SET
            submissions_count = (
                SELECT COUNT(*) FROM challenge_submissions
                WHERE challenge_id = COALESCE(NEW.challenge_id, OLD.challenge_id)
                AND status != 'draft'
            ),
            updated_at = NOW()
        WHERE id = COALESCE(NEW.challenge_id, OLD.challenge_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for metrics
CREATE TRIGGER update_solver_count
AFTER INSERT OR DELETE ON challenge_solvers
FOR EACH ROW EXECUTE FUNCTION update_challenge_metrics();

CREATE TRIGGER update_team_count
AFTER INSERT OR DELETE ON challenge_teams
FOR EACH ROW EXECUTE FUNCTION update_challenge_metrics();

CREATE TRIGGER update_submission_count
AFTER INSERT OR UPDATE OR DELETE ON challenge_submissions
FOR EACH ROW EXECUTE FUNCTION update_challenge_metrics();

-- Increment view count function
CREATE OR REPLACE FUNCTION increment_challenge_views(challenge_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE challenges SET views_count = views_count + 1 WHERE id = challenge_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate unique slug function
CREATE OR REPLACE FUNCTION generate_challenge_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    final_slug := base_slug;

    WHILE EXISTS (SELECT 1 FROM challenges WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- SAMPLE DATA
-- ===========================================

-- Insert sample sponsors
INSERT INTO challenge_sponsors (id, name, slug, type, website, description, verified, active)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'Intel Corporation', 'intel', 'company', 'https://intel.com', 'Leading semiconductor manufacturing company', TRUE, TRUE),
    ('s2222222-2222-2222-2222-222222222222', 'NASA', 'nasa', 'government', 'https://nasa.gov', 'National Aeronautics and Space Administration', TRUE, TRUE),
    ('s3333333-3333-3333-3333-333333333333', 'MIT', 'mit', 'university', 'https://mit.edu', 'Massachusetts Institute of Technology', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample challenges
INSERT INTO challenges (
    id, sponsor_id, title, slug, short_description, description, problem_statement, type,
    registration_deadline, submission_deadline, judging_start, judging_end, winners_announced_date,
    eligibility, requirements, judging_criteria,
    solver_types, team_size_min, team_size_max, max_submissions_per_solver,
    industries, skills, tags,
    total_prize_pool, non_monetary_benefits,
    status, visibility, discussion_enabled, team_formation_enabled,
    featured_rank
)
VALUES
    (
        'c1111111-1111-1111-1111-111111111111',
        's1111111-1111-1111-1111-111111111111',
        'Semiconductor Manufacturing AI Challenge',
        'semiconductor-manufacturing-ai-challenge',
        'Develop AI solutions to improve semiconductor fab yield and efficiency',
        'Intel is seeking innovative AI/ML solutions to optimize semiconductor manufacturing processes. Participants will develop algorithms to predict equipment failures, optimize process parameters, and improve overall fab yield. Access to anonymized manufacturing data will be provided to registered participants.',
        'Semiconductor fabs generate terabytes of sensor data daily, yet extracting actionable insights remains challenging. How can we use AI to predict defects before they occur and optimize production in real-time?',
        'solution',
        '2025-03-01 23:59:59-08:00',
        '2025-04-15 23:59:59-08:00',
        '2025-04-16 00:00:00-08:00',
        '2025-04-30 23:59:59-08:00',
        '2025-05-15 12:00:00-08:00',
        '{
            "mustAcceptTerms": true,
            "ipAssignment": "shared",
            "ndaRequired": true,
            "minAge": 18,
            "experienceLevel": "any"
        }'::jsonb,
        '{
            "deliverables": [
                {"id": "1", "name": "Technical Documentation", "description": "Detailed technical report", "type": "document", "required": true},
                {"id": "2", "name": "Source Code", "description": "GitHub repository link", "type": "code", "required": true},
                {"id": "3", "name": "Demo Video", "description": "3-minute solution demo", "type": "video", "required": true}
            ],
            "documentationRequired": true,
            "videoRequired": true,
            "videoDurationMax": 180,
            "openSourceRequired": false,
            "repositoryRequired": true
        }'::jsonb,
        '[
            {"id": "1", "name": "Technical Innovation", "description": "Novelty and creativity of approach", "weight": 30, "maxScore": 10},
            {"id": "2", "name": "Accuracy & Performance", "description": "Prediction accuracy and efficiency", "weight": 35, "maxScore": 10},
            {"id": "3", "name": "Scalability", "description": "Ability to scale to production", "weight": 20, "maxScore": 10},
            {"id": "4", "name": "Documentation", "description": "Quality of technical documentation", "weight": 15, "maxScore": 10}
        ]'::jsonb,
        ARRAY['individual', 'team', 'academic'],
        1, 5, 3,
        ARRAY['semiconductor', 'ai', 'manufacturing'],
        ARRAY['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
        ARRAY['AI', 'Manufacturing', 'Predictive Maintenance', 'Intel'],
        100000.00,
        ARRAY['Intel mentorship', 'Potential internship opportunities', 'Conference presentation'],
        'registration-open',
        'public',
        TRUE,
        TRUE,
        1
    ),
    (
        'c2222222-2222-2222-2222-222222222222',
        's2222222-2222-2222-2222-222222222222',
        'Space Debris Tracking Hackathon',
        'space-debris-tracking-hackathon',
        '48-hour hackathon to improve space debris tracking algorithms',
        'NASA challenges participants to develop innovative solutions for tracking and predicting the movement of space debris. With over 27,000 pieces of orbital debris tracked, and millions of smaller pieces untracked, improved tracking is critical for the future of space exploration.',
        'Space debris poses an increasing threat to satellites and spacecraft. Current tracking methods struggle with smaller debris. Can you develop better algorithms to detect, track, and predict debris trajectories?',
        'hackathon',
        '2025-02-20 23:59:59-05:00',
        '2025-03-01 18:00:00-05:00',
        '2025-03-02 00:00:00-05:00',
        '2025-03-07 23:59:59-05:00',
        '2025-03-15 12:00:00-05:00',
        '{
            "mustAcceptTerms": true,
            "ipAssignment": "solver",
            "ndaRequired": false,
            "studentOnly": false
        }'::jsonb,
        '{
            "deliverables": [
                {"id": "1", "name": "Working Prototype", "description": "Functional demo", "type": "prototype", "required": true},
                {"id": "2", "name": "Pitch Deck", "description": "5-slide presentation", "type": "presentation", "required": true}
            ],
            "documentationRequired": true,
            "videoRequired": false,
            "openSourceRequired": true,
            "repositoryRequired": true
        }'::jsonb,
        '[
            {"id": "1", "name": "Innovation", "description": "Creative approach to the problem", "weight": 25, "maxScore": 10},
            {"id": "2", "name": "Technical Feasibility", "description": "Can it work in practice?", "weight": 30, "maxScore": 10},
            {"id": "3", "name": "Impact Potential", "description": "Potential real-world impact", "weight": 25, "maxScore": 10},
            {"id": "4", "name": "Presentation", "description": "Quality of pitch", "weight": 20, "maxScore": 10}
        ]'::jsonb,
        ARRAY['individual', 'team', 'academic', 'small-business'],
        1, 4, 1,
        ARRAY['aerospace', 'ai'],
        ARRAY['Python', 'Computer Vision', 'Orbital Mechanics', 'Signal Processing'],
        ARRAY['NASA', 'Space', 'Hackathon', 'Debris'],
        50000.00,
        ARRAY['NASA facility tour', 'Meet NASA engineers', 'Publication opportunity'],
        'registration-open',
        'public',
        TRUE,
        TRUE,
        2
    ),
    (
        'c3333333-3333-3333-3333-333333333333',
        's3333333-3333-3333-3333-333333333333',
        'Quantum Computing Research Challenge',
        'quantum-computing-research-challenge',
        'Advance quantum error correction for near-term quantum computers',
        'MIT invites researchers to tackle one of quantum computing''s greatest challenges: error correction on NISQ devices. Participants will work to develop novel error mitigation techniques that can run on today''s noisy quantum hardware.',
        'Quantum computers are powerful but error-prone. Current error correction codes require more qubits than available on near-term devices. How can we achieve fault tolerance with limited quantum resources?',
        'research',
        '2025-04-01 23:59:59-05:00',
        '2025-06-30 23:59:59-05:00',
        '2025-07-01 00:00:00-05:00',
        '2025-08-15 23:59:59-05:00',
        '2025-09-01 12:00:00-05:00',
        '{
            "mustAcceptTerms": true,
            "ipAssignment": "solver",
            "ndaRequired": false,
            "experienceLevel": "experienced",
            "requiredSkills": ["Quantum Computing", "Linear Algebra"]
        }'::jsonb,
        '{
            "deliverables": [
                {"id": "1", "name": "Research Paper", "description": "Full research paper (IEEE format)", "type": "document", "required": true},
                {"id": "2", "name": "Code Repository", "description": "Implementation code", "type": "code", "required": true},
                {"id": "3", "name": "Experimental Results", "description": "Benchmarking data", "type": "dataset", "required": true}
            ],
            "documentationRequired": true,
            "videoRequired": false,
            "openSourceRequired": true,
            "repositoryRequired": true
        }'::jsonb,
        '[
            {"id": "1", "name": "Scientific Merit", "description": "Novel contribution to the field", "weight": 35, "maxScore": 10},
            {"id": "2", "name": "Technical Rigor", "description": "Sound methodology and analysis", "weight": 30, "maxScore": 10},
            {"id": "3", "name": "Practical Applicability", "description": "Can be implemented on real hardware", "weight": 20, "maxScore": 10},
            {"id": "4", "name": "Reproducibility", "description": "Clear documentation and code", "weight": 15, "maxScore": 10}
        ]'::jsonb,
        ARRAY['individual', 'team', 'academic'],
        1, 3, 1,
        ARRAY['quantum'],
        ARRAY['Quantum Computing', 'Qiskit', 'Python', 'Linear Algebra', 'Error Correction'],
        ARRAY['MIT', 'Quantum', 'Research', 'NISQ'],
        75000.00,
        ARRAY['Publication in MIT journal', 'Research collaboration', 'IBM Quantum access'],
        'registration-open',
        'public',
        TRUE,
        FALSE,
        3
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Insert sample awards
INSERT INTO challenge_awards (challenge_id, rank, title, prize_amount, additional_benefits, winners_count)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 1, 'Grand Prize', 50000.00, ARRAY['Intel mentorship program', 'Conference presentation'], 1),
    ('c1111111-1111-1111-1111-111111111111', 2, 'Runner Up', 30000.00, ARRAY['Intel mentorship program'], 2),
    ('c1111111-1111-1111-1111-111111111111', 3, 'Honorable Mention', 10000.00, NULL, 2),
    ('c2222222-2222-2222-2222-222222222222', 1, 'First Place', 25000.00, ARRAY['NASA facility tour'], 1),
    ('c2222222-2222-2222-2222-222222222222', 2, 'Second Place', 15000.00, NULL, 1),
    ('c2222222-2222-2222-2222-222222222222', 3, 'Third Place', 10000.00, NULL, 1),
    ('c3333333-3333-3333-3333-333333333333', 1, 'Best Research', 40000.00, ARRAY['Publication opportunity', 'IBM Quantum credits'], 1),
    ('c3333333-3333-3333-3333-333333333333', 2, 'Runner Up', 25000.00, ARRAY['Publication opportunity'], 1),
    ('c3333333-3333-3333-3333-333333333333', 3, 'Best Student Entry', 10000.00, ARRAY['MIT summer research position'], 1)
ON CONFLICT DO NOTHING;

-- Insert sample resources
INSERT INTO challenge_resources (challenge_id, name, description, type, url, restricted)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Training Dataset', 'Anonymized fab sensor data (10GB)', 'dataset', NULL, TRUE),
    ('c1111111-1111-1111-1111-111111111111', 'Intel DevCloud Access', 'Free compute resources for participants', 'credits', 'https://devcloud.intel.com', TRUE),
    ('c1111111-1111-1111-1111-111111111111', 'Starter Notebook', 'Jupyter notebook with baseline model', 'tutorial', 'https://github.com/intel/challenge-starter', FALSE),
    ('c2222222-2222-2222-2222-222222222222', 'TLE Data API', 'Real-time orbital element data', 'api', 'https://celestrak.org/NORAD/elements/', FALSE),
    ('c2222222-2222-2222-2222-222222222222', 'NASA Open Data', 'Space debris catalog', 'dataset', 'https://data.nasa.gov', FALSE),
    ('c3333333-3333-3333-3333-333333333333', 'IBM Quantum Access', '100 hours on IBM Quantum hardware', 'credits', 'https://quantum-computing.ibm.com', TRUE),
    ('c3333333-3333-3333-3333-333333333333', 'Qiskit Documentation', 'Official Qiskit tutorials', 'documentation', 'https://qiskit.org/documentation/', FALSE)
ON CONFLICT DO NOTHING;
