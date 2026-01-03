# STEMWorkforce Platform - Complete Deployment Guide
## Version 12 - With Admin, Billing, Advertising & Marketplace

---

## 🎯 What's Included

### Core Platform
- Landing page with industry sectors
- Job board with advanced search
- Training programs directory
- Events calendar
- Workforce map visualization
- Education provider portal
- User authentication (Supabase Auth)
- Multi-step registration

### Admin Suite (NEW)
- **Admin Dashboard** - User, org, job management + compliance
- **Billing Dashboard** - Subscriptions, plans, invoices, Stripe integration
- **Advertising Dashboard** - Campaigns, creatives, placements, analytics
- **Marketplace Dashboard** - Service providers, orders, reviews, payouts

---

## 📁 Project Structure

```
stemworkforce/
├── src/
│   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/           # Admin Dashboard
│   │   │   ├── billing/         # Billing Dashboard
│   │   │   ├── advertising/     # Advertising Dashboard
│   │   │   └── marketplace/     # Marketplace Dashboard
│   │   ├── layout/
│   │   └── common/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── adminUtils.ts        # Security utilities
│   ├── contexts/
│   └── App.tsx
├── supabase/
│   └── migrations/              # All SQL migrations
├── docs/
│   └── SEED_DATA_ADMIN.sql     # Admin seed data
└── server/                      # Express API (optional)
```

---

## 🚀 Deployment Steps

### Step 1: Environment Setup

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional - Stripe (frontend only needs publishable key)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 2: Database Setup (Supabase)

Run migrations in order in Supabase SQL Editor:

```bash
# Order matters!
1. 003_add_healthcare_industry.sql
2. 004_phase1_enhanced_registration_FIXED.sql
3. 005_phase2_enhanced_jobs_FIXED.sql
4. 006_phase3_applications_ats.sql
5. 007_phase4_resume_notifications_offers_FIXED.sql
6. 008_phase5_admin_infrastructure_FIXED.sql
7. 008b_enhanced_billing_monetization.sql
8. 008c_complete_monetization_FIXED.sql
9. 009_admin_rls_policies.sql  # IMPORTANT: Run this last!
```

### Step 3: Seed Admin Data

Run the seed data for admin roles and plans:

```sql
-- Run docs/SEED_DATA_ADMIN.sql
```

### Step 4: Make Yourself Admin

```sql
-- Find your user ID after registering
SELECT id, email FROM auth.users WHERE email = 'your@email.com';

-- Assign Super Admin role
INSERT INTO user_role_assignments (user_id, role_id, is_active)
VALUES (
    'YOUR_USER_ID_HERE',
    (SELECT id FROM admin_roles WHERE name = 'SUPER_ADMIN'),
    true
);
```

### Step 5: Install & Build

```bash
npm install
npm run build
```

### Step 6: Deploy to Netlify

```bash
# Option 1: CLI
netlify deploy --prod

# Option 2: Drag & drop dist/ folder to Netlify

# Option 3: Connect GitHub repo
```

---

## 🔐 Admin Access

### Available Admin Roles

| Role | Level | Access |
|------|-------|--------|
| SUPER_ADMIN | 100 | Full access to everything |
| PLATFORM_ADMIN | 90 | User, org, job management |
| SECURITY_ADMIN | 80 | Security & audit logs |
| COMPLIANCE_ADMIN | 75 | Compliance reports, OFCCP |
| BILLING_ADMIN | 70 | Subscriptions, invoices |
| CONTENT_ADMIN | 60 | Content moderation, ads |
| SUPPORT_ADMIN | 50 | Customer support |

### Admin Routes

| Route | Required Role |
|-------|---------------|
| `/admin` | Any admin role |
| `/admin/billing` | SUPER_ADMIN, BILLING_ADMIN |
| `/admin/advertising` | SUPER_ADMIN, CONTENT_ADMIN |
| `/admin/marketplace` | SUPER_ADMIN, PLATFORM_ADMIN, CONTENT_ADMIN |

---

## 💳 Stripe Configuration

⚠️ **IMPORTANT**: Never put secret keys in frontend code!

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (Supabase Edge Functions)
Set these in Supabase Dashboard → Edge Functions → Secrets:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Update Subscription Plans
```sql
-- Update plan with Stripe IDs
UPDATE subscription_plans 
SET 
  stripe_product_id = 'prod_xxxxx',
  stripe_price_id_monthly = 'price_xxxxx',
  stripe_price_id_annual = 'price_yyyyy'
WHERE plan_key = 'employer_professional';
```

---

## 🛡️ Security Features

### Row Level Security (RLS)
All tables have RLS policies that:
- Restrict data access based on user role
- Prevent unauthorized modifications
- Protect sensitive compliance data

### Audit Logging
Use the `logAdminAction` utility for all admin actions:

```typescript
import { logAdminAction, ADMIN_ACTIONS } from '@/lib/adminUtils';

await logAdminAction({
  eventType: ADMIN_ACTIONS.USER_SUSPENDED,
  action: 'suspend',
  resourceType: 'user',
  resourceId: userId,
  metadata: { reason: 'Violation of terms' }
});
```

### Input Validation
```typescript
import { validateForm } from '@/lib/adminUtils';

const { isValid, errors } = validateForm(formData, {
  name: { type: 'string', required: true, maxLength: 100 },
  email: { type: 'email' },
  commission: { type: 'number', min: 0, max: 100 }
});
```

---

## 📊 Database Tables

### Core (89+ tables)
- users, organizations, jobs, applications
- skills, certifications, clearances
- subscriptions, invoices, plans
- ad_campaigns, ad_placements, ad_creatives
- marketplace_providers, marketplace_services
- audit_logs, compliance reports

### Admin Tables
- admin_roles, admin_permissions
- user_role_assignments, role_permissions
- feature_flags, system_settings

---

## 🐛 Troubleshooting

### "Permission denied" errors
1. Check user has correct role assignment
2. Verify RLS policies are enabled (009_admin_rls_policies.sql)
3. Check user_role_assignments.is_active = true

### Admin link not showing
1. User role must be in allowed list
2. Check Header.tsx includes your role name
3. Refresh page after role assignment

### Stripe not working
1. Verify publishable key is correct
2. Check Edge Function secrets are set
3. Ensure webhook endpoint is configured

### Migrations failing
1. Run in correct order
2. Check for existing tables (use IF NOT EXISTS)
3. Look for foreign key dependencies

---

## 📈 Post-Deployment

1. ✅ Register your admin account
2. ✅ Assign Super Admin role
3. ✅ Configure Stripe (if using billing)
4. ✅ Add subscription plans
5. ✅ Test all admin dashboards
6. ✅ Review audit logs
7. ✅ Set up monitoring (Sentry, etc.)

---

## 📞 Support Resources

- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Netlify Docs: https://docs.netlify.com

---

*STEMWorkforce Platform v12 - December 2024*
