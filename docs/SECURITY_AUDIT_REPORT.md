# 🔒 Security & Code Audit Report
## STEMWorkforce Admin Dashboard Components
**Date:** December 29, 2024

---

## Executive Summary

This audit examines four admin dashboard components for security vulnerabilities, code quality issues, and best practices compliance.

---

## 1. SQL Injection & Query Safety

### Findings:
### Supabase Query Patterns Used:
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:29:        supabase.from('marketplace_providers').select('*', { count: 'exact' }),
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:30:        supabase.from('marketplace_services').select('*', { count: 'exact' }),
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:31:        supabase.from('marketplace_purchases').select('amount', { count: 'exact' }),
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:32:        supabase.from('marketplace_reviews').select('rating', { count: 'exact' })
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:42:        activeProviders: providers.data?.filter(p => p.status === 'active').length || 0,
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:257:      .from('marketplace_providers')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:258:      .select('*, users(first_name, last_name, email)')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:262:      query = query.eq('status', statusFilter);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:272:      .from('marketplace_providers')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:273:      .update({ status: 'active', approved_at: new Date().toISOString() })
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:274:      .eq('id', providerId);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:280:      .from('marketplace_providers')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:281:      .update({ status: 'suspended' })
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:282:      .eq('id', providerId);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:491:      .from('marketplace_services')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:492:      .select('*, marketplace_providers(users(first_name, last_name)), marketplace_categories(name)')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:496:      query = query.eq('category_id', categoryFilter);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:506:      .from('marketplace_services')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:507:      .update({ is_active: !currentStatus })
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:508:      .eq('id', serviceId);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:620:      .from('marketplace_categories')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:621:      .select('*')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:712:      await supabase.from('marketplace_categories').update(formData).eq('id', category.id);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:714:      await supabase.from('marketplace_categories').insert(formData);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:815:      .from('marketplace_purchases')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:816:      .select(`
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:825:      query = query.eq('status', statusFilter);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:928:      .from('marketplace_reviews')
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:929:      .select(`
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:942:    await supabase.from('marketplace_reviews').update({ status: 'approved' }).eq('id', reviewId);


**✅ PASS**: All database queries use Supabase's parameterized query builder, which automatically escapes user input and prevents SQL injection.

---

## 2. Authentication & Authorization

### Findings:
### Auth Checks in Components:
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:13:    // Get initial session
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:14:    supabase.auth.getSession().then(({ data: { session } }) => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:15:      setUser(session?.user ?? null);
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:16:      if (session?.user) {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:17:        fetchUserProfile(session.user.id);
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:24:    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:25:      setUser(session?.user ?? null);
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:26:      if (session?.user) {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:27:        fetchUserProfile(session.user.id);
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:104:  const isAdmin = () => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:109:  const hasPermission = (permission) => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:111:    return isAdmin();
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:123:    isAdmin,
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:124:    hasPermission,
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:135:export const useAuth = () => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:138:    throw new Error('useAuth must be used within an AuthProvider');
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:143:export default useAuth;
/home/claude/stemworkforce-admin/src/lib/supabase.js:34:export const getUser = async () => {
/home/claude/stemworkforce-admin/src/lib/supabase.js:35:  const { data: { user }, error } = await supabase.auth.getUser();
/home/claude/stemworkforce-admin/src/lib/supabase.js:40:// Helper function to get session
/home/claude/stemworkforce-admin/src/lib/supabase.js:42:  const { data: { session }, error } = await supabase.auth.getSession();
/home/claude/stemworkforce-admin/src/lib/supabase.js:44:  return session;
/home/claude/stemworkforce-admin/src/App.jsx:3:import { useAuth } from './hooks/useAuth';
/home/claude/stemworkforce-admin/src/App.jsx:25:  const { user, loading, userRole } = useAuth();
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:28:    const { data: { user } } = await supabase.auth.getUser();

### Route Protection:
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
--
  if (requiredRole === 'admin' && !['admin', 'super_admin'].includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
--
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
--
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/billing"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <BillingDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/advertising"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdvertisingDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/marketplace"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <MarketplaceDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />


### Issues Found:

**⚠️ ISSUE #1: Missing Server-Side Authorization**
- Routes are protected client-side with `ProtectedRoute`
- BUT database operations don't verify admin role server-side
- An attacker with a valid session could potentially call Supabase directly

**Recommendation**: Add Row Level Security (RLS) policies that check admin roles:

```sql
-- Example RLS policy for admin-only operations
CREATE POLICY admin_only_update ON marketplace_providers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
            AND ura.is_active = true
        )
    );
```

**⚠️ ISSUE #2: No Permission Granularity**
- `hasPermission()` function exists but always returns `isAdmin()`
- Individual permission checks are not implemented

**Recommendation**: Implement proper permission checking:

```javascript
const hasPermission = async (permission) => {
  const { data } = await supabase.rpc('check_permission', { 
    p_user_id: user.id, 
    p_permission: permission 
  });
  return data;
};
```

---

## 3. Input Validation & Sanitization

### Findings:
### Form Input Handling:
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:299:            value={statusFilter}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:300:            onChange={(e) => setStatusFilter(e.target.value)}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:303:            <option value="all">All Status</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:304:            <option value="pending">Pending Review</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:305:            <option value="active">Active</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:306:            <option value="suspended">Suspended</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:525:            value={categoryFilter}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:526:            onChange={(e) => setCategoryFilter(e.target.value)}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:529:            <option value="all">All Categories</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:530:            <option value="coaching">Career Coaching</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:531:            <option value="resume">Resume Services</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:532:            <option value="interview">Interview Prep</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:533:            <option value="training">Skills Training</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:701:  const [formData, setFormData] = useState({
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:730:              value={formData.category_key}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:731:              onChange={(e) => setFormData({ ...formData, category_key: e.target.value })}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:741:              value={formData.name}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:742:              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:750:              value={formData.description}
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:751:              onChange={(e) => setFormData({ ...formData, description: e.target.value })}


### Issues Found:

**⚠️ ISSUE #3: No Input Validation Before Database Operations**
- Form data is sent directly to Supabase without validation
- No length limits, format validation, or sanitization

**Example of problematic code:**
```javascript
// Current - no validation
const handleSubmit = async (e) => {
  e.preventDefault();
  await supabase.from('marketplace_categories').insert(formData);
};
```

**Recommendation**: Add validation layer:

```javascript
const validateCategoryForm = (data) => {
  const errors = {};
  if (!data.category_key || data.category_key.length > 50) {
    errors.category_key = 'Category key required, max 50 chars';
  }
  if (!data.name || data.name.length > 100) {
    errors.name = 'Name required, max 100 chars';
  }
  if (data.commission_rate < 0 || data.commission_rate > 100) {
    errors.commission_rate = 'Commission must be 0-100%';
  }
  return errors;
};
```

**⚠️ ISSUE #4: No XSS Protection on Display**
- User-provided content displayed without sanitization
- React escapes by default, but `dangerouslySetInnerHTML` could be added later

**Recommendation**: If rich text is needed, use DOMPurify:
```javascript
import DOMPurify from 'dompurify';
<div>{DOMPurify.sanitize(userContent)}</div>
```

---

## 4. Sensitive Data Exposure

### Findings:
### Checking for sensitive data in code:
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:70:  const signIn = async (email, password) => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:71:    const { data, error } = await supabase.auth.signInWithPassword({
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:73:      password,
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:78:  const signUp = async (email, password, metadata) => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:81:      password,
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:99:  const resetPassword = async (email) => {
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:100:    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:122:    resetPassword,
/home/claude/stemworkforce-admin/src/lib/supabase.js:15:      autoRefreshToken: true,
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:862:    stripe_secret_key: '',
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:863:    stripe_webhook_secret: '',
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:905:            <label className="block text-sm font-medium mb-2">Secret Key</label>
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:908:              value={settings.stripe_secret_key}
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:909:              onChange={(e) => setSettings({ ...settings, stripe_secret_key: e.target.value })}
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:916:            <label className="block text-sm font-medium mb-2">Webhook Secret</label>
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:919:              value={settings.stripe_webhook_secret}
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:920:              onChange={(e) => setSettings({ ...settings, stripe_webhook_secret: e.target.value })}

### Console.log statements (potential data leaks):
/home/claude/stemworkforce-admin/src/hooks/useAuth.js:64:      console.error('Error fetching user profile:', error);
/home/claude/stemworkforce-admin/src/lib/supabase.js:7:  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:50:      console.error('Error fetching marketplace stats:', error);
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:61:      console.error('Error fetching dashboard data:', error);
/home/claude/stemworkforce-admin/src/pages/advertising/AdvertisingDashboard.jsx:45:      console.error('Error fetching ad stats:', error);
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:49:      console.error('Error fetching billing stats:', error);


### Issues Found:

**🚨 CRITICAL ISSUE #5: Stripe Secret Key in Frontend**
- `stripe_secret_key` is being handled in React component
- Secret keys must NEVER be exposed to the frontend
- This would expose your Stripe account to attackers

**Location**: `BillingDashboard.jsx` lines 862, 905-920

**Current problematic code:**
```javascript
const [settings, setSettings] = useState({
  stripe_secret_key: '',  // ❌ NEVER in frontend!
  stripe_webhook_secret: '',  // ❌ NEVER in frontend!
});
```

**Recommendation**: Remove secret key handling from frontend entirely. Use:
1. Environment variables on server only
2. Supabase Edge Functions for Stripe operations
3. Only publishable key should be in frontend

**⚠️ ISSUE #6: Console Statements in Production**
- 6 `console.error` statements found
- Could leak error details to attackers

**Recommendation**: Use proper error handling:
```javascript
// Replace console.error with proper error handling
import { captureException } from '@sentry/react'; // or similar

try {
  // operation
} catch (error) {
  captureException(error);
  setError('An error occurred. Please try again.');
}
```

---

## 5. CSRF & Request Forgery

### Findings:
### Checking for CSRF protection:
No explicit CSRF protection found


**✅ PASS (Partial)**: Supabase handles CSRF protection via JWT tokens in Authorization headers. However, ensure:
- All mutations go through Supabase client (which includes JWT)
- No direct fetch() calls without proper auth headers

---

## 6. Error Handling

### Findings:
### Error Handling Patterns:
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:27:    try {
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:49:    } catch (error) {
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:50:      console.error('Error fetching marketplace stats:', error);
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:41:    try {
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:60:    } catch (error) {
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:61:      console.error('Error fetching dashboard data:', error);
/home/claude/stemworkforce-admin/src/pages/advertising/AdvertisingDashboard.jsx:26:    try {
/home/claude/stemworkforce-admin/src/pages/advertising/AdvertisingDashboard.jsx:44:    } catch (error) {
/home/claude/stemworkforce-admin/src/pages/advertising/AdvertisingDashboard.jsx:45:      console.error('Error fetching ad stats:', error);
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:26:    try {
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:48:    } catch (error) {
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:49:      console.error('Error fetching billing stats:', error);


### Issues Found:

**⚠️ ISSUE #7: Inconsistent Error Handling**
- Some operations check for errors, others don't
- No user-facing error messages shown

**Example of missing error handling:**
```javascript
// Current - ignores errors
const handleApprove = async (providerId) => {
  await supabase
    .from('marketplace_providers')
    .update({ status: 'active' })
    .eq('id', providerId);
  fetchProviders();  // Refreshes even if update failed
};
```

**Recommendation**:
```javascript
const handleApprove = async (providerId) => {
  const { error } = await supabase
    .from('marketplace_providers')
    .update({ status: 'active' })
    .eq('id', providerId);
    
  if (error) {
    toast.error('Failed to approve provider');
    return;
  }
  toast.success('Provider approved');
  fetchProviders();
};
```

---

## 7. Rate Limiting & DoS Protection

### Findings:

**⚠️ ISSUE #8: No Client-Side Rate Limiting**
- Users can trigger unlimited database requests
- No debouncing on search inputs
- No pagination limits enforced

**Recommendation**:
```javascript
// Add debouncing to search
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => fetchData(value),
  300
);

// Add rate limiting on sensitive operations
const rateLimitedAction = useRateLimit(actionFn, { maxCalls: 5, period: 60000 });
```

---

## 8. Confirmation Dialogs

### Findings:
### Confirmation Dialogs:
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:844:            <option value="confirmed">Confirmed</option>
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:887:                      order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:262:    if (!confirm('Are you sure you want to cancel this subscription?')) return;


### Issues Found:

**⚠️ ISSUE #9: Missing Confirmation for Destructive Actions**
- Only 1 confirmation dialog found (subscription cancellation)
- Missing for: user suspension, organization suspension, provider suspension, review rejection

**Recommendation**: Add confirmation for all destructive operations:
```javascript
const handleSuspendUser = async (userId) => {
  if (!window.confirm('Are you sure you want to suspend this user?')) return;
  // proceed with suspension
};
```

Or use a proper modal component for better UX.

---

## 9. Audit Logging

### Findings:
### Audit Logging Implementation:
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:336:    await supabase.from('audit_logs').insert({
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:1114:      .from('audit_logs')


### Issues Found:

**⚠️ ISSUE #10: Inconsistent Audit Logging**
- Only 1 audit log entry found (user suspension in AdminDashboard)
- Most admin actions don't create audit records

**Recommendation**: Create audit helper:
```javascript
const logAdminAction = async (action, resourceType, resourceId, details) => {
  await supabase.from('audit_logs').insert({
    event_type: action,
    event_category: 'admin',
    actor_id: user.id,
    actor_email: user.email,
    resource_type: resourceType,
    resource_id: resourceId,
    metadata: details,
  });
};

// Use in all admin operations
await logAdminAction('PROVIDER_APPROVED', 'provider', providerId, { reason });
```

---

## 10. Code Quality Issues

### Findings:
### Code Quality Checks:

#### Large Component Files:
  1273 /home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx
   985 /home/claude/stemworkforce-admin/src/pages/advertising/AdvertisingDashboard.jsx
   947 /home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx
  1258 /home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx
  4463 total

#### Hardcoded Values Found:
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:822:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:935:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/marketplace/MarketplaceDashboard.jsx:1050:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:317:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:543:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:666:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:780:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/admin/AdminDashboard.jsx:1117:      .limit(100);
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:250:      .limit(50);
/home/claude/stemworkforce-admin/src/pages/billing/BillingDashboard.jsx:720:      .limit(50);


### Issues Found:

**⚠️ ISSUE #11: Large Component Files**
- All dashboard files are 900-1300 lines
- Difficult to maintain and test
- Should be split into smaller components

**Recommendation**: Split each dashboard into:
- Main container component
- Individual tab components in separate files
- Shared UI components

**⚠️ ISSUE #12: Hardcoded Pagination Limits**
- `.limit(50)` and `.limit(100)` hardcoded throughout
- No user control over page size

**Recommendation**: Use constants or configuration:
```javascript
const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
};
```

---

## Summary & Risk Matrix

| Issue | Severity | Impact | Effort to Fix |
|-------|----------|--------|---------------|
| #1 Missing Server-Side Auth | 🔴 HIGH | Data breach | Medium |
| #2 No Permission Granularity | 🟡 MEDIUM | Over-privileged access | Medium |
| #3 No Input Validation | 🟡 MEDIUM | Data corruption | Low |
| #4 No XSS Protection | 🟢 LOW | React handles | Low |
| #5 Stripe Secret in Frontend | 🔴 CRITICAL | Account compromise | Low |
| #6 Console Statements | 🟢 LOW | Info leak | Low |
| #7 Inconsistent Error Handling | 🟡 MEDIUM | Poor UX | Medium |
| #8 No Rate Limiting | 🟡 MEDIUM | DoS potential | Medium |
| #9 Missing Confirmations | 🟢 LOW | Accidental actions | Low |
| #10 Inconsistent Audit Logging | 🟡 MEDIUM | Compliance risk | Medium |
| #11 Large Component Files | 🟢 LOW | Maintainability | High |
| #12 Hardcoded Limits | 🟢 LOW | Flexibility | Low |

---

## Required Actions Before Production

### MUST FIX (Critical/High):
1. ❌ Remove Stripe secret key handling from frontend
2. ❌ Add RLS policies for admin operations
3. ❌ Implement proper permission checking

### SHOULD FIX (Medium):
4. ⚠️ Add input validation
5. ⚠️ Implement consistent error handling with user feedback
6. ⚠️ Add confirmation dialogs for destructive actions
7. ⚠️ Implement comprehensive audit logging
8. ⚠️ Add rate limiting/debouncing

### NICE TO HAVE (Low):
9. 📝 Remove console statements for production
10. 📝 Split large components
11. 📝 Make pagination configurable

---

## Recommended RLS Policies

Add these to your Supabase database:

```sql
-- Admin-only read access to audit logs
CREATE POLICY admin_audit_read ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.hierarchy_level >= 50
            AND ura.is_active = true
        )
    );

-- Admin-only user management
CREATE POLICY admin_user_update ON users
    FOR UPDATE USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'SUPPORT_ADMIN')
            AND ura.is_active = true
        )
    );

-- Billing admin for subscriptions
CREATE POLICY billing_admin_subs ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'BILLING_ADMIN')
            AND ura.is_active = true
        )
    );
```

---

*Audit completed: December 29, 2024*
*Auditor: Claude AI Security Review*
