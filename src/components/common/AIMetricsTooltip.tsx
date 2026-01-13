// ===========================================
// AI Metrics Tooltip Component
// ===========================================
// Explains AI Exposure and AI Opportunity metrics
// to help parents and students understand program value
// ===========================================

import React, { useState } from 'react';
import { Info, TrendingUp, Shield, Zap, Target } from 'lucide-react';

interface AIMetricsTooltipProps {
  type: 'exposure' | 'opportunity';
  value: number;
  className?: string;
}

export const AIMetricsTooltip: React.FC<AIMetricsTooltipProps> = ({
  type,
  value,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const exposureContent = {
    title: 'AI Exposure Index',
    description: 'Measures how much this field will be transformed by AI technologies.',
    interpretation: [
      { range: 'Low (0-30%)', meaning: 'Minimal AI impact on daily tasks', icon: <Shield className="w-4 h-4 text-green-400" /> },
      { range: 'Moderate (30-50%)', meaning: 'Some tasks will be AI-assisted', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
      { range: 'High (50-70%)', meaning: 'Significant AI integration expected', icon: <TrendingUp className="w-4 h-4 text-orange-400" /> },
      { range: 'Very High (70%+)', meaning: 'Major workflow transformation by AI', icon: <Target className="w-4 h-4 text-red-400" /> },
    ],
    whatItMeans: value >= 70
      ? 'Careers in this field will likely see significant AI-driven changes. Focus on AI collaboration skills.'
      : value >= 50
      ? 'AI tools will become common in this field. Learning to work alongside AI is beneficial.'
      : value >= 30
      ? 'Some AI tools will be integrated, but core skills remain human-centered.'
      : 'This field has lower AI disruption risk. Traditional skills remain highly valuable.',
    source: 'Based on MIT Iceberg Index and Federal Reserve AIOE methodology',
  };

  const opportunityContent = {
    title: 'AI Opportunity Index',
    description: 'Measures career growth potential in the AI-driven economy.',
    interpretation: [
      { range: 'Limited (0-35%)', meaning: 'Fewer AI-enhanced career paths', icon: <Shield className="w-4 h-4 text-gray-400" /> },
      { range: 'Moderate (35-55%)', meaning: 'Growing AI-related opportunities', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
      { range: 'Strong (55-75%)', meaning: 'Many AI-driven career paths', icon: <TrendingUp className="w-4 h-4 text-blue-400" /> },
      { range: 'Exceptional (75%+)', meaning: 'Highest AI career potential', icon: <Target className="w-4 h-4 text-emerald-400" /> },
    ],
    whatItMeans: value >= 75
      ? 'Exceptional career growth potential. High demand for AI-skilled professionals in this field.'
      : value >= 55
      ? 'Strong career prospects. AI skills can significantly boost earning potential.'
      : value >= 35
      ? 'Moderate opportunities. Consider supplementing with AI-adjacent skills.'
      : 'Traditional career paths. AI skills are less critical but can still add value.',
    source: 'Combines AI skill demand, salary premiums, and growth trajectory data',
  };

  const content = type === 'exposure' ? exposureContent : opportunityContent;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
        aria-label={`Learn more about ${content.title}`}
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-80 p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-xl -left-36 top-8">
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 border-l border-t border-gray-700 rotate-45" />

          {/* Content */}
          <div className="relative">
            <h4 className="text-white font-semibold mb-2">{content.title}</h4>
            <p className="text-gray-400 text-sm mb-3">{content.description}</p>

            {/* Interpretation guide */}
            <div className="space-y-2 mb-3">
              {content.interpretation.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {item.icon}
                  <span className="text-gray-300 font-medium">{item.range}:</span>
                  <span className="text-gray-400">{item.meaning}</span>
                </div>
              ))}
            </div>

            {/* What it means for this program */}
            <div className="bg-gray-800/50 rounded-lg p-3 mb-2">
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">For this program:</span>{' '}
                {content.whatItMeans}
              </p>
            </div>

            {/* Source */}
            <p className="text-xs text-gray-500 italic">{content.source}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMetricsTooltip;
