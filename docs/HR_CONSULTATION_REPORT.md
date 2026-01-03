# STEMWorkforce Platform - HR Consultation Report
## Form & Dashboard Enhancement Recommendations

Based on industry best practices from federal HR specialists, national laboratory recruiters, private sector ATS systems, academic career services, municipal HR departments, and nonprofit compliance officers.

---

## Executive Summary

Our current registration form collects only basic information (name, email, password). To serve as a professional workforce platform, we need **role-specific registration flows** and **enhanced job posting forms** tailored to each partner type's unique compliance, clearance, and reporting requirements.

---

## Current State Analysis

### Current Registration Form Fields:
- ✅ First Name
- ✅ Last Name  
- ✅ Email
- ✅ Password
- ❌ No role selection
- ❌ No organization information
- ❌ No industry preferences
- ❌ No clearance status
- ❌ No citizenship status

### Current Gaps:
1. **No role differentiation** - Everyone becomes a "job_seeker" by default
2. **No organization registration** - Partners can't register their companies
3. **No compliance fields** - Missing clearance, citizenship, ITAR requirements
4. **No profile completeness tracking** - Users don't know what to fill out

---

## Recommendations by Partner Type

---

## 1. 🏛️ Federal Government Partners

### Registration Form - Additional Fields Needed:

```
ORGANIZATION INFORMATION
├── Agency Name (dropdown: DoD, DOE, NASA, DHS, etc.)
├── Sub-Agency/Office
├── Agency Code (4-letter)
├── Contracting Officer Name
├── Contracting Officer Email
├── CAGE Code (optional)
└── SAM.gov Registration Status

HIRING AUTHORITY
├── Hiring Authority Type (DE, MP, DHA, VRA, Schedule A)
├── Delegated Examining Unit (DEU) Status
├── OPM Approval Number
└── Position Classification Authority

COMPLIANCE REQUIREMENTS
├── Veterans Preference Compliance (Yes/No)
├── OFCCP Compliance Status
├── EEO-1 Reporting Status
└── Merit System Principles Acknowledgment
```

### Job Posting Form - Additional Fields Needed:

```
POSITION DETAILS
├── Position Title (Official)
├── Pay Plan (GS, SES, WG, etc.)
├── Grade/Band (GS-5 through GS-15, SES)
├── Series Number (e.g., 2210 for IT)
├── Full Performance Level
├── Promotion Potential
├── Bargaining Unit Status
├── Duty Station(s) - multiple locations
└── Telework Eligibility

QUALIFICATIONS
├── Specialized Experience Requirements
├── Time-in-Grade Requirements
├── KSAs (Knowledge, Skills, Abilities)
├── Competency Requirements
├── Selective Placement Factors
├── Quality Ranking Factors
└── Education Requirements (OPM standards)

SECURITY & ELIGIBILITY
├── Security Clearance Level
│   ├── None Required
│   ├── Public Trust (Tier 1)
│   ├── Secret (Tier 3)
│   ├── Top Secret (Tier 5)
│   └── TS/SCI + Polygraph
├── Citizenship Requirement
│   ├── U.S. Citizen Only
│   ├── U.S. National
│   └── Lawful Permanent Resident eligible
├── Drug Testing Required (Yes/No)
├── Financial Disclosure Required (Yes/No)
└── Background Investigation Level

VETERANS PREFERENCE
├── Veterans Preference Applies (Yes/No)
├── 5-Point Preference Eligible
├── 10-Point Preference Eligible
├── 30% or More Disabled Veteran
└── VRA Eligible

ASSESSMENT REQUIREMENTS
├── Assessment Type
│   ├── Structured Interview
│   ├── Technical Assessment
│   ├── Writing Sample
│   ├── Presentation
│   └── Work Simulation
├── USA Hire Assessment Required
└── Subject Matter Expert Panel

HIRING TIMELINE
├── Open Date
├── Close Date (or "Open Until Filled")
├── First Cut-off Date
├── Estimated Start Date
└── 80-Day Hiring Timeline Tracking
```

### Dashboard Enhancements Needed:

```
FEDERAL PARTNER DASHBOARD
├── USAJobs Integration Panel
│   ├── Sync Job Postings
│   ├── Import Applications
│   └── Status Sync
├── Merit Hiring Plan Compliance
│   ├── 80-Day Timeline Tracker
│   ├── Assessment Method Verification
│   └── Technical Assessment Status
├── Veterans Preference Tracker
│   ├── Veteran Applicant Count
│   ├── Preference Applied Status
│   └── DD-214 Verification Status
├── Clearance Pipeline
│   ├── Pending Investigations
│   ├── Interim Clearance Status
│   └── Final Clearance Granted
└── Reporting
    ├── Time-to-Hire Metrics
    ├── Applicant Demographics (EEO)
    └── Source of Hire Analysis
```

---

## 2. ⚛️ National Laboratory Partners

### Registration Form - Additional Fields Needed:

```
ORGANIZATION INFORMATION
├── Laboratory Name (dropdown: LLNL, LANL, Sandia, Oak Ridge, etc.)
├── Managing Contractor
├── DOE Program Office (NNSA, SC, NE, etc.)
├── Facility Security Officer Contact
└── ITAR/EAR Program Manager

COMPLIANCE STATUS
├── Q Clearance Program Participation
├── L Clearance Program Participation  
├── ITAR Compliance Status
├── EAR Compliance Status
├── CNWDI Access Authorization
└── Foreign National Employment Policy

RESEARCH FOCUS AREAS
├── Primary Research Areas (multi-select)
│   ├── Nuclear Weapons
│   ├── Nuclear Energy
│   ├── National Security
│   ├── Basic Science
│   ├── Computing/HPC
│   ├── Materials Science
│   └── Climate/Energy
└── Active Security Programs
```

### Job Posting Form - Additional Fields Needed:

```
POSITION DETAILS
├── Position Type
│   ├── Staff Scientist
│   ├── Research Scientist
│   ├── Postdoctoral Researcher
│   ├── Graduate Student Intern
│   ├── Undergraduate Intern
│   ├── Technical Staff
│   └── Administrative
├── Research Division/Directorate
├── Principal Investigator (if applicable)
└── Funding Source (LDRD, Programmatic, etc.)

CLEARANCE & ACCESS
├── Clearance Requirement
│   ├── No Clearance (Uncleared)
│   ├── L Clearance (DOE Secret)
│   ├── Q Clearance (DOE Top Secret)
│   └── Q + Special Access (CNWDI, Sigma, etc.)
├── ITAR/EAR Status
│   ├── Not ITAR/EAR Controlled
│   ├── ITAR Controlled
│   ├── EAR Controlled
│   └── Dual ITAR/EAR
├── Citizenship Requirements
│   ├── U.S. Citizen Only
│   ├── U.S. Person (Citizen + Green Card)
│   └── Foreign National Eligible
├── NDAA Section 3112 Compliance
│   └── Restriction on citizens of China, Russia, Iran, North Korea
└── Drug Testing Required (Yes - Marijuana included)

ACADEMIC REQUIREMENTS
├── Minimum Degree
│   ├── Bachelor's
│   ├── Master's
│   ├── Ph.D.
│   └── Postdoctoral Experience
├── Required Disciplines
├── Years of Experience
└── Publication Requirements

INTERN-SPECIFIC FIELDS
├── Program Type (Summer, Year-round, Co-op)
├── Academic Standing Required
├── GPA Minimum
├── Security Form Timeline
├── Housing Assistance Available
└── Mentor Assignment
```

### Dashboard Enhancements Needed:

```
NATIONAL LAB PARTNER DASHBOARD
├── Clearance Pipeline Management
│   ├── Q Clearance Queue
│   │   ├── SF-86 Submitted
│   │   ├── Investigation In Progress
│   │   ├── Adjudication Pending
│   │   └── Clearance Granted
│   └── L Clearance Queue
├── ITAR/EAR Compliance Center
│   ├── Export License Tracking
│   ├── Foreign National Onboarding
│   └── Technology Control Plans
├── Research Talent Pipeline
│   ├── PhD Pipeline by University
│   ├── Postdoc Conversions
│   └── Intern Return Rate
├── University Partnerships
│   ├── Partner Universities
│   ├── Joint Appointments
│   └── Collaborative Projects
└── Reporting
    ├── Workforce Demographics
    ├── Clearance Processing Times
    └── Research Output Metrics
```

---

## 3. 🏙️ State/Local Government (Municipality) Partners

### Registration Form - Additional Fields Needed:

```
ORGANIZATION INFORMATION
├── Government Level
│   ├── State Agency
│   ├── County Government
│   ├── City/Municipal Government
│   ├── Township
│   └── Special District
├── Agency/Department Name
├── Jurisdiction (State, County, City)
├── Civil Service Commission Status
├── Union Representation (Yes/No)
└── Collective Bargaining Agreements Active

HR COMPLIANCE
├── Civil Service Rules Apply (Yes/No)
├── Local Hiring Preference Policy
├── Residency Requirements
├── Veterans Preference Policy
└── Nepotism Policy Acknowledgment
```

### Job Posting Form - Additional Fields Needed:

```
POSITION DETAILS
├── Position Classification
│   ├── Classified (Civil Service)
│   ├── Unclassified/Exempt
│   ├── Appointed
│   └── Elected (support staff)
├── Pay Grade/Step
├── Bargaining Unit (if applicable)
├── Union Local Number
├── FLSA Status (Exempt/Non-Exempt)
└── Position Number

ELIGIBILITY REQUIREMENTS
├── Residency Requirement
│   ├── Must reside in jurisdiction
│   ├── Must reside within X miles
│   └── No residency requirement
├── Age Requirements
├── Driver's License Required
├── State Certification Required
│   ├── Peace Officer (POST)
│   ├── EMT/Paramedic
│   ├── Engineer (PE)
│   └── Other Professional License
├── Background Check Level
│   ├── Standard
│   ├── Fingerprint (DOJ/FBI)
│   └── Comprehensive (Law Enforcement)
└── Physical/Medical Requirements

CIVIL SERVICE PROCESS
├── Examination Required (Yes/No)
├── Exam Type
│   ├── Written
│   ├── Oral
│   ├── Physical Agility
│   └── Assessment Center
├── Promotional Only (Yes/No)
├── Open/Competitive
├── Transfer Eligible
└── List Certification Method

COMPENSATION & BENEFITS
├── Salary Range (Per Step Schedule)
├── Pension System (CalPERS, SERS, etc.)
├── Union Benefits Apply
├── Health Insurance Tier
└── Shift Differential (if applicable)
```

### Dashboard Enhancements Needed:

```
MUNICIPAL PARTNER DASHBOARD
├── Civil Service Compliance
│   ├── Active Eligible Lists
│   ├── Certification Requests
│   ├── List Expiration Tracking
│   └── Rule of Three/Rank Compliance
├── Union Management
│   ├── CBA Expiration Dates
│   ├── Grievance Tracking
│   ├── Step Increase Calendar
│   └── Seniority Lists
├── Recruitment Metrics
│   ├── Time-to-Fill by Classification
│   ├── Cost-per-Hire
│   ├── Local Hire Percentage
│   └── Veteran Hire Percentage
├── Background Check Status
│   ├── DOJ Fingerprint Results
│   ├── DMV Pull Notice
│   └── Reference Check Status
└── Compliance Reporting
    ├── EEO-4 Report Data
    ├── ADA Accommodation Requests
    └── FMLA Leave Tracking
```

---

## 4. 🎓 Academic Institution Partners

### Registration Form - Additional Fields Needed:

```
ORGANIZATION INFORMATION
├── Institution Name
├── Institution Type
│   ├── Research University (R1/R2)
│   ├── Master's University
│   ├── Baccalaureate College
│   ├── Community College
│   ├── Technical/Vocational
│   └── K-12 School District
├── Carnegie Classification
├── Accreditation Body
├── IPEDS Unit ID
└── Career Services Contact

PROGRAM INFORMATION
├── STEM Programs Offered (multi-select)
├── Total STEM Enrollment
├── Graduation Rate
├── First Destination Survey Response Rate
└── Industry Partnership Status
```

### Job/Internship Posting Form - For Student Placement:

```
POSITION DETAILS
├── Position Type
│   ├── Internship (For-Credit)
│   ├── Internship (Non-Credit)
│   ├── Co-op Position
│   ├── Research Experience
│   ├── Fellowship
│   ├── Part-Time Student Job
│   └── Full-Time Entry Level
├── Academic Credit Available (Yes/No)
├── Credit Hours (if applicable)
├── Faculty Supervisor Required
└── Learning Outcomes Documented

STUDENT REQUIREMENTS
├── Academic Level
│   ├── Freshman
│   ├── Sophomore
│   ├── Junior
│   ├── Senior
│   ├── Graduate (Master's)
│   └── Graduate (PhD)
├── Minimum GPA
├── Required Major(s)
├── Required Coursework
├── Visa Status Eligibility
│   ├── U.S. Citizen/Permanent Resident
│   ├── F-1 (CPT Eligible)
│   ├── F-1 (OPT Eligible)
│   └── All Status Welcome
└── Work Authorization Timeline

INTERNSHIP LOGISTICS
├── Duration (Weeks)
├── Hours per Week
├── Compensation Type
│   ├── Paid (Hourly Rate)
│   ├── Paid (Stipend)
│   ├── Unpaid (FLSA Compliant)
│   └── Academic Credit Only
├── Housing Provided
├── Relocation Assistance
└── Remote Work Option

EMPLOYER REQUIREMENTS
├── Supervisor Qualifications
├── Structured Training Program
├── Mid-point Evaluation Required
├── Final Evaluation Required
└── Student Feedback Survey
```

### Dashboard Enhancements Needed:

```
ACADEMIC PARTNER DASHBOARD
├── Student Placement Center
│   ├── Active Opportunities
│   ├── Students Placed (By Program)
│   ├── Placement Rate Tracking
│   └── Employer Satisfaction Scores
├── Outcome Tracking (NACE Standards)
│   ├── First Destination Survey
│   │   ├── Employed Full-Time
│   │   ├── Employed Part-Time
│   │   ├── Continuing Education
│   │   ├── Seeking Employment
│   │   └── Not Seeking
│   ├── Knowledge Rate
│   ├── Average Starting Salary
│   └── Employer Name Collection
├── Employer Partnership Portal
│   ├── Partner Companies
│   ├── On-Campus Recruiting Events
│   ├── Info Sessions Scheduled
│   └── Career Fair Registrations
├── Experiential Learning Records
│   ├── Internship Credits Awarded
│   ├── Co-op Semesters Completed
│   ├── Research Experiences
│   └── Service Learning Hours
├── Curriculum Alignment
│   ├── Industry Skills Mapping
│   ├── Certificate Programs
│   └── Micro-credential Tracking
└── Reporting
    ├── NACE First Destination Report
    ├── Program-Level Outcomes
    └── Employer Engagement Metrics
```

---

## 5. 🏢 Private Sector Partners

### Registration Form - Additional Fields Needed:

```
ORGANIZATION INFORMATION
├── Company Name
├── Company Size
│   ├── Startup (1-50)
│   ├── Small Business (51-200)
│   ├── Mid-Market (201-1000)
│   ├── Enterprise (1001-5000)
│   └── Large Enterprise (5000+)
├── Industry Sector (NAICS Code)
├── Headquarters Location
├── Company Website
├── LinkedIn Company Page
└── Glassdoor/Indeed Profile URL

EMPLOYER BRANDING
├── Company Logo Upload
├── Company Description (500 chars)
├── Mission Statement
├── Culture Keywords (multi-select)
├── Benefits Highlights
├── DEI Statement
└── Employee Testimonial (optional)

RECRUITING PREFERENCES
├── Primary Hiring Focus
│   ├── Entry-Level/New Grads
│   ├── Experienced Professionals
│   ├── Executives
│   ├── Interns
│   └── All Levels
├── Clearance Sponsorship Available
├── Visa Sponsorship Available
└── Remote Work Policy

COMPLIANCE
├── EEOC Employer (50+ employees)
├── Federal Contractor (OFCCP)
├── E-Verify Participant
└── Fair Chance Employer (Ban the Box)
```

### Job Posting Form - Additional Fields Needed:

```
POSITION DETAILS
├── Job Title
├── Department/Team
├── Reports To (Title)
├── Direct Reports (Count)
├── Employment Type
│   ├── Full-Time
│   ├── Part-Time
│   ├── Contract
│   ├── Contract-to-Hire
│   ├── Internship
│   └── Freelance
├── Experience Level
│   ├── Entry Level (0-2 years)
│   ├── Mid Level (3-5 years)
│   ├── Senior (6-10 years)
│   ├── Lead/Principal (10+ years)
│   └── Executive
└── FLSA Status

COMPENSATION
├── Salary Type
│   ├── Annual Salary
│   ├── Hourly Rate
│   ├── Contract Rate
│   └── Commission-Based
├── Salary Range (Min-Max)
├── Show Salary in Posting (Yes/No)
├── Bonus Structure
│   ├── None
│   ├── Annual Bonus
│   ├── Sign-On Bonus
│   ├── Retention Bonus
│   └── Equity/RSU
├── Equity Offered (Yes/No)
└── Benefits Tier

LOCATION & WORK ARRANGEMENT
├── Primary Location
├── Additional Locations
├── Work Arrangement
│   ├── On-Site (5 days)
│   ├── Hybrid (specify days)
│   ├── Remote (US-Based)
│   ├── Remote (State-Specific)
│   └── Fully Remote (Global)
├── Travel Required (%)
└── Relocation Assistance

REQUIREMENTS
├── Required Skills (tag-based)
├── Preferred Skills (tag-based)
├── Required Certifications
├── Education Requirement
│   ├── High School
│   ├── Associate's
│   ├── Bachelor's
│   ├── Master's
│   ├── PhD
│   └── Or Equivalent Experience
├── Security Clearance
│   ├── None Required
│   ├── Ability to Obtain
│   ├── Active Clearance Required
│   └── Specific Level Required
├── Citizenship/Work Auth
│   ├── U.S. Citizen Required
│   ├── U.S. Person Required
│   ├── Work Authorization Required
│   └── Visa Sponsorship Available
└── Background Check Required

APPLICATION SETTINGS
├── Application Method
│   ├── Apply on Platform
│   ├── External URL
│   ├── Email
│   └── Easy Apply
├── Resume Required (Yes/No)
├── Cover Letter Required (Yes/No)
├── Custom Questions (up to 5)
├── Assessment Required
│   ├── Skills Assessment
│   ├── Coding Challenge
│   ├── Video Interview
│   └── None
└── Application Deadline
```

### Dashboard Enhancements Needed:

```
PRIVATE SECTOR PARTNER DASHBOARD
├── Talent Pipeline
│   ├── Active Job Postings
│   ├── Total Applications
│   ├── Candidates in Review
│   ├── Interview Stage
│   ├── Offer Stage
│   └── Hired This Month
├── AI Matching Center
│   ├── Recommended Candidates
│   ├── Skills Match Scores
│   ├── Experience Match
│   └── Culture Fit Indicators
├── Analytics & Reporting
│   ├── Time-to-Fill by Role
│   ├── Cost-per-Hire
│   ├── Source Effectiveness
│   ├── Diversity Pipeline
│   ├── Offer Acceptance Rate
│   └── Candidate NPS
├── ATS Integration
│   ├── Sync with Greenhouse
│   ├── Sync with Lever
│   ├── Sync with Workday
│   ├── Sync with iCIMS
│   └── API Webhooks
├── Employer Branding
│   ├── Company Profile Views
│   ├── Job Post Impressions
│   ├── Apply Rate
│   └── Career Page Analytics
└── Compliance Center
    ├── EEOC Data Collection
    ├── OFCCP Reporting
    ├── E-Verify Status
    └── Adverse Action Tracking
```

---

## 6. 💚 Non-Profit Organization Partners

### Registration Form - Additional Fields Needed:

```
ORGANIZATION INFORMATION
├── Organization Name
├── EIN (Tax ID)
├── 501(c) Status
│   ├── 501(c)(3) - Charitable
│   ├── 501(c)(4) - Social Welfare
│   ├── 501(c)(6) - Trade Association
│   └── Other
├── Mission Statement
├── Service Area (Geographic)
├── Annual Budget Range
├── GuideStar/Candid Profile URL
└── Charity Navigator Rating (if applicable)

FOCUS AREAS
├── Primary Cause Areas (multi-select)
│   ├── Education
│   ├── Workforce Development
│   ├── STEM Access
│   ├── Youth Development
│   ├── Veterans Services
│   ├── Environmental
│   └── Community Development
├── Target Populations Served
└── Annual People Served (estimate)

FUNDING SOURCES
├── Government Grants (%)
├── Foundation Grants (%)
├── Corporate Donations (%)
├── Individual Donations (%)
├── Earned Revenue (%)
└── Major Funders (optional)

COMPLIANCE
├── Annual 990 Filed
├── State Charitable Registration
├── Accreditation Status
└── Board Governance Policy
```

### Job/Volunteer Posting Form - Additional Fields Needed:

```
POSITION TYPE
├── Opportunity Type
│   ├── Paid Staff Position
│   ├── AmeriCorps Position
│   ├── VISTA Position
│   ├── Fellowship
│   ├── Volunteer (Regular)
│   ├── Volunteer (One-Time)
│   ├── Board Position
│   └── Internship (Paid/Unpaid)

POSITION DETAILS (Paid)
├── Job Title
├── Department/Program
├── Supervisor
├── Funding Source
│   ├── General Operations
│   ├── Grant-Funded (specify)
│   └── Fee-for-Service
├── Grant End Date (if applicable)
├── Position End Date (if term-limited)
└── FTE (Full-Time Equivalent)

VOLUNTEER-SPECIFIC FIELDS
├── Commitment Level
│   ├── One-Time Event
│   ├── Weekly (specify hours)
│   ├── Monthly
│   ├── Seasonal
│   └── Ongoing/Flexible
├── Time Slots Available
├── Minimum Commitment Duration
├── Training Provided
├── Background Check Required
├── Skills-Based Volunteering (Yes/No)
└── Virtual/Remote Option

IMPACT TRACKING
├── Position Impact Statement
├── Beneficiaries Served (estimate)
├── Outcomes Contributed To
├── Grant Deliverables Supported
└── Volunteer Value Tracking ($)

VOLUNTEER BENEFITS
├── Training/Skill Development
├── Networking Opportunities
├── Letter of Recommendation
├── Community Service Hours Verified
├── Meals/Refreshments Provided
└── Mileage Reimbursement
```

### Dashboard Enhancements Needed:

```
NONPROFIT PARTNER DASHBOARD
├── Workforce Management
│   ├── Paid Staff Positions
│   ├── Grant-Funded Positions
│   ├── Position Funding Alerts
│   │   └── Grant ending in 90/60/30 days
│   └── Hiring Pipeline
├── Volunteer Management
│   ├── Active Volunteers
│   ├── Hours Logged This Month
│   ├── Volunteer Value ($)
│   │   └── (Hours × Independent Sector Rate)
│   ├── Retention Rate
│   ├── New Volunteer Onboarding
│   └── Background Check Status
├── Grant Compliance Center
│   ├── Active Grants
│   ├── Deliverable Tracking
│   ├── Staff Time Allocation
│   ├── Outcome Metrics
│   ├── Reporting Deadlines
│   └── Funder Requirements
├── Impact Reporting
│   ├── People Served
│   ├── Services Delivered
│   ├── Outcome Achievement %
│   ├── Program Efficiency Ratios
│   └── Year-over-Year Comparison
├── Corporate Partnerships
│   ├── Corporate Volunteer Programs
│   ├── VTO (Volunteer Time Off) Tracking
│   ├── Matching Gift Opportunities
│   └── Skills-Based Volunteer Projects
└── Board & Governance
    ├── Board Meeting Calendar
    ├── Committee Assignments
    ├── Term Expiration Alerts
    └── Board Diversity Metrics
```

---

## Job Seeker/Applicant Form Enhancements

### Current Fields:
- ✅ Name
- ✅ Email
- ✅ Password

### Recommended Additional Profile Fields:

```
BASIC PROFILE
├── Phone Number
├── Location (City, State, ZIP)
├── LinkedIn URL
├── Portfolio/Website URL
├── Profile Photo
└── Professional Headline

SECURITY CLEARANCE STATUS
├── Current Clearance Level
│   ├── None
│   ├── Public Trust
│   ├── Secret
│   ├── Top Secret
│   ├── TS/SCI
│   ├── Q (DOE)
│   └── L (DOE)
├── Clearance Status
│   ├── Active
│   ├── Current (within 2 years)
│   ├── Expired
│   └── Never held
├── Investigation Date
├── Polygraph (if applicable)
└── Willing to Obtain Clearance

CITIZENSHIP & WORK AUTHORIZATION
├── Citizenship Status
│   ├── U.S. Citizen
│   ├── U.S. National
│   ├── Permanent Resident (Green Card)
│   ├── Work Visa (H-1B, L-1, etc.)
│   ├── Student Visa (F-1, J-1)
│   └── Other
├── Work Authorization Expiration
├── Requires Sponsorship (Yes/No)
├── ITAR/EAR Eligible (Yes/No)
└── Dual Citizenship (Yes/No, Countries)

VETERANS STATUS
├── Veteran (Yes/No)
├── Branch of Service
├── Service Dates
├── Discharge Status
├── Veterans Preference Eligible
│   ├── 5-Point
│   ├── 10-Point
│   ├── 30% Disabled
│   └── CPS/CP
├── MOS/Rate/AFSC Codes
└── Military Clearances Held

EDUCATION
├── Highest Degree
├── Field of Study
├── Institution Name
├── Graduation Date (or Expected)
├── GPA (optional)
├── Relevant Coursework
├── Certifications
└── Professional Licenses

EXPERIENCE
├── Years of Experience (by field)
├── Current Employer
├── Current Title
├── Industries Worked In
├── Skills (tag-based, rated)
├── Tools/Technologies
├── Languages Spoken
└── Publications/Patents (optional)

JOB PREFERENCES
├── Desired Job Types (multi-select)
├── Desired Industries (multi-select)
├── Desired Locations
├── Remote Work Preference
├── Salary Expectations
├── Availability Date
├── Willing to Relocate
├── Travel Tolerance (%)
└── Company Size Preference

RESUME & DOCUMENTS
├── Resume Upload (PDF)
├── Cover Letter (optional)
├── Portfolio/Work Samples
├── Transcripts (for students)
├── DD-214 (for veterans)
├── SF-50 (for federal employees)
└── Certifications/Licenses
```

---

## Implementation Priority

### Phase 1 - Critical (Week 1-2)
1. **Add Role Selection to Registration**
   - Job Seeker / Intern / Student
   - Educator / Training Provider
   - Employer / Partner
   
2. **Add Basic Organization Fields**
   - Organization Name
   - Organization Type (6 categories)
   - Industry

3. **Add Clearance/Citizenship to Job Seeker Profile**
   - Current Clearance Level
   - Citizenship Status
   - Veterans Status

### Phase 2 - Important (Week 3-4)
4. **Enhanced Job Posting Form**
   - Clearance Requirements
   - Citizenship Requirements
   - Education Requirements
   - Skills Tags
   - Salary Range

5. **Partner-Specific Registration Flows**
   - Federal Government flow
   - Private Sector flow
   - Academic Institution flow

### Phase 3 - Nice to Have (Week 5-6)
6. **Dashboard Enhancements**
   - Applicant tracking pipeline
   - Compliance tracking
   - Reporting/Analytics

7. **Integration Preparation**
   - USAJobs API structure
   - Handshake API structure
   - ATS webhook framework

---

## Database Schema Changes Required

```sql
-- Add to users table
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN location TEXT;
ALTER TABLE users ADD COLUMN linkedin_url TEXT;
ALTER TABLE users ADD COLUMN clearance_level TEXT;
ALTER TABLE users ADD COLUMN clearance_status TEXT;
ALTER TABLE users ADD COLUMN citizenship TEXT;
ALTER TABLE users ADD COLUMN veteran_status BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN veteran_preference TEXT;
ALTER TABLE users ADD COLUMN work_authorization TEXT;
ALTER TABLE users ADD COLUMN requires_sponsorship BOOLEAN DEFAULT FALSE;

-- Add to organizations table
ALTER TABLE organizations ADD COLUMN organization_code TEXT;
ALTER TABLE organizations ADD COLUMN parent_organization TEXT;
ALTER TABLE organizations ADD COLUMN ein TEXT;
ALTER TABLE organizations ADD COLUMN cage_code TEXT;
ALTER TABLE organizations ADD COLUMN civil_service_rules BOOLEAN DEFAULT FALSE;
ALTER TABLE organizations ADD COLUMN union_representation BOOLEAN DEFAULT FALSE;
ALTER TABLE organizations ADD COLUMN clearance_sponsor BOOLEAN DEFAULT FALSE;
ALTER TABLE organizations ADD COLUMN visa_sponsor BOOLEAN DEFAULT FALSE;

-- Add to jobs table
ALTER TABLE jobs ADD COLUMN pay_grade TEXT;
ALTER TABLE jobs ADD COLUMN series_number TEXT;
ALTER TABLE jobs ADD COLUMN citizenship_required TEXT;
ALTER TABLE jobs ADD COLUMN itar_controlled BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN veterans_preference BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN drug_test_required BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN polygraph_required BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN education_requirement TEXT;
ALTER TABLE jobs ADD COLUMN visa_sponsorship BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN telework_eligible TEXT;
ALTER TABLE jobs ADD COLUMN bargaining_unit TEXT;
```

---

## Summary

By implementing these enhancements, STEMWorkforce will provide:

1. **Federal Partners**: USAJobs-compatible posting with Merit Hiring Plan compliance
2. **National Labs**: Q-clearance pipeline with ITAR/EAR compliance tracking
3. **Municipalities**: Civil service integration with union compliance
4. **Academic Institutions**: NACE-compliant outcome tracking with student placement management
5. **Private Sector**: Modern ATS features with AI matching capabilities
6. **Nonprofits**: Grant compliance with volunteer management and impact tracking

This positions STEMWorkforce as the premier platform for STEM workforce development across all sectors.

---

*Report prepared based on:*
- *USAJobs/OPM federal hiring requirements*
- *DOE National Laboratory clearance procedures*
- *MRSC municipal hiring best practices*
- *NACE career services standards*
- *SHRM/ATS industry best practices*
- *Nonprofit grant compliance requirements*
