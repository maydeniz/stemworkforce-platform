// ===========================================
// Faculty Connection Page - College Students
// Find professors aligned with your interests
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  Star,
  Mail,
  FileText,
  Award,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Faculty {
  id: string;
  name: string;
  title: string;
  university: string;
  department: string;
  location: string;
  researchAreas: string[];
  recentPapers: { title: string; year: number }[];
  openPositions: boolean;
  hIndex: number;
  labSize: string;
  acceptingStudents: 'yes' | 'maybe' | 'no';
}

// ===========================================
// SAMPLE DATA
// ===========================================
const FACULTY: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Associate Professor',
    university: 'Stanford University',
    department: 'Computer Science',
    location: 'Stanford, CA',
    researchAreas: ['Machine Learning', 'Natural Language Processing', 'AI Safety'],
    recentPapers: [
      { title: 'Scaling Laws for Language Models', year: 2024 },
      { title: 'Interpretability in Large Language Models', year: 2024 },
    ],
    openPositions: true,
    hIndex: 45,
    labSize: '8-12 students',
    acceptingStudents: 'yes',
  },
  {
    id: '2',
    name: 'Dr. Michael Zhang',
    title: 'Professor',
    university: 'MIT',
    department: 'Physics',
    location: 'Cambridge, MA',
    researchAreas: ['Quantum Computing', 'Condensed Matter', 'Superconducting Qubits'],
    recentPapers: [
      { title: 'Coherence Times in Superconducting Qubits', year: 2024 },
      { title: 'Error Correction in Quantum Systems', year: 2023 },
    ],
    openPositions: true,
    hIndex: 62,
    labSize: '10-15 students',
    acceptingStudents: 'yes',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    title: 'Assistant Professor',
    university: 'UC Berkeley',
    department: 'Bioengineering',
    location: 'Berkeley, CA',
    researchAreas: ['CRISPR', 'Gene Therapy', 'Synthetic Biology'],
    recentPapers: [
      { title: 'Novel CRISPR Delivery Mechanisms', year: 2024 },
      { title: 'Gene Editing for Rare Diseases', year: 2023 },
    ],
    openPositions: true,
    hIndex: 28,
    labSize: '6-10 students',
    acceptingStudents: 'maybe',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    title: 'Professor',
    university: 'Carnegie Mellon',
    department: 'Robotics',
    location: 'Pittsburgh, PA',
    researchAreas: ['Autonomous Systems', 'Computer Vision', 'Reinforcement Learning'],
    recentPapers: [
      { title: 'Self-Supervised Learning for Robotics', year: 2024 },
      { title: 'Sim-to-Real Transfer in Manipulation', year: 2024 },
    ],
    openPositions: false,
    hIndex: 55,
    labSize: '12-18 students',
    acceptingStudents: 'no',
  },
];

const RESEARCH_FIELDS = [
  'Machine Learning',
  'Quantum Computing',
  'Biotechnology',
  'Robotics',
  'Computer Vision',
  'NLP',
  'Materials Science',
  'Neuroscience',
];

const EMAIL_TEMPLATES = [
  {
    title: 'Initial Interest Email',
    subject: 'Prospective PhD Student - [Your Research Area]',
    body: `Dear Professor [Name],

I am a [year] student at [University] majoring in [Major], and I am writing to express my interest in pursuing a PhD in your lab starting [Season Year].

I was particularly drawn to your work on [specific paper or project]. [One sentence about why this interests you and how it connects to your background].

I have attached my CV and would be grateful for the opportunity to discuss your current research and whether there might be a fit for me in your lab.

Thank you for your time and consideration.

Best regards,
[Your Name]`,
  },
  {
    title: 'Follow-up After No Response (2 weeks)',
    subject: 'Re: Prospective PhD Student - [Your Research Area]',
    body: `Dear Professor [Name],

I wanted to follow up on my previous email regarding PhD opportunities in your lab. I understand you receive many inquiries and have a busy schedule.

I remain very interested in your work on [topic] and would welcome any opportunity to discuss potential research directions.

If you are not accepting students or if my background isn't a good fit, I would also appreciate any guidance you might offer.

Thank you again for your time.

Best regards,
[Your Name]`,
  },
];

// ===========================================
// COMPONENT
// ===========================================
const FacultyMatchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [showEmailTemplates, setShowEmailTemplates] = useState(false);

  const filteredFaculty = FACULTY.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.researchAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFields =
      selectedFields.length === 0 ||
      f.researchAreas.some(a => selectedFields.some(sf => a.toLowerCase().includes(sf.toLowerCase())));
    return matchesSearch && matchesFields;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-gray-950 to-violet-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-indigo-400 mb-4">
            <Link to="/college/grad-school-prep" className="hover:underline">Graduate & Research</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Faculty Connection</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Faculty
              <span className="text-indigo-400"> Connection</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find professors whose research aligns with your interests. Learn how to reach out
              effectively and build relationships that lead to research opportunities.
            </p>

            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, university, or research area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Field Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {RESEARCH_FIELDS.map(field => (
                <button
                  key={field}
                  onClick={() => setSelectedFields(prev =>
                    prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
                  )}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedFields.includes(field)
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Faculty Listings */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {filteredFaculty.length} Faculty Found
              </h2>
              <button
                onClick={() => setShowEmailTemplates(!showEmailTemplates)}
                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                Email Templates
              </button>
            </div>

            <div className="space-y-6">
              {filteredFaculty.map(faculty => (
                <div
                  key={faculty.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {faculty.name.split(' ').slice(-1)[0][0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{faculty.name}</h3>
                        <p className="text-gray-400">{faculty.title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Building2 className="w-3 h-3" />
                          {faculty.university} • {faculty.department}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      faculty.acceptingStudents === 'yes' ? 'bg-green-500/10 text-green-400' :
                      faculty.acceptingStudents === 'maybe' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {faculty.acceptingStudents === 'yes' ? 'Accepting Students' :
                       faculty.acceptingStudents === 'maybe' ? 'May Accept' : 'Not Accepting'}
                    </span>
                  </div>

                  {/* Research Areas */}
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Research Areas</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {faculty.researchAreas.map((area, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Papers */}
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Recent Publications</span>
                    <ul className="mt-2 space-y-1">
                      {faculty.recentPapers.map((paper, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          {paper.title} ({paper.year})
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-800 text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Award className="w-4 h-4 text-indigo-400" />
                      h-index: {faculty.hIndex}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Lab: {faculty.labSize}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {faculty.location}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      Draft Email
                    </button>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-700 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Lab Website
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Email Templates */}
            {showEmailTemplates && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  Email Templates
                </h3>
                <div className="space-y-4">
                  {EMAIL_TEMPLATES.map((template, i) => (
                    <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-white text-sm mb-2">{template.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-3">{template.body.substring(0, 150)}...</p>
                      <button className="text-indigo-400 text-xs mt-2 hover:text-indigo-300">
                        Copy Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outreach Tips */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Outreach Tips</h3>
              <ul className="space-y-3">
                {[
                  'Read at least 2-3 recent papers before reaching out',
                  'Be specific about why their research interests you',
                  'Mention relevant experience or coursework',
                  'Keep the email under 200 words',
                  'Follow up after 2 weeks if no response',
                  'Apply formally even if you get a positive response',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <Star className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Response Expectations */}
            <div className="bg-indigo-500/5 rounded-xl border border-indigo-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">What to Expect</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-indigo-400">Response Rate</div>
                  <p className="text-gray-400">~30% of cold emails get responses. Don't be discouraged!</p>
                </div>
                <div>
                  <div className="font-medium text-indigo-400">Timeline</div>
                  <p className="text-gray-400">Expect 1-2 weeks for a response. Faculty are busy.</p>
                </div>
                <div>
                  <div className="font-medium text-indigo-400">Next Steps</div>
                  <p className="text-gray-400">A video call is common before formal application.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-indigo-900/30 to-violet-900/30 rounded-2xl border border-indigo-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Reach Out?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get help crafting the perfect outreach email and track your applications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/sop-coach"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <FileText className="w-5 h-5" />
              SOP Coach
            </Link>
            <Link
              to="/college/grad-school-prep"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Grad School Prep
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyMatchPage;
