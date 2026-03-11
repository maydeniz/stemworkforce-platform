// ===========================================
// College Matcher Page
// ===========================================
// AI-powered college recommendations based on student profile
// Focuses on fit, not prestige. Surfaces hidden gems.
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

// Types
interface StudentProfile {
  academicProfile: {
    gpa: string;
    testScores: string;
    courseRigor: 'standard' | 'honors' | 'ap-some' | 'ap-heavy' | 'ib';
  };
  stemInterests: string[];
  learningStyle: 'collaborative' | 'independent' | 'mixed';
  environmentPrefs: {
    size: 'small' | 'medium' | 'large' | 'any';
    setting: 'urban' | 'suburban' | 'rural' | 'college-town' | 'any';
    region: string[];
  };
  financialContext: {
    needBasedAid: boolean;
    meritAidImportant: boolean;
  };
  priorities: string[];
}

interface SchoolMatch {
  id: string;
  name: string;
  location: string;
  type: string;
  size: number;
  matchScore: number;
  tier: 'reach' | 'match' | 'safety';
  matchReasons: MatchReason[];
  considerations: string[];
  stemStrengths: string[];
  imageUrl?: string;
}

interface MatchReason {
  category: string;
  reason: string;
  strength: 'strong' | 'moderate' | 'emerging';
}

// Profile setup wizard steps
type WizardStep = 'academics' | 'interests' | 'environment' | 'priorities' | 'financial';

// Sample matched schools
const SAMPLE_MATCHES: SchoolMatch[] = [
  {
    id: '1',
    name: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    type: 'Public Research University',
    size: 44000,
    matchScore: 94,
    tier: 'match',
    matchReasons: [
      { category: 'STEM Focus', reason: 'Top-ranked engineering and CS programs match your interests', strength: 'strong' },
      { category: 'Research', reason: 'Undergraduate research opportunities in robotics and AI', strength: 'strong' },
      { category: 'Location', reason: 'Urban setting with strong tech industry connections', strength: 'moderate' },
    ],
    considerations: ['Large class sizes in intro courses', 'Competitive culture in some departments'],
    stemStrengths: ['Computer Science', 'Mechanical Engineering', 'Biomedical Engineering'],
  },
  {
    id: '2',
    name: 'Harvey Mudd College',
    location: 'Claremont, CA',
    type: 'Private Liberal Arts',
    size: 900,
    matchScore: 91,
    tier: 'reach',
    matchReasons: [
      { category: 'Learning Style', reason: 'Collaborative culture matches your preference', strength: 'strong' },
      { category: 'Size', reason: 'Small class sizes and close faculty relationships', strength: 'strong' },
      { category: 'STEM Focus', reason: 'All students take rigorous STEM core curriculum', strength: 'moderate' },
    ],
    considerations: ['Higher cost of attendance', 'Very small and intense environment'],
    stemStrengths: ['Engineering', 'Computer Science', 'Physics'],
  },
  {
    id: '3',
    name: 'University of Illinois Urbana-Champaign',
    location: 'Champaign, IL',
    type: 'Public Research University',
    size: 52000,
    matchScore: 89,
    tier: 'match',
    matchReasons: [
      { category: 'Program Strength', reason: 'Top 5 CS program with diverse specializations', strength: 'strong' },
      { category: 'Value', reason: 'Strong financial aid for out-of-state students', strength: 'moderate' },
      { category: 'Research', reason: 'National Center for Supercomputing Applications on campus', strength: 'strong' },
    ],
    considerations: ['College town setting', 'Very large campus'],
    stemStrengths: ['Computer Science', 'Electrical Engineering', 'Materials Science'],
  },
  {
    id: '4',
    name: 'Olin College of Engineering',
    location: 'Needham, MA',
    type: 'Private Engineering',
    size: 400,
    matchScore: 87,
    tier: 'reach',
    matchReasons: [
      { category: 'Innovation', reason: 'Project-based curriculum matches your learning style', strength: 'strong' },
      { category: 'Community', reason: 'Extremely collaborative, no grades culture', strength: 'strong' },
      { category: 'Industry', reason: 'Strong industry partnerships and real-world projects', strength: 'moderate' },
    ],
    considerations: ['Very small school', 'Limited major options', 'Suburban Boston location'],
    stemStrengths: ['Engineering (all disciplines)', 'Design', 'Entrepreneurship'],
  },
  {
    id: '5',
    name: 'University of Michigan',
    location: 'Ann Arbor, MI',
    type: 'Public Research University',
    size: 47000,
    matchScore: 85,
    tier: 'match',
    matchReasons: [
      { category: 'Balance', reason: 'Strong STEM with robust campus life and athletics', strength: 'moderate' },
      { category: 'Resources', reason: 'Extensive research facilities and funding', strength: 'strong' },
      { category: 'Network', reason: 'Large alumni network in tech industry', strength: 'moderate' },
    ],
    considerations: ['Competitive within engineering', 'Cold winters'],
    stemStrengths: ['Computer Science', 'Aerospace Engineering', 'Biomedical Engineering'],
  },
  {
    id: '6',
    name: 'Rose-Hulman Institute of Technology',
    location: 'Terre Haute, IN',
    type: 'Private Engineering',
    size: 2100,
    matchScore: 83,
    tier: 'safety',
    matchReasons: [
      { category: 'Teaching Focus', reason: 'Undergraduate-focused with exceptional teaching', strength: 'strong' },
      { category: 'Outcomes', reason: 'Consistently #1 in undergraduate engineering rankings', strength: 'strong' },
      { category: 'Community', reason: 'Close-knit, supportive student community', strength: 'moderate' },
    ],
    considerations: ['Rural location', 'Limited non-STEM options', 'Less name recognition'],
    stemStrengths: ['Mechanical Engineering', 'Chemical Engineering', 'Computer Science'],
  },
];

// STEM interest options
const STEM_INTERESTS = [
  'Computer Science', 'Artificial Intelligence', 'Cybersecurity', 'Data Science',
  'Mechanical Engineering', 'Electrical Engineering', 'Biomedical Engineering',
  'Chemical Engineering', 'Aerospace Engineering', 'Civil Engineering',
  'Biology', 'Biochemistry', 'Neuroscience', 'Environmental Science',
  'Physics', 'Chemistry', 'Mathematics', 'Statistics',
  'Robotics', 'Materials Science', 'Renewable Energy',
];

// Priority options
const PRIORITY_OPTIONS = [
  { id: 'research', label: 'Research opportunities', desc: 'Undergraduate research, labs, publications' },
  { id: 'industry', label: 'Industry connections', desc: 'Internships, co-ops, career fairs' },
  { id: 'teaching', label: 'Teaching quality', desc: 'Small classes, accessible professors' },
  { id: 'diversity', label: 'Diverse community', desc: 'Students from varied backgrounds' },
  { id: 'location', label: 'Location & setting', desc: 'City access, weather, region' },
  { id: 'cost', label: 'Affordability', desc: 'Net cost, aid availability' },
  { id: 'social', label: 'Campus life', desc: 'Clubs, events, social scene' },
  { id: 'prestige', label: 'Academic reputation', desc: 'Rankings, brand recognition' },
];

// Main Component
const CollegeMatcherPage: React.FC = () => {
  const [view, setView] = useState<'intro' | 'wizard' | 'results'>('intro');
  const [wizardStep, setWizardStep] = useState<WizardStep>('academics');
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [savedSchools, setSavedSchools] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolMatch | null>(null);

  // Calculate tier balance
  const tierBalance = useMemo(() => {
    const saved = SAMPLE_MATCHES.filter(s => savedSchools.includes(s.id));
    return {
      reach: saved.filter(s => s.tier === 'reach').length,
      match: saved.filter(s => s.tier === 'match').length,
      safety: saved.filter(s => s.tier === 'safety').length,
    };
  }, [savedSchools]);

  const toggleSaveSchool = (id: string) => {
    setSavedSchools(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-blue-400">College Matcher</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
                <span>🎯</span>
                <span>College Discovery</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                College <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Matcher</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Find colleges that fit <em>you</em>—not just the ones everyone's heard of.
                Tell us about yourself, and we'll surface schools that match your goals.
              </p>
            </div>

            {view === 'intro' && (
              <button
                onClick={() => setView('wizard')}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>✨</span>
                Start Matching
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-blue-400">💡</span>
            <span>
              We recommend based on <strong className="text-white">fit</strong>, not rankings.
              Every recommendation shows <em>why</em> it matches you.
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'intro' && (
            <IntroView onStart={() => setView('wizard')} />
          )}

          {view === 'wizard' && (
            <ProfileWizard
              step={wizardStep}
              profile={profile}
              onUpdateProfile={(updates) => setProfile({ ...profile, ...updates })}
              onNextStep={(next) => {
                if (next === 'complete') {
                  setView('results');
                } else {
                  setWizardStep(next);
                }
              }}
              onPrevStep={(prev) => setWizardStep(prev)}
              onCancel={() => setView('intro')}
            />
          )}

          {view === 'results' && (
            <ResultsView
              matches={SAMPLE_MATCHES}
              savedSchools={savedSchools}
              tierBalance={tierBalance}
              onToggleSave={toggleSaveSchool}
              onSelectSchool={setSelectedSchool}
              onEditProfile={() => setView('wizard')}
            />
          )}
        </div>
      </section>

      {/* School Detail Modal */}
      {selectedSchool && (
        <SchoolDetailModal
          school={selectedSchool}
          isSaved={savedSchools.includes(selectedSchool.id)}
          onToggleSave={() => toggleSaveSchool(selectedSchool.id)}
          onClose={() => setSelectedSchool(null)}
        />
      )}
    </div>
  );
};

// ===========================================
// Intro View
// ===========================================
const IntroView: React.FC<{
  onStart: () => void;
}> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* How It Works */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📝', title: 'Tell Us About You', desc: 'Share your interests, goals, and preferences in a 5-minute questionnaire' },
            { icon: '🔍', title: 'Get Matched', desc: 'Our algorithm surfaces schools that fit—including hidden gems you might miss' },
            { icon: '📊', title: 'Build Your List', desc: 'Save matches, compare schools, and build a balanced college list' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">What Makes This Different</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: '🎯', title: 'Fit Over Fame', desc: 'We don\'t sort by rankings. A great match might be a school you\'ve never heard of.' },
            { icon: '🔓', title: 'Transparent Matching', desc: 'Every recommendation shows exactly WHY it matches you. No black boxes.' },
            { icon: '⚖️', title: 'Balanced Lists', desc: 'We help you build lists with reaches, matches, and safeties—not just dream schools.' },
            { icon: '💎', title: 'Hidden Gems', desc: 'Discover schools with exceptional STEM programs that fly under the radar.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <h4 className="font-medium text-white mb-1">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all text-lg"
        >
          Start Your Profile →
        </button>
        <p className="text-sm text-gray-500 mt-4">Takes about 5 minutes. No account required.</p>
      </div>
    </div>
  );
};

// ===========================================
// Profile Wizard
// ===========================================
const ProfileWizard: React.FC<{
  step: WizardStep;
  profile: Partial<StudentProfile>;
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onNextStep: (next: WizardStep | 'complete') => void;
  onPrevStep: (prev: WizardStep) => void;
  onCancel: () => void;
}> = ({ step, profile, onUpdateProfile, onNextStep, onPrevStep, onCancel }) => {
  const steps: { id: WizardStep; label: string }[] = [
    { id: 'academics', label: 'Academics' },
    { id: 'interests', label: 'Interests' },
    { id: 'environment', label: 'Environment' },
    { id: 'priorities', label: 'Priorities' },
    { id: 'financial', label: 'Financial' },
  ];

  const currentIndex = steps.findIndex(s => s.id === step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentIndex === steps.length - 1) {
      onNextStep('complete');
    } else {
      onNextStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onPrevStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Cancel
          </button>
          <span className="text-sm text-gray-400">Step {currentIndex + 1} of {steps.length}</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={`text-xs ${i <= currentIndex ? 'text-blue-400' : 'text-gray-600'}`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-8 mb-6">
        {step === 'academics' && (
          <AcademicsStep profile={profile} onUpdate={onUpdateProfile} />
        )}
        {step === 'interests' && (
          <InterestsStep profile={profile} onUpdate={onUpdateProfile} />
        )}
        {step === 'environment' && (
          <EnvironmentStep profile={profile} onUpdate={onUpdateProfile} />
        )}
        {step === 'priorities' && (
          <PrioritiesStep profile={profile} onUpdate={onUpdateProfile} />
        )}
        {step === 'financial' && (
          <FinancialStep profile={profile} onUpdate={onUpdateProfile} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all"
        >
          {currentIndex === steps.length - 1 ? 'See My Matches' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Wizard Step: Academics
// ===========================================
const AcademicsStep: React.FC<{
  profile: Partial<StudentProfile>;
  onUpdate: (updates: Partial<StudentProfile>) => void;
}> = ({ profile, onUpdate }) => {
  const [gpa, setGpa] = useState(profile.academicProfile?.gpa || '');
  const [testScores, setTestScores] = useState(profile.academicProfile?.testScores || '');
  const [rigor, setRigor] = useState(profile.academicProfile?.courseRigor || 'honors');

  const handleUpdate = () => {
    onUpdate({
      academicProfile: { gpa, testScores, courseRigor: rigor },
    });
  };

  return (
    <div className="space-y-6" onBlur={handleUpdate}>
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Academic Profile</h2>
        <p className="text-gray-400">
          This helps us understand which schools are realistic targets for you.
          All fields are optional—we can still match without scores.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">GPA (optional)</label>
          <input
            type="text"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder="e.g., 3.8 unweighted"
            className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          <p className="text-xs text-gray-500 mt-1">Unweighted preferred, but weighted is fine</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Test Scores (optional)</label>
          <input
            type="text"
            value={testScores}
            onChange={(e) => setTestScores(e.target.value)}
            placeholder="e.g., SAT 1450 or ACT 32"
            className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank if test-optional or not yet taken</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-3">Course Rigor</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { id: 'standard', label: 'Standard courses' },
              { id: 'honors', label: 'Mix of honors/regular' },
              { id: 'ap-some', label: 'Some AP/IB courses' },
              { id: 'ap-heavy', label: 'Heavy AP/IB load' },
              { id: 'ib', label: 'Full IB Diploma' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setRigor(option.id as StudentProfile['academicProfile']['courseRigor'])}
                className={`p-3 rounded-lg border text-left transition-all ${
                  rigor === option.id
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-400">💡</span>
          <p className="text-sm text-gray-300">
            We consider course rigor in context. Taking challenging courses available at your school
            matters more than specific numbers.
          </p>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Wizard Step: Interests
// ===========================================
const InterestsStep: React.FC<{
  profile: Partial<StudentProfile>;
  onUpdate: (updates: Partial<StudentProfile>) => void;
}> = ({ profile, onUpdate }) => {
  const [selected, setSelected] = useState<string[]>(profile.stemInterests || []);
  const [learningStyle, setLearningStyle] = useState(profile.learningStyle || 'mixed');

  const toggleInterest = (interest: string) => {
    const newSelected = selected.includes(interest)
      ? selected.filter(i => i !== interest)
      : [...selected, interest];
    setSelected(newSelected);
    onUpdate({ stemInterests: newSelected, learningStyle });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">STEM Interests</h2>
        <p className="text-gray-400">
          Select all areas that interest you. Don't worry about being certain—this helps
          us find schools with strong programs in your areas.
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-3">Select your interests (choose 3-6)</label>
        <div className="flex flex-wrap gap-2">
          {STEM_INTERESTS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                selected.includes(interest)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Selected: {selected.length}</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-3">How do you prefer to learn?</label>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { id: 'collaborative', label: 'Collaborative', desc: 'Group projects, team-based learning' },
            { id: 'independent', label: 'Independent', desc: 'Self-paced, individual work' },
            { id: 'mixed', label: 'Mix of Both', desc: 'Varies by subject and project' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setLearningStyle(option.id as StudentProfile['learningStyle']);
                onUpdate({ stemInterests: selected, learningStyle: option.id as StudentProfile['learningStyle'] });
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                learningStyle === option.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="font-medium text-white mb-1">{option.label}</div>
              <div className="text-xs text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Wizard Step: Environment
// ===========================================
const EnvironmentStep: React.FC<{
  profile: Partial<StudentProfile>;
  onUpdate: (updates: Partial<StudentProfile>) => void;
}> = ({ profile, onUpdate }) => {
  const [size, setSize] = useState(profile.environmentPrefs?.size || 'any');
  const [setting, setSetting] = useState(profile.environmentPrefs?.setting || 'any');
  const [regions, setRegions] = useState<string[]>(profile.environmentPrefs?.region || []);

  const toggleRegion = (region: string) => {
    const newRegions = regions.includes(region)
      ? regions.filter(r => r !== region)
      : [...regions, region];
    setRegions(newRegions);
    onUpdate({ environmentPrefs: { size, setting, region: newRegions } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Environment Preferences</h2>
        <p className="text-gray-400">
          Where would you thrive? There's no wrong answer—some students love big
          campuses, others prefer intimate settings.
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-3">School Size</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'small', label: 'Small', desc: '< 5,000 students' },
            { id: 'medium', label: 'Medium', desc: '5,000-15,000' },
            { id: 'large', label: 'Large', desc: '15,000+' },
            { id: 'any', label: 'No Preference', desc: 'Open to all' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSize(option.id as StudentProfile['environmentPrefs']['size']);
                onUpdate({ environmentPrefs: { size: option.id as StudentProfile['environmentPrefs']['size'], setting, region: regions } });
              }}
              className={`p-3 rounded-xl border text-center transition-all ${
                size === option.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="font-medium text-white">{option.label}</div>
              <div className="text-xs text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-3">Setting</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'urban', label: 'Urban' },
            { id: 'suburban', label: 'Suburban' },
            { id: 'college-town', label: 'College Town' },
            { id: 'rural', label: 'Rural' },
            { id: 'any', label: 'Any' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSetting(option.id as StudentProfile['environmentPrefs']['setting']);
                onUpdate({ environmentPrefs: { size, setting: option.id as StudentProfile['environmentPrefs']['setting'], region: regions } });
              }}
              className={`p-3 rounded-xl border text-center transition-all ${
                setting === option.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="font-medium text-white text-sm">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-3">Regions (select all that interest you)</label>
        <div className="flex flex-wrap gap-2">
          {['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast', 'Anywhere in US'].map((region) => (
            <button
              key={region}
              onClick={() => toggleRegion(region)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                regions.includes(region)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Wizard Step: Priorities
// ===========================================
const PrioritiesStep: React.FC<{
  profile: Partial<StudentProfile>;
  onUpdate: (updates: Partial<StudentProfile>) => void;
}> = ({ profile, onUpdate }) => {
  const [selected, setSelected] = useState<string[]>(profile.priorities || []);

  const togglePriority = (id: string) => {
    let newSelected: string[];
    if (selected.includes(id)) {
      newSelected = selected.filter(p => p !== id);
    } else if (selected.length < 4) {
      newSelected = [...selected, id];
    } else {
      return; // Max 4 priorities
    }
    setSelected(newSelected);
    onUpdate({ priorities: newSelected });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">What Matters Most?</h2>
        <p className="text-gray-400">
          Choose up to 4 priorities. We'll weight these heavily in your matches.
          Be honest—there's no "right" answer.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {PRIORITY_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => togglePriority(option.id)}
            disabled={!selected.includes(option.id) && selected.length >= 4}
            className={`p-4 rounded-xl border text-left transition-all ${
              selected.includes(option.id)
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">{option.label}</span>
              {selected.includes(option.id) && (
                <span className="text-blue-400 text-sm">#{selected.indexOf(option.id) + 1}</span>
              )}
            </div>
            <p className="text-xs text-gray-500">{option.desc}</p>
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        {selected.length}/4 priorities selected
      </div>
    </div>
  );
};

// ===========================================
// Wizard Step: Financial
// ===========================================
const FinancialStep: React.FC<{
  profile: Partial<StudentProfile>;
  onUpdate: (updates: Partial<StudentProfile>) => void;
}> = ({ profile, onUpdate }) => {
  const [needBased, setNeedBased] = useState(profile.financialContext?.needBasedAid ?? true);
  const [meritImportant, setMeritImportant] = useState(profile.financialContext?.meritAidImportant ?? false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Financial Considerations</h2>
        <p className="text-gray-400">
          This helps us highlight schools with strong financial aid. All information
          is optional and kept private.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={needBased}
              onChange={(e) => {
                setNeedBased(e.target.checked);
                onUpdate({ financialContext: { needBasedAid: e.target.checked, meritAidImportant: meritImportant } });
              }}
              className="mt-1 w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-white">I'll need financial aid</div>
              <p className="text-sm text-gray-400">
                We'll highlight schools with strong need-based aid programs
              </p>
            </div>
          </label>
        </div>

        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={meritImportant}
              onChange={(e) => {
                setMeritImportant(e.target.checked);
                onUpdate({ financialContext: { needBasedAid: needBased, meritAidImportant: e.target.checked } });
              }}
              className="mt-1 w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-white">Merit scholarships are important</div>
              <p className="text-sm text-gray-400">
                We'll include schools known for merit-based awards
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-emerald-400">💰</span>
          <div className="text-sm text-gray-300">
            <strong className="text-white">Don't rule schools out by sticker price!</strong>
            <br />
            Many expensive schools offer generous aid. We'll show estimated net costs
            where available.
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Results View
// ===========================================
const ResultsView: React.FC<{
  matches: SchoolMatch[];
  savedSchools: string[];
  tierBalance: { reach: number; match: number; safety: number };
  onToggleSave: (id: string) => void;
  onSelectSchool: (school: SchoolMatch) => void;
  onEditProfile: () => void;
}> = ({ matches, savedSchools, tierBalance, onToggleSave, onSelectSchool, onEditProfile }) => {
  const [filter, setFilter] = useState<'all' | 'reach' | 'match' | 'safety'>('all');
  const [showDiscovery, setShowDiscovery] = useState(false);

  const filteredMatches = filter === 'all'
    ? matches
    : matches.filter(m => m.tier === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Matches</h2>
          <p className="text-gray-400">
            {matches.length} schools match your profile. Click any school to learn why.
          </p>
        </div>
        <button
          onClick={onEditProfile}
          className="px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          Edit Profile →
        </button>
      </div>

      {/* Balance Indicator */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">Your Saved List Balance</h3>
          <span className="text-sm text-gray-400">{savedSchools.length} schools saved</span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-red-400">Reaches</span>
              <span className="text-gray-400">{tierBalance.reach}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${(tierBalance.reach / Math.max(savedSchools.length, 1)) * 100}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-amber-400">Matches</span>
              <span className="text-gray-400">{tierBalance.match}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${(tierBalance.match / Math.max(savedSchools.length, 1)) * 100}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-emerald-400">Safeties</span>
              <span className="text-gray-400">{tierBalance.safety}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${(tierBalance.safety / Math.max(savedSchools.length, 1)) * 100}%` }} />
            </div>
          </div>
        </div>
        {savedSchools.length > 0 && tierBalance.safety === 0 && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-300">
            ⚠️ Consider adding some safety schools to your list
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Matches' },
          { id: 'reach', label: 'Reaches', color: 'red' },
          { id: 'match', label: 'Matches', color: 'amber' },
          { id: 'safety', label: 'Safeties', color: 'emerald' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setShowDiscovery(!showDiscovery)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ml-auto ${
            showDiscovery
              ? 'bg-violet-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          💎 Hidden Gems Mode
        </button>
      </div>

      {/* School Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredMatches.map((school) => (
          <SchoolCard
            key={school.id}
            school={school}
            isSaved={savedSchools.includes(school.id)}
            onToggleSave={() => onToggleSave(school.id)}
            onClick={() => onSelectSchool(school)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="text-center p-6 bg-gray-900/50 border border-white/5 rounded-xl">
        <p className="text-sm text-gray-400">
          These recommendations are based on fit, not likelihood of admission.
          Every student's situation is unique. Use these as starting points for your own research.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// School Card
// ===========================================
const SchoolCard: React.FC<{
  school: SchoolMatch;
  isSaved: boolean;
  onToggleSave: () => void;
  onClick: () => void;
}> = ({ school, isSaved, onToggleSave, onClick }) => {
  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'reach': return 'bg-red-500/20 text-red-400';
      case 'match': return 'bg-amber-500/20 text-amber-400';
      case 'safety': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5 hover:border-blue-500/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onClick}
              className="font-semibold text-white hover:text-blue-400 transition-colors text-left"
            >
              {school.name}
            </button>
            <span className={`px-2 py-0.5 rounded text-xs ${getTierStyle(school.tier)}`}>
              {school.tier}
            </span>
          </div>
          <p className="text-sm text-gray-500">{school.location} • {school.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{school.matchScore}%</div>
            <div className="text-xs text-gray-500">match</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            className={`p-2 rounded-lg transition-all ${
              isSaved
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </div>
      </div>

      {/* Top Match Reasons */}
      <div className="space-y-2 mb-4">
        {school.matchReasons.slice(0, 2).map((reason, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-0.5 ${
              reason.strength === 'strong' ? 'text-emerald-400' :
              reason.strength === 'moderate' ? 'text-amber-400' : 'text-gray-400'
            }`}>
              {reason.strength === 'strong' ? '✓' : '○'}
            </span>
            <span className="text-gray-300">{reason.reason}</span>
          </div>
        ))}
      </div>

      {/* STEM Strengths */}
      <div className="flex flex-wrap gap-1">
        {school.stemStrengths.slice(0, 3).map((strength, i) => (
          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
            {strength}
          </span>
        ))}
      </div>

      <button
        onClick={onClick}
        className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        Why this match? →
      </button>
    </div>
  );
};

// ===========================================
// School Detail Modal
// ===========================================
const SchoolDetailModal: React.FC<{
  school: SchoolMatch;
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}> = ({ school, isSaved, onToggleSave, onClose }) => {
  const { info } = useNotifications();

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'reach': return 'bg-red-500/20 text-red-400';
      case 'match': return 'bg-amber-500/20 text-amber-400';
      case 'safety': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{school.name}</h2>
              <span className={`px-2 py-0.5 rounded text-xs ${getTierStyle(school.tier)}`}>
                {school.tier}
              </span>
            </div>
            <p className="text-sm text-gray-400">{school.location}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Match Score */}
          <div className="text-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="text-5xl font-bold text-blue-400 mb-2">{school.matchScore}%</div>
            <p className="text-gray-400">Match Score</p>
          </div>

          {/* Why This Match */}
          <div>
            <h3 className="font-semibold text-white mb-4">Why This Matches You</h3>
            <div className="space-y-3">
              {school.matchReasons.map((reason, i) => (
                <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{reason.category}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      reason.strength === 'strong' ? 'bg-emerald-500/20 text-emerald-400' :
                      reason.strength === 'moderate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {reason.strength}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{reason.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STEM Strengths */}
          <div>
            <h3 className="font-semibold text-white mb-3">STEM Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {school.stemStrengths.map((strength, i) => (
                <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
                  {strength}
                </span>
              ))}
            </div>
          </div>

          {/* Considerations */}
          <div>
            <h3 className="font-semibold text-white mb-3">Things to Consider</h3>
            <div className="space-y-2">
              {school.considerations.map((consideration, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-amber-400 mt-0.5">•</span>
                  {consideration}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">Type</div>
              <div className="font-medium text-white">{school.type}</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">Size</div>
              <div className="font-medium text-white">{school.size.toLocaleString()} students</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onToggleSave}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isSaved
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {isSaved ? '♥ Saved to List' : '♡ Save to List'}
            </button>
            <button
              onClick={() => info('School comparison coming soon! Save schools to compare them later.')}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all"
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeMatcherPage;
