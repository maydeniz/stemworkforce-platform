-- ===========================================
-- Performance Optimization Indexes
-- Migration: 050_performance_indexes.sql
-- Critical indexes for production scale (100K+ users)
-- ===========================================

-- ===========================================
-- FEDERATED LISTINGS INDEXES
-- These are the most frequently queried tables
-- ===========================================

-- Composite index for listing searches (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_federated_listings_search
ON federated_listings(status, content_type, created_at DESC)
WHERE status = 'active';

-- Index for related listings lookup (used in getRelated)
CREATE INDEX IF NOT EXISTS idx_federated_listings_related
ON federated_listings(content_type, status)
INCLUDE (industries, quality_score)
WHERE status = 'active';

-- Index for source-based lookups
CREATE INDEX IF NOT EXISTS idx_federated_listings_source_status
ON federated_listings(source_id, status, created_at DESC);

-- GIN index for industry array searches
CREATE INDEX IF NOT EXISTS idx_federated_listings_industries_gin
ON federated_listings USING GIN(industries);

-- GIN index for skills array searches
CREATE INDEX IF NOT EXISTS idx_federated_listings_skills_gin
ON federated_listings USING GIN(skills);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_federated_listings_search_text
ON federated_listings USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Index for pagination with quality score sorting
CREATE INDEX IF NOT EXISTS idx_federated_listings_quality_pagination
ON federated_listings(quality_score DESC NULLS LAST, created_at DESC)
WHERE status = 'active';

-- Index for deadline-based filtering
CREATE INDEX IF NOT EXISTS idx_federated_listings_deadline
ON federated_listings(deadline)
WHERE status = 'active' AND deadline IS NOT NULL;

-- ===========================================
-- CHALLENGES INDEXES
-- ===========================================

-- Composite index for active challenges
CREATE INDEX IF NOT EXISTS idx_challenges_active
ON challenges(status, submission_deadline)
WHERE status IN ('registration-open', 'active');

-- Index for sponsor lookups
CREATE INDEX IF NOT EXISTS idx_challenges_sponsor
ON challenges(sponsor_id, status);

-- Index for featured challenges
CREATE INDEX IF NOT EXISTS idx_challenges_featured
ON challenges(featured_rank, status)
WHERE featured_rank IS NOT NULL;

-- GIN index for industries
CREATE INDEX IF NOT EXISTS idx_challenges_industries_gin
ON challenges USING GIN(industries);

-- GIN index for skills
CREATE INDEX IF NOT EXISTS idx_challenges_skills_gin
ON challenges USING GIN(skills);

-- ===========================================
-- CHALLENGE SOLVERS (REGISTRATIONS) INDEXES
-- Critical for user dashboard performance
-- ===========================================

-- Index for user's registrations (most common query)
CREATE INDEX IF NOT EXISTS idx_challenge_solvers_user
ON challenge_solvers(user_id, status)
WHERE status != 'withdrawn';

-- Composite index for challenge participant lookups
CREATE INDEX IF NOT EXISTS idx_challenge_solvers_challenge_user
ON challenge_solvers(challenge_id, user_id);

-- Index for team lookups
CREATE INDEX IF NOT EXISTS idx_challenge_solvers_team
ON challenge_solvers(team_id)
WHERE team_id IS NOT NULL;

-- ===========================================
-- CHALLENGE SUBMISSIONS INDEXES
-- ===========================================

-- Index for submissions by challenge
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge
ON challenge_submissions(challenge_id, status, submitted_at DESC);

-- Index for user submissions
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_solver
ON challenge_submissions(solver_id, solver_type);

-- Index for phase-based submissions
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_phase
ON challenge_submissions(phase_id, status)
WHERE phase_id IS NOT NULL;

-- Index for judging workflow
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_judging
ON challenge_submissions(challenge_id, status)
WHERE status IN ('submitted', 'under-review');

-- ===========================================
-- CHALLENGE TEAMS INDEXES
-- ===========================================

-- Index for challenge teams
CREATE INDEX IF NOT EXISTS idx_challenge_teams_challenge
ON challenge_teams(challenge_id, status);

-- Index for team leader
CREATE INDEX IF NOT EXISTS idx_challenge_teams_leader
ON challenge_teams(leader_id);

-- ===========================================
-- CHALLENGE TEAM MEMBERS INDEXES
-- ===========================================

-- Index for user team memberships
CREATE INDEX IF NOT EXISTS idx_challenge_team_members_user
ON challenge_team_members(user_id);

-- Index for team membership lookups
CREATE INDEX IF NOT EXISTS idx_challenge_team_members_team
ON challenge_team_members(team_id, role);

-- ===========================================
-- CHALLENGE JUDGES INDEXES
-- ===========================================

-- Index for judge assignments
CREATE INDEX IF NOT EXISTS idx_challenge_judges_challenge
ON challenge_judges(challenge_id, status)
WHERE status = 'active';

-- Index for user's judge roles
CREATE INDEX IF NOT EXISTS idx_challenge_judges_user
ON challenge_judges(user_id, status);

-- ===========================================
-- USERS / PROFILES INDEXES
-- ===========================================

-- Index for role-based lookups (critical for RBAC)
CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role)
WHERE role IS NOT NULL;

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- Index for organization membership
CREATE INDEX IF NOT EXISTS idx_users_organization
ON users(organization_id)
WHERE organization_id IS NOT NULL;

-- ===========================================
-- AUDIT LOGS INDEXES
-- ===========================================

-- Index for user audit trail
CREATE INDEX IF NOT EXISTS idx_audit_logs_user
ON audit_logs(user_id, created_at DESC)
WHERE user_id IS NOT NULL;

-- Index for action-based lookups
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
ON audit_logs(action, created_at DESC);

-- Index for resource-based lookups
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource
ON audit_logs(resource_type, resource_id);

-- ===========================================
-- DATA SUBJECT REQUESTS INDEXES (GDPR)
-- ===========================================

-- Index for pending DSRs
CREATE INDEX IF NOT EXISTS idx_dsr_pending
ON data_subject_requests(status, deadline_at)
WHERE status IN ('pending', 'in_progress', 'verification_required');

-- Index for user DSRs
CREATE INDEX IF NOT EXISTS idx_dsr_user
ON data_subject_requests(user_id, created_at DESC);

-- ===========================================
-- PARTNER TABLES INDEXES
-- ===========================================

-- Education partners
CREATE INDEX IF NOT EXISTS idx_education_partners_status
ON education_partners(status, created_at DESC)
WHERE status = 'active';

-- Industry partners
CREATE INDEX IF NOT EXISTS idx_industry_partners_status
ON industry_partners(status, created_at DESC)
WHERE status = 'active';

-- Nonprofit partners
CREATE INDEX IF NOT EXISTS idx_nonprofit_partners_status
ON nonprofit_partners(status, created_at DESC)
WHERE status = 'active';

-- ===========================================
-- FEDERATED LISTING SAVES (USER BOOKMARKS)
-- ===========================================

-- Index for user's saved listings
CREATE INDEX IF NOT EXISTS idx_federated_saves_user
ON federated_listing_saves(user_id, created_at DESC);

-- Index for listing save counts
CREATE INDEX IF NOT EXISTS idx_federated_saves_listing
ON federated_listing_saves(listing_id);

-- ===========================================
-- ANALYZE TABLES FOR QUERY PLANNER
-- ===========================================

-- Run ANALYZE on critical tables to update statistics
ANALYZE federated_listings;
ANALYZE federated_sources;
ANALYZE challenges;
ANALYZE challenge_solvers;
ANALYZE challenge_submissions;
ANALYZE challenge_teams;
ANALYZE challenge_team_members;

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON INDEX idx_federated_listings_search IS 'Primary index for listing search queries with status and content type filtering';
COMMENT ON INDEX idx_federated_listings_related IS 'Covering index for related listings lookup to avoid table access';
COMMENT ON INDEX idx_challenge_solvers_user IS 'Critical index for user dashboard - fetches all user registrations';
COMMENT ON INDEX idx_challenge_submissions_judging IS 'Partial index for judging workflow - only indexes submissions needing review';
