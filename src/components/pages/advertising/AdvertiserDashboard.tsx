// ===========================================
// Advertiser Self-Serve Dashboard
// For employers, federal agencies, industry partners, and other advertisers
// ===========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Megaphone, CreditCard, BarChart3,
  Plus, LogOut, ChevronRight, DollarSign, Eye, MousePointer,
  TrendingUp, Wallet, Play, Pause, Pencil, FileText,
  MapPin, Users, Target, CheckSquare, Square, X,
  AlertCircle, RefreshCw, Zap,
  Building2, Shield,
  ChevronDown, Info, Download,
  Calendar, Search, Menu
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// ===========================================
// TYPESCRIPT INTERFACES
// ===========================================

type TabKey = 'overview' | 'campaigns' | 'credits' | 'reports';

interface Advertiser {
  id: string;
  organization_id: string;
  org_name: string;
  contact_name: string;
  contact_email: string;
  advertiser_type: string;
  created_at: string;
}

type CampaignStatus = 'active' | 'paused' | 'ended' | 'pending_review' | 'draft';
type CampaignCategory =
  | 'sponsored_job'
  | 'geo_banner'
  | 'featured_employer'
  | 'opportunities_card'
  | 'email_campaign';

interface Campaign {
  id: string;
  advertiser_id: string;
  name: string;
  status: CampaignStatus;
  category: CampaignCategory;
  geo_zone_id: string | null;
  geo_zone_name: string | null;
  audience_segment_id: string | null;
  audience_segment_name: string | null;
  daily_budget_cents: number;
  total_budget_cents: number | null;
  spent_cents: number;
  spent_today_cents: number;
  impressions: number;
  clicks: number;
  start_date: string;
  end_date: string | null;
  ad_disclosure_text: string;
  cpm_rate_cents: number;
  created_at: string;
}

interface CreditLedgerEntry {
  id: string;
  advertiser_id: string;
  transaction_type: 'credit_purchase' | 'campaign_debit' | 'refund' | 'bonus_credit';
  description: string;
  amount_cents: number;
  balance_after_cents: number;
  created_at: string;
}

interface CampaignDailyStats {
  id: string;
  campaign_id: string;
  campaign_name: string;
  stat_date: string;
  impressions: number;
  unique_users: number;
  clicks: number;
  spend_cents: number;
  conversions: number;
  state: string | null;
}

interface CreditPackage {
  id: string;
  name: string;
  price_cents: number;
  credits: number;
  bonus_percent: number;
  is_enterprise: boolean;
  badge?: string;
}

// ===========================================
// CONSTANTS
// ===========================================

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { key: 'credits', label: 'Credits', icon: CreditCard },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
];

const GEO_ZONES = [
  { id: 'national', name: 'National', cpm: 1800 },
  { id: 'dc-metro', name: 'DC Metro', cpm: 2800 },
  { id: 'orlando-metro', name: 'Orlando Metro', cpm: 2800 },
  { id: 'bay-area', name: 'San Francisco Bay Area', cpm: 2800 },
  { id: 'nyc-metro', name: 'NYC Metro', cpm: 2800 },
  { id: 'boston-metro', name: 'Boston Metro', cpm: 2800 },
  { id: 'texas', name: 'Texas (State)', cpm: 2200 },
  { id: 'virginia', name: 'Virginia (State)', cpm: 2200 },
  { id: 'california', name: 'California (State)', cpm: 2200 },
  { id: 'custom', name: 'Custom Zone (Zip + Radius)', cpm: 3800 },
];

const CAMPAIGN_CATEGORIES: { value: CampaignCategory; label: string; icon: React.ElementType }[] = [
  { value: 'sponsored_job', label: 'Sponsored Job Listing', icon: Briefcase2 },
  { value: 'geo_banner', label: 'Geo-Targeted Banner', icon: MapPin },
  { value: 'featured_employer', label: 'Featured Employer Card', icon: Building2 },
  { value: 'opportunities_card', label: 'Opportunities Near You Card', icon: Target },
  { value: 'email_campaign', label: 'Email Campaign', icon: FileText },
];

const AUDIENCE_ROLES = [
  'Job Seekers', 'College Students', 'High School Students',
  'Employers', 'Federal Partners', 'Industry Partners', 'Researchers',
];
const CLEARANCE_LEVELS = ['Any', 'Public Trust', 'Secret', 'Top Secret', 'TS/SCI'];
const INDUSTRIES = [
  'Semiconductor', 'Nuclear', 'AI/ML', 'Quantum', 'Cybersecurity',
  'Aerospace', 'Defense', 'Biotech', 'Clean Energy',
];
const EDUCATION_LEVELS = ['Any', 'High School', 'College', 'Graduate'];

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'starter', name: 'Starter', price_cents: 25000, credits: 250, bonus_percent: 0, is_enterprise: false },
  { id: 'standard', name: 'Standard', price_cents: 50000, credits: 500, bonus_percent: 0, is_enterprise: false },
  { id: 'pro', name: 'Pro', price_cents: 100000, credits: 1000, bonus_percent: 0, is_enterprise: false },
  { id: 'growth', name: 'Growth', price_cents: 250000, credits: 2750, bonus_percent: 10, is_enterprise: false, badge: 'Best Value' },
  { id: 'scale', name: 'Scale', price_cents: 500000, credits: 5750, bonus_percent: 15, is_enterprise: false },
  { id: 'enterprise', name: 'Enterprise', price_cents: 1000000, credits: 12000, bonus_percent: 20, is_enterprise: true },
];

// Placeholder icon
function Briefcase2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

// ===========================================
// UTILITY HELPERS
// ===========================================

const fmtCents = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtNum = (n: number) => n.toLocaleString('en-US');

const ctr = (clicks: number, impressions: number) =>
  impressions === 0 ? '0.00%' : `${((clicks / impressions) * 100).toFixed(2)}%`;

const statusBadge = (status: CampaignStatus) => {
  const map: Record<CampaignStatus, string> = {
    active: 'bg-emerald-500/20 text-emerald-400',
    paused: 'bg-amber-500/20 text-amber-400',
    ended: 'bg-gray-500/20 text-gray-400',
    pending_review: 'bg-blue-500/20 text-blue-400',
    draft: 'bg-slate-500/20 text-slate-400',
  };
  const labels: Record<CampaignStatus, string> = {
    active: 'Active', paused: 'Paused', ended: 'Ended',
    pending_review: 'Pending Review', draft: 'Draft',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {labels[status]}
    </span>
  );
};

const categoryLabel = (cat: CampaignCategory) => {
  const map: Record<CampaignCategory, string> = {
    sponsored_job: 'Sponsored Job',
    geo_banner: 'Geo Banner',
    featured_employer: 'Featured Employer',
    opportunities_card: 'Opportunities Card',
    email_campaign: 'Email Campaign',
  };
  return map[cat] ?? cat;
};

// Estimated reach based on selections (mock)
const estimateReach = (roles: string[], clearances: string[], industries: string[]) => {
  let base = 12000;
  if (roles.length > 0) base = Math.round(base * (roles.length / AUDIENCE_ROLES.length + 0.3));
  if (!clearances.includes('Any') && clearances.length > 0) base = Math.round(base * 0.35);
  if (industries.length > 0 && industries.length < INDUSTRIES.length) base = Math.round(base * (industries.length / INDUSTRIES.length + 0.25));
  return Math.max(150, Math.min(base, 48000));
};

// CPM based on geo zone + clearance targeting
const getCpm = (geoZoneId: string, clearances: string[]) => {
  const zone = GEO_ZONES.find(z => z.id === geoZoneId);
  let cpm = zone?.cpm ?? 1800;
  const hasAdvancedClearance = clearances.some(c => ['Top Secret', 'TS/SCI'].includes(c));
  if (hasAdvancedClearance) cpm = Math.max(cpm, 5500);
  return cpm;
};

// ===========================================
// LOADING SKELETON
// ===========================================

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

// ===========================================
// TOAST
// ===========================================

interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-gray-800 border border-white/10 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm">
      <Info className="w-4 h-4 text-blue-400 shrink-0" />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ===========================================
// MULTI-CHECKBOX
// ===========================================

interface MultiCheckboxProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
}
const MultiCheckbox: React.FC<MultiCheckboxProps> = ({ label, options, selected, onChange }) => {
  const toggle = (val: string) => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                active
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {active ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===========================================
// AD PREVIEW CARD
// ===========================================

interface AdPreviewProps {
  headline: string;
  body: string;
  cta: string;
  imageUrl: string;
  disclosure: string;
}
const AdPreviewCard: React.FC<AdPreviewProps> = ({ headline, body, cta, imageUrl, disclosure }) => (
  <div className="bg-[#0d1226] border border-white/10 rounded-xl overflow-hidden max-w-sm">
    {imageUrl && (
      <div className="h-32 bg-white/5 flex items-center justify-center overflow-hidden">
        <img src={imageUrl} alt="Ad creative" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
    )}
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{disclosure || 'Sponsored'}</span>
      </div>
      <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
        {headline || 'Your headline here'}
      </h4>
      <p className="text-gray-400 text-xs mb-3 line-clamp-3">
        {body || 'Your ad copy will appear here. Make it compelling!'}
      </p>
      <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors">
        {cta || 'Learn More'}
      </button>
    </div>
  </div>
);

// ===========================================
// CAMPAIGN CREATION MODAL
// ===========================================

interface WizardState {
  // Step 1
  name: string;
  category: CampaignCategory;
  disclosure: string;
  // Step 2
  geoZoneId: string;
  customZip: string;
  customRadius: number;
  audienceRoles: string[];
  audienceClearances: string[];
  audienceIndustries: string[];
  audienceEducation: string[];
  // Step 3
  headline: string;
  bodyText: string;
  ctaText: string;
  clickUrl: string;
  imageUrl: string;
  // Step 4
  dailyBudgetCents: number;
  totalBudgetCents: number;
  startDate: string;
  endDate: string;
}

const defaultWizard: WizardState = {
  name: '', category: 'sponsored_job', disclosure: 'Sponsored',
  geoZoneId: 'national', customZip: '', customRadius: 25,
  audienceRoles: [], audienceClearances: ['Any'], audienceIndustries: [], audienceEducation: ['Any'],
  headline: '', bodyText: '', ctaText: 'Learn More', clickUrl: '', imageUrl: '',
  dailyBudgetCents: 5000, totalBudgetCents: 0,
  startDate: new Date().toISOString().slice(0, 10), endDate: '',
};

interface CampaignModalProps {
  onClose: () => void;
  onCreated: () => void;
  advertiserId: string;
  creditBalanceCents: number;
  showToast: (msg: string) => void;
}

const CampaignCreationModal: React.FC<CampaignModalProps> = ({
  onClose, onCreated, advertiserId, creditBalanceCents, showToast,
}) => {
  const [step, setStep] = useState(1);
  const [wizard, setWizard] = useState<WizardState>(defaultWizard);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof WizardState>(key: K, val: WizardState[K]) =>
    setWizard(prev => ({ ...prev, [key]: val }));

  const cpm = getCpm(wizard.geoZoneId, wizard.audienceClearances);
  const estDailyImpressions = wizard.dailyBudgetCents > 0
    ? Math.round((wizard.dailyBudgetCents / cpm) * 1000)
    : 0;
  const reach = estimateReach(wizard.audienceRoles, wizard.audienceClearances, wizard.audienceIndustries);
  const cpmDisplay = `$${(cpm / 100).toFixed(2)} CPM`;

  const needsReview = wizard.audienceClearances.some(c => ['Top Secret', 'TS/SCI'].includes(c));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('ad_campaigns').insert({
        advertiser_id: advertiserId,
        name: wizard.name,
        status: needsReview ? 'pending_review' : 'active',
        category: wizard.category,
        geo_zone_id: wizard.geoZoneId === 'custom' ? null : wizard.geoZoneId,
        geo_zone_name: GEO_ZONES.find(z => z.id === wizard.geoZoneId)?.name,
        daily_budget_cents: wizard.dailyBudgetCents,
        total_budget_cents: wizard.totalBudgetCents || null,
        start_date: wizard.startDate,
        end_date: wizard.endDate || null,
        ad_disclosure_text: wizard.disclosure,
        cpm_rate_cents: cpm,
        headline: wizard.headline,
        body_text: wizard.bodyText,
        cta_text: wizard.ctaText,
        click_url: wizard.clickUrl,
        image_url: wizard.imageUrl || null,
      });
      if (error) throw error;
      showToast(needsReview ? 'Campaign submitted for review!' : 'Campaign launched successfully!');
      onCreated();
      onClose();
    } catch {
      showToast('Failed to create campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 1) return wizard.name.trim().length > 0;
    if (step === 2) return wizard.geoZoneId.length > 0;
    if (step === 3) return wizard.headline.trim().length > 0 && wizard.clickUrl.trim().length > 0;
    if (step === 4) return wizard.dailyBudgetCents >= 2500;
    return true;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create Campaign"
        className="bg-[#0d1226] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">Create Campaign</h2>
            <p className="text-gray-400 text-sm mt-0.5">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
          {['Basics', 'Targeting', 'Creative', 'Budget'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i + 1 === step ? 'bg-blue-600 text-white' :
                  i + 1 < step ? 'bg-blue-500/30 text-blue-400' :
                  'bg-white/5 text-gray-500'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i + 1 === step ? 'text-white font-medium' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
              {i < 3 && <div className={`flex-1 h-px ${i + 1 < step ? 'bg-blue-500/40' : 'bg-white/5'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="p-6 space-y-5">

          {/* ---- STEP 1: Basics ---- */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Campaign Name *</label>
                <input
                  type="text"
                  value={wizard.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Spring 2026 Cybersecurity Hiring Push"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Campaign Category *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CAMPAIGN_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => set('category', cat.value)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        wizard.category === cat.value
                          ? 'bg-blue-500/15 border-blue-500/40 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <cat.icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Ad Disclosure Text</label>
                <input
                  type="text"
                  value={wizard.disclosure}
                  onChange={e => set('disclosure', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Shown as small label on ad unit (e.g. "Sponsored", "Promoted")</p>
              </div>
            </div>
          )}

          {/* ---- STEP 2: Targeting ---- */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Geo Zone *</label>
                <select
                  value={wizard.geoZoneId}
                  onChange={e => set('geoZoneId', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/60 text-sm"
                >
                  {GEO_ZONES.map(z => (
                    <option key={z.id} value={z.id} className="bg-gray-900">{z.name}</option>
                  ))}
                </select>
              </div>
              {wizard.geoZoneId === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      value={wizard.customZip}
                      onChange={e => set('customZip', e.target.value)}
                      placeholder="e.g. 22201"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Radius: {wizard.customRadius} mi</label>
                    <input
                      type="range"
                      min={5}
                      max={200}
                      value={wizard.customRadius}
                      onChange={e => set('customRadius', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              )}
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-blue-300">Estimated reach: <strong>~{fmtNum(reach)} users</strong> in this segment</span>
              </div>
              <MultiCheckbox label="Role Filter" options={AUDIENCE_ROLES} selected={wizard.audienceRoles} onChange={v => set('audienceRoles', v)} />
              <MultiCheckbox label="Clearance Level" options={CLEARANCE_LEVELS} selected={wizard.audienceClearances} onChange={v => set('audienceClearances', v)} />
              {wizard.audienceClearances.some(c => ['Top Secret', 'TS/SCI'].includes(c)) && (
                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  Campaigns targeting classified clearance levels require platform review before going live.
                </div>
              )}
              <MultiCheckbox label="Industry Focus" options={INDUSTRIES} selected={wizard.audienceIndustries} onChange={v => set('audienceIndustries', v)} />
              <MultiCheckbox label="Education Level" options={EDUCATION_LEVELS} selected={wizard.audienceEducation} onChange={v => set('audienceEducation', v)} />
            </div>
          )}

          {/* ---- STEP 3: Creative ---- */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Headline * <span className="text-gray-600">({wizard.headline.length}/80)</span></label>
                    <input
                      type="text"
                      maxLength={80}
                      value={wizard.headline}
                      onChange={e => set('headline', e.target.value)}
                      placeholder="Join Our Cybersecurity Team"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Body Text <span className="text-gray-600">({wizard.bodyText.length}/200)</span></label>
                    <textarea
                      maxLength={200}
                      rows={3}
                      value={wizard.bodyText}
                      onChange={e => set('bodyText', e.target.value)}
                      placeholder="Describe the opportunity, benefits, or key message..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">CTA Text <span className="text-gray-600">({wizard.ctaText.length}/30)</span></label>
                    <input
                      type="text"
                      maxLength={30}
                      value={wizard.ctaText}
                      onChange={e => set('ctaText', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Click URL *</label>
                    <input
                      type="url"
                      value={wizard.clickUrl}
                      onChange={e => set('clickUrl', e.target.value)}
                      placeholder="https://careers.example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Image URL <span className="text-gray-600">(optional)</span></label>
                    <input
                      type="url"
                      value={wizard.imageUrl}
                      onChange={e => set('imageUrl', e.target.value)}
                      placeholder="https://cdn.example.com/ad-image.jpg"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Live Preview</p>
                  <AdPreviewCard
                    headline={wizard.headline}
                    body={wizard.bodyText}
                    cta={wizard.ctaText}
                    imageUrl={wizard.imageUrl}
                    disclosure={wizard.disclosure}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 4: Budget & Schedule ---- */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Pricing info */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Pricing Tier</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'National', rate: '$18 CPM' },
                    { label: 'State', rate: '$22 CPM' },
                    { label: 'Metro CBSA', rate: '$28 CPM' },
                    { label: 'Zip Radius', rate: '$38 CPM' },
                    { label: 'Zip + Clearance', rate: '$55 CPM' },
                    { label: 'Federal Package', rate: '$65 CPM' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-gray-400">
                      <span>{row.label}</span>
                      <span className="text-white font-medium">{row.rate}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-gray-300">Your selected rate:</span>
                  <span className="text-blue-400 font-bold">{cpmDisplay}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Daily Budget Cap * (min $25)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min={25}
                      value={wizard.dailyBudgetCents / 100}
                      onChange={e => set('dailyBudgetCents', Math.round(Number(e.target.value) * 100))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500/60 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Total Budget Cap (optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min={0}
                      value={wizard.totalBudgetCents > 0 ? wizard.totalBudgetCents / 100 : ''}
                      onChange={e => set('totalBudgetCents', e.target.value ? Math.round(Number(e.target.value) * 100) : 0)}
                      placeholder="No limit"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    value={wizard.startDate}
                    onChange={e => set('startDate', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/60 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">End Date (optional)</label>
                  <input
                    type="date"
                    value={wizard.endDate}
                    onChange={e => set('endDate', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/60 text-sm"
                  />
                </div>
              </div>

              {estDailyImpressions > 0 && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
                  Est. daily impressions: <strong>~{fmtNum(estDailyImpressions)}</strong> at {cpmDisplay}
                </div>
              )}

              <div className={`p-3 rounded-xl border text-sm flex items-center justify-between ${
                creditBalanceCents >= wizard.dailyBudgetCents
                  ? 'bg-white/5 border-white/10 text-gray-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <span>Your credit balance: <strong className="text-white">{fmtCents(creditBalanceCents)}</strong></span>
                {creditBalanceCents < wizard.dailyBudgetCents && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Insufficient credits for first day
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="px-6 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !canNext()}
              className="px-6 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
              {needsReview ? 'Submit for Review' : 'Launch Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// OVERVIEW TAB
// ===========================================

interface OverviewTabProps {
  campaigns: Campaign[];
  loading: boolean;
  creditBalanceCents: number;
  onTabChange: (tab: TabKey) => void;
  onCreateCampaign: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  campaigns, loading, creditBalanceCents, onTabChange, onCreateCampaign,
}) => {
  // Derived totals (use campaign data as proxy — real data from supabase views/tables in prod)
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spent_cents, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const ctrVal = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const statCards = [
    {
      label: 'Total Spend', value: fmtCents(totalSpend), icon: DollarSign,
      color: 'emerald', sub: 'This month',
    },
    {
      label: 'Impressions', value: fmtNum(totalImpressions), icon: Eye,
      color: 'blue', sub: 'This month',
    },
    {
      label: 'Clicks', value: fmtNum(totalClicks), icon: MousePointer,
      color: 'violet', sub: 'This month',
    },
    {
      label: 'CTR', value: `${ctrVal}%`, icon: TrendingUp,
      color: 'amber', sub: 'Click-through rate',
    },
    {
      label: 'Credit Balance', value: fmtCents(creditBalanceCents), icon: Wallet,
      color: 'cyan', sub: 'Available credits',
    },
    {
      label: 'Active Campaigns', value: String(activeCampaigns.length), icon: Zap,
      color: 'pink', sub: 'Running now',
    },
  ];

  const colorMap: Record<string, { icon: string; bg: string }> = {
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-500/15' },
    violet: { icon: 'text-violet-400', bg: 'bg-violet-500/15' },
    amber: { icon: 'text-amber-400', bg: 'bg-amber-500/15' },
    cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/15' },
    pink: { icon: 'text-pink-400', bg: 'bg-pink-500/15' },
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)
          : statCards.map(card => {
              const c = colorMap[card.color];
              return (
                <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center`}>
                      <card.icon className={`w-4 h-4 ${c.icon}`} />
                    </div>
                    <span className="text-gray-400 text-xs">{card.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{card.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
                </div>
              );
            })}
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">Active Campaigns</h3>
          <button onClick={() => onTabChange('campaigns')} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : activeCampaigns.length === 0 ? (
          <div className="p-10 text-center">
            <Megaphone className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No active campaigns yet.</p>
            <button onClick={onCreateCampaign} className="mt-3 text-blue-400 hover:text-blue-300 text-sm underline">
              Create your first campaign
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Campaign', 'Status', 'Impressions', 'Clicks', 'CTR', 'Daily Budget', 'Spend Today'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeCampaigns.slice(0, 5).map(c => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{c.name}</td>
                    <td className="px-5 py-3">{statusBadge(c.status)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtNum(c.impressions)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtNum(c.clicks)}</td>
                    <td className="px-5 py-3 text-gray-300">{ctr(c.clicks, c.impressions)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtCents(c.daily_budget_cents)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtCents(c.spent_today_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[180px]">
        <BarChart3 className="w-10 h-10 text-gray-600 mb-3" />
        <p className="text-gray-400 text-sm font-medium">Analytics chart coming soon</p>
        <p className="text-gray-500 text-xs mt-1">Impression and click trends will appear here</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onCreateCampaign}
          className="flex items-center gap-3 p-4 bg-blue-600/15 border border-blue-500/30 rounded-2xl hover:bg-blue-600/25 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600/30 transition-all">
            <Plus className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">Create Campaign</p>
            <p className="text-gray-500 text-xs">Launch a new ad</p>
          </div>
        </button>
        <button
          onClick={() => onTabChange('credits')}
          className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/15 transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/25 transition-all">
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">Add Credits</p>
            <p className="text-gray-500 text-xs">Top up your balance</p>
          </div>
        </button>
        <button
          onClick={() => onTabChange('reports')}
          className="flex items-center gap-3 p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl hover:bg-violet-500/15 transition-all group"
        >
          <div className="w-10 h-10 bg-violet-500/15 rounded-xl flex items-center justify-center group-hover:bg-violet-500/25 transition-all">
            <BarChart3 className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">View Reports</p>
            <p className="text-gray-500 text-xs">Performance analytics</p>
          </div>
        </button>
      </div>
    </div>
  );
};

// ===========================================
// CAMPAIGNS TAB
// ===========================================

interface CampaignsTabProps {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCreateCampaign: () => void;
  onTogglePause: (id: string, currentStatus: CampaignStatus) => void;
  showToast: (msg: string) => void;
}

const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns, loading, error, onRefresh, onCreateCampaign, onTogglePause, showToast,
}) => {
  const [filter, setFilter] = useState<'all' | CampaignStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'active', 'paused', 'pending_review', 'ended'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search campaigns…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 w-52"
            />
          </div>
          <button
            onClick={onCreateCampaign}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Campaign
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={onRefresh} className="ml-auto flex items-center gap-1 text-xs underline">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Campaigns list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <Megaphone className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {search || filter !== 'all' ? 'No campaigns match your filters.' : 'No campaigns yet.'}
          </p>
          {!search && filter === 'all' && (
            <button onClick={onCreateCampaign} className="mt-3 text-blue-400 hover:text-blue-300 text-sm underline">
              Create your first campaign
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left: Name + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-white font-semibold truncate">{c.name}</span>
                    {statusBadge(c.status)}
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {categoryLabel(c.category)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 flex-wrap">
                    {c.geo_zone_name && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {c.geo_zone_name}
                      </span>
                    )}
                    {c.audience_segment_name && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {c.audience_segment_name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Started {new Date(c.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right: Metrics */}
                <div className="flex items-center gap-6 text-sm shrink-0 flex-wrap">
                  <div className="text-center">
                    <div className="text-white font-semibold">{fmtNum(c.impressions)}</div>
                    <div className="text-gray-500 text-xs">Impr.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{fmtNum(c.clicks)}</div>
                    <div className="text-gray-500 text-xs">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{ctr(c.clicks, c.impressions)}</div>
                    <div className="text-gray-500 text-xs">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{fmtCents(c.daily_budget_cents)}</div>
                    <div className="text-gray-500 text-xs">Daily Cap</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{fmtCents(c.spent_cents)}</div>
                    <div className="text-gray-500 text-xs">Spent</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    title="Edit campaign"
                    onClick={() => showToast('Campaign editing coming soon.')}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {(c.status === 'active' || c.status === 'paused') && (
                    <button
                      className={`p-2 rounded-lg transition-all ${
                        c.status === 'active'
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                      }`}
                      title={c.status === 'active' ? 'Pause campaign' : 'Resume campaign'}
                      onClick={() => onTogglePause(c.id, c.status)}
                    >
                      {c.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    title="View report"
                    onClick={() => showToast('Per-campaign report view coming soon.')}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===========================================
// CREDITS TAB
// ===========================================

interface CreditsTabProps {
  creditBalanceCents: number;
  ledger: CreditLedgerEntry[];
  loading: boolean;
  showToast: (msg: string) => void;
}

const CreditsTab: React.FC<CreditsTabProps> = ({ creditBalanceCents, ledger, loading, showToast }) => {
  const ledgerTypeLabel = (type: CreditLedgerEntry['transaction_type']) => {
    const map = {
      credit_purchase: 'Credit Purchase',
      campaign_debit: 'Campaign Spend',
      refund: 'Refund',
      bonus_credit: 'Bonus Credit',
    };
    return map[type] ?? type;
  };

  const ledgerTypeColor = (type: CreditLedgerEntry['transaction_type']) => {
    if (type === 'credit_purchase' || type === 'bonus_credit' || type === 'refund')
      return 'text-emerald-400';
    return 'text-red-400';
  };

  const ledgerAmountPrefix = (type: CreditLedgerEntry['transaction_type']) =>
    type === 'campaign_debit' ? '-' : '+';

  return (
    <div className="space-y-6">
      {/* Balance Hero */}
      <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-8 text-center">
        <p className="text-gray-400 text-sm mb-2">Available Credit Balance</p>
        <div className="text-5xl font-bold text-white mb-1">{fmtCents(creditBalanceCents)}</div>
        <p className="text-gray-500 text-xs">Credits are used to fund your ad campaigns at the applicable CPM rate</p>
      </div>

      {/* Package cards */}
      <div>
        <h3 className="text-white font-semibold mb-4">Purchase Credits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CREDIT_PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={`relative bg-white/5 border rounded-2xl p-5 transition-all ${
                pkg.badge === 'Best Value'
                  ? 'border-blue-500/40 bg-blue-500/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {pkg.badge}
                </span>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">{pkg.name}</span>
                {pkg.bonus_percent > 0 && (
                  <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +{pkg.bonus_percent}% bonus
                  </span>
                )}
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-white">${(pkg.price_cents / 100).toLocaleString()}</span>
              </div>
              <div className="text-gray-400 text-sm mb-4">
                {pkg.credits.toLocaleString()} credits
                {pkg.bonus_percent > 0 && (
                  <span className="text-emerald-400 text-xs ml-1">
                    (incl. {Math.round(pkg.credits * pkg.bonus_percent / (100 + pkg.bonus_percent)).toLocaleString()} bonus)
                  </span>
                )}
              </div>
              <button
                onClick={() => showToast('Stripe payment integration coming soon. Contact sales@stemworkforce.com to purchase credits.')}
                className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                  pkg.is_enterprise
                    ? 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {pkg.is_enterprise ? 'Contact Sales' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs text-center mt-3 flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3" /> All payments processed securely via Stripe
        </p>
      </div>

      {/* Ledger */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">Transaction History</h3>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : ledger.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">No transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Date', 'Type', 'Description', 'Amount', 'Balance'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledger.slice(0, 20).map(entry => (
                  <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs">{ledgerTypeLabel(entry.transaction_type)}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{entry.description}</td>
                    <td className={`px-5 py-3 font-medium text-sm ${ledgerTypeColor(entry.transaction_type)}`}>
                      {ledgerAmountPrefix(entry.transaction_type)}{fmtCents(Math.abs(entry.amount_cents))}
                    </td>
                    <td className="px-5 py-3 text-gray-300 text-sm">{fmtCents(entry.balance_after_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================
// REPORTS TAB
// ===========================================

interface ReportsTabProps {
  campaigns: Campaign[];
  stats: CampaignDailyStats[];
  loading: boolean;
  showToast: (msg: string) => void;
}

type DateRange = '7d' | '30d' | '90d' | 'custom';

const ReportsTab: React.FC<ReportsTabProps> = ({ campaigns, stats, loading, showToast }) => {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filteredStats = stats.filter(s => {
    if (selectedCampaign !== 'all' && s.campaign_id !== selectedCampaign) return false;
    const date = new Date(s.stat_date);
    const now = new Date();
    if (dateRange === '7d') return date >= new Date(now.getTime() - 7 * 86400000);
    if (dateRange === '30d') return date >= new Date(now.getTime() - 30 * 86400000);
    if (dateRange === '90d') return date >= new Date(now.getTime() - 90 * 86400000);
    if (dateRange === 'custom' && customStart && customEnd)
      return date >= new Date(customStart) && date <= new Date(customEnd);
    return true;
  });

  // Aggregate by campaign
  const campaignAgg = campaigns.map(c => {
    const cs = filteredStats.filter(s => s.campaign_id === c.id);
    const impr = cs.reduce((a, s) => a + s.impressions, 0);
    const clicks = cs.reduce((a, s) => a + s.clicks, 0);
    const spend = cs.reduce((a, s) => a + s.spend_cents, 0);
    const conv = cs.reduce((a, s) => a + s.conversions, 0);
    const uniq = cs.reduce((a, s) => a + s.unique_users, 0);
    return { ...c, agg_impressions: impr, agg_clicks: clicks, agg_spend: spend, agg_conv: conv, agg_uniq: uniq };
  });

  // Aggregate by state
  const stateMap: Record<string, { impressions: number; clicks: number }> = {};
  filteredStats.forEach(s => {
    if (!s.state) return;
    if (!stateMap[s.state]) stateMap[s.state] = { impressions: 0, clicks: 0 };
    stateMap[s.state].impressions += s.impressions;
    stateMap[s.state].clicks += s.clicks;
  });
  const stateRows = Object.entries(stateMap)
    .sort((a, b) => b[1].impressions - a[1].impressions)
    .slice(0, 10);

  // Attribution mock
  const totalConversions = filteredStats.reduce((a, s) => a + s.conversions, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-wrap">
          {([['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['90d', 'Last 90 days'], ['custom', 'Custom']] as [DateRange, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setDateRange(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateRange === val
                  ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={selectedCampaign}
          onChange={e => setSelectedCampaign(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50 sm:ml-auto"
        >
          <option value="all" className="bg-gray-900">All Campaigns</option>
          {campaigns.map(c => (
            <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => showToast('CSV export coming soon.')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Download CSV
        </button>
      </div>

      {dateRange === 'custom' && (
        <div className="flex items-center gap-3">
          <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50" />
          <span className="text-gray-500 text-sm">to</span>
          <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50" />
        </div>
      )}

      {/* Campaign stats table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">Campaign Performance</h3>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-10" />)}</div>
        ) : campaignAgg.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">No data for selected range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Campaign', 'Impressions', 'Unique Users', 'Clicks', 'CTR', 'Spend', 'Conversions', 'CPA'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaignAgg.map(c => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white font-medium text-sm">{c.name}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtNum(c.agg_impressions)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtNum(c.agg_uniq)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtNum(c.agg_clicks)}</td>
                    <td className="px-5 py-3 text-gray-300">{ctr(c.agg_clicks, c.agg_impressions)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtCents(c.agg_spend)}</td>
                    <td className="px-5 py-3 text-gray-300">{c.agg_conv}</td>
                    <td className="px-5 py-3 text-gray-300">
                      {c.agg_conv > 0 ? fmtCents(Math.round(c.agg_spend / c.agg_conv)) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Geographic breakdown */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">Geographic Breakdown</h3>
        </div>
        {stateRows.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No geographic data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['State', 'Impressions', 'Clicks', 'CTR'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stateRows.map(([state, data]) => (
                  <tr key={state} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white">{state}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtNum(data.impressions)}</td>
                    <td className="px-5 py-3 text-gray-300">{fmtNum(data.clicks)}</td>
                    <td className="px-5 py-3 text-gray-300">{ctr(data.clicks, data.impressions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attribution */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-1">Attribution</h3>
        <p className="text-gray-400 text-sm">
          Applications submitted within 30 days of seeing your ad:&nbsp;
          <strong className="text-white">{fmtNum(totalConversions)}</strong>
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Attribution data is sourced from <code className="text-gray-400">ad_attribution</code> table using a 30-day view-through window.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// MAIN ADVERTISER DASHBOARD
// ===========================================

const AdvertiserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data state
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<CampaignDailyStats[]>([]);
  const [creditBalanceCents, setCreditBalanceCents] = useState(0);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  // ---- Data fetching ----

  const fetchAdvertiser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { navigate('/login'); return; }

      setUser({ email: authUser.email ?? '', name: authUser.user_metadata?.full_name ?? authUser.email ?? 'Advertiser' });

      // Try to get advertiser record by org or user id
      const { data, error: adError } = await supabase
        .from('advertisers')
        .select('*')
        .eq('organization_id', authUser.id)
        .maybeSingle();

      if (adError) throw adError;

      if (data) {
        setAdvertiser(data);
      } else {
        // No advertiser record yet — create a provisional one so the UI is functional
        setAdvertiser({
          id: `provisional-${authUser.id}`,
          organization_id: authUser.id,
          org_name: authUser.user_metadata?.organization_name ?? 'My Organization',
          contact_name: authUser.user_metadata?.full_name ?? '',
          contact_email: authUser.email ?? '',
          advertiser_type: 'employer',
          created_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('fetchAdvertiser error:', e);
      setError('Failed to load advertiser profile.');
    }
  }, [navigate]);

  const fetchCampaigns = useCallback(async (advertiserId: string) => {
    if (advertiserId.startsWith('provisional-')) { setCampaigns([]); return; }
    try {
      const { data, error: e } = await supabase
        .from('ad_campaigns')
        .select('*')
        .eq('advertiser_id', advertiserId)
        .order('created_at', { ascending: false });
      if (e) throw e;
      setCampaigns((data ?? []) as Campaign[]);
    } catch {
      setCampaigns([]);
    }
  }, []);

  const fetchCredits = useCallback(async (advertiserId: string) => {
    if (advertiserId.startsWith('provisional-')) { setCreditBalanceCents(0); setLedger([]); return; }
    try {
      // Balance from view
      const { data: balanceData } = await supabase
        .from('advertiser_credit_balance')
        .select('balance_cents')
        .eq('advertiser_id', advertiserId)
        .maybeSingle();
      setCreditBalanceCents(balanceData?.balance_cents ?? 0);

      // Ledger entries
      const { data: ledgerData } = await supabase
        .from('ad_credit_ledger')
        .select('*')
        .eq('advertiser_id', advertiserId)
        .order('created_at', { ascending: false })
        .limit(20);
      setLedger((ledgerData ?? []) as CreditLedgerEntry[]);
    } catch {
      setCreditBalanceCents(0);
      setLedger([]);
    }
  }, []);

  const fetchDailyStats = useCallback(async (advertiserId: string) => {
    if (advertiserId.startsWith('provisional-')) { setDailyStats([]); return; }
    try {
      const { data } = await supabase
        .from('campaign_daily_stats')
        .select('*')
        .in('campaign_id', campaigns.map(c => c.id))
        .order('stat_date', { ascending: false });
      setDailyStats((data ?? []) as CampaignDailyStats[]);
    } catch {
      setDailyStats([]);
    }
  }, [campaigns]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchAdvertiser();
    } finally {
      setLoading(false);
    }
  }, [fetchAdvertiser]);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (advertiser) {
      fetchCampaigns(advertiser.id);
      fetchCredits(advertiser.id);
    }
  }, [advertiser, fetchCampaigns, fetchCredits]);

  useEffect(() => {
    if (advertiser && campaigns.length > 0) {
      fetchDailyStats(advertiser.id);
    }
  }, [advertiser, campaigns, fetchDailyStats]);

  // ---- Actions ----

  const handleTogglePause = async (id: string, currentStatus: CampaignStatus) => {
    const newStatus: CampaignStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const { error: e } = await supabase
        .from('ad_campaigns')
        .update({ status: newStatus })
        .eq('id', id);
      if (e) throw e;
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      showToast(`Campaign ${newStatus === 'active' ? 'resumed' : 'paused'} successfully.`);
    } catch {
      showToast('Failed to update campaign status.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // ---- Tab title ----
  const tabTitle = TABS.find(t => t.key === activeTab)?.label ?? 'Dashboard';

  // ---- Render tab ----
  const renderTab = () => {
    if (loading && !advertiser) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            campaigns={campaigns}
            loading={loading}
            creditBalanceCents={creditBalanceCents}
            onTabChange={setActiveTab}
            onCreateCampaign={() => setShowCreateModal(true)}
          />
        );
      case 'campaigns':
        return (
          <CampaignsTab
            campaigns={campaigns}
            loading={loading}
            error={error}
            onRefresh={loadAll}
            onCreateCampaign={() => setShowCreateModal(true)}
            onTogglePause={handleTogglePause}
            showToast={showToast}
          />
        );
      case 'credits':
        return (
          <CreditsTab
            creditBalanceCents={creditBalanceCents}
            ledger={ledger}
            loading={loading}
            showToast={showToast}
          />
        );
      case 'reports':
        return (
          <ReportsTab
            campaigns={campaigns}
            stats={dailyStats}
            loading={loading}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0f1e]">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-[#0d1226] border-r border-white/10 flex flex-col transition-all duration-300 shrink-0 hidden md:flex`}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-white/10 flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0">
            SW
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm truncate">STEMWorkforce</div>
              <div className="text-gray-500 text-xs">Advertiser Portal</div>
            </div>
          )}
        </div>

        {/* Org info */}
        {sidebarOpen && advertiser && (
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-medium truncate">{advertiser.org_name}</div>
                <div className="text-gray-500 text-[10px] capitalize">{advertiser.advertiser_type}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                title={!sidebarOpen ? tab.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Credit balance pill */}
        {sidebarOpen && (
          <div className="mx-3 mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-gray-400 text-xs">Credits</span>
              <Wallet className="w-3 h-3 text-blue-400" />
            </div>
            <div className="text-white font-semibold text-sm">{fmtCents(creditBalanceCents)}</div>
            <button
              onClick={() => setActiveTab('credits')}
              className="text-blue-400 text-[10px] hover:text-blue-300 mt-0.5"
            >
              Add credits →
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            <Menu className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Collapse</span>}
          </button>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 text-sm transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
            title={!sidebarOpen ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{tabTitle}</h1>
              <p className="text-sm text-gray-500">
                {advertiser?.org_name ?? 'Advertiser'} &middot; Self-Serve Ad Platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Quick create */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> New Campaign
              </button>

              {/* User avatar */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 pl-3 border-l border-white/10 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {(user?.name ?? 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white leading-none">{user?.name ?? 'Advertiser'}</p>
                    <p className="text-xs text-gray-500">{user?.email ?? ''}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-44 bg-[#0d1226] border border-white/10 rounded-xl py-1 shadow-2xl z-50">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-white font-medium truncate">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 pb-24">
          {renderTab()}
        </main>
      </div>

      {/* Campaign creation modal */}
      {showCreateModal && advertiser && (
        <CampaignCreationModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            fetchCampaigns(advertiser.id);
            fetchCredits(advertiser.id);
          }}
          advertiserId={advertiser.id}
          creditBalanceCents={creditBalanceCents}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdvertiserDashboard;
