// ===========================================
// CSS Profile Optimizer Page
// CSS Profile Guidance and Strategy Tool
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  questions: ProfileQuestion[];
  tips: string[];
}

interface ProfileQuestion {
  id: string;
  question: string;
  explanation: string;
  fafsaDifference?: string;
  optimizationTips: string[];
  redFlags: string[];
}

interface AssetStrategy {
  asset: string;
  fafsaTreatment: string;
  cssTreatment: string;
  strategy: string;
  impactLevel: 'high' | 'medium' | 'low';
}

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  deadline: string;
  completed: boolean;
}

// CSS Profile sections data
const profileSections: ProfileSection[] = [
  {
    id: 'income',
    title: 'Income Reporting',
    icon: '💵',
    description: 'CSS Profile looks at income differently than FAFSA',
    questions: [
      {
        id: 'income-1',
        question: 'Do you report non-custodial parent income?',
        explanation: 'Unlike FAFSA, many CSS Profile schools require information from BOTH parents, even if divorced.',
        fafsaDifference: 'FAFSA only requires custodial parent info; CSS often requires both parents',
        optimizationTips: [
          'Check if your schools offer a Non-Custodial Parent Waiver',
          'Document any lack of contact with non-custodial parent',
          'Some schools waive this for documented estrangement',
        ],
        redFlags: [
          'Inconsistent income reporting between parents',
          'Missing required non-custodial information',
        ],
      },
      {
        id: 'income-2',
        question: 'What income does CSS Profile count that FAFSA doesn\'t?',
        explanation: 'CSS Profile considers a broader range of income sources.',
        fafsaDifference: 'CSS may count child support, housing allowances, and other non-taxable income',
        optimizationTips: [
          'Review all non-taxable income sources',
          'Document one-time income vs. recurring income',
          'Explain any unusual income spikes',
        ],
        redFlags: [
          'Unexplained large deposits',
          'Inconsistent income year-over-year without explanation',
        ],
      },
    ],
    tips: [
      'Gather both parents\' financial information early',
      'Request Non-Custodial Parent Waiver if applicable',
      'Document any special circumstances in the additional info section',
    ],
  },
  {
    id: 'assets',
    title: 'Asset Reporting',
    icon: '🏠',
    description: 'Home equity and other assets are treated very differently',
    questions: [
      {
        id: 'assets-1',
        question: 'How is home equity treated?',
        explanation: 'This is often the biggest difference between FAFSA and CSS Profile.',
        fafsaDifference: 'FAFSA ignores home equity entirely; CSS Profile may count it',
        optimizationTips: [
          'Check each school\'s home equity cap policy',
          'Some schools cap home equity at 1.5-2x income',
          'Document home improvements and renovations',
          'Consider timing of any refinancing',
        ],
        redFlags: [
          'Home equity much higher than income suggests',
          'Recent large equity increases without explanation',
        ],
      },
      {
        id: 'assets-2',
        question: 'Are retirement accounts protected?',
        explanation: 'Both forms protect retirement accounts, but CSS Profile asks more questions.',
        fafsaDifference: 'Both protect qualified retirement accounts, but CSS asks about contributions',
        optimizationTips: [
          'Don\'t withdraw from retirement for college costs',
          'Continue regular retirement contributions',
          'Document any required minimum distributions',
        ],
        redFlags: [
          'Large recent contributions to avoid asset reporting',
          'Early withdrawals that could indicate hidden assets',
        ],
      },
      {
        id: 'assets-3',
        question: 'What about small business or farm assets?',
        explanation: 'Treatment of business assets varies significantly between forms.',
        fafsaDifference: 'FAFSA exempts small businesses (<100 employees); CSS Profile may count them',
        optimizationTips: [
          'Get professional business valuation',
          'Document that assets are essential to business operation',
          'Separate personal vs. business assets clearly',
        ],
        redFlags: [
          'Artificially inflated business values',
          'Transferring personal assets to business',
        ],
      },
    ],
    tips: [
      'Get a recent home appraisal if values have changed',
      'Document the necessity of business/farm assets',
      'Check each school\'s specific asset policies',
    ],
  },
  {
    id: 'special',
    title: 'Special Circumstances',
    icon: '📋',
    description: 'CSS Profile allows more nuanced explanations',
    questions: [
      {
        id: 'special-1',
        question: 'How do I report medical expenses?',
        explanation: 'CSS Profile gives more weight to unreimbursed medical expenses.',
        fafsaDifference: 'CSS allows detailed medical expense reporting in special circumstances',
        optimizationTips: [
          'Document all out-of-pocket medical costs',
          'Include ongoing treatment costs',
          'Explain any disability-related expenses',
        ],
        redFlags: [
          'Claiming expenses without documentation',
          'Inconsistent medical expense claims',
        ],
      },
      {
        id: 'special-2',
        question: 'What about job loss or income reduction?',
        explanation: 'Use the additional information section to explain changes.',
        optimizationTips: [
          'Provide documentation of job loss',
          'Estimate current year income if significantly different',
          'Explain any severance or unemployment benefits',
        ],
        redFlags: [
          'Voluntary job changes to reduce income',
          'Inconsistent employment history without explanation',
        ],
      },
    ],
    tips: [
      'Use the "Special Circumstances" section liberally',
      'Provide documentation for any unusual situations',
      'Be honest but thorough in explanations',
    ],
  },
  {
    id: 'student',
    title: 'Student Assets & Income',
    icon: '🎓',
    description: 'Student assets are assessed at a higher rate',
    questions: [
      {
        id: 'student-1',
        question: 'How are student assets weighted?',
        explanation: 'Student assets are assessed at 25% vs. 5.64% for parent assets.',
        fafsaDifference: 'Both forms assess student assets higher, but CSS may be stricter',
        optimizationTips: [
          'Consider whose name accounts are in before application',
          'UGMA/UTMA accounts count as student assets',
          '529 plans owned by parents are treated more favorably',
        ],
        redFlags: [
          'Moving money between accounts just before filing',
          'Large unexplained student assets',
        ],
      },
    ],
    tips: [
      'Plan asset ownership well before senior year',
      '529 plans should be in parent\'s name when possible',
      'Student work income is generally treated favorably',
    ],
  },
];

// Asset treatment comparison
const assetStrategies: AssetStrategy[] = [
  {
    asset: 'Primary Home Equity',
    fafsaTreatment: 'Not counted',
    cssTreatment: 'Counted (often capped)',
    strategy: 'Research each school\'s cap policy. Many cap at 1.5-2x income.',
    impactLevel: 'high',
  },
  {
    asset: 'Retirement Accounts (401k, IRA)',
    fafsaTreatment: 'Protected',
    cssTreatment: 'Protected',
    strategy: 'Continue contributions. Don\'t withdraw for college costs.',
    impactLevel: 'low',
  },
  {
    asset: 'Cash & Savings',
    fafsaTreatment: 'Counted at 5.64%',
    cssTreatment: 'Counted at 5%',
    strategy: 'Consider paying down debt or prepaying expenses before filing.',
    impactLevel: 'medium',
  },
  {
    asset: 'Small Business (<100 emp)',
    fafsaTreatment: 'Exempt',
    cssTreatment: 'May be counted',
    strategy: 'Document that assets are essential to operations. Get valuation.',
    impactLevel: 'high',
  },
  {
    asset: 'Non-Retirement Investments',
    fafsaTreatment: 'Counted at 5.64%',
    cssTreatment: 'Counted at 5%',
    strategy: 'Consider rebalancing to 529 plans or paying down mortgages.',
    impactLevel: 'medium',
  },
  {
    asset: '529 College Savings',
    fafsaTreatment: 'Parent asset (5.64%)',
    cssTreatment: 'Parent asset (varies)',
    strategy: 'Keep in parent\'s name. Some schools have specific policies.',
    impactLevel: 'medium',
  },
  {
    asset: 'Student UGMA/UTMA',
    fafsaTreatment: 'Student asset (20%)',
    cssTreatment: 'Student asset (25%)',
    strategy: 'Consider spending down on legitimate college prep expenses.',
    impactLevel: 'high',
  },
  {
    asset: 'Vacation/Second Home',
    fafsaTreatment: 'Counted as investment',
    cssTreatment: 'Counted as investment',
    strategy: 'Document any rental income and expenses.',
    impactLevel: 'medium',
  },
];

// Checklist template
const checklistTemplate: ChecklistItem[] = [
  {
    id: '1',
    category: 'Documents',
    task: 'Gather tax returns',
    description: 'Both parents\' federal tax returns from previous two years',
    deadline: 'October 1',
    completed: false,
  },
  {
    id: '2',
    category: 'Documents',
    task: 'Collect W-2s',
    description: 'W-2 forms for all household members with income',
    deadline: 'October 1',
    completed: false,
  },
  {
    id: '3',
    category: 'Documents',
    task: 'Get investment statements',
    description: 'Current statements for all non-retirement accounts',
    deadline: 'October 1',
    completed: false,
  },
  {
    id: '4',
    category: 'Documents',
    task: 'Obtain mortgage statement',
    description: 'Current mortgage balance and home value estimate',
    deadline: 'October 1',
    completed: false,
  },
  {
    id: '5',
    category: 'Research',
    task: 'Check school policies',
    description: 'Review each school\'s specific CSS Profile requirements',
    deadline: 'September 15',
    completed: false,
  },
  {
    id: '6',
    category: 'Research',
    task: 'Non-custodial waiver',
    description: 'Determine if waiver is available and gather documentation',
    deadline: 'September 15',
    completed: false,
  },
  {
    id: '7',
    category: 'Strategy',
    task: 'Review asset positioning',
    description: 'Optimize asset ownership before filing',
    deadline: 'September 1',
    completed: false,
  },
  {
    id: '8',
    category: 'Strategy',
    task: 'Document special circumstances',
    description: 'Prepare explanations for any unusual financial situations',
    deadline: 'October 1',
    completed: false,
  },
  {
    id: '9',
    category: 'Filing',
    task: 'Create College Board account',
    description: 'Set up account and link to student\'s College Board profile',
    deadline: 'September 30',
    completed: false,
  },
  {
    id: '10',
    category: 'Filing',
    task: 'Complete CSS Profile',
    description: 'Submit to all schools on your list',
    deadline: 'Varies by school',
    completed: false,
  },
];

const CSSProfileOptimizerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'comparison' | 'checklist'>('guide');
  const [expandedSection, setExpandedSection] = useState<string | null>('income');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(checklistTemplate);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercent = (completedCount / checklist.length) * 100;

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Render guide tab
  const renderGuide = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* What is CSS Profile */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">What is the CSS Profile?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Key Differences from FAFSA</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Required by ~400 colleges (mostly private)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Considers home equity and other assets FAFSA ignores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Often requires non-custodial parent information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Has a fee ($25 first school, $16 each additional)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-pink-400 mb-2">Timeline</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span><strong>Oct 1:</strong> CSS Profile opens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span><strong>Early Nov:</strong> Early Decision deadlines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span><strong>Jan-Feb:</strong> Regular Decision deadlines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span>Check each school's specific deadline!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sections */}
      {profileSections.map(section => (
        <div
          key={section.id}
          className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-dark-bg/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{section.icon}</span>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">{section.title}</h3>
                <p className="text-sm text-gray-400">{section.description}</p>
              </div>
            </div>
            <motion.span
              animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
              className="text-gray-400 text-xl"
            >
              ▼
            </motion.span>
          </button>

          <AnimatePresence>
            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-dark-border"
              >
                <div className="p-6 space-y-4">
                  {/* Quick Tips */}
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-400 mb-2">Quick Tips</h4>
                    <ul className="space-y-1">
                      {section.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-teal-400">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {section.questions.map(q => (
                      <div
                        key={q.id}
                        className="bg-dark-bg rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-dark-border/30 transition-colors"
                        >
                          <span className="text-white font-medium text-left">{q.question}</span>
                          <motion.span
                            animate={{ rotate: expandedQuestion === q.id ? 180 : 0 }}
                            className="text-gray-500"
                          >
                            ▼
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {expandedQuestion === q.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="border-t border-dark-border overflow-hidden"
                            >
                              <div className="p-4 space-y-4">
                                <p className="text-gray-300 text-sm">{q.explanation}</p>

                                {q.fafsaDifference && (
                                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                    <div className="text-xs text-purple-400 font-medium mb-1">FAFSA vs CSS Difference</div>
                                    <p className="text-sm text-gray-300">{q.fafsaDifference}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                                    <div className="text-xs text-emerald-400 font-medium mb-2">Optimization Tips</div>
                                    <ul className="space-y-1">
                                      {q.optimizationTips.map((tip, idx) => (
                                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                          <span className="text-emerald-400">•</span>
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                    <div className="text-xs text-red-400 font-medium mb-2">Red Flags to Avoid</div>
                                    <ul className="space-y-1">
                                      {q.redFlags.map((flag, idx) => (
                                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                          <span className="text-red-400">⚠</span>
                                          <span>{flag}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  // Render comparison tab
  const renderComparison = () => (
    <div className="max-w-5xl mx-auto">
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold text-white">Asset Treatment: FAFSA vs CSS Profile</h2>
          <p className="text-gray-400 text-sm mt-1">Understanding how different assets are treated can help you plan strategically</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-bg">
                <th className="text-left p-4 text-gray-300 font-medium">Asset Type</th>
                <th className="text-left p-4 text-gray-300 font-medium">FAFSA</th>
                <th className="text-left p-4 text-gray-300 font-medium">CSS Profile</th>
                <th className="text-left p-4 text-gray-300 font-medium">Strategy</th>
                <th className="text-center p-4 text-gray-300 font-medium">Impact</th>
              </tr>
            </thead>
            <tbody>
              {assetStrategies.map((item, idx) => (
                <tr key={idx} className="border-b border-dark-border/50 hover:bg-dark-bg/50">
                  <td className="p-4 text-white font-medium">{item.asset}</td>
                  <td className="p-4 text-gray-300 text-sm">{item.fafsaTreatment}</td>
                  <td className="p-4 text-gray-300 text-sm">{item.cssTreatment}</td>
                  <td className="p-4 text-gray-400 text-sm">{item.strategy}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getImpactColor(item.impactLevel)}`}>
                      {item.impactLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-dark-card border border-red-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🏠</div>
          <h3 className="font-bold text-white mb-2">Home Equity</h3>
          <p className="text-gray-400 text-sm">
            The biggest difference. FAFSA ignores it entirely, but CSS Profile may count it.
            Check each school's cap policy - many limit to 1.5-2x income.
          </p>
        </div>
        <div className="bg-dark-card border border-yellow-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">💼</div>
          <h3 className="font-bold text-white mb-2">Small Business</h3>
          <p className="text-gray-400 text-sm">
            FAFSA exempts businesses with fewer than 100 employees. CSS Profile
            may count business assets, so document their operational necessity.
          </p>
        </div>
        <div className="bg-dark-card border border-emerald-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🎓</div>
          <h3 className="font-bold text-white mb-2">Student Assets</h3>
          <p className="text-gray-400 text-sm">
            Both forms assess student assets at higher rates (20-25% vs 5-6% for parents).
            Plan asset ownership carefully before filing.
          </p>
        </div>
      </div>
    </div>
  );

  // Render checklist tab
  const renderChecklist = () => {
    const categories = [...new Set(checklist.map(item => item.category))];

    return (
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">CSS Profile Checklist</h2>
            <span className="text-teal-400 font-semibold">{completedCount}/{checklist.length} completed</span>
          </div>
          <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Checklist by category */}
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-dark-border bg-dark-bg">
                <h3 className="font-bold text-white">{category}</h3>
              </div>
              <div className="divide-y divide-dark-border">
                {checklist
                  .filter(item => item.category === category)
                  .map(item => (
                    <div
                      key={item.id}
                      className={`p-4 flex items-start gap-4 transition-colors ${
                        item.completed ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          item.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-500 hover:border-teal-500'
                        }`}
                      >
                        {item.completed && <span className="text-sm">✓</span>}
                      </button>
                      <div className="flex-1">
                        <div className={`font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {item.task}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                      <div className="text-xs text-gray-500 flex-shrink-0">{item.deadline}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reset button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setChecklist(checklistTemplate)}
            className="text-sm text-gray-500 hover:text-gray-300"
          >
            Reset checklist
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm mb-6"
          >
            <span>📋</span>
            <span>Financial Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            CSS Profile Optimizer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Master the CSS Profile. Understand what matters. Maximize your aid.
          </motion.p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-card border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">📖</span>
              Guide
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'comparison'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">⚖️</span>
              FAFSA vs CSS
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'checklist'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">✅</span>
              Checklist
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'guide' && renderGuide()}
        {activeTab === 'comparison' && renderComparison()}
        {activeTab === 'checklist' && renderChecklist()}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-dark-card border border-dark-border rounded-lg max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <div>
              <h4 className="font-medium text-white mb-1">Important Disclaimer</h4>
              <p className="text-sm text-gray-400">
                This guide provides general information about the CSS Profile. Financial aid policies
                vary by institution and change frequently. Always verify requirements with each school's
                financial aid office. This is not financial advice - consult a qualified professional
                for your specific situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSProfileOptimizerPage;
