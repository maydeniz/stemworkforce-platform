// ===========================================
// AI Essay Coach Page
// ===========================================
// Real-time feedback on personal statement narrative & authenticity
// Based on expert panel recommendations from school counselors,
// admissions officers, UX designers, and educational psychologists
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Types
interface Essay {
  id: string;
  title: string;
  type: 'personal-statement' | 'supplemental' | 'activity';
  school?: string;
  prompt?: string;
  content: string;
  wordCount: number;
  wordLimit: number;
  lastEdited: Date;
  progress: number;
  feedback?: FeedbackItem[];
}

interface FeedbackItem {
  id: string;
  type: 'strength' | 'suggestion' | 'consider' | 'important';
  category: string;
  message: string;
  lineStart?: number;
  lineEnd?: number;
}

interface BrainstormPrompt {
  id: string;
  question: string;
  category: string;
  response?: string;
}

// Sample data
const SAMPLE_ESSAYS: Essay[] = [
  {
    id: '1',
    title: 'Common App Personal Statement',
    type: 'personal-statement',
    prompt: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.',
    content: '',
    wordCount: 0,
    wordLimit: 650,
    lastEdited: new Date(),
    progress: 0,
  },
  {
    id: '2',
    title: 'MIT Essay #1',
    type: 'supplemental',
    school: 'MIT',
    prompt: 'We know you lead a busy life, full of activities, many of which are required of you. Tell us about something you do simply for the pleasure of it.',
    content: 'When the house falls quiet after midnight, I find myself drawn to the kitchen...',
    wordCount: 187,
    wordLimit: 250,
    lastEdited: new Date(Date.now() - 86400000),
    progress: 75,
    feedback: [
      { id: 'f1', type: 'strength', category: 'Voice', message: 'Strong opening hook - draws the reader in immediately' },
      { id: 'f2', type: 'suggestion', category: 'Specificity', message: 'Add more sensory details about the cooking process' },
    ],
  },
];

const BRAINSTORM_PROMPTS: BrainstormPrompt[] = [
  { id: 'b1', question: 'Tell me about a time you were completely absorbed in solving a problem. What were you working on, and why couldn\'t you stop?', category: 'Intellectual Curiosity' },
  { id: 'b2', question: 'What\'s something you believe that most people in your life disagree with? How did you come to this belief?', category: 'Independent Thinking' },
  { id: 'b3', question: 'Describe a moment when your understanding of something completely shifted. What changed?', category: 'Growth & Reflection' },
  { id: 'b4', question: 'What would you work on even if no one was watching or grading you?', category: 'Authentic Interest' },
  { id: 'b5', question: 'Think of a failure or setback. What did it teach you about yourself?', category: 'Resilience' },
  { id: 'b6', question: 'Who or what has shaped how you think? This could be a person, book, experience, or even a place.', category: 'Influences' },
];

// Main Component
const EssayCoachPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'brainstorm' | 'editor'>('dashboard');
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [essays, setEssays] = useState<Essay[]>(SAMPLE_ESSAYS);
  const [showNewEssayModal, setShowNewEssayModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-emerald-400">AI Essay Coach</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <span>✍️</span>
                <span>Application Support</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Essay Coach</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Get real-time feedback on your personal statements. Our AI helps you discover
                your unique voice—it asks questions, you write the answers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveView('brainstorm')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>💡</span>
                Start Brainstorming
              </button>
              <button
                onClick={() => setShowNewEssayModal(true)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>+</span>
                New Essay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🔒</span>
              <span>Your essays are private & secure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✨</span>
              <span>AI asks questions—you write the answers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">📝</span>
              <span>Your voice, authentically yours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeView === 'dashboard' && (
            <EssayDashboard
              essays={essays}
              onSelectEssay={(essay) => {
                setSelectedEssay(essay);
                setActiveView('editor');
              }}
              onStartBrainstorm={() => setActiveView('brainstorm')}
              onNewEssay={() => setShowNewEssayModal(true)}
            />
          )}

          {activeView === 'brainstorm' && (
            <BrainstormMode
              prompts={BRAINSTORM_PROMPTS}
              onBack={() => setActiveView('dashboard')}
              onStartEssay={() => {
                // Create new essay with brainstorm responses
                setActiveView('editor');
              }}
            />
          )}

          {activeView === 'editor' && selectedEssay && (
            <EssayEditor
              essay={selectedEssay}
              onBack={() => {
                setSelectedEssay(null);
                setActiveView('dashboard');
              }}
              onSave={(updated) => {
                setEssays(essays.map(e => e.id === updated.id ? updated : e));
              }}
            />
          )}
        </div>
      </section>

      {/* How It Works Section */}
      {activeView === 'dashboard' && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                How the <span className="text-emerald-400">Essay Coach</span> Works
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our approach is based on guidance from school counselors and former admissions officers.
                We help you find your story—we never write it for you.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  icon: '💡',
                  title: 'Brainstorm',
                  description: 'Answer guided questions to surface meaningful stories and experiences from your life.',
                },
                {
                  step: '2',
                  icon: '✍️',
                  title: 'Write',
                  description: 'Draft your essay in a distraction-free editor. Take your time—great essays aren\'t rushed.',
                },
                {
                  step: '3',
                  icon: '🔍',
                  title: 'Get Feedback',
                  description: 'Receive real-time suggestions on structure, specificity, and authenticity.',
                },
                {
                  step: '4',
                  icon: '✨',
                  title: 'Refine',
                  description: 'Iterate and improve. The best essays go through many revisions.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative p-6 rounded-2xl bg-gray-900/50 border border-white/5 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-emerald-500 text-gray-900 font-bold flex items-center justify-center text-sm">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ethical Promise */}
      {activeView === 'dashboard' && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-8 border border-emerald-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  🤝
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Our Promise to You</h3>
                  <div className="space-y-3 text-gray-300">
                    <p>
                      <strong className="text-emerald-400">We will never write your essay.</strong> Admissions officers
                      read thousands of essays. They can spot AI-generated content—and more importantly, your essay
                      is one of the few places where you get to be <em>you</em>.
                    </p>
                    <p>
                      Our AI asks questions to help you discover your own stories. It suggests where to add
                      specificity or shows you where your voice comes through strongest. But every word? That's yours.
                    </p>
                    <p className="text-sm text-gray-400 pt-2 border-t border-white/10">
                      When you finish, you'll see: "You wrote this. Every word. I just asked questions."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Essay Modal */}
      {showNewEssayModal && (
        <NewEssayModal
          onClose={() => setShowNewEssayModal(false)}
          onCreate={(essay) => {
            setEssays([...essays, essay]);
            setSelectedEssay(essay);
            setShowNewEssayModal(false);
            setActiveView('editor');
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// Essay Dashboard Component
// ===========================================
const EssayDashboard: React.FC<{
  essays: Essay[];
  onSelectEssay: (essay: Essay) => void;
  onStartBrainstorm: () => void;
  onNewEssay: () => void;
}> = ({ essays, onSelectEssay, onStartBrainstorm, onNewEssay }) => {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Essays in Progress</div>
          <div className="text-3xl font-bold text-white">{essays.length}</div>
        </div>
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Words Written</div>
          <div className="text-3xl font-bold text-white">
            {essays.reduce((sum, e) => sum + e.wordCount, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Average Progress</div>
          <div className="text-3xl font-bold text-emerald-400">
            {essays.length > 0
              ? Math.round(essays.reduce((sum, e) => sum + e.progress, 0) / essays.length)
              : 0}%
          </div>
        </div>
      </div>

      {/* Essays List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">My Essays</h2>
          <button
            onClick={onNewEssay}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <span>+</span>
            New Essay
          </button>
        </div>

        {essays.length === 0 ? (
          <EmptyState onStartBrainstorm={onStartBrainstorm} onNewEssay={onNewEssay} />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {essays.map((essay) => (
              <EssayCard key={essay.id} essay={essay} onClick={() => onSelectEssay(essay)} />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Action */}
      {essays.length > 0 && essays.some(e => e.progress < 50) && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-xl">
              💡
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">Feeling stuck?</h3>
              <p className="text-sm text-gray-400 mb-3">
                Many students find brainstorming helpful when they're not sure what to write about.
                Our guided questions can help surface stories you might have overlooked.
              </p>
              <button
                onClick={onStartBrainstorm}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium"
              >
                Try Brainstorming →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// Essay Card Component
// ===========================================
const EssayCard: React.FC<{
  essay: Essay;
  onClick: () => void;
}> = ({ essay, onClick }) => {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-xl bg-gray-900/50 border border-white/5 hover:border-emerald-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {essay.school && (
              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">
                {essay.school}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {getTimeAgo(essay.lastEdited)}
            </span>
          </div>
          <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
            {essay.title}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">
            {essay.wordCount} / {essay.wordLimit}
          </div>
        </div>
      </div>

      {essay.prompt && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          "{essay.prompt}"
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
            style={{ width: `${essay.progress}%` }}
          />
        </div>
      </div>

      {/* Feedback Preview */}
      {essay.feedback && essay.feedback.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="text-emerald-400">✓</span>
          <span>{essay.feedback.filter(f => f.type === 'strength').length} strengths</span>
          <span className="text-gray-600">•</span>
          <span>{essay.feedback.filter(f => f.type !== 'strength').length} suggestions</span>
        </div>
      )}
    </button>
  );
};

// ===========================================
// Empty State Component
// ===========================================
const EmptyState: React.FC<{
  onStartBrainstorm: () => void;
  onNewEssay: () => void;
}> = ({ onStartBrainstorm, onNewEssay }) => {
  return (
    <div className="text-center py-16 px-4 rounded-2xl bg-gray-900/50 border border-white/5">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl mx-auto mb-6">
        ✍️
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Every great essay starts somewhere
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Let's find your story together. Would you like to explore ideas through brainstorming,
        or dive straight into writing?
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={onStartBrainstorm}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-semibold rounded-xl transition-all"
        >
          Start with Brainstorming
        </button>
        <button
          onClick={onNewEssay}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
        >
          Upload a Draft
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Brainstorm Mode Component
// ===========================================
const BrainstormMode: React.FC<{
  prompts: BrainstormPrompt[];
  onBack: () => void;
  onStartEssay: () => void;
}> = ({ prompts, onBack, onStartEssay }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentResponse, setCurrentResponse] = useState('');

  const currentPrompt = prompts[currentPromptIndex];
  const isLastPrompt = currentPromptIndex === prompts.length - 1;

  const handleNext = () => {
    if (currentResponse.trim()) {
      setResponses({ ...responses, [currentPrompt.id]: currentResponse });
    }
    if (isLastPrompt) {
      onStartEssay();
    } else {
      setCurrentPromptIndex(currentPromptIndex + 1);
      setCurrentResponse(responses[prompts[currentPromptIndex + 1]?.id] || '');
    }
  };

  const handlePrevious = () => {
    if (currentResponse.trim()) {
      setResponses({ ...responses, [currentPrompt.id]: currentResponse });
    }
    setCurrentPromptIndex(currentPromptIndex - 1);
    setCurrentResponse(responses[prompts[currentPromptIndex - 1]?.id] || '');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Essays</span>
        </button>
        <div className="text-sm text-gray-400">
          Question {currentPromptIndex + 1} of {prompts.length}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
            style={{ width: `${((currentPromptIndex + 1) / prompts.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Prompt Card */}
      <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-8 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs mb-4">
          {currentPrompt.category}
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
          {currentPrompt.question}
        </h2>

        <textarea
          value={currentResponse}
          onChange={(e) => setCurrentResponse(e.target.value)}
          placeholder="Take your time. There's no wrong answer—just write what comes to mind..."
          className="w-full h-48 bg-gray-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
        />

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div>
            {currentResponse.split(/\s+/).filter(Boolean).length} words
          </div>
          <div>
            Press Tab to skip if you're not sure
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentPromptIndex === 0}
          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {prompts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (currentResponse.trim()) {
                  setResponses({ ...responses, [currentPrompt.id]: currentResponse });
                }
                setCurrentPromptIndex(index);
                setCurrentResponse(responses[prompts[index].id] || '');
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPromptIndex
                  ? 'bg-emerald-500 w-6'
                  : responses[prompts[index].id]
                  ? 'bg-emerald-500/50'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-medium rounded-xl transition-all"
        >
          {isLastPrompt ? 'Start Writing →' : 'Next →'}
        </button>
      </div>

      {/* Tips */}
      <div className="mt-12 p-5 rounded-xl bg-gray-900/30 border border-white/5">
        <h4 className="text-sm font-medium text-white mb-2">💡 Brainstorming Tips</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Don't filter yourself—write whatever comes to mind</li>
          <li>• Specific details are more valuable than general statements</li>
          <li>• The best essay topics often feel "small" at first</li>
          <li>• You don't need to answer every question—skip what doesn't resonate</li>
        </ul>
      </div>
    </div>
  );
};

// ===========================================
// Essay Editor Component
// ===========================================
const EssayEditor: React.FC<{
  essay: Essay;
  onBack: () => void;
  onSave: (essay: Essay) => void;
}> = ({ essay, onBack }) => {
  const [content, setContent] = useState(essay.content);
  const [showFeedback, setShowFeedback] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > essay.wordLimit;

  // Simulated feedback based on content
  const getFeedback = (): FeedbackItem[] => {
    const feedback: FeedbackItem[] = [];

    if (content.length > 100) {
      feedback.push({
        id: 'f1',
        type: 'strength',
        category: 'Opening',
        message: 'Your opening draws the reader in. Keep them curious!',
      });
    }

    if (content.toLowerCase().includes('passionate')) {
      feedback.push({
        id: 'f2',
        type: 'consider',
        category: 'Word Choice',
        message: '"Passionate" appears in ~73% of STEM essays. What would only YOU say here?',
      });
    }

    if (content.toLowerCase().includes('life-changing') || content.toLowerCase().includes('changed my life')) {
      feedback.push({
        id: 'f3',
        type: 'important',
        category: 'Specificity',
        message: 'Instead of "life-changing," show us the specific change. What did you think before? What do you think now?',
      });
    }

    if (wordCount > 100 && !content.includes('"') && !content.includes("'")) {
      feedback.push({
        id: 'f4',
        type: 'suggestion',
        category: 'Voice',
        message: 'Consider adding dialogue or a specific moment. It helps readers feel like they\'re there.',
      });
    }

    return feedback;
  };

  const feedback = getFeedback();

  return (
    <div className={`${focusMode ? 'fixed inset-0 bg-gray-950 z-50 p-8' : ''}`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between mb-6 ${focusMode ? '' : ''}`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              focusMode
                ? 'bg-emerald-500 text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {focusMode ? '✓ Focus Mode' : 'Focus Mode'}
          </button>
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              showFeedback && !focusMode
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Feedback {showFeedback && !focusMode ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Editor Layout */}
      <div className={`grid ${showFeedback && !focusMode ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Main Editor */}
        <div className={`${showFeedback && !focusMode ? 'lg:col-span-2' : ''}`}>
          <div className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden">
            {/* Essay Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">{essay.title}</h2>
                  {essay.school && (
                    <span className="text-sm text-gray-400">{essay.school}</span>
                  )}
                </div>
                <div className={`text-sm font-medium ${isOverLimit ? 'text-red-400' : 'text-gray-400'}`}>
                  {wordCount} / {essay.wordLimit} words
                </div>
              </div>
              {essay.prompt && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  "{essay.prompt}"
                </p>
              )}
            </div>

            {/* Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your essay here..."
              className="w-full min-h-[500px] p-6 bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none text-lg leading-relaxed"
              style={{ fontFamily: 'Georgia, serif' }}
            />

            {/* Footer */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
              <div>Auto-saved</div>
              <div>Press Cmd+S to save</div>
            </div>
          </div>
        </div>

        {/* Feedback Panel */}
        {showFeedback && !focusMode && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-white/5 rounded-xl p-4">
              <h3 className="font-medium text-white mb-3">Feedback</h3>

              {feedback.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Keep writing! Feedback will appear as you write more.
                </p>
              ) : (
                <div className="space-y-3">
                  {feedback.map((item) => (
                    <FeedbackCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* AI Writing Stats */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
                <span>✓</span>
                <span>100% Your Words</span>
              </div>
              <p className="text-xs text-gray-400">
                In this session, you wrote {wordCount} words. The AI wrote 0.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================
// Feedback Card Component
// ===========================================
const FeedbackCard: React.FC<{
  item: FeedbackItem;
}> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'strength': return '✓';
      case 'suggestion': return '💡';
      case 'consider': return '⚡';
      case 'important': return '⚠️';
      default: return '•';
    }
  };

  const getColor = () => {
    switch (item.type) {
      case 'strength': return 'text-emerald-400 bg-emerald-500/10';
      case 'suggestion': return 'text-blue-400 bg-blue-500/10';
      case 'consider': return 'text-amber-400 bg-amber-500/10';
      case 'important': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className={`p-3 rounded-lg ${getColor()}`}>
      <div className="flex items-start gap-2">
        <span className="text-sm">{getIcon()}</span>
        <div className="flex-1">
          <div className="text-xs font-medium opacity-80 mb-1">{item.category}</div>
          <p className="text-sm">{item.message}</p>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// New Essay Modal Component
// ===========================================
const NewEssayModal: React.FC<{
  onClose: () => void;
  onCreate: (essay: Essay) => void;
}> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'personal-statement' | 'supplemental'>('personal-statement');
  const [school, setSchool] = useState('');
  const [prompt, setPrompt] = useState('');
  const [wordLimit, setWordLimit] = useState(650);

  const handleCreate = () => {
    const newEssay: Essay = {
      id: Date.now().toString(),
      title: title || 'Untitled Essay',
      type,
      school: school || undefined,
      prompt: prompt || undefined,
      content: '',
      wordCount: 0,
      wordLimit,
      lastEdited: new Date(),
      progress: 0,
    };
    onCreate(newEssay);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">New Essay</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Essay Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Essay Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType('personal-statement')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  type === 'personal-statement'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-medium text-white">Personal Statement</div>
                <div className="text-xs text-gray-400">Common App, Coalition, etc.</div>
              </button>
              <button
                onClick={() => setType('supplemental')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  type === 'supplemental'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-medium text-white">Supplemental Essay</div>
                <div className="text-xs text-gray-400">School-specific essays</div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., MIT Essay #1"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* School (for supplementals) */}
          {type === 'supplemental' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">School</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g., MIT, Stanford, Georgia Tech"
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          )}

          {/* Prompt */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Essay Prompt (optional)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste the essay prompt here..."
              className="w-full h-24 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>

          {/* Word Limit */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Word Limit</label>
            <input
              type="number"
              value={wordLimit}
              onChange={(e) => setWordLimit(parseInt(e.target.value) || 650)}
              className="w-32 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-medium rounded-xl transition-all"
          >
            Create Essay
          </button>
        </div>
      </div>
    </div>
  );
};

export default EssayCoachPage;
