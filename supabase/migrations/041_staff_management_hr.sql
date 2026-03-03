-- ===========================================
-- STAFF MANAGEMENT HR SYSTEM
-- Migration: 041_staff_management_hr.sql
-- ===========================================
-- Comprehensive HR system tables for:
-- - Hiring & Recruitment
-- - Onboarding
-- - Time & Attendance
-- - Performance Management
-- - Payroll & Compensation
-- - Org Structure
-- ===========================================

-- =====================================================
-- PART 1: ORG STRUCTURE (dependencies for other tables)
-- =====================================================

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    description TEXT,
    parent_department_id UUID REFERENCES departments(id),
    department_head_id UUID,
    annual_budget DECIMAL(14,2),
    headcount_budget INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Positions
CREATE TABLE IF NOT EXISTS staff_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    job_family VARCHAR(100),
    job_level VARCHAR(50),
    department_id UUID REFERENCES departments(id),
    reports_to_id UUID,
    employment_type VARCHAR(50),
    location VARCHAR(255),
    work_arrangement VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Succession Plans
CREATE TABLE IF NOT EXISTS succession_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position_title VARCHAR(255) NOT NULL,
    current_holder_id UUID,
    department_id UUID REFERENCES departments(id),
    criticality VARCHAR(50),
    risk_of_loss VARCHAR(50),
    successors JSONB,
    last_reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    next_review_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 2: HIRING & RECRUITMENT
-- =====================================================

-- Job Requisitions
CREATE TABLE IF NOT EXISTS job_requisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    hiring_manager_id UUID NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    employment_type VARCHAR(50),
    location VARCHAR(255),
    remote_allowed BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'draft',
    approval_chain JSONB,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    positions_to_fill INTEGER DEFAULT 1,
    positions_filled INTEGER DEFAULT 0,
    target_start_date DATE,
    priority VARCHAR(20) DEFAULT 'normal',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requisition_id UUID REFERENCES job_requisitions(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_url TEXT,
    linkedin_url TEXT,
    source VARCHAR(100),
    referrer_id UUID,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    stage VARCHAR(50) DEFAULT 'applied',
    stage_updated_at TIMESTAMPTZ,
    interviews JSONB,
    offer_status VARCHAR(50),
    offer_details JSONB,
    offer_letter_url TEXT,
    background_check_status VARCHAR(50) DEFAULT 'not_started',
    background_check_initiated_at TIMESTAMPTZ,
    background_check_completed_at TIMESTAMPTZ,
    notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 3: ONBOARDING
-- =====================================================

-- Onboarding Programs (templates)
CREATE TABLE IF NOT EXISTS onboarding_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES departments(id),
    role_type VARCHAR(100),
    phases JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Onboarding (instance for each new hire)
CREATE TABLE IF NOT EXISTS staff_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    program_id UUID REFERENCES onboarding_programs(id),
    start_date DATE NOT NULL,
    target_completion_date DATE,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'not_started',
    current_phase INTEGER DEFAULT 1,
    progress_percent INTEGER DEFAULT 0,
    mentor_id UUID,
    buddy_id UUID,
    tasks_completed JSONB,
    documents JSONB,
    i9_status VARCHAR(50) DEFAULT 'pending',
    w4_status VARCHAR(50) DEFAULT 'pending',
    direct_deposit_status VARCHAR(50) DEFAULT 'pending',
    day1_checklist JSONB,
    equipment_issued JSONB,
    access_provisioned JSONB,
    required_trainings JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 4: TIME & ATTENDANCE
-- =====================================================

-- Timesheets
CREATE TABLE IF NOT EXISTS timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    week_number INTEGER,
    year INTEGER,
    status VARCHAR(50) DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    regular_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, period_start, period_end)
);

-- Timesheet Entries
CREATE TABLE IF NOT EXISTS timesheet_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timesheet_id UUID REFERENCES timesheets(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    break_minutes INTEGER DEFAULT 0,
    hours_worked DECIMAL(4,2) NOT NULL,
    entry_type VARCHAR(50) DEFAULT 'regular',
    project_id UUID,
    task_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    hours_requested DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'pending',
    approver_id UUID,
    approved_at TIMESTAMPTZ,
    denial_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Balances
CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    year INTEGER NOT NULL,
    vacation_accrued DECIMAL(6,2) DEFAULT 0,
    vacation_used DECIMAL(6,2) DEFAULT 0,
    vacation_pending DECIMAL(6,2) DEFAULT 0,
    sick_accrued DECIMAL(6,2) DEFAULT 0,
    sick_used DECIMAL(6,2) DEFAULT 0,
    personal_accrued DECIMAL(6,2) DEFAULT 0,
    personal_used DECIMAL(6,2) DEFAULT 0,
    carryover_vacation DECIMAL(6,2) DEFAULT 0,
    carryover_expiry DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, year)
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    record_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    clock_in TIME,
    clock_out TIME,
    scheduled_start TIME,
    late_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, record_date)
);

-- =====================================================
-- PART 5: PERFORMANCE MANAGEMENT
-- =====================================================

-- Goals
CREATE TABLE IF NOT EXISTS performance_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    start_date DATE,
    target_date DATE,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'not_started',
    progress_percent INTEGER DEFAULT 0,
    key_results JSONB,
    review_cycle_id UUID,
    manager_id UUID,
    parent_goal_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review Cycles
CREATE TABLE IF NOT EXISTS review_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cycle_type VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    self_review_due DATE,
    manager_review_due DATE,
    calibration_date DATE,
    finalization_date DATE,
    status VARCHAR(50) DEFAULT 'draft',
    review_template JSONB,
    rating_scale JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Reviews
CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID REFERENCES review_cycles(id),
    staff_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    review_type VARCHAR(50) NOT NULL,
    responses JSONB,
    overall_rating INTEGER,
    competency_ratings JSONB,
    status VARCHAR(50) DEFAULT 'not_started',
    submitted_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    final_rating INTEGER,
    final_comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Development Plans
CREATE TABLE IF NOT EXISTS development_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    review_id UUID REFERENCES performance_reviews(id),
    title VARCHAR(255),
    focus_areas TEXT[],
    development_actions JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 6: PAYROLL & COMPENSATION
-- =====================================================

-- Compensation Records
CREATE TABLE IF NOT EXISTS compensation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    pay_type VARCHAR(50) NOT NULL,
    base_salary DECIMAL(12,2),
    hourly_rate DECIMAL(8,2),
    pay_frequency VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'USD',
    effective_date DATE NOT NULL,
    end_date DATE,
    bonus_target_percent DECIMAL(5,2),
    stock_options INTEGER,
    equity_vesting_schedule JSONB,
    change_reason TEXT,
    change_percent DECIMAL(5,2),
    approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll Runs
CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_gross DECIMAL(14,2),
    total_deductions DECIMAL(14,2),
    total_net DECIMAL(14,2),
    total_employer_taxes DECIMAL(14,2),
    employee_count INTEGER,
    prepared_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pay Stubs
CREATE TABLE IF NOT EXISTS pay_stubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID REFERENCES payroll_runs(id),
    staff_id UUID NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE NOT NULL,
    regular_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2),
    regular_pay DECIMAL(10,2),
    overtime_pay DECIMAL(10,2),
    bonus DECIMAL(10,2) DEFAULT 0,
    commission DECIMAL(10,2) DEFAULT 0,
    other_earnings DECIMAL(10,2) DEFAULT 0,
    gross_pay DECIMAL(12,2) NOT NULL,
    federal_tax DECIMAL(10,2) DEFAULT 0,
    state_tax DECIMAL(10,2) DEFAULT 0,
    local_tax DECIMAL(10,2) DEFAULT 0,
    social_security DECIMAL(10,2) DEFAULT 0,
    medicare DECIMAL(10,2) DEFAULT 0,
    health_insurance DECIMAL(10,2) DEFAULT 0,
    dental_insurance DECIMAL(10,2) DEFAULT 0,
    vision_insurance DECIMAL(10,2) DEFAULT 0,
    retirement_401k DECIMAL(10,2) DEFAULT 0,
    hsa_contribution DECIMAL(10,2) DEFAULT 0,
    garnishments DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    total_deductions DECIMAL(12,2) NOT NULL,
    net_pay DECIMAL(12,2) NOT NULL,
    ytd_gross DECIMAL(14,2),
    ytd_federal_tax DECIMAL(12,2),
    ytd_state_tax DECIMAL(12,2),
    ytd_social_security DECIMAL(12,2),
    ytd_medicare DECIMAL(12,2),
    ytd_net DECIMAL(14,2),
    payment_method VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll Deductions Configuration
CREATE TABLE IF NOT EXISTS payroll_deductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    deduction_type VARCHAR(100) NOT NULL,
    description TEXT,
    amount_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    annual_limit DECIMAL(12,2),
    per_pay_limit DECIMAL(10,2),
    pre_tax BOOLEAN DEFAULT true,
    effective_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Direct Deposit Accounts
CREATE TABLE IF NOT EXISTS direct_deposit_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    routing_number_encrypted TEXT NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    account_number_last4 VARCHAR(4),
    deposit_type VARCHAR(50) NOT NULL,
    deposit_amount DECIMAL(10,2),
    deposit_percent DECIMAL(5,2),
    priority INTEGER DEFAULT 1,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Documents
CREATE TABLE IF NOT EXISTS tax_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    tax_year INTEGER NOT NULL,
    document_data_encrypted JSONB,
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    generated_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    delivery_method VARCHAR(50),
    is_corrected BOOLEAN DEFAULT false,
    original_document_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_departments_parent ON departments(parent_department_id);
CREATE INDEX IF NOT EXISTS idx_staff_positions_staff ON staff_positions(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_positions_dept ON staff_positions(department_id);
CREATE INDEX IF NOT EXISTS idx_job_requisitions_status ON job_requisitions(status);
CREATE INDEX IF NOT EXISTS idx_candidates_requisition ON candidates(requisition_id);
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON candidates(stage);
CREATE INDEX IF NOT EXISTS idx_staff_onboarding_staff ON staff_onboarding(staff_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_staff ON timesheets(staff_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_period ON timesheets(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_leave_requests_staff ON leave_requests(staff_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_performance_goals_staff ON performance_goals(staff_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_staff ON performance_reviews(staff_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_cycle ON performance_reviews(cycle_id);
CREATE INDEX IF NOT EXISTS idx_compensation_records_staff ON compensation_records(staff_id);
CREATE INDEX IF NOT EXISTS idx_pay_stubs_staff ON pay_stubs(staff_id);
CREATE INDEX IF NOT EXISTS idx_pay_stubs_payroll_run ON pay_stubs(payroll_run_id);

-- =====================================================
-- SEED DATA: SAMPLE DEPARTMENTS
-- =====================================================

INSERT INTO departments (id, name, code, description, is_active) VALUES
    ('dept-exec', 'Executive', 'EXEC', 'Executive leadership team', true),
    ('dept-eng', 'Engineering', 'ENG', 'Software engineering and development', true),
    ('dept-ops', 'Operations', 'OPS', 'Platform operations and support', true),
    ('dept-hr', 'Human Resources', 'HR', 'People operations and talent', true),
    ('dept-fin', 'Finance', 'FIN', 'Finance and accounting', true),
    ('dept-mkt', 'Marketing', 'MKT', 'Marketing and communications', true)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- SEED DATA: DEFAULT ONBOARDING PROGRAM
-- =====================================================

INSERT INTO onboarding_programs (id, name, description, phases, is_active) VALUES
    ('prog-default', 'Standard Onboarding', 'Default 90-day onboarding program for all new hires',
    '[
        {
            "id": "phase-1",
            "name": "Pre-boarding",
            "durationDays": 0,
            "tasks": [
                {"id": "t1", "title": "Complete I-9 form", "category": "document", "assignee": "new_hire", "required": true},
                {"id": "t2", "title": "Complete W-4 form", "category": "document", "assignee": "new_hire", "required": true},
                {"id": "t3", "title": "Set up direct deposit", "category": "document", "assignee": "new_hire", "required": true},
                {"id": "t4", "title": "Sign NDA", "category": "document", "assignee": "new_hire", "required": true}
            ]
        },
        {
            "id": "phase-2",
            "name": "Day 1",
            "durationDays": 1,
            "tasks": [
                {"id": "t5", "title": "Office tour / virtual welcome", "category": "meeting", "assignee": "manager", "required": true},
                {"id": "t6", "title": "IT equipment setup", "category": "setup", "assignee": "it", "required": true},
                {"id": "t7", "title": "System access provisioning", "category": "setup", "assignee": "it", "required": true},
                {"id": "t8", "title": "Meet the team", "category": "meeting", "assignee": "manager", "required": true}
            ]
        },
        {
            "id": "phase-3",
            "name": "First 30 Days",
            "durationDays": 30,
            "tasks": [
                {"id": "t9", "title": "Complete security training", "category": "training", "assignee": "new_hire", "required": true},
                {"id": "t10", "title": "Complete compliance training", "category": "training", "assignee": "new_hire", "required": true},
                {"id": "t11", "title": "30-day check-in with manager", "category": "meeting", "assignee": "manager", "required": true}
            ]
        },
        {
            "id": "phase-4",
            "name": "60 Days",
            "durationDays": 60,
            "tasks": [
                {"id": "t12", "title": "60-day performance check-in", "category": "meeting", "assignee": "manager", "required": true},
                {"id": "t13", "title": "Set initial goals", "category": "other", "assignee": "new_hire", "required": true}
            ]
        },
        {
            "id": "phase-5",
            "name": "90 Days",
            "durationDays": 90,
            "tasks": [
                {"id": "t14", "title": "90-day review", "category": "meeting", "assignee": "manager", "required": true},
                {"id": "t15", "title": "Onboarding feedback survey", "category": "other", "assignee": "new_hire", "required": false}
            ]
        }
    ]'::jsonb,
    true)
ON CONFLICT DO NOTHING;
