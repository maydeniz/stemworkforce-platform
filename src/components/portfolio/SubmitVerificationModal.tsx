import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import type { VerifiedExperience, VerifierType } from '@/types/experienceLedger';
import { submitForVerification } from '@/services/experienceLedgerApi';

interface Props {
  experience: VerifiedExperience;
  onClose: () => void;
  onSuccess: () => void;
}

const VERIFIER_TYPES: { value: VerifierType; label: string }[] = [
  { value: 'faculty', label: 'Faculty / Professor' },
  { value: 'advisor', label: 'Academic Advisor' },
  { value: 'supervisor', label: 'Work Supervisor' },
  { value: 'hr', label: 'HR / Recruiter' },
  { value: 'peer', label: 'Peer / Teammate' },
  { value: 'accreditor', label: 'Accreditation Body' },
];

const SubmitVerificationModal: React.FC<Props> = ({ experience, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    verifier_name: '',
    verifier_email: '',
    verifier_title: '',
    verifier_type: 'faculty' as VerifierType,
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.verifier_name || !form.verifier_email) return;
    setSaving(true);
    setError(null);
    try {
      await submitForVerification({ experience_id: experience.id, ...form });
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Request Verification</h2>
              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{experience.title}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">{error}</div>}

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Verifier Type</label>
              <select
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                value={form.verifier_type}
                onChange={e => setForm(f => ({ ...f, verifier_type: e.target.value as VerifierType }))}
              >
                {VERIFIER_TYPES.map(vt => <option key={vt.value} value={vt.value}>{vt.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name *</label>
                <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Dr. Jane Smith" value={form.verifier_name} onChange={e => setForm(f => ({ ...f, verifier_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Associate Professor" value={form.verifier_title} onChange={e => setForm(f => ({ ...f, verifier_title: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email *</label>
              <input type="email" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="jsmith@university.edu" value={form.verifier_email} onChange={e => setForm(f => ({ ...f, verifier_email: e.target.value }))} />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Note (optional)</label>
              <textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>

          <div className="flex gap-3 px-6 pb-6">
            <button onClick={onClose} className="flex-1 text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg border border-gray-800 hover:bg-gray-800 transition-all">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!form.verifier_name || !form.verifier_email || saving}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 px-4 py-2 rounded-lg transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Request
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubmitVerificationModal;
