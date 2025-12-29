-- ===========================================
-- STEMWORKFORCE SEED DATA
-- Run this in Supabase SQL Editor after schema migration
-- ===========================================

-- Sample Jobs
INSERT INTO jobs (title, slug, description, requirements, benefits, organization_id, posted_by_id, industry, type, location, remote, clearance, skills, salary_min, salary_max, salary_period, status, featured, expires_at)
SELECT 
    'Quantum Computing Research Scientist',
    'quantum-computing-research-scientist-' || gen_random_uuid()::text,
    'Join our team to push the boundaries of quantum computing. You will work on developing novel quantum algorithms, error correction techniques, and applications for near-term quantum devices. This role offers the opportunity to collaborate with leading researchers and contribute to groundbreaking discoveries in quantum information science.',
    ARRAY['PhD in Physics, Computer Science, or related field', '3+ years experience in quantum computing research', 'Strong publication record', 'Experience with Qiskit, Cirq, or similar frameworks'],
    ARRAY['Competitive salary', 'Health insurance', '401k matching', 'Flexible work arrangements', 'Conference travel budget'],
    (SELECT id FROM organizations WHERE slug = 'lanl' LIMIT 1),
    (SELECT id FROM users LIMIT 1),
    'quantum',
    'full_time',
    'Los Alamos, NM',
    false,
    'top_secret',
    ARRAY['Python', 'Qiskit', 'Linear Algebra', 'Quantum Mechanics', 'Machine Learning'],
    150000,
    250000,
    'yearly',
    'active',
    true,
    NOW() + INTERVAL '60 days'
WHERE EXISTS (SELECT 1 FROM organizations WHERE slug = 'lanl')
  AND EXISTS (SELECT 1 FROM users);

INSERT INTO jobs (title, slug, description, requirements, benefits, organization_id, posted_by_id, industry, type, location, remote, skills, salary_min, salary_max, salary_period, status, expires_at)
SELECT 
    'Senior AI/ML Engineer',
    'senior-ai-ml-engineer-' || gen_random_uuid()::text,
    'We are looking for a Senior AI/ML Engineer to join our growing team. You will design and implement machine learning models for autonomous vehicle perception and decision-making systems. This is an exciting opportunity to work on cutting-edge technology that will shape the future of transportation.',
    ARRAY['MS or PhD in Computer Science, ML, or related field', '5+ years of ML engineering experience', 'Experience with deep learning frameworks', 'Strong Python and C++ skills'],
    ARRAY['Stock options', 'Unlimited PTO', 'Remote-first culture', 'Learning budget', 'Health & dental'],
    (SELECT id FROM organizations WHERE slug = 'spacex' LIMIT 1),
    (SELECT id FROM users LIMIT 1),
    'ai',
    'full_time',
    'Hawthorne, CA',
    true,
    ARRAY['Python', 'PyTorch', 'TensorFlow', 'C++', 'Computer Vision', 'Deep Learning'],
    180000,
    280000,
    'yearly',
    'active',
    NOW() + INTERVAL '45 days'
WHERE EXISTS (SELECT 1 FROM organizations WHERE slug = 'spacex')
  AND EXISTS (SELECT 1 FROM users);

INSERT INTO jobs (title, slug, description, requirements, benefits, organization_id, posted_by_id, industry, type, location, remote, skills, salary_min, salary_max, salary_period, status, expires_at)
SELECT 
    'Semiconductor Process Engineer',
    'semiconductor-process-engineer-' || gen_random_uuid()::text,
    'Intel is seeking a Process Engineer to optimize our advanced semiconductor manufacturing processes. You will work on next-generation chip fabrication, troubleshoot production issues, and drive continuous improvement initiatives.',
    ARRAY['BS/MS in Chemical Engineering, Materials Science, or related', '2+ years semiconductor fab experience', 'Knowledge of photolithography and etching processes', 'Statistical analysis skills'],
    ARRAY['Relocation assistance', 'Tuition reimbursement', 'On-site fitness center', 'Employee stock purchase program'],
    (SELECT id FROM organizations WHERE slug = 'intel' LIMIT 1),
    (SELECT id FROM users LIMIT 1),
    'semiconductor',
    'full_time',
    'Hillsboro, OR',
    false,
    ARRAY['Process Engineering', 'Statistical Analysis', 'Six Sigma', 'Cleanroom', 'MATLAB'],
    120000,
    180000,
    'yearly',
    'active',
    NOW() + INTERVAL '30 days'
WHERE EXISTS (SELECT 1 FROM organizations WHERE slug = 'intel')
  AND EXISTS (SELECT 1 FROM users);

INSERT INTO jobs (title, slug, description, requirements, benefits, organization_id, posted_by_id, industry, type, location, remote, skills, salary_min, salary_max, salary_period, status, expires_at)
SELECT 
    'Cybersecurity Analyst Intern',
    'cybersecurity-analyst-intern-' || gen_random_uuid()::text,
    'The Department of Energy is offering a summer internship for students interested in cybersecurity. You will assist with vulnerability assessments, security monitoring, and incident response while learning from experienced security professionals.',
    ARRAY['Currently enrolled in BS/MS in Cybersecurity or related', 'Basic understanding of networking concepts', 'Familiarity with security tools', 'US Citizenship required'],
    ARRAY['Paid internship', 'Housing assistance', 'Mentorship program', 'Potential full-time conversion'],
    (SELECT id FROM organizations WHERE slug = 'doe' LIMIT 1),
    (SELECT id FROM users LIMIT 1),
    'cybersecurity',
    'internship',
    'Washington, DC',
    false,
    ARRAY['Network Security', 'SIEM', 'Wireshark', 'Linux', 'Python'],
    25,
    35,
    'hourly',
    'active',
    NOW() + INTERVAL '90 days'
WHERE EXISTS (SELECT 1 FROM organizations WHERE slug = 'doe')
  AND EXISTS (SELECT 1 FROM users);

INSERT INTO jobs (title, slug, description, requirements, benefits, organization_id, posted_by_id, industry, type, location, remote, skills, salary_min, salary_max, salary_period, status, featured, expires_at)
SELECT 
    'Nuclear Engineer - Fusion Research',
    'nuclear-engineer-fusion-research-' || gen_random_uuid()::text,
    'Join the cutting edge of fusion energy research. Work on plasma physics simulations, reactor design, and experimental validation. This position offers the chance to contribute to one of humanity''s most ambitious energy goals.',
    ARRAY['PhD in Nuclear Engineering or Plasma Physics', 'Experience with tokamak or stellarator systems', 'Strong computational skills', 'Publication record in fusion research'],
    ARRAY['Competitive federal salary', 'Pension plan', 'Generous leave policy', 'Research funding'],
    (SELECT id FROM organizations WHERE slug = 'lanl' LIMIT 1),
    (SELECT id FROM users LIMIT 1),
    'nuclear',
    'full_time',
    'Los Alamos, NM',
    false,
    ARRAY['Plasma Physics', 'COMSOL', 'Fortran', 'Python', 'HPC'],
    140000,
    220000,
    'yearly',
    'active',
    true,
    NOW() + INTERVAL '60 days'
WHERE EXISTS (SELECT 1 FROM organizations WHERE slug = 'lanl')
  AND EXISTS (SELECT 1 FROM users);

-- Sample Events
INSERT INTO events (title, slug, description, organizer, type, industries, location, virtual, virtual_url, capacity, start_date, end_date, registration_deadline, status, featured)
VALUES
(
    'National STEM Career Fair 2025',
    'national-stem-career-fair-2025',
    'The largest STEM career fair in the nation, connecting thousands of job seekers with leading employers in technology, energy, and manufacturing. Features keynote speakers, networking sessions, and on-the-spot interviews.',
    'Department of Energy',
    'job_fair',
    ARRAY['semiconductor', 'nuclear', 'ai', 'quantum', 'cybersecurity', 'aerospace', 'biotech', 'robotics', 'clean_energy', 'manufacturing']::industry_type[],
    'Washington Convention Center, DC',
    true,
    'https://events.stemworkforce.gov/career-fair-2025',
    5000,
    '2025-03-15 09:00:00+00',
    '2025-03-16 17:00:00+00',
    '2025-03-10 23:59:59+00',
    'upcoming',
    true
),
(
    'Quantum Computing Summit',
    'quantum-computing-summit-2025',
    'A two-day conference bringing together quantum computing researchers, industry leaders, and policymakers. Explore the latest advances in quantum hardware, algorithms, and applications.',
    'MIT',
    'conference',
    ARRAY['quantum', 'ai']::industry_type[],
    'MIT Campus, Cambridge, MA',
    true,
    'https://quantum.mit.edu/summit2025',
    500,
    '2025-04-20 08:30:00+00',
    '2025-04-21 18:00:00+00',
    '2025-04-15 23:59:59+00',
    'upcoming',
    true
),
(
    'AI Safety Workshop',
    'ai-safety-workshop-spring-2025',
    'Hands-on workshop covering AI alignment, interpretability, and safety evaluation techniques. Perfect for researchers and engineers working on responsible AI development.',
    'Anthropic',
    'workshop',
    ARRAY['ai', 'cybersecurity']::industry_type[],
    'Virtual Event',
    true,
    'https://workshop.anthropic.com/safety-2025',
    200,
    '2025-02-28 10:00:00+00',
    '2025-02-28 16:00:00+00',
    '2025-02-25 23:59:59+00',
    'upcoming',
    false
),
(
    'Clean Energy Innovation Hackathon',
    'clean-energy-hackathon-2025',
    '48-hour hackathon focused on developing innovative solutions for clean energy challenges. $50,000 in prizes for winning teams.',
    'NREL',
    'hackathon',
    ARRAY['clean_energy', 'manufacturing']::industry_type[],
    'NREL Campus, Golden, CO',
    false,
    NULL,
    150,
    '2025-05-10 18:00:00+00',
    '2025-05-12 18:00:00+00',
    '2025-05-01 23:59:59+00',
    'upcoming',
    true
);

-- Sample Training Programs
INSERT INTO training_programs (title, slug, provider, description, duration, format, level, industries, skills, cost, placement_rate, rating, reviews_count, certification_type, active, featured)
VALUES
(
    'AWS Solutions Architect Professional',
    'aws-solutions-architect-professional',
    'Amazon Web Services',
    'Comprehensive training program preparing you for the AWS Solutions Architect Professional certification. Learn to design distributed systems, migrate complex workloads, and optimize for cost and performance.',
    '12 weeks',
    'online',
    'advanced',
    ARRAY['ai', 'cybersecurity']::industry_type[],
    ARRAY['AWS', 'Cloud Architecture', 'DevOps', 'Security', 'Networking'],
    2995,
    92.5,
    4.8,
    3420,
    'AWS Solutions Architect Professional',
    true,
    true
),
(
    'Quantum Machine Learning Fundamentals',
    'quantum-machine-learning-fundamentals',
    'IBM Quantum',
    'Learn the intersection of quantum computing and machine learning. Covers variational quantum eigensolvers, quantum neural networks, and quantum-classical hybrid algorithms using Qiskit.',
    '8 weeks',
    'online',
    'intermediate',
    ARRAY['quantum', 'ai']::industry_type[],
    ARRAY['Qiskit', 'Python', 'Linear Algebra', 'Machine Learning', 'Quantum Circuits'],
    0,
    NULL,
    4.6,
    892,
    'IBM Quantum Developer Certificate',
    true,
    true
),
(
    'Cybersecurity Boot Camp',
    'cybersecurity-boot-camp',
    'SANS Institute',
    'Intensive 16-week program covering network security, penetration testing, incident response, and security operations. Includes preparation for GIAC certifications.',
    '16 weeks',
    'hybrid',
    'beginner',
    ARRAY['cybersecurity']::industry_type[],
    ARRAY['Network Security', 'Penetration Testing', 'SIEM', 'Incident Response', 'Forensics'],
    15000,
    88.0,
    4.7,
    2156,
    'GIAC Security Essentials (GSEC)',
    true,
    false
),
(
    'Nuclear Engineering Fundamentals',
    'nuclear-engineering-fundamentals',
    'MIT OpenCourseWare',
    'Free online course covering the fundamentals of nuclear engineering including reactor physics, thermal hydraulics, and nuclear materials. Self-paced with optional certificate.',
    'Self-paced',
    'self_paced',
    'beginner',
    ARRAY['nuclear', 'clean_energy']::industry_type[],
    ARRAY['Reactor Physics', 'Thermal Hydraulics', 'Nuclear Materials', 'Safety Analysis'],
    0,
    NULL,
    4.5,
    5678,
    'MIT Professional Certificate (optional)',
    true,
    false
),
(
    'Semiconductor Fabrication Technician Program',
    'semiconductor-fab-technician',
    'SEMI Foundation',
    'Hands-on training program preparing technicians for careers in semiconductor manufacturing. Includes cleanroom protocols, equipment operation, and process monitoring.',
    '6 months',
    'in_person',
    'beginner',
    ARRAY['semiconductor', 'manufacturing']::industry_type[],
    ARRAY['Cleanroom Protocols', 'Photolithography', 'Metrology', 'Equipment Maintenance'],
    4500,
    95.0,
    4.9,
    1234,
    'SEMI Certified Technician',
    true,
    true
);

-- Sample Challenges
INSERT INTO challenges (title, slug, description, sponsor, prize, categories, requirements, deadline, status)
VALUES
(
    'Quantum Error Correction Challenge',
    'quantum-error-correction-challenge-2025',
    'Develop novel quantum error correction codes or techniques that can improve the fidelity of quantum operations on near-term quantum devices. Solutions will be evaluated on theoretical soundness and practical applicability.',
    'DARPA',
    500000,
    ARRAY['quantum']::industry_type[],
    ARRAY['Must be US citizen or permanent resident', 'Code must be open-sourced', 'Written report required', 'Demo on IBM Quantum hardware'],
    '2025-06-30 23:59:59+00',
    'open'
),
(
    'AI for Grid Optimization',
    'ai-grid-optimization-2025',
    'Create machine learning solutions to optimize electrical grid operations, predict demand, and integrate renewable energy sources more effectively.',
    'Department of Energy',
    250000,
    ARRAY['ai', 'clean_energy']::industry_type[],
    ARRAY['Solution must handle real-time data', 'Must demonstrate 10% improvement over baseline', 'Documentation required'],
    '2025-08-15 23:59:59+00',
    'open'
),
(
    'Secure Semiconductor Supply Chain',
    'secure-semiconductor-supply-chain-2025',
    'Propose innovative solutions to enhance the security and resilience of the semiconductor supply chain, including counterfeit detection, provenance tracking, and risk assessment.',
    'CHIPS Program Office',
    150000,
    ARRAY['semiconductor', 'cybersecurity']::industry_type[],
    ARRAY['Prototype or detailed design required', 'Must address at least 3 supply chain vulnerabilities', 'Cost-benefit analysis included'],
    '2025-09-01 23:59:59+00',
    'open'
);

COMMIT;

-- Verify data was inserted
SELECT 'Jobs' as table_name, COUNT(*) as count FROM jobs
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Training Programs', COUNT(*) FROM training_programs
UNION ALL
SELECT 'Challenges', COUNT(*) FROM challenges
UNION ALL
SELECT 'Organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'States', COUNT(*) FROM state_workforce_data;
