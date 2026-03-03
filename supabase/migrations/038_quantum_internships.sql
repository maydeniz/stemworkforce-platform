-- Quantum Computing Internships
-- Source: Ultimate-Quantum-Resources (GitHub)
-- https://github.com/NatashiaKaurRaina/Ultimate-Quantum-Resources

-- First, create a federated source for the quantum resources collection
INSERT INTO federated_sources (
    name, short_name, type, description, website,
    integration_method, sync_frequency,
    provides_jobs, provides_internships, provides_challenges, provides_events, provides_scholarships,
    industries, attribution_required, attribution_text, data_usage_permission, status,
    api_config
) VALUES (
    'Ultimate Quantum Resources',
    'QUANTUM_RESOURCES',
    'community_resource',
    'Curated collection of quantum computing internships and mentorship programs from industry leaders, national labs, and research organizations',
    'https://github.com/NatashiaKaurRaina/Ultimate-Quantum-Resources',
    'manual',
    'monthly',
    false, true, false, false, false,
    ARRAY['quantum']::TEXT[],
    true,
    'Quantum internship data curated from Ultimate-Quantum-Resources',
    'open_source',
    'active',
    '{}'::JSONB
) ON CONFLICT (short_name) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insert quantum internships
DO $$
DECLARE
    quantum_source_id UUID;
BEGIN
    SELECT id INTO quantum_source_id FROM federated_sources WHERE short_name = 'QUANTUM_RESOURCES' LIMIT 1;
    IF quantum_source_id IS NULL THEN
        RAISE EXCEPTION 'Quantum Resources source not found';
    END IF;

    -- 1. Chicago Quantum Exchange Internships
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-chicago-exchange', 'internship',
        'Chicago Quantum Exchange Internship',
        'The Chicago Quantum Exchange offers internship programs connecting students with leading quantum research groups across partner institutions including University of Chicago, Argonne National Laboratory, Fermilab, and the University of Illinois. Interns work on cutting-edge quantum computing, sensing, and networking projects.',
        'Quantum computing internship with Chicago Quantum Exchange partner institutions',
        'https://chicagoquantum.org/education-and-training/internships', 'Ultimate Quantum Resources',
        'Chicago Quantum Exchange', 'research_consortium',
        'Chicago, IL', 'USA', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Quantum Mechanics', 'Python', 'Qiskit', 'Research']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Research', 'STEM', 'Physics']::TEXT[],
        'internship', NULL, NULL, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 2. IBM Quantum Internship
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-ibm-internship', 'internship',
        'IBM Quantum Computing Internship',
        'IBM offers quantum computing internships for students working on quantum hardware, software, and algorithms. Interns collaborate with IBM Quantum researchers on projects including Qiskit development, quantum error correction, quantum machine learning, and quantum chemistry simulations. Positions are available across multiple IBM research labs.',
        'Quantum computing internship at IBM Research working on Qiskit and quantum algorithms',
        'https://www.ibm.com/careers/internships', 'Ultimate Quantum Resources',
        'IBM', 'corporation',
        'Multiple Locations (Yorktown Heights, NY / San Jose, CA / Remote)', 'USA', true,
        ARRAY['quantum']::TEXT[],
        ARRAY['Qiskit', 'Python', 'Quantum Algorithms', 'Quantum Error Correction', 'Machine Learning']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Industry', 'STEM', 'Computer Science']::TEXT[],
        'internship', 25.0, 60.0, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 3. Microsoft Quantum Computing Internship
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-microsoft-internship', 'internship',
        'Microsoft Quantum Computing Internship',
        'Microsoft Quantum offers internship positions for students interested in topological quantum computing, quantum software development, and quantum algorithms. Interns work with the Azure Quantum team on developing quantum programming tools, Q# language features, and quantum applications for real-world problems.',
        'Quantum computing internship at Microsoft working on Azure Quantum and Q#',
        'https://jobs.careers.microsoft.com/us/en/job/1811504', 'Ultimate Quantum Resources',
        'Microsoft', 'corporation',
        'Redmond, WA', 'USA', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Q#', 'Python', 'Quantum Algorithms', 'Azure Quantum', 'Topological Quantum Computing']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Industry', 'STEM', 'Computer Science']::TEXT[],
        'internship', 30.0, 65.0, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 4. QOSF Quantum Mentorship Program
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-qosf-mentorship', 'internship',
        'QOSF Quantum Computing Mentorship Program',
        'The Quantum Open Source Foundation (QOSF) mentorship program pairs students and early-career researchers with experienced quantum computing mentors. Participants work on open-source quantum computing projects over 3 months, gaining hands-on experience with quantum programming frameworks and contributing to the quantum open-source ecosystem.',
        'Open-source quantum computing mentorship program by QOSF',
        'https://qosf.org/qc_mentorship/', 'Ultimate Quantum Resources',
        'Quantum Open Source Foundation (QOSF)', 'nonprofit',
        'Remote', 'International', true,
        ARRAY['quantum']::TEXT[],
        ARRAY['Qiskit', 'Cirq', 'PennyLane', 'Python', 'Open Source', 'Quantum Algorithms']::TEXT[],
        ARRAY['Quantum', 'Mentorship', 'Open Source', 'STEM', 'Remote']::TEXT[],
        'internship', NULL, NULL, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 5. Fermilab Quantum Computing Internship
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-fermilab-internship', 'internship',
        'Fermilab Quantum Computing Internship for Physics Undergraduates',
        'Fermi National Accelerator Laboratory offers a quantum computing internship specifically for physics undergraduates. Interns work on quantum algorithms for high-energy physics simulations, quantum sensing applications, and quantum networking experiments at one of the world''s leading particle physics laboratories.',
        'Quantum computing internship at Fermilab for physics undergraduates',
        'https://internships.fnal.gov/quantum-computing-internship-for-physics-undergraduates-program/', 'Ultimate Quantum Resources',
        'Fermi National Accelerator Laboratory', 'national_lab',
        'Batavia, IL', 'USA', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Physics', 'Python', 'Quantum Simulation', 'High-Energy Physics']::TEXT[],
        ARRAY['Quantum', 'Internship', 'National Lab', 'STEM', 'Physics', 'DOE']::TEXT[],
        'internship', 20.0, 35.0, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 6. Q-Daksha Student Internship Program (India)
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-qdaksha-2025', 'internship',
        'Q-Daksha Student Internship Program 2025',
        'The Q-Daksha program is an initiative by the Government of India to promote quantum computing education and research. Students work on quantum algorithm development, quantum hardware interfacing, and quantum application projects at leading Indian research institutions and technology centers.',
        'Government of India quantum computing student internship program',
        'https://www.indiascienceandtechnology.gov.in/internships/q-daksha-student-internship-program-2025', 'Ultimate Quantum Resources',
        'India Science & Technology (Government of India)', 'government',
        'India (Multiple Locations)', 'India', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Python', 'Qiskit', 'Quantum Algorithms', 'Research']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Government', 'STEM', 'International']::TEXT[],
        'internship', NULL, NULL, 'INR', 'monthly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 7. Los Alamos National Lab Quantum Computing Summer School
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-lanl-summer-school', 'internship',
        'Los Alamos National Lab Quantum Computing Summer School',
        'The Los Alamos National Laboratory Quantum Computing Summer School provides intensive training and research experience in quantum information science. Participants work alongside LANL researchers on quantum algorithms, quantum error correction, quantum machine learning, and quantum simulation projects.',
        'Quantum computing summer school and research program at Los Alamos National Lab',
        'https://www.lanl.gov/engage/collaboration/internships/summer-schools/quantumschool', 'Ultimate Quantum Resources',
        'Los Alamos National Laboratory', 'national_lab',
        'Los Alamos, NM', 'USA', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Quantum Information', 'Python', 'Quantum Error Correction', 'Research']::TEXT[],
        ARRAY['Quantum', 'Internship', 'National Lab', 'STEM', 'Summer School', 'DOE']::TEXT[],
        'internship', 22.0, 40.0, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 8. QWorld QIntern 2025
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-qworld-qintern-2025', 'internship',
        'QWorld QIntern 2025',
        'QIntern is QWorld''s flagship quantum computing internship program that pairs students with mentors from across the globe. Interns work on quantum computing research projects spanning quantum algorithms, quantum machine learning, quantum cryptography, and quantum software development over an 8-week period.',
        'Global quantum computing internship program by QWorld',
        'https://qworld.net/qintern-2025/', 'Ultimate Quantum Resources',
        'QWorld', 'nonprofit',
        'Remote', 'International', true,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Python', 'Qiskit', 'Cirq', 'Quantum Machine Learning']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Remote', 'STEM', 'International', 'Mentorship']::TEXT[],
        'internship', NULL, NULL, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 9. Google Summer of Code (Quantum Projects)
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-gsoc', 'internship',
        'Google Summer of Code - Quantum Computing Projects',
        'Google Summer of Code (GSoC) features multiple quantum computing organizations including Qiskit, PennyLane, Cirq, and QuTiP. Students contribute to open-source quantum computing projects over the summer while receiving a stipend. Projects range from quantum compiler optimization to quantum chemistry applications.',
        'Open-source quantum computing projects through Google Summer of Code',
        'https://summerofcode.withgoogle.com/', 'Ultimate Quantum Resources',
        'Google', 'corporation',
        'Remote', 'International', true,
        ARRAY['quantum']::TEXT[],
        ARRAY['Qiskit', 'Cirq', 'PennyLane', 'Python', 'Open Source', 'Quantum Algorithms']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Open Source', 'STEM', 'Remote', 'Google']::TEXT[],
        'internship', NULL, NULL, 'USD', 'stipend',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 10. Lawrence Berkeley National Lab Summer Program (Quantum)
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-lbl-summer', 'internship',
        'Lawrence Berkeley Lab Quantum Computing Summer Program',
        'The Lawrence Berkeley National Laboratory offers summer research positions in quantum computing and quantum information science. Students work with the Advanced Quantum Testbed (AQT) team on superconducting qubit systems, quantum control, and quantum algorithm development for scientific applications.',
        'Quantum computing summer research program at Lawrence Berkeley National Lab',
        'https://cs.lbl.gov/news-and-events/summer-program/summer-info/', 'Ultimate Quantum Resources',
        'Lawrence Berkeley National Laboratory', 'national_lab',
        'Berkeley, CA', 'USA', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Python', 'Superconducting Qubits', 'Quantum Control', 'Research']::TEXT[],
        ARRAY['Quantum', 'Internship', 'National Lab', 'STEM', 'DOE', 'Summer']::TEXT[],
        'internship', 22.0, 38.0, 'USD', 'hourly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        salary_min = EXCLUDED.salary_min, salary_max = EXCLUDED.salary_max,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 11. ML4Q Internship
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-ml4q-internship', 'internship',
        'ML4Q Quantum Computing Internship',
        'The Matter and Light for Quantum Computing (ML4Q) Cluster of Excellence offers research internships in quantum computing. ML4Q is a collaboration between the Universities of Cologne, Aachen, Bonn, and the Forschungszentrum Jülich, focusing on building and operating quantum computers using solid-state and photonic platforms.',
        'Quantum computing research internship with the ML4Q Cluster of Excellence in Germany',
        'https://ml4q.de/ml4q-internship/', 'Ultimate Quantum Resources',
        'ML4Q Cluster of Excellence', 'university',
        'Germany (Cologne/Aachen/Bonn/Jülich)', 'Germany', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Quantum Hardware', 'Photonics', 'Solid-State Physics', 'Research']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Research', 'STEM', 'International', 'Europe']::TEXT[],
        'internship', NULL, NULL, 'EUR', 'monthly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 12. CERN Summer Student Programme (Quantum)
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-cern-summer', 'internship',
        'CERN Summer Student Programme - Quantum Computing',
        'CERN''s Summer Student Programme offers positions in quantum computing research. Students work on quantum algorithms for particle physics simulations, quantum machine learning for detector data analysis, and quantum networking experiments. The program provides a unique opportunity to apply quantum computing to fundamental physics research.',
        'Quantum computing research at CERN for particle physics applications',
        'https://home.cern/summer-student-programme', 'Ultimate Quantum Resources',
        'CERN', 'research_organization',
        'Geneva, Switzerland', 'Switzerland', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Python', 'Quantum Simulation', 'Machine Learning', 'Physics']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Research', 'STEM', 'International', 'Physics', 'CERN']::TEXT[],
        'internship', NULL, NULL, 'CHF', 'monthly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 13. CERN OpenLab Summer Student Programme (Quantum)
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-cern-openlab', 'internship',
        'CERN OpenLab Summer Student Programme - Quantum Technologies',
        'CERN openlab offers summer student positions focused on quantum technologies in partnership with leading technology companies. Projects include quantum computing benchmarking, hybrid quantum-classical algorithms, and quantum communication protocols for distributed computing at the LHC.',
        'CERN openlab quantum technology research in partnership with industry',
        'https://jobs.smartrecruiters.com/CERN/744000024797745-cern-openlab-summer-student-programme-2025', 'Ultimate Quantum Resources',
        'CERN openlab', 'research_organization',
        'Geneva, Switzerland', 'Switzerland', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Hybrid Algorithms', 'Python', 'Quantum Benchmarking', 'HPC']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Research', 'STEM', 'International', 'CERN', 'Industry']::TEXT[],
        'internship', NULL, NULL, 'CHF', 'monthly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 14. Quantum Internet Alliance Internship Programme
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-qia-internship-2025', 'internship',
        'Quantum Internet Alliance (QIA) Internship Programme 2025',
        'The Quantum Internet Alliance offers internship positions across its European partner institutions working on building the quantum internet. Projects include quantum repeater development, quantum key distribution, entanglement distribution protocols, and quantum network simulation.',
        'Quantum internet research internship across European partner institutions',
        'https://quantuminternetalliance.org/2025/04/14/building-for-one-europe-qia-internship-programme-2025/', 'Ultimate Quantum Resources',
        'Quantum Internet Alliance', 'research_consortium',
        'Europe (Multiple Locations)', 'Netherlands', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Networking', 'Quantum Key Distribution', 'Quantum Repeaters', 'Python', 'Research']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Research', 'STEM', 'International', 'Europe', 'Networking']::TEXT[],
        'internship', NULL, NULL, 'EUR', 'monthly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 15. Outreachy - Quantum Open Source Projects
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-outreachy', 'internship',
        'Outreachy Internship - Quantum Computing Projects',
        'Outreachy provides paid internships in open source and open science, including quantum computing projects. Organizations like Qiskit and Unitary Fund participate to mentor underrepresented groups in tech. Interns work remotely for 3 months on quantum software development, documentation, and community building.',
        'Paid remote internship for underrepresented groups in quantum open source',
        'https://www.outreachy.org/', 'Ultimate Quantum Resources',
        'Outreachy', 'nonprofit',
        'Remote', 'International', true,
        ARRAY['quantum']::TEXT[],
        ARRAY['Qiskit', 'Python', 'Open Source', 'Technical Writing', 'Quantum Computing']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Remote', 'STEM', 'Diversity', 'Open Source']::TEXT[],
        'internship', NULL, NULL, 'USD', 'stipend',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 16. European Summer of Code (ESoC) - Quantum Projects
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-esoc-2025', 'internship',
        'European Summer of Code 2025 - Quantum Computing',
        'The European Summer of Code (ESoC) 2025 includes quantum computing organizations as mentoring partners. Students work on open-source quantum computing projects including quantum compilers, quantum simulators, and quantum application development. The program supports European open-source quantum software development.',
        'European open-source quantum computing summer program',
        'https://github.com/european-summer-of-code/esoc2025', 'Ultimate Quantum Resources',
        'European Summer of Code', 'nonprofit',
        'Remote (Europe-focused)', 'International', true,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Python', 'Open Source', 'Quantum Compilers', 'Software Development']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Remote', 'STEM', 'Open Source', 'Europe']::TEXT[],
        'internship', NULL, NULL, 'EUR', 'stipend',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    -- 17. IIT Kanpur SURGE - Quantum Computing
    INSERT INTO federated_listings (
        source_id, external_id, content_type, title, description, short_description,
        source_url, source_name, organization_name, organization_type,
        location, country, is_remote, industries, skills, tags,
        job_type, salary_min, salary_max, salary_currency, salary_period,
        posted_at, expires_at, status
    ) VALUES (
        quantum_source_id, 'quantum-iitk-surge', 'internship',
        'IIT Kanpur SURGE - Quantum Computing Research',
        'The Students'' Undergraduate Research Graduate Excellence (SURGE) program at IIT Kanpur offers summer research positions in quantum computing. Students work with faculty on quantum algorithm design, quantum error correction, quantum cryptography, and quantum hardware simulation projects.',
        'Quantum computing summer research at IIT Kanpur',
        'https://surge.iitk.ac.in/', 'Ultimate Quantum Resources',
        'Indian Institute of Technology Kanpur', 'university',
        'Kanpur, India', 'India', false,
        ARRAY['quantum']::TEXT[],
        ARRAY['Quantum Computing', 'Python', 'Quantum Algorithms', 'Quantum Cryptography', 'Research']::TEXT[],
        ARRAY['Quantum', 'Internship', 'Research', 'STEM', 'International', 'India']::TEXT[],
        'internship', NULL, NULL, 'INR', 'monthly',
        NOW()::DATE, '2026-12-31'::DATE, 'active'
    ) ON CONFLICT (source_id, external_id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description,
        organization_name = EXCLUDED.organization_name, location = EXCLUDED.location,
        expires_at = EXCLUDED.expires_at, updated_at = NOW();

    RAISE NOTICE 'Successfully inserted 17 quantum computing internships from Ultimate-Quantum-Resources';
END $$;
