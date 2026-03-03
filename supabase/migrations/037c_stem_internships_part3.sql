-- Real STEM Internships from USAJobs API
-- Total: 75 internships

DO $$
DECLARE
    usajobs_id UUID;
BEGIN
    SELECT id INTO usajobs_id FROM federated_sources WHERE short_name = 'USAJOBS' LIMIT 1;
    IF usajobs_id IS NULL THEN
        RAISE EXCEPTION 'USAJobs source not found';
    END IF;

    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846780300', 'internship', 'Logistics Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to serve in a PALACE Acquire (PAQ) centrally managed position in the Logistics Career Field. This is a developmental position requiring the performance of assignments that are designed to further develop applicable analytical and evaluative skills and techniques.', 'Logistics Management Specialist',
        'https://www.usajobs.gov/job/846780300', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 115213.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846780400', 'internship', 'Logistics Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to serve in a PALACE Acquire (PAQ) centrally managed position in the Logistics Career Field. This is a developmental position requiring the performance of assignments that are designed to further develop applicable analytical and evaluative skills and techniques.', 'Logistics Management Specialist',
        'https://www.usajobs.gov/job/846780400', 'USAJobs', 'Air Combat Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 122703.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846780700', 'internship', 'Logistics Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to serve in a PALACE Acquire (PAQ) centrally managed position in the Logistics Career Field. This is a developmental position requiring the performance of assignments that are designed to further develop applicable analytical and evaluative skills and techniques.', 'Logistics Management Specialist',
        'https://www.usajobs.gov/job/846780700', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 115213.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846781600', 'internship', 'General Education and Training Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform the full range of conventional duties relating to a variety of education services programs, and to complete developmental assignments and training outlined in the formal training & development plan.', 'General Education and Training Specialist',
        'https://www.usajobs.gov/job/846781600', 'USAJobs', 'Air Force Global Strike Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 90898.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '853623900', 'internship', 'Student Trainee (Actuary)', 'The Pathways Internship Program targets students accepted for enrollment or currently enrolled in a degree-seeking program in an accredited educational institution, on at least a half-time basis. At the successful conclusion of this program, you may be eligible for non-competitive conversion to a Federal career or career-conditional position. This is a Temporary, Full-Time Intern position as part of the Healthcare and Insurance, Office of the Actuaries, Office of Personnel Management.', 'Student Trainee (Actuary)',
        'https://www.usajobs.gov/job/853623900', 'USAJobs', 'Office of Personnel Management', 'federal_agency',
        'Washington, District of Columbia', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 41659.0, 54160.0, 'USD', 'yearly',
        '2026-01-06'::DATE, '2026-01-20'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '854175600', 'internship', 'Staff Psychologist  (Pain Psychologist)', 'This position is eligible for the Education Debt Reduction Program (EDRP), a student loan payment reimbursement program. You must meet specific eligibility requirements per VHA policy and submit your EDRP application within four months of appointment. Program Approval, award amount (up to $200,000) & eligibility period (one to five years) are determined by the VHA Education Loan Repayment Services program office after review of the EDRP application. Former EDRP participants ineligible to apply', 'Staff Psychologist  (Pain Psychologist)',
        'https://www.usajobs.gov/job/854175600', 'USAJobs', 'Veterans Health Administration', 'federal_agency',
        'Boise, Idaho', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 77267.0, 143168.0, 'USD', 'yearly',
        '2026-01-12'::DATE, '2026-01-26'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846781700', 'internship', 'Management Analyst', 'Click on "Learn more about this agency" button below to view Eligibilities being considered and other IMPORTANT information. The primary purpose of this position is to develop broad gauged individuals who can deal effectively with change complexity within the Air Force environment as it relates to the Manpower and Organization career field.', 'Management Analyst',
        'https://www.usajobs.gov/job/846781700', 'USAJobs', 'Air Education and Training Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 115213.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846782200', 'internship', 'Program analyst (Cyber Operations)', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform a variety of duties in the analysis and evaluation of cyber operations, and to complete developmental assignments and training outlined in the formal training and development plan.', 'Program analyst (Cyber Operations)',
        'https://www.usajobs.gov/job/846782200', 'USAJobs', 'United States Space Force', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 51279.0, 118254.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '852385900', 'internship', 'CISA - Scholarship for Service (SFS) Internship - Accepting Resumes, Transcripts, & SFS Agreements', 'This is a CyberCorps® Scholarship for Service (SFS) resume repository for ONLY current SFS scholarship recipients. CISA is interested in recruiting SFS scholars to participate in the 2026 internship cohort. This program provides students with on-the-job training to prepare them for a career in the federal government in a cybersecurity related field. Selectee(s) will receive a time-limited appointment in the excepted service.', 'CISA - Scholarship for Service (SFS) Internship - Accepting Resumes, Transcripts, & SFS Agreements',
        'https://www.usajobs.gov/job/852385900', 'USAJobs', 'Cybersecurity and Infrastructure Security Agency', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 27708.0, 68549.0, 'USD', 'yearly',
        '2025-12-15'::DATE, '2026-02-27'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846730500', 'internship', 'CHEMIST', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'CHEMIST',
        'https://www.usajobs.gov/job/846730500', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 55486.0, 99314.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '853005400', 'internship', 'Associate FCA Examiner', 'This position is part of FCA''s Pathways Program. This paid summer internship is located in the Office of Examination''s Staff Development Division that develops and prepares Associate FCA Bank Examiners to successfully evaluate an institution''s financial and lending operations, management, information technology, and compliance with federal regulations to determine safety and soundness as well as compliance with laws and regulations as outlined in the agency''s mission.', 'Associate FCA Examiner',
        'https://www.usajobs.gov/job/853005400', 'USAJobs', 'Farm Credit Administration', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 38143.0, 38143.0, 'USD', 'yearly',
        '2025-12-22'::DATE, '2026-01-23'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '852390600', 'internship', 'CISA - Scholarship for Service (SFS) Post Grad - Accepting Resumes, Transcripts, and SFS Agreements', 'This is a CyberCorps® Scholarship for Service (SFS) resume repository for ONLY SFS scholarship recipients. CISA is interested in recruiting SFS scholars to participate in the 2026 post graduate cohort. Selectee(s) will receive a full-time position in the excepted service.', 'CISA - Scholarship for Service (SFS) Post Grad - Accepting Resumes, Transcripts, and SFS Agreements',
        'https://www.usajobs.gov/job/852390600', 'USAJobs', 'Cybersecurity and Infrastructure Security Agency', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 34799.0, 82938.0, 'USD', 'yearly',
        '2025-12-15'::DATE, '2026-02-27'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '852994400', 'internship', 'Summer Internship (Architectural Aide)', 'The AOC is accepting applications for multiple Architecture Aide summer internships, that offer skill enrichment and experiential learning while promoting careers in public service. The summer internship program is a unique opportunity to gain real world experience within the federal government and throughout the historic U.S. Capitol complex.', 'Summer Internship (Architectural Aide)',
        'https://www.usajobs.gov/job/852994400', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
        'Washington, District of Columbia', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.0, 17.0, 'USD', 'yearly',
        '2025-12-19'::DATE, '2026-01-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846780100', 'internship', 'Inventory Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to develop broad gauged individuals who can deal effectively with change and complexity within the Air Force environment as it relates to their career field.', 'Inventory Management Specialist',
        'https://www.usajobs.gov/job/846780100', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 115213.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '846780200', 'internship', 'Inventory Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to develop broad gauged individuals who can deal effectively with change and complexity within the Air Force environment as it relates to their career field.', 'Inventory Management Specialist',
        'https://www.usajobs.gov/job/846780200', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 115213.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '853094100', 'internship', 'Summer Internship (Electrician Aide)', 'The AOC has unique and exciting opportunities to serve as an Electrician Aide during the Summer Internship Program. This program offers hands on professional experience, networking, training, and most of all, exposure to careers in public service, on Capitol Hill.', 'Summer Internship (Electrician Aide)',
        'https://www.usajobs.gov/job/853094100', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
        'Washington, District of Columbia', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.0, 17.0, 'USD', 'yearly',
        '2025-12-22'::DATE, '2026-01-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '853342000', 'internship', 'Seasonal Student Trainee (Laborer)', 'This is a student-trainee position which is established to provide a meaningful work opportunity in the Laborer, WG-3502 occupation. The employment opportunity may involve, specific work assignments and a variety of assignments, and working with intermediate and journeyman level staff. You will perform moderately heavy physical labor requiring the use of common hand tools and power equipment.', 'Seasonal Student Trainee (Laborer)',
        'https://www.usajobs.gov/job/853342000', 'USAJobs', 'National Park Service', 'federal_agency',
        'Empire, Michigan', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 20.3, 23.69, 'USD', 'yearly',
        '2025-12-30'::DATE, '2026-05-29'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '852922400', 'internship', 'Seasonal Student Trainee (Maintenance Worker)', 'This position is established to provide a meaningful work opportunity in the Maintenance Worker/Mechanic, WG-4749, occupation. The employment opportunity may involve specific work assignments and a variety of assignments, and working with intermediate and journeymen level staff in support of office programs and activities to gain practical work experience.', 'Seasonal Student Trainee (Maintenance Worker)',
        'https://www.usajobs.gov/job/852922400', 'USAJobs', 'National Park Service', 'federal_agency',
        'Munising, Michigan', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 23.2, 27.07, 'USD', 'yearly',
        '2025-12-29'::DATE, '2026-05-29'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '851192200', 'internship', 'Operations Research Analyst (McCain Fellows)', 'The John S. McCain Strategic Defense Fellowship Program is a 1-year Department of War (DoW) development program for recent advanced degree program graduates from across multiple academic disciplines. While these are temporary appointments, Fellows that successfully complete this program are eligible to be considered for conversion into permanent positions if vacancies are available. Find out more about this Program on our website and LinkedIn page.', 'Operations Research Analyst (McCain Fellows)',
        'https://www.usajobs.gov/job/851192200', 'USAJobs', 'Washington Headquarters Services', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 77001.0, 131826.0, 'USD', 'yearly',
        '2025-12-01'::DATE, '2026-09-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '853089400', 'internship', 'Summer Internship (Curatorial Aide)', 'The AOC is accepting applications for Curatorial Aide summer internships, that offer skill enrichment and experiential learning while promoting careers in public service. The summer internship program is a unique opportunity to gain real world experience within the federal government and throughout the historic campus of the U.S. Capitol.', 'Summer Internship (Curatorial Aide)',
        'https://www.usajobs.gov/job/853089400', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
        'Washington, District of Columbia', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.0, 17.0, 'USD', 'yearly',
        '2025-12-22'::DATE, '2026-01-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '853194800', 'internship', 'Summer Internship (Archivist Aide)', 'The AOC is accepting applications for an Archivist Aide summer internship that offers skill enrichment and experiential learning while promoting careers in the public service.', 'Summer Internship (Archivist Aide)',
        'https://www.usajobs.gov/job/853194800', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
        'Washington, District of Columbia', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.0, 17.0, 'USD', 'yearly',
        '2025-12-23'::DATE, '2026-01-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '851191400', 'internship', 'Misc Administration and Program Analyst (McCain Fellows)', 'The John S. McCain Strategic Defense Fellowship Program is a 1-year Department of War (DoW) development program for recent advanced degree program graduates from across multiple academic disciplines. While these are temporary appointments, Fellows that successfully complete this program are eligible to be considered for conversion into permanent positions if vacancies are available. Find out more about this Program on our website and LinkedIn page.', 'Misc Administration and Program Analyst (McCain Fellows)',
        'https://www.usajobs.gov/job/851191400', 'USAJobs', 'Washington Headquarters Services', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 77001.0, 131826.0, 'USD', 'yearly',
        '2025-12-01'::DATE, '2026-09-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '853169800', 'internship', 'Student Nurse Technician - VA-STEP', 'The VA-STEP (VA Student Trainee Experience Program) is an honors program for select nursing students who have completed the junior year of an CCNE accredited BSN nursing program. VA-STEP provides a structured clinical experience with a BSN-prepared preceptor and education course work in a clinical setting. The program consists of a 400-hour experience during the summer months.', 'Student Nurse Technician - VA-STEP',
        'https://www.usajobs.gov/job/853169800', 'USAJobs', 'Veterans Health Administration', 'federal_agency',
        'Columbia, Missouri', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 56628.0, 56628.0, 'USD', 'yearly',
        '2025-12-23'::DATE, '2026-02-19'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '851192400', 'internship', 'Foreign Affairs Specialist (McCain Fellows)', 'The John S. McCain Strategic Defense Fellowship Program is a 1-year Department of War (DoW) development program for recent advanced degree program graduates from across multiple academic disciplines. While these are temporary appointments, Fellows that successfully complete this program are eligible to be considered for conversion into permanent positions if vacancies are available. Find out more about this Program on our website and LinkedIn page.', 'Foreign Affairs Specialist (McCain Fellows)',
        'https://www.usajobs.gov/job/851192400', 'USAJobs', 'Washington Headquarters Services', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 77001.0, 131826.0, 'USD', 'yearly',
        '2025-12-01'::DATE, '2026-09-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    
INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '849969200', 'internship', 'Physician (Home Base Primary Care Medical Director) w/Recruitment-Relocation Incentive', 'The Central Texas VA Health Care System, Temple, Texas is seeking a full-time Physician (Home Base Primary Care Medical Director) to provide clinical oversight of all Non-Institutional Care (NIC programs to include all Home and Community Based Services, Contract Nursing Homes and State Veterans Home Programs) in collaboration with NIC program Manager. A Recruitment/Relocation Incentive may be authorized for a highly qualified candidate.', 'Physician (Home Base Primary Care Medical Director) w/Recruitment-Relocation Incentive',
        'https://www.usajobs.gov/job/849969200', 'USAJobs', 'Veterans Health Administration', 'federal_agency',
        'Temple, Texas', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 250000.0, 350000.0, 'USD', 'yearly',
        '2025-11-12'::DATE, '2026-01-30'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();


END $$;

-- Delete non-STEM entries
DELETE FROM federated_listings WHERE source_name = 'USAJobs' 
AND (title ILIKE '%law%' OR title ILIKE '%legal%' OR title ILIKE '%attorney%');

-- Show final count
SELECT COUNT(*) as total_stem_internships FROM federated_listings 
WHERE source_name = 'USAJobs';
