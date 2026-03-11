// ===========================================
// Mock Admissions Review Page
// ===========================================
// Helps students see their application through
// admissions committee eyes
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

// Types
interface ApplicationReview {
  school: string;
  lastUpdated: Date;
  overallStrength: 'competitive' | 'strong' | 'developing' | 'needs-work';
  scores: {
    academicProfile: number;
    extracurricularDepth: number;
    essayAuthenticity: number;
    narrativeCoherence: number;
    differentiationFactor: number;
    institutionalFit: number;
  };
  whatAOMightRemember: string;
  questionsAOMightAsk: string[];
  strengths: string[];
  gaps: string[];
  roadmap: RoadmapItem[];
}

interface RoadmapItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedTime: string;
  completed: boolean;
}

// Sample Data
const SAMPLE_REVIEW: ApplicationReview = {
  school: 'MIT',
  lastUpdated: new Date(),
  overallStrength: 'competitive',
  scores: {
    academicProfile: 88,
    extracurricularDepth: 72,
    essayAuthenticity: 85,
    narrativeCoherence: 68,
    differentiationFactor: 78,
    institutionalFit: 82,
  },
  whatAOMightRemember: 'The student who spent a summer debugging a CRISPR protocol and found meaning in the failures. Strong technical foundation with unusual self-awareness about the research process. Maker mindset evident.',
  questionsAOMightAsk: [
    'How did the CRISPR experience shape your understanding of research methodology?',
    'Tell me more about leading the robotics team - what was your biggest challenge?',
    'Why computational biology specifically? What draws you to the intersection?',
  ],
  strengths: [
    'Personal statement voice is authentic and distinctive',
    'Research description shows genuine intellectual growth',
    'Course rigor demonstrates challenge-seeking behavior',
    'Essays avoid common clichés and generic language',
    'Clear through-line connecting biology and CS interests',
  ],
  gaps: [
    'Leadership dimension could be stronger in essays',
    'Why computational biology specifically not fully articulated',
    'Activities list could better highlight collaborative work',
    'Recommender perspectives may overlap - consider diversification',
  ],
  roadmap: [
    {
      id: '1',
      priority: 'high',
      title: 'Strengthen "Why MIT?" essay connection',
      description: 'Add specific connection to Prof. Tambe\'s AI for social good research',
      estimatedTime: '30-45 min',
      completed: false,
    },
    {
      id: '2',
      priority: 'high',
      title: 'Add collaborative dimension to narrative',
      description: 'Emphasize peer tutoring or team aspects in essays',
      estimatedTime: '20-30 min',
      completed: false,
    },
    {
      id: '3',
      priority: 'medium',
      title: 'Reorder activities list',
      description: 'Lead with research experience - it\'s your strongest differentiator',
      estimatedTime: '10 min',
      completed: false,
    },
    {
      id: '4',
      priority: 'low',
      title: 'Consider supplemental recommender',
      description: 'A mentor from research could add valuable perspective',
      estimatedTime: 'Variable',
      completed: false,
    },
  ],
};

// Main Component
const MockAdmissionsPage: React.FC = () => {
  const [review, setReview] = useState<ApplicationReview | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');

  const handleStartReview = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setReview({ ...SAMPLE_REVIEW, school: selectedSchool || 'MIT' });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-indigo-400">Mock Admissions Review</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
                <span>📝</span>
                <span>Application Support</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Mock Admissions <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Review</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                See your application through admissions committee eyes. Understand how
                different components work together and identify gaps before you submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-amber-400">⚠️</span>
            <span>
              This is a simulated review to help you strengthen your application.
              It is <strong className="text-white">not predictive</strong> of actual admissions decisions.
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!review && !isAnalyzing ? (
            <ReviewSetup
              selectedSchool={selectedSchool}
              onSchoolChange={setSelectedSchool}
              onStart={handleStartReview}
            />
          ) : isAnalyzing ? (
            <AnalyzingState />
          ) : review ? (
            <ReviewResults
              review={review}
              onStartNew={() => setReview(null)}
              onUpdateRoadmap={(updatedRoadmap) => {
                setReview({ ...review, roadmap: updatedRoadmap });
              }}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
};

// ===========================================
// Review Setup
// ===========================================
const ReviewSetup: React.FC<{
  selectedSchool: string;
  onSchoolChange: (school: string) => void;
  onStart: () => void;
}> = ({ selectedSchool, onSchoolChange, onStart }) => {
  const { info } = useNotifications();
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Intro Card */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl p-8 border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl flex-shrink-0">
            👁️
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Before You Begin
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                This tool simulates how an admissions officer might read your application.
                It will identify strengths and gaps in your application narrative.
              </p>
              <p className="text-sm text-gray-400">
                Some of the feedback may be hard to hear. Remember—the goal is a stronger,
                more authentic application, not a different version of you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Components Checklist */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">What We'll Analyze</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '📝', label: 'Personal Statement', desc: 'Voice, authenticity, narrative' },
            { icon: '📚', label: 'Activities List', desc: 'Depth, impact, leadership' },
            { icon: '✍️', label: 'Supplemental Essays', desc: 'Specificity, fit, connections' },
            { icon: '📊', label: 'Academic Profile', desc: 'Rigor, trajectory, context' },
            { icon: '🔗', label: 'Narrative Coherence', desc: 'How your story fits together' },
            { icon: '⭐', label: 'Differentiation', desc: 'What makes you memorable' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-medium text-white text-sm">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* School Selection */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Select School for Review</h3>
        <p className="text-sm text-gray-400 mb-4">
          Choose a school to analyze fit. We'll evaluate how well your application
          aligns with this institution's values and offerings.
        </p>
        <select
          value={selectedSchool}
          onChange={(e) => onSchoolChange(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50"
        >
          <option value="">Select a school...</option>
          <option value="MIT">MIT</option>
          <option value="Stanford">Stanford</option>
          <option value="Harvard">Harvard</option>
          <option value="Caltech">Caltech</option>
          <option value="Carnegie Mellon">Carnegie Mellon</option>
          <option value="Georgia Tech">Georgia Tech</option>
          <option value="UC Berkeley">UC Berkeley</option>
        </select>
      </div>

      {/* Upload Components (Placeholder) */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Application Materials</h3>
        <p className="text-sm text-gray-400 mb-4">
          For the most accurate review, we need access to your application materials.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">✓</span>
              <span className="text-gray-300">Personal Statement</span>
            </div>
            <span className="text-xs text-gray-500">From Essay Coach</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">✓</span>
              <span className="text-gray-300">Activities List</span>
            </div>
            <span className="text-xs text-gray-500">From App Tracker</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-amber-400">○</span>
              <span className="text-gray-300">Supplemental Essays</span>
            </div>
            <button
              onClick={() => info('Essay import coming soon! For now, paste your essays directly into the text fields.')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Import →
            </button>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <button
          onClick={onStart}
          disabled={!selectedSchool}
          className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Admissions Review →
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Analyzing State
// ===========================================
const AnalyzingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    'Reading personal statement...',
    'Analyzing activities list...',
    'Reviewing essays for authenticity...',
    'Checking narrative coherence...',
    'Evaluating institutional fit...',
    'Generating insights...',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center text-4xl mx-auto mb-8 animate-pulse">
        🔍
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">Analyzing Your Application</h2>
      <p className="text-gray-400 mb-8">{steps[currentStep]}</p>
      <div className="h-2 bg-gray-800 rounded-full max-w-md mx-auto overflow-hidden">
        <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
};

// ===========================================
// Review Results
// ===========================================
const ReviewResults: React.FC<{
  review: ApplicationReview;
  onStartNew: () => void;
  onUpdateRoadmap: (roadmap: RoadmapItem[]) => void;
}> = ({ review, onStartNew, onUpdateRoadmap }) => {
  const { info } = useNotifications();
  const getStrengthLabel = (strength: ApplicationReview['overallStrength']) => {
    switch (strength) {
      case 'competitive': return { label: 'Competitive', color: 'text-emerald-400 bg-emerald-500/20' };
      case 'strong': return { label: 'Strong', color: 'text-blue-400 bg-blue-500/20' };
      case 'developing': return { label: 'Developing', color: 'text-amber-400 bg-amber-500/20' };
      default: return { label: 'Needs Work', color: 'text-red-400 bg-red-500/20' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const strengthLabel = getStrengthLabel(review.overallStrength);

  const toggleRoadmapItem = (id: string) => {
    const updated = review.roadmap.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateRoadmap(updated);
  };

  return (
    <div className="space-y-8">
      {/* Application Snapshot */}
      <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{review.school} Application Review</h2>
            <p className="text-gray-400">
              Last updated: {new Date(review.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl ${strengthLabel.color}`}>
              <span className="font-semibold">{strengthLabel.label}</span>
            </div>
            <button
              onClick={onStartNew}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              New Review
            </button>
          </div>
        </div>

        {/* Score Bars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(review.scores).map(([key, score]) => {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getScoreBarColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What AO Might Remember */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl p-6 border border-indigo-500/20">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>💭</span>
          What an Admissions Officer Might Remember
        </h3>
        <blockquote className="text-lg text-gray-300 italic">
          "{review.whatAOMightRemember}"
        </blockquote>
      </div>

      {/* Questions They Might Ask */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>❓</span>
          Questions They Might Ask (in an interview)
        </h3>
        <ul className="space-y-3">
          {review.questionsAOMightAsk.map((question, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <span className="text-indigo-400 mt-0.5">{i + 1}.</span>
              <span className="text-gray-300">{question}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Strengths and Gaps */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
          <h3 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <span>✓</span>
            Things You're Doing Well
          </h3>
          <ul className="space-y-2">
            {review.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
          <h3 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            Potential Gaps
          </h3>
          <ul className="space-y-2">
            {review.gaps.map((gap, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Roadmap */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
          <span>🗺️</span>
          Improvement Roadmap
        </h3>

        <div className="space-y-4">
          {/* High Priority */}
          <div>
            <h4 className="text-sm font-medium text-red-400 mb-3 uppercase tracking-wide">
              Priority 1: High Impact
            </h4>
            <div className="space-y-2">
              {review.roadmap.filter(item => item.priority === 'high').map((item) => (
                <RoadmapItemCard
                  key={item.id}
                  item={item}
                  onToggle={() => toggleRoadmapItem(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Medium Priority */}
          <div>
            <h4 className="text-sm font-medium text-amber-400 mb-3 uppercase tracking-wide">
              Priority 2: Would Strengthen
            </h4>
            <div className="space-y-2">
              {review.roadmap.filter(item => item.priority === 'medium').map((item) => (
                <RoadmapItemCard
                  key={item.id}
                  item={item}
                  onToggle={() => toggleRoadmapItem(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Low Priority */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
              Priority 3: If Time Allows
            </h4>
            <div className="space-y-2">
              {review.roadmap.filter(item => item.priority === 'low').map((item) => (
                <RoadmapItemCard
                  key={item.id}
                  item={item}
                  onToggle={() => toggleRoadmapItem(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-2xl">📌</span>
          <div>
            <h4 className="font-medium text-white mb-2">Important Context</h4>
            <p className="text-sm text-gray-400 mb-3">
              This analysis helps you see patterns in your application—it cannot predict
              admissions decisions. Admissions is holistic and contextual: they consider
              your school, your opportunities, and thousands of factors we can't measure.
            </p>
            <p className="text-sm text-gray-500">
              Use this to find gaps in your <em>narrative</em>, not to try to "optimize"
              yourself into someone you're not.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => info('Report download coming soon! Your admissions review results are saved in this session.')}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all"
        >
          Download Report
        </button>
        <button
          onClick={() => info('Counselor sharing coming soon! You can screenshot your results to share with your counselor.')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Share with Counselor
        </button>
        <button
          onClick={onStartNew}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Review Another School
        </button>
      </div>

      {/* Completion Message */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
        <div className="text-4xl mb-4">🎓</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          You've seen your application through admissions eyes
        </h3>
        <p className="text-gray-400 max-w-lg mx-auto">
          Remember: this analysis shows patterns, not predictions. The human readers
          who review your application will bring their own perspectives.
          Trust the authentic story you've told.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// Roadmap Item Card
// ===========================================
const RoadmapItemCard: React.FC<{
  item: RoadmapItem;
  onToggle: () => void;
}> = ({ item, onToggle }) => {
  return (
    <div className={`p-4 rounded-lg border transition-all ${
      item.completed
        ? 'bg-emerald-500/10 border-emerald-500/30'
        : 'bg-gray-800/50 border-white/5'
    }`}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={onToggle}
          className="mt-1 w-4 h-4 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-500"
        />
        <div className="flex-1">
          <div className={`font-medium text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
            {item.title}
          </div>
          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          <span className="text-xs text-gray-600 mt-2 inline-block">
            Est. time: {item.estimatedTime}
          </span>
        </div>
      </label>
    </div>
  );
};

export default MockAdmissionsPage;
