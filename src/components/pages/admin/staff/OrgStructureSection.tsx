import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  GitBranch,
  Shield,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Star,
  Clock,
  Target,
  User,
  X,
  Search
} from 'lucide-react';
import type {
  Department,
  StaffPosition,
  OrgChartNode,
  SuccessionPlan
} from '../../../../types/staffManagement';

// Sample Data
const sampleDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development and technical operations',
    departmentHeadId: 'staff-1',
    departmentHeadName: 'Sarah Chen',
    annualBudget: 2500000,
    headcountBudget: 25,
    currentHeadcount: 18,
    isActive: true,
    children: [
      {
        id: 'dept-1a',
        name: 'Frontend',
        code: 'ENG-FE',
        parentDepartmentId: 'dept-1',
        departmentHeadName: 'Michael Rodriguez',
        headcountBudget: 10,
        currentHeadcount: 7,
        isActive: true
      },
      {
        id: 'dept-1b',
        name: 'Backend',
        code: 'ENG-BE',
        parentDepartmentId: 'dept-1',
        departmentHeadName: 'Emily Watson',
        headcountBudget: 10,
        currentHeadcount: 8,
        isActive: true
      },
      {
        id: 'dept-1c',
        name: 'DevOps',
        code: 'ENG-DO',
        parentDepartmentId: 'dept-1',
        departmentHeadName: 'David Kim',
        headcountBudget: 5,
        currentHeadcount: 3,
        isActive: true
      }
    ]
  },
  {
    id: 'dept-2',
    name: 'Product',
    code: 'PROD',
    description: 'Product management and design',
    departmentHeadId: 'staff-5',
    departmentHeadName: 'Amanda Foster',
    annualBudget: 800000,
    headcountBudget: 8,
    currentHeadcount: 6,
    isActive: true,
    children: [
      {
        id: 'dept-2a',
        name: 'Design',
        code: 'PROD-DES',
        parentDepartmentId: 'dept-2',
        departmentHeadName: 'Jordan Lee',
        headcountBudget: 4,
        currentHeadcount: 3,
        isActive: true
      }
    ]
  },
  {
    id: 'dept-3',
    name: 'Operations',
    code: 'OPS',
    description: 'Business operations and support',
    departmentHeadId: 'staff-10',
    departmentHeadName: 'Robert Martinez',
    annualBudget: 600000,
    headcountBudget: 10,
    currentHeadcount: 8,
    isActive: true
  },
  {
    id: 'dept-4',
    name: 'Human Resources',
    code: 'HR',
    description: 'People operations and talent management',
    departmentHeadId: 'staff-15',
    departmentHeadName: 'Lisa Thompson',
    annualBudget: 400000,
    headcountBudget: 5,
    currentHeadcount: 4,
    isActive: true
  }
];

const sampleOrgChart: OrgChartNode = {
  id: 'ceo',
  staffId: 'staff-ceo',
  name: 'Jennifer Walsh',
  title: 'CEO',
  department: 'Executive',
  level: 0,
  children: [
    {
      id: 'cto',
      staffId: 'staff-1',
      name: 'Sarah Chen',
      title: 'CTO',
      department: 'Engineering',
      level: 1,
      children: [
        {
          id: 'fe-lead',
          staffId: 'staff-2',
          name: 'Michael Rodriguez',
          title: 'Frontend Lead',
          department: 'Engineering',
          level: 2,
          children: []
        },
        {
          id: 'be-lead',
          staffId: 'staff-3',
          name: 'Emily Watson',
          title: 'Backend Lead',
          department: 'Engineering',
          level: 2,
          children: []
        },
        {
          id: 'devops-lead',
          staffId: 'staff-4',
          name: 'David Kim',
          title: 'DevOps Lead',
          department: 'Engineering',
          level: 2,
          children: []
        }
      ]
    },
    {
      id: 'cpo',
      staffId: 'staff-5',
      name: 'Amanda Foster',
      title: 'CPO',
      department: 'Product',
      level: 1,
      children: [
        {
          id: 'design-lead',
          staffId: 'staff-6',
          name: 'Jordan Lee',
          title: 'Design Lead',
          department: 'Product',
          level: 2,
          children: []
        }
      ]
    },
    {
      id: 'coo',
      staffId: 'staff-10',
      name: 'Robert Martinez',
      title: 'COO',
      department: 'Operations',
      level: 1,
      children: []
    },
    {
      id: 'hr-director',
      staffId: 'staff-15',
      name: 'Lisa Thompson',
      title: 'HR Director',
      department: 'Human Resources',
      level: 1,
      children: []
    }
  ]
};

const sampleSuccessionPlans: SuccessionPlan[] = [
  {
    id: 'sp-1',
    positionTitle: 'CTO',
    currentHolderId: 'staff-1',
    currentHolderName: 'Sarah Chen',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    criticality: 'critical',
    riskOfLoss: 'low',
    successors: [
      {
        staffId: 'staff-3',
        staffName: 'Emily Watson',
        readiness: '1_2_years',
        developmentNeeds: ['Executive leadership training', 'Budget management']
      },
      {
        staffId: 'staff-2',
        staffName: 'Michael Rodriguez',
        readiness: '3_5_years',
        developmentNeeds: ['Backend systems experience', 'Cross-functional leadership']
      }
    ],
    lastReviewedAt: '2025-01-15',
    reviewedBy: 'HR Director',
    nextReviewDate: '2025-07-15'
  },
  {
    id: 'sp-2',
    positionTitle: 'CPO',
    currentHolderId: 'staff-5',
    currentHolderName: 'Amanda Foster',
    departmentId: 'dept-2',
    departmentName: 'Product',
    criticality: 'critical',
    riskOfLoss: 'medium',
    successors: [
      {
        staffId: 'staff-6',
        staffName: 'Jordan Lee',
        readiness: '1_2_years',
        developmentNeeds: ['Product strategy', 'Stakeholder management']
      }
    ],
    lastReviewedAt: '2025-01-10',
    reviewedBy: 'HR Director',
    nextReviewDate: '2025-07-10'
  },
  {
    id: 'sp-3',
    positionTitle: 'Backend Lead',
    currentHolderId: 'staff-3',
    currentHolderName: 'Emily Watson',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    criticality: 'important',
    riskOfLoss: 'low',
    successors: [
      {
        staffId: 'staff-20',
        staffName: 'Alex Johnson',
        readiness: 'ready_now',
        developmentNeeds: []
      }
    ],
    lastReviewedAt: '2025-01-05',
    reviewedBy: 'CTO',
    nextReviewDate: '2025-04-05'
  }
];

type OrgTab = 'departments' | 'org_chart' | 'succession';

const OrgStructureSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrgTab>('departments');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['dept-1', 'dept-2']));
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSuccessionPlan, setSelectedSuccessionPlan] = useState<SuccessionPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddSuccessionModal, setShowAddSuccessionModal] = useState(false);

  const tabs = [
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'org_chart', label: 'Org Chart', icon: GitBranch },
    { id: 'succession', label: 'Succession Planning', icon: Shield }
  ];

  const toggleDeptExpand = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'important': return 'bg-amber-500/20 text-amber-400';
      case 'standard': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getReadinessLabel = (readiness: string) => {
    switch (readiness) {
      case 'ready_now': return 'Ready Now';
      case '1_2_years': return '1-2 Years';
      case '3_5_years': return '3-5 Years';
      case 'developing': return 'Developing';
      default: return readiness;
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'ready_now': return 'bg-emerald-500/20 text-emerald-400';
      case '1_2_years': return 'bg-blue-500/20 text-blue-400';
      case '3_5_years': return 'bg-amber-500/20 text-amber-400';
      case 'developing': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  // Stats
  const totalHeadcount = sampleDepartments.reduce((sum, d) => sum + (d.currentHeadcount || 0), 0);
  const totalBudget = sampleDepartments.reduce((sum, d) => sum + (d.annualBudget || 0), 0);
  const criticalRoles = sampleSuccessionPlans.filter(sp => sp.criticality === 'critical').length;
  const highRiskRoles = sampleSuccessionPlans.filter(sp => sp.riskOfLoss === 'high').length;

  // Recursive org chart node renderer
  const renderOrgNode = (node: OrgChartNode, isLast: boolean = false) => {
    return (
      <div key={node.id} className="relative">
        <div className="flex items-start">
          {/* Connector lines */}
          {node.level > 0 && (
            <div className="flex items-center h-full">
              <div className="w-8 border-t-2 border-slate-600"></div>
            </div>
          )}

          {/* Node card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg ${
                node.level === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                node.level === 1 ? 'bg-gradient-to-br from-emerald-400 to-blue-500' :
                'bg-gradient-to-br from-blue-400 to-purple-500'
              }`}>
                {node.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-medium">{node.name}</p>
                <p className="text-sm text-emerald-400">{node.title}</p>
                <p className="text-xs text-slate-400">{node.department}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Children */}
        {node.children && node.children.length > 0 && (
          <div className="ml-16 mt-4 space-y-4 border-l-2 border-slate-600 pl-4">
            {node.children.map((child, idx) => renderOrgNode(child, idx === node.children!.length - 1))}
          </div>
        )}
      </div>
    );
  };

  const DepartmentRow: React.FC<{ dept: Department; level?: number }> = ({ dept, level = 0 }) => {
    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedDepts.has(dept.id);
    const headcountPercent = dept.headcountBudget ? (dept.currentHeadcount || 0) / dept.headcountBudget * 100 : 0;

    return (
      <>
        <tr className="hover:bg-slate-700/30 transition-colors">
          <td className="px-4 py-3">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren ? (
                <button
                  onClick={() => toggleDeptExpand(dept.id)}
                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  level === 0 ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                }`}>
                  <Building2 className={`w-4 h-4 ${level === 0 ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="text-white font-medium">{dept.name}</p>
                  <p className="text-xs text-slate-400">{dept.code}</p>
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-slate-300">
            {dept.departmentHeadName || '-'}
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-white">{dept.currentHeadcount || 0}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-400">{dept.headcountBudget || 0}</span>
              {headcountPercent < 80 && (
                <span className="text-xs text-amber-400">Hiring</span>
              )}
            </div>
          </td>
          <td className="px-4 py-3 text-slate-300">
            {dept.annualBudget ? formatCurrency(dept.annualBudget) : '-'}
          </td>
          <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded-full text-xs ${
              dept.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
            }`}>
              {dept.isActive ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => setSelectedDepartment(dept)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && dept.children!.map((child) => (
          <DepartmentRow key={child.id} dept={child} level={level + 1} />
        ))}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Departments</p>
              <p className="text-xl font-bold text-white">{sampleDepartments.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Headcount</p>
              <p className="text-xl font-bold text-white">{totalHeadcount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Critical Roles</p>
              <p className="text-xl font-bold text-white">{criticalRoles}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">High Risk</p>
              <p className="text-xl font-bold text-white">{highRiskRoles}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-slate-700/50 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as OrgTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'departments' ? 'departments' : activeTab === 'org_chart' ? 'people' : 'roles'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        {activeTab === 'departments' && (
          <button
            onClick={() => setShowAddDeptModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        )}
        {activeTab === 'succession' && (
          <button
            onClick={() => setShowAddSuccessionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Succession Plan
          </button>
        )}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'departments' && (
          <motion.div
            key="departments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Department</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Head</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Headcount</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Budget</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {sampleDepartments.map((dept) => (
                    <DepartmentRow key={dept.id} dept={dept} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Budget Summary */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-white font-medium mb-4">Budget Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">Total Annual Budget</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">Engineering</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(2500000)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">Product</p>
                  <p className="text-lg font-bold text-blue-400">{formatCurrency(800000)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">Operations</p>
                  <p className="text-lg font-bold text-purple-400">{formatCurrency(600000)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'org_chart' && (
          <motion.div
            key="org_chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 overflow-x-auto">
              <div className="min-w-[600px]">
                {renderOrgNode(sampleOrgChart)}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Executives</p>
                    <p className="text-xl font-bold text-white">5</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Team Leads</p>
                    <p className="text-xl font-bold text-white">8</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Individual Contributors</p>
                    <p className="text-xl font-bold text-white">23</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <GitBranch className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Avg Span of Control</p>
                    <p className="text-xl font-bold text-white">4.2</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'succession' && (
          <motion.div
            key="succession"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {sampleSuccessionPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all cursor-pointer"
                onClick={() => setSelectedSuccessionPlan(plan)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      plan.criticality === 'critical' ? 'bg-red-500/20' :
                      plan.criticality === 'important' ? 'bg-amber-500/20' :
                      'bg-slate-700/50'
                    }`}>
                      <Shield className={`w-5 h-5 ${
                        plan.criticality === 'critical' ? 'text-red-400' :
                        plan.criticality === 'important' ? 'text-amber-400' :
                        'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{plan.positionTitle}</h3>
                      <p className="text-sm text-slate-400">
                        Current: {plan.currentHolderName} • {plan.departmentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getCriticalityColor(plan.criticality)}`}>
                      {plan.criticality.charAt(0).toUpperCase() + plan.criticality.slice(1)}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Risk of Loss</p>
                      <p className={`font-medium ${getRiskColor(plan.riskOfLoss)}`}>
                        {plan.riskOfLoss.charAt(0).toUpperCase() + plan.riskOfLoss.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-3">Identified Successors ({plan.successors.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.successors.map((successor) => (
                      <div
                        key={successor.staffId}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {successor.staffName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white text-sm">{successor.staffName}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getReadinessColor(successor.readiness)}`}>
                            {getReadinessLabel(successor.readiness)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      Last reviewed: {plan.lastReviewedAt ? formatDate(plan.lastReviewedAt) : 'Never'}
                    </div>
                    {plan.nextReviewDate && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Target className="w-4 h-4" />
                        Next review: {formatDate(plan.nextReviewDate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Succession Summary */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-white font-medium mb-4">Succession Pipeline Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-sm text-emerald-400">Ready Now</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {sampleSuccessionPlans.reduce((sum, sp) =>
                      sum + sp.successors.filter(s => s.readiness === 'ready_now').length, 0
                    )}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-400">1-2 Years</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {sampleSuccessionPlans.reduce((sum, sp) =>
                      sum + sp.successors.filter(s => s.readiness === '1_2_years').length, 0
                    )}
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-400">3-5 Years</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {sampleSuccessionPlans.reduce((sum, sp) =>
                      sum + sp.successors.filter(s => s.readiness === '3_5_years').length, 0
                    )}
                  </p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">No Successor</p>
                  <p className="text-2xl font-bold text-red-400">0</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Succession Plan Detail Modal */}
      <AnimatePresence>
        {selectedSuccessionPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSuccessionPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSuccessionPlan.positionTitle}</h2>
                  <p className="text-slate-400">Succession Plan Details</p>
                </div>
                <button
                  onClick={() => setSelectedSuccessionPlan(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Current Holder */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-2">Current Holder</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-medium">
                      {selectedSuccessionPlan.currentHolderName?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedSuccessionPlan.currentHolderName}</p>
                      <p className="text-sm text-slate-400">{selectedSuccessionPlan.departmentName}</p>
                    </div>
                  </div>
                </div>

                {/* Successors */}
                <div>
                  <h3 className="text-white font-medium mb-4">Successor Pipeline</h3>
                  <div className="space-y-3">
                    {selectedSuccessionPlan.successors.map((successor, idx) => (
                      <div key={successor.staffId} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                              {successor.staffName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-white font-medium">{successor.staffName}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getReadinessColor(successor.readiness)}`}>
                                {getReadinessLabel(successor.readiness)}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-slate-400">#{idx + 1} Priority</span>
                        </div>
                        {successor.developmentNeeds.length > 0 && (
                          <div>
                            <p className="text-sm text-slate-400 mb-2">Development Needs:</p>
                            <div className="flex flex-wrap gap-2">
                              {successor.developmentNeeds.map((need, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-slate-600/50 text-slate-300 rounded">
                                  {need}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Info */}
                <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-700/50">
                  <span>Last reviewed by {selectedSuccessionPlan.reviewedBy} on {selectedSuccessionPlan.lastReviewedAt ? formatDate(selectedSuccessionPlan.lastReviewedAt) : 'N/A'}</span>
                  {selectedSuccessionPlan.nextReviewDate && (
                    <span>Next review: {formatDate(selectedSuccessionPlan.nextReviewDate)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <AddDepartmentModal onClose={() => setShowAddDeptModal(false)} />
      )}

      {/* Add Succession Plan Modal */}
      {showAddSuccessionModal && (
        <AddSuccessionPlanModal onClose={() => setShowAddSuccessionModal(false)} />
      )}
    </div>
  );
};

// ===========================================
// ADD DEPARTMENT MODAL
// ===========================================

interface AddDepartmentModalProps {
  onClose: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [headcountBudget, setHeadcountBudget] = useState('');
  const [annualBudget, setAnnualBudget] = useState('');

  const handleSubmit = () => {
    if (!name || !code) return;
    // In a real app, this would submit to the API
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Department</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing"
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Department Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., MKT"
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description..."
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Headcount Budget</label>
              <input
                type="number"
                value={headcountBudget}
                onChange={(e) => setHeadcountBudget(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Annual Budget ($)</label>
              <input
                type="number"
                value={annualBudget}
                onChange={(e) => setAnnualBudget(e.target.value)}
                placeholder="500000"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
            Add Department
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// ADD SUCCESSION PLAN MODAL
// ===========================================

interface AddSuccessionPlanModalProps {
  onClose: () => void;
}

const AddSuccessionPlanModal: React.FC<AddSuccessionPlanModalProps> = ({ onClose }) => {
  const [positionTitle, setPositionTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [criticality, setCriticality] = useState('important');
  const [currentHolder, setCurrentHolder] = useState('');

  const handleSubmit = () => {
    if (!positionTitle || !department) return;
    // In a real app, this would submit to the API
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Succession Plan</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Position Title</label>
            <input
              type="text"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              placeholder="e.g., VP of Engineering"
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            >
              <option value="">Select department...</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Operations">Operations</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Current Holder</label>
            <input
              type="text"
              value={currentHolder}
              onChange={(e) => setCurrentHolder(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Criticality</label>
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            >
              <option value="critical">Critical</option>
              <option value="important">Important</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
            Create Plan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrgStructureSection;
