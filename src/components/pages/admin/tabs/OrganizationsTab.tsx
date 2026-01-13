import React, { useState } from 'react';
import {
  Building2, Search, CheckCircle2, Clock, Eye, Settings,
  XCircle, Plus, Download, Filter, MapPin,
  Users, Globe, Shield, Atom, Cpu, Factory, FlaskConical,
  Landmark, GraduationCap, School, Heart, Rocket,
  Microscope, Briefcase
} from 'lucide-react';

// ===========================================
// ORGANIZATION CATEGORIES
// ===========================================

const ORGANIZATION_CATEGORIES = [
  {
    id: 'all',
    label: 'All Organizations',
    icon: Building2,
    color: 'slate',
    description: 'View all partner organizations'
  },
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    icon: Cpu,
    color: 'violet',
    description: 'AI/ML companies and research organizations',
    parentCategory: 'industry'
  },
  {
    id: 'quantum',
    label: 'Quantum Technologies',
    icon: Atom,
    color: 'cyan',
    description: 'Quantum technology and computing companies',
    parentCategory: 'industry'
  },
  {
    id: 'manufacturing',
    label: 'Advanced Manufacturing',
    icon: Factory,
    color: 'orange',
    description: 'Semiconductor, robotics, and advanced manufacturing',
    parentCategory: 'industry'
  },
  {
    id: 'biotech',
    label: 'Biotechnology',
    icon: FlaskConical,
    color: 'emerald',
    description: 'Biotech and life sciences companies',
    parentCategory: 'industry'
  },
  {
    id: 'aerospace',
    label: 'Aerospace & Defense',
    icon: Rocket,
    color: 'blue',
    description: 'Aerospace, defense, and space technology',
    parentCategory: 'industry'
  },
  {
    id: 'national_labs',
    label: 'National Labs',
    icon: Microscope,
    color: 'amber',
    description: 'DOE national laboratories and research facilities'
  },
  {
    id: 'federal',
    label: 'Federal Agencies',
    icon: Landmark,
    color: 'red',
    description: 'Government agencies and federal departments'
  },
  {
    id: 'universities',
    label: 'Universities',
    icon: GraduationCap,
    color: 'purple',
    description: 'Research universities and 4-year institutions'
  },
  {
    id: 'community_colleges',
    label: 'Community Colleges',
    icon: School,
    color: 'teal',
    description: 'Community and technical colleges'
  },
  {
    id: 'nonprofits',
    label: 'Non-Profits',
    icon: Heart,
    color: 'pink',
    description: 'Non-profit organizations and foundations'
  },
];

// ===========================================
// SAMPLE ORGANIZATION DATA
// ===========================================

const SAMPLE_ORGANIZATIONS = [
  // AI Companies
  { id: '1', name: 'OpenAI', type: 'ai', category: 'ai', industry: 'AI & Machine Learning', city: 'San Francisco', state: 'CA', verified: true, clearance_sponsor: false, employees: '1000+', website: 'openai.com', description: 'AI research and deployment company' },
  { id: '2', name: 'Anthropic', type: 'ai', category: 'ai', industry: 'AI & Machine Learning', city: 'San Francisco', state: 'CA', verified: true, clearance_sponsor: false, employees: '500+', website: 'anthropic.com', description: 'AI safety research company' },
  { id: '3', name: 'DeepMind', type: 'ai', category: 'ai', industry: 'AI & Machine Learning', city: 'Mountain View', state: 'CA', verified: true, clearance_sponsor: false, employees: '1000+', website: 'deepmind.com', description: 'AI research laboratory' },
  { id: '4', name: 'NVIDIA AI Research', type: 'ai', category: 'ai', industry: 'AI & Machine Learning', city: 'Santa Clara', state: 'CA', verified: true, clearance_sponsor: true, employees: '5000+', website: 'nvidia.com', description: 'GPU and AI computing company' },

  // Quantum Companies
  { id: '5', name: 'IBM Quantum', type: 'quantum', category: 'quantum', industry: 'Quantum Technologies', city: 'Yorktown Heights', state: 'NY', verified: true, clearance_sponsor: true, employees: '500+', website: 'ibm.com/quantum', description: 'Quantum computing division of IBM' },
  { id: '6', name: 'IonQ', type: 'quantum', category: 'quantum', industry: 'Quantum Technologies', city: 'College Park', state: 'MD', verified: true, clearance_sponsor: true, employees: '200+', website: 'ionq.com', description: 'Trapped ion quantum computing company' },
  { id: '7', name: 'Rigetti Computing', type: 'quantum', category: 'quantum', industry: 'Quantum Technologies', city: 'Berkeley', state: 'CA', verified: true, clearance_sponsor: false, employees: '150+', website: 'rigetti.com', description: 'Full-stack quantum computing company' },
  { id: '8', name: 'D-Wave Systems', type: 'quantum', category: 'quantum', industry: 'Quantum Technologies', city: 'Burnaby', state: 'BC', verified: true, clearance_sponsor: false, employees: '200+', website: 'dwavesys.com', description: 'Quantum annealing systems' },

  // Advanced Manufacturing
  { id: '9', name: 'Intel Corporation', type: 'manufacturing', category: 'manufacturing', industry: 'Semiconductors', city: 'Santa Clara', state: 'CA', verified: true, clearance_sponsor: true, employees: '100000+', website: 'intel.com', description: 'Semiconductor manufacturing company' },
  { id: '10', name: 'TSMC Arizona', type: 'manufacturing', category: 'manufacturing', industry: 'Semiconductors', city: 'Phoenix', state: 'AZ', verified: true, clearance_sponsor: true, employees: '2000+', website: 'tsmc.com', description: 'Advanced semiconductor foundry' },
  { id: '11', name: 'Applied Materials', type: 'manufacturing', category: 'manufacturing', industry: 'Semiconductor Equipment', city: 'Santa Clara', state: 'CA', verified: true, clearance_sponsor: true, employees: '30000+', website: 'appliedmaterials.com', description: 'Semiconductor manufacturing equipment' },
  { id: '12', name: 'Boston Dynamics', type: 'manufacturing', category: 'manufacturing', industry: 'Robotics', city: 'Waltham', state: 'MA', verified: true, clearance_sponsor: false, employees: '500+', website: 'bostondynamics.com', description: 'Advanced robotics company' },

  // Biotechnology
  { id: '13', name: 'Genentech', type: 'biotech', category: 'biotech', industry: 'Biotechnology', city: 'South San Francisco', state: 'CA', verified: true, clearance_sponsor: false, employees: '10000+', website: 'gene.com', description: 'Biotechnology pioneer company' },
  { id: '14', name: 'Moderna', type: 'biotech', category: 'biotech', industry: 'Biotechnology', city: 'Cambridge', state: 'MA', verified: true, clearance_sponsor: false, employees: '3000+', website: 'modernatx.com', description: 'mRNA therapeutics company' },
  { id: '15', name: 'Illumina', type: 'biotech', category: 'biotech', industry: 'Genomics', city: 'San Diego', state: 'CA', verified: true, clearance_sponsor: false, employees: '8000+', website: 'illumina.com', description: 'DNA sequencing and array technologies' },

  // Aerospace & Defense
  { id: '16', name: 'SpaceX', type: 'aerospace', category: 'aerospace', industry: 'Aerospace', city: 'Hawthorne', state: 'CA', verified: true, clearance_sponsor: true, employees: '10000+', website: 'spacex.com', description: 'Space exploration company' },
  { id: '17', name: 'Lockheed Martin', type: 'aerospace', category: 'aerospace', industry: 'Defense', city: 'Bethesda', state: 'MD', verified: true, clearance_sponsor: true, employees: '100000+', website: 'lockheedmartin.com', description: 'Aerospace and defense company' },
  { id: '18', name: 'Northrop Grumman', type: 'aerospace', category: 'aerospace', industry: 'Defense', city: 'Falls Church', state: 'VA', verified: true, clearance_sponsor: true, employees: '90000+', website: 'northropgrumman.com', description: 'Global aerospace and defense' },
  { id: '19', name: 'Blue Origin', type: 'aerospace', category: 'aerospace', industry: 'Aerospace', city: 'Kent', state: 'WA', verified: true, clearance_sponsor: true, employees: '5000+', website: 'blueorigin.com', description: 'Space exploration and development' },

  // National Labs
  { id: '20', name: 'Los Alamos National Laboratory', type: 'national_labs', category: 'national_labs', industry: 'Research', city: 'Los Alamos', state: 'NM', verified: true, clearance_sponsor: true, employees: '14000+', website: 'lanl.gov', description: 'DOE national security laboratory' },
  { id: '21', name: 'Lawrence Livermore National Laboratory', type: 'national_labs', category: 'national_labs', industry: 'Research', city: 'Livermore', state: 'CA', verified: true, clearance_sponsor: true, employees: '8000+', website: 'llnl.gov', description: 'DOE nuclear security laboratory' },
  { id: '22', name: 'Sandia National Laboratories', type: 'national_labs', category: 'national_labs', industry: 'Research', city: 'Albuquerque', state: 'NM', verified: true, clearance_sponsor: true, employees: '15000+', website: 'sandia.gov', description: 'DOE engineering laboratory' },
  { id: '23', name: 'Oak Ridge National Laboratory', type: 'national_labs', category: 'national_labs', industry: 'Research', city: 'Oak Ridge', state: 'TN', verified: true, clearance_sponsor: true, employees: '6000+', website: 'ornl.gov', description: 'DOE science and energy laboratory' },
  { id: '24', name: 'Argonne National Laboratory', type: 'national_labs', category: 'national_labs', industry: 'Research', city: 'Lemont', state: 'IL', verified: true, clearance_sponsor: true, employees: '3500+', website: 'anl.gov', description: 'DOE multidisciplinary research' },
  { id: '25', name: 'Brookhaven National Laboratory', type: 'national_labs', category: 'national_labs', industry: 'Research', city: 'Upton', state: 'NY', verified: true, clearance_sponsor: true, employees: '3000+', website: 'bnl.gov', description: 'DOE nuclear and particle physics' },

  // Federal Agencies
  { id: '26', name: 'NASA', type: 'federal', category: 'federal', industry: 'Space Agency', city: 'Washington', state: 'DC', verified: true, clearance_sponsor: true, employees: '18000+', website: 'nasa.gov', description: 'National Aeronautics and Space Administration' },
  { id: '27', name: 'NSF', type: 'federal', category: 'federal', industry: 'Science Foundation', city: 'Alexandria', state: 'VA', verified: true, clearance_sponsor: true, employees: '2000+', website: 'nsf.gov', description: 'National Science Foundation' },
  { id: '28', name: 'DARPA', type: 'federal', category: 'federal', industry: 'Defense Research', city: 'Arlington', state: 'VA', verified: true, clearance_sponsor: true, employees: '220+', website: 'darpa.mil', description: 'Defense Advanced Research Projects Agency' },
  { id: '29', name: 'NIH', type: 'federal', category: 'federal', industry: 'Health Research', city: 'Bethesda', state: 'MD', verified: true, clearance_sponsor: true, employees: '20000+', website: 'nih.gov', description: 'National Institutes of Health' },
  { id: '30', name: 'DOE', type: 'federal', category: 'federal', industry: 'Energy', city: 'Washington', state: 'DC', verified: true, clearance_sponsor: true, employees: '14000+', website: 'energy.gov', description: 'Department of Energy' },

  // Universities
  { id: '31', name: 'MIT', type: 'universities', category: 'universities', industry: 'Higher Education', city: 'Cambridge', state: 'MA', verified: true, clearance_sponsor: true, employees: '12000+', website: 'mit.edu', description: 'Massachusetts Institute of Technology' },
  { id: '32', name: 'Stanford University', type: 'universities', category: 'universities', industry: 'Higher Education', city: 'Stanford', state: 'CA', verified: true, clearance_sponsor: true, employees: '15000+', website: 'stanford.edu', description: 'Leading research university' },
  { id: '33', name: 'Caltech', type: 'universities', category: 'universities', industry: 'Higher Education', city: 'Pasadena', state: 'CA', verified: true, clearance_sponsor: true, employees: '3000+', website: 'caltech.edu', description: 'California Institute of Technology' },
  { id: '34', name: 'Georgia Tech', type: 'universities', category: 'universities', industry: 'Higher Education', city: 'Atlanta', state: 'GA', verified: true, clearance_sponsor: true, employees: '10000+', website: 'gatech.edu', description: 'Georgia Institute of Technology' },
  { id: '35', name: 'Carnegie Mellon University', type: 'universities', category: 'universities', industry: 'Higher Education', city: 'Pittsburgh', state: 'PA', verified: true, clearance_sponsor: true, employees: '8000+', website: 'cmu.edu', description: 'Leading tech and AI research university' },
  { id: '36', name: 'UC Berkeley', type: 'universities', category: 'universities', industry: 'Higher Education', city: 'Berkeley', state: 'CA', verified: true, clearance_sponsor: true, employees: '14000+', website: 'berkeley.edu', description: 'University of California, Berkeley' },

  // Community Colleges
  { id: '37', name: 'Northern Virginia Community College', type: 'community_colleges', category: 'community_colleges', industry: 'Higher Education', city: 'Annandale', state: 'VA', verified: true, clearance_sponsor: false, employees: '2000+', website: 'nvcc.edu', description: 'Largest community college in Virginia' },
  { id: '38', name: 'Houston Community College', type: 'community_colleges', category: 'community_colleges', industry: 'Higher Education', city: 'Houston', state: 'TX', verified: true, clearance_sponsor: false, employees: '3500+', website: 'hccs.edu', description: 'Technical and workforce training' },
  { id: '39', name: 'Maricopa Community Colleges', type: 'community_colleges', category: 'community_colleges', industry: 'Higher Education', city: 'Phoenix', state: 'AZ', verified: true, clearance_sponsor: false, employees: '9000+', website: 'maricopa.edu', description: 'Largest community college district' },
  { id: '40', name: 'Austin Community College', type: 'community_colleges', category: 'community_colleges', industry: 'Higher Education', city: 'Austin', state: 'TX', verified: true, clearance_sponsor: false, employees: '2500+', website: 'austincc.edu', description: 'Tech-focused community college' },

  // Non-Profits
  { id: '41', name: 'FIRST Robotics', type: 'nonprofits', category: 'nonprofits', industry: 'STEM Education', city: 'Manchester', state: 'NH', verified: true, clearance_sponsor: false, employees: '500+', website: 'firstinspires.org', description: 'Youth robotics competition organization' },
  { id: '42', name: 'Girls Who Code', type: 'nonprofits', category: 'nonprofits', industry: 'STEM Education', city: 'New York', state: 'NY', verified: true, clearance_sponsor: false, employees: '200+', website: 'girlswhocode.com', description: 'Closing the gender gap in tech' },
  { id: '43', name: 'Code.org', type: 'nonprofits', category: 'nonprofits', industry: 'STEM Education', city: 'Seattle', state: 'WA', verified: true, clearance_sponsor: false, employees: '150+', website: 'code.org', description: 'Expanding access to computer science' },
  { id: '44', name: 'STEM Education Foundation', type: 'nonprofits', category: 'nonprofits', industry: 'STEM Education', city: 'Washington', state: 'DC', verified: true, clearance_sponsor: false, employees: '50+', website: 'stemed.org', description: 'Supporting STEM education initiatives' },
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const OrganizationsTab: React.FC = () => {
  const [organizations] = useState(SAMPLE_ORGANIZATIONS);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter organizations based on search and category
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || org.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category counts
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return organizations.length;
    return organizations.filter(org => org.category === categoryId).length;
  };

  // Get color classes for category
  const getCategoryColor = (color: string, isSelected: boolean) => {
    const colors: Record<string, { bg: string; text: string; border: string; selectedBg: string }> = {
      slate: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', selectedBg: 'bg-slate-500/20' },
      violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', selectedBg: 'bg-violet-500/20' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', selectedBg: 'bg-cyan-500/20' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', selectedBg: 'bg-orange-500/20' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', selectedBg: 'bg-emerald-500/20' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', selectedBg: 'bg-blue-500/20' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', selectedBg: 'bg-amber-500/20' },
      red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', selectedBg: 'bg-red-500/20' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', selectedBg: 'bg-purple-500/20' },
      teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', selectedBg: 'bg-teal-500/20' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', selectedBg: 'bg-pink-500/20' },
    };
    const colorSet = colors[color] || colors.slate;
    return isSelected
      ? `${colorSet.selectedBg} ${colorSet.text} border ${colorSet.border}`
      : `${colorSet.bg} ${colorSet.text} hover:${colorSet.selectedBg}`;
  };

  // Get icon color class
  const getIconColorClass = (color: string) => {
    const iconColors: Record<string, string> = {
      slate: 'text-slate-400',
      violet: 'text-violet-400',
      cyan: 'text-cyan-400',
      orange: 'text-orange-400',
      emerald: 'text-emerald-400',
      blue: 'text-blue-400',
      amber: 'text-amber-400',
      red: 'text-red-400',
      purple: 'text-purple-400',
      teal: 'text-teal-400',
      pink: 'text-pink-400',
    };
    return iconColors[color] || 'text-slate-400';
  };

  // Get gradient for organization card
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      ai: 'from-violet-500 to-purple-500',
      quantum: 'from-cyan-500 to-blue-500',
      manufacturing: 'from-orange-500 to-amber-500',
      biotech: 'from-emerald-500 to-green-500',
      aerospace: 'from-blue-500 to-indigo-500',
      national_labs: 'from-amber-500 to-yellow-500',
      federal: 'from-red-500 to-rose-500',
      universities: 'from-purple-500 to-violet-500',
      community_colleges: 'from-teal-500 to-cyan-500',
      nonprofits: 'from-pink-500 to-rose-500',
    };
    return gradients[category] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-400">Filter by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ORGANIZATION_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            const CategoryIcon = category.icon;
            const count = getCategoryCount(category.id);

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${getCategoryColor(category.color, isSelected)}`}
              >
                <CategoryIcon size={16} className={getIconColorClass(category.color)} />
                <span>{category.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${isSelected ? 'bg-white/20' : 'bg-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        {selectedCategory !== 'all' && (
          <p className="text-sm text-slate-500 mt-3">
            {ORGANIZATION_CATEGORIES.find(c => c.id === selectedCategory)?.description}
          </p>
        )}
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
            >
              <Building2 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
            >
              <Briefcase size={16} />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium">
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Add Organization
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold">{filteredOrganizations.length}</p>
          <p className="text-sm text-slate-400">Total Organizations</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-emerald-400">{filteredOrganizations.filter(o => o.verified).length}</p>
          <p className="text-sm text-slate-400">Verified</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-400">{filteredOrganizations.filter(o => o.clearance_sponsor).length}</p>
          <p className="text-sm text-slate-400">Clearance Sponsors</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-violet-400">{getCategoryCount('ai') + getCategoryCount('quantum')}</p>
          <p className="text-sm text-slate-400">AI/Quantum Partners</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400">{getCategoryCount('national_labs')}</p>
          <p className="text-sm text-slate-400">National Labs</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-purple-400">{getCategoryCount('universities') + getCategoryCount('community_colleges')}</p>
          <p className="text-sm text-slate-400">Educational Partners</p>
        </div>
      </div>

      {/* Organizations Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-slate-400 col-span-full text-center py-8">Loading organizations...</p>
          ) : filteredOrganizations.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No organizations found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredOrganizations.map((org) => (
              <div
                key={org.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryGradient(org.category)} flex items-center justify-center font-bold text-lg`}>
                      {org.name?.[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-emerald-400 transition-colors">{org.name}</h4>
                      <p className="text-sm text-slate-400 capitalize">{org.industry}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {org.verified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-500 mt-3 line-clamp-2">{org.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin size={14} />
                      Location
                    </span>
                    <span>{org.city && org.state ? `${org.city}, ${org.state}` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users size={14} />
                      Employees
                    </span>
                    <span>{org.employees || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Shield size={14} />
                      Clearance Sponsor
                    </span>
                    <span className={org.clearance_sponsor ? 'text-emerald-400' : 'text-slate-500'}>
                      {org.clearance_sponsor ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => { setSelectedOrganization(org); setShowModal(true); }}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                  {!org.verified && (
                    <button
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Clearance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryGradient(org.category)} flex items-center justify-center font-bold text-sm`}>
                        {org.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-slate-400">{org.industry}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      ORGANIZATION_CATEGORIES.find(c => c.id === org.category)?.color || 'slate',
                      false
                    )}`}>
                      {ORGANIZATION_CATEGORIES.find(c => c.id === org.category)?.label || org.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {org.city && org.state ? `${org.city}, ${org.state}` : '-'}
                  </td>
                  <td className="px-4 py-4">
                    {org.verified ? (
                      <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                        <CheckCircle2 size={14} />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm text-amber-400">
                        <Clock size={14} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {org.clearance_sponsor ? (
                      <span className="flex items-center gap-1.5 text-sm text-blue-400">
                        <Shield size={14} />
                        Yes
                      </span>
                    ) : (
                      <span className="text-sm text-slate-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedOrganization(org); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-amber-400">
                        <Settings size={16} />
                      </button>
                      {!org.verified && (
                        <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400">
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Organization Detail Modal */}
      {showModal && selectedOrganization && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Organization Details</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getCategoryGradient(selectedOrganization.category)} flex items-center justify-center font-bold text-2xl`}>
                  {selectedOrganization.name?.[0]}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedOrganization.name}</h4>
                  <p className="text-slate-400">{selectedOrganization.industry}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedOrganization.verified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} />
                        Verified
                      </span>
                    )}
                    {selectedOrganization.clearance_sponsor && (
                      <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">
                        <Shield size={10} />
                        Clearance Sponsor
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-slate-300">{selectedOrganization.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Category</p>
                  <p className="font-medium capitalize mt-1">
                    {ORGANIZATION_CATEGORIES.find(c => c.id === selectedOrganization.category)?.label}
                  </p>
                </div>
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="font-medium mt-1">
                    {selectedOrganization.city}, {selectedOrganization.state}
                  </p>
                </div>
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Employees</p>
                  <p className="font-medium mt-1">{selectedOrganization.employees || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Website</p>
                  <p className="font-medium text-emerald-400 mt-1">{selectedOrganization.website || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors">
                  Edit Organization
                </button>
                <button className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors">
                  View Jobs
                </button>
                <button className="py-2.5 px-4 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg font-medium transition-colors">
                  <Globe size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Organization Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Organization</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Organization Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Enter organization name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                  <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                    {ORGANIZATION_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., AI & Machine Learning"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., CA"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 h-24 resize-none"
                  placeholder="Brief description of the organization"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Website</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Employees</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., 1000+"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm">Clearance Sponsor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm">Mark as Verified</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors">
                  Add Organization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationsTab;
