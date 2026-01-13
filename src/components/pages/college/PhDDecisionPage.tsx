// ===========================================
// PhD vs Industry Tool Page - College Students
// Make this major decision with confidence
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  GraduationCap,
  Briefcase,
  ChevronRight,
  CheckCircle,
  XCircle,
  Users,
  Target,
  Lightbulb,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface ComparisonItem {
  category: string;
  phd: string;
  industry: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  phdAnswer: string;
  industryAnswer: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const COMPARISONS: ComparisonItem[] = [
  {
    category: 'Time Investment',
    phd: '5-7 years for PhD',
    industry: 'Start earning immediately',
  },
  {
    category: 'Income (Years 1-5)',
    phd: '$35-40K/year stipend',
    industry: '$100-200K/year total comp',
  },
  {
    category: 'Income (10+ years)',
    phd: '$120-200K+ (academia/industry)',
    industry: '$200-400K+ (senior roles)',
  },
  {
    category: 'Lifetime Earnings Gap',
    phd: 'Lower early, but narrows over time',
    industry: 'Higher early career advantage',
  },
  {
    category: 'Work Focus',
    phd: 'Deep dive into one area',
    industry: 'Broader, product-focused work',
  },
  {
    category: 'Autonomy',
    phd: 'High (choose your research)',
    industry: 'Lower (company priorities)',
  },
  {
    category: 'Job Security',
    phd: 'Tenure track is competitive',
    industry: 'Layoffs possible, but mobile',
  },
  {
    category: 'Geographic Flexibility',
    phd: 'Limited (follow the positions)',
    industry: 'More choice, especially remote',
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: '1',
    question: 'Do you enjoy spending months or years on a single problem?',
    phdAnswer: 'Yes, I love going deep',
    industryAnswer: 'I prefer variety and shipping quickly',
  },
  {
    id: '2',
    question: 'How important is financial security in your 20s?',
    phdAnswer: "I can live frugally for now",
    industryAnswer: "It's a high priority for me",
  },
  {
    id: '3',
    question: 'Do you want to teach and mentor students?',
    phdAnswer: 'Yes, I find that fulfilling',
    industryAnswer: 'Not a major goal for me',
  },
  {
    id: '4',
    question: 'How do you feel about ambiguity in your work?',
    phdAnswer: 'I thrive in undefined problems',
    industryAnswer: 'I prefer clearer objectives',
  },
  {
    id: '5',
    question: 'Is academic prestige important to you?',
    phdAnswer: 'Yes, publications and recognition matter',
    industryAnswer: "I care more about impact and income",
  },
  {
    id: '6',
    question: 'Do you want to work on fundamental research questions?',
    phdAnswer: 'Yes, pushing the boundaries of knowledge',
    industryAnswer: 'I prefer applied, practical problems',
  },
];

const PHD_PROS = [
  'Deep expertise in a specialized area',
  'Intellectual freedom to pursue your interests',
  'Opportunity to contribute original knowledge',
  'Path to academic or research leadership roles',
  'Access to cutting-edge resources and collaborators',
  'Required for many research positions',
];

const PHD_CONS = [
  '5-7 years of low income',
  'High opportunity cost vs industry',
  'Uncertain job market in academia',
  'Can be isolating and mentally challenging',
  'Geographic constraints for positions',
  'Publication pressure and competition',
];

const INDUSTRY_PROS = [
  'Immediate high earning potential',
  'Faster career progression',
  'Work on products used by millions',
  'More geographic flexibility',
  'Clearer work-life boundaries',
  'Diverse experience across projects',
];

const INDUSTRY_CONS = [
  'Less autonomy over work direction',
  'May not publish or get academic credit',
  'Company priorities change frequently',
  'Can feel less intellectually deep',
  'Layoff risk in economic downturns',
  'May not lead to academic positions later',
];

// ===========================================
// COMPONENT
// ===========================================
const PhDDecisionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compare' | 'quiz' | 'stories'>('compare');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, 'phd' | 'industry'>>({});

  const phdScore = Object.values(quizAnswers).filter(a => a === 'phd').length;
  const industryScore = Object.values(quizAnswers).filter(a => a === 'industry').length;
  const totalAnswered = phdScore + industryScore;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-950 to-pink-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <Link to="/college/grad-school-prep" className="hover:underline">Graduate & Research</Link>
            <ChevronRight className="w-4 h-4" />
            <span>PhD vs Industry</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              PhD vs Industry
              <span className="text-purple-400"> Decision Tool</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              This is one of the biggest career decisions you'll make. Explore the trade-offs,
              take our self-assessment quiz, and hear from people who've walked both paths.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'compare', label: 'Compare Paths', icon: Scale },
            { id: 'quiz', label: 'Self-Assessment', icon: Target },
            { id: 'stories', label: 'Real Stories', icon: Users },
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

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div>
            {/* Side by Side Comparison */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden mb-8">
              <div className="grid grid-cols-3">
                <div className="p-4 bg-gray-800/50"></div>
                <div className="p-4 bg-purple-500/10 text-center">
                  <GraduationCap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">PhD Path</h3>
                </div>
                <div className="p-4 bg-blue-500/10 text-center">
                  <Briefcase className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Industry Path</h3>
                </div>
              </div>
              {COMPARISONS.map((item, i) => (
                <div key={i} className="grid grid-cols-3 border-t border-gray-800">
                  <div className="p-4 bg-gray-800/30">
                    <span className="text-gray-300 font-medium">{item.category}</span>
                  </div>
                  <div className="p-4 text-gray-400 text-sm">{item.phd}</div>
                  <div className="p-4 text-gray-400 text-sm">{item.industry}</div>
                </div>
              ))}
            </div>

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* PhD */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                  PhD Path
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-6">
                    <h4 className="text-green-400 font-medium mb-4">Pros</h4>
                    <ul className="space-y-2">
                      {PHD_PROS.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-6">
                    <h4 className="text-red-400 font-medium mb-4">Cons</h4>
                    <ul className="space-y-2">
                      {PHD_CONS.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Industry */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                  Industry Path
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-6">
                    <h4 className="text-green-400 font-medium mb-4">Pros</h4>
                    <ul className="space-y-2">
                      {INDUSTRY_PROS.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-6">
                    <h4 className="text-red-400 font-medium mb-4">Cons</h4>
                    <ul className="space-y-2">
                      {INDUSTRY_CONS.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div>
            {totalAnswered === QUIZ_QUESTIONS.length ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 text-center">
                  <Scale className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">Your Results</h2>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className={`p-6 rounded-xl ${phdScore > industryScore ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-gray-800/50'}`}>
                      <GraduationCap className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{phdScore}</div>
                      <div className="text-gray-400">PhD Leaning</div>
                    </div>
                    <div className={`p-6 rounded-xl ${industryScore > phdScore ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-800/50'}`}>
                      <Briefcase className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{industryScore}</div>
                      <div className="text-gray-400">Industry Leaning</div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">
                    {phdScore > industryScore
                      ? 'Your answers suggest you may thrive in a PhD program. You value deep research, intellectual freedom, and long-term academic impact.'
                      : phdScore < industryScore
                      ? 'Your answers suggest industry may be a better fit. You value immediate impact, financial stability, and diverse experiences.'
                      : "You're evenly split! Consider talking to people in both paths and perhaps trying industry first - you can always return for a PhD later."}
                  </p>

                  <button
                    onClick={() => setQuizAnswers({})}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Self-Assessment Quiz</h2>
                  <span className="text-gray-400">
                    {totalAnswered} of {QUIZ_QUESTIONS.length} answered
                  </span>
                </div>

                {QUIZ_QUESTIONS.map((q, i) => (
                  <div key={q.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-lg text-white mb-4">
                      <span className="text-purple-400 mr-2">{i + 1}.</span>
                      {q.question}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: 'phd' }))}
                        className={`p-4 rounded-lg text-left transition-colors ${
                          quizAnswers[q.id] === 'phd'
                            ? 'bg-purple-500/20 border border-purple-500/50'
                            : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-purple-400">PhD Leaning</span>
                        </div>
                        <p className="text-gray-300 text-sm">{q.phdAnswer}</p>
                      </button>
                      <button
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: 'industry' }))}
                        className={`p-4 rounded-lg text-left transition-colors ${
                          quizAnswers[q.id] === 'industry'
                            ? 'bg-blue-500/20 border border-blue-500/50'
                            : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-5 h-5 text-blue-400" />
                          <span className="text-sm text-blue-400">Industry Leaning</span>
                        </div>
                        <p className="text-gray-300 text-sm">{q.industryAnswer}</p>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-8">
            {[
              {
                name: 'Sarah K.',
                path: 'PhD → Industry',
                title: 'ML Research Scientist at Google',
                quote: "I don't regret my PhD, but I wish I'd known how different industry research is. The PhD taught me to think deeply, but I had to unlearn the perfectionism.",
                advice: 'Consider doing industry internships during your PhD to see both worlds.',
              },
              {
                name: 'James L.',
                path: 'Industry → PhD',
                title: 'PhD Candidate at MIT',
                quote: "After 4 years in industry, I realized I wanted to work on longer-term problems. The financial buffer from saving during those years made the PhD stipend manageable.",
                advice: "Industry first isn't a bad strategy - you gain perspective and savings.",
              },
              {
                name: 'Maria C.',
                path: 'Chose Industry',
                title: 'Senior Engineer at Stripe',
                quote: "I almost did a PhD but realized I loved shipping products. Six years in, I'm now mentoring PhDs who joined my team. Different paths can lead to similar places.",
                advice: "Don't let FOMO drive your decision. Know what you actually want.",
              },
            ].map((story, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {story.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{story.name}</h3>
                    <p className="text-sm text-purple-400">{story.path}</p>
                    <p className="text-sm text-gray-400">{story.title}</p>
                  </div>
                </div>

                <blockquote className="mt-4 p-4 bg-gray-800/50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-300 italic">"{story.quote}"</p>
                </blockquote>

                <div className="mt-4 flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium">Their advice: </span>
                    {story.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Still Unsure?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Talk to our mentors who've navigated both paths. Get personalized guidance for your situation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/mentorship"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Users className="w-5 h-5" />
              Find a Mentor
            </Link>
            <Link
              to="/college/grad-school-prep"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Explore Grad School
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhDDecisionPage;
