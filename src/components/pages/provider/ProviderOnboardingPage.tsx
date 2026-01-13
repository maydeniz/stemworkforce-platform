// ===========================================
// Provider Onboarding Page
// Dynamic toggle menu for flexible navigation
// ===========================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User,
  Building2,
  Briefcase,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Upload,
  Plus,
  X,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Award,
  Shield,
  Users,
  Sparkles,
  Target,
  Check,
  AlertCircle,
  Camera,
  ChevronRight,
  Save,
  Home
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface ProviderFormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;
  profileImage: File | null;
  bio: string;

  // Step 2: Professional Background
  currentTitle: string;
  currentCompany: string;
  previousCompanies: string[];
  yearsExperience: number;
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    year: string;
  }>;
  certifications: string[];
  clearanceLevel: string;

  // Step 3: Expertise & Services
  primaryIndustry: string;
  expertiseAreas: string[];
  services: Array<{
    title: string;
    description: string;
    priceType: 'hourly' | 'fixed' | 'project';
    rate: number;
    duration: string;
  }>;
  portfolioLinks: string[];

  // Step 4: Verification
  governmentId: File | null;
  professionalReferences: Array<{
    name: string;
    title: string;
    company: string;
    email: string;
    relationship: string;
  }>;
  backgroundCheckConsent: boolean;
  termsAccepted: boolean;

  // Step 5: Payment
  paymentMethod: 'bank' | 'paypal' | 'stripe';
  bankDetails: {
    accountName: string;
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
  };
  taxId: string;
  w9Uploaded: File | null;
}

interface Section {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  requiredFields: (keyof ProviderFormData)[];
}

const initialFormData: ProviderFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  linkedin: '',
  profileImage: null,
  bio: '',
  currentTitle: '',
  currentCompany: '',
  previousCompanies: [],
  yearsExperience: 0,
  education: [],
  certifications: [],
  clearanceLevel: '',
  primaryIndustry: '',
  expertiseAreas: [],
  services: [],
  portfolioLinks: [],
  governmentId: null,
  professionalReferences: [],
  backgroundCheckConsent: false,
  termsAccepted: false,
  paymentMethod: 'bank',
  bankDetails: {
    accountName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
  },
  taxId: '',
  w9Uploaded: null,
};

// ===========================================
// Section Definitions
// ===========================================

const sections: Section[] = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: User,
    description: 'Basic information about you',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'bio'],
  },
  {
    id: 'background',
    label: 'Background',
    icon: Briefcase,
    description: 'Your professional experience',
    requiredFields: ['currentTitle', 'currentCompany', 'yearsExperience'],
  },
  {
    id: 'expertise',
    label: 'Expertise',
    icon: Target,
    description: 'Skills and services you offer',
    requiredFields: ['primaryIndustry', 'expertiseAreas'],
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: Shield,
    description: 'Identity and credential verification',
    requiredFields: ['backgroundCheckConsent', 'termsAccepted'],
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: CreditCard,
    description: 'How you get paid',
    requiredFields: ['paymentMethod', 'taxId'],
  },
];

// ===========================================
// Helper Functions
// ===========================================

const getSectionCompletion = (sectionId: string, data: ProviderFormData): number => {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return 0;

  let completed = 0;
  const total = section.requiredFields.length;

  section.requiredFields.forEach((field) => {
    const value = data[field];
    if (Array.isArray(value)) {
      if (value.length > 0) completed++;
    } else if (typeof value === 'boolean') {
      if (value) completed++;
    } else if (typeof value === 'number') {
      if (value > 0) completed++;
    } else if (value) {
      completed++;
    }
  });

  return Math.round((completed / total) * 100);
};

const getOverallCompletion = (data: ProviderFormData): number => {
  const completions = sections.map((s) => getSectionCompletion(s.id, data));
  return Math.round(completions.reduce((a, b) => a + b, 0) / sections.length);
};

// ===========================================
// Section Content Components
// ===========================================

// Personal Info Section
const PersonalInfoSection: React.FC<{
  data: ProviderFormData;
  onChange: (updates: Partial<ProviderFormData>) => void;
}> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {data.profileImage ? (
              <img
                src={URL.createObjectURL(data.profileImage)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
            <Upload className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onChange({ profileImage: e.target.files[0] });
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn Profile
        </label>
        <div className="relative">
          <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => onChange({ linkedin: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Tell clients about your experience, expertise, and what makes you unique..."
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">
            {data.bio.length}/500 characters
          </p>
          {data.bio.length >= 100 && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Good length
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Professional Background Section
const BackgroundSection: React.FC<{
  data: ProviderFormData;
  onChange: (updates: Partial<ProviderFormData>) => void;
}> = ({ data, onChange }) => {
  const [newCertification, setNewCertification] = useState('');
  const [newCompany, setNewCompany] = useState('');

  const addCertification = () => {
    if (newCertification.trim()) {
      onChange({ certifications: [...data.certifications, newCertification.trim()] });
      setNewCertification('');
    }
  };

  const addCompany = () => {
    if (newCompany.trim()) {
      onChange({ previousCompanies: [...data.previousCompanies, newCompany.trim()] });
      setNewCompany('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.currentTitle}
            onChange={(e) => onChange({ currentTitle: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="e.g., VP of Engineering"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current/Recent Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.currentCompany}
            onChange={(e) => onChange({ currentCompany: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="e.g., Google"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={data.yearsExperience}
          onChange={(e) => onChange({ yearsExperience: parseInt(e.target.value) || 0 })}
          className="w-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Previous Companies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Previous Notable Companies
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.previousCompanies.map((company, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
            >
              <Building2 className="w-4 h-4" />
              {company}
              <button
                onClick={() =>
                  onChange({
                    previousCompanies: data.previousCompanies.filter((_, i) => i !== idx),
                  })
                }
                className="hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Add a company"
          />
          <button
            onClick={addCompany}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certifications & Credentials
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.certifications.map((cert, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full"
            >
              <Award className="w-4 h-4" />
              {cert}
              <button
                onClick={() =>
                  onChange({
                    certifications: data.certifications.filter((_, i) => i !== idx),
                  })
                }
                className="hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="e.g., CISSP, PMP, AWS Solutions Architect"
          />
          <button
            onClick={addCertification}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Security Clearance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Security Clearance (if applicable)
        </label>
        <select
          value={data.clearanceLevel}
          onChange={(e) => onChange({ clearanceLevel: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="">No clearance</option>
          <option value="public-trust">Public Trust</option>
          <option value="secret">Secret</option>
          <option value="top-secret">Top Secret</option>
          <option value="ts-sci">TS/SCI</option>
          <option value="q-clearance">Q Clearance (DOE)</option>
          <option value="l-clearance">L Clearance (DOE)</option>
        </select>
      </div>
    </div>
  );
};

// Expertise Section
const ExpertiseSection: React.FC<{
  data: ProviderFormData;
  onChange: (updates: Partial<ProviderFormData>) => void;
}> = ({ data, onChange }) => {
  const industries = [
    { id: 'Semiconductor', icon: '💎' },
    { id: 'Nuclear Energy', icon: '☢️' },
    { id: 'AI & Machine Learning', icon: '🤖' },
    { id: 'Quantum Technologies', icon: '⚛️' },
    { id: 'Cybersecurity', icon: '🛡️' },
    { id: 'Aerospace & Defense', icon: '🚀' },
    { id: 'Biotechnology', icon: '🧬' },
    { id: 'Healthcare & Medical Technology', icon: '🏥' },
    { id: 'Robotics & Automation', icon: '🦾' },
    { id: 'Clean Energy', icon: '⚡' },
    { id: 'Advanced Manufacturing', icon: '🏭' },
  ];

  const expertiseOptions: Record<string, string[]> = {
    'AI & Machine Learning': [
      'AI Strategy', 'LLM Implementation', 'MLOps', 'Computer Vision',
      'NLP', 'AI Ethics', 'Model Optimization', 'Data Science',
      'Generative AI', 'AI Governance', 'Edge AI', 'Reinforcement Learning',
    ],
    'Quantum Technologies': [
      'Quantum Algorithms', 'Post-Quantum Cryptography', 'Quantum Hardware',
      'Quantum Software', 'Quantum Simulation', 'NISQ Applications',
      'Quantum Machine Learning', 'Quantum Networking', 'Error Correction',
    ],
    Semiconductor: [
      'Fab Operations', 'Process Engineering', 'CHIPS Act',
      'Supply Chain', 'Equipment Engineering', 'Yield Optimization',
      'Chip Design', 'Packaging', 'EDA Tools', 'Foundry Relations',
    ],
    'Nuclear Energy': [
      'NRC Licensing', 'SMR Deployment', 'Nuclear Operations',
      'Fusion Energy', 'Reactor Design', 'Nuclear Safety',
      'Health Physics', 'Decommissioning', 'Nuclear Security',
    ],
    Cybersecurity: [
      'Security Strategy', 'Zero Trust', 'Threat Intelligence',
      'Red Team', 'Cloud Security', 'Incident Response', 'Compliance',
      'CMMC', 'FedRAMP', 'Penetration Testing', 'SOC Operations',
    ],
    'Aerospace & Defense': [
      'Federal Capture', 'Program Management', 'Systems Engineering',
      'Space Systems', 'Defense R&D', 'ITAR Compliance',
      'UAV/Drone Systems', 'Satellite Technology', 'Hypersonics',
    ],
    'Biotechnology': [
      'Gene Therapy', 'CRISPR/Gene Editing', 'Bioinformatics', 'Drug Discovery',
      'Clinical Trials', 'Bioprocessing', 'Synthetic Biology', 'Proteomics',
      'Immunotherapy', 'Cell Therapy', 'Biomarker Development', 'FDA Regulatory',
    ],
    'Healthcare & Medical Technology': [
      'Digital Health', 'Medical Devices', 'Telemedicine', 'Health IT/EHR',
      'Clinical Research', 'Healthcare AI', 'Precision Medicine', 'Diagnostics',
      'HIPAA Compliance', 'Health Economics', 'Remote Patient Monitoring', 'Wearables',
    ],
    'Robotics & Automation': [
      'Industrial Robotics', 'Autonomous Systems', 'RPA', 'Computer Vision',
      'Motion Planning', 'Human-Robot Interaction', 'Warehouse Automation',
      'Surgical Robotics', 'Agricultural Robotics', 'Drone Automation',
    ],
    'Clean Energy': [
      'Solar Energy', 'Wind Energy', 'Battery Storage', 'Grid Modernization',
      'Hydrogen Economy', 'Carbon Capture', 'ESG Strategy', 'Sustainability',
      'Clean Transportation', 'Green Building', 'Energy Policy',
    ],
    'Advanced Manufacturing': [
      '3D Printing', 'Smart Factories', 'Industry 4.0', 'Supply Chain',
      'Quality Engineering', 'Lean Manufacturing', 'Automation',
      'Digital Twin', 'Materials Science', 'Additive Manufacturing',
    ],
  };

  const toggleExpertise = (area: string) => {
    if (data.expertiseAreas.includes(area)) {
      onChange({ expertiseAreas: data.expertiseAreas.filter((a) => a !== area) });
    } else {
      onChange({ expertiseAreas: [...data.expertiseAreas, area] });
    }
  };

  const addService = () => {
    onChange({
      services: [
        ...data.services,
        { title: '', description: '', priceType: 'hourly', rate: 0, duration: '' },
      ],
    });
  };

  const updateService = (index: number, updates: Partial<ProviderFormData['services'][0]>) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], ...updates };
    onChange({ services: newServices });
  };

  const removeService = (index: number) => {
    onChange({ services: data.services.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Primary Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary Industry Focus <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => onChange({ primaryIndustry: industry.id, expertiseAreas: [] })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                data.primaryIndustry === industry.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mb-1 block">{industry.icon}</span>
              <span className="font-medium text-gray-900 text-xs leading-tight">{industry.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Expertise Areas */}
      {data.primaryIndustry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Areas of Expertise <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal ml-2">
              ({data.expertiseAreas.length} selected)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {expertiseOptions[data.primaryIndustry]?.map((area) => (
              <button
                key={area}
                onClick={() => toggleExpertise(area)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  data.expertiseAreas.includes(area)
                    ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {data.expertiseAreas.includes(area) && (
                  <Check className="w-4 h-4 inline mr-1" />
                )}
                {area}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Service Offerings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Service Offerings
          </label>
          <button
            onClick={addService}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        <div className="space-y-4">
          {data.services.map((service, idx) => (
            <div key={idx} className="p-5 bg-gray-50 rounded-xl relative border border-gray-200">
              <button
                onClick={() => removeService(idx)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Service Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(idx, { title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., AI Strategy Consulting"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Price Type</label>
                    <select
                      value={service.priceType}
                      onChange={(e) => updateService(idx, { priceType: e.target.value as 'hourly' | 'fixed' | 'project' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="fixed">Fixed Price</option>
                      <option value="project">Project-Based</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Rate ($)</label>
                    <input
                      type="number"
                      value={service.rate || ''}
                      onChange={(e) => updateService(idx, { rate: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  value={service.description}
                  onChange={(e) => updateService(idx, { description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe what this service includes..."
                />
              </div>
            </div>
          ))}
        </div>

        {data.services.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">No services added yet</p>
            <button
              onClick={addService}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Verification Section
const VerificationSection: React.FC<{
  data: ProviderFormData;
  onChange: (updates: Partial<ProviderFormData>) => void;
}> = ({ data, onChange }) => {
  const addReference = () => {
    onChange({
      professionalReferences: [
        ...data.professionalReferences,
        { name: '', title: '', company: '', email: '', relationship: '' },
      ],
    });
  };

  const updateReference = (
    index: number,
    updates: Partial<ProviderFormData['professionalReferences'][0]>
  ) => {
    const newRefs = [...data.professionalReferences];
    newRefs[index] = { ...newRefs[index], ...updates };
    onChange({ professionalReferences: newRefs });
  };

  const removeReference = (index: number) => {
    onChange({
      professionalReferences: data.professionalReferences.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Government ID Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Government-Issued ID <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
          {data.governmentId ? (
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">{data.governmentId.name}</span>
              <button
                onClick={() => onChange({ governmentId: null })}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                Click to upload your ID
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Passport or driver's license • PDF, JPG, PNG up to 10MB
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onChange({ governmentId: e.target.files[0] });
                  }
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* Professional References */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Professional References
            </label>
            <p className="text-sm text-gray-500">Minimum 2 required</p>
          </div>
          <button
            onClick={addReference}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Reference
          </button>
        </div>

        <div className="space-y-4">
          {data.professionalReferences.map((ref, idx) => (
            <div key={idx} className="p-5 bg-gray-50 rounded-xl relative border border-gray-200">
              <button
                onClick={() => removeReference(idx)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => updateReference(idx, { name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={ref.title}
                    onChange={(e) => updateReference(idx, { title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="VP of Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Company</label>
                  <input
                    type="text"
                    value={ref.company}
                    onChange={(e) => updateReference(idx, { company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Google"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateReference(idx, { email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.professionalReferences.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">No references added yet</p>
            <button
              onClick={addReference}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first reference
            </button>
          </div>
        )}
      </div>

      {/* Consents */}
      <div className="space-y-4 pt-4 border-t">
        <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={data.backgroundCheckConsent}
            onChange={(e) => onChange({ backgroundCheckConsent: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
          />
          <div>
            <span className="text-gray-900 font-medium">Background Check Consent <span className="text-red-500">*</span></span>
            <p className="text-gray-500 text-sm mt-1">
              I consent to a background check as part of the provider verification process.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={data.termsAccepted}
            onChange={(e) => onChange({ termsAccepted: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
          />
          <div>
            <span className="text-gray-900 font-medium">Terms & Conditions <span className="text-red-500">*</span></span>
            <p className="text-gray-500 text-sm mt-1">
              I agree to the{' '}
              <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

// Payment Section
const PaymentSection: React.FC<{
  data: ProviderFormData;
  onChange: (updates: Partial<ProviderFormData>) => void;
}> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: 'bank', label: 'Bank Transfer (ACH)', icon: Building2, desc: 'Direct deposit to your bank' },
            { id: 'paypal', label: 'PayPal', icon: Globe, desc: 'Fast international payments' },
            { id: 'stripe', label: 'Stripe Connect', icon: CreditCard, desc: 'Instant payouts available' },
          ].map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => onChange({ paymentMethod: method.id as 'bank' | 'paypal' | 'stripe' })}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  data.paymentMethod === method.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${
                  data.paymentMethod === method.id ? 'text-indigo-600' : 'text-gray-500'
                }`} />
                <span className="font-medium text-gray-900 block">{method.label}</span>
                <span className="text-sm text-gray-500">{method.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bank Details */}
      {data.paymentMethod === 'bank' && (
        <div className="p-6 bg-gray-50 rounded-xl space-y-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900">Bank Account Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Account Name</label>
              <input
                type="text"
                value={data.bankDetails.accountName}
                onChange={(e) =>
                  onChange({
                    bankDetails: { ...data.bankDetails, accountName: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Account Type</label>
              <select
                value={data.bankDetails.accountType}
                onChange={(e) =>
                  onChange({
                    bankDetails: {
                      ...data.bankDetails,
                      accountType: e.target.value as 'checking' | 'savings',
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Routing Number</label>
              <input
                type="text"
                value={data.bankDetails.routingNumber}
                onChange={(e) =>
                  onChange({
                    bankDetails: { ...data.bankDetails, routingNumber: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="123456789"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Account Number</label>
              <input
                type="text"
                value={data.bankDetails.accountNumber}
                onChange={(e) =>
                  onChange({
                    bankDetails: { ...data.bankDetails, accountNumber: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="1234567890"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tax Information */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Tax Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tax ID (SSN or EIN) <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={data.taxId}
              onChange={(e) => onChange({ taxId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="XXX-XX-XXXX or XX-XXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">W-9 Form</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
              {data.w9Uploaded ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 text-sm">{data.w9Uploaded.name}</span>
                  <button
                    onClick={() => onChange({ w9Uploaded: null })}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 text-sm">Upload W-9</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        onChange({ w9Uploaded: e.target.files[0] });
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Commission Notice */}
      <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-indigo-900 font-semibold">Platform Commission</p>
            <p className="text-indigo-700 text-sm mt-1">
              STEM Workforce charges a 15% commission on all completed projects. This covers
              payment processing, platform maintenance, and customer support. Top performers
              can qualify for reduced rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Main Component
// ===========================================

const ProviderOnboardingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState<ProviderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateFormData = useCallback((updates: Partial<ProviderFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const overallCompletion = getOverallCompletion(formData);
  const canSubmit = overallCompletion >= 80 && formData.termsAccepted && formData.backgroundCheckConsent;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for applying to become a STEM Workforce consultant. We'll review your
            application and get back to you within 3-5 business days.
          </p>
          <div className="space-y-3">
            <Link to="/dashboard">
              <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Go to Dashboard
              </button>
            </Link>
            <Link to="/">
              <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Return to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection data={formData} onChange={updateFormData} />;
      case 'background':
        return <BackgroundSection data={formData} onChange={updateFormData} />;
      case 'expertise':
        return <ExpertiseSection data={formData} onChange={updateFormData} />;
      case 'verification':
        return <VerificationSection data={formData} onChange={updateFormData} />;
      case 'payment':
        return <PaymentSection data={formData} onChange={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/become-a-provider" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Become a Provider</h1>
                <p className="text-gray-500 text-sm">Join our network of elite consultants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div className={`w-2 h-2 rounded-full ${overallCompletion >= 80 ? 'bg-green-500' : 'bg-indigo-500'}`} />
                <span className="text-sm font-medium text-gray-700">{overallCompletion}% Complete</span>
              </div>
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                <Save className="w-4 h-4" />
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Horizontal Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              const completion = getSectionCompletion(section.id, formData);
              const isActive = activeSection === section.id;
              const isCompleted = completion === 100;

              return (
                <React.Fragment key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      {section.label}
                    </span>
                    {isActive && (
                      <span className="text-xs text-gray-400 mt-0.5">{completion}%</span>
                    )}
                  </button>
                  {idx < sections.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        getSectionCompletion(sections[idx].id, formData) === 100
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h2>
                <p className="text-gray-600 mt-2">
                  {sections.find((s) => s.id === activeSection)?.description}
                </p>
              </div>

              {/* Section Content */}
              {renderSectionContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => {
                const currentIndex = sections.findIndex((s) => s.id === activeSection);
                if (currentIndex > 0) {
                  setActiveSection(sections[currentIndex - 1].id);
                }
              }}
              disabled={activeSection === sections[0].id}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                activeSection === sections[0].id
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Back
            </button>

            {activeSection === sections[sections.length - 1].id ? (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors ${
                  canSubmit
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex((s) => s.id === activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                  }
                }}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Need help?{' '}
            <a href="/support" className="text-indigo-600 hover:underline">
              Contact Support
            </a>{' '}
            or check our{' '}
            <a href="/provider-resources" className="text-indigo-600 hover:underline">
              Provider Resources
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboardingPage;
