import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Briefcase,
  GraduationCap,
  Target,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Check,
  Globe,
  CheckCircle,
  Shield,
} from 'lucide-react';

// Form data type
interface IntakeFormData {
  // Personal Info
  fullName: string;
  dateOfBirth: string;
  ssnLast4: string;
  gender: string;
  // Contact Info
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  // Employment
  employmentStatus: string;
  unemployedDuration: string;
  wasLaidOff: string;
  lastEmployer: string;
  lastJobTitle: string;
  // Education
  educationLevel: string;
  // Barriers
  barriers: string[];
  // Goals
  careerGoal: string;
  servicesInterested: string[];
}

// Step configuration
const STEPS = [
  { id: 'personal', title: 'Personal Information', icon: User },
  { id: 'contact', title: 'Contact Information', icon: Phone },
  { id: 'employment', title: 'Employment Status', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'barriers', title: 'Barriers to Employment', icon: AlertCircle },
  { id: 'goals', title: 'Career Goals', icon: Target },
];

// Options
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const EMPLOYMENT_OPTIONS = ['Employed full-time', 'Employed part-time', 'Unemployed', 'Self-employed', 'Not in labor force'];
const DURATION_OPTIONS = ['Less than 6 months', '6-12 months', '1-2 years', 'More than 2 years'];
const EDUCATION_OPTIONS = [
  'Less than high school',
  'Some high school',
  'High school diploma/GED',
  'Some college',
  "Associate's degree",
  "Bachelor's degree",
  "Master's degree or higher",
];
const BARRIER_OPTIONS = [
  'Single parent',
  'Lack reliable transportation',
  'Need childcare assistance',
  'Receiving public assistance (SNAP, TANF)',
  'Limited English proficiency',
  'Have a disability',
  'Currently homeless or at risk',
  'Justice-involved (ex-offender)',
  'Veteran',
];
const SERVICE_OPTIONS = [
  'Job search assistance',
  'Resume and interview help',
  'Skills training / certification',
  'On-the-job training',
  'Apprenticeship programs',
  'Supportive services (transportation, childcare)',
  'Career counseling',
];
const STATE_OPTIONS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const initialFormData: IntakeFormData = {
  fullName: '',
  dateOfBirth: '',
  ssnLast4: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  county: '',
  employmentStatus: '',
  unemployedDuration: '',
  wasLaidOff: '',
  lastEmployer: '',
  lastJobTitle: '',
  educationLevel: '',
  barriers: [],
  careerGoal: '',
  servicesInterested: [],
};

export const AIIntakeAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Translations
  const translations = useMemo(() => ({
    en: {
      title: 'WIOA Intake Application',
      subtitle: 'Complete your application for workforce services',
      next: 'Next',
      back: 'Back',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      required: 'Required',
      step: 'Step',
      of: 'of',
      // Personal
      fullName: 'Full Legal Name',
      dateOfBirth: 'Date of Birth',
      ssnLast4: 'Last 4 digits of SSN',
      ssnHelp: 'Required for eligibility verification',
      gender: 'Gender',
      selectGender: 'Select gender',
      // Contact
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      county: 'County',
      selectState: 'Select state',
      // Employment
      employmentStatus: 'Current Employment Status',
      selectStatus: 'Select status',
      unemployedDuration: 'How long have you been unemployed?',
      selectDuration: 'Select duration',
      wasLaidOff: 'Were you laid off from your previous job?',
      yes: 'Yes',
      no: 'No',
      lastEmployer: 'Last Employer (optional)',
      lastJobTitle: 'Last Job Title (optional)',
      // Education
      educationLevel: 'Highest Level of Education',
      selectEducation: 'Select education level',
      // Barriers
      barriersTitle: 'Do any of the following apply to you?',
      barriersSubtitle: 'Select all that apply. This helps us connect you with the right support services.',
      noneApply: 'None of these apply to me',
      // Goals
      careerGoal: 'What type of career or industry are you interested in?',
      careerGoalPlaceholder: 'e.g., Healthcare, Technology, Manufacturing...',
      servicesTitle: 'What services are you most interested in?',
      servicesSubtitle: 'Select all that apply',
      // Success
      successTitle: 'Application Submitted!',
      successMessage: 'Thank you for completing your WIOA intake application. A case manager will review your information and contact you within 2 business days.',
      whatNext: 'What happens next?',
      step1: 'A case manager will review your application',
      step2: 'You may be asked to provide additional documentation',
      step3: 'You\'ll receive eligibility determination',
      step4: 'You\'ll be connected with appropriate services',
      goToPortal: 'Go to Participant Portal',
      uploadDocs: 'Upload Documents',
    },
    es: {
      title: 'Solicitud de Admisión WIOA',
      subtitle: 'Complete su solicitud para servicios de fuerza laboral',
      next: 'Siguiente',
      back: 'Atrás',
      submit: 'Enviar Solicitud',
      submitting: 'Enviando...',
      required: 'Requerido',
      step: 'Paso',
      of: 'de',
      // Personal
      fullName: 'Nombre Legal Completo',
      dateOfBirth: 'Fecha de Nacimiento',
      ssnLast4: 'Últimos 4 dígitos del SSN',
      ssnHelp: 'Requerido para verificación de elegibilidad',
      gender: 'Género',
      selectGender: 'Seleccione género',
      // Contact
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      address: 'Dirección',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: 'Código Postal',
      county: 'Condado',
      selectState: 'Seleccione estado',
      // Employment
      employmentStatus: 'Estado de Empleo Actual',
      selectStatus: 'Seleccione estado',
      unemployedDuration: '¿Cuánto tiempo ha estado desempleado?',
      selectDuration: 'Seleccione duración',
      wasLaidOff: '¿Fue despedido de su trabajo anterior?',
      yes: 'Sí',
      no: 'No',
      lastEmployer: 'Último Empleador (opcional)',
      lastJobTitle: 'Último Puesto (opcional)',
      // Education
      educationLevel: 'Nivel Más Alto de Educación',
      selectEducation: 'Seleccione nivel de educación',
      // Barriers
      barriersTitle: '¿Alguno de los siguientes aplica a usted?',
      barriersSubtitle: 'Seleccione todos los que apliquen. Esto nos ayuda a conectarlo con los servicios de apoyo adecuados.',
      noneApply: 'Ninguno de estos aplica a mí',
      // Goals
      careerGoal: '¿En qué tipo de carrera o industria está interesado?',
      careerGoalPlaceholder: 'ej., Salud, Tecnología, Manufactura...',
      servicesTitle: '¿En qué servicios está más interesado?',
      servicesSubtitle: 'Seleccione todos los que apliquen',
      // Success
      successTitle: '¡Solicitud Enviada!',
      successMessage: 'Gracias por completar su solicitud de admisión WIOA. Un administrador de casos revisará su información y lo contactará dentro de 2 días hábiles.',
      whatNext: '¿Qué sigue?',
      step1: 'Un administrador de casos revisará su solicitud',
      step2: 'Es posible que se le pida documentación adicional',
      step3: 'Recibirá determinación de elegibilidad',
      step4: 'Será conectado con los servicios apropiados',
      goToPortal: 'Ir al Portal de Participante',
      uploadDocs: 'Subir Documentos',
    },
  }), []);

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  }, [language, translations]);

  // Form field update
  const updateField = (field: keyof IntakeFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Toggle array field (for multi-select)
  const toggleArrayField = (field: 'barriers' | 'servicesInterested', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = t('required');
      if (!formData.dateOfBirth) newErrors.dateOfBirth = t('required');
      if (!formData.ssnLast4 || formData.ssnLast4.length !== 4) newErrors.ssnLast4 = t('required');
      if (!formData.gender) newErrors.gender = t('required');
    } else if (step === 1) {
      if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = t('required');
      if (!formData.phone.trim()) newErrors.phone = t('required');
      if (!formData.address.trim()) newErrors.address = t('required');
      if (!formData.city.trim()) newErrors.city = t('required');
      if (!formData.state) newErrors.state = t('required');
      if (!formData.zipCode.trim()) newErrors.zipCode = t('required');
      if (!formData.county.trim()) newErrors.county = t('required');
    } else if (step === 2) {
      if (!formData.employmentStatus) newErrors.employmentStatus = t('required');
      if (formData.employmentStatus === 'Unemployed' && !formData.unemployedDuration) {
        newErrors.unemployedDuration = t('required');
      }
    } else if (step === 3) {
      if (!formData.educationLevel) newErrors.educationLevel = t('required');
    } else if (step === 5) {
      if (!formData.careerGoal.trim()) newErrors.careerGoal = t('required');
      if (formData.servicesInterested.length === 0) newErrors.servicesInterested = t('required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Progress calculation
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{t('successTitle')}</h1>
            <p className="text-slate-400 mb-8">{t('successMessage')}</p>

            <div className="bg-slate-900 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-sm font-semibold text-white mb-4">{t('whatNext')}</h2>
              <div className="space-y-3">
                {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/workforce/portal')}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                {t('uploadDocs')}
              </button>
              <button
                onClick={() => navigate('/workforce/portal')}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                {t('goToPortal')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Input component
  const Input: React.FC<{
    label: string;
    name: keyof IntakeFormData;
    type?: string;
    placeholder?: string;
    maxLength?: number;
    helpText?: string;
  }> = ({ label, name, type = 'text', placeholder, maxLength, helpText }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        value={formData[name] as string}
        onChange={(e) => updateField(name, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 bg-slate-900 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
          errors[name] ? 'border-red-500' : 'border-slate-600'
        }`}
      />
      {helpText && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  // Select component
  const Select: React.FC<{
    label: string;
    name: keyof IntakeFormData;
    options: string[];
    placeholder: string;
  }> = ({ label, name, options, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <select
        value={formData[name] as string}
        onChange={(e) => updateField(name, e.target.value)}
        className={`w-full px-4 py-3 bg-slate-900 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
          errors[name] ? 'border-red-500' : 'border-slate-600'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-5">
            <Input label={t('fullName')} name="fullName" placeholder="John Doe" />
            <Input label={t('dateOfBirth')} name="dateOfBirth" type="date" />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('ssnLast4')} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={formData.ssnLast4}
                  onChange={(e) => updateField('ssnLast4', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  maxLength={4}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-900 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.ssnLast4 ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">{t('ssnHelp')}</p>
              {errors.ssnLast4 && <p className="mt-1 text-xs text-red-400">{errors.ssnLast4}</p>}
            </div>
            <Select label={t('gender')} name="gender" options={GENDER_OPTIONS} placeholder={t('selectGender')} />
          </div>
        );

      case 1: // Contact Info
        return (
          <div className="space-y-5">
            <Input label={t('email')} name="email" type="email" placeholder="john@example.com" />
            <Input label={t('phone')} name="phone" type="tel" placeholder="(555) 123-4567" />
            <Input label={t('address')} name="address" placeholder="123 Main Street" />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('city')} name="city" placeholder="Miami" />
              <Select label={t('state')} name="state" options={STATE_OPTIONS} placeholder={t('selectState')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('zipCode')} name="zipCode" placeholder="33101" maxLength={10} />
              <Input label={t('county')} name="county" placeholder="Miami-Dade" />
            </div>
          </div>
        );

      case 2: // Employment
        return (
          <div className="space-y-5">
            <Select
              label={t('employmentStatus')}
              name="employmentStatus"
              options={EMPLOYMENT_OPTIONS}
              placeholder={t('selectStatus')}
            />
            {formData.employmentStatus === 'Unemployed' && (
              <>
                <Select
                  label={t('unemployedDuration')}
                  name="unemployedDuration"
                  options={DURATION_OPTIONS}
                  placeholder={t('selectDuration')}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">{t('wasLaidOff')}</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('wasLaidOff', opt)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          formData.wasLaidOff === opt
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {opt === 'Yes' ? t('yes') : t('no')}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="pt-2">
              <Input label={t('lastEmployer')} name="lastEmployer" placeholder="Company name" />
            </div>
            <Input label={t('lastJobTitle')} name="lastJobTitle" placeholder="Job title" />
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-5">
            <Select
              label={t('educationLevel')}
              name="educationLevel"
              options={EDUCATION_OPTIONS}
              placeholder={t('selectEducation')}
            />
          </div>
        );

      case 4: // Barriers
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">{t('barriersTitle')}</h3>
              <p className="text-sm text-slate-400 mb-4">{t('barriersSubtitle')}</p>
              <div className="space-y-2">
                {BARRIER_OPTIONS.map(barrier => (
                  <button
                    key={barrier}
                    type="button"
                    onClick={() => toggleArrayField('barriers', barrier)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                      formData.barriers.includes(barrier)
                        ? 'bg-emerald-500/20 border border-emerald-500/50'
                        : 'bg-slate-800 border border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      formData.barriers.includes(barrier) ? 'bg-emerald-500' : 'bg-slate-700 border border-slate-600'
                    }`}>
                      {formData.barriers.includes(barrier) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-white">{barrier}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => updateField('barriers', [])}
                className={`w-full mt-3 p-4 rounded-xl text-left transition-all ${
                  formData.barriers.length === 0
                    ? 'bg-slate-700 border border-slate-600'
                    : 'bg-slate-800 border border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span className="text-sm text-slate-300">{t('noneApply')}</span>
              </button>
            </div>
          </div>
        );

      case 5: // Goals
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('careerGoal')} <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.careerGoal}
                onChange={(e) => updateField('careerGoal', e.target.value)}
                placeholder={t('careerGoalPlaceholder')}
                rows={3}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all ${
                  errors.careerGoal ? 'border-red-500' : 'border-slate-600'
                }`}
              />
              {errors.careerGoal && <p className="mt-1 text-xs text-red-400">{errors.careerGoal}</p>}
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-2">
                {t('servicesTitle')} <span className="text-red-400">*</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">{t('servicesSubtitle')}</p>
              <div className="space-y-2">
                {SERVICE_OPTIONS.map(service => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleArrayField('servicesInterested', service)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                      formData.servicesInterested.includes(service)
                        ? 'bg-emerald-500/20 border border-emerald-500/50'
                        : 'bg-slate-800 border border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      formData.servicesInterested.includes(service) ? 'bg-emerald-500' : 'bg-slate-700 border border-slate-600'
                    }`}>
                      {formData.servicesInterested.includes(service) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-white">{service}</span>
                  </button>
                ))}
              </div>
              {errors.servicesInterested && <p className="mt-2 text-xs text-red-400">{errors.servicesInterested}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const CurrentIcon = STEPS[currentStep].icon;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-white">{t('title')}</h1>
              <p className="text-xs text-slate-400">{t('subtitle')}</p>
            </div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-slate-400 whitespace-nowrap">
              {t('step')} {currentStep + 1} {t('of')} {STEPS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Step indicators - Two rows for better fit */}
      <div className="border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-2">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/50'
                      : isCompleted
                      ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : isCompleted
                      ? 'bg-emerald-500/30 text-emerald-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : <StepIcon className="w-3 h-3" />}
                  </div>
                  <span className="text-xs sm:text-sm truncate">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8">
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CurrentIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{STEPS[currentStep].title}</h2>
              <p className="text-sm text-slate-400">
                {t('step')} {currentStep + 1} {t('of')} {STEPS.length}
              </p>
            </div>
          </div>

          {/* Form fields */}
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 disabled:text-slate-500 text-white rounded-xl font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('back')}
          </button>
          <button
            onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-xl font-medium transition-colors"
          >
            {isSubmitting ? (
              t('submitting')
            ) : currentStep === STEPS.length - 1 ? (
              <>
                {t('submit')}
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                {t('next')}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AIIntakeAssistant;
