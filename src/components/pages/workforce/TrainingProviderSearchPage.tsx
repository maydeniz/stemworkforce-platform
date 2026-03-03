// @ts-nocheck
// ===========================================
// ELIGIBLE TRAINING PROVIDER LIST (ETPL) SEARCH
// Find WIOA-approved training programs and providers
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, MapPin, DollarSign, Clock, Award, Star,
  Building2, GraduationCap, Briefcase, CheckCircle, ChevronRight,
  ChevronDown, ExternalLink, BookOpen, Users, TrendingUp,
  Calendar, Phone, Mail, Globe, Heart, ArrowRight, Info
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface TrainingProvider {
  id: string;
  name: string;
  type: 'community_college' | 'university' | 'technical_school' | 'apprenticeship' | 'online' | 'employer';
  location: { city: string; state: string; address: string };
  programs: TrainingProgram[];
  rating: number;
  reviews: number;
  accreditation: string[];
  wioa_approved: boolean;
  ita_eligible: boolean;
}

interface TrainingProgram {
  id: string;
  name: string;
  credential: string;
  duration: string;
  cost: number;
  itaMax: number;
  occupations: string[];
  completionRate: number;
  employmentRate: number;
  medianWage: number;
  startDates: string[];
  format: 'in_person' | 'online' | 'hybrid';
  inDemand: boolean;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const SAMPLE_PROVIDERS: TrainingProvider[] = [
  {
    id: 'cc-metro',
    name: 'Metro Community College',
    type: 'community_college',
    location: { city: 'Metro City', state: 'State', address: '123 College Ave' },
    rating: 4.7,
    reviews: 342,
    accreditation: ['Regional Accreditation', 'ACBSP', 'ABET'],
    wioa_approved: true,
    ita_eligible: true,
    programs: [
      {
        id: 'cna',
        name: 'Certified Nursing Assistant (CNA)',
        credential: 'State Certificate',
        duration: '8 weeks',
        cost: 1200,
        itaMax: 1200,
        occupations: ['Nursing Assistant', 'Patient Care Tech'],
        completionRate: 92,
        employmentRate: 94,
        medianWage: 32500,
        startDates: ['Feb 1', 'Mar 15', 'May 1'],
        format: 'in_person',
        inDemand: true
      },
      {
        id: 'welding',
        name: 'Welding Technology',
        credential: 'AWS Certification',
        duration: '16 weeks',
        cost: 4500,
        itaMax: 4500,
        occupations: ['Welder', 'Fabricator', 'Pipefitter'],
        completionRate: 88,
        employmentRate: 91,
        medianWage: 48000,
        startDates: ['Jan 15', 'Aug 20'],
        format: 'in_person',
        inDemand: true
      }
    ]
  },
  {
    id: 'tech-institute',
    name: 'Regional Technical Institute',
    type: 'technical_school',
    location: { city: 'Industrial Park', state: 'State', address: '456 Tech Blvd' },
    rating: 4.5,
    reviews: 218,
    accreditation: ['ACCSC', 'CompTIA Authorized'],
    wioa_approved: true,
    ita_eligible: true,
    programs: [
      {
        id: 'cybersec',
        name: 'Cybersecurity Professional',
        credential: 'CompTIA Security+',
        duration: '12 weeks',
        cost: 6500,
        itaMax: 6500,
        occupations: ['Security Analyst', 'SOC Analyst', 'IT Security'],
        completionRate: 85,
        employmentRate: 89,
        medianWage: 72000,
        startDates: ['Monthly Rolling'],
        format: 'hybrid',
        inDemand: true
      },
      {
        id: 'cloud',
        name: 'Cloud Computing (AWS)',
        credential: 'AWS Solutions Architect',
        duration: '10 weeks',
        cost: 5800,
        itaMax: 5800,
        occupations: ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect'],
        completionRate: 82,
        employmentRate: 92,
        medianWage: 95000,
        startDates: ['Feb 10', 'Apr 15', 'Jul 1'],
        format: 'online',
        inDemand: true
      }
    ]
  },
  {
    id: 'healthcare-academy',
    name: 'Healthcare Training Academy',
    type: 'technical_school',
    location: { city: 'Medical District', state: 'State', address: '789 Health Way' },
    rating: 4.8,
    reviews: 456,
    accreditation: ['CAAHEP', 'State Board Approved'],
    wioa_approved: true,
    ita_eligible: true,
    programs: [
      {
        id: 'medical-coding',
        name: 'Medical Coding & Billing',
        credential: 'CPC Certification',
        duration: '20 weeks',
        cost: 5200,
        itaMax: 5200,
        occupations: ['Medical Coder', 'Billing Specialist', 'HIM Tech'],
        completionRate: 90,
        employmentRate: 88,
        medianWage: 52000,
        startDates: ['Jan 8', 'Jun 3', 'Sep 9'],
        format: 'hybrid',
        inDemand: true
      },
      {
        id: 'phlebotomy',
        name: 'Phlebotomy Technician',
        credential: 'CPT Certification',
        duration: '6 weeks',
        cost: 1800,
        itaMax: 1800,
        occupations: ['Phlebotomist', 'Lab Assistant'],
        completionRate: 95,
        employmentRate: 93,
        medianWage: 38000,
        startDates: ['Monthly Rolling'],
        format: 'in_person',
        inDemand: true
      }
    ]
  },
  {
    id: 'trades-union',
    name: 'Building Trades Apprenticeship Center',
    type: 'apprenticeship',
    location: { city: 'Union Hall', state: 'State', address: '321 Labor Lane' },
    rating: 4.9,
    reviews: 189,
    accreditation: ['DOL Registered Apprenticeship', 'NCCER'],
    wioa_approved: true,
    ita_eligible: false,
    programs: [
      {
        id: 'electrical',
        name: 'Electrical Apprenticeship',
        credential: 'Journeyman License',
        duration: '4 years',
        cost: 0,
        itaMax: 0,
        occupations: ['Electrician', 'Electrical Contractor'],
        completionRate: 78,
        employmentRate: 98,
        medianWage: 65000,
        startDates: ['Sep 1 (Annual)'],
        format: 'in_person',
        inDemand: true
      },
      {
        id: 'hvac',
        name: 'HVAC Technician Apprenticeship',
        credential: 'EPA 608, Journeyman',
        duration: '3 years',
        cost: 0,
        itaMax: 0,
        occupations: ['HVAC Technician', 'Refrigeration Tech'],
        completionRate: 82,
        employmentRate: 96,
        medianWage: 55000,
        startDates: ['Sep 1 (Annual)'],
        format: 'in_person',
        inDemand: true
      }
    ]
  },
  {
    id: 'cdl-school',
    name: 'Professional Truck Driving School',
    type: 'technical_school',
    location: { city: 'Transport Hub', state: 'State', address: '555 Highway Dr' },
    rating: 4.4,
    reviews: 312,
    accreditation: ['PTDI Certified', 'State Licensed'],
    wioa_approved: true,
    ita_eligible: true,
    programs: [
      {
        id: 'cdl-a',
        name: 'CDL Class A Training',
        credential: 'CDL Class A License',
        duration: '4 weeks',
        cost: 5500,
        itaMax: 5500,
        occupations: ['Truck Driver', 'OTR Driver', 'Delivery Driver'],
        completionRate: 89,
        employmentRate: 95,
        medianWage: 52000,
        startDates: ['Weekly Rolling'],
        format: 'in_person',
        inDemand: true
      }
    ]
  }
];

const OCCUPATION_CATEGORIES = [
  { id: 'healthcare', name: 'Healthcare', icon: Heart, count: 245 },
  { id: 'it', name: 'Information Technology', icon: Globe, count: 189 },
  { id: 'manufacturing', name: 'Advanced Manufacturing', icon: Building2, count: 156 },
  { id: 'trades', name: 'Skilled Trades', icon: Briefcase, count: 134 },
  { id: 'transportation', name: 'Transportation & Logistics', icon: MapPin, count: 98 },
  { id: 'business', name: 'Business & Office', icon: Users, count: 87 }
];

const CREDENTIAL_TYPES = [
  'Industry Certification',
  'State License',
  'Associate Degree',
  'Certificate',
  'Apprenticeship',
  'Badge/Micro-credential'
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const TrainingProviderSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [maxCost, setMaxCost] = useState<number | null>(null);
  const [onlyInDemand, setOnlyInDemand] = useState(false);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter providers based on search and filters
  const filteredProviders = SAMPLE_PROVIDERS.filter(provider => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = provider.name.toLowerCase().includes(searchLower);
      const matchesProgram = provider.programs.some(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.occupations.some(o => o.toLowerCase().includes(searchLower))
      );
      if (!matchesName && !matchesProgram) return false;
    }
    return true;
  });

  const totalPrograms = SAMPLE_PROVIDERS.reduce((sum, p) => sum + p.programs.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
              <GraduationCap className="w-4 h-4" />
              WIOA-Approved Training
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Find Approved Training Programs
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Search the Eligible Training Provider List (ETPL) for WIOA-approved programs
              that qualify for Individual Training Account (ITA) funding.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by occupation, program, or provider name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900/50 border-b border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Providers:</span>
                <span className="text-white font-medium">{SAMPLE_PROVIDERS.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400">Programs:</span>
                <span className="text-white font-medium">{totalPrograms}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-violet-400" />
                <span className="text-slate-400">ITA Eligible:</span>
                <span className="text-white font-medium">{SAMPLE_PROVIDERS.filter(p => p.ita_eligible).length}</span>
              </div>
            </div>
            <Link
              to="/workforce/ita-funding"
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Learn about ITA funding
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Filter Programs</h3>

              {/* Occupation Category */}
              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-2 block">Occupation Category</label>
                <div className="space-y-2">
                  {OCCUPATION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        {cat.name}
                      </div>
                      <span className="text-xs text-slate-500">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Credential Type */}
              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-2 block">Credential Type</label>
                <select
                  value={selectedCredential || ''}
                  onChange={(e) => setSelectedCredential(e.target.value || null)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                >
                  <option value="">All Credentials</option>
                  {CREDENTIAL_TYPES.map((cred) => (
                    <option key={cred} value={cred}>{cred}</option>
                  ))}
                </select>
              </div>

              {/* Max Cost */}
              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-2 block">Maximum Cost</label>
                <select
                  value={maxCost || ''}
                  onChange={(e) => setMaxCost(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                >
                  <option value="">Any Cost</option>
                  <option value="1000">Under $1,000</option>
                  <option value="3000">Under $3,000</option>
                  <option value="5000">Under $5,000</option>
                  <option value="10000">Under $10,000</option>
                </select>
              </div>

              {/* In-Demand Only */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInDemand}
                    onChange={(e) => setOnlyInDemand(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500"
                  />
                  <span className="text-sm text-slate-300">In-Demand Occupations Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedCredential(null);
                  setMaxCost(null);
                  setOnlyInDemand(false);
                }}
                className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {filteredProviders.length} Training Providers Found
              </h2>
              <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
                <option>Sort by: Best Match</option>
                <option>Sort by: Highest Rated</option>
                <option>Sort by: Lowest Cost</option>
                <option>Sort by: Best Outcomes</option>
              </select>
            </div>

            {/* Provider Cards */}
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
                >
                  {/* Provider Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedProvider(expandedProvider === provider.id ? null : provider.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-lg">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{provider.name}</h3>
                            {provider.wioa_approved && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                WIOA Approved
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {provider.location.city}, {provider.location.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400" />
                              {provider.rating} ({provider.reviews} reviews)
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {provider.programs.length} programs
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedProvider === provider.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Accreditations */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {provider.accreditation.map((acc, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Programs */}
                  {expandedProvider === provider.id && (
                    <div className="border-t border-slate-800 p-6 bg-slate-900/50">
                      <h4 className="font-semibold mb-4">Available Programs</h4>
                      <div className="space-y-4">
                        {provider.programs.map((program) => (
                          <div
                            key={program.id}
                            className="bg-slate-800/50 rounded-xl p-5 border border-slate-700"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-semibold text-white">{program.name}</h5>
                                  {program.inDemand && (
                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                                      In-Demand
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-400">{program.credential}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-white">
                                  {program.cost === 0 ? 'FREE' : `$${program.cost.toLocaleString()}`}
                                </div>
                                {program.itaMax > 0 && (
                                  <div className="text-xs text-emerald-400">
                                    ITA covers up to ${program.itaMax.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <div className="text-xs text-slate-500">Duration</div>
                                <div className="text-sm font-medium flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {program.duration}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Format</div>
                                <div className="text-sm font-medium capitalize">{program.format.replace('_', ' ')}</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Completion Rate</div>
                                <div className="text-sm font-medium text-emerald-400">{program.completionRate}%</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Employment Rate</div>
                                <div className="text-sm font-medium text-emerald-400">{program.employmentRate}%</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                              <div>
                                <span className="text-xs text-slate-500">Median Wage After Training: </span>
                                <span className="text-sm font-medium text-white">${program.medianWage.toLocaleString()}/year</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">Next Start: </span>
                                <span className="text-sm text-emerald-400">{program.startDates[0]}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                              <Link
                                to={`/workforce/program/${program.id}`}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                View Program Details
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                                Compare
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Provider Contact */}
                      <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <a href="#" className="flex items-center gap-1 hover:text-white">
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                          <a href="#" className="flex items-center gap-1 hover:text-white">
                            <Phone className="w-4 h-4" />
                            (555) 123-4567
                          </a>
                          <a href="#" className="flex items-center gap-1 hover:text-white">
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                        </div>
                        <Link
                          to={`/workforce/provider/${provider.id}`}
                          className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          View Full Provider Profile
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing a Training Program?</h2>
          <p className="text-slate-400 mb-6">
            Visit your local American Job Center for free career counseling and assistance
            applying for training funding through WIOA.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/workforce/career-centers"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Find a Career Center
            </Link>
            <Link
              to="/workforce/ita-funding"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors border border-slate-700"
            >
              <DollarSign className="w-4 h-4" />
              Learn About ITA Funding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingProviderSearchPage;
