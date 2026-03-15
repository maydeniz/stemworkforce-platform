import React from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

interface DiscoverabilityMeterProps {
  score: number;        // 0–100
  isDiscoverable: boolean;
  verifiedCount: number;
}


const DiscoverabilityMeter: React.FC<DiscoverabilityMeterProps> = ({
  score,
  isDiscoverable,
  verifiedCount,
}) => {
  const color =
    score >= 80 ? 'bg-emerald-500' :
    score >= 50 ? 'bg-yellow-500' :
    'bg-gray-600';

  const textColor =
    score >= 80 ? 'text-emerald-400' :
    score >= 50 ? 'text-yellow-400' :
    'text-gray-400';

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Employer Discoverability</h3>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${textColor}`}>
          {isDiscoverable
            ? <><Eye className="w-3.5 h-3.5" /> Discoverable</>
            : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>
          }
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>{score}/100</span>
        {!isDiscoverable && <span>Need 80+ to be discoverable</span>}
      </div>

      {/* Gate requirements */}
      <div className="space-y-1.5">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Requirements</p>
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${verifiedCount >= 1 ? 'text-emerald-400' : 'text-gray-600'}`} />
          <span className={verifiedCount >= 1 ? 'text-gray-300' : 'text-gray-500'}>
            At least 1 institutionally verified experience
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${score >= 80 ? 'text-emerald-400' : 'text-gray-600'}`} />
          <span className={score >= 80 ? 'text-gray-300' : 'text-gray-500'}>
            Profile completeness score ≥ 80
          </span>
        </div>
      </div>

      {!isDiscoverable && (
        <p className="mt-3 text-xs text-gray-500 leading-relaxed">
          Complete your profile and get at least one experience verified by a faculty member, advisor, or employer to appear in employer searches.
        </p>
      )}
    </div>
  );
};

export default DiscoverabilityMeter;
