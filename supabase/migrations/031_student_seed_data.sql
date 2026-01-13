-- ===========================================
-- Student Platform Seed Data
-- Migration: 031_student_seed_data.sql
-- Real scholarship, college, and career data
-- ===========================================

-- ===========================================
-- SCHOLARSHIPS SEED DATA
-- ===========================================

INSERT INTO scholarships (name, provider, provider_type, description, website, amount_min, amount_max, amount_type, renewable, renewable_years, deadline_type, deadline_month, deadline_day, min_gpa, grade_levels, citizenship_requirements, ethnicity_requirements, majors, is_stem, stem_fields, chips_act_related, federal_program, competitiveness, num_awards, essay_required, verified, active, featured) VALUES

-- Major Federal STEM Scholarships
('NSF Graduate Research Fellowship (GRFP)', 'National Science Foundation', 'federal', 'Prestigious fellowship supporting graduate students in STEM fields with three years of support for research in NSF-supported disciplines.', 'https://www.nsfgrfp.org', 37000, 147000, 'fixed', true, 3, 'fixed', 10, 15, 3.0, ARRAY['college_senior', 'graduate_1st', 'graduate_2nd'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['all_stem'], true, ARRAY['computer_science', 'engineering', 'mathematics', 'physics', 'chemistry', 'biology', 'geosciences'], false, 'NSF', 'very_high', 2000, true, true, true, true),

('SMART Scholarship', 'Department of Defense', 'federal', 'Full scholarship for STEM students committed to working for the Department of Defense after graduation. Includes tuition, stipend, and guaranteed employment.', 'https://www.smartscholarship.org', 25000, 50000, 'full_tuition', true, 4, 'fixed', 12, 1, 3.0, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior', 'graduate'], ARRAY['us_citizen'], NULL, ARRAY['engineering', 'physics', 'mathematics', 'computer_science', 'chemistry'], true, ARRAY['electrical_engineering', 'computer_science', 'aerospace', 'nuclear', 'cybersecurity'], true, 'DOD', 'high', 400, true, true, true, true),

('CyberCorps: Scholarship for Service', 'National Science Foundation / DHS', 'federal', 'Full scholarship for cybersecurity studies in exchange for government service equal to scholarship duration.', 'https://www.sfs.opm.gov', 25000, 40000, 'full_tuition', true, 3, 'varies', NULL, NULL, 3.2, ARRAY['college_junior', 'college_senior', 'graduate'], ARRAY['us_citizen'], NULL, ARRAY['cybersecurity', 'computer_science', 'information_technology'], true, ARRAY['cybersecurity', 'computer_science'], true, 'NSF', 'high', 300, true, true, true, true),

('DOE NNSA SSGF', 'Department of Energy', 'federal', 'DOE National Nuclear Security Administration Stewardship Science Graduate Fellowship for PhD students in stewardship science areas.', 'https://www.krellinst.org/ssgf', 36000, 150000, 'fixed', true, 4, 'fixed', 1, 15, 3.5, ARRAY['graduate'], ARRAY['us_citizen'], NULL, ARRAY['physics', 'materials_science', 'engineering'], true, ARRAY['physics', 'nuclear_engineering', 'materials_science'], true, 'DOE', 'very_high', 20, true, true, true, true),

('NASA MUREP Scholarships', 'NASA', 'federal', 'Scholarships for underrepresented students at minority-serving institutions pursuing NASA-relevant STEM degrees.', 'https://www.nasa.gov/stem/murep', 5000, 10000, 'fixed', true, 2, 'fixed', 3, 15, 3.0, ARRAY['college_freshman', 'college_sophomore', 'college_junior', 'college_senior'], ARRAY['us_citizen', 'permanent_resident'], ARRAY['african_american', 'hispanic', 'native_american', 'pacific_islander'], ARRAY['aerospace', 'engineering', 'computer_science', 'physics', 'mathematics'], true, ARRAY['aerospace', 'engineering', 'computer_science'], false, 'NASA', 'medium', 200, true, true, true, true),

-- CHIPS Act Related
('CHIPS for America Workforce Scholarship', 'Department of Commerce', 'federal', 'Funding for students pursuing careers in semiconductor manufacturing, including tuition assistance and job placement support.', 'https://www.nist.gov/chips', 10000, 50000, 'variable', true, 4, 'rolling', NULL, NULL, 2.5, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior', 'college_senior', 'graduate'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['electrical_engineering', 'materials_science', 'chemical_engineering', 'physics'], true, ARRAY['semiconductor', 'electrical_engineering', 'materials_science'], true, 'Commerce', 'medium', 500, false, true, true, true),

('SRC Graduate Fellowship', 'Semiconductor Research Corporation', 'corporate', 'Industry-funded research fellowships for graduate students conducting semiconductor research at partner universities.', 'https://www.src.org', 30000, 48000, 'fixed', true, 4, 'varies', NULL, NULL, 3.5, ARRAY['graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], NULL, ARRAY['electrical_engineering', 'computer_engineering', 'materials_science', 'physics'], true, ARRAY['semiconductor', 'nanoelectronics', 'computer_engineering'], true, NULL, 'high', 100, true, true, true, true),

-- Corporate STEM Scholarships
('Google Lime Scholarship', 'Google', 'corporate', 'For students with disabilities pursuing computer science degrees. Includes mentorship and potential internship.', 'https://buildyourfuture.withgoogle.com/scholarships/google-lime-scholarship', 10000, 10000, 'fixed', false, 0, 'fixed', 12, 15, 3.0, ARRAY['college_freshman', 'college_sophomore', 'college_junior', 'college_senior', 'graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], NULL, ARRAY['computer_science', 'computer_engineering'], true, ARRAY['computer_science'], false, NULL, 'high', 25, true, true, true, false),

('Intel STEM Scholarship', 'Intel Foundation', 'corporate', 'Scholarships for underrepresented students in STEM, particularly those interested in semiconductor and computing fields.', 'https://www.intel.com/scholarships', 5000, 10000, 'fixed', true, 2, 'fixed', 2, 28, 3.0, ARRAY['12th', 'college_freshman', 'college_sophomore'], ARRAY['us_citizen', 'permanent_resident'], ARRAY['african_american', 'hispanic', 'native_american'], ARRAY['engineering', 'computer_science', 'physics', 'mathematics'], true, ARRAY['electrical_engineering', 'computer_science', 'semiconductor'], true, NULL, 'medium', 100, true, true, true, false),

('Microsoft Scholarship', 'Microsoft', 'corporate', 'For students pursuing degrees in computer science, computer engineering, or related STEM disciplines.', 'https://careers.microsoft.com/students/scholarships', 5000, 20000, 'fixed', true, 2, 'fixed', 1, 31, 3.0, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['computer_science', 'computer_engineering', 'software_engineering'], true, ARRAY['computer_science', 'software_engineering'], false, NULL, 'high', 50, true, true, true, false),

('NVIDIA Graduate Fellowship', 'NVIDIA', 'corporate', 'For PhD students pursuing research in areas like AI, deep learning, robotics, or GPU computing.', 'https://www.nvidia.com/en-us/research/graduate-fellowships', 50000, 50000, 'fixed', false, 0, 'fixed', 9, 15, 3.5, ARRAY['graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], NULL, ARRAY['computer_science', 'electrical_engineering'], true, ARRAY['artificial_intelligence', 'machine_learning', 'gpu_computing'], false, NULL, 'very_high', 10, true, true, true, true),

-- Nonprofit STEM Scholarships
('Society of Women Engineers Scholarship', 'Society of Women Engineers', 'nonprofit', 'Multiple scholarships for women pursuing engineering and technology degrees at all levels.', 'https://swe.org/scholarships', 1000, 15000, 'variable', true, 1, 'fixed', 2, 15, 3.0, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior', 'college_senior', 'graduate'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['engineering'], true, ARRAY['all_engineering'], false, NULL, 'medium', 200, true, true, true, false),

('NSBE Scholarships', 'National Society of Black Engineers', 'nonprofit', 'Multiple scholarships for Black students pursuing engineering degrees.', 'https://www.nsbe.org/scholarships', 500, 10000, 'variable', true, 1, 'fixed', 3, 31, 2.75, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior', 'college_senior'], ARRAY['us_citizen', 'permanent_resident'], ARRAY['african_american'], ARRAY['engineering'], true, ARRAY['all_engineering'], false, NULL, 'medium', 300, true, true, true, false),

('SHPE Scholarship', 'Society of Hispanic Professional Engineers', 'nonprofit', 'Scholarships for Hispanic students pursuing STEM degrees.', 'https://shpe.org/students/scholarships', 1000, 5000, 'variable', true, 1, 'fixed', 4, 30, 3.0, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior', 'college_senior'], ARRAY['us_citizen', 'permanent_resident'], ARRAY['hispanic'], ARRAY['engineering', 'computer_science', 'stem'], true, ARRAY['all_engineering', 'computer_science'], false, NULL, 'medium', 150, true, true, true, false),

('American Indian Science and Engineering Society', 'AISES', 'nonprofit', 'Scholarships for American Indian, Alaska Native, Native Hawaiian students in STEM fields.', 'https://www.aises.org/students/scholarships', 1000, 10000, 'variable', true, 1, 'fixed', 5, 1, 3.0, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior', 'college_senior', 'graduate'], ARRAY['us_citizen'], ARRAY['native_american', 'alaska_native', 'native_hawaiian'], ARRAY['stem'], true, ARRAY['all_stem'], false, NULL, 'medium', 100, true, true, true, false),

-- State-Based STEM
('California STEM Scholarship', 'California Student Aid Commission', 'state', 'For California residents pursuing STEM degrees at California institutions.', 'https://www.csac.ca.gov', 5000, 12500, 'fixed', true, 4, 'fixed', 3, 2, 3.0, ARRAY['12th', 'college_freshman', 'college_sophomore', 'college_junior'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['stem'], true, ARRAY['all_stem'], false, NULL, 'medium', 1000, false, true, true, false),

('Texas Instruments STEM Scholarship', 'Texas Instruments', 'corporate', 'For students in Texas pursuing electrical engineering or computer science degrees.', 'https://careers.ti.com/scholarships', 2500, 10000, 'fixed', true, 2, 'fixed', 2, 1, 3.2, ARRAY['12th', 'college_freshman', 'college_sophomore'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['electrical_engineering', 'computer_science', 'computer_engineering'], true, ARRAY['electrical_engineering', 'computer_science', 'semiconductor'], true, NULL, 'medium', 50, true, true, true, false),

-- Merit-Based National
('Regeneron Science Talent Search', 'Regeneron', 'corporate', 'Most prestigious pre-college science competition for high school seniors. Top 40 finalists compete for awards.', 'https://www.societyforscience.org/regeneron-sts', 2000, 250000, 'variable', false, 0, 'fixed', 11, 10, 3.5, ARRAY['12th'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['stem'], true, ARRAY['all_stem'], false, NULL, 'very_high', 300, true, true, true, true),

('Barry Goldwater Scholarship', 'Barry Goldwater Foundation', 'federal', 'Premier undergraduate award for students pursuing research careers in natural sciences, mathematics, and engineering.', 'https://goldwaterscholarship.gov', 7500, 7500, 'fixed', true, 2, 'fixed', 1, 31, 3.8, ARRAY['college_sophomore', 'college_junior'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['mathematics', 'natural_sciences', 'engineering'], true, ARRAY['all_stem'], false, 'Goldwater', 'very_high', 400, true, true, true, true),

('Hertz Foundation Fellowship', 'Fannie and John Hertz Foundation', 'private', 'One of the most generous graduate fellowships for PhD students in applied physical and biological sciences.', 'https://www.hertzfoundation.org', 250000, 250000, 'full_ride', true, 5, 'fixed', 10, 15, 3.75, ARRAY['college_senior', 'graduate'], ARRAY['us_citizen', 'permanent_resident'], NULL, ARRAY['applied_sciences', 'engineering', 'mathematics', 'physics'], true, ARRAY['physics', 'engineering', 'applied_sciences'], false, NULL, 'very_high', 15, true, true, true, true),

-- Community/Need-Based
('Dell Scholars Program', 'Michael and Susan Dell Foundation', 'private', 'For low-income, first-generation students with strong academic records and grit.', 'https://www.dellscholars.org', 20000, 20000, 'fixed', true, 4, 'fixed', 12, 1, 2.4, ARRAY['12th'], ARRAY['us_citizen', 'permanent_resident'], NULL, NULL, false, NULL, false, NULL, 'high', 500, true, true, true, false),

('QuestBridge National College Match', 'QuestBridge', 'nonprofit', 'Full four-year scholarships at top colleges for high-achieving, low-income students.', 'https://www.questbridge.org', 200000, 300000, 'full_ride', true, 4, 'fixed', 9, 26, 3.5, ARRAY['12th'], ARRAY['us_citizen', 'permanent_resident'], NULL, NULL, false, NULL, false, NULL, 'very_high', 6000, true, true, true, true),

('Jack Kent Cooke Foundation Scholarship', 'Jack Kent Cooke Foundation', 'private', 'For high-achieving students with financial need transferring from community college or graduating high school.', 'https://www.jkcf.org', 40000, 55000, 'fixed', true, 4, 'fixed', 11, 15, 3.5, ARRAY['12th', 'transfer'], ARRAY['us_citizen', 'permanent_resident'], NULL, NULL, false, NULL, false, NULL, 'very_high', 60, true, true, true, true),

-- Quantum Computing Specific
('IBM Quantum Network Scholarship', 'IBM', 'corporate', 'For students pursuing quantum computing research and education.', 'https://www.ibm.com/quantum', 5000, 15000, 'fixed', false, 0, 'fixed', 4, 1, 3.3, ARRAY['college_junior', 'college_senior', 'graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], NULL, ARRAY['physics', 'computer_science', 'mathematics'], true, ARRAY['quantum_computing', 'physics', 'computer_science'], false, NULL, 'high', 30, true, true, true, true),

-- AI/ML Specific
('OpenAI Scholars Program', 'OpenAI', 'corporate', 'Supports individuals from underrepresented groups to study AI safety and alignment.', 'https://openai.com/blog/openai-scholars', 10000, 50000, 'variable', false, 0, 'fixed', 3, 1, 3.0, ARRAY['college_senior', 'graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], NULL, ARRAY['computer_science', 'mathematics'], true, ARRAY['artificial_intelligence', 'machine_learning'], false, NULL, 'very_high', 10, true, true, true, true)

ON CONFLICT DO NOTHING;

-- ===========================================
-- STEM FUNDING PROGRAMS SEED DATA
-- ===========================================

INSERT INTO stem_funding_programs (name, agency, program_type, description, website, amount_description, amount_min, amount_max, includes_tuition, includes_stipend, education_level, citizenship_required, security_clearance_required, service_commitment_years, stem_fields, chips_act_funded, semiconductor_focus, deadline_type, competitiveness, active, featured) VALUES

('CHIPS for America Workforce Development', 'Department of Commerce', 'workforce', 'Funding for students pursuing careers in semiconductor manufacturing, including tuition assistance, internships, and job placement.', 'https://www.nist.gov/chips', 'Up to $50,000 over 4 years', 10000, 50000, true, false, ARRAY['undergraduate', 'graduate'], ARRAY['us_citizen', 'permanent_resident'], false, 0, ARRAY['electrical_engineering', 'materials_science', 'chemical_engineering', 'physics', 'manufacturing'], true, true, 'rolling', 'medium', true, true),

('NSF Graduate Research Fellowship', 'National Science Foundation', 'fellowship', 'Three years of support for graduate students in STEM fields, including annual stipend and education allowance.', 'https://www.nsfgrfp.org', '$37,000 stipend + $16,000 education allowance annually', 37000, 53000, true, true, ARRAY['graduate'], ARRAY['us_citizen', 'permanent_resident'], false, 0, ARRAY['all_stem'], false, false, 'fixed', 'very_high', true, true),

('DOE SULI Program', 'Department of Energy', 'internship', 'Paid research internships at DOE National Laboratories for undergraduate students.', 'https://science.osti.gov/wdts/suli', '$750/week + travel + housing', 7500, 12000, false, true, ARRAY['undergraduate'], ARRAY['us_citizen'], false, 0, ARRAY['physics', 'chemistry', 'computer_science', 'engineering', 'materials_science'], false, false, 'fixed', 'medium', true, true),

('DOE SCGSR Program', 'Department of Energy', 'fellowship', 'Graduate students conduct thesis research at DOE laboratories while receiving supplemental funding.', 'https://science.osti.gov/wdts/scgsr', 'Monthly stipend + travel', 3000, 36000, false, true, ARRAY['graduate'], ARRAY['us_citizen'], false, 0, ARRAY['physics', 'chemistry', 'engineering', 'computer_science'], false, false, 'fixed', 'high', true, false),

('NASA Pathways Internship', 'NASA', 'internship', 'Paid internships at NASA centers for students pursuing STEM degrees with potential conversion to full-time.', 'https://intern.nasa.gov', '$17-$25/hour', 5000, 15000, false, true, ARRAY['undergraduate', 'graduate'], ARRAY['us_citizen'], false, 0, ARRAY['aerospace', 'engineering', 'computer_science', 'physics', 'mathematics'], false, false, 'rolling', 'high', true, true),

('NIST SURF Program', 'NIST', 'internship', 'Summer Undergraduate Research Fellowship at NIST laboratories.', 'https://www.nist.gov/surf', '$6,000 for 11 weeks', 6000, 6000, false, true, ARRAY['undergraduate'], ARRAY['us_citizen', 'permanent_resident'], false, 0, ARRAY['physics', 'chemistry', 'engineering', 'computer_science', 'mathematics'], false, false, 'fixed', 'medium', true, false),

('DoD SMART Program', 'Department of Defense', 'scholarship', 'Full scholarship with guaranteed civilian employment at DoD after graduation.', 'https://www.smartscholarship.org', 'Full tuition + $25,000-$38,000 stipend', 25000, 50000, true, true, ARRAY['undergraduate', 'graduate'], ARRAY['us_citizen'], true, 4, ARRAY['engineering', 'physics', 'computer_science', 'mathematics', 'chemistry'], true, false, 'fixed', 'high', true, true),

('NSA STOKES Program', 'National Security Agency', 'scholarship', 'Full scholarship for students pursuing computer science, computer engineering, or electrical engineering with summer internships and post-graduation employment.', 'https://www.intelligencecareers.gov/nsa/nsastudents', 'Full tuition + $30,000/year', 30000, 50000, true, true, ARRAY['undergraduate'], ARRAY['us_citizen'], true, 5, ARRAY['computer_science', 'electrical_engineering', 'computer_engineering', 'mathematics'], true, false, 'fixed', 'very_high', true, false),

('ARPA-E SCALEUP', 'Department of Energy', 'grant', 'Funding for technology commercialization and scale-up of energy innovations.', 'https://arpa-e.energy.gov/technologies/scaleup', 'Project-based grants', 50000, 5000000, false, false, ARRAY['graduate', 'postdoc'], ARRAY['us_citizen', 'permanent_resident'], false, 0, ARRAY['energy', 'materials_science', 'engineering'], true, false, 'varies', 'very_high', true, false),

('NIH F31 Predoctoral Fellowship', 'National Institutes of Health', 'fellowship', 'Individual predoctoral fellowship for PhD students in biomedical and behavioral research.', 'https://researchtraining.nih.gov/programs/fellowships/f31', '$26,352 stipend + tuition/fees', 26352, 45000, true, true, ARRAY['graduate'], ARRAY['us_citizen', 'permanent_resident'], false, 0, ARRAY['biology', 'biomedical_engineering', 'neuroscience', 'biochemistry'], false, false, 'varies', 'high', true, false),

('Ford Foundation Predoctoral Fellowship', 'Ford Foundation', 'fellowship', 'Three-year fellowship for PhD students committed to diversity in higher education.', 'https://sites.nationalacademies.org/pga/fordfellowships', '$27,000 annual stipend', 27000, 27000, false, true, ARRAY['graduate'], ARRAY['us_citizen', 'permanent_resident'], false, 0, ARRAY['all_stem'], false, false, 'fixed', 'very_high', true, false),

('Semiconductor Research Corporation GRC', 'SRC', 'fellowship', 'Industry-funded research fellowships for graduate students in semiconductor-related fields.', 'https://www.src.org/student-center/fellowship', '$36,000-$48,000 annual stipend', 36000, 48000, true, true, ARRAY['graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], false, 0, ARRAY['electrical_engineering', 'computer_engineering', 'physics', 'materials_science'], true, true, 'varies', 'high', true, true),

('Intel Research Internship', 'Intel', 'internship', 'Paid research internships at Intel Labs for graduate students.', 'https://www.intel.com/content/www/us/en/research/careers.html', 'Competitive hourly rate + housing', 15000, 25000, false, true, ARRAY['graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], false, 0, ARRAY['electrical_engineering', 'computer_science', 'physics', 'materials_science'], true, true, 'rolling', 'high', true, false),

('IBM Quantum Summer Internship', 'IBM', 'internship', 'Summer internship program focused on quantum computing research and development.', 'https://www.ibm.com/quantum/internships', '$25-$45/hour', 10000, 20000, false, true, ARRAY['undergraduate', 'graduate'], ARRAY['us_citizen', 'permanent_resident', 'international'], false, 0, ARRAY['physics', 'computer_science', 'mathematics'], false, false, 'fixed', 'very_high', true, true)

ON CONFLICT DO NOTHING;

-- ===========================================
-- CAREER PATHS SEED DATA
-- ===========================================

INSERT INTO career_paths (title, slug, field, description, icon, bls_code, salary_entry, salary_median, salary_senior, salary_75th, salary_90th, annual_growth_rate, total_employment, job_growth_10yr, job_openings_annual, demand_level, typical_education, typical_experience, certifications, skills, time_to_senior, related_majors, top_employers, top_locations, remote_friendly, chips_act_relevant, semiconductor_industry, data_year, data_source) VALUES

('Software Engineer', 'software-engineer', 'Technology', 'Design, develop, and maintain software applications and systems.', '💻', '15-1256', 95000, 130000, 185000, 165000, 200000, 5.5, 1847900, 25, 189200, 'very_high', 'Bachelor''s in CS/SE', '0-2 years', ARRAY['AWS Certified', 'Google Cloud Professional'], ARRAY['Python', 'Java', 'JavaScript', 'SQL', 'Git', 'System Design'], 7, ARRAY['Computer Science', 'Software Engineering', 'Information Technology'], ARRAY['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'], ARRAY['San Francisco', 'Seattle', 'New York', 'Austin', 'Denver'], true, false, false, 2024, 'BLS'),

('Data Scientist', 'data-scientist', 'Technology', 'Analyze complex datasets to drive business insights and build predictive models.', '📊', '15-2051', 90000, 125000, 175000, 155000, 190000, 6.0, 192000, 35, 21900, 'very_high', 'Master''s in Data Science', '0-2 years', ARRAY['AWS ML Specialty', 'Google Data Engineer'], ARRAY['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'TensorFlow'], 6, ARRAY['Data Science', 'Statistics', 'Computer Science', 'Mathematics'], ARRAY['Google', 'Meta', 'Netflix', 'Airbnb', 'Uber', 'LinkedIn'], ARRAY['San Francisco', 'New York', 'Seattle', 'Boston', 'Chicago'], true, false, false, 2024, 'BLS'),

('Semiconductor Process Engineer', 'semiconductor-process-engineer', 'Semiconductors', 'Develop and optimize semiconductor manufacturing processes in fab environments.', '🔬', '17-2199', 85000, 120000, 165000, 145000, 180000, 5.0, 45000, 15, 4500, 'very_high', 'Master''s in EE/ChemE', '0-3 years', ARRAY['Six Sigma', 'Lean Manufacturing'], ARRAY['Photolithography', 'Thin Films', 'Process Integration', 'Statistical Process Control', 'Cleanroom'], 8, ARRAY['Electrical Engineering', 'Chemical Engineering', 'Materials Science', 'Physics'], ARRAY['Intel', 'TSMC', 'Samsung', 'GlobalFoundries', 'Micron', 'Texas Instruments'], ARRAY['Phoenix AZ', 'Portland OR', 'Austin TX', 'San Jose CA', 'Boise ID'], false, true, true, 2024, 'BLS'),

('Machine Learning Engineer', 'ml-engineer', 'AI/ML', 'Build and deploy machine learning models and infrastructure at scale.', '🤖', '15-2051', 105000, 145000, 200000, 180000, 230000, 6.5, 125000, 40, 15000, 'very_high', 'Master''s in ML/AI', '1-3 years', ARRAY['TensorFlow Developer', 'AWS ML Specialty'], ARRAY['PyTorch', 'TensorFlow', 'Python', 'MLOps', 'Distributed Systems', 'Deep Learning'], 6, ARRAY['Computer Science', 'Machine Learning', 'Statistics', 'Mathematics'], ARRAY['OpenAI', 'Google DeepMind', 'NVIDIA', 'Meta AI', 'Anthropic'], ARRAY['San Francisco', 'New York', 'Seattle', 'London', 'Toronto'], true, false, false, 2024, 'BLS'),

('Cybersecurity Engineer', 'cybersecurity-engineer', 'Security', 'Protect systems and data from cyber threats through security architecture and incident response.', '🔐', '15-1212', 85000, 115000, 160000, 140000, 175000, 5.5, 163000, 33, 16800, 'very_high', 'Bachelor''s in CS/Cyber', '1-3 years', ARRAY['CISSP', 'CEH', 'Security+', 'OSCP'], ARRAY['Network Security', 'Penetration Testing', 'Incident Response', 'Cloud Security', 'SIEM'], 7, ARRAY['Cybersecurity', 'Computer Science', 'Information Technology'], ARRAY['CrowdStrike', 'Palo Alto Networks', 'Mandiant', 'NSA', 'CISA', 'Booz Allen'], ARRAY['Washington DC', 'San Francisco', 'Austin', 'Denver', 'Atlanta'], true, true, false, 2024, 'BLS'),

('Quantitative Analyst', 'quantitative-analyst', 'Finance', 'Develop mathematical models for trading strategies and risk management.', '📈', '15-2041', 120000, 175000, 300000, 250000, 400000, 7.0, 48000, 8, 4800, 'high', 'Master''s/PhD in Math/CS', '0-2 years', ARRAY['CFA', 'FRM'], ARRAY['Python', 'C++', 'Statistics', 'Stochastic Calculus', 'Machine Learning', 'Financial Modeling'], 7, ARRAY['Mathematics', 'Physics', 'Computer Science', 'Financial Engineering'], ARRAY['Jane Street', 'Two Sigma', 'Citadel', 'DE Shaw', 'Goldman Sachs'], ARRAY['New York', 'Chicago', 'London', 'Hong Kong', 'Greenwich CT'], false, false, false, 2024, 'BLS'),

('DevOps Engineer', 'devops-engineer', 'Technology', 'Build and maintain CI/CD pipelines, infrastructure automation, and cloud systems.', '🚀', '15-1244', 88000, 120000, 165000, 145000, 180000, 5.5, 85000, 22, 9500, 'very_high', 'Bachelor''s + Certs', '1-3 years', ARRAY['AWS Solutions Architect', 'Kubernetes Administrator', 'Terraform'], ARRAY['AWS/GCP/Azure', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'], 6, ARRAY['Computer Science', 'Information Technology', 'Systems Engineering'], ARRAY['Amazon', 'Google', 'Netflix', 'Spotify', 'HashiCorp'], ARRAY['San Francisco', 'Seattle', 'New York', 'Austin', 'Denver'], true, false, false, 2024, 'BLS'),

('Biotech Research Scientist', 'biotech-research-scientist', 'Biotech', 'Conduct research in biotechnology, drug discovery, and genetic engineering.', '🧬', '19-1029', 75000, 105000, 145000, 130000, 160000, 4.5, 145000, 10, 13000, 'high', 'PhD in Biology/Biochem', '0-3 years', NULL, ARRAY['CRISPR', 'PCR', 'Cell Culture', 'Protein Engineering', 'Bioinformatics'], 8, ARRAY['Biology', 'Biochemistry', 'Biomedical Engineering', 'Genetics'], ARRAY['Genentech', 'Moderna', 'Illumina', 'Amgen', 'Regeneron'], ARRAY['San Francisco', 'Boston', 'San Diego', 'Research Triangle NC'], false, false, false, 2024, 'BLS'),

('Quantum Computing Researcher', 'quantum-computing-researcher', 'Quantum', 'Research and develop quantum algorithms, hardware, and error correction methods.', '⚛️', '15-1299', 110000, 140000, 190000, 170000, 220000, 8.0, 3500, 35, 500, 'high', 'PhD in Physics/CS', '0-2 years', NULL, ARRAY['Quantum Algorithms', 'Qiskit/Cirq', 'Linear Algebra', 'Error Correction', 'Cryogenics'], 6, ARRAY['Physics', 'Computer Science', 'Mathematics', 'Electrical Engineering'], ARRAY['IBM Quantum', 'Google Quantum AI', 'IonQ', 'Rigetti', 'Microsoft'], ARRAY['San Francisco', 'New York', 'Boulder CO', 'College Park MD'], false, true, false, 2024, 'Industry'),

('Technical Product Manager', 'technical-pm', 'Product', 'Lead product development for technical products, bridging engineering and business.', '🎯', '11-9199', 95000, 140000, 200000, 175000, 230000, 6.0, 45000, 12, 5000, 'high', 'Bachelor''s + MBA', '3-5 years', ARRAY['PMP', 'Agile/Scrum'], ARRAY['Product Strategy', 'Technical Architecture', 'Agile', 'Data Analysis', 'User Research'], 8, ARRAY['Computer Science', 'Engineering', 'Business', 'Economics'], ARRAY['Google', 'Meta', 'Amazon', 'Microsoft', 'Stripe', 'Airbnb'], ARRAY['San Francisco', 'Seattle', 'New York', 'Austin', 'Boston'], true, false, false, 2024, 'BLS'),

('Robotics Engineer', 'robotics-engineer', 'Robotics', 'Design, build, and program robotic systems for manufacturing, healthcare, and automation.', '🤖', '17-2199', 82000, 110000, 150000, 135000, 165000, 5.0, 35000, 18, 4000, 'high', 'Master''s in Robotics/ME', '0-3 years', ARRAY['ROS Certification'], ARRAY['ROS', 'Python', 'C++', 'Computer Vision', 'Control Systems', 'Sensors'], 7, ARRAY['Robotics', 'Mechanical Engineering', 'Electrical Engineering', 'Computer Science'], ARRAY['Boston Dynamics', 'Tesla', 'Amazon Robotics', 'Intuitive Surgical', 'ABB'], ARRAY['Boston', 'Pittsburgh', 'San Francisco', 'Detroit', 'Austin'], false, true, false, 2024, 'BLS'),

('Cloud Solutions Architect', 'cloud-architect', 'Technology', 'Design and implement cloud infrastructure solutions for enterprise applications.', '☁️', '15-1244', 100000, 140000, 190000, 170000, 210000, 5.5, 65000, 20, 7500, 'very_high', 'Bachelor''s + Certs', '3-5 years', ARRAY['AWS Solutions Architect Pro', 'Google Cloud Architect', 'Azure Solutions Architect'], ARRAY['AWS', 'GCP', 'Azure', 'Terraform', 'Kubernetes', 'Microservices'], 6, ARRAY['Computer Science', 'Information Technology', 'Systems Engineering'], ARRAY['Amazon', 'Google', 'Microsoft', 'Accenture', 'Deloitte'], ARRAY['Seattle', 'San Francisco', 'New York', 'Washington DC', 'Austin'], true, false, false, 2024, 'BLS')

ON CONFLICT (slug) DO UPDATE SET
    salary_entry = EXCLUDED.salary_entry,
    salary_median = EXCLUDED.salary_median,
    salary_senior = EXCLUDED.salary_senior,
    job_growth_10yr = EXCLUDED.job_growth_10yr,
    updated_at = NOW();

-- ===========================================
-- SAMPLE COLLEGES (Top STEM Schools)
-- ===========================================

INSERT INTO colleges (ipeds_id, name, city, state, website, school_type, level, enrollment_undergraduate, setting, acceptance_rate, sat_avg, act_avg, tuition_in_state, tuition_out_state, tuition_private, room_board, total_cost_in_state, total_cost_out_state, avg_net_price, net_price_0_30k, net_price_30_48k, net_price_48_75k, net_price_75_110k, pct_receiving_aid, graduation_rate_4yr, graduation_rate_6yr, median_earnings_10yr, student_faculty_ratio, popular_majors, stem_programs, hbcu, test_optional, us_news_national_rank, data_year) VALUES

('166027', 'Massachusetts Institute of Technology', 'Cambridge', 'MA', 'https://mit.edu', 'private_nonprofit', '4-year', 4638, 'city_large', 3.96, 1545, 35, NULL, NULL, 59750, 19680, NULL, 79430, 23664, 6405, 8127, 15384, 25152, 59, 87, 96, 155200, 3.0, ARRAY['Computer Science', 'Engineering', 'Mathematics', 'Physics'], ARRAY['AI/ML', 'Robotics', 'Quantum Computing', 'Biotech'], false, false, 2, 2024),

('243744', 'Stanford University', 'Stanford', 'CA', 'https://stanford.edu', 'private_nonprofit', '4-year', 8049, 'suburb_large', 3.68, 1545, 35, NULL, NULL, 61731, 19953, NULL, 81684, 17271, 4421, 6168, 13893, 24858, 52, 75, 96, 143100, 5.0, ARRAY['Computer Science', 'Engineering', 'Biology', 'Economics'], ARRAY['AI/ML', 'Biotech', 'Energy', 'Medicine'], false, true, 3, 2024),

('110635', 'California Institute of Technology', 'Pasadena', 'CA', 'https://caltech.edu', 'private_nonprofit', '4-year', 987, 'city_midsize', 3.18, 1560, 36, NULL, NULL, 62784, 20859, NULL, 83643, 24633, 3618, 7017, 16083, 28089, 60, 82, 94, 112200, 3.0, ARRAY['Engineering', 'Physics', 'Computer Science', 'Biology'], ARRAY['Quantum', 'Aerospace', 'Astrophysics', 'JPL'], false, false, 6, 2024),

('130794', 'Yale University', 'New Haven', 'CT', 'https://yale.edu', 'private_nonprofit', '4-year', 6536, 'city_midsize', 4.35, 1540, 35, NULL, NULL, 64700, 19370, NULL, 84070, 17711, 2675, 4586, 11175, 21436, 53, 89, 97, 95400, 6.0, ARRAY['Economics', 'Political Science', 'Biology', 'Computer Science'], ARRAY['Biomedical', 'Environmental', 'Data Science'], false, true, 5, 2024),

('186131', 'Princeton University', 'Princeton', 'NJ', 'https://princeton.edu', 'private_nonprofit', '4-year', 5604, 'town_fringe', 4.38, 1540, 35, NULL, NULL, 59710, 19380, NULL, 79090, 12289, -1600, -410, 7490, 16560, 62, 90, 98, 110500, 5.0, ARRAY['Computer Science', 'Economics', 'Engineering', 'Public Policy'], ARRAY['Quantum', 'Plasma Physics', 'AI'], false, true, 1, 2024),

('110662', 'University of California-Berkeley', 'Berkeley', 'CA', 'https://berkeley.edu', 'public', '4-year', 32831, 'city_midsize', 11.64, 1440, 33, 14312, 44066, NULL, 20712, 35024, 64778, 19334, 10284, 14796, 21972, 29940, 66, 76, 93, 85200, 20.0, ARRAY['Computer Science', 'Engineering', 'Economics', 'Biology'], ARRAY['AI/ML', 'Biotech', 'Data Science', 'Semiconductors'], false, true, 15, 2024),

('145637', 'University of Illinois Urbana-Champaign', 'Champaign', 'IL', 'https://illinois.edu', 'public', '4-year', 35120, 'city_small', 44.82, 1425, 32, 17138, 35110, NULL, 12684, 29822, 47794, 19152, 13608, 17376, 22032, 27036, 51, 70, 85, 78600, 20.0, ARRAY['Computer Science', 'Engineering', 'Business', 'Biology'], ARRAY['NCSA', 'Semiconductors', 'AI/ML', 'Quantum'], false, true, 35, 2024),

('141574', 'Georgia Institute of Technology', 'Atlanta', 'GA', 'https://gatech.edu', 'public', '4-year', 18562, 'city_large', 17.35, 1480, 34, 12682, 33794, NULL, 14660, 27342, 48454, 16821, 6141, 10071, 17343, 24813, 68, 44, 92, 97800, 21.0, ARRAY['Computer Science', 'Engineering', 'Business', 'Biology'], ARRAY['AI/ML', 'Robotics', 'Cybersecurity', 'Semiconductors'], false, false, 33, 2024),

('228778', 'University of Texas at Austin', 'Austin', 'TX', 'https://utexas.edu', 'public', '4-year', 41309, 'city_large', 31.17, 1385, 31, 11448, 41070, NULL, 13572, 25020, 54642, 18990, 12060, 17250, 23484, 29088, 54, 70, 88, 70100, 17.0, ARRAY['Business', 'Engineering', 'Computer Science', 'Biology'], ARRAY['Dell Medical', 'Semiconductors', 'AI/ML', 'Energy'], false, true, 32, 2024),

('215293', 'Carnegie Mellon University', 'Pittsburgh', 'PA', 'https://cmu.edu', 'private_nonprofit', '4-year', 7500, 'city_large', 10.84, 1540, 35, NULL, NULL, 62260, 17836, NULL, 80096, 26028, 8988, 11676, 18864, 30492, 55, 75, 93, 109500, 9.0, ARRAY['Computer Science', 'Engineering', 'Business', 'Arts'], ARRAY['AI/ML', 'Robotics', 'Cybersecurity', 'Software'], false, false, 22, 2024),

('190415', 'Cornell University', 'Ithaca', 'NY', 'https://cornell.edu', 'private_nonprofit', '4-year', 15735, 'town_fringe', 7.26, 1530, 34, NULL, NULL, 65204, 17916, NULL, 83120, 23661, 6633, 10665, 18171, 29325, 52, 88, 95, 89800, 9.0, ARRAY['Engineering', 'Agriculture', 'Hotel Admin', 'Computer Science'], ARRAY['Cornell Tech', 'Biotech', 'Agriculture Tech'], false, true, 12, 2024),

('170976', 'University of Michigan-Ann Arbor', 'Ann Arbor', 'MI', 'https://umich.edu', 'public', '4-year', 32695, 'city_midsize', 17.65, 1470, 33, 16736, 57273, NULL, 13166, 29902, 70439, 17811, 10449, 15789, 22947, 31869, 60, 79, 93, 80900, 15.0, ARRAY['Engineering', 'Business', 'Psychology', 'Economics'], ARRAY['Robotics', 'Biomedical', 'AI/ML', 'Automotive'], false, true, 21, 2024),

('104151', 'Arizona State University', 'Tempe', 'AZ', 'https://asu.edu', 'public', '4-year', 65585, 'city_large', 88.38, 1245, 26, 11338, 30456, NULL, 14028, 25366, 44484, 14253, 11469, 16605, 21789, 26205, 91, 51, 69, 54400, 18.0, ARRAY['Business', 'Engineering', 'Health', 'Education'], ARRAY['Semiconductors', 'Sustainability', 'AI/ML', 'Space'], false, true, 105, 2024),

('227757', 'Rice University', 'Houston', 'TX', 'https://rice.edu', 'private_nonprofit', '4-year', 4494, 'city_large', 8.56, 1540, 35, NULL, NULL, 56874, 17050, NULL, 73924, 19847, 7265, 10577, 16913, 26201, 44, 85, 94, 87100, 6.0, ARRAY['Engineering', 'Computer Science', 'Biology', 'Economics'], ARRAY['Nanotechnology', 'Space', 'Biotech', 'AI'], false, true, 17, 2024),

('139959', 'Purdue University', 'West Lafayette', 'IN', 'https://purdue.edu', 'public', '4-year', 37949, 'city_small', 53.42, 1340, 30, 9992, 28794, NULL, 11450, 21442, 40244, 14469, 11625, 16341, 20589, 24897, 48, 64, 83, 73700, 13.0, ARRAY['Engineering', 'Computer Science', 'Business', 'Agriculture'], ARRAY['Semiconductors', 'Aerospace', 'Manufacturing', 'Ag Tech'], false, true, 43, 2024)

ON CONFLICT (ipeds_id) DO UPDATE SET
    acceptance_rate = EXCLUDED.acceptance_rate,
    tuition_in_state = EXCLUDED.tuition_in_state,
    tuition_out_state = EXCLUDED.tuition_out_state,
    avg_net_price = EXCLUDED.avg_net_price,
    graduation_rate_6yr = EXCLUDED.graduation_rate_6yr,
    median_earnings_10yr = EXCLUDED.median_earnings_10yr,
    last_updated = NOW();
