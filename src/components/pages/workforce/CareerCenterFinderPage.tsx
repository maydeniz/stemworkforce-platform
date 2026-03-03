// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Building2,
  Navigation,
  Filter,
  ChevronDown,
  Star,
  Briefcase,
  GraduationCap,
  FileText,
  Laptop,
  HandHeart,
  Car,
  Languages,
  Accessibility,
  Baby,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
  Info
} from 'lucide-react';

// Sample Career Centers (American Job Centers)
const CAREER_CENTERS = [
  {
    id: 'ajc-001',
    name: 'Downtown Workforce Center',
    type: 'comprehensive',
    address: '100 Main Street, Suite 200',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '(217) 555-0100',
    email: 'downtown@workforce.gov',
    website: 'https://workforce.gov/downtown',
    hours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 7:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 4:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    services: ['job_search', 'resume', 'training', 'wioa', 'veterans', 'youth', 'business'],
    accessibility: ['wheelchair', 'hearing', 'vision', 'parking'],
    languages: ['English', 'Spanish', 'Vietnamese'],
    specialPrograms: ['WIOA Adult', 'WIOA Dislocated Worker', 'WIOA Youth', 'Veterans Priority', 'SNAP E&T'],
    rating: 4.5,
    reviewCount: 127,
    distance: 2.3
  },
  {
    id: 'ajc-002',
    name: 'Northside Career Connection',
    type: 'affiliate',
    address: '2500 North Oak Avenue',
    city: 'Springfield',
    state: 'IL',
    zip: '62702',
    phone: '(217) 555-0200',
    email: 'northside@workforce.gov',
    website: 'https://workforce.gov/northside',
    hours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 3:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    services: ['job_search', 'resume', 'training', 'youth'],
    accessibility: ['wheelchair', 'parking'],
    languages: ['English', 'Spanish'],
    specialPrograms: ['WIOA Youth', 'Summer Youth Employment'],
    rating: 4.2,
    reviewCount: 89,
    distance: 5.7
  },
  {
    id: 'ajc-003',
    name: 'Eastside Employment Hub',
    type: 'comprehensive',
    address: '800 Industrial Boulevard',
    city: 'Springfield',
    state: 'IL',
    zip: '62703',
    phone: '(217) 555-0300',
    email: 'eastside@workforce.gov',
    website: 'https://workforce.gov/eastside',
    hours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Closed'
    },
    services: ['job_search', 'resume', 'training', 'wioa', 'veterans', 'business', 'reentry'],
    accessibility: ['wheelchair', 'hearing', 'parking', 'childcare'],
    languages: ['English', 'Spanish', 'Arabic', 'Somali'],
    specialPrograms: ['WIOA Adult', 'WIOA Dislocated Worker', 'RESEA', 'Trade Adjustment', 'Ex-Offender Reentry'],
    rating: 4.7,
    reviewCount: 203,
    distance: 4.1
  },
  {
    id: 'ajc-004',
    name: 'West County Career Center',
    type: 'affiliate',
    address: '1200 West Highway 54',
    city: 'Jefferson City',
    state: 'IL',
    zip: '62704',
    phone: '(217) 555-0400',
    email: 'westcounty@workforce.gov',
    website: 'https://workforce.gov/westcounty',
    hours: {
      monday: '8:30 AM - 4:30 PM',
      tuesday: '8:30 AM - 4:30 PM',
      wednesday: '8:30 AM - 4:30 PM',
      thursday: '8:30 AM - 4:30 PM',
      friday: '8:30 AM - 4:30 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    services: ['job_search', 'resume', 'training'],
    accessibility: ['wheelchair', 'parking'],
    languages: ['English'],
    specialPrograms: ['WIOA Adult', 'SNAP E&T'],
    rating: 4.0,
    reviewCount: 45,
    distance: 12.5
  },
  {
    id: 'ajc-005',
    name: 'Tech Valley Workforce Innovation Center',
    type: 'specialized',
    address: '500 Technology Park Drive',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '(217) 555-0500',
    email: 'techvalley@workforce.gov',
    website: 'https://workforce.gov/techvalley',
    hours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'By Appointment',
      sunday: 'Closed'
    },
    services: ['job_search', 'resume', 'training', 'wioa', 'tech_training'],
    accessibility: ['wheelchair', 'hearing', 'vision', 'parking'],
    languages: ['English', 'Spanish', 'Mandarin'],
    specialPrograms: ['Tech Career Pathway', 'IT Bootcamps', 'Apprenticeship Programs', 'STEM Training'],
    rating: 4.8,
    reviewCount: 156,
    distance: 3.2
  }
];

// Service descriptions
const SERVICE_DESCRIPTIONS = {
  job_search: { name: 'Job Search Assistance', icon: Search, description: 'Help finding job openings and applying' },
  resume: { name: 'Resume & Interview Help', icon: FileText, description: 'Resume writing and interview coaching' },
  training: { name: 'Skills Training', icon: GraduationCap, description: 'Occupational skills training programs' },
  wioa: { name: 'WIOA Programs', icon: HandHeart, description: 'Workforce Innovation and Opportunity Act services' },
  veterans: { name: 'Veterans Services', icon: Star, description: 'Priority services for veterans' },
  youth: { name: 'Youth Programs', icon: Users, description: 'Programs for ages 14-24' },
  business: { name: 'Business Services', icon: Briefcase, description: 'Employer recruitment and training support' },
  reentry: { name: 'Reentry Services', icon: Building2, description: 'Support for formerly incarcerated individuals' },
  tech_training: { name: 'Tech Training', icon: Laptop, description: 'Technology and IT career training' }
};

// Accessibility features
const ACCESSIBILITY_FEATURES = {
  wheelchair: { name: 'Wheelchair Accessible', icon: Accessibility },
  hearing: { name: 'Hearing Assistance', icon: Info },
  vision: { name: 'Vision Assistance', icon: Info },
  parking: { name: 'Accessible Parking', icon: Car },
  childcare: { name: 'On-site Childcare', icon: Baby }
};

// Filter options
const CENTER_TYPES = [
  { value: 'all', label: 'All Centers' },
  { value: 'comprehensive', label: 'Comprehensive AJC' },
  { value: 'affiliate', label: 'Affiliate Site' },
  { value: 'specialized', label: 'Specialized Center' }
];

const SERVICE_FILTERS = [
  { value: 'wioa', label: 'WIOA Programs' },
  { value: 'veterans', label: 'Veterans Services' },
  { value: 'youth', label: 'Youth Programs' },
  { value: 'training', label: 'Skills Training' },
  { value: 'reentry', label: 'Reentry Services' },
  { value: 'tech_training', label: 'Tech Training' }
];

export default function CareerCenterFinderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<typeof CAREER_CENTERS[0] | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  // Filter and sort centers
  const filteredCenters = useMemo(() => {
    let centers = [...CAREER_CENTERS];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      centers = centers.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.zip.includes(query)
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      centers = centers.filter(c => c.type === selectedType);
    }

    // Filter by services
    if (selectedServices.length > 0) {
      centers = centers.filter(c =>
        selectedServices.every(s => c.services.includes(s))
      );
    }

    // Sort
    centers.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      return b.rating - a.rating;
    });

    return centers;
  }, [searchQuery, selectedType, selectedServices, sortBy]);

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const getDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const isOpenNow = (hours: Record<string, string>) => {
    const today = getDayOfWeek();
    const todayHours = hours[today];
    if (todayHours === 'Closed') return false;
    if (todayHours === 'By Appointment') return 'appointment';
    // Simple check - would need proper time parsing for production
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Building2 className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your American Job Center
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Locate free career services near you. American Job Centers offer job search help,
              training programs, resume assistance, and more.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter city, ZIP code, or center name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="mt-4 text-slate-400 hover:text-white flex items-center gap-2 mx-auto"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown className={`h-4 w-4 transition ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-900/80 border-b border-slate-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Center Type */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Center Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {CENTER_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Services */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Services Needed
                </label>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_FILTERS.map(service => (
                    <button
                      key={service.value}
                      onClick={() => toggleService(service.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        selectedServices.includes(service.value)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-slate-400">
              Found <span className="text-white font-semibold">{filteredCenters.length}</span> career centers
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredCenters.map((center) => {
              const openStatus = isOpenNow(center.hours);
              const today = getDayOfWeek();

              return (
                <div
                  key={center.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            center.type === 'comprehensive' ? 'bg-blue-500/20 text-blue-400' :
                            center.type === 'specialized' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {center.type === 'comprehensive' ? 'Comprehensive AJC' :
                             center.type === 'specialized' ? 'Specialized Center' : 'Affiliate'}
                          </span>
                          <span className={`flex items-center gap-1 text-xs ${
                            openStatus === true ? 'text-emerald-400' :
                            openStatus === 'appointment' ? 'text-amber-400' :
                            'text-red-400'
                          }`}>
                            <Clock className="h-3 w-3" />
                            {openStatus === true ? 'Open Now' :
                             openStatus === 'appointment' ? 'By Appointment' : 'Closed'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{center.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-semibold">{center.rating}</span>
                        </div>
                        <div className="text-slate-400 text-xs">{center.reviewCount} reviews</div>
                      </div>
                    </div>

                    {/* Address & Contact */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                        <div>
                          <div>{center.address}</div>
                          <div>{center.city}, {center.state} {center.zip}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Navigation className="h-4 w-4 text-slate-500" />
                        <span>{center.distance} miles away</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>Today: {center.hours[today]}</span>
                      </div>
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {center.services.slice(0, 5).map(service => {
                        const svc = SERVICE_DESCRIPTIONS[service];
                        if (!svc) return null;
                        return (
                          <span
                            key={service}
                            className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded"
                          >
                            {svc.name}
                          </span>
                        );
                      })}
                      {center.services.length > 5 && (
                        <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                          +{center.services.length - 5} more
                        </span>
                      )}
                    </div>

                    {/* Languages & Accessibility */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Languages className="h-3.5 w-3.5" />
                        {center.languages.join(', ')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Accessibility className="h-3.5 w-3.5" />
                        {center.accessibility.length} accessibility features
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCenter(center)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 transition"
                      >
                        View Details
                      </button>
                      <a
                        href={`tel:${center.phone}`}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                      >
                        <Phone className="h-5 w-5" />
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(`${center.address}, ${center.city}, ${center.state} ${center.zip}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                      >
                        <Navigation className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCenters.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Centers Found</h3>
              <p className="text-slate-400">
                Try adjusting your search or filters to find career centers near you.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Center Detail Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-start justify-between">
              <div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                  selectedCenter.type === 'comprehensive' ? 'bg-blue-500/20 text-blue-400' :
                  selectedCenter.type === 'specialized' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {selectedCenter.type === 'comprehensive' ? 'Comprehensive AJC' :
                   selectedCenter.type === 'specialized' ? 'Specialized Center' : 'Affiliate Site'}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{selectedCenter.name}</h2>
              </div>
              <button
                onClick={() => setSelectedCenter(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                  <div className="space-y-2">
                    <a href={`tel:${selectedCenter.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-blue-400">
                      <Phone className="h-4 w-4" />
                      {selectedCenter.phone}
                    </a>
                    <a href={`mailto:${selectedCenter.email}`} className="flex items-center gap-2 text-slate-300 hover:text-blue-400">
                      <Mail className="h-4 w-4" />
                      {selectedCenter.email}
                    </a>
                    <a href={selectedCenter.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-blue-400">
                      <Globe className="h-4 w-4" />
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Address</h3>
                  <div className="text-slate-300">
                    <div>{selectedCenter.address}</div>
                    <div>{selectedCenter.city}, {selectedCenter.state} {selectedCenter.zip}</div>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedCenter.address}, ${selectedCenter.city}, ${selectedCenter.state} ${selectedCenter.zip}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Hours of Operation</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedCenter.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-slate-400 capitalize">{day}</span>
                      <span className="text-slate-300">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Available Services</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {selectedCenter.services.map(service => {
                    const svc = SERVICE_DESCRIPTIONS[service];
                    if (!svc) return null;
                    const Icon = svc.icon;
                    return (
                      <div key={service} className="flex items-start gap-2 p-2 bg-slate-800 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-white text-sm font-medium">{svc.name}</div>
                          <div className="text-slate-400 text-xs">{svc.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Programs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Special Programs</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.specialPrograms.map(program => (
                    <span key={program} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                      {program}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accessibility & Languages */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Accessibility</h3>
                  <div className="space-y-2">
                    {selectedCenter.accessibility.map(feature => {
                      const feat = ACCESSIBILITY_FEATURES[feature];
                      if (!feat) return null;
                      return (
                        <div key={feature} className="flex items-center gap-2 text-slate-300 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          {feat.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCenter.languages.map(lang => (
                      <span key={lang} className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Schedule Appointment */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Visit?</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Schedule an appointment with a career counselor to discuss your employment goals.
                </p>
                <button className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What to Expect Section */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What to Expect at a Career Center</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              American Job Centers provide free career services to all job seekers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Meet with a Counselor</h3>
              <p className="text-slate-400">
                Work one-on-one with a career counselor to assess your skills, interests, and employment goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Laptop className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Access Resources</h3>
              <p className="text-slate-400">
                Use computers, job boards, and online tools to search for jobs and improve your skills.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Training</h3>
              <p className="text-slate-400">
                Learn about funded training programs and scholarships to develop new career skills.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/50 to-slate-900 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Can't Find a Center Near You?
            </h2>
            <p className="text-slate-300 mb-6">
              Many services are also available online or by phone. Contact the national CareerOneStop helpline.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:1-877-872-5627"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                1-877-US2-JOBS
              </a>
              <a
                href="https://www.careeronestop.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <Globe className="h-5 w-5" />
                CareerOneStop.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
