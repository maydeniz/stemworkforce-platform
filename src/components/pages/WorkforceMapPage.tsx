import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// State positions for rectangular buttons on map
const statePositions: Record<string, { x: number; y: number }> = {
  WA: { x: 12, y: 8 }, OR: { x: 10, y: 18 }, CA: { x: 8, y: 35 }, NV: { x: 16, y: 28 },
  ID: { x: 18, y: 14 }, MT: { x: 26, y: 8 }, WY: { x: 26, y: 18 }, UT: { x: 20, y: 28 },
  AZ: { x: 18, y: 40 }, CO: { x: 28, y: 28 }, NM: { x: 26, y: 40 }, ND: { x: 38, y: 8 },
  SD: { x: 38, y: 16 }, NE: { x: 40, y: 24 }, KS: { x: 40, y: 32 }, OK: { x: 42, y: 40 },
  TX: { x: 38, y: 50 }, MN: { x: 48, y: 10 }, IA: { x: 50, y: 20 }, MO: { x: 52, y: 30 },
  AR: { x: 52, y: 40 }, LA: { x: 52, y: 50 }, WI: { x: 54, y: 12 }, IL: { x: 56, y: 24 },
  MI: { x: 62, y: 14 }, IN: { x: 62, y: 26 }, OH: { x: 68, y: 26 }, KY: { x: 66, y: 34 },
  TN: { x: 64, y: 40 }, MS: { x: 58, y: 48 }, AL: { x: 64, y: 48 }, WV: { x: 72, y: 32 },
  VA: { x: 76, y: 36 }, NC: { x: 78, y: 42 }, SC: { x: 76, y: 48 }, GA: { x: 70, y: 50 },
  FL: { x: 74, y: 58 }, PA: { x: 76, y: 24 }, NY: { x: 80, y: 16 }, NJ: { x: 82, y: 26 },
  MD: { x: 80, y: 32 }, DE: { x: 84, y: 30 }, CT: { x: 86, y: 20 }, RI: { x: 88, y: 20 },
  MA: { x: 88, y: 16 }, VT: { x: 84, y: 10 }, NH: { x: 86, y: 10 }, ME: { x: 90, y: 6 }
};

// Comprehensive state data with all details
const stateDetails: Record<string, {
  name: string;
  industry: string;
  growth: string;
  totalJobs: number;
  technicians: number;
  engineers: number;
  hubs: string[];
  salaries: { engineer: string; technician: string; operator: string };
  skills: string[];
  employers: { name: string; positions: number; growth: string }[];
  training: { name: string; type: string; duration: string; cost: string; placement: number }[];
  pathways: {
    level: string;
    roles: { title: string; salary: string; requirement: string }[];
  }[];
}> = {
  OH: {
    name: 'Ohio',
    industry: 'Nuclear Energy',
    growth: '+45%',
    totalJobs: 3800,
    technicians: 1200,
    engineers: 800,
    hubs: ['Toledo', 'Cleveland', 'Perry'],
    salaries: { engineer: '$95K', technician: '$55K', operator: '$46K' },
    skills: ['Reactor Operations', 'Nuclear Safety', 'Health Physics', 'Instrumentation'],
    employers: [
      { name: 'Davis-Besse', positions: 1200, growth: '+8%' },
      { name: 'Perry Nuclear', positions: 950, growth: '+5%' }
    ],
    training: [
      { name: 'Ohio State Nuclear Engineering', type: 'University', duration: '4 years', cost: '$45,000', placement: 94 },
      { name: 'Lakeland Community College', type: 'Community College', duration: '2 years', cost: '$8,000', placement: 89 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Radiation Protection Trainee', salary: '$40K-$50K', requirement: 'HS + Training' },
        { title: 'Security Officer', salary: '$45K-$55K', requirement: 'HS + Clearance' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Health Physics Tech', salary: '$55K-$70K', requirement: 'Associate Degree' },
        { title: 'I&C Technician', salary: '$58K-$75K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Reactor Operator', salary: '$80K-$100K', requirement: 'NRC License' },
        { title: 'Senior Reactor Operator', salary: '$100K-$130K', requirement: 'NRC SRO License' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Nuclear Engineer', salary: '$95K-$130K', requirement: "Bachelor's Nuclear Eng" }
      ]}
    ]
  },
  ID: {
    name: 'Idaho',
    industry: 'Nuclear Energy',
    growth: '+124%',
    totalJobs: 5800,
    technicians: 2600,
    engineers: 1800,
    hubs: ['Idaho Falls', 'Pocatello'],
    salaries: { engineer: '$95K', technician: '$55K', operator: '$46K' },
    skills: ['Reactor Operations', 'Nuclear Safety', 'Health Physics', 'Instrumentation'],
    employers: [
      { name: 'Idaho National Laboratory', positions: 3200, growth: '+15%' },
      { name: 'Naval Reactors Facility', positions: 1800, growth: '+8%' }
    ],
    training: [
      { name: 'Idaho State University', type: 'University', duration: '4 years', cost: '$28,000', placement: 95 },
      { name: 'INL Workforce Development', type: 'Employer Training', duration: '12 weeks', cost: 'FREE', placement: 98 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Lab Technician Trainee', salary: '$42K-$52K', requirement: 'HS + Training' },
        { title: 'Radiation Monitor', salary: '$45K-$55K', requirement: 'HS + Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Research Technician', salary: '$58K-$72K', requirement: 'Associate Degree' },
        { title: 'Health Physics Tech', salary: '$55K-$70K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Reactor Operator', salary: '$82K-$105K', requirement: 'NRC License' },
        { title: 'Senior Reactor Operator', salary: '$105K-$135K', requirement: 'NRC SRO License' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Nuclear Engineer', salary: '$98K-$135K', requirement: "Bachelor's Nuclear Eng" },
        { title: 'Research Scientist', salary: '$105K-$145K', requirement: "Master's/PhD" }
      ]}
    ]
  },
  NM: {
    name: 'New Mexico',
    industry: 'Nuclear Energy',
    growth: '+89%',
    totalJobs: 10500,
    technicians: 4200,
    engineers: 2800,
    hubs: ['Los Alamos', 'Albuquerque', 'Carlsbad'],
    salaries: { engineer: '$105K', technician: '$62K', operator: '$52K' },
    skills: ['Nuclear Physics', 'Weapons Systems', 'Radiation Safety', 'Research'],
    employers: [
      { name: 'Los Alamos National Lab', positions: 5500, growth: '+12%' },
      { name: 'Sandia National Lab', positions: 3200, growth: '+10%' },
      { name: 'WIPP', positions: 1800, growth: '+6%' }
    ],
    training: [
      { name: 'UNM Nuclear Engineering', type: 'University', duration: '4 years', cost: '$32,000', placement: 96 },
      { name: 'LANL Technician Program', type: 'Employer Training', duration: '16 weeks', cost: 'FREE', placement: 97 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Lab Assistant', salary: '$45K-$55K', requirement: 'HS + Clearance' },
        { title: 'Security Specialist', salary: '$50K-$62K', requirement: 'HS + Q Clearance' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Weapons Technician', salary: '$65K-$82K', requirement: 'Associate + Q Clearance' },
        { title: 'Health Physics Tech', salary: '$60K-$75K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Criticality Safety Officer', salary: '$90K-$115K', requirement: 'Certification' },
        { title: 'Facility Operator', salary: '$85K-$110K', requirement: 'License' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Nuclear Engineer', salary: '$105K-$145K', requirement: "Bachelor's + Q Clearance" },
        { title: 'Weapons Physicist', salary: '$120K-$165K', requirement: "PhD + Q Clearance" }
      ]}
    ]
  },
  TN: {
    name: 'Tennessee',
    industry: 'Nuclear Energy',
    growth: '+38%',
    totalJobs: 8400,
    technicians: 3200,
    engineers: 2100,
    hubs: ['Oak Ridge', 'Chattanooga', 'Spring City'],
    salaries: { engineer: '$92K', technician: '$54K', operator: '$45K' },
    skills: ['Reactor Operations', 'Nuclear Safety', 'Research', 'Enrichment'],
    employers: [
      { name: 'Oak Ridge National Lab', positions: 4500, growth: '+11%' },
      { name: 'TVA Nuclear', positions: 2800, growth: '+7%' },
      { name: 'Y-12 Security Complex', positions: 1100, growth: '+5%' }
    ],
    training: [
      { name: 'UT Knoxville Nuclear Eng', type: 'University', duration: '4 years', cost: '$35,000', placement: 93 },
      { name: 'Roane State CC', type: 'Community College', duration: '2 years', cost: '$9,500', placement: 88 },
      { name: 'TVA Training Program', type: 'Employer Training', duration: '24 weeks', cost: 'FREE', placement: 96 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Plant Helper', salary: '$38K-$48K', requirement: 'HS Diploma' },
        { title: 'Radiation Monitor', salary: '$42K-$52K', requirement: 'HS + Training' }
      ]},
      { level: 'Technician', roles: [
        { title: 'I&C Technician', salary: '$56K-$72K', requirement: 'Associate Degree' },
        { title: 'Chemistry Tech', salary: '$54K-$68K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Reactor Operator', salary: '$78K-$98K', requirement: 'NRC License' },
        { title: 'Senior Reactor Operator', salary: '$98K-$125K', requirement: 'NRC SRO License' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Nuclear Engineer', salary: '$92K-$128K', requirement: "Bachelor's Nuclear Eng" }
      ]}
    ]
  },
  CA: {
    name: 'California',
    industry: 'Semiconductor',
    growth: '+23%',
    totalJobs: 245000,
    technicians: 82000,
    engineers: 61000,
    hubs: ['San Jose', 'San Francisco', 'Los Angeles'],
    salaries: { engineer: '$155K', technician: '$78K', operator: '$62K' },
    skills: ['Semiconductor Fab', 'AI/ML', 'Robotics', 'Clean Energy'],
    employers: [
      { name: 'Intel', positions: 15000, growth: '+8%' },
      { name: 'Apple', positions: 12000, growth: '+12%' },
      { name: 'Nvidia', positions: 8500, growth: '+25%' },
      { name: 'Google', positions: 7200, growth: '+10%' }
    ],
    training: [
      { name: 'Stanford Engineering', type: 'University', duration: '4 years', cost: '$58,000', placement: 98 },
      { name: 'Berkeley EECS', type: 'University', duration: '4 years', cost: '$45,000', placement: 97 },
      { name: 'SJSU Semiconductor', type: 'University', duration: '4 years', cost: '$28,000', placement: 92 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Fab Operator', salary: '$52K-$65K', requirement: 'HS + Training' },
        { title: 'Equipment Operator', salary: '$55K-$68K', requirement: 'HS + Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Process Technician', salary: '$72K-$92K', requirement: 'Associate Degree' },
        { title: 'Equipment Tech', salary: '$75K-$95K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Senior Process Tech', salary: '$95K-$120K', requirement: 'Certification' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Process Engineer', salary: '$140K-$180K', requirement: "Bachelor's Engineering" },
        { title: 'Design Engineer', salary: '$155K-$200K', requirement: "Master's Engineering" }
      ]}
    ]
  },
  TX: {
    name: 'Texas',
    industry: 'Semiconductor',
    growth: '+45%',
    totalJobs: 189000,
    technicians: 63000,
    engineers: 47000,
    hubs: ['Austin', 'Dallas', 'Houston'],
    salaries: { engineer: '$145K', technician: '$72K', operator: '$58K' },
    skills: ['Semiconductor Fab', 'Aerospace', 'Energy', 'Cybersecurity'],
    employers: [
      { name: 'Texas Instruments', positions: 18000, growth: '+10%' },
      { name: 'Samsung Austin', positions: 12000, growth: '+35%' },
      { name: 'NXP Semiconductors', positions: 6500, growth: '+8%' }
    ],
    training: [
      { name: 'UT Austin Engineering', type: 'University', duration: '4 years', cost: '$42,000', placement: 95 },
      { name: 'Texas A&M Engineering', type: 'University', duration: '4 years', cost: '$38,000', placement: 94 },
      { name: 'Austin CC Semiconductor', type: 'Community College', duration: '2 years', cost: '$8,500', placement: 88 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Fab Operator', salary: '$48K-$60K', requirement: 'HS + Training' },
        { title: 'Clean Room Tech', salary: '$50K-$62K', requirement: 'HS + Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Process Technician', salary: '$68K-$85K', requirement: 'Associate Degree' },
        { title: 'Maintenance Tech', salary: '$65K-$82K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Senior Process Tech', salary: '$88K-$110K', requirement: 'Certification' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Process Engineer', salary: '$130K-$165K', requirement: "Bachelor's Engineering" },
        { title: 'Yield Engineer', salary: '$135K-$170K', requirement: "Bachelor's Engineering" }
      ]}
    ]
  },
  AZ: {
    name: 'Arizona',
    industry: 'Semiconductor',
    growth: '+156%',
    totalJobs: 145000,
    technicians: 48000,
    engineers: 36000,
    hubs: ['Phoenix', 'Chandler', 'Tempe'],
    salaries: { engineer: '$140K', technician: '$70K', operator: '$56K' },
    skills: ['Semiconductor Fab', 'Clean Room', 'Quality Control', 'Process Integration'],
    employers: [
      { name: 'TSMC Arizona', positions: 25000, growth: '+200%' },
      { name: 'Intel Chandler', positions: 18000, growth: '+15%' },
      { name: 'ON Semiconductor', positions: 5500, growth: '+8%' }
    ],
    training: [
      { name: 'ASU Engineering', type: 'University', duration: '4 years', cost: '$32,000', placement: 94 },
      { name: 'Maricopa CC Semiconductor', type: 'Community College', duration: '18 months', cost: '$6,500', placement: 91 },
      { name: 'TSMC Training Academy', type: 'Employer Training', duration: '12 weeks', cost: 'FREE', placement: 99 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Fab Operator', salary: '$46K-$58K', requirement: 'HS + Training' },
        { title: 'Material Handler', salary: '$44K-$55K', requirement: 'HS Diploma' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Process Technician', salary: '$65K-$82K', requirement: 'Associate Degree' },
        { title: 'Equipment Tech', salary: '$68K-$85K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Senior Process Tech', salary: '$85K-$108K', requirement: 'Certification' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Process Engineer', salary: '$125K-$160K', requirement: "Bachelor's Engineering" },
        { title: 'Integration Engineer', salary: '$135K-$175K', requirement: "Master's Engineering" }
      ]}
    ]
  },
  OR: {
    name: 'Oregon',
    industry: 'Semiconductor',
    growth: '+28%',
    totalJobs: 98000,
    technicians: 33000,
    engineers: 24000,
    hubs: ['Portland', 'Hillsboro', 'Beaverton'],
    salaries: { engineer: '$138K', technician: '$69K', operator: '$54K' },
    skills: ['Chip Design', 'Testing', 'Manufacturing', 'R&D'],
    employers: [
      { name: 'Intel Hillsboro', positions: 22000, growth: '+5%' },
      { name: 'Lam Research', positions: 4500, growth: '+12%' },
      { name: 'Qorvo', positions: 2800, growth: '+8%' }
    ],
    training: [
      { name: 'Oregon State Engineering', type: 'University', duration: '4 years', cost: '$35,000', placement: 93 },
      { name: 'Portland CC Semiconductor', type: 'Community College', duration: '2 years', cost: '$7,500', placement: 89 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Fab Operator', salary: '$45K-$56K', requirement: 'HS + Training' },
        { title: 'Test Operator', salary: '$47K-$58K', requirement: 'HS + Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Process Technician', salary: '$64K-$80K', requirement: 'Associate Degree' },
        { title: 'Test Technician', salary: '$62K-$78K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Senior Tech', salary: '$82K-$105K', requirement: 'Certification' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Process Engineer', salary: '$125K-$158K', requirement: "Bachelor's Engineering" },
        { title: 'Test Engineer', salary: '$120K-$152K', requirement: "Bachelor's Engineering" }
      ]}
    ]
  },
  NY: {
    name: 'New York',
    industry: 'Semiconductor',
    growth: '+134%',
    totalJobs: 167000,
    technicians: 55000,
    engineers: 42000,
    hubs: ['Albany', 'Malta', 'Syracuse'],
    salaries: { engineer: '$135K', technician: '$68K', operator: '$55K' },
    skills: ['Nanofabrication', 'Lithography', 'Process Integration', 'Yield Analysis'],
    employers: [
      { name: 'GlobalFoundries', positions: 8500, growth: '+18%' },
      { name: 'Micron Syracuse', positions: 9000, growth: '+300%' },
      { name: 'IBM Research', positions: 3200, growth: '+5%' }
    ],
    training: [
      { name: 'RPI Nanotech', type: 'University', duration: '4 years', cost: '$58,000', placement: 96 },
      { name: 'SUNY Poly', type: 'University', duration: '4 years', cost: '$28,000', placement: 94 },
      { name: 'HVCC Semiconductor', type: 'Community College', duration: '2 years', cost: '$8,000', placement: 90 }
    ],
    pathways: [
      { level: 'Entry Level', roles: [
        { title: 'Fab Operator', salary: '$48K-$60K', requirement: 'HS + Training' },
        { title: 'Clean Room Operator', salary: '$46K-$58K', requirement: 'HS + Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Process Technician', salary: '$65K-$82K', requirement: 'Associate Degree' },
        { title: 'Equipment Tech', salary: '$68K-$85K', requirement: 'Associate Degree' }
      ]},
      { level: 'Licensed Operator', roles: [
        { title: 'Senior Process Tech', salary: '$85K-$110K', requirement: 'Certification' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Process Engineer', salary: '$125K-$160K', requirement: "Bachelor's Engineering" },
        { title: 'Lithography Engineer', salary: '$135K-$175K', requirement: "Master's Engineering" }
      ]}
    ]
  }
};

// Top states for different industries
const topNuclearStates = [
  { abbr: 'NM', name: 'New Mexico', jobs: 10500 },
  { abbr: 'TN', name: 'Tennessee', jobs: 8400 },
  { abbr: 'ID', name: 'Idaho', jobs: 5800 },
  { abbr: 'OH', name: 'Ohio', jobs: 3800 },
];

// High concentration states (yellow on map)
const highConcentrationStates = ['TX', 'AZ', 'CA', 'OR', 'NY', 'OH', 'ID', 'NM', 'TN'];

const WorkforceMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'employers' | 'training' | 'pathways'>('overview');

  const selectedStateInfo = selectedState ? stateDetails[selectedState] : null;

  const handleFindJobs = (jobTitle: string) => {
    navigate(`/jobs?search=${encodeURIComponent(jobTitle)}`);
  };

  const handleViewEmployerJobs = (employer: string) => {
    navigate(`/jobs?company=${encodeURIComponent(employer)}`);
  };

  const handleBrowseAllJobs = () => {
    if (selectedStateInfo) {
      navigate(`/jobs?industry=${encodeURIComponent(selectedStateInfo.industry)}&state=${encodeURIComponent(selectedStateInfo.name)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-transparent px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-500 text-sm font-medium mb-4">
            📍 Workforce Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            STEM Workforce <span className="text-yellow-500">Intelligence Map</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore workforce data across states with the highest concentration of emerging technology jobs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Map Section */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📍 Job Concentration by State
            </h2>
            
            {/* US Map with rectangular buttons */}
            <div className="relative bg-gray-900 rounded-xl p-4 mb-6 overflow-hidden" style={{ aspectRatio: '1.5' }}>
              <svg viewBox="0 0 100 70" className="w-full h-full">
                {Object.entries(statePositions).map(([abbr, pos]) => {
                  const isHighConcentration = highConcentrationStates.includes(abbr);
                  const isSelected = selectedState === abbr;
                  
                  return (
                    <g key={abbr} onClick={() => setSelectedState(abbr)} className="cursor-pointer">
                      {/* Rectangle background */}
                      <rect
                        x={pos.x - 4}
                        y={pos.y - 3}
                        width="8"
                        height="6"
                        rx="1"
                        fill={isHighConcentration ? (isSelected ? '#F5C518' : '#F5C518') : '#374151'}
                        stroke={isSelected ? '#fff' : 'transparent'}
                        strokeWidth="0.5"
                        className="transition-all duration-200"
                        style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(245, 197, 24, 0.6))' : 'none' }}
                      />
                      <text
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="2.5"
                        fill={isHighConcentration ? '#0a0a0b' : '#9CA3AF'}
                        fontWeight="600"
                        className="pointer-events-none select-none"
                      >
                        {abbr}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-gray-800/95 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <div className="w-4 h-3 rounded bg-yellow-500"></div>
                  <span className="text-gray-300">High concentration</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded bg-gray-600"></div>
                  <span className="text-gray-300">No data</span>
                </div>
              </div>
            </div>

            {/* Top States */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                🔥 Top States
              </h3>
              <div className="flex flex-wrap gap-2">
                {topNuclearStates.map(state => (
                  <button
                    key={state.abbr}
                    onClick={() => setSelectedState(state.abbr)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedState === state.abbr
                        ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                        : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {state.name} <span className="opacity-70 ml-1">{state.jobs.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* State Details Panel */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden max-h-[800px] overflow-y-auto">
            {selectedStateInfo ? (
              <>
                {/* State Header */}
                <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedStateInfo.name}</h2>
                      <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                        {selectedStateInfo.growth} growth
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedState(null)}
                      className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-500">{selectedStateInfo.totalJobs.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Total Jobs</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">{selectedStateInfo.technicians.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Technicians</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-400">{selectedStateInfo.engineers.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Engineers</div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-800 sticky top-[200px] bg-gray-900/95 backdrop-blur z-10">
                  <div className="flex">
                    {(['overview', 'employers', 'training', 'pathways'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                          activeTab === tab
                            ? 'text-yellow-500 border-b-2 border-yellow-500'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Employment Hubs */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          📍 Employment Hubs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStateInfo.hubs.map(hub => (
                            <span key={hub} className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300">
                              {hub}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Average Salary by Role */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          💰 Average Salary by Role
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400 mb-1">Engineer</div>
                            <div className="text-lg font-bold text-green-400">{selectedStateInfo.salaries.engineer}</div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400 mb-1">Technician</div>
                            <div className="text-lg font-bold text-blue-400">{selectedStateInfo.salaries.technician}</div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400 mb-1">Operator</div>
                            <div className="text-lg font-bold text-purple-400">{selectedStateInfo.salaries.operator}</div>
                          </div>
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          🎯 Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStateInfo.skills.map(skill => (
                            <span key={skill} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <button 
                        onClick={() => navigate('/training')}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        🎓 Connect Me with Training Programs →
                      </button>
                    </div>
                  )}

                  {/* EMPLOYERS TAB */}
                  {activeTab === 'employers' && (
                    <div className="space-y-4">
                      {selectedStateInfo.employers.map((employer) => (
                        <div key={employer.name} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-white text-lg">{employer.name}</h4>
                              <p className="text-gray-400 text-sm">{employer.positions.toLocaleString()} open positions</p>
                            </div>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm font-medium">
                              {employer.growth}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleViewEmployerJobs(employer.name)}
                            className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                          >
                            🏢 View Jobs at {employer.name} →
                          </button>
                        </div>
                      ))}
                      
                      {/* Browse All CTA */}
                      <button 
                        onClick={handleBrowseAllJobs}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                      >
                        🔍 Browse All {selectedStateInfo.industry} Jobs in {selectedStateInfo.name} →
                      </button>
                    </div>
                  )}

                  {/* TRAINING TAB */}
                  {activeTab === 'training' && (
                    <div className="space-y-4">
                      {selectedStateInfo.training.map((program) => (
                        <div key={program.name} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-white">{program.name}</h4>
                              <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                                {program.type}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-400">{program.placement}%</div>
                              <div className="text-xs text-gray-400">Placement</div>
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-400 mb-3">
                            <span>⏱️ {program.duration}</span>
                            <span>💵 {program.cost}</span>
                          </div>
                          <button 
                            onClick={() => navigate('/training')}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                          >
                            📋 Apply to This Program →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* PATHWAYS TAB */}
                  {activeTab === 'pathways' && (
                    <div className="space-y-6">
                      {selectedStateInfo.pathways.map((pathway, levelIndex) => (
                        <div key={pathway.level}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                              {levelIndex + 1}
                            </span>
                            <h4 className="font-semibold text-yellow-500">{pathway.level}</h4>
                          </div>
                          <div className="space-y-3 ml-4 border-l-2 border-yellow-500/30 pl-4">
                            {pathway.roles.map((role) => (
                              <div key={role.title} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                                <h5 className="font-medium text-white mb-1">{role.title}</h5>
                                <div className="flex gap-4 text-sm mb-3">
                                  <span className="text-green-400">💰 {role.salary}</span>
                                  <span className="text-gray-400">📚 {role.requirement}</span>
                                </div>
                                <button 
                                  onClick={() => handleFindJobs(role.title)}
                                  className="w-full py-2 bg-yellow-500/20 text-yellow-500 rounded-lg text-sm font-medium hover:bg-yellow-500/30 transition-colors flex items-center justify-center gap-2"
                                >
                                  🔍 Find {role.title} Jobs
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {/* Start Career Path CTA */}
                      <button 
                        onClick={() => navigate('/training')}
                        className="w-full py-4 bg-yellow-500 text-gray-900 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 text-lg"
                      >
                        🚀 Start My Career Path - View Training Programs
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[500px] text-gray-500">
                <div className="text-center">
                  <div className="text-5xl mb-4">🗺️</div>
                  <p className="text-lg">Select a state to view details</p>
                  <p className="text-sm text-gray-600 mt-2">Click on any highlighted state on the map</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">1.2M+</div>
            <div className="text-sm text-gray-400 mt-1">Total STEM Jobs</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-green-400">18</div>
            <div className="text-sm text-gray-400 mt-1">States Covered</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">8.5K+</div>
            <div className="text-sm text-gray-400 mt-1">Training Programs</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">87%</div>
            <div className="text-sm text-gray-400 mt-1">Placement Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkforceMapPage;
