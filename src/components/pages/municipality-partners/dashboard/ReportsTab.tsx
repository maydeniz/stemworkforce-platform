// ===========================================
// Reports Tab - Municipality Partner Dashboard
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  BarChart3,
  PieChart,
  Filter,
  ChevronDown,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import type { MunicipalityPartnerTier } from '@/types/municipalityPartner';

interface ReportsTabProps {
  partnerId: string;
  tier: MunicipalityPartnerTier;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'compliance' | 'performance' | 'financial' | 'workforce' | 'custom';
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on_demand';
  lastGenerated?: string;
  nextScheduled?: string;
  formats: ('pdf' | 'xlsx' | 'csv')[];
  requiredTier: MunicipalityPartnerTier;
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  generatedAt: string;
  generatedBy: string;
  periodStart: string;
  periodEnd: string;
  format: 'pdf' | 'xlsx' | 'csv';
  fileSize: string;
  status: 'ready' | 'generating' | 'failed';
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'rpt-001',
    name: 'WIOA Youth Performance Report',
    description: 'Quarterly performance metrics for WIOA-funded youth programs including credential attainment, employment outcomes, and measurable skill gains',
    category: 'compliance',
    frequency: 'quarterly',
    lastGenerated: '2025-01-01',
    nextScheduled: '2025-04-01',
    formats: ['pdf', 'xlsx'],
    requiredTier: 'starter'
  },
  {
    id: 'rpt-002',
    name: 'DOL Registered Apprenticeship Report',
    description: 'RAPIDS-compliant reporting for all registered apprenticeship programs including completions, wage progression, and OJT hours',
    category: 'compliance',
    frequency: 'quarterly',
    lastGenerated: '2025-01-15',
    nextScheduled: '2025-04-15',
    formats: ['pdf', 'xlsx'],
    requiredTier: 'professional'
  },
  {
    id: 'rpt-003',
    name: 'SYEP Program Summary',
    description: 'Summer Youth Employment Program outcomes including participant demographics, worksite distribution, and completion rates',
    category: 'performance',
    frequency: 'annual',
    lastGenerated: '2024-09-30',
    formats: ['pdf', 'xlsx', 'csv'],
    requiredTier: 'starter'
  },
  {
    id: 'rpt-004',
    name: 'Department Workforce Pipeline',
    description: 'Analysis of intern-to-hire conversion, apprentice completions, and civil service exam outcomes by department',
    category: 'workforce',
    frequency: 'monthly',
    lastGenerated: '2025-01-31',
    nextScheduled: '2025-02-28',
    formats: ['pdf', 'xlsx'],
    requiredTier: 'professional'
  },
  {
    id: 'rpt-005',
    name: 'Program Cost Analysis',
    description: 'Financial breakdown of program costs including stipends, training, supervision, and cost-per-placement metrics',
    category: 'financial',
    frequency: 'quarterly',
    lastGenerated: '2025-01-01',
    nextScheduled: '2025-04-01',
    formats: ['pdf', 'xlsx'],
    requiredTier: 'professional'
  },
  {
    id: 'rpt-006',
    name: 'Civil Service Pipeline Report',
    description: 'Tracking of program participants through civil service exam process including applications, scores, and placements',
    category: 'workforce',
    frequency: 'monthly',
    lastGenerated: '2025-01-31',
    nextScheduled: '2025-02-28',
    formats: ['pdf', 'xlsx'],
    requiredTier: 'starter'
  },
  {
    id: 'rpt-007',
    name: 'Union Partnership Report',
    description: 'Joint apprenticeship committee metrics, union placement rates, and collective bargaining compliance data',
    category: 'compliance',
    frequency: 'quarterly',
    formats: ['pdf'],
    requiredTier: 'enterprise'
  },
  {
    id: 'rpt-008',
    name: 'Federal Grant Compliance Pack',
    description: 'Comprehensive compliance documentation for CDBG, ARPA, and other federal funding sources',
    category: 'compliance',
    frequency: 'quarterly',
    lastGenerated: '2025-01-15',
    nextScheduled: '2025-04-15',
    formats: ['pdf', 'xlsx'],
    requiredTier: 'enterprise'
  },
  {
    id: 'rpt-009',
    name: 'Participant Demographics Report',
    description: 'Detailed breakdown of participant demographics including age, education, zip code, and program outcomes by cohort',
    category: 'performance',
    frequency: 'monthly',
    lastGenerated: '2025-01-31',
    formats: ['pdf', 'xlsx', 'csv'],
    requiredTier: 'starter'
  },
  {
    id: 'rpt-010',
    name: 'Executive Dashboard Summary',
    description: 'High-level KPI summary for city leadership including ROI metrics, headline statistics, and trend analysis',
    category: 'performance',
    frequency: 'monthly',
    lastGenerated: '2025-01-31',
    nextScheduled: '2025-02-28',
    formats: ['pdf'],
    requiredTier: 'professional'
  }
];

const generatedReports: GeneratedReport[] = [
  {
    id: 'gen-001',
    templateId: 'rpt-001',
    templateName: 'WIOA Youth Performance Report',
    generatedAt: '2025-01-01T09:00:00Z',
    generatedBy: 'System (Scheduled)',
    periodStart: '2024-10-01',
    periodEnd: '2024-12-31',
    format: 'pdf',
    fileSize: '2.4 MB',
    status: 'ready'
  },
  {
    id: 'gen-002',
    templateId: 'rpt-004',
    templateName: 'Department Workforce Pipeline',
    generatedAt: '2025-01-31T08:00:00Z',
    generatedBy: 'System (Scheduled)',
    periodStart: '2025-01-01',
    periodEnd: '2025-01-31',
    format: 'xlsx',
    fileSize: '1.8 MB',
    status: 'ready'
  },
  {
    id: 'gen-003',
    templateId: 'rpt-006',
    templateName: 'Civil Service Pipeline Report',
    generatedAt: '2025-01-31T08:30:00Z',
    generatedBy: 'Maria Santos',
    periodStart: '2025-01-01',
    periodEnd: '2025-01-31',
    format: 'pdf',
    fileSize: '1.2 MB',
    status: 'ready'
  },
  {
    id: 'gen-004',
    templateId: 'rpt-010',
    templateName: 'Executive Dashboard Summary',
    generatedAt: '2025-02-01T10:15:00Z',
    generatedBy: 'Carlos Martinez',
    periodStart: '2025-01-01',
    periodEnd: '2025-01-31',
    format: 'pdf',
    fileSize: '856 KB',
    status: 'ready'
  },
  {
    id: 'gen-005',
    templateId: 'rpt-005',
    templateName: 'Program Cost Analysis',
    generatedAt: '2025-02-05T14:00:00Z',
    generatedBy: 'System (Scheduled)',
    periodStart: '2024-10-01',
    periodEnd: '2024-12-31',
    format: 'xlsx',
    fileSize: '3.1 MB',
    status: 'generating'
  }
];

const categoryConfig = {
  compliance: { label: 'Compliance', color: 'purple', icon: FileText },
  performance: { label: 'Performance', color: 'emerald', icon: TrendingUp },
  financial: { label: 'Financial', color: 'amber', icon: DollarSign },
  workforce: { label: 'Workforce', color: 'blue', icon: Users },
  custom: { label: 'Custom', color: 'slate', icon: BarChart3 }
};

const frequencyLabels = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
  on_demand: 'On Demand'
};

export const ReportsTab: React.FC<ReportsTabProps> = ({ partnerId: _partnerId, tier }) => {
  const [activeView, setActiveView] = useState<'templates' | 'generated'>('templates');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const tierOrder: MunicipalityPartnerTier[] = ['starter', 'professional', 'enterprise'];
  const currentTierIndex = tierOrder.indexOf(tier);

  const availableTemplates = reportTemplates.filter(t => {
    const requiredIndex = tierOrder.indexOf(t.requiredTier);
    return requiredIndex <= currentTierIndex;
  });

  const filteredTemplates = categoryFilter
    ? availableTemplates.filter(t => t.category === categoryFilter)
    : availableTemplates;

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowGenerateModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Reports & Analytics</h2>
          <p className="text-gray-400 text-sm">Generate compliance reports, performance analytics, and custom exports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('templates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'templates'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Report Templates
          </button>
          <button
            onClick={() => setActiveView('generated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'generated'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Generated Reports
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available Templates', value: availableTemplates.length, icon: FileText, color: 'teal' },
          { label: 'Reports This Month', value: 12, icon: BarChart3, color: 'blue' },
          { label: 'Scheduled Reports', value: 5, icon: Calendar, color: 'purple' },
          { label: 'Pending Generation', value: 1, icon: Clock, color: 'amber' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeView === 'templates' ? (
        <>
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === ''
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  categoryFilter === key
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                <config.icon className="w-4 h-4" />
                {config.label}
              </button>
            ))}
          </div>

          {/* Report Templates */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredTemplates.map((template, index) => {
              const config = categoryConfig[template.category];
              const CategoryIcon = config.icon;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-teal-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-${config.color}-500/20 rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`w-4 h-4 text-${config.color}-400`} />
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs bg-${config.color}-500/20 text-${config.color}-400`}>
                        {config.label}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-gray-400">
                      {frequencyLabels[template.frequency]}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {template.lastGenerated && (
                        <span className="text-gray-500">
                          Last: {new Date(template.lastGenerated).toLocaleDateString()}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        {template.formats.map(format => (
                          <span key={format} className="px-1.5 py-0.5 rounded text-xs bg-slate-700 text-gray-400 uppercase">
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateReport(template)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors"
                    >
                      <PieChart className="w-4 h-4" />
                      Generate
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Locked Templates */}
          {reportTemplates.filter(t => tierOrder.indexOf(t.requiredTier) > currentTierIndex).length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-400 mb-4">
                Upgrade to unlock more reports
              </h3>
              <div className="grid md:grid-cols-2 gap-4 opacity-60">
                {reportTemplates
                  .filter(t => tierOrder.indexOf(t.requiredTier) > currentTierIndex)
                  .map(template => {
                    const config = categoryConfig[template.category];
                    return (
                      <div
                        key={template.id}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden"
                      >
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 capitalize">
                          {template.requiredTier} Tier
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-8 h-8 bg-${config.color}-500/20 rounded-lg flex items-center justify-center`}>
                            <config.icon className={`w-4 h-4 text-${config.color}-400`} />
                          </div>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{template.description}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Generated Reports */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-medium">Recent Reports</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white text-sm">
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {generatedReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        report.format === 'pdf' ? 'bg-red-500/20' :
                        report.format === 'xlsx' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          report.format === 'pdf' ? 'text-red-400' :
                          report.format === 'xlsx' ? 'text-emerald-400' : 'text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{report.templateName}</h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-400">{report.generatedBy}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(report.generatedAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-gray-400 uppercase">
                          {report.format}
                        </span>
                        <span className="text-xs text-gray-500">{report.fileSize}</span>
                      </div>

                      {report.status === 'ready' ? (
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      ) : report.status === 'generating' ? (
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg cursor-wait">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Generating...
                        </button>
                      ) : (
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg">
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Upcoming Scheduled Reports</h3>
            <div className="space-y-3">
              {reportTemplates
                .filter(t => t.nextScheduled)
                .sort((a, b) => new Date(a.nextScheduled!).getTime() - new Date(b.nextScheduled!).getTime())
                .slice(0, 5)
                .map(template => (
                  <div key={template.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-white">{template.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(template.nextScheduled!).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowGenerateModal(false)}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg"
          >
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Generate Report</h2>
              <p className="text-gray-400 text-sm">{selectedTemplate.name}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Report Period</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      defaultValue="2025-01-01"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      defaultValue="2025-01-31"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Output Format</label>
                <div className="flex gap-2">
                  {selectedTemplate.formats.map(format => (
                    <label key={format} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700">
                      <input type="radio" name="format" value={format} defaultChecked={format === selectedTemplate.formats[0]} className="text-teal-500" />
                      <span className="text-white uppercase text-sm">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-teal-300">Report will be available in Generated Reports once complete</span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowGenerateModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center gap-2"
              >
                <PieChart className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
