import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Plus, Link, Wand2, Loader2 } from 'lucide-react';
import type {
  CreateExperienceInput,
  ExperienceType,
  OrganizationType,
  VerifierType,
  EvidenceType,
  SkillTaxonomyEntry,
} from '@/types/experienceLedger';
import { EXPERIENCE_TYPE_LABELS, EXPERIENCE_TYPE_ICONS } from '@/types/experienceLedger';
import { createExperience, addEvidence, submitForVerification, getSkillSuggestions, addSkill } from '@/services/experienceLedgerApi';
import { extractSkillsFromText } from '@/services/skillExtractionService';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = ['Details', 'Evidence', 'Skills', 'Verification'] as const;

const ORG_TYPES: { value: OrganizationType; label: string }[] = [
  { value: 'employer', label: 'Employer / Company' },
  { value: 'university', label: 'University' },
  { value: 'research_lab', label: 'Research Lab' },
  { value: 'national_lab', label: 'National Laboratory' },
  { value: 'government', label: 'Government Agency' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'startup', label: 'Startup' },
  { value: 'other', label: 'Other' },
];

const VERIFIER_TYPES: { value: VerifierType; label: string; hint: string }[] = [
  { value: 'faculty', label: 'Faculty / Professor', hint: 'Course instructor or research advisor' },
  { value: 'advisor', label: 'Academic Advisor', hint: 'Departmental advisor or counselor' },
  { value: 'supervisor', label: 'Work Supervisor', hint: 'Direct manager or PI at internship/job' },
  { value: 'hr', label: 'HR / Recruiter', hint: "Company's HR department" },
  { value: 'peer', label: 'Peer / Teammate', hint: 'Fellow student or project collaborator' },
  { value: 'accreditor', label: 'Accreditation Body', hint: 'External certification authority' },
];

const AddExperienceModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [skillQuery, setSkillQuery] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<SkillTaxonomyEntry[]>([]);
  const [addedSkillLabels, setAddedSkillLabels] = useState<string[]>([]);
  const [extractedSuggestions, setExtractedSuggestions] = useState<{ label: string; confidence: number }[]>([]);

  const [details, setDetails] = useState<CreateExperienceInput>({
    title: '',
    description: '',
    experience_type: 'internship',
    organization_name: '',
    organization_type: 'employer',
    start_date: '',
    is_current: false,
    location: '',
    is_remote: false,
  });

  const [evidence, setEvidence] = useState({ type: 'url' as EvidenceType, title: '', url: '' });
  const [evidenceList, setEvidenceList] = useState<Array<{ type: EvidenceType; title: string; url: string }>>([]);

  const [verification, setVerification] = useState({
    verifier_name: '',
    verifier_email: '',
    verifier_title: '',
    verifier_type: 'faculty' as VerifierType,
    notes: '',
    skip: false,
  });

  const reset = useCallback(() => {
    setStep(0);
    setCreatedId(null);
    setAddedSkillLabels([]);
    setExtractedSuggestions([]);
    setEvidenceList([]);
    setDetails({
      title: '', description: '', experience_type: 'internship',
      organization_name: '', organization_type: 'employer',
      start_date: '', is_current: false, location: '', is_remote: false,
    });
    setVerification({ verifier_name: '', verifier_email: '', verifier_title: '', verifier_type: 'faculty', notes: '', skip: false });
  }, []);

  // Skill suggestions search
  useEffect(() => {
    if (!skillQuery || skillQuery.length < 2) { setSkillSuggestions([]); return; }
    const t = setTimeout(async () => {
      const results = await getSkillSuggestions(skillQuery);
      setSkillSuggestions(results);
    }, 300);
    return () => clearTimeout(t);
  }, [skillQuery]);

  const handleAddSkillFromSuggestion = async (entry: SkillTaxonomyEntry) => {
    if (!createdId || addedSkillLabels.includes(entry.label)) return;
    await addSkill({
      experience_id: createdId,
      esco_uri: entry.esco_uri ?? undefined,
      esco_label: entry.label,
      skill_type: entry.skill_type ?? undefined,
      extraction_method: 'manual',
      confidence: 1.0,
    });
    setAddedSkillLabels(prev => [...prev, entry.label]);
    setSkillQuery('');
    setSkillSuggestions([]);
  };

  const handleExtractSkills = async () => {
    if (!details.description) return;
    setExtracting(true);
    const extracted = await extractSkillsFromText(details.description);
    setExtractedSuggestions(extracted.map(s => ({ label: s.label, confidence: s.confidence })));
    setExtracting(false);
  };

  const handleAddExtractedSkill = async (label: string) => {
    if (!createdId || addedSkillLabels.includes(label)) return;
    await addSkill({
      experience_id: createdId,
      esco_label: label,
      extraction_method: 'ai_extracted',
    });
    setAddedSkillLabels(prev => [...prev, label]);
  };

  const handleNext = async () => {
    setSaving(true);
    try {
      if (step === 0) {
        // Create the experience record
        const exp = await createExperience(details);
        setCreatedId(exp.id);
        setStep(1);
      } else if (step === 1) {
        // Save any pending evidence
        if (createdId && evidenceList.length > 0) {
          for (const ev of evidenceList) {
            await addEvidence({ experience_id: createdId, evidence_type: ev.type, title: ev.title, url: ev.url });
          }
        }
        setStep(2);
      } else if (step === 2) {
        setStep(3);
      } else if (step === 3) {
        if (!verification.skip && createdId) {
          await submitForVerification({
            experience_id: createdId,
            verifier_name: verification.verifier_name,
            verifier_email: verification.verifier_email,
            verifier_title: verification.verifier_title,
            verifier_type: verification.verifier_type,
            notes: verification.notes || undefined,
          });
        }
        onSuccess();
        reset();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvidence = () => {
    if (!evidence.title || !evidence.url) return;
    setEvidenceList(prev => [...prev, evidence]);
    setEvidence({ type: 'url', title: '', url: '' });
  };

  if (!open) return null;

  const canNext =
    step === 0 ? !!(details.title && details.experience_type && details.start_date) :
    step === 1 ? true :
    step === 2 ? true :
    verification.skip || (!!verification.verifier_name && !!verification.verifier_email && !!verification.verifier_type);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Add Experience</h2>
              <p className="text-xs text-gray-500 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="px-6 pt-4 flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-indigo-500' : 'bg-gray-800'}`}
              />
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* Step 0: Details */}
            {step === 0 && (
              <>
                {/* Experience type */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Experience Type *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {(Object.keys(EXPERIENCE_TYPE_LABELS) as ExperienceType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setDetails(d => ({ ...d, experience_type: t }))}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs transition-all ${
                          details.experience_type === t
                            ? 'border-indigo-500 bg-indigo-900/30 text-white'
                            : 'border-gray-800 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="text-lg">{EXPERIENCE_TYPE_ICONS[t]}</span>
                        {EXPERIENCE_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Title / Role *</label>
                  <input
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Machine Learning Research Intern"
                    value={details.title}
                    onChange={e => setDetails(d => ({ ...d, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Organization</label>
                    <input
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                      placeholder="MIT, Google, Oak Ridge Lab..."
                      value={details.organization_name}
                      onChange={e => setDetails(d => ({ ...d, organization_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Org Type</label>
                    <select
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      value={details.organization_type}
                      onChange={e => setDetails(d => ({ ...d, organization_type: e.target.value as OrganizationType }))}
                    >
                      {ORG_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Start Date *</label>
                    <input
                      type="month"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      value={details.start_date}
                      onChange={e => setDetails(d => ({ ...d, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">End Date</label>
                    <input
                      type="month"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                      value={details.end_date ?? ''}
                      disabled={details.is_current}
                      onChange={e => setDetails(d => ({ ...d, end_date: e.target.value }))}
                    />
                    <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={details.is_current}
                        onChange={e => setDetails(d => ({ ...d, is_current: e.target.checked, end_date: undefined }))}
                      />
                      <span className="text-xs text-gray-400">Current</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
                    rows={4}
                    placeholder="Describe your role, responsibilities, and what you built or discovered..."
                    value={details.description}
                    onChange={e => setDetails(d => ({ ...d, description: e.target.value }))}
                  />
                </div>
              </>
            )}

            {/* Step 1: Evidence */}
            {step === 1 && (
              <>
                <p className="text-sm text-gray-400">Add links or files that prove this experience. GitHub repos, papers, project demos, and certificates all count.</p>

                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2">
                    <select
                      className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      value={evidence.type}
                      onChange={e => setEvidence(ev => ({ ...ev, type: e.target.value as EvidenceType }))}
                    >
                      {(['url','github','paper','certificate','demo'] as EvidenceType[]).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <input
                      className="col-span-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                      placeholder="Title"
                      value={evidence.title}
                      onChange={e => setEvidence(ev => ({ ...ev, title: e.target.value }))}
                    />
                    <input
                      className="col-span-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                      placeholder="https://..."
                      value={evidence.url}
                      onChange={e => setEvidence(ev => ({ ...ev, url: e.target.value }))}
                    />
                  </div>
                  <button
                    onClick={handleAddEvidence}
                    disabled={!evidence.title || !evidence.url}
                    className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" /> Add Link
                  </button>
                </div>

                {evidenceList.length > 0 && (
                  <div className="space-y-2">
                    {evidenceList.map((ev, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-900 rounded-lg border border-gray-800">
                        <Link className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-white flex-1">{ev.title}</span>
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{ev.url}</span>
                        <button onClick={() => setEvidenceList(l => l.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {evidenceList.length === 0 && (
                  <p className="text-xs text-gray-600 italic">Evidence is optional but significantly increases your verification chances and employer trust.</p>
                )}
              </>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Add skills demonstrated in this experience. We'll map them to the ESCO taxonomy.</p>
                  {details.description && (
                    <button
                      onClick={handleExtractSkills}
                      disabled={extracting}
                      className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-900/20 border border-violet-800 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {extracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      Auto-extract
                    </button>
                  )}
                </div>

                {/* AI-extracted suggestions */}
                {extractedSuggestions.length > 0 && (
                  <div className="p-3 bg-violet-900/10 border border-violet-900/30 rounded-lg">
                    <p className="text-xs text-violet-400 mb-2">Suggested from your description — click to add:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedSuggestions.map(s => (
                        <button
                          key={s.label}
                          onClick={() => handleAddExtractedSkill(s.label)}
                          disabled={addedSkillLabels.includes(s.label)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                            addedSkillLabels.includes(s.label)
                              ? 'opacity-40 cursor-not-allowed border-gray-700 text-gray-500'
                              : 'border-violet-700 text-violet-300 hover:bg-violet-900/30'
                          }`}
                        >
                          {addedSkillLabels.includes(s.label) ? '✓ ' : '+ '}{s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual search */}
                <div className="relative">
                  <input
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                    placeholder="Search ESCO skills (Python, machine learning, robotics...)"
                    value={skillQuery}
                    onChange={e => setSkillQuery(e.target.value)}
                  />
                  {skillSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {skillSuggestions.map(s => (
                        <button
                          key={s.id}
                          onClick={() => handleAddSkillFromSuggestion(s)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <span className="font-medium">{s.label}</span>
                          {s.skill_type && <span className="text-xs text-gray-500 ml-2">{s.skill_type}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {addedSkillLabels.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Added skills:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {addedSkillLabels.map(label => (
                        <span key={label} className="text-xs px-2.5 py-1 rounded-full border border-emerald-800 text-emerald-400 bg-emerald-900/10">
                          ✓ {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <>
                <p className="text-sm text-gray-400">
                  Request verification from someone who can confirm this experience. A verified experience is significantly more visible to employers.
                </p>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verification.skip}
                    onChange={e => setVerification(v => ({ ...v, skip: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-400">Save as draft — I'll request verification later</span>
                </label>

                {!verification.skip && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Verifier Type *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {VERIFIER_TYPES.map(vt => (
                          <button
                            key={vt.value}
                            onClick={() => setVerification(v => ({ ...v, verifier_type: vt.value }))}
                            className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                              verification.verifier_type === vt.value
                                ? 'border-indigo-500 bg-indigo-900/20 text-white'
                                : 'border-gray-800 text-gray-400 hover:border-gray-600'
                            }`}
                          >
                            <p className="font-medium">{vt.label}</p>
                            <p className="text-gray-500 mt-0.5">{vt.hint}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Verifier Name *</label>
                        <input
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                          placeholder="Dr. Jane Smith"
                          value={verification.verifier_name}
                          onChange={e => setVerification(v => ({ ...v, verifier_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Title / Role</label>
                        <input
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                          placeholder="Associate Professor, CS Dept"
                          value={verification.verifier_title}
                          onChange={e => setVerification(v => ({ ...v, verifier_title: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Verifier Email *</label>
                      <input
                        type="email"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                        placeholder="jsmith@university.edu"
                        value={verification.verifier_email}
                        onChange={e => setVerification(v => ({ ...v, verifier_email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Note to Verifier (optional)</label>
                      <textarea
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
                        rows={2}
                        placeholder="Hi Dr. Smith, I'm adding my research experience from your lab to my STEM portfolio..."
                        value={verification.notes}
                        onChange={e => setVerification(v => ({ ...v, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-800">
            <button
              onClick={step > 0 ? () => setStep(s => s - 1) : onClose}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext || saving}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 rounded-lg transition-all"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {step < STEPS.length - 1 ? (
                <><span>{step === 0 ? 'Save & Continue' : 'Continue'}</span><ChevronRight className="w-4 h-4" /></>
              ) : (
                <span>{verification.skip ? 'Save Draft' : 'Submit for Verification'}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddExperienceModal;
