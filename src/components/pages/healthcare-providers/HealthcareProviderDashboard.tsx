// ===========================================
// Healthcare Provider Dashboard
// Main dashboard for verified healthcare providers
// ===========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Activity,
  Syringe,
  MessageSquare,
  Settings,
  Plus,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Stethoscope,
  Shield,
  Smile,
  Bell,
  School
} from 'lucide-react';
import { healthcareProviderApi } from '@/services/healthcareProviderApi';
import type {
  UIMedicalExcuse as MedicalExcuse,
  UISportsPhysical as SportsPhysical,
  UISecureMessage as SecureMessage,
  UIProviderDashboardStats as ProviderDashboardStats
} from '@/types/healthcareProvider';

// UI-friendly HealthcareProvider type for dashboard
interface UIHealthcareProvider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  specialty: string;
  credentials?: string[];
  npiNumber?: string;
  npiVerified?: boolean;
  licenses?: Array<{
    type: string;
    number: string;
    state: string;
    status: string;
    expirationDate: string;
  }>;
}

// Import Tab Components
import MedicalExcusesTab from './dashboard/MedicalExcusesTab';
import SportsPhysicalsTab from './dashboard/SportsPhysicalsTab';
import DentalScreeningsTab from './dashboard/DentalScreeningsTab';
import MessagingTab from './dashboard/MessagingTab';
import SettingsTab from './dashboard/SettingsTab';
import SchoolCoordinationTab from './dashboard/SchoolCoordinationTab';

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

interface OverviewTabProps {
  stats: ProviderDashboardStats;
  recentExcuses: MedicalExcuse[];
  recentPhysicals: SportsPhysical[];
  recentMessages: SecureMessage[];
  onTabChange: (tab: TabKey) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  recentExcuses,
  recentPhysicals,
  recentMessages,
  onTabChange
}) => {
  const statCards = [
    {
      label: 'Pending Excuses',
      value: stats.pendingExcuses,
      icon: FileText,
      color: 'amber',
      subtext: `${stats.totalExcuses} total`
    },
    {
      label: 'Sports Physicals',
      value: stats.activePhysicals,
      icon: Activity,
      color: 'emerald',
      subtext: 'Active this year'
    },
    {
      label: 'Immunizations',
      value: stats.immunizationsDue,
      icon: Syringe,
      color: 'blue',
      subtext: 'Due for update'
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'indigo',
      subtext: `${stats.totalMessages} total`
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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
              {stat.value > 0 && stat.color === 'amber' && (
                <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full">
                  <Bell className="w-3 h-3" />
                  Action needed
                </span>
              )}
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
        {/* Recent Medical Excuses */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Recent Medical Excuses
            </h3>
            <button
              onClick={() => onTabChange('excuses')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentExcuses.slice(0, 4).map((excuse) => (
              <div key={excuse.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(excuse.status)}
                  <div>
                    <p className="font-medium text-white">{excuse.studentName}</p>
                    <p className="text-sm text-gray-400">
                      {excuse.excuseType.replace('_', ' ')} • {excuse.schoolName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {new Date(excuse.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentExcuses.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No medical excuses yet
              </div>
            )}
          </div>
          <button
            onClick={() => onTabChange('excuses')}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Excuse
          </button>
        </div>

        {/* Recent Sports Physicals */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Sports Physicals
            </h3>
            <button
              onClick={() => onTabChange('physicals')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentPhysicals.slice(0, 4).map((physical) => (
              <div key={physical.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(physical.status)}
                  <div>
                    <p className="font-medium text-white">{physical.studentName}</p>
                    <p className="text-sm text-gray-400">
                      {physical.sports.join(', ')} • Expires {new Date(physical.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    physical.clearanceLevel === 'full'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : physical.clearanceLevel === 'limited'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {physical.clearanceLevel}
                  </span>
                </div>
              </div>
            ))}
            {recentPhysicals.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No sports physicals on file
              </div>
            )}
          </div>
          <button
            onClick={() => onTabChange('physicals')}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Sports Physical
          </button>
        </div>
      </div>

      {/* Quick Actions & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => onTabChange('excuses')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-amber-400" />
              <span className="text-white">Submit Medical Excuse</span>
            </button>
            <button
              onClick={() => onTabChange('physicals')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="text-white">Complete Sports Physical</span>
            </button>
            <button
              onClick={() => onTabChange('dental')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <Smile className="w-5 h-5 text-blue-400" />
              <span className="text-white">Submit Dental Screening</span>
            </button>
            <button
              onClick={() => onTabChange('messages')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span className="text-white">Message School Nurse</span>
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Recent Messages
            </h3>
            <button
              onClick={() => onTabChange('messages')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentMessages.slice(0, 3).map((message) => (
              <div key={message.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  message.isRead ? 'bg-gray-700' : 'bg-indigo-500/20'
                }`}>
                  <MessageSquare className={`w-5 h-5 ${
                    message.isRead ? 'text-gray-400' : 'text-indigo-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">
                      {message.senderName}
                      {!message.isRead && (
                        <span className="ml-2 w-2 h-2 bg-indigo-400 rounded-full inline-block" />
                      )}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{message.subject}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{message.content}</p>
                </div>
              </div>
            ))}
            {recentMessages.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No messages yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            HIPAA Compliance Status
          </h3>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
            Compliant
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">NPI Verified</span>
            </div>
            <p className="text-sm text-gray-400">Provider credentials active</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">Encryption Active</span>
            </div>
            <p className="text-sm text-gray-400">All messages encrypted</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">Audit Logging</span>
            </div>
            <p className="text-sm text-gray-400">All actions tracked</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">BAA on File</span>
            </div>
            <p className="text-sm text-gray-400">Business Associate Agreement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

type TabKey = 'overview' | 'excuses' | 'physicals' | 'dental' | 'schools' | 'messages' | 'settings';

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'excuses', label: 'Medical Excuses', icon: FileText },
  { key: 'physicals', label: 'Sports Physicals', icon: Activity },
  { key: 'dental', label: 'Dental Screenings', icon: Smile },
  { key: 'schools', label: 'Schools', icon: School },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const HealthcareProviderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<UIHealthcareProvider | null>(null);
  const [stats, setStats] = useState<ProviderDashboardStats>({
    totalExcuses: 0,
    pendingExcuses: 0,
    approvedExcuses: 0,
    activePhysicals: 0,
    expiringSoonPhysicals: 0,
    immunizationsDue: 0,
    unreadMessages: 0,
    totalMessages: 0,
    pendingDentalScreenings: 0
  });
  const [recentExcuses, setRecentExcuses] = useState<MedicalExcuse[]>([]);
  const [recentPhysicals, setRecentPhysicals] = useState<SportsPhysical[]>([]);
  const [recentMessages, setRecentMessages] = useState<SecureMessage[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load provider info using UI method
      const providers = await healthcareProviderApi.getUIProviders();
      if (providers.length > 0) {
        setProvider(providers[0]);

        // Load dashboard stats using UI method
        const dashboardStats = await healthcareProviderApi.getUIDashboardStats(providers[0].id);
        setStats(dashboardStats);

        // Load recent data using UI methods
        const excuses = await healthcareProviderApi.getUIExcuses({ providerId: providers[0].id });
        setRecentExcuses(excuses);

        const physicals = await healthcareProviderApi.getUISportsPhysicals({ providerId: providers[0].id });
        setRecentPhysicals(physicals);

        // Load messages from threads
        const threads = await healthcareProviderApi.getMessageThreads(providers[0].id);
        const messages = threads.flatMap(t =>
          (t.messages || []).map(m => ({
            id: m.id,
            threadId: m.threadId,
            senderId: m.senderId,
            senderName: m.senderName,
            senderRole: m.senderType,
            recipientId: m.recipientId,
            subject: m.subject,
            content: m.body,
            isRead: m.read,
            isHIPAAProtected: m.containsPHI,
            createdAt: m.createdAt,
          }))
        );
        setRecentMessages(messages);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Healthcare Provider Portal</h1>
                <p className="text-gray-400">
                  {provider?.name || 'Loading...'}
                  {provider?.credentials && ` • ${provider.credentials.join(', ')}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {provider?.npiVerified && (
                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  NPI Verified
                </span>
              )}
              <Link
                to="/healthcare-provider-resources"
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
              const hasNotification = tab.key === 'excuses' && stats.pendingExcuses > 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors relative ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {hasNotification && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.pendingExcuses}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && provider && (
          <OverviewTab
            stats={stats}
            recentExcuses={recentExcuses}
            recentPhysicals={recentPhysicals}
            recentMessages={recentMessages}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === 'excuses' && provider && (
          <MedicalExcusesTab providerId={provider.id} />
        )}
        {activeTab === 'physicals' && provider && (
          <SportsPhysicalsTab providerId={provider.id} />
        )}
        {activeTab === 'dental' && provider && (
          <DentalScreeningsTab providerId={provider.id} />
        )}
        {activeTab === 'schools' && provider && (
          <SchoolCoordinationTab providerId={provider.id} />
        )}
        {activeTab === 'messages' && provider && (
          <MessagingTab providerId={provider.id} />
        )}
        {activeTab === 'settings' && provider && (
          <SettingsTab provider={provider} onUpdate={loadDashboardData} />
        )}
      </div>
    </div>
  );
};

export default HealthcareProviderDashboard;
