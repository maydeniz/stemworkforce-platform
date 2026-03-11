/**
 * Create Demo Accounts Script
 *
 * Creates demo accounts for all platform personas with pre-populated data.
 * These accounts are used for investor demos, sales presentations, and testing.
 *
 * SECURITY NOTES:
 * - ONLY run in development/staging environments
 * - Never run in production with default passwords
 * - Demo accounts use @stemworkforce.demo domain (non-routable)
 * - The SUPABASE_SERVICE_ROLE_KEY is sensitive — never commit it
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/create-demo-accounts.ts
 *
 * Or set SUPABASE_SERVICE_ROLE_KEY in your .env file first
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load .env file
function loadEnv() {
  const envPath = join(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing: VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  console.error('Find your service role key in: Supabase Dashboard > Settings > API');
  process.exit(1);
}

if (supabaseUrl.includes('prod') || supabaseUrl.includes('production')) {
  console.warn('\nWARNING: This appears to be a production database!');
  console.warn('Demo accounts should only be created in development/staging.\n');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'DemoAccount2025!';

// =====================================================
// DEMO ACCOUNTS — one per persona group
// =====================================================
const demoAccounts = [
  // Students
  {
    email: 'demo.highschool@stemworkforce.demo',
    firstName: 'Alex',
    lastName: 'Rivera',
    role: 'student_hs',
    group: 'High School Student',
    metadata: {
      graduation_year: 2026,
      state: 'CA',
      gpa: 3.8,
      interests: ['Robotics', 'Computer Science', 'Mathematics'],
    },
  },
  {
    email: 'demo.college@stemworkforce.demo',
    firstName: 'Jordan',
    lastName: 'Chen',
    role: 'student_college',
    group: 'College Student',
    metadata: {
      university: 'MIT',
      major: 'Computer Science',
      graduation_year: 2027,
      gpa: 3.9,
      interests: ['AI/ML', 'Quantum Computing', 'Cybersecurity'],
    },
  },

  // Job Seekers
  {
    email: 'demo.jobseeker@stemworkforce.demo',
    firstName: 'Morgan',
    lastName: 'Williams',
    role: 'jobseeker',
    group: 'Job Seeker',
    metadata: {
      experience_years: 5,
      clearance: 'Secret',
      skills: ['Python', 'AWS', 'Data Engineering', 'TensorFlow'],
      desired_salary: 145000,
    },
  },

  // Employer
  {
    email: 'demo.employer@stemworkforce.demo',
    firstName: 'Taylor',
    lastName: 'Mitchell',
    role: 'employer',
    group: 'Employer',
    metadata: {
      company: 'Quantum Dynamics Inc.',
      title: 'VP of Engineering',
      company_size: '500-1000',
      industry: 'Defense Technology',
    },
  },

  // Education Partner (University)
  {
    email: 'demo.education@stemworkforce.demo',
    firstName: 'Dr. Sarah',
    lastName: 'Thompson',
    role: 'educator',
    group: 'Education Partner / University',
    metadata: {
      institution: 'Georgia Institute of Technology',
      department: 'College of Computing',
      title: 'Department Chair',
      programs: ['BS Computer Science', 'MS Cybersecurity', 'PhD AI'],
    },
  },

  // Federal Agency Partner
  {
    email: 'demo.federal@stemworkforce.demo',
    firstName: 'James',
    lastName: 'Carter',
    role: 'partner_federal',
    group: 'Federal Agency',
    metadata: {
      agency: 'Department of Energy',
      division: 'Office of Science',
      title: 'Workforce Development Director',
      clearance: 'Top Secret/SCI',
    },
  },

  // State/Local Agency Partner
  {
    email: 'demo.state@stemworkforce.demo',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    role: 'partner_state',
    group: 'State & Local Agency',
    metadata: {
      agency: 'Texas Workforce Commission',
      title: 'STEM Initiative Director',
      state: 'TX',
      region: 'Central Texas',
    },
  },

  // National Laboratory
  {
    email: 'demo.labs@stemworkforce.demo',
    firstName: 'Dr. Robert',
    lastName: 'Kim',
    role: 'partner_lab',
    group: 'National Laboratory',
    metadata: {
      lab: 'Oak Ridge National Laboratory',
      division: 'Computing & Computational Sciences',
      title: 'Division Director',
      clearance: 'Q Clearance',
    },
  },

  // Industry Partner
  {
    email: 'demo.industry@stemworkforce.demo',
    firstName: 'Patricia',
    lastName: 'Davis',
    role: 'partner_industry',
    group: 'Industry Partner',
    metadata: {
      company: 'Lockheed Martin',
      division: 'Space Systems',
      title: 'Talent Acquisition Director',
      employees: '100,000+',
    },
  },

  // Nonprofit Partner
  {
    email: 'demo.nonprofit@stemworkforce.demo',
    firstName: 'David',
    lastName: 'Okonkwo',
    role: 'partner_nonprofit',
    group: 'Nonprofit Organization',
    metadata: {
      organization: 'Code.org',
      title: 'Programs Director',
      mission: 'K-12 Computer Science Education',
      annual_budget: '$5M-$10M',
    },
  },

  // Service Provider
  {
    email: 'demo.provider@stemworkforce.demo',
    firstName: 'Lisa',
    lastName: 'Park',
    role: 'service_provider',
    group: 'Service Provider',
    metadata: {
      company: 'STEM Career Consulting',
      services: ['Resume Review', 'Interview Prep', 'Career Coaching', 'Salary Negotiation'],
      title: 'Founder & Lead Coach',
      rating: 4.9,
      total_clients: 450,
    },
  },

  // Admin (Platform)
  {
    email: 'demo.admin@stemworkforce.demo',
    firstName: 'Admin',
    lastName: 'Demo',
    role: 'admin',
    group: 'Platform Admin',
    metadata: {
      admin_level: 'SUPPORT_ADMIN',
      department: 'Platform Operations',
    },
  },
];

async function createDemoAccounts() {
  console.log('\nCreating demo accounts...\n');
  console.log('='.repeat(70));

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const account of demoAccounts) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const exists = existingUsers?.users?.some(u => u.email === account.email);

      if (exists) {
        console.log(`  SKIP  ${account.group.padEnd(30)} - Already exists`);
        skipped++;
        continue;
      }

      // Create user with admin API
      const { error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: account.firstName,
          last_name: account.lastName,
          role: account.role,
          is_demo: true,
          ...account.metadata,
        },
        app_metadata: {
          role: account.role,
          is_demo: true,
        },
      });

      if (error) {
        console.error(`  FAIL  ${account.group.padEnd(30)} - ${error.message}`);
        failed++;
      } else {
        console.log(`  OK    ${account.group.padEnd(30)} - ${account.email}`);
        created++;
      }
    } catch (err) {
      console.error(`  FAIL  ${account.group.padEnd(30)} - ${err}`);
      failed++;
    }
  }

  console.log('='.repeat(70));
  console.log(`\nSummary: ${created} created, ${skipped} skipped, ${failed} failed\n`);

  // Print table
  console.log('DEMO ACCOUNTS');
  console.log('-'.repeat(70));
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log('-'.repeat(70));
  console.log(`${'Group'.padEnd(28)} ${'Email'.padEnd(40)}`);
  console.log('-'.repeat(70));
  demoAccounts.forEach(a => {
    console.log(`${a.group.padEnd(28)} ${a.email.padEnd(40)}`);
  });
  console.log('-'.repeat(70));
}

createDemoAccounts()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
  });
