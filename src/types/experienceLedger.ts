// ============================================================
// Verified Experience Ledger — TypeScript Types
// Mirrors migration 076 (CLR 2.0-compliant)
// ============================================================

// ── Enumerations ─────────────────────────────────────────────

export type ExperienceType =
  | 'internship' | 'research' | 'project' | 'course'
  | 'hackathon' | 'volunteer' | 'employment'
  | 'extracurricular' | 'certification' | 'publication' | 'other';

export type OrganizationType =
  | 'employer' | 'university' | 'research_lab' | 'nonprofit'
  | 'government' | 'national_lab' | 'startup' | 'other';

/** 1=self-reported … 5=third-party accredited */
export type TrustLevel = 1 | 2 | 3 | 4 | 5;

export type VerificationStatus =
  | 'draft' | 'submitted' | 'notified'
  | 'under_review' | 'verified' | 'rejected' | 'revision_requested';

export type VerifierType =
  | 'faculty' | 'supervisor' | 'peer' | 'hr' | 'accreditor' | 'advisor';

export type EvidenceType =
  | 'file' | 'url' | 'github' | 'paper' | 'video' | 'image' | 'certificate' | 'demo';

export type ExtractionMethod =
  | 'manual' | 'ai_extracted' | 'institution_mapped' | 'employer_confirmed';

export type VerificationEventType =
  | 'created' | 'submitted' | 'verifier_notified' | 'verifier_viewed'
  | 'verification_started' | 'revision_requested'
  | 'verified' | 'rejected' | 'withdrawn' | 'expired' | 'skill_extracted';

export type PipelineStatus =
  | 'saved' | 'contacted' | 'interviewing' | 'offered' | 'hired' | 'archived';

export type SkillType = 'knowledge' | 'skill' | 'competence' | 'attitude';

// ── Core Models ───────────────────────────────────────────────

export interface SkillTaxonomyEntry {
  id: string;
  esco_uri: string | null;
  label: string;
  alt_labels: string[];
  description: string | null;
  skill_type: SkillType | null;
  broader_uri: string | null;
  isco_group: string | null;
  onet_element: string | null;
  is_stem: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ExtractedSkill {
  esco_uri: string | null;
  label: string;
  confidence: number;        // 0–1
  evidence_span: string | null;
  extraction_method: ExtractionMethod;
}

export interface PortfolioProfile {
  id: string;
  user_id: string;
  headline: string | null;
  bio: string | null;
  target_role: string | null;
  target_industries: string[];
  is_discoverable: boolean;
  discoverability_score: number;   // 0–100
  verified_experience_count: number;
  clr_learner_id: string;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  location: string | null;
  is_open_to_opportunities: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerifiedExperience {
  id: string;
  user_id: string;
  portfolio_id: string | null;

  // CLR fields
  title: string;
  description: string | null;
  experience_type: ExperienceType;

  // Organization
  organization_name: string | null;
  organization_type: OrganizationType | null;
  organization_id: string | null;

  // Dates
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;

  // Location
  location: string | null;
  is_remote: boolean;

  // Trust & verification
  trust_level: TrustLevel;
  verification_status: VerificationStatus;

  // Verifier
  verifier_name: string | null;
  verifier_email: string | null;
  verifier_title: string | null;
  verifier_type: VerifierType | null;
  verifier_user_id: string | null;
  verified_at: string | null;
  verifier_notes: string | null;

  // AI-extracted
  extracted_skills: ExtractedSkill[];
  capability_tags: string[];

  // Display
  is_featured: boolean;
  clr_achievement_type: string;
  clr_achievement_id: string | null;

  created_at: string;
  updated_at: string;

  // Joined data (from queries)
  evidence?: ExperienceEvidence[];
  skills?: ExperienceSkill[];
}

export interface ExperienceEvidence {
  id: string;
  experience_id: string;
  user_id: string;
  evidence_type: EvidenceType;
  title: string;
  url: string | null;
  file_path: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  description: string | null;
  is_public: boolean;
  uploaded_at: string;
}

export interface ExperienceSkill {
  id: string;
  experience_id: string;
  user_id: string;
  esco_uri: string | null;
  esco_label: string;
  skill_type: SkillType | null;
  confidence: number | null;
  evidence_span: string | null;
  extraction_method: ExtractionMethod;
  is_verified: boolean;
  endorsed_by_verifier: boolean;
  created_at: string;
}

export interface VerificationEvent {
  id: string;
  experience_id: string;
  event_type: VerificationEventType;
  actor_type: 'student' | 'verifier' | 'system' | 'admin';
  actor_user_id: string | null;
  actor_name: string | null;
  previous_status: string | null;
  new_status: string | null;
  previous_trust: number | null;
  new_trust: number | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface EmployerTalentSave {
  id: string;
  employer_id: string;
  student_id: string;
  pipeline_status: PipelineStatus;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ── Form / Input Types ────────────────────────────────────────

export interface CreateExperienceInput {
  title: string;
  description: string;
  experience_type: ExperienceType;
  organization_name: string;
  organization_type: OrganizationType;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location: string;
  is_remote: boolean;
}

export interface SubmitVerificationInput {
  experience_id: string;
  verifier_name: string;
  verifier_email: string;
  verifier_title: string;
  verifier_type: VerifierType;
  notes?: string;
}

export interface AddEvidenceInput {
  experience_id: string;
  evidence_type: EvidenceType;
  title: string;
  url?: string;
  description?: string;
  is_public?: boolean;
}

export interface AddSkillInput {
  experience_id: string;
  esco_uri?: string;
  esco_label: string;
  skill_type?: SkillType;
  confidence?: number;
  evidence_span?: string;
  extraction_method?: ExtractionMethod;
}

export interface UpdatePortfolioInput {
  headline?: string;
  bio?: string;
  target_role?: string;
  target_industries?: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  location?: string;
  is_open_to_opportunities?: boolean;
}

// ── UI Display Helpers ────────────────────────────────────────

export const TRUST_LEVEL_LABELS: Record<TrustLevel, string> = {
  1: 'Self-Reported',
  2: 'Peer Attested',
  3: 'Institutionally Verified',
  4: 'Employer Verified',
  5: 'Accredited',
};

export const TRUST_LEVEL_COLORS: Record<TrustLevel, string> = {
  1: 'text-gray-400 bg-gray-800 border-gray-700',
  2: 'text-blue-400 bg-blue-900/30 border-blue-700',
  3: 'text-emerald-400 bg-emerald-900/30 border-emerald-700',
  4: 'text-violet-400 bg-violet-900/30 border-violet-700',
  5: 'text-amber-400 bg-amber-900/30 border-amber-700',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  notified: 'Verifier Notified',
  under_review: 'Under Review',
  verified: 'Verified',
  rejected: 'Not Verified',
  revision_requested: 'Revision Needed',
};

export const EXPERIENCE_TYPE_LABELS: Record<ExperienceType, string> = {
  internship: 'Internship',
  research: 'Research',
  project: 'Project',
  course: 'Coursework',
  hackathon: 'Hackathon',
  volunteer: 'Volunteer',
  employment: 'Employment',
  extracurricular: 'Extracurricular',
  certification: 'Certification',
  publication: 'Publication',
  other: 'Other',
};

export const EXPERIENCE_TYPE_ICONS: Record<ExperienceType, string> = {
  internship: '💼',
  research: '🔬',
  project: '🚀',
  course: '📚',
  hackathon: '⚡',
  volunteer: '🤝',
  employment: '🏢',
  extracurricular: '🎯',
  certification: '🏆',
  publication: '📄',
  other: '📌',
};

// ── Employer-Facing Talent Profile (joined view) ──────────────

export interface TalentProfile {
  user_id: string;
  portfolio: PortfolioProfile;
  top_experiences: VerifiedExperience[];  // max 3 featured/verified
  top_skills: ExperienceSkill[];           // aggregated, deduplicated
  verified_count: number;
  highest_trust_level: TrustLevel;
  save?: EmployerTalentSave | null;        // employer's CRM state
}
