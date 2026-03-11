import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Search, Book, FileText, AlertTriangle, CheckCircle,
  ChevronRight, ChevronDown, MessageSquare, Send, Bot, User,
  Clock, Tag, ExternalLink, HelpCircle, Scale, Lock, Bookmark,
  Star, Plus, X, Info
} from 'lucide-react';
import type { NISPOMArticle, IncidentType } from '../../types/clearanceReadiness';
import { INCIDENT_TYPES, CLEARANCE_TARGET_LEVELS } from '../../types/clearanceReadiness';

// ============================================================================
// NISPOM COMPLIANCE Q&A ASSISTANT PAGE
// AI-powered compliance guidance for FSOs and security professionals
// ============================================================================

// ---------------------------------------------------------------------------
// DATA: NISPOM Chapter Quick Reference Cards
// ---------------------------------------------------------------------------

const NISPOM_CHAPTERS: NISPOMArticle[] = [
  {
    id: 'ch2-fcl',
    chapter: 'Chapter 2',
    section: '§ 117.9',
    title: 'Facility Clearances (FCL)',
    summary: 'Requirements for obtaining and maintaining a Facility Security Clearance, including organizational structure, key management personnel, and exclusion procedures.',
    keyRequirements: [
      'Designate a Facility Security Officer (FSO) with U.S. citizenship and PCL at the highest level of the FCL',
      'Maintain a current DD Form 441 (DoD Security Agreement) or equivalent',
      'Report changes to Key Management Personnel (KMP) within 5 business days',
      'Ensure FOCI (Foreign Ownership, Control, or Influence) mitigation is in place if applicable',
    ],
    commonViolations: [
      'Failure to report KMP changes within required timeframe',
      'Operating without a properly cleared FSO',
      'Inadequate FOCI reporting or mitigation measures',
    ],
    bestPractices: [
      'Maintain a succession plan for the FSO role',
      'Conduct annual self-inspections per 32 CFR 117.15',
      'Document all KMP changes in NISS promptly',
    ],
    relatedSEADs: ['SEAD-3', 'SEAD-6'],
    lastUpdated: '2024-02-15',
  },
  {
    id: 'ch3-personnel',
    chapter: 'Chapter 3',
    section: '§ 117.10',
    title: 'Personnel Security Clearances (PCL)',
    summary: 'Requirements for requesting, granting, and managing Personnel Security Clearances, including investigation types, interim clearances, and debriefing procedures.',
    keyRequirements: [
      'Submit SF-86 via e-QIP for all clearance-eligible positions',
      'Verify need-to-know before granting access to classified information',
      'Conduct initial security briefings before granting access',
      'Debrief personnel upon termination, transfer, or clearance revocation',
    ],
    commonViolations: [
      'Granting access before investigation completion without interim authorization',
      'Failure to debrief employees upon departure',
      'Not maintaining signed SF-312 (Classified Information NDA) on file',
      'Allowing access without verified need-to-know',
    ],
    bestPractices: [
      'Maintain a centralized clearance tracking database synced with DISS',
      'Implement 90-day advance reinvestigation submission process',
      'Conduct annual refresher briefings for all cleared personnel',
    ],
    relatedSEADs: ['SEAD-3', 'SEAD-4', 'SEAD-7'],
    lastUpdated: '2024-02-15',
  },
  {
    id: 'ch4-classification',
    chapter: 'Chapter 4',
    section: '§ 117.11',
    title: 'Classification & Marking',
    summary: 'Procedures for applying classification markings, derivative classification, and declassification responsibilities for contractor personnel.',
    keyRequirements: [
      'All derivative classifiers must receive training before classifying and every 2 years thereafter',
      'Apply portion markings, overall classification, and classification authority block to all classified documents',
      'Maintain a copy of the applicable Security Classification Guide (SCG)',
      'Challenge classification decisions believed to be improper per EO 13526 § 1.8',
    ],
    commonViolations: [
      'Missing or incorrect portion markings on classified documents',
      'Derivative classification training not current',
      'Using outdated Security Classification Guides',
      'Failure to apply "Classified By" and "Derived From" lines',
    ],
    bestPractices: [
      'Conduct quarterly classification marking reviews',
      'Maintain a library of current SCGs with version control',
      'Implement automated marking tools where feasible',
    ],
    relatedSEADs: ['SEAD-1'],
    lastUpdated: '2024-02-15',
  },
  {
    id: 'ch5-safeguarding',
    chapter: 'Chapter 5',
    section: '§ 117.13',
    title: 'Safeguarding Classified Information',
    summary: 'Physical security standards for protecting classified information, including storage requirements, end-of-day checks, and information system security.',
    keyRequirements: [
      'Store classified material in GSA-approved containers or approved secure rooms',
      'Conduct end-of-day security checks using SF-702 (Security Container Check Sheet)',
      'Implement the SF-701 (Activity Security Checklist) for daily close-out',
      'Maintain visitor control logs and escort procedures for restricted areas',
    ],
    commonViolations: [
      'Unsecured classified material (left on desks, unlocked containers)',
      'Incomplete or missing SF-702 security check sheets',
      'Failure to change combinations when required (upon initial use, compromise, or personnel change)',
      'Transmitting classified information via unapproved methods',
    ],
    bestPractices: [
      'Implement two-person integrity (TPI) for Top Secret material',
      'Conduct random after-hours security checks',
      'Maintain a clean desk policy in areas processing classified information',
    ],
    relatedSEADs: ['SEAD-3'],
    lastUpdated: '2024-02-15',
  },
  {
    id: 'ch6-visits',
    chapter: 'Chapter 6',
    section: '§ 117.14',
    title: 'Visits & Meetings',
    summary: 'Procedures for visit authorization letters (VALs), classified meetings, and disclosure to foreign nationals under approved programs.',
    keyRequirements: [
      'Submit Visit Authorization Letters (VALs) before visits involving classified access',
      'Verify visitor clearance and need-to-know through DISS before granting access',
      'Classified meetings require advance approval from the CSA',
      'Foreign national visits require specific ITAR/EAR and disclosure authorization',
    ],
    commonViolations: [
      'Visits conducted without a current VAL on file',
      'Failure to verify clearance status of visitors in DISS',
      'Unauthorized disclosure of classified information during meetings',
      'Inadequate control of classified materials at off-site meetings',
    ],
    bestPractices: [
      'Establish a recurring VAL for frequent visitors',
      'Maintain a visitor log with clearance verification records',
      'Pre-brief meeting attendees on classification levels and disclosure limits',
    ],
    relatedSEADs: ['SEAD-3', 'SEAD-5'],
    lastUpdated: '2024-02-15',
  },
  {
    id: 'ch7-subcontracting',
    chapter: 'Chapter 7',
    section: '§ 117.15',
    title: 'Subcontracting & Prime Contractor Responsibilities',
    summary: 'Requirements for flowing down security requirements to subcontractors, DD Form 254 management, and oversight obligations.',
    keyRequirements: [
      'Issue a DD Form 254 (Contract Security Classification Specification) to all subcontractors requiring access to classified information',
      'Verify subcontractor FCL status in DISS before sharing classified information',
      'Flow down security requirements commensurate with the classified work scope',
      'Conduct periodic reviews to ensure subcontractor compliance',
    ],
    commonViolations: [
      'Incomplete or inaccurate DD Form 254 issued to subcontractors',
      'Failure to verify subcontractor FCL before sharing classified materials',
      'Not updating the DD Form 254 when classification requirements change',
      'Inadequate oversight of subcontractor security programs',
    ],
    bestPractices: [
      'Review all DD Form 254s annually or upon contract modification',
      'Maintain a subcontractor security tracking matrix',
      'Include security requirements in subcontract statements of work',
    ],
    relatedSEADs: ['SEAD-3'],
    lastUpdated: '2024-02-15',
  },
];

const CHAPTER_COLORS: Record<string, { icon: string; bg: string; border: string }> = {
  'Chapter 2': { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  'Chapter 3': { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  'Chapter 4': { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  'Chapter 5': { icon: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  'Chapter 6': { icon: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  'Chapter 7': { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
};

const CHAPTER_ICONS = [Shield, User, Tag, Lock, MessageSquare, FileText];

// ---------------------------------------------------------------------------
// DATA: AI Knowledge Base for Q&A
// ---------------------------------------------------------------------------

interface QAEntry {
  question: string;
  answer: string;
  citation: string;
  bestPracticeTip: string;
  relatedTopics: string[];
}

const KNOWLEDGE_BASE: QAEntry[] = [
  {
    question: 'What are the SEAD-3 reporting timeframes?',
    answer: 'SEAD-3 (Reporting Requirements for Personnel with Access to Classified Information or Who Hold a Sensitive Position) establishes specific reporting timeframes for covered individuals and their supervisors:\n\n- **Immediately**: Unauthorized disclosure of classified information, insider threat indicators, espionage/sabotage, coercion or blackmail attempts.\n- **Within 24 hours**: IT systems security incidents, loss or compromise of classified material.\n- **Within 72 hours**: Arrest, criminal charges, or citations (excluding minor traffic violations under $300).\n- **Within 5 business days**: Substance abuse treatment, significant financial changes (bankruptcy, garnishment), changes in marital status.\n- **Within 10 business days**: Foreign contacts of a close and continuing nature, foreign travel (pre-travel reporting preferred).\n- **Within 30 days**: Significant financial changes such as bankruptcy filing.\n\nFSOs must ensure all cleared employees understand these timeframes through initial and recurring security briefings.',
    citation: 'SEAD-3 (Security Executive Agent Directive 3), Sections 4.1-4.5; 32 CFR § 117.13(d)',
    bestPracticeTip: 'Create a one-page quick-reference card for SEAD-3 reporting timeframes and distribute it to all cleared personnel. Include it in annual refresher briefings and post it in secure work areas.',
    relatedTopics: ['Incident Reporting', 'Foreign Travel', 'Foreign Contacts', 'Security Briefings'],
  },
  {
    question: 'How do I handle a foreign travel report?',
    answer: 'Foreign travel reporting for cleared personnel involves several steps:\n\n**Pre-Travel (Recommended):**\n1. The cleared employee completes a Foreign Travel Briefing Request, ideally 30 days before departure.\n2. The FSO conducts a pre-travel threat briefing covering the destination country\'s intelligence threat, social engineering tactics, and device security.\n3. Document the briefing in the employee\'s security file.\n4. Report the travel in NISS (National Industrial Security System) if required by your CSA.\n\n**During Travel:**\n- Employees should not carry classified devices or media.\n- Report any suspicious contacts or approaches to the FSO upon return.\n- Follow organizational policy on personal electronic device usage.\n\n**Post-Travel (Within 5 business days of return):**\n1. The employee submits a post-travel debrief form.\n2. The FSO conducts a post-travel debriefing, asking about unusual contacts, approaches, or incidents.\n3. Document the debrief and any reported contacts.\n4. Report any suspicious activity to the CSA and FBI if applicable.\n\n**Countries of Concern**: Enhanced procedures apply for travel to countries identified as intelligence threats by the ODNI.',
    citation: 'SEAD-3, Section 4.2; 32 CFR § 117.13(d)(3); DCSA Industrial Security Letter 2020-01',
    bestPracticeTip: 'Maintain a standardized foreign travel briefing/debriefing form and track all foreign travel in a centralized log. Consider implementing a digital travel request system integrated with your security management platform.',
    relatedTopics: ['SEAD-3 Reporting', 'Threat Briefings', 'Counterintelligence', 'NISS Reporting'],
  },
  {
    question: 'What are TW 2.0 continuous vetting requirements?',
    answer: 'Trusted Workforce 2.0 (TW 2.0) is the federal government\'s initiative to modernize personnel vetting. Key elements:\n\n**Core Changes:**\n- Replaces periodic reinvestigations with **Continuous Vetting (CV)** — an ongoing automated review of relevant information.\n- Implements a tiered investigation framework (Tier 1-5) replacing legacy investigation types (NACLC, SSBI, etc.).\n- Introduces **reciprocity** standards to reduce redundant investigations across agencies.\n\n**Continuous Vetting Components:**\n- **Automated Record Checks**: Continuous checks of criminal, financial, and other databases.\n- **CV Alerts**: When derogatory information is detected, the system generates an alert for FSO/agency review.\n- **Enrollment**: All cleared personnel must be enrolled in CV. DCSA manages enrollment for industry through DISS.\n- **FSO Responsibilities**: Monitor CV alerts in DISS, respond within required timeframes, conduct follow-up assessments.\n\n**Timeline & Current Status:**\n- Phased implementation began in 2021.\n- DCSA has enrolled a significant portion of the cleared population in CV.\n- Full implementation continues through 2025-2026.\n\n**Investigation Tiers Under TW 2.0:**\n- Tier 1: Low-risk, non-sensitive positions\n- Tier 2: Moderate-risk public trust\n- Tier 3: Non-critical sensitive / Secret\n- Tier 4: High-risk public trust\n- Tier 5: Critical sensitive / Top Secret',
    citation: 'ODNI Trusted Workforce 2.0 Policy Framework; DCSA Implementation Guidance; PM-ISE Policy Alignment Memorandum',
    bestPracticeTip: 'Ensure all cleared personnel are enrolled in CV through DISS. Establish an internal process for responding to CV alerts with defined escalation paths. Train your security staff on the DISS CV alert dashboard.',
    relatedTopics: ['Reinvestigation Intervals', 'DISS', 'Personnel Security', 'Continuous Vetting Alerts'],
  },
  {
    question: 'When is a TCP required under ITAR?',
    answer: 'A Technology Control Plan (TCP) is required when your facility handles classified or export-controlled technical data and employs foreign nationals, or when foreign-owned companies are involved in classified work under FOCI mitigation.\n\n**TCP is required when:**\n1. **Foreign nationals** are employed by or visiting a cleared facility and may be exposed to classified or export-controlled information.\n2. **FOCI mitigation** agreements (SSA, SCA, PA, VTA) are in place requiring technology segregation.\n3. **Classified contracts** involve ITAR-controlled technical data shared with foreign partners under an approved export authorization.\n4. **Co-located facilities** where cleared and uncleared work occurs in proximity.\n\n**TCP Must Address:**\n- Physical barriers (locked rooms, badge access controls)\n- IT segregation (separate networks, access controls)\n- Personnel controls (escort procedures, access lists)\n- Document control procedures\n- Training requirements for all affected personnel\n- Monitoring and compliance verification procedures\n\n**Approval Process:**\n- Submit the TCP to your CSA (typically DCSA) for review and approval.\n- The TCP must be reviewed and updated annually or when circumstances change.\n- DCSA may conduct on-site reviews to verify TCP implementation.\n\n**ITAR Nexus**: Under 22 CFR § 120-130 (ITAR), release of controlled technical data to foreign nationals constitutes an export, even within the United States ("deemed export"). A TCP helps demonstrate compliance.',
    citation: '32 CFR § 117.9(i); ITAR 22 CFR § 120.17 (Deemed Export); DCSA Assessment & Authorization Process Guide',
    bestPracticeTip: 'Involve your Export Control Officer (ECO) and FSO jointly when developing a TCP. Map all ITAR-controlled programs and data repositories, then overlay foreign national access patterns to identify gaps.',
    relatedTopics: ['ITAR Compliance', 'Export Control', 'FOCI Mitigation', 'Foreign National Employment'],
  },
  {
    question: 'What are the reinvestigation intervals for each clearance type?',
    answer: 'Under the traditional periodic reinvestigation (PR) model and the evolving TW 2.0 framework:\n\n**Traditional PR Intervals (Legacy):**\n- **Secret / Confidential (NACLC/Tier 3)**: Every 10 years\n- **Top Secret (SSBI/Tier 5)**: Every 5 years (6 years under TW 2.0)\n- **Top Secret/SCI**: Every 5 years\n- **DOE L Clearance**: Every 10 years\n- **DOE Q Clearance**: Every 5 years\n- **Public Trust (Tier 2)**: Every 5 years\n\n**TW 2.0 Changes:**\n- Periodic reinvestigations are being **replaced by Continuous Vetting (CV)**.\n- Under CV, automated checks run continuously rather than at fixed intervals.\n- However, during the transition period, periodic reinvestigation timelines still apply for personnel not yet enrolled in CV.\n- Top Secret reinvestigation interval extended from 5 to **6 years** under TW 2.0.\n\n**FSO Responsibilities:**\n- Track reinvestigation due dates for all cleared personnel.\n- Submit reinvestigation requests **90 days before** the due date.\n- Ensure personnel complete updated SF-86 in e-QIP promptly.\n- Monitor DISS for reinvestigation status updates.\n- Verify CV enrollment for all eligible personnel.',
    citation: '32 CFR § 117.10(b); ICD 704 (IC); DCSA Transition Guidance for TW 2.0; 10 CFR § 710 (DOE)',
    bestPracticeTip: 'Build an automated calendar system that triggers alerts at 120 days, 90 days, and 60 days before reinvestigation due dates. Cross-reference DISS records monthly to catch any discrepancies.',
    relatedTopics: ['TW 2.0', 'Continuous Vetting', 'SF-86', 'DISS', 'Personnel Security'],
  },
  {
    question: 'What is a DD Form 254 and when do I need one?',
    answer: 'The DD Form 254 (Department of Defense Contract Security Classification Specification) is the primary vehicle for communicating security classification requirements from a government contracting activity (GCA) or prime contractor to a contractor or subcontractor.\n\n**When Required:**\n- Any contract, subcontract, or agreement that requires access to classified information.\n- Task orders or delivery orders under classified contracts.\n- When security classification requirements change on an existing contract.\n\n**Key Elements:**\n1. **Classification level** of the contract (up to the highest level of classified access required).\n2. **Performance locations** where classified work will occur.\n3. **Security Classification Guide** reference.\n4. **Special requirements**: SAP access, COMSEC, TEMPEST, NATO, CNWDI, etc.\n5. **Subcontracting provisions** — whether the contractor can flow down classified work.\n6. **Disposition instructions** for classified material at contract completion.\n\n**FSO Responsibilities:**\n- Review the DD 254 at contract award and ensure requirements can be met.\n- Issue subcontractor DD 254s that are consistent with the prime DD 254.\n- Review all DD 254s annually and whenever contract modifications occur.\n- Maintain copies of all DD 254s (prime and subcontractor) in the facility security files.',
    citation: '32 CFR § 117.15; DoD Manual 5220.22, Volume 2; DCSA Assessment & Authorization',
    bestPracticeTip: 'Create a DD 254 review checklist that maps each block to your facility capabilities. Review new DD 254s within 5 business days of receipt and immediately flag any requirements your facility cannot meet.',
    relatedTopics: ['Subcontracting', 'Contract Security', 'Classification Guides', 'DCSA Oversight'],
  },
  {
    question: 'How do I conduct a self-inspection?',
    answer: 'Self-inspections are required under 32 CFR § 117.15(a) and are a critical element of your facility\'s security program.\n\n**Frequency:**\n- At least annually, or as directed by your CSA.\n- Many CSAs recommend semi-annual self-inspections.\n\n**Scope Must Cover:**\n1. **Facility Clearance (FCL)**: KMP status, FOCI reporting, organizational changes.\n2. **Personnel Security**: Clearance roster accuracy, briefing/debriefing currency, SF-312 files.\n3. **Classification Management**: Derivative classifier training, marking reviews, SCG currency.\n4. **Safeguarding**: Container inspections, SF-702/701 compliance, access controls, combination management.\n5. **Visits & Meetings**: VAL procedures, visitor logs, foreign national controls.\n6. **Subcontracting**: DD 254 review, subcontractor FCL verification.\n7. **IT/IS Security**: System security plans, ATO currency, STIG compliance (if applicable).\n8. **Insider Threat Program**: Training, monitoring, referral procedures.\n9. **Reporting**: SEAD-3 compliance, adverse information reporting, NISS submissions.\n\n**Process:**\n- Use the DCSA Self-Inspection Handbook as your baseline.\n- Document all findings (positive and negative).\n- Develop corrective action plans for deficiencies with target completion dates.\n- Brief management on findings and corrective actions.\n- Retain records for at least 3 years.',
    citation: '32 CFR § 117.15(a); DCSA Self-Inspection Handbook; DCSA Assessment & Authorization Process Guide',
    bestPracticeTip: 'Stagger your self-inspection across quarters rather than doing everything at once. This provides continuous compliance monitoring and reduces the burden on your security team.',
    relatedTopics: ['DCSA Assessments', 'Corrective Actions', 'Insider Threat', 'Security Management'],
  },
  {
    question: 'What is the insider threat program requirement?',
    answer: 'Under 32 CFR § 117.12 and Executive Order 13587, all cleared contractor facilities must establish and maintain an insider threat program.\n\n**Minimum Requirements:**\n1. **Designate an Insider Threat Program Senior Official (ITPSO)** — must hold a PCL at the same level as the FCL.\n2. **Establish written procedures** for gathering, integrating, and reporting insider threat information.\n3. **Training**: All cleared employees must receive initial and annual insider threat awareness training.\n4. **Reporting**: Establish procedures for cleared employees to report insider threat indicators.\n5. **Access to Information**: The ITPSO must have access to relevant CI, security, HR, IT, and legal data.\n\n**Behavioral Indicators to Monitor:**\n- Unexplained financial changes or affluence\n- Unusual work hours or access patterns\n- Foreign travel or contacts outside normal duties\n- Disgruntlement or workplace conflicts\n- Unauthorized IT access or data transfers\n- Violations of security procedures\n\n**User Activity Monitoring (UAM):**\n- Required for classified information systems per CNSSD 504.\n- Must monitor user activity on classified networks.\n- Audit logs must be retained per agency requirements.\n\n**FSO/ITPSO Coordination:**\n- Regular meetings between FSO, ITPSO, HR, IT, and legal.\n- Establish referral procedures for concerning behavior.\n- Coordinate with the CSA and FBI as appropriate.',
    citation: '32 CFR § 117.12; Executive Order 13587; CNSSD 504; NITTF Maturity Framework',
    bestPracticeTip: 'Implement a quarterly insider threat working group meeting with representatives from security, HR, IT, legal, and management. Use the NITTF Maturity Framework to assess and improve your program.',
    relatedTopics: ['Security Training', 'User Activity Monitoring', 'Counterintelligence', 'SEAD-3 Reporting'],
  },
];

// Pre-built question suggestions
const SUGGESTED_QUESTIONS = [
  'What are the SEAD-3 reporting timeframes?',
  'How do I handle a foreign travel report?',
  'What are TW 2.0 continuous vetting requirements?',
  'When is a TCP required under ITAR?',
  'What are the reinvestigation intervals for each clearance type?',
  'What is a DD Form 254 and when do I need one?',
  'How do I conduct a self-inspection?',
  'What is the insider threat program requirement?',
];

// ---------------------------------------------------------------------------
// DATA: SEAD Index
// ---------------------------------------------------------------------------

const SEAD_INDEX = [
  { id: 'SEAD-1', title: 'SEAD-1: Procedures for Safeguarding Classified National Security Information', description: 'Establishes procedures for safeguarding classified information in industrial security.' },
  { id: 'SEAD-2', title: 'SEAD-2: Use of Polygraph in Personnel Security', description: 'Governs the use of polygraph examinations in the personnel security process.' },
  { id: 'SEAD-3', title: 'SEAD-3: Reporting Requirements for Personnel with Access to Classified Information', description: 'Defines mandatory reporting requirements for security-significant events.' },
  { id: 'SEAD-4', title: 'SEAD-4: National Security Adjudicative Guidelines', description: 'The 13 adjudicative guidelines used for all national security eligibility determinations.' },
  { id: 'SEAD-5', title: 'SEAD-5: Collection, Use, and Retention of Publicly Available Social Media Information', description: 'Governs the use of social media in personnel vetting.' },
  { id: 'SEAD-6', title: 'SEAD-6: Continuous Evaluation', description: 'Framework for continuous evaluation and vetting of cleared personnel.' },
  { id: 'SEAD-7', title: 'SEAD-7: Reciprocity of Background Investigations and National Security Adjudicative Results', description: 'Ensures reciprocal acceptance of clearances across agencies.' },
  { id: 'SEAD-8', title: 'SEAD-8: Temporary Eligibility', description: 'Procedures for granting interim or temporary eligibility for access to classified information.' },
];

// ---------------------------------------------------------------------------
// DATA: Common Forms Reference
// ---------------------------------------------------------------------------

const COMMON_FORMS = [
  { form: 'SF-86', title: 'Questionnaire for National Security Positions', usage: 'Required for all personnel security investigations (Secret, Top Secret, SCI)' },
  { form: 'SF-85P', title: 'Questionnaire for Public Trust Positions', usage: 'Required for moderate and high-risk public trust positions' },
  { form: 'SF-312', title: 'Classified Information Nondisclosure Agreement', usage: 'Must be signed before access to classified information; retain in security file' },
  { form: 'SF-702', title: 'Security Container Check Sheet', usage: 'Daily end-of-day verification that security containers are properly secured' },
  { form: 'SF-701', title: 'Activity Security Checklist', usage: 'Daily close-out checklist for areas where classified information is processed' },
  { form: 'SF-703', title: 'Top Secret Cover Sheet', usage: 'Affixed to Top Secret documents when removed from storage' },
  { form: 'SF-704', title: 'Secret Cover Sheet', usage: 'Affixed to Secret documents when removed from storage' },
  { form: 'SF-705', title: 'Confidential Cover Sheet', usage: 'Affixed to Confidential documents when removed from storage' },
  { form: 'DD-254', title: 'Contract Security Classification Specification', usage: 'Communicates classified contract security requirements to contractors' },
  { form: 'DD-441', title: 'DoD Security Agreement', usage: 'Agreement between DoD and the contractor for the facility security program' },
  { form: 'SF-311', title: 'Agency Security Classification Management Program Data', usage: 'Annual reporting of classification activity' },
  { form: 'SF-706/SF-707/SF-708/SF-710', title: 'Classification Marking Labels', usage: 'Applied to media, equipment, and materials containing classified information' },
];

// ---------------------------------------------------------------------------
// DATA: Incident Reporting Guide (expanded details)
// ---------------------------------------------------------------------------

interface IncidentGuideEntry {
  type: IncidentType;
  whoToNotify: string[];
  documentationRequired: string[];
  steps: string[];
}

const INCIDENT_GUIDE: IncidentGuideEntry[] = [
  {
    type: 'foreign-contact',
    whoToNotify: ['FSO', 'Cognizant Security Agency (CSA)', 'Counterintelligence Office (if suspicious)'],
    documentationRequired: ['Name and nationality of contact', 'Nature and circumstances of contact', 'Frequency and duration', 'Whether classified information was discussed'],
    steps: ['Employee reports foreign contact to FSO', 'FSO evaluates if contact is close and continuing', 'FSO documents contact in security file', 'Report to CSA through NISS if reportable', 'Conduct threat assessment if contact involves intelligence threat country'],
  },
  {
    type: 'foreign-travel',
    whoToNotify: ['FSO (pre-travel)', 'CSA (via NISS)', 'Counterintelligence (if travel to threat country)'],
    documentationRequired: ['Destination country and cities', 'Travel dates', 'Purpose of travel', 'Contacts planned', 'Electronic devices carried', 'Post-travel debrief form'],
    steps: ['Employee requests pre-travel briefing (30 days advance)', 'FSO conducts threat briefing for destination', 'FSO documents travel in security file', 'Employee travels with no classified materials or devices', 'Employee submits post-travel debrief within 5 days of return', 'FSO conducts debrief and reports any concerns'],
  },
  {
    type: 'financial-change',
    whoToNotify: ['FSO', 'CSA (if significant concern)'],
    documentationRequired: ['Nature of financial change', 'Amounts involved (if applicable)', 'Steps being taken to resolve', 'Court documentation (if bankruptcy)'],
    steps: ['Employee self-reports financial change to FSO', 'FSO documents the report in security file', 'FSO evaluates whether change raises security concerns', 'Report to CSA if significant (bankruptcy, garnishment, foreign financial interests)', 'Follow up on resolution at regular intervals'],
  },
  {
    type: 'legal-arrest',
    whoToNotify: ['FSO (within 72 hours)', 'CSA (through adverse information report)', 'Legal counsel'],
    documentationRequired: ['Date, location, and nature of arrest', 'Charges filed', 'Court dates and disposition', 'Attorney information'],
    steps: ['Employee reports arrest to FSO within 72 hours', 'FSO documents incident and conducts initial assessment', 'FSO submits adverse information report to CSA via NISS', 'Consider interim suspension of access pending resolution', 'Track case through court proceedings', 'Report disposition to CSA'],
  },
  {
    type: 'legal-conviction',
    whoToNotify: ['FSO (within 72 hours)', 'CSA (through adverse information report)', 'HR and legal counsel'],
    documentationRequired: ['Conviction details and charges', 'Sentencing information', 'Probation terms (if applicable)', 'Court records'],
    steps: ['Employee reports conviction to FSO within 72 hours', 'FSO submits adverse information report to CSA', 'CSA conducts adjudicative review', 'Implement access restrictions if directed by CSA', 'Monitor compliance with any probation terms', 'Document final disposition in security file'],
  },
  {
    type: 'substance-abuse',
    whoToNotify: ['FSO', 'CSA', 'Employee Assistance Program (EAP)'],
    documentationRequired: ['Nature of substance involved', 'Whether treatment is being sought', 'Impact on work performance', 'Medical documentation (with consent)'],
    steps: ['Employee self-reports or supervisor reports concern', 'FSO documents report with sensitivity to medical privacy', 'Refer employee to EAP', 'Report to CSA per SEAD-3 requirements', 'Consider temporary access modification pending evaluation', 'Monitor treatment compliance and recovery'],
  },
  {
    type: 'mental-health',
    whoToNotify: ['FSO (with medical privacy protections)', 'CSA (only if judgment/reliability affected)'],
    documentationRequired: ['General nature of concern (not diagnosis details)', 'Whether treatment is being received', 'Impact assessment on duties'],
    steps: ['Handle with extreme sensitivity to medical privacy and anti-stigma provisions', 'Document only what is required by SEAD-4 Guideline I', 'SEAD-4 specifically states that seeking mental health treatment is NOT disqualifying', 'Report to CSA only if condition materially affects reliability or judgment', 'Refer to EAP and provide supportive resources', 'Do NOT penalize seeking mental health care'],
  },
  {
    type: 'security-violation',
    whoToNotify: ['FSO (immediately)', 'CSA', 'Information owner/originator'],
    documentationRequired: ['What classified information was involved', 'Classification level', 'How the violation occurred', 'Who was exposed', 'Remedial actions taken', 'Preliminary inquiry results'],
    steps: ['Secure the classified material immediately', 'FSO conducts preliminary inquiry within 24 hours', 'Determine scope: infraction (minor) vs. violation (significant)', 'Report to CSA within 24 hours for violations', 'Conduct damage assessment if unauthorized disclosure occurred', 'Implement corrective actions and retrain personnel', 'Document in security file and incident log'],
  },
  {
    type: 'unauthorized-disclosure',
    whoToNotify: ['FSO (immediately)', 'CSA (immediately)', 'Original Classification Authority (OCA)', 'FBI (if espionage suspected)'],
    documentationRequired: ['Classification level and category', 'What information was disclosed', 'To whom it was disclosed', 'Circumstances of disclosure', 'Damage assessment', 'Corrective actions taken'],
    steps: ['Secure all classified material immediately', 'Notify FSO and CSA immediately — do not delay', 'Identify all persons who had access to the disclosed information', 'Initiate damage assessment', 'Contact OCA for classification guidance', 'Cooperate with CSA/agency investigation', 'Brief cleared employees on lessons learned (without revealing classified details)'],
  },
  {
    type: 'insider-threat',
    whoToNotify: ['ITPSO', 'FSO', 'CSA', 'FBI (if espionage indicators present)'],
    documentationRequired: ['Behavioral indicators observed', 'Dates and circumstances', 'Witnesses', 'Supporting documentation', 'Assessment of threat level'],
    steps: ['Document specific behavioral indicators observed', 'Report to ITPSO through established channels', 'ITPSO/FSO conduct preliminary assessment', 'Determine whether referral to CSA or FBI is warranted', 'Implement monitoring or access restrictions as appropriate', 'Coordinate with HR and legal counsel', 'Protect the identity of reporting individuals'],
  },
  {
    type: 'coercion-attempt',
    whoToNotify: ['FSO (immediately)', 'CSA (immediately)', 'FBI', 'Local law enforcement (if physical threat)'],
    documentationRequired: ['Nature of coercion attempt', 'Identity of person(s) involved', 'What was demanded', 'Whether classified information was compromised', 'Witness statements'],
    steps: ['Employee reports attempt immediately to FSO', 'FSO notifies CSA and FBI immediately', 'Ensure employee safety and security', 'Document all details while fresh', 'Cooperate fully with law enforcement investigation', 'Provide support to affected employee', 'Review security procedures for potential vulnerabilities'],
  },
  {
    type: 'technology-misuse',
    whoToNotify: ['FSO', 'ISSM/ISSO', 'CSA', 'ITPSO'],
    documentationRequired: ['Systems accessed', 'Nature of unauthorized access', 'Data potentially compromised', 'Audit log evidence', 'Timeline of events'],
    steps: ['Identify and document the unauthorized access', 'Preserve audit logs and forensic evidence', 'Disable or restrict access if ongoing threat', 'ISSM conducts technical assessment', 'Report to CSA within 24 hours', 'Coordinate with ITPSO for insider threat indicators', 'Implement corrective technical controls'],
  },
  {
    type: 'outside-employment',
    whoToNotify: ['FSO', 'HR', 'CSA (if conflict of interest)'],
    documentationRequired: ['Employer name and type of work', 'Hours and compensation', 'Whether work involves foreign entities', 'Potential conflicts of interest'],
    steps: ['Employee reports outside employment before commencement', 'FSO evaluates for conflicts of interest or foreign nexus', 'Document in security file', 'Report to CSA if foreign involvement or conflict exists', 'Review periodically for changes'],
  },
  {
    type: 'other',
    whoToNotify: ['FSO', 'CSA (as applicable)'],
    documentationRequired: ['Nature of event', 'Relevant circumstances', 'Impact assessment', 'Actions taken'],
    steps: ['Employee reports event to FSO', 'FSO evaluates whether event is reportable under SEAD-3 or 32 CFR 117', 'Document event in security file', 'Report to CSA if required', 'Implement corrective actions as needed'],
  },
];

// ---------------------------------------------------------------------------
// CHAT MESSAGE TYPES
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citation?: string;
  bestPracticeTip?: string;
  relatedTopics?: string[];
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// HELPER: Severity badge colors
// ---------------------------------------------------------------------------

function severityColor(severity: string): string {
  switch (severity) {
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'serious': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NISPOMComplianceAssistantPage() {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to the NISPOM Compliance Assistant. I can help you with questions about 32 CFR Part 117, Security Executive Agent Directives (SEADs), clearance procedures, incident reporting, and Trusted Workforce 2.0 requirements.\n\nSelect a suggested question below or type your own question.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Section state
  const [expandedIncidents, setExpandedIncidents] = useState<Set<IncidentType>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'cards' | 'chat' | 'incidents' | 'reinvestigation' | 'resources'>('cards');
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());

  // Scroll to bottom of chat on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup setTimeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // CHAT LOGIC
  // ---------------------------------------------------------------------------

  function findAnswer(question: string): QAEntry | null {
    const lower = question.toLowerCase();

    // Direct match
    const direct = KNOWLEDGE_BASE.find(
      (e) => e.question.toLowerCase() === lower
    );
    if (direct) return direct;

    // Keyword matching
    const scores = KNOWLEDGE_BASE.map((entry) => {
      const keywords = entry.question.toLowerCase().split(/\s+/);
      const questionWords = lower.split(/\s+/);
      let score = 0;
      for (const kw of questionWords) {
        if (kw.length < 3) continue;
        if (keywords.some((k) => k.includes(kw) || kw.includes(k))) score++;
        if (entry.answer.toLowerCase().includes(kw)) score += 0.5;
        if (entry.relatedTopics.some((t) => t.toLowerCase().includes(kw))) score += 0.3;
      }
      return { entry, score };
    });

    scores.sort((a, b) => b.score - a.score);
    if (scores[0] && scores[0].score >= 1.5) return scores[0].entry;

    return null;
  }

  function handleSendMessage(question?: string) {
    const text = question || inputValue.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    timeoutRef.current = setTimeout(() => {
      const match = findAnswer(text);
      let assistantMsg: ChatMessage;

      if (match) {
        assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: match.answer,
          citation: match.citation,
          bestPracticeTip: match.bestPracticeTip,
          relatedTopics: match.relatedTopics,
          timestamp: new Date(),
        };
      } else {
        assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: 'I don\'t have a specific answer for that question in my current knowledge base. For authoritative guidance, please consult:\n\n- **32 CFR Part 117** (NISPOM) for facility and personnel security requirements\n- **SEAD-3** for reporting requirements\n- **SEAD-4** for adjudicative guidelines\n- Your **Cognizant Security Agency (CSA)** for case-specific questions\n- The **DCSA Knowledge Center** for industrial security guidance\n\nYou can also try rephrasing your question or selecting one of the suggested topics.',
          citation: '32 CFR Part 117; SEAD-1 through SEAD-8',
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }

  function toggleIncident(type: IncidentType) {
    setExpandedIncidents((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function toggleChapter(id: string) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleBookmark(q: string) {
    setBookmarkedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });
  }

  // Filtered incidents based on search
  const filteredIncidentTypes = Object.entries(INCIDENT_TYPES).filter(([key, val]) => {
    if (!searchQuery) return true;
    const lower = searchQuery.toLowerCase();
    return val.label.toLowerCase().includes(lower) ||
      val.description.toLowerCase().includes(lower) ||
      key.includes(lower);
  });

  // ---------------------------------------------------------------------------
  // SECTION NAVIGATION
  // ---------------------------------------------------------------------------

  const sections = [
    { id: 'cards' as const, label: 'Quick Reference', icon: Book },
    { id: 'chat' as const, label: 'AI Assistant', icon: Bot },
    { id: 'incidents' as const, label: 'Incident Reporting', icon: AlertTriangle },
    { id: 'reinvestigation' as const, label: 'Reinvestigation Calendar', icon: Clock },
    { id: 'resources' as const, label: 'Resources', icon: FileText },
  ];

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="min-h-screen bg-gray-900">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">NISPOM Compliance Assistant</h1>
                <p className="text-sm text-gray-400">32 CFR Part 117 &middot; SEAD Guidance &middot; FSO Tools</p>
              </div>
            </div>
            <p className="text-gray-300 max-w-3xl">
              AI-powered compliance Q&A tool for Facility Security Officers and security professionals.
              Get instant guidance on NISPOM requirements, SEAD directives, clearance procedures, and incident reporting.
            </p>
          </motion.div>

          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mt-6">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-200 font-medium">Legal Disclaimer</p>
            <p className="text-xs text-amber-300/80 mt-1">
              This tool provides general guidance based on publicly available regulatory information and does not constitute legal advice.
              Responses are for informational purposes only. FSOs and security professionals should consult their Cognizant Security Agency (CSA),
              DCSA, or qualified legal counsel for authoritative guidance on specific compliance matters. This tool does not access, store,
              or process classified information.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================================================================ */}
        {/* SECTION 1: QUICK REFERENCE CARDS */}
        {/* ================================================================ */}
        {activeSection === 'cards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Book className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">NISPOM Quick Reference</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {NISPOM_CHAPTERS.map((chapter, idx) => {
                const colors = CHAPTER_COLORS[chapter.chapter];
                const Icon = CHAPTER_ICONS[idx] || Shield;
                const isExpanded = expandedChapters.has(chapter.id);

                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`bg-gray-800 rounded-xl border ${colors.border} overflow-hidden`}
                  >
                    {/* Card Header */}
                    <div className={`px-5 py-4 ${colors.bg} border-b ${colors.border}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                          <div>
                            <p className={`text-xs font-mono ${colors.icon}`}>{chapter.chapter} &middot; {chapter.section}</p>
                            <h3 className="text-white font-semibold text-sm">{chapter.title}</h3>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          aria-expanded={isExpanded}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 py-4">
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">{chapter.summary}</p>

                      {/* Key Requirements */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          Key Requirements
                        </p>
                        <ul className="space-y-1">
                          {chapter.keyRequirements.slice(0, isExpanded ? undefined : 3).map((req, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                              <ChevronRight className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Common Violations (visible when expanded) */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              Common Violations
                            </p>
                            <ul className="space-y-1">
                              {chapter.commonViolations.map((v, i) => (
                                <li key={i} className="text-xs text-amber-300/80 flex items-start gap-2">
                                  <X className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <span>{v}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                              <Star className="w-3 h-3 text-blue-400" />
                              Best Practices
                            </p>
                            <ul className="space-y-1">
                              {chapter.bestPractices.map((bp, i) => (
                                <li key={i} className="text-xs text-blue-300/80 flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                            <Tag className="w-3 h-3 text-gray-500" />
                            <div className="flex flex-wrap gap-1">
                              {chapter.relatedSEADs.map((s) => (
                                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Full text reference */}
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                          View {chapter.section} Full Text
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* SECTION 2: AI COMPLIANCE ASSISTANT (CHAT) */}
        {/* ================================================================ */}
        {activeSection === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar: Suggested Questions */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-white">Suggested Questions</h3>
                  </div>
                  <div className="space-y-2">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(q)}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600/50 hover:border-gray-500"
                      >
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{q}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bookmarked Questions */}
                {bookmarkedQuestions.size > 0 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Bookmark className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-semibold text-white">Bookmarked</h3>
                    </div>
                    <div className="space-y-1">
                      {Array.from(bookmarkedQuestions).map((q, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <button
                            onClick={() => handleSendMessage(q)}
                            className="text-xs text-gray-400 hover:text-gray-200 text-left flex-1"
                          >
                            {q}
                          </button>
                          <button
                            onClick={() => toggleBookmark(q)}
                            className="p-0.5 hover:bg-gray-700 rounded"
                          >
                            <X className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-3">
                <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col max-h-[70vh] min-h-[400px]">
                  {/* Chat Header */}
                  <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/20">
                        <Bot className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">NISPOM Compliance AI</h3>
                        <p className="text-[10px] text-gray-500">32 CFR Part 117 &middot; SEAD-1 through SEAD-8 &middot; TW 2.0</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-400">Online</span>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" role="log" aria-live="polite">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-blue-400" />
                          </div>
                        )}
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                          <div
                            className={`rounded-xl px-4 py-3 text-sm ${
                              msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700/50 text-gray-200 border border-gray-600/50'
                            }`}
                          >
                            {/* Render markdown-like content */}
                            {msg.content.split('\n').map((line, i) => {
                              if (line.startsWith('- **') || line.startsWith('  - **')) {
                                const bold = line.match(/\*\*(.+?)\*\*/);
                                const rest = line.replace(/\*\*.+?\*\*/, '').replace(/^[\s-]+/, '');
                                return (
                                  <p key={i} className="ml-3 text-xs mt-1">
                                    <span className="text-gray-500 mr-1">&bull;</span>
                                    {bold && <span className="font-semibold text-white">{bold[1]}</span>}
                                    {rest}
                                  </p>
                                );
                              }
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return <p key={i} className="font-semibold text-white mt-2">{line.replace(/\*\*/g, '')}</p>;
                              }
                              if (line.match(/^\d+\.\s/)) {
                                return <p key={i} className="ml-3 text-xs mt-1">{line}</p>;
                              }
                              if (line.trim() === '') return <br key={i} />;
                              return <p key={i} className="mt-1">{line}</p>;
                            })}
                          </div>

                          {/* Citation */}
                          {msg.citation && msg.role === 'assistant' && (
                            <div className="mt-2 px-3 py-2 bg-gray-700/30 rounded-lg border border-gray-600/30">
                              <p className="text-[10px] text-gray-500 flex items-center gap-1 mb-1">
                                <FileText className="w-3 h-3" /> Regulatory Citation
                              </p>
                              <p className="text-xs text-gray-400">{msg.citation}</p>
                            </div>
                          )}

                          {/* Best Practice Tip */}
                          {msg.bestPracticeTip && (
                            <div className="mt-2 px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mb-1">
                                <Star className="w-3 h-3" /> Best Practice Tip
                              </p>
                              <p className="text-xs text-emerald-300/80">{msg.bestPracticeTip}</p>
                            </div>
                          )}

                          {/* Related Topics */}
                          {msg.relatedTopics && msg.relatedTopics.length > 0 && (
                            <div className="mt-2 flex items-center flex-wrap gap-1">
                              <Tag className="w-3 h-3 text-gray-500" />
                              {msg.relatedTopics.map((topic, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSendMessage(`Tell me about ${topic}`)}
                                  className="text-[10px] px-4 py-2.5 rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 transition-colors"
                                >
                                  {topic}
                                </button>
                              ))}
                              <button
                                onClick={() => toggleBookmark(msg.content.substring(0, 80))}
                                className="ml-1 p-2.5 hover:bg-gray-700 rounded"
                                title="Bookmark this response"
                                aria-label="Bookmark this response"
                              >
                                <Bookmark className={`w-3 h-3 ${bookmarkedQuestions.has(msg.content.substring(0, 80)) ? 'text-amber-400' : 'text-gray-600'}`} />
                              </button>
                            </div>
                          )}

                          {/* Timestamp */}
                          <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-right text-blue-300/50' : 'text-gray-600'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-7 h-7 rounded-lg bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="px-5 py-3 border-t border-gray-700">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about NISPOM, SEADs, clearances, or compliance..."
                        className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        disabled={isTyping}
                      />
                      <button
                        type="submit"
                        disabled={isTyping || !inputValue.trim()}
                        aria-label="Send message"
                        className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                    <p className="text-[10px] text-gray-600 mt-2 text-center">
                      Responses are AI-generated from a curated regulatory knowledge base. Always verify with your CSA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* SECTION 3: INCIDENT REPORTING GUIDE */}
        {/* ================================================================ */}
        {activeSection === 'incidents' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-semibold text-white">Incident Reporting Guide</h2>
                <span className="text-xs text-gray-500 ml-2">SEAD-3 &middot; 32 CFR 117.13(d)</span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search incident types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search NISPOM topics"
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                />
              </div>
            </div>

            {/* Reporting Timeline Summary */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Reporting Deadline Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    deadline: 'Immediately',
                    color: 'bg-red-500/20 border-red-500/30 text-red-400',
                    types: ['Unauthorized disclosure', 'Insider threat indicators', 'Coercion/blackmail', 'Security violations'],
                  },
                  {
                    deadline: 'Within 24-72 Hours',
                    color: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
                    types: ['Arrests or charges', 'Criminal convictions', 'IT systems misuse'],
                  },
                  {
                    deadline: 'Within 5-10 Days',
                    color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
                    types: ['Foreign contacts', 'Foreign travel', 'Substance abuse reports'],
                  },
                  {
                    deadline: 'Within 30 Days',
                    color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
                    types: ['Financial changes', 'Outside employment', 'Mental health (if applicable)'],
                  },
                ].map((tier) => (
                  <div key={tier.deadline} className={`rounded-lg border p-3 ${tier.color}`}>
                    <p className="font-semibold text-sm mb-2">{tier.deadline}</p>
                    <ul className="space-y-1">
                      {tier.types.map((t, i) => (
                        <li key={i} className="text-xs opacity-80 flex items-start gap-1">
                          <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Incident Types */}
            <div className="space-y-3">
              {filteredIncidentTypes.map(([key, config]) => {
                const incidentType = key as IncidentType;
                const isExpanded = expandedIncidents.has(incidentType);
                const guide = INCIDENT_GUIDE.find((g) => g.type === incidentType);

                return (
                  <div
                    key={key}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleIncident(incidentType)}
                      aria-expanded={isExpanded}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${severityColor(config.severity)}`}>
                          {config.severity.toUpperCase()}
                        </span>
                        <div className="text-left">
                          <h4 className="text-sm font-medium text-white">{config.label}</h4>
                          <p className="text-xs text-gray-400">{config.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-gray-500">Reporting Deadline</p>
                          <p className="text-xs font-medium text-amber-400">{config.reportingDeadline}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400 font-mono hidden sm:block">
                          {config.seadReference}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && guide && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 border-t border-gray-700"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          {/* Who to Notify */}
                          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                            <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                              <User className="w-3 h-3 text-blue-400" />
                              Who to Notify
                            </p>
                            <ul className="space-y-1">
                              {guide.whoToNotify.map((n, i) => (
                                <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                                  <ChevronRight className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                                  {n}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Documentation Required */}
                          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                            <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-emerald-400" />
                              Documentation Required
                            </p>
                            <ul className="space-y-1">
                              {guide.documentationRequired.map((d, i) => (
                                <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                                  <CheckCircle className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Step-by-Step */}
                          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                            <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                              <Plus className="w-3 h-3 text-violet-400" />
                              Steps to Follow
                            </p>
                            <ol className="space-y-1">
                              {guide.steps.map((s, i) => (
                                <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                                  <span className="text-[10px] font-mono text-violet-400 mt-0.5 flex-shrink-0 w-3 text-right">{i + 1}.</span>
                                  {s}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>

                        {/* SEAD Reference & Deadline */}
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-700">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span className="text-xs text-amber-300">Deadline: {config.reportingDeadline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-400">{config.seadReference}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* SECTION 4: REINVESTIGATION CALENDAR GUIDE */}
        {/* ================================================================ */}
        {activeSection === 'reinvestigation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Reinvestigation Calendar Guide</h2>
            </div>

            {/* Clearance Types Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-6">
              <div className="px-5 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">Clearance Types & Reinvestigation Intervals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-700/30">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Clearance Level</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Investigation Type</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400">Reinvestigation Interval</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400">Estimated Processing</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400">Salary Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {Object.entries(CLEARANCE_TARGET_LEVELS).map(([key, config]) => (
                      <tr key={key} className="hover:bg-gray-700/20 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: config.color }}
                            />
                            <div>
                              <p className="text-white font-medium text-xs">{config.label}</p>
                              <p className="text-gray-500 text-[10px]">{config.abbreviation}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-gray-400 font-mono bg-gray-700/50 px-2 py-0.5 rounded">
                            {config.investigationType.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-xs font-semibold text-blue-400">
                            {config.reinvestigationYears} years
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-xs text-gray-400">
                            {config.estimatedDays.min}-{config.estimatedDays.max} days
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-xs text-emerald-400">
                            +${config.salaryPremium.min.toLocaleString()}-${config.salaryPremium.max.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TW 2.0 Changes */}
            <div className="bg-gray-800 rounded-xl border border-blue-500/30 p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Trusted Workforce 2.0 Changes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-2">Key Changes</h4>
                  <ul className="space-y-2">
                    {[
                      'Periodic reinvestigations replaced by Continuous Vetting (CV) for most populations',
                      'Top Secret reinvestigation interval extended from 5 to 6 years during transition',
                      'Five investigation tiers replace legacy investigation types (NACLC, SSBI, etc.)',
                      'Reciprocity standards implemented to reduce redundant investigations',
                      'Social media review incorporated into vetting process per SEAD-5',
                    ].map((item, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-2">Investigation Tier Mapping</h4>
                  <div className="space-y-2">
                    {[
                      { tier: 'Tier 1', legacy: 'NACI', purpose: 'Low-risk, non-sensitive positions' },
                      { tier: 'Tier 2', legacy: 'MBI/ANACI', purpose: 'Moderate-risk public trust' },
                      { tier: 'Tier 3', legacy: 'NACLC', purpose: 'Non-critical sensitive / Secret clearance' },
                      { tier: 'Tier 4', legacy: 'SSBI (PT)', purpose: 'High-risk public trust' },
                      { tier: 'Tier 5', legacy: 'SSBI', purpose: 'Critical sensitive / Top Secret' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <span className="font-mono font-semibold text-blue-400 w-12">{t.tier}</span>
                        <span className="text-gray-500 w-20">{t.legacy}</span>
                        <span className="text-gray-400">{t.purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Continuous Vetting Enrollment */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Continuous Vetting (CV) Enrollment Guidance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-xs font-semibold text-emerald-400 mb-2">Enrollment Process</h4>
                  <ul className="space-y-1.5">
                    {[
                      'DCSA automatically enrolls personnel through DISS',
                      'FSO verifies enrollment status in DISS for each cleared employee',
                      'Ensure all active clearances are reflected in DISS',
                      'Contact DCSA Tier 1 Help Desk for enrollment issues',
                    ].map((s, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-xs font-semibold text-blue-400 mb-2">FSO Responsibilities</h4>
                  <ul className="space-y-1.5">
                    {[
                      'Monitor DISS for CV alerts daily or as directed',
                      'Respond to CV alerts within required timeframes',
                      'Conduct follow-up assessments for flagged issues',
                      'Document all CV alert responses and actions taken',
                      'Escalate unresolved alerts to CSA',
                    ].map((s, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-xs font-semibold text-amber-400 mb-2">Alert Response Timeframes</h4>
                  <ul className="space-y-1.5">
                    {[
                      'Critical (watchlist match): Immediately',
                      'High (criminal, identity): 72 hours',
                      'Moderate (financial, social media): 5 business days',
                      'Low (foreign travel, other): 10 business days',
                      'Informational (reinvestigation due): 30 days',
                    ].map((s, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                        <Clock className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* SECTION 5: RESOURCES */}
        {/* ================================================================ */}
        {activeSection === 'resources' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Compliance Resources</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DCSA Resources */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">DCSA Resources</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'DCSA Industrial Security Program', description: 'Primary resource for NISP policy and guidance' },
                    { name: 'DCSA Knowledge Center', description: 'Training, toolkits, and job aids for security professionals' },
                    { name: 'DISS (Defense Information System for Security)', description: 'System of record for personnel and facility clearances' },
                    { name: 'NISS (National Industrial Security System)', description: 'Reporting and record management for industry' },
                    { name: 'e-QIP (Electronic Questionnaires for Investigations Processing)', description: 'Online system for submitting SF-86 and related forms' },
                    { name: 'DCSA Self-Inspection Handbook', description: 'Comprehensive guide for conducting facility self-inspections' },
                    { name: 'DCSA CDSE (Center for Development of Security Excellence)', description: 'Security education, training, and certification programs' },
                    { name: 'DCSA Insider Threat Resources', description: 'NITTF maturity framework, training, and implementation guides' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-gray-700/30 transition-colors">
                      <ExternalLink className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-200">{r.name}</p>
                        <p className="text-[10px] text-gray-500">{r.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEAD Index */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Book className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">SEAD Index</h3>
                  <span className="text-[10px] text-gray-500">Security Executive Agent Directives</span>
                </div>
                <div className="space-y-2">
                  {SEAD_INDEX.map((sead) => (
                    <div key={sead.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-semibold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                          {sead.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 font-medium">{sead.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{sead.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* NISPOM Chapter Index */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">NISPOM Chapter Index</h3>
                  <span className="text-[10px] text-gray-500">32 CFR Part 117</span>
                </div>
                <div className="space-y-2">
                  {[
                    { chapter: '§ 117.1-117.8', title: 'General Provisions', description: 'Purpose, scope, definitions, and applicability' },
                    { chapter: '§ 117.9', title: 'Facility Clearances (FCL)', description: 'Facility clearance requirements and procedures' },
                    { chapter: '§ 117.10', title: 'Personnel Security Clearances', description: 'Personnel security requirements and procedures' },
                    { chapter: '§ 117.11', title: 'Classification & Marking', description: 'Derivative classification and marking requirements' },
                    { chapter: '§ 117.12', title: 'Insider Threat Program', description: 'Insider threat program requirements for industry' },
                    { chapter: '§ 117.13', title: 'Safeguarding Classified Information', description: 'Physical security, storage, transmission, and destruction' },
                    { chapter: '§ 117.14', title: 'Visits & Meetings', description: 'Visit authorization and classified meeting procedures' },
                    { chapter: '§ 117.15', title: 'Subcontracting', description: 'DD Form 254 and subcontractor security requirements' },
                    { chapter: '§ 117.16', title: 'International Security', description: 'Foreign government information and international programs' },
                    { chapter: '§ 117.17', title: 'COMSEC', description: 'Communications security material handling' },
                    { chapter: '§ 117.18', title: 'Restricted Data (DOE)', description: 'Restricted Data and Formerly Restricted Data' },
                    { chapter: '§ 117.19', title: 'Special Access Programs', description: 'SAP security requirements and procedures' },
                    { chapter: '§ 117.20-117.23', title: 'TEMPEST, Automated IS, Special Requirements', description: 'Technical security countermeasures and special categories' },
                  ].map((ch, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-gray-700/30 transition-colors">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                        {ch.chapter}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-gray-200">{ch.title}</p>
                        <p className="text-[10px] text-gray-500">{ch.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Forms Reference */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Common Forms Reference</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 pr-3 text-gray-500 font-semibold">Form</th>
                        <th className="text-left py-2 pr-3 text-gray-500 font-semibold">Title</th>
                        <th className="text-left py-2 text-gray-500 font-semibold">Usage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {COMMON_FORMS.map((f) => (
                        <tr key={f.form} className="hover:bg-gray-700/20">
                          <td className="py-2 pr-3">
                            <span className="font-mono font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {f.form}
                            </span>
                          </td>
                          <td className="py-2 pr-3 text-gray-300">{f.title}</td>
                          <td className="py-2 text-gray-500">{f.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Additional Disclaimer */}
            <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300 font-medium">About This Resource</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This compliance assistant references publicly available regulatory content from 32 CFR Part 117 (NISPOM),
                    Security Executive Agent Directives (SEAD-1 through SEAD-8), Executive Orders, and DCSA guidance documents.
                    Content is provided for educational and reference purposes only. For authoritative interpretations, consult
                    your Cognizant Security Agency (CSA), the Defense Counterintelligence and Security Agency (DCSA), or qualified
                    national security counsel. This tool does not access, store, or transmit classified information.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Last content update: February 2024 &middot; Regulatory sources: 32 CFR Part 117, SEAD-1 through SEAD-8, EO 13526, EO 13587, TW 2.0 Policy Framework
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
