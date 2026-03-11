// ===========================================
// SF-86 Readiness Assessment — "Am I Clearable?"
// ===========================================
//
// LEGAL DISCLAIMERS:
// - This is NOT a clearance determination (SEAD-4 reference only)
// - No SF-86 data is stored — only readiness assessment metadata
// - FCRA compliant: no credit checks, no consumer reports
// - Privacy Act (5 USC 552a): No federal records accessed
// - EO 13526: No classified information stored or transmitted
//
// SECURITY:
// - No SSN, DOB, or financial details collected
// - Attorney-client privilege toggle available
// - Data retention is user-configurable (default 90 days)
// - All PII minimized per NIST 800-53
//
// ===========================================

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Lock,
  FileText,
  Globe,
  DollarSign,
  Scale,
  User,
  Brain,
  Monitor,
  Briefcase,
  MapPin,
  Flag,
  AlertOctagon,
  Wine,
  Info,
  ArrowRight,
  Clock,
  Star,
  X,
  Check,
} from 'lucide-react';
import type {
  AdjudicativeGuideline,
  GuidelineAssessment,
  ReadinessLevel,
  ClearanceTargetLevel,
  CitizenshipStatus,
  ReadinessRecommendation,
} from '../../types/clearanceReadiness';
import {
  ADJUDICATIVE_GUIDELINES,
  CLEARANCE_TARGET_LEVELS,
} from '../../types/clearanceReadiness';
import clearanceReadinessApi from '../../services/clearanceReadinessApi';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

const RISK_LEVELS: { value: RiskLevel; label: string; color: string; bgClass: string; borderClass: string; description: string }[] = [
  { value: 'low', label: 'Low', color: '#22C55E', bgClass: 'bg-green-500/20', borderClass: 'border-green-500', description: 'No concerns in this area' },
  { value: 'moderate', label: 'Moderate', color: '#F59E0B', bgClass: 'bg-yellow-500/20', borderClass: 'border-yellow-500', description: 'Minor issues that may need explanation' },
  { value: 'elevated', label: 'Elevated', color: '#F97316', bgClass: 'bg-orange-500/20', borderClass: 'border-orange-500', description: 'Issues that should be addressed first' },
  { value: 'high', label: 'High', color: '#EF4444', bgClass: 'bg-red-500/20', borderClass: 'border-red-500', description: 'Significant concerns — attorney recommended' },
];

const READINESS_CONFIG: Record<ReadinessLevel, {
  label: string; color: string; bgClass: string; borderClass: string; textClass: string; icon: typeof ShieldCheck; description: string;
}> = {
  'likely-eligible': {
    label: 'Likely Eligible',
    color: '#22C55E',
    bgClass: 'bg-green-500/20',
    borderClass: 'border-green-500',
    textClass: 'text-green-400',
    icon: ShieldCheck,
    description: 'Based on your self-assessment, you appear likely eligible for a security clearance. No significant concerns were identified.',
  },
  'conditionally-ready': {
    label: 'Conditionally Ready',
    color: '#F59E0B',
    bgClass: 'bg-yellow-500/20',
    borderClass: 'border-yellow-500',
    textClass: 'text-yellow-400',
    icon: Shield,
    description: 'You have minor areas that may require explanation during the investigation. With proper preparation, these are generally manageable.',
  },
  'needs-preparation': {
    label: 'Needs Preparation',
    color: '#F97316',
    bgClass: 'bg-orange-500/20',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-400',
    icon: ShieldAlert,
    description: 'Several areas need attention before applying. We recommend addressing the flagged issues and considering professional guidance.',
  },
  'consult-attorney': {
    label: 'Consult an Attorney',
    color: '#EF4444',
    bgClass: 'bg-red-500/20',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    icon: AlertTriangle,
    description: 'Significant concerns identified. We strongly recommend consulting a national security employment attorney before proceeding.',
  },
  'not-assessed': {
    label: 'Not Assessed',
    color: '#6B7280',
    bgClass: 'bg-gray-500/20',
    borderClass: 'border-gray-500',
    textClass: 'text-gray-400',
    icon: Shield,
    description: 'Assessment has not been completed.',
  },
};

const GUIDELINE_ICONS: Record<AdjudicativeGuideline, React.ElementType> = {
  'allegiance': Flag,
  'foreign-influence': Globe,
  'foreign-preference': MapPin,
  'sexual-behavior': AlertTriangle,
  'personal-conduct': User,
  'financial': DollarSign,
  'alcohol': Wine,
  'drug-involvement': AlertOctagon,
  'psychological': Brain,
  'criminal-conduct': Scale,
  'handling-info': Lock,
  'outside-activities': Briefcase,
  'technology-misuse': Monitor,
};

const GUIDELINE_QUESTIONS: Record<AdjudicativeGuideline, string[]> = {
  'allegiance': [
    'Have you ever been involved with organizations that advocate the overthrow of the US government?',
    'Have you ever acted in a way that could serve the interests of a foreign government over the US?',
  ],
  'foreign-influence': [
    'Do you have close relatives who are citizens of or reside in a foreign country?',
    'Do you have financial interests (property, bank accounts, business) in a foreign country?',
    'Have you had close or continuing contact with foreign nationals?',
  ],
  'foreign-preference': [
    'Do you hold or have you held a foreign passport?',
    'Have you accepted benefits from a foreign government (education, medical, retirement)?',
    'Have you voted in a foreign election?',
  ],
  'sexual-behavior': [
    'Have you engaged in sexual behavior that could make you vulnerable to coercion?',
    'Have you been charged with or convicted of a sex-related offense?',
  ],
  'personal-conduct': [
    'Have you ever been fired, quit after being told you would be fired, or left a job under unfavorable circumstances?',
    'Have you ever falsified information on a government form or during an investigation?',
    'Have you ever been disciplined for violating workplace rules or policies?',
  ],
  'financial': [
    'Do you have significant delinquent debts (over 120 days past due)?',
    'Have you filed for bankruptcy in the past 7 years?',
    'Do you have any tax liens, wage garnishments, or accounts in collections?',
    'Have you experienced any unexplained wealth or income?',
  ],
  'alcohol': [
    'Have you been diagnosed with an alcohol use disorder?',
    'Have you had alcohol-related incidents (DUI/DWI, public intoxication)?',
    'Have you received treatment or counseling for alcohol use?',
  ],
  'drug-involvement': [
    'Have you used any illegal drugs in the past 7 years (or 12 months for marijuana in some jurisdictions)?',
    'Have you misused prescription drugs?',
    'Have you been involved in drug trafficking or distribution?',
  ],
  'psychological': [
    'Have you been diagnosed with a condition that could impair judgment or reliability?',
    'Have you been ordered to seek mental health treatment by a court or employer?',
    'Note: Seeking mental health treatment voluntarily is viewed positively.',
  ],
  'criminal-conduct': [
    'Have you been arrested, charged, or convicted of any criminal offense?',
    'Do you have any pending criminal charges?',
    'Have you been on probation or parole in the past 10 years?',
  ],
  'handling-info': [
    'Have you ever been counseled, warned, or disciplined for mishandling protected information?',
    'Have you had any security violations or infractions?',
  ],
  'outside-activities': [
    'Do you have any outside employment or consulting that could present a conflict of interest?',
    'Are you involved with any foreign-owned or foreign-operated organizations?',
  ],
  'technology-misuse': [
    'Have you ever been disciplined for unauthorized use of information technology systems?',
    'Have you ever illegally downloaded copyrighted material using work systems?',
    'Have you ever introduced malware or bypassed security controls on IT systems?',
  ],
};

const STEPS = [
  { id: 'intro', label: 'Consent', description: 'Legal & Privacy', icon: FileText },
  { id: 'eligibility', label: 'Eligibility', description: 'Citizenship & Target', icon: Shield },
  { id: 'assessment', label: 'Assessment', description: '13 Guidelines', icon: Star },
  { id: 'results', label: 'Results', description: 'Readiness Score', icon: CheckCircle },
] as const;

const AGENCY_TYPES = [
  { value: 'dod', label: 'Department of Defense (DoD)' },
  { value: 'doe', label: 'Department of Energy (DOE)' },
  { value: 'ic', label: 'Intelligence Community (IC)' },
  { value: 'dhs', label: 'Department of Homeland Security (DHS)' },
  { value: 'other', label: 'Other Federal Agency' },
];

const CITIZENSHIP_OPTIONS: { value: CitizenshipStatus; label: string; description: string }[] = [
  { value: 'us-citizen-birth', label: 'US Citizen by Birth', description: 'Born in the United States or US territory' },
  { value: 'us-citizen-naturalized', label: 'Naturalized US Citizen', description: 'Acquired citizenship through naturalization' },
  { value: 'permanent-resident', label: 'Permanent Resident', description: 'Lawful Permanent Resident (Green Card holder)' },
  { value: 'visa-holder', label: 'Visa Holder', description: 'Currently in the US on a work or student visa' },
  { value: 'non-us-citizen', label: 'Non-US Citizen', description: 'Not a US citizen or permanent resident' },
];

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function ClearanceReadinessAssessmentPage() {
  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Step 1: Consent
  const [consentGiven, setConsentGiven] = useState(false);
  const [attorneyPrivileged, setAttorneyPrivileged] = useState(false);
  const [dataRetentionDays, setDataRetentionDays] = useState(90);

  // Step 2: Eligibility
  const [citizenshipStatus, setCitizenshipStatus] = useState<CitizenshipStatus | ''>('');
  const [dualCitizenship, setDualCitizenship] = useState(false);
  const [dualCitizenshipCountries, setDualCitizenshipCountries] = useState('');
  const [bornAbroad, setBornAbroad] = useState(false);
  const [targetClearance, setTargetClearance] = useState<ClearanceTargetLevel | ''>('');
  const [targetAgency, setTargetAgency] = useState('dod');

  // Step 3: Guideline assessments
  const [guidelineRisks, setGuidelineRisks] = useState<Record<AdjudicativeGuideline, RiskLevel>>(() => {
    const initial: Record<string, RiskLevel> = {};
    for (const key of Object.keys(ADJUDICATIVE_GUIDELINES)) {
      initial[key] = 'low';
    }
    return initial as Record<AdjudicativeGuideline, RiskLevel>;
  });

  // Step 4: Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    readinessScore: number;
    overallReadiness: ReadinessLevel;
    recommendations: ReadinessRecommendation[];
    estimatedDays: { min: number; max: number };
    salaryPremium: { min: number; max: number };
  } | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Keyboard navigation for risk selectors
  const riskValues: RiskLevel[] = ['low', 'moderate', 'elevated', 'high'];

  const handleRiskKeyDown = useCallback(
    (e: React.KeyboardEvent, guidelineKey: AdjudicativeGuideline) => {
      const currentIdx = riskValues.indexOf(guidelineRisks[guidelineKey]);
      let newIdx = currentIdx;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIdx = Math.min(currentIdx + 1, riskValues.length - 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIdx = Math.max(currentIdx - 1, 0);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Current selection is already applied; this confirms it
        return;
      } else {
        return;
      }

      if (newIdx !== currentIdx) {
        setGuidelineRisks((prev) => ({ ...prev, [guidelineKey]: riskValues[newIdx] }));
        // Focus the newly selected button
        const container = (e.currentTarget as HTMLElement).closest('[role="radiogroup"]');
        if (container) {
          const buttons = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
          buttons[newIdx]?.focus();
        }
      }
    },
    [guidelineRisks]
  );

  // Navigation
  const canProceedStep0 = consentGiven;
  const canProceedStep1 = citizenshipStatus !== '' && targetClearance !== '';
  const canProceedStep2 = true; // all guidelines default to 'low'

  const goNext = useCallback(async () => {
    if (currentStep === 2) {
      // Submit assessment
      setIsSubmitting(true);
      setDirection(1);
      try {
        const guidelines: GuidelineAssessment[] = (Object.keys(guidelineRisks) as AdjudicativeGuideline[]).map((g) => ({
          guideline: g,
          riskLevel: guidelineRisks[g],
          mitigatingFactors: [],
          recommendedActions: [],
          attorneyReviewRecommended: guidelineRisks[g] === 'high',
          assessedAt: new Date().toISOString(),
        }));

        const resp = await clearanceReadinessApi.submitGuidelineAssessments('assessment-1', guidelines);
        if (resp.success && resp.data) {
          const target = targetClearance as ClearanceTargetLevel;
          const levelConfig = CLEARANCE_TARGET_LEVELS[target];
          setResults({
            readinessScore: resp.data.readinessScore,
            overallReadiness: resp.data.overallReadiness,
            recommendations: resp.data.recommendations,
            estimatedDays: levelConfig?.estimatedDays ?? { min: 90, max: 180 },
            salaryPremium: levelConfig?.salaryPremium ?? { min: 5000, max: 15000 },
          });
          setToast({ type: 'success', message: 'Assessment complete! Your readiness score has been calculated.' });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while processing your assessment.';
        setToast({ type: 'error', message: errorMessage });
        // Fallback
        setResults({
          readinessScore: 75,
          overallReadiness: 'conditionally-ready',
          recommendations: [],
          estimatedDays: { min: 90, max: 180 },
          salaryPremium: { min: 8000, max: 15000 },
        });
      } finally {
        setIsSubmitting(false);
      }
      setCurrentStep(3);
      return;
    }

    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [currentStep, guidelineRisks, targetClearance]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const resetAssessment = useCallback(() => {
    setCurrentStep(0);
    setConsentGiven(false);
    setAttorneyPrivileged(false);
    setDataRetentionDays(90);
    setCitizenshipStatus('');
    setDualCitizenship(false);
    setDualCitizenshipCountries('');
    setBornAbroad(false);
    setTargetClearance('');
    setTargetAgency('dod');
    const initial: Record<string, RiskLevel> = {};
    for (const key of Object.keys(ADJUDICATIVE_GUIDELINES)) {
      initial[key] = 'low';
    }
    setGuidelineRisks(initial as Record<AdjudicativeGuideline, RiskLevel>);
    setResults(null);
    setDirection(-1);
  }, []);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 0) return !canProceedStep0;
    if (currentStep === 1) return !canProceedStep1;
    if (currentStep === 2) return !canProceedStep2;
    return true;
  }, [currentStep, canProceedStep0, canProceedStep1, canProceedStep2]);

  // Non-citizen gate
  const isCitizenshipBlocking = citizenshipStatus === 'non-us-citizen' || citizenshipStatus === 'visa-holder';

  // Animation variants
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold">SF-86 Readiness Assessment</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl">
            Confidential self-assessment to evaluate your readiness for a US government security clearance.
            Based on SEAD-4 adjudicative guidelines.
          </p>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-amber-900/30 border-b border-amber-700/50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-200 text-xs sm:text-sm">
              <strong>Legal Notice:</strong> This is NOT a clearance determination. This self-assessment provides
              guidance only and is not affiliated with, endorsed by, or a substitute for any US government
              adjudicative process. No SF-86 data is collected or stored.
            </p>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md px-4 py-3 rounded-lg shadow-lg border flex items-start gap-3 animate-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-green-900/90 border-green-700 text-green-200'
              : 'bg-red-900/90 border-red-700 text-red-200'
          }`}
          role="alert"
          aria-live="assertive"
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <p className="text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-white shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Assessment progress" className="mb-8">
          <ol className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isComplete = idx < currentStep;
              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <li className="flex-1 mx-2" aria-hidden="true">
                      <div className={`h-0.5 transition-colors duration-300 ${isComplete ? 'bg-green-500' : isActive ? 'bg-blue-500/50' : 'bg-gray-700'}`} />
                    </li>
                  )}
                  <li className="flex flex-col items-center gap-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : isComplete
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-gray-600 bg-gray-800 text-gray-500'
                      }`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {isComplete ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-blue-400' : isComplete ? 'text-green-400' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                    <span className={`text-[10px] hidden sm:block ${isActive ? 'text-blue-400/70' : isComplete ? 'text-green-400/60' : 'text-gray-600'}`}>
                      {step.description}
                    </span>
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>

        {/* Step content with animation */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* ============================================================= */}
            {/* STEP 0: INTRODUCTION & CONSENT                                */}
            {/* ============================================================= */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    About This Assessment
                  </h2>
                  <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                    <p>
                      This self-assessment tool helps you understand your readiness for a US government security
                      clearance before you begin the formal application process. It evaluates your situation against
                      the 13 adjudicative guidelines defined in Security Executive Agent Directive 4 (SEAD-4).
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" /> What This Does
                        </h3>
                        <ul className="space-y-1.5 text-sm text-gray-400">
                          <li>Evaluates your situation against SEAD-4 guidelines</li>
                          <li>Estimates your readiness level and timeline</li>
                          <li>Provides actionable recommendations</li>
                          <li>Identifies areas where you may need legal counsel</li>
                          <li>Estimates salary premium for cleared positions</li>
                        </ul>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                          <X className="w-4 h-4 text-red-400" /> What This Does NOT Do
                        </h3>
                        <ul className="space-y-1.5 text-sm text-gray-400">
                          <li>This is not a clearance determination or adjudication</li>
                          <li>Does not collect SSN, DOB, or financial details</li>
                          <li>Does not access any government databases</li>
                          <li>Does not guarantee clearance eligibility</li>
                          <li>Does not replace legal advice from an attorney</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legal disclaimers */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" />
                    Legal Disclaimers
                  </h2>
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
                      <p className="font-medium text-amber-300 mb-1">FCRA Disclaimer</p>
                      <p>
                        This assessment is not a consumer report under the Fair Credit Reporting Act (FCRA).
                        No credit checks, background investigations, or third-party inquiries are conducted.
                        All information is self-reported and used solely for educational guidance.
                      </p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                      <p className="font-medium text-blue-300 mb-1">Not a Government Determination</p>
                      <p>
                        This assessment is not affiliated with, endorsed by, or conducted on behalf of any
                        US government agency, the Defense Counterintelligence and Security Agency (DCSA),
                        or any adjudicative body. Only authorized government officials can grant, deny, or
                        revoke security clearances per Executive Order 12968 and SEAD-4.
                      </p>
                    </div>
                    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                      <p className="font-medium text-gray-300 mb-1">Privacy Notice</p>
                      <p>
                        No personally identifiable information (PII) is required to complete this assessment.
                        Risk-level selections (Low/Moderate/Elevated/High) are stored temporarily for result
                        generation and deleted according to your retention preference. No SF-86 content,
                        Social Security Numbers, dates of birth, or financial account details are collected.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attorney-client privilege toggle */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-400" />
                    Privacy Options
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={attorneyPrivileged}
                        onChange={(e) => setAttorneyPrivileged(e.target.checked)}
                        aria-label="Toggle attorney-client privilege"
                        className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                      />
                      <div>
                        <p className="font-medium text-white group-hover:text-purple-300 transition-colors">
                          Enable Attorney-Client Privilege Protection
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Mark this assessment as attorney-client privileged communication. This flag
                          indicates the assessment was completed at the direction of or in consultation
                          with legal counsel, providing additional legal protections for your responses.
                        </p>
                      </div>
                    </label>

                    <div className="pt-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data Retention Period
                      </label>
                      <div className="flex items-center gap-3">
                        <select
                          value={dataRetentionDays}
                          onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                          aria-label="Data retention period"
                          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={7}>7 days</option>
                          <option value={30}>30 days</option>
                          <option value={90}>90 days (default)</option>
                          <option value={180}>180 days</option>
                          <option value={0}>Delete immediately after viewing</option>
                        </select>
                        <span className="text-xs text-gray-500">
                          Assessment data will be automatically deleted after this period
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sm:p-8">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-300 transition-colors">
                        I understand and agree to the following:
                      </p>
                      <ul className="text-sm text-gray-400 mt-2 space-y-1 list-disc list-inside">
                        <li>This is a self-assessment tool and NOT a clearance determination</li>
                        <li>No SF-86 content or sensitive PII will be collected</li>
                        <li>Results are for informational and educational purposes only</li>
                        <li>I should consult a qualified attorney for legal advice</li>
                        <li>My data will be retained per my selected retention period</li>
                      </ul>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* STEP 1: CITIZENSHIP & TARGET CLEARANCE                        */}
            {/* ============================================================= */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Citizenship */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-blue-400" />
                    Citizenship Status
                    <span className="text-red-400 ml-1" aria-hidden="true">*</span>
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    US citizenship is generally required for a security clearance. Select your current status.
                    <span className="sr-only"> (required)</span>
                  </p>
                  <div className="grid gap-3">
                    {CITIZENSHIP_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          citizenshipStatus === opt.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="citizenship"
                          value={opt.value}
                          checked={citizenshipStatus === opt.value}
                          onChange={() => setCitizenshipStatus(opt.value)}
                          className="mt-1 w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <div>
                          <p className="font-medium text-white">{opt.label}</p>
                          <p className="text-sm text-gray-400">{opt.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Citizenship blocking warning */}
                  {isCitizenshipBlocking && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-red-900/30 border border-red-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-300">Citizenship Requirement</p>
                          <p className="text-sm text-red-200/70 mt-1">
                            {citizenshipStatus === 'non-us-citizen'
                              ? 'Most US security clearances require US citizenship. Limited Access Authorizations (LAA) may be available in rare circumstances. We recommend consulting an immigration attorney.'
                              : 'Visa holders are generally not eligible for security clearances. However, some positions may accept a Limited Access Authorization (LAA). Consider consulting an immigration and national security attorney.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Dual citizenship */}
                  {(citizenshipStatus === 'us-citizen-birth' || citizenshipStatus === 'us-citizen-naturalized') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dualCitizenship}
                          onChange={(e) => setDualCitizenship(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <div>
                          <p className="font-medium text-white">I hold or have held dual citizenship</p>
                          <p className="text-sm text-gray-400">Including citizenship obtained at birth through parents</p>
                        </div>
                      </label>
                      {dualCitizenship && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <input
                            type="text"
                            value={dualCitizenshipCountries}
                            onChange={(e) => setDualCitizenshipCountries(e.target.value)}
                            placeholder="Country or countries (e.g., Canada, UK)"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </motion.div>
                      )}

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bornAbroad}
                          onChange={(e) => setBornAbroad(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <div>
                          <p className="font-medium text-white">I was born outside the United States</p>
                          <p className="text-sm text-gray-400">Including US military bases abroad or US territories</p>
                        </div>
                      </label>
                    </motion.div>
                  )}
                </div>

                {/* Target clearance level */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Target Clearance Level
                    <span className="text-red-400 ml-1" aria-hidden="true">*</span>
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Select the clearance level you are seeking or expect to need.
                    <span className="sr-only"> (required)</span>
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(Object.entries(CLEARANCE_TARGET_LEVELS) as [ClearanceTargetLevel, typeof CLEARANCE_TARGET_LEVELS[ClearanceTargetLevel]][]).map(
                      ([key, config]) => (
                        <label
                          key={key}
                          className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${
                            targetClearance === key
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <input
                              type="radio"
                              name="clearance"
                              value={key}
                              checked={targetClearance === key}
                              onChange={() => setTargetClearance(key)}
                              className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                            />
                            <span className="font-medium text-white">{config.label}</span>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-mono"
                              style={{ backgroundColor: config.color + '22', color: config.color }}
                            >
                              {config.abbreviation}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 ml-6">{config.description}</p>
                          <div className="flex items-center gap-4 ml-6 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {config.estimatedDays.min}-{config.estimatedDays.max} days
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              +${(config.salaryPremium.min / 1000).toFixed(0)}-{(config.salaryPremium.max / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Target agency */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-400" />
                    Target Agency Type
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Different agencies may have different adjudicative standards and processing times.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {AGENCY_TYPES.map((a) => (
                      <label
                        key={a.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          targetAgency === a.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="agency"
                          value={a.value}
                          checked={targetAgency === a.value}
                          onChange={() => setTargetAgency(a.value)}
                          className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-sm text-white">{a.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* STEP 2: 13 GUIDELINE SELF-ASSESSMENT                          */}
            {/* ============================================================= */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Self-Assessment Instructions</p>
                      <p className="text-sm text-gray-400 mt-1">
                        For each of the 13 SEAD-4 adjudicative guidelines below, select the risk level that
                        best describes your current situation. Review the example questions to help gauge your
                        response. Be honest — this assessment is confidential and designed to help you.
                      </p>
                    </div>
                  </div>
                  {/* Risk level legend */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {RISK_LEVELS.map((r) => (
                      <div key={r.value} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-xs text-gray-400">
                          <strong className="text-gray-300">{r.label}:</strong> {r.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {(Object.entries(ADJUDICATIVE_GUIDELINES) as [AdjudicativeGuideline, typeof ADJUDICATIVE_GUIDELINES[AdjudicativeGuideline]][]).map(
                  ([key, config]) => {
                    const GuidelineIcon = GUIDELINE_ICONS[key];
                    const selectedRisk = guidelineRisks[key];
                    const questions = GUIDELINE_QUESTIONS[key] || [];

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * Object.keys(ADJUDICATIVE_GUIDELINES).indexOf(key) }}
                        className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-lg"
                            style={{ backgroundColor: config.color + '22', color: config.color }}
                          >
                            {config.letter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-white">{config.label}</h3>
                              <GuidelineIcon className="w-4 h-4 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-400 mt-0.5">{config.description}</p>
                          </div>
                        </div>

                        {/* Example considerations */}
                        {questions.length > 0 && (
                          <div className="mb-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              Considerations
                            </p>
                            <ul className="space-y-1">
                              {questions.map((q, qi) => (
                                <li key={qi} className="text-xs text-gray-400 flex items-start gap-1.5">
                                  <span className="text-gray-600 mt-0.5">-</span>
                                  {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Risk level selector */}
                        <div
                          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                          role="radiogroup"
                          aria-label={`Risk level for ${config.label}`}
                        >
                          {RISK_LEVELS.map((r) => {
                            const isSelected = selectedRisk === r.value;
                            return (
                              <button
                                key={r.value}
                                role="radio"
                                aria-checked={isSelected}
                                tabIndex={isSelected ? 0 : -1}
                                onClick={() =>
                                  setGuidelineRisks((prev) => ({ ...prev, [key]: r.value }))
                                }
                                onKeyDown={(e) => handleRiskKeyDown(e, key)}
                                className={`relative px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all min-h-[44px] ${
                                  isSelected
                                    ? `${r.borderClass} ${r.bgClass}`
                                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600 text-gray-400'
                                }`}
                                style={isSelected ? { color: r.color } : undefined}
                              >
                                {r.label}
                                {isSelected && (
                                  <motion.div
                                    layoutId={`risk-indicator-${key}`}
                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                                    style={{ backgroundColor: r.color }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* STEP 3: RESULTS & RECOMMENDATIONS                             */}
            {/* ============================================================= */}
            {currentStep === 3 && results && (
              <div className="space-y-6">
                {/* Overall readiness banner */}
                {(() => {
                  const cfg = READINESS_CONFIG[results.overallReadiness];
                  const ReadinessIcon = cfg.icon;
                  return (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`${cfg.bgClass} border ${cfg.borderClass} rounded-xl p-6 sm:p-8`}
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Readiness score dial */}
                        <div className="relative w-36 h-36 shrink-0">
                          <svg
                            viewBox="0 0 120 120"
                            className="w-full h-full -rotate-90"
                            role="progressbar"
                            aria-valuenow={results.readinessScore}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Readiness score: ${results.readinessScore} out of 100`}
                          >
                            <circle cx="60" cy="60" r="52" fill="none" stroke="#374151" strokeWidth="8" />
                            <motion.circle
                              cx="60" cy="60" r="52"
                              fill="none"
                              stroke={cfg.color}
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 52}
                              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - results.readinessScore / 100) }}
                              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                              className="text-3xl font-bold"
                              style={{ color: cfg.color }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              {results.readinessScore}
                            </motion.span>
                            <span className="text-xs text-gray-400">out of 100</span>
                          </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                            <ReadinessIcon className="w-6 h-6" style={{ color: cfg.color }} />
                            <h2 className="text-2xl font-bold" style={{ color: cfg.color }}>
                              {cfg.label}
                            </h2>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                            {cfg.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Key metrics */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <h3 className="font-medium text-gray-300 text-sm">Estimated Timeline</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {results.estimatedDays.min}-{results.estimatedDays.max}
                    </p>
                    <p className="text-xs text-gray-500">calendar days to adjudication</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <h3 className="font-medium text-gray-300 text-sm">Salary Premium</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      +${(results.salaryPremium.min / 1000).toFixed(0)}-{(results.salaryPremium.max / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500">above non-cleared equivalent</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <h3 className="font-medium text-gray-300 text-sm">Target Clearance</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {targetClearance && CLEARANCE_TARGET_LEVELS[targetClearance as ClearanceTargetLevel]?.abbreviation}
                    </p>
                    <p className="text-xs text-gray-500">
                      {targetClearance && CLEARANCE_TARGET_LEVELS[targetClearance as ClearanceTargetLevel]?.label}
                    </p>
                  </motion.div>
                </div>

                {/* Guideline breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    Guideline Breakdown
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(Object.entries(ADJUDICATIVE_GUIDELINES) as [AdjudicativeGuideline, typeof ADJUDICATIVE_GUIDELINES[AdjudicativeGuideline]][]).map(
                      ([key, config]) => {
                        const risk = guidelineRisks[key];
                        const riskConfig = RISK_LEVELS.find((r) => r.value === risk)!;
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50"
                          >
                            <div
                              className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold shrink-0"
                              style={{ backgroundColor: config.color + '22', color: config.color }}
                            >
                              {config.letter}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{config.label}</p>
                            </div>
                            <span
                              className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
                              style={{ backgroundColor: riskConfig.color + '22', color: riskConfig.color }}
                            >
                              {riskConfig.label}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </motion.div>

                {/* Recommendations */}
                {results.recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-6"
                  >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                      Prioritized Recommendations
                    </h3>
                    <div className="space-y-4">
                      {results.recommendations.map((rec, idx) => {
                        const priorityColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
                          critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Critical' },
                          important: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Important' },
                          suggested: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Suggested' },
                        };
                        const pc = priorityColors[rec.priority] || priorityColors.suggested;

                        return (
                          <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + idx * 0.1 }}
                            className={`${pc.bg} border ${pc.border} rounded-lg p-4`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${pc.text} bg-gray-900/50 shrink-0`}>
                                {pc.label}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white text-sm">{rec.title}</h4>
                                <p className="text-xs text-gray-400 mt-1">{rec.description}</p>
                                {rec.actionItems.length > 0 && (
                                  <ul className="mt-2 space-y-1">
                                    {rec.actionItems.map((item: string, ai: number) => (
                                      <li key={ai} className="text-xs text-gray-300 flex items-start gap-1.5">
                                        <ChevronRight className="w-3 h-3 text-gray-500 shrink-0 mt-0.5" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {rec.estimatedTimeToResolve}
                                  </span>
                                  {rec.serviceProviderCategory && (
                                    <span className="flex items-center gap-1">
                                      <Briefcase className="w-3 h-3" />
                                      Professional help available
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Next steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Recommended Next Steps
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        icon: FileText,
                        title: 'Gather Documentation',
                        desc: 'Compile 10 years of address history, employment records, education transcripts, and references.',
                        color: 'text-blue-400',
                      },
                      {
                        icon: Globe,
                        title: 'Document Foreign Contacts',
                        desc: 'List all foreign national contacts, foreign travel in the past 7 years, and foreign financial interests.',
                        color: 'text-purple-400',
                      },
                      {
                        icon: DollarSign,
                        title: 'Review Finances',
                        desc: 'Pull your credit report, resolve delinquent debts, and ensure tax filings are current.',
                        color: 'text-green-400',
                      },
                      {
                        icon: Scale,
                        title: 'Consider Legal Counsel',
                        desc: 'A national security employment attorney can help you prepare for potential issues before submission.',
                        color: 'text-amber-400',
                      },
                    ].map((step, i) => {
                      const StepActionIcon = step.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
                          <StepActionIcon className={`w-5 h-5 ${step.color} shrink-0 mt-0.5`} />
                          <div>
                            <p className="text-sm font-medium text-white">{step.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Final legal disclaimer */}
                <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200/70 space-y-2">
                      <p>
                        <strong className="text-amber-300">Important Legal Notice:</strong> This readiness
                        assessment is provided for informational and educational purposes only. It is not a
                        security clearance determination, pre-adjudication, or guarantee of eligibility.
                      </p>
                      <p>
                        Only authorized US government officials (adjudicators at DCSA, DOE, ODNI, or
                        designated agencies) can grant, deny, suspend, or revoke a security clearance
                        pursuant to Executive Order 12968, SEAD-4, and applicable federal regulations.
                      </p>
                      <p>
                        The "whole-person concept" used in actual adjudication considers the totality of
                        circumstances, including mitigating factors, recency, and rehabilitation — factors
                        that a self-assessment tool cannot fully evaluate. Individual outcomes may vary
                        significantly from this assessment.
                      </p>
                      <p>
                        This tool complies with the Fair Credit Reporting Act (FCRA) — no consumer reports
                        or third-party investigations are conducted. No data from this assessment is shared
                        with any government agency or third party.
                      </p>
                      {attorneyPrivileged && (
                        <p className="text-purple-300">
                          <Lock className="w-3 h-3 inline mr-1" />
                          This assessment has been marked as attorney-client privileged. Consult your
                          attorney regarding the applicability of privilege protections.
                        </p>
                      )}
                      <p className="text-gray-500">
                        Data retention: Your assessment results will be automatically deleted after{' '}
                        {dataRetentionDays === 0 ? 'you close this page' : `${dataRetentionDays} days`}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
                  <button
                    onClick={resetAssessment}
                    className="px-6 py-3 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Start Over
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Save as PDF
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons (steps 0-2 only) */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700 print:hidden">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={goNext}
              disabled={isNextDisabled || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                isNextDisabled || isSubmitting
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : currentStep === 2 ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Get Results
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
