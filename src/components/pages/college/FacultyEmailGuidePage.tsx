import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Copy,
  BookOpen,
  User,
  Sparkles,
  FileText,
} from 'lucide-react';

const TEMPLATES = [
  {
    id: 'research-inquiry',
    title: 'Research Opportunity Inquiry',
    scenario: 'Reaching out about joining a lab or research group',
    template: `Subject: Prospective [MS/PhD] Student — Interest in [Specific Research Area]

Dear Professor [Last Name],

I am [Your Name], a [year] [major] student at [University], and I am writing to express my strong interest in your research on [specific topic/paper title].

I was particularly drawn to your work on [specific finding or methodology], which aligns with my experience in [relevant coursework, projects, or skills]. During my time at [University], I have [brief relevant accomplishment].

I would welcome the opportunity to discuss potential research positions in your group for [semester/year]. I have attached my CV for your reference.

Thank you for your time and consideration.

Best regards,
[Your Name]`,
  },
  {
    id: 'phd-advisor',
    title: 'PhD Advisor Introduction',
    scenario: 'Introducing yourself to a potential PhD advisor',
    template: `Subject: PhD Applicant — [Your Research Interest] — [Application Cycle Year]

Dear Professor [Last Name],

I am applying to the [Department] PhD program at [University] for [Fall Year], and I am writing to express my interest in working with you.

Your recent paper on [specific paper] resonated with my research interests in [area]. My background includes [1-2 relevant experiences], and I believe your lab's approach to [methodology/topic] would be an excellent fit for my doctoral research goals.

Specifically, I am interested in exploring [1-2 sentence research question]. I would be grateful for any guidance on the application process or whether your group is accepting new students.

Thank you for considering my inquiry.

Sincerely,
[Your Name]`,
  },
  {
    id: 'informational',
    title: 'Informational Meeting Request',
    scenario: 'Requesting a brief meeting to learn about career paths',
    template: `Subject: Brief Meeting Request — [Your Major] Student Interested in [Field]

Dear Professor [Last Name],

I am [Your Name], a [year] student studying [major] at [University]. I have been exploring career paths in [field] and would appreciate the opportunity to learn from your experience.

[1 sentence about why you chose this professor specifically]

Would you have 15 minutes available in the coming weeks for a brief conversation? I am happy to meet at your convenience, either in person or virtually.

Thank you for your time.

Best regards,
[Your Name]`,
  },
];

const DOS = [
  'Reference a specific paper or research project',
  'Keep it under 200 words',
  'Show you have done your homework on their work',
  'Mention relevant skills or experience',
  'Be clear about what you are asking for',
  'Proofread — zero typos',
];

const DONTS = [
  'Send a generic mass email',
  'Write more than 3 paragraphs',
  'Ask questions answered on their website',
  'Use overly casual language',
  'Attach unsolicited files (unless CV is relevant)',
  'Follow up more than once in 2 weeks',
];

export default function FacultyEmailGuidePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Link to="/college/research-opportunities" className="text-sm text-slate-500 hover:text-slate-300 mb-4 inline-block">&larr; Research Opportunities</Link>
          <div className="flex items-center gap-3 mb-4">
            <Mail size={28} className="text-emerald-400" />
            <h1 className="text-4xl font-bold">Faculty Email Guide</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Craft effective emails to professors and research advisors. AI-assisted templates with proven strategies for getting responses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Template Selector */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <FileText size={16} className={selectedTemplate.id === template.id ? 'text-emerald-400' : 'text-slate-500'} />
                    <div className="text-sm font-medium mt-2">{template.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{template.scenario}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Display */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedTemplate.title}</h3>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                >
                  {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-800/50 rounded-lg p-4 border border-slate-700 leading-relaxed">
                {selectedTemplate.template}
              </pre>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Sparkles size={12} className="text-amber-400" />
                Replace all [bracketed] items with your specific information
              </div>
            </div>

            {/* AI Enhancement CTA */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles size={20} className="text-amber-400" />
                <h3 className="font-semibold">AI-Powered Email Assistant</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Our AI can personalize these templates based on the professor's actual research papers and your background. It analyzes their recent publications to help you reference specific work.
              </p>
              <Link
                to="/ai-career-guide"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors"
              >
                Try AI Assistant <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Sidebar - Do's and Don'ts */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} className="text-emerald-400" />
                <h3 className="font-semibold">Do</h3>
              </div>
              <div className="space-y-2">
                {DOS.map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-red-400" />
                <h3 className="font-semibold">Don't</h3>
              </div>
              <div className="space-y-2">
                {DONTS.map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <AlertTriangle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <User size={18} className="text-blue-400" />
                <h3 className="font-semibold">Response Rate Tips</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Emails that reference a specific paper have a <span className="text-emerald-400 font-medium">3x higher</span> response rate.</p>
                <p>Send on <span className="text-emerald-400 font-medium">Tuesday-Thursday mornings</span> for best results.</p>
                <p>Average faculty response time is <span className="text-emerald-400 font-medium">5-7 business days</span>.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <BookOpen size={18} className="text-purple-400 mb-3" />
              <h3 className="font-semibold mb-2">Related Resources</h3>
              <div className="space-y-2">
                <Link to="/college/research-opportunities" className="block text-sm text-emerald-400 hover:text-emerald-300">Research Opportunities &rarr;</Link>
                <Link to="/college/faculty-match" className="block text-sm text-emerald-400 hover:text-emerald-300">Faculty Match &rarr;</Link>
                <Link to="/college/sop-coach" className="block text-sm text-emerald-400 hover:text-emerald-300">SOP Coach &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
