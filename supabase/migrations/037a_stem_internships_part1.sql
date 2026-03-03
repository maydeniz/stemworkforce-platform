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
        usajobs_id, '850081200', 'internship', 'Civil Engineer / Mechancial Engineer / Electrical Engineer', 'Click on "Learn more about this agency" button below to view Eligibilities being considered and other IMPORTANT information. The primary purpose of this position is: This is a formal Air Force intern position, established under the PALACE Acquire (PAQ) program which is under the Pathways Recent Graduate Program. This position is centrally managed and funded by the Air Force Personnel Center, Civilian Career Management Directorate and administered by the Civil Engineer Career Team.', 'Civil Engineer / Mechancial Engineer / Electrical Engineer',
        'https://www.usajobs.gov/job/850081200', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 55486.0, 83525.0, 'USD', 'yearly',
        '2025-11-14'::DATE, '2026-09-30'::DATE, 'active'
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
        usajobs_id, '846773600', 'internship', 'ENGINEERING', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'ENGINEERING',
        'https://www.usajobs.gov/job/846773600', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
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
        usajobs_id, '847080100', 'internship', 'COMPUTER ENGINEER', 'Force Renewal Programs are designed to attract students & recent graduates with management/leadership potential to careers as Federal employees with the Air Force Civilian Service. This is accomplished by recruiting & selecting high-caliber candidates & training them to become competent, effective, & productive employees in a variety of career fields; providing training & developmental opportunities, & preparing them to successfully complete required training & developmental assignments.', 'COMPUTER ENGINEER',
        'https://www.usajobs.gov/job/847080100', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Location Negotiable After Selection', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 56763.0, 88225.0, 'USD', 'yearly',
        '2025-10-01'::DATE, '2026-09-30'::DATE, 'active'
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
        usajobs_id, '847097100', 'internship', 'Electronic Engineer', 'Force Renewal Programs are designed to attract students & recent graduates with management/leadership potential to careers as Federal employees with the Air Force Civilian Service. This is accomplished by recruiting & selecting high-caliber candidates & training them to become competent, effective, & productive employees in a variety of career fields; providing training & developmental opportunities and preparing them to successfully complete required training & developmental assignments.', 'Electronic Engineer',
        'https://www.usajobs.gov/job/847097100', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Location Negotiable After Selection', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 55486.0, 83525.0, 'USD', 'yearly',
        '2025-10-01'::DATE, '2026-09-30'::DATE, 'active'
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
        usajobs_id, '846773700', 'internship', 'ELECTRONICS ENGINEER', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'ELECTRONICS ENGINEER',
        'https://www.usajobs.gov/job/846773700', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Lackland AFB, Texas', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 79737.0, 120604.0, 'USD', 'yearly',
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
        usajobs_id, '852993800', 'internship', 'Summer Internship (Engineering Aide)', 'The AOC has unique and exciting opportunities to serve as an Engineering Aide during the Summer Internship Program. This program offers hands on professional experience, networking, training, and most of all, exposure to careers in public service, on Capitol Hill.', 'Summer Internship (Engineering Aide)',
        'https://www.usajobs.gov/job/852993800', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
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
        usajobs_id, '852682400', 'internship', 'COMPUTER SCIENTIST', 'Force Renewal Programs are designed to attract students & recent graduates with management/leadership potential to careers as Federal employees with the Air Force Civilian Service. This is accomplished by recruiting & selecting high-caliber candidates & training them to become competent, effective, & productive employees in a variety of career fields, providing training & developmental opportunities, & preparing them to successfully complete required training & developmental assignments.', 'COMPUTER SCIENTIST',
        'https://www.usajobs.gov/job/852682400', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Location Negotiable After Selection', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 56763.0, 88225.0, 'USD', 'yearly',
        '2025-10-01'::DATE, '2026-09-30'::DATE, 'active'
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
        usajobs_id, '846773800', 'internship', 'COMPUTER SCIENTIST', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'COMPUTER SCIENTIST',
        'https://www.usajobs.gov/job/846773800', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Lackland AFB, Texas', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 79735.0, 126275.0, 'USD', 'yearly',
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
        usajobs_id, '846709300', 'internship', 'DATA SCIENTIST', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'DATA SCIENTIST',
        'https://www.usajobs.gov/job/846709300', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 99314.0, 'USD', 'yearly',
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
        usajobs_id, '846731400', 'internship', 'Computer Scientist', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'Computer Scientist',
        'https://www.usajobs.gov/job/846731400', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 56763.0, 99314.0, 'USD', 'yearly',
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
        usajobs_id, '846709200', 'internship', 'PHYSICAL SCIENTIST (ENVIRONMENTAL)', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'PHYSICAL SCIENTIST (ENVIRONMENTAL)',
        'https://www.usajobs.gov/job/846709200', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 99314.0, 'USD', 'yearly',
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
        usajobs_id, '846774300', 'internship', 'BIOLOGICAL SCIENTIST (ENVIRONMENTAL)', 'Force Renewal Programs are designed to attract students & recent graduates with management/leadership potential to careers as Federal employees with the Air Force Civilian Service. This is accomplished by recruiting & selecting high-caliber candidates & training them to become competent, effective, & productive employees in a variety of career fields; providing training & developmental opportunities, & preparing them to successfully complete required training & developmental assignments.', 'BIOLOGICAL SCIENTIST (ENVIRONMENTAL)',
        'https://www.usajobs.gov/job/846774300', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 99314.0, 'USD', 'yearly',
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
        usajobs_id, '846780900', 'internship', 'Configuration and Data Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to serve in a PALACE Acquire (PAQ) centrally managed position in the Logistics Career Field. This is a developmental position requiring the performance of assignments that are designed to further develop applicable analytical and evaluative skills and techniques.', 'Configuration and Data Management Specialist',
        'https://www.usajobs.gov/job/846780900', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
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
        usajobs_id, '846781000', 'internship', 'Configuration and Data Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to serve in a PALACE Acquire (PAQ) centrally managed position in the Logistics Career Field. This is a developmental position requiring the performance of assignments that are designed to further develop applicable analytical and evaluative skills and techniques.', 'Configuration and Data Management Specialist',
        'https://www.usajobs.gov/job/846781000', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
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
        usajobs_id, '853495200', 'internship', 'Seasonal Student Trainee (Biological Science Aid)', 'The purpose of the position is to perform routine biological science tasks common to the organization. On-the-job training will be provided. Assists higher-level employees with the collection and organization of biological science field data.', 'Seasonal Student Trainee (Biological Science Aid)',
        'https://www.usajobs.gov/job/853495200', 'USAJobs', 'National Park Service', 'federal_agency',
        'Porter, Indiana', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.47, 21.46, 'USD', 'yearly',
        '2026-01-06'::DATE, '2026-01-15'::DATE, 'active'
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
        usajobs_id, '853498900', 'internship', 'Seasonal Student Trainee-Biological Science Technician (Plants)', 'This internship program provides students enrolled in education environments (high schools, colleges, trade schools and other qualifying educational institutions) with paid opportunities to explore Federal careers. This position is established to provide a meaningful employment opportunity in the Biological Science Technician Occupation. This is a Temporary appointment not-to-exceed 1039 hours.', 'Seasonal Student Trainee-Biological Science Technician (Plants)',
        'https://www.usajobs.gov/job/853498900', 'USAJobs', 'National Park Service', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.82, 27.66, 'USD', 'yearly',
        '2026-01-06'::DATE, '2026-01-22'::DATE, 'active'
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
        usajobs_id, '846734800', 'internship', 'OPERATIONS RESEARCH ANALYST', 'The PALACE Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'OPERATIONS RESEARCH ANALYST',
        'https://www.usajobs.gov/job/846734800', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 99314.0, 'USD', 'yearly',
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
        usajobs_id, '846781100', 'internship', 'Equipment Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to serve in a PALACE Acquire (PAQ) centrally managed position in the Logistics Career Field. This is a developmental position requiring the performance of assignments that are designed to further develop applicable analytical and evaluative skills and techniques.', 'Equipment Specialist',
        'https://www.usajobs.gov/job/846781100', 'USAJobs', 'United States Space Force', 'federal_agency',
        'Schriever AFB, Colorado', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 96116.0, 'USD', 'yearly',
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
        usajobs_id, '853638900', 'internship', 'Seasonal Student Trainee (Park Ranger Wilderness)', 'The Internship Program provides students enrolled in a variety of educational environments (high schools, colleges, trade schools, and other qualifying educational institutions) with paid opportunities to work in agencies and explore Federal careers while still in school. This is a temporary appointment for the 2026 summer season (May through September) working in Glacier''s backcountry program as a student trainee.', 'Seasonal Student Trainee (Park Ranger Wilderness)',
        'https://www.usajobs.gov/job/853638900', 'USAJobs', 'National Park Service', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.27, 17.82, 'USD', 'yearly',
        '2026-01-07'::DATE, '2026-01-20'::DATE, 'active'
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
        usajobs_id, '846781200', 'internship', 'Human Resources Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform a variety of conventional duties relating to a variety of human relations program areas and to complete developmental assignments and training outlined in the formal training and development program.', 'Human Resources Specialist',
        'https://www.usajobs.gov/job/846781200', 'USAJobs', 'Air Education and Training Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 134317.0, 'USD', 'yearly',
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
        usajobs_id, '854458300', 'internship', 'Human Resources Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform a variety of conventional duties relating to a variety of human relations program areas and to complete developmental assignments and training outlined in the formal training and development program.', 'Human Resources Specialist',
        'https://www.usajobs.gov/job/854458300', 'USAJobs', 'United States Space Force', 'federal_agency',
        'Patrick AFB, Florida', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 50835.0, 97809.0, 'USD', 'yearly',
        '2026-01-14'::DATE, '2027-01-13'::DATE, 'active'
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
        usajobs_id, '846780800', 'internship', 'Logistics Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform the full range of conventional duties relating to a variety of education services programs, and to complete developmental assignments and training outlined in the formal training & development plan.', 'Logistics Management Specialist',
        'https://www.usajobs.gov/job/846780800', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
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
        usajobs_id, '846709100', 'internship', 'MATHEMATICIAN', 'The Palace Acquire Program offers you a permanent position upon completion of your formal training plan. As a Palace Acquire Intern you will experience both personal and professional growth while dealing effectively and ethically with change, complexity, and problem solving. The program offers a 3-year formal training plan with yearly salary increases. Promotions and salary increases are based upon your successful performance and supervisory approval.', 'MATHEMATICIAN',
        'https://www.usajobs.gov/job/846709100', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 99314.0, 'USD', 'yearly',
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
        usajobs_id, '852950800', 'internship', 'SEASONAL Student Trainee (Biological Science Technician--Fisheries)', 'Pacific West Region is recruiting summer seasonals at Sequoia and Kings Canyon National Parks for SEASONAL Student Trainee (Biological Science Technician--Fisheries), 0499-4. The typical seasonal period for Sequoia and Kings Canyon National Parks is May-November. This is a Temporary appointment not-to-exceed November 2025. This appointment does not afford non-competitive conversion into a Term or Permanent position.', 'SEASONAL Student Trainee (Biological Science Technician--Fisheries)',
        'https://www.usajobs.gov/job/852950800', 'USAJobs', 'National Park Service', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 17.64, 22.57, 'USD', 'yearly',
        '2026-01-05'::DATE, '2026-01-20'::DATE, 'active'
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
        usajobs_id, '846774500', 'internship', 'PHYSICIST', 'Force Renewal Programs are designed to attract students & recent graduates with management/leadership potential to careers as Federal employees with the Air Force Civilian Service. This is accomplished by recruiting & selecting high-caliber candidates & training them to become competent, effective, & productive employees in a variety of career fields; providing training & developmental opportunities, & preparing them to successfully complete required training & developmental assignments.', 'PHYSICIST',
        'https://www.usajobs.gov/job/846774500', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 99314.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-09-28'::DATE, 'active'
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
