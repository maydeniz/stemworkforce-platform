// ===========================================
// Interview Prep Simulator Page
// ===========================================
// AI-powered mock interviews with STEM-specific questions
// Builds confidence through practice and feedback
// ===========================================

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Types
interface InterviewSession {
  id: string;
  type: 'general' | 'school-specific' | 'technical' | 'stress-test';
  school?: string;
  persona: InterviewerPersona;
  date: Date;
  duration: number;
  questionsAsked: number;
  overallScore: number;
  feedback: SessionFeedback;
  responses: QuestionResponse[];
}

interface InterviewerPersona {
  id: string;
  name: string;
  title: string;
  style: string;
  difficulty: 'easy' | 'medium' | 'hard';
  avatar: string;
}

interface Question {
  id: string;
  category: string;
  text: string;
  followUps?: string[];
  tips?: string;
}

interface QuestionResponse {
  questionId: string;
  question: string;
  duration: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    score: number;
  };
}

interface SessionFeedback {
  contentDepth: number;
  authenticity: number;
  structure: number;
  specificExamples: number;
  responseLength: number;
  overallImpressions: string;
  keyStrengths: string[];
  areasToImprove: string[];
}

// Interviewer Personas
const PERSONAS: InterviewerPersona[] = [
  {
    id: 'friendly',
    name: 'Alex',
    title: 'Friendly Alumni',
    style: 'Warm, conversational, puts you at ease',
    difficulty: 'easy',
    avatar: '👨‍💼',
  },
  {
    id: 'academic',
    name: 'Dr. Chen',
    title: 'Academic Professor',
    style: 'Deep technical questions, values precision',
    difficulty: 'medium',
    avatar: '👩‍🔬',
  },
  {
    id: 'admissions',
    name: 'Jordan',
    title: 'Admissions Officer',
    style: 'Looking for fit and authenticity',
    difficulty: 'medium',
    avatar: '📋',
  },
  {
    id: 'challenging',
    name: 'Marcus',
    title: 'Challenging Interviewer',
    style: 'Pushback, follow-ups, stress test',
    difficulty: 'hard',
    avatar: '🎯',
  },
];

// Question Bank
const QUESTION_BANK: Question[] = [
  { id: 'q1', category: 'Introduction', text: 'Tell me about yourself.', tips: 'Keep it to 90 seconds. Focus on what makes you unique.' },
  { id: 'q2', category: 'Academic Interest', text: 'Why do you want to study computer science?', tips: 'Be specific about what draws you to this field.' },
  { id: 'q3', category: 'Why This School', text: 'Why are you interested in attending MIT?', tips: 'Reference specific programs, faculty, or opportunities.' },
  { id: 'q4', category: 'Research', text: 'Walk me through your research experience.', tips: 'Explain technical work accessibly. Focus on what you learned.' },
  { id: 'q5', category: 'Problem Solving', text: 'Tell me about a challenging problem you solved.', tips: 'Use the STAR method: Situation, Task, Action, Result.' },
  { id: 'q6', category: 'Leadership', text: 'Describe a time when you led a team.', tips: 'Focus on how you enabled others, not just what you achieved.' },
  { id: 'q7', category: 'Failure', text: 'Tell me about a time you failed. What did you learn?', tips: 'Show vulnerability and genuine reflection.' },
  { id: 'q8', category: 'Current Events', text: 'What\'s a current issue in AI that concerns you?', tips: 'Show you think critically about your field.' },
  { id: 'q9', category: 'Curveball', text: 'What book has most influenced your thinking?', tips: 'This reveals intellectual curiosity. Have a genuine answer.' },
  { id: 'q10', category: 'Questions', text: 'What questions do you have for me?', tips: 'Always have thoughtful questions prepared.' },
];

// Sample Previous Sessions
const SAMPLE_SESSIONS: InterviewSession[] = [
  {
    id: '1',
    type: 'general',
    persona: PERSONAS[0],
    date: new Date(Date.now() - 86400000 * 3),
    duration: 24,
    questionsAsked: 8,
    overallScore: 78,
    feedback: {
      contentDepth: 80,
      authenticity: 90,
      structure: 65,
      specificExamples: 75,
      responseLength: 60,
      overallImpressions: 'Strong authentic voice with good content, but responses sometimes run long.',
      keyStrengths: ['Genuine enthusiasm', 'Strong personal stories', 'Good connection to interviewer'],
      areasToImprove: ['Response length', 'More structured answers', 'Conciseness'],
    },
    responses: [],
  },
];

// Main Component
const InterviewPrepPage: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'setup' | 'interview' | 'review'>('dashboard');
  const [previousSessions, setPreviousSessions] = useState<InterviewSession[]>(SAMPLE_SESSIONS);
  const [currentSession, setCurrentSession] = useState<Partial<InterviewSession> | null>(null);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-pink-400">Interview Prep Simulator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm mb-6">
                <span>🎤</span>
                <span>Application Support</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Interview Prep <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Simulator</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Practice with AI interviewers, get real-time feedback, and build confidence
                before your actual admissions interviews.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setView('setup')}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                Start Practice
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'dashboard' && (
            <InterviewDashboard
              sessions={previousSessions}
              onStartNew={() => setView('setup')}
              onViewSession={(session) => {
                setCurrentSession(session);
                setView('review');
              }}
            />
          )}

          {view === 'setup' && (
            <InterviewSetup
              onBack={() => setView('dashboard')}
              onStart={(session) => {
                setCurrentSession(session);
                setView('interview');
              }}
            />
          )}

          {view === 'interview' && currentSession && (
            <InterviewSimulator
              session={currentSession}
              onComplete={(completed) => {
                setPreviousSessions([completed as InterviewSession, ...previousSessions]);
                setCurrentSession(completed);
                setView('review');
              }}
              onQuit={() => setView('dashboard')}
            />
          )}

          {view === 'review' && currentSession && (
            <SessionReview
              session={currentSession as InterviewSession}
              onBack={() => {
                setCurrentSession(null);
                setView('dashboard');
              }}
              onPracticeAgain={() => setView('setup')}
            />
          )}
        </div>
      </section>

      {/* Tips Section */}
      {view === 'dashboard' && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl p-8 border border-pink-500/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span>💡</span>
                  Interview Prep Tips
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-pink-400 mb-2">Before the Interview</h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li>• Research the school thoroughly</li>
                      <li>• Prepare 2-3 questions to ask</li>
                      <li>• Review your own application</li>
                      <li>• Practice the "Tell me about yourself"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-pink-400 mb-2">During the Interview</h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li>• Take a moment to think before answering</li>
                      <li>• Use specific examples from your life</li>
                      <li>• Keep answers to 1-2 minutes</li>
                      <li>• It's okay to say "That's a great question"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// ===========================================
// Interview Dashboard
// Static Tailwind color map
const interviewColors: Record<string, { hoverBorder: string; bgLight: string }> = {
  pink: { hoverBorder: 'hover:border-pink-500/30', bgLight: 'bg-pink-500/10' },
  violet: { hoverBorder: 'hover:border-violet-500/30', bgLight: 'bg-violet-500/10' },
  blue: { hoverBorder: 'hover:border-blue-500/30', bgLight: 'bg-blue-500/10' },
  red: { hoverBorder: 'hover:border-red-500/30', bgLight: 'bg-red-500/10' },
};

// ===========================================
const InterviewDashboard: React.FC<{
  sessions: InterviewSession[];
  onStartNew: () => void;
  onViewSession: (session: InterviewSession) => void;
}> = ({ sessions, onStartNew, onViewSession }) => {
  return (
    <div className="space-y-8">
      {/* Quick Start Options */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { type: 'general', title: 'General Practice', desc: 'Common interview questions', icon: '🎤', color: 'pink' },
          { type: 'technical', title: 'Technical Deep-Dive', desc: 'STEM-specific questions', icon: '🔬', color: 'violet' },
          { type: 'school-specific', title: 'School-Specific', desc: 'Tailored to your schools', icon: '🎓', color: 'blue' },
          { type: 'stress-test', title: 'Stress Test', desc: 'Challenging follow-ups', icon: '🎯', color: 'red' },
        ].map((option) => (
          <button
            key={option.type}
            onClick={onStartNew}
            className={`p-5 rounded-xl bg-gray-900/50 border border-white/5 ${interviewColors[option.color]?.hoverBorder || 'hover:border-slate-500/30'} transition-all text-left group`}
          >
            <div className={`w-12 h-12 rounded-xl ${interviewColors[option.color]?.bgLight || 'bg-slate-500/10'} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {option.icon}
            </div>
            <h3 className="font-semibold text-white mb-1">{option.title}</h3>
            <p className="text-sm text-gray-500">{option.desc}</p>
          </button>
        ))}
      </div>

      {/* Previous Sessions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Previous Sessions</h2>
          <button
            onClick={onStartNew}
            className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg text-sm font-medium transition-all"
          >
            New Session
          </button>
        </div>

        {sessions.length === 0 ? (
          <EmptySessionsState onStart={onStartNew} />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} onClick={() => onViewSession(session)} />
            ))}
          </div>
        )}
      </div>

      {/* Progress Over Time */}
      {sessions.length > 0 && (
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Your Progress</h3>
          <div className="grid sm:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Sessions Completed</div>
              <div className="text-3xl font-bold text-white">{sessions.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Questions Practiced</div>
              <div className="text-3xl font-bold text-white">
                {sessions.reduce((sum, s) => sum + s.questionsAsked, 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Average Score</div>
              <div className="text-3xl font-bold text-pink-400">
                {Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Practice Time</div>
              <div className="text-3xl font-bold text-white">
                {sessions.reduce((sum, s) => sum + s.duration, 0)}m
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// Session Card
// ===========================================
const SessionCard: React.FC<{
  session: InterviewSession;
  onClick: () => void;
}> = ({ session, onClick }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-pink-500/30 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-2xl">
            {session.persona.avatar}
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-pink-400 transition-colors">
              {session.type === 'general' ? 'General Practice' :
               session.type === 'technical' ? 'Technical Deep-Dive' :
               session.type === 'school-specific' ? `${session.school} Interview` : 'Stress Test'}
            </h3>
            <p className="text-sm text-gray-500">
              {session.persona.name} ({session.persona.title}) • {session.questionsAsked} questions • {session.duration}m
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-lg font-bold ${getScoreColor(session.overallScore)}`}>
              {session.overallScore}%
            </div>
            <div className="text-xs text-gray-500">
              {new Date(session.date).toLocaleDateString()}
            </div>
          </div>
          <span className="text-gray-600 group-hover:text-gray-400">→</span>
        </div>
      </div>
    </button>
  );
};

// ===========================================
// Empty Sessions State
// ===========================================
const EmptySessionsState: React.FC<{
  onStart: () => void;
}> = ({ onStart }) => {
  return (
    <div className="text-center py-16 px-4 rounded-2xl bg-gray-900/50 border border-white/5">
      <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-3xl mx-auto mb-6">
        🎤
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Interview nerves are real
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        The goal isn't to rehearse perfect answers—it's to practice thinking out loud
        and get comfortable being yourself. Stumble here, not in the real thing.
      </p>
      <button
        onClick={onStart}
        className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-all"
      >
        Start Your First Practice
      </button>
    </div>
  );
};

// ===========================================
// Interview Setup
// ===========================================
const InterviewSetup: React.FC<{
  onBack: () => void;
  onStart: (session: Partial<InterviewSession>) => void;
}> = ({ onBack, onStart }) => {
  const [type, setType] = useState<InterviewSession['type']>('general');
  const [selectedPersona, setSelectedPersona] = useState<InterviewerPersona>(PERSONAS[0]);
  const [school, setSchool] = useState('');

  const handleStart = () => {
    onStart({
      id: Date.now().toString(),
      type,
      school: type === 'school-specific' ? school : undefined,
      persona: selectedPersona,
      date: new Date(),
      responses: [],
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-bold text-white">Setup Your Practice Session</h2>
      </div>

      {/* Interview Type */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Interview Type</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { id: 'general', title: 'General Practice', desc: 'Common questions across all schools', icon: '🎤' },
            { id: 'technical', title: 'Technical Deep-Dive', desc: 'STEM-specific questions about your work', icon: '🔬' },
            { id: 'school-specific', title: 'School-Specific', desc: 'Questions tailored to a specific school', icon: '🎓' },
            { id: 'stress-test', title: 'Stress Test', desc: 'Challenging follow-ups and curveballs', icon: '🎯' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setType(opt.id as InterviewSession['type'])}
              className={`p-4 rounded-xl border text-left transition-all ${
                type === opt.id
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <div className="font-medium text-white">{opt.title}</div>
                  <div className="text-xs text-gray-400">{opt.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {type === 'school-specific' && (
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-2">School Name</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., MIT, Stanford"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50"
            />
          </div>
        )}
      </div>

      {/* Interviewer Persona */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Choose Your Interviewer</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedPersona.id === persona.id
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{persona.avatar}</span>
                <div>
                  <div className="font-medium text-white">{persona.name}</div>
                  <div className="text-xs text-gray-400">{persona.title}</div>
                </div>
              </div>
              <p className="text-sm text-gray-500">{persona.style}</p>
              <div className="mt-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  persona.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                  persona.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {persona.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stress Test Warning */}
      {type === 'stress-test' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-400">⚠️</span>
            <div className="text-sm text-gray-300">
              <strong className="text-white">Stress Test Mode</strong>: This interviewer will challenge
              your responses, ask tough follow-ups, and occasionally seem skeptical. This is intentional—
              practicing with a tough interviewer makes real interviews feel easier.
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <div className="flex justify-end">
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-all"
        >
          Start Interview →
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Interview Simulator
// ===========================================
const InterviewSimulator: React.FC<{
  session: Partial<InterviewSession>;
  onComplete: (session: Partial<InterviewSession>) => void;
  onQuit: () => void;
}> = ({ session, onComplete, onQuit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [showTips, setShowTips] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions = QUESTION_BANK.slice(0, 8);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setResponseTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const handleStartResponse = () => {
    setIsRecording(true);
    setResponseTime(0);
  };

  const handleEndResponse = () => {
    setIsRecording(false);

    // Simulated feedback
    const newResponse: QuestionResponse = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      duration: responseTime,
      feedback: {
        strengths: ['Good use of specific example', 'Authentic voice came through'],
        improvements: responseTime > 120 ? ['Response was a bit long'] : [],
        score: Math.min(100, 60 + Math.random() * 30),
      },
    };

    setResponses([...responses, newResponse]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setResponseTime(0);
    } else {
      // Complete the session
      const completedSession: InterviewSession = {
        ...(session as InterviewSession),
        duration: Math.round(responses.reduce((sum, r) => sum + r.duration, 0) / 60) + Math.round(responseTime / 60),
        questionsAsked: responses.length + 1,
        overallScore: Math.round(responses.reduce((sum, r) => sum + r.feedback.score, 0) / (responses.length + 1)),
        responses: [...responses, newResponse],
        feedback: {
          contentDepth: 75 + Math.random() * 20,
          authenticity: 80 + Math.random() * 15,
          structure: 65 + Math.random() * 25,
          specificExamples: 70 + Math.random() * 20,
          responseLength: responseTime > 120 ? 55 : 80,
          overallImpressions: 'Strong showing with genuine personality.',
          keyStrengths: ['Authentic voice', 'Good specific examples'],
          areasToImprove: ['Response conciseness', 'More structured answers'],
        },
      };
      onComplete(completedSession);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Interview Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{session.persona?.avatar}</span>
          <div>
            <h2 className="text-xl font-bold text-white">{session.persona?.name}</h2>
            <p className="text-sm text-gray-400">{session.persona?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <button
            onClick={onQuit}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-pink-500 transition-all"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-2 text-sm text-pink-400 mb-4">
          <span>💬</span>
          {currentQuestion.category}
        </div>

        <h3 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
          "{currentQuestion.text}"
        </h3>

        {/* Recording Interface */}
        <div className="flex flex-col items-center py-8">
          {!isRecording ? (
            <button
              onClick={handleStartResponse}
              className="w-24 h-24 rounded-full bg-pink-500 hover:bg-pink-400 text-white flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="text-3xl">🎤</span>
            </button>
          ) : (
            <button
              onClick={handleEndResponse}
              className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition-all animate-pulse"
            >
              <span className="text-3xl">⏹</span>
            </button>
          )}

          <div className="mt-4 text-center">
            {!isRecording ? (
              <p className="text-gray-400">Click to start your response</p>
            ) : (
              <div>
                <p className={`text-2xl font-mono ${responseTime > 120 ? 'text-amber-400' : 'text-white'}`}>
                  {formatTime(responseTime)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {responseTime < 60 ? 'Keep going...' :
                   responseTime < 90 ? 'Good length' :
                   responseTime < 120 ? 'Consider wrapping up' :
                   'Response is getting long'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Toggle */}
        {currentQuestion.tips && (
          <div className="mt-4">
            <button
              onClick={() => setShowTips(!showTips)}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showTips ? 'Hide tips' : 'Show tips'}
            </button>
            {showTips && (
              <div className="mt-3 p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <p className="text-sm text-gray-300">
                  <strong className="text-pink-400">Tip:</strong> {currentQuestion.tips}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Controls */}
      <div className="flex justify-between">
        <button className="text-sm text-gray-500 hover:text-gray-300">
          Skip Question
        </button>
        <button className="text-sm text-gray-500 hover:text-gray-300">
          Pause Session
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Session Review
// ===========================================
const SessionReview: React.FC<{
  session: InterviewSession;
  onBack: () => void;
  onPracticeAgain: () => void;
}> = ({ session, onBack, onPracticeAgain }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>
        <button
          onClick={onPracticeAgain}
          className="px-4 py-2 bg-pink-500/10 text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-500/20 transition-all"
        >
          Practice Again
        </button>
      </div>

      {/* Overall Score */}
      <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold text-white mb-4">Interview Review</h2>
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(session.overallScore)}`}>
          {session.overallScore}%
        </div>
        <p className="text-gray-400">
          {session.questionsAsked} questions • {session.duration} minutes
        </p>
      </div>

      {/* Score Breakdown */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-6">Performance Breakdown</h3>
        <div className="space-y-4">
          {[
            { label: 'Content & Depth', score: session.feedback.contentDepth },
            { label: 'Authenticity', score: session.feedback.authenticity },
            { label: 'Structure', score: session.feedback.structure },
            { label: 'Specific Examples', score: session.feedback.specificExamples },
            { label: 'Response Length', score: session.feedback.responseLength },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                  {Math.round(item.score)}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.score >= 80 ? 'bg-emerald-500' :
                    item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
          <h4 className="font-medium text-emerald-400 mb-3 flex items-center gap-2">
            <span>✓</span>
            Key Strengths
          </h4>
          <ul className="space-y-2">
            {session.feedback.keyStrengths.map((strength, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <h4 className="font-medium text-amber-400 mb-3 flex items-center gap-2">
            <span>💡</span>
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {session.feedback.areasToImprove.map((area, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overall Impression */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <h4 className="font-medium text-white mb-3">Overall Impression</h4>
        <p className="text-gray-300">{session.feedback.overallImpressions}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={onPracticeAgain}
          className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-all"
        >
          Practice Again
        </button>
        <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all">
          Share with Counselor
        </button>
        <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all">
          Download Report
        </button>
      </div>
    </div>
  );
};

export default InterviewPrepPage;
