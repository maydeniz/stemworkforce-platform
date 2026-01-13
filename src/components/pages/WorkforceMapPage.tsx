import React, { useState, useEffect } from 'react';
import { StateDetailPanel } from '@/components/common/StateDetailPanel';

// Industry definitions with icons and colors - All 11 industries
const industryDefinitions: Record<string, { name: string; icon: string; color: string; bgColor: string }> = {
  'Nuclear Energy': { name: 'Nuclear', icon: '⚛️', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  'Semiconductor': { name: 'Semiconductor', icon: '🔬', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  'Healthcare': { name: 'Healthcare', icon: '🏥', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  'AI & Machine Learning': { name: 'AI & ML', icon: '🤖', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  'Quantum Technologies': { name: 'Quantum', icon: '💎', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  'Aerospace & Defense': { name: 'Aerospace', icon: '🚀', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  'Clean Energy': { name: 'Clean Energy', icon: '🌱', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  'Cybersecurity': { name: 'Cybersecurity', icon: '🔒', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  'Biotechnology': { name: 'Biotech', icon: '🧬', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  'Robotics & Automation': { name: 'Robotics', icon: '🦾', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  'Advanced Manufacturing': { name: 'Manufacturing', icon: '🏭', color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
};

// All 11 industries list
const ALL_INDUSTRIES = [
  'Nuclear Energy',
  'Semiconductor',
  'Healthcare',
  'AI & Machine Learning',
  'Quantum Technologies',
  'Aerospace & Defense',
  'Clean Energy',
  'Cybersecurity',
  'Biotechnology',
  'Robotics & Automation',
  'Advanced Manufacturing',
];

// State positions for rectangular buttons on map
const statePositions: Record<string, { x: number; y: number }> = {
  // West Coast
  WA: { x: 12, y: 8 }, OR: { x: 10, y: 18 }, CA: { x: 8, y: 35 },
  // Mountain West
  NV: { x: 16, y: 28 }, ID: { x: 18, y: 14 }, MT: { x: 26, y: 8 }, WY: { x: 26, y: 18 },
  UT: { x: 20, y: 28 }, AZ: { x: 18, y: 40 }, CO: { x: 28, y: 28 }, NM: { x: 26, y: 40 },
  // Northern Plains
  ND: { x: 38, y: 8 }, SD: { x: 38, y: 16 }, NE: { x: 40, y: 24 }, KS: { x: 40, y: 32 },
  // South Central
  OK: { x: 42, y: 40 }, TX: { x: 38, y: 50 },
  // Upper Midwest
  MN: { x: 48, y: 10 }, IA: { x: 50, y: 20 }, MO: { x: 52, y: 30 }, WI: { x: 54, y: 12 },
  IL: { x: 56, y: 24 },
  // Lower South
  AR: { x: 52, y: 40 }, LA: { x: 52, y: 50 },
  // Great Lakes
  MI: { x: 62, y: 14 }, IN: { x: 62, y: 26 }, OH: { x: 68, y: 26 },
  // Southeast
  KY: { x: 66, y: 34 }, TN: { x: 64, y: 40 }, MS: { x: 58, y: 48 }, AL: { x: 64, y: 48 },
  WV: { x: 72, y: 32 }, VA: { x: 76, y: 36 }, NC: { x: 78, y: 42 }, SC: { x: 76, y: 48 },
  GA: { x: 70, y: 50 }, FL: { x: 74, y: 58 },
  // Northeast
  PA: { x: 76, y: 24 }, NY: { x: 80, y: 16 }, NJ: { x: 82, y: 26 }, MD: { x: 80, y: 32 },
  DE: { x: 84, y: 30 }, CT: { x: 86, y: 20 }, RI: { x: 88, y: 20 }, MA: { x: 88, y: 16 },
  VT: { x: 84, y: 10 }, NH: { x: 86, y: 10 }, ME: { x: 90, y: 6 },
  // Non-contiguous (positioned below the main map)
  AK: { x: 8, y: 58 }, HI: { x: 22, y: 62 }
};

// Industry data type for a single industry within a state
interface IndustryData {
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
}

// State data structure with multiple industries
interface StateData {
  name: string;
  industries: Record<string, IndustryData>;
}

// Base industry templates - used to generate state-specific data
const industryTemplates: Record<string, {
  skills: string[];
  basePathways: { level: string; roles: { title: string; salaryRange: [number, number]; requirement: string }[] }[];
}> = {
  'Nuclear Energy': {
    skills: ['Reactor Operations', 'Nuclear Safety', 'Health Physics', 'Instrumentation', 'Radiation Protection'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Radiation Protection Trainee', salaryRange: [40, 50], requirement: 'HS + Training' },
        { title: 'Security Officer', salaryRange: [45, 55], requirement: 'HS + Clearance' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Health Physics Tech', salaryRange: [55, 70], requirement: 'Associate Degree' },
        { title: 'I&C Technician', salaryRange: [58, 75], requirement: 'Associate Degree' }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Reactor Operator', salaryRange: [80, 100], requirement: 'NRC License' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Nuclear Engineer', salaryRange: [95, 130], requirement: "Bachelor's Nuclear Eng" }
      ]}
    ]
  },
  'Semiconductor': {
    skills: ['Semiconductor Fab', 'Clean Room', 'Process Integration', 'Yield Analysis', 'Lithography'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Fab Operator', salaryRange: [46, 58], requirement: 'HS + Training' },
        { title: 'Material Handler', salaryRange: [44, 55], requirement: 'HS Diploma' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Process Technician', salaryRange: [65, 82], requirement: 'Associate Degree' },
        { title: 'Equipment Tech', salaryRange: [68, 85], requirement: 'Associate Degree' }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Senior Process Tech', salaryRange: [85, 108], requirement: 'Certification' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Process Engineer', salaryRange: [125, 160], requirement: "Bachelor's Engineering" }
      ]}
    ]
  },
  'Healthcare': {
    skills: ['Health Informatics', 'Medical Devices', 'Clinical Research', 'HIPAA Compliance', 'EHR Systems'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Health Information Tech', salaryRange: [38, 48], requirement: 'HS + Certification' },
        { title: 'Medical Coder', salaryRange: [42, 55], requirement: 'CPC Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Health IT Specialist', salaryRange: [55, 70], requirement: 'Associate Degree' },
        { title: 'Clinical Systems Tech', salaryRange: [58, 72], requirement: 'Associate + Cert' }
      ]},
      { level: 'Analyst', roles: [
        { title: 'Healthcare Data Analyst', salaryRange: [70, 92], requirement: "Bachelor's + SQL" }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Healthcare Systems Engineer', salaryRange: [110, 145], requirement: "Bachelor's + 5yr" }
      ]}
    ]
  },
  'AI & Machine Learning': {
    skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'Python/TensorFlow'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'ML Data Annotator', salaryRange: [55, 70], requirement: "Bachelor's" },
        { title: 'AI Research Assistant', salaryRange: [65, 85], requirement: "Bachelor's CS" }
      ]},
      { level: 'Technician', roles: [
        { title: 'MLOps Engineer', salaryRange: [120, 150], requirement: "Bachelor's + 2yr" },
        { title: 'Data Engineer', salaryRange: [130, 160], requirement: "Bachelor's + 2yr" }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Machine Learning Engineer', salaryRange: [165, 210], requirement: "Master's + 2yr" }
      ]},
      { level: 'Engineer', roles: [
        { title: 'AI Research Scientist', salaryRange: [200, 300], requirement: "PhD + Publications" }
      ]}
    ]
  },
  'Quantum Technologies': {
    skills: ['Quantum Computing', 'Quantum Algorithms', 'Cryogenics', 'Quantum Error Correction', 'Linear Algebra'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Quantum Lab Assistant', salaryRange: [55, 70], requirement: "Bachelor's Physics" },
        { title: 'Cryogenics Technician', salaryRange: [50, 65], requirement: 'Associate + Training' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Quantum Systems Tech', salaryRange: [75, 95], requirement: "Bachelor's + Cert" },
        { title: 'Research Technician', salaryRange: [70, 90], requirement: "Bachelor's Physics" }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Quantum Software Developer', salaryRange: [140, 180], requirement: "Master's + Qiskit" }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Quantum Research Scientist', salaryRange: [180, 250], requirement: "PhD Quantum Physics" }
      ]}
    ]
  },
  'Aerospace & Defense': {
    skills: ['Aerospace Systems', 'Defense Technology', 'Avionics', 'Flight Systems', 'Security Clearance'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Aerospace Assembly Tech', salaryRange: [42, 55], requirement: 'HS + Training' },
        { title: 'Ground Support Tech', salaryRange: [45, 58], requirement: 'HS + Clearance' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Avionics Technician', salaryRange: [62, 80], requirement: 'Associate Degree' },
        { title: 'Test Systems Tech', salaryRange: [65, 85], requirement: 'Associate + Cert' }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Flight Test Engineer', salaryRange: [90, 115], requirement: "Bachelor's Engineering" }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Aerospace Engineer', salaryRange: [120, 165], requirement: "Master's Aerospace" }
      ]}
    ]
  },
  'Clean Energy': {
    skills: ['Renewable Energy', 'Solar Installation', 'Wind Turbine', 'Grid Integration', 'Energy Storage'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Solar Installer', salaryRange: [38, 48], requirement: 'HS + NABCEP Entry' },
        { title: 'Wind Technician Trainee', salaryRange: [42, 52], requirement: 'HS + Training' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Solar PV Technician', salaryRange: [52, 68], requirement: 'NABCEP Certified' },
        { title: 'Wind Turbine Technician', salaryRange: [55, 72], requirement: 'Associate + Cert' }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Energy Systems Specialist', salaryRange: [72, 95], requirement: "Bachelor's + Cert" }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Renewable Energy Engineer', salaryRange: [95, 130], requirement: "Bachelor's Engineering" }
      ]}
    ]
  },
  'Cybersecurity': {
    skills: ['Penetration Testing', 'Network Security', 'Incident Response', 'Cloud Security', 'SIEM'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'SOC Analyst', salaryRange: [55, 72], requirement: 'Security+ Cert' },
        { title: 'IT Security Tech', salaryRange: [52, 68], requirement: 'HS + Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Security Analyst', salaryRange: [78, 98], requirement: "Bachelor's + CISSP" },
        { title: 'Incident Responder', salaryRange: [82, 105], requirement: "Bachelor's + 2yr" }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Penetration Tester', salaryRange: [105, 135], requirement: 'OSCP + 3yr' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Security Architect', salaryRange: [145, 190], requirement: 'CISSP + 7yr' }
      ]}
    ]
  },
  'Biotechnology': {
    skills: ['Molecular Biology', 'CRISPR', 'Bioinformatics', 'Clinical Trials', 'GMP Compliance'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Lab Technician', salaryRange: [45, 58], requirement: "Bachelor's Biology" },
        { title: 'Manufacturing Associate', salaryRange: [42, 55], requirement: 'HS + GMP Training' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Research Associate', salaryRange: [62, 80], requirement: "Bachelor's + 2yr" },
        { title: 'QC Analyst', salaryRange: [65, 85], requirement: "Bachelor's + GMP" }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Senior Scientist', salaryRange: [100, 130], requirement: "PhD" }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Bioprocess Engineer', salaryRange: [130, 175], requirement: "PhD Bioengineering" }
      ]}
    ]
  },
  'Robotics & Automation': {
    skills: ['Industrial Robotics', 'PLC Programming', 'Machine Vision', 'Automation Systems', 'ROS'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Automation Tech Trainee', salaryRange: [42, 52], requirement: 'HS + Training' },
        { title: 'Robot Operator', salaryRange: [45, 55], requirement: 'HS + Certification' }
      ]},
      { level: 'Technician', roles: [
        { title: 'Robotics Technician', salaryRange: [62, 78], requirement: 'Associate Degree' },
        { title: 'PLC Programmer', salaryRange: [65, 82], requirement: 'Associate + Cert' }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Automation Specialist', salaryRange: [85, 110], requirement: "Bachelor's + 3yr" }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Robotics Engineer', salaryRange: [115, 155], requirement: "Master's Robotics" }
      ]}
    ]
  },
  'Advanced Manufacturing': {
    skills: ['CNC Operation', 'Lean Manufacturing', 'Quality Control', 'Industrial Automation', 'CAD/CAM'],
    basePathways: [
      { level: 'Entry Level', roles: [
        { title: 'Production Operator', salaryRange: [35, 45], requirement: 'HS Diploma' },
        { title: 'Quality Inspector', salaryRange: [38, 48], requirement: 'HS + Training' }
      ]},
      { level: 'Technician', roles: [
        { title: 'CNC Machinist', salaryRange: [50, 65], requirement: 'Associate + Cert' },
        { title: 'Maintenance Tech', salaryRange: [52, 68], requirement: 'Associate Degree' }
      ]},
      { level: 'Specialist', roles: [
        { title: 'Process Improvement Specialist', salaryRange: [70, 90], requirement: 'Six Sigma + 3yr' }
      ]},
      { level: 'Engineer', roles: [
        { title: 'Manufacturing Engineer', salaryRange: [85, 120], requirement: "Bachelor's Engineering" }
      ]}
    ]
  }
};

// State-specific multipliers for salary/jobs (relative to national average)
const stateMultipliers: Record<string, { salary: number; jobs: number }> = {
  // High cost / High opportunity states
  CA: { salary: 1.25, jobs: 1.4 },
  NY: { salary: 1.20, jobs: 1.2 },
  MA: { salary: 1.15, jobs: 0.9 },
  WA: { salary: 1.15, jobs: 0.95 },
  NJ: { salary: 1.12, jobs: 0.75 },
  CT: { salary: 1.10, jobs: 0.55 },
  MD: { salary: 1.08, jobs: 0.7 },
  CO: { salary: 1.08, jobs: 0.85 },
  // Large / Growing states
  TX: { salary: 1.05, jobs: 1.3 },
  FL: { salary: 0.95, jobs: 1.2 },
  GA: { salary: 0.95, jobs: 0.9 },
  VA: { salary: 1.05, jobs: 0.85 },
  AZ: { salary: 1.0, jobs: 1.1 },
  NC: { salary: 0.95, jobs: 0.85 },
  // Industrial / Manufacturing states
  IL: { salary: 1.0, jobs: 0.95 },
  PA: { salary: 0.95, jobs: 0.8 },
  OH: { salary: 0.90, jobs: 0.75 },
  MI: { salary: 0.92, jobs: 0.7 },
  IN: { salary: 0.88, jobs: 0.6 },
  WI: { salary: 0.90, jobs: 0.55 },
  // Pacific Northwest / Mountain
  OR: { salary: 1.05, jobs: 0.7 },
  NV: { salary: 0.98, jobs: 0.6 },
  UT: { salary: 0.95, jobs: 0.55 },
  // Energy / Defense states
  NM: { salary: 0.90, jobs: 0.5 },
  TN: { salary: 0.90, jobs: 0.65 },
  AL: { salary: 0.85, jobs: 0.5 },
  LA: { salary: 0.88, jobs: 0.55 },
  OK: { salary: 0.85, jobs: 0.45 },
  // Smaller / Rural states
  ID: { salary: 0.85, jobs: 0.4 },
  MN: { salary: 0.95, jobs: 0.7 },
  IA: { salary: 0.85, jobs: 0.4 },
  MO: { salary: 0.88, jobs: 0.55 },
  KS: { salary: 0.85, jobs: 0.4 },
  NE: { salary: 0.82, jobs: 0.3 },
  AR: { salary: 0.80, jobs: 0.35 },
  KY: { salary: 0.85, jobs: 0.45 },
  SC: { salary: 0.88, jobs: 0.5 },
  MS: { salary: 0.78, jobs: 0.3 },
  WV: { salary: 0.80, jobs: 0.25 },
  // Northeast smaller states
  NH: { salary: 1.0, jobs: 0.35 },
  VT: { salary: 0.92, jobs: 0.2 },
  ME: { salary: 0.88, jobs: 0.25 },
  RI: { salary: 0.95, jobs: 0.25 },
  DE: { salary: 1.0, jobs: 0.3 },
  // Northern Plains
  MT: { salary: 0.82, jobs: 0.2 },
  WY: { salary: 0.85, jobs: 0.15 },
  ND: { salary: 0.85, jobs: 0.2 },
  SD: { salary: 0.80, jobs: 0.18 },
  // Non-contiguous
  AK: { salary: 1.15, jobs: 0.2 },
  HI: { salary: 1.10, jobs: 0.25 },
};

// State-specific hubs for each industry
const stateIndustryHubs: Record<string, Record<string, string[]>> = {
  CA: {
    'Nuclear Energy': ['San Luis Obispo', 'San Diego'],
    'Semiconductor': ['San Jose', 'Santa Clara', 'Irvine'],
    'Healthcare': ['Los Angeles', 'San Francisco', 'San Diego'],
    'AI & Machine Learning': ['San Francisco', 'Palo Alto', 'Mountain View'],
    'Quantum Technologies': ['Berkeley', 'Pasadena', 'Santa Barbara'],
    'Aerospace & Defense': ['Los Angeles', 'San Diego', 'Palmdale'],
    'Clean Energy': ['Sacramento', 'Fresno', 'Los Angeles'],
    'Cybersecurity': ['San Francisco', 'San Jose', 'Los Angeles'],
    'Biotechnology': ['San Diego', 'South San Francisco', 'Los Angeles'],
    'Robotics & Automation': ['San Jose', 'Fremont', 'Los Angeles'],
    'Advanced Manufacturing': ['Los Angeles', 'San Jose', 'Oakland'],
  },
  TX: {
    'Nuclear Energy': ['Bay City', 'Glen Rose'],
    'Semiconductor': ['Austin', 'Dallas', 'Houston'],
    'Healthcare': ['Houston', 'Dallas', 'Austin'],
    'AI & Machine Learning': ['Austin', 'Dallas', 'Houston'],
    'Quantum Technologies': ['Austin', 'College Station'],
    'Aerospace & Defense': ['Houston', 'Fort Worth', 'San Antonio'],
    'Clean Energy': ['Houston', 'Austin', 'Corpus Christi'],
    'Cybersecurity': ['Austin', 'Dallas', 'San Antonio'],
    'Biotechnology': ['Houston', 'Dallas', 'Austin'],
    'Robotics & Automation': ['Austin', 'Houston', 'Dallas'],
    'Advanced Manufacturing': ['Houston', 'Dallas', 'El Paso'],
  },
  NY: {
    'Nuclear Energy': ['Oswego', 'Buchanan'],
    'Semiconductor': ['Albany', 'Malta', 'Syracuse'],
    'Healthcare': ['New York City', 'Buffalo', 'Rochester'],
    'AI & Machine Learning': ['New York City', 'Brooklyn', 'Long Island'],
    'Quantum Technologies': ['New York City', 'Yorktown Heights'],
    'Aerospace & Defense': ['Long Island', 'Syracuse', 'Rochester'],
    'Clean Energy': ['Buffalo', 'Albany', 'New York City'],
    'Cybersecurity': ['New York City', 'Albany', 'White Plains'],
    'Biotechnology': ['New York City', 'Long Island', 'Albany'],
    'Robotics & Automation': ['Rochester', 'Buffalo', 'New York City'],
    'Advanced Manufacturing': ['Buffalo', 'Rochester', 'Syracuse'],
  },
  AZ: {
    'Nuclear Energy': ['Phoenix', 'Palo Verde'],
    'Semiconductor': ['Phoenix', 'Chandler', 'Tempe'],
    'Healthcare': ['Phoenix', 'Tucson', 'Scottsdale'],
    'AI & Machine Learning': ['Phoenix', 'Tempe', 'Scottsdale'],
    'Quantum Technologies': ['Tempe', 'Tucson'],
    'Aerospace & Defense': ['Phoenix', 'Tucson', 'Mesa'],
    'Clean Energy': ['Phoenix', 'Tucson', 'Flagstaff'],
    'Cybersecurity': ['Phoenix', 'Scottsdale', 'Tempe'],
    'Biotechnology': ['Phoenix', 'Scottsdale', 'Tucson'],
    'Robotics & Automation': ['Phoenix', 'Chandler', 'Mesa'],
    'Advanced Manufacturing': ['Phoenix', 'Tucson', 'Mesa'],
  },
  OH: {
    'Nuclear Energy': ['Toledo', 'Cleveland', 'Perry'],
    'Semiconductor': ['Columbus', 'Cincinnati'],
    'Healthcare': ['Cleveland', 'Columbus', 'Cincinnati'],
    'AI & Machine Learning': ['Columbus', 'Cleveland', 'Cincinnati'],
    'Quantum Technologies': ['Columbus', 'Cleveland'],
    'Aerospace & Defense': ['Dayton', 'Cleveland', 'Columbus'],
    'Clean Energy': ['Cleveland', 'Columbus', 'Toledo'],
    'Cybersecurity': ['Columbus', 'Cleveland', 'Cincinnati'],
    'Biotechnology': ['Columbus', 'Cleveland', 'Cincinnati'],
    'Robotics & Automation': ['Cleveland', 'Cincinnati', 'Columbus'],
    'Advanced Manufacturing': ['Cleveland', 'Cincinnati', 'Columbus'],
  },
  ID: {
    'Nuclear Energy': ['Idaho Falls', 'Pocatello'],
    'Semiconductor': ['Boise'],
    'Healthcare': ['Boise', 'Idaho Falls'],
    'AI & Machine Learning': ['Boise'],
    'Quantum Technologies': ['Idaho Falls'],
    'Aerospace & Defense': ['Boise', 'Mountain Home'],
    'Clean Energy': ['Boise', 'Idaho Falls'],
    'Cybersecurity': ['Boise'],
    'Biotechnology': ['Boise', 'Moscow'],
    'Robotics & Automation': ['Boise', 'Idaho Falls'],
    'Advanced Manufacturing': ['Boise', 'Nampa', 'Meridian'],
  },
  NM: {
    'Nuclear Energy': ['Los Alamos', 'Albuquerque', 'Carlsbad'],
    'Semiconductor': ['Albuquerque', 'Rio Rancho'],
    'Healthcare': ['Albuquerque', 'Santa Fe'],
    'AI & Machine Learning': ['Albuquerque', 'Santa Fe'],
    'Quantum Technologies': ['Los Alamos', 'Albuquerque', 'Sandia'],
    'Aerospace & Defense': ['Albuquerque', 'White Sands', 'Kirtland AFB'],
    'Clean Energy': ['Albuquerque', 'Santa Fe'],
    'Cybersecurity': ['Albuquerque', 'Los Alamos'],
    'Biotechnology': ['Albuquerque', 'Santa Fe'],
    'Robotics & Automation': ['Albuquerque', 'Los Alamos'],
    'Advanced Manufacturing': ['Albuquerque', 'Rio Rancho'],
  },
  TN: {
    'Nuclear Energy': ['Oak Ridge', 'Chattanooga', 'Spring City'],
    'Semiconductor': ['Nashville', 'Memphis'],
    'Healthcare': ['Nashville', 'Memphis', 'Knoxville'],
    'AI & Machine Learning': ['Nashville', 'Knoxville'],
    'Quantum Technologies': ['Oak Ridge', 'Knoxville'],
    'Aerospace & Defense': ['Nashville', 'Tullahoma'],
    'Clean Energy': ['Nashville', 'Knoxville', 'Memphis'],
    'Cybersecurity': ['Nashville', 'Knoxville'],
    'Biotechnology': ['Nashville', 'Memphis'],
    'Robotics & Automation': ['Nashville', 'Chattanooga'],
    'Advanced Manufacturing': ['Nashville', 'Chattanooga', 'Memphis'],
  },
  MA: {
    'Nuclear Energy': ['Plymouth'],
    'Semiconductor': ['Burlington', 'Andover'],
    'Healthcare': ['Boston', 'Cambridge', 'Worcester'],
    'AI & Machine Learning': ['Boston', 'Cambridge'],
    'Quantum Technologies': ['Cambridge', 'Boston'],
    'Aerospace & Defense': ['Boston', 'Lexington'],
    'Clean Energy': ['Boston', 'Worcester'],
    'Cybersecurity': ['Boston', 'Cambridge', 'Burlington'],
    'Biotechnology': ['Cambridge', 'Boston', 'Worcester'],
    'Robotics & Automation': ['Boston', 'Cambridge', 'Worcester'],
    'Advanced Manufacturing': ['Worcester', 'Springfield', 'Boston'],
  },
  MN: {
    'Nuclear Energy': ['Red Wing', 'Monticello'],
    'Semiconductor': ['Bloomington'],
    'Healthcare': ['Minneapolis', 'Rochester', 'St. Paul'],
    'AI & Machine Learning': ['Minneapolis', 'St. Paul'],
    'Quantum Technologies': ['Minneapolis'],
    'Aerospace & Defense': ['Minneapolis', 'St. Paul'],
    'Clean Energy': ['Minneapolis', 'Rochester'],
    'Cybersecurity': ['Minneapolis', 'St. Paul'],
    'Biotechnology': ['Minneapolis', 'Rochester'],
    'Robotics & Automation': ['Minneapolis', 'St. Paul', 'Rochester'],
    'Advanced Manufacturing': ['Minneapolis', 'St. Paul', 'Duluth'],
  },
  PA: {
    'Nuclear Energy': ['Limerick', 'Berwick'],
    'Semiconductor': ['Philadelphia', 'Pittsburgh'],
    'Healthcare': ['Philadelphia', 'Pittsburgh', 'Harrisburg'],
    'AI & Machine Learning': ['Pittsburgh', 'Philadelphia'],
    'Quantum Technologies': ['Pittsburgh', 'Philadelphia'],
    'Aerospace & Defense': ['Philadelphia', 'Pittsburgh'],
    'Clean Energy': ['Philadelphia', 'Pittsburgh'],
    'Cybersecurity': ['Philadelphia', 'Pittsburgh'],
    'Biotechnology': ['Philadelphia', 'Pittsburgh'],
    'Robotics & Automation': ['Pittsburgh', 'Philadelphia'],
    'Advanced Manufacturing': ['Pittsburgh', 'Philadelphia', 'Allentown'],
  },
  NC: {
    'Nuclear Energy': ['Southport', 'Raleigh'],
    'Semiconductor': ['Raleigh', 'Durham'],
    'Healthcare': ['Research Triangle', 'Charlotte', 'Winston-Salem'],
    'AI & Machine Learning': ['Research Triangle', 'Charlotte'],
    'Quantum Technologies': ['Research Triangle', 'Durham'],
    'Aerospace & Defense': ['Charlotte', 'Raleigh'],
    'Clean Energy': ['Charlotte', 'Raleigh'],
    'Cybersecurity': ['Charlotte', 'Raleigh', 'Durham'],
    'Biotechnology': ['Research Triangle', 'Durham', 'Raleigh'],
    'Robotics & Automation': ['Charlotte', 'Raleigh'],
    'Advanced Manufacturing': ['Charlotte', 'Greensboro', 'Raleigh'],
  },
  FL: {
    'Nuclear Energy': ['Miami', 'Crystal River'],
    'Semiconductor': ['Orlando', 'Tampa'],
    'Healthcare': ['Miami', 'Tampa', 'Orlando', 'Jacksonville'],
    'AI & Machine Learning': ['Miami', 'Tampa', 'Orlando'],
    'Quantum Technologies': ['Orlando', 'Gainesville'],
    'Aerospace & Defense': ['Cape Canaveral', 'Melbourne', 'Tampa'],
    'Clean Energy': ['Miami', 'Orlando', 'Jacksonville'],
    'Cybersecurity': ['Tampa', 'Orlando', 'Miami'],
    'Biotechnology': ['Miami', 'Tampa', 'Jacksonville'],
    'Robotics & Automation': ['Orlando', 'Tampa', 'Miami'],
    'Advanced Manufacturing': ['Tampa', 'Jacksonville', 'Orlando'],
  },
  OR: {
    'Nuclear Energy': ['Portland'],
    'Semiconductor': ['Portland', 'Hillsboro', 'Beaverton'],
    'Healthcare': ['Portland', 'Eugene'],
    'AI & Machine Learning': ['Portland', 'Eugene'],
    'Quantum Technologies': ['Portland'],
    'Aerospace & Defense': ['Portland'],
    'Clean Energy': ['Portland', 'Eugene', 'Bend'],
    'Cybersecurity': ['Portland', 'Hillsboro'],
    'Biotechnology': ['Portland', 'Eugene'],
    'Robotics & Automation': ['Portland', 'Hillsboro'],
    'Advanced Manufacturing': ['Portland', 'Eugene', 'Salem'],
  },
  // Washington
  WA: {
    'Nuclear Energy': ['Richland', 'Seattle'],
    'Semiconductor': ['Seattle', 'Redmond', 'Bellevue'],
    'Healthcare': ['Seattle', 'Tacoma', 'Spokane'],
    'AI & Machine Learning': ['Seattle', 'Redmond', 'Bellevue'],
    'Quantum Technologies': ['Seattle', 'Redmond'],
    'Aerospace & Defense': ['Seattle', 'Everett', 'Kent'],
    'Clean Energy': ['Seattle', 'Olympia', 'Spokane'],
    'Cybersecurity': ['Seattle', 'Redmond', 'Bellevue'],
    'Biotechnology': ['Seattle', 'Bothell'],
    'Robotics & Automation': ['Seattle', 'Redmond'],
    'Advanced Manufacturing': ['Seattle', 'Tacoma', 'Everett'],
  },
  // Nevada
  NV: {
    'Nuclear Energy': ['Las Vegas', 'Reno'],
    'Semiconductor': ['Reno', 'Las Vegas'],
    'Healthcare': ['Las Vegas', 'Reno', 'Henderson'],
    'AI & Machine Learning': ['Las Vegas', 'Reno'],
    'Quantum Technologies': ['Reno', 'Las Vegas'],
    'Aerospace & Defense': ['Las Vegas', 'Reno'],
    'Clean Energy': ['Las Vegas', 'Reno', 'Sparks'],
    'Cybersecurity': ['Las Vegas', 'Reno'],
    'Biotechnology': ['Reno', 'Las Vegas'],
    'Robotics & Automation': ['Reno', 'Las Vegas'],
    'Advanced Manufacturing': ['Reno', 'Sparks', 'Las Vegas'],
  },
  // Colorado
  CO: {
    'Nuclear Energy': ['Denver', 'Golden'],
    'Semiconductor': ['Denver', 'Boulder', 'Colorado Springs'],
    'Healthcare': ['Denver', 'Aurora', 'Colorado Springs'],
    'AI & Machine Learning': ['Denver', 'Boulder'],
    'Quantum Technologies': ['Boulder', 'Denver'],
    'Aerospace & Defense': ['Colorado Springs', 'Denver', 'Aurora'],
    'Clean Energy': ['Denver', 'Boulder', 'Fort Collins'],
    'Cybersecurity': ['Denver', 'Colorado Springs'],
    'Biotechnology': ['Denver', 'Boulder', 'Fort Collins'],
    'Robotics & Automation': ['Denver', 'Boulder'],
    'Advanced Manufacturing': ['Denver', 'Pueblo', 'Grand Junction'],
  },
  // Utah
  UT: {
    'Nuclear Energy': ['Salt Lake City'],
    'Semiconductor': ['Salt Lake City', 'Lehi'],
    'Healthcare': ['Salt Lake City', 'Murray', 'Provo'],
    'AI & Machine Learning': ['Salt Lake City', 'Lehi', 'Provo'],
    'Quantum Technologies': ['Salt Lake City', 'Provo'],
    'Aerospace & Defense': ['Salt Lake City', 'Ogden'],
    'Clean Energy': ['Salt Lake City', 'St. George'],
    'Cybersecurity': ['Salt Lake City', 'Lehi'],
    'Biotechnology': ['Salt Lake City', 'Logan'],
    'Robotics & Automation': ['Salt Lake City', 'Provo'],
    'Advanced Manufacturing': ['Salt Lake City', 'Ogden', 'Provo'],
  },
  // Montana
  MT: {
    'Nuclear Energy': ['Great Falls'],
    'Semiconductor': ['Bozeman'],
    'Healthcare': ['Billings', 'Missoula', 'Great Falls'],
    'AI & Machine Learning': ['Bozeman', 'Missoula'],
    'Quantum Technologies': ['Bozeman'],
    'Aerospace & Defense': ['Great Falls', 'Malmstrom AFB'],
    'Clean Energy': ['Billings', 'Great Falls'],
    'Cybersecurity': ['Bozeman', 'Missoula'],
    'Biotechnology': ['Bozeman', 'Missoula'],
    'Robotics & Automation': ['Bozeman'],
    'Advanced Manufacturing': ['Billings', 'Missoula', 'Great Falls'],
  },
  // Wyoming
  WY: {
    'Nuclear Energy': ['Cheyenne'],
    'Semiconductor': ['Cheyenne'],
    'Healthcare': ['Cheyenne', 'Casper'],
    'AI & Machine Learning': ['Cheyenne', 'Laramie'],
    'Quantum Technologies': ['Laramie'],
    'Aerospace & Defense': ['Cheyenne', 'F.E. Warren AFB'],
    'Clean Energy': ['Cheyenne', 'Casper', 'Rock Springs'],
    'Cybersecurity': ['Cheyenne'],
    'Biotechnology': ['Laramie'],
    'Robotics & Automation': ['Cheyenne'],
    'Advanced Manufacturing': ['Cheyenne', 'Casper'],
  },
  // North Dakota
  ND: {
    'Nuclear Energy': ['Grand Forks'],
    'Semiconductor': ['Fargo'],
    'Healthcare': ['Fargo', 'Bismarck', 'Grand Forks'],
    'AI & Machine Learning': ['Fargo'],
    'Quantum Technologies': ['Fargo'],
    'Aerospace & Defense': ['Grand Forks', 'Minot AFB'],
    'Clean Energy': ['Fargo', 'Bismarck'],
    'Cybersecurity': ['Fargo'],
    'Biotechnology': ['Fargo'],
    'Robotics & Automation': ['Fargo'],
    'Advanced Manufacturing': ['Fargo', 'Bismarck', 'Grand Forks'],
  },
  // South Dakota
  SD: {
    'Nuclear Energy': ['Rapid City'],
    'Semiconductor': ['Sioux Falls'],
    'Healthcare': ['Sioux Falls', 'Rapid City'],
    'AI & Machine Learning': ['Sioux Falls'],
    'Quantum Technologies': ['Sioux Falls'],
    'Aerospace & Defense': ['Rapid City', 'Ellsworth AFB'],
    'Clean Energy': ['Sioux Falls', 'Rapid City'],
    'Cybersecurity': ['Sioux Falls'],
    'Biotechnology': ['Sioux Falls'],
    'Robotics & Automation': ['Sioux Falls'],
    'Advanced Manufacturing': ['Sioux Falls', 'Rapid City'],
  },
  // Nebraska
  NE: {
    'Nuclear Energy': ['Omaha', 'Brownville'],
    'Semiconductor': ['Omaha', 'Lincoln'],
    'Healthcare': ['Omaha', 'Lincoln'],
    'AI & Machine Learning': ['Omaha', 'Lincoln'],
    'Quantum Technologies': ['Lincoln'],
    'Aerospace & Defense': ['Omaha', 'Offutt AFB'],
    'Clean Energy': ['Lincoln', 'Omaha'],
    'Cybersecurity': ['Omaha', 'Lincoln'],
    'Biotechnology': ['Lincoln', 'Omaha'],
    'Robotics & Automation': ['Omaha', 'Lincoln'],
    'Advanced Manufacturing': ['Omaha', 'Lincoln', 'Grand Island'],
  },
  // Kansas
  KS: {
    'Nuclear Energy': ['Topeka'],
    'Semiconductor': ['Kansas City', 'Wichita'],
    'Healthcare': ['Kansas City', 'Wichita', 'Topeka'],
    'AI & Machine Learning': ['Kansas City', 'Wichita'],
    'Quantum Technologies': ['Lawrence'],
    'Aerospace & Defense': ['Wichita', 'Kansas City', 'McConnell AFB'],
    'Clean Energy': ['Topeka', 'Kansas City'],
    'Cybersecurity': ['Kansas City', 'Wichita'],
    'Biotechnology': ['Kansas City', 'Lawrence'],
    'Robotics & Automation': ['Wichita', 'Kansas City'],
    'Advanced Manufacturing': ['Wichita', 'Kansas City', 'Topeka'],
  },
  // Iowa
  IA: {
    'Nuclear Energy': ['Cedar Rapids'],
    'Semiconductor': ['Des Moines', 'Cedar Rapids'],
    'Healthcare': ['Des Moines', 'Iowa City', 'Cedar Rapids'],
    'AI & Machine Learning': ['Des Moines', 'Iowa City'],
    'Quantum Technologies': ['Iowa City'],
    'Aerospace & Defense': ['Des Moines'],
    'Clean Energy': ['Des Moines', 'Cedar Rapids'],
    'Cybersecurity': ['Des Moines'],
    'Biotechnology': ['Iowa City', 'Des Moines'],
    'Robotics & Automation': ['Des Moines', 'Cedar Rapids'],
    'Advanced Manufacturing': ['Des Moines', 'Cedar Rapids', 'Davenport'],
  },
  // Missouri
  MO: {
    'Nuclear Energy': ['Kansas City', 'St. Louis'],
    'Semiconductor': ['St. Louis', 'Kansas City'],
    'Healthcare': ['St. Louis', 'Kansas City', 'Springfield'],
    'AI & Machine Learning': ['St. Louis', 'Kansas City'],
    'Quantum Technologies': ['St. Louis'],
    'Aerospace & Defense': ['St. Louis', 'Kansas City'],
    'Clean Energy': ['St. Louis', 'Kansas City'],
    'Cybersecurity': ['St. Louis', 'Kansas City'],
    'Biotechnology': ['St. Louis', 'Kansas City'],
    'Robotics & Automation': ['St. Louis', 'Kansas City'],
    'Advanced Manufacturing': ['St. Louis', 'Kansas City', 'Springfield'],
  },
  // Wisconsin
  WI: {
    'Nuclear Energy': ['Kewaunee', 'Two Rivers'],
    'Semiconductor': ['Madison', 'Milwaukee'],
    'Healthcare': ['Milwaukee', 'Madison', 'Green Bay'],
    'AI & Machine Learning': ['Madison', 'Milwaukee'],
    'Quantum Technologies': ['Madison'],
    'Aerospace & Defense': ['Milwaukee', 'Oshkosh'],
    'Clean Energy': ['Madison', 'Milwaukee'],
    'Cybersecurity': ['Madison', 'Milwaukee'],
    'Biotechnology': ['Madison', 'Milwaukee'],
    'Robotics & Automation': ['Milwaukee', 'Madison'],
    'Advanced Manufacturing': ['Milwaukee', 'Madison', 'Green Bay'],
  },
  // Illinois
  IL: {
    'Nuclear Energy': ['Chicago', 'Morris', 'Braidwood'],
    'Semiconductor': ['Chicago', 'Naperville'],
    'Healthcare': ['Chicago', 'Springfield', 'Peoria'],
    'AI & Machine Learning': ['Chicago', 'Champaign'],
    'Quantum Technologies': ['Chicago', 'Urbana'],
    'Aerospace & Defense': ['Chicago', 'St. Louis Metro'],
    'Clean Energy': ['Chicago', 'Springfield'],
    'Cybersecurity': ['Chicago', 'Naperville'],
    'Biotechnology': ['Chicago', 'Champaign'],
    'Robotics & Automation': ['Chicago', 'Peoria'],
    'Advanced Manufacturing': ['Chicago', 'Rockford', 'Peoria'],
  },
  // Michigan
  MI: {
    'Nuclear Energy': ['Detroit', 'South Haven'],
    'Semiconductor': ['Ann Arbor', 'Detroit'],
    'Healthcare': ['Detroit', 'Ann Arbor', 'Grand Rapids'],
    'AI & Machine Learning': ['Ann Arbor', 'Detroit'],
    'Quantum Technologies': ['Ann Arbor'],
    'Aerospace & Defense': ['Detroit', 'Selfridge ANG Base'],
    'Clean Energy': ['Detroit', 'Lansing'],
    'Cybersecurity': ['Detroit', 'Ann Arbor'],
    'Biotechnology': ['Ann Arbor', 'Detroit'],
    'Robotics & Automation': ['Detroit', 'Ann Arbor', 'Auburn Hills'],
    'Advanced Manufacturing': ['Detroit', 'Grand Rapids', 'Flint'],
  },
  // Indiana
  IN: {
    'Nuclear Energy': ['Indianapolis'],
    'Semiconductor': ['Indianapolis', 'West Lafayette'],
    'Healthcare': ['Indianapolis', 'Fort Wayne', 'South Bend'],
    'AI & Machine Learning': ['Indianapolis', 'West Lafayette'],
    'Quantum Technologies': ['West Lafayette'],
    'Aerospace & Defense': ['Indianapolis', 'Fort Wayne'],
    'Clean Energy': ['Indianapolis', 'Bloomington'],
    'Cybersecurity': ['Indianapolis'],
    'Biotechnology': ['Indianapolis', 'West Lafayette'],
    'Robotics & Automation': ['Indianapolis', 'Fort Wayne'],
    'Advanced Manufacturing': ['Indianapolis', 'Fort Wayne', 'Elkhart'],
  },
  // Oklahoma
  OK: {
    'Nuclear Energy': ['Oklahoma City'],
    'Semiconductor': ['Oklahoma City', 'Tulsa'],
    'Healthcare': ['Oklahoma City', 'Tulsa'],
    'AI & Machine Learning': ['Oklahoma City', 'Tulsa'],
    'Quantum Technologies': ['Norman'],
    'Aerospace & Defense': ['Oklahoma City', 'Tinker AFB', 'Tulsa'],
    'Clean Energy': ['Oklahoma City', 'Tulsa'],
    'Cybersecurity': ['Oklahoma City', 'Tulsa'],
    'Biotechnology': ['Oklahoma City', 'Norman'],
    'Robotics & Automation': ['Oklahoma City', 'Tulsa'],
    'Advanced Manufacturing': ['Tulsa', 'Oklahoma City'],
  },
  // Arkansas
  AR: {
    'Nuclear Energy': ['Russellville'],
    'Semiconductor': ['Little Rock', 'Bentonville'],
    'Healthcare': ['Little Rock', 'Fayetteville'],
    'AI & Machine Learning': ['Bentonville', 'Little Rock'],
    'Quantum Technologies': ['Fayetteville'],
    'Aerospace & Defense': ['Little Rock AFB', 'Jacksonville'],
    'Clean Energy': ['Little Rock', 'Fayetteville'],
    'Cybersecurity': ['Little Rock', 'Bentonville'],
    'Biotechnology': ['Little Rock', 'Fayetteville'],
    'Robotics & Automation': ['Bentonville', 'Little Rock'],
    'Advanced Manufacturing': ['Little Rock', 'Fort Smith', 'Jonesboro'],
  },
  // Louisiana
  LA: {
    'Nuclear Energy': ['New Orleans', 'Baton Rouge'],
    'Semiconductor': ['New Orleans', 'Baton Rouge'],
    'Healthcare': ['New Orleans', 'Baton Rouge', 'Shreveport'],
    'AI & Machine Learning': ['New Orleans', 'Baton Rouge'],
    'Quantum Technologies': ['Baton Rouge'],
    'Aerospace & Defense': ['New Orleans', 'Barksdale AFB'],
    'Clean Energy': ['New Orleans', 'Lafayette'],
    'Cybersecurity': ['New Orleans', 'Baton Rouge'],
    'Biotechnology': ['New Orleans', 'Baton Rouge'],
    'Robotics & Automation': ['New Orleans', 'Baton Rouge'],
    'Advanced Manufacturing': ['Baton Rouge', 'New Orleans', 'Lake Charles'],
  },
  // Kentucky
  KY: {
    'Nuclear Energy': ['Louisville', 'Paducah'],
    'Semiconductor': ['Louisville', 'Lexington'],
    'Healthcare': ['Louisville', 'Lexington'],
    'AI & Machine Learning': ['Louisville', 'Lexington'],
    'Quantum Technologies': ['Lexington'],
    'Aerospace & Defense': ['Louisville', 'Fort Knox'],
    'Clean Energy': ['Louisville', 'Lexington'],
    'Cybersecurity': ['Louisville', 'Lexington'],
    'Biotechnology': ['Louisville', 'Lexington'],
    'Robotics & Automation': ['Louisville', 'Lexington'],
    'Advanced Manufacturing': ['Louisville', 'Lexington', 'Bowling Green'],
  },
  // Mississippi
  MS: {
    'Nuclear Energy': ['Jackson', 'Port Gibson'],
    'Semiconductor': ['Jackson'],
    'Healthcare': ['Jackson', 'Biloxi', 'Hattiesburg'],
    'AI & Machine Learning': ['Jackson'],
    'Quantum Technologies': ['Starkville'],
    'Aerospace & Defense': ['Columbus AFB', 'Stennis Space Center'],
    'Clean Energy': ['Jackson', 'Hattiesburg'],
    'Cybersecurity': ['Jackson'],
    'Biotechnology': ['Jackson', 'Starkville'],
    'Robotics & Automation': ['Jackson'],
    'Advanced Manufacturing': ['Jackson', 'Tupelo', 'Gulfport'],
  },
  // Alabama
  AL: {
    'Nuclear Energy': ['Huntsville', 'Dothan'],
    'Semiconductor': ['Huntsville', 'Birmingham'],
    'Healthcare': ['Birmingham', 'Huntsville', 'Mobile'],
    'AI & Machine Learning': ['Huntsville', 'Birmingham'],
    'Quantum Technologies': ['Huntsville'],
    'Aerospace & Defense': ['Huntsville', 'Mobile', 'Redstone Arsenal'],
    'Clean Energy': ['Birmingham', 'Huntsville'],
    'Cybersecurity': ['Huntsville', 'Birmingham'],
    'Biotechnology': ['Birmingham', 'Huntsville'],
    'Robotics & Automation': ['Huntsville', 'Birmingham'],
    'Advanced Manufacturing': ['Birmingham', 'Huntsville', 'Mobile'],
  },
  // West Virginia
  WV: {
    'Nuclear Energy': ['Charleston'],
    'Semiconductor': ['Morgantown'],
    'Healthcare': ['Charleston', 'Morgantown', 'Huntington'],
    'AI & Machine Learning': ['Morgantown'],
    'Quantum Technologies': ['Morgantown'],
    'Aerospace & Defense': ['Charleston'],
    'Clean Energy': ['Charleston', 'Morgantown'],
    'Cybersecurity': ['Charleston', 'Morgantown'],
    'Biotechnology': ['Morgantown', 'Charleston'],
    'Robotics & Automation': ['Morgantown'],
    'Advanced Manufacturing': ['Charleston', 'Huntington', 'Wheeling'],
  },
  // Virginia
  VA: {
    'Nuclear Energy': ['Norfolk', 'Newport News'],
    'Semiconductor': ['Northern Virginia', 'Richmond'],
    'Healthcare': ['Richmond', 'Norfolk', 'Charlottesville'],
    'AI & Machine Learning': ['Northern Virginia', 'Arlington', 'Reston'],
    'Quantum Technologies': ['Charlottesville', 'Arlington'],
    'Aerospace & Defense': ['Norfolk', 'Arlington', 'Hampton Roads'],
    'Clean Energy': ['Richmond', 'Norfolk'],
    'Cybersecurity': ['Northern Virginia', 'Arlington', 'Tysons'],
    'Biotechnology': ['Charlottesville', 'Richmond'],
    'Robotics & Automation': ['Northern Virginia', 'Richmond'],
    'Advanced Manufacturing': ['Richmond', 'Virginia Beach', 'Newport News'],
  },
  // South Carolina
  SC: {
    'Nuclear Energy': ['Columbia', 'Jenkinsville'],
    'Semiconductor': ['Charleston', 'Greenville'],
    'Healthcare': ['Charleston', 'Columbia', 'Greenville'],
    'AI & Machine Learning': ['Charleston', 'Columbia'],
    'Quantum Technologies': ['Columbia'],
    'Aerospace & Defense': ['Charleston', 'Greenville'],
    'Clean Energy': ['Charleston', 'Columbia'],
    'Cybersecurity': ['Charleston', 'Columbia'],
    'Biotechnology': ['Charleston', 'Greenville'],
    'Robotics & Automation': ['Greenville', 'Spartanburg'],
    'Advanced Manufacturing': ['Greenville', 'Spartanburg', 'Charleston'],
  },
  // Georgia
  GA: {
    'Nuclear Energy': ['Augusta', 'Waynesboro'],
    'Semiconductor': ['Atlanta', 'Alpharetta'],
    'Healthcare': ['Atlanta', 'Augusta', 'Savannah'],
    'AI & Machine Learning': ['Atlanta', 'Alpharetta'],
    'Quantum Technologies': ['Atlanta', 'Athens'],
    'Aerospace & Defense': ['Atlanta', 'Warner Robins', 'Savannah'],
    'Clean Energy': ['Atlanta', 'Savannah'],
    'Cybersecurity': ['Atlanta', 'Augusta'],
    'Biotechnology': ['Atlanta', 'Athens'],
    'Robotics & Automation': ['Atlanta', 'Savannah'],
    'Advanced Manufacturing': ['Atlanta', 'Savannah', 'Augusta'],
  },
  // New Jersey
  NJ: {
    'Nuclear Energy': ['Salem', 'Lacey Township'],
    'Semiconductor': ['Princeton', 'Somerset'],
    'Healthcare': ['Newark', 'New Brunswick', 'Camden'],
    'AI & Machine Learning': ['Princeton', 'Jersey City'],
    'Quantum Technologies': ['Princeton'],
    'Aerospace & Defense': ['Lakehurst', 'McGuire AFB'],
    'Clean Energy': ['Newark', 'Trenton'],
    'Cybersecurity': ['Jersey City', 'Newark'],
    'Biotechnology': ['New Brunswick', 'Princeton'],
    'Robotics & Automation': ['Newark', 'Princeton'],
    'Advanced Manufacturing': ['Newark', 'Camden', 'Trenton'],
  },
  // Maryland
  MD: {
    'Nuclear Energy': ['Lusby'],
    'Semiconductor': ['Baltimore', 'Bethesda'],
    'Healthcare': ['Baltimore', 'Bethesda', 'Rockville'],
    'AI & Machine Learning': ['Bethesda', 'College Park'],
    'Quantum Technologies': ['College Park', 'Bethesda'],
    'Aerospace & Defense': ['Baltimore', 'Patuxent River', 'Aberdeen'],
    'Clean Energy': ['Baltimore', 'Annapolis'],
    'Cybersecurity': ['Baltimore', 'Fort Meade', 'Columbia'],
    'Biotechnology': ['Bethesda', 'Rockville', 'Frederick'],
    'Robotics & Automation': ['Baltimore', 'College Park'],
    'Advanced Manufacturing': ['Baltimore', 'Hagerstown'],
  },
  // Delaware
  DE: {
    'Nuclear Energy': ['Wilmington'],
    'Semiconductor': ['Wilmington', 'Newark'],
    'Healthcare': ['Wilmington', 'Newark', 'Dover'],
    'AI & Machine Learning': ['Wilmington'],
    'Quantum Technologies': ['Newark'],
    'Aerospace & Defense': ['Dover AFB'],
    'Clean Energy': ['Wilmington', 'Dover'],
    'Cybersecurity': ['Wilmington'],
    'Biotechnology': ['Wilmington', 'Newark'],
    'Robotics & Automation': ['Wilmington'],
    'Advanced Manufacturing': ['Wilmington', 'Dover'],
  },
  // Connecticut
  CT: {
    'Nuclear Energy': ['Waterford'],
    'Semiconductor': ['Hartford', 'New Haven'],
    'Healthcare': ['Hartford', 'New Haven', 'Stamford'],
    'AI & Machine Learning': ['Hartford', 'New Haven'],
    'Quantum Technologies': ['New Haven'],
    'Aerospace & Defense': ['Hartford', 'Groton', 'Stratford'],
    'Clean Energy': ['Hartford', 'New Haven'],
    'Cybersecurity': ['Hartford', 'Stamford'],
    'Biotechnology': ['New Haven', 'Hartford'],
    'Robotics & Automation': ['Hartford', 'New Haven'],
    'Advanced Manufacturing': ['Hartford', 'Bridgeport', 'New Haven'],
  },
  // Rhode Island
  RI: {
    'Nuclear Energy': ['Providence'],
    'Semiconductor': ['Providence'],
    'Healthcare': ['Providence', 'Warwick'],
    'AI & Machine Learning': ['Providence'],
    'Quantum Technologies': ['Providence'],
    'Aerospace & Defense': ['Quonset Point', 'Newport'],
    'Clean Energy': ['Providence'],
    'Cybersecurity': ['Providence'],
    'Biotechnology': ['Providence'],
    'Robotics & Automation': ['Providence'],
    'Advanced Manufacturing': ['Providence', 'Warwick'],
  },
  // Vermont
  VT: {
    'Nuclear Energy': ['Vernon'],
    'Semiconductor': ['Burlington'],
    'Healthcare': ['Burlington', 'Rutland'],
    'AI & Machine Learning': ['Burlington'],
    'Quantum Technologies': ['Burlington'],
    'Aerospace & Defense': ['Burlington'],
    'Clean Energy': ['Burlington', 'Montpelier'],
    'Cybersecurity': ['Burlington'],
    'Biotechnology': ['Burlington'],
    'Robotics & Automation': ['Burlington'],
    'Advanced Manufacturing': ['Burlington', 'Rutland'],
  },
  // New Hampshire
  NH: {
    'Nuclear Energy': ['Seabrook'],
    'Semiconductor': ['Nashua', 'Manchester'],
    'Healthcare': ['Manchester', 'Concord', 'Nashua'],
    'AI & Machine Learning': ['Manchester', 'Nashua'],
    'Quantum Technologies': ['Hanover'],
    'Aerospace & Defense': ['Portsmouth', 'Nashua'],
    'Clean Energy': ['Concord', 'Manchester'],
    'Cybersecurity': ['Manchester', 'Nashua'],
    'Biotechnology': ['Hanover', 'Manchester'],
    'Robotics & Automation': ['Nashua', 'Manchester'],
    'Advanced Manufacturing': ['Manchester', 'Nashua', 'Portsmouth'],
  },
  // Maine
  ME: {
    'Nuclear Energy': ['Wiscasset'],
    'Semiconductor': ['Portland'],
    'Healthcare': ['Portland', 'Bangor', 'Lewiston'],
    'AI & Machine Learning': ['Portland'],
    'Quantum Technologies': ['Orono'],
    'Aerospace & Defense': ['Bath', 'Kittery'],
    'Clean Energy': ['Portland', 'Bangor'],
    'Cybersecurity': ['Portland'],
    'Biotechnology': ['Portland', 'Orono'],
    'Robotics & Automation': ['Portland'],
    'Advanced Manufacturing': ['Portland', 'Lewiston', 'Bath'],
  },
  // Alaska
  AK: {
    'Nuclear Energy': ['Fairbanks'],
    'Semiconductor': ['Anchorage'],
    'Healthcare': ['Anchorage', 'Fairbanks', 'Juneau'],
    'AI & Machine Learning': ['Anchorage'],
    'Quantum Technologies': ['Fairbanks'],
    'Aerospace & Defense': ['Anchorage', 'Fairbanks', 'Elmendorf AFB'],
    'Clean Energy': ['Anchorage', 'Juneau'],
    'Cybersecurity': ['Anchorage'],
    'Biotechnology': ['Fairbanks', 'Anchorage'],
    'Robotics & Automation': ['Anchorage'],
    'Advanced Manufacturing': ['Anchorage', 'Fairbanks'],
  },
  // Hawaii
  HI: {
    'Nuclear Energy': ['Pearl Harbor'],
    'Semiconductor': ['Honolulu'],
    'Healthcare': ['Honolulu', 'Hilo'],
    'AI & Machine Learning': ['Honolulu'],
    'Quantum Technologies': ['Honolulu'],
    'Aerospace & Defense': ['Honolulu', 'Pearl Harbor', 'Hickam AFB'],
    'Clean Energy': ['Honolulu', 'Maui'],
    'Cybersecurity': ['Honolulu'],
    'Biotechnology': ['Honolulu'],
    'Robotics & Automation': ['Honolulu'],
    'Advanced Manufacturing': ['Honolulu'],
  },
};

// Base job numbers by industry (national average for a mid-sized state)
const baseIndustryJobs: Record<string, number> = {
  'Nuclear Energy': 5000,
  'Semiconductor': 80000,
  'Healthcare': 95000,
  'AI & Machine Learning': 45000,
  'Quantum Technologies': 2500,
  'Aerospace & Defense': 55000,
  'Clean Energy': 35000,
  'Cybersecurity': 42000,
  'Biotechnology': 38000,
  'Robotics & Automation': 28000,
  'Advanced Manufacturing': 65000,
};

// Growth rates by industry (varies by state focus)
const baseGrowthRates: Record<string, number> = {
  'Nuclear Energy': 25,
  'Semiconductor': 35,
  'Healthcare': 28,
  'AI & Machine Learning': 52,
  'Quantum Technologies': 65,
  'Aerospace & Defense': 22,
  'Clean Energy': 38,
  'Cybersecurity': 35,
  'Biotechnology': 30,
  'Robotics & Automation': 32,
  'Advanced Manufacturing': 18,
};

// Generate industry data for a state
const generateIndustryData = (state: string, industry: string): IndustryData => {
  const template = industryTemplates[industry];
  const multiplier = stateMultipliers[state] || { salary: 1.0, jobs: 0.6 };
  const hubs = stateIndustryHubs[state]?.[industry] || ['Major City'];
  const baseJobs = baseIndustryJobs[industry] || 30000;
  const baseGrowth = baseGrowthRates[industry] || 20;

  // Calculate state-adjusted values
  const totalJobs = Math.round(baseJobs * multiplier.jobs);
  const technicians = Math.round(totalJobs * 0.35);
  const engineers = Math.round(totalJobs * 0.25);

  // Generate salaries based on template and state multiplier
  const pathways = template.basePathways.map(pathway => ({
    level: pathway.level,
    roles: pathway.roles.map(role => ({
      title: role.title,
      salary: `$${Math.round(role.salaryRange[0] * multiplier.salary)}K-$${Math.round(role.salaryRange[1] * multiplier.salary)}K`,
      requirement: role.requirement
    }))
  }));

  // Engineer salary from last pathway
  const engineerRole = pathways[pathways.length - 1]?.roles[0];
  const engineerSalary = engineerRole?.salary.split('-')[0] || '$100K';

  // Technician salary from second pathway
  const techRole = pathways[1]?.roles[0];
  const techSalary = techRole?.salary.split('-')[0] || '$60K';

  // Operator salary from first pathway
  const opRole = pathways[0]?.roles[0];
  const opSalary = opRole?.salary.split('-')[0] || '$45K';

  // Growth rate with some state variation
  const growthVariation = (Math.random() * 20 - 10); // ±10%
  const growth = `+${Math.round(baseGrowth + growthVariation)}%`;

  return {
    growth,
    totalJobs,
    technicians,
    engineers,
    hubs,
    salaries: { engineer: engineerSalary, technician: techSalary, operator: opSalary },
    skills: template.skills,
    employers: generateEmployers(state, industry),
    training: generateTraining(state, industry),
    pathways
  };
};

// Generate employers for a state/industry
const generateEmployers = (state: string, industry: string): { name: string; positions: number; growth: string }[] => {
  const employersByIndustry: Record<string, string[]> = {
    'Nuclear Energy': ['National Lab', 'Nuclear Power Plant', 'Energy Company'],
    'Semiconductor': ['Intel', 'Micron', 'TSMC', 'Samsung', 'Applied Materials'],
    'Healthcare': ['Regional Hospital System', 'Medical Research Center', 'Health Tech Company'],
    'AI & Machine Learning': ['Tech Giant', 'AI Startup', 'Research Lab'],
    'Quantum Technologies': ['IBM Quantum', 'Google Quantum', 'IonQ', 'Rigetti'],
    'Aerospace & Defense': ['Lockheed Martin', 'Boeing', 'Raytheon', 'Northrop Grumman'],
    'Clean Energy': ['Solar Company', 'Wind Energy Corp', 'Utility Provider'],
    'Cybersecurity': ['Security Firm', 'Tech Company Security', 'Government Contractor'],
    'Biotechnology': ['Biotech Company', 'Pharmaceutical Corp', 'Research Institute'],
    'Robotics & Automation': ['Automation Corp', 'Robotics Startup', 'Manufacturing Co'],
    'Advanced Manufacturing': ['Manufacturing Plant', 'Industrial Corp', 'Auto Supplier'],
  };

  const baseEmployers = employersByIndustry[industry] || ['Major Employer'];
  return baseEmployers.slice(0, 3).map((name, idx) => ({
    name: `${name} ${state}`,
    positions: Math.round((2000 + idx * 1000) * Math.random() + 500),
    growth: `+${Math.round(5 + Math.random() * 20)}%`
  }));
};

// Generate training programs for a state/industry
const generateTraining = (_state: string, industry: string): { name: string; type: string; duration: string; cost: string; placement: number }[] => {
  return [
    {
      name: `State University ${industry.split(' ')[0]} Program`,
      type: 'University',
      duration: '4 years',
      cost: '$35,000',
      placement: 90 + Math.round(Math.random() * 8)
    },
    {
      name: `Community College ${industry.split(' ')[0]} Tech`,
      type: 'Community College',
      duration: '2 years',
      cost: '$8,000',
      placement: 85 + Math.round(Math.random() * 10)
    }
  ];
};

// Generate all industry data for a state
const generateStateIndustries = (state: string): Record<string, IndustryData> => {
  const industries: Record<string, IndustryData> = {};
  ALL_INDUSTRIES.forEach(industry => {
    industries[industry] = generateIndustryData(state, industry);
  });
  return industries;
};

// State names lookup - All 50 US States
const stateNames: Record<string, string> = {
  // West Coast
  WA: 'Washington', OR: 'Oregon', CA: 'California',
  // Mountain West
  NV: 'Nevada', ID: 'Idaho', MT: 'Montana', WY: 'Wyoming', UT: 'Utah',
  AZ: 'Arizona', CO: 'Colorado', NM: 'New Mexico',
  // Midwest - North
  ND: 'North Dakota', SD: 'South Dakota', NE: 'Nebraska', KS: 'Kansas',
  MN: 'Minnesota', IA: 'Iowa', MO: 'Missouri', WI: 'Wisconsin',
  IL: 'Illinois', MI: 'Michigan', IN: 'Indiana', OH: 'Ohio',
  // South Central
  OK: 'Oklahoma', TX: 'Texas', AR: 'Arkansas', LA: 'Louisiana',
  // Southeast
  KY: 'Kentucky', TN: 'Tennessee', MS: 'Mississippi', AL: 'Alabama',
  WV: 'West Virginia', VA: 'Virginia', NC: 'North Carolina', SC: 'South Carolina',
  GA: 'Georgia', FL: 'Florida',
  // Northeast
  PA: 'Pennsylvania', NY: 'New York', NJ: 'New Jersey', MD: 'Maryland',
  DE: 'Delaware', CT: 'Connecticut', RI: 'Rhode Island', MA: 'Massachusetts',
  VT: 'Vermont', NH: 'New Hampshire', ME: 'Maine',
  // Non-contiguous
  AK: 'Alaska', HI: 'Hawaii'
};

// Generate state details dynamically
const stateDetails: Record<string, StateData> = Object.fromEntries(
  Object.entries(stateNames).map(([abbr, name]) => [
    abbr,
    { name, industries: generateStateIndustries(abbr) }
  ])
);

// Top states for different industries
const topNuclearStates = [
  { abbr: 'NM', name: 'New Mexico', jobs: 10500 },
  { abbr: 'TN', name: 'Tennessee', jobs: 8400 },
  { abbr: 'ID', name: 'Idaho', jobs: 5800 },
  { abbr: 'OH', name: 'Ohio', jobs: 3800 },
];

const topHealthcareStates = [
  { abbr: 'MA', name: 'Massachusetts', jobs: 128000 },
  { abbr: 'MN', name: 'Minnesota', jobs: 95000 },
  { abbr: 'PA', name: 'Pennsylvania', jobs: 112000 },
  { abbr: 'NC', name: 'North Carolina', jobs: 87000 },
  { abbr: 'FL', name: 'Florida', jobs: 156000 },
];

// All states with data are clickable (all 50 states)
const highConcentrationStates = Object.keys(stateNames);

const WorkforceMapPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const selectedStateData = selectedState ? stateDetails[selectedState] : null;

  // Get list of available industries for the selected state
  const availableIndustries = selectedStateData ? Object.keys(selectedStateData.industries) : [];

  // Auto-select first industry when state changes
  useEffect(() => {
    if (selectedStateData && availableIndustries.length > 0) {
      if (!selectedIndustry || !availableIndustries.includes(selectedIndustry)) {
        setSelectedIndustry(availableIndustries[0]);
      }
    } else {
      setSelectedIndustry(null);
    }
  }, [selectedState, selectedStateData]);

  // Handle closing the panel
  const handleClosePanel = () => {
    setSelectedState(null);
    setSelectedIndustry(null);
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
        {/* Interactive Map Section - Full Width */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📍 Job Concentration by State
            </h2>
            {selectedState && (
              <span className="text-sm text-gray-400">
                Click on a state to view detailed workforce data
              </span>
            )}
          </div>

          {/* US Map with rectangular buttons */}
          <div className="relative bg-gray-900 rounded-xl p-4 mb-6 overflow-hidden" style={{ aspectRatio: '2' }}>
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
                <span className="text-gray-300">Click to view details</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-3 rounded bg-gray-600"></div>
                <span className="text-gray-300">No data available</span>
              </div>
            </div>

            {/* Selected state indicator */}
            {selectedState && selectedStateData && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                <span>Viewing: {selectedStateData.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClosePanel();
                  }}
                  className="hover:bg-yellow-600 rounded p-0.5"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Quick Access State Buttons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                ⚛️ Top Nuclear States
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
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                🏥 Top Healthcare States
              </h3>
              <div className="flex flex-wrap gap-2">
                {topHealthcareStates.map(state => (
                  <button
                    key={state.abbr}
                    onClick={() => setSelectedState(state.abbr)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedState === state.abbr
                        ? 'bg-teal-500 text-gray-900 border-teal-500'
                        : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {state.name} <span className="opacity-70 ml-1">{state.jobs.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">1.2M+</div>
            <div className="text-sm text-gray-400 mt-1">Total STEM Jobs</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-green-400">50</div>
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

      {/* Slide-Out State Detail Panel */}
      {selectedState && selectedStateData && selectedIndustry && (
        <StateDetailPanel
          stateCode={selectedState}
          stateData={selectedStateData}
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
          onClose={handleClosePanel}
          industryDefinitions={industryDefinitions}
        />
      )}
    </div>
  );
};

export default WorkforceMapPage;
