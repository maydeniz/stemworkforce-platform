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

    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        usajobs_id, '851598000', 'internship', 'Student Volunteer', 'Unpaid internships with CFTC are offered year-round and can last from 12 weeks to 12 months. Duties vary based on the department and/or office in which the intern is placed. CFTC''s Internship Program offers valuable experience that contributes to educational and professional growth, and may be applied in any future employment endeavor, including federal, state and local governments or in the private sector. Internships may begin as early as January 2026.', 'Student Volunteer',
        'https://www.usajobs.gov/job/851598000', 'USAJobs', 'Commodity Futures Trading Commission', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 0.0, 0.0, 'USD', 'yearly',
        '2025-12-05'::DATE, '2026-05-29'::DATE, 'active'
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
        usajobs_id, '851192600', 'internship', 'IT Specialist (McCain Fellows)', 'The John S. McCain Strategic Defense Fellowship Program is a 1-year Department of War (DoW) development program for recent advanced degree program graduates from across multiple academic disciplines. While these are temporary appointments, Fellows that successfully complete this program are eligible to be considered for conversion into permanent positions if vacancies are available. Find out more about this Program on our website and LinkedIn page.', 'IT Specialist (McCain Fellows)',
        'https://www.usajobs.gov/job/851192600', 'USAJobs', 'Washington Headquarters Services', 'federal_agency',
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
        usajobs_id, '852995700', 'internship', 'Summer Internship (Accounting Aide)', 'The AOC has unique and exciting opportunities to serve as an Accounting Aide during the Summer Internship Program, which offers hands on professional experience, networking, training and most of all exposure to careers in public service, on Capitol Hill.', 'Summer Internship (Accounting Aide)',
        'https://www.usajobs.gov/job/852995700', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
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
        usajobs_id, '853080800', 'internship', 'Summer Internship (Audiovisual Aide)', 'The AOC has unique and exciting opportunities to serve as an Audiovisual Aide during the Summer Internship Program, which offers hands on professional experience, networking, training and most of all exposure to careers in public service, on Capitol Hill.', 'Summer Internship (Audiovisual Aide)',
        'https://www.usajobs.gov/job/853080800', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
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
        usajobs_id, '846866000', 'internship', 'Student Trainee', 'The Air Force Civilian Service is pleased to announce the Air Force College Premier Summer Intern Program. Students in their junior year of a full-time baccalaureate program will be able to apply for a full-time paid summer internship lasting 10-12 weeks during the summer session prior to their senior year. Students in their junior year of their baccalaureate program and eligible (5 Year Program). Seniors will be able to apply for a full time internship.', 'Student Trainee',
        'https://www.usajobs.gov/job/846866000', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 36825.0, 52426.0, 'USD', 'yearly',
        '2025-09-29'::DATE, '2026-03-06'::DATE, 'active'
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
        usajobs_id, '852996200', 'internship', 'Summer Internship (Horticulture Plant Health Care Aide)', 'The AOC has unique and exciting opportunities to serve as a Horticulture Plant Health Care Aide during the Summer Internship Program, which offers hands on professional experience, networking, training and most of all exposure to careers in public service, on Capitol Hill.', 'Summer Internship (Horticulture Plant Health Care Aide)',
        'https://www.usajobs.gov/job/852996200', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
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
        usajobs_id, '853084700', 'internship', 'Summer Internship (Cost Estimator Aide)', 'The AOC has unique and exciting opportunities to serve as a Cost Estimator Aide during the Summer Internship Program, which offers hands on professional experience, networking, training and most of all exposure to careers in public service, on Capitol Hill.', 'Summer Internship (Cost Estimator Aide)',
        'https://www.usajobs.gov/job/853084700', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
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
        usajobs_id, '852954800', 'internship', 'Public Affairs Specialist (Intern)', 'The National Indian Gaming Commission''s primary mission is to work within the framework created by the Indian Gaming Regulatory Act (IGRA) for the regulation of gaming activities conducted by tribes on Indian lands to fully realize IGRA''s goals: (1) promoting tribal economic development, self-sufficiency and strong tribal governments; (2) maintaining the integrity of the Indian gaming industry; and (3) ensuring that tribes are the primary beneficiaries of their gaming activities.', 'Public Affairs Specialist (Intern)',
        'https://www.usajobs.gov/job/852954800', 'USAJobs', 'Office of the Secretary of the Interior', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 27.66, 35.97, 'USD', 'yearly',
        '2025-12-22'::DATE, '2026-02-09'::DATE, 'active'
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
        usajobs_id, '853197500', 'internship', 'Summer Internship (Photography Aide)', 'The AOC is accepting applications for a Photography Aide summer internship that offers skill enrichment and experiential learning while promoting careers in the public service. This position is located in the Architect of the Capitol (AOC), Curator Division, Photography and Technical Imaging Branch.', 'Summer Internship (Photography Aide)',
        'https://www.usajobs.gov/job/853197500', 'USAJobs', 'Architect of the Capitol', 'federal_agency',
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
        usajobs_id, '846780500', 'internship', 'Logistics Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform the full range of conventional duties relating to a variety of education services programs, and to complete developmental assignments and training outlined in the formal training & development plan.', 'Logistics Management Specialist',
        'https://www.usajobs.gov/job/846780500', 'USAJobs', 'Air Combat Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 117203.0, 'USD', 'yearly',
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
        usajobs_id, '846780600', 'internship', 'Logistics Management Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform the full range of conventional duties relating to a variety of education services programs, and to complete developmental assignments and training outlined in the formal training & development plan.', 'Logistics Management Specialist',
        'https://www.usajobs.gov/job/846780600', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
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
        usajobs_id, '854412200', 'internship', 'Supervisory Inventory Management Specialist', 'As a Supervisory Inventory Management Specialist for expendable assets/materials for the Logistics Service within the VA Health Care System supervising multiple supply series of consumable medical supply/inventory used in the healthcare system as well as the micro-purchase program and recognized as the Commodity Management Division''s subject matter expert.', 'Supervisory Inventory Management Specialist',
        'https://www.usajobs.gov/job/854412200', 'USAJobs', 'Veterans Health Administration', 'federal_agency',
        'Houston, Texas', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 86123.0, 111966.0, 'USD', 'yearly',
        '2026-01-14'::DATE, '2026-01-21'::DATE, 'active'
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
        usajobs_id, '837642100', 'internship', 'Graduate Student Research Assistant', 'The Federal Judicial Center (Center) is the federal courts'' agency for research and continuing education. Congress established the Center in 1967 as a separate organization within the federal judicial system at the request of the Judicial Conference of the United States. A nine-member board, chaired by the Chief Justice of the United States, determines its basic policies.', 'Graduate Student Research Assistant',
        'https://www.usajobs.gov/job/837642100', 'USAJobs', 'Judicial Branch - Agency Wide', 'federal_agency',
        'Washington, District of Columbia', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 19.65, 22.11, 'USD', 'yearly',
        '2025-05-27'::DATE, '2026-05-26'::DATE, 'active'
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
        usajobs_id, '853912300', 'internship', 'Purchasing Agent- Prosthetics', 'This position is located in the Prosthetic & Sensory Aids Service (PSAS) within the Prosthetic Service at the Michael E. DeBakey VAMC in Houston, TX. Performs direct medical supply Purchasing and Inventory Management support to the administrative and clinical services of the VA to initiate the obligation for all related requirements necessary to provide prosthetic and sensory aids services, to include durable medical equipment and supplies directly to Veterans.', 'Purchasing Agent- Prosthetics',
        'https://www.usajobs.gov/job/853912300', 'USAJobs', 'Veterans Health Administration', 'federal_agency',
        'Houston, Texas', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 46979.0, 68078.0, 'USD', 'yearly',
        '2026-01-09'::DATE, '2026-01-20'::DATE, 'active'
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
        usajobs_id, '852954000', 'internship', 'Training Program Specialist (Intern)', 'The National Indian Gaming Commission''s primary mission is to work within the framework created by the Indian Gaming Regulatory Act (IGRA) for the regulation of gaming activities conducted by tribes on Indian lands to fully realize IGRA''s goals: (1) promoting tribal economic development, self-sufficiency and strong tribal governments; (2) maintaining the integrity of the Indian gaming industry; and (3) ensuring that tribes are the primary beneficiaries of their gaming activities.', 'Training Program Specialist (Intern)',
        'https://www.usajobs.gov/job/852954000', 'USAJobs', 'Office of the Secretary of the Interior', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 27.66, 35.97, 'USD', 'yearly',
        '2025-12-22'::DATE, '2026-02-09'::DATE, 'active'
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
        usajobs_id, '850128400', 'internship', 'FOREIGN AFFAIRS SPECIALIST', 'Click on "Learn more about this agency" button below to view Eligibilities being considered and other IMPORTANT information. This is a formal Air Force civilian training position, established under the PALACE Acquire (PAQ) program. As such, it is centrally managed and funded by the Air Force Personnel Center, Force Renewal and Development Directorate and administered by the International Affairs Administration Career Field Team, HQ AFPC/DPZ, JBSA-Randolph TX 78150-4530.', 'FOREIGN AFFAIRS SPECIALIST',
        'https://www.usajobs.gov/job/850128400', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 115213.0, 'USD', 'yearly',
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
        usajobs_id, '851192000', 'internship', 'Financial Management Analyst (McCain Fellows)', 'The John S. McCain Strategic Defense Fellowship Program is a 1-year Department of War (DoW) development program for recent advanced degree program graduates from across multiple academic disciplines. While these are temporary appointments, Fellows that successfully complete this program are eligible to be considered for conversion into permanent positions if vacancies are available. Find out more about this Program on our website and LinkedIn page.', 'Financial Management Analyst (McCain Fellows)',
        'https://www.usajobs.gov/job/851192000', 'USAJobs', 'Washington Headquarters Services', 'federal_agency',
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
        usajobs_id, '851192900', 'internship', 'Management Analyst (McCain Fellows)', 'The John S. McCain Strategic Defense Fellowship Program is a 1-year Department of War (DoW) development program for recent advanced degree program graduates from across multiple academic disciplines. While these are temporary appointments, Fellows that successfully complete this program are eligible to be considered for conversion into permanent positions if vacancies are available. Find out more about this Program on our website and LinkedIn page.', 'Management Analyst (McCain Fellows)',
        'https://www.usajobs.gov/job/851192900', 'USAJobs', 'Washington Headquarters Services', 'federal_agency',
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
        usajobs_id, '847096900', 'internship', 'IT SPECIALIST', 'Force Renewal Programs are designed to attract students & recent graduates with management/leadership potential to careers as Federal employees with the Air Force Civilian Service. This is accomplished by recruiting & selecting high-caliber candidates & training them to become competent, effective, & productive employees in a variety of career fields; providing training & developmental opportunities, & preparing them to successfully complete required training & developmental assignments.', 'IT SPECIALIST',
        'https://www.usajobs.gov/job/847096900', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
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
        usajobs_id, '853854800', 'internship', 'Student Trainee (Medical & Health)', 'The Pathways Internship Program allows students to join VA in career positions that emphasize long-term training and development. As a Student Trainee (Medical and Health), the incumbent performs duties of a medical laboratory aide in the clinical laboratory of the Harry S. Truman Veterans Affairs Medical Center in drawing routine specimens during high workload times, late clinic hours, and short staff coverage.', 'Student Trainee (Medical & Health)',
        'https://www.usajobs.gov/job/853854800', 'USAJobs', 'Veterans Health Administration', 'federal_agency',
        'Columbia, Missouri', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 37193.0, 47334.0, 'USD', 'yearly',
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
        usajobs_id, '846782000', 'internship', 'Work/Life Consultant', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to develop broad gauge individuals who can deal effectively with change and complexity within the Air Force environment as it relates to their career field.', 'Work/Life Consultant',
        'https://www.usajobs.gov/job/846782000', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 109975.0, 'USD', 'yearly',
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
        usajobs_id, '846782100', 'internship', 'Prevention Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to provide assistance to specialists addressing integrated primary prevention activities to effectively prevent negative outcomes associated with sexual assault and harassment, family violence, workplace violence, suicide, and alcohol abuse/misuse prevention.', 'Prevention Specialist',
        'https://www.usajobs.gov/job/846782100', 'USAJobs', 'Air Education and Training Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 49960.0, 109975.0, 'USD', 'yearly',
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
        usajobs_id, '846774400', 'internship', 'PSYCHOLOGIST', 'Force Renewal Programs are designed to attract students & recent graduates with management/leadership potential to careers as Federal employees with the Air Force Civilian Service. This is accomplished by recruiting & selecting high-caliber candidates & training them to become competent, effective, & productive employees in a variety of career fields; providing training & developmental opportunities, & preparing them to successfully complete required training & developmental assignments.', 'PSYCHOLOGIST',
        'https://www.usajobs.gov/job/846774400', 'USAJobs', 'Air Force Civilian Career Training', 'federal_agency',
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
        usajobs_id, '846781500', 'internship', 'Youth Program Specialist', 'Click on "Learn more about this agency" button below for IMPORTANT additional information. The primary purpose of this position is to perform a variety of duties related to youth flight direction and administration and to complete development assignments and training outlined in the formal management trainee training and development plan.', 'Youth Program Specialist',
        'https://www.usajobs.gov/job/846781500', 'USAJobs', 'Air Force Materiel Command', 'federal_agency',
        'Multiple Locations', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 51821.0, 112053.0, 'USD', 'yearly',
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
        usajobs_id, '854413200', 'internship', 'Supply Technician', 'This position serves as Supply Technician (Medical) for the Medical Supply Distribution (MSD) areas of Logistics Service within the VA Health Care System. As a Supply Technician, you will provide wards, clinics, operating rooms, secondary storage locations, and other hospital facilities with supplies and material including, but not limited to, sterile and non-sterile medical supplies, instrument sets and equipment.', 'Supply Technician',
        'https://www.usajobs.gov/job/854413200', 'USAJobs', 'Veterans Health Administration', 'federal_agency',
        'Houston, Texas', 'USA', false,
        ARRAY['government', 'stem']::TEXT[], ARRAY[]::TEXT[],
        ARRAY['Federal', 'Internship', 'Student', 'STEM']::TEXT[],
        'internship', 46979.0, 61073.0, 'USD', 'yearly',
        '2026-01-14'::DATE, '2026-01-21'::DATE, 'active'
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
