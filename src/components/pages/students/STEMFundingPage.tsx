// ===========================================
// STEM Funding Page
// CHIPS Act, Federal Funding & STEM Opportunities
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface FundingProgram {
  id: string;
  name: string;
  agency: string;
  type: 'scholarship' | 'grant' | 'fellowship' | 'internship' | 'workforce';
  amount: string;
  eligibility: string[];
  deadline: string;
  description: string;
  stemFields: string[];
  url: string;
  isChipsAct: boolean;
  competitiveness: 'high' | 'medium' | 'low';
}

interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  chipsActFunding: string;
  jobGrowth: string;
  avgSalary: string;
  keyEmployers: string[];
  hotSkills: string[];
}

// CHIPS Act industries
const chipsIndustries: Industry[] = [
  {
    id: 'semiconductor',
    name: 'Semiconductor Manufacturing',
    icon: '🔬',
    description: 'Design, fabrication, and testing of integrated circuits and microchips',
    chipsActFunding: '$52.7B',
    jobGrowth: '+15% by 2030',
    avgSalary: '$105,000',
    keyEmployers: ['Intel', 'TSMC', 'Samsung', 'GlobalFoundries', 'Micron', 'Texas Instruments'],
    hotSkills: ['Cleanroom operations', 'Process engineering', 'Photolithography', 'Metrology', 'EDA tools'],
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    description: 'Artificial intelligence research, development, and applications',
    chipsActFunding: '$13B (R&D)',
    jobGrowth: '+25% by 2030',
    avgSalary: '$130,000',
    keyEmployers: ['Google', 'OpenAI', 'NVIDIA', 'Microsoft', 'Meta', 'Amazon'],
    hotSkills: ['PyTorch/TensorFlow', 'NLP', 'Computer Vision', 'MLOps', 'Edge AI'],
  },
  {
    id: 'quantum',
    name: 'Quantum Technologies',
    icon: '⚛️',
    description: 'Quantum hardware, software, and applications development',
    chipsActFunding: '$3B',
    jobGrowth: '+35% by 2030',
    avgSalary: '$140,000',
    keyEmployers: ['IBM', 'Google', 'IonQ', 'Rigetti', 'D-Wave', 'Honeywell'],
    hotSkills: ['Quantum algorithms', 'Qiskit/Cirq', 'Linear algebra', 'Error correction', 'Cryogenics'],
  },
  {
    id: 'wireless',
    name: 'Wireless & 5G/6G',
    icon: '📡',
    description: 'Next-generation wireless technology and infrastructure',
    chipsActFunding: '$1.5B',
    jobGrowth: '+12% by 2030',
    avgSalary: '$95,000',
    keyEmployers: ['Qualcomm', 'Ericsson', 'Nokia', 'AT&T', 'Verizon', 'T-Mobile'],
    hotSkills: ['RF engineering', 'Signal processing', 'Network architecture', 'mmWave', 'O-RAN'],
  },
  {
    id: 'cyber',
    name: 'Cybersecurity',
    icon: '🔐',
    description: 'Protecting critical infrastructure and semiconductor supply chain',
    chipsActFunding: '$500M+',
    jobGrowth: '+33% by 2030',
    avgSalary: '$115,000',
    keyEmployers: ['CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'Mandiant', 'NSA', 'CISA'],
    hotSkills: ['Hardware security', 'Supply chain security', 'Zero trust', 'Threat intel', 'Incident response'],
  },
  {
    id: 'materials',
    name: 'Advanced Materials',
    icon: '🧪',
    description: 'Novel materials for semiconductor and electronics manufacturing',
    chipsActFunding: '$2B',
    jobGrowth: '+10% by 2030',
    avgSalary: '$90,000',
    keyEmployers: ['Applied Materials', 'Lam Research', 'DuPont', 'Corning', '3M', 'Entegris'],
    hotSkills: ['Materials science', 'Thin films', 'Chemical engineering', 'Characterization', 'Nanotechnology'],
  },
];

// Funding programs
const fundingPrograms: FundingProgram[] = [
  {
    id: '1',
    name: 'CHIPS for America Workforce Development',
    agency: 'Department of Commerce',
    type: 'workforce',
    amount: 'Up to $50,000',
    eligibility: ['US Citizen or Permanent Resident', 'Enrolled in semiconductor-related program', 'Community college or university student'],
    deadline: 'Rolling',
    description: 'Funding for students pursuing careers in semiconductor manufacturing, including tuition assistance, internships, and job placement.',
    stemFields: ['Electrical Engineering', 'Materials Science', 'Chemical Engineering', 'Physics', 'Manufacturing'],
    url: 'https://www.nist.gov/chips',
    isChipsAct: true,
    competitiveness: 'medium',
  },
  {
    id: '2',
    name: 'NSF Graduate Research Fellowship (GRFP)',
    agency: 'National Science Foundation',
    type: 'fellowship',
    amount: '$37,000/year + tuition',
    eligibility: ['US Citizen or Permanent Resident', 'Early-career graduate student', 'STEM field'],
    deadline: 'October annually',
    description: 'Prestigious fellowship supporting graduate students in STEM fields. Three years of support for research in NSF-supported disciplines.',
    stemFields: ['All STEM fields'],
    url: 'https://www.nsfgrfp.org',
    isChipsAct: false,
    competitiveness: 'high',
  },
  {
    id: '3',
    name: 'DOE Science Undergraduate Laboratory Internships (SULI)',
    agency: 'Department of Energy',
    type: 'internship',
    amount: '$750/week + housing',
    eligibility: ['US Citizen', 'Undergraduate student', '18+ years old'],
    deadline: 'January & May',
    description: 'Paid research internships at DOE National Laboratories. Work alongside scientists on cutting-edge research in energy, materials, and computing.',
    stemFields: ['Physics', 'Chemistry', 'Computer Science', 'Engineering', 'Materials Science'],
    url: 'https://science.osti.gov/wdts/suli',
    isChipsAct: false,
    competitiveness: 'medium',
  },
  {
    id: '4',
    name: 'NASA MUREP Scholarships',
    agency: 'NASA',
    type: 'scholarship',
    amount: 'Up to $10,000/year',
    eligibility: ['US Citizen', 'Minority-serving institution student', 'STEM major'],
    deadline: 'March annually',
    description: 'Scholarships for underrepresented students at minority-serving institutions pursuing NASA-relevant STEM degrees.',
    stemFields: ['Aerospace', 'Computer Science', 'Engineering', 'Physics', 'Mathematics'],
    url: 'https://www.nasa.gov/stem/murep',
    isChipsAct: false,
    competitiveness: 'medium',
  },
  {
    id: '5',
    name: 'CyberCorps: Scholarship for Service',
    agency: 'NSF / DHS',
    type: 'scholarship',
    amount: 'Full tuition + $25,000 stipend',
    eligibility: ['US Citizen', 'Cybersecurity/IT program', 'Commit to federal service'],
    deadline: 'Varies by institution',
    description: 'Full scholarship for cybersecurity studies in exchange for government service equal to scholarship duration.',
    stemFields: ['Cybersecurity', 'Computer Science', 'Information Technology'],
    url: 'https://www.sfs.opm.gov',
    isChipsAct: false,
    competitiveness: 'high',
  },
  {
    id: '6',
    name: 'SMART Scholarship',
    agency: 'Department of Defense',
    type: 'scholarship',
    amount: 'Full tuition + $25,000-$38,000 stipend',
    eligibility: ['US Citizen', 'STEM major', '18+ years old', 'Meet security clearance requirements'],
    deadline: 'December annually',
    description: 'Full ride scholarship for STEM students committed to working for the Department of Defense after graduation.',
    stemFields: ['Engineering', 'Physics', 'Computer Science', 'Mathematics', 'Chemistry'],
    url: 'https://www.smartscholarship.org',
    isChipsAct: false,
    competitiveness: 'high',
  },
  {
    id: '7',
    name: 'Semiconductor Research Corporation (SRC) Scholarships',
    agency: 'Industry Consortium',
    type: 'fellowship',
    amount: 'Up to $48,000/year',
    eligibility: ['Graduate student', 'Semiconductor research focus', 'University partner institution'],
    deadline: 'Varies',
    description: 'Industry-funded research fellowships for graduate students conducting semiconductor research at partner universities.',
    stemFields: ['Electrical Engineering', 'Computer Engineering', 'Materials Science', 'Physics'],
    url: 'https://www.src.org',
    isChipsAct: true,
    competitiveness: 'high',
  },
  {
    id: '8',
    name: 'Intel STEM Scholarships',
    agency: 'Intel Foundation',
    type: 'scholarship',
    amount: '$5,000 - $10,000',
    eligibility: ['Underrepresented groups', 'STEM major', 'Strong academic record'],
    deadline: 'Various',
    description: 'Scholarships for underrepresented students in STEM, particularly those interested in semiconductor and computing fields.',
    stemFields: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'],
    url: 'https://www.intel.com/scholarships',
    isChipsAct: false,
    competitiveness: 'medium',
  },
];

const STEMFundingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'industries' | 'programs' | 'pathways'>('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showChipsOnly, setShowChipsOnly] = useState(false);

  const filteredPrograms = fundingPrograms.filter(program => {
    if (showChipsOnly && !program.isChipsAct) return false;
    if (selectedType && program.type !== selectedType) return false;
    return true;
  });

  const getCompetitivenessColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'text-blue-400 bg-blue-500/20';
      case 'fellowship': return 'text-purple-400 bg-purple-500/20';
      case 'internship': return 'text-emerald-400 bg-emerald-500/20';
      case 'grant': return 'text-orange-400 bg-orange-500/20';
      case 'workforce': return 'text-teal-400 bg-teal-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-8">
      {/* CHIPS Act Hero */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/30 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🇺🇸</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                The CHIPS and Science Act
              </h2>
            </div>
            <p className="text-gray-300 mb-6">
              The largest investment in American technology manufacturing in history.
              <span className="text-blue-400 font-semibold"> $280 billion</span> to strengthen
              U.S. semiconductor manufacturing, research, and workforce development.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">$52.7B</div>
                <div className="text-xs text-gray-400">Manufacturing</div>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">$13B</div>
                <div className="text-xs text-gray-400">R&D</div>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">$3B</div>
                <div className="text-xs text-gray-400">Workforce</div>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">100K+</div>
                <div className="text-xs text-gray-400">New Jobs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="text-3xl mb-4">🎓</div>
          <h3 className="text-lg font-bold text-white mb-2">Education Funding</h3>
          <p className="text-gray-400 text-sm">
            Billions allocated for STEM education at all levels - from community college
            programs to doctoral research fellowships.
          </p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="text-3xl mb-4">💼</div>
          <h3 className="text-lg font-bold text-white mb-2">Career Opportunities</h3>
          <p className="text-gray-400 text-sm">
            Major companies are building new fabs and R&D centers across the US,
            creating unprecedented demand for STEM talent.
          </p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="text-3xl mb-4">🚀</div>
          <h3 className="text-lg font-bold text-white mb-2">Future-Proof Skills</h3>
          <p className="text-gray-400 text-sm">
            Semiconductor and AI skills will power everything from smartphones
            to self-driving cars to quantum computers.
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">The Opportunity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">$80K</div>
            <div className="text-sm text-gray-400">Average starting salary for chip engineers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">40+</div>
            <div className="text-sm text-gray-400">New fab facilities planned in the US</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">15K</div>
            <div className="text-sm text-gray-400">Engineers needed per new fab</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">2:1</div>
            <div className="text-sm text-gray-400">Job openings vs. qualified candidates</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setActiveTab('industries')}
          className="bg-dark-card border border-dark-border rounded-xl p-6 text-left hover:border-blue-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Explore Industries</h3>
              <p className="text-gray-400 text-sm">See which CHIPS Act sectors match your interests</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
        <button
          onClick={() => { setActiveTab('programs'); setShowChipsOnly(true); }}
          className="bg-dark-card border border-dark-border rounded-xl p-6 text-left hover:border-purple-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Find Funding</h3>
              <p className="text-gray-400 text-sm">Browse scholarships, fellowships, and programs</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>
    </div>
  );

  // Render industries tab
  const renderIndustries = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">CHIPS Act Industries</h2>
        <p className="text-gray-400">Explore the sectors receiving billions in federal investment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chipsIndustries.map(industry => (
          <motion.div
            key={industry.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-dark-card border rounded-xl overflow-hidden cursor-pointer transition-all ${
              selectedIndustry === industry.id
                ? 'border-blue-500'
                : 'border-dark-border hover:border-gray-600'
            }`}
            onClick={() => setSelectedIndustry(selectedIndustry === industry.id ? null : industry.id)}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{industry.icon}</span>
                <h3 className="text-lg font-bold text-white">{industry.name}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">{industry.description}</p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-dark-bg rounded-lg p-2">
                  <div className="text-sm font-bold text-blue-400">{industry.chipsActFunding}</div>
                  <div className="text-xs text-gray-500">Funding</div>
                </div>
                <div className="bg-dark-bg rounded-lg p-2">
                  <div className="text-sm font-bold text-emerald-400">{industry.jobGrowth}</div>
                  <div className="text-xs text-gray-500">Growth</div>
                </div>
                <div className="bg-dark-bg rounded-lg p-2">
                  <div className="text-sm font-bold text-purple-400">{industry.avgSalary}</div>
                  <div className="text-xs text-gray-500">Avg Salary</div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {selectedIndustry === industry.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-dark-border overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Key Employers</div>
                      <div className="flex flex-wrap gap-2">
                        {industry.keyEmployers.map(emp => (
                          <span key={emp} className="px-2 py-1 bg-dark-bg rounded-full text-xs text-gray-300">
                            {emp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Hot Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {industry.hotSkills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render programs tab
  const renderPrograms = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="chipsOnly"
              checked={showChipsOnly}
              onChange={(e) => setShowChipsOnly(e.target.checked)}
              className="w-4 h-4 rounded border-dark-border bg-dark-bg text-blue-500"
            />
            <label htmlFor="chipsOnly" className="text-sm text-gray-300">CHIPS Act funded only</label>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'scholarship', 'fellowship', 'internship', 'workforce'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type === 'all' ? null : type)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  (type === 'all' && !selectedType) || selectedType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-dark-bg text-gray-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </button>
            ))}
          </div>

          <div className="ml-auto text-sm text-gray-400">
            {filteredPrograms.length} programs
          </div>
        </div>
      </div>

      {/* Programs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrograms.map(program => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(program.type)}`}>
                      {program.type}
                    </span>
                    {program.isChipsAct && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        CHIPS Act
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{program.name}</h3>
                  <div className="text-sm text-gray-400">{program.agency}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getCompetitivenessColor(program.competitiveness)}`}>
                  {program.competitiveness} competition
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4">{program.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-dark-bg rounded-lg p-3">
                  <div className="text-xs text-gray-400">Award</div>
                  <div className="font-semibold text-emerald-400">{program.amount}</div>
                </div>
                <div className="bg-dark-bg rounded-lg p-3">
                  <div className="text-xs text-gray-400">Deadline</div>
                  <div className="font-semibold text-white">{program.deadline}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Eligibility</div>
                <ul className="space-y-1">
                  {program.eligibility.map((req, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">STEM Fields</div>
                <div className="flex flex-wrap gap-2">
                  {program.stemFields.slice(0, 4).map(field => (
                    <span key={field} className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-300">
                      {field}
                    </span>
                  ))}
                  {program.stemFields.length > 4 && (
                    <span className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-500">
                      +{program.stemFields.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-dark-border bg-dark-bg/50">
              <a
                href={program.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 text-center bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
              >
                Learn More & Apply →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render pathways tab
  const renderPathways = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Career Pathways</h2>
        <p className="text-gray-400">Multiple routes to a CHIPS Act career</p>
      </div>

      {/* Pathway cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🎓</div>
          <h3 className="text-lg font-bold text-white mb-3">Traditional 4-Year Path</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
              <span>Bachelor's in EE/CS/Physics/MatSci</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
              <span>Summer internships at fabs/labs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
              <span>Full-time entry (optional MS/PhD)</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-500/30">
            <div className="text-xs text-gray-400">Starting Salary</div>
            <div className="text-lg font-bold text-blue-400">$75K - $100K</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🔧</div>
          <h3 className="text-lg font-bold text-white mb-3">Community College Path</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
              <span>2-year semiconductor technician degree</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
              <span>Industry certifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
              <span>Entry as fab technician</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-500/30">
            <div className="text-xs text-gray-400">Starting Salary</div>
            <div className="text-lg font-bold text-emerald-400">$50K - $70K</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🔬</div>
          <h3 className="text-lg font-bold text-white mb-3">Research Path</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
              <span>PhD in relevant field</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
              <span>National lab internships</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
              <span>R&D or faculty position</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-500/30">
            <div className="text-xs text-gray-400">Starting Salary</div>
            <div className="text-lg font-bold text-purple-400">$100K - $150K</div>
          </div>
        </div>
      </div>

      {/* Regional hubs */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Major CHIPS Act Investment Regions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { region: 'Arizona', investment: '$40B+', companies: 'TSMC, Intel', status: 'Active' },
            { region: 'Ohio', investment: '$20B+', companies: 'Intel', status: 'Under Construction' },
            { region: 'Texas', investment: '$25B+', companies: 'Samsung, TI', status: 'Active' },
            { region: 'New York', investment: '$100B+', companies: 'Micron', status: 'Planned' },
            { region: 'Oregon', investment: '$30B+', companies: 'Intel', status: 'Active' },
            { region: 'Idaho', investment: '$15B+', companies: 'Micron', status: 'Expanding' },
            { region: 'Vermont', investment: '$3B+', companies: 'GlobalFoundries', status: 'Active' },
            { region: 'New Mexico', investment: '$5B+', companies: 'Intel', status: 'Active' },
          ].map(hub => (
            <div key={hub.region} className="bg-dark-bg rounded-lg p-4">
              <div className="font-semibold text-white">{hub.region}</div>
              <div className="text-sm text-blue-400">{hub.investment}</div>
              <div className="text-xs text-gray-400">{hub.companies}</div>
              <div className="text-xs text-emerald-400 mt-1">{hub.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Get Started Today</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-semibold text-blue-400 mb-2">High School Students</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Take AP Physics, Chemistry, CS</li>
              <li>• Explore FIRST Robotics or Science Olympiad</li>
              <li>• Apply for summer STEM programs</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-purple-400 mb-2">College Students</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Join IEEE or relevant clubs</li>
              <li>• Apply for REU/SULI internships</li>
              <li>• Consider minors in manufacturing</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-400 mb-2">Career Changers</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Explore community college programs</li>
              <li>• Get industry certifications</li>
              <li>• Apply to workforce programs</li>
            </ul>
          </div>
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
            <span>🇺🇸</span>
            <span>Federal STEM Funding</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            CHIPS Act & STEM Funding
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            $280 billion in opportunities. Your path to a high-paying STEM career.
          </motion.p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="inline-flex bg-dark-card border border-dark-border rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'industries', label: 'Industries', icon: '🏭' },
              { id: 'programs', label: 'Programs', icon: '🎓' },
              { id: 'pathways', label: 'Pathways', icon: '🛤️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 md:px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'industries' && renderIndustries()}
        {activeTab === 'programs' && renderPrograms()}
        {activeTab === 'pathways' && renderPathways()}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-dark-card border border-dark-border rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-xl">ℹ️</span>
            <div>
              <h4 className="font-medium text-white mb-1">Stay Updated</h4>
              <p className="text-sm text-gray-400">
                CHIPS Act programs are being rolled out continuously. Check official agency
                websites for the latest opportunities. This page provides an overview of
                available programs but may not include all current opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STEMFundingPage;
