import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { AIMetricsTooltip } from '@/components/common/AIMetricsTooltip';
import { trainingPrograms, enrichWithAIMetrics, TrainingProgramWithAI } from '@/data/trainingPrograms';
import {
  getExposureLabel,
  getOpportunityLabel,
  getExposureColor,
  getOpportunityColor,
  getExposureBgColor,
  getOpportunityBgColor,
} from '@/data/aiMetrics';

const FORMATS = [
  { value: '', label: 'All Formats' },
  { value: 'online', label: 'Online' },
  { value: 'in_person', label: 'In Person' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'self_paced', label: 'Self-Paced' },
];

const LEVELS = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const INDUSTRIES = [
  { value: '', label: 'All Industries' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'quantum', label: 'Quantum Technologies' },
  { value: 'semiconductor', label: 'Semiconductor' },
  { value: 'nuclear', label: 'Nuclear Energy' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'aerospace', label: 'Aerospace & Defense' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'healthcare', label: 'Healthcare IT' },
  { value: 'robotics', label: 'Robotics & Automation' },
  { value: 'clean-energy', label: 'Clean Energy' },
  { value: 'manufacturing', label: 'Advanced Manufacturing' },
];

const STATES = [
  { value: '', label: 'All States' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const TrainingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [format, setFormat] = useState('');
  const [level, setLevel] = useState('');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [freeOnly, setFreeOnly] = useState(false);

  // Sync filters with URL params
  useEffect(() => {
    const urlIndustry = searchParams.get('industry') || '';
    const urlState = searchParams.get('state') || '';
    if (urlIndustry !== industry) {
      setIndustry(urlIndustry);
    }
    if (urlState !== state) {
      setState(urlState);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateSearchParams = (newIndustry: string, newState: string) => {
    const params: Record<string, string> = {};
    if (newIndustry) params.industry = newIndustry;
    if (newState) params.state = newState;
    setSearchParams(params);
  };

  const handleIndustryChange = (newIndustry: string) => {
    setIndustry(newIndustry);
    updateSearchParams(newIndustry, state);
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    updateSearchParams(industry, newState);
  };

  // Filter programs based on selected filters and enrich with AI metrics
  const filteredPrograms = useMemo((): TrainingProgramWithAI[] => {
    return trainingPrograms
      .filter(program => {
        // Format filter
        if (format && program.format !== format) return false;

        // Level filter
        if (level && program.level !== level) return false;

        // Industry filter
        if (industry && !program.industries.includes(industry)) return false;

        // State filter
        if (state && program.stateCode !== state) return false;

        // Free only filter
        if (freeOnly && program.costNumeric > 0) return false;

        return true;
      })
      .map(enrichWithAIMetrics) // Add AI metrics
      .sort((a, b) => {
        // Sort by featured first, then by rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }, [format, level, industry, state, freeOnly]);

  const formatCost = (cost: string, costNumeric: number) => {
    if (costNumeric === 0) return 'Free';
    return cost;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Training Programs</h1>
          <p className="text-gray-400 text-lg">
            Explore {trainingPrograms.length}+ training programs to advance your STEM career.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FORMATS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <select
              value={industry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {INDUSTRIES.map(i => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="w-4 h-4 rounded border-dark-border bg-dark-bg text-blue-500 focus:ring-blue-500"
              />
              Free Programs Only
            </label>
          </div>

          {/* Active filters summary */}
          {(industry || state || format || level || freeOnly) && (
            <div className="mt-4 pt-4 border-t border-dark-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-400 text-sm">Showing {filteredPrograms.length} programs</span>
                {industry && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    {INDUSTRIES.find(i => i.value === industry)?.label}
                  </span>
                )}
                {state && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                    {STATES.find(s => s.value === state)?.label}
                  </span>
                )}
                {format && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                    {FORMATS.find(f => f.value === format)?.label}
                  </span>
                )}
                {level && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                    {LEVELS.find(l => l.value === level)?.label}
                  </span>
                )}
                {freeOnly && (
                  <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">
                    Free Only
                  </span>
                )}
                <button
                  onClick={() => {
                    setFormat('');
                    setLevel('');
                    setIndustry('');
                    setState('');
                    setFreeOnly(false);
                    setSearchParams({});
                  }}
                  className="text-gray-400 hover:text-white text-xs underline ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Programs List */}
        {filteredPrograms.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No training programs found matching your filters.</p>
            <button
              onClick={() => {
                setFormat('');
                setLevel('');
                setIndustry('');
                setState('');
                setFreeOnly(false);
                setSearchParams({});
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear filters to see all programs
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map(program => (
              <Card key={program.id} className="flex flex-col">
                {program.featured && (
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-t-lg -mt-4 -mx-4 mb-4 text-center">
                    FEATURED PROGRAM
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    program.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    program.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    program.level === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {program.level}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    program.costNumeric === 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {formatCost(program.cost, program.costNumeric)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{program.name}</h3>
                <p className="text-blue-400 text-sm mb-1">{program.provider}</p>
                <p className="text-gray-500 text-xs mb-2">{program.state} • {program.type}</p>
                <p className="text-gray-300 mb-4 flex-1 line-clamp-3">{program.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{program.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white capitalize">{program.format.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Placement Rate:</span>
                    <span className="text-green-400">{program.placement}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  {renderStars(program.rating)}
                  <span className="text-gray-400 text-sm">
                    ({program.reviewsCount.toLocaleString()} reviews)
                  </span>
                </div>

                {/* AI Metrics */}
                <div className="border-t border-dark-border pt-4 mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-sm">AI Exposure:</span>
                      <AIMetricsTooltip type="exposure" value={program.aiExposureIndex} />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getExposureBgColor(program.aiExposureIndex)} ${getExposureColor(program.aiExposureIndex)}`}>
                        {getExposureLabel(program.aiExposureIndex)}
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">{program.aiExposureIndex}%</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        program.aiExposureIndex >= 70 ? 'bg-red-500' :
                        program.aiExposureIndex >= 50 ? 'bg-orange-500' :
                        program.aiExposureIndex >= 30 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${program.aiExposureIndex}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-sm">AI Opportunity:</span>
                      <AIMetricsTooltip type="opportunity" value={program.aiOpportunityIndex} />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getOpportunityBgColor(program.aiOpportunityIndex)} ${getOpportunityColor(program.aiOpportunityIndex)}`}>
                        {getOpportunityLabel(program.aiOpportunityIndex)}
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">{program.aiOpportunityIndex}%</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        program.aiOpportunityIndex >= 75 ? 'bg-emerald-500' :
                        program.aiOpportunityIndex >= 55 ? 'bg-blue-500' :
                        program.aiOpportunityIndex >= 35 ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${program.aiOpportunityIndex}%` }}
                    />
                  </div>
                </div>

                {program.skills && program.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {program.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-dark-bg text-gray-400 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {program.skills.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{program.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <Button fullWidth className="mt-auto">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingPage;
