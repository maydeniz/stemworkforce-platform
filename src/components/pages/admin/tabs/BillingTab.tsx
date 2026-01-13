import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, CreditCard, Receipt, FileText,
  PieChart, BarChart3, Calendar, Users, Building2, Megaphone, Store,
  Wallet, Download, Plus, Search,
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle,
  XCircle, Eye, Edit, Send, CalendarDays,
  Landmark, GraduationCap, Briefcase, Heart, Shield, Server,
  Zap, Percent, Calculator, FileWarning, Hourglass, UserCheck,
  UserMinus,
  X, Save, Upload, Settings, Bell, Target
} from 'lucide-react';

// ===========================================
// TYPE DEFINITIONS
// ===========================================

interface RevenueStream {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  amount: number;
  change: number;
  changePercent: number;
  breakdown?: { label: string; value: number }[];
}

interface ExpenseCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  budget: number;
  actual: number;
  committed: number;
  subcategories?: { name: string; amount: number }[];
}

interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerType: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';
  dueDate: string;
  paidDate?: string;
  source: string;
}

interface Grant {
  id: string;
  grantNumber: string;
  funder: string;
  title: string;
  totalAmount: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'closed';
  nextReportDue?: string;
}

interface Expense {
  id: string;
  number: string;
  title: string;
  vendor: string;
  category: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  date: string;
  recurring: boolean;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const REVENUE_STREAMS: RevenueStream[] = [
  {
    id: 'subscriptions',
    name: 'Subscription Revenue',
    icon: CreditCard,
    color: 'emerald',
    amount: 89500,
    change: 12400,
    changePercent: 16.1,
    breakdown: [
      { label: 'Employer Plans', value: 45200 },
      { label: 'Training Provider', value: 22800 },
      { label: 'Job Seeker Pro', value: 12500 },
      { label: 'Government/Edu', value: 9000 },
    ]
  },
  {
    id: 'events',
    name: 'Event Revenue',
    icon: Calendar,
    color: 'blue',
    amount: 32400,
    change: 8200,
    changePercent: 33.9,
    breakdown: [
      { label: 'Ticket Sales', value: 18200 },
      { label: 'Sponsorships', value: 12500 },
      { label: 'Booth Sales', value: 1700 },
    ]
  },
  {
    id: 'marketplace',
    name: 'Marketplace Revenue',
    icon: Store,
    color: 'violet',
    amount: 18200,
    change: 5400,
    changePercent: 42.1,
    breakdown: [
      { label: 'Coaching Services', value: 12400 },
      { label: 'Resume Services', value: 5800 },
    ]
  },
  {
    id: 'advertising',
    name: 'Advertising Revenue',
    icon: Megaphone,
    color: 'amber',
    amount: 12320,
    change: 980,
    changePercent: 8.6,
    breakdown: [
      { label: 'Banner Ads', value: 6200 },
      { label: 'Sponsored Jobs', value: 3400 },
      { label: 'Newsletter Ads', value: 2720 },
    ]
  },
  {
    id: 'job_postings',
    name: 'Job Posting Fees',
    icon: Briefcase,
    color: 'cyan',
    amount: 8450,
    change: 1200,
    changePercent: 16.6,
    breakdown: [
      { label: 'Premium Listings', value: 5200 },
      { label: 'Featured Jobs', value: 2450 },
      { label: 'Urgent Listings', value: 800 },
    ]
  },
  {
    id: 'grants',
    name: 'Grant Funding',
    icon: Landmark,
    color: 'purple',
    amount: 125000,
    change: 0,
    changePercent: 0,
    breakdown: [
      { label: 'DOE Grant', value: 75000 },
      { label: 'NSF Grant', value: 50000 },
    ]
  },
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'infrastructure',
    name: 'Platform Infrastructure',
    icon: Server,
    color: 'blue',
    budget: 28000,
    actual: 24500,
    committed: 2000,
    subcategories: [
      { name: 'Cloud Hosting (AWS/Vercel)', amount: 12400 },
      { name: 'Database (Supabase)', amount: 4800 },
      { name: 'CDN & Storage', amount: 3200 },
      { name: 'Monitoring & Analytics', amount: 2100 },
      { name: 'Security Services', amount: 2000 },
    ]
  },
  {
    id: 'payment_processing',
    name: 'Payment Processing',
    icon: CreditCard,
    color: 'violet',
    budget: 8000,
    actual: 6840,
    committed: 800,
    subcategories: [
      { name: 'Stripe Fees (2.9% + 30c)', amount: 5200 },
      { name: 'PayPal Fees', amount: 1240 },
      { name: 'ACH/Bank Fees', amount: 400 },
    ]
  },
  {
    id: 'third_party',
    name: 'Third-Party Services',
    icon: Zap,
    color: 'cyan',
    budget: 12000,
    actual: 9800,
    committed: 1200,
    subcategories: [
      { name: 'Email (SendGrid)', amount: 2400 },
      { name: 'SMS (Twilio)', amount: 1800 },
      { name: 'AI APIs (OpenAI)', amount: 3200 },
      { name: 'Analytics (Mixpanel)', amount: 1600 },
      { name: 'Auth (Supabase Auth)', amount: 800 },
    ]
  },
  {
    id: 'staff',
    name: 'Staff & Contractors',
    icon: Users,
    color: 'emerald',
    budget: 45000,
    actual: 42000,
    committed: 3000,
    subcategories: [
      { name: 'Engineering Team', amount: 28000 },
      { name: 'Design Contractors', amount: 8000 },
      { name: 'Content Writers', amount: 4000 },
      { name: 'Customer Support', amount: 2000 },
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing & Advertising',
    icon: Megaphone,
    color: 'amber',
    budget: 18000,
    actual: 15200,
    committed: 2400,
    subcategories: [
      { name: 'Digital Ads (Google/LinkedIn)', amount: 8400 },
      { name: 'Content Marketing', amount: 3200 },
      { name: 'Email Campaigns', amount: 2000 },
      { name: 'PR & Outreach', amount: 1600 },
    ]
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: Shield,
    color: 'red',
    budget: 8000,
    actual: 5400,
    committed: 1000,
    subcategories: [
      { name: 'Legal Counsel', amount: 3200 },
      { name: 'Compliance Audits', amount: 1400 },
      { name: 'HIPAA Compliance', amount: 800 },
    ]
  },
  {
    id: 'events',
    name: 'Event Hosting',
    icon: CalendarDays,
    color: 'pink',
    budget: 15000,
    actual: 12400,
    committed: 1800,
    subcategories: [
      { name: 'Venue Costs', amount: 6400 },
      { name: 'Catering', amount: 3200 },
      { name: 'Equipment Rental', amount: 1800 },
      { name: 'Speaker Fees', amount: 1000 },
    ]
  },
  {
    id: 'content',
    name: 'Content Creation',
    icon: FileText,
    color: 'orange',
    budget: 6000,
    actual: 4800,
    committed: 600,
    subcategories: [
      { name: 'Video Production', amount: 2400 },
      { name: 'Graphics & Design', amount: 1600 },
      { name: 'Stock Assets', amount: 800 },
    ]
  },
];

const SAMPLE_INVOICES: Invoice[] = [
  { id: '1', number: 'INV-2025-0342', customer: 'Lockheed Martin', customerType: 'employer', amount: 2999, status: 'paid', dueDate: '2025-01-15', paidDate: '2025-01-12', source: 'Enterprise Plan' },
  { id: '2', number: 'INV-2025-0341', customer: 'Sandia National Labs', customerType: 'employer', amount: 1999, status: 'paid', dueDate: '2025-01-10', paidDate: '2025-01-08', source: 'Professional Plan' },
  { id: '3', number: 'INV-2025-0340', customer: 'MIT', customerType: 'education', amount: 999, status: 'sent', dueDate: '2025-01-20', source: 'Institution Plan' },
  { id: '4', number: 'INV-2025-0339', customer: 'Northrop Grumman', customerType: 'employer', amount: 2999, status: 'overdue', dueDate: '2025-01-05', source: 'Enterprise Plan' },
  { id: '5', number: 'INV-2025-0338', customer: 'NVIDIA', customerType: 'employer', amount: 2999, status: 'paid', dueDate: '2025-01-01', paidDate: '2024-12-28', source: 'Enterprise Plan' },
  { id: '6', number: 'INV-2025-0337', customer: 'STEM Career Fair 2025', customerType: 'event', amount: 12500, status: 'partial', dueDate: '2025-01-25', source: 'Event Sponsorship' },
  { id: '7', number: 'INV-2025-0336', customer: 'SpaceX', customerType: 'employer', amount: 2999, status: 'sent', dueDate: '2025-01-28', source: 'Enterprise Plan' },
  { id: '8', number: 'INV-2025-0335', customer: 'IBM Quantum', customerType: 'employer', amount: 1999, status: 'draft', dueDate: '2025-02-01', source: 'Professional Plan' },
];

const SAMPLE_GRANTS: Grant[] = [
  {
    id: '1',
    grantNumber: 'DOE-CTO-2024-001',
    funder: 'Department of Energy',
    title: 'CTO Challenge - STEM Workforce Development Initiative',
    totalAmount: 2500000,
    spent: 875000,
    remaining: 1625000,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    status: 'active',
    nextReportDue: '2025-03-31',
  },
  {
    id: '2',
    grantNumber: 'NSF-STEM-2024-042',
    funder: 'National Science Foundation',
    title: 'Expanding STEM Career Pathways in Emerging Technologies',
    totalAmount: 1200000,
    spent: 420000,
    remaining: 780000,
    startDate: '2024-06-01',
    endDate: '2027-05-31',
    status: 'active',
    nextReportDue: '2025-06-30',
  },
  {
    id: '3',
    grantNumber: 'DOL-WDQI-2024-018',
    funder: 'Department of Labor',
    title: 'Workforce Data Quality Initiative - Quantum Technologies Sector',
    totalAmount: 500000,
    spent: 125000,
    remaining: 375000,
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    status: 'active',
    nextReportDue: '2025-02-28',
  },
  {
    id: '4',
    grantNumber: 'AZ-STATE-2024-005',
    funder: 'State of Arizona',
    title: 'Semiconductor Workforce Pipeline Development',
    totalAmount: 750000,
    spent: 0,
    remaining: 750000,
    startDate: '2025-01-01',
    endDate: '2027-12-31',
    status: 'pending',
  },
];

const SAMPLE_EXPENSES: Expense[] = [
  { id: '1', number: 'EXP-2025-0089', title: 'AWS Monthly Hosting', vendor: 'Amazon Web Services', category: 'infrastructure', amount: 4200, status: 'paid', date: '2025-01-01', recurring: true },
  { id: '2', number: 'EXP-2025-0088', title: 'Supabase Pro Plan', vendor: 'Supabase Inc', category: 'infrastructure', amount: 599, status: 'paid', date: '2025-01-01', recurring: true },
  { id: '3', number: 'EXP-2025-0087', title: 'OpenAI API Usage', vendor: 'OpenAI', category: 'third_party', amount: 1240, status: 'paid', date: '2025-01-05', recurring: false },
  { id: '4', number: 'EXP-2025-0086', title: 'LinkedIn Ads Campaign', vendor: 'LinkedIn', category: 'marketing', amount: 2500, status: 'pending', date: '2025-01-10', recurring: false },
  { id: '5', number: 'EXP-2025-0085', title: 'Legal Consultation', vendor: 'Wilson & Partners LLP', category: 'legal', amount: 1800, status: 'approved', date: '2025-01-08', recurring: false },
  { id: '6', number: 'EXP-2025-0084', title: 'Career Fair Venue Deposit', vendor: 'Phoenix Convention Center', category: 'events', amount: 5000, status: 'paid', date: '2025-01-02', recurring: false },
  { id: '7', number: 'EXP-2025-0083', title: 'Video Production - Training', vendor: 'MediaCraft Studios', category: 'content', amount: 2400, status: 'pending', date: '2025-01-12', recurring: false },
  { id: '8', number: 'EXP-2025-0082', title: 'SendGrid Email Service', vendor: 'Twilio SendGrid', category: 'third_party', amount: 249, status: 'paid', date: '2025-01-01', recurring: true },
];

// ===========================================
// SERVICE FEE TYPES & DATA
// ===========================================

interface ServiceFee {
  id: string;
  category: string;
  name: string;
  description: string;
  feeType: 'percentage' | 'fixed' | 'tiered';
  percentageRate?: number;
  fixedAmount?: number;
  tiers?: { minAmount: number; maxAmount: number; rate: number }[];
  minFee?: number;
  maxFee?: number;
  isActive: boolean;
  appliesTo: string[];
  effectiveDate: string;
  lastModified: string;
}

const SERVICE_FEE_CATEGORIES = [
  { id: 'marketplace', name: 'Marketplace', icon: Store, color: 'violet', description: 'Fees for service provider transactions' },
  { id: 'events', name: 'Events', icon: Calendar, color: 'blue', description: 'Event ticket and registration fees' },
  { id: 'job_postings', name: 'Job Postings', icon: Briefcase, color: 'emerald', description: 'Premium job listing and featured placement fees' },
  { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard, color: 'amber', description: 'Payment processing for subscription plans' },
  { id: 'advertising', name: 'Advertising', icon: Megaphone, color: 'pink', description: 'Sponsored content and advertising fees' },
];

const SAMPLE_SERVICE_FEES: ServiceFee[] = [
  {
    id: '1',
    category: 'marketplace',
    name: 'Marketplace Transaction Fee',
    description: 'Platform fee charged on all marketplace service bookings',
    feeType: 'percentage',
    percentageRate: 15,
    minFee: 5,
    maxFee: 500,
    isActive: true,
    appliesTo: ['Career Coaching', 'Resume Services', 'Interview Prep', 'Executive Coaching'],
    effectiveDate: '2024-01-01',
    lastModified: '2024-12-15',
  },
  {
    id: '2',
    category: 'marketplace',
    name: 'Provider Payout Processing',
    description: 'Fee for processing provider payouts via Stripe Connect',
    feeType: 'fixed',
    fixedAmount: 0.25,
    isActive: true,
    appliesTo: ['All Payouts'],
    effectiveDate: '2024-01-01',
    lastModified: '2024-11-20',
  },
  {
    id: '3',
    category: 'marketplace',
    name: 'Featured Provider Listing',
    description: 'Monthly fee for featured placement in marketplace',
    feeType: 'fixed',
    fixedAmount: 49,
    isActive: true,
    appliesTo: ['Featured Providers'],
    effectiveDate: '2024-06-01',
    lastModified: '2024-10-01',
  },
  {
    id: '4',
    category: 'events',
    name: 'Event Ticket Processing',
    description: 'Fee per ticket sold through the platform',
    feeType: 'tiered',
    tiers: [
      { minAmount: 0, maxAmount: 25, rate: 2.5 },
      { minAmount: 25.01, maxAmount: 100, rate: 3.5 },
      { minAmount: 100.01, maxAmount: 500, rate: 4.5 },
    ],
    minFee: 1,
    isActive: true,
    appliesTo: ['Career Fairs', 'Webinars', 'Workshops', 'Conferences'],
    effectiveDate: '2024-01-01',
    lastModified: '2024-08-15',
  },
  {
    id: '5',
    category: 'events',
    name: 'Event Organizer Platform Fee',
    description: 'Percentage of total event revenue',
    feeType: 'percentage',
    percentageRate: 5,
    minFee: 25,
    maxFee: 2500,
    isActive: true,
    appliesTo: ['All Events'],
    effectiveDate: '2024-01-01',
    lastModified: '2024-07-20',
  },
  {
    id: '6',
    category: 'events',
    name: 'Virtual Event Hosting',
    description: 'Fee for using platform virtual event infrastructure',
    feeType: 'fixed',
    fixedAmount: 99,
    isActive: true,
    appliesTo: ['Virtual Events', 'Hybrid Events'],
    effectiveDate: '2024-03-01',
    lastModified: '2024-09-10',
  },
  {
    id: '7',
    category: 'job_postings',
    name: 'Featured Job Listing',
    description: 'Premium placement fee for job postings',
    feeType: 'fixed',
    fixedAmount: 199,
    isActive: true,
    appliesTo: ['Featured Jobs'],
    effectiveDate: '2024-01-01',
    lastModified: '2024-11-01',
  },
  {
    id: '8',
    category: 'job_postings',
    name: 'Urgent Hiring Badge',
    description: 'Additional visibility for urgent positions',
    feeType: 'fixed',
    fixedAmount: 79,
    isActive: true,
    appliesTo: ['Urgent Listings'],
    effectiveDate: '2024-01-01',
    lastModified: '2024-10-15',
  },
  {
    id: '9',
    category: 'job_postings',
    name: 'Application Screening',
    description: 'AI-powered applicant screening per application',
    feeType: 'fixed',
    fixedAmount: 2.5,
    isActive: false,
    appliesTo: ['Premium Employers'],
    effectiveDate: '2025-02-01',
    lastModified: '2024-12-20',
  },
  {
    id: '10',
    category: 'subscriptions',
    name: 'Payment Processing Fee',
    description: 'Credit card processing for subscription payments',
    feeType: 'percentage',
    percentageRate: 2.9,
    fixedAmount: 0.30,
    isActive: true,
    appliesTo: ['All Subscription Plans'],
    effectiveDate: '2024-01-01',
    lastModified: '2024-01-01',
  },
  {
    id: '11',
    category: 'advertising',
    name: 'Sponsored Job Boost',
    description: 'Daily fee for sponsored job visibility',
    feeType: 'fixed',
    fixedAmount: 15,
    isActive: true,
    appliesTo: ['Sponsored Jobs'],
    effectiveDate: '2024-04-01',
    lastModified: '2024-10-01',
  },
  {
    id: '12',
    category: 'advertising',
    name: 'Newsletter Sponsorship',
    description: 'Fee for newsletter advertising placement',
    feeType: 'fixed',
    fixedAmount: 499,
    isActive: true,
    appliesTo: ['Weekly Newsletter', 'Monthly Digest'],
    effectiveDate: '2024-02-01',
    lastModified: '2024-09-15',
  },
];

// ===========================================
// SERVICE FEES TAB COMPONENT
// ===========================================

const ServiceFeesTab: React.FC<{ formatCurrency: (amount: number) => string }> = ({ formatCurrency }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<ServiceFee | null>(null);
  const [showNewFeeModal, setShowNewFeeModal] = useState(false);

  const filteredFees = selectedCategory === 'all'
    ? SAMPLE_SERVICE_FEES
    : SAMPLE_SERVICE_FEES.filter(fee => fee.category === selectedCategory);

  const getCategoryInfo = (categoryId: string) => {
    return SERVICE_FEE_CATEGORIES.find(c => c.id === categoryId);
  };

  const formatFeeDisplay = (fee: ServiceFee) => {
    if (fee.feeType === 'percentage') {
      let display = `${fee.percentageRate}%`;
      if (fee.fixedAmount) display += ` + ${formatCurrency(fee.fixedAmount)}`;
      return display;
    } else if (fee.feeType === 'fixed') {
      return formatCurrency(fee.fixedAmount || 0);
    } else if (fee.feeType === 'tiered') {
      return 'Tiered rates';
    }
    return '-';
  };

  // Calculate total fees collected (sample data)
  const totalFeesCollected = {
    marketplace: 48320,
    events: 12450,
    job_postings: 8920,
    subscriptions: 6840,
    advertising: 5280,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {SERVICE_FEE_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const collected = totalFeesCollected[category.id as keyof typeof totalFeesCollected] || 0;
          const feeCount = SAMPLE_SERVICE_FEES.filter(f => f.category === category.id).length;
          const activeFees = SAMPLE_SERVICE_FEES.filter(f => f.category === category.id && f.isActive).length;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
              className={`bg-slate-900 border rounded-xl p-4 text-left transition-all ${
                selectedCategory === category.id
                  ? `border-${category.color}-500/50 bg-${category.color}-500/10`
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded bg-${category.color}-500/20`}>
                  <Icon size={16} className={`text-${category.color}-400`} />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(collected)}</p>
              <p className="text-xs text-slate-400">{activeFees}/{feeCount} fees active</p>
            </button>
          );
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {SERVICE_FEE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
              Active Only
            </button>
            <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
              Inactive
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowNewFeeModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add Service Fee
        </button>
      </div>

      {/* Fee Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFees.map((fee) => {
          const category = getCategoryInfo(fee.category);
          const Icon = category?.icon || DollarSign;

          return (
            <div
              key={fee.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-all ${
                fee.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg bg-${category?.color}-500/20`}>
                    <Icon size={20} className={`text-${category?.color}-400`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{fee.name}</h4>
                      {!fee.isActive && (
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">{fee.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedFee(fee); setShowEditModal(true); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Edit size={16} className="text-slate-400" />
                </button>
              </div>

              {/* Fee Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Fee Rate</p>
                  <p className="text-lg font-bold text-emerald-400">{formatFeeDisplay(fee)}</p>
                  <p className="text-xs text-slate-500 capitalize">{fee.feeType} fee</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Fee Limits</p>
                  <p className="text-sm font-medium">
                    {fee.minFee ? `Min: ${formatCurrency(fee.minFee)}` : 'No minimum'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {fee.maxFee ? `Max: ${formatCurrency(fee.maxFee)}` : 'No maximum'}
                  </p>
                </div>
              </div>

              {/* Tiered Rates (if applicable) */}
              {fee.feeType === 'tiered' && fee.tiers && (
                <div className="mb-4 p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2">Tiered Rates</p>
                  <div className="space-y-1">
                    {fee.tiers.map((tier, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          {formatCurrency(tier.minAmount)} - {tier.maxAmount === 500 ? formatCurrency(tier.maxAmount) + '+' : formatCurrency(tier.maxAmount)}
                        </span>
                        <span className="font-medium text-emerald-400">{tier.rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applies To */}
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">Applies To</p>
                <div className="flex flex-wrap gap-1.5">
                  {fee.appliesTo.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-500">
                  Effective: {new Date(fee.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-xs text-slate-500">
                  Modified: {new Date(fee.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fee Collection Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Fee Collection Summary (MTD)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Transactions</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Gross Volume</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Fees Collected</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Effective Rate</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { category: 'Marketplace', transactions: 842, volume: 322133, fees: 48320, trend: '+18%' },
                { category: 'Events', transactions: 1247, volume: 249400, fees: 12450, trend: '+34%' },
                { category: 'Job Postings', transactions: 156, volume: 31120, fees: 8920, trend: '+12%' },
                { category: 'Subscriptions', transactions: 89, volume: 235890, fees: 6840, trend: '+5%' },
                { category: 'Advertising', transactions: 34, volume: 26400, fees: 5280, trend: '+8%' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4 font-medium">{row.category}</td>
                  <td className="px-4 py-4 text-right text-sm">{row.transactions.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-sm">{formatCurrency(row.volume)}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-emerald-400">{formatCurrency(row.fees)}</td>
                  <td className="px-4 py-4 text-right text-sm">{((row.fees / row.volume) * 100).toFixed(2)}%</td>
                  <td className="px-4 py-4 text-center">
                    <span className="flex items-center justify-center gap-1 text-sm text-emerald-400">
                      <ArrowUpRight size={14} />
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-800/30">
              <tr>
                <td className="px-4 py-3 font-semibold">Total</td>
                <td className="px-4 py-3 text-right font-semibold">2,368</td>
                <td className="px-4 py-3 text-right font-semibold">{formatCurrency(864943)}</td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-400">{formatCurrency(81810)}</td>
                <td className="px-4 py-3 text-right font-semibold">9.46%</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-emerald-400">+15%</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Edit Fee Modal */}
      {showEditModal && selectedFee && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Edit Service Fee</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Fee Name</label>
                  <input
                    type="text"
                    defaultValue={selectedFee.name}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                  <select
                    defaultValue={selectedFee.category}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {SERVICE_FEE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                <textarea
                  defaultValue={selectedFee.description}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Fee Type</label>
                  <select
                    defaultValue={selectedFee.feeType}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="tiered">Tiered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    {selectedFee.feeType === 'percentage' ? 'Percentage Rate (%)' : 'Fixed Amount ($)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={selectedFee.feeType === 'percentage' ? selectedFee.percentageRate : selectedFee.fixedAmount}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Per-Transaction Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={selectedFee.feeType === 'percentage' ? selectedFee.fixedAmount || '' : ''}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Minimum Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={selectedFee.minFee || ''}
                    placeholder="No minimum"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Maximum Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={selectedFee.maxFee || ''}
                    placeholder="No maximum"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Effective Date</label>
                <input
                  type="date"
                  defaultValue={selectedFee.effectiveDate}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={selectedFee.isActive}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500"
                  />
                  <span className="text-sm">Fee is active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Fee Modal */}
      {showNewFeeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Service Fee</h3>
              <button onClick={() => setShowNewFeeModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Fee Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Premium Listing Fee"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Category *</label>
                  <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                    <option value="">Select category...</option>
                    {SERVICE_FEE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                <textarea
                  placeholder="Describe what this fee applies to..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Fee Type *</label>
                  <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="tiered">Tiered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Percentage Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Fixed Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Minimum Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="No minimum"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Maximum Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="No maximum"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Applies To</label>
                <input
                  type="text"
                  placeholder="e.g., Career Coaching, Resume Services (comma separated)"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Effective Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500"
                  />
                  <span className="text-sm">Activate immediately</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewFeeModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Plus size={18} />
                  Create Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const BillingTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [, setShowInvoiceModal] = useState(false);

  // Calculate totals
  const totalRevenue = REVENUE_STREAMS.reduce((sum, stream) => sum + stream.amount, 0);
  const totalExpenses = EXPENSE_CATEGORIES.reduce((sum, cat) => sum + cat.actual, 0);
  const totalBudget = EXPENSE_CATEGORIES.reduce((sum, cat) => sum + cat.budget, 0);
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = ((netIncome / totalRevenue) * 100).toFixed(1);

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'service_fees', label: 'Service Fees', icon: Percent },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'grants', label: 'Grants & Funding', icon: Landmark },
    { id: 'taxes', label: 'Taxes', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: Download },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-400';
      case 'approved': return 'bg-emerald-500/20 text-emerald-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'sent': return 'bg-blue-500/20 text-blue-400';
      case 'overdue': return 'bg-red-500/20 text-red-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'partial': return 'bg-violet-500/20 text-violet-400';
      case 'draft': return 'bg-slate-500/20 text-slate-400';
      case 'active': return 'bg-emerald-500/20 text-emerald-400';
      case 'closed': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSubTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-emerald-500/20">
                  <DollarSign size={22} className="text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-400">
                  <ArrowUpRight size={16} />
                  +18.5%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-slate-400 mt-1">Total Revenue (MTD)</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-blue-500/20">
                  <TrendingUp size={22} className="text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-400">
                  <ArrowUpRight size={16} />
                  +12.3%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{formatCurrency(89500)}</p>
                <p className="text-sm text-slate-400 mt-1">Monthly Recurring Revenue</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-amber-500/20">
                  <Receipt size={22} className="text-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-red-400">
                  <ArrowUpRight size={16} />
                  +5.2%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                <p className="text-sm text-slate-400 mt-1">Total Expenses (MTD)</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-violet-500/20">
                  <Wallet size={22} className="text-violet-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-400">
                  <ArrowUpRight size={16} />
                  +28.4%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{formatCurrency(netIncome)}</p>
                <p className="text-sm text-slate-400 mt-1">Net Income ({profitMargin}% margin)</p>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Users size={16} />
                <span className="text-xs">Active Subs</span>
              </div>
              <p className="text-xl font-bold">342</p>
              <p className="text-xs text-emerald-400">+28 this month</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <UserCheck size={16} />
                <span className="text-xs">ARPU</span>
              </div>
              <p className="text-xl font-bold">$261</p>
              <p className="text-xs text-emerald-400">+$12 vs last</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <UserMinus size={16} />
                <span className="text-xs">Churn Rate</span>
              </div>
              <p className="text-xl font-bold">2.3%</p>
              <p className="text-xs text-emerald-400">-0.4% vs last</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Heart size={16} />
                <span className="text-xs">Customer LTV</span>
              </div>
              <p className="text-xl font-bold">$2,840</p>
              <p className="text-xs text-emerald-400">+$320</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <FileWarning size={16} />
                <span className="text-xs">Outstanding AR</span>
              </div>
              <p className="text-xl font-bold">$24.6K</p>
              <p className="text-xs text-amber-400">8 overdue</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Hourglass size={16} />
                <span className="text-xs">Cash Runway</span>
              </div>
              <p className="text-xl font-bold">18 mo</p>
              <p className="text-xs text-emerald-400">Healthy</p>
            </div>
          </div>

          {/* Revenue by Source & Expense by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold mb-4">Revenue by Source</h3>
              <div className="space-y-3">
                {REVENUE_STREAMS.map((stream) => {
                  const percent = ((stream.amount / totalRevenue) * 100).toFixed(1);
                  return (
                    <div key={stream.id} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded bg-${stream.color}-500/20`}>
                            <stream.icon size={14} className={`text-${stream.color}-400`} />
                          </div>
                          <span className="text-sm">{stream.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{formatCurrency(stream.amount)}</span>
                          <span className="text-xs text-slate-500 ml-2">({percent}%)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${stream.color}-500 rounded-full transition-all group-hover:opacity-80`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold mb-4">Expenses by Category</h3>
              <div className="space-y-3">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const percent = ((cat.actual / totalExpenses) * 100).toFixed(1);
                  const budgetUsed = ((cat.actual / cat.budget) * 100).toFixed(0);
                  return (
                    <div key={cat.id} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded bg-${cat.color}-500/20`}>
                            <cat.icon size={14} className={`text-${cat.color}-400`} />
                          </div>
                          <span className="text-sm">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{formatCurrency(cat.actual)}</span>
                          <span className={`text-xs ml-2 ${Number(budgetUsed) > 90 ? 'text-red-400' : 'text-slate-500'}`}>
                            ({budgetUsed}% of budget)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${cat.color}-500 rounded-full transition-all group-hover:opacity-80`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Transactions</h3>
                <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  { type: 'income', desc: 'Subscription - Lockheed Martin', amount: 2999, date: 'Today' },
                  { type: 'expense', desc: 'AWS Monthly Hosting', amount: -4200, date: 'Today' },
                  { type: 'income', desc: 'Event Ticket Sales (12)', amount: 1440, date: 'Yesterday' },
                  { type: 'income', desc: 'Subscription - NVIDIA', amount: 2999, date: 'Yesterday' },
                  { type: 'expense', desc: 'LinkedIn Ads Campaign', amount: -2500, date: '2 days ago' },
                ].map((txn, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${txn.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {txn.type === 'income' ? (
                          <ArrowUpRight size={16} className="text-emerald-400" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txn.desc}</p>
                        <p className="text-xs text-slate-500">{txn.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${txn.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Alerts */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Financial Alerts</h3>
                <Bell size={18} className="text-slate-400" />
              </div>
              <div className="space-y-3">
                {[
                  { type: 'warning', title: '8 invoices overdue', desc: 'Total: $24,680 outstanding', action: 'Send Reminders' },
                  { type: 'info', title: 'Grant report due in 45 days', desc: 'DOL-WDQI-2024-018 Q1 Report', action: 'View Grant' },
                  { type: 'success', title: 'MRR grew 12.3% this month', desc: '28 new subscriptions added', action: 'View Details' },
                  { type: 'warning', title: 'Marketing budget at 85%', desc: '$2,800 remaining this month', action: 'Adjust Budget' },
                  { type: 'info', title: 'Tax filing deadline: Jan 31', desc: 'Q4 2024 sales tax due', action: 'View Taxes' },
                ].map((alert, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                    alert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                    alert.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                    'bg-blue-500/10 border border-blue-500/20'
                  }`}>
                    <div className={`p-1.5 rounded ${
                      alert.type === 'warning' ? 'bg-amber-500/20' :
                      alert.type === 'success' ? 'bg-emerald-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {alert.type === 'warning' ? <AlertTriangle size={14} className="text-amber-400" /> :
                       alert.type === 'success' ? <CheckCircle2 size={14} className="text-emerald-400" /> :
                       <Bell size={14} className="text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-slate-400">{alert.desc}</p>
                    </div>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 whitespace-nowrap">
                      {alert.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeSubTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REVENUE_STREAMS.map((stream) => (
              <div key={stream.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg bg-${stream.color}-500/20`}>
                      <stream.icon size={20} className={`text-${stream.color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{stream.name}</h4>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(stream.amount)}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stream.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stream.changePercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {stream.changePercent >= 0 ? '+' : ''}{stream.changePercent}%
                  </div>
                </div>
                {stream.breakdown && (
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    {stream.breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-400">{item.label}</span>
                        <span>{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Revenue by Stakeholder Type */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold mb-4">Revenue by Stakeholder Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { type: 'Employers', icon: Building2, amount: 124500, count: 89, color: 'blue' },
                { type: 'Education Providers', icon: GraduationCap, amount: 32800, count: 34, color: 'purple' },
                { type: 'Job Seekers', icon: Users, amount: 18400, count: 184, color: 'emerald' },
                { type: 'Government/Labs', icon: Landmark, amount: 110170, count: 12, color: 'amber' },
              ].map((stakeholder, i) => (
                <div key={i} className={`p-4 rounded-xl bg-${stakeholder.color}-500/10 border border-${stakeholder.color}-500/20`}>
                  <div className="flex items-center gap-2 mb-2">
                    <stakeholder.icon size={18} className={`text-${stakeholder.color}-400`} />
                    <span className="text-sm font-medium">{stakeholder.type}</span>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(stakeholder.amount)}</p>
                  <p className="text-xs text-slate-400 mt-1">{stakeholder.count} customers</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-6">
          {/* Expense Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Total Expenses</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-emerald-400 mt-1">
                {formatCurrency(totalBudget - totalExpenses)} under budget
              </p>
            </div>
            <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5">
              <p className="text-sm text-slate-400">Pending Approval</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(4300)}</p>
              <p className="text-sm text-amber-400 mt-1">3 expenses waiting</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Recurring Monthly</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(52400)}</p>
              <p className="text-sm text-slate-400 mt-1">12 recurring items</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Budget Remaining</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalBudget - totalExpenses)}</p>
              <p className="text-sm text-slate-400 mt-1">{(((totalBudget - totalExpenses) / totalBudget) * 100).toFixed(1)}% remaining</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64"
                />
              </div>
              <select className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm">
                <option value="all">All Categories</option>
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
                <Upload size={18} />
                Import
              </button>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm"
              >
                <Plus size={18} />
                Add Expense
              </button>
            </div>
          </div>

          {/* Expense Categories with Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {EXPENSE_CATEGORIES.map((cat) => {
              const budgetPercent = ((cat.actual / cat.budget) * 100);
              const isOverBudget = budgetPercent > 100;
              const isWarning = budgetPercent > 80 && budgetPercent <= 100;

              return (
                <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg bg-${cat.color}-500/20`}>
                        <cat.icon size={20} className={`text-${cat.color}-400`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{cat.name}</h4>
                        <p className="text-xs text-slate-400">Budget: {formatCurrency(cat.budget)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(cat.actual)}</p>
                      <p className={`text-xs ${isOverBudget ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {budgetPercent.toFixed(0)}% used
                      </p>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full ${
                        isOverBudget ? 'bg-red-500' : isWarning ? 'bg-amber-500' : `bg-${cat.color}-500`
                      }`}
                      style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                    />
                  </div>

                  {/* Subcategories */}
                  {cat.subcategories && (
                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      {cat.subcategories.map((sub, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-400">{sub.name}</span>
                          <span>{formatCurrency(sub.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recent Expenses Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold">Recent Expenses</h3>
            </div>
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Expense</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {SAMPLE_EXPENSES.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{expense.title}</p>
                        {expense.recurring && (
                          <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Recurring</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{expense.number}</p>
                    </td>
                    <td className="px-4 py-4 text-sm">{expense.vendor}</td>
                    <td className="px-4 py-4 text-sm capitalize">{expense.category.replace('_', ' ')}</td>
                    <td className="px-4 py-4 text-sm font-medium">{formatCurrency(expense.amount)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">{formatDate(expense.date)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                          <Eye size={16} />
                        </button>
                        {expense.status === 'pending' && (
                          <>
                            <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400">
                              <CheckCircle2 size={16} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-6">
          {/* Invoice Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-400">Total Invoiced</p>
              <p className="text-2xl font-bold mt-1">$186.4K</p>
              <p className="text-xs text-slate-500 mt-1">342 invoices</p>
            </div>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-sm text-slate-400">Paid</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">$156.8K</p>
              <p className="text-xs text-slate-500 mt-1">298 invoices</p>
            </div>
            <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4">
              <p className="text-sm text-slate-400">Pending</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">$18.4K</p>
              <p className="text-xs text-slate-500 mt-1">32 invoices</p>
            </div>
            <div className="bg-slate-900 border border-red-500/30 rounded-xl p-4">
              <p className="text-sm text-slate-400">Overdue</p>
              <p className="text-2xl font-bold text-red-400 mt-1">$8.2K</p>
              <p className="text-xs text-slate-500 mt-1">8 invoices</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <p className="text-sm text-slate-400">Draft</p>
              <p className="text-2xl font-bold text-slate-400 mt-1">$3.0K</p>
              <p className="text-xs text-slate-500 mt-1">4 invoices</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64"
                />
              </div>
              <select className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm">
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm">
                <Send size={18} />
                Send Reminders
              </button>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm"
              >
                <Plus size={18} />
                Create Invoice
              </button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {SAMPLE_INVOICES.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-blue-400">{invoice.number}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{invoice.customer}</p>
                      <p className="text-xs text-slate-500 capitalize">{invoice.customerType}</p>
                    </td>
                    <td className="px-4 py-4 text-sm">{invoice.source}</td>
                    <td className="px-4 py-4 text-sm font-medium">{formatCurrency(invoice.amount)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">{formatDate(invoice.dueDate)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                          <Download size={16} />
                        </button>
                        {invoice.status === 'draft' && (
                          <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-blue-400">
                            <Send size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Fees Tab */}
      {activeSubTab === 'service_fees' && (
        <ServiceFeesTab formatCurrency={formatCurrency} />
      )}

      {/* Budgets Tab */}
      {activeSubTab === 'budgets' && (
        <div className="space-y-6">
          {/* Budget Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Annual Budget (FY 2025)</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalBudget * 12)}</p>
              <p className="text-sm text-slate-400 mt-2">Monthly: {formatCurrency(totalBudget)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">YTD Spent</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Budget utilization</span>
                  <span className="text-emerald-400">{((totalExpenses / totalBudget) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(totalExpenses / totalBudget) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Budget Health</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">6</p>
                  <p className="text-xs text-slate-500">On Track</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">1</p>
                  <p className="text-xs text-slate-500">Warning</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">1</p>
                  <p className="text-xs text-slate-500">Exceeded</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Budget</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actual</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Committed</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Remaining</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Progress</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const remaining = cat.budget - cat.actual - cat.committed;
                  const usedPercent = ((cat.actual / cat.budget) * 100);
                  const status = usedPercent > 100 ? 'exceeded' : usedPercent > 80 ? 'warning' : 'on_track';

                  return (
                    <tr key={cat.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${cat.color}-500/20`}>
                            <cat.icon size={16} className={`text-${cat.color}-400`} />
                          </div>
                          <span className="font-medium">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm">{formatCurrency(cat.budget)}</td>
                      <td className="px-4 py-4 text-right text-sm">{formatCurrency(cat.actual)}</td>
                      <td className="px-4 py-4 text-right text-sm text-slate-400">{formatCurrency(cat.committed)}</td>
                      <td className="px-4 py-4 text-right text-sm">
                        <span className={remaining < 0 ? 'text-red-400' : 'text-emerald-400'}>
                          {formatCurrency(remaining)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-24 mx-auto">
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                status === 'exceeded' ? 'bg-red-500' :
                                status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(usedPercent, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-center text-slate-400 mt-1">{usedPercent.toFixed(0)}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          status === 'exceeded' ? 'bg-red-500/20 text-red-400' :
                          status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {status === 'exceeded' ? 'Exceeded' : status === 'warning' ? 'Warning' : 'On Track'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-800/30">
                <tr>
                  <td className="px-4 py-3 font-semibold">Total</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(totalBudget)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(totalExpenses)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-400">
                    {formatCurrency(EXPENSE_CATEGORIES.reduce((sum, cat) => sum + cat.committed, 0))}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                    {formatCurrency(totalBudget - totalExpenses - EXPENSE_CATEGORIES.reduce((sum, cat) => sum + cat.committed, 0))}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Grants Tab */}
      {activeSubTab === 'grants' && (
        <div className="space-y-6">
          {/* Grant Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Active Grants</p>
              <p className="text-2xl font-bold mt-1">{SAMPLE_GRANTS.filter(g => g.status === 'active').length}</p>
              <p className="text-sm text-slate-400 mt-1">
                {formatCurrency(SAMPLE_GRANTS.filter(g => g.status === 'active').reduce((sum, g) => sum + g.totalAmount, 0))} total value
              </p>
            </div>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5">
              <p className="text-sm text-slate-400">Funds Remaining</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {formatCurrency(SAMPLE_GRANTS.reduce((sum, g) => sum + g.remaining, 0))}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {((SAMPLE_GRANTS.reduce((sum, g) => sum + g.remaining, 0) / SAMPLE_GRANTS.reduce((sum, g) => sum + g.totalAmount, 0)) * 100).toFixed(1)}% available
              </p>
            </div>
            <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5">
              <p className="text-sm text-slate-400">Reports Due</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">2</p>
              <p className="text-sm text-amber-400 mt-1">Next: Feb 28, 2025</p>
            </div>
            <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-5">
              <p className="text-sm text-slate-400">Pending Awards</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">1</p>
              <p className="text-sm text-slate-400 mt-1">{formatCurrency(750000)} pending</p>
            </div>
          </div>

          {/* Grant Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SAMPLE_GRANTS.map((grant) => {
              const spentPercent = ((grant.spent / grant.totalAmount) * 100);
              const daysUntilEnd = Math.ceil((new Date(grant.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={grant.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(grant.status)}`}>
                          {grant.status}
                        </span>
                        <span className="text-xs text-slate-500">{grant.grantNumber}</span>
                      </div>
                      <h4 className="font-semibold">{grant.title}</h4>
                      <p className="text-sm text-slate-400">{grant.funder}</p>
                    </div>
                    <Landmark size={24} className="text-purple-400" />
                  </div>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Funds Used</span>
                      <span>{formatCurrency(grant.spent)} / {formatCurrency(grant.totalAmount)}</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${spentPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{spentPercent.toFixed(1)}% spent</span>
                      <span>{formatCurrency(grant.remaining)} remaining</span>
                    </div>
                  </div>

                  {/* Grant Details */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <p className="text-xs text-slate-500">Period</p>
                      <p className="text-sm">{formatDate(grant.startDate)} - {formatDate(grant.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Time Remaining</p>
                      <p className="text-sm">{daysUntilEnd} days</p>
                    </div>
                    {grant.nextReportDue && (
                      <>
                        <div className="col-span-2">
                          <p className="text-xs text-slate-500">Next Report Due</p>
                          <p className="text-sm text-amber-400">{formatDate(grant.nextReportDue)}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                    <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors">
                      Add Expense
                    </button>
                    {grant.nextReportDue && (
                      <button className="py-2 px-4 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
                        Submit Report
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Taxes Tab */}
      {activeSubTab === 'taxes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Tax Collected (Q4 2024)</p>
              <p className="text-2xl font-bold mt-1">$4,280</p>
              <p className="text-sm text-slate-400 mt-1">Due: Jan 31, 2025</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Tax Collected (YTD)</p>
              <p className="text-2xl font-bold mt-1">$320</p>
              <p className="text-sm text-slate-400 mt-1">January 2025</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Jurisdictions</p>
              <p className="text-2xl font-bold mt-1">12</p>
              <p className="text-sm text-slate-400 mt-1">Active tax nexus</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Tax Exempt Sales</p>
              <p className="text-2xl font-bold mt-1">$125K</p>
              <p className="text-sm text-slate-400 mt-1">Government/Education</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold mb-4">Tax Collection by Jurisdiction</h3>
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Jurisdiction</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Rate</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Taxable Sales</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Tax Collected</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { jurisdiction: 'California', rate: 7.25, taxable: 28400, collected: 2059, status: 'filed' },
                  { jurisdiction: 'Texas', rate: 6.25, taxable: 18200, collected: 1138, status: 'pending' },
                  { jurisdiction: 'New York', rate: 8.00, taxable: 12800, collected: 1024, status: 'pending' },
                  { jurisdiction: 'Arizona', rate: 5.60, taxable: 8400, collected: 470, status: 'pending' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 font-medium">{row.jurisdiction}</td>
                    <td className="px-4 py-4 text-right text-sm">{row.rate}%</td>
                    <td className="px-4 py-4 text-right text-sm">{formatCurrency(row.taxable)}</td>
                    <td className="px-4 py-4 text-right text-sm font-medium">{formatCurrency(row.collected)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.status === 'filed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Profit & Loss Statement', desc: 'Income, expenses, and net profit by period', icon: TrendingUp, color: 'emerald' },
              { title: 'Revenue by Source', desc: 'Detailed breakdown of all revenue streams', icon: PieChart, color: 'blue' },
              { title: 'Expense Report', desc: 'Categorized expense analysis', icon: Receipt, color: 'amber' },
              { title: 'AR Aging Report', desc: 'Outstanding invoices by age bucket', icon: FileWarning, color: 'red' },
              { title: 'Subscription Metrics', desc: 'MRR, ARR, churn, and growth metrics', icon: CreditCard, color: 'violet' },
              { title: 'Grant Expenditure Report', desc: 'Spending against grant budgets', icon: Landmark, color: 'purple' },
              { title: 'Tax Summary', desc: 'Tax collected by jurisdiction', icon: Calculator, color: 'cyan' },
              { title: 'Cash Flow Statement', desc: 'Cash inflows and outflows', icon: Wallet, color: 'emerald' },
              { title: 'Budget vs Actual', desc: 'Budget utilization analysis', icon: Target, color: 'orange' },
            ].map((report, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${report.color}-500/20`}>
                    <report.icon size={24} className={`text-${report.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{report.desc}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                        <Download size={14} />
                        PDF
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                        <Download size={14} />
                        Excel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scheduled Reports */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Scheduled Reports</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                <Plus size={16} />
                Schedule Report
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Weekly Revenue Summary', frequency: 'Weekly', recipients: 'finance@stemworkforce.gov', nextRun: 'Jan 20, 2025' },
                { name: 'Monthly P&L Statement', frequency: 'Monthly', recipients: 'cfo@stemworkforce.gov', nextRun: 'Feb 1, 2025' },
                { name: 'Quarterly Grant Report', frequency: 'Quarterly', recipients: 'grants@stemworkforce.gov', nextRun: 'Mar 31, 2025' },
              ].map((schedule, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Calendar size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-xs text-slate-400">{schedule.frequency} | {schedule.recipients}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-slate-400">Next: {schedule.nextRun}</p>
                    <button className="p-2 hover:bg-slate-700 rounded-lg">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Expense title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                  <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Vendor</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Vendor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Amount</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Payment Method</label>
                  <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                    <option>Check</option>
                    <option>ACH</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 h-20 resize-none"
                  placeholder="Additional details..."
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500" />
                  <span className="text-sm">Recurring expense</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500" />
                  <span className="text-sm">Charge to grant</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors">
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
