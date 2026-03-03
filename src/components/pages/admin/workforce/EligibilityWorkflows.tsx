import React, { useState, useMemo, useCallback } from 'react';
import {
  Settings,
  FileText,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  Save,
  Play,
  RefreshCw,
  Shield,
  Clock,
  Send,
  GripVertical,
  X,
  AlertCircle,
} from 'lucide-react';
import type {
  EligibilityWorkflow,
  EligibilityCriterion,
  WIOAProgram,
  WorkflowStatus,
  ValidationLevel,
  CriterionType,
  FederalBaselineTemplate,
  WorkflowTestCase,
  WorkflowTestResult,
} from '@/types/eligibilityWorkflows';

// Sample LWDB data
const SAMPLE_LWDBS = [
  { id: 'lwdb-1', name: 'CareerSource Tampa Bay' },
  { id: 'lwdb-2', name: 'CareerSource Central Florida' },
  { id: 'lwdb-3', name: 'CareerSource South Florida' },
];

// Program display names
const PROGRAM_NAMES: Record<WIOAProgram, string> = {
  adult: 'Adult Program',
  dislocated_worker: 'Dislocated Worker',
  youth: 'Youth Program',
  national_dislocated_worker_grants: 'National DW Grants',
};

// Status badge colors
const STATUS_COLORS: Record<WorkflowStatus, string> = {
  draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  archived: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

// Validation level icons and colors
const VALIDATION_CONFIG: Record<ValidationLevel, { icon: React.ElementType; color: string; label: string }> = {
  blocking: { icon: AlertCircle, color: 'text-red-400', label: 'Blocking' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-400', label: 'Info' },
};

// Criterion type labels
const CRITERION_TYPE_LABELS: Record<CriterionType, string> = {
  age: 'Age',
  citizenship: 'Citizenship/Work Authorization',
  selective_service: 'Selective Service',
  employment_status: 'Employment Status',
  income: 'Income Level',
  public_assistance: 'Public Assistance',
  disability: 'Disability',
  veteran_status: 'Veteran Status',
  education_level: 'Education Level',
  english_proficiency: 'English Proficiency',
  basic_skills_deficient: 'Basic Skills',
  foster_care: 'Foster Care',
  homeless: 'Homeless/Runaway',
  runaway: 'Runaway',
  offender: 'Justice System Involvement',
  pregnant_parenting: 'Pregnant/Parenting',
  needs_additional_assistance: 'Additional Assistance Need',
  layoff_notice: 'Layoff Notice',
  plant_closure: 'Plant Closure',
  self_employed_closure: 'Self-Employment Closure',
  displaced_homemaker: 'Displaced Homemaker',
  military_spouse: 'Military Spouse',
  custom: 'Custom Criterion',
};

// Sample federal baseline templates
const FEDERAL_TEMPLATES: FederalBaselineTemplate[] = [
  {
    program: 'adult',
    name: 'WIOA Adult Program Baseline',
    description: 'Federal baseline eligibility criteria for WIOA Title I Adult Program',
    criteria: [
      {
        type: 'age',
        name: 'Age Requirement',
        name_es: 'Requisito de Edad',
        description: 'Must be 18 years of age or older',
        description_es: 'Debe tener 18 años o más',
        value: { type: 'number', operator: 'greater_than_or_equal', value: 18 },
        validationLevel: 'blocking',
        errorMessage: 'Participant must be at least 18 years old',
        errorMessage_es: 'El participante debe tener al menos 18 años',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 1,
      },
      {
        type: 'citizenship',
        name: 'Authorization to Work',
        name_es: 'Autorización para Trabajar',
        description: 'Must be a citizen or authorized to work in the United States',
        description_es: 'Debe ser ciudadano o estar autorizado para trabajar en Estados Unidos',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'blocking',
        errorMessage: 'Participant must be authorized to work in the United States',
        errorMessage_es: 'El participante debe estar autorizado para trabajar en Estados Unidos',
        documentRequirements: [
          { documentType: 'work_authorization', required: true, alternativeDocuments: ['passport', 'drivers_license'], description: 'Proof of work authorization' },
        ],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 2,
      },
      {
        type: 'selective_service',
        name: 'Selective Service Registration',
        name_es: 'Registro del Servicio Selectivo',
        description: 'Males born on or after January 1, 1960 must be registered with Selective Service',
        description_es: 'Los hombres nacidos el o después del 1 de enero de 1960 deben estar registrados en el Servicio Selectivo',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'blocking',
        errorMessage: 'Male participants must be registered with Selective Service',
        errorMessage_es: 'Los participantes masculinos deben estar registrados en el Servicio Selectivo',
        documentRequirements: [
          { documentType: 'selective_service_registration', required: true, description: 'Selective Service registration proof' },
        ],
        isFederalRequirement: true,
        allowOverride: true,
        overrideRequiresApproval: true,
        sortOrder: 3,
        conditions: [
          { criterionId: 'gender', operator: 'equals', value: 'male' },
        ],
      },
    ],
    priorityPopulations: [
      { name: 'Veterans and Eligible Spouses', description: 'Veterans and eligible spouses of veterans', priorityLevel: 1, criteria: [] },
      { name: 'Recipients of Public Assistance', description: 'Recipients of public assistance or low-income individuals', priorityLevel: 2, criteria: [] },
    ],
    defaultSettings: {
      enableAutoDetermination: true,
      autoDeterminationThreshold: 90,
      requireCaseManagerReview: true,
      reviewTimeoutDays: 5,
    },
    lastUpdated: '2024-01-15',
    regulatoryReference: 'WIOA Section 3(2), 20 CFR 680.120',
  },
  {
    program: 'dislocated_worker',
    name: 'WIOA Dislocated Worker Program Baseline',
    description: 'Federal baseline eligibility criteria for WIOA Title I Dislocated Worker Program',
    criteria: [
      {
        type: 'citizenship',
        name: 'Authorization to Work',
        description: 'Must be a citizen or authorized to work in the United States',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'blocking',
        errorMessage: 'Participant must be authorized to work in the United States',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 1,
      },
      {
        type: 'layoff_notice',
        name: 'Layoff or Termination Notice',
        name_es: 'Aviso de Despido',
        description: 'Has been terminated or laid off, or received notice of termination',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'blocking',
        errorMessage: 'Must have been laid off or received notice of layoff',
        documentRequirements: [
          { documentType: 'layoff_notice', required: true, description: 'Layoff notice or termination letter' },
        ],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 2,
        groupId: 'dw_category',
        groupOperator: 'any',
      },
      {
        type: 'plant_closure',
        name: 'Plant Closure or Substantial Layoff',
        description: 'Employed at a facility with announced closure or substantial layoff',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'blocking',
        errorMessage: 'Must be affected by plant closure or substantial layoff',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 3,
        groupId: 'dw_category',
        groupOperator: 'any',
      },
      {
        type: 'displaced_homemaker',
        name: 'Displaced Homemaker',
        description: 'Individual who was dependent on income of another family member but is no longer supported',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'blocking',
        errorMessage: 'Must meet displaced homemaker criteria',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 4,
        groupId: 'dw_category',
        groupOperator: 'any',
      },
    ],
    priorityPopulations: [
      { name: 'Veterans and Eligible Spouses', description: 'Veterans and eligible spouses of veterans', priorityLevel: 1, criteria: [] },
      { name: 'Long-Term Unemployed', description: 'Unemployed for 27+ consecutive weeks', priorityLevel: 2, criteria: [] },
    ],
    defaultSettings: {
      enableAutoDetermination: true,
      autoDeterminationThreshold: 85,
      requireCaseManagerReview: true,
    },
    lastUpdated: '2024-01-15',
    regulatoryReference: 'WIOA Section 3(15), 20 CFR 680.130',
  },
  {
    program: 'youth',
    name: 'WIOA Youth Program Baseline',
    description: 'Federal baseline eligibility criteria for WIOA Title I Youth Program',
    criteria: [
      {
        type: 'age',
        name: 'Age Requirement (In-School Youth)',
        description: 'In-school youth must be 14-21 years old',
        value: { type: 'number', operator: 'between', value: 14, minValue: 14, maxValue: 21 },
        validationLevel: 'blocking',
        errorMessage: 'In-school youth must be between 14 and 21 years old',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 1,
        groupId: 'age_group',
        groupOperator: 'any',
      },
      {
        type: 'age',
        name: 'Age Requirement (Out-of-School Youth)',
        description: 'Out-of-school youth must be 16-24 years old',
        value: { type: 'number', operator: 'between', value: 16, minValue: 16, maxValue: 24 },
        validationLevel: 'blocking',
        errorMessage: 'Out-of-school youth must be between 16 and 24 years old',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 2,
        groupId: 'age_group',
        groupOperator: 'any',
      },
      {
        type: 'income',
        name: 'Low-Income Requirement',
        description: 'Family income at or below poverty line or 70% LLSIL',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'blocking',
        errorMessage: 'Must meet low-income criteria',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 3,
      },
      {
        type: 'basic_skills_deficient',
        name: 'Basic Skills Deficient',
        description: 'Reading, writing, or computing skills below 8th grade level',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'info',
        errorMessage: 'Youth is basic skills deficient',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 4,
        groupId: 'barrier',
        groupOperator: 'any',
      },
      {
        type: 'homeless',
        name: 'Homeless or Runaway',
        description: 'Youth experiencing homelessness',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'info',
        errorMessage: 'Youth is homeless or runaway',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 5,
        groupId: 'barrier',
        groupOperator: 'any',
      },
      {
        type: 'foster_care',
        name: 'In Foster Care or Aged Out',
        description: 'Currently or formerly in foster care',
        value: { type: 'boolean', operator: 'equals', value: true },
        validationLevel: 'info',
        errorMessage: 'Youth is in or aged out of foster care',
        documentRequirements: [],
        isFederalRequirement: true,
        allowOverride: false,
        overrideRequiresApproval: false,
        sortOrder: 6,
        groupId: 'barrier',
        groupOperator: 'any',
      },
    ],
    priorityPopulations: [
      { name: 'Out-of-School Youth', description: 'Not attending any school', priorityLevel: 1, criteria: [] },
      { name: 'Youth with Multiple Barriers', description: 'Youth facing 2 or more barriers', priorityLevel: 2, criteria: [] },
    ],
    defaultSettings: {
      enableAutoDetermination: true,
      autoDeterminationThreshold: 80,
      requireCaseManagerReview: true,
      eligibilityValidDays: 365,
    },
    lastUpdated: '2024-01-15',
    regulatoryReference: 'WIOA Section 129, 20 CFR 681',
  },
];

// Sample workflows for demonstration
const SAMPLE_WORKFLOWS: EligibilityWorkflow[] = [
  {
    id: 'wf-1',
    lwdbId: 'lwdb-1',
    program: 'adult',
    name: 'Adult Program - Tampa Bay',
    description: 'Eligibility workflow for WIOA Adult Program in Tampa Bay region',
    version: 3,
    status: 'published',
    publishedAt: '2024-01-10T14:30:00Z',
    publishedBy: 'user-1',
    criteria: [],
    priorityPopulations: [],
    settings: {
      enableAutoDetermination: true,
      autoDeterminationThreshold: 90,
      requireCaseManagerReview: true,
      reviewTimeoutDays: 5,
      notifyParticipantOnPending: true,
      notifyParticipantOnApproval: true,
      notifyParticipantOnDenial: true,
      allowDocumentUpload: true,
      maxDocumentSizeMB: 10,
      allowedDocumentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      availableLanguages: ['en', 'es'],
      eligibilityValidDays: 180,
    },
    createdAt: '2023-06-15T10:00:00Z',
    createdBy: 'user-1',
    updatedAt: '2024-01-10T14:30:00Z',
    updatedBy: 'user-1',
    changeLog: [],
  },
  {
    id: 'wf-2',
    lwdbId: 'lwdb-1',
    program: 'dislocated_worker',
    name: 'Dislocated Worker - Tampa Bay',
    description: 'Eligibility workflow for WIOA Dislocated Worker Program',
    version: 2,
    status: 'draft',
    criteria: [],
    priorityPopulations: [],
    settings: {
      enableAutoDetermination: true,
      autoDeterminationThreshold: 85,
      requireCaseManagerReview: true,
      reviewTimeoutDays: 5,
      notifyParticipantOnPending: true,
      notifyParticipantOnApproval: true,
      notifyParticipantOnDenial: true,
      allowDocumentUpload: true,
      maxDocumentSizeMB: 10,
      allowedDocumentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      availableLanguages: ['en', 'es'],
      eligibilityValidDays: 180,
    },
    createdAt: '2023-08-20T09:00:00Z',
    createdBy: 'user-1',
    updatedAt: '2024-01-08T11:00:00Z',
    updatedBy: 'user-2',
    changeLog: [],
  },
  {
    id: 'wf-3',
    lwdbId: 'lwdb-1',
    program: 'youth',
    name: 'Youth Program - Tampa Bay',
    description: 'Eligibility workflow for WIOA Youth Program',
    version: 1,
    status: 'published',
    publishedAt: '2023-09-01T08:00:00Z',
    criteria: [],
    priorityPopulations: [],
    settings: {
      enableAutoDetermination: true,
      autoDeterminationThreshold: 80,
      requireCaseManagerReview: true,
      reviewTimeoutDays: 7,
      notifyParticipantOnPending: true,
      notifyParticipantOnApproval: true,
      notifyParticipantOnDenial: true,
      allowDocumentUpload: true,
      maxDocumentSizeMB: 10,
      allowedDocumentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      availableLanguages: ['en', 'es'],
      eligibilityValidDays: 365,
    },
    createdAt: '2023-09-01T08:00:00Z',
    createdBy: 'user-1',
    updatedAt: '2023-09-01T08:00:00Z',
    updatedBy: 'user-1',
    changeLog: [],
  },
];

// Sub-views
type WorkflowView = 'list' | 'edit' | 'preview' | 'test';

const EligibilityWorkflows: React.FC = () => {
  // State
  const [selectedLWDB, setSelectedLWDB] = useState<string>(SAMPLE_LWDBS[0].id);
  const [workflows, setWorkflows] = useState<EligibilityWorkflow[]>(SAMPLE_WORKFLOWS);
  const [currentView, setCurrentView] = useState<WorkflowView>('list');
  const [selectedWorkflow, setSelectedWorkflow] = useState<EligibilityWorkflow | null>(null);
  const [editingCriteria, setEditingCriteria] = useState<EligibilityCriterion[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<WorkflowTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Get workflows for selected LWDB
  const lwdbWorkflows = useMemo(() => {
    return workflows.filter(w => w.lwdbId === selectedLWDB);
  }, [workflows, selectedLWDB]);

  // Get selected LWDB info
  const selectedLWDBInfo = useMemo(() => {
    return SAMPLE_LWDBS.find(l => l.id === selectedLWDB);
  }, [selectedLWDB]);

  // Toggle criterion expansion
  const toggleCriterionExpanded = useCallback((criterionId: string) => {
    setExpandedCriteria(prev => {
      const next = new Set(prev);
      if (next.has(criterionId)) {
        next.delete(criterionId);
      } else {
        next.add(criterionId);
      }
      return next;
    });
  }, []);

  // Create new workflow from template
  const handleCreateFromTemplate = useCallback((template: FederalBaselineTemplate) => {
    const newWorkflow: EligibilityWorkflow = {
      id: `wf-${Date.now()}`,
      lwdbId: selectedLWDB,
      program: template.program,
      name: `${PROGRAM_NAMES[template.program]} - ${selectedLWDBInfo?.name || 'New'}`,
      description: template.description,
      version: 1,
      status: 'draft',
      criteria: template.criteria.map((c, idx) => ({
        ...c,
        id: `crit-${Date.now()}-${idx}`,
      })),
      priorityPopulations: template.priorityPopulations.map((p, idx) => ({
        ...p,
        id: `pop-${Date.now()}-${idx}`,
      })),
      settings: {
        enableAutoDetermination: true,
        autoDeterminationThreshold: template.defaultSettings.autoDeterminationThreshold || 90,
        requireCaseManagerReview: true,
        reviewTimeoutDays: template.defaultSettings.reviewTimeoutDays || 5,
        notifyParticipantOnPending: true,
        notifyParticipantOnApproval: true,
        notifyParticipantOnDenial: true,
        allowDocumentUpload: true,
        maxDocumentSizeMB: 10,
        allowedDocumentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        availableLanguages: ['en', 'es'],
        eligibilityValidDays: template.defaultSettings.eligibilityValidDays || 180,
      },
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user',
      changeLog: [],
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setEditingCriteria(newWorkflow.criteria);
    setCurrentView('edit');
    setShowCreateModal(false);
  }, [selectedLWDB, selectedLWDBInfo]);

  // Save workflow changes
  const handleSaveWorkflow = useCallback(() => {
    if (!selectedWorkflow) return;

    const updated = {
      ...selectedWorkflow,
      criteria: editingCriteria,
      updatedAt: new Date().toISOString(),
    };

    setWorkflows(prev => prev.map(w => w.id === updated.id ? updated : w));
    setSelectedWorkflow(updated);
  }, [selectedWorkflow, editingCriteria]);

  // Publish workflow
  const handlePublishWorkflow = useCallback(() => {
    if (!selectedWorkflow) return;

    const published = {
      ...selectedWorkflow,
      criteria: editingCriteria,
      status: 'published' as WorkflowStatus,
      version: selectedWorkflow.version + 1,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkflows(prev => prev.map(w => w.id === published.id ? published : w));
    setSelectedWorkflow(published);
    setCurrentView('list');
  }, [selectedWorkflow, editingCriteria]);

  // Run test cases
  const handleRunTests = useCallback(() => {
    setIsRunningTests(true);

    // Simulate test execution
    setTimeout(() => {
      const mockResults: WorkflowTestResult[] = [
        {
          testCaseId: 'test-1',
          passed: true,
          actualResult: 'eligible',
          criterionResults: [],
        },
        {
          testCaseId: 'test-2',
          passed: true,
          actualResult: 'ineligible',
          criterionResults: [],
        },
        {
          testCaseId: 'test-3',
          passed: false,
          actualResult: 'pending_review',
          criterionResults: [],
          errorMessage: 'Expected eligible but got pending_review',
        },
      ];
      setTestResults(mockResults);
      setIsRunningTests(false);
    }, 1500);
  }, []);

  // Update criterion
  const handleUpdateCriterion = useCallback((criterionId: string, updates: Partial<EligibilityCriterion>) => {
    setEditingCriteria(prev => prev.map(c =>
      c.id === criterionId ? { ...c, ...updates } : c
    ));
  }, []);

  // Add custom criterion
  const handleAddCriterion = useCallback(() => {
    const newCriterion: EligibilityCriterion = {
      id: `crit-${Date.now()}`,
      type: 'custom',
      name: 'New Custom Criterion',
      description: '',
      value: { type: 'boolean', operator: 'equals', value: true },
      validationLevel: 'warning',
      errorMessage: 'Custom criterion not met',
      documentRequirements: [],
      isFederalRequirement: false,
      allowOverride: true,
      overrideRequiresApproval: true,
      sortOrder: editingCriteria.length + 1,
    };

    setEditingCriteria(prev => [...prev, newCriterion]);
    setExpandedCriteria(prev => new Set([...prev, newCriterion.id]));
  }, [editingCriteria.length]);

  // Delete criterion
  const handleDeleteCriterion = useCallback((criterionId: string) => {
    setEditingCriteria(prev => prev.filter(c => c.id !== criterionId));
  }, []);

  // Render workflow list view
  const renderListView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Eligibility Workflows</h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure eligibility determination criteria for each WIOA program
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {/* LWDB Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-400">Region:</label>
        <select
          value={selectedLWDB}
          onChange={(e) => setSelectedLWDB(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          aria-label="Select region"
        >
          {SAMPLE_LWDBS.map(lwdb => (
            <option key={lwdb.id} value={lwdb.id}>{lwdb.name}</option>
          ))}
        </select>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lwdbWorkflows.map(workflow => (
          <div
            key={workflow.id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-white">{PROGRAM_NAMES[workflow.program]}</h3>
                <p className="text-sm text-slate-400 mt-1">Version {workflow.version}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${STATUS_COLORS[workflow.status]}`}>
                {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
              {workflow.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {workflow.criteria.length || '3'} criteria
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {workflow.priorityPopulations.length || '2'} priority groups
              </span>
            </div>

            {workflow.publishedAt && (
              <p className="text-xs text-slate-500 mb-4">
                Published {new Date(workflow.publishedAt).toLocaleDateString()}
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setEditingCriteria(workflow.criteria.length > 0 ? workflow.criteria :
                    FEDERAL_TEMPLATES.find(t => t.program === workflow.program)?.criteria.map((c, idx) => ({
                      ...c,
                      id: `crit-${Date.now()}-${idx}`,
                    })) || []);
                  setCurrentView('edit');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setCurrentView('preview');
                }}
                className="flex items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                title="Preview"
                aria-label="Preview workflow"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setCurrentView('test');
                }}
                className="flex items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                title="Test Mode"
                aria-label="Test workflow"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty state for missing programs */}
        {(['adult', 'dislocated_worker', 'youth'] as WIOAProgram[]).filter(
          program => !lwdbWorkflows.some(w => w.program === program)
        ).map(program => (
          <div
            key={program}
            className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center text-center"
          >
            <FileText className="w-8 h-8 text-slate-600 mb-3" />
            <h3 className="font-medium text-slate-400">{PROGRAM_NAMES[program]}</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">No workflow configured</p>
            <button
              onClick={() => {
                const template = FEDERAL_TEMPLATES.find(t => t.program === program);
                if (template) handleCreateFromTemplate(template);
              }}
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Create from Federal Baseline
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Render workflow editor view
  const renderEditView = () => {
    if (!selectedWorkflow) return null;

    return (
      <div className="space-y-6">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentView('list');
                setSelectedWorkflow(null);
              }}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Back to list"
            >
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {PROGRAM_NAMES[selectedWorkflow.program]}
              </h2>
              <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${STATUS_COLORS[selectedWorkflow.status]}`}>
                  {selectedWorkflow.status}
                </span>
                Version {selectedWorkflow.version}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('preview')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSaveWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={handlePublishWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>

        {/* Editor Tabs */}
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {[
            { id: 'criteria', label: 'Eligibility Criteria', icon: FileText },
            { id: 'priority', label: 'Priority Populations', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-slate-700 text-white"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Criteria List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Eligibility Criteria</h3>
            <button
              onClick={handleAddCriterion}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Criterion
            </button>
          </div>

          <p className="text-sm text-slate-400">
            <Shield className="w-4 h-4 inline mr-1" />
            Federal requirements are locked. Add local criteria or adjust validation levels for non-federal items.
          </p>

          {editingCriteria.map((criterion) => {
            const isExpanded = expandedCriteria.has(criterion.id);
            const ValidationIcon = VALIDATION_CONFIG[criterion.validationLevel].icon;

            return (
              <div
                key={criterion.id}
                className={`bg-slate-800/50 border rounded-xl overflow-hidden transition-colors ${
                  criterion.isFederalRequirement ? 'border-blue-500/30' : 'border-slate-700'
                }`}
              >
                {/* Criterion Header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-800/80"
                  onClick={() => toggleCriterionExpanded(criterion.id)}
                  role="button"
                  aria-expanded={isExpanded}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCriterionExpanded(criterion.id);
                    }
                  }}
                >
                  <GripVertical className="w-4 h-4 text-slate-500" />

                  <div className="flex-1 flex items-center gap-3">
                    <ValidationIcon className={`w-5 h-5 ${VALIDATION_CONFIG[criterion.validationLevel].color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{criterion.name}</span>
                        {criterion.isFederalRequirement && (
                          <span className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                            Federal
                          </span>
                        )}
                        {criterion.groupId && (
                          <span className="px-1.5 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded">
                            Group: {criterion.groupId} ({criterion.groupOperator})
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{criterion.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${VALIDATION_CONFIG[criterion.validationLevel].color} bg-slate-700`}>
                      {VALIDATION_CONFIG[criterion.validationLevel].label}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Criterion Details (expanded) */}
                {isExpanded && (
                  <div className="border-t border-slate-700 p-4 bg-slate-900/50 space-y-4">
                    {/* Type and validation level */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Criterion Type
                        </label>
                        <input
                          type="text"
                          value={CRITERION_TYPE_LABELS[criterion.type] || criterion.type}
                          disabled
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Validation Level
                        </label>
                        <select
                          value={criterion.validationLevel}
                          onChange={(e) => handleUpdateCriterion(criterion.id, {
                            validationLevel: e.target.value as ValidationLevel
                          })}
                          disabled={criterion.isFederalRequirement && criterion.validationLevel === 'blocking'}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white disabled:text-slate-500"
                          aria-label="Validation level"
                        >
                          <option value="blocking">Blocking (must pass)</option>
                          <option value="warning">Warning (flag for review)</option>
                          <option value="info">Info (informational only)</option>
                        </select>
                      </div>
                    </div>

                    {/* Error messages */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Error Message (English)
                        </label>
                        <input
                          type="text"
                          value={criterion.errorMessage}
                          onChange={(e) => handleUpdateCriterion(criterion.id, {
                            errorMessage: e.target.value
                          })}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Error Message (Spanish)
                        </label>
                        <input
                          type="text"
                          value={criterion.errorMessage_es || ''}
                          onChange={(e) => handleUpdateCriterion(criterion.id, {
                            errorMessage_es: e.target.value
                          })}
                          placeholder="Mensaje de error en español"
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                        />
                      </div>
                    </div>

                    {/* Override settings */}
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={criterion.allowOverride}
                          onChange={(e) => handleUpdateCriterion(criterion.id, {
                            allowOverride: e.target.checked
                          })}
                          disabled={criterion.isFederalRequirement && !criterion.allowOverride}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-300">Allow case manager override</span>
                      </label>
                      {criterion.allowOverride && (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={criterion.overrideRequiresApproval}
                            onChange={(e) => handleUpdateCriterion(criterion.id, {
                              overrideRequiresApproval: e.target.checked
                            })}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-slate-300">Requires supervisor approval</span>
                        </label>
                      )}
                    </div>

                    {/* Document requirements */}
                    {criterion.documentRequirements.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Required Documentation
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {criterion.documentRequirements.map((doc, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              {doc.description}
                              {doc.required && <span className="text-red-400">*</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Delete button for custom criteria */}
                    {!criterion.isFederalRequirement && (
                      <div className="pt-2 border-t border-slate-700">
                        <button
                          onClick={() => handleDeleteCriterion(criterion.id)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Criterion
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render preview view
  const renderPreviewView = () => {
    if (!selectedWorkflow) return null;

    const criteria = editingCriteria.length > 0 ? editingCriteria :
      FEDERAL_TEMPLATES.find(t => t.program === selectedWorkflow.program)?.criteria.map((c, idx) => ({
        ...c,
        id: `crit-${idx}`,
      })) || [];

    return (
      <div className="space-y-6">
        {/* Preview Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView(selectedWorkflow.status === 'draft' ? 'edit' : 'list')}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Participant Preview
              </h2>
              <p className="text-sm text-slate-400">
                This is how participants will see the eligibility questions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('edit')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Simulated Participant View */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Participant Header */}
          <div className="bg-emerald-600 text-white p-6">
            <h1 className="text-2xl font-bold">{PROGRAM_NAMES[selectedWorkflow.program]}</h1>
            <p className="text-emerald-100 mt-1">Eligibility Screening</p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-700 font-medium">
                Question 1 of {criteria.length}
              </span>
              <span className="text-emerald-600">0% Complete</span>
            </div>
            <div className="mt-2 h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>

          {/* Question Preview */}
          <div className="p-6 space-y-6">
            {criteria.slice(0, 3).map((criterion, idx) => (
              <div key={criterion.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-medium">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{criterion.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{criterion.description}</p>

                    {/* Sample answer input based on criterion type */}
                    {criterion.value.type === 'boolean' ? (
                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 px-4 py-3 border-2 border-emerald-500 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                          Yes
                        </button>
                        <button className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-lg font-medium hover:border-gray-300">
                          No
                        </button>
                      </div>
                    ) : criterion.value.type === 'number' ? (
                      <div className="mt-4">
                        <input
                          type="number"
                          placeholder="Enter your answer..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    ) : (
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Enter your answer..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Validation message preview */}
                    {criterion.validationLevel === 'blocking' && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {criterion.errorMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {criteria.length > 3 && (
              <p className="text-center text-gray-400 text-sm">
                ... and {criteria.length - 3} more questions
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-100 p-4 flex justify-between">
            <button className="px-6 py-2 text-gray-500 hover:text-gray-700 font-medium">
              Previous
            </button>
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500">
              Next Question
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render test mode view
  const renderTestView = () => {
    if (!selectedWorkflow) return null;

    const sampleTestCases: WorkflowTestCase[] = [
      {
        id: 'test-1',
        name: 'Eligible Adult',
        description: 'US citizen, 25 years old, registered for selective service',
        inputs: { age: 25, citizenship: true, selectiveService: true },
        expectedResult: 'eligible',
      },
      {
        id: 'test-2',
        name: 'Underage Applicant',
        description: '16 year old applying to adult program',
        inputs: { age: 16, citizenship: true, selectiveService: false },
        expectedResult: 'ineligible',
      },
      {
        id: 'test-3',
        name: 'Missing Documentation',
        description: 'Eligible but missing work authorization proof',
        inputs: { age: 30, citizenship: true, selectiveService: true, hasDocuments: false },
        expectedResult: 'pending_review',
      },
    ];

    return (
      <div className="space-y-6">
        {/* Test Mode Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('edit')}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Back to editor"
            >
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-white">Test Mode</h2>
              <p className="text-sm text-slate-400">
                Run test cases to validate your workflow configuration
              </p>
            </div>
          </div>
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
          >
            {isRunningTests ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunningTests ? 'Running...' : 'Run All Tests'}
          </button>
        </div>

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">
                  {testResults.filter(r => r.passed).length} Passed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium">
                  {testResults.filter(r => !r.passed).length} Failed
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Test Cases List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Test Cases</h3>

          {sampleTestCases.map((testCase) => {
            const result = testResults.find(r => r.testCaseId === testCase.id);

            return (
              <div
                key={testCase.id}
                className={`bg-slate-800/50 border rounded-xl p-4 ${
                  result
                    ? result.passed
                      ? 'border-emerald-500/30'
                      : 'border-red-500/30'
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{testCase.name}</h4>
                      {result && (
                        result.passed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{testCase.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    testCase.expectedResult === 'eligible'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : testCase.expectedResult === 'ineligible'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    Expected: {testCase.expectedResult}
                  </span>
                </div>

                {/* Test Inputs */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(testCase.inputs).map(([key, value]) => (
                    <span
                      key={key}
                      className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded"
                    >
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>

                {/* Test Result Error */}
                {result && !result.passed && result.errorMessage && (
                  <p className="mt-3 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {result.errorMessage}
                  </p>
                )}
              </div>
            );
          })}

          {/* Add Test Case Button */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-slate-300 hover:border-slate-600 transition-colors">
            <Plus className="w-4 h-4" />
            Add Test Case
          </button>
        </div>
      </div>
    );
  };

  // Create Workflow Modal
  const renderCreateModal = () => (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
      onClick={() => setShowCreateModal(false)}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 id="create-modal-title" className="text-xl font-semibold text-white">
              Create New Workflow
            </h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Start from a federal baseline template and customize for your region
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {FEDERAL_TEMPLATES.map((template) => (
            <div
              key={template.program}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 cursor-pointer transition-colors"
              onClick={() => handleCreateFromTemplate(template)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCreateFromTemplate(template);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{template.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {template.criteria.length} criteria
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {template.priorityPopulations.length} priority groups
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(template.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-2 text-xs text-blue-400">
                Reference: {template.regulatoryReference}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {currentView === 'list' && renderListView()}
      {currentView === 'edit' && renderEditView()}
      {currentView === 'preview' && renderPreviewView()}
      {currentView === 'test' && renderTestView()}
      {showCreateModal && renderCreateModal()}
    </div>
  );
};

export default EligibilityWorkflows;
