import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  Search,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Shield,
  Award,
  Filter,
} from 'lucide-react';

// ===========================================
// Salary Data - Researched from BLS, Glassdoor, PayScale, ZipRecruiter (2025-2026)
// ===========================================

interface SalaryData {
  role: string;
  industry: string;
  location: string;
  entryLevel: number;
  midLevel: number;
  seniorLevel: number;
  growth: number;
  topMetros: string[];
  topCerts: string[];
  openings: string;
}

const SALARY_DATA: SalaryData[] = [
  {
    role: 'Semiconductor Process Engineer',
    industry: 'Semiconductor',
    location: 'National',
    entryLevel: 79000,
    midLevel: 103000,
    seniorLevel: 145000,
    growth: 10,
    topMetros: ['San Jose, CA', 'Phoenix, AZ', 'Austin, TX', 'Boise, ID'],
    topCerts: ['Six Sigma Black Belt', 'ASQ CQE', 'SEMI Standards'],
    openings: '18K+',
  },
  {
    role: 'Nuclear Engineer',
    industry: 'Nuclear Technologies',
    location: 'National',
    entryLevel: 85000,
    midLevel: 118000,
    seniorLevel: 166000,
    growth: 5,
    topMetros: ['Oak Ridge, TN', 'Aiken, SC', 'Idaho Falls, ID', 'Richland, WA'],
    topCerts: ['PE License (Nuclear)', 'NRC Operator License', 'CHP'],
    openings: '3.8K',
  },
  {
    role: 'AI/ML Engineer',
    industry: 'AI & Machine Learning',
    location: 'National',
    entryLevel: 115000,
    midLevel: 150000,
    seniorLevel: 204000,
    growth: 17,
    topMetros: ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'McLean, VA'],
    topCerts: ['AWS ML Specialty', 'Google Professional ML Engineer', 'TensorFlow Developer'],
    openings: '49K+',
  },
  {
    role: 'Quantum Computing Researcher',
    industry: 'Quantum Technologies',
    location: 'National',
    entryLevel: 110000,
    midLevel: 149000,
    seniorLevel: 205000,
    growth: 12,
    topMetros: ['Boulder, CO', 'Cambridge, MA', 'San Jose, CA', 'College Park, MD'],
    topCerts: ['PhD (Preferred)', 'IBM Quantum Certifications', 'Qiskit Proficiency'],
    openings: '2.1K',
  },
  {
    role: 'Cybersecurity Analyst',
    industry: 'Cybersecurity',
    location: 'National',
    entryLevel: 82000,
    midLevel: 120000,
    seniorLevel: 175000,
    growth: 29,
    topMetros: ['Washington, DC', 'San Francisco, CA', 'New York, NY', 'Dallas, TX'],
    topCerts: ['CISSP', 'CompTIA Security+', 'CISM', 'CEH'],
    openings: '457K',
  },
  {
    role: 'Aerospace Systems Engineer',
    industry: 'Aerospace & Defense',
    location: 'National',
    entryLevel: 81000,
    midLevel: 110000,
    seniorLevel: 155000,
    growth: 5,
    topMetros: ['Huntsville, AL', 'El Segundo, CA', 'Seattle, WA', 'Colorado Springs, CO'],
    topCerts: ['PE License (Aerospace)', 'INCOSE SEP', 'PMP', 'TS/SCI Clearance'],
    openings: '8.5K',
  },
  {
    role: 'Biotechnology Research Scientist',
    industry: 'Biotechnology',
    location: 'National',
    entryLevel: 80000,
    midLevel: 111000,
    seniorLevel: 155000,
    growth: 7,
    topMetros: ['Cambridge, MA', 'South SF, CA', 'San Diego, CA', 'Raleigh, NC'],
    topCerts: ['PhD', 'RAC Certification', 'ASQ Biomedical Auditor'],
    openings: '6.2K',
  },
  {
    role: 'Robotics Engineer',
    industry: 'Robotics & Automation',
    location: 'National',
    entryLevel: 95000,
    midLevel: 130000,
    seniorLevel: 172000,
    growth: 9,
    topMetros: ['San Jose, CA', 'Boston, MA', 'Pittsburgh, PA', 'Detroit, MI'],
    topCerts: ['ROS Certifications', 'CAP', 'FANUC/ABB Vendor Certs', 'Six Sigma'],
    openings: '5.4K',
  },
  {
    role: 'Clean Energy Specialist',
    industry: 'Clean Energy',
    location: 'National',
    entryLevel: 78000,
    midLevel: 113000,
    seniorLevel: 155000,
    growth: 9,
    topMetros: ['Denver, CO', 'Austin, TX', 'San Francisco, CA', 'Phoenix, AZ'],
    topCerts: ['PE License', 'NABCEP (Solar)', 'LEED AP', 'CEM'],
    openings: '11K+',
  },
  {
    role: 'Data Scientist',
    industry: 'AI & Machine Learning',
    location: 'National',
    entryLevel: 95000,
    midLevel: 138000,
    seniorLevel: 175000,
    growth: 35,
    topMetros: ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX'],
    topCerts: ['AWS Data Analytics', 'Google Data Engineer', 'Databricks Certified'],
    openings: '136K',
  },
  {
    role: 'National Lab Research Scientist',
    industry: 'National Labs',
    location: 'National',
    entryLevel: 118000,
    midLevel: 131000,
    seniorLevel: 190000,
    growth: 5,
    topMetros: ['Livermore, CA', 'Los Alamos, NM', 'Oak Ridge, TN', 'Lemont, IL'],
    topCerts: ['PhD (Required)', 'Q/L Clearance', 'Published Research Record'],
    openings: '4.2K',
  },
  {
    role: 'Manufacturing Engineer (Advanced)',
    industry: 'Advanced Manufacturing',
    location: 'National',
    entryLevel: 72000,
    midLevel: 96000,
    seniorLevel: 136000,
    growth: 6,
    topMetros: ['Detroit, MI', 'Phoenix, AZ', 'Dallas, TX', 'Columbus, OH'],
    topCerts: ['PE License', 'Six Sigma Black Belt', 'CMfgE (SME)', 'ASQ CQE'],
    openings: '9.1K',
  },
];

const INDUSTRIES = ['All Industries', 'Semiconductor', 'Nuclear Technologies', 'AI & Machine Learning', 'Quantum Technologies', 'Cybersecurity', 'Aerospace & Defense', 'Biotechnology', 'Robotics & Automation', 'Clean Energy', 'National Labs', 'Advanced Manufacturing'];

const LOCATIONS = [
  { value: 'national', label: 'National Average', multiplier: 1.0 },
  { value: 'sf-bay', label: 'SF Bay Area (+32%)', multiplier: 1.32 },
  { value: 'dc-metro', label: 'DC Metro (+18%)', multiplier: 1.18 },
  { value: 'seattle', label: 'Seattle (+15%)', multiplier: 1.15 },
  { value: 'boston', label: 'Boston (+12%)', multiplier: 1.12 },
  { value: 'austin', label: 'Austin, TX (+8%)', multiplier: 1.08 },
  { value: 'raleigh', label: 'Raleigh-Durham (+2%)', multiplier: 1.02 },
  { value: 'albuquerque', label: 'Albuquerque, NM (-5%)', multiplier: 0.95 },
];

const formatSalary = (amount: number) => `$${(amount / 1000).toFixed(0)}K`;
const formatSalaryFull = (amount: number) => `$${amount.toLocaleString()}`;

export default function SalaryInsightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedLocation, setSelectedLocation] = useState('national');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const locationMultiplier = LOCATIONS.find(l => l.value === selectedLocation)?.multiplier || 1.0;

  const filtered = SALARY_DATA.filter(item => {
    const matchesSearch = !searchTerm ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All Industries' || item.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const applyLocation = (amount: number) => Math.round(amount * locationMultiplier);

  const avgEntry = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + applyLocation(d.entryLevel), 0) / filtered.length) : 0;
  const avgMid = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + applyLocation(d.midLevel), 0) / filtered.length) : 0;
  const avgSenior = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + applyLocation(d.seniorLevel), 0) / filtered.length) : 0;
  const avgGrowth = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + d.growth, 0) / filtered.length) : 0;

  const maxSalary = 250000;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold">Salary Insights</h1>
          </div>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Compensation data for STEM roles across emerging technology sectors. Understand your market value by role, experience level, location, and clearance status.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Data sourced from BLS, Glassdoor, PayScale, and industry surveys. Updated quarterly.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {LOCATIONS.map(loc => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <DollarSign size={14} />
              Avg Entry Level
            </div>
            <div className="text-2xl font-bold text-emerald-400">{formatSalary(avgEntry)}</div>
            <div className="text-xs text-slate-500 mt-1">0-2 years experience</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Briefcase size={14} />
              Avg Mid Level
            </div>
            <div className="text-2xl font-bold text-blue-400">{formatSalary(avgMid)}</div>
            <div className="text-xs text-slate-500 mt-1">3-7 years experience</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <BarChart3 size={14} />
              Avg Senior Level
            </div>
            <div className="text-2xl font-bold text-purple-400">{formatSalary(avgSenior)}</div>
            <div className="text-xs text-slate-500 mt-1">8+ years experience</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <TrendingUp size={14} />
              Avg Projected Growth
            </div>
            <div className="text-2xl font-bold text-amber-400">{avgGrowth}%</div>
            <div className="text-xs text-slate-500 mt-1">vs. 2.7% non-STEM avg</div>
          </div>
        </div>

        {/* STEM vs Non-STEM Callout */}
        <div className="mb-10 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold">STEM Salary Premium</h3>
              <p className="text-sm text-slate-400 mt-1">STEM workers earn more than double the national median wage</p>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">$103,580</div>
                <div className="text-xs text-slate-400">Median STEM Wage</div>
              </div>
              <div className="text-slate-600 flex items-center text-2xl">vs</div>
              <div>
                <div className="text-2xl font-bold text-slate-500">$48,000</div>
                <div className="text-xs text-slate-400">Median Non-STEM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">2.16x</div>
                <div className="text-xs text-slate-400">Premium</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-600 mt-3">Source: Bureau of Labor Statistics, 2024</div>
        </div>

        {/* Salary Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              {filtered.length} roles {selectedIndustry !== 'All Industries' ? `in ${selectedIndustry}` : ''}
              {selectedLocation !== 'national' ? ` (${LOCATIONS.find(l => l.value === selectedLocation)?.label})` : ''}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Industry</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Entry</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Mid</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Senior</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Growth</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Openings</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <>
                    <tr
                      key={item.role}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer"
                      onClick={() => setExpandedRole(expandedRole === item.role ? null : item.role)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{item.role}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{item.industry}</td>
                      <td className="px-6 py-4 text-right text-sm text-emerald-400">{formatSalary(applyLocation(item.entryLevel))}</td>
                      <td className="px-6 py-4 text-right text-sm text-blue-400">{formatSalary(applyLocation(item.midLevel))}</td>
                      <td className="px-6 py-4 text-right text-sm text-purple-400">{formatSalary(applyLocation(item.seniorLevel))}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm ${item.growth >= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {item.growth >= 10 ? <ArrowUp size={12} /> : item.growth >= 5 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          {item.growth}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-300">{item.openings}</td>
                    </tr>
                    {expandedRole === item.role && (
                      <tr key={`${item.role}-detail`} className="border-b border-slate-800/50 bg-slate-800/20">
                        <td colSpan={7} className="px-6 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Salary Range Visual */}
                            <div>
                              <h4 className="text-sm font-medium text-slate-300 mb-3">Salary Range</h4>
                              <div className="space-y-3">
                                {[
                                  { label: 'Entry', value: applyLocation(item.entryLevel), color: 'bg-emerald-500' },
                                  { label: 'Mid', value: applyLocation(item.midLevel), color: 'bg-blue-500' },
                                  { label: 'Senior', value: applyLocation(item.seniorLevel), color: 'bg-purple-500' },
                                ].map(level => (
                                  <div key={level.label}>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-slate-400">{level.label}</span>
                                      <span className="text-slate-300">{formatSalaryFull(level.value)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${level.color} rounded-full`}
                                        style={{ width: `${(level.value / maxSalary) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top Metros */}
                            <div>
                              <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-1.5">
                                <MapPin size={14} />
                                Top Metro Areas
                              </h4>
                              <div className="space-y-2">
                                {item.topMetros.map(metro => (
                                  <div key={metro} className="text-sm text-slate-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    {metro}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Certifications */}
                            <div>
                              <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-1.5">
                                <Award size={14} />
                                Key Certifications
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {item.topCerts.map(cert => (
                                  <span key={cert} className="px-2.5 py-1 bg-slate-700 rounded-lg text-xs text-slate-300">
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg text-slate-400">No salary data found</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedIndustry('All Industries'); }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Security Clearance Premium */}
        <div className="mt-10 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-amber-400" />
            <h3 className="text-lg font-bold text-amber-400">Security Clearance Salary Premium</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Roles requiring security clearances command significant salary premiums, particularly in aerospace, defense, national labs, and cybersecurity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white">+$8-15K</div>
              <div className="text-sm text-slate-400 mt-1">Secret</div>
              <div className="text-xs text-slate-500">Tier 3 Investigation</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white">+$15-30K</div>
              <div className="text-sm text-slate-400 mt-1">Top Secret</div>
              <div className="text-xs text-slate-500">Tier 5 Investigation</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white">+$25-45K</div>
              <div className="text-sm text-slate-400 mt-1">TS/SCI + Poly</div>
              <div className="text-xs text-slate-500">Full-scope polygraph</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white">+$10-20K</div>
              <div className="text-sm text-slate-400 mt-1">DOE Q Clearance</div>
              <div className="text-xs text-slate-500">National lab roles</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-600">
            Processing times: Secret ~60-150 days, Top Secret ~120-240 days (Trusted Workforce 2.0)
          </div>
        </div>

        {/* Hiring Trends */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <TrendingUp size={16} />
              <h4 className="font-semibold text-sm">Fastest Growing</h4>
            </div>
            <p className="text-xs text-slate-400">Data Scientists (+35%), Cybersecurity Analysts (+29%), and AI/ML Engineers (+17%) show the highest projected growth through 2034.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Briefcase size={16} />
              <h4 className="font-semibold text-sm">Most In-Demand</h4>
            </div>
            <p className="text-xs text-slate-400">Cybersecurity has 457K unfilled U.S. positions. AI talent demand exceeds supply 3.2:1 globally. Semiconductor fabs need 90K+ technicians by 2030.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Award size={16} />
              <h4 className="font-semibold text-sm">Certifications That Pay</h4>
            </div>
            <p className="text-xs text-slate-400">CISSP holders earn 37% more. AWS ML Specialty adds ~20% salary boost. Six Sigma Black Belt is valued across semiconductor and manufacturing.</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
          <p className="text-xs text-slate-500">
            <MapPin size={12} className="inline mr-1" />
            Salary data represents national medians for the United States, adjusted by metro area cost-of-living multiplier when a location filter is applied. Actual compensation varies by employer, company size, specific qualifications, and total compensation package (base + bonus + equity). Data sourced from BLS, Glassdoor, PayScale, ZipRecruiter, and industry surveys. Updated quarterly.
          </p>
        </div>
      </div>
    </div>
  );
}
