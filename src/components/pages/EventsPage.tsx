// @ts-nocheck
import React, { useState } from 'react';

// Event categories with icons and colors
const eventCategories = [
  { id: 'conference', name: 'Conferences & Summits', icon: '🎤', color: '#8b5cf6' },
  { id: 'job-fair', name: 'Job Fairs', icon: '💼', color: '#3b82f6' },
  { id: 'training', name: 'Training & Workshops', icon: '🎓', color: '#10b981' },
  { id: 'networking', name: 'Networking Events', icon: '🤝', color: '#f59e0b' },
  { id: 'hands-on', name: 'Hands-On & Tours', icon: '🔧', color: '#ec4899' },
  { id: 'hiring', name: 'Hiring Events', icon: '📋', color: '#06b6d4' },
  { id: 'webinar', name: 'Webinars & Virtual', icon: '💻', color: '#6366f1' },
  { id: 'community', name: 'Community & Outreach', icon: '🌟', color: '#14b8a6' },
];

// Industries
const industries = [
  { id: 'all', name: 'All Industries', icon: '🏭' },
  { id: 'semiconductor', name: 'Semiconductor', icon: '💎' },
  { id: 'nuclear', name: 'Nuclear Energy', icon: '☢️' },
  { id: 'aerospace', name: 'Aerospace & Defense', icon: '🚀' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
  { id: 'cyber', name: 'Cybersecurity', icon: '🛡️' },
  { id: 'quantum', name: 'Quantum Computing', icon: '⚛️' },
  { id: 'biotech', name: 'Biotechnology', icon: '🧬' },
  { id: 'robotics', name: 'Robotics & Automation', icon: '🦾' },
  { id: 'cleanenergy', name: 'Clean Energy', icon: '⚡' },
  { id: 'advmfg', name: 'Advanced Manufacturing', icon: '🏭' },
];

// Audience types
const audienceTypes = [
  { id: 'job-seekers', name: 'Job Seekers', icon: '👤', color: '#3b82f6' },
  { id: 'employers', name: 'Employers', icon: '🏢', color: '#10b981' },
  { id: 'educators', name: 'Educators & Training Providers', icon: '🎓', color: '#8b5cf6' },
  { id: 'students', name: 'Students', icon: '📚', color: '#f59e0b' },
  { id: 'government', name: 'Government & Policy Makers', icon: '🏛️', color: '#64748b' },
  { id: 'veterans', name: 'Veterans', icon: '🎖️', color: '#059669' },
  { id: 'career-changers', name: 'Career Changers', icon: '🔄', color: '#06b6d4' },
];

// Format options
const formatOptions = [
  { id: 'in-person', name: 'In-Person', icon: '📍' },
  { id: 'virtual', name: 'Virtual', icon: '💻' },
  { id: 'hybrid', name: 'Hybrid', icon: '🔄' },
];

// US Regions
const regions = [
  { id: 'all', name: 'All Regions' },
  { id: 'northeast', name: 'Northeast', states: ['CT', 'DE', 'MA', 'MD', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'] },
  { id: 'southeast', name: 'Southeast', states: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'] },
  { id: 'midwest', name: 'Midwest', states: ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'] },
  { id: 'southwest', name: 'Southwest', states: ['AZ', 'NM', 'OK', 'TX'] },
  { id: 'west', name: 'West', states: ['CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY', 'AK'] },
  { id: 'national', name: 'National/Virtual' },
];

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: '2025 National Workforce Development Conference',
    subtitle: 'Bridging Industry, Academia & Government for Emerging Tech Workforce',
    category: 'conference',
    industries: ['semiconductor', 'nuclear', 'aerospace', 'ai', 'cyber', 'advmfg'],
    audiences: ['employers', 'educators', 'government'],
    format: 'hybrid',
    date: '2025-03-15',
    endDate: '2025-03-17',
    time: '8:00 AM - 5:00 PM EST',
    location: 'Washington D.C.',
    state: 'DC',
    venue: 'Walter E. Washington Convention Center',
    description: 'Join 2,000+ workforce development leaders for three days of keynotes, panels, and networking. Featuring sessions on CHIPS Act implementation, apprenticeship innovations, and emerging tech talent pipelines.',
    speakers: ['Secretary of Commerce', 'Intel VP of Workforce', 'Community College Presidents'],
    price: 'Early Bird: $299 | Regular: $449',
    registrationUrl: '#',
    featured: true,
    attendees: 1850,
    capacity: 2000,
  },
  {
    id: 2,
    title: 'Semiconductor Career Fair - Arizona',
    subtitle: 'Meet Top Employers: Intel, TSMC, Microchip & More',
    category: 'job-fair',
    industries: ['semiconductor'],
    audiences: ['job-seekers', 'veterans', 'career-changers'],
    format: 'in-person',
    date: '2025-02-22',
    time: '10:00 AM - 4:00 PM MST',
    location: 'Phoenix, AZ',
    state: 'AZ',
    venue: 'Phoenix Convention Center',
    description: 'Over 30 semiconductor employers with 5,000+ open positions. On-site interviews, resume reviews, and career coaching available. All experience levels welcome - from entry-level operators to senior engineers.',
    employers: ['Intel', 'TSMC Arizona', 'Microchip Technology', 'ON Semiconductor', 'NXP'],
    price: 'FREE',
    registrationUrl: '#',
    featured: true,
    attendees: 2400,
    capacity: 3000,
  },
  {
    id: 3,
    title: 'Nuclear Energy Workforce Summit',
    subtitle: 'Building the Next Generation Nuclear Workforce',
    category: 'conference',
    industries: ['nuclear'],
    audiences: ['employers', 'educators', 'government', 'students'],
    format: 'in-person',
    date: '2025-04-10',
    endDate: '2025-04-11',
    time: '9:00 AM - 4:00 PM EST',
    location: 'Oak Ridge, TN',
    state: 'TN',
    venue: 'Oak Ridge National Laboratory Conference Center',
    description: 'Explore workforce strategies for nuclear renaissance including SMR deployment, plant life extensions, and nuclear security. Tours of ORNL facilities available.',
    speakers: ['NRC Commissioner', 'TVA Chief Nuclear Officer', 'DOE Officials'],
    price: '$199',
    registrationUrl: '#',
    featured: false,
    attendees: 420,
    capacity: 500,
  },
  {
    id: 4,
    title: 'AI/ML Engineering Virtual Career Fair',
    subtitle: 'Connect with Leading AI Companies from Anywhere',
    category: 'job-fair',
    industries: ['ai'],
    audiences: ['job-seekers', 'students', 'career-changers'],
    format: 'virtual',
    date: '2025-02-28',
    time: '11:00 AM - 6:00 PM EST',
    location: 'Virtual',
    state: 'National',
    venue: 'Online Platform',
    description: 'Virtual career fair featuring 50+ AI/ML employers. Video chat with recruiters, attend tech talks, and apply directly. Roles range from ML Engineers to AI Research Scientists.',
    employers: ['Google', 'Meta', 'OpenAI', 'Anthropic', 'NVIDIA', 'Microsoft'],
    price: 'FREE',
    registrationUrl: '#',
    featured: true,
    attendees: 5200,
    capacity: 10000,
  },
  {
    id: 5,
    title: 'Clean Room Technician Training Open House',
    subtitle: 'Explore Fast-Track Careers in Semiconductor Manufacturing',
    category: 'training',
    industries: ['semiconductor'],
    audiences: ['job-seekers', 'career-changers', 'veterans'],
    format: 'in-person',
    date: '2025-02-15',
    time: '9:00 AM - 1:00 PM MST',
    location: 'Chandler, AZ',
    state: 'AZ',
    venue: 'Maricopa Community Colleges - Center for Semiconductor Training',
    description: 'Tour our state-of-the-art clean room training facility. Learn about 12-week certification programs with 94% job placement. Meet current students and employer partners.',
    price: 'FREE',
    registrationUrl: '#',
    featured: false,
    attendees: 85,
    capacity: 100,
  },
  {
    id: 6,
    title: 'Cybersecurity Hiring Event - Fort Meade',
    subtitle: 'NSA, CISA, and Defense Contractors Hiring Cleared Professionals',
    category: 'hiring',
    industries: ['cyber'],
    audiences: ['job-seekers', 'veterans'],
    format: 'in-person',
    date: '2025-03-05',
    time: '10:00 AM - 3:00 PM EST',
    location: 'Fort Meade, MD',
    state: 'MD',
    venue: 'NSA Visitor Center',
    description: 'Exclusive hiring event for candidates with active security clearances. On-site interviews and same-day conditional offers for qualified candidates.',
    employers: ['NSA', 'CISA', 'Northrop Grumman', 'Booz Allen Hamilton', 'SAIC'],
    price: 'FREE (Clearance Required)',
    registrationUrl: '#',
    featured: false,
    attendees: 320,
    capacity: 400,
  },
  {
    id: 7,
    title: 'Women in STEM: Breaking Barriers in Emerging Tech',
    subtitle: 'Networking, Mentorship & Career Development',
    category: 'networking',
    industries: ['semiconductor', 'ai', 'cyber', 'biotech', 'aerospace'],
    audiences: ['job-seekers', 'students', 'career-changers'],
    format: 'hybrid',
    date: '2025-03-08',
    time: '6:00 PM - 9:00 PM EST',
    location: 'Boston, MA',
    state: 'MA',
    venue: 'MIT Media Lab + Virtual',
    description: 'International Women\'s Day celebration featuring panels on career advancement, mentor speed-dating, and networking reception. Virtual attendance option available.',
    speakers: ['Female Tech Executives', 'STEM Faculty Leaders', 'Startup Founders'],
    price: 'In-Person: $45 | Virtual: FREE',
    registrationUrl: '#',
    featured: true,
    attendees: 680,
    capacity: 800,
  },
  {
    id: 8,
    title: 'Intel Fab Tour & Career Information Session',
    subtitle: 'See Inside a $20 Billion Semiconductor Fab',
    category: 'hands-on',
    industries: ['semiconductor'],
    audiences: ['students', 'job-seekers', 'educators'],
    format: 'in-person',
    date: '2025-02-20',
    time: '1:00 PM - 4:00 PM MST',
    location: 'Chandler, AZ',
    state: 'AZ',
    venue: 'Intel Ocotillo Campus',
    description: 'Exclusive facility tour showcasing semiconductor manufacturing. Learn about career paths from entry-level to engineering. Gowning experience and clean room viewing included.',
    price: 'FREE (Pre-registration Required)',
    registrationUrl: '#',
    featured: false,
    attendees: 45,
    capacity: 50,
  },
  {
    id: 9,
    title: 'Aerospace & Defense Industry Day',
    subtitle: 'Regional Hiring Event for Colorado\'s Space Industry',
    category: 'job-fair',
    industries: ['aerospace'],
    audiences: ['job-seekers', 'veterans', 'students'],
    format: 'in-person',
    date: '2025-03-20',
    time: '9:00 AM - 4:00 PM MST',
    location: 'Colorado Springs, CO',
    state: 'CO',
    venue: 'The Broadmoor',
    description: 'Meet 40+ aerospace and defense employers including Lockheed Martin, Ball Aerospace, and United Launch Alliance. Security clearance processing available on-site.',
    employers: ['Lockheed Martin', 'Ball Aerospace', 'United Launch Alliance', 'Sierra Space', 'Northrop Grumman'],
    price: 'FREE',
    registrationUrl: '#',
    featured: false,
    attendees: 1200,
    capacity: 1500,
  },
  {
    id: 10,
    title: 'Quantum Computing Career Webinar Series',
    subtitle: 'Pathways into the Quantum Workforce',
    category: 'webinar',
    industries: ['quantum'],
    audiences: ['students', 'job-seekers', 'career-changers', 'educators'],
    format: 'virtual',
    date: '2025-02-18',
    time: '2:00 PM - 3:30 PM EST',
    location: 'Virtual',
    state: 'National',
    venue: 'Zoom Webinar',
    description: 'Learn about emerging career opportunities in quantum computing. Panelists from IBM Quantum, Google, and national labs discuss skills needed and how to prepare.',
    speakers: ['IBM Quantum Researcher', 'Google Quantum AI Engineer', 'DOE Quantum Program Manager'],
    price: 'FREE',
    registrationUrl: '#',
    featured: false,
    attendees: 890,
    capacity: 1000,
  },
  {
    id: 11,
    title: 'Advanced Manufacturing Apprenticeship Signing Day',
    subtitle: 'Celebrate New Apprentices Launching Their Careers',
    category: 'community',
    industries: ['advmfg'],
    audiences: ['students', 'employers', 'educators', 'government'],
    format: 'in-person',
    date: '2025-04-15',
    time: '4:00 PM - 6:00 PM EST',
    location: 'Detroit, MI',
    state: 'MI',
    venue: 'Cobo Center',
    description: 'Join us as 200+ apprentices sign with Michigan manufacturers. NCAA signing day style event celebrating the skilled trades. Media welcome.',
    employers: ['Ford', 'GM', 'Stellantis', 'BorgWarner', 'Magna'],
    price: 'FREE',
    registrationUrl: '#',
    featured: false,
    attendees: 450,
    capacity: 600,
  },
  {
    id: 12,
    title: 'High School STEM Career Exploration Day',
    subtitle: 'Discover Careers in Emerging Technologies',
    category: 'community',
    industries: ['semiconductor', 'ai', 'robotics', 'biotech', 'cleanenergy'],
    audiences: ['students'],
    format: 'in-person',
    date: '2025-04-22',
    time: '8:00 AM - 2:00 PM EST',
    location: 'Columbus, OH',
    state: 'OH',
    venue: 'Ohio State University',
    description: 'Free event for high school students to explore STEM careers. Hands-on activities, lab tours, employer panels, and college admissions info. Bus transportation available from partner schools.',
    price: 'FREE (Schools must register)',
    registrationUrl: '#',
    featured: false,
    attendees: 800,
    capacity: 1000,
  },
  {
    id: 13,
    title: 'Veteran Transition to Tech Career Fair',
    subtitle: 'Translating Military Skills to Civilian Tech Careers',
    category: 'job-fair',
    industries: ['semiconductor', 'cyber', 'aerospace', 'nuclear', 'advmfg'],
    audiences: ['veterans'],
    format: 'hybrid',
    date: '2025-03-12',
    time: '10:00 AM - 4:00 PM EST',
    location: 'San Antonio, TX',
    state: 'TX',
    venue: 'Joint Base San Antonio + Virtual',
    description: 'Dedicated career fair for transitioning service members and veterans. Employers committed to veteran hiring. Resume translation workshops and skills assessments included.',
    employers: ['Lockheed Martin', 'SAIC', 'Booz Allen', 'Amazon', 'Intel'],
    price: 'FREE',
    registrationUrl: '#',
    featured: true,
    attendees: 1100,
    capacity: 1500,
  },
  {
    id: 14,
    title: 'Biotech Lab Skills Bootcamp',
    subtitle: '2-Day Intensive: Cell Culture & Lab Techniques',
    category: 'training',
    industries: ['biotech'],
    audiences: ['job-seekers', 'career-changers', 'students'],
    format: 'in-person',
    date: '2025-03-22',
    endDate: '2025-03-23',
    time: '8:00 AM - 5:00 PM EST',
    location: 'Research Triangle Park, NC',
    state: 'NC',
    venue: 'NC Biotechnology Center',
    description: 'Hands-on bootcamp covering essential biotech lab skills. Certificate of completion provided. Hiring partners include Biogen, Novo Nordisk, and Merck.',
    price: '$149 (Scholarships Available)',
    registrationUrl: '#',
    featured: false,
    attendees: 35,
    capacity: 40,
  },
  {
    id: 15,
    title: 'Employer-Educator Partnership Forum',
    subtitle: 'Aligning Curriculum with Industry Needs',
    category: 'networking',
    industries: ['semiconductor', 'advmfg', 'robotics'],
    audiences: ['employers', 'educators'],
    format: 'in-person',
    date: '2025-04-08',
    time: '9:00 AM - 3:00 PM EST',
    location: 'Indianapolis, IN',
    state: 'IN',
    venue: 'Ivy Tech Corporate College',
    description: 'Facilitated matchmaking between manufacturers and training providers. Develop new apprenticeship programs, co-design curriculum, and establish talent pipelines.',
    price: '$75',
    registrationUrl: '#',
    featured: false,
    attendees: 120,
    capacity: 150,
  },
];

export default function EventsPage() {
  const [events] = useState(sampleEvents);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [userType, setUserType] = useState(null);
  
  // New event submission form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    subtitle: '',
    category: 'job-fair',
    industries: [],
    audiences: [],
    format: 'in-person',
    date: '',
    endDate: '',
    time: '',
    location: '',
    state: '',
    venue: '',
    description: '',
    speakers: '',
    employers: '',
    price: '',
    isFree: false,
    capacity: '',
    registrationUrl: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    organizationName: '',
  });

  // Handle form input changes
  const handleEventInputChange = (field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  // Toggle industry selection for new event
  const toggleEventIndustry = (industryId) => {
    setNewEvent(prev => ({
      ...prev,
      industries: prev.industries.includes(industryId)
        ? prev.industries.filter(i => i !== industryId)
        : [...prev.industries, industryId]
    }));
  };

  // Toggle audience selection for new event
  const toggleEventAudience = (audienceId) => {
    setNewEvent(prev => ({
      ...prev,
      audiences: prev.audiences.includes(audienceId)
        ? prev.audiences.filter(a => a !== audienceId)
        : [...prev.audiences, audienceId]
    }));
  };

  // Submit new event
  const handleSubmitEvent = () => {
    // Validation
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.contactEmail) {
      alert('Please fill in all required fields: Title, Date, Location, and Contact Email');
      return;
    }
    
    // In production, this would send to backend API
    console.log('Submitted event:', newEvent);
    alert('🎉 Event submitted successfully! Our team will review it within 2-3 business days. You will receive a confirmation email at ' + newEvent.contactEmail);
    
    // Reset form and close modal
    setNewEvent({
      title: '',
      subtitle: '',
      category: 'job-fair',
      industries: [],
      audiences: [],
      format: 'in-person',
      date: '',
      endDate: '',
      time: '',
      location: '',
      state: '',
      venue: '',
      description: '',
      speakers: '',
      employers: '',
      price: '',
      isFree: false,
      capacity: '',
      registrationUrl: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      organizationName: '',
    });
    setShowSubmitModal(false);
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'all' || event.industries.includes(selectedIndustry);
    const matchesAudience = selectedAudience === 'all' || event.audiences.includes(selectedAudience);
    const matchesFormat = selectedFormat === 'all' || event.format === selectedFormat;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Region filtering
    let matchesRegion = true;
    if (selectedRegion !== 'all') {
      const region = regions.find(r => r.id === selectedRegion);
      if (region && region.states) {
        matchesRegion = region.states.includes(event.state);
      } else if (selectedRegion === 'national') {
        matchesRegion = event.format === 'virtual' || event.state === 'National';
      }
    }
    
    return matchesCategory && matchesIndustry && matchesAudience && matchesFormat && matchesRegion && matchesSearch;
  });

  // Get featured events
  const featuredEvents = events.filter(e => e.featured);

  // Get upcoming events (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= today && eventDate <= nextWeek;
  });

  // Format date
  const formatDate = (dateStr, endDateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', options)}`;
    }
    return date.toLocaleDateString('en-US', options);
  };

  // Get days until event
  const getDaysUntil = (dateStr) => {
    const eventDate = new Date(dateStr);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `In ${diffDays} days`;
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
      padding: '32px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    filterBar: {
      padding: '20px 32px',
      background: 'rgba(0,0,0,0.2)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    main: {
      padding: 32,
      maxWidth: 1600,
      margin: '0 auto',
    },
    card: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    },
    tag: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 10px',
      background: `${color}20`,
      color: color,
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 500,
    }),
    button: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      border: 'none',
      borderRadius: 10,
      color: '#fff',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    select: {
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 8,
      color: '#fff',
      fontSize: 13,
      outline: 'none',
      cursor: 'pointer',
      minWidth: 160,
    },
    input: {
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 8,
      color: '#fff',
      fontSize: 13,
      outline: 'none',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 24,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          📅 Workforce Events
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 700, margin: '0 auto' }}>
          Connect with employers, training providers, and industry leaders at events designed for your career journey
        </p>
        
        {/* User Type Selection for Personalized Recommendations */}
        {!userType && (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>I am a...</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {audienceTypes.slice(0, 5).map(audience => (
                <button
                  key={audience.id}
                  onClick={() => {
                    setUserType(audience.id);
                    setSelectedAudience(audience.id);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 100,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = `${audience.color}20`;
                    e.currentTarget.style.borderColor = audience.color;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  {audience.icon} {audience.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', maxWidth: 1600, margin: '0 auto' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
            <input
              type="text"
              placeholder="🔍 Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...styles.input, width: '100%', paddingLeft: 16 }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Event Types</option>
            {eventCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            style={styles.select}
          >
            {industries.map(ind => (
              <option key={ind.id} value={ind.id}>{ind.icon} {ind.name}</option>
            ))}
          </select>

          {/* Audience Filter */}
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Audiences</option>
            {audienceTypes.map(aud => (
              <option key={aud.id} value={aud.id}>{aud.icon} {aud.name}</option>
            ))}
          </select>

          {/* Format Filter */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Formats</option>
            {formatOptions.map(fmt => (
              <option key={fmt.id} value={fmt.id}>{fmt.icon} {fmt.name}</option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={styles.select}
          >
            {regions.map(reg => (
              <option key={reg.id} value={reg.id}>{reg.name}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(selectedCategory !== 'all' || selectedIndustry !== 'all' || selectedAudience !== 'all' || selectedFormat !== 'all' || selectedRegion !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedIndustry('all');
                setSelectedAudience('all');
                setSelectedFormat('all');
                setSelectedRegion('all');
                setSearchQuery('');
              }}
              style={{
                padding: '10px 16px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              ✕ Clear
            </button>
          )}

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '10px 14px',
                background: viewMode === 'grid' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                border: viewMode === 'grid' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px 0 0 8px',
                color: viewMode === 'grid' ? '#a5b4fc' : '#64748b',
                cursor: 'pointer',
              }}
            >
              ▦ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px 14px',
                background: viewMode === 'list' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                border: viewMode === 'list' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '0 8px 8px 0',
                color: viewMode === 'list' ? '#a5b4fc' : '#64748b',
                cursor: 'pointer',
              }}
            >
              ☰ List
            </button>
          </div>
        </div>
      </div>

      <main style={styles.main}>
        {/* Featured Events Section */}
        {selectedCategory === 'all' && selectedIndustry === 'all' && !searchQuery && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              ⭐ Featured Events
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 24 }}>
              {featuredEvents.map(event => {
                const category = eventCategories.find(c => c.id === event.category);
                return (
                  <div
                    key={event.id}
                    style={{
                      ...styles.card,
                      border: '2px solid rgba(251, 191, 36, 0.3)',
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(255,255,255,0.03) 100%)',
                    }}
                    onClick={() => setSelectedEvent(event)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {/* Featured Badge */}
                    <div style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                      color: '#0f0f23',
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                      ⭐ Featured Event
                    </div>
                    
                    <div style={{ padding: 20 }}>
                      {/* Date & Category */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{
                          padding: '6px 12px',
                          background: 'rgba(251, 191, 36, 0.2)',
                          color: '#fbbf24',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                        }}>
                          📅 {formatDate(event.date, event.endDate)}
                        </span>
                        <span style={styles.tag(category?.color || '#6366f1')}>
                          {category?.icon} {category?.name}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{event.title}</h3>
                      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16 }}>{event.subtitle}</p>

                      {/* Location & Format */}
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: '#64748b' }}>
                        <span>📍 {event.location}</span>
                        <span>{formatOptions.find(f => f.id === event.format)?.icon} {formatOptions.find(f => f.id === event.format)?.name}</span>
                      </div>

                      {/* Industries */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        {event.industries.slice(0, 4).map(ind => {
                          const industry = industries.find(i => i.id === ind);
                          return (
                            <span key={ind} style={{ fontSize: 12, color: '#94a3b8' }}>
                              {industry?.icon}
                            </span>
                          );
                        })}
                        {event.industries.length > 4 && (
                          <span style={{ fontSize: 12, color: '#64748b' }}>+{event.industries.length - 4} more</span>
                        )}
                      </div>

                      {/* Capacity Bar */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: '#64748b' }}>{event.attendees.toLocaleString()} registered</span>
                          <span style={{ color: '#f59e0b' }}>{Math.round(event.attendees / event.capacity * 100)}% full</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                          <div style={{
                            width: `${Math.min(event.attendees / event.capacity * 100, 100)}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                            borderRadius: 3,
                          }} />
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: event.price === 'FREE' ? '#10b981' : '#fff',
                        }}>
                          {event.price}
                        </span>
                        <button style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                          border: 'none',
                          borderRadius: 8,
                          color: '#0f0f23',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}>
                          Register Now →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            {selectedCategory === 'all' && selectedIndustry === 'all' && !searchQuery ? '📋 All Events' : '🔍 Search Results'}
            <span style={{ fontSize: 14, fontWeight: 400, color: '#64748b', marginLeft: 12 }}>
              {filteredEvents.length} events found
            </span>
          </h2>
        </div>

        {/* Events Grid/List */}
        {viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {filteredEvents.map(event => {
              const category = eventCategories.find(c => c.id === event.category);
              const daysUntil = getDaysUntil(event.date);
              
              return (
                <div
                  key={event.id}
                  style={styles.card}
                  onClick={() => setSelectedEvent(event)}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ padding: 20 }}>
                    {/* Days Until Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{
                        padding: '4px 10px',
                        background: daysUntil === 'Today' || daysUntil === 'Tomorrow' 
                          ? 'rgba(239, 68, 68, 0.2)' 
                          : 'rgba(99, 102, 241, 0.2)',
                        color: daysUntil === 'Today' || daysUntil === 'Tomorrow' ? '#f87171' : '#a5b4fc',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {daysUntil}
                      </span>
                      <span style={styles.tag(category?.color || '#6366f1')}>
                        {category?.icon} {category?.name.split(' ')[0]}
                      </span>
                    </div>

                    {/* Date */}
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                      📅 {formatDate(event.date, event.endDate)} • {event.time}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{event.title}</h3>

                    {/* Location */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 13, color: '#94a3b8' }}>
                      <span>📍 {event.location}</span>
                      <span>{formatOptions.find(f => f.id === event.format)?.icon} {formatOptions.find(f => f.id === event.format)?.name}</span>
                    </div>

                    {/* Audiences */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {event.audiences.map(aud => {
                        const audience = audienceTypes.find(a => a.id === aud);
                        return (
                          <span key={aud} style={styles.tag(audience?.color || '#64748b')}>
                            {audience?.icon} {audience?.name.split(' ')[0]}
                          </span>
                        );
                      })}
                    </div>

                    {/* Price & Register */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: event.price === 'FREE' ? '#10b981' : '#fff',
                      }}>
                        {event.price === 'FREE' ? '✓ FREE' : event.price}
                      </span>
                      <button style={{
                        padding: '8px 16px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: 8,
                        color: '#a5b4fc',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}>
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredEvents.map(event => {
              const category = eventCategories.find(c => c.id === event.category);
              
              return (
                <div
                  key={event.id}
                  style={{
                    ...styles.card,
                    display: 'flex',
                    alignItems: 'center',
                    padding: 20,
                    gap: 24,
                  }}
                  onClick={() => setSelectedEvent(event)}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  {/* Date Box */}
                  <div style={{
                    width: 70,
                    height: 70,
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#a5b4fc' }}>
                      {new Date(event.date).getDate()}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600 }}>{event.title}</h3>
                      <span style={styles.tag(category?.color || '#6366f1')}>
                        {category?.icon} {category?.name.split(' ')[0]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                      <span>📍 {event.location}</span>
                      <span>{event.time}</span>
                      <span>{formatOptions.find(f => f.id === event.format)?.icon} {formatOptions.find(f => f.id === event.format)?.name}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: event.price === 'FREE' ? '#10b981' : '#fff',
                      marginBottom: 8,
                    }}>
                      {event.price === 'FREE' ? '✓ FREE' : event.price}
                    </div>
                    <button style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      borderRadius: 8,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}>
                      Register →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No Events Found</h3>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedIndustry('all');
                setSelectedAudience('all');
                setSelectedFormat('all');
                setSelectedRegion('all');
                setSearchQuery('');
              }}
              style={styles.button}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Submit Event CTA */}
        <section style={{
          marginTop: 48,
          padding: 32,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: 20,
          border: '1px solid rgba(99, 102, 241, 0.2)',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            🎪 Hosting a Workforce Event?
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>
            Submit your conference, job fair, training workshop, or networking event to reach thousands of workforce development stakeholders
          </p>
          <button 
            style={styles.button}
            onClick={() => setShowSubmitModal(true)}
          >
            📤 Submit Your Event
          </button>
        </section>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div style={styles.modal} onClick={() => setSelectedEvent(null)}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.1)',
              width: '100%',
              maxWidth: 800,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: 24,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}>
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span style={styles.tag(eventCategories.find(c => c.id === selectedEvent.category)?.color || '#6366f1')}>
                    {eventCategories.find(c => c.id === selectedEvent.category)?.icon} {eventCategories.find(c => c.id === selectedEvent.category)?.name}
                  </span>
                  <span style={styles.tag(formatOptions.find(f => f.id === selectedEvent.format)?.id === 'virtual' ? '#06b6d4' : '#10b981')}>
                    {formatOptions.find(f => f.id === selectedEvent.format)?.icon} {formatOptions.find(f => f.id === selectedEvent.format)?.name}
                  </span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{selectedEvent.title}</h2>
                <p style={{ color: '#94a3b8' }}>{selectedEvent.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24 }}>
              {/* Key Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                marginBottom: 24,
              }}>
                <div style={{
                  padding: 16,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>📅 Date & Time</div>
                  <div style={{ fontWeight: 600 }}>{formatDate(selectedEvent.date, selectedEvent.endDate)}</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>{selectedEvent.time}</div>
                </div>
                <div style={{
                  padding: 16,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>📍 Location</div>
                  <div style={{ fontWeight: 600 }}>{selectedEvent.venue}</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>{selectedEvent.location}</div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#a5b4fc' }}>About This Event</h4>
                <p style={{ color: '#e2e8f0', lineHeight: 1.6 }}>{selectedEvent.description}</p>
              </div>

              {/* Industries */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#a5b4fc' }}>Industries</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedEvent.industries.map(ind => {
                    const industry = industries.find(i => i.id === ind);
                    return (
                      <span key={ind} style={styles.tag('#6366f1')}>
                        {industry?.icon} {industry?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Target Audience */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#a5b4fc' }}>Who Should Attend</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedEvent.audiences.map(aud => {
                    const audience = audienceTypes.find(a => a.id === aud);
                    return (
                      <span key={aud} style={styles.tag(audience?.color || '#64748b')}>
                        {audience?.icon} {audience?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Speakers or Employers */}
              {selectedEvent.speakers && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#a5b4fc' }}>Featured Speakers</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedEvent.speakers.map(speaker => (
                      <span key={speaker} style={{
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}>
                        🎤 {speaker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.employers && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#a5b4fc' }}>Participating Employers</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedEvent.employers.map(employer => (
                      <span key={employer} style={{
                        padding: '6px 12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: 8,
                        fontSize: 13,
                        color: '#10b981',
                      }}>
                        🏢 {employer}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#a5b4fc' }}>Registration Status</h4>
                <div style={{
                  padding: 16,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 12,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#64748b' }}>{selectedEvent.attendees.toLocaleString()} registered</span>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                      {selectedEvent.capacity - selectedEvent.attendees} spots remaining
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                    <div style={{
                      width: `${Math.min(selectedEvent.attendees / selectedEvent.capacity * 100, 100)}%`,
                      height: '100%',
                      background: selectedEvent.attendees / selectedEvent.capacity > 0.9 
                        ? 'linear-gradient(90deg, #ef4444, #f87171)'
                        : 'linear-gradient(90deg, #10b981, #34d399)',
                      borderRadius: 4,
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: 24,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Registration</div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: selectedEvent.price === 'FREE' ? '#10b981' : '#fff',
                }}>
                  {selectedEvent.price}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{
                  padding: '14px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 10,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  📅 Add to Calendar
                </button>
                <button style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  ✓ Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Event Modal */}
      {showSubmitModal && (
        <div style={styles.modal} onClick={() => setShowSubmitModal(false)}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.1)',
              width: '100%',
              maxWidth: 900,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700 }}>📤 Submit Your Event</h2>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                  Share your workforce event with our community
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24 }}>
              {/* Basic Event Info */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  📝 Event Details
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => handleEventInputChange('title', e.target.value)}
                      placeholder="e.g., 2025 Semiconductor Career Fair"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Event Type *
                    </label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => handleEventInputChange('category', e.target.value)}
                      style={{ ...styles.select, width: '100%' }}
                    >
                      {eventCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={newEvent.subtitle}
                    onChange={(e) => handleEventInputChange('subtitle', e.target.value)}
                    placeholder="e.g., Meet Top Employers in Arizona's Growing Tech Industry"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                    Description *
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => handleEventInputChange('description', e.target.value)}
                    placeholder="Describe your event, what attendees will experience, key highlights..."
                    style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Industries */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🏭 Target Industries
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {industries.filter(i => i.id !== 'all').map(ind => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => toggleEventIndustry(ind.id)}
                      style={{
                        padding: '8px 14px',
                        background: newEvent.industries.includes(ind.id) 
                          ? 'rgba(99, 102, 241, 0.3)' 
                          : 'rgba(255,255,255,0.05)',
                        border: newEvent.industries.includes(ind.id)
                          ? '1px solid rgba(99, 102, 241, 0.5)'
                          : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        color: newEvent.industries.includes(ind.id) ? '#a5b4fc' : '#94a3b8',
                        cursor: 'pointer',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {ind.icon} {ind.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audiences */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🎯 Target Audiences
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {audienceTypes.map(aud => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => toggleEventAudience(aud.id)}
                      style={{
                        padding: '8px 14px',
                        background: newEvent.audiences.includes(aud.id) 
                          ? `${aud.color}30`
                          : 'rgba(255,255,255,0.05)',
                        border: newEvent.audiences.includes(aud.id)
                          ? `1px solid ${aud.color}`
                          : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        color: newEvent.audiences.includes(aud.id) ? aud.color : '#94a3b8',
                        cursor: 'pointer',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {aud.icon} {aud.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date, Time, Format */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  📅 Date & Time
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => handleEventInputChange('date', e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      End Date (if multi-day)
                    </label>
                    <input
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => handleEventInputChange('endDate', e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => handleEventInputChange('time', e.target.value)}
                      placeholder="e.g., 9:00 AM - 4:00 PM EST"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Format *
                    </label>
                    <select
                      value={newEvent.format}
                      onChange={(e) => handleEventInputChange('format', e.target.value)}
                      style={{ ...styles.select, width: '100%' }}
                    >
                      {formatOptions.map(fmt => (
                        <option key={fmt.id} value={fmt.id}>{fmt.icon} {fmt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  📍 Location
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      City/Location *
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => handleEventInputChange('location', e.target.value)}
                      placeholder="e.g., Phoenix, AZ or Virtual"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      State
                    </label>
                    <input
                      type="text"
                      value={newEvent.state}
                      onChange={(e) => handleEventInputChange('state', e.target.value)}
                      placeholder="e.g., AZ"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={newEvent.venue}
                      onChange={(e) => handleEventInputChange('venue', e.target.value)}
                      placeholder="e.g., Phoenix Convention Center"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Speakers & Employers */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  👥 Speakers & Employers
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Featured Speakers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newEvent.speakers}
                      onChange={(e) => handleEventInputChange('speakers', e.target.value)}
                      placeholder="e.g., John Smith (Intel VP), Jane Doe (DOE)"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Participating Employers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newEvent.employers}
                      onChange={(e) => handleEventInputChange('employers', e.target.value)}
                      placeholder="e.g., Intel, TSMC, Microchip Technology"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Registration & Pricing */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🎟️ Registration & Pricing
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Price
                    </label>
                    <input
                      type="text"
                      value={newEvent.price}
                      onChange={(e) => handleEventInputChange('price', e.target.value)}
                      placeholder="e.g., $99 or Early Bird: $79"
                      disabled={newEvent.isFree}
                      style={{ ...styles.input, opacity: newEvent.isFree ? 0.5 : 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end', paddingBottom: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newEvent.isFree}
                        onChange={(e) => {
                          handleEventInputChange('isFree', e.target.checked);
                          if (e.target.checked) handleEventInputChange('price', 'FREE');
                        }}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: 14 }}>Free Event</span>
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={newEvent.capacity}
                      onChange={(e) => handleEventInputChange('capacity', e.target.value)}
                      placeholder="e.g., 500"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Registration URL
                    </label>
                    <input
                      type="url"
                      value={newEvent.registrationUrl}
                      onChange={(e) => handleEventInputChange('registrationUrl', e.target.value)}
                      placeholder="https://..."
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  📞 Contact Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={newEvent.organizationName}
                      onChange={(e) => handleEventInputChange('organizationName', e.target.value)}
                      placeholder="e.g., Arizona Commerce Authority"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={newEvent.contactName}
                      onChange={(e) => handleEventInputChange('contactName', e.target.value)}
                      placeholder="e.g., John Smith"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={newEvent.contactEmail}
                      onChange={(e) => handleEventInputChange('contactEmail', e.target.value)}
                      placeholder="events@organization.org"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={newEvent.contactPhone}
                      onChange={(e) => handleEventInputChange('contactPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <p style={{ fontSize: 12, color: '#64748b' }}>
                * Required fields. Events will be reviewed within 2-3 business days.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 10,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitEvent}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  ✓ Submit Event for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
