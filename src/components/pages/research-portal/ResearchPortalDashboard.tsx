// ===========================================
// Research Portal Dashboard
// Main dashboard for university researchers
// ===========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Database,
  Shield,
  Settings,
  Plus,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Lock,
  FileCheck,
  BarChart3,
  XCircle
} from 'lucide-react';
import { researchPortalApi } from '@/services/researchPortalApi';

// Import Tab Components
import ApplicationsTab from './dashboard/ApplicationsTab';
import DataRequestsTab from './dashboard/DataRequestsTab';
import SecureDataRoomTab from './dashboard/SecureDataRoomTab';
import FindingsTab from './dashboard/FindingsTab';
import SettingsTab from './dashboard/SettingsTab';

// ===========================================
// TYPES
// ===========================================

interface Researcher {
  id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  title: string;
  irbApproved: boolean;
  ferpaTrainingCompleted: boolean;
}

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  activeDataRequests: number;
  completedStudies: number;
  pendingReviews: number;
}

interface Application {
  id: string;
  title: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewProgress?: number;
}

interface DataRequest {
  id: string;
  title: string;
  dataTypes: string[];
  status: 'pending' | 'approved' | 'active' | 'completed';
  schoolDistricts: string[];
}

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

interface OverviewTabProps {
  stats: DashboardStats;
  recentApplications: Application[];
  recentDataRequests: DataRequest[];
  onTabChange: (tab: TabKey) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  recentApplications,
  recentDataRequests,
  onTabChange
}) => {
  const statCards = [
    {
      label: 'Pending Applications',
      value: stats.pendingApplications,
      icon: FileText,
      color: 'amber',
      subtext: `${stats.totalApplications} total`
    },
    {
      label: 'Active Data Access',
      value: stats.activeDataRequests,
      icon: Database,
      color: 'emerald',
      subtext: 'Currently accessing data'
    },
    {
      label: 'Completed Studies',
      value: stats.completedStudies,
      icon: BarChart3,
      color: 'blue',
      subtext: 'Published findings'
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Clock,
      color: 'indigo',
      subtext: 'Awaiting IRB/FERPA review'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" />
            {status === 'approved' ? 'Approved' : 'Completed'}
          </span>
        );
      case 'under_review':
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            {status === 'under_review' ? 'Under Review' : 'Pending'}
          </span>
        );
      case 'submitted':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
            <FileCheck className="w-3 h-3" />
            Submitted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${
                stat.color === 'amber' ? 'bg-amber-500/20' :
                stat.color === 'emerald' ? 'bg-emerald-500/20' :
                stat.color === 'blue' ? 'bg-blue-500/20' :
                'bg-indigo-500/20'
              }`}>
                <stat.icon size={20} className={`${
                  stat.color === 'amber' ? 'text-amber-400' :
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-indigo-400'
                }`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            {stat.subtext && (
              <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Research Applications
            </h3>
            <button
              onClick={() => onTabChange('applications')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentApplications.slice(0, 4).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-white">{app.title}</p>
                  {app.reviewProgress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Review Progress</span>
                        <span>{app.reviewProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${app.reviewProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
            {recentApplications.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No applications yet
              </div>
            )}
          </div>
          <button
            onClick={() => onTabChange('applications')}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Research Application
          </button>
        </div>

        {/* Data Access Requests */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Data Access
            </h3>
            <button
              onClick={() => onTabChange('data')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentDataRequests.slice(0, 4).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{request.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {request.dataTypes.slice(0, 3).map((type, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  {getStatusBadge(request.status)}
                </div>
              </div>
            ))}
            {recentDataRequests.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No data requests yet
              </div>
            )}
          </div>
          <button
            onClick={() => onTabChange('data')}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-colors"
          >
            <Database className="w-4 h-4" />
            Request Data Access
          </button>
        </div>
      </div>

      {/* Quick Actions & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => onTabChange('applications')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-indigo-400" />
              <span className="text-white">Submit Application</span>
            </button>
            <button
              onClick={() => onTabChange('data')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <Database className="w-5 h-5 text-emerald-400" />
              <span className="text-white">Request Data Access</span>
            </button>
            <button
              onClick={() => onTabChange('secure')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <Lock className="w-5 h-5 text-amber-400" />
              <span className="text-white">Access Secure Data Room</span>
            </button>
            <button
              onClick={() => onTabChange('findings')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-white">Submit Research Findings</span>
            </button>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              FERPA Compliance Status
            </h3>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
              Compliant
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">IRB Approval</span>
              </div>
              <p className="text-sm text-gray-400">Institutional Review Board approved</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">FERPA Training</span>
              </div>
              <p className="text-sm text-gray-400">Annual training completed</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">Data Use Agreement</span>
              </div>
              <p className="text-sm text-gray-400">DUA on file with districts</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">De-identification</span>
              </div>
              <p className="text-sm text-gray-400">k-anonymity verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

type TabKey = 'overview' | 'applications' | 'data' | 'secure' | 'findings' | 'settings';

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'applications', label: 'Applications', icon: FileText },
  { key: 'data', label: 'Data Requests', icon: Database },
  { key: 'secure', label: 'Secure Data Room', icon: Lock },
  { key: 'findings', label: 'Findings', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const ResearchPortalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [researcher, setResearcher] = useState<Researcher | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    activeDataRequests: 0,
    completedStudies: 0,
    pendingReviews: 0
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [recentDataRequests, setRecentDataRequests] = useState<DataRequest[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load researcher info
      const researchers = await researchPortalApi.getResearchers();
      if (researchers.length > 0) {
        const r = researchers[0];
        setResearcher({
          id: r.id,
          name: `${r.firstName} ${r.lastName}`,
          email: r.email,
          institution: r.institution?.name || '',
          department: r.department,
          title: r.title,
          irbApproved: r.citiTrainingCompleted || false,
          ferpaTrainingCompleted: r.citiTrainingCompleted || false,
        });

        // Load dashboard stats
        const dashStats = await researchPortalApi.getResearcherDashboardStats(r.id);
        setStats({
          totalApplications: dashStats.totalApplications,
          pendingApplications: dashStats.pendingApplications,
          approvedApplications: dashStats.activeStudies,
          activeDataRequests: dashStats.applicationsAwaitingAction,
          completedStudies: dashStats.completedStudies,
          pendingReviews: dashStats.pendingApplications,
        });

        // Load recent applications
        const appsResult = await researchPortalApi.getApplications({ researcherId: r.id });
        setRecentApplications(appsResult.applications.map(a => ({
          id: a.id,
          title: a.title,
          status: a.status as Application['status'],
          submittedAt: a.submittedAt,
          reviewProgress: undefined,
        })));

        // Load data requests
        const requests = await researchPortalApi.getDataSharingRequests(r.id);
        setRecentDataRequests(requests.map(req => ({
          id: req.id,
          title: req.applicationId,
          dataTypes: req.dataElements.map(el => el.element),
          status: req.status as DataRequest['status'],
          schoolDistricts: req.schoolIds || [],
        })));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Research Portal</h1>
                <p className="text-gray-400">
                  {researcher?.name || 'Loading...'}
                  {researcher?.institution && ` • ${researcher.institution}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {researcher?.irbApproved && (
                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  IRB Approved
                </span>
              )}
              <Link
                to="/research-resources"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Resources
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && researcher && (
          <OverviewTab
            stats={stats}
            recentApplications={recentApplications}
            recentDataRequests={recentDataRequests}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === 'applications' && researcher && (
          <ApplicationsTab researcherId={researcher.id} />
        )}
        {activeTab === 'data' && researcher && (
          <DataRequestsTab researcherId={researcher.id} />
        )}
        {activeTab === 'secure' && researcher && (
          <SecureDataRoomTab researcherId={researcher.id} />
        )}
        {activeTab === 'findings' && researcher && (
          <FindingsTab researcherId={researcher.id} />
        )}
        {activeTab === 'settings' && researcher && (
          <SettingsTab researcher={researcher} onUpdate={loadDashboardData} />
        )}
      </div>
    </div>
  );
};

export default ResearchPortalDashboard;
