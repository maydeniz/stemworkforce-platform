// @ts-nocheck
import React, { useState } from 'react';

// Industry options for program categorization
const industryOptions = [
  { id: 'semiconductor', name: 'Semiconductor Manufacturing', icon: '💎' },
  { id: 'nuclear', name: 'Nuclear Energy', icon: '☢️' },
  { id: 'aerospace', name: 'Aerospace & Defense', icon: '🚀' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
  { id: 'cyber', name: 'Cybersecurity', icon: '🛡️' },
  { id: 'quantum', name: 'Quantum Computing', icon: '⚛️' },
  { id: 'biotech', name: 'Biotechnology', icon: '🧬' },
  { id: 'robotics', name: 'Robotics & Automation', icon: '🦾' },
  { id: 'cleanenergy', name: 'Clean Energy Tech', icon: '⚡' },
  { id: 'advmfg', name: 'Advanced Manufacturing', icon: '🏭' },
];

// Program types
const programTypes = [
  { id: 'degree', name: 'Degree Program', icon: '🎓', color: '#8b5cf6' },
  { id: 'certificate', name: 'Certificate Program', icon: '📜', color: '#f59e0b' },
  { id: 'microcredential', name: 'Microcredential', icon: '🏅', color: '#06b6d4' },
  { id: 'apprenticeship', name: 'Apprenticeship', icon: '🔧', color: '#10b981' },
  { id: 'bootcamp', name: 'Bootcamp', icon: '🚀', color: '#ec4899' },
  { id: 'employer-training', name: 'Employer Training', icon: '🏢', color: '#3b82f6' },
  { id: 'online-course', name: 'Online Course', icon: '💻', color: '#6366f1' },
  { id: 'workshop', name: 'Workshop/Short Course', icon: '📚', color: '#14b8a6' },
];

// Credential levels
const credentialLevels = [
  { id: 'entry', name: 'Entry Level (No prerequisites)', color: '#10b981' },
  { id: 'intermediate', name: 'Intermediate (Some experience)', color: '#f59e0b' },
  { id: 'advanced', name: 'Advanced (Significant experience)', color: '#ef4444' },
];

// Delivery modes
const deliveryModes = [
  { id: 'in-person', name: 'In-Person', icon: '🏫' },
  { id: 'online', name: 'Online', icon: '💻' },
  { id: 'hybrid', name: 'Hybrid', icon: '🔄' },
  { id: 'self-paced', name: 'Self-Paced Online', icon: '⏱️' },
];

// US States for location
const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

// Sample existing programs (would come from database)
const samplePrograms = [
  {
    id: 1,
    name: 'Semiconductor Manufacturing Technology',
    type: 'certificate',
    industries: ['semiconductor'],
    duration: '12 months',
    cost: 8500,
    credentialLevel: 'entry',
    deliveryMode: 'hybrid',
    state: 'Arizona',
    city: 'Phoenix',
    placementRate: 94,
    status: 'approved',
    enrollmentOpen: true,
    startDates: ['2025-01-15', '2025-05-20', '2025-09-08'],
    skills: ['Clean Room Protocol', 'Equipment Operation', 'Quality Control'],
  },
  {
    id: 2,
    name: 'AI/ML Engineering Bootcamp',
    type: 'bootcamp',
    industries: ['ai'],
    duration: '16 weeks',
    cost: 15000,
    credentialLevel: 'intermediate',
    deliveryMode: 'online',
    state: 'California',
    city: 'San Francisco',
    placementRate: 89,
    status: 'approved',
    enrollmentOpen: true,
    startDates: ['2025-02-01', '2025-06-01'],
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning'],
  },
  {
    id: 3,
    name: 'Nuclear Technician Certification',
    type: 'certificate',
    industries: ['nuclear'],
    duration: '18 months',
    cost: 12000,
    credentialLevel: 'entry',
    deliveryMode: 'in-person',
    state: 'Tennessee',
    city: 'Oak Ridge',
    placementRate: 97,
    status: 'pending',
    enrollmentOpen: false,
    startDates: ['2025-08-15'],
    skills: ['Radiation Safety', 'Health Physics', 'NRC Regulations'],
  },
];

export default function EducationProviderPortal() {
  const [activeView, setActiveView] = useState('dashboard');
  const [programs, setPrograms] = useState(samplePrograms);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Provider info (would come from auth)
  const [providerInfo] = useState({
    name: 'Arizona State University',
    type: 'University',
    logo: '🎓',
    verified: true,
    programCount: 12,
    totalEnrollments: 2847,
    avgPlacementRate: 92,
  });

  // New program form state
  const [newProgram, setNewProgram] = useState({
    name: '',
    type: 'certificate',
    industries: [],
    description: '',
    duration: '',
    durationUnit: 'months',
    cost: '',
    isFree: false,
    credentialLevel: 'entry',
    deliveryMode: 'in-person',
    state: '',
    city: '',
    placementRate: '',
    prerequisites: '',
    skills: [],
    newSkill: '',
    outcomes: '',
    startDates: [],
    newStartDate: '',
    enrollmentCapacity: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    accreditation: '',
    financialAid: false,
    employerPartners: '',
  });

  // Stats
  const stats = {
    totalPrograms: programs.length,
    approved: programs.filter(p => p.status === 'approved').length,
    pending: programs.filter(p => p.status === 'pending').length,
    enrollmentOpen: programs.filter(p => p.enrollmentOpen).length,
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewProgram(prev => ({ ...prev, [field]: value }));
  };

  // Add skill to program
  const addSkill = () => {
    if (newProgram.newSkill.trim()) {
      setNewProgram(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setNewProgram(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Add start date
  const addStartDate = () => {
    if (newProgram.newStartDate) {
      setNewProgram(prev => ({
        ...prev,
        startDates: [...prev.startDates, prev.newStartDate],
        newStartDate: ''
      }));
    }
  };

  // Toggle industry selection
  const toggleIndustry = (industryId) => {
    setNewProgram(prev => ({
      ...prev,
      industries: prev.industries.includes(industryId)
        ? prev.industries.filter(i => i !== industryId)
        : [...prev.industries, industryId]
    }));
  };

  // Submit new program
  const handleSubmitProgram = () => {
    const program = {
      id: Date.now(),
      ...newProgram,
      cost: newProgram.isFree ? 0 : parseInt(newProgram.cost),
      placementRate: parseInt(newProgram.placementRate) || null,
      status: 'pending',
      enrollmentOpen: false,
      createdAt: new Date().toISOString(),
    };
    
    setPrograms(prev => [...prev, program]);
    setShowAddProgramModal(false);
    setNewProgram({
      name: '',
      type: 'certificate',
      industries: [],
      description: '',
      duration: '',
      durationUnit: 'months',
      cost: '',
      isFree: false,
      credentialLevel: 'entry',
      deliveryMode: 'in-person',
      state: '',
      city: '',
      placementRate: '',
      prerequisites: '',
      skills: [],
      newSkill: '',
      outcomes: '',
      startDates: [],
      newStartDate: '',
      enrollmentCapacity: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      accreditation: '',
      financialAid: false,
      employerPartners: '',
    });
    
    // Show success message
    alert('Program submitted successfully! It will be reviewed and added to the database within 2-3 business days.');
  };

  // Filter programs
  const filteredPrograms = programs.filter(p => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
      padding: '24px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nav: {
      display: 'flex',
      gap: 8,
    },
    navButton: (active) => ({
      padding: '10px 20px',
      background: active ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
      border: active ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
      borderRadius: 8,
      color: active ? '#a5b4fc' : '#94a3b8',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: 14,
      transition: 'all 0.2s',
    }),
    main: {
      padding: 32,
      maxWidth: 1400,
      margin: '0 auto',
    },
    card: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.08)',
      padding: 24,
      marginBottom: 24,
    },
    statCard: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: 12,
      padding: 20,
      textAlign: 'center',
    },
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
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 8,
      color: '#fff',
      fontSize: 14,
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 8,
      color: '#fff',
      fontSize: 14,
      outline: 'none',
    },
    label: {
      display: 'block',
      marginBottom: 8,
      fontSize: 13,
      fontWeight: 600,
      color: '#94a3b8',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 24,
    },
    modalContent: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.1)',
      width: '100%',
      maxWidth: 900,
      maxHeight: '90vh',
      overflow: 'auto',
    },
    tag: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 10px',
      background: `${color}20`,
      color: color,
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
    }),
    statusBadge: (status) => ({
      padding: '4px 12px',
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      background: status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 
                  status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
      color: status === 'approved' ? '#10b981' : 
             status === 'pending' ? '#f59e0b' : '#ef4444',
    }),
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 32 }}>{providerInfo.logo}</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {providerInfo.name}
              {providerInfo.verified && (
                <span style={{ marginLeft: 8, fontSize: 14, color: '#10b981' }}>✓ Verified</span>
              )}
            </h1>
            <p style={{ fontSize: 13, color: '#64748b' }}>Education Provider Portal</p>
          </div>
        </div>
        
        <nav style={styles.nav}>
          <button 
            style={styles.navButton(activeView === 'dashboard')}
            onClick={() => setActiveView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            style={styles.navButton(activeView === 'manage')}
            onClick={() => setActiveView('manage')}
          >
            📋 My Programs
          </button>
          <button 
            style={styles.navButton(activeView === 'bulk-upload')}
            onClick={() => setActiveView('bulk-upload')}
          >
            📤 Bulk Upload
          </button>
          <button 
            style={styles.navButton(activeView === 'analytics')}
            onClick={() => setActiveView('analytics')}
          >
            📈 Analytics
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
              <div style={styles.statCard}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#6366f1' }}>{stats.totalPrograms}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Total Programs</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981' }}>{stats.approved}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Approved</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#f59e0b' }}>{stats.pending}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Pending Review</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#06b6d4' }}>{stats.enrollmentOpen}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Enrollment Open</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.card}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button 
                  style={styles.button}
                  onClick={() => setShowAddProgramModal(true)}
                >
                  ➕ Add New Program
                </button>
                <button 
                  style={{ ...styles.button, background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  onClick={() => setActiveView('bulk-upload')}
                >
                  📤 Bulk Upload Programs
                </button>
                <button 
                  style={{ ...styles.button, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                  onClick={() => setActiveView('manage')}
                >
                  ✏️ Manage Existing Programs
                </button>
              </div>
            </div>

            {/* Recent Programs */}
            <div style={styles.card}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Programs</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {programs.slice(0, 5).map(program => (
                  <div 
                    key={program.id}
                    style={{
                      padding: 16,
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{program.name}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={styles.tag(programTypes.find(t => t.id === program.type)?.color || '#6366f1')}>
                          {programTypes.find(t => t.id === program.type)?.icon} {programTypes.find(t => t.id === program.type)?.name}
                        </span>
                        {program.industries.map(ind => (
                          <span key={ind} style={{ fontSize: 12, color: '#64748b' }}>
                            {industryOptions.find(i => i.id === ind)?.icon} {industryOptions.find(i => i.id === ind)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={styles.statusBadge(program.status)}>
                      {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Manage Programs View */}
        {activeView === 'manage' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Manage Programs</h2>
              <button 
                style={styles.button}
                onClick={() => setShowAddProgramModal(true)}
              >
                ➕ Add New Program
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...styles.input, maxWidth: 300 }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ ...styles.select, maxWidth: 180 }}
              >
                <option value="all">All Status</option>
                <option value="approved">✅ Approved</option>
                <option value="pending">⏳ Pending</option>
                <option value="rejected">❌ Rejected</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ ...styles.select, maxWidth: 220 }}
              >
                <option value="all">All Program Types</option>
                {programTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                ))}
              </select>
              {(filterStatus !== 'all' || filterType !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterType('all');
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 8,
                    color: '#fca5a5',
                    cursor: 'pointer',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div style={{ marginBottom: 16, fontSize: 14, color: '#64748b' }}>
              Showing {filteredPrograms.length} of {programs.length} programs
              {filterType !== 'all' && (
                <span style={{ marginLeft: 8, color: programTypes.find(t => t.id === filterType)?.color }}>
                  • {programTypes.find(t => t.id === filterType)?.icon} {programTypes.find(t => t.id === filterType)?.name}
                </span>
              )}
            </div>

            {/* Programs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredPrograms.map(program => (
                <div 
                  key={program.id}
                  style={{
                    padding: 20,
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{program.name}</h3>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={styles.tag(programTypes.find(t => t.id === program.type)?.color || '#6366f1')}>
                          {programTypes.find(t => t.id === program.type)?.icon} {programTypes.find(t => t.id === program.type)?.name}
                        </span>
                        <span style={styles.statusBadge(program.status)}>
                          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                        </span>
                        {program.enrollmentOpen && (
                          <span style={{ ...styles.tag('#06b6d4'), background: 'rgba(6, 182, 212, 0.2)' }}>
                            📖 Enrollment Open
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setEditingProgram(program);
                          setShowAddProgramModal(true);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(99, 102, 241, 0.2)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          borderRadius: 8,
                          color: '#a5b4fc',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 8,
                          color: '#fca5a5',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Duration</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{program.duration}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Cost</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#10b981' }}>
                        {program.cost === 0 ? 'FREE' : `$${program.cost.toLocaleString()}`}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Location</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{program.city}, {program.state}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Delivery</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {deliveryModes.find(d => d.id === program.deliveryMode)?.icon} {deliveryModes.find(d => d.id === program.deliveryMode)?.name}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Placement Rate</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#f59e0b' }}>
                        {program.placementRate ? `${program.placementRate}%` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {program.skills && program.skills.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Skills Taught</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {program.skills.map(skill => (
                          <span key={skill} style={{
                            padding: '4px 10px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 6,
                            fontSize: 12,
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Upload View */}
        {activeView === 'bulk-upload' && (
          <div style={styles.card}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Bulk Upload Programs</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>
              Upload multiple programs at once using our CSV template or API integration.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {/* CSV Upload */}
              <div style={{
                padding: 24,
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 16,
                border: '2px dashed rgba(99, 102, 241, 0.3)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>CSV Upload</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                  Download our template, fill in your program data, and upload.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}>
                    📥 Download Template
                  </button>
                  <button style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    📤 Upload CSV
                  </button>
                </div>
              </div>

              {/* API Integration */}
              <div style={{
                padding: 24,
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 16,
                border: '2px dashed rgba(16, 185, 129, 0.3)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔌</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>API Integration</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                  Connect your LMS or SIS directly via our REST API.
                </p>
                <button style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  📚 View API Documentation
                </button>
              </div>
            </div>

            {/* CSV Template Fields */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Required CSV Fields</h3>
              <div style={{
                padding: 16,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 12,
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#a5b4fc',
                overflowX: 'auto',
              }}>
                program_name, program_type, industries, duration, cost, credential_level, delivery_mode, state, city, placement_rate, skills, start_dates, prerequisites, description, contact_email, website
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div style={styles.card}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Program Analytics</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
              <div style={styles.statCard}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>2,847</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Total Enrollments</div>
                <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>↑ 23% vs last quarter</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>92%</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Avg Placement Rate</div>
                <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>↑ 5% vs last year</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#6366f1' }}>4.8</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Avg Student Rating</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Based on 1,234 reviews</div>
              </div>
            </div>

            {/* Programs by Industry */}
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Programs by Industry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {industryOptions.slice(0, 5).map((ind, i) => (
                <div key={ind.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 100, fontSize: 13 }}>{ind.icon} {ind.name.split(' ')[0]}</div>
                  <div style={{ flex: 1, height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${[45, 30, 25, 20, 15][i]}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'][i]}, ${['#8b5cf6', '#059669', '#d97706', '#0891b2', '#db2777'][i]})`,
                      borderRadius: 4,
                    }} />
                  </div>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 13, fontWeight: 600 }}>
                    {[12, 8, 6, 5, 4][i]} programs
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Program Modal */}
      {showAddProgramModal && (
        <div style={styles.modal} onClick={() => setShowAddProgramModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                {editingProgram ? 'Edit Program' : 'Add New Training Program'}
              </h2>
              <button
                onClick={() => {
                  setShowAddProgramModal(false);
                  setEditingProgram(null);
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  width: 36,
                  height: 36,
                  borderRadius: 8,
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
              {/* Basic Info Section */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a5b4fc' }}>
                  📝 Basic Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={styles.label}>Program Name *</label>
                    <input
                      type="text"
                      value={newProgram.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Semiconductor Manufacturing Technology Certificate"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Program Type *</label>
                    <select
                      value={newProgram.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      style={styles.select}
                    >
                      {programTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={newProgram.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your program, what students will learn, and career outcomes..."
                    style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
                  />
                </div>

                {/* Industry Selection */}
                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Target Industries * (Select all that apply)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {industryOptions.map(ind => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => toggleIndustry(ind.id)}
                        style={{
                          padding: '8px 14px',
                          background: newProgram.industries.includes(ind.id) 
                            ? 'rgba(99, 102, 241, 0.3)' 
                            : 'rgba(255,255,255,0.05)',
                          border: newProgram.industries.includes(ind.id)
                            ? '1px solid rgba(99, 102, 241, 0.5)'
                            : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8,
                          color: newProgram.industries.includes(ind.id) ? '#a5b4fc' : '#94a3b8',
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
              </div>

              {/* Duration & Cost Section */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a5b4fc' }}>
                  ⏱️ Duration & Cost
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  <div>
                    <label style={styles.label}>Duration *</label>
                    <input
                      type="number"
                      value={newProgram.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g., 12"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Duration Unit</label>
                    <select
                      value={newProgram.durationUnit}
                      onChange={(e) => handleInputChange('durationUnit', e.target.value)}
                      style={styles.select}
                    >
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Cost (USD) *</label>
                    <input
                      type="number"
                      value={newProgram.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      placeholder="e.g., 8500"
                      disabled={newProgram.isFree}
                      style={{ ...styles.input, opacity: newProgram.isFree ? 0.5 : 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end', paddingBottom: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newProgram.isFree}
                        onChange={(e) => handleInputChange('isFree', e.target.checked)}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: 14 }}>Free Program</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newProgram.financialAid}
                      onChange={(e) => handleInputChange('financialAid', e.target.checked)}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: 14 }}>Financial Aid Available</span>
                  </label>
                </div>
              </div>

              {/* Delivery & Location Section */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a5b4fc' }}>
                  📍 Delivery & Location
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  <div>
                    <label style={styles.label}>Delivery Mode *</label>
                    <select
                      value={newProgram.deliveryMode}
                      onChange={(e) => handleInputChange('deliveryMode', e.target.value)}
                      style={styles.select}
                    >
                      {deliveryModes.map(mode => (
                        <option key={mode.id} value={mode.id}>{mode.icon} {mode.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Credential Level</label>
                    <select
                      value={newProgram.credentialLevel}
                      onChange={(e) => handleInputChange('credentialLevel', e.target.value)}
                      style={styles.select}
                    >
                      {credentialLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>State *</label>
                    <select
                      value={newProgram.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Select State</option>
                      {usStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>City *</label>
                    <input
                      type="text"
                      value={newProgram.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g., Phoenix"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a5b4fc' }}>
                  🎯 Skills & Outcomes
                </h3>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Skills Taught (Add skills students will learn)</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      value={newProgram.newSkill}
                      onChange={(e) => handleInputChange('newSkill', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="e.g., Clean Room Protocol"
                      style={{ ...styles.input, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      style={{
                        padding: '12px 20px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: 8,
                        color: '#a5b4fc',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      + Add
                    </button>
                  </div>
                  {newProgram.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {newProgram.skills.map(skill => (
                        <span 
                          key={skill}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(99, 102, 241, 0.2)',
                            borderRadius: 6,
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: 14,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <div>
                    <label style={styles.label}>Placement Rate (%)</label>
                    <input
                      type="number"
                      value={newProgram.placementRate}
                      onChange={(e) => handleInputChange('placementRate', e.target.value)}
                      placeholder="e.g., 94"
                      min="0"
                      max="100"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Prerequisites</label>
                    <input
                      type="text"
                      value={newProgram.prerequisites}
                      onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                      placeholder="e.g., High School Diploma, Basic Math"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={styles.label}>Employer Partners (if any)</label>
                  <input
                    type="text"
                    value={newProgram.employerPartners}
                    onChange={(e) => handleInputChange('employerPartners', e.target.value)}
                    placeholder="e.g., Intel, TSMC, Microchip Technology"
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Start Dates Section */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a5b4fc' }}>
                  📅 Start Dates
                </h3>
                
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="date"
                    value={newProgram.newStartDate}
                    onChange={(e) => handleInputChange('newStartDate', e.target.value)}
                    style={{ ...styles.input, flex: 1, maxWidth: 200 }}
                  />
                  <button
                    type="button"
                    onClick={addStartDate}
                    style={{
                      padding: '12px 20px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: 8,
                      color: '#a5b4fc',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    + Add Date
                  </button>
                </div>
                {newProgram.startDates.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {newProgram.startDates.map(date => (
                      <span 
                        key={date}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      >
                        📅 {new Date(date).toLocaleDateString()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Info Section */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#a5b4fc' }}>
                  📞 Contact Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <label style={styles.label}>Contact Email *</label>
                    <input
                      type="email"
                      value={newProgram.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="admissions@university.edu"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Contact Phone</label>
                    <input
                      type="tel"
                      value={newProgram.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Program Website</label>
                    <input
                      type="url"
                      value={newProgram.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://..."
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={styles.label}>Accreditation</label>
                  <input
                    type="text"
                    value={newProgram.accreditation}
                    onChange={(e) => handleInputChange('accreditation', e.target.value)}
                    placeholder="e.g., ABET Accredited, DOL Registered Apprenticeship"
                    style={styles.input}
                  />
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
                * Required fields. Programs will be reviewed within 2-3 business days.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => {
                    setShowAddProgramModal(false);
                    setEditingProgram(null);
                  }}
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
                  onClick={handleSubmitProgram}
                  style={styles.button}
                  disabled={!newProgram.name || !newProgram.industries.length || !newProgram.state}
                >
                  {editingProgram ? '💾 Save Changes' : '📤 Submit Program'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
