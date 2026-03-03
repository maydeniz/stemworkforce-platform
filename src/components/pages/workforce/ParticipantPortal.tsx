import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  User,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Camera,
  File,
  X,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Shield,
  Home,
  Car,
  Baby,
  Heart,
  DollarSign,
  Volume2,
  Globe,
} from 'lucide-react';
import { sanitizeInput } from '@/utils/security';

// Types
interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  uploadedAt: string;
  expiresAt?: string;
  rejectionReason?: string;
}

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  icon: React.ElementType;
}

// ServiceRequest interface is available for future use when implementing service request tracking
// interface ServiceRequest {
//   id: string;
//   type: string;
//   status: 'pending' | 'approved' | 'denied' | 'in_progress';
//   requestedAt: string;
//   amount?: number;
//   notes?: string;
// }

// Required documents configuration
const REQUIRED_DOCUMENTS = [
  { id: 'id', name: 'Government-Issued ID', description: 'Driver\'s license, state ID, or passport', required: true },
  { id: 'ssn', name: 'Social Security Card or Proof', description: 'SSN card, W-2, or pay stub with SSN', required: true },
  { id: 'address', name: 'Proof of Address', description: 'Utility bill, lease, or bank statement (within 60 days)', required: true },
  { id: 'income', name: 'Income Verification', description: 'Pay stubs, tax return, or unemployment letter', required: true },
  { id: 'education', name: 'Education Records', description: 'Diploma, transcript, or GED certificate', required: false },
  { id: 'work_auth', name: 'Work Authorization', description: 'I-9 eligible documents', required: true },
  { id: 'selective_service', name: 'Selective Service Registration', description: 'Required for males 18-25', required: false },
  { id: 'veteran', name: 'DD-214 or Veteran Status', description: 'If applicable', required: false },
];

// Sample uploaded documents
const SAMPLE_DOCUMENTS: Document[] = [
  { id: '1', name: 'Driver_License.jpg', type: 'id', status: 'approved', uploadedAt: '2024-02-01' },
  { id: '2', name: 'SSN_Card.pdf', type: 'ssn', status: 'approved', uploadedAt: '2024-02-01' },
  { id: '3', name: 'Electric_Bill.pdf', type: 'address', status: 'pending', uploadedAt: '2024-02-08' },
  { id: '4', name: 'Pay_Stub_Jan.pdf', type: 'income', status: 'rejected', uploadedAt: '2024-02-05', rejectionReason: 'Document is older than 30 days. Please upload a recent pay stub.' },
];

// Application steps
const APPLICATION_STEPS: ApplicationStep[] = [
  { id: 'register', title: 'Create Account', description: 'Basic contact information', status: 'completed', icon: User },
  { id: 'profile', title: 'Complete Profile', description: 'Personal and employment history', status: 'completed', icon: FileText },
  { id: 'documents', title: 'Upload Documents', description: 'Required verification documents', status: 'current', icon: Upload },
  { id: 'assessment', title: 'Skills Assessment', description: 'Career interest and skills inventory', status: 'upcoming', icon: GraduationCap },
  { id: 'eligibility', title: 'Eligibility Review', description: 'Case manager reviews your application', status: 'locked', icon: Shield },
  { id: 'enrollment', title: 'Program Enrollment', description: 'Select services and create your plan', status: 'locked', icon: Briefcase },
];

// Service request types
const SERVICE_TYPES = [
  { id: 'transportation', name: 'Transportation Assistance', icon: Car, description: 'Gas cards, bus passes, or mileage reimbursement' },
  { id: 'childcare', name: 'Childcare Assistance', icon: Baby, description: 'Help with childcare costs during training' },
  { id: 'housing', name: 'Housing Assistance', icon: Home, description: 'Emergency housing support or utility assistance' },
  { id: 'work_clothing', name: 'Work Clothing', icon: Briefcase, description: 'Professional attire for interviews or employment' },
  { id: 'healthcare', name: 'Healthcare Support', icon: Heart, description: 'Medical or dental assistance' },
  { id: 'tools', name: 'Tools & Supplies', icon: Briefcase, description: 'Required tools or supplies for training/work' },
];

export const ParticipantPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'documents' | 'services' | 'messages'>('status');
  const [documents, setDocuments] = useState<Document[]>(SAMPLE_DOCUMENTS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized translations
  const translations = useMemo(() => ({
    en: {
      'welcome': 'Welcome to Your Participant Portal',
      'subtitle': 'Track your application, upload documents, and request services',
      'application_status': 'Application Status',
      'documents': 'Documents',
      'services': 'Supportive Services',
      'messages': 'Messages',
      'upload_document': 'Upload Document',
      'request_service': 'Request Service',
      'need_help': 'Need Help?',
      'call_us': 'Call Us',
      'email_us': 'Email Us',
      'find_center': 'Find a Career Center',
      'approved': 'Approved',
      'pending_review': 'Pending Review',
      'action_required': 'Action Required',
      'not_uploaded': 'Not Uploaded',
      'application_progress': 'Application Progress',
      'your_case_manager': 'Your Case Manager',
      'document_tips': 'Document Tips',
      'no_messages': 'No Messages Yet',
      'messages_info': 'Your case manager will send updates here',
      'describe_need': 'Describe your need',
      'estimated_amount': 'Estimated amount needed (optional)',
      'submit_request': 'Submit Request',
      'review_time': 'Your case manager will review this request within 2 business days',
      'switch_to_spanish': 'Cambiar a Español',
      'switch_to_english': 'Switch to English',
      'toggle_audio': 'Toggle audio guidance',
      'close': 'Close',
      'select_doc_type': 'Select Document Type',
      'take_photo': 'Take Photo',
      'choose_file': 'Choose File',
    },
    es: {
      'welcome': 'Bienvenido a Su Portal de Participante',
      'subtitle': 'Rastree su solicitud, suba documentos y solicite servicios',
      'application_status': 'Estado de Solicitud',
      'documents': 'Documentos',
      'services': 'Servicios de Apoyo',
      'messages': 'Mensajes',
      'upload_document': 'Subir Documento',
      'request_service': 'Solicitar Servicio',
      'need_help': '¿Necesita Ayuda?',
      'call_us': 'Llámenos',
      'email_us': 'Envíenos un Email',
      'find_center': 'Encuentre un Centro de Empleo',
      'approved': 'Aprobado',
      'pending_review': 'En Revisión',
      'action_required': 'Acción Requerida',
      'not_uploaded': 'No Subido',
      'application_progress': 'Progreso de Solicitud',
      'your_case_manager': 'Su Administrador de Caso',
      'document_tips': 'Consejos para Documentos',
      'no_messages': 'Sin Mensajes Aún',
      'messages_info': 'Su administrador de caso enviará actualizaciones aquí',
      'describe_need': 'Describa su necesidad',
      'estimated_amount': 'Cantidad estimada necesaria (opcional)',
      'submit_request': 'Enviar Solicitud',
      'review_time': 'Su administrador de caso revisará esta solicitud dentro de 2 días hábiles',
      'switch_to_spanish': 'Cambiar a Español',
      'switch_to_english': 'Switch to English',
      'toggle_audio': 'Alternar guía de audio',
      'close': 'Cerrar',
      'select_doc_type': 'Seleccionar Tipo de Documento',
      'take_photo': 'Tomar Foto',
      'choose_file': 'Elegir Archivo',
    },
  }), []);

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  }, [language, translations]);

  const getDocumentStatus = (type: string) => {
    const doc = documents.find(d => d.type === type);
    if (!doc) return 'missing';
    return doc.status;
  };

  const getStatusBadge = (status: string): React.ReactElement | null => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs"><CheckCircle className="w-3 h-3" aria-hidden="true" /><span>{t('approved')}</span></span>;
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs"><Clock className="w-3 h-3" aria-hidden="true" /><span>{t('pending_review')}</span></span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs"><AlertCircle className="w-3 h-3" aria-hidden="true" /><span>{t('action_required')}</span></span>;
      case 'missing':
        return <span className="flex items-center gap-1 px-2 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs"><Upload className="w-3 h-3" aria-hidden="true" /><span>{t('not_uploaded')}</span></span>;
      default:
        return null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedDocType) {
      // Validate file size (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        alert(language === 'en' ? 'File size must be less than 10MB' : 'El archivo debe ser menor de 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert(language === 'en' ? 'Only images and PDFs are allowed' : 'Solo se permiten imágenes y PDFs');
        return;
      }

      const newDoc: Document = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name: sanitizeInput(file.name),
        type: selectedDocType,
        status: 'pending',
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      setDocuments([...documents.filter(d => d.type !== selectedDocType), newDoc]);
      setShowUploadModal(false);
      setSelectedDocType(null);
    }
  };

  const completedDocs = documents.filter(d => d.status === 'approved').length;
  const totalRequiredDocs = REQUIRED_DOCUMENTS.filter(d => d.required).length;
  const applicationProgress = Math.round((completedDocs / totalRequiredDocs) * 100);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUploadModal) {
          setShowUploadModal(false);
          setSelectedDocType(null);
        }
        if (showServiceModal) {
          setShowServiceModal(false);
          setSelectedService(null);
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showUploadModal, showServiceModal]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile-friendly header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">Maria Rodriguez</h1>
                <p className="text-xs md:text-sm text-slate-400">Participant ID: WP-2024-0847</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-1 px-2 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                aria-label={language === 'en' ? t('switch_to_spanish') : t('switch_to_english')}
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="hidden md:inline">{language === 'en' ? 'ES' : 'EN'}</span>
              </button>
              {/* Audio toggle */}
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg transition-colors ${audioEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                aria-label={t('toggle_audio')}
                aria-pressed={audioEnabled}
              >
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-slate-900 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400" id="progress-label">{t('application_status')}</span>
              <span className="text-sm font-medium text-emerald-400">{applicationProgress}% Complete</span>
            </div>
            <div
              className="h-2 bg-slate-700 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={applicationProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-labelledby="progress-label"
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${applicationProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {completedDocs} of {totalRequiredDocs} required documents verified
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-friendly tabs */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4">
            {[
              { id: 'status', label: t('application_status'), icon: FileText },
              { id: 'documents', label: t('documents'), icon: Upload },
              { id: 'services', label: t('services'), icon: Heart },
              { id: 'messages', label: t('messages'), icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-label={tab.label}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Application Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Steps timeline */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6">
              <h2 className="text-lg font-bold text-white mb-4">Application Progress</h2>
              <div className="space-y-4">
                {APPLICATION_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-emerald-500' :
                          step.status === 'current' ? 'bg-emerald-500/20 border-2 border-emerald-500' :
                          'bg-slate-700'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <step.icon className={`w-5 h-5 ${step.status === 'current' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        )}
                      </div>
                      {index < APPLICATION_STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className={`font-medium ${step.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-400">{step.description}</p>
                      {step.status === 'current' && (
                        <button className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Continue
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions for mobile */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              <button
                onClick={() => setActiveTab('documents')}
                className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Upload className="w-6 h-6 text-emerald-400" />
                <span className="text-sm text-white">{t('upload_document')}</span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Heart className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-white">{t('request_service')}</span>
              </button>
            </div>

            {/* Case Manager Contact */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6">
              <h2 className="text-lg font-bold text-white mb-4">Your Case Manager</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold">JA</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">Jennifer Adams</h3>
                  <p className="text-sm text-slate-400">Springfield Career Center</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <a
                  href="tel:+12175550100"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
                <a
                  href="mailto:jadams@ilworknet.com"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{t('documents')}</h2>
              <button
                onClick={() => {
                  setSelectedDocType(null);
                  setShowUploadModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{t('upload_document')}</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>

            {/* Document cards */}
            <div className="space-y-3">
              {REQUIRED_DOCUMENTS.map((doc) => {
                const uploadedDoc = documents.find(d => d.type === doc.id);
                const status = getDocumentStatus(doc.id);

                return (
                  <div
                    key={doc.id}
                    className={`bg-slate-800 rounded-xl border p-4 ${
                      status === 'rejected' ? 'border-red-500/50' :
                      status === 'pending' ? 'border-amber-500/50' :
                      status === 'approved' ? 'border-emerald-500/50' :
                      'border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-white">{doc.name}</h3>
                          {doc.required && (
                            <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">Required</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{doc.description}</p>

                        {uploadedDoc && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <File className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-300">{uploadedDoc.name}</span>
                          </div>
                        )}

                        {uploadedDoc?.status === 'rejected' && uploadedDoc.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-sm text-red-400">{uploadedDoc.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(status)}
                        {status !== 'approved' && (
                          <button
                            onClick={() => {
                              setSelectedDocType(doc.id);
                              setShowUploadModal(true);
                            }}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                          >
                            {status === 'missing' ? 'Upload' : 'Replace'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400">Document Tips</h4>
                  <ul className="text-sm text-slate-300 mt-2 space-y-1">
                    <li>• Take photos in good lighting with all corners visible</li>
                    <li>• PDFs and images (JPG, PNG) are accepted</li>
                    <li>• Documents must be current (within 60 days for most)</li>
                    <li>• Blur or hide any information not required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{t('services')}</h2>
            </div>

            <p className="text-slate-400">
              Supportive services help remove barriers to your training and employment. Request assistance below.
            </p>

            {/* Service types grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_TYPES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setShowServiceModal(true);
                  }}
                  className="flex items-start gap-4 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{service.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{service.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Eligibility note */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-400">Eligibility Required</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Supportive services are available after your WIOA eligibility is confirmed.
                    Complete your document uploads to continue the enrollment process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">{t('messages')}</h2>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-medium">No Messages Yet</h3>
              <p className="text-slate-400 text-sm mt-1">
                Your case manager will send updates here
              </p>
            </div>
          </div>
        )}

        {/* Help section - always visible on mobile */}
        <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6">
          <h2 className="text-lg font-bold text-white mb-4">{t('need_help')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:+18005551234"
              className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">{t('call_us')}</p>
                <p className="text-xs text-slate-400">1-800-555-1234</p>
              </div>
            </a>
            <a
              href="mailto:help@ilworknet.com"
              className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">{t('email_us')}</p>
                <p className="text-xs text-slate-400">help@ilworknet.com</p>
              </div>
            </a>
            <a
              href="/workforce/career-centers"
              className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">{t('find_center')}</p>
                <p className="text-xs text-slate-400">Visit in person</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUploadModal(false);
              setSelectedDocType(null);
            }
          }}
        >
          <div className="bg-slate-800 rounded-t-2xl sm:rounded-xl border border-slate-700 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 px-4 sm:px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 id="upload-modal-title" className="text-lg font-bold text-white">{t('upload_document')}</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedDocType(null);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label={t('close')}
              >
                <X className="w-5 h-5 text-slate-400" aria-hidden="true" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {!selectedDocType && (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Select Document Type</label>
                  <div className="space-y-2">
                    {REQUIRED_DOCUMENTS.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocType(doc.id)}
                        className="w-full flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
                      >
                        <span className="text-white">{doc.name}</span>
                        {getStatusBadge(getDocumentStatus(doc.id))}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDocType && (
                <div>
                  <p className="text-sm text-slate-400 mb-4">
                    {REQUIRED_DOCUMENTS.find(d => d.id === selectedDocType)?.description}
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label={t('upload_document')}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl transition-colors"
                    >
                      <Camera className="w-8 h-8 text-slate-400" />
                      <span className="text-sm text-slate-300">Take Photo</span>
                    </button>
                    <button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.removeAttribute('capture');
                          fileInputRef.current.click();
                        }
                      }}
                      className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl transition-colors"
                    >
                      <File className="w-8 h-8 text-slate-400" />
                      <span className="text-sm text-slate-300">Choose File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      {showServiceModal && selectedService && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowServiceModal(false);
              setSelectedService(null);
            }
          }}
        >
          <div className="bg-slate-800 rounded-t-2xl sm:rounded-xl border border-slate-700 w-full sm:max-w-md">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 id="service-modal-title" className="text-lg font-bold text-white">
                Request {SERVICE_TYPES.find(s => s.id === selectedService)?.name}
              </h3>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setSelectedService(null);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label={t('close')}
              >
                <X className="w-5 h-5 text-slate-400" aria-hidden="true" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label htmlFor="service-description" className="block text-sm text-slate-400 mb-1">{t('describe_need')}</label>
                <textarea
                  id="service-description"
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder={language === 'en' ? "Explain why you need this assistance..." : "Explique por qué necesita esta asistencia..."}
                />
              </div>
              <div>
                <label htmlFor="service-amount" className="block text-sm text-slate-400 mb-1">{t('estimated_amount')}</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
                  <input
                    id="service-amount"
                    type="number"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                {t('submit_request')}
              </button>
              <p className="text-xs text-slate-500 text-center">
                {t('review_time')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantPortal;
