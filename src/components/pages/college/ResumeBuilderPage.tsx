// ===========================================
// Resume & Portfolio Builder Page - College Students
// ATS-optimized resumes with AI feedback
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Eye,
  Upload,
  Target,
  Zap,
  BookOpen,
  Award,
  Github,
  Linkedin,
  ChevronRight,
  Star,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface ResumeTemplate {
  id: string;
  name: string;
  category: 'technical' | 'research' | 'business' | 'creative';
  description: string;
  atsScore: number;
  popular: boolean;
}

interface ATSCheckItem {
  id: string;
  label: string;
  passed: boolean;
  priority: 'high' | 'medium' | 'low';
  suggestion?: string;
}

interface ResumeSection {
  id: string;
  name: string;
  tips: string[];
  examples: string[];
}

// ===========================================
// SAMPLE DATA
// ===========================================
const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: '1',
    name: 'Software Engineer',
    category: 'technical',
    description: 'Optimized for tech roles with emphasis on projects and skills',
    atsScore: 95,
    popular: true,
  },
  {
    id: '2',
    name: 'Data Science',
    category: 'technical',
    description: 'Highlights ML projects, publications, and technical skills',
    atsScore: 94,
    popular: true,
  },
  {
    id: '3',
    name: 'Research Position',
    category: 'research',
    description: 'Academic CV format with publications and research experience',
    atsScore: 92,
    popular: false,
  },
  {
    id: '4',
    name: 'Hardware Engineer',
    category: 'technical',
    description: 'VLSI, embedded systems, and hardware project focus',
    atsScore: 93,
    popular: false,
  },
  {
    id: '5',
    name: 'Product Manager',
    category: 'business',
    description: 'Impact-driven with metrics and cross-functional experience',
    atsScore: 91,
    popular: false,
  },
  {
    id: '6',
    name: 'UX/Design',
    category: 'creative',
    description: 'Visual portfolio integration with case study links',
    atsScore: 88,
    popular: false,
  },
];

const ATS_CHECKLIST: ATSCheckItem[] = [
  { id: '1', label: 'Standard file format (PDF)', passed: true, priority: 'high' },
  { id: '2', label: 'No tables or columns', passed: true, priority: 'high' },
  { id: '3', label: 'Contact info at top', passed: true, priority: 'high' },
  { id: '4', label: 'Skills section with keywords', passed: false, priority: 'high', suggestion: 'Add relevant technical skills that match job descriptions' },
  { id: '5', label: 'Quantified achievements', passed: false, priority: 'medium', suggestion: 'Add metrics to 3+ bullet points (%, $, time saved)' },
  { id: '6', label: 'Action verbs used', passed: true, priority: 'medium' },
  { id: '7', label: 'Consistent date format', passed: true, priority: 'low' },
  { id: '8', label: 'No graphics or icons', passed: true, priority: 'medium' },
];

const RESUME_SECTIONS: ResumeSection[] = [
  {
    id: 'projects',
    name: 'Projects Section',
    tips: [
      'Lead with the most impressive or relevant project',
      'Include a link to GitHub or live demo',
      'Quantify impact: users, performance gains, etc.',
      'Use tech stack as keywords in description',
    ],
    examples: [
      'Built a real-time chat application using React, Node.js, and WebSocket serving 500+ daily users',
      'Developed ML model achieving 94% accuracy for fraud detection, reducing false positives by 40%',
    ],
  },
  {
    id: 'experience',
    name: 'Experience Section',
    tips: [
      'Use STAR method (Situation, Task, Action, Result)',
      'Start bullets with strong action verbs',
      'Include metrics whenever possible',
      'Focus on impact, not just responsibilities',
    ],
    examples: [
      'Led migration of legacy API to GraphQL, reducing response time by 60% and developer onboarding by 2 weeks',
      'Implemented CI/CD pipeline using GitHub Actions, reducing deployment time from 2 hours to 15 minutes',
    ],
  },
  {
    id: 'education',
    name: 'Education Section',
    tips: [
      'Include GPA if 3.0+ (or major GPA if higher)',
      'List relevant coursework for early career',
      'Highlight honors, awards, and scholarships',
      'Include expected graduation date if still enrolled',
    ],
    examples: [
      'B.S. Computer Science, University of Michigan | GPA: 3.8/4.0 | Expected May 2025',
      'Relevant Coursework: Data Structures, Algorithms, Machine Learning, Distributed Systems',
    ],
  },
];

const ACTION_VERBS = [
  'Architected', 'Built', 'Created', 'Deployed', 'Designed', 'Developed', 'Engineered',
  'Implemented', 'Integrated', 'Led', 'Managed', 'Optimized', 'Orchestrated', 'Refactored',
  'Reduced', 'Scaled', 'Streamlined', 'Automated', 'Collaborated', 'Contributed',
];

// ===========================================
// COMPONENTS
// ===========================================
const ResumeBuilderPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'ats' | 'tips'>('templates');

  const atsPassedCount = ATS_CHECKLIST.filter(item => item.passed).length;
  const atsScore = Math.round((atsPassedCount / ATS_CHECKLIST.length) * 100);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-blue-400 mb-4">
            <Link to="/college/career-launch" className="hover:underline">Career Launch</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Resume Builder</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Resume & Portfolio
                <span className="text-blue-400"> Builder</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Create ATS-optimized resumes that get past the bots and impress hiring managers.
                AI-powered feedback helps you highlight your strengths and stand out.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </button>
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                  <FileText className="w-5 h-5" />
                  Start from Template
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">ATS Compatibility Score</h3>
                <span className={`text-2xl font-bold ${atsScore >= 80 ? 'text-green-400' : atsScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {atsScore}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${atsScore}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">
                Your resume passes {atsPassedCount} of {ATS_CHECKLIST.length} ATS checks.
                Fix the issues below to improve your score.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'templates', label: 'Resume Templates', icon: FileText },
            { id: 'ats', label: 'ATS Checker', icon: Target },
            { id: 'tips', label: 'Writing Tips', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">STEM Resume Templates</h2>
                <p className="text-gray-400 mt-1">ATS-optimized templates designed for technical roles</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESUME_TEMPLATES.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`bg-gray-900/50 rounded-xl border p-6 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    {template.popular && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-400 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{template.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-400">{template.atsScore}% ATS Score</span>
                    </div>
                    <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      Preview <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  Use This Template
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ATS Checker Tab */}
        {activeTab === 'ats' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">ATS Compatibility Check</h2>

              <div className="space-y-4">
                {ATS_CHECKLIST.map(item => (
                  <div
                    key={item.id}
                    className={`bg-gray-900/50 rounded-lg border p-4 ${
                      item.passed ? 'border-gray-800' : 'border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {item.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={item.passed ? 'text-gray-300' : 'text-white font-medium'}>
                            {item.label}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            item.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                            item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        {!item.passed && item.suggestion && (
                          <p className="text-sm text-gray-400 mt-1">{item.suggestion}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span>Use keywords from the job description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span>Keep formatting simple and consistent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span>Save as PDF to preserve formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span>Avoid headers, footers, and text boxes</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h4 className="font-medium text-white mb-3">Portfolio Links</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors">
                      <Github className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Connect GitHub</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors">
                      <Linkedin className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Connect LinkedIn</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Writing Tips Tab */}
        {activeTab === 'tips' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Resume Writing Tips</h2>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {RESUME_SECTIONS.map(section => (
                <div key={section.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{section.name}</h3>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Tips</h4>
                    <ul className="space-y-2">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Examples</h4>
                    <div className="space-y-2">
                      {section.examples.map((example, i) => (
                        <div key={i} className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-300 border-l-2 border-blue-500">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Verbs */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Power Action Verbs</h3>
              <p className="text-gray-400 mb-4">Start your bullet points with these strong action verbs:</p>
              <div className="flex flex-wrap gap-2">
                {ACTION_VERBS.map(verb => (
                  <span
                    key={verb}
                    className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm cursor-pointer hover:bg-blue-500/20 transition-colors"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Features Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI analyzes your resume against millions of successful applications to provide personalized feedback
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Smart Suggestions',
                description: 'Get AI-powered recommendations for improving your bullet points and highlighting key achievements',
              },
              {
                icon: Target,
                title: 'Job Matching',
                description: 'Paste a job description and see how well your resume matches, with specific suggestions to improve fit',
              },
              {
                icon: Award,
                title: 'Keyword Optimization',
                description: 'Identify missing keywords and skills that top candidates include for your target roles',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Resume?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join 50,000+ students who've landed interviews at top tech companies using our tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              <FileText className="w-5 h-5" />
              Create Resume Now
            </button>
            <Link
              to="/college/interview-prep"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Interview Prep
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
