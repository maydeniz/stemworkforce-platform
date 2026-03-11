// ===========================================
// Government Partner Dashboard
// Federal Agencies, State Workforce Boards, CHIPS Act Programs
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Landmark,
  TrendingUp,
  Target,
  DollarSign,
  Award,
  AlertTriangle,
  CheckCircle,
  Globe,
  Shield,
  FlaskConical,
} from 'lucide-react';
import { useAuth } from '@/contexts';
import {
  getGovernmentPartner,
  getWorkforcePrograms,
  getProgramParticipants,
  getEmployerPartnerships,
  getComplianceReports,
  getGovernmentDashboardMetrics
} from '@/services/governmentPartnerApi';
import type {
  GovernmentPartner,
  WorkforceProgram,
  ProgramParticipant,
  EmployerPartnership,
  ComplianceReport,
  GovernmentDashboardMetrics
} from '@/types/governmentPartner';

// Import dashboard tabs
import { ProgramsTab } from './dashboard/ProgramsTab';
import { ParticipantsTab } from './dashboard/ParticipantsTab';
import { EmployersTab } from './dashboard/EmployersTab';
import { ComplianceTab } from './dashboard/ComplianceTab';
import { AnalyticsTab } from './dashboard/AnalyticsTab';
import { SettingsTab } from './dashboard/SettingsTab';
import PolicyImpactTab from './dashboard/PolicyImpactTab';
import CrossAgencyTab from './dashboard/CrossAgencyTab';
import ClearancePipelineTab from './dashboard/ClearancePipelineTab';

// ===========================================
// TYPES
// ===========================================

type DashboardTab = 'overview' | 'programs' | 'participants' | 'employers' | 'compliance' | 'analytics' | 'policy_impact' | 'cross_agency' | 'clearance_pipeline' | 'settings';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_METRICS: GovernmentDashboardMetrics = {
  activePrograms: 12,
  totalPrograms: 18,
  chipsActPrograms: 4,
  programsAtRisk: 2,
  totalEnrolled: 4567,
  enrollmentThisQuarter: 892,
  enrollmentTarget: 5000,
  enrollmentProgress: 91,
  completedCount: 3245,
  placedCount: 2890,
  overallPlacementRate: 89,
  placementTarget: 85,
  averageWageGain: 12500,
  totalWagesGenerated: 36125000,
  averageWageAtPlacement: 58000,
  veteransEnrolled: 456,
  veteransPlaced: 412,
  veteransPlacementRate: 90,
  activeEmployerPartners: 156,
  hiringPledgesTotal: 2500,
  hiringPledgesFulfilled: 1890,
  upcomingReports: 3,
  overdueReports: 1,
  complianceScore: 94,
  totalEconomicImpact: 145000000,
  roiRatio: 4.2
};

const SAMPLE_PROGRAMS: WorkforceProgram[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'CHIPS Act Semiconductor Workforce Initiative',
    programType: 'chips_act',
    description: 'Training program for semiconductor manufacturing technicians',
    fundingSource: 'chips_act',
    grantNumber: 'CHIPS-2024-001',
    totalBudget: 15000000,
    spentToDate: 8500000,
    budgetRemaining: 6500000,
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    reportingDeadlines: ['2024-03-31', '2024-06-30', '2024-09-30', '2024-12-31'],
    enrollmentTarget: 1000,
    placementTarget: 85,
    wageGainTarget: 15000,
    currentEnrollment: 756,
    completedCount: 423,
    placedCount: 378,
    averageWageGain: 18500,
    status: 'active',
    milestoneProgress: 75,
    complianceStatus: 'compliant',
    lastReportDate: '2024-09-30',
    nextReportDue: '2024-12-31',
    industryFocus: ['Semiconductor Manufacturing', 'Advanced Manufacturing'],
    occupationCodes: ['51-9141', '17-3026'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    name: 'WIOA Dislocated Worker Program',
    programType: 'wioa_title_i',
    description: 'Retraining program for workers displaced by automation',
    fundingSource: 'wioa_title_i',
    grantNumber: 'WIOA-DW-2024-045',
    totalBudget: 5000000,
    spentToDate: 3200000,
    budgetRemaining: 1800000,
    startDate: '2024-04-01',
    endDate: '2026-03-31',
    reportingDeadlines: ['2024-06-30', '2024-12-31'],
    enrollmentTarget: 500,
    placementTarget: 80,
    wageGainTarget: 10000,
    currentEnrollment: 312,
    completedCount: 178,
    placedCount: 145,
    averageWageGain: 11200,
    status: 'active',
    milestoneProgress: 62,
    complianceStatus: 'compliant',
    lastReportDate: '2024-06-30',
    nextReportDue: '2024-12-31',
    industryFocus: ['Healthcare', 'IT', 'Advanced Manufacturing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_PARTICIPANTS: ProgramParticipant[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'msantos@email.com',
    phone: '555-0123',
    zipCode: '78701',
    county: 'Travis',
    veteranStatus: false,
    disabilityStatus: false,
    barriers: ['long_term_unemployed'],
    educationLevel: 'some_college',
    employedAtEnrollment: false,
    priorWage: 32000,
    unemploymentDuration: 8,
    status: 'active',
    enrollmentDate: '2024-03-15',
    trainingHoursCompleted: 240,
    credentialsEarned: ['CompTIA A+'],
    skillsGained: ['Semiconductor Fabrication', 'Clean Room Protocols'],
    placed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    programId: '1',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'jwilson@email.com',
    veteranStatus: true,
    disabilityStatus: false,
    barriers: [],
    educationLevel: 'bachelors',
    employedAtEnrollment: false,
    priorWage: 45000,
    unemploymentDuration: 3,
    status: 'completed',
    enrollmentDate: '2024-01-10',
    completionDate: '2024-06-15',
    trainingHoursCompleted: 480,
    credentialsEarned: ['Semiconductor Technician Cert', 'OSHA 10'],
    skillsGained: ['Equipment Maintenance', 'Process Control'],
    placed: true,
    placementDate: '2024-07-01',
    placementEmployer: 'Texas Instruments',
    placementOccupation: 'Process Technician',
    placementWage: 65000,
    retainedAt90Days: true,
    wageGain: 20000,
    wageGainPercent: 44,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_EMPLOYERS: EmployerPartnership[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    employerName: 'Texas Instruments',
    industry: 'Semiconductor Manufacturing',
    naicsCode: '334413',
    contactName: 'Sarah Mitchell',
    contactEmail: 'smitchell@ti.com',
    contactPhone: '555-0456',
    contactTitle: 'Workforce Development Manager',
    city: 'Dallas',
    state: 'TX',
    commitmentTypes: ['hiring_pledge', 'ojt', 'apprenticeship'],
    status: 'active',
    hiringPledgeCount: 150,
    hiredToDate: 89,
    wageCommitment: 55000,
    ojtSlotsOffered: 50,
    ojtSlotsUsed: 32,
    apprenticeshipSlots: 25,
    agreementStartDate: '2024-01-15',
    agreementEndDate: '2026-12-31',
    moaSignedDate: '2024-01-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_REPORTS: ComplianceReport[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    reportType: 'quarterly_progress',
    reportingPeriodStart: '2024-07-01',
    reportingPeriodEnd: '2024-09-30',
    dueDate: '2024-10-31',
    status: 'draft',
    enrollmentCount: 189,
    completionCount: 67,
    placementCount: 58,
    placementRate: 86.5,
    averageWageAtPlacement: 58000,
    averageWageGain: 16500,
    expendituresReported: 2150000,
    veteransEnrolled: 23,
    veteransPlaced: 21,
    preparedBy: 'John Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

interface OverviewTabProps {
  metrics: GovernmentDashboardMetrics;
  programs: WorkforceProgram[];
  participants: ProgramParticipant[];
  employers: EmployerPartnership[];
  reports: ComplianceReport[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ metrics, programs, employers, reports }) => {
  const enrollmentFunnel = [
    { stage: 'Enrolled', count: metrics.totalEnrolled, width: '100%' },
    { stage: 'Completed', count: metrics.completedCount, width: `${(metrics.completedCount / metrics.totalEnrolled) * 100}%` },
    { stage: 'Placed', count: metrics.placedCount, width: `${(metrics.placedCount / metrics.totalEnrolled) * 100}%` }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.activePrograms}</p>
              <p className="text-sm text-gray-400">Active Programs</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.totalEnrolled.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Enrolled</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.overallPlacementRate}%</p>
              <p className="text-sm text-gray-400">Placement Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${(metrics.totalEconomicImpact / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-400">Economic Impact</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Enrollment Funnel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Participant Pipeline
          </h3>
          <div className="space-y-4">
            {enrollmentFunnel.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">{item.stage}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.width }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full"
                  />
                </div>
                <span className="text-sm text-white w-16 text-right">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Enrollment</span>
              <span className="text-white">{metrics.enrollmentTarget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-emerald-400">{metrics.enrollmentProgress}%</span>
            </div>
          </div>
        </div>

        {/* Program Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            Program Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-300">Active Programs</span>
              </div>
              <span className="text-white font-semibold">{metrics.activePrograms}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-300">CHIPS Act Programs</span>
              </div>
              <span className="text-white font-semibold">{metrics.chipsActPrograms}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-gray-300">Programs At Risk</span>
              </div>
              <span className="text-white font-semibold">{metrics.programsAtRisk}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-gray-300">Total Programs</span>
              </div>
              <span className="text-white font-semibold">{metrics.totalPrograms}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Average Wage Gain</span>
          </div>
          <p className="text-xl font-bold text-white">${metrics.averageWageGain.toLocaleString()}</p>
          <p className="text-xs text-emerald-400">+{Math.round((metrics.averageWageGain / metrics.averageWageAtPlacement) * 100)}% increase</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Employer Partners</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics.activeEmployerPartners}</p>
          <p className="text-xs text-blue-400">{metrics.hiringPledgesFulfilled} hires made</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Compliance Score</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics.complianceScore}%</p>
          <p className="text-xs text-purple-400">{metrics.overdueReports} reports overdue</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">ROI Ratio</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics.roiRatio}:1</p>
          <p className="text-xs text-amber-400">Program investment return</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Programs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Programs</h3>
          <div className="space-y-3">
            {programs.slice(0, 4).map((program, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white font-medium">{program.name}</p>
                  <p className="text-sm text-gray-400">
                    {program.currentEnrollment} enrolled • {Math.round((program.placedCount / program.completedCount) * 100) || 0}% placement
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  program.complianceStatus === 'compliant' ? 'bg-emerald-500/20 text-emerald-400' :
                  program.complianceStatus === 'at_risk' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {program.complianceStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Compliance Alerts
          </h3>
          <div className="space-y-3">
            {metrics.overdueReports > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-gray-300">{metrics.overdueReports} Overdue Reports</span>
                </div>
                <span className="text-red-400 text-sm">Action Required</span>
              </div>
            )}
            {metrics.upcomingReports > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-gray-300">{metrics.upcomingReports} Reports Due Soon</span>
                </div>
                <span className="text-amber-400 text-sm">Next 30 Days</span>
              </div>
            )}
            {metrics.programsAtRisk > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-gray-300">{metrics.programsAtRisk} Programs At Risk</span>
                </div>
                <span className="text-orange-400 text-sm">Review Needed</span>
              </div>
            )}
            {reports.filter(r => r.status === 'rejected').length > 0 && (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-gray-300">{reports.filter(r => r.status === 'rejected').length} Rejected Reports</span>
                </div>
                <span className="text-red-400 text-sm">Correction Needed</span>
              </div>
            )}
            {metrics.overdueReports === 0 && metrics.upcomingReports === 0 && metrics.programsAtRisk === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                  <p className="text-gray-400">All compliance requirements met</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employer Partnerships */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          Top Employer Partners
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Employer</th>
                <th className="text-left text-sm text-gray-400 pb-3">Industry</th>
                <th className="text-center text-sm text-gray-400 pb-3">Pledged</th>
                <th className="text-center text-sm text-gray-400 pb-3">Hired</th>
                <th className="text-center text-sm text-gray-400 pb-3">Progress</th>
                <th className="text-right text-sm text-gray-400 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {employers.slice(0, 5).map((employer, idx) => (
                <tr key={idx} className="border-b border-gray-800 last:border-0">
                  <td className="py-3">
                    <p className="text-white font-medium">{employer.employerName}</p>
                    <p className="text-sm text-gray-400">{employer.city}, {employer.state}</p>
                  </td>
                  <td className="py-3 text-gray-300">{employer.industry}</td>
                  <td className="py-3 text-center text-white">{employer.hiringPledgeCount || 0}</td>
                  <td className="py-3 text-center text-emerald-400">{employer.hiredToDate}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (employer.hiredToDate / (employer.hiringPledgeCount || 1)) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {Math.round((employer.hiredToDate / (employer.hiringPledgeCount || 1)) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      employer.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      employer.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {employer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const GovernmentPartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<GovernmentPartner | null>(null);
  const [programs, setPrograms] = useState<WorkforceProgram[]>([]);
  const [participants, setParticipants] = useState<ProgramParticipant[]>([]);
  const [employers, setEmployers] = useState<EmployerPartnership[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [metrics, setMetrics] = useState<GovernmentDashboardMetrics>(SAMPLE_METRICS);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const partner = await getGovernmentPartner(user.id);
      setPartnerInfo(partner);

      if (partner) {
        const [programsData, participantsData, employersData, reportsData, metricsData] = await Promise.all([
          getWorkforcePrograms(partner.id),
          getProgramParticipants(partner.id),
          getEmployerPartnerships(partner.id),
          getComplianceReports(partner.id),
          getGovernmentDashboardMetrics(partner.id)
        ]);

        // Use sample data if no real data exists
        setPrograms(programsData.length > 0 ? programsData : SAMPLE_PROGRAMS);
        setParticipants(participantsData.length > 0 ? participantsData : SAMPLE_PARTICIPANTS);
        setEmployers(employersData.length > 0 ? employersData : SAMPLE_EMPLOYERS);
        setReports(reportsData.length > 0 ? reportsData : SAMPLE_REPORTS);
        setMetrics(metricsData.totalPrograms > 0 ? metricsData : SAMPLE_METRICS);
      } else {
        // Use sample data for demo
        setPrograms(SAMPLE_PROGRAMS);
        setParticipants(SAMPLE_PARTICIPANTS);
        setEmployers(SAMPLE_EMPLOYERS);
        setReports(SAMPLE_REPORTS);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Fall back to sample data
      setPrograms(SAMPLE_PROGRAMS);
      setParticipants(SAMPLE_PARTICIPANTS);
      setEmployers(SAMPLE_EMPLOYERS);
      setReports(SAMPLE_REPORTS);
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-800 rounded-xl animate-pulse" />
              <div>
                <div className="h-7 w-64 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        {/* Tab nav skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse" />
                <div>
                  <div className="h-7 w-16 bg-gray-800 rounded animate-pulse mb-1" />
                  <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
                  <div className="flex-1 h-3 bg-gray-800 rounded-full animate-pulse" />
                  <div className="h-4 w-12 bg-gray-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-800 animate-pulse" />
                    <div className="h-4 w-28 bg-gray-800 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-8 bg-gray-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'programs' as const, label: 'Programs', icon: Briefcase },
    { id: 'participants' as const, label: 'Participants', icon: Users },
    { id: 'employers' as const, label: 'Employers', icon: Building2 },
    { id: 'compliance' as const, label: 'Compliance', icon: FileText },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'policy_impact' as const, label: 'Policy Impact', icon: FlaskConical },
    { id: 'cross_agency' as const, label: 'Cross-Agency', icon: Globe },
    { id: 'clearance_pipeline' as const, label: 'Clearance Pipeline', icon: Shield },
    { id: 'settings' as const, label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state with retry
  if (error && !partnerInfo) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {partnerInfo?.agencyName || 'Government Partner Dashboard'}
                </h1>
                <p className="text-gray-400">
                  {partnerInfo?.agencyType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Workforce Development Agency'}
                  {partnerInfo?.tier && ` • ${partnerInfo.tier.charAt(0).toUpperCase() + partnerInfo.tier.slice(1)} Plan`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-gray-400">Live Data</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            metrics={metrics}
            programs={programs}
            participants={participants}
            employers={employers}
            reports={reports}
          />
        )}
        {activeTab === 'programs' && (
          <ProgramsTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'participants' && (
          <ParticipantsTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'employers' && (
          <EmployersTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'compliance' && (
          <ComplianceTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'policy_impact' && (
          <PolicyImpactTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'cross_agency' && (
          <CrossAgencyTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'clearance_pipeline' && (
          <ClearancePipelineTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            partnerId={partnerInfo?.id || 'sample'}
            tier={partnerInfo?.tier || 'basic'}
            partner={partnerInfo}
          />
        )}
      </div>
    </div>
  );
};

export default GovernmentPartnerDashboard;
