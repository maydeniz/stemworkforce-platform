import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, RotateCcw, Eye, Send } from 'lucide-react';
import type { VerificationStatus, TrustLevel } from '@/types/experienceLedger';
import { TRUST_LEVEL_LABELS, TRUST_LEVEL_COLORS, VERIFICATION_STATUS_LABELS } from '@/types/experienceLedger';

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
  trustLevel: TrustLevel;
  showTrust?: boolean;
  size?: 'sm' | 'md';
}

const STATUS_ICONS: Record<VerificationStatus, React.ReactNode> = {
  draft:              <Clock className="w-3 h-3" />,
  submitted:          <Send className="w-3 h-3" />,
  notified:           <Eye className="w-3 h-3" />,
  under_review:       <RotateCcw className="w-3 h-3 animate-spin" />,
  verified:           <CheckCircle className="w-3 h-3" />,
  rejected:           <XCircle className="w-3 h-3" />,
  revision_requested: <AlertCircle className="w-3 h-3" />,
};

const STATUS_COLORS: Record<VerificationStatus, string> = {
  draft:              'text-gray-400 bg-gray-800/60 border-gray-700',
  submitted:          'text-blue-400 bg-blue-900/30 border-blue-700',
  notified:           'text-cyan-400 bg-cyan-900/30 border-cyan-700',
  under_review:       'text-yellow-400 bg-yellow-900/30 border-yellow-700',
  verified:           'text-emerald-400 bg-emerald-900/30 border-emerald-600',
  rejected:           'text-red-400 bg-red-900/30 border-red-700',
  revision_requested: 'text-orange-400 bg-orange-900/30 border-orange-700',
};

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({
  status,
  trustLevel,
  showTrust = false,
  size = 'sm',
}) => {
  const pad = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${pad} ${STATUS_COLORS[status]}`}>
        {STATUS_ICONS[status]}
        {VERIFICATION_STATUS_LABELS[status]}
      </span>
      {showTrust && (
        <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${pad} ${TRUST_LEVEL_COLORS[trustLevel]}`}>
          {'★'.repeat(trustLevel)}{'☆'.repeat(5 - trustLevel)}
          <span className="hidden sm:inline">{TRUST_LEVEL_LABELS[trustLevel]}</span>
        </span>
      )}
    </div>
  );
};

export default VerificationStatusBadge;
