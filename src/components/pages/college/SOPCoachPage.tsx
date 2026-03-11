// ===========================================
// Statement of Purpose Coach Page - College Students
// AI feedback on research statements
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  MessageSquare,
  BookOpen,
  Upload,
  Lightbulb,
  Star,
  Edit3,
  RefreshCw,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface SOPSection {
  id: string;
  name: string;
  description: string;
  tips: string[];
  example?: string;
}

interface FeedbackItem {
  id: string;
  type: 'strength' | 'improvement' | 'warning';
  message: string;
  suggestion?: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const SOP_SECTIONS: SOPSection[] = [
  {
    id: 'opening',
    name: 'Opening Hook',
    description: 'Capture attention with a compelling opening that shows your passion',
    tips: [
      'Start with a specific moment or experience, not a generic statement',
      'Avoid clichés like "I have always been passionate about..."',
      'Show, don\'t tell - use concrete examples',
    ],
    example: 'The moment I first observed quantum interference patterns in our university lab, I knew theoretical physics wasn\'t just an abstract field—it was a window into the fundamental nature of reality.',
  },
  {
    id: 'background',
    name: 'Academic Background',
    description: 'Highlight relevant coursework, research, and academic achievements',
    tips: [
      'Focus on depth, not breadth - highlight 2-3 key experiences',
      'Explain what you learned and how it prepared you for grad school',
      'Connect coursework to your research interests',
    ],
  },
  {
    id: 'research',
    name: 'Research Experience',
    description: 'Describe your research contributions and what you learned',
    tips: [
      'Explain your specific contributions, not just the project',
      'Discuss challenges you overcame',
      'Connect past research to future goals',
    ],
  },
  {
    id: 'fit',
    name: 'Program & Faculty Fit',
    description: 'Show why this specific program is right for you',
    tips: [
      'Name 2-3 faculty members whose work aligns with your interests',
      'Explain specifically why their work excites you',
      'Show you\'ve done your homework on the program',
    ],
  },
  {
    id: 'goals',
    name: 'Career Goals',
    description: 'Articulate your long-term vision and how this program helps',
    tips: [
      'Be specific but not too narrow',
      'Connect your goals to the program\'s strengths',
      'Show how your goals benefit the field/society',
    ],
  },
];

const SAMPLE_FEEDBACK: FeedbackItem[] = [
  {
    id: '1',
    type: 'strength',
    message: 'Strong opening that immediately engages the reader with a specific experience',
  },
  {
    id: '2',
    type: 'strength',
    message: 'Clear connection between past research and future goals',
  },
  {
    id: '3',
    type: 'improvement',
    message: 'Consider adding more specific details about your contribution to the XYZ project',
    suggestion: 'Instead of "I contributed to the project," describe your exact role and impact.',
  },
  {
    id: '4',
    type: 'improvement',
    message: 'The faculty fit section could be more specific',
    suggestion: 'Mention a specific paper or project from Prof. Smith that aligns with your interests.',
  },
  {
    id: '5',
    type: 'warning',
    message: 'Paragraph 3 is too long (250+ words). Consider breaking it up.',
  },
];

const COMMON_MISTAKES = [
  'Starting with "I have always been passionate about..."',
  'Listing achievements without explaining significance',
  'Being too generic about faculty/program fit',
  'Focusing too much on childhood experiences',
  'Not addressing gaps or weaknesses',
  'Using passive voice throughout',
  'Exceeding the word/page limit',
  'Not proofreading for typos',
];

// ===========================================
// COMPONENT
// ===========================================
const SOPCoachPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'review' | 'examples'>('guide');
  const [sopText, setSOPText] = useState('');
  const { info } = useNotifications();

  const wordCount = sopText.trim() ? sopText.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-gray-950 to-cyan-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-teal-400 mb-4">
            <Link to="/college/grad-school-prep" className="hover:underline">Graduate & Research</Link>
            <ChevronRight className="w-4 h-4" />
            <span>SOP Coach</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Statement of Purpose
              <span className="text-teal-400"> Coach</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Get AI-powered feedback on your graduate school and fellowship essays.
              Learn what makes a compelling statement of purpose and how to stand out.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => info('SOP upload is coming soon! For now, paste your text in the feedback tab.')} className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Upload className="w-5 h-5" />
                Upload Your SOP
              </button>
              <button onClick={() => setActiveTab('examples')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                <Eye className="w-5 h-5" />
                View Examples
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'guide', label: 'Writing Guide', icon: BookOpen },
            { id: 'review', label: 'Get Feedback', icon: Sparkles },
            { id: 'examples', label: 'Examples', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-teal-400 border-teal-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Writing Guide Tab */}
        {activeTab === 'guide' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {SOP_SECTIONS.map((section, i) => (
                <div key={section.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{section.name}</h3>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {section.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {tip}
                      </div>
                    ))}
                  </div>

                  {section.example && (
                    <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-teal-500">
                      <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Example</span>
                      <p className="text-gray-300 text-sm italic">"{section.example}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Common Mistakes
                </h3>
                <ul className="space-y-3">
                  {COMMON_MISTAKES.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-red-400">✕</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Typical length</span>
                    <span className="text-white">500-1000 words</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Most important section</span>
                    <span className="text-white">Research fit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Review time needed</span>
                    <span className="text-white">2-3 weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Get Feedback Tab */}
        {activeTab === 'review' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Paste Your Statement</h2>
              <div className="relative">
                <textarea
                  value={sopText}
                  onChange={(e) => setSOPText(e.target.value)}
                  placeholder="Paste your statement of purpose here..."
                  className="w-full h-96 bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                />
                <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                  {wordCount} words
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button onClick={() => { if (wordCount < 100) { info('Please write at least 100 words to get feedback.'); return; } info('AI feedback analysis is coming soon! The sample feedback shown is a preview.'); }} className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Sparkles className="w-5 h-5" />
                  Get AI Feedback
                </button>
                <button onClick={() => setSOPText('')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                  <RefreshCw className="w-5 h-5" />
                  Clear
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">AI Feedback</h2>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                {sopText.length > 100 ? (
                  <div className="space-y-4">
                    {SAMPLE_FEEDBACK.map(item => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          item.type === 'strength' ? 'bg-green-500/5 border-green-500' :
                          item.type === 'improvement' ? 'bg-yellow-500/5 border-yellow-500' :
                          'bg-red-500/5 border-red-500'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {item.type === 'strength' && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                          {item.type === 'improvement' && <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
                          {item.type === 'warning' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                          <div>
                            <p className="text-gray-300">{item.message}</p>
                            {item.suggestion && (
                              <p className="text-sm text-gray-500 mt-2">
                                💡 {item.suggestion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Edit3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Paste your statement to get personalized feedback
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Minimum 100 words required
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/20 rounded-xl border border-teal-500/20 p-6 mb-8">
              <div className="flex items-start gap-4">
                <Star className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About These Examples</h3>
                  <p className="text-gray-300">
                    These are anonymized excerpts from successful applications to top PhD programs.
                    Notice how they use specific details and connect past experiences to future goals.
                  </p>
                </div>
              </div>
            </div>

            {[
              {
                field: 'Computer Science - Machine Learning',
                program: 'Stanford PhD',
                excerpt: 'My fascination with machine learning began not in a classroom, but in a hospital waiting room. As I watched my grandmother struggle with a misdiagnosis that delayed her treatment by months, I wondered: could AI systems help doctors catch what humans miss? This question has driven my research for the past three years...',
                strength: 'Personal connection to research motivation',
              },
              {
                field: 'Physics - Quantum Computing',
                program: 'MIT PhD',
                excerpt: 'During my junior year, I had the privilege of working in Professor Chen\'s lab on superconducting qubit coherence times. My contribution—developing a novel calibration protocol that reduced T2 decay by 15%—taught me that incremental improvements in hardware can unlock entirely new computational possibilities...',
                strength: 'Specific technical contribution with quantified impact',
              },
              {
                field: 'Bioengineering',
                program: 'Berkeley PhD',
                excerpt: 'I am drawn to Professor Martinez\'s lab specifically because of her 2023 paper on CRISPR delivery mechanisms. Her approach to using lipid nanoparticles for targeted gene therapy aligns perfectly with my interest in developing treatments for rare genetic disorders...',
                strength: 'Specific faculty fit with cited research',
              },
            ].map((example, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{example.field}</h3>
                    <p className="text-sm text-gray-400">{example.program}</p>
                  </div>
                  <span className="px-3 py-1 text-xs bg-green-500/10 text-green-400 rounded-full">
                    Accepted
                  </span>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg mb-4">
                  <p className="text-gray-300 italic">"{example.excerpt}"</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-teal-400">
                  <Star className="w-4 h-4" />
                  <span>Why it works: {example.strength}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl border border-teal-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Perfect Your SOP?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get detailed feedback and revision suggestions to make your statement stand out.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => info('Expert SOP review service is coming soon!')} className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              <MessageSquare className="w-5 h-5" />
              Get Expert Review
            </button>
            <Link
              to="/college/faculty-match"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Find Faculty Matches
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPCoachPage;
