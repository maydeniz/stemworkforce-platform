// ===========================================
// Workforce Map Static Data
// Extracted from WorkforceMapPage for use as fallback data
// when live data from BLS/USAJobs/Partners is unavailable
// ===========================================

// Industry definitions with icons and colors - All 11 industries
export const industryDefinitions: Record<string, { name: string; icon: string; color: string; bgColor: string }> = {
  'Nuclear Technologies': { name: 'Nuclear', icon: '⚛️', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
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
export const ALL_INDUSTRIES = [
  'Nuclear Technologies',
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

// Industry data type for a single industry within a state
export interface IndustryData {
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
export interface StateData {
  name: string;
  industries: Record<string, IndustryData>;
}

// Base industry templates - used to generate state-specific data
const industryTemplates: Record<string, {
  skills: string[];
  basePathways: {
    level: string;
    roles: { title: string; salaryRange: [number, number]; requirement: string }[];
  }[];
}> = {
  'Nuclear Technologies': {
    skills: ['Nuclear Physics', 'Radiation Safety', 'Reactor Operations', 'NRC Regulations', 'Health Physics', 'Dosimetry'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Nuclear Technician', salaryRange: [55, 75], requirement: 'Associate degree + NRC certification' },
          { title: 'Radiation Protection Tech', salaryRange: [50, 70], requirement: 'Associate degree + NRRPT' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Reactor Operator', salaryRange: [80, 110], requirement: '4+ years experience + NRC license' },
          { title: 'Health Physicist', salaryRange: [75, 100], requirement: 'BS Physics/Engineering' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Nuclear Engineer', salaryRange: [110, 150], requirement: 'MS Nuclear Engineering' },
          { title: 'Senior Reactor Engineer', salaryRange: [120, 160], requirement: '10+ years + PE license' },
        ]
      },
    ]
  },
  'Semiconductor': {
    skills: ['VLSI Design', 'Fabrication', 'Lithography', 'Clean Room Operations', 'EDA Tools', 'Process Engineering'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Fab Technician', salaryRange: [45, 65], requirement: 'Associate degree or bootcamp' },
          { title: 'Test Engineer', salaryRange: [55, 75], requirement: 'BS Electrical Engineering' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Process Engineer', salaryRange: [80, 110], requirement: 'BS/MS + 3 years' },
          { title: 'Design Engineer', salaryRange: [90, 120], requirement: 'MS EE + VLSI experience' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Senior IC Designer', salaryRange: [130, 170], requirement: 'MS/PhD + 8 years' },
          { title: 'Fab Manager', salaryRange: [140, 180], requirement: '10+ years manufacturing' },
        ]
      },
    ]
  },
  'Healthcare': {
    skills: ['Clinical Research', 'Health Informatics', 'Biostatistics', 'EHR Systems', 'Telemedicine', 'Medical Devices'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Health IT Specialist', salaryRange: [45, 60], requirement: 'BS Health Informatics' },
          { title: 'Clinical Data Analyst', salaryRange: [50, 65], requirement: 'BS + data skills' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Biomedical Engineer', salaryRange: [75, 100], requirement: 'BS/MS Biomedical Eng' },
          { title: 'Health Data Scientist', salaryRange: [85, 115], requirement: 'MS + 3 years' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Director of Health IT', salaryRange: [120, 160], requirement: 'MS + 10 years' },
          { title: 'Chief Medical Informatics', salaryRange: [150, 200], requirement: 'MD/PhD + informatics' },
        ]
      },
    ]
  },
  'AI & Machine Learning': {
    skills: ['Python', 'TensorFlow/PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'Statistics'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'ML Engineer I', salaryRange: [75, 100], requirement: 'BS CS/Math + projects' },
          { title: 'Data Analyst', salaryRange: [60, 80], requirement: 'BS + Python/SQL' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Senior ML Engineer', salaryRange: [120, 160], requirement: 'MS + 3 years' },
          { title: 'AI Research Scientist', salaryRange: [130, 175], requirement: 'PhD or equivalent' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Principal AI Scientist', salaryRange: [180, 250], requirement: 'PhD + 8 years' },
          { title: 'VP of AI/ML', salaryRange: [200, 300], requirement: '15+ years leadership' },
        ]
      },
    ]
  },
  'Quantum Technologies': {
    skills: ['Quantum Computing', 'Quantum Mechanics', 'Cryogenics', 'Qiskit/Cirq', 'Linear Algebra', 'Error Correction'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Quantum Lab Tech', salaryRange: [55, 75], requirement: 'BS Physics/Engineering' },
          { title: 'Quantum Software Dev', salaryRange: [80, 110], requirement: 'BS CS + quantum courses' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Quantum Engineer', salaryRange: [120, 160], requirement: 'MS/PhD + 2 years' },
          { title: 'Quantum Algorithm Dev', salaryRange: [130, 170], requirement: 'PhD Math/Physics' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Principal Quantum Scientist', salaryRange: [170, 230], requirement: 'PhD + 8 years' },
          { title: 'Quantum Research Lead', salaryRange: [180, 250], requirement: 'PhD + publications' },
        ]
      },
    ]
  },
  'Aerospace & Defense': {
    skills: ['Systems Engineering', 'Avionics', 'Propulsion', 'Flight Dynamics', 'Security Clearance', 'ITAR Compliance'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Aerospace Technician', salaryRange: [50, 70], requirement: 'Associate + A&P license' },
          { title: 'Jr Systems Engineer', salaryRange: [65, 85], requirement: 'BS Aerospace/ME' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Propulsion Engineer', salaryRange: [90, 120], requirement: 'MS + 4 years' },
          { title: 'Avionics Engineer', salaryRange: [95, 125], requirement: 'BS/MS + clearance' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Principal Engineer', salaryRange: [130, 170], requirement: 'MS + 10 years + TS/SCI' },
          { title: 'Program Director', salaryRange: [150, 200], requirement: '15+ years + PMP' },
        ]
      },
    ]
  },
  'Clean Energy': {
    skills: ['Solar PV Design', 'Wind Turbine Systems', 'Energy Storage', 'Grid Integration', 'LEED Certification', 'Sustainability'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Solar Installer', salaryRange: [35, 50], requirement: 'NABCEP certification' },
          { title: 'Energy Auditor', salaryRange: [45, 60], requirement: 'BPI certification' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Renewable Energy Engineer', salaryRange: [75, 100], requirement: 'BS Engineering + PE' },
          { title: 'Grid Integration Specialist', salaryRange: [80, 110], requirement: 'BS EE + 3 years' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Senior Energy Engineer', salaryRange: [110, 145], requirement: 'MS + 8 years' },
          { title: 'Director of Sustainability', salaryRange: [130, 170], requirement: '10+ years + LEED AP' },
        ]
      },
    ]
  },
  'Cybersecurity': {
    skills: ['Penetration Testing', 'SIEM', 'Incident Response', 'Cloud Security', 'Zero Trust', 'Threat Intelligence'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'SOC Analyst', salaryRange: [55, 75], requirement: 'BS + Security+ cert' },
          { title: 'Jr Pen Tester', salaryRange: [60, 80], requirement: 'BS + CEH/OSCP' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Security Engineer', salaryRange: [100, 135], requirement: 'CISSP + 4 years' },
          { title: 'Threat Intelligence Analyst', salaryRange: [90, 120], requirement: 'BS + 3 years + clearance' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'CISO', salaryRange: [160, 220], requirement: 'CISSP + 10 years' },
          { title: 'Principal Security Architect', salaryRange: [150, 200], requirement: 'MS + 8 years' },
        ]
      },
    ]
  },
  'Biotechnology': {
    skills: ['Molecular Biology', 'Bioinformatics', 'CRISPR', 'Genomics', 'GMP/GLP', 'Clinical Trials'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Lab Technician', salaryRange: [40, 55], requirement: 'BS Biology/Biochem' },
          { title: 'Research Associate', salaryRange: [50, 65], requirement: 'BS + lab experience' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Bioprocess Engineer', salaryRange: [80, 110], requirement: 'MS + 3 years' },
          { title: 'Bioinformatics Scientist', salaryRange: [90, 120], requirement: 'MS/PhD + programming' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Director of R&D', salaryRange: [140, 190], requirement: 'PhD + 10 years' },
          { title: 'VP Biotech Operations', salaryRange: [160, 220], requirement: 'PhD + 15 years' },
        ]
      },
    ]
  },
  'Robotics & Automation': {
    skills: ['ROS', 'Computer Vision', 'Control Systems', 'PLC Programming', 'Mechanical Design', 'Sensor Integration'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'Automation Technician', salaryRange: [45, 60], requirement: 'Associate + PLC cert' },
          { title: 'Jr Robotics Engineer', salaryRange: [65, 85], requirement: 'BS ME/EE/CS' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Robotics Engineer', salaryRange: [95, 130], requirement: 'MS + 3 years' },
          { title: 'Controls Engineer', salaryRange: [85, 115], requirement: 'BS + 5 years' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Principal Robotics Engineer', salaryRange: [140, 180], requirement: 'MS/PhD + 8 years' },
          { title: 'Director of Automation', salaryRange: [150, 200], requirement: '10+ years leadership' },
        ]
      },
    ]
  },
  'Advanced Manufacturing': {
    skills: ['CNC Programming', 'Additive Manufacturing', 'Lean/Six Sigma', 'Industrial IoT', 'Quality Control', 'CAD/CAM'],
    basePathways: [
      {
        level: 'Entry Level',
        roles: [
          { title: 'CNC Operator', salaryRange: [35, 50], requirement: 'Technical diploma' },
          { title: 'Quality Inspector', salaryRange: [40, 55], requirement: 'AS + ASQ cert' },
        ]
      },
      {
        level: 'Mid Career',
        roles: [
          { title: 'Manufacturing Engineer', salaryRange: [75, 100], requirement: 'BS ME/IE + 3 years' },
          { title: 'Additive Mfg Specialist', salaryRange: [80, 105], requirement: 'BS + AM experience' },
        ]
      },
      {
        level: 'Senior Level',
        roles: [
          { title: 'Plant Manager', salaryRange: [120, 160], requirement: 'BS + 10 years + Lean Six Sigma' },
          { title: 'VP Manufacturing', salaryRange: [140, 190], requirement: '15+ years + MBA preferred' },
        ]
      },
    ]
  },
};

// State salary/jobs multipliers (relative to national average)
const stateMultipliers: Record<string, { salary: number; jobs: number }> = {
  // West Coast - High salary, high jobs
  WA: { salary: 1.35, jobs: 1.8 }, OR: { salary: 1.15, jobs: 1.0 }, CA: { salary: 1.45, jobs: 2.5 },
  // Mountain West
  NV: { salary: 1.05, jobs: 0.7 }, ID: { salary: 0.95, jobs: 0.8 }, MT: { salary: 0.90, jobs: 0.4 },
  WY: { salary: 0.90, jobs: 0.3 }, UT: { salary: 1.05, jobs: 1.0 }, AZ: { salary: 1.10, jobs: 1.3 },
  CO: { salary: 1.20, jobs: 1.5 }, NM: { salary: 1.00, jobs: 0.9 },
  // Northern Plains
  ND: { salary: 0.85, jobs: 0.3 }, SD: { salary: 0.85, jobs: 0.3 }, NE: { salary: 0.90, jobs: 0.5 },
  KS: { salary: 0.90, jobs: 0.6 },
  // Upper Midwest
  MN: { salary: 1.10, jobs: 1.3 }, IA: { salary: 0.90, jobs: 0.6 }, MO: { salary: 0.95, jobs: 1.0 },
  WI: { salary: 0.95, jobs: 0.9 }, IL: { salary: 1.15, jobs: 1.6 }, MI: { salary: 1.00, jobs: 1.2 },
  IN: { salary: 0.95, jobs: 1.0 }, OH: { salary: 0.95, jobs: 1.3 },
  // South Central
  OK: { salary: 0.85, jobs: 0.6 }, TX: { salary: 1.15, jobs: 2.2 }, AR: { salary: 0.80, jobs: 0.5 },
  LA: { salary: 0.90, jobs: 0.7 },
  // Southeast
  KY: { salary: 0.85, jobs: 0.6 }, TN: { salary: 0.95, jobs: 1.0 }, MS: { salary: 0.80, jobs: 0.4 },
  AL: { salary: 0.85, jobs: 0.7 }, WV: { salary: 0.80, jobs: 0.3 }, VA: { salary: 1.20, jobs: 1.8 },
  NC: { salary: 1.05, jobs: 1.4 }, SC: { salary: 0.90, jobs: 0.8 }, GA: { salary: 1.05, jobs: 1.4 },
  FL: { salary: 1.05, jobs: 1.8 },
  // Northeast
  PA: { salary: 1.05, jobs: 1.4 }, NY: { salary: 1.35, jobs: 2.0 }, NJ: { salary: 1.25, jobs: 1.3 },
  MD: { salary: 1.25, jobs: 1.5 }, DE: { salary: 1.10, jobs: 0.5 }, CT: { salary: 1.20, jobs: 0.8 },
  RI: { salary: 1.05, jobs: 0.4 }, MA: { salary: 1.30, jobs: 1.6 }, VT: { salary: 0.95, jobs: 0.3 },
  NH: { salary: 1.05, jobs: 0.5 }, ME: { salary: 0.90, jobs: 0.4 },
  // Non-contiguous
  AK: { salary: 1.15, jobs: 0.3 }, HI: { salary: 1.10, jobs: 0.4 },
};

// State industry hubs - cities per state per industry
const stateIndustryHubs: Record<string, Record<string, string[]>> = {
  // West Coast
  WA: {
    'Nuclear Technologies': ['Richland', 'Hanford'],
    'Semiconductor': ['Seattle', 'Redmond', 'Bothell'],
    'Healthcare': ['Seattle', 'Tacoma', 'Spokane'],
    'AI & Machine Learning': ['Seattle', 'Redmond', 'Bellevue'],
    'Quantum Technologies': ['Seattle', 'Redmond'],
    'Aerospace & Defense': ['Seattle', 'Everett', 'Kent'],
    'Clean Energy': ['Seattle', 'Olympia', 'Tacoma'],
    'Cybersecurity': ['Seattle', 'Redmond', 'Tacoma'],
    'Biotechnology': ['Seattle', 'Bothell', 'Spokane'],
    'Robotics & Automation': ['Seattle', 'Redmond'],
    'Advanced Manufacturing': ['Seattle', 'Everett', 'Tacoma'],
  },
  OR: {
    'Nuclear Technologies': ['Corvallis'],
    'Semiconductor': ['Portland', 'Hillsboro', 'Beaverton'],
    'Healthcare': ['Portland', 'Eugene', 'Salem'],
    'AI & Machine Learning': ['Portland', 'Hillsboro'],
    'Quantum Technologies': ['Portland', 'Corvallis'],
    'Aerospace & Defense': ['Portland'],
    'Clean Energy': ['Portland', 'Bend', 'Eugene'],
    'Cybersecurity': ['Portland', 'Hillsboro'],
    'Biotechnology': ['Portland', 'Corvallis'],
    'Robotics & Automation': ['Portland', 'Hillsboro'],
    'Advanced Manufacturing': ['Portland', 'Eugene', 'Hillsboro'],
  },
  CA: {
    'Nuclear Technologies': ['San Diego', 'Livermore'],
    'Semiconductor': ['San Jose', 'Santa Clara', 'Milpitas', 'Irvine'],
    'Healthcare': ['San Francisco', 'Los Angeles', 'San Diego', 'Sacramento'],
    'AI & Machine Learning': ['San Francisco', 'Palo Alto', 'Mountain View', 'Los Angeles'],
    'Quantum Technologies': ['San Francisco', 'Pasadena', 'Berkeley'],
    'Aerospace & Defense': ['Los Angeles', 'San Diego', 'Palmdale', 'El Segundo'],
    'Clean Energy': ['San Francisco', 'Sacramento', 'Los Angeles', 'San Diego'],
    'Cybersecurity': ['San Francisco', 'San Jose', 'Los Angeles'],
    'Biotechnology': ['San Francisco', 'San Diego', 'South San Francisco'],
    'Robotics & Automation': ['San Francisco', 'San Jose', 'Los Angeles'],
    'Advanced Manufacturing': ['Los Angeles', 'San Jose', 'Fremont'],
  },
  // Mountain West
  NV: {
    'Nuclear Technologies': ['Las Vegas', 'Reno'],
    'Semiconductor': ['Las Vegas', 'Reno'],
    'Healthcare': ['Las Vegas', 'Reno', 'Henderson'],
    'AI & Machine Learning': ['Las Vegas', 'Reno'],
    'Quantum Technologies': ['Las Vegas'],
    'Aerospace & Defense': ['Las Vegas', 'Nellis AFB'],
    'Clean Energy': ['Las Vegas', 'Reno', 'Boulder City'],
    'Cybersecurity': ['Las Vegas', 'Reno'],
    'Biotechnology': ['Reno', 'Las Vegas'],
    'Robotics & Automation': ['Las Vegas', 'Reno'],
    'Advanced Manufacturing': ['Las Vegas', 'Reno', 'Sparks'],
  },
  ID: {
    'Nuclear Technologies': ['Idaho Falls', 'Boise'],
    'Semiconductor': ['Boise', 'Nampa'],
    'Healthcare': ['Boise', 'Idaho Falls', 'Nampa'],
    'AI & Machine Learning': ['Boise'],
    'Quantum Technologies': ['Idaho Falls'],
    'Aerospace & Defense': ['Boise', 'Mountain Home AFB'],
    'Clean Energy': ['Boise', 'Idaho Falls'],
    'Cybersecurity': ['Boise', 'Idaho Falls'],
    'Biotechnology': ['Boise', 'Moscow'],
    'Robotics & Automation': ['Boise'],
    'Advanced Manufacturing': ['Boise', 'Nampa', 'Idaho Falls'],
  },
  MT: {
    'Nuclear Technologies': ['Great Falls'],
    'Semiconductor': ['Bozeman'],
    'Healthcare': ['Billings', 'Missoula', 'Great Falls'],
    'AI & Machine Learning': ['Bozeman', 'Missoula'],
    'Quantum Technologies': ['Bozeman'],
    'Aerospace & Defense': ['Great Falls', 'Malmstrom AFB'],
    'Clean Energy': ['Great Falls', 'Billings'],
    'Cybersecurity': ['Bozeman'],
    'Biotechnology': ['Bozeman', 'Missoula'],
    'Robotics & Automation': ['Bozeman'],
    'Advanced Manufacturing': ['Billings', 'Great Falls'],
  },
  WY: {
    'Nuclear Technologies': ['Cheyenne'],
    'Semiconductor': ['Cheyenne'],
    'Healthcare': ['Cheyenne', 'Casper'],
    'AI & Machine Learning': ['Cheyenne', 'Laramie'],
    'Quantum Technologies': ['Laramie'],
    'Aerospace & Defense': ['Cheyenne', 'F.E. Warren AFB'],
    'Clean Energy': ['Casper', 'Cheyenne'],
    'Cybersecurity': ['Cheyenne'],
    'Biotechnology': ['Laramie'],
    'Robotics & Automation': ['Cheyenne'],
    'Advanced Manufacturing': ['Cheyenne', 'Casper'],
  },
  UT: {
    'Nuclear Technologies': ['Salt Lake City'],
    'Semiconductor': ['Salt Lake City', 'Lehi', 'Draper'],
    'Healthcare': ['Salt Lake City', 'Provo', 'Ogden'],
    'AI & Machine Learning': ['Salt Lake City', 'Lehi', 'Provo'],
    'Quantum Technologies': ['Salt Lake City', 'Provo'],
    'Aerospace & Defense': ['Salt Lake City', 'Ogden', 'Hill AFB'],
    'Clean Energy': ['Salt Lake City', 'Provo'],
    'Cybersecurity': ['Salt Lake City', 'Lehi'],
    'Biotechnology': ['Salt Lake City', 'Logan'],
    'Robotics & Automation': ['Salt Lake City', 'Provo'],
    'Advanced Manufacturing': ['Salt Lake City', 'Ogden', 'Provo'],
  },
  AZ: {
    'Nuclear Technologies': ['Phoenix', 'Palo Verde'],
    'Semiconductor': ['Phoenix', 'Chandler', 'Tempe'],
    'Healthcare': ['Phoenix', 'Tucson', 'Scottsdale'],
    'AI & Machine Learning': ['Phoenix', 'Tempe', 'Scottsdale'],
    'Quantum Technologies': ['Tempe', 'Tucson'],
    'Aerospace & Defense': ['Phoenix', 'Tucson', 'Mesa', 'Luke AFB'],
    'Clean Energy': ['Phoenix', 'Tucson', 'Flagstaff'],
    'Cybersecurity': ['Phoenix', 'Scottsdale', 'Tempe'],
    'Biotechnology': ['Phoenix', 'Tucson', 'Tempe'],
    'Robotics & Automation': ['Phoenix', 'Tempe'],
    'Advanced Manufacturing': ['Phoenix', 'Chandler', 'Mesa'],
  },
  CO: {
    'Nuclear Technologies': ['Denver', 'Golden'],
    'Semiconductor': ['Denver', 'Colorado Springs', 'Fort Collins'],
    'Healthcare': ['Denver', 'Aurora', 'Colorado Springs'],
    'AI & Machine Learning': ['Denver', 'Boulder', 'Fort Collins'],
    'Quantum Technologies': ['Boulder', 'Denver'],
    'Aerospace & Defense': ['Colorado Springs', 'Denver', 'Aurora', 'Buckley SFB'],
    'Clean Energy': ['Denver', 'Golden', 'Boulder'],
    'Cybersecurity': ['Colorado Springs', 'Denver', 'Aurora'],
    'Biotechnology': ['Denver', 'Boulder', 'Fort Collins'],
    'Robotics & Automation': ['Denver', 'Boulder'],
    'Advanced Manufacturing': ['Denver', 'Colorado Springs', 'Fort Collins'],
  },
  NM: {
    'Nuclear Technologies': ['Albuquerque', 'Los Alamos', 'Santa Fe'],
    'Semiconductor': ['Albuquerque', 'Rio Rancho'],
    'Healthcare': ['Albuquerque', 'Santa Fe', 'Las Cruces'],
    'AI & Machine Learning': ['Albuquerque', 'Santa Fe'],
    'Quantum Technologies': ['Albuquerque', 'Los Alamos', 'Sandia'],
    'Aerospace & Defense': ['Albuquerque', 'White Sands', 'Kirtland AFB'],
    'Clean Energy': ['Albuquerque', 'Santa Fe', 'Las Cruces'],
    'Cybersecurity': ['Albuquerque', 'Sandia', 'Los Alamos'],
    'Biotechnology': ['Albuquerque', 'Santa Fe'],
    'Robotics & Automation': ['Albuquerque'],
    'Advanced Manufacturing': ['Albuquerque', 'Rio Rancho', 'Las Cruces'],
  },
  // Northern Plains
  ND: {
    'Nuclear Technologies': ['Minot'],
    'Semiconductor': ['Fargo'],
    'Healthcare': ['Fargo', 'Bismarck', 'Grand Forks'],
    'AI & Machine Learning': ['Fargo'],
    'Quantum Technologies': ['Fargo'],
    'Aerospace & Defense': ['Minot AFB', 'Grand Forks AFB'],
    'Clean Energy': ['Fargo', 'Bismarck'],
    'Cybersecurity': ['Fargo'],
    'Biotechnology': ['Fargo', 'Grand Forks'],
    'Robotics & Automation': ['Fargo'],
    'Advanced Manufacturing': ['Fargo', 'Bismarck'],
  },
  SD: {
    'Nuclear Technologies': ['Rapid City'],
    'Semiconductor': ['Sioux Falls'],
    'Healthcare': ['Sioux Falls', 'Rapid City'],
    'AI & Machine Learning': ['Sioux Falls'],
    'Quantum Technologies': ['Rapid City'],
    'Aerospace & Defense': ['Ellsworth AFB', 'Sioux Falls'],
    'Clean Energy': ['Sioux Falls', 'Rapid City'],
    'Cybersecurity': ['Sioux Falls'],
    'Biotechnology': ['Sioux Falls'],
    'Robotics & Automation': ['Sioux Falls'],
    'Advanced Manufacturing': ['Sioux Falls', 'Rapid City'],
  },
  NE: {
    'Nuclear Technologies': ['Omaha', 'Lincoln'],
    'Semiconductor': ['Omaha', 'Lincoln'],
    'Healthcare': ['Omaha', 'Lincoln'],
    'AI & Machine Learning': ['Omaha'],
    'Quantum Technologies': ['Lincoln'],
    'Aerospace & Defense': ['Omaha', 'Offutt AFB', 'Bellevue'],
    'Clean Energy': ['Lincoln', 'Omaha'],
    'Cybersecurity': ['Omaha', 'Offutt AFB'],
    'Biotechnology': ['Omaha', 'Lincoln'],
    'Robotics & Automation': ['Omaha'],
    'Advanced Manufacturing': ['Omaha', 'Lincoln'],
  },
  KS: {
    'Nuclear Technologies': ['Topeka'],
    'Semiconductor': ['Kansas City', 'Wichita'],
    'Healthcare': ['Kansas City', 'Wichita', 'Topeka'],
    'AI & Machine Learning': ['Kansas City', 'Wichita'],
    'Quantum Technologies': ['Lawrence'],
    'Aerospace & Defense': ['Wichita', 'Kansas City', 'McConnell AFB'],
    'Clean Energy': ['Topeka', 'Wichita'],
    'Cybersecurity': ['Kansas City', 'Wichita'],
    'Biotechnology': ['Kansas City', 'Lawrence'],
    'Robotics & Automation': ['Wichita', 'Kansas City'],
    'Advanced Manufacturing': ['Wichita', 'Kansas City', 'Topeka'],
  },
  // Upper Midwest
  MN: {
    'Nuclear Technologies': ['Minneapolis'],
    'Semiconductor': ['Minneapolis', 'Bloomington'],
    'Healthcare': ['Minneapolis', 'Rochester', 'St. Paul'],
    'AI & Machine Learning': ['Minneapolis', 'St. Paul'],
    'Quantum Technologies': ['Minneapolis'],
    'Aerospace & Defense': ['Minneapolis', 'Duluth'],
    'Clean Energy': ['Minneapolis', 'St. Paul'],
    'Cybersecurity': ['Minneapolis', 'St. Paul'],
    'Biotechnology': ['Minneapolis', 'Rochester', 'St. Paul'],
    'Robotics & Automation': ['Minneapolis', 'Bloomington'],
    'Advanced Manufacturing': ['Minneapolis', 'St. Paul', 'Duluth'],
  },
  IA: {
    'Nuclear Technologies': ['Ames'],
    'Semiconductor': ['Des Moines', 'Cedar Rapids'],
    'Healthcare': ['Des Moines', 'Iowa City', 'Cedar Rapids'],
    'AI & Machine Learning': ['Des Moines', 'Ames'],
    'Quantum Technologies': ['Ames'],
    'Aerospace & Defense': ['Cedar Rapids', 'Des Moines'],
    'Clean Energy': ['Des Moines', 'Ames'],
    'Cybersecurity': ['Des Moines', 'Cedar Rapids'],
    'Biotechnology': ['Iowa City', 'Ames'],
    'Robotics & Automation': ['Cedar Rapids', 'Des Moines'],
    'Advanced Manufacturing': ['Cedar Rapids', 'Des Moines', 'Davenport'],
  },
  MO: {
    'Nuclear Technologies': ['St. Louis', 'Columbia'],
    'Semiconductor': ['St. Louis', 'Kansas City'],
    'Healthcare': ['St. Louis', 'Kansas City', 'Columbia'],
    'AI & Machine Learning': ['St. Louis', 'Kansas City'],
    'Quantum Technologies': ['St. Louis'],
    'Aerospace & Defense': ['St. Louis', 'Kansas City', 'Whiteman AFB'],
    'Clean Energy': ['St. Louis', 'Kansas City'],
    'Cybersecurity': ['St. Louis', 'Kansas City'],
    'Biotechnology': ['St. Louis', 'Kansas City'],
    'Robotics & Automation': ['St. Louis', 'Kansas City'],
    'Advanced Manufacturing': ['St. Louis', 'Kansas City', 'Springfield'],
  },
  WI: {
    'Nuclear Technologies': ['Madison'],
    'Semiconductor': ['Milwaukee', 'Madison'],
    'Healthcare': ['Milwaukee', 'Madison', 'Green Bay'],
    'AI & Machine Learning': ['Madison', 'Milwaukee'],
    'Quantum Technologies': ['Madison'],
    'Aerospace & Defense': ['Milwaukee', 'Oshkosh'],
    'Clean Energy': ['Madison', 'Milwaukee'],
    'Cybersecurity': ['Madison', 'Milwaukee'],
    'Biotechnology': ['Madison', 'Milwaukee'],
    'Robotics & Automation': ['Milwaukee', 'Madison'],
    'Advanced Manufacturing': ['Milwaukee', 'Madison', 'Oshkosh'],
  },
  IL: {
    'Nuclear Technologies': ['Chicago', 'Argonne'],
    'Semiconductor': ['Chicago', 'Naperville', 'Schaumburg'],
    'Healthcare': ['Chicago', 'Champaign', 'Springfield'],
    'AI & Machine Learning': ['Chicago', 'Champaign', 'Evanston'],
    'Quantum Technologies': ['Chicago', 'Argonne'],
    'Aerospace & Defense': ['Chicago', 'Scott AFB', 'Rockford'],
    'Clean Energy': ['Chicago', 'Springfield'],
    'Cybersecurity': ['Chicago', 'Schaumburg'],
    'Biotechnology': ['Chicago', 'Evanston', 'Champaign'],
    'Robotics & Automation': ['Chicago', 'Naperville'],
    'Advanced Manufacturing': ['Chicago', 'Rockford', 'Peoria'],
  },
  MI: {
    'Nuclear Technologies': ['Detroit', 'Ann Arbor'],
    'Semiconductor': ['Detroit', 'Ann Arbor'],
    'Healthcare': ['Detroit', 'Ann Arbor', 'Grand Rapids'],
    'AI & Machine Learning': ['Detroit', 'Ann Arbor'],
    'Quantum Technologies': ['Ann Arbor'],
    'Aerospace & Defense': ['Detroit', 'Troy'],
    'Clean Energy': ['Detroit', 'Lansing'],
    'Cybersecurity': ['Detroit', 'Ann Arbor'],
    'Biotechnology': ['Ann Arbor', 'Detroit', 'Grand Rapids'],
    'Robotics & Automation': ['Detroit', 'Ann Arbor', 'Troy'],
    'Advanced Manufacturing': ['Detroit', 'Grand Rapids', 'Flint'],
  },
  IN: {
    'Nuclear Technologies': ['West Lafayette'],
    'Semiconductor': ['Indianapolis', 'West Lafayette'],
    'Healthcare': ['Indianapolis', 'Fort Wayne', 'Bloomington'],
    'AI & Machine Learning': ['Indianapolis', 'West Lafayette'],
    'Quantum Technologies': ['West Lafayette'],
    'Aerospace & Defense': ['Indianapolis', 'Crane NSWC'],
    'Clean Energy': ['Indianapolis', 'Bloomington'],
    'Cybersecurity': ['Indianapolis', 'West Lafayette'],
    'Biotechnology': ['Indianapolis', 'West Lafayette'],
    'Robotics & Automation': ['Indianapolis', 'West Lafayette'],
    'Advanced Manufacturing': ['Indianapolis', 'Fort Wayne', 'Elkhart'],
  },
  OH: {
    'Nuclear Technologies': ['Columbus', 'Cleveland', 'Piketon'],
    'Semiconductor': ['Columbus', 'Cleveland'],
    'Healthcare': ['Cleveland', 'Columbus', 'Cincinnati'],
    'AI & Machine Learning': ['Columbus', 'Cleveland', 'Cincinnati'],
    'Quantum Technologies': ['Columbus'],
    'Aerospace & Defense': ['Dayton', 'Wright-Patterson AFB', 'Cleveland'],
    'Clean Energy': ['Columbus', 'Cleveland'],
    'Cybersecurity': ['Columbus', 'Dayton', 'Cincinnati'],
    'Biotechnology': ['Cleveland', 'Columbus', 'Cincinnati'],
    'Robotics & Automation': ['Columbus', 'Cleveland'],
    'Advanced Manufacturing': ['Cleveland', 'Columbus', 'Cincinnati', 'Akron'],
  },
  // South Central
  OK: {
    'Nuclear Technologies': ['Oklahoma City'],
    'Semiconductor': ['Oklahoma City', 'Tulsa'],
    'Healthcare': ['Oklahoma City', 'Tulsa'],
    'AI & Machine Learning': ['Oklahoma City', 'Tulsa'],
    'Quantum Technologies': ['Norman'],
    'Aerospace & Defense': ['Oklahoma City', 'Tinker AFB', 'Tulsa'],
    'Clean Energy': ['Oklahoma City', 'Tulsa'],
    'Cybersecurity': ['Oklahoma City', 'Tulsa'],
    'Biotechnology': ['Oklahoma City'],
    'Robotics & Automation': ['Oklahoma City'],
    'Advanced Manufacturing': ['Oklahoma City', 'Tulsa'],
  },
  TX: {
    'Nuclear Technologies': ['Houston', 'Austin'],
    'Semiconductor': ['Austin', 'Dallas', 'San Antonio', 'Houston'],
    'Healthcare': ['Houston', 'Dallas', 'San Antonio', 'Austin'],
    'AI & Machine Learning': ['Austin', 'Dallas', 'Houston'],
    'Quantum Technologies': ['Austin', 'College Station'],
    'Aerospace & Defense': ['Houston', 'Fort Worth', 'San Antonio', 'Dallas'],
    'Clean Energy': ['Austin', 'Houston', 'Dallas'],
    'Cybersecurity': ['Austin', 'San Antonio', 'Dallas', 'Houston'],
    'Biotechnology': ['Houston', 'Dallas', 'Austin'],
    'Robotics & Automation': ['Austin', 'Houston', 'Dallas'],
    'Advanced Manufacturing': ['Houston', 'Dallas', 'San Antonio', 'El Paso'],
  },
  AR: {
    'Nuclear Technologies': ['Russellville'],
    'Semiconductor': ['Little Rock'],
    'Healthcare': ['Little Rock', 'Fayetteville'],
    'AI & Machine Learning': ['Little Rock', 'Fayetteville'],
    'Quantum Technologies': ['Fayetteville'],
    'Aerospace & Defense': ['Little Rock AFB', 'Jacksonville'],
    'Clean Energy': ['Little Rock', 'Fayetteville'],
    'Cybersecurity': ['Little Rock'],
    'Biotechnology': ['Little Rock', 'Fayetteville'],
    'Robotics & Automation': ['Little Rock'],
    'Advanced Manufacturing': ['Little Rock', 'Fort Smith'],
  },
  LA: {
    'Nuclear Technologies': ['Baton Rouge'],
    'Semiconductor': ['Baton Rouge', 'New Orleans'],
    'Healthcare': ['New Orleans', 'Baton Rouge', 'Shreveport'],
    'AI & Machine Learning': ['New Orleans', 'Baton Rouge'],
    'Quantum Technologies': ['Baton Rouge'],
    'Aerospace & Defense': ['New Orleans', 'Barksdale AFB', 'Shreveport'],
    'Clean Energy': ['New Orleans', 'Baton Rouge'],
    'Cybersecurity': ['New Orleans', 'Baton Rouge'],
    'Biotechnology': ['New Orleans', 'Baton Rouge'],
    'Robotics & Automation': ['New Orleans'],
    'Advanced Manufacturing': ['Baton Rouge', 'New Orleans', 'Lake Charles'],
  },
  // Southeast
  KY: {
    'Nuclear Technologies': ['Paducah'],
    'Semiconductor': ['Louisville', 'Lexington'],
    'Healthcare': ['Louisville', 'Lexington'],
    'AI & Machine Learning': ['Louisville', 'Lexington'],
    'Quantum Technologies': ['Lexington'],
    'Aerospace & Defense': ['Louisville', 'Fort Campbell'],
    'Clean Energy': ['Louisville', 'Lexington'],
    'Cybersecurity': ['Louisville', 'Lexington'],
    'Biotechnology': ['Lexington', 'Louisville'],
    'Robotics & Automation': ['Louisville'],
    'Advanced Manufacturing': ['Louisville', 'Lexington', 'Bowling Green'],
  },
  TN: {
    'Nuclear Technologies': ['Oak Ridge', 'Knoxville', 'Chattanooga'],
    'Semiconductor': ['Nashville', 'Knoxville'],
    'Healthcare': ['Nashville', 'Memphis', 'Knoxville'],
    'AI & Machine Learning': ['Nashville', 'Knoxville'],
    'Quantum Technologies': ['Oak Ridge', 'Knoxville'],
    'Aerospace & Defense': ['Tullahoma', 'Nashville', 'Arnold AFB'],
    'Clean Energy': ['Nashville', 'Knoxville', 'Chattanooga'],
    'Cybersecurity': ['Nashville', 'Oak Ridge'],
    'Biotechnology': ['Nashville', 'Memphis'],
    'Robotics & Automation': ['Nashville', 'Knoxville'],
    'Advanced Manufacturing': ['Nashville', 'Chattanooga', 'Memphis'],
  },
  MS: {
    'Nuclear Technologies': ['Vicksburg'],
    'Semiconductor': ['Jackson'],
    'Healthcare': ['Jackson', 'Biloxi', 'Hattiesburg'],
    'AI & Machine Learning': ['Jackson', 'Starkville'],
    'Quantum Technologies': ['Starkville'],
    'Aerospace & Defense': ['Stennis Space Center', 'Columbus AFB', 'Keesler AFB'],
    'Clean Energy': ['Jackson'],
    'Cybersecurity': ['Jackson'],
    'Biotechnology': ['Jackson', 'Starkville'],
    'Robotics & Automation': ['Jackson'],
    'Advanced Manufacturing': ['Jackson', 'Tupelo'],
  },
  AL: {
    'Nuclear Technologies': ['Huntsville', 'Scottsboro'],
    'Semiconductor': ['Huntsville'],
    'Healthcare': ['Birmingham', 'Huntsville', 'Mobile'],
    'AI & Machine Learning': ['Huntsville', 'Birmingham'],
    'Quantum Technologies': ['Huntsville'],
    'Aerospace & Defense': ['Huntsville', 'Redstone Arsenal', 'Maxwell AFB'],
    'Clean Energy': ['Birmingham', 'Huntsville'],
    'Cybersecurity': ['Huntsville', 'Birmingham'],
    'Biotechnology': ['Birmingham', 'Huntsville'],
    'Robotics & Automation': ['Huntsville', 'Birmingham'],
    'Advanced Manufacturing': ['Huntsville', 'Birmingham', 'Mobile'],
  },
  WV: {
    'Nuclear Technologies': ['Morgantown'],
    'Semiconductor': ['Morgantown'],
    'Healthcare': ['Morgantown', 'Charleston', 'Huntington'],
    'AI & Machine Learning': ['Morgantown'],
    'Quantum Technologies': ['Morgantown'],
    'Aerospace & Defense': ['Charleston'],
    'Clean Energy': ['Morgantown', 'Charleston'],
    'Cybersecurity': ['Morgantown', 'Charleston'],
    'Biotechnology': ['Morgantown'],
    'Robotics & Automation': ['Morgantown'],
    'Advanced Manufacturing': ['Charleston', 'Morgantown'],
  },
  VA: {
    'Nuclear Technologies': ['Arlington', 'Newport News'],
    'Semiconductor': ['Richmond', 'Northern Virginia', 'Manassas'],
    'Healthcare': ['Richmond', 'Charlottesville', 'Norfolk'],
    'AI & Machine Learning': ['Arlington', 'McLean', 'Tysons'],
    'Quantum Technologies': ['Arlington', 'Charlottesville'],
    'Aerospace & Defense': ['Arlington', 'Norfolk', 'Hampton', 'Langley AFB'],
    'Clean Energy': ['Richmond', 'Charlottesville'],
    'Cybersecurity': ['Arlington', 'McLean', 'Tysons', 'Quantico'],
    'Biotechnology': ['Richmond', 'Charlottesville'],
    'Robotics & Automation': ['Arlington', 'Richmond'],
    'Advanced Manufacturing': ['Richmond', 'Norfolk', 'Roanoke'],
  },
  NC: {
    'Nuclear Technologies': ['Charlotte', 'Raleigh'],
    'Semiconductor': ['Raleigh', 'Durham', 'Charlotte'],
    'Healthcare': ['Raleigh', 'Durham', 'Charlotte', 'Chapel Hill'],
    'AI & Machine Learning': ['Raleigh', 'Durham', 'Charlotte'],
    'Quantum Technologies': ['Durham', 'Chapel Hill'],
    'Aerospace & Defense': ['Charlotte', 'Fayetteville', 'Fort Liberty'],
    'Clean Energy': ['Charlotte', 'Raleigh'],
    'Cybersecurity': ['Raleigh', 'Charlotte', 'Durham'],
    'Biotechnology': ['Raleigh', 'Durham', 'Research Triangle Park'],
    'Robotics & Automation': ['Raleigh', 'Charlotte'],
    'Advanced Manufacturing': ['Charlotte', 'Greensboro', 'Raleigh'],
  },
  SC: {
    'Nuclear Technologies': ['Aiken', 'Savannah River Site'],
    'Semiconductor': ['Charleston', 'Greenville'],
    'Healthcare': ['Charleston', 'Columbia', 'Greenville'],
    'AI & Machine Learning': ['Charleston', 'Columbia'],
    'Quantum Technologies': ['Columbia'],
    'Aerospace & Defense': ['Charleston', 'Shaw AFB'],
    'Clean Energy': ['Charleston', 'Columbia'],
    'Cybersecurity': ['Charleston', 'Columbia'],
    'Biotechnology': ['Charleston', 'Columbia'],
    'Robotics & Automation': ['Greenville', 'Charleston'],
    'Advanced Manufacturing': ['Greenville', 'Spartanburg', 'Charleston'],
  },
  GA: {
    'Nuclear Technologies': ['Augusta'],
    'Semiconductor': ['Atlanta', 'Alpharetta'],
    'Healthcare': ['Atlanta', 'Augusta', 'Savannah'],
    'AI & Machine Learning': ['Atlanta', 'Midtown Atlanta'],
    'Quantum Technologies': ['Atlanta'],
    'Aerospace & Defense': ['Atlanta', 'Warner Robins', 'Robins AFB'],
    'Clean Energy': ['Atlanta', 'Savannah'],
    'Cybersecurity': ['Atlanta', 'Augusta', 'Fort Eisenhower'],
    'Biotechnology': ['Atlanta', 'Athens'],
    'Robotics & Automation': ['Atlanta'],
    'Advanced Manufacturing': ['Atlanta', 'Savannah', 'Augusta'],
  },
  FL: {
    'Nuclear Technologies': ['Cape Canaveral', 'Miami'],
    'Semiconductor': ['Tampa', 'Orlando', 'Miami'],
    'Healthcare': ['Miami', 'Tampa', 'Orlando', 'Jacksonville'],
    'AI & Machine Learning': ['Miami', 'Tampa', 'Orlando'],
    'Quantum Technologies': ['Miami', 'Gainesville'],
    'Aerospace & Defense': ['Cape Canaveral', 'Orlando', 'Melbourne', 'Patrick SFB'],
    'Clean Energy': ['Miami', 'Tampa', 'Jacksonville'],
    'Cybersecurity': ['Tampa', 'Miami', 'Orlando'],
    'Biotechnology': ['Miami', 'Tampa', 'Gainesville'],
    'Robotics & Automation': ['Tampa', 'Orlando'],
    'Advanced Manufacturing': ['Tampa', 'Jacksonville', 'Orlando'],
  },
  // Northeast
  PA: {
    'Nuclear Technologies': ['Pittsburgh', 'State College'],
    'Semiconductor': ['Pittsburgh', 'Philadelphia'],
    'Healthcare': ['Pittsburgh', 'Philadelphia', 'Hershey'],
    'AI & Machine Learning': ['Pittsburgh', 'Philadelphia'],
    'Quantum Technologies': ['Pittsburgh', 'State College'],
    'Aerospace & Defense': ['Philadelphia', 'Pittsburgh'],
    'Clean Energy': ['Pittsburgh', 'Philadelphia'],
    'Cybersecurity': ['Pittsburgh', 'Philadelphia'],
    'Biotechnology': ['Philadelphia', 'Pittsburgh'],
    'Robotics & Automation': ['Pittsburgh', 'Philadelphia'],
    'Advanced Manufacturing': ['Pittsburgh', 'Philadelphia', 'Allentown'],
  },
  NY: {
    'Nuclear Technologies': ['Schenectady', 'Upton'],
    'Semiconductor': ['Albany', 'New York City'],
    'Healthcare': ['New York City', 'Rochester', 'Buffalo'],
    'AI & Machine Learning': ['New York City', 'Ithaca'],
    'Quantum Technologies': ['New York City', 'Ithaca'],
    'Aerospace & Defense': ['Long Island', 'Syracuse'],
    'Clean Energy': ['New York City', 'Albany'],
    'Cybersecurity': ['New York City', 'Albany'],
    'Biotechnology': ['New York City', 'Long Island'],
    'Robotics & Automation': ['New York City', 'Ithaca'],
    'Advanced Manufacturing': ['Rochester', 'Buffalo', 'Syracuse'],
  },
  NJ: {
    'Nuclear Technologies': ['Princeton'],
    'Semiconductor': ['Princeton', 'New Brunswick'],
    'Healthcare': ['New Brunswick', 'Newark', 'Princeton'],
    'AI & Machine Learning': ['Princeton', 'Newark', 'Hoboken'],
    'Quantum Technologies': ['Princeton'],
    'Aerospace & Defense': ['Camden', 'Lakehurst'],
    'Clean Energy': ['Newark', 'Trenton'],
    'Cybersecurity': ['Newark', 'Princeton'],
    'Biotechnology': ['New Brunswick', 'Princeton', 'Rahway'],
    'Robotics & Automation': ['Princeton', 'Newark'],
    'Advanced Manufacturing': ['Newark', 'Camden', 'Trenton'],
  },
  MD: {
    'Nuclear Technologies': ['Bethesda', 'College Park'],
    'Semiconductor': ['Columbia', 'Bethesda'],
    'Healthcare': ['Baltimore', 'Bethesda', 'Rockville'],
    'AI & Machine Learning': ['Bethesda', 'Columbia', 'Baltimore'],
    'Quantum Technologies': ['College Park', 'Bethesda'],
    'Aerospace & Defense': ['Baltimore', 'Aberdeen', 'Fort Meade'],
    'Clean Energy': ['Baltimore', 'Annapolis'],
    'Cybersecurity': ['Fort Meade', 'Columbia', 'Annapolis Junction'],
    'Biotechnology': ['Bethesda', 'Rockville', 'Frederick'],
    'Robotics & Automation': ['Baltimore', 'Columbia'],
    'Advanced Manufacturing': ['Baltimore', 'Hagerstown'],
  },
  DE: {
    'Nuclear Technologies': ['Wilmington'],
    'Semiconductor': ['Wilmington', 'Newark'],
    'Healthcare': ['Wilmington', 'Newark'],
    'AI & Machine Learning': ['Wilmington'],
    'Quantum Technologies': ['Newark'],
    'Aerospace & Defense': ['Dover AFB', 'Wilmington'],
    'Clean Energy': ['Wilmington', 'Dover'],
    'Cybersecurity': ['Wilmington'],
    'Biotechnology': ['Wilmington', 'Newark'],
    'Robotics & Automation': ['Wilmington'],
    'Advanced Manufacturing': ['Wilmington', 'Dover'],
  },
  CT: {
    'Nuclear Technologies': ['Groton', 'New London'],
    'Semiconductor': ['Hartford', 'New Haven'],
    'Healthcare': ['Hartford', 'New Haven', 'Stamford'],
    'AI & Machine Learning': ['Hartford', 'New Haven', 'Stamford'],
    'Quantum Technologies': ['New Haven'],
    'Aerospace & Defense': ['Hartford', 'Groton', 'Stratford'],
    'Clean Energy': ['Hartford', 'New Haven'],
    'Cybersecurity': ['Hartford', 'Stamford'],
    'Biotechnology': ['New Haven', 'Hartford'],
    'Robotics & Automation': ['Hartford'],
    'Advanced Manufacturing': ['Hartford', 'Bridgeport', 'New Haven'],
  },
  RI: {
    'Nuclear Technologies': ['Providence'],
    'Semiconductor': ['Providence'],
    'Healthcare': ['Providence', 'Warwick'],
    'AI & Machine Learning': ['Providence'],
    'Quantum Technologies': ['Providence'],
    'Aerospace & Defense': ['Newport', 'Quonset Point'],
    'Clean Energy': ['Providence'],
    'Cybersecurity': ['Providence'],
    'Biotechnology': ['Providence'],
    'Robotics & Automation': ['Providence'],
    'Advanced Manufacturing': ['Providence', 'Warwick'],
  },
  MA: {
    'Nuclear Technologies': ['Cambridge', 'Boston'],
    'Semiconductor': ['Boston', 'Cambridge', 'Burlington'],
    'Healthcare': ['Boston', 'Cambridge', 'Worcester'],
    'AI & Machine Learning': ['Cambridge', 'Boston', 'Waltham'],
    'Quantum Technologies': ['Cambridge', 'Boston'],
    'Aerospace & Defense': ['Cambridge', 'Lexington', 'Hanscom AFB'],
    'Clean Energy': ['Boston', 'Cambridge'],
    'Cybersecurity': ['Boston', 'Cambridge', 'Waltham'],
    'Biotechnology': ['Cambridge', 'Boston', 'Waltham', 'Worcester'],
    'Robotics & Automation': ['Cambridge', 'Boston'],
    'Advanced Manufacturing': ['Boston', 'Worcester', 'Springfield'],
  },
  VT: {
    'Nuclear Technologies': ['Burlington'],
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
  NH: {
    'Nuclear Technologies': ['Seabrook'],
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
  ME: {
    'Nuclear Technologies': ['Wiscasset'],
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
  // Non-contiguous
  AK: {
    'Nuclear Technologies': ['Fairbanks'],
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
  HI: {
    'Nuclear Technologies': ['Pearl Harbor'],
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
  'Nuclear Technologies': 5000,
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
  'Nuclear Technologies': 25,
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

// Generate employers for a state/industry
const generateEmployers = (state: string, industry: string): { name: string; positions: number; growth: string }[] => {
  const employersByIndustry: Record<string, string[]> = {
    'Nuclear Technologies': ['National Lab', 'Nuclear Power Plant', 'Energy Company'],
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

// Generate industry data for a state
const generateIndustryData = (state: string, industry: string): IndustryData => {
  const template = industryTemplates[industry];
  const multiplier = stateMultipliers[state] || { salary: 1.0, jobs: 0.6 };
  const hubs = stateIndustryHubs[state]?.[industry] || ['Major City'];
  const baseJobs = baseIndustryJobs[industry] || 30000;
  const baseGrowth = baseGrowthRates[industry] || 20;

  const totalJobs = Math.round(baseJobs * multiplier.jobs);
  const technicians = Math.round(totalJobs * 0.35);
  const engineers = Math.round(totalJobs * 0.25);

  const pathways = template.basePathways.map(pathway => ({
    level: pathway.level,
    roles: pathway.roles.map(role => ({
      title: role.title,
      salary: `$${Math.round(role.salaryRange[0] * multiplier.salary)}K-$${Math.round(role.salaryRange[1] * multiplier.salary)}K`,
      requirement: role.requirement
    }))
  }));

  const engineerRole = pathways[pathways.length - 1]?.roles[0];
  const engineerSalary = engineerRole?.salary.split('-')[0] || '$100K';
  const techRole = pathways[1]?.roles[0];
  const techSalary = techRole?.salary.split('-')[0] || '$60K';
  const opRole = pathways[0]?.roles[0];
  const opSalary = opRole?.salary.split('-')[0] || '$45K';

  const growthVariation = (Math.random() * 20 - 10);
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

// Generate all industry data for a state (fallback)
export const generateStateIndustries = (state: string): Record<string, IndustryData> => {
  const industries: Record<string, IndustryData> = {};
  ALL_INDUSTRIES.forEach(industry => {
    industries[industry] = generateIndustryData(state, industry);
  });
  return industries;
};

// State names lookup - All 50 US States
export const stateNames: Record<string, string> = {
  WA: 'Washington', OR: 'Oregon', CA: 'California',
  NV: 'Nevada', ID: 'Idaho', MT: 'Montana', WY: 'Wyoming', UT: 'Utah',
  AZ: 'Arizona', CO: 'Colorado', NM: 'New Mexico',
  ND: 'North Dakota', SD: 'South Dakota', NE: 'Nebraska', KS: 'Kansas',
  MN: 'Minnesota', IA: 'Iowa', MO: 'Missouri', WI: 'Wisconsin',
  IL: 'Illinois', MI: 'Michigan', IN: 'Indiana', OH: 'Ohio',
  OK: 'Oklahoma', TX: 'Texas', AR: 'Arkansas', LA: 'Louisiana',
  KY: 'Kentucky', TN: 'Tennessee', MS: 'Mississippi', AL: 'Alabama',
  WV: 'West Virginia', VA: 'Virginia', NC: 'North Carolina', SC: 'South Carolina',
  GA: 'Georgia', FL: 'Florida',
  PA: 'Pennsylvania', NY: 'New York', NJ: 'New Jersey', MD: 'Maryland',
  DE: 'Delaware', CT: 'Connecticut', RI: 'Rhode Island', MA: 'Massachusetts',
  VT: 'Vermont', NH: 'New Hampshire', ME: 'Maine',
  AK: 'Alaska', HI: 'Hawaii'
};

// Top states for different industries (static fallback)
export const topNuclearStates = [
  { abbr: 'NM', name: 'New Mexico', jobs: 10500 },
  { abbr: 'TN', name: 'Tennessee', jobs: 8400 },
  { abbr: 'ID', name: 'Idaho', jobs: 5800 },
  { abbr: 'OH', name: 'Ohio', jobs: 3800 },
];

export const topHealthcareStates = [
  { abbr: 'MA', name: 'Massachusetts', jobs: 128000 },
  { abbr: 'MN', name: 'Minnesota', jobs: 95000 },
  { abbr: 'PA', name: 'Pennsylvania', jobs: 112000 },
  { abbr: 'NC', name: 'North Carolina', jobs: 87000 },
  { abbr: 'FL', name: 'Florida', jobs: 156000 },
];
