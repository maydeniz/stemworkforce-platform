# STEMWorkforce Clearance Readiness & FSO Portal

## Complete Platform Documentation

**Version:** 1.0
**Last Updated:** March 2026
**Classification:** UNCLASSIFIED — For internal and partner use

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [For Customers & Partners](#2-for-customers--partners)
3. [Architecture Overview](#3-architecture-overview)
4. [Developer Guide](#4-developer-guide)
5. [Data Engineering Guide](#5-data-engineering-guide)
6. [Security & Compliance](#6-security--compliance)
7. [API Reference](#7-api-reference)
8. [Pricing & Feature Tiers](#8-pricing--feature-tiers)
9. [Emergency Procedures](#9-emergency-procedures)
10. [Glossary](#10-glossary)

---

## 1. Executive Overview

STEMWorkforce provides an end-to-end clearance readiness and facility security management platform designed for three audiences:

| Audience | What They Get |
|----------|--------------|
| **Job Seekers** | Self-assessment tool to evaluate clearance eligibility across 13 SEAD-4 guidelines, market intelligence on clearance demand, and connections to clearance service providers |
| **Employers / FSOs** | Full-lifecycle cleared personnel management: roster tracking, visit authorization, SEAD-3 incident reporting, Trusted Workforce 2.0 continuous vetting, and NISPOM compliance assistance |
| **Federal Partners** | Clearance demand intelligence, workforce pipeline analytics, and compliance-ready data exchange interfaces |

### What Makes Us Different

- **No SF-86 data stored** — We assess readiness, not actual clearance applications
- **Breach isolation in under 30 seconds** — Circuit breaker architecture can cut off access to any data domain instantly
- **NIST 800-53 compliant audit trail** — Every action logged, immutable, tamper-proof
- **FCRA compliant** — No consumer reports, no credit checks, no adverse action triggers
- **Attorney-client privilege** — Readiness assessments can be flagged as privileged communications

---

## 2. For Customers & Partners

### 2.1 Clearance Readiness Assessment ("Am I Clearable?")

A guided self-assessment tool that helps candidates understand their eligibility for security clearances before investing time and money in the formal process.

**How It Works:**

1. **Eligibility Check** — Confirms US citizenship status (required for most clearances), identifies the target clearance level and agency
2. **Guideline Assessment** — Walks through all 13 SEAD-4 adjudicative guidelines with plain-language questions
3. **Risk Scoring** — Calculates an overall readiness score (0-100) based on responses
4. **Recommendations** — Provides actionable next steps, estimated timelines, and cost estimates
5. **Service Provider Referrals** — Connects candidates with clearance attorneys, preparation services, and employers

**Supported Clearance Levels:**

| Level | Typical Processing Time | Salary Premium |
|-------|------------------------|----------------|
| Public Trust | 60-180 days | $5-10K |
| Secret | 60-150 days | $8-15K |
| Top Secret | 120-240 days | $15-30K |
| TS/SCI | 180-365 days | $25-45K |
| DOE L (Secret RD) | 90-180 days | $8-15K |
| DOE Q (TS RD) | 180-365 days | $10-20K |
| DOE Q/SCI | 240-450 days | $20-35K |

**The 13 SEAD-4 Adjudicative Guidelines Assessed:**

| Code | Guideline | What It Covers |
|------|-----------|---------------|
| A | Allegiance to the United States | Loyalty, foreign allegiance conflicts |
| B | Foreign Influence | Foreign contacts, family, business interests |
| C | Foreign Preference | Foreign citizenship, voting, military service |
| D | Sexual Behavior | Conduct that creates vulnerability |
| E | Personal Conduct | Honesty, integrity, rule compliance |
| F | Financial Considerations | Debt, bankruptcy, financial responsibility |
| G | Alcohol Consumption | Alcohol-related incidents, treatment |
| H | Drug Involvement | Illegal drug use, prescription misuse |
| I | Psychological Conditions | Conditions affecting judgment/reliability |
| J | Criminal Conduct | Arrests, charges, convictions |
| K | Handling Protected Information | Prior security violations |
| L | Outside Activities | Employment or affiliations creating conflicts |
| M | Use of Information Technology | Unauthorized system access, misuse |

### 2.2 Clearance Intelligence Dashboard

Real-time market data on the cleared workforce landscape:

- **Demand Heatmap** — Open positions by clearance level across 11 sectors (Defense, Intelligence, Energy, Cybersecurity, Aerospace, Biotech, Nuclear, Quantum, Semiconductor, Healthcare, Advanced Manufacturing)
- **Salary Premium Analysis** — Salary ranges and trends by clearance level and region
- **Supply-Demand Gap** — Ratio of available cleared candidates to open positions
- **Time-to-Clear Benchmarks** — Average processing times by agency and clearance level
- **Geographic Hotspots** — State-level demand concentration and competition

### 2.3 FSO Portal (Employer Feature)

A comprehensive Facility Security Officer dashboard for managing cleared personnel and compliance:

**Roster Management**
- Track all cleared employees: clearance level, granted/expiration dates, reinvestigation schedules
- Filter by status (active, interim, pending, suspended, revoked, expired)
- Automatic alerts for expiring clearances (30/90/180-day windows)
- Reinvestigation due date tracking
- Continuous Vetting enrollment status

**Visit Authorization Letters (VAL)**
- Create incoming/outgoing visit requests
- Track visitor clearance levels and CAGE codes
- Manage approval workflows
- Support for recurring visits
- Classification level and briefing requirements

**SEAD-3 Incident Reporting**
- Report 14 types of security incidents
- Automatic deadline tracking (72 hours for arrests, immediate for unauthorized disclosure)
- Severity classification (low/moderate/serious/critical)
- Investigation status tracking
- Resolution documentation

**Continuous Vetting (Trusted Workforce 2.0)**
- Receive and manage 11 types of CV alerts
- Response deadline tracking
- FSO assessment and mitigation planning
- Agency escalation workflow
- Alert severity prioritization

**NISPOM Compliance Assistant**
- AI-powered Q&A for NISPOM (32 CFR Part 117) questions
- Quick reference cards for NISPOM chapters 2-7
- Incident reporting guides with regulatory citations
- Reinvestigation calendar management
- Bookmark and search functionality

**Immutable Audit Log**
- Every action logged with timestamps, user IDs, and change details
- Cannot be modified or deleted (NIST 800-53 AU-9 compliant)
- Exportable for compliance audits
- CSV export with injection protection

### 2.4 Legal Disclaimers

- This platform does **NOT** process security clearance applications
- No SF-86 form data is collected, stored, or transmitted
- No consumer reports or credit checks are performed (FCRA compliant)
- The readiness assessment is informational only and does not constitute a clearance determination
- No classified information is stored on this platform
- Data retention defaults to 90 days, configurable up to 365 days

---

## 3. Architecture Overview

### 3.1 System Diagram

```
                                     STEMWorkforce Platform
                           ┌──────────────────────────────────────┐
                           │                                      │
  Job Seekers ──────────── │  Clearance Readiness Assessment      │
                           │  Clearance Intelligence Dashboard    │
                           │                                      │
  Employers / FSOs ─────── │  FSO Portal (Employer Dashboard)     │
                           │    ├─ Roster Management              │
                           │    ├─ Visit Authorization (VAL)      │
                           │    ├─ Incident Reporting (SEAD-3)    │
                           │    ├─ CV Alerts (TW 2.0)             │
                           │    ├─ NISPOM Assistant               │
                           │    └─ Audit Log (Immutable)          │
                           │                                      │
  Federal Partners ─────── │  Demand Intelligence API             │
                           │  Workforce Pipeline Analytics        │
                           │                                      │
                           ├──────────────────────────────────────┤
                           │         SECURITY LAYER               │
                           │  ┌──────────────────────────┐        │
                           │  │  Circuit Breaker Service  │        │
                           │  │  (Emergency Isolation)    │        │
                           │  └──────────────────────────┘        │
                           │  ┌──────────────────────────┐        │
                           │  │  RLS + Feature Gates     │        │
                           │  │  (Access Control)        │        │
                           │  └──────────────────────────┘        │
                           │  ┌──────────────────────────┐        │
                           │  │  Audit Log (NIST AU-9)   │        │
                           │  │  (Immutable Trail)       │        │
                           │  └──────────────────────────┘        │
                           ├──────────────────────────────────────┤
                           │           DATABASE                   │
                           │  Supabase / PostgreSQL               │
                           │  7 tables + 2 views + RLS policies   │
                           └──────────────────────────────────────┘
```

### 3.2 File Structure

```
src/
├── types/
│   └── clearanceReadiness.ts          # All TypeScript types, enums, constants
├── services/
│   ├── clearanceReadinessApi.ts        # API service layer (20+ methods)
│   └── clearanceCircuitBreaker.ts      # Emergency isolation service
├── components/pages/
│   ├── ClearanceReadinessAssessmentPage.tsx   # Self-assessment wizard
│   ├── ClearanceIntelligencePage.tsx          # Market intelligence dashboard
│   ├── NISPOMComplianceAssistantPage.tsx      # AI compliance assistant
│   └── employer/dashboard/
│       └── FSOPortalTab.tsx                   # FSO management dashboard
├── config/
│   ├── pricing.ts                     # Feature flags per billing tier
│   └── constants.ts                   # Clearance levels, routes
supabase/migrations/
├── 063_clearance_readiness_fso_portal.sql   # Core schema (7 tables)
└── 064_clearance_circuit_breaker.sql        # Breach isolation infrastructure
```

### 3.3 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + TailwindCSS |
| Animation | motion/react (Framer Motion) |
| Charts | Recharts |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth (JWT + RLS) |
| Billing | Stripe (via BillingContext) |
| State | React Context + useState/useEffect |

---

## 4. Developer Guide

### 4.1 Route Protection

All clearance routes are protected with two layers:

```tsx
// In App.tsx — every clearance route requires:
<ProtectedRoute roles={['employer', 'admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN']}>
  <FeatureRoute featureId="clearance-readiness" fallbackPath="/dashboard">
    <Suspense fallback={<PageLoader />}>
      <ClearanceReadinessAssessmentPage />
    </Suspense>
  </FeatureRoute>
</ProtectedRoute>
```

**Layer 1: ProtectedRoute** — Verifies authentication and role from the database (never from user_metadata, which can be spoofed).

**Layer 2: FeatureRoute** — Checks the feature flag system. If the feature is disabled (maintenance, beta, admin-only), shows a disabled page or redirects.

### 4.2 FSO Portal Feature Gating

The FSO Portal tab in the Employer Dashboard is gated by billing tier:

```tsx
// In EmployerDashboard.tsx
const { canAccessFeature } = useBilling();

case 'fso-portal':
  return (
    <FeatureGate
      feature="FSO Portal"
      isUnlocked={canAccessFeature('fsoPortalBasic')}
      requiredTier="Professional"
    >
      <FSOPortalTab />
    </FeatureGate>
  );
```

When a user's tier doesn't include FSO features, they see a blurred overlay with an "Upgrade to Professional" CTA.

### 4.3 Circuit Breaker Integration

Every API method that accesses clearance data checks the circuit breaker first:

```typescript
// In clearanceReadinessApi.ts
import { isDomainAccessible, type ClearanceDomain } from './clearanceCircuitBreaker';

function requireDomainAccess(domain: ClearanceDomain): void {
  if (!isDomainAccessible(domain)) {
    throw new Error(
      `[CIRCUIT BREAKER] Access to ${domain} is currently blocked...`
    );
  }
}

// Example usage in every method:
async listEmployees(filters) {
  try { requireDomainAccess('cleared_employees'); } catch (err) {
    return { success: false, data: [], error: err.message };
  }
  // ... normal data access
}
```

**Domain-to-method mapping:**

| Domain | API Methods Guarded |
|--------|-------------------|
| `cleared_employees` | listEmployees, getEmployee, createEmployee, updateEmployee, getDashboardStats |
| `cv_alerts` | listCVAlerts, acknowledgeCVAlert, resolveCVAlert |
| `reportable_incidents` | listIncidents, createIncident |
| `visit_requests` | listVisitRequests, createVisitRequest, updateVisitStatus |
| `clearance_assessments` | createAssessment, submitGuidelineAssessments |

### 4.4 Adding a New Clearance Feature

1. **Define types** in `src/types/clearanceReadiness.ts`
2. **Add API methods** in `src/services/clearanceReadinessApi.ts` with:
   - `requireDomainAccess()` guard at the top
   - Runtime enum validation for any user-supplied enums
   - `{ success, data, error }` return type
3. **Add database migration** in `supabase/migrations/` with:
   - RLS policies (org-scoped SELECT/INSERT/UPDATE/DELETE)
   - Circuit breaker integration via `is_clearance_domain_accessible()`
   - Audit triggers logging to `fso_audit_log`
4. **Add pricing flags** in `src/config/pricing.ts` for each employer tier
5. **Add UI component** with:
   - ARIA labels on all interactive elements
   - Touch targets minimum 44px
   - Loading states on async operations
   - Error/success toast notifications
   - ESC key handler on modals

### 4.5 Runtime Validation Pattern

Never trust client-supplied enum values. Always validate at the API layer:

```typescript
const VALID_CLEARANCE_LEVELS: readonly ClearanceTargetLevel[] = [
  'public-trust', 'secret', 'top-secret', 'ts-sci',
  'doe-l', 'doe-q', 'doe-q-sci',
] as const;

function validateEnum<T extends string>(
  value: string,
  allowed: readonly T[],
  fieldName: string
): T {
  if (!allowed.includes(value as T)) {
    throw new Error(`Invalid ${fieldName}: "${value}". Allowed: ${allowed.join(', ')}`);
  }
  return value as T;
}

// Usage:
validateEnum(data.targetClearanceLevel, VALID_CLEARANCE_LEVELS, 'targetClearanceLevel');
```

### 4.6 Audit Log Event Types

When adding new features, register new event types in migration 064's CHECK constraint:

```sql
ALTER TABLE fso_audit_log ADD CONSTRAINT fso_audit_log_event_type_check CHECK (event_type IN (
  'employee_added', 'employee_updated', 'employee_deactivated',
  'clearance_status_changed', 'reinvestigation_initiated',
  'visit_request_created', 'visit_request_status_changed',
  'incident_reported', 'incident_status_changed',
  'cv_alert_received', 'cv_alert_acknowledged', 'cv_alert_resolved',
  'briefing_completed', 'foreign_travel_reported',
  'nda_signed', 'roster_exported', 'audit_report_generated',
  'circuit_breaker_tripped', 'circuit_breaker_reset', 'circuit_breaker_changed'
));
```

---

## 5. Data Engineering Guide

### 5.1 Database Schema

#### Core Tables

**clearance_readiness_assessments** — Self-assessment data (minimal PII)
```
id                          UUID PK
user_id                     UUID FK auth.users
target_clearance_level      TEXT (enum)
target_agency_type          TEXT (dod/doe/ic/dhs/other)
target_sector               TEXT
citizenship_status          TEXT (enum)
dual_citizenship            BOOLEAN
dual_citizenship_countries  TEXT[] (max 5, CHECK enforced)
born_abroad                 BOOLEAN
guideline_assessments       JSONB (array, CHECK enforced)
readiness_score             INTEGER (0-100, clamped)
overall_readiness           TEXT (enum)
estimated_processing_days   INTEGER
estimated_cost_to_applicant NUMERIC
recommendations             JSONB[]
attorney_privileged         BOOLEAN
attorney_id                 UUID FK (partial index)
consent_to_store            BOOLEAN
data_retention_days         INTEGER (max 365)
ip_hash                     TEXT (SHA-256)
```

**cleared_employees** — FSO roster (SEVERE PII)
```
id                          UUID PK
organization_id             UUID
first_name, last_name       TEXT
employee_id                 TEXT (unique per org)
email                       TEXT
department, job_title        TEXT
clearance_level             TEXT (enum)
clearance_granted_date      DATE
clearance_expiration_date   DATE
reinvestigation_due_date    DATE
clearance_status            TEXT (enum: active/interim/pending/suspended/revoked/expired/debriefed)
investigating_agency        TEXT (enum)
investigation_type          TEXT (enum: tier-1 through tier-5, SSBI, NACLC, ANACI, DOE)
cv_enrolled                 BOOLEAN
cv_status                   TEXT (enum)
access_level                TEXT (enum)
program_access              TEXT[]
facility_access             TEXT[]
polygraph_type              TEXT (enum)
polygraph_date              DATE
```

**visit_requests** — Visit Authorization Letters
```
id                          UUID PK
organization_id             UUID
direction                   TEXT (incoming/outgoing)
visitor_name                TEXT
visitor_organization        TEXT
visitor_cage_code           TEXT
visitor_clearance_level     TEXT (enum)
host_facility               TEXT
host_facility_cage_code     TEXT
visit_start_date, visit_end_date  DATE
max_classification_level    TEXT (enum)
status                      TEXT (draft/submitted/under-review/approved/denied/expired/cancelled)
```

**reportable_incidents** — SEAD-3 incident records
```
id                          UUID PK
organization_id             UUID
employee_id                 UUID FK cleared_employees
incident_type               TEXT (14 types, CHECK enforced)
incident_date               DATE
severity                    TEXT (low/moderate/serious/critical)
description                 TEXT
status                      TEXT (reported/under-investigation/pending-adjudication/resolved/closed)
reported_within_timeframe   BOOLEAN
```

**cv_alerts** — Continuous Vetting alerts
```
id                          UUID PK
organization_id             UUID
employee_id                 UUID FK cleared_employees
alert_type                  TEXT (11 types)
alert_source                TEXT (dcsa/agency/internal/automated)
severity                    TEXT (informational/low/moderate/high/critical)
status                      TEXT (new/acknowledged/under-review/response-submitted/escalated/resolved/closed)
response_deadline           TIMESTAMPTZ
fso_assessment              TEXT
action_taken                TEXT
mitigation_plan             TEXT
```

**clearance_demand_data** — Market intelligence (aggregate, non-PII)
```
id                          UUID PK
period                      TEXT (YYYY-MM)
sector                      TEXT
clearance_level             TEXT
state                       TEXT (US state code)
open_positions              INTEGER
avg_salary, median_salary   NUMERIC
supply_demand_ratio         NUMERIC
competitiveness             TEXT (low/moderate/high/critical)
UNIQUE(period, sector, clearance_level, state)
```

**fso_audit_log** — Immutable audit trail
```
id                          UUID PK
organization_id             UUID
user_id                     UUID FK
event_type                  TEXT (20+ types, CHECK enforced)
entity_type                 TEXT
entity_id                   UUID
previous_state              JSONB
new_state                   JSONB
change_description          TEXT
ip_hash                     TEXT
created_at                  TIMESTAMPTZ (immutable)
```

**clearance_circuit_breakers** — Emergency isolation state
```
id                          UUID PK
domain                      TEXT UNIQUE (6 domains)
state                       TEXT (closed/open/half-open)
opened_at                   TIMESTAMPTZ
opened_by                   UUID FK
reason                      TEXT
resolution_notes            TEXT
```

#### Views

**v_reinvestigation_alerts** — Employees with reinvestigations due within 90 days
**v_clearance_expirations** — Employees with clearances expiring within 30/90/180 days

### 5.2 Row-Level Security (RLS) Policies

Every table has organization-scoped RLS:

```sql
-- Standard pattern: users see only their organization's data
CREATE POLICY "Org members can view their cleared employees"
  ON cleared_employees FOR SELECT
  USING (
    org_id = (SELECT org_id FROM user_profiles WHERE user_id = auth.uid())
    AND is_clearance_domain_accessible('cleared_employees')  -- circuit breaker check
  );
```

**Split policies** (SELECT/INSERT/UPDATE/DELETE separate) prevent:
- Cross-org data contamination
- org_id tampering on UPDATE (immutable check)
- Unauthorized DELETE operations

### 5.3 Data Retention & Cleanup

```sql
-- Automated cleanup runs via pg_cron
-- SECURITY DEFINER with permission check and 365-day hard max
SELECT cleanup_expired_readiness_assessments();
```

- Default retention: 90 days
- User-configurable: up to 365 days
- Hard maximum: 365 days (cannot be overridden)
- Immediate deletion when `consent_to_store = FALSE`

### 5.4 Audit Trigger Pattern

Every clearance status change is automatically logged:

```sql
CREATE FUNCTION log_clearance_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.clearance_status IS DISTINCT FROM NEW.clearance_status THEN
    INSERT INTO fso_audit_log (
      organization_id, user_id, event_type, entity_type, entity_id,
      previous_state, new_state, change_description
    ) VALUES (
      NEW.organization_id, auth.uid(), 'clearance_status_changed',
      'cleared_employee', NEW.id,
      jsonb_build_object('status', OLD.clearance_status),
      jsonb_build_object('status', NEW.clearance_status),
      'Status changed from ' || OLD.clearance_status || ' to ' || NEW.clearance_status
    );
  END IF;
  RETURN NEW;
END;
$$;
```

### 5.5 Data Flow Diagram

```
Job Seeker Assessment Flow:
  User → ClearanceReadinessAssessmentPage → clearanceReadinessApi.createAssessment()
    → requireDomainAccess('clearance_assessments')
    → validateEnum() checks
    → Supabase INSERT → RLS check → clearance_readiness_assessments table

FSO Employee Management Flow:
  FSO → FSOPortalTab → clearanceReadinessApi.createEmployee()
    → requireDomainAccess('cleared_employees')
    → Supabase INSERT → RLS check → cleared_employees table
    → Trigger: log to fso_audit_log

Breach Response Flow:
  Admin → tripAllCritical('reason')
    → tripBreaker('cleared_employees', reason) → localStorage + Supabase audit
    → tripBreaker('cv_alerts', reason) → localStorage + Supabase audit
    → tripBreaker('reportable_incidents', reason) → localStorage + Supabase audit
    → All API calls return { success: false, error: 'CIRCUIT BREAKER' }
    → Database RLS also blocks via is_clearance_domain_accessible()
```

### 5.6 Migration Execution Order

```
063_clearance_readiness_fso_portal.sql  — Core tables, RLS, triggers, views
064_clearance_circuit_breaker.sql       — Breaker table, extends RLS, audit integration
```

Migration 064 depends on 063 (references `fso_audit_log`, `cleared_employees`, `cv_alerts`, `reportable_incidents`).

---

## 6. Security & Compliance

### 6.1 Compliance Matrix

| Standard | Requirement | Implementation |
|----------|------------|----------------|
| **NIST 800-53 AU-3** | Audit content | Every write logged with user, timestamp, entity, previous/new state |
| **NIST 800-53 AU-9** | Audit protection | UPDATE/DELETE triggers prevent modification; RLS blocks non-admin access |
| **NIST 800-53 IR-4** | Incident handling | Circuit breaker for immediate data isolation |
| **NIST 800-53 IR-5** | Incident monitoring | CV alert ingestion and tracking |
| **32 CFR Part 117** | NISPOM | AI-powered compliance assistant, chapter reference cards |
| **SEAD-3** | Reporting requirements | 14 incident types with deadline tracking |
| **SEAD-4** | Adjudicative guidelines | All 13 guidelines assessed with risk levels |
| **Trusted Workforce 2.0** | Continuous vetting | CV alert management, enrollment tracking |
| **FCRA** | Fair Credit Reporting | No consumer reports, no credit checks, no adverse actions |
| **Privacy Act** | Federal records | No federal records accessed or stored |
| **EO 13526** | Classified information | No classified data stored or transmitted |

### 6.2 PII Classification

| Data Element | Classification | Storage |
|-------------|---------------|---------|
| SSN | **NOT COLLECTED** | N/A |
| Date of Birth | **NOT COLLECTED** | N/A |
| Financial Details | **NOT COLLECTED** | N/A |
| SF-86 Content | **NOT COLLECTED** | N/A |
| Credit Reports | **NOT COLLECTED** | N/A |
| Employee Name | MODERATE PII | Encrypted at rest (Supabase) |
| Employee Email | MODERATE PII | Encrypted at rest (Supabase) |
| Clearance Level | SENSITIVE | Org-scoped RLS |
| SAP Access | SENSITIVE | Org-scoped RLS |
| CV Watchlist Matches | HIGHLY SENSITIVE | Org-scoped RLS + circuit breaker |
| IP Addresses | ANONYMIZED | SHA-256 hash only |

### 6.3 Security Controls Summary

**Authentication & Authorization**
- Supabase Auth with JWT tokens
- Role-based access control (employer, admin, super_admin, PLATFORM_ADMIN)
- Roles fetched from database app_metadata (not user_metadata, which can be spoofed)
- ProtectedRoute wrapper on all clearance routes
- FeatureRoute wrapper for feature flag enforcement
- FeatureGate wrapper with billing tier check on FSO Portal

**Data Protection**
- PostgreSQL RLS on every table (org-scoped)
- Split RLS policies (separate SELECT/INSERT/UPDATE/DELETE)
- org_id immutability check on UPDATE operations
- Runtime enum validation prevents type bypass
- Array length limits (max 5 dual citizenship countries)
- Score clamping (0-100 range)
- CSV export injection protection (formula prefix sanitization)

**Audit & Monitoring**
- Immutable audit log (fso_audit_log)
- Trigger-based change tracking on all clearance status changes
- Circuit breaker state changes logged
- Console.error output gated by `import.meta.env.DEV`

**Emergency Response**
- Circuit breaker service with 7 isolatable domains
- Frontend + database dual-layer isolation
- Cross-tab synchronization via localStorage events
- Audit log explicitly protected from isolation (forensics)
- One-call isolation of all critical domains: `tripAllCritical(reason)`

---

## 7. API Reference

### 7.1 Readiness Assessment

```typescript
// Create a new readiness assessment
clearanceReadinessApi.createAssessment({
  targetClearanceLevel: 'top-secret',       // ClearanceTargetLevel enum
  targetAgencyType: 'dod',                  // dod | doe | ic | dhs | other
  targetSector: 'cybersecurity',
  citizenshipStatus: 'us-citizen-birth',    // CitizenshipStatus enum
  dualCitizenship: false,
  dualCitizenshipCountries: [],             // max 5 entries
  bornAbroad: false,
  attorneyPrivileged: false,                // optional
}): Promise<{ success: boolean; data?: ClearanceReadinessAssessment; error?: string }>

// Submit guideline assessments and compute readiness score
clearanceReadinessApi.submitGuidelineAssessments(
  assessmentId: string,
  guidelines: GuidelineAssessment[]         // 13 guideline assessments
): Promise<{ success: boolean; data?: ClearanceReadinessAssessment; error?: string }>
```

### 7.2 Cleared Employee Management

```typescript
// List employees with filters
clearanceReadinessApi.listEmployees({
  clearanceLevel?: ClearanceTargetLevel,
  status?: ClearedEmployeeStatus,
  cvStatus?: string,
  department?: string,
  search?: string,                          // name/email/employee ID search
  expiringWithinDays?: number,
}): Promise<{ success: boolean; data: ClearedEmployee[]; error?: string }>

// Get single employee
clearanceReadinessApi.getEmployee(id: string)
  : Promise<{ success: boolean; data?: ClearedEmployee; error?: string }>

// Create new cleared employee
clearanceReadinessApi.createEmployee(data: Partial<ClearedEmployee>)
  : Promise<{ success: boolean; data?: ClearedEmployee; error?: string }>

// Update employee record
clearanceReadinessApi.updateEmployee(id: string, updates: Partial<ClearedEmployee>)
  : Promise<{ success: boolean; data?: ClearedEmployee; error?: string }>
```

### 7.3 Visit Authorization

```typescript
// List visit requests
clearanceReadinessApi.listVisitRequests({
  status?: VisitRequestStatus,
  direction?: 'incoming' | 'outgoing',
}): Promise<{ success: boolean; data: VisitRequest[]; error?: string }>

// Create visit request
clearanceReadinessApi.createVisitRequest(data: Partial<VisitRequest>)
  : Promise<{ success: boolean; data?: VisitRequest; error?: string }>

// Update visit status
clearanceReadinessApi.updateVisitStatus(
  id: string,
  status: VisitRequestStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }>
```

### 7.4 Incident Reporting

```typescript
// List incidents
clearanceReadinessApi.listIncidents({
  status?: IncidentStatus,
  severity?: string,
  type?: IncidentType,
}): Promise<{ success: boolean; data: ReportableIncident[]; error?: string }>

// Report new incident
clearanceReadinessApi.createIncident(data: Partial<ReportableIncident>)
  : Promise<{ success: boolean; data?: ReportableIncident; error?: string }>
```

### 7.5 Continuous Vetting

```typescript
// List CV alerts
clearanceReadinessApi.listCVAlerts({
  status?: CVAlertStatus,
  severity?: string,
  employeeId?: string,
}): Promise<{ success: boolean; data: CVAlert[]; error?: string }>

// Acknowledge alert
clearanceReadinessApi.acknowledgeCVAlert(id: string)
  : Promise<{ success: boolean; error?: string }>

// Resolve alert with assessment
clearanceReadinessApi.resolveCVAlert(id: string, {
  fsoAssessment: string,
  actionTaken: string,
  mitigationPlan?: string,
  escalateToAgency?: boolean,
}): Promise<{ success: boolean; error?: string }>
```

### 7.6 Dashboard & Analytics

```typescript
// Get FSO dashboard stats
clearanceReadinessApi.getDashboardStats()
  : Promise<{ success: boolean; data?: FSODashboardStats; error?: string }>

// Get clearance demand data
clearanceReadinessApi.getDemandData({
  sector?: string,
  clearanceLevel?: string,
  state?: string,
  period?: string,
}): Promise<{ success: boolean; data: ClearanceDemandData[] }>

// Get audit log
clearanceReadinessApi.getAuditLog({
  entityType?: string,
  eventType?: string,
  startDate?: string,
  endDate?: string,
}): Promise<{ success: boolean; data: AuditLogEntry[] }>
```

### 7.7 Circuit Breaker API

```typescript
import {
  isDomainAccessible,
  tripBreaker,
  tripAllCritical,
  resetBreaker,
  getAllBreakerStatuses,
  hasActiveBreaker,
} from '@/services/clearanceCircuitBreaker';

// Check if a domain is accessible
isDomainAccessible('cleared_employees'): boolean

// Trip a single domain's breaker
await tripBreaker('cleared_employees', 'Security incident INC-2026-001')
  : Promise<{ success: boolean; message: string }>

// Trip all critical/high severity breakers at once
await tripAllCritical('Active breach detected - isolating all PII')
  : Promise<{ tripped: ClearanceDomain[]; failed: ClearanceDomain[] }>

// Reset a breaker after incident resolution
await resetBreaker('cleared_employees', 'Incident resolved per INC-2026-001')
  : Promise<{ success: boolean; message: string }>

// Get all breaker statuses (sorted by severity)
getAllBreakerStatuses(): CircuitBreakerStatus[]

// Check if any breaker is currently open
hasActiveBreaker(): boolean
```

---

## 8. Pricing & Feature Tiers

### 8.1 Employer Tiers

| Feature | Launchpad ($0) | Teams ($149/mo) | Talent Engine ($499/mo) | Mission Control ($1,999/mo) |
|---------|:-:|:-:|:-:|:-:|
| Job Postings | 3 | 10 | 25 | Unlimited |
| Clearance Pipeline | - | - | Yes | Yes |
| FSO Portal (Basic) | - | - | Yes | Yes |
| FSO Portal (Advanced) | - | - | Yes | Yes |
| Roster Management | - | - | Yes | Yes |
| Visit Requests (VAL) | - | - | Yes | Yes |
| Incident Reporting | - | - | Yes | Yes |
| Continuous Vetting | - | - | Yes | Yes |
| Audit Log | - | - | Yes | Yes |
| NISPOM Assistant | - | - | Yes | Yes |
| Clearance Intelligence | - | - | Yes | Yes |
| Max Cleared Employees | 0 | 0 | 50 | Unlimited |

### 8.2 Feature Flag Keys

For developers integrating with the billing system:

```typescript
// Check in components:
const { canAccessFeature } = useBilling();

canAccessFeature('fsoPortalBasic')        // Basic FSO portal access
canAccessFeature('fsoPortalAdvanced')     // Advanced FSO features
canAccessFeature('fsoRosterManagement')   // Employee roster management
canAccessFeature('fsoVisitRequests')      // VAL management
canAccessFeature('fsoIncidentReporting')  // SEAD-3 reporting
canAccessFeature('fsoContinuousVetting')  // CV alert management
canAccessFeature('fsoAuditLog')           // Audit log access
canAccessFeature('nispomComplianceAssistant')  // NISPOM Q&A
canAccessFeature('clearanceIntelligence')      // Market intelligence
```

---

## 9. Emergency Procedures

### 9.1 Breach Response — Immediate Isolation

If a security incident is detected involving clearance data:

**Step 1: Isolate all critical data (< 30 seconds)**

```typescript
import { tripAllCritical } from '@/services/clearanceCircuitBreaker';

const result = await tripAllCritical('Security incident detected - ticket INC-2026-XXX');
// Immediately blocks access to: cleared_employees, cv_alerts, reportable_incidents
```

This simultaneously:
- Blocks all frontend API calls to affected domains
- Syncs across all browser tabs via localStorage
- Logs the isolation event to the immutable audit trail
- Server-side RLS policies also block database access via `is_clearance_domain_accessible()`

**Step 2: Verify isolation**

```typescript
import { getAllBreakerStatuses, hasActiveBreaker } from '@/services/clearanceCircuitBreaker';

console.log(hasActiveBreaker()); // true
console.log(getAllBreakerStatuses());
// Returns all breaker statuses sorted by severity
```

**Step 3: Investigate**

The audit log remains accessible during a breach (never isolated) per NIST 800-53 AU-9. Use it for forensics:

```typescript
const auditLog = await clearanceReadinessApi.getAuditLog({
  startDate: '2026-03-01',
  endDate: '2026-03-09',
});
```

**Step 4: Restore access after resolution**

```typescript
import { resetBreaker } from '@/services/clearanceCircuitBreaker';

await resetBreaker('cleared_employees', 'Incident resolved - see INC-2026-XXX');
await resetBreaker('cv_alerts', 'Incident resolved - see INC-2026-XXX');
await resetBreaker('reportable_incidents', 'Incident resolved - see INC-2026-XXX');
```

### 9.2 Domain Isolation Priority

In a partial breach, isolate in this order (most sensitive first):

| Priority | Domain | PII Severity | Breach Impact |
|----------|--------|-------------|--------------|
| 1 | `cleared_employees` | CRITICAL | Names, emails, clearance levels, SAP access exposed |
| 2 | `cv_alerts` | CRITICAL | Watchlist matches with employee identities exposed |
| 3 | `reportable_incidents` | HIGH | Incident details and employee involvement exposed |
| 4 | `clearance_assessments` | MEDIUM | Self-assessment answers to SEAD-4 guidelines exposed |
| 5 | `visit_requests` | MEDIUM | Visitor names, CAGE codes, facility relationships exposed |
| - | `fso_audit_log` | NEVER ISOLATE | Required for forensics (NIST 800-53 AU-9) |
| - | `clearance_demand_data` | LOW | Aggregate market data only (non-sensitive) |

### 9.3 Server-Side Isolation (Database Admin)

For deeper isolation at the database level:

```sql
-- Trip the circuit breaker via SQL
UPDATE clearance_circuit_breakers
SET state = 'open',
    opened_at = NOW(),
    reason = 'Security incident - manual isolation'
WHERE domain = 'cleared_employees';

-- Verify RLS is blocking access
SELECT is_clearance_domain_accessible('cleared_employees');
-- Returns: false

-- Reset after resolution
UPDATE clearance_circuit_breakers
SET state = 'closed',
    closed_at = NOW(),
    resolution_notes = 'Incident resolved per INC-2026-XXX'
WHERE domain = 'cleared_employees';
```

---

## 10. Glossary

| Term | Definition |
|------|-----------|
| **CAGE Code** | Commercial and Government Entity code — 5-character ID for facilities doing business with the federal government |
| **CV** | Continuous Vetting — Ongoing monitoring of cleared personnel (replaces periodic reinvestigation under Trusted Workforce 2.0) |
| **DCSA** | Defense Counterintelligence and Security Agency — Conducts background investigations for DoD |
| **DOE L** | Department of Energy L clearance — Equivalent to Secret, for Restricted Data access |
| **DOE Q** | Department of Energy Q clearance — Equivalent to Top Secret, for Restricted Data access |
| **FCL** | Facility Clearance — Authorization for a company to access classified information |
| **FOCI** | Foreign Ownership, Control, or Influence — Assessment of foreign involvement in a cleared contractor |
| **FSO** | Facility Security Officer — Person responsible for a company's security program under NISPOM |
| **KMP** | Key Management Personnel — Officers, directors, and other personnel with significant management authority at a cleared facility |
| **NACLC** | National Agency Check with Local Agency Check and Credit Check |
| **NISPOM** | National Industrial Security Program Operating Manual (32 CFR Part 117) |
| **RLS** | Row-Level Security — PostgreSQL feature that restricts which rows a user can access |
| **SAP** | Special Access Program — Programs with additional access controls beyond standard clearance levels |
| **SCI** | Sensitive Compartmented Information — Intelligence community information requiring special access |
| **SEAD** | Security Executive Agent Directive — Policies governing security clearance processes |
| **SF-86** | Standard Form 86 — Federal questionnaire for national security positions (NOT stored on this platform) |
| **SSBI** | Single Scope Background Investigation — Investigation type for Top Secret clearances |
| **TS/SCI** | Top Secret / Sensitive Compartmented Information — Highest standard clearance level |
| **TW 2.0** | Trusted Workforce 2.0 — DCSA initiative replacing periodic reinvestigations with continuous vetting |
| **VAL** | Visit Authorization Letter — Authorization for cleared personnel to visit another facility |

---

## Contact

For technical questions about the clearance readiness platform, contact the STEMWorkforce engineering team.

For security incidents involving clearance data, follow the Emergency Procedures in Section 9.
