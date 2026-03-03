// ===========================================
// Research Tab - PI Profiles & Collaboration Matching
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  BookOpen,
  Building2,
  Globe,
  ExternalLink,
  Mail,
  GraduationCap,
  Handshake,
  Filter,
  ChevronDown,
  Award,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import type {
  LabPartnerTier,
  PrincipalInvestigator,
  ResearchCollaboration,
  CollaborationType,
  CollaborationStatus,
} from '../../../../types/nationalLabsPartner';

interface ResearchTabProps {
  partnerId: string;
  tier: LabPartnerTier;
}

type ViewMode = 'investigators' | 'collaborations';

// Sample PI data
const samplePIs: PrincipalInvestigator[] = [
  {
    id: 'pi-1',
    partnerId: 'partner-1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'schen@ornl.gov',
    title: 'Distinguished Scientist',
    department: 'Materials Science',
    division: 'Materials Science and Technology Division',
    researchAreas: ['Advanced Materials', 'Neutron Scattering', 'Additive Manufacturing'],
    keywords: ['neutron diffraction', 'metal alloys', 'high-entropy alloys', 'in-situ characterization'],
    publications: 187,
    hIndex: 52,
    orcidId: '0000-0002-1234-5678',
    seekingCollaborations: true,
    collaborationInterests: ['Industry partnerships for AM materials', 'University joint research'],
    seekingStudents: true,
    availableProjects: 3,
    biography: 'Leading research in advanced characterization of materials using neutron scattering techniques.',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: 'pi-2',
    partnerId: 'partner-1',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'mrodriguez@ornl.gov',
    title: 'Senior Research Scientist',
    department: 'Computational Sciences',
    division: 'Computing and Computational Sciences Directorate',
    researchAreas: ['High Performance Computing', 'Machine Learning', 'Scientific Computing'],
    keywords: ['exascale computing', 'GPU acceleration', 'deep learning', 'molecular dynamics'],
    publications: 94,
    hIndex: 38,
    orcidId: '0000-0003-9876-5432',
    seekingCollaborations: true,
    collaborationInterests: ['AI/ML collaborations', 'Co-design projects'],
    seekingStudents: true,
    availableProjects: 2,
    biography: 'Developing next-generation computational methods for scientific discovery.',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-10',
  },
  {
    id: 'pi-3',
    partnerId: 'partner-1',
    firstName: 'Jennifer',
    lastName: 'Park',
    email: 'jpark@ornl.gov',
    title: 'Group Leader',
    department: 'Nuclear Science',
    division: 'Physics Division',
    researchAreas: ['Nuclear Physics', 'Isotope Production', 'Radiation Detection'],
    keywords: ['rare isotopes', 'nuclear structure', 'detector development', 'target fabrication'],
    publications: 156,
    hIndex: 45,
    seekingCollaborations: false,
    collaborationInterests: [],
    seekingStudents: true,
    availableProjects: 1,
    biography: 'Expert in nuclear physics and isotope production for medical and research applications.',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-15',
  },
];

// Sample collaborations data
const sampleCollaborations: ResearchCollaboration[] = [
  {
    id: 'collab-1',
    partnerId: 'partner-1',
    piId: 'pi-1',
    title: 'Advanced Manufacturing Materials Partnership',
    description: 'Joint development of novel alloys for additive manufacturing applications in aerospace.',
    collaborationType: 'crada',
    externalOrganization: 'Boeing Research & Technology',
    externalOrganizationType: 'industry',
    externalContactName: 'Dr. Robert Miller',
    externalContactEmail: 'r.miller@boeing.com',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    contractNumber: 'CRADA-2024-001',
    fundingSource: 'DOE EERE / Boeing Co-fund',
    fundingAmount: 2500000,
    status: 'active',
    createdAt: '2023-11-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'collab-2',
    partnerId: 'partner-1',
    piId: 'pi-2',
    title: 'AI for Scientific Discovery Initiative',
    description: 'Collaborative research on applying deep learning to materials simulation and drug discovery.',
    collaborationType: 'joint_research',
    externalOrganization: 'MIT',
    externalOrganizationType: 'university',
    externalContactName: 'Prof. Lisa Wang',
    externalContactEmail: 'lwang@mit.edu',
    startDate: '2024-03-01',
    endDate: '2027-02-28',
    fundingSource: 'NSF AI Institute',
    fundingAmount: 1800000,
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-01',
  },
  {
    id: 'collab-3',
    partnerId: 'partner-1',
    piId: 'pi-1',
    title: 'Neutron Scattering User Program',
    description: 'Industry access to neutron scattering facilities for materials characterization.',
    collaborationType: 'user_facility',
    externalOrganization: 'General Motors R&D',
    externalOrganizationType: 'industry',
    externalContactName: 'Dr. James Thompson',
    externalContactEmail: 'jthompson@gm.com',
    startDate: '2024-02-15',
    endDate: '2024-08-15',
    fundingSource: 'Industry User Fee',
    fundingAmount: 150000,
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-15',
  },
  {
    id: 'collab-4',
    partnerId: 'partner-1',
    piId: 'pi-3',
    title: 'Medical Isotope Production Partnership',
    description: 'Development of new production pathways for therapeutic radioisotopes.',
    collaborationType: 'licensing',
    externalOrganization: 'Novartis Radiopharmaceuticals',
    externalOrganizationType: 'industry',
    externalContactName: 'Dr. Anna Schmidt',
    externalContactEmail: 'anna.schmidt@novartis.com',
    status: 'negotiating',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-20',
  },
];

const collaborationTypeLabels: Record<CollaborationType, string> = {
  joint_research: 'Joint Research',
  consulting: 'Consulting',
  licensing: 'Licensing',
  crada: 'CRADA',
  user_facility: 'User Facility',
  subcontract: 'Subcontract',
  other: 'Other',
};

const collaborationStatusConfig: Record<CollaborationStatus, { label: string; color: string; icon: React.ElementType }> = {
  prospecting: { label: 'Prospecting', color: 'slate', icon: Search },
  negotiating: { label: 'Negotiating', color: 'amber', icon: Clock },
  active: { label: 'Active', color: 'emerald', icon: CheckCircle },
  completed: { label: 'Completed', color: 'blue', icon: Award },
  terminated: { label: 'Terminated', color: 'red', icon: XCircle },
};

export const ResearchTab: React.FC<ResearchTabProps> = ({ partnerId, tier }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('investigators');
  const [pis, setPIs] = useState<PrincipalInvestigator[]>([]);
  const [collaborations, setCollaborations] = useState<ResearchCollaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [seekingCollabsOnly, setSeekingCollabsOnly] = useState(false);
  const [collabTypeFilter, setCollabTypeFilter] = useState<CollaborationType | ''>('');
  const [collabStatusFilter, setCollabStatusFilter] = useState<CollaborationStatus | ''>('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPIDetail, setShowPIDetail] = useState<PrincipalInvestigator | null>(null);
  const [showCollabDetail, setShowCollabDetail] = useState<ResearchCollaboration | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Add PI form
  const [piForm, setPIForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    department: '',
    researchAreas: '',
    seekingCollaborations: true,
    seekingStudents: false,
    availableProjects: 0,
  });

  // Add Collaboration form
  const [collabForm, setCollabForm] = useState({
    title: '',
    description: '',
    collaborationType: 'joint_research' as CollaborationType,
    externalOrganization: '',
    externalOrganizationType: 'university' as ResearchCollaboration['externalOrganizationType'],
    externalContactName: '',
    externalContactEmail: '',
    piId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [piData, collabData] = await Promise.all([
          import('@/services/nationalLabsPartnerApi').then(m => m.getPrincipalInvestigators(partnerId)),
          import('@/services/nationalLabsPartnerApi').then(m => m.getResearchCollaborations(partnerId))
        ]);

        // Use sample data if no data returned from API
        setPIs(piData.length > 0 ? piData : samplePIs);
        setCollaborations(collabData.length > 0 ? collabData : sampleCollaborations);
      } catch (error) {
        console.error('Error fetching research data:', error);
        // Fallback to sample data
        setPIs(samplePIs);
        setCollaborations(sampleCollaborations);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  // Get unique departments
  const departments = [...new Set(pis.map(pi => pi.department))];

  // Filter PIs
  const filteredPIs = pis.filter(pi => {
    const matchesSearch = searchQuery === '' ||
      `${pi.firstName} ${pi.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pi.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pi.researchAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pi.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment = departmentFilter === '' || pi.department === departmentFilter;
    const matchesSeekingCollabs = !seekingCollabsOnly || pi.seekingCollaborations;

    return matchesSearch && matchesDepartment && matchesSeekingCollabs;
  });

  // Filter collaborations
  const filteredCollaborations = collaborations.filter(collab => {
    const matchesSearch = searchQuery === '' ||
      collab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.externalOrganization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = collabTypeFilter === '' || collab.collaborationType === collabTypeFilter;
    const matchesStatus = collabStatusFilter === '' || collab.status === collabStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate metrics
  const metrics = {
    totalPIs: pis.length,
    seekingCollabs: pis.filter(pi => pi.seekingCollaborations).length,
    totalCollabs: collaborations.length,
    activeCollabs: collaborations.filter(c => c.status === 'active').length,
    totalFunding: collaborations
      .filter(c => c.fundingAmount)
      .reduce((sum, c) => sum + (c.fundingAmount || 0), 0),
    availableProjects: pis.reduce((sum, pi) => sum + pi.availableProjects, 0),
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const getPIForCollab = (piId: string) => pis.find(pi => pi.id === piId);

  const handleAddPI = () => {
    const newPI: PrincipalInvestigator = {
      id: `pi-new-${Date.now()}`,
      partnerId,
      firstName: piForm.firstName,
      lastName: piForm.lastName,
      email: piForm.email,
      title: piForm.title,
      department: piForm.department,
      researchAreas: piForm.researchAreas.split(',').map(a => a.trim()).filter(Boolean),
      keywords: [],
      publications: 0,
      seekingCollaborations: piForm.seekingCollaborations,
      collaborationInterests: [],
      seekingStudents: piForm.seekingStudents,
      availableProjects: piForm.availableProjects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPIs(prev => [newPI, ...prev]);
    setShowAddModal(false);
    setPIForm({ firstName: '', lastName: '', email: '', title: '', department: '', researchAreas: '', seekingCollaborations: true, seekingStudents: false, availableProjects: 0 });
  };

  const handleAddCollab = () => {
    const newCollab: ResearchCollaboration = {
      id: `collab-new-${Date.now()}`,
      partnerId,
      piId: collabForm.piId || pis[0]?.id || '',
      title: collabForm.title,
      description: collabForm.description,
      collaborationType: collabForm.collaborationType,
      externalOrganization: collabForm.externalOrganization,
      externalOrganizationType: collabForm.externalOrganizationType,
      externalContactName: collabForm.externalContactName,
      externalContactEmail: collabForm.externalContactEmail,
      status: 'prospecting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollaborations(prev => [newCollab, ...prev]);
    setShowAddModal(false);
    setCollabForm({ title: '', description: '', collaborationType: 'joint_research', externalOrganization: '', externalOrganizationType: 'university', externalContactName: '', externalContactEmail: '', piId: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Research & Collaborations</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage PI profiles and track research partnerships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {viewMode === 'investigators' ? 'Add PI' : 'New Collaboration'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Users className="w-4 h-4" />
            Total PIs
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalPIs}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Handshake className="w-4 h-4" />
            Seeking Collabs
          </div>
          <div className="text-2xl font-bold text-amber-400">{metrics.seekingCollabs}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <GraduationCap className="w-4 h-4" />
            Open Projects
          </div>
          <div className="text-2xl font-bold text-white">{metrics.availableProjects}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <FileText className="w-4 h-4" />
            Total Collabs
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalCollabs}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Active Collabs
          </div>
          <div className="text-2xl font-bold text-emerald-400">{metrics.activeCollabs}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Total Funding
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(metrics.totalFunding)}</div>
        </motion.div>
      </div>

      {/* View Toggle & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex rounded-lg overflow-hidden border border-slate-700">
          <button
            onClick={() => setViewMode('investigators')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'investigators'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Investigators ({pis.length})
          </button>
          <button
            onClick={() => setViewMode('collaborations')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'collaborations'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Handshake className="w-4 h-4 inline mr-2" />
            Collaborations ({collaborations.length})
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={viewMode === 'investigators' ? 'Search PIs, research areas...' : 'Search collaborations...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
          >
            {viewMode === 'investigators' ? (
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seekingCollabsOnly}
                      onChange={(e) => setSeekingCollabsOnly(e.target.checked)}
                      className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-slate-300">Seeking collaborations only</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Collaboration Type</label>
                  <select
                    value={collabTypeFilter}
                    onChange={(e) => setCollabTypeFilter(e.target.value as CollaborationType | '')}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">All Types</option>
                    {Object.entries(collaborationTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={collabStatusFilter}
                    onChange={(e) => setCollabStatusFilter(e.target.value as CollaborationStatus | '')}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(collaborationStatusConfig).map(([value, config]) => (
                      <option key={value} value={value}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'investigators' ? (
          <motion.div
            key="investigators"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {filteredPIs.map((pi, index) => (
              <motion.div
                key={pi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setShowPIDetail(pi)}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                      {pi.firstName[0]}{pi.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {pi.firstName} {pi.lastName}
                      </h3>
                      <p className="text-slate-400 text-sm">{pi.title}</p>
                    </div>
                  </div>
                  {pi.seekingCollaborations && (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                      Seeking Collabs
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Building2 className="w-4 h-4" />
                    {pi.department}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4" />
                    {pi.email}
                  </div>
                </div>

                {/* Research Areas */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {pi.researchAreas.map((area, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-400">
                      <BookOpen className="w-4 h-4" />
                      <span>{pi.publications} pubs</span>
                    </div>
                    {pi.hIndex && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Award className="w-4 h-4" />
                        <span>h-index: {pi.hIndex}</span>
                      </div>
                    )}
                  </div>
                  {pi.orcidId && (
                    <a
                      href={`https://orcid.org/${pi.orcidId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ORCID <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Available Projects */}
                {pi.availableProjects > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <GraduationCap className="w-4 h-4" />
                      {pi.availableProjects} project{pi.availableProjects !== 1 ? 's' : ''} available for students
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {filteredPIs.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No investigators found matching your criteria</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="collaborations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredCollaborations.map((collab, index) => {
              const pi = getPIForCollab(collab.piId);
              const statusConfig = collaborationStatusConfig[collab.status];
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setShowCollabDetail(collab)}
                  className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold">{collab.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          statusConfig.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                          statusConfig.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                          statusConfig.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          statusConfig.color === 'red' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{collab.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                      {collaborationTypeLabels[collab.collaborationType]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* External Partner */}
                    <div>
                      <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Partner</div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-white text-sm">{collab.externalOrganization}</span>
                      </div>
                      <div className="text-slate-400 text-xs capitalize">{collab.externalOrganizationType}</div>
                    </div>

                    {/* PI */}
                    {pi && (
                      <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Lead PI</div>
                        <div className="text-white text-sm">{pi.firstName} {pi.lastName}</div>
                        <div className="text-slate-400 text-xs">{pi.department}</div>
                      </div>
                    )}

                    {/* Duration */}
                    {collab.startDate && (
                      <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Duration</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-white text-sm">
                            {new Date(collab.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            {collab.endDate && ` - ${new Date(collab.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Funding */}
                    {collab.fundingAmount && (
                      <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Funding</div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">{formatCurrency(collab.fundingAmount)}</span>
                        </div>
                        {collab.fundingSource && (
                          <div className="text-slate-400 text-xs">{collab.fundingSource}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contract Number */}
                  {collab.contractNumber && (
                    <div className="pt-3 border-t border-slate-700 flex items-center gap-2 text-slate-400 text-sm">
                      <FileText className="w-4 h-4" />
                      Contract: {collab.contractNumber}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filteredCollaborations.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Handshake className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No collaborations found matching your criteria</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enterprise Feature Notice */}
      {tier === 'research' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Upgrade for Full Collaboration Features</h3>
              <p className="text-slate-300 text-sm mb-3">
                Lab Partner and Enterprise tiers include advanced collaboration matching,
                publication analytics, and CRADA management tools.
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                View Plans
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add PI / New Collaboration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {viewMode === 'investigators' ? 'Add Principal Investigator' : 'New Collaboration'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewMode === 'investigators' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={piForm.firstName}
                      onChange={e => setPIForm({ ...piForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={piForm.lastName}
                      onChange={e => setPIForm({ ...piForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={piForm.email}
                    onChange={e => setPIForm({ ...piForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={piForm.title}
                    onChange={e => setPIForm({ ...piForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Senior Research Scientist"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={piForm.department}
                    onChange={e => setPIForm({ ...piForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Research Areas (comma-separated)</label>
                  <input
                    type="text"
                    value={piForm.researchAreas}
                    onChange={e => setPIForm({ ...piForm, researchAreas: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Materials Science, HPC, AI/ML"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={piForm.seekingCollaborations}
                      onChange={e => setPIForm({ ...piForm, seekingCollaborations: e.target.checked })}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-700 rounded"
                    />
                    <span className="text-sm text-gray-300">Seeking Collaborations</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={piForm.seekingStudents}
                      onChange={e => setPIForm({ ...piForm, seekingStudents: e.target.checked })}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-700 rounded"
                    />
                    <span className="text-sm text-gray-300">Seeking Students</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button
                    onClick={handleAddPI}
                    disabled={!piForm.firstName || !piForm.lastName || !piForm.email}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add PI
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Collaboration Title</label>
                  <input
                    type="text"
                    value={collabForm.title}
                    onChange={e => setCollabForm({ ...collabForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={collabForm.description}
                    onChange={e => setCollabForm({ ...collabForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <select
                      value={collabForm.collaborationType}
                      onChange={e => setCollabForm({ ...collabForm, collaborationType: e.target.value as CollaborationType })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.entries(collaborationTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Lead PI</label>
                    <select
                      value={collabForm.piId}
                      onChange={e => setCollabForm({ ...collabForm, piId: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select PI...</option>
                      {pis.map(pi => (
                        <option key={pi.id} value={pi.id}>{pi.firstName} {pi.lastName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">External Organization</label>
                  <input
                    type="text"
                    value={collabForm.externalOrganization}
                    onChange={e => setCollabForm({ ...collabForm, externalOrganization: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={collabForm.externalContactName}
                      onChange={e => setCollabForm({ ...collabForm, externalContactName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={collabForm.externalContactEmail}
                      onChange={e => setCollabForm({ ...collabForm, externalContactEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button
                    onClick={handleAddCollab}
                    disabled={!collabForm.title || !collabForm.externalOrganization}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Collaboration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PI Detail Modal */}
      {showPIDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPIDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  {showPIDetail.firstName[0]}{showPIDetail.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{showPIDetail.firstName} {showPIDetail.lastName}</h3>
                  <p className="text-gray-400">{showPIDetail.title}</p>
                </div>
              </div>
              <button onClick={() => setShowPIDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Department</p>
                <p className="text-white font-semibold">{showPIDetail.department}</p>
                {showPIDetail.division && <p className="text-gray-400 text-xs mt-1">{showPIDetail.division}</p>}
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white">{showPIDetail.email}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Publications</p>
                <p className="text-white font-bold text-xl">{showPIDetail.publications}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">h-Index</p>
                <p className="text-amber-400 font-bold text-xl">{showPIDetail.hIndex || 'N/A'}</p>
              </div>
            </div>

            {showPIDetail.biography && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Biography</p>
                <p className="text-gray-300">{showPIDetail.biography}</p>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-white font-semibold mb-2">Research Areas</h4>
              <div className="flex flex-wrap gap-2">
                {showPIDetail.researchAreas.map((area, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">{area}</span>
                ))}
              </div>
            </div>

            {showPIDetail.keywords.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {showPIDetail.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Seeking Collaborations</p>
                <p className={showPIDetail.seekingCollaborations ? 'text-emerald-400' : 'text-gray-400'}>
                  {showPIDetail.seekingCollaborations ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Available Projects</p>
                <p className="text-white font-bold">{showPIDetail.availableProjects}</p>
              </div>
            </div>

            {showPIDetail.collaborationInterests.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Collaboration Interests</h4>
                <ul className="space-y-1">
                  {showPIDetail.collaborationInterests.map((interest, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                      <Handshake className="w-3 h-3 text-amber-400" />
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PI's Collaborations */}
            {(() => {
              const piCollabs = collaborations.filter(c => c.piId === showPIDetail.id);
              if (piCollabs.length > 0) {
                return (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Active Collaborations ({piCollabs.length})</h4>
                    <div className="space-y-2">
                      {piCollabs.map(c => (
                        <div key={c.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">{c.title}</p>
                            <p className="text-gray-400 text-xs">{c.externalOrganization} - {collaborationTypeLabels[c.collaborationType]}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                            c.status === 'negotiating' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setShowPIDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              {showPIDetail.orcidId && (
                <a
                  href={`https://orcid.org/${showPIDetail.orcidId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-amber-400 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  ORCID Profile <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => setShowPIDetail(null)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Detail Modal */}
      {showCollabDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCollabDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{showCollabDetail.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                    {collaborationTypeLabels[showCollabDetail.collaborationType]}
                  </span>
                  {(() => {
                    const sc = collaborationStatusConfig[showCollabDetail.status];
                    const SIcon = sc.icon;
                    return (
                      <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${
                        sc.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                        sc.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                        sc.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                        sc.color === 'red' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        <SIcon className="w-3 h-3" /> {sc.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <button onClick={() => setShowCollabDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">{showCollabDetail.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">External Organization</p>
                <p className="text-white font-semibold">{showCollabDetail.externalOrganization}</p>
                <p className="text-gray-400 text-xs capitalize">{showCollabDetail.externalOrganizationType}</p>
              </div>
              {(() => {
                const pi = getPIForCollab(showCollabDetail.piId);
                return pi ? (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Lead PI</p>
                    <p className="text-white font-semibold">{pi.firstName} {pi.lastName}</p>
                    <p className="text-gray-400 text-xs">{pi.department}</p>
                  </div>
                ) : null;
              })()}
              {showCollabDetail.externalContactName && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">External Contact</p>
                  <p className="text-white">{showCollabDetail.externalContactName}</p>
                  <p className="text-gray-400 text-xs">{showCollabDetail.externalContactEmail}</p>
                </div>
              )}
              {showCollabDetail.fundingAmount && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Funding</p>
                  <p className="text-emerald-400 font-bold text-xl">{formatCurrency(showCollabDetail.fundingAmount)}</p>
                  {showCollabDetail.fundingSource && <p className="text-gray-400 text-xs">{showCollabDetail.fundingSource}</p>}
                </div>
              )}
            </div>

            {(showCollabDetail.startDate || showCollabDetail.contractNumber) && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {showCollabDetail.startDate && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Duration</p>
                    <p className="text-white">
                      {new Date(showCollabDetail.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      {showCollabDetail.endDate && ` - ${new Date(showCollabDetail.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                    </p>
                  </div>
                )}
                {showCollabDetail.contractNumber && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Contract Number</p>
                    <p className="text-white">{showCollabDetail.contractNumber}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setShowCollabDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => setShowCollabDetail(null)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Upgrade Your Plan</h3>
            <p className="text-gray-400 mb-4">Unlock advanced collaboration matching, publication analytics, and CRADA management tools.</p>
            <div className="space-y-3 mb-4">
              <div className="bg-gray-800 rounded-xl p-4 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">Lab Partner</h4>
                  <span className="text-amber-400 font-bold">$2,499/mo</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Advanced Collaboration Matching</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Publication Analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> CRADA Management</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">Enterprise</h4>
                  <span className="text-purple-400 font-bold">Custom</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Everything in Lab Partner</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> SSO Integration</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Dedicated Support</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Contact Sales</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchTab;
