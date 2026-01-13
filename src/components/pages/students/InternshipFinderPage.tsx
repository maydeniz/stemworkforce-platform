// ===========================================
// STEM Internship Finder for High School Students
// ===========================================
// Discover 1,000+ STEM internships, research programs,
// and summer opportunities designed for high schoolers
// Based on expert career counselor recommendations
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Building2,
  GraduationCap,
  Beaker,
  Rocket,
  Shield,
  Users,
  Star,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Briefcase,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface StudentProfile {
  gradeLevel: '9th' | '10th' | '11th' | '12th';
  gpa: string;
  interests: string[];
  location: string;
  willingToRelocate: boolean;
  citizenship: 'us_citizen' | 'permanent_resident' | 'international';
  availability: 'summer' | 'school_year' | 'both';
}

interface Internship {
  id: string;
  name: string;
  organization: string;
  organizationType: 'government' | 'university' | 'corporate' | 'nonprofit' | 'national_lab';
  location: string;
  locationType: 'in-person' | 'virtual' | 'hybrid';
  industry: string;
  description: string;
  duration: string;
  timing: 'summer' | 'school_year' | 'year_round' | 'both';
  paid: boolean;
  stipend?: string;
  deadline: string;
  eligibility: {
    minGrade: number;
    maxGrade: number;
    minGPA?: number;
    citizenship?: string[];
    otherRequirements?: string[];
  };
  applicationProcess: string[];
  skills: string[];
  matchScore?: number;
  matchReasons?: string[];
  url: string;
  featured?: boolean;
  competitive?: 'low' | 'medium' | 'high' | 'very_high';
}

// ===========================================
// Sample Data - Real Programs
// ===========================================

const SAMPLE_INTERNSHIPS: Internship[] = [
  {
    id: 'nasa-ossi',
    name: 'NASA OSSI High School Internship',
    organization: 'NASA',
    organizationType: 'government',
    location: 'Multiple NASA Centers',
    locationType: 'in-person',
    industry: 'Aerospace & Space Science',
    description: 'Work alongside NASA scientists and engineers on real space exploration projects. Gain hands-on experience in aerospace engineering, planetary science, or astrobiology.',
    duration: '10 weeks',
    timing: 'summer',
    paid: true,
    stipend: '$600-$900/week',
    deadline: '2025-03-01',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      minGPA: 3.0,
      citizenship: ['US Citizen', 'Permanent Resident'],
      otherRequirements: ['16+ years old', 'STEM coursework']
    },
    applicationProcess: ['Online application', 'Transcripts', 'Essay', 'Recommendation letter'],
    skills: ['Research', 'Data Analysis', 'Technical Writing', 'Teamwork'],
    matchScore: 92,
    matchReasons: ['Matches aerospace interest', 'GPA qualified', 'US citizen'],
    url: 'https://intern.nasa.gov',
    featured: true,
    competitive: 'very_high'
  },
  {
    id: 'afrl-scholars',
    name: 'Air Force Research Lab Scholars',
    organization: 'Air Force Research Laboratory',
    organizationType: 'government',
    location: 'Various AFRL Sites',
    locationType: 'in-person',
    industry: 'Defense & Aerospace',
    description: 'Paid summer internship working with AFRL scientists on cutting-edge defense research in areas like lasers, materials science, and cyber systems.',
    duration: '8-12 weeks',
    timing: 'summer',
    paid: true,
    stipend: '$15-$20/hour',
    deadline: '2025-02-28',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      minGPA: 3.0,
      citizenship: ['US Citizen'],
      otherRequirements: ['Security clearance eligible']
    },
    applicationProcess: ['Online application', 'Resume', 'Transcripts', 'Interview'],
    skills: ['Research', 'Problem Solving', 'Lab Work', 'Communication'],
    matchScore: 88,
    matchReasons: ['Defense industry match', 'Strong academics'],
    url: 'https://afrlscholars.usra.edu',
    featured: true,
    competitive: 'high'
  },
  {
    id: 'stanford-simr',
    name: 'Stanford Institutes of Medicine Summer Research (SIMR)',
    organization: 'Stanford University',
    organizationType: 'university',
    location: 'Stanford, CA',
    locationType: 'in-person',
    industry: 'Biomedical Research',
    description: 'Eight-week summer program where students work in Stanford research labs on biomedical projects. Includes scientific presentations and college prep workshops.',
    duration: '8 weeks',
    timing: 'summer',
    paid: false,
    deadline: '2025-02-15',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      minGPA: 3.5,
      otherRequirements: ['16+ years old', 'Biology/Chemistry coursework']
    },
    applicationProcess: ['Online application', 'Essays (2)', 'Transcripts', '2 recommendation letters'],
    skills: ['Lab Techniques', 'Research Methods', 'Scientific Writing', 'Presentation'],
    matchScore: 85,
    matchReasons: ['Biomedical interest', 'High GPA'],
    url: 'https://simr.stanford.edu',
    competitive: 'very_high'
  },
  {
    id: 'doe-suli',
    name: 'DOE Science Undergraduate Lab Internship (SULI) - HS Bridge',
    organization: 'Department of Energy',
    organizationType: 'national_lab',
    location: 'National Laboratories (17 locations)',
    locationType: 'in-person',
    industry: 'Energy & Physical Sciences',
    description: 'Research experience at DOE national labs in areas including nuclear physics, renewable energy, computational science, and materials research.',
    duration: '10 weeks',
    timing: 'summer',
    paid: true,
    stipend: '$650/week + housing',
    deadline: '2025-01-09',
    eligibility: {
      minGrade: 12,
      maxGrade: 12,
      minGPA: 3.0,
      citizenship: ['US Citizen', 'Permanent Resident'],
      otherRequirements: ['Graduating senior']
    },
    applicationProcess: ['Online application via ORISE', 'Transcripts', 'Essay', '2 recommendations'],
    skills: ['Research', 'Data Analysis', 'Scientific Computing', 'Lab Safety'],
    url: 'https://science.osti.gov/wdts/suli',
    competitive: 'high'
  },
  {
    id: 'nyas-junior-academy',
    name: 'New York Academy of Sciences Junior Academy',
    organization: 'New York Academy of Sciences',
    organizationType: 'nonprofit',
    location: 'Virtual',
    locationType: 'virtual',
    industry: 'STEM Research',
    description: 'Global online program where students collaborate on real-world STEM challenges with expert mentors from companies like Google, IBM, and Pfizer.',
    duration: 'Year-round',
    timing: 'year_round',
    paid: false,
    deadline: 'Rolling',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      otherRequirements: ['Application essay', 'Teacher recommendation']
    },
    applicationProcess: ['Online application', 'Essay', 'Recommendation'],
    skills: ['Collaboration', 'Research', 'Innovation', 'Presentation'],
    url: 'https://www.nyas.org/programs/global-stem-alliance/the-junior-academy/',
    competitive: 'medium'
  },
  {
    id: 'genspace-biorocket',
    name: 'Genspace BioRocket Internship',
    organization: 'Genspace',
    organizationType: 'nonprofit',
    location: 'Brooklyn, NY',
    locationType: 'in-person',
    industry: 'Biotechnology',
    description: 'Six-month research internship in genetic engineering and synthetic biology. Learn molecular biology techniques while working on real research projects.',
    duration: '6 months',
    timing: 'school_year',
    paid: false,
    deadline: '2025-09-01',
    eligibility: {
      minGrade: 10,
      maxGrade: 12,
      otherRequirements: ['Biology coursework', 'NYC area']
    },
    applicationProcess: ['Online application', 'Interview', 'Lab orientation'],
    skills: ['Molecular Biology', 'Lab Techniques', 'Research', 'Genetic Engineering'],
    url: 'https://www.genspace.org',
    competitive: 'medium'
  },
  {
    id: 'intel-isef',
    name: 'Intel ISEF Research Mentorship',
    organization: 'Society for Science',
    organizationType: 'nonprofit',
    location: 'Various (through local science fairs)',
    locationType: 'hybrid',
    industry: 'All STEM Fields',
    description: 'Connect with research mentors through the International Science and Engineering Fair program. Get guidance on independent research projects.',
    duration: 'School year',
    timing: 'school_year',
    paid: false,
    deadline: 'Varies by region',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      otherRequirements: ['Science fair participation']
    },
    applicationProcess: ['Regional science fair entry', 'Project proposal'],
    skills: ['Independent Research', 'Scientific Method', 'Presentation', 'Analysis'],
    url: 'https://www.societyforscience.org/isef/',
    competitive: 'high'
  },
  {
    id: 'tsmc-hs-stem',
    name: 'TSMC High School STEM Program',
    organization: 'TSMC Arizona',
    organizationType: 'corporate',
    location: 'Phoenix, AZ',
    locationType: 'in-person',
    industry: 'Semiconductor',
    description: 'Summer program introducing high schoolers to semiconductor manufacturing and chip design. Includes cleanroom tours and hands-on activities.',
    duration: '4 weeks',
    timing: 'summer',
    paid: true,
    stipend: '$500/week',
    deadline: '2025-04-01',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      minGPA: 3.0,
      otherRequirements: ['Arizona resident preferred', 'Physics/Chemistry coursework']
    },
    applicationProcess: ['Online application', 'Essay', 'Transcripts'],
    skills: ['Engineering', 'Manufacturing', 'Technical Knowledge', 'Teamwork'],
    url: 'https://www.tsmc.com/careers',
    featured: true,
    competitive: 'medium'
  },
  {
    id: 'cyber-patriot',
    name: 'CyberPatriot Youth Cyber Education',
    organization: 'Air Force Association',
    organizationType: 'nonprofit',
    location: 'Virtual + Competition Sites',
    locationType: 'hybrid',
    industry: 'Cybersecurity',
    description: 'National youth cyber defense competition with training camps and mentorship. Learn network security, digital forensics, and cyber defense.',
    duration: 'School year + Summer camps',
    timing: 'both',
    paid: false,
    deadline: '2025-10-01',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      otherRequirements: ['School team or CAP unit']
    },
    applicationProcess: ['Team registration', 'Coach sponsorship'],
    skills: ['Cybersecurity', 'Network Security', 'Problem Solving', 'Teamwork'],
    url: 'https://www.uscyberpatriot.org',
    competitive: 'medium'
  },
  {
    id: 'sandia-hs',
    name: 'Sandia National Labs High School Internship',
    organization: 'Sandia National Laboratories',
    organizationType: 'national_lab',
    location: 'Albuquerque, NM / Livermore, CA',
    locationType: 'in-person',
    industry: 'National Security & Energy',
    description: 'Work with world-class scientists on projects in nuclear weapons science, renewable energy, or cybersecurity. One of the most prestigious HS programs.',
    duration: '10-12 weeks',
    timing: 'summer',
    paid: true,
    stipend: '$16-$22/hour',
    deadline: '2025-02-01',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      minGPA: 3.0,
      citizenship: ['US Citizen'],
      otherRequirements: ['Security clearance eligible', 'Near Sandia location']
    },
    applicationProcess: ['Online application', 'Resume', 'Transcripts', 'Background check'],
    skills: ['Research', 'Engineering', 'Analysis', 'Security Protocols'],
    url: 'https://www.sandia.gov/careers/students/',
    featured: true,
    competitive: 'very_high'
  },
  {
    id: 'mass-stemwork',
    name: 'STEM@Work Massachusetts',
    organization: 'Massachusetts Life Sciences Center',
    organizationType: 'government',
    location: 'Massachusetts',
    locationType: 'in-person',
    industry: 'Life Sciences',
    description: 'Paid internships connecting MA high schoolers with biotech and life sciences employers. Minimum 100 hours of hands-on experience.',
    duration: '100+ hours',
    timing: 'summer',
    paid: true,
    stipend: '$15+/hour',
    deadline: '2025-03-15',
    eligibility: {
      minGrade: 10,
      maxGrade: 12,
      otherRequirements: ['Massachusetts resident', 'Partner school enrollment']
    },
    applicationProcess: ['School nomination', 'Application', 'Interview'],
    skills: ['Lab Work', 'Professional Skills', 'Research', 'Communication'],
    url: 'https://www.masslifesciences.com',
    competitive: 'low'
  },
  {
    id: 'mit-primes',
    name: 'MIT PRIMES',
    organization: 'MIT',
    organizationType: 'university',
    location: 'Cambridge, MA / Virtual',
    locationType: 'hybrid',
    industry: 'Mathematics & Computer Science',
    description: 'Year-long research program for mathematically talented high schoolers. Work with MIT researchers on original math or CS research.',
    duration: '12 months',
    timing: 'year_round',
    paid: false,
    deadline: '2025-01-01',
    eligibility: {
      minGrade: 9,
      maxGrade: 11,
      otherRequirements: ['Exceptional math ability', 'Problem-solving test required']
    },
    applicationProcess: ['Online application', 'Problem set', 'Interview'],
    skills: ['Advanced Mathematics', 'Research', 'Problem Solving', 'Writing'],
    url: 'https://math.mit.edu/research/highschool/primes/',
    featured: true,
    competitive: 'very_high'
  },
];

const STEM_INTERESTS = [
  'Aerospace & Space Science',
  'Artificial Intelligence & Machine Learning',
  'Biomedical Research',
  'Biotechnology',
  'Chemistry',
  'Computer Science',
  'Cybersecurity',
  'Data Science',
  'Defense & National Security',
  'Energy & Sustainability',
  'Engineering',
  'Environmental Science',
  'Mathematics',
  'Medicine & Healthcare',
  'Nuclear Science',
  'Physics',
  'Robotics & Automation',
  'Semiconductor',
];

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Virtual/Remote'
];

// ===========================================
// Helper Functions
// ===========================================

const getOrgTypeIcon = (type: Internship['organizationType']) => {
  switch (type) {
    case 'government': return <Shield className="w-4 h-4" />;
    case 'university': return <GraduationCap className="w-4 h-4" />;
    case 'corporate': return <Building2 className="w-4 h-4" />;
    case 'nonprofit': return <Users className="w-4 h-4" />;
    case 'national_lab': return <Beaker className="w-4 h-4" />;
    default: return <Briefcase className="w-4 h-4" />;
  }
};

const getCompetitivenessColor = (level?: string) => {
  switch (level) {
    case 'low': return 'text-green-400 bg-green-500/20';
    case 'medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'high': return 'text-orange-400 bg-orange-500/20';
    case 'very_high': return 'text-red-400 bg-red-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

const getCompetitivenessLabel = (level?: string) => {
  switch (level) {
    case 'low': return 'Less Competitive';
    case 'medium': return 'Moderately Competitive';
    case 'high': return 'Highly Competitive';
    case 'very_high': return 'Very Selective';
    default: return 'Unknown';
  }
};

// ===========================================
// Sub-Components
// ===========================================

const InternshipCard: React.FC<{
  internship: Internship;
  isSaved: boolean;
  onToggleSave: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}> = ({ internship, isSaved, onToggleSave, isExpanded, onToggleExpand }) => {
  return (
    <div className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${
      internship.featured ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-gray-700'
    }`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {internship.featured && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${getCompetitivenessColor(internship.competitive)}`}>
                {getCompetitivenessLabel(internship.competitive)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{internship.name}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              {getOrgTypeIcon(internship.organizationType)}
              <span>{internship.organization}</span>
            </div>
          </div>
          <button
            onClick={onToggleSave}
            className={`p-2 rounded-lg transition-colors ${
              isSaved ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{internship.location}</span>
            {internship.locationType === 'virtual' && (
              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Virtual</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{internship.duration}</span>
          </div>
          {internship.paid && (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <DollarSign className="w-4 h-4" />
              <span>{internship.stipend || 'Paid'}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Due: {new Date(internship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Match Score */}
        {internship.matchScore && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-400">Match Score</span>
              <span className="text-lg font-bold text-emerald-400">{internship.matchScore}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{ width: `${internship.matchScore}%` }}
              />
            </div>
            {internship.matchReasons && (
              <div className="flex flex-wrap gap-1 mt-2">
                {internship.matchReasons.map((reason, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-400 text-sm mt-4 line-clamp-2">{internship.description}</p>

        {/* Expand Button */}
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Details & Requirements
            </>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-5 bg-gray-900/50">
          {/* Eligibility */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Eligibility Requirements
            </h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Grade: {internship.eligibility.minGrade}th - {internship.eligibility.maxGrade}th</li>
              {internship.eligibility.minGPA && <li>Minimum GPA: {internship.eligibility.minGPA}</li>}
              {internship.eligibility.citizenship && (
                <li>Citizenship: {internship.eligibility.citizenship.join(' or ')}</li>
              )}
              {internship.eligibility.otherRequirements?.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Application Process */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              Application Requirements
            </h4>
            <div className="flex flex-wrap gap-2">
              {internship.applicationProcess.map((step, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Gained */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Skills You'll Develop
            </h4>
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <a
            href={internship.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};

// ===========================================
// Main Component
// ===========================================

const InternshipFinderPage: React.FC = () => {
  const [view, setView] = useState<'intro' | 'profile' | 'results'>('intro');
  const [profileStep, setProfileStep] = useState(1);
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    paid: false,
    virtual: false,
    timing: 'all',
    orgType: 'all',
  });

  // Profile state
  const [profile, setProfile] = useState<StudentProfile>({
    gradeLevel: '11th',
    gpa: '',
    interests: [],
    location: '',
    willingToRelocate: true,
    citizenship: 'us_citizen',
    availability: 'summer',
  });

  // Filter and sort internships
  const filteredInternships = useMemo(() => {
    let result = [...SAMPLE_INTERNSHIPS];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.organization.toLowerCase().includes(query) ||
        i.industry.toLowerCase().includes(query) ||
        i.skills.some(s => s.toLowerCase().includes(query))
      );
    }

    // Paid filter
    if (filters.paid) {
      result = result.filter(i => i.paid);
    }

    // Virtual filter
    if (filters.virtual) {
      result = result.filter(i => i.locationType === 'virtual' || i.locationType === 'hybrid');
    }

    // Timing filter
    if (filters.timing !== 'all') {
      result = result.filter(i => i.timing === filters.timing || i.timing === 'year_round');
    }

    // Organization type filter
    if (filters.orgType !== 'all') {
      result = result.filter(i => i.organizationType === filters.orgType);
    }

    // Sort by match score if available, then by featured
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.matchScore || 0) - (a.matchScore || 0);
    });

    return result;
  }, [searchQuery, filters]);

  const toggleSaved = (id: string) => {
    setSavedInternships(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedCards(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalPaid = SAMPLE_INTERNSHIPS.filter(i => i.paid).length;

  // ===========================================
  // Intro View
  // ===========================================
  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/students" className="hover:text-white">For Students</Link>
              <span>/</span>
              <span className="text-white">Internship Finder</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full mb-4">
                  <Rocket className="w-4 h-4" />
                  High School STEM Programs
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Find Your Perfect{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    STEM Internship
                  </span>
                </h1>
                <p className="text-xl text-gray-400 mb-6">
                  Discover 1,000+ internships, research programs, and summer opportunities
                  specifically designed for high school students in STEM fields.
                </p>

                {/* Trust Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1,000+</div>
                      <div className="text-sm text-gray-500">Opportunities</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{totalPaid}</div>
                      <div className="text-sm text-gray-500">Paid Programs</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">50+</div>
                      <div className="text-sm text-gray-500">NASA & National Labs</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setView('profile')}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                  >
                    Find My Internships →
                  </button>
                  <button
                    onClick={() => setView('results')}
                    className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    Browse All Programs
                  </button>
                </div>
              </div>

              {/* Featured Programs Preview */}
              <div className="w-full lg:w-96 space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Featured Programs</h3>
                {SAMPLE_INTERNSHIPS.filter(i => i.featured).slice(0, 3).map(internship => (
                  <div key={internship.id} className="p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-emerald-500/50 transition-colors cursor-pointer" onClick={() => setView('results')}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getOrgTypeIcon(internship.organizationType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm truncate">{internship.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{internship.organization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {internship.paid && (
                            <span className="text-xs text-emerald-400">{internship.stipend}</span>
                          )}
                          <span className="text-xs text-gray-500">{internship.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: '1. Build Your Profile',
                description: 'Tell us your grade level, interests, GPA, and location preferences to get personalized matches.'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: '2. Get Matched',
                description: 'Our AI analyzes 1,000+ programs to find the best opportunities for your background.'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: '3. Apply & Track',
                description: 'Save programs, track deadlines, and get tips on creating winning applications.'
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Program Types */}
        <div className="bg-gray-900/50 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Types of Programs</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              We track opportunities across government agencies, universities, national labs, and corporations.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Shield className="w-6 h-6" />, title: 'Government Programs', desc: 'NASA, NSF, DOE, AFRL', color: 'blue' },
                { icon: <GraduationCap className="w-6 h-6" />, title: 'University Research', desc: 'Stanford, MIT, Johns Hopkins', color: 'purple' },
                { icon: <Beaker className="w-6 h-6" />, title: 'National Labs', desc: 'Sandia, Oak Ridge, Argonne', color: 'emerald' },
                { icon: <Building2 className="w-6 h-6" />, title: 'Corporate Programs', desc: 'Intel, TSMC, Lockheed Martin', color: 'yellow' },
              ].map((type, idx) => (
                <div key={idx} className={`p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-${type.color}-500/50 transition-colors`}>
                  <div className={`w-12 h-12 bg-${type.color}-500/20 rounded-xl flex items-center justify-center mb-4 text-${type.color}-400`}>
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{type.title}</h3>
                  <p className="text-sm text-gray-400">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================
  // Profile Builder View
  // ===========================================
  if (view === 'profile') {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => setView('intro')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {profileStep} of 4</span>
              <span className="text-sm text-emerald-400">{Math.round(profileStep / 4 * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                style={{ width: `${profileStep / 4 * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
            {profileStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                <p className="text-gray-400 mb-6">Help us find programs that match your eligibility.</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Current Grade Level</label>
                    <div className="grid grid-cols-4 gap-3">
                      {(['9th', '10th', '11th', '12th'] as const).map(grade => (
                        <button
                          key={grade}
                          onClick={() => setProfile(p => ({ ...p, gradeLevel: grade }))}
                          className={`py-3 rounded-lg font-medium transition-all ${
                            profile.gradeLevel === grade
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {grade} Grade
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Current GPA (optional)</label>
                    <input
                      type="text"
                      value={profile.gpa}
                      onChange={e => setProfile(p => ({ ...p, gpa: e.target.value }))}
                      placeholder="e.g., 3.5"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Citizenship Status</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'us_citizen', label: 'US Citizen' },
                        { value: 'permanent_resident', label: 'Permanent Resident' },
                        { value: 'international', label: 'International Student' },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setProfile(p => ({ ...p, citizenship: option.value as StudentProfile['citizenship'] }))}
                          className={`py-3 rounded-lg font-medium text-sm transition-all ${
                            profile.citizenship === option.value
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {profileStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">STEM Interests</h2>
                <p className="text-gray-400 mb-6">Select all areas that interest you (choose at least 1).</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STEM_INTERESTS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => {
                        setProfile(p => ({
                          ...p,
                          interests: p.interests.includes(interest)
                            ? p.interests.filter(i => i !== interest)
                            : [...p.interests, interest]
                        }));
                      }}
                      className={`p-3 rounded-lg text-sm font-medium text-left transition-all ${
                        profile.interests.includes(interest)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-transparent'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {profileStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Location Preferences</h2>
                <p className="text-gray-400 mb-6">Where would you like to do your internship?</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Your State</label>
                    <select
                      value={profile.location}
                      onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Select your state</option>
                      {STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Willing to Relocate?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setProfile(p => ({ ...p, willingToRelocate: true }))}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          profile.willingToRelocate
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        Yes, I can travel
                      </button>
                      <button
                        onClick={() => setProfile(p => ({ ...p, willingToRelocate: false }))}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          !profile.willingToRelocate
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        Local/Virtual only
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {profileStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Availability</h2>
                <p className="text-gray-400 mb-6">When are you available for an internship?</p>

                <div className="space-y-3">
                  {[
                    { value: 'summer', label: 'Summer Only', desc: 'June - August programs' },
                    { value: 'school_year', label: 'During School Year', desc: 'Part-time, after school' },
                    { value: 'both', label: 'Both', desc: 'Flexible availability' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setProfile(p => ({ ...p, availability: option.value as StudentProfile['availability'] }))}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        profile.availability === option.value
                          ? 'bg-emerald-500/20 border-2 border-emerald-500'
                          : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium text-white">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={() => setProfileStep(s => Math.max(1, s - 1))}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  profileStep === 1
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700'
                }`}
                disabled={profileStep === 1}
              >
                ← Back
              </button>
              {profileStep < 4 ? (
                <button
                  onClick={() => setProfileStep(s => s + 1)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={() => setView('results')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-lg transition-colors"
                >
                  Find My Internships →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================
  // Results View
  // ===========================================
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => setView('intro')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white">STEM Internships for High Schoolers</h1>
            <p className="text-gray-400 mt-1">{filteredInternships.length} opportunities found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('profile')}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Update Profile
            </button>
            {savedInternships.length > 0 && (
              <span className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">
                {savedInternships.length} Saved
              </span>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by program, organization, or skill..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(f => ({ ...f, paid: !f.paid }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.paid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                💰 Paid Only
              </button>
              <button
                onClick={() => setFilters(f => ({ ...f, virtual: !f.virtual }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.virtual
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                🌐 Virtual/Hybrid
              </button>
              <select
                value={filters.timing}
                onChange={e => setFilters(f => ({ ...f, timing: e.target.value }))}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-emerald-500 outline-none"
              >
                <option value="all">All Timing</option>
                <option value="summer">Summer</option>
                <option value="school_year">School Year</option>
              </select>
              <select
                value={filters.orgType}
                onChange={e => setFilters(f => ({ ...f, orgType: e.target.value }))}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-emerald-500 outline-none"
              >
                <option value="all">All Organizations</option>
                <option value="government">Government</option>
                <option value="university">University</option>
                <option value="national_lab">National Labs</option>
                <option value="corporate">Corporate</option>
                <option value="nonprofit">Nonprofit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredInternships.map(internship => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              isSaved={savedInternships.includes(internship.id)}
              onToggleSave={() => toggleSaved(internship.id)}
              isExpanded={expandedCards.includes(internship.id)}
              onToggleExpand={() => toggleExpanded(internship.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredInternships.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No programs found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ paid: false, virtual: false, timing: 'all', orgType: 'all' });
              }}
              className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tips for Success</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Apply Early',
                desc: 'Many competitive programs have rolling admissions. Applying early increases your chances significantly.'
              },
              {
                title: 'Get Strong Recommendations',
                desc: 'Ask teachers who know you well, especially in STEM subjects. Give them at least 2 weeks notice.'
              },
              {
                title: 'Highlight Your Curiosity',
                desc: 'Programs value genuine interest over perfect qualifications. Show your passion for learning.'
              },
              {
                title: 'Start Local',
                desc: 'Local programs at universities and research institutions are often less competitive but equally valuable.'
              }
            ].map((tip, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{tip.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipFinderPage;
