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

    
END $$;

-- Delete non-STEM entries
DELETE FROM federated_listings WHERE source_name = 'USAJobs' 
AND (title ILIKE '%law%' OR title ILIKE '%legal%' OR title ILIKE '%attorney%');

-- Show final count
SELECT COUNT(*) as total_stem_internships FROM federated_listings 
WHERE source_name = 'USAJobs';
