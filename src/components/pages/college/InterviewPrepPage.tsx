// ===========================================
// Interview Preparation Page - College Students
// Technical & behavioral mock interviews
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import ExpertQASection from '@/components/shared/ExpertQASection';
import {
  Video,
  Code,
  Users,
  Clock,
  Target,
  BookOpen,
  Play,
  ChevronRight,
  CheckCircle,
  MessageSquare,
  Building2,
  Lightbulb,
  Award,
  Calendar,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface InterviewType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

interface PracticeQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'system-design' | 'case';
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  tips: string[];
}

interface CompanyGuide {
  id: string;
  company: string;
  logo: string;
  interviewProcess: string[];
  timeline: string;
  difficulty: 'moderate' | 'challenging' | 'very-challenging';
  tipCount: number;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: 'behavioral',
    name: 'Behavioral Interview',
    icon: <Users className="w-6 h-6" />,
    description: 'Practice STAR method responses for culture fit and soft skills questions',
    duration: '30-45 min',
    difficulty: 'beginner',
    topics: ['Leadership', 'Teamwork', 'Conflict Resolution', 'Problem Solving'],
  },
  {
    id: 'coding',
    name: 'Coding Interview',
    icon: <Code className="w-6 h-6" />,
    description: 'Data structures, algorithms, and live coding challenges',
    duration: '45-60 min',
    difficulty: 'intermediate',
    topics: ['Arrays', 'Trees', 'Dynamic Programming', 'Graphs'],
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: <Target className="w-6 h-6" />,
    description: 'Design scalable systems and discuss architectural trade-offs',
    duration: '45-60 min',
    difficulty: 'advanced',
    topics: ['Scalability', 'Databases', 'Caching', 'Microservices'],
  },
  {
    id: 'technical-deep-dive',
    name: 'Technical Deep Dive',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'Deep discussion of past projects and technical decisions',
    duration: '30-45 min',
    difficulty: 'intermediate',
    topics: ['Project Architecture', 'Trade-offs', 'Lessons Learned'],
  },
];

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: '1',
    question: 'Tell me about a time you had to learn a new technology quickly to complete a project.',
    category: 'behavioral',
    difficulty: 'easy',
    tips: ['Use STAR method', 'Be specific about the technology', 'Highlight learning process'],
  },
  {
    id: '2',
    question: 'Given an array of integers, return indices of the two numbers that add up to a target.',
    category: 'technical',
    difficulty: 'easy',
    company: 'Google',
    tips: ['Consider hash map for O(n) solution', 'Handle edge cases', 'Discuss trade-offs'],
  },
  {
    id: '3',
    question: 'Design a URL shortening service like bit.ly.',
    category: 'system-design',
    difficulty: 'medium',
    company: 'Meta',
    tips: ['Start with requirements', 'Consider scale', 'Discuss storage and encoding'],
  },
  {
    id: '4',
    question: 'Describe a situation where you disagreed with a team decision. How did you handle it?',
    category: 'behavioral',
    difficulty: 'medium',
    tips: ['Show respect for team', 'Focus on outcome', 'Demonstrate communication skills'],
  },
  {
    id: '5',
    question: 'Implement an LRU cache with O(1) get and put operations.',
    category: 'technical',
    difficulty: 'hard',
    company: 'Amazon',
    tips: ['Use doubly linked list + hash map', 'Explain data structure choice', 'Consider thread safety'],
  },
];

const COMPANY_GUIDES: CompanyGuide[] = [
  {
    id: '1',
    company: 'Google',
    logo: '🔵',
    interviewProcess: ['Phone Screen', 'Technical Interviews (4-5)', 'Hiring Committee', 'Team Match'],
    timeline: '6-8 weeks',
    difficulty: 'very-challenging',
    tipCount: 45,
  },
  {
    id: '2',
    company: 'Meta',
    logo: '🔷',
    interviewProcess: ['Recruiter Call', 'Technical Screen', 'Onsite (4-5 rounds)', 'Hiring Committee'],
    timeline: '4-6 weeks',
    difficulty: 'very-challenging',
    tipCount: 38,
  },
  {
    id: '3',
    company: 'Amazon',
    logo: '🟠',
    interviewProcess: ['OA (Online Assessment)', 'Phone Screen', 'Loop (4-5 rounds)', 'Bar Raiser'],
    timeline: '3-5 weeks',
    difficulty: 'challenging',
    tipCount: 52,
  },
  {
    id: '4',
    company: 'Microsoft',
    logo: '🟦',
    interviewProcess: ['Phone Screen', 'Onsite (4-5 rounds)', 'As Appropriate Interview'],
    timeline: '3-4 weeks',
    difficulty: 'challenging',
    tipCount: 41,
  },
  {
    id: '5',
    company: 'Apple',
    logo: '⚪',
    interviewProcess: ['Phone Screen', 'Technical Interview', 'Onsite (5-6 rounds)'],
    timeline: '4-8 weeks',
    difficulty: 'very-challenging',
    tipCount: 35,
  },
];

const STAR_METHOD = [
  { letter: 'S', word: 'Situation', description: 'Set the scene and context' },
  { letter: 'T', word: 'Task', description: 'Describe your responsibility' },
  { letter: 'A', word: 'Action', description: 'Explain what you did specifically' },
  { letter: 'R', word: 'Result', description: 'Share the outcome and impact' },
];

// ===========================================
// COMPONENT
// ===========================================
const InterviewPrepPage: React.FC = () => {
  const { info } = useNotifications();
  const [selectedType, setSelectedType] = useState<string>('behavioral');
  const [activeTab, setActiveTab] = useState<'practice' | 'companies' | 'tips'>('practice');

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-950 to-blue-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <Link to="/college/career-launch" className="hover:underline">Career Launch</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Interview Prep</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Interview
                <span className="text-purple-400"> Preparation</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Practice technical and behavioral interviews with AI-powered mock sessions.
                Get real-time feedback and company-specific preparation guides.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => info('AI practice sessions are coming soon! We\'re building an interactive interview simulator.')} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Play className="w-5 h-5" />
                  Start Practice Session
                </button>
                <button onClick={() => info('Mock interview scheduling is coming soon!')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                  <Calendar className="w-5 h-5" />
                  Schedule Mock Interview
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Practice Questions', value: '2,500+', icon: MessageSquare },
                { label: 'Company Guides', value: '150+', icon: Building2 },
                { label: 'Mock Interviews', value: '10K+', icon: Video },
                { label: 'Success Rate', value: '94%', icon: Award },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                  <stat.icon className="w-8 h-8 text-purple-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Choose Interview Type</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {INTERVIEW_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-xl border text-left transition-all ${
                selectedType === type.id
                  ? 'bg-purple-500/10 border-purple-500'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                selectedType === type.id ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400'
              }`}>
                {type.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{type.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{type.description}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {type.duration}
                </span>
                <span className={`px-2 py-0.5 rounded ${
                  type.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
                  type.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {type.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'practice', label: 'Practice Questions', icon: MessageSquare },
            { id: 'companies', label: 'Company Guides', icon: Building2 },
            { id: 'tips', label: 'Interview Tips', icon: Lightbulb },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-purple-400 border-purple-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Practice Questions Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-4">
            {PRACTICE_QUESTIONS.map(q => (
              <div key={q.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        q.category === 'behavioral' ? 'bg-blue-500/10 text-blue-400' :
                        q.category === 'technical' ? 'bg-green-500/10 text-green-400' :
                        q.category === 'system-design' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {q.category.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        q.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' :
                        q.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {q.difficulty}
                      </span>
                      {q.company && (
                        <span className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
                          {q.company}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg text-white">{q.question}</h3>
                  </div>
                  <button onClick={() => info('Interactive practice mode is coming soon!')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    Practice
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {q.tips.map((tip, i) => (
                    <span key={i} className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-yellow-400" />
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <button onClick={() => info('Full question bank is coming soon! We\'re adding 2,500+ practice questions.')} className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2 mx-auto">
                View All Questions <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Company Guides Tab */}
        {activeTab === 'companies' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANY_GUIDES.map(company => (
              <div key={company.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{company.logo}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{company.company}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      company.difficulty === 'moderate' ? 'bg-green-500/10 text-green-400' :
                      company.difficulty === 'challenging' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {company.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-400">
                    <span className="text-gray-500">Timeline:</span> {company.timeline}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 block mb-2">Process:</span>
                    <div className="flex flex-wrap gap-1">
                      {company.interviewProcess.map((step, i) => (
                        <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {i + 1}. {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-sm text-gray-400">{company.tipCount} tips & insights</span>
                  <button onClick={() => info('Company interview guides are coming soon!')} className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">
                    View Guide <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* STAR Method */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">STAR Method for Behavioral Questions</h3>
              <div className="space-y-4">
                {STAR_METHOD.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                      {item.letter}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{item.word}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Quick Interview Tips</h3>
              <ul className="space-y-3">
                {[
                  'Research the company and interviewer beforehand',
                  'Prepare 3-5 stories that showcase different skills',
                  'Ask thoughtful questions at the end',
                  'Think out loud during technical problems',
                  'Take a moment to think before answering',
                  'Follow up with a thank you email within 24 hours',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Before the Interview */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Before the Interview</h3>
              <ul className="space-y-3">
                {[
                  'Test your video/audio setup for virtual interviews',
                  'Have a copy of your resume ready',
                  'Prepare your environment (quiet, well-lit)',
                  'Review the job description and match your experience',
                  'Practice common questions out loud',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* During the Interview */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">During the Interview</h3>
              <ul className="space-y-3">
                {[
                  "It's okay to ask clarifying questions",
                  'Structure your answers clearly',
                  'Be specific with examples and metrics',
                  "Be honest about what you don't know",
                  'Show enthusiasm for the role and company',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Ace Your Interview?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Schedule a mock interview with industry professionals or practice with our AI interviewer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => info('AI mock interviews are coming soon! We\'re building a real-time interview simulator.')} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Video className="w-5 h-5" />
              Start AI Mock Interview
            </button>
            <Link
              to="/college/salary-negotiation"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Salary Negotiation
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expert Career Q&A */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ExpertQASection
          scenario="interview-prep"
          title="Expert Interview Advice"
          description="Real answers from industry professionals on acing technical and behavioral interviews"
          limit={5}
          showTags
        />
      </div>
    </div>
  );
};

export default InterviewPrepPage;
