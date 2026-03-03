import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  FileText,
  Building2,
  Calendar,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Clock,
  AlertCircle,
  TrendingUp,
  Percent,
  Banknote,
  Receipt,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import type {
  CompensationRecord,
  PayrollRun,
  PayStub,
  PayrollDeduction,
  DirectDepositAccount,
  TaxDocument,
  PayType,
  PayFrequency,
  PayrollRunStatus
} from '../../../../types/staffManagement';

// Sample Data
const sampleCompensation: CompensationRecord[] = [
  {
    id: '1',
    staffId: 'staff-1',
    staffName: 'Sarah Chen',
    payType: 'salary',
    baseSalary: 95000,
    payFrequency: 'bi-weekly',
    currency: 'USD',
    effectiveDate: '2024-01-01',
    bonusTargetPercent: 10,
    stockOptions: 5000,
    changeReason: 'Annual review',
    changePercent: 5,
    approvedBy: 'HR Director'
  },
  {
    id: '2',
    staffId: 'staff-2',
    staffName: 'Michael Rodriguez',
    payType: 'salary',
    baseSalary: 78000,
    payFrequency: 'bi-weekly',
    currency: 'USD',
    effectiveDate: '2024-03-15',
    bonusTargetPercent: 8,
    changeReason: 'New hire',
    approvedBy: 'HR Director'
  },
  {
    id: '3',
    staffId: 'staff-3',
    staffName: 'Emily Watson',
    payType: 'hourly',
    hourlyRate: 45,
    payFrequency: 'bi-weekly',
    currency: 'USD',
    effectiveDate: '2024-02-01',
    approvedBy: 'HR Director'
  },
  {
    id: '4',
    staffId: 'staff-4',
    staffName: 'Jordan Lee (Intern)',
    payType: 'hourly',
    hourlyRate: 22,
    payFrequency: 'bi-weekly',
    currency: 'USD',
    effectiveDate: '2024-06-01',
    endDate: '2024-08-23',
    changeReason: 'Summer internship',
    approvedBy: 'HR Director'
  }
];

const samplePayrollRuns: PayrollRun[] = [
  {
    id: '1',
    payPeriodStart: '2025-01-13',
    payPeriodEnd: '2025-01-26',
    payDate: '2025-01-31',
    status: 'pending',
    totalGross: 45678.50,
    totalDeductions: 12456.78,
    totalNet: 33221.72,
    totalEmployerTaxes: 3498.21,
    employeeCount: 12,
    preparedBy: 'HR Admin',
    notes: 'Regular bi-weekly payroll'
  },
  {
    id: '2',
    payPeriodStart: '2024-12-30',
    payPeriodEnd: '2025-01-12',
    payDate: '2025-01-17',
    status: 'paid',
    totalGross: 44892.00,
    totalDeductions: 12234.56,
    totalNet: 32657.44,
    totalEmployerTaxes: 3434.24,
    employeeCount: 12,
    preparedBy: 'HR Admin',
    approvedBy: 'Finance Director',
    approvedAt: '2025-01-15T14:30:00Z',
    processedAt: '2025-01-17T08:00:00Z'
  },
  {
    id: '3',
    payPeriodStart: '2024-12-16',
    payPeriodEnd: '2024-12-29',
    payDate: '2025-01-03',
    status: 'paid',
    totalGross: 48234.75,
    totalDeductions: 13145.23,
    totalNet: 35089.52,
    totalEmployerTaxes: 3690.16,
    employeeCount: 13,
    preparedBy: 'HR Admin',
    approvedBy: 'Finance Director',
    approvedAt: '2024-12-31T10:00:00Z',
    processedAt: '2025-01-03T08:00:00Z',
    notes: 'Includes holiday bonus for eligible employees'
  }
];

const samplePayStubs: PayStub[] = [
  {
    id: '1',
    payrollRunId: '2',
    staffId: 'staff-1',
    staffName: 'Sarah Chen',
    payPeriodStart: '2024-12-30',
    payPeriodEnd: '2025-01-12',
    payDate: '2025-01-17',
    regularHours: 80,
    overtimeHours: 0,
    regularPay: 3653.85,
    overtimePay: 0,
    bonus: 0,
    commission: 0,
    otherEarnings: 0,
    grossPay: 3653.85,
    federalTax: 584.62,
    stateTax: 219.23,
    localTax: 0,
    socialSecurity: 226.54,
    medicare: 52.98,
    healthInsurance: 125.00,
    dentalInsurance: 15.00,
    visionInsurance: 8.00,
    retirement401k: 182.69,
    hsaContribution: 50.00,
    garnishments: 0,
    otherDeductions: 0,
    totalDeductions: 1464.06,
    netPay: 2189.79,
    ytdGross: 3653.85,
    ytdFederalTax: 584.62,
    ytdStateTax: 219.23,
    ytdSocialSecurity: 226.54,
    ytdMedicare: 52.98,
    ytdNet: 2189.79,
    paymentMethod: 'direct_deposit'
  }
];

const sampleDeductions: PayrollDeduction[] = [
  {
    id: '1',
    staffId: 'staff-1',
    deductionType: '401k',
    description: 'Retirement contribution',
    amountType: 'percentage',
    amount: 5,
    annualLimit: 23000,
    preTax: true,
    effectiveDate: '2024-01-01',
    isActive: true
  },
  {
    id: '2',
    staffId: 'staff-1',
    deductionType: 'health_insurance',
    description: 'Medical - Family Plan',
    amountType: 'fixed',
    amount: 250.00,
    preTax: true,
    effectiveDate: '2024-01-01',
    isActive: true
  },
  {
    id: '3',
    staffId: 'staff-1',
    deductionType: 'hsa',
    description: 'Health Savings Account',
    amountType: 'fixed',
    amount: 100.00,
    annualLimit: 8300,
    preTax: true,
    effectiveDate: '2024-01-01',
    isActive: true
  }
];

const sampleTaxDocs: TaxDocument[] = [
  {
    id: '1',
    staffId: 'staff-1',
    documentType: 'w2',
    taxYear: 2024,
    status: 'generated',
    generatedAt: '2025-01-15T10:00:00Z',
    isCorrected: false
  },
  {
    id: '2',
    staffId: 'staff-2',
    documentType: 'w2',
    taxYear: 2024,
    status: 'generated',
    generatedAt: '2025-01-15T10:00:00Z',
    isCorrected: false
  },
  {
    id: '3',
    staffId: 'staff-1',
    documentType: 'w4',
    taxYear: 2024,
    status: 'delivered',
    deliveredAt: '2024-01-05T09:00:00Z',
    deliveryMethod: 'electronic',
    isCorrected: false
  }
];

type PayrollTab = 'compensation' | 'payroll_runs' | 'deductions' | 'tax_docs';

const PayrollSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PayrollTab>('compensation');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayRun, setSelectedPayRun] = useState<PayrollRun | null>(null);
  const [selectedPayStub, setSelectedPayStub] = useState<PayStub | null>(null);
  const [showCompensationModal, setShowCompensationModal] = useState(false);
  const [showCreatePayrollModal, setShowCreatePayrollModal] = useState(false);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(samplePayrollRuns);
  const [showPreviewModal, setShowPreviewModal] = useState<PayrollRun | null>(null);

  const handleApprovePayroll = (runId: string) => {
    setPayrollRuns(prev => prev.map(run =>
      run.id === runId
        ? { ...run, status: 'approved' as PayrollRunStatus, approvedBy: 'Current User', approvedAt: new Date().toISOString() }
        : run
    ));
  };

  const handleDownloadReport = (run: PayrollRun) => {
    const csvContent = [
      ['Payroll Report'],
      [`Period: ${run.payPeriodStart} to ${run.payPeriodEnd}`],
      [`Pay Date: ${run.payDate}`],
      [''],
      ['Summary'],
      ['Gross Pay', `$${run.totalGross.toFixed(2)}`],
      ['Deductions', `$${run.totalDeductions.toFixed(2)}`],
      ['Employer Taxes', `$${run.totalEmployerTaxes.toFixed(2)}`],
      ['Net Pay', `$${run.totalNet.toFixed(2)}`],
      ['Employee Count', run.employeeCount.toString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-report-${run.payPeriodStart}-${run.payPeriodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateW2s = () => {
    // Simulate W-2 generation
    alert('W-2 generation started. Documents will be ready shortly.');
  };

  const handleDownloadTaxDoc = (doc: TaxDocument) => {
    // Simulate document download
    const blob = new Blob([`Tax Document ${doc.documentType.toUpperCase()}\nTax Year: ${doc.taxYear}\nEmployee: ${doc.staffId}\nGenerated: ${doc.generatedAt || 'N/A'}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.documentType}-${doc.taxYear}-${doc.staffId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'compensation', label: 'Compensation', icon: DollarSign },
    { id: 'payroll_runs', label: 'Payroll Runs', icon: Calendar },
    { id: 'deductions', label: 'Deductions', icon: Percent },
    { id: 'tax_docs', label: 'Tax Documents', icon: FileText }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPayrollStatusColor = (status: PayrollRunStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'approved': return 'bg-emerald-500/20 text-emerald-400';
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getPayTypeLabel = (payType: PayType) => {
    switch (payType) {
      case 'salary': return 'Salary';
      case 'hourly': return 'Hourly';
      case 'contract': return 'Contract';
      default: return payType;
    }
  };

  const getPayFrequencyLabel = (freq: PayFrequency) => {
    switch (freq) {
      case 'weekly': return 'Weekly';
      case 'bi-weekly': return 'Bi-Weekly';
      case 'semi-monthly': return 'Semi-Monthly';
      case 'monthly': return 'Monthly';
      default: return freq;
    }
  };

  // Stats calculations
  const totalPayroll = samplePayrollRuns
    .filter(pr => pr.status === 'paid')
    .reduce((sum, pr) => sum + pr.totalGross, 0);

  const avgSalary = sampleCompensation
    .filter(c => c.payType === 'salary' && c.baseSalary)
    .reduce((sum, c, _, arr) => sum + (c.baseSalary || 0) / arr.length, 0);

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
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">YTD Payroll</p>
              <p className="text-xl font-bold text-white">{formatCurrency(totalPayroll)}</p>
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
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Avg. Salary</p>
              <p className="text-xl font-bold text-white">{formatCurrency(avgSalary)}</p>
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
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Pending Runs</p>
              <p className="text-xl font-bold text-white">
                {samplePayrollRuns.filter(pr => pr.status === 'pending').length}
              </p>
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
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <FileCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">W-2s Generated</p>
              <p className="text-xl font-bold text-white">
                {sampleTaxDocs.filter(td => td.documentType === 'w2' && td.status === 'generated').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-slate-700/50 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PayrollTab)}
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
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        {activeTab === 'compensation' && (
          <button
            onClick={() => setShowCompensationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Compensation
          </button>
        )}
        {activeTab === 'payroll_runs' && (
          <button
            onClick={() => setShowCreatePayrollModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Payroll Run
          </button>
        )}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'compensation' && (
          <motion.div
            key="compensation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Employee</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Pay Type</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Rate</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Frequency</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Bonus Target</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Effective Date</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {sampleCompensation.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                            {comp.staffName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{comp.staffName}</p>
                            {comp.endDate && (
                              <p className="text-xs text-amber-400">Ends {formatDate(comp.endDate)}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          comp.payType === 'salary' ? 'bg-blue-500/20 text-blue-400' :
                          comp.payType === 'hourly' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {getPayTypeLabel(comp.payType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {comp.payType === 'salary'
                          ? formatCurrency(comp.baseSalary || 0) + '/yr'
                          : formatCurrency(comp.hourlyRate || 0) + '/hr'
                        }
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {getPayFrequencyLabel(comp.payFrequency)}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {comp.bonusTargetPercent ? `${comp.bonusTargetPercent}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {formatDate(comp.effectiveDate)}
                        {comp.changePercent && (
                          <span className="ml-2 text-xs text-emerald-400">+{comp.changePercent}%</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'payroll_runs' && (
          <motion.div
            key="payroll_runs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {payrollRuns.map((run) => (
              <div
                key={run.id}
                className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all cursor-pointer"
                onClick={() => setSelectedPayRun(run)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Pay Period: {formatDate(run.payPeriodStart)} - {formatDate(run.payPeriodEnd)}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Pay Date: {formatDate(run.payDate)} • {run.employeeCount} employees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getPayrollStatusColor(run.status)}`}>
                      {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <p className="text-sm text-slate-400">Gross Pay</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(run.totalGross)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Deductions</p>
                    <p className="text-lg font-bold text-red-400">-{formatCurrency(run.totalDeductions)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Employer Taxes</p>
                    <p className="text-lg font-bold text-amber-400">{formatCurrency(run.totalEmployerTaxes)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Net Pay</p>
                    <p className="text-lg font-bold text-emerald-400">{formatCurrency(run.totalNet)}</p>
                  </div>
                </div>

                {run.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleApprovePayroll(run.id); }}
                    >
                      <Check className="w-4 h-4" />
                      Approve & Process
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      onClick={(e) => { e.stopPropagation(); setShowPreviewModal(run); }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'deductions' && (
          <motion.div
            key="deductions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-white font-medium">Deduction Templates</h3>
                <p className="text-sm text-slate-400">Manage standard deduction types for all employees</p>
              </div>

              <div className="p-4 space-y-3">
                {sampleDeductions.map((ded) => (
                  <div key={ded.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        ded.deductionType === '401k' ? 'bg-purple-500/20' :
                        ded.deductionType === 'health_insurance' ? 'bg-red-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {ded.deductionType === '401k' ? (
                          <Banknote className="w-4 h-4 text-purple-400" />
                        ) : ded.deductionType === 'health_insurance' ? (
                          <Building2 className="w-4 h-4 text-red-400" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{ded.description}</p>
                        <p className="text-sm text-slate-400">
                          {ded.amountType === 'percentage'
                            ? `${ded.amount}% of gross`
                            : formatCurrency(ded.amount) + ' per pay period'
                          }
                          {ded.preTax && <span className="ml-2 text-emerald-400">• Pre-tax</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ded.annualLimit && (
                        <span className="text-sm text-slate-400">
                          Limit: {formatCurrency(ded.annualLimit)}/yr
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ded.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {ded.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-white font-medium mb-4">Tax Withholding Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">Federal Tax</p>
                  <p className="text-lg font-bold text-white">W-4 Based</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">State Tax</p>
                  <p className="text-lg font-bold text-white">State W-4</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">Social Security</p>
                  <p className="text-lg font-bold text-white">6.2%</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400">Medicare</p>
                  <p className="text-lg font-bold text-white">1.45%</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tax_docs' && (
          <motion.div
            key="tax_docs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">2024 Tax Documents</h3>
              <button
                onClick={handleGenerateW2s}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                Generate W-2s
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* W-2 Section */}
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">W-2 Forms</h4>
                      <p className="text-sm text-slate-400">Wage and Tax Statement</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                    {sampleTaxDocs.filter(td => td.documentType === 'w2').length} Generated
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {sampleTaxDocs.filter(td => td.documentType === 'w2').map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white">Employee ID: {doc.staffId}</p>
                        <p className="text-sm text-slate-400">Tax Year {doc.taxYear}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          doc.status === 'generated' ? 'bg-emerald-500/20 text-emerald-400' :
                          doc.status === 'delivered' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                        <button
                          onClick={() => handleDownloadTaxDoc(doc)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* W-4 Section */}
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Receipt className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">W-4 Forms</h4>
                      <p className="text-sm text-slate-400">Employee Withholding Certificate</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {sampleTaxDocs.filter(td => td.documentType === 'w4').length} On File
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {sampleTaxDocs.filter(td => td.documentType === 'w4').map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white">Employee ID: {doc.staffId}</p>
                        <p className="text-sm text-slate-400">
                          Submitted {doc.deliveredAt ? formatDate(doc.deliveredAt) : 'Pending'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          doc.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {doc.status === 'delivered' ? 'Complete' : 'Pending'}
                        </span>
                        <button
                          onClick={() => handleDownloadTaxDoc(doc)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tax Filing Status */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-white font-medium mb-4">Tax Filing Deadlines</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-white">W-2 Distribution Deadline</p>
                      <p className="text-sm text-slate-400">Must be provided to employees</p>
                    </div>
                  </div>
                  <span className="text-amber-400 font-medium">January 31, 2025</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white">W-2 Filing with SSA</p>
                      <p className="text-sm text-slate-400">Electronic filing deadline</p>
                    </div>
                  </div>
                  <span className="text-blue-400 font-medium">March 31, 2025</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay Run Detail Modal */}
      <AnimatePresence>
        {selectedPayRun && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPayRun(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Payroll Run Details</h2>
                  <p className="text-slate-400">
                    {formatDate(selectedPayRun.payPeriodStart)} - {formatDate(selectedPayRun.payPeriodEnd)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayRun(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-400">Total Gross</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(selectedPayRun.totalGross)}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-400">Total Deductions</p>
                    <p className="text-2xl font-bold text-red-400">-{formatCurrency(selectedPayRun.totalDeductions)}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-400">Employer Taxes</p>
                    <p className="text-2xl font-bold text-amber-400">{formatCurrency(selectedPayRun.totalEmployerTaxes)}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-400">Total Net Pay</p>
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedPayRun.totalNet)}</p>
                  </div>
                </div>

                {/* Pay Stubs List */}
                <div>
                  <h3 className="text-white font-medium mb-4">Employee Pay Stubs</h3>
                  <div className="space-y-2">
                    {samplePayStubs.filter(ps => ps.payrollRunId === selectedPayRun.id).map((stub) => (
                      <div
                        key={stub.id}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50"
                        onClick={() => setSelectedPayStub(stub)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-medium">
                            {stub.staffName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{stub.staffName}</p>
                            <p className="text-sm text-slate-400">{stub.regularHours}h regular • {stub.overtimeHours}h OT</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{formatCurrency(stub.netPay)}</p>
                          <p className="text-sm text-slate-400">Net Pay</p>
                        </div>
                      </div>
                    ))}
                    {samplePayStubs.filter(ps => ps.payrollRunId === selectedPayRun.id).length === 0 && (
                      <p className="text-slate-400 text-center py-8">No pay stubs available for this run</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                  <button
                    onClick={() => handleDownloadReport(selectedPayRun)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button
                    onClick={() => alert('Pay stubs viewer would open here with all employee pay stubs for this period.')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View All Stubs
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Payroll Run Modal */}
      {showCreatePayrollModal && (
        <CreatePayrollRunModal
          onClose={() => setShowCreatePayrollModal(false)}
          onSubmit={(newRun) => {
            setPayrollRuns([newRun, ...payrollRuns]);
            setShowCreatePayrollModal(false);
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <PayrollPreviewModal
          run={showPreviewModal}
          onClose={() => setShowPreviewModal(null)}
        />
      )}
    </div>
  );
};

// ===========================================
// CREATE PAYROLL RUN MODAL
// ===========================================

interface CreatePayrollRunModalProps {
  onClose: () => void;
  onSubmit: (run: PayrollRun) => void;
}

const CreatePayrollRunModal: React.FC<CreatePayrollRunModalProps> = ({ onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [payDate, setPayDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!startDate || !endDate || !payDate) return;

    const newRun: PayrollRun = {
      id: `run-${Date.now()}`,
      payPeriodStart: startDate,
      payPeriodEnd: endDate,
      payDate: payDate,
      status: 'pending',
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      totalEmployerTaxes: 0,
      employeeCount: 0,
      preparedBy: 'Current User',
      notes: notes || undefined
    };

    onSubmit(newRun);
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
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Create Payroll Run</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Period Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Period End</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Pay Date</label>
            <input
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none"
              placeholder="e.g., Regular bi-weekly payroll"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
            Create Run
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// PAYROLL PREVIEW MODAL
// ===========================================

interface PayrollPreviewModalProps {
  run: PayrollRun;
  onClose: () => void;
}

const PayrollPreviewModal: React.FC<PayrollPreviewModalProps> = ({ run, onClose }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
        className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Payroll Preview</h2>
          <p className="text-slate-400">
            {formatDate(run.payPeriodStart)} - {formatDate(run.payPeriodEnd)}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <p className="text-sm text-slate-400">Pay Date</p>
              <p className="text-lg font-bold text-white">{formatDate(run.payDate)}</p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <p className="text-sm text-slate-400">Employees</p>
              <p className="text-lg font-bold text-white">{run.employeeCount}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="text-white font-medium mb-4">Payroll Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Gross Pay</span>
                <span className="text-white">{formatCurrency(run.totalGross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Deductions</span>
                <span className="text-red-400">-{formatCurrency(run.totalDeductions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Employer Taxes</span>
                <span className="text-amber-400">{formatCurrency(run.totalEmployerTaxes)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-600">
                <span className="text-white font-medium">Total Net Pay</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(run.totalNet)}</span>
              </div>
            </div>
          </div>

          {run.notes && (
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <p className="text-sm text-slate-400">Notes</p>
              <p className="text-white">{run.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700/50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
            Close Preview
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PayrollSection;
