// ===========================================
// Campus Culture Finder Page
// ===========================================
// Match students with campus environments that fit
// their personality and learning preferences
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

// Types
interface CulturePreferences {
  academicIntensity: 'collaborative' | 'competitive' | 'balanced' | null;
  socialScene: 'greek-dominant' | 'activity-based' | 'decentralized' | null;
  campusSize: 'intimate' | 'medium' | 'large' | null;
  location: 'urban' | 'suburban' | 'rural' | 'college-town' | null;
  stemCommunity: 'siloed' | 'interdisciplinary' | 'project-based' | null;
  diversityImportance: 'very' | 'somewhat' | 'neutral' | null;
  supportSystems: string[];
}

interface SchoolCulture {
  id: string;
  name: string;
  location: string;
  cultureScore: number;
  dimensions: {
    academicIntensity: 'collaborative' | 'competitive' | 'balanced';
    socialScene: 'greek-dominant' | 'activity-based' | 'decentralized';
    campusSize: 'intimate' | 'medium' | 'large';
    location: 'urban' | 'suburban' | 'rural' | 'college-town';
    stemCommunity: 'siloed' | 'interdisciplinary' | 'project-based';
  };
  studentVoices: StudentVoice[];
  supportSystems: string[];
  visitQuestions: string[];
}

interface StudentVoice {
  quote: string;
  studentInfo: string;
  topic: string;
}

// Sample data
const SAMPLE_CULTURES: SchoolCulture[] = [
  {
    id: '1',
    name: 'MIT',
    location: 'Cambridge, MA',
    cultureScore: 91,
    dimensions: {
      academicIntensity: 'collaborative',
      socialScene: 'activity-based',
      campusSize: 'medium',
      location: 'urban',
      stemCommunity: 'interdisciplinary',
    },
    studentVoices: [
      { quote: 'The culture of collaboration here is real. People share problem sets, not compete over them.', studentInfo: 'Junior, CS', topic: 'Academic Culture' },
      { quote: 'Hacking culture is alive and well. The pranks bring everyone together.', studentInfo: 'Senior, MechE', topic: 'Campus Life' },
      { quote: 'As a first-gen student, I found my community in student orgs. It took a semester, but now I feel at home.', studentInfo: 'Sophomore, Biology', topic: 'Finding Community' },
    ],
    supportSystems: ['First-Gen Program', 'Mental Health Services', 'Academic Tutoring', 'DEI Office'],
    visitQuestions: [
      'What does collaboration look like in intro courses?',
      'How do students from different majors interact?',
      'What support exists for students who struggle?',
    ],
  },
  {
    id: '2',
    name: 'Georgia Tech',
    location: 'Atlanta, GA',
    cultureScore: 87,
    dimensions: {
      academicIntensity: 'competitive',
      socialScene: 'activity-based',
      campusSize: 'large',
      location: 'urban',
      stemCommunity: 'project-based',
    },
    studentVoices: [
      { quote: 'It\'s intense here, but in a motivating way. Everyone is working hard toward something.', studentInfo: 'Junior, CS', topic: 'Academic Culture' },
      { quote: 'Atlanta makes a huge difference. There\'s always something to do off campus.', studentInfo: 'Senior, IE', topic: 'Location' },
      { quote: 'The VIP program let me do real research as a freshman. That\'s rare.', studentInfo: 'Sophomore, BME', topic: 'Research' },
    ],
    supportSystems: ['Tutoring Center', 'Career Services', 'Multicultural Center', 'LGBTQ Resource Center'],
    visitQuestions: [
      'How competitive vs collaborative is the culture in my major?',
      'What opportunities exist for undergraduate research?',
      'How do students balance coursework with Atlanta opportunities?',
    ],
  },
  {
    id: '3',
    name: 'Harvey Mudd',
    location: 'Claremont, CA',
    cultureScore: 94,
    dimensions: {
      academicIntensity: 'collaborative',
      socialScene: 'decentralized',
      campusSize: 'intimate',
      location: 'suburban',
      stemCommunity: 'interdisciplinary',
    },
    studentVoices: [
      { quote: 'Everyone here is genuinely weird in the best way. You\'ll find your people.', studentInfo: 'Junior, Math/CS', topic: 'Finding Community' },
      { quote: 'The 5C consortium means you get a small school feel with big school resources.', studentInfo: 'Senior, Engineering', topic: 'Campus Life' },
      { quote: 'Professors here know your name. That made all the difference when I was struggling.', studentInfo: 'Sophomore, Physics', topic: 'Academic Support' },
    ],
    supportSystems: ['Academic Excellence', 'DEI Programs', 'Mental Health', '5C Resources'],
    visitQuestions: [
      'How do students use the other Claremont Colleges?',
      'What\'s the social scene like on a small campus?',
      'How does the core curriculum affect major exploration?',
    ],
  },
  {
    id: '4',
    name: 'Purdue',
    location: 'West Lafayette, IN',
    cultureScore: 82,
    dimensions: {
      academicIntensity: 'balanced',
      socialScene: 'greek-dominant',
      campusSize: 'large',
      location: 'college-town',
      stemCommunity: 'siloed',
    },
    studentVoices: [
      { quote: 'Greek life is big here, but it\'s not the only way to find community. I found mine through club sports.', studentInfo: 'Junior, AAE', topic: 'Campus Life' },
      { quote: 'The engineering school has its own culture within Purdue. We stick together.', studentInfo: 'Senior, ME', topic: 'Academic Culture' },
      { quote: 'It\'s a true college town experience. Football Saturdays are something else.', studentInfo: 'Sophomore, CS', topic: 'Location' },
    ],
    supportSystems: ['Engineering Learning Community', 'Minority Engineering Program', 'Counseling', 'Academic Success'],
    visitQuestions: [
      'What\'s the balance between Greek and non-Greek social life?',
      'How does engineering interact with other colleges?',
      'What does a typical weekend look like?',
    ],
  },
];

// Quiz questions
const CULTURE_QUESTIONS = [
  {
    id: 'academic',
    question: 'How do you prefer to learn and work?',
    options: [
      { value: 'collaborative', label: 'Collaboratively', desc: 'Study groups, team projects, shared resources' },
      { value: 'competitive', label: 'Independently with healthy competition', desc: 'Push yourself against high standards' },
      { value: 'balanced', label: 'Mix of both', desc: 'Depends on the subject and situation' },
    ],
  },
  {
    id: 'social',
    question: 'What kind of social environment appeals to you?',
    options: [
      { value: 'greek-dominant', label: 'Structured social organizations', desc: 'Greek life, large organized groups' },
      { value: 'activity-based', label: 'Interest-based communities', desc: 'Clubs, activities, shared hobbies' },
      { value: 'decentralized', label: 'Organic friend groups', desc: 'Small gatherings, fewer formal structures' },
    ],
  },
  {
    id: 'size',
    question: 'What campus size feels right?',
    options: [
      { value: 'intimate', label: 'Small & close-knit', desc: 'Under 5,000 students, know everyone' },
      { value: 'medium', label: 'Medium-sized', desc: '5,000-15,000, balanced community' },
      { value: 'large', label: 'Large & diverse', desc: '15,000+, endless opportunities' },
    ],
  },
  {
    id: 'location',
    question: 'What setting do you envision?',
    options: [
      { value: 'urban', label: 'Urban', desc: 'City access, public transit, internships nearby' },
      { value: 'suburban', label: 'Suburban', desc: 'Quieter, but city accessible' },
      { value: 'college-town', label: 'College Town', desc: 'Town centered around the university' },
      { value: 'rural', label: 'Rural', desc: 'Isolated, immersive campus experience' },
    ],
  },
  {
    id: 'stem',
    question: 'How do you want to experience STEM?',
    options: [
      { value: 'siloed', label: 'Deep specialization', desc: 'Focus intensely on your field' },
      { value: 'interdisciplinary', label: 'Cross-disciplinary', desc: 'Mix STEM with humanities, arts' },
      { value: 'project-based', label: 'Hands-on projects', desc: 'Learn by building real things' },
    ],
  },
];

// Main Component
const CampusCulturePage: React.FC = () => {
  const [view, setView] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [preferences, setPreferences] = useState<Partial<CulturePreferences>>({});
  const [selectedSchool, setSelectedSchool] = useState<SchoolCulture | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    const newPrefs = { ...preferences, [questionId === 'academic' ? 'academicIntensity' :
      questionId === 'social' ? 'socialScene' :
      questionId === 'size' ? 'campusSize' :
      questionId === 'location' ? 'location' : 'stemCommunity']: value };
    setPreferences(newPrefs);

    if (currentQuestion < CULTURE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setView('results');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-cyan-400">Campus Culture Finder</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
                <span>🏛️</span>
                <span>College Discovery</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Campus Culture <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Finder</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Find campuses where you'll thrive. Beyond academics, discover environments
                that match your personality, values, and learning style.
              </p>
            </div>

            {view === 'intro' && (
              <button
                onClick={() => setView('quiz')}
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                Find My Fit
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-cyan-400">💡</span>
            <span>
              Campus culture is experienced differently by each student.
              These insights help inform your questions, not predict your experience.
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'intro' && (
            <IntroView onStart={() => setView('quiz')} />
          )}

          {view === 'quiz' && (
            <CultureQuiz
              questions={CULTURE_QUESTIONS}
              currentIndex={currentQuestion}
              onAnswer={handleAnswer}
              onBack={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                } else {
                  setView('intro');
                }
              }}
            />
          )}

          {view === 'results' && !selectedSchool && (
            <ResultsView
              cultures={SAMPLE_CULTURES}
              preferences={preferences}
              onSelectSchool={setSelectedSchool}
              onRetake={() => {
                setPreferences({});
                setCurrentQuestion(0);
                setView('quiz');
              }}
            />
          )}

          {selectedSchool && (
            <SchoolCultureDetail
              school={selectedSchool}
              onBack={() => setSelectedSchool(null)}
            />
          )}
        </div>
      </section>
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">What is Campus Culture?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          It's the feeling you get walking around campus. The way students interact,
          how professors teach, what weekends look like, and whether you'll feel like you belong.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: '🤝', title: 'Academic Environment', desc: 'Collaborative vs competitive, theoretical vs hands-on' },
          { icon: '🎉', title: 'Social Scene', desc: 'Greek life, clubs, organic friend groups' },
          { icon: '📍', title: 'Location & Setting', desc: 'Urban buzz, college town charm, rural peace' },
          { icon: '🧬', title: 'STEM Community', desc: 'How STEM students connect and collaborate' },
        ].map((item, i) => (
          <div key={i} className="p-5 bg-gray-900/50 border border-white/5 rounded-xl">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">
          Take the 2-Minute Culture Quiz
        </h3>
        <p className="text-gray-400 mb-6">
          Answer 5 quick questions about your preferences, and we'll show you
          campuses that match your vibe.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-all"
        >
          Start Quiz →
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Culture Quiz
// ===========================================
const CultureQuiz: React.FC<{
  questions: typeof CULTURE_QUESTIONS;
  currentIndex: number;
  onAnswer: (questionId: string, value: string) => void;
  onBack: () => void;
}> = ({ questions, currentIndex, onAnswer, onBack }) => {
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <span className="text-sm text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{question.question}</h2>
        <p className="text-gray-400">Select the option that best describes you</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className="w-full p-5 rounded-xl border border-white/10 hover:border-cyan-500/50 bg-gray-900/50 text-left transition-all group"
          >
            <div className="font-medium text-white group-hover:text-cyan-400 transition-colors mb-1">
              {option.label}
            </div>
            <p className="text-sm text-gray-500">{option.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ===========================================
// Results View
// ===========================================
const ResultsView: React.FC<{
  cultures: SchoolCulture[];
  preferences: Partial<CulturePreferences>;
  onSelectSchool: (school: SchoolCulture) => void;
  onRetake: () => void;
}> = ({ cultures, preferences, onSelectSchool, onRetake }) => {
  // Score cultures based on preferences
  const scoredCultures = cultures.map(culture => {
    let score = 0;
    let matches = 0;

    if (preferences.academicIntensity === culture.dimensions.academicIntensity) { score += 25; matches++; }
    if (preferences.socialScene === culture.dimensions.socialScene) { score += 20; matches++; }
    if (preferences.campusSize === culture.dimensions.campusSize) { score += 20; matches++; }
    if (preferences.location === culture.dimensions.location) { score += 20; matches++; }
    if (preferences.stemCommunity === culture.dimensions.stemCommunity) { score += 15; matches++; }

    return { ...culture, cultureScore: Math.min(95, 60 + score), matchCount: matches };
  }).sort((a, b) => b.cultureScore - a.cultureScore);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Culture Matches</h2>
          <p className="text-gray-400">
            Based on your preferences, here are campuses that might feel like home.
          </p>
        </div>
        <button
          onClick={onRetake}
          className="px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Retake Quiz
        </button>
      </div>

      {/* Your Preferences Summary */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
        <h3 className="font-medium text-white mb-4">Your Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {preferences.academicIntensity && (
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">
              {preferences.academicIntensity} environment
            </span>
          )}
          {preferences.socialScene && (
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">
              {preferences.socialScene} social
            </span>
          )}
          {preferences.campusSize && (
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">
              {preferences.campusSize} campus
            </span>
          )}
          {preferences.location && (
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">
              {preferences.location} setting
            </span>
          )}
          {preferences.stemCommunity && (
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">
              {preferences.stemCommunity} STEM
            </span>
          )}
        </div>
      </div>

      {/* School Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {scoredCultures.map((school) => (
          <CultureCard
            key={school.id}
            school={school}
            onClick={() => onSelectSchool(school)}
          />
        ))}
      </div>

      {/* Stretch Section */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2">
          <span>🌟</span>
          Consider Stretching
        </h3>
        <p className="text-sm text-gray-300">
          Sometimes the best fit isn't what you expected. Consider visiting a school
          that's different from your preferences—you might be surprised.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// Culture Card
// ===========================================
const CultureCard: React.FC<{
  school: SchoolCulture & { matchCount?: number };
  onClick: () => void;
}> = ({ school, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left p-5 rounded-xl bg-gray-900/50 border border-white/5 hover:border-cyan-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
            {school.name}
          </h3>
          <p className="text-sm text-gray-500">{school.location}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">{school.cultureScore}%</div>
          <div className="text-xs text-gray-500">culture fit</div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="flex flex-wrap gap-1 mb-4">
        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
          {school.dimensions.academicIntensity}
        </span>
        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
          {school.dimensions.campusSize}
        </span>
        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
          {school.dimensions.location}
        </span>
      </div>

      {/* Student Voice Preview */}
      {school.studentVoices[0] && (
        <blockquote className="text-sm text-gray-400 italic line-clamp-2 mb-3">
          "{school.studentVoices[0].quote}"
        </blockquote>
      )}

      <div className="text-sm text-cyan-400 group-hover:text-cyan-300 transition-colors">
        See student perspectives →
      </div>
    </button>
  );
};

// ===========================================
// School Culture Detail
// ===========================================
const SchoolCultureDetail: React.FC<{
  school: SchoolCulture;
  onBack: () => void;
}> = ({ school, onBack }) => {
  const { info, success } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Results</span>
        </button>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{school.name}</h1>
          <p className="text-gray-400">{school.location}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-cyan-400">{school.cultureScore}%</div>
          <div className="text-sm text-gray-500">culture fit</div>
        </div>
      </div>

      {/* Culture Dimensions */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Culture Dimensions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(school.dimensions).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="font-medium text-white capitalize">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Voices */}
      <div>
        <h3 className="font-semibold text-white mb-4">What Students Say</h3>
        <div className="space-y-4">
          {school.studentVoices.map((voice, i) => (
            <div key={i} className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-3">
                <span>💬</span>
                {voice.topic}
              </div>
              <blockquote className="text-gray-300 italic mb-3">
                "{voice.quote}"
              </blockquote>
              <div className="text-sm text-gray-500">— {voice.studentInfo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Systems */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Support Systems</h3>
        <div className="flex flex-wrap gap-2">
          {school.supportSystems.map((system, i) => (
            <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm">
              {system}
            </span>
          ))}
        </div>
      </div>

      {/* Questions to Ask */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>❓</span>
          Questions to Ask on Your Visit
        </h3>
        <ul className="space-y-3">
          {school.visitQuestions.map((question, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <span className="text-cyan-400 mt-0.5">{i + 1}.</span>
              {question}
            </li>
          ))}
        </ul>
        <button
          onClick={() => info('Checklist download coming soon! Use the categories above to guide your campus visits.')}
          className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Download as checklist →
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => success('School saved to your list!')}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-all"
        >
          Add to My List
        </button>
        <button
          onClick={() => info('Virtual tours are coming soon! Check back for immersive campus experiences.')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Virtual Tour
        </button>
        <button
          onClick={() => info('Culture comparison tool coming soon! Save multiple schools to compare them.')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Compare Culture
        </button>
      </div>
    </div>
  );
};

export default CampusCulturePage;
