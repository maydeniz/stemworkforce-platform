// @ts-nocheck
// ===========================================
// Communications Tab Component
// Platform announcements, partner communications
// ===========================================

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Megaphone,
  Users,
  Mail,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  ChevronDown,
  Globe,
  Building2,
  GraduationCap,
  Briefcase,
  MessageSquare,
  BarChart3,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: string;
  target_audience: any;
  display_type: string;
  publish_at: string;
  expires_at: string;
  status: string;
  view_count: number;
  click_count: number;
  dismiss_count: number;
  created_by: string;
  created_at: string;
}

interface PartnerCommunication {
  id: string;
  organization_id: string;
  organization_name: string;
  subject: string;
  message_type: string;
  content: string;
  sent_at: string;
  sent_by: string;
  read_at: string;
  response_content: string;
  response_at: string;
  status: string;
  priority: string;
}

const CommunicationsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [partnerComms, setPartnerComms] = useState<PartnerCommunication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showCommModal, setShowCommModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for demonstration
  const sampleAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'New CHIPS Act Funding Round Opens',
      content: 'The Department of Commerce has announced a new funding round for semiconductor manufacturing facilities. Apply by March 15, 2025.',
      announcement_type: 'funding',
      target_audience: { industries: ['semiconductor'], roles: ['all'] },
      display_type: 'banner',
      publish_at: '2025-01-15T00:00:00Z',
      expires_at: '2025-03-15T23:59:59Z',
      status: 'published',
      view_count: 15420,
      click_count: 2340,
      dismiss_count: 890,
      created_by: 'admin@stemworkforce.gov',
      created_at: '2025-01-10T10:00:00Z',
    },
    {
      id: '2',
      title: 'Platform Maintenance - January 25th',
      content: 'Scheduled maintenance window from 2:00 AM - 6:00 AM EST. Some features may be temporarily unavailable.',
      announcement_type: 'maintenance',
      target_audience: { roles: ['all'] },
      display_type: 'modal',
      publish_at: '2025-01-20T00:00:00Z',
      expires_at: '2025-01-26T00:00:00Z',
      status: 'scheduled',
      view_count: 0,
      click_count: 0,
      dismiss_count: 0,
      created_by: 'admin@stemworkforce.gov',
      created_at: '2025-01-18T14:30:00Z',
    },
    {
      id: '3',
      title: 'New Healthcare IT Certification Pathways',
      content: 'Explore new certification programs for Epic, Cerner, and other EHR systems now available on the training portal.',
      announcement_type: 'feature',
      target_audience: { industries: ['healthcare'], roles: ['job_seeker', 'student'] },
      display_type: 'toast',
      publish_at: '2025-01-12T00:00:00Z',
      expires_at: '2025-02-12T23:59:59Z',
      status: 'published',
      view_count: 8930,
      click_count: 1205,
      dismiss_count: 445,
      created_by: 'content@stemworkforce.gov',
      created_at: '2025-01-11T09:00:00Z',
    },
    {
      id: '4',
      title: 'DOE National Lab Virtual Career Fair',
      content: 'Join us for a virtual career fair featuring opportunities at all 17 DOE National Laboratories. February 20-22, 2025.',
      announcement_type: 'event',
      target_audience: { industries: ['nuclear', 'clean_energy', 'quantum'], roles: ['all'] },
      display_type: 'banner',
      publish_at: '2025-02-01T00:00:00Z',
      expires_at: '2025-02-23T00:00:00Z',
      status: 'draft',
      view_count: 0,
      click_count: 0,
      dismiss_count: 0,
      created_by: 'events@stemworkforce.gov',
      created_at: '2025-01-19T11:00:00Z',
    },
  ];

  const samplePartnerComms: PartnerCommunication[] = [
    {
      id: '1',
      organization_id: 'org-1',
      organization_name: 'Intel Corporation',
      subject: 'Q1 2025 Hiring Pipeline Update',
      message_type: 'update',
      content: 'We are pleased to report strong candidate engagement through the platform. We have filled 45 positions through STEM Workforce in Q4.',
      sent_at: '2025-01-15T14:00:00Z',
      sent_by: 'partner_relations@stemworkforce.gov',
      read_at: '2025-01-15T16:30:00Z',
      response_content: 'Thank you for the update. We are excited about expanding our partnership in 2025.',
      response_at: '2025-01-16T09:00:00Z',
      status: 'responded',
      priority: 'normal',
    },
    {
      id: '2',
      organization_id: 'org-2',
      organization_name: 'Mayo Clinic',
      subject: 'HIPAA Compliance Verification Required',
      message_type: 'compliance',
      content: 'Please submit your updated BAA and provide documentation of HIPAA training completion for all platform users.',
      sent_at: '2025-01-18T10:00:00Z',
      sent_by: 'compliance@stemworkforce.gov',
      read_at: '2025-01-18T11:45:00Z',
      response_content: '',
      response_at: '',
      status: 'read',
      priority: 'high',
    },
    {
      id: '3',
      organization_id: 'org-3',
      organization_name: 'MIT Lincoln Laboratory',
      subject: 'New Security Clearance Integration',
      message_type: 'feature',
      content: 'We have enabled new security clearance verification features. Please review the integration documentation.',
      sent_at: '2025-01-17T08:00:00Z',
      sent_by: 'security@stemworkforce.gov',
      read_at: '',
      response_content: '',
      response_at: '',
      status: 'sent',
      priority: 'normal',
    },
    {
      id: '4',
      organization_id: 'org-4',
      organization_name: 'Sandia National Laboratories',
      subject: 'Quantum Technologies Workforce Initiative',
      message_type: 'opportunity',
      content: 'Invitation to participate in the new Quantum Technologies Workforce Development Initiative launching Q2 2025.',
      sent_at: '2025-01-19T13:00:00Z',
      sent_by: 'initiatives@stemworkforce.gov',
      read_at: '2025-01-19T14:15:00Z',
      response_content: 'We are very interested in participating. Please schedule a call to discuss.',
      response_at: '2025-01-19T15:00:00Z',
      status: 'responded',
      priority: 'high',
    },
  ];

  useEffect(() => {
    loadData();
  }, [activeSubTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // In production, fetch from Supabase
      // For now, use sample data
      setAnnouncements(sampleAnnouncements);
      setPartnerComms(samplePartnerComms);
    } catch (error) {
      console.error('Error loading communications data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'responded':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'scheduled':
      case 'sent':
        return 'bg-blue-500/20 text-blue-400';
      case 'draft':
        return 'bg-slate-500/20 text-slate-400';
      case 'read':
        return 'bg-amber-500/20 text-amber-400';
      case 'expired':
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'normal':
        return 'bg-blue-500/20 text-blue-400';
      case 'low':
        return 'bg-slate-500/20 text-slate-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'funding':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'feature':
        return <Bell className="w-4 h-4 text-blue-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'update':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'compliance':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'opportunity':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      default:
        return <Megaphone className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredComms = partnerComms.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery && !c.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Stats calculations
  const activeAnnouncements = announcements.filter((a) => a.status === 'published').length;
  const scheduledAnnouncements = announcements.filter((a) => a.status === 'scheduled').length;
  const totalViews = announcements.reduce((sum, a) => sum + a.view_count, 0);
  const totalClicks = announcements.reduce((sum, a) => sum + a.click_count, 0);
  const engagementRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

  const pendingResponses = partnerComms.filter((c) => c.status === 'sent' || c.status === 'read').length;
  const respondedComms = partnerComms.filter((c) => c.status === 'responded').length;
  const highPriorityComms = partnerComms.filter((c) => c.priority === 'high').length;

  const subTabs = [
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'partner-comms', label: 'Partner Communications', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setFilterStatus('all');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSubTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements Sub-tab */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-white">{activeAnnouncements}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <Megaphone className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Scheduled</p>
                  <p className="text-2xl font-bold text-white">{scheduledAnnouncements}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Views</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(totalViews)}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(totalClicks)}</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Engagement Rate</p>
                  <p className="text-2xl font-bold text-white">{engagementRate}%</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowAnnouncementModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Announcement
            </button>
          </div>

          {/* Announcements Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Announcement
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Display
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Loading announcements...
                    </td>
                  </tr>
                ) : filteredAnnouncements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No announcements found
                    </td>
                  </tr>
                ) : (
                  filteredAnnouncements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-white font-medium">{announcement.title}</p>
                          <p className="text-sm text-slate-400 truncate max-w-xs">
                            {announcement.content}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(announcement.announcement_type)}
                          <span className="text-slate-300 capitalize">
                            {announcement.announcement_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-slate-300 capitalize">{announcement.display_type}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            announcement.status
                          )}`}
                        >
                          {announcement.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-slate-300">
                            Start: {formatDate(announcement.publish_at)}
                          </p>
                          <p className="text-slate-400">
                            End: {formatDate(announcement.expires_at)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-slate-300">
                            {formatNumber(announcement.view_count)} views
                          </p>
                          <p className="text-slate-400">
                            {formatNumber(announcement.click_count)} clicks
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(announcement);
                              setShowAnnouncementModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-red-400" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Partner Communications Sub-tab */}
      {activeSubTab === 'partner-comms' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Sent</p>
                  <p className="text-2xl font-bold text-white">{partnerComms.length}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Send className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Awaiting Response</p>
                  <p className="text-2xl font-bold text-white">{pendingResponses}</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Responded</p>
                  <p className="text-2xl font-bold text-white">{respondedComms}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">High Priority</p>
                  <p className="text-2xl font-bold text-white">{highPriorityComms}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search partners or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowCommModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Message
            </button>
          </div>

          {/* Communications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading communications...</div>
            ) : filteredComms.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No communications found</div>
            ) : (
              filteredComms.map((comm) => (
                <div
                  key={comm.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{comm.organization_name}</h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                              comm.priority
                            )}`}
                          >
                            {comm.priority}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1">{comm.subject}</p>
                        <p className="text-sm text-slate-400 mt-2">{comm.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                          <span>Sent: {formatDate(comm.sent_at)}</span>
                          {comm.read_at && <span>Read: {formatDate(comm.read_at)}</span>}
                          {comm.response_at && <span>Responded: {formatDate(comm.response_at)}</span>}
                        </div>
                        {comm.response_content && (
                          <div className="mt-3 p-3 bg-slate-800 rounded-lg border-l-2 border-emerald-500">
                            <p className="text-xs text-slate-400 mb-1">Response:</p>
                            <p className="text-sm text-slate-300">{comm.response_content}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          comm.status
                        )}`}
                      >
                        {comm.status}
                      </span>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(comm.message_type)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">
                {selectedItem ? 'Edit Announcement' : 'New Announcement'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  defaultValue={selectedItem?.title || ''}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                <textarea
                  defaultValue={selectedItem?.content || ''}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Announcement content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                  <select
                    defaultValue={selectedItem?.announcement_type || 'feature'}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="feature">Feature</option>
                    <option value="funding">Funding</option>
                    <option value="event">Event</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="policy">Policy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Display Type</label>
                  <select
                    defaultValue={selectedItem?.display_type || 'banner'}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="banner">Banner</option>
                    <option value="modal">Modal</option>
                    <option value="toast">Toast</option>
                    <option value="inline">Inline</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Publish Date</label>
                  <input
                    type="datetime-local"
                    defaultValue={selectedItem?.publish_at ? selectedItem.publish_at.slice(0, 16) : ''}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Expires</label>
                  <input
                    type="datetime-local"
                    defaultValue={selectedItem?.expires_at ? selectedItem.expires_at.slice(0, 16) : ''}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                Save as Draft
              </button>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Communication Modal */}
      {showCommModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">New Partner Message</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Partner Organization</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select partner...</option>
                  <option value="org-1">Intel Corporation</option>
                  <option value="org-2">Mayo Clinic</option>
                  <option value="org-3">MIT Lincoln Laboratory</option>
                  <option value="org-4">Sandia National Laboratories</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message Type</label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="update">Update</option>
                    <option value="compliance">Compliance</option>
                    <option value="feature">Feature</option>
                    <option value="opportunity">Opportunity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Write your message..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCommModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationsTab;
