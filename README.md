# STEMWorkforce Platform v12

## Complete Workforce Development Platform with Admin Suite

A comprehensive platform connecting job seekers with opportunities in emerging technology sectors including Semiconductor, Quantum Computing, AI/ML, Clean Energy, Biotechnology, Aerospace, Healthcare, and Cybersecurity.

---

## 🚀 Features

### Public Platform
- **Job Board** - Advanced search with security clearance filtering
- **Training Programs** - Credentials and certifications directory
- **Events Calendar** - Industry conferences and job fairs
- **Workforce Map** - Geographic visualization of opportunities
- **Education Portal** - Institution partnership management

### Admin Suite
- **Admin Dashboard** - User, organization, and job management
- **Billing Dashboard** - Subscriptions, plans, Stripe integration
- **Advertising Dashboard** - Campaigns, creatives, placements
- **Marketplace Dashboard** - Service providers, orders, payouts

---

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Optional
```

---

## 🗄️ Database Setup

Run migrations in Supabase SQL Editor in order:
1. `003_add_healthcare_industry.sql`
2. `004_phase1_enhanced_registration_FIXED.sql`
3. `005_phase2_enhanced_jobs_FIXED.sql`
4. `006_phase3_applications_ats.sql`
5. `007_phase4_resume_notifications_offers_FIXED.sql`
6. `008_phase5_admin_infrastructure_FIXED.sql`
7. `008b_enhanced_billing_monetization.sql`
8. `008c_complete_monetization_FIXED.sql`
9. `009_admin_rls_policies.sql` ← Security policies

Then run: `docs/SEED_DATA_ADMIN.sql`

---

## 🔐 Admin Access

After registering, make yourself admin:

```sql
-- Get your user ID
SELECT id FROM auth.users WHERE email = 'your@email.com';

-- Assign Super Admin role
INSERT INTO user_role_assignments (user_id, role_id, is_active)
VALUES (
    'YOUR_USER_ID',
    (SELECT id FROM admin_roles WHERE name = 'SUPER_ADMIN'),
    true
);
```

### Admin Routes
- `/admin` - Main admin dashboard
- `/admin/billing` - Billing & subscriptions
- `/admin/advertising` - Ad campaign management
- `/admin/marketplace` - Marketplace management

---

## 🛡️ Security

- Row Level Security (RLS) on all tables
- Role-based access control
- Audit logging for admin actions
- Input validation utilities
- Stripe secrets server-side only

See `docs/SECURITY_AUDIT_REPORT.md` for details.

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   └── pages/
│   │       ├── admin/          # Admin Dashboard
│   │       ├── billing/        # Billing Dashboard
│   │       ├── advertising/    # Ad Dashboard
│   │       └── marketplace/    # Marketplace Dashboard
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── adminUtils.ts       # Security utilities
│   └── App.tsx
├── supabase/
│   └── migrations/             # 9 SQL files
├── docs/
│   ├── DEPLOYMENT_GUIDE_v12.md
│   ├── SECURITY_AUDIT_REPORT.md
│   └── SEED_DATA_ADMIN.sql
└── server/                     # Optional Express API
```

---

## 🚀 Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

Or connect your GitHub repository for automatic deploys.

---

## 📊 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe
- **Hosting**: Netlify
- **Icons**: Lucide React

---

## 📝 License

MIT License - See LICENSE file

---

*Built for STEMWorkforce - December 2024*
