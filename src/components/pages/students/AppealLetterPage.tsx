// ===========================================
// Appeal Letter Generator Page
// Financial Aid Appeal Letter Writing Tool
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface AppealReason {
  id: string;
  category: string;
  title: string;
  description: string;
  documentationNeeded: string[];
  tips: string[];
  samplePhrasing: string;
}

interface AppealFormData {
  schoolName: string;
  studentName: string;
  parentName: string;
  originalAid: string;
  requestedAid: string;
  reasons: string[];
  circumstances: string;
  competingOffers: string;
  academicMerit: string;
  commitment: string;
}

interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  situation: string;
}

// Appeal reasons data
const appealReasons: AppealReason[] = [
  {
    id: 'job-loss',
    category: 'Income Change',
    title: 'Job Loss or Reduced Income',
    description: 'Parent(s) experienced job loss, layoff, or significant income reduction',
    documentationNeeded: [
      'Termination letter or layoff notice',
      'Last pay stub showing end date',
      'Unemployment benefits documentation',
      'Current year income estimates',
    ],
    tips: [
      'Be specific about the date and circumstances',
      'Provide projected annual income for the current year',
      'Explain any severance or unemployment benefits',
    ],
    samplePhrasing: 'Since filing our financial aid application, our family has experienced a significant change in circumstances. [Parent Name] was laid off from [Company] on [Date], resulting in a [X%] reduction in household income.',
  },
  {
    id: 'medical',
    category: 'Special Expenses',
    title: 'Medical Expenses',
    description: 'Significant unreimbursed medical expenses not reflected in tax returns',
    documentationNeeded: [
      'Medical bills and statements',
      'Insurance explanation of benefits (EOB)',
      'Prescription costs documentation',
      'Letter from healthcare provider if ongoing',
    ],
    tips: [
      'Include all out-of-pocket costs',
      'Document ongoing vs. one-time expenses',
      'Include mental health and therapy costs',
    ],
    samplePhrasing: 'Our family has faced substantial medical expenses totaling $[Amount] this year. These costs, which were not reflected in our prior year tax returns, include [treatment details].',
  },
  {
    id: 'competing-offer',
    category: 'Competing Offers',
    title: 'Better Offer from Comparable School',
    description: 'Another school has offered a more generous financial aid package',
    documentationNeeded: [
      'Award letter from competing school',
      'Cost of attendance comparison',
      'Net price breakdown',
    ],
    tips: [
      'Compare schools of similar selectivity',
      'Highlight specific differences in the packages',
      'Express genuine preference for this school',
    ],
    samplePhrasing: 'We have received a financial aid package from [School Name], a similarly ranked institution, that would result in a net cost of $[Amount] per year. While [Student Name] strongly prefers [Your School], the $[Difference] gap makes attending very challenging.',
  },
  {
    id: 'sibling',
    category: 'Family Changes',
    title: 'Multiple Children in College',
    description: 'Another family member is now enrolled or will enroll in college',
    documentationNeeded: [
      'Sibling\'s enrollment verification',
      'Sibling\'s financial aid award letter',
      'Updated family financial situation',
    ],
    tips: [
      'This is often not reflected in initial FAFSA',
      'Explain total family college costs',
      'Mention if sibling has less aid',
    ],
    samplePhrasing: 'Our family will now have [Number] children in college simultaneously. [Sibling Name] will be attending [School] with a net cost of $[Amount], significantly increasing our total educational expenses.',
  },
  {
    id: 'divorce',
    category: 'Family Changes',
    title: 'Divorce or Separation',
    description: 'Parents have divorced or separated since filing',
    documentationNeeded: [
      'Divorce decree or separation agreement',
      'Updated income documentation',
      'Child support/alimony documentation',
    ],
    tips: [
      'Explain which parent is now custodial',
      'Document any changes in living situation',
      'Include any legal agreements about college costs',
    ],
    samplePhrasing: 'Our family circumstances have changed significantly due to our recent divorce/separation. [Student Name] now resides primarily with [Parent], whose individual income is $[Amount].',
  },
  {
    id: 'death',
    category: 'Family Changes',
    title: 'Death in Family',
    description: 'Death of a parent or primary income earner',
    documentationNeeded: [
      'Death certificate',
      'Updated income projections',
      'Life insurance or estate information if applicable',
    ],
    tips: [
      'Schools are generally very understanding',
      'Explain ongoing income changes',
      'Don\'t hesitate to ask for help',
    ],
    samplePhrasing: 'Our family has experienced the devastating loss of [Relationship]. This has resulted in significant changes to our family income and circumstances.',
  },
  {
    id: 'natural-disaster',
    category: 'Special Circumstances',
    title: 'Natural Disaster or Emergency',
    description: 'Home or property damage from natural disaster',
    documentationNeeded: [
      'Insurance claims documentation',
      'FEMA or disaster relief documentation',
      'Photos of damage',
      'Repair estimates or bills',
    ],
    tips: [
      'Document all uninsured losses',
      'Explain any displacement costs',
      'Include any lost income from the event',
    ],
    samplePhrasing: 'Our family was affected by [Disaster Type] on [Date]. We experienced [describe losses] resulting in approximately $[Amount] in uninsured losses and additional expenses.',
  },
  {
    id: 'business',
    category: 'Income Change',
    title: 'Business Losses',
    description: 'Family business experienced significant losses or closure',
    documentationNeeded: [
      'Recent business financial statements',
      'Tax returns showing losses',
      'Letter from accountant or CPA',
    ],
    tips: [
      'Distinguish between paper losses and cash flow',
      'Explain if this affects family income',
      'Document any loans or debts from the business',
    ],
    samplePhrasing: 'Our family business has experienced significant challenges resulting in [losses/closure]. This has directly impacted our family income, which is now projected to be $[Amount] for this year.',
  },
];

// Letter templates (reserved for future template-based generation feature)
void ([
  {
    id: 'income-change',
    name: 'Income Change Appeal',
    description: 'For job loss, reduced hours, or income reduction',
    situation: 'income',
  },
  {
    id: 'competing-offer',
    name: 'Competing Offer Appeal',
    description: 'When another school offers better aid',
    situation: 'competing',
  },
  {
    id: 'special-circumstances',
    name: 'Special Circumstances Appeal',
    description: 'For medical expenses, family changes, or emergencies',
    situation: 'special',
  },
  {
    id: 'merit-appeal',
    name: 'Merit-Based Appeal',
    description: 'When academic achievements warrant more aid',
    situation: 'merit',
  },
] as LetterTemplate[]);

const AppealLetterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'write' | 'tips'>('learn');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [formData, setFormData] = useState<AppealFormData>({
    schoolName: '',
    studentName: '',
    parentName: '',
    originalAid: '',
    requestedAid: '',
    reasons: [],
    circumstances: '',
    competingOffers: '',
    academicMerit: '',
    commitment: '',
  });
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [step, setStep] = useState(1);

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const generateLetter = () => {
    const selectedReasonDetails = appealReasons.filter(r => selectedReasons.includes(r.id));

    let letter = `Dear Financial Aid Office,

I am writing to respectfully request a review of the financial aid package offered to ${formData.studentName || '[Student Name]'} for the upcoming academic year at ${formData.schoolName || '[School Name]'}.

We are truly grateful for the opportunity to attend ${formData.schoolName || 'your institution'} and the initial aid package of $${formData.originalAid || '[Original Aid Amount]'}. ${formData.studentName || 'Our student'} has worked diligently to earn admission to ${formData.schoolName || 'your school'} and is genuinely excited about the possibility of joining your community.

`;

    if (selectedReasonDetails.length > 0) {
      letter += `However, we are facing circumstances that make the current package challenging:\n\n`;
      selectedReasonDetails.forEach(reason => {
        letter += `${reason.samplePhrasing}\n\n`;
      });
    }

    if (formData.circumstances) {
      letter += `Additional context: ${formData.circumstances}\n\n`;
    }

    if (formData.competingOffers) {
      letter += `We want to be transparent that ${formData.studentName || 'our student'} has received offers from other institutions. ${formData.competingOffers}\n\n`;
    }

    if (formData.academicMerit) {
      letter += `${formData.studentName || 'Our student'} brings strong academic credentials and achievements: ${formData.academicMerit}\n\n`;
    }

    letter += `Given these circumstances, we respectfully request that you consider ${formData.requestedAid ? `increasing the aid package to approximately $${formData.requestedAid} per year` : 'increasing the financial aid package'} to help make attendance financially feasible for our family.

`;

    if (formData.commitment) {
      letter += `${formData.commitment}\n\n`;
    }

    letter += `We would be happy to provide any additional documentation needed to support this request. Thank you for your time and consideration.

Sincerely,

${formData.parentName || '[Parent/Guardian Name]'}
Parent/Guardian of ${formData.studentName || '[Student Name]'}

Attachments:
`;

    selectedReasonDetails.forEach(reason => {
      reason.documentationNeeded.forEach(doc => {
        letter += `• ${doc}\n`;
      });
    });

    setGeneratedLetter(letter);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
  };

  // Render learn tab
  const renderLearn = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Understanding Appeals */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Understanding Financial Aid Appeals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-400 mb-3">What Is an Appeal?</h3>
            <p className="text-gray-300 text-sm mb-4">
              A financial aid appeal is a formal request asking a college to reconsider your
              financial aid package. It's also called a "Professional Judgment" or
              "Special Circumstances" request.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-emerald-400">✓</span>
                <span>Completely normal and expected</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-emerald-400">✓</span>
                <span>Won't hurt your admission</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-emerald-400">✓</span>
                <span>Many families successfully appeal</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-indigo-400 mb-3">Success Rates</h3>
            <div className="space-y-3">
              <div className="bg-dark-bg rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">With new circumstances</span>
                  <span className="text-emerald-400 font-semibold">70-80%</span>
                </div>
                <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="bg-dark-bg rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">With competing offers</span>
                  <span className="text-teal-400 font-semibold">50-60%</span>
                </div>
                <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-teal-500 rounded-full" />
                </div>
              </div>
              <div className="bg-dark-bg rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">General requests</span>
                  <span className="text-yellow-400 font-semibold">20-30%</span>
                </div>
                <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="w-1/4 h-full bg-yellow-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Valid Reasons */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Valid Reasons to Appeal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appealReasons.map(reason => (
            <motion.div
              key={reason.id}
              whileHover={{ scale: 1.02 }}
              className="bg-dark-card border border-dark-border rounded-xl p-5 cursor-pointer hover:border-blue-500/50 transition-colors"
              onClick={() => toggleReason(reason.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs px-2 py-1 bg-dark-bg rounded-full text-gray-400 mb-2 inline-block">
                    {reason.category}
                  </span>
                  <h3 className="font-semibold text-white">{reason.title}</h3>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedReasons.includes(reason.id)
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-500'
                }`}>
                  {selectedReasons.includes(reason.id) && '✓'}
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">{reason.description}</p>

              <AnimatePresence>
                {selectedReasons.includes(reason.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-dark-border pt-3 mt-3"
                  >
                    <div className="text-xs text-blue-400 font-medium mb-2">Documentation Needed:</div>
                    <ul className="space-y-1">
                      {reason.documentationNeeded.map((doc, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA to write */}
      {selectedReasons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-bold text-white mb-2">
            Ready to Write Your Appeal?
          </h3>
          <p className="text-gray-400 mb-4">
            You've selected {selectedReasons.length} reason{selectedReasons.length > 1 ? 's' : ''} for your appeal.
          </p>
          <button
            onClick={() => {
              setFormData(prev => ({ ...prev, reasons: selectedReasons }));
              setActiveTab('write');
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
          >
            Start Writing Your Letter
          </button>
        </motion.div>
      )}
    </div>
  );

  // Render write tab
  const renderWrite = () => (
    <div className="max-w-3xl mx-auto">
      {!generatedLetter ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-8">
          {/* Progress steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s, idx) => (
              <React.Fragment key={s}>
                <button
                  onClick={() => setStep(s)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step === s
                      ? 'bg-blue-500 text-white'
                      : step > s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-dark-bg text-gray-500'
                  }`}
                >
                  {step > s ? '✓' : s}
                </button>
                {idx < 3 && (
                  <div className={`w-16 h-1 ${step > s ? 'bg-emerald-500' : 'bg-dark-bg'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Basic Information</h2>
                  <p className="text-gray-400 text-sm">Let's start with the basics</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">School Name</label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500"
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Student Name</label>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500"
                      placeholder="Student's Full Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Parent/Guardian Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500"
                    placeholder="Parent/Guardian Full Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Current Aid Offered</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.originalAid}
                        onChange={(e) => setFormData({ ...formData, originalAid: e.target.value.replace(/\D/g, '') })}
                        className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500"
                        placeholder="25,000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Aid Requested</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.requestedAid}
                        onChange={(e) => setFormData({ ...formData, requestedAid: e.target.value.replace(/\D/g, '') })}
                        className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500"
                        placeholder="35,000"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Your Circumstances</h2>
                  <p className="text-gray-400 text-sm">Select the reasons for your appeal</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {appealReasons.map(reason => (
                    <button
                      key={reason.id}
                      onClick={() => toggleReason(reason.id)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selectedReasons.includes(reason.id)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-dark-border hover:border-gray-600'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">{reason.category}</div>
                      <div className="text-sm text-white">{reason.title}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Additional Details About Your Circumstances
                  </label>
                  <textarea
                    value={formData.circumstances}
                    onChange={(e) => setFormData({ ...formData, circumstances: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500 h-32"
                    placeholder="Provide specific details about your situation..."
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Strengthen Your Appeal</h2>
                  <p className="text-gray-400 text-sm">Optional but can help your case</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Competing Offers (Optional)
                  </label>
                  <textarea
                    value={formData.competingOffers}
                    onChange={(e) => setFormData({ ...formData, competingOffers: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500 h-24"
                    placeholder="e.g., 'We received a package from [School] with $X in grants...'"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Academic Achievements (Optional)
                  </label>
                  <textarea
                    value={formData.academicMerit}
                    onChange={(e) => setFormData({ ...formData, academicMerit: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500 h-24"
                    placeholder="e.g., 'Recent accomplishments include a state science fair win...'"
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Final Touch</h2>
                  <p className="text-gray-400 text-sm">Express your commitment to the school</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Why This School?
                  </label>
                  <textarea
                    value={formData.commitment}
                    onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-blue-500 h-32"
                    placeholder="e.g., 'This school is our top choice because of its strong engineering program and research opportunities...'"
                  />
                </div>

                {/* Summary */}
                <div className="bg-dark-bg rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">School:</span>
                      <span className="text-white ml-2">{formData.schoolName || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Student:</span>
                      <span className="text-white ml-2">{formData.studentName || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Current Aid:</span>
                      <span className="text-white ml-2">${formData.originalAid || '0'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Requested:</span>
                      <span className="text-blue-400 ml-2">${formData.requestedAid || '0'}</span>
                    </div>
                  </div>
                  {selectedReasons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dark-border">
                      <span className="text-gray-400 text-sm">Reasons:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedReasons.map(id => {
                          const reason = appealReasons.find(r => r.id === id);
                          return (
                            <span key={id} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              {reason?.title}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(Math.min(4, step + 1))}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={generateLetter}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600"
              >
                Generate Letter
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Generated letter */}
          <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-dark-border flex items-center justify-between">
              <h3 className="font-bold text-white">Your Appeal Letter</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setGeneratedLetter('')}
                  className="px-4 py-2 border border-dark-border text-gray-400 rounded-lg text-sm hover:border-gray-500"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-gray-300 text-sm font-sans leading-relaxed">
                {generatedLetter}
              </pre>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                <div>
                  <div className="text-white font-medium">Review and personalize</div>
                  <div className="text-sm text-gray-400">Customize the letter with your specific details</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                <div>
                  <div className="text-white font-medium">Gather documentation</div>
                  <div className="text-sm text-gray-400">Collect all supporting documents listed at the bottom</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                <div>
                  <div className="text-white font-medium">Submit to financial aid office</div>
                  <div className="text-sm text-gray-400">Email or mail to the school's financial aid office</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
                <div>
                  <div className="text-white font-medium">Follow up</div>
                  <div className="text-sm text-gray-400">Call after 1-2 weeks if you haven't heard back</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render tips tab
  const renderTips = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">Do's</h3>
          <ul className="space-y-3">
            {[
              'Be professional and respectful',
              'Provide specific numbers and dates',
              'Include all supporting documentation',
              'Express genuine interest in the school',
              'Be honest about your situation',
              'Submit as early as possible',
              'Follow up politely after 1-2 weeks',
              'Thank them for their consideration',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-400 mb-4">Don'ts</h3>
          <ul className="space-y-3">
            {[
              'Don\'t demand or act entitled',
              'Don\'t lie or exaggerate circumstances',
              'Don\'t compare to non-comparable schools',
              'Don\'t send without documentation',
              'Don\'t be vague about amounts',
              'Don\'t wait until the last minute',
              'Don\'t make it emotional or desperate',
              'Don\'t send form letters unchanged',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tips by school type */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Tips by School Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-2xl mb-3">🏛️</div>
            <h4 className="font-semibold text-white mb-2">Public Universities</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Often have less discretionary aid</li>
              <li>• Focus on documented circumstances</li>
              <li>• State grants may have separate appeals</li>
              <li>• Competing offers less effective</li>
            </ul>
          </div>
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-2xl mb-3">🏫</div>
            <h4 className="font-semibold text-white mb-2">Private Colleges</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• More flexibility in aid decisions</li>
              <li>• Competing offers can be effective</li>
              <li>• Merit considerations matter</li>
              <li>• Demonstrated interest helps</li>
            </ul>
          </div>
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-2xl mb-3">🎓</div>
            <h4 className="font-semibold text-white mb-2">Elite Institutions</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Usually meet 100% of need</li>
              <li>• Focus on correcting EFC errors</li>
              <li>• Don\'t typically match offers</li>
              <li>• Document unusual circumstances</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common mistakes */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Common Mistakes to Avoid</h3>
        <div className="space-y-4">
          {[
            {
              mistake: 'Comparing incomparable schools',
              fix: 'Only reference schools of similar selectivity and type',
            },
            {
              mistake: 'Being too vague about amounts',
              fix: 'Specify exact dollar amounts and what you\'re requesting',
            },
            {
              mistake: 'Forgetting documentation',
              fix: 'Include all supporting documents mentioned in your letter',
            },
            {
              mistake: 'Waiting too long to appeal',
              fix: 'Submit as soon as possible after receiving your offer',
            },
            {
              mistake: 'Writing an emotional plea',
              fix: 'Stay professional and focus on facts and circumstances',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-dark-bg rounded-lg">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-400">✕</span>
              </div>
              <div>
                <div className="text-white font-medium">{item.mistake}</div>
                <div className="text-sm text-gray-400 mt-1">
                  <span className="text-emerald-400">Instead:</span> {item.fix}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm mb-6"
          >
            <span>✉️</span>
            <span>Financial Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Appeal Letter Generator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Create a professional financial aid appeal letter in minutes
          </motion.p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-card border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'learn'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">📚</span>
              Learn
            </button>
            <button
              onClick={() => setActiveTab('write')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'write'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">✍️</span>
              Write Letter
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tips'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">💡</span>
              Tips
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'learn' && renderLearn()}
        {activeTab === 'write' && renderWrite()}
        {activeTab === 'tips' && renderTips()}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-dark-card border border-dark-border rounded-lg max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <div>
              <h4 className="font-medium text-white mb-1">Important Note</h4>
              <p className="text-sm text-gray-400">
                This tool provides a starting template. Every situation is unique - personalize
                your letter with specific details. Schools appreciate genuine, professional
                communication. Success is not guaranteed, but a well-crafted appeal can make
                a significant difference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppealLetterPage;
