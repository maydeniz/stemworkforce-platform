/**
 * Create Test Accounts Script
 *
 * This script creates comprehensive test accounts for all platform user types.
 *
 * SECURITY NOTES:
 * - This script should ONLY be used in development/staging environments
 * - Never run this in production with default passwords
 * - The SUPABASE_SERVICE_ROLE_KEY is sensitive - never commit it to git
 * - Test accounts use a fake .test domain that won't receive real emails
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/create-test-accounts.ts
 *
 * Or add SUPABASE_SERVICE_ROLE_KEY to your .env file first
 *
 * Optional: Set TEST_ACCOUNTS_PASSWORD env var to use a custom password
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load .env file manually
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
  console.error('❌ Missing environment variables!\n');
  console.error('Required: VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY\n');
  console.error('Option 1: Add to .env file:');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  console.error('Option 2: Pass as environment variable:');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/create-test-accounts.ts\n');
  console.error('Find your service role key in: Supabase Dashboard > Settings > API');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);

// Security check - warn if running against production
if (supabaseUrl.includes('prod') || supabaseUrl.includes('production')) {
  console.warn('\n⚠️  WARNING: This appears to be a production database!');
  console.warn('Test accounts should only be created in development/staging.\n');
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Use custom password from env or default (for dev only)
const TEST_PASSWORD = process.env.TEST_ACCOUNTS_PASSWORD || 'TestAccount123!';

const testAccounts = [
  {
    id: '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'test.highschool@stemworkforce.test',
    firstName: 'Test',
    lastName: 'HighSchooler',
    role: 'jobseeker',
    description: 'High School Student (11th grade)',
  },
  {
    id: '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'test.college@stemworkforce.test',
    firstName: 'Test',
    lastName: 'CollegeStudent',
    role: 'jobseeker',
    description: 'College Student (Undergraduate)',
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'test.intern@stemworkforce.test',
    firstName: 'Test',
    lastName: 'Intern',
    role: 'intern',
    description: 'Intern seeking opportunities',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    email: 'test.jobseeker@stemworkforce.test',
    firstName: 'Test',
    lastName: 'Jobseeker',
    role: 'jobseeker',
    description: 'Jobseeker with clearance',
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    email: 'test.educator@stemworkforce.test',
    firstName: 'Test',
    lastName: 'Educator',
    role: 'educator',
    description: 'Educator/Professor',
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    email: 'test.partner@stemworkforce.test',
    firstName: 'Test',
    lastName: 'Partner',
    role: 'partner',
    description: 'Partner/Employer',
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    email: 'test.provider@stemworkforce.test',
    firstName: 'Test',
    lastName: 'ServiceProvider',
    role: 'partner',
    description: 'Service Provider (Career Coach)',
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    email: 'test.admin@stemworkforce.test',
    firstName: 'Test',
    lastName: 'Admin',
    role: 'admin',
    description: 'Platform Administrator',
  },
];

async function createTestAccounts() {
  console.log('\n🚀 Creating test accounts...\n');
  console.log('=' .repeat(70));

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const account of testAccounts) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const exists = existingUsers?.users?.some(u => u.email === account.email);

      if (exists) {
        console.log(`⏭️  ${account.description.padEnd(35)} - Already exists`);
        skipped++;
        continue;
      }

      // Create user with admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: account.firstName,
          last_name: account.lastName,
          role: account.role,
        },
      });

      if (error) {
        console.error(`❌ ${account.description.padEnd(35)} - ${error.message}`);
        failed++;
      } else {
        console.log(`✅ ${account.description.padEnd(35)} - Created`);
        created++;
      }
    } catch (err) {
      console.error(`❌ ${account.description.padEnd(35)} - ${err}`);
      failed++;
    }
  }

  console.log('=' .repeat(70));
  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped, ${failed} failed\n`);

  console.log('┌─────────────────────────────────────────────────────────────────────┐');
  console.log('│                        TEST ACCOUNTS                                │');
  console.log('├─────────────────────────────────────────────────────────────────────┤');
  console.log('│ Password for all accounts: TestAccount123!                          │');
  console.log('├─────────────────────────────────────────────────────────────────────┤');
  testAccounts.forEach(a => {
    const line = `│ ${a.description.padEnd(25)} │ ${a.email.padEnd(40)} │`;
    console.log(line.substring(0, 73) + '│');
  });
  console.log('└─────────────────────────────────────────────────────────────────────┘');
}

createTestAccounts()
  .then(() => {
    console.log('\n✨ Done!\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
  });
