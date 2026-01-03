-- COMPLETE SEED DATA FOR STEMWORKFORCE
-- Run this in Supabase SQL Editor

-- Step 1: Insert a system user for posting jobs
INSERT INTO users (id, email, first_name, last_name, role) VALUES
  ('99999999-9999-9999-9999-999999999999', 'admin@stemworkforce.gov', 'System', 'Admin', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Step 2: Insert organizations
INSERT INTO organizations (id, name, slug, type, description, website, logo, verified) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Quantum Dynamics Inc', 'quantum-dynamics-inc', 'industry', 'Leading quantum computing research company', 'https://quantumdynamics.example.com', NULL, true),
  ('22222222-2222-2222-2222-222222222222', 'National Semiconductor Lab', 'national-semiconductor-lab', 'national_lab', 'Federal semiconductor research laboratory', 'https://nsl.gov.example.com', NULL, true),
  ('33333333-3333-3333-3333-333333333333', 'AI Research Institute', 'ai-research-institute', 'academia', 'University-affiliated AI research center', 'https://airi.example.edu', NULL, true),
  ('44444444-4444-4444-4444-444444444444', 'CyberDefense Corp', 'cyberdefense-corp', 'industry', 'Enterprise cybersecurity solutions', 'https://cyberdefense.example.com', NULL, true),
  ('55555555-5555-5555-5555-555555555555', 'Clean Energy Labs', 'clean-energy-labs', 'government', 'DOE clean energy research facility', 'https://cleanenergy.gov.example.com', NULL, true)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Insert jobs
INSERT INTO jobs (id, title, slug, description, organization_id, posted_by_id, industry, type, location, remote, salary_min, salary_max, status, posted_at, expires_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Quantum Software Engineer', 'quantum-software-engineer', 'Develop quantum algorithms and software for next-generation computing systems.', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', 'quantum', 'full_time', 'San Francisco, CA', true, 150000, 220000, 'active', NOW() - INTERVAL '2 days', NOW() + INTERVAL '60 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'AI Research Scientist', 'ai-research-scientist', 'Conduct cutting-edge research in machine learning and neural networks.', '33333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', 'ai', 'full_time', 'Boston, MA', true, 140000, 200000, 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '55 days'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Semiconductor Process Engineer', 'semiconductor-process-engineer', 'Design and optimize semiconductor manufacturing processes.', '22222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'semiconductor', 'full_time', 'Austin, TX', false, 120000, 170000, 'active', NOW() - INTERVAL '1 day', NOW() + INTERVAL '59 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Cybersecurity Analyst', 'cybersecurity-analyst', 'Protect critical infrastructure from cyber threats.', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'cybersecurity', 'full_time', 'Washington, DC', true, 100000, 150000, 'active', NOW() - INTERVAL '3 days', NOW() + INTERVAL '57 days'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Nuclear Engineer Intern', 'nuclear-engineer-intern', 'Summer internship program for nuclear engineering students.', '55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', 'nuclear', 'internship', 'Oak Ridge, TN', false, 25000, 35000, 'active', NOW() - INTERVAL '7 days', NOW() + INTERVAL '53 days')
ON CONFLICT (id) DO NOTHING;

-- Step 4: Insert events
INSERT INTO events (id, title, slug, description, organizer, type, location, virtual, start_date, end_date, registration_deadline, status, featured) VALUES
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STEM Career Fair 2025', 'stem-career-fair-2025', 'Connect with top employers in emerging technology sectors.', 'STEMWorkforce', 'job_fair', 'Washington, DC', false, NOW() + INTERVAL '30 days', NOW() + INTERVAL '31 days', NOW() + INTERVAL '25 days', 'upcoming', true),
  ('22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Quantum Computing Summit', 'quantum-computing-summit', 'Annual conference on quantum computing advancements.', 'Quantum Dynamics Inc', 'conference', 'San Francisco, CA', true, NOW() + INTERVAL '45 days', NOW() + INTERVAL '47 days', NOW() + INTERVAL '40 days', 'upcoming', true),
  ('33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AI in Manufacturing Workshop', 'ai-manufacturing-workshop', 'Hands-on workshop on AI applications in manufacturing.', 'AI Research Institute', 'workshop', 'Detroit, MI', false, NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days', NOW() + INTERVAL '10 days', 'upcoming', false),
  ('44444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cybersecurity Hackathon', 'cybersecurity-hackathon', '48-hour hackathon focused on security solutions.', 'CyberDefense Corp', 'hackathon', 'Virtual', true, NOW() + INTERVAL '21 days', NOW() + INTERVAL '23 days', NOW() + INTERVAL '18 days', 'upcoming', false)
ON CONFLICT (id) DO NOTHING;

-- Step 5: Insert training programs (using proper enum array syntax)
INSERT INTO training_programs (id, title, provider, description, duration, format, level, industries, skills, cost, certification_type, rating, reviews_count, active, featured) VALUES
  ('11111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Quantum Computing Fundamentals', 'IBM Quantum', 'Learn the basics of quantum computing and Qiskit programming.', '8 weeks', 'online', 'beginner', '{quantum}', '{Qiskit,Python,Linear Algebra}', 0, 'IBM Quantum Certificate', 4.8, 2500, true, true),
  ('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Advanced Machine Learning', 'Coursera - Stanford', 'Deep dive into neural networks and deep learning.', '12 weeks', 'online', 'advanced', '{ai}', '{TensorFlow,PyTorch,Neural Networks}', 49, 'Stanford Certificate', 4.9, 15000, true, true),
  ('33333333-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Semiconductor Fabrication', 'SEMI Foundation', 'Comprehensive training on chip manufacturing processes.', '16 weeks', 'hybrid', 'intermediate', '{semiconductor}', '{Lithography,Etching,Clean Room}', 2500, 'SEMI Professional Certificate', 4.6, 800, true, false),
  ('44444444-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Certified Ethical Hacker', 'EC-Council', 'Industry-recognized cybersecurity certification program.', '10 weeks', 'online', 'intermediate', '{cybersecurity}', '{Penetration Testing,Network Security,Cryptography}', 1200, 'CEH Certification', 4.5, 5000, true, false),
  ('55555555-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nuclear Engineering Basics', 'DOE Nuclear Academy', 'Introduction to nuclear science and engineering principles.', '6 weeks', 'in_person', 'beginner', '{nuclear}', '{Reactor Physics,Radiation Safety,Nuclear Materials}', 0, 'DOE Certificate', 4.7, 350, true, false)
ON CONFLICT (id) DO NOTHING;

-- Step 6: Insert state workforce data
INSERT INTO state_workforce_data (id, state_code, state_name, total_jobs, top_industry, growth_rate, average_salary, training_programs, universities, national_labs) VALUES
  ('11111111-cccc-cccc-cccc-cccccccccccc', 'CA', 'California', 285000, 'ai', 12.5, 145000, 450, 45, '{Lawrence Livermore,SLAC,Lawrence Berkeley}'),
  ('22222222-cccc-cccc-cccc-cccccccccccc', 'TX', 'Texas', 195000, 'semiconductor', 15.2, 125000, 280, 35, '{Sandia National Lab}'),
  ('33333333-cccc-cccc-cccc-cccccccccccc', 'MA', 'Massachusetts', 125000, 'biotech', 8.7, 135000, 200, 28, '{MIT Lincoln Lab}'),
  ('44444444-cccc-cccc-cccc-cccccccccccc', 'WA', 'Washington', 110000, 'ai', 14.1, 140000, 150, 18, '{Pacific Northwest National Lab}'),
  ('55555555-cccc-cccc-cccc-cccccccccccc', 'NY', 'New York', 145000, 'ai', 9.3, 138000, 220, 40, '{Brookhaven National Lab}'),
  ('66666666-cccc-cccc-cccc-cccccccccccc', 'VA', 'Virginia', 98000, 'cybersecurity', 11.8, 128000, 120, 22, '{Jefferson Lab}'),
  ('77777777-cccc-cccc-cccc-cccccccccccc', 'CO', 'Colorado', 72000, 'aerospace', 13.4, 122000, 95, 15, '{NREL,NOAA}'),
  ('88888888-cccc-cccc-cccc-cccccccccccc', 'TN', 'Tennessee', 45000, 'nuclear', 7.2, 105000, 65, 12, '{Oak Ridge National Lab}')
ON CONFLICT (id) DO NOTHING;
