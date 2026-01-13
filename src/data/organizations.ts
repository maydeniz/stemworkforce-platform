// ===========================================
// PRE-POPULATED ORGANIZATION DATA
// For universities, community colleges, national labs, and federal agencies
// ===========================================

// Types
export interface Organization {
  id: string;
  name: string;
  type: 'university' | 'community_college' | 'national_lab' | 'federal_agency';
  shortName?: string;
  location?: string;
  classification?: string; // R1, R2, Community College, etc.
  allowedDomains?: string[]; // Email domains allowed for this organization
  subunits?: SubUnit[];
}

export interface SubUnit {
  id: string;
  name: string;
  type: 'college' | 'school' | 'department' | 'division' | 'office' | 'bureau' | 'program';
  subunits?: SubUnit[];
}

// ===========================================
// NATIONAL LABORATORIES (DOE Labs)
// ===========================================
export const nationalLabs: Organization[] = [
  {
    id: 'anl',
    name: 'Argonne National Laboratory',
    shortName: 'ANL',
    type: 'national_lab',
    location: 'Lemont, IL',
    allowedDomains: ['anl.gov'],
    subunits: [
      { id: 'anl-pse', name: 'Physical Sciences & Engineering', type: 'division' },
      { id: 'anl-es', name: 'Energy Sciences', type: 'division' },
      { id: 'anl-ces', name: 'Computing, Environment & Life Sciences', type: 'division' },
      { id: 'anl-aps', name: 'Advanced Photon Source', type: 'division' },
      { id: 'anl-msd', name: 'Materials Science Division', type: 'division' },
      { id: 'anl-nse', name: 'Nuclear Science & Engineering', type: 'division' },
    ]
  },
  {
    id: 'bnl',
    name: 'Brookhaven National Laboratory',
    shortName: 'BNL',
    type: 'national_lab',
    location: 'Upton, NY',
    allowedDomains: ['bnl.gov'],
    subunits: [
      { id: 'bnl-cfn', name: 'Center for Functional Nanomaterials', type: 'division' },
      { id: 'bnl-nsls', name: 'National Synchrotron Light Source II', type: 'division' },
      { id: 'bnl-physics', name: 'Physics Department', type: 'division' },
      { id: 'bnl-chem', name: 'Chemistry Department', type: 'division' },
      { id: 'bnl-bio', name: 'Biology Department', type: 'division' },
      { id: 'bnl-es', name: 'Environmental & Climate Sciences', type: 'division' },
    ]
  },
  {
    id: 'fnal',
    name: 'Fermi National Accelerator Laboratory',
    shortName: 'Fermilab',
    type: 'national_lab',
    location: 'Batavia, IL',
    allowedDomains: ['fnal.gov'],
    subunits: [
      { id: 'fnal-ppd', name: 'Particle Physics Division', type: 'division' },
      { id: 'fnal-ad', name: 'Accelerator Division', type: 'division' },
      { id: 'fnal-scd', name: 'Scientific Computing Division', type: 'division' },
      { id: 'fnal-td', name: 'Technical Division', type: 'division' },
      { id: 'fnal-nd', name: 'Neutrino Division', type: 'division' },
    ]
  },
  {
    id: 'inl',
    name: 'Idaho National Laboratory',
    shortName: 'INL',
    type: 'national_lab',
    location: 'Idaho Falls, ID',
    allowedDomains: ['inl.gov'],
    subunits: [
      { id: 'inl-ns', name: 'Nuclear Science & Technology', type: 'division' },
      { id: 'inl-es', name: 'Energy & Environment Science & Technology', type: 'division' },
      { id: 'inl-ns2', name: 'National & Homeland Security', type: 'division' },
      { id: 'inl-atrc', name: 'Advanced Test Reactor Complex', type: 'division' },
    ]
  },
  {
    id: 'lbnl',
    name: 'Lawrence Berkeley National Laboratory',
    shortName: 'Berkeley Lab',
    type: 'national_lab',
    location: 'Berkeley, CA',
    allowedDomains: ['lbl.gov', 'lbnl.gov'],
    subunits: [
      { id: 'lbnl-als', name: 'Advanced Light Source', type: 'division' },
      { id: 'lbnl-jgi', name: 'Joint Genome Institute', type: 'division' },
      { id: 'lbnl-nersc', name: 'NERSC Computing Center', type: 'division' },
      { id: 'lbnl-mf', name: 'Molecular Foundry', type: 'division' },
      { id: 'lbnl-es', name: 'Earth & Environmental Sciences', type: 'division' },
      { id: 'lbnl-bio', name: 'Biosciences Area', type: 'division' },
      { id: 'lbnl-cs', name: 'Computing Sciences', type: 'division' },
    ]
  },
  {
    id: 'llnl',
    name: 'Lawrence Livermore National Laboratory',
    shortName: 'LLNL',
    type: 'national_lab',
    location: 'Livermore, CA',
    allowedDomains: ['llnl.gov'],
    subunits: [
      { id: 'llnl-nif', name: 'National Ignition Facility', type: 'division' },
      { id: 'llnl-wci', name: 'Weapons & Complex Integration', type: 'division' },
      { id: 'llnl-pes', name: 'Physical & Life Sciences', type: 'division' },
      { id: 'llnl-eng', name: 'Engineering', type: 'division' },
      { id: 'llnl-comp', name: 'Computing', type: 'division' },
      { id: 'llnl-gs', name: 'Global Security', type: 'division' },
    ]
  },
  {
    id: 'lanl',
    name: 'Los Alamos National Laboratory',
    shortName: 'LANL',
    type: 'national_lab',
    location: 'Los Alamos, NM',
    allowedDomains: ['lanl.gov'],
    subunits: [
      { id: 'lanl-w', name: 'Weapons Programs', type: 'division' },
      { id: 'lanl-st', name: 'Science & Technology', type: 'division' },
      { id: 'lanl-lansce', name: 'Los Alamos Neutron Science Center', type: 'division' },
      { id: 'lanl-xcp', name: 'Theoretical Design', type: 'division' },
      { id: 'lanl-ees', name: 'Earth & Environmental Sciences', type: 'division' },
    ]
  },
  {
    id: 'nrel',
    name: 'National Renewable Energy Laboratory',
    shortName: 'NREL',
    type: 'national_lab',
    location: 'Golden, CO',
    allowedDomains: ['nrel.gov'],
    subunits: [
      { id: 'nrel-pv', name: 'Photovoltaic Research', type: 'division' },
      { id: 'nrel-wind', name: 'Wind Energy', type: 'division' },
      { id: 'nrel-bio', name: 'Bioenergy', type: 'division' },
      { id: 'nrel-trans', name: 'Transportation & Hydrogen', type: 'division' },
      { id: 'nrel-grid', name: 'Grid Integration', type: 'division' },
      { id: 'nrel-bldg', name: 'Buildings Research', type: 'division' },
    ]
  },
  {
    id: 'ornl',
    name: 'Oak Ridge National Laboratory',
    shortName: 'ORNL',
    type: 'national_lab',
    location: 'Oak Ridge, TN',
    allowedDomains: ['ornl.gov'],
    subunits: [
      { id: 'ornl-sns', name: 'Spallation Neutron Source', type: 'division' },
      { id: 'ornl-olcf', name: 'Oak Ridge Leadership Computing Facility', type: 'division' },
      { id: 'ornl-cnms', name: 'Center for Nanophase Materials Sciences', type: 'division' },
      { id: 'ornl-ns', name: 'Nuclear Science & Engineering', type: 'division' },
      { id: 'ornl-phys', name: 'Physics Division', type: 'division' },
      { id: 'ornl-csd', name: 'Computing & Computational Sciences', type: 'division' },
    ]
  },
  {
    id: 'pnnl',
    name: 'Pacific Northwest National Laboratory',
    shortName: 'PNNL',
    type: 'national_lab',
    location: 'Richland, WA',
    allowedDomains: ['pnnl.gov'],
    subunits: [
      { id: 'pnnl-emsl', name: 'Environmental Molecular Sciences Laboratory', type: 'division' },
      { id: 'pnnl-es', name: 'Earth & Biological Sciences', type: 'division' },
      { id: 'pnnl-ee', name: 'Energy & Environment', type: 'division' },
      { id: 'pnnl-ns', name: 'National Security', type: 'division' },
      { id: 'pnnl-phys', name: 'Physical Sciences', type: 'division' },
    ]
  },
  {
    id: 'pppl',
    name: 'Princeton Plasma Physics Laboratory',
    shortName: 'PPPL',
    type: 'national_lab',
    location: 'Princeton, NJ',
    allowedDomains: ['pppl.gov'],
    subunits: [
      { id: 'pppl-theory', name: 'Theory Department', type: 'division' },
      { id: 'pppl-nstx', name: 'NSTX-U Program', type: 'division' },
      { id: 'pppl-adv', name: 'Advanced Projects', type: 'division' },
    ]
  },
  {
    id: 'slac',
    name: 'SLAC National Accelerator Laboratory',
    shortName: 'SLAC',
    type: 'national_lab',
    location: 'Menlo Park, CA',
    allowedDomains: ['slac.stanford.edu'],
    subunits: [
      { id: 'slac-lcls', name: 'Linac Coherent Light Source', type: 'division' },
      { id: 'slac-ssrl', name: 'Stanford Synchrotron Radiation Lightsource', type: 'division' },
      { id: 'slac-kipac', name: 'Kavli Institute for Particle Astrophysics', type: 'division' },
      { id: 'slac-ppa', name: 'Particle Physics & Astrophysics', type: 'division' },
    ]
  },
  {
    id: 'snl',
    name: 'Sandia National Laboratories',
    shortName: 'Sandia',
    type: 'national_lab',
    location: 'Albuquerque, NM',
    allowedDomains: ['sandia.gov'],
    subunits: [
      { id: 'snl-ns', name: 'Nuclear Security', type: 'division' },
      { id: 'snl-def', name: 'Defense Systems', type: 'division' },
      { id: 'snl-energy', name: 'Energy & Climate', type: 'division' },
      { id: 'snl-comp', name: 'Computing & Information Sciences', type: 'division' },
      { id: 'snl-eng', name: 'Engineering Sciences', type: 'division' },
    ]
  },
  {
    id: 'tjnaf',
    name: 'Thomas Jefferson National Accelerator Facility',
    shortName: 'Jefferson Lab',
    type: 'national_lab',
    location: 'Newport News, VA',
    allowedDomains: ['jlab.org'],
    subunits: [
      { id: 'tjnaf-phys', name: 'Physics Division', type: 'division' },
      { id: 'tjnaf-acc', name: 'Accelerator Division', type: 'division' },
      { id: 'tjnaf-fels', name: 'Free-Electron Laser', type: 'division' },
      { id: 'tjnaf-theory', name: 'Theory Center', type: 'division' },
    ]
  },
  {
    id: 'ames',
    name: 'Ames National Laboratory',
    shortName: 'Ames Lab',
    type: 'national_lab',
    location: 'Ames, IA',
    subunits: [
      { id: 'ames-cmp', name: 'Condensed Matter Physics', type: 'division' },
      { id: 'ames-mse', name: 'Materials Sciences & Engineering', type: 'division' },
      { id: 'ames-cmi', name: 'Critical Materials Institute', type: 'division' },
    ]
  },
  {
    id: 'srnl',
    name: 'Savannah River National Laboratory',
    shortName: 'SRNL',
    type: 'national_lab',
    location: 'Aiken, SC',
    subunits: [
      { id: 'srnl-env', name: 'Environmental Management', type: 'division' },
      { id: 'srnl-ns', name: 'National Security', type: 'division' },
      { id: 'srnl-clean', name: 'Clean Energy', type: 'division' },
    ]
  },
];

// ===========================================
// FEDERAL AGENCIES
// ===========================================
export const federalAgencies: Organization[] = [
  {
    id: 'doe',
    name: 'Department of Energy',
    shortName: 'DOE',
    type: 'federal_agency',
    location: 'Washington, DC',
    subunits: [
      { id: 'doe-sc', name: 'Office of Science', type: 'office' },
      { id: 'doe-ne', name: 'Office of Nuclear Energy', type: 'office' },
      { id: 'doe-ee', name: 'Office of Energy Efficiency & Renewable Energy', type: 'office' },
      { id: 'doe-fe', name: 'Office of Fossil Energy', type: 'office' },
      { id: 'doe-nnsa', name: 'National Nuclear Security Administration', type: 'office' },
      { id: 'doe-em', name: 'Office of Environmental Management', type: 'office' },
      { id: 'doe-ceser', name: 'Office of Cybersecurity, Energy Security & Emergency Response', type: 'office' },
    ]
  },
  {
    id: 'nasa',
    name: 'National Aeronautics and Space Administration',
    shortName: 'NASA',
    type: 'federal_agency',
    location: 'Washington, DC',
    subunits: [
      { id: 'nasa-gsfc', name: 'Goddard Space Flight Center', type: 'office' },
      { id: 'nasa-jpl', name: 'Jet Propulsion Laboratory', type: 'office' },
      { id: 'nasa-jsc', name: 'Johnson Space Center', type: 'office' },
      { id: 'nasa-ksc', name: 'Kennedy Space Center', type: 'office' },
      { id: 'nasa-arc', name: 'Ames Research Center', type: 'office' },
      { id: 'nasa-larc', name: 'Langley Research Center', type: 'office' },
      { id: 'nasa-grc', name: 'Glenn Research Center', type: 'office' },
      { id: 'nasa-msfc', name: 'Marshall Space Flight Center', type: 'office' },
      { id: 'nasa-ssc', name: 'Stennis Space Center', type: 'office' },
    ]
  },
  {
    id: 'nsf',
    name: 'National Science Foundation',
    shortName: 'NSF',
    type: 'federal_agency',
    location: 'Alexandria, VA',
    subunits: [
      { id: 'nsf-bio', name: 'Biological Sciences', type: 'office' },
      { id: 'nsf-cise', name: 'Computer & Information Science & Engineering', type: 'office' },
      { id: 'nsf-eng', name: 'Engineering', type: 'office' },
      { id: 'nsf-geo', name: 'Geosciences', type: 'office' },
      { id: 'nsf-mps', name: 'Mathematical & Physical Sciences', type: 'office' },
      { id: 'nsf-sbe', name: 'Social, Behavioral & Economic Sciences', type: 'office' },
      { id: 'nsf-edu', name: 'STEM Education', type: 'office' },
    ]
  },
  {
    id: 'nih',
    name: 'National Institutes of Health',
    shortName: 'NIH',
    type: 'federal_agency',
    location: 'Bethesda, MD',
    subunits: [
      { id: 'nih-nci', name: 'National Cancer Institute', type: 'office' },
      { id: 'nih-niaid', name: 'National Institute of Allergy & Infectious Diseases', type: 'office' },
      { id: 'nih-nhlbi', name: 'National Heart, Lung & Blood Institute', type: 'office' },
      { id: 'nih-nigms', name: 'National Institute of General Medical Sciences', type: 'office' },
      { id: 'nih-ninds', name: 'National Institute of Neurological Disorders & Stroke', type: 'office' },
      { id: 'nih-nimh', name: 'National Institute of Mental Health', type: 'office' },
    ]
  },
  {
    id: 'dod',
    name: 'Department of Defense',
    shortName: 'DoD',
    type: 'federal_agency',
    location: 'Washington, DC',
    subunits: [
      { id: 'dod-darpa', name: 'DARPA', type: 'office' },
      { id: 'dod-arl', name: 'Army Research Laboratory', type: 'office' },
      { id: 'dod-nrl', name: 'Naval Research Laboratory', type: 'office' },
      { id: 'dod-afrl', name: 'Air Force Research Laboratory', type: 'office' },
      { id: 'dod-erdc', name: 'Engineer Research & Development Center', type: 'office' },
      { id: 'dod-dtra', name: 'Defense Threat Reduction Agency', type: 'office' },
    ]
  },
  {
    id: 'noaa',
    name: 'National Oceanic and Atmospheric Administration',
    shortName: 'NOAA',
    type: 'federal_agency',
    location: 'Washington, DC',
    subunits: [
      { id: 'noaa-nws', name: 'National Weather Service', type: 'office' },
      { id: 'noaa-nmfs', name: 'National Marine Fisheries Service', type: 'office' },
      { id: 'noaa-oar', name: 'Oceanic & Atmospheric Research', type: 'office' },
      { id: 'noaa-nos', name: 'National Ocean Service', type: 'office' },
      { id: 'noaa-nesdis', name: 'Environmental Satellite & Information Service', type: 'office' },
    ]
  },
  {
    id: 'usgs',
    name: 'United States Geological Survey',
    shortName: 'USGS',
    type: 'federal_agency',
    location: 'Reston, VA',
    subunits: [
      { id: 'usgs-wma', name: 'Water Resources Mission Area', type: 'office' },
      { id: 'usgs-nhp', name: 'Natural Hazards Mission Area', type: 'office' },
      { id: 'usgs-eco', name: 'Ecosystems Mission Area', type: 'office' },
      { id: 'usgs-egd', name: 'Energy & Minerals Mission Area', type: 'office' },
      { id: 'usgs-core', name: 'Core Science Systems', type: 'office' },
    ]
  },
  {
    id: 'epa',
    name: 'Environmental Protection Agency',
    shortName: 'EPA',
    type: 'federal_agency',
    location: 'Washington, DC',
    subunits: [
      { id: 'epa-ord', name: 'Office of Research & Development', type: 'office' },
      { id: 'epa-oar', name: 'Office of Air & Radiation', type: 'office' },
      { id: 'epa-ow', name: 'Office of Water', type: 'office' },
      { id: 'epa-ocspp', name: 'Office of Chemical Safety & Pollution Prevention', type: 'office' },
      { id: 'epa-olem', name: 'Office of Land & Emergency Management', type: 'office' },
    ]
  },
  {
    id: 'nist',
    name: 'National Institute of Standards and Technology',
    shortName: 'NIST',
    type: 'federal_agency',
    location: 'Gaithersburg, MD',
    subunits: [
      { id: 'nist-pml', name: 'Physical Measurement Laboratory', type: 'office' },
      { id: 'nist-mml', name: 'Material Measurement Laboratory', type: 'office' },
      { id: 'nist-itl', name: 'Information Technology Laboratory', type: 'office' },
      { id: 'nist-el', name: 'Engineering Laboratory', type: 'office' },
      { id: 'nist-cnst', name: 'Center for Nanoscale Science & Technology', type: 'office' },
    ]
  },
  {
    id: 'usda',
    name: 'United States Department of Agriculture',
    shortName: 'USDA',
    type: 'federal_agency',
    location: 'Washington, DC',
    subunits: [
      { id: 'usda-ars', name: 'Agricultural Research Service', type: 'office' },
      { id: 'usda-nifa', name: 'National Institute of Food & Agriculture', type: 'office' },
      { id: 'usda-fs', name: 'Forest Service', type: 'office' },
      { id: 'usda-ers', name: 'Economic Research Service', type: 'office' },
      { id: 'usda-nass', name: 'National Agricultural Statistics Service', type: 'office' },
    ]
  },
];

// ===========================================
// TOP RESEARCH UNIVERSITIES (R1 & R2)
// ===========================================
export const universities: Organization[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    type: 'university',
    classification: 'R1',
    location: 'Cambridge, MA',
    subunits: [
      {
        id: 'mit-eng',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'mit-eecs', name: 'Electrical Engineering & Computer Science', type: 'department' },
          { id: 'mit-meche', name: 'Mechanical Engineering', type: 'department' },
          { id: 'mit-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'mit-cheme', name: 'Chemical Engineering', type: 'department' },
          { id: 'mit-aeroastro', name: 'Aeronautics & Astronautics', type: 'department' },
          { id: 'mit-nse', name: 'Nuclear Science & Engineering', type: 'department' },
          { id: 'mit-matsci', name: 'Materials Science & Engineering', type: 'department' },
          { id: 'mit-bio', name: 'Biological Engineering', type: 'department' },
        ]
      },
      {
        id: 'mit-science',
        name: 'School of Science',
        type: 'school',
        subunits: [
          { id: 'mit-physics', name: 'Physics', type: 'department' },
          { id: 'mit-math', name: 'Mathematics', type: 'department' },
          { id: 'mit-chem', name: 'Chemistry', type: 'department' },
          { id: 'mit-bio-sci', name: 'Biology', type: 'department' },
          { id: 'mit-eaps', name: 'Earth, Atmospheric & Planetary Sciences', type: 'department' },
          { id: 'mit-bcs', name: 'Brain & Cognitive Sciences', type: 'department' },
        ]
      },
      { id: 'mit-sloan', name: 'Sloan School of Management', type: 'school' },
      { id: 'mit-shass', name: 'School of Humanities, Arts & Social Sciences', type: 'school' },
      { id: 'mit-arch', name: 'School of Architecture & Planning', type: 'school' },
    ]
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    shortName: 'Stanford',
    type: 'university',
    classification: 'R1',
    location: 'Stanford, CA',
    subunits: [
      {
        id: 'stanford-eng',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'stanford-cs', name: 'Computer Science', type: 'department' },
          { id: 'stanford-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'stanford-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'stanford-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'stanford-matsci', name: 'Materials Science & Engineering', type: 'department' },
          { id: 'stanford-bioeng', name: 'Bioengineering', type: 'department' },
          { id: 'stanford-aa', name: 'Aeronautics & Astronautics', type: 'department' },
        ]
      },
      {
        id: 'stanford-hns',
        name: 'School of Humanities & Sciences',
        type: 'school',
        subunits: [
          { id: 'stanford-physics', name: 'Physics', type: 'department' },
          { id: 'stanford-math', name: 'Mathematics', type: 'department' },
          { id: 'stanford-chem', name: 'Chemistry', type: 'department' },
          { id: 'stanford-bio', name: 'Biology', type: 'department' },
        ]
      },
      { id: 'stanford-med', name: 'School of Medicine', type: 'school' },
      { id: 'stanford-gsb', name: 'Graduate School of Business', type: 'school' },
    ]
  },
  {
    id: 'caltech',
    name: 'California Institute of Technology',
    shortName: 'Caltech',
    type: 'university',
    classification: 'R1',
    location: 'Pasadena, CA',
    subunits: [
      {
        id: 'caltech-eas',
        name: 'Division of Engineering & Applied Science',
        type: 'division',
        subunits: [
          { id: 'caltech-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'caltech-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'caltech-aph', name: 'Applied Physics', type: 'department' },
          { id: 'caltech-cms', name: 'Computing & Mathematical Sciences', type: 'department' },
        ]
      },
      {
        id: 'caltech-pma',
        name: 'Division of Physics, Mathematics & Astronomy',
        type: 'division',
        subunits: [
          { id: 'caltech-physics', name: 'Physics', type: 'department' },
          { id: 'caltech-math', name: 'Mathematics', type: 'department' },
          { id: 'caltech-astro', name: 'Astronomy', type: 'department' },
        ]
      },
      { id: 'caltech-cce', name: 'Division of Chemistry & Chemical Engineering', type: 'division' },
      { id: 'caltech-bbs', name: 'Division of Biology & Biological Engineering', type: 'division' },
      { id: 'caltech-gps', name: 'Division of Geological & Planetary Sciences', type: 'division' },
    ]
  },
  {
    id: 'berkeley',
    name: 'University of California, Berkeley',
    shortName: 'UC Berkeley',
    type: 'university',
    classification: 'R1',
    location: 'Berkeley, CA',
    subunits: [
      {
        id: 'berkeley-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'berkeley-eecs', name: 'Electrical Engineering & Computer Sciences', type: 'department' },
          { id: 'berkeley-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'berkeley-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'berkeley-matsci', name: 'Materials Science & Engineering', type: 'department' },
          { id: 'berkeley-bioeng', name: 'Bioengineering', type: 'department' },
          { id: 'berkeley-nuceng', name: 'Nuclear Engineering', type: 'department' },
        ]
      },
      {
        id: 'berkeley-ls',
        name: 'College of Letters & Science',
        type: 'college',
        subunits: [
          { id: 'berkeley-physics', name: 'Physics', type: 'department' },
          { id: 'berkeley-math', name: 'Mathematics', type: 'department' },
          { id: 'berkeley-chem', name: 'Chemistry', type: 'department' },
          { id: 'berkeley-bio', name: 'Molecular & Cell Biology', type: 'department' },
          { id: 'berkeley-stats', name: 'Statistics', type: 'department' },
        ]
      },
      { id: 'berkeley-cnr', name: 'Rausser College of Natural Resources', type: 'college' },
      { id: 'berkeley-haas', name: 'Haas School of Business', type: 'school' },
    ]
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    shortName: 'Harvard',
    type: 'university',
    classification: 'R1',
    location: 'Cambridge, MA',
    subunits: [
      {
        id: 'harvard-seas',
        name: 'School of Engineering & Applied Sciences',
        type: 'school',
        subunits: [
          { id: 'harvard-cs', name: 'Computer Science', type: 'department' },
          { id: 'harvard-ese', name: 'Environmental Science & Engineering', type: 'department' },
          { id: 'harvard-ap', name: 'Applied Physics', type: 'department' },
          { id: 'harvard-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'harvard-be', name: 'Bioengineering', type: 'department' },
        ]
      },
      {
        id: 'harvard-fas',
        name: 'Faculty of Arts & Sciences',
        type: 'school',
        subunits: [
          { id: 'harvard-physics', name: 'Physics', type: 'department' },
          { id: 'harvard-chem', name: 'Chemistry & Chemical Biology', type: 'department' },
          { id: 'harvard-math', name: 'Mathematics', type: 'department' },
          { id: 'harvard-bio', name: 'Molecular & Cellular Biology', type: 'department' },
        ]
      },
      { id: 'harvard-hms', name: 'Harvard Medical School', type: 'school' },
      { id: 'harvard-hbs', name: 'Harvard Business School', type: 'school' },
    ]
  },
  {
    id: 'princeton',
    name: 'Princeton University',
    shortName: 'Princeton',
    type: 'university',
    classification: 'R1',
    location: 'Princeton, NJ',
    subunits: [
      {
        id: 'princeton-eng',
        name: 'School of Engineering & Applied Science',
        type: 'school',
        subunits: [
          { id: 'princeton-cs', name: 'Computer Science', type: 'department' },
          { id: 'princeton-ee', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'princeton-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'princeton-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'princeton-cbe', name: 'Chemical & Biological Engineering', type: 'department' },
        ]
      },
      {
        id: 'princeton-nat',
        name: 'Natural Sciences Division',
        type: 'division',
        subunits: [
          { id: 'princeton-physics', name: 'Physics', type: 'department' },
          { id: 'princeton-math', name: 'Mathematics', type: 'department' },
          { id: 'princeton-chem', name: 'Chemistry', type: 'department' },
          { id: 'princeton-astro', name: 'Astrophysical Sciences', type: 'department' },
          { id: 'princeton-geo', name: 'Geosciences', type: 'department' },
          { id: 'princeton-eeb', name: 'Ecology & Evolutionary Biology', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'umich',
    name: 'University of Michigan',
    shortName: 'U-M',
    type: 'university',
    classification: 'R1',
    location: 'Ann Arbor, MI',
    subunits: [
      {
        id: 'umich-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'umich-eecs', name: 'Electrical Engineering & Computer Science', type: 'department' },
          { id: 'umich-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'umich-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'umich-aero', name: 'Aerospace Engineering', type: 'department' },
          { id: 'umich-matsci', name: 'Materials Science & Engineering', type: 'department' },
          { id: 'umich-nuceng', name: 'Nuclear Engineering', type: 'department' },
        ]
      },
      {
        id: 'umich-lsa',
        name: 'College of Literature, Science & Arts',
        type: 'college',
        subunits: [
          { id: 'umich-physics', name: 'Physics', type: 'department' },
          { id: 'umich-math', name: 'Mathematics', type: 'department' },
          { id: 'umich-chem', name: 'Chemistry', type: 'department' },
        ]
      },
      { id: 'umich-med', name: 'Medical School', type: 'school' },
    ]
  },
  {
    id: 'cmu',
    name: 'Carnegie Mellon University',
    shortName: 'CMU',
    type: 'university',
    classification: 'R1',
    location: 'Pittsburgh, PA',
    subunits: [
      {
        id: 'cmu-scs',
        name: 'School of Computer Science',
        type: 'school',
        subunits: [
          { id: 'cmu-csd', name: 'Computer Science', type: 'department' },
          { id: 'cmu-ri', name: 'Robotics Institute', type: 'department' },
          { id: 'cmu-ml', name: 'Machine Learning', type: 'department' },
          { id: 'cmu-lti', name: 'Language Technologies Institute', type: 'department' },
          { id: 'cmu-hcii', name: 'Human-Computer Interaction', type: 'department' },
        ]
      },
      {
        id: 'cmu-cit',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'cmu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'cmu-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'cmu-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'cmu-matsci', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
      {
        id: 'cmu-mcs',
        name: 'Mellon College of Science',
        type: 'college',
        subunits: [
          { id: 'cmu-physics', name: 'Physics', type: 'department' },
          { id: 'cmu-math', name: 'Mathematical Sciences', type: 'department' },
          { id: 'cmu-chem', name: 'Chemistry', type: 'department' },
          { id: 'cmu-bio', name: 'Biological Sciences', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'gatech',
    name: 'Georgia Institute of Technology',
    shortName: 'Georgia Tech',
    type: 'university',
    classification: 'R1',
    location: 'Atlanta, GA',
    subunits: [
      {
        id: 'gatech-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'gatech-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'gatech-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'gatech-ae', name: 'Aerospace Engineering', type: 'department' },
          { id: 'gatech-chbe', name: 'Chemical & Biomolecular Engineering', type: 'department' },
          { id: 'gatech-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'gatech-mse', name: 'Materials Science & Engineering', type: 'department' },
          { id: 'gatech-nre', name: 'Nuclear & Radiological Engineering', type: 'department' },
        ]
      },
      {
        id: 'gatech-coc',
        name: 'College of Computing',
        type: 'college',
        subunits: [
          { id: 'gatech-cs', name: 'Computer Science', type: 'department' },
          { id: 'gatech-cse', name: 'Computational Science & Engineering', type: 'department' },
          { id: 'gatech-ic', name: 'Interactive Computing', type: 'department' },
        ]
      },
      {
        id: 'gatech-cos',
        name: 'College of Sciences',
        type: 'college',
        subunits: [
          { id: 'gatech-physics', name: 'Physics', type: 'department' },
          { id: 'gatech-math', name: 'Mathematics', type: 'department' },
          { id: 'gatech-chem', name: 'Chemistry & Biochemistry', type: 'department' },
          { id: 'gatech-bio', name: 'Biological Sciences', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uiuc',
    name: 'University of Illinois Urbana-Champaign',
    shortName: 'UIUC',
    type: 'university',
    classification: 'R1',
    location: 'Urbana, IL',
    subunits: [
      {
        id: 'uiuc-eng',
        name: 'Grainger College of Engineering',
        type: 'college',
        subunits: [
          { id: 'uiuc-cs', name: 'Computer Science', type: 'department' },
          { id: 'uiuc-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'uiuc-me', name: 'Mechanical Science & Engineering', type: 'department' },
          { id: 'uiuc-ae', name: 'Aerospace Engineering', type: 'department' },
          { id: 'uiuc-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'uiuc-npre', name: 'Nuclear, Plasma & Radiological Engineering', type: 'department' },
          { id: 'uiuc-matsci', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
      {
        id: 'uiuc-las',
        name: 'College of Liberal Arts & Sciences',
        type: 'college',
        subunits: [
          { id: 'uiuc-physics', name: 'Physics', type: 'department' },
          { id: 'uiuc-math', name: 'Mathematics', type: 'department' },
          { id: 'uiuc-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'cornell',
    name: 'Cornell University',
    shortName: 'Cornell',
    type: 'university',
    classification: 'R1',
    location: 'Ithaca, NY',
    subunits: [
      {
        id: 'cornell-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'cornell-cs', name: 'Computer Science', type: 'department' },
          { id: 'cornell-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'cornell-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'cornell-cee', name: 'Civil & Environmental Engineering', type: 'department' },
          { id: 'cornell-matsci', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
      {
        id: 'cornell-cas',
        name: 'College of Arts & Sciences',
        type: 'college',
        subunits: [
          { id: 'cornell-physics', name: 'Physics', type: 'department' },
          { id: 'cornell-math', name: 'Mathematics', type: 'department' },
          { id: 'cornell-chem', name: 'Chemistry & Chemical Biology', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'utaustin',
    name: 'University of Texas at Austin',
    shortName: 'UT Austin',
    type: 'university',
    classification: 'R1',
    location: 'Austin, TX',
    subunits: [
      {
        id: 'utaustin-eng',
        name: 'Cockrell School of Engineering',
        type: 'school',
        subunits: [
          { id: 'utaustin-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'utaustin-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'utaustin-ae', name: 'Aerospace Engineering & Engineering Mechanics', type: 'department' },
          { id: 'utaustin-ce', name: 'Civil, Architectural & Environmental Engineering', type: 'department' },
          { id: 'utaustin-pge', name: 'Petroleum & Geosystems Engineering', type: 'department' },
        ]
      },
      {
        id: 'utaustin-cns',
        name: 'College of Natural Sciences',
        type: 'college',
        subunits: [
          { id: 'utaustin-cs', name: 'Computer Science', type: 'department' },
          { id: 'utaustin-physics', name: 'Physics', type: 'department' },
          { id: 'utaustin-math', name: 'Mathematics', type: 'department' },
          { id: 'utaustin-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'purdue',
    name: 'Purdue University',
    shortName: 'Purdue',
    type: 'university',
    classification: 'R1',
    location: 'West Lafayette, IN',
    subunits: [
      {
        id: 'purdue-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'purdue-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'purdue-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'purdue-aae', name: 'Aeronautics & Astronautics', type: 'department' },
          { id: 'purdue-ce', name: 'Civil Engineering', type: 'department' },
          { id: 'purdue-nuc', name: 'Nuclear Engineering', type: 'department' },
        ]
      },
      {
        id: 'purdue-sci',
        name: 'College of Science',
        type: 'college',
        subunits: [
          { id: 'purdue-cs', name: 'Computer Science', type: 'department' },
          { id: 'purdue-physics', name: 'Physics & Astronomy', type: 'department' },
          { id: 'purdue-math', name: 'Mathematics', type: 'department' },
          { id: 'purdue-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ucla',
    name: 'University of California, Los Angeles',
    shortName: 'UCLA',
    type: 'university',
    classification: 'R1',
    location: 'Los Angeles, CA',
    subunits: [
      {
        id: 'ucla-seas',
        name: 'Samueli School of Engineering',
        type: 'school',
        subunits: [
          { id: 'ucla-cs', name: 'Computer Science', type: 'department' },
          { id: 'ucla-ee', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'ucla-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'ucla-cee', name: 'Civil & Environmental Engineering', type: 'department' },
        ]
      },
      {
        id: 'ucla-pcs',
        name: 'Physical Sciences Division',
        type: 'division',
        subunits: [
          { id: 'ucla-physics', name: 'Physics & Astronomy', type: 'department' },
          { id: 'ucla-math', name: 'Mathematics', type: 'department' },
          { id: 'ucla-chem', name: 'Chemistry & Biochemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ucsd',
    name: 'University of California, San Diego',
    shortName: 'UCSD',
    type: 'university',
    classification: 'R1',
    location: 'La Jolla, CA',
    subunits: [
      {
        id: 'ucsd-eng',
        name: 'Jacobs School of Engineering',
        type: 'school',
        subunits: [
          { id: 'ucsd-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'ucsd-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'ucsd-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'ucsd-nano', name: 'NanoEngineering', type: 'department' },
        ]
      },
      {
        id: 'ucsd-pcs',
        name: 'Physical Sciences Division',
        type: 'division',
        subunits: [
          { id: 'ucsd-physics', name: 'Physics', type: 'department' },
          { id: 'ucsd-math', name: 'Mathematics', type: 'department' },
          { id: 'ucsd-chem', name: 'Chemistry & Biochemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'wisc',
    name: 'University of Wisconsin-Madison',
    shortName: 'UW-Madison',
    type: 'university',
    classification: 'R1',
    location: 'Madison, WI',
    subunits: [
      {
        id: 'wisc-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'wisc-cs', name: 'Computer Sciences', type: 'department' },
          { id: 'wisc-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'wisc-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'wisc-nuc', name: 'Nuclear Engineering', type: 'department' },
        ]
      },
      {
        id: 'wisc-ls',
        name: 'College of Letters & Science',
        type: 'college',
        subunits: [
          { id: 'wisc-physics', name: 'Physics', type: 'department' },
          { id: 'wisc-math', name: 'Mathematics', type: 'department' },
          { id: 'wisc-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'columbia',
    name: 'Columbia University',
    shortName: 'Columbia',
    type: 'university',
    classification: 'R1',
    location: 'New York, NY',
    subunits: [
      {
        id: 'columbia-seas',
        name: 'Fu Foundation School of Engineering & Applied Science',
        type: 'school',
        subunits: [
          { id: 'columbia-cs', name: 'Computer Science', type: 'department' },
          { id: 'columbia-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'columbia-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'columbia-apam', name: 'Applied Physics & Applied Mathematics', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'northwestern',
    name: 'Northwestern University',
    shortName: 'Northwestern',
    type: 'university',
    classification: 'R1',
    location: 'Evanston, IL',
    subunits: [
      {
        id: 'northwestern-mcormick',
        name: 'McCormick School of Engineering',
        type: 'school',
        subunits: [
          { id: 'northwestern-cs', name: 'Computer Science', type: 'department' },
          { id: 'northwestern-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'northwestern-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'northwestern-matsci', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'yale',
    name: 'Yale University',
    shortName: 'Yale',
    type: 'university',
    classification: 'R1',
    location: 'New Haven, CT',
    subunits: [
      {
        id: 'yale-seas',
        name: 'School of Engineering & Applied Science',
        type: 'school',
        subunits: [
          { id: 'yale-cs', name: 'Computer Science', type: 'department' },
          { id: 'yale-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'yale-me', name: 'Mechanical Engineering & Materials Science', type: 'department' },
        ]
      },
      {
        id: 'yale-fas',
        name: 'Faculty of Arts & Sciences',
        type: 'school',
        subunits: [
          { id: 'yale-physics', name: 'Physics', type: 'department' },
          { id: 'yale-math', name: 'Mathematics', type: 'department' },
          { id: 'yale-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'upenn',
    name: 'University of Pennsylvania',
    shortName: 'Penn',
    type: 'university',
    classification: 'R1',
    location: 'Philadelphia, PA',
    subunits: [
      {
        id: 'upenn-seas',
        name: 'School of Engineering & Applied Science',
        type: 'school',
        subunits: [
          { id: 'upenn-cis', name: 'Computer & Information Science', type: 'department' },
          { id: 'upenn-ese', name: 'Electrical & Systems Engineering', type: 'department' },
          { id: 'upenn-meam', name: 'Mechanical Engineering & Applied Mechanics', type: 'department' },
          { id: 'upenn-matsci', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
    ]
  },
  // ===========================================
  // ADDITIONAL MAJOR STATE UNIVERSITIES (R1 & R2)
  // ===========================================
  {
    id: 'uf',
    name: 'University of Florida',
    shortName: 'UF',
    type: 'university',
    classification: 'R1',
    location: 'Gainesville, FL',
    subunits: [
      {
        id: 'uf-eng',
        name: 'Herbert Wertheim College of Engineering',
        type: 'college',
        subunits: [
          { id: 'uf-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'uf-cise', name: 'Computer & Information Science & Engineering', type: 'department' },
          { id: 'uf-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'uf-nre', name: 'Nuclear Engineering', type: 'department' },
          { id: 'uf-mse', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
      {
        id: 'uf-clas',
        name: 'College of Liberal Arts & Sciences',
        type: 'college',
        subunits: [
          { id: 'uf-physics', name: 'Physics', type: 'department' },
          { id: 'uf-math', name: 'Mathematics', type: 'department' },
          { id: 'uf-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'utk',
    name: 'University of Tennessee, Knoxville',
    shortName: 'UTK',
    type: 'university',
    classification: 'R1',
    location: 'Knoxville, TN',
    subunits: [
      {
        id: 'utk-tickle',
        name: 'Tickle College of Engineering',
        type: 'college',
        subunits: [
          { id: 'utk-eecs', name: 'Electrical Engineering & Computer Science', type: 'department' },
          { id: 'utk-me', name: 'Mechanical, Aerospace & Biomedical Engineering', type: 'department' },
          { id: 'utk-nuc', name: 'Nuclear Engineering', type: 'department' },
          { id: 'utk-mse', name: 'Materials Science & Engineering', type: 'department' },
          { id: 'utk-cee', name: 'Civil & Environmental Engineering', type: 'department' },
        ]
      },
      {
        id: 'utk-cas',
        name: 'College of Arts & Sciences',
        type: 'college',
        subunits: [
          { id: 'utk-physics', name: 'Physics & Astronomy', type: 'department' },
          { id: 'utk-math', name: 'Mathematics', type: 'department' },
          { id: 'utk-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'fsu',
    name: 'Florida State University',
    shortName: 'FSU',
    type: 'university',
    classification: 'R1',
    location: 'Tallahassee, FL',
    subunits: [
      {
        id: 'fsu-eng',
        name: 'FAMU-FSU College of Engineering',
        type: 'college',
        subunits: [
          { id: 'fsu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'fsu-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'fsu-chem-eng', name: 'Chemical & Biomedical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'osu',
    name: 'Ohio State University',
    shortName: 'OSU',
    type: 'university',
    classification: 'R1',
    location: 'Columbus, OH',
    subunits: [
      {
        id: 'osu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'osu-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'osu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'osu-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'osu-mse', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'psu',
    name: 'Pennsylvania State University',
    shortName: 'Penn State',
    type: 'university',
    classification: 'R1',
    location: 'University Park, PA',
    subunits: [
      {
        id: 'psu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'psu-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'psu-eee', name: 'Electrical Engineering', type: 'department' },
          { id: 'psu-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'psu-nuc', name: 'Nuclear Engineering', type: 'department' },
          { id: 'psu-ae', name: 'Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ncsu',
    name: 'North Carolina State University',
    shortName: 'NC State',
    type: 'university',
    classification: 'R1',
    location: 'Raleigh, NC',
    subunits: [
      {
        id: 'ncsu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'ncsu-csc', name: 'Computer Science', type: 'department' },
          { id: 'ncsu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'ncsu-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'ncsu-nuc', name: 'Nuclear Engineering', type: 'department' },
          { id: 'ncsu-mse', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'unc',
    name: 'University of North Carolina at Chapel Hill',
    shortName: 'UNC',
    type: 'university',
    classification: 'R1',
    location: 'Chapel Hill, NC',
    subunits: [
      {
        id: 'unc-cs',
        name: 'Department of Computer Science',
        type: 'department',
      },
      {
        id: 'unc-cas',
        name: 'College of Arts & Sciences',
        type: 'college',
        subunits: [
          { id: 'unc-physics', name: 'Physics & Astronomy', type: 'department' },
          { id: 'unc-math', name: 'Mathematics', type: 'department' },
          { id: 'unc-chem', name: 'Chemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'duke',
    name: 'Duke University',
    shortName: 'Duke',
    type: 'university',
    classification: 'R1',
    location: 'Durham, NC',
    subunits: [
      {
        id: 'duke-pratt',
        name: 'Pratt School of Engineering',
        type: 'school',
        subunits: [
          { id: 'duke-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'duke-cs', name: 'Computer Science', type: 'department' },
          { id: 'duke-me', name: 'Mechanical Engineering & Materials Science', type: 'department' },
          { id: 'duke-bme', name: 'Biomedical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'vt',
    name: 'Virginia Tech',
    shortName: 'Virginia Tech',
    type: 'university',
    classification: 'R1',
    location: 'Blacksburg, VA',
    subunits: [
      {
        id: 'vt-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'vt-cs', name: 'Computer Science', type: 'department' },
          { id: 'vt-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'vt-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'vt-ae', name: 'Aerospace & Ocean Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uva',
    name: 'University of Virginia',
    shortName: 'UVA',
    type: 'university',
    classification: 'R1',
    location: 'Charlottesville, VA',
    subunits: [
      {
        id: 'uva-seas',
        name: 'School of Engineering & Applied Science',
        type: 'school',
        subunits: [
          { id: 'uva-cs', name: 'Computer Science', type: 'department' },
          { id: 'uva-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'uva-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'uva-mse', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'umd',
    name: 'University of Maryland, College Park',
    shortName: 'UMD',
    type: 'university',
    classification: 'R1',
    location: 'College Park, MD',
    subunits: [
      {
        id: 'umd-clark',
        name: 'A. James Clark School of Engineering',
        type: 'school',
        subunits: [
          { id: 'umd-cs', name: 'Computer Science', type: 'department' },
          { id: 'umd-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'umd-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'umd-ae', name: 'Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uw',
    name: 'University of Washington',
    shortName: 'UW',
    type: 'university',
    classification: 'R1',
    location: 'Seattle, WA',
    subunits: [
      {
        id: 'uw-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'uw-cse', name: 'Paul G. Allen School of Computer Science & Engineering', type: 'department' },
          { id: 'uw-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'uw-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'uw-aa', name: 'Aeronautics & Astronautics', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'umn',
    name: 'University of Minnesota',
    shortName: 'UMN',
    type: 'university',
    classification: 'R1',
    location: 'Minneapolis, MN',
    subunits: [
      {
        id: 'umn-cse',
        name: 'College of Science & Engineering',
        type: 'college',
        subunits: [
          { id: 'umn-cs', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'umn-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'umn-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'umn-ae', name: 'Aerospace Engineering & Mechanics', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'cu-boulder',
    name: 'University of Colorado Boulder',
    shortName: 'CU Boulder',
    type: 'university',
    classification: 'R1',
    location: 'Boulder, CO',
    subunits: [
      {
        id: 'cu-eng',
        name: 'College of Engineering & Applied Science',
        type: 'college',
        subunits: [
          { id: 'cu-cs', name: 'Computer Science', type: 'department' },
          { id: 'cu-ece', name: 'Electrical, Computer & Energy Engineering', type: 'department' },
          { id: 'cu-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'cu-asen', name: 'Aerospace Engineering Sciences', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'tamu',
    name: 'Texas A&M University',
    shortName: 'Texas A&M',
    type: 'university',
    classification: 'R1',
    location: 'College Station, TX',
    subunits: [
      {
        id: 'tamu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'tamu-csce', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'tamu-ecen', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'tamu-meen', name: 'Mechanical Engineering', type: 'department' },
          { id: 'tamu-aero', name: 'Aerospace Engineering', type: 'department' },
          { id: 'tamu-nuen', name: 'Nuclear Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'rice',
    name: 'Rice University',
    shortName: 'Rice',
    type: 'university',
    classification: 'R1',
    location: 'Houston, TX',
    subunits: [
      {
        id: 'rice-eng',
        name: 'George R. Brown School of Engineering',
        type: 'school',
        subunits: [
          { id: 'rice-cs', name: 'Computer Science', type: 'department' },
          { id: 'rice-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'rice-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'rice-msne', name: 'Materials Science & NanoEngineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'arizona',
    name: 'University of Arizona',
    shortName: 'UArizona',
    type: 'university',
    classification: 'R1',
    location: 'Tucson, AZ',
    subunits: [
      {
        id: 'arizona-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'arizona-cs', name: 'Computer Science', type: 'department' },
          { id: 'arizona-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'arizona-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'arizona-ae', name: 'Aerospace & Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'asu',
    name: 'Arizona State University',
    shortName: 'ASU',
    type: 'university',
    classification: 'R1',
    location: 'Tempe, AZ',
    subunits: [
      {
        id: 'asu-fulton',
        name: 'Ira A. Fulton Schools of Engineering',
        type: 'school',
        subunits: [
          { id: 'asu-cidse', name: 'Computer Science', type: 'department' },
          { id: 'asu-ecee', name: 'Electrical, Computer & Energy Engineering', type: 'department' },
          { id: 'asu-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
          { id: 'asu-semte', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'usc',
    name: 'University of Southern California',
    shortName: 'USC',
    type: 'university',
    classification: 'R1',
    location: 'Los Angeles, CA',
    subunits: [
      {
        id: 'usc-viterbi',
        name: 'Viterbi School of Engineering',
        type: 'school',
        subunits: [
          { id: 'usc-cs', name: 'Computer Science', type: 'department' },
          { id: 'usc-ee', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'usc-ame', name: 'Aerospace & Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'bu',
    name: 'Boston University',
    shortName: 'BU',
    type: 'university',
    classification: 'R1',
    location: 'Boston, MA',
    subunits: [
      {
        id: 'bu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'bu-cs', name: 'Computer Science', type: 'department' },
          { id: 'bu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'bu-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'nyu',
    name: 'New York University',
    shortName: 'NYU',
    type: 'university',
    classification: 'R1',
    location: 'New York, NY',
    subunits: [
      {
        id: 'nyu-tandon',
        name: 'Tandon School of Engineering',
        type: 'school',
        subunits: [
          { id: 'nyu-cs', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'nyu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'nyu-me', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'rutgers',
    name: 'Rutgers University',
    shortName: 'Rutgers',
    type: 'university',
    classification: 'R1',
    location: 'New Brunswick, NJ',
    subunits: [
      {
        id: 'rutgers-soe',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'rutgers-cs', name: 'Computer Science', type: 'department' },
          { id: 'rutgers-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'rutgers-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'iowa',
    name: 'University of Iowa',
    shortName: 'Iowa',
    type: 'university',
    classification: 'R1',
    location: 'Iowa City, IA',
    subunits: [
      {
        id: 'iowa-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'iowa-cs', name: 'Computer Science', type: 'department' },
          { id: 'iowa-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'iowa-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'iowa-state',
    name: 'Iowa State University',
    shortName: 'Iowa State',
    type: 'university',
    classification: 'R1',
    location: 'Ames, IA',
    subunits: [
      {
        id: 'iowa-state-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'iowa-state-cse', name: 'Computer Science', type: 'department' },
          { id: 'iowa-state-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'iowa-state-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'iowa-state-ae', name: 'Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'msu',
    name: 'Michigan State University',
    shortName: 'MSU',
    type: 'university',
    classification: 'R1',
    location: 'East Lansing, MI',
    subunits: [
      {
        id: 'msu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'msu-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'msu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'msu-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'vanderbilt',
    name: 'Vanderbilt University',
    shortName: 'Vanderbilt',
    type: 'university',
    classification: 'R1',
    location: 'Nashville, TN',
    subunits: [
      {
        id: 'vanderbilt-eng',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'vanderbilt-cs', name: 'Computer Science', type: 'department' },
          { id: 'vanderbilt-eece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'vanderbilt-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'wustl',
    name: 'Washington University in St. Louis',
    shortName: 'WashU',
    type: 'university',
    classification: 'R1',
    location: 'St. Louis, MO',
    subunits: [
      {
        id: 'wustl-mckelvey',
        name: 'McKelvey School of Engineering',
        type: 'school',
        subunits: [
          { id: 'wustl-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'wustl-ese', name: 'Electrical & Systems Engineering', type: 'department' },
          { id: 'wustl-me', name: 'Mechanical Engineering & Materials Science', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'emory',
    name: 'Emory University',
    shortName: 'Emory',
    type: 'university',
    classification: 'R1',
    location: 'Atlanta, GA',
    subunits: [
      { id: 'emory-cs', name: 'Computer Science', type: 'department' },
      { id: 'emory-math', name: 'Mathematics', type: 'department' },
    ]
  },
  {
    id: 'jhu',
    name: 'Johns Hopkins University',
    shortName: 'Johns Hopkins',
    type: 'university',
    classification: 'R1',
    location: 'Baltimore, MD',
    subunits: [
      {
        id: 'jhu-wse',
        name: 'Whiting School of Engineering',
        type: 'school',
        subunits: [
          { id: 'jhu-cs', name: 'Computer Science', type: 'department' },
          { id: 'jhu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'jhu-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'jhu-mse', name: 'Materials Science & Engineering', type: 'department' },
        ]
      },
      { id: 'jhu-apl', name: 'Applied Physics Laboratory', type: 'division' },
    ]
  },
  {
    id: 'rochester',
    name: 'University of Rochester',
    shortName: 'Rochester',
    type: 'university',
    classification: 'R1',
    location: 'Rochester, NY',
    subunits: [
      {
        id: 'rochester-hajim',
        name: 'Hajim School of Engineering & Applied Sciences',
        type: 'school',
        subunits: [
          { id: 'rochester-cs', name: 'Computer Science', type: 'department' },
          { id: 'rochester-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'rochester-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'brown',
    name: 'Brown University',
    shortName: 'Brown',
    type: 'university',
    classification: 'R1',
    location: 'Providence, RI',
    subunits: [
      {
        id: 'brown-eng',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'brown-cs', name: 'Computer Science', type: 'department' },
          { id: 'brown-ee', name: 'Electrical & Computer Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'dartmouth',
    name: 'Dartmouth College',
    shortName: 'Dartmouth',
    type: 'university',
    classification: 'R1',
    location: 'Hanover, NH',
    subunits: [
      {
        id: 'dartmouth-thayer',
        name: 'Thayer School of Engineering',
        type: 'school',
        subunits: [
          { id: 'dartmouth-cs', name: 'Computer Science', type: 'department' },
          { id: 'dartmouth-engs', name: 'Engineering Sciences', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'usf',
    name: 'University of South Florida',
    shortName: 'USF',
    type: 'university',
    classification: 'R1',
    location: 'Tampa, FL',
    subunits: [
      {
        id: 'usf-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'usf-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'usf-ece', name: 'Electrical Engineering', type: 'department' },
          { id: 'usf-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ucf',
    name: 'University of Central Florida',
    shortName: 'UCF',
    type: 'university',
    classification: 'R1',
    location: 'Orlando, FL',
    subunits: [
      {
        id: 'ucf-cecs',
        name: 'College of Engineering & Computer Science',
        type: 'college',
        subunits: [
          { id: 'ucf-cs', name: 'Computer Science', type: 'department' },
          { id: 'ucf-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'ucf-me', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'clemson',
    name: 'Clemson University',
    shortName: 'Clemson',
    type: 'university',
    classification: 'R1',
    location: 'Clemson, SC',
    subunits: [
      {
        id: 'clemson-cecas',
        name: 'College of Engineering, Computing & Applied Sciences',
        type: 'college',
        subunits: [
          { id: 'clemson-cs', name: 'Computer Science', type: 'department' },
          { id: 'clemson-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'clemson-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'usc-sc',
    name: 'University of South Carolina',
    shortName: 'South Carolina',
    type: 'university',
    classification: 'R1',
    location: 'Columbia, SC',
    subunits: [
      {
        id: 'usc-sc-cec',
        name: 'College of Engineering & Computing',
        type: 'college',
        subunits: [
          { id: 'usc-sc-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'usc-sc-ece', name: 'Electrical Engineering', type: 'department' },
          { id: 'usc-sc-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uk',
    name: 'University of Kentucky',
    shortName: 'UK',
    type: 'university',
    classification: 'R1',
    location: 'Lexington, KY',
    subunits: [
      {
        id: 'uk-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'uk-cs', name: 'Computer Science', type: 'department' },
          { id: 'uk-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'uk-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'louisville',
    name: 'University of Louisville',
    shortName: 'Louisville',
    type: 'university',
    classification: 'R1',
    location: 'Louisville, KY',
    subunits: [
      {
        id: 'louisville-speed',
        name: 'J.B. Speed School of Engineering',
        type: 'school',
        subunits: [
          { id: 'louisville-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'louisville-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'louisville-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'unm',
    name: 'University of New Mexico',
    shortName: 'UNM',
    type: 'university',
    classification: 'R1',
    location: 'Albuquerque, NM',
    subunits: [
      {
        id: 'unm-soe',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'unm-cs', name: 'Computer Science', type: 'department' },
          { id: 'unm-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'unm-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'unm-nuc', name: 'Nuclear Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'kansas',
    name: 'University of Kansas',
    shortName: 'KU',
    type: 'university',
    classification: 'R1',
    location: 'Lawrence, KS',
    subunits: [
      {
        id: 'kansas-eng',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'kansas-eecs', name: 'Electrical Engineering & Computer Science', type: 'department' },
          { id: 'kansas-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'kansas-ae', name: 'Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'kansas-state',
    name: 'Kansas State University',
    shortName: 'K-State',
    type: 'university',
    classification: 'R1',
    location: 'Manhattan, KS',
    subunits: [
      {
        id: 'kansas-state-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'kansas-state-cis', name: 'Computer Science', type: 'department' },
          { id: 'kansas-state-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'kansas-state-me', name: 'Mechanical & Nuclear Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'nebraska',
    name: 'University of Nebraska-Lincoln',
    shortName: 'Nebraska',
    type: 'university',
    classification: 'R1',
    location: 'Lincoln, NE',
    subunits: [
      {
        id: 'nebraska-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'nebraska-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'nebraska-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'nebraska-me', name: 'Mechanical & Materials Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'oklahoma',
    name: 'University of Oklahoma',
    shortName: 'OU',
    type: 'university',
    classification: 'R1',
    location: 'Norman, OK',
    subunits: [
      {
        id: 'oklahoma-gallogly',
        name: 'Gallogly College of Engineering',
        type: 'college',
        subunits: [
          { id: 'oklahoma-cs', name: 'Computer Science', type: 'department' },
          { id: 'oklahoma-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'oklahoma-ame', name: 'Aerospace & Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'oklahoma-state',
    name: 'Oklahoma State University',
    shortName: 'OSU',
    type: 'university',
    classification: 'R1',
    location: 'Stillwater, OK',
    subunits: [
      {
        id: 'oklahoma-state-ceat',
        name: 'College of Engineering, Architecture & Technology',
        type: 'college',
        subunits: [
          { id: 'oklahoma-state-cs', name: 'Computer Science', type: 'department' },
          { id: 'oklahoma-state-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'oklahoma-state-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'oregon',
    name: 'University of Oregon',
    shortName: 'UO',
    type: 'university',
    classification: 'R1',
    location: 'Eugene, OR',
    subunits: [
      { id: 'oregon-cs', name: 'Computer Science', type: 'department' },
      {
        id: 'oregon-cas',
        name: 'College of Arts & Sciences',
        type: 'college',
        subunits: [
          { id: 'oregon-physics', name: 'Physics', type: 'department' },
          { id: 'oregon-math', name: 'Mathematics', type: 'department' },
          { id: 'oregon-chem', name: 'Chemistry & Biochemistry', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'oregon-state',
    name: 'Oregon State University',
    shortName: 'OSU',
    type: 'university',
    classification: 'R1',
    location: 'Corvallis, OR',
    subunits: [
      {
        id: 'oregon-state-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'oregon-state-cs', name: 'Computer Science', type: 'department' },
          { id: 'oregon-state-ece', name: 'Electrical Engineering & Computer Science', type: 'department' },
          { id: 'oregon-state-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'oregon-state-nuc', name: 'Nuclear Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'utah',
    name: 'University of Utah',
    shortName: 'Utah',
    type: 'university',
    classification: 'R1',
    location: 'Salt Lake City, UT',
    subunits: [
      {
        id: 'utah-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'utah-cs', name: 'School of Computing', type: 'department' },
          { id: 'utah-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'utah-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'byu',
    name: 'Brigham Young University',
    shortName: 'BYU',
    type: 'university',
    classification: 'R2',
    location: 'Provo, UT',
    subunits: [
      {
        id: 'byu-ecen',
        name: 'Ira A. Fulton College of Engineering',
        type: 'college',
        subunits: [
          { id: 'byu-cs', name: 'Computer Science', type: 'department' },
          { id: 'byu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'byu-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'alabama',
    name: 'University of Alabama',
    shortName: 'UA',
    type: 'university',
    classification: 'R1',
    location: 'Tuscaloosa, AL',
    subunits: [
      {
        id: 'alabama-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'alabama-cs', name: 'Computer Science', type: 'department' },
          { id: 'alabama-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'alabama-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'alabama-ae', name: 'Aerospace Engineering & Mechanics', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'auburn',
    name: 'Auburn University',
    shortName: 'Auburn',
    type: 'university',
    classification: 'R1',
    location: 'Auburn, AL',
    subunits: [
      {
        id: 'auburn-eng',
        name: 'Samuel Ginn College of Engineering',
        type: 'college',
        subunits: [
          { id: 'auburn-csse', name: 'Computer Science & Software Engineering', type: 'department' },
          { id: 'auburn-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'auburn-mae', name: 'Mechanical Engineering', type: 'department' },
          { id: 'auburn-ae', name: 'Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'lsu',
    name: 'Louisiana State University',
    shortName: 'LSU',
    type: 'university',
    classification: 'R1',
    location: 'Baton Rouge, LA',
    subunits: [
      {
        id: 'lsu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'lsu-csc', name: 'Computer Science', type: 'department' },
          { id: 'lsu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'lsu-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ole-miss',
    name: 'University of Mississippi',
    shortName: 'Ole Miss',
    type: 'university',
    classification: 'R1',
    location: 'Oxford, MS',
    subunits: [
      {
        id: 'ole-miss-eng',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'ole-miss-cs', name: 'Computer & Information Science', type: 'department' },
          { id: 'ole-miss-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'ole-miss-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'miss-state',
    name: 'Mississippi State University',
    shortName: 'MSU',
    type: 'university',
    classification: 'R1',
    location: 'Starkville, MS',
    subunits: [
      {
        id: 'miss-state-bagley',
        name: 'Bagley College of Engineering',
        type: 'college',
        subunits: [
          { id: 'miss-state-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'miss-state-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'miss-state-me', name: 'Mechanical Engineering', type: 'department' },
          { id: 'miss-state-ae', name: 'Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'arkansas',
    name: 'University of Arkansas',
    shortName: 'Arkansas',
    type: 'university',
    classification: 'R1',
    location: 'Fayetteville, AR',
    subunits: [
      {
        id: 'arkansas-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'arkansas-csce', name: 'Computer Science & Computer Engineering', type: 'department' },
          { id: 'arkansas-eleg', name: 'Electrical Engineering', type: 'department' },
          { id: 'arkansas-meeg', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'wvu',
    name: 'West Virginia University',
    shortName: 'WVU',
    type: 'university',
    classification: 'R1',
    location: 'Morgantown, WV',
    subunits: [
      {
        id: 'wvu-statler',
        name: 'Statler College of Engineering & Mineral Resources',
        type: 'college',
        subunits: [
          { id: 'wvu-lcsee', name: 'Lane Department of Computer Science & Electrical Engineering', type: 'department' },
          { id: 'wvu-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uconn',
    name: 'University of Connecticut',
    shortName: 'UConn',
    type: 'university',
    classification: 'R1',
    location: 'Storrs, CT',
    subunits: [
      {
        id: 'uconn-eng',
        name: 'School of Engineering',
        type: 'school',
        subunits: [
          { id: 'uconn-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'uconn-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'uconn-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'umass',
    name: 'University of Massachusetts Amherst',
    shortName: 'UMass Amherst',
    type: 'university',
    classification: 'R1',
    location: 'Amherst, MA',
    subunits: [
      {
        id: 'umass-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'umass-cs', name: 'Manning College of Information & Computer Sciences', type: 'department' },
          { id: 'umass-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'umass-me', name: 'Mechanical & Industrial Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'unh',
    name: 'University of New Hampshire',
    shortName: 'UNH',
    type: 'university',
    classification: 'R2',
    location: 'Durham, NH',
    subunits: [
      {
        id: 'unh-ceps',
        name: 'College of Engineering & Physical Sciences',
        type: 'college',
        subunits: [
          { id: 'unh-cs', name: 'Computer Science', type: 'department' },
          { id: 'unh-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'unh-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uri',
    name: 'University of Rhode Island',
    shortName: 'URI',
    type: 'university',
    classification: 'R2',
    location: 'Kingston, RI',
    subunits: [
      {
        id: 'uri-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'uri-csc', name: 'Computer Science & Statistics', type: 'department' },
          { id: 'uri-ele', name: 'Electrical, Computer & Biomedical Engineering', type: 'department' },
          { id: 'uri-mce', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uvm',
    name: 'University of Vermont',
    shortName: 'UVM',
    type: 'university',
    classification: 'R2',
    location: 'Burlington, VT',
    subunits: [
      {
        id: 'uvm-cems',
        name: 'College of Engineering & Mathematical Sciences',
        type: 'college',
        subunits: [
          { id: 'uvm-cs', name: 'Computer Science', type: 'department' },
          { id: 'uvm-ece', name: 'Electrical & Biomedical Engineering', type: 'department' },
          { id: 'uvm-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'maine',
    name: 'University of Maine',
    shortName: 'UMaine',
    type: 'university',
    classification: 'R1',
    location: 'Orono, ME',
    subunits: [
      {
        id: 'maine-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'maine-cs', name: 'Computer Science', type: 'department' },
          { id: 'maine-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'maine-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'delaware',
    name: 'University of Delaware',
    shortName: 'UD',
    type: 'university',
    classification: 'R1',
    location: 'Newark, DE',
    subunits: [
      {
        id: 'delaware-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'delaware-cis', name: 'Computer & Information Sciences', type: 'department' },
          { id: 'delaware-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'delaware-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'hawaii',
    name: 'University of Hawaii at Manoa',
    shortName: 'UH Manoa',
    type: 'university',
    classification: 'R1',
    location: 'Honolulu, HI',
    subunits: [
      {
        id: 'hawaii-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'hawaii-ics', name: 'Information & Computer Sciences', type: 'department' },
          { id: 'hawaii-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'hawaii-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'alaska',
    name: 'University of Alaska Fairbanks',
    shortName: 'UAF',
    type: 'university',
    classification: 'R2',
    location: 'Fairbanks, AK',
    subunits: [
      {
        id: 'alaska-cem',
        name: 'College of Engineering & Mines',
        type: 'college',
        subunits: [
          { id: 'alaska-cs', name: 'Computer Science', type: 'department' },
          { id: 'alaska-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'alaska-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'montana',
    name: 'Montana State University',
    shortName: 'MSU',
    type: 'university',
    classification: 'R2',
    location: 'Bozeman, MT',
    subunits: [
      {
        id: 'montana-norm',
        name: 'Norm Asbjornson College of Engineering',
        type: 'college',
        subunits: [
          { id: 'montana-cs', name: 'Computer Science', type: 'department' },
          { id: 'montana-eece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'montana-me', name: 'Mechanical & Industrial Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'wyoming',
    name: 'University of Wyoming',
    shortName: 'UW',
    type: 'university',
    classification: 'R2',
    location: 'Laramie, WY',
    subunits: [
      {
        id: 'wyoming-ceas',
        name: 'College of Engineering & Applied Science',
        type: 'college',
        subunits: [
          { id: 'wyoming-cs', name: 'Computer Science', type: 'department' },
          { id: 'wyoming-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'wyoming-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'north-dakota',
    name: 'University of North Dakota',
    shortName: 'UND',
    type: 'university',
    classification: 'R2',
    location: 'Grand Forks, ND',
    subunits: [
      {
        id: 'north-dakota-cems',
        name: 'College of Engineering & Mines',
        type: 'college',
        subunits: [
          { id: 'north-dakota-cs', name: 'Computer Science', type: 'department' },
          { id: 'north-dakota-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'north-dakota-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'south-dakota-state',
    name: 'South Dakota State University',
    shortName: 'SDSU',
    type: 'university',
    classification: 'R2',
    location: 'Brookings, SD',
    subunits: [
      {
        id: 'south-dakota-state-eng',
        name: 'Jerome J. Lohr College of Engineering',
        type: 'college',
        subunits: [
          { id: 'south-dakota-state-cs', name: 'Computer Science', type: 'department' },
          { id: 'south-dakota-state-ee', name: 'Electrical Engineering', type: 'department' },
          { id: 'south-dakota-state-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'nevada-reno',
    name: 'University of Nevada, Reno',
    shortName: 'UNR',
    type: 'university',
    classification: 'R1',
    location: 'Reno, NV',
    subunits: [
      {
        id: 'nevada-reno-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'nevada-reno-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'nevada-reno-ece', name: 'Electrical & Biomedical Engineering', type: 'department' },
          { id: 'nevada-reno-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'unlv',
    name: 'University of Nevada, Las Vegas',
    shortName: 'UNLV',
    type: 'university',
    classification: 'R1',
    location: 'Las Vegas, NV',
    subunits: [
      {
        id: 'unlv-howard',
        name: 'Howard R. Hughes College of Engineering',
        type: 'college',
        subunits: [
          { id: 'unlv-cs', name: 'Computer Science', type: 'department' },
          { id: 'unlv-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'unlv-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'nmsu',
    name: 'New Mexico State University',
    shortName: 'NMSU',
    type: 'university',
    classification: 'R2',
    location: 'Las Cruces, NM',
    subunits: [
      {
        id: 'nmsu-eng',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'nmsu-cs', name: 'Computer Science', type: 'department' },
          { id: 'nmsu-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'nmsu-me', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'uci',
    name: 'University of California, Irvine',
    shortName: 'UCI',
    type: 'university',
    classification: 'R1',
    location: 'Irvine, CA',
    subunits: [
      {
        id: 'uci-samueli',
        name: 'Henry Samueli School of Engineering',
        type: 'school',
        subunits: [
          { id: 'uci-cs', name: 'Computer Science', type: 'department' },
          { id: 'uci-eecs', name: 'Electrical Engineering & Computer Science', type: 'department' },
          { id: 'uci-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ucdavis',
    name: 'University of California, Davis',
    shortName: 'UC Davis',
    type: 'university',
    classification: 'R1',
    location: 'Davis, CA',
    subunits: [
      {
        id: 'ucdavis-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'ucdavis-cs', name: 'Computer Science', type: 'department' },
          { id: 'ucdavis-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'ucdavis-mae', name: 'Mechanical & Aerospace Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ucsb',
    name: 'University of California, Santa Barbara',
    shortName: 'UCSB',
    type: 'university',
    classification: 'R1',
    location: 'Santa Barbara, CA',
    subunits: [
      {
        id: 'ucsb-coe',
        name: 'College of Engineering',
        type: 'college',
        subunits: [
          { id: 'ucsb-cs', name: 'Computer Science', type: 'department' },
          { id: 'ucsb-ece', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'ucsb-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ucsc',
    name: 'University of California, Santa Cruz',
    shortName: 'UCSC',
    type: 'university',
    classification: 'R1',
    location: 'Santa Cruz, CA',
    subunits: [
      {
        id: 'ucsc-bsoe',
        name: 'Baskin School of Engineering',
        type: 'school',
        subunits: [
          { id: 'ucsc-cs', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'ucsc-ece', name: 'Electrical & Computer Engineering', type: 'department' },
        ]
      },
    ]
  },
  {
    id: 'ucr',
    name: 'University of California, Riverside',
    shortName: 'UCR',
    type: 'university',
    classification: 'R1',
    location: 'Riverside, CA',
    subunits: [
      {
        id: 'ucr-bcoe',
        name: 'Bourns College of Engineering',
        type: 'college',
        subunits: [
          { id: 'ucr-cse', name: 'Computer Science & Engineering', type: 'department' },
          { id: 'ucr-ee', name: 'Electrical & Computer Engineering', type: 'department' },
          { id: 'ucr-me', name: 'Mechanical Engineering', type: 'department' },
        ]
      },
    ]
  },
];

// ===========================================
// COMMUNITY COLLEGES - Major STEM-focused institutions
// ===========================================
export const communityColleges: Organization[] = [
  // California Community Colleges
  {
    id: 'deanza',
    name: 'De Anza College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Cupertino, CA',
    subunits: [
      { id: 'deanza-stem', name: 'STEM Division', type: 'division' },
      { id: 'deanza-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'deanza-eng', name: 'Engineering & Technology', type: 'program' },
      { id: 'deanza-bio', name: 'Biological Sciences', type: 'program' },
      { id: 'deanza-math', name: 'Mathematics', type: 'program' },
    ]
  },
  {
    id: 'foothill',
    name: 'Foothill College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Los Altos Hills, CA',
    subunits: [
      { id: 'foothill-stem', name: 'STEM Division', type: 'division' },
      { id: 'foothill-cs', name: 'Computer Science', type: 'program' },
      { id: 'foothill-bio', name: 'Biological & Health Sciences', type: 'program' },
      { id: 'foothill-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'missioncc',
    name: 'Mission College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Santa Clara, CA',
    subunits: [
      { id: 'missioncc-stem', name: 'Science & Technology', type: 'division' },
      { id: 'missioncc-cs', name: 'Computer Applications & Technology', type: 'program' },
      { id: 'missioncc-bio', name: 'Biology', type: 'program' },
    ]
  },
  {
    id: 'santarosacc',
    name: 'Santa Rosa Junior College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Santa Rosa, CA',
    subunits: [
      { id: 'santarosacc-stem', name: 'STEM & Health Sciences', type: 'division' },
      { id: 'santarosacc-cs', name: 'Computer Studies', type: 'program' },
      { id: 'santarosacc-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'pasadenacc',
    name: 'Pasadena City College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Pasadena, CA',
    subunits: [
      { id: 'pasadenacc-stem', name: 'Mathematics & Sciences', type: 'division' },
      { id: 'pasadenacc-cs', name: 'Computer Science & Information Technology', type: 'program' },
      { id: 'pasadenacc-eng', name: 'Engineering & Technology', type: 'program' },
    ]
  },
  {
    id: 'smcollege',
    name: 'Santa Monica College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Santa Monica, CA',
    subunits: [
      { id: 'smcollege-stem', name: 'Science & Mathematics', type: 'division' },
      { id: 'smcollege-cs', name: 'Computer Science', type: 'program' },
      { id: 'smcollege-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'diablovalley',
    name: 'Diablo Valley College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Pleasant Hill, CA',
    subunits: [
      { id: 'diablovalley-stem', name: 'Math & Physical Sciences', type: 'division' },
      { id: 'diablovalley-cs', name: 'Computer Science', type: 'program' },
      { id: 'diablovalley-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Texas Community Colleges
  {
    id: 'austincc',
    name: 'Austin Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Austin, TX',
    subunits: [
      { id: 'austincc-stem', name: 'STEM Division', type: 'division' },
      { id: 'austincc-cs', name: 'Computer Studies', type: 'program' },
      { id: 'austincc-eng', name: 'Engineering', type: 'program' },
      { id: 'austincc-bio', name: 'Biotechnology', type: 'program' },
    ]
  },
  {
    id: 'hccs',
    name: 'Houston Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Houston, TX',
    subunits: [
      { id: 'hccs-stem', name: 'Sciences & Technology', type: 'division' },
      { id: 'hccs-cs', name: 'Computer Technology', type: 'program' },
      { id: 'hccs-eng', name: 'Engineering Technology', type: 'program' },
      { id: 'hccs-petro', name: 'Petroleum Technology', type: 'program' },
    ]
  },
  {
    id: 'dallascc',
    name: 'Dallas College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Dallas, TX',
    subunits: [
      { id: 'dallascc-stem', name: 'STEM School', type: 'division' },
      { id: 'dallascc-cs', name: 'Computer Information Technology', type: 'program' },
      { id: 'dallascc-eng', name: 'Engineering', type: 'program' },
      { id: 'dallascc-cyber', name: 'Cybersecurity', type: 'program' },
    ]
  },
  {
    id: 'alamocc',
    name: 'Alamo Colleges District',
    type: 'community_college',
    classification: 'Community College',
    location: 'San Antonio, TX',
    subunits: [
      { id: 'alamocc-stem', name: 'STEM Pathways', type: 'division' },
      { id: 'alamocc-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'alamocc-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Florida Community Colleges
  {
    id: 'mdc',
    name: 'Miami Dade College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Miami, FL',
    subunits: [
      { id: 'mdc-stem', name: 'School of Science', type: 'division' },
      { id: 'mdc-cs', name: 'School of Engineering & Technology', type: 'program' },
      { id: 'mdc-cyber', name: 'Cybersecurity', type: 'program' },
      { id: 'mdc-ai', name: 'Artificial Intelligence', type: 'program' },
    ]
  },
  {
    id: 'valencia',
    name: 'Valencia College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Orlando, FL',
    subunits: [
      { id: 'valencia-stem', name: 'STEM Division', type: 'division' },
      { id: 'valencia-cs', name: 'Computer Programming', type: 'program' },
      { id: 'valencia-eng', name: 'Engineering Technology', type: 'program' },
    ]
  },
  {
    id: 'broward',
    name: 'Broward College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Fort Lauderdale, FL',
    subunits: [
      { id: 'broward-stem', name: 'STEM Institute', type: 'division' },
      { id: 'broward-cs', name: 'Computer Science & Information Technology', type: 'program' },
      { id: 'broward-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // New York Community Colleges
  {
    id: 'cuny-laguardia',
    name: 'LaGuardia Community College (CUNY)',
    type: 'community_college',
    classification: 'Community College',
    location: 'Long Island City, NY',
    subunits: [
      { id: 'cuny-laguardia-stem', name: 'Natural Sciences', type: 'division' },
      { id: 'cuny-laguardia-cs', name: 'Computer Science', type: 'program' },
      { id: 'cuny-laguardia-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'cuny-bmcc',
    name: 'Borough of Manhattan Community College (CUNY)',
    type: 'community_college',
    classification: 'Community College',
    location: 'New York, NY',
    subunits: [
      { id: 'cuny-bmcc-stem', name: 'Science', type: 'division' },
      { id: 'cuny-bmcc-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'cuny-bmcc-eng', name: 'Engineering Science', type: 'program' },
    ]
  },
  {
    id: 'suny-suffolk',
    name: 'Suffolk County Community College (SUNY)',
    type: 'community_college',
    classification: 'Community College',
    location: 'Selden, NY',
    subunits: [
      { id: 'suny-suffolk-stem', name: 'STEM Division', type: 'division' },
      { id: 'suny-suffolk-cs', name: 'Computer Science', type: 'program' },
      { id: 'suny-suffolk-eng', name: 'Engineering Science', type: 'program' },
    ]
  },
  {
    id: 'suny-nassau',
    name: 'Nassau Community College (SUNY)',
    type: 'community_college',
    classification: 'Community College',
    location: 'Garden City, NY',
    subunits: [
      { id: 'suny-nassau-stem', name: 'STEM Division', type: 'division' },
      { id: 'suny-nassau-cs', name: 'Computer Science', type: 'program' },
      { id: 'suny-nassau-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Virginia & DC Area Community Colleges
  {
    id: 'nova',
    name: 'Northern Virginia Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Annandale, VA',
    subunits: [
      { id: 'nova-stem', name: 'Science, Technology, Engineering & Math', type: 'division' },
      { id: 'nova-cs', name: 'Information Technology', type: 'program' },
      { id: 'nova-eng', name: 'Engineering', type: 'program' },
      { id: 'nova-cyber', name: 'Cybersecurity', type: 'program' },
    ]
  },
  {
    id: 'tcc-va',
    name: 'Tidewater Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Norfolk, VA',
    subunits: [
      { id: 'tcc-va-stem', name: 'STEM Division', type: 'division' },
      { id: 'tcc-va-cs', name: 'Information Systems Technology', type: 'program' },
      { id: 'tcc-va-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Illinois Community Colleges
  {
    id: 'citycolleges',
    name: 'City Colleges of Chicago',
    type: 'community_college',
    classification: 'Community College',
    location: 'Chicago, IL',
    subunits: [
      { id: 'citycolleges-stem', name: 'STEM Center', type: 'division' },
      { id: 'citycolleges-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'citycolleges-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'collegeofdupagepub',
    name: 'College of DuPage',
    type: 'community_college',
    classification: 'Community College',
    location: 'Glen Ellyn, IL',
    subunits: [
      { id: 'collegeofdupagepub-stem', name: 'Science, Technology, Engineering & Mathematics', type: 'division' },
      { id: 'collegeofdupagepub-cs', name: 'Computer & Information Science', type: 'program' },
      { id: 'collegeofdupagepub-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Ohio Community Colleges
  {
    id: 'cuyahogacc',
    name: 'Cuyahoga Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Cleveland, OH',
    subunits: [
      { id: 'cuyahogacc-stem', name: 'Science & Health Careers', type: 'division' },
      { id: 'cuyahogacc-cs', name: 'Information Technology', type: 'program' },
      { id: 'cuyahogacc-eng', name: 'Engineering Technology', type: 'program' },
    ]
  },
  {
    id: 'columbusstate',
    name: 'Columbus State Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Columbus, OH',
    subunits: [
      { id: 'columbusstate-stem', name: 'Engineering & Technology', type: 'division' },
      { id: 'columbusstate-cs', name: 'Computer Science', type: 'program' },
      { id: 'columbusstate-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Arizona Community Colleges
  {
    id: 'maricopa',
    name: 'Maricopa Community Colleges',
    type: 'community_college',
    classification: 'Community College',
    location: 'Phoenix, AZ',
    subunits: [
      { id: 'maricopa-stem', name: 'STEM Programs', type: 'division' },
      { id: 'maricopa-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'maricopa-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'pimacc',
    name: 'Pima Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Tucson, AZ',
    subunits: [
      { id: 'pimacc-stem', name: 'Science & Engineering', type: 'division' },
      { id: 'pimacc-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'pimacc-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Washington State Community Colleges
  {
    id: 'bcc',
    name: 'Bellevue College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Bellevue, WA',
    subunits: [
      { id: 'bcc-stem', name: 'Science Division', type: 'division' },
      { id: 'bcc-cs', name: 'Computer Science', type: 'program' },
      { id: 'bcc-eng', name: 'Engineering', type: 'program' },
      { id: 'bcc-cyber', name: 'Cybersecurity', type: 'program' },
    ]
  },
  {
    id: 'greenrivercc',
    name: 'Green River College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Auburn, WA',
    subunits: [
      { id: 'greenrivercc-stem', name: 'Science & Mathematics', type: 'division' },
      { id: 'greenrivercc-cs', name: 'Computer Science', type: 'program' },
      { id: 'greenrivercc-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Colorado Community Colleges
  {
    id: 'ccaurora',
    name: 'Community College of Aurora',
    type: 'community_college',
    classification: 'Community College',
    location: 'Aurora, CO',
    subunits: [
      { id: 'ccaurora-stem', name: 'STEM Division', type: 'division' },
      { id: 'ccaurora-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'ccaurora-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'frontrangecc',
    name: 'Front Range Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Westminster, CO',
    subunits: [
      { id: 'frontrangecc-stem', name: 'STEM', type: 'division' },
      { id: 'frontrangecc-cs', name: 'Computer Science', type: 'program' },
      { id: 'frontrangecc-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // North Carolina Community Colleges
  {
    id: 'cpcc',
    name: 'Central Piedmont Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Charlotte, NC',
    subunits: [
      { id: 'cpcc-stem', name: 'STEM Division', type: 'division' },
      { id: 'cpcc-cs', name: 'Computer Technology Integration', type: 'program' },
      { id: 'cpcc-eng', name: 'Engineering Technology', type: 'program' },
    ]
  },
  {
    id: 'waketech',
    name: 'Wake Technical Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Raleigh, NC',
    subunits: [
      { id: 'waketech-stem', name: 'Applied Engineering & Technologies', type: 'division' },
      { id: 'waketech-cs', name: 'Computer Technology', type: 'program' },
      { id: 'waketech-eng', name: 'Engineering', type: 'program' },
      { id: 'waketech-bio', name: 'Biotechnology', type: 'program' },
    ]
  },
  // New Mexico Community Colleges (near National Labs)
  {
    id: 'cnm',
    name: 'Central New Mexico Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Albuquerque, NM',
    subunits: [
      { id: 'cnm-stem', name: 'STEM Pathways', type: 'division' },
      { id: 'cnm-cs', name: 'Computer Information Systems', type: 'program' },
      { id: 'cnm-eng', name: 'Engineering Technologies', type: 'program' },
      { id: 'cnm-trades', name: 'Skilled Trades', type: 'program' },
    ]
  },
  // Tennessee Community Colleges (near ORNL)
  {
    id: 'pellissippi',
    name: 'Pellissippi State Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Knoxville, TN',
    subunits: [
      { id: 'pellissippi-stem', name: 'Mathematics & Sciences', type: 'division' },
      { id: 'pellissippi-cs', name: 'Computer Information Technology', type: 'program' },
      { id: 'pellissippi-eng', name: 'Engineering Systems Technology', type: 'program' },
    ]
  },
  {
    id: 'roanestate',
    name: 'Roane State Community College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Harriman, TN',
    subunits: [
      { id: 'roanestate-stem', name: 'Mathematics & Sciences', type: 'division' },
      { id: 'roanestate-cs', name: 'Computer Information Technology', type: 'program' },
      { id: 'roanestate-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // Idaho Community Colleges (near INL)
  {
    id: 'cwi',
    name: 'College of Western Idaho',
    type: 'community_college',
    classification: 'Community College',
    location: 'Nampa, ID',
    subunits: [
      { id: 'cwi-stem', name: 'STEM Pathways', type: 'division' },
      { id: 'cwi-cs', name: 'Computer Science', type: 'program' },
      { id: 'cwi-eng', name: 'Engineering', type: 'program' },
    ]
  },
  {
    id: 'cei',
    name: 'College of Eastern Idaho',
    type: 'community_college',
    classification: 'Community College',
    location: 'Idaho Falls, ID',
    subunits: [
      { id: 'cei-stem', name: 'STEM Programs', type: 'division' },
      { id: 'cei-cs', name: 'Computer Science', type: 'program' },
      { id: 'cei-nuc', name: 'Nuclear Operations Technology', type: 'program' },
      { id: 'cei-eng', name: 'Engineering', type: 'program' },
    ]
  },
  // South Carolina Community Colleges (near SRS)
  {
    id: 'atc',
    name: 'Aiken Technical College',
    type: 'community_college',
    classification: 'Community College',
    location: 'Graniteville, SC',
    subunits: [
      { id: 'atc-stem', name: 'STEM Division', type: 'division' },
      { id: 'atc-cs', name: 'Computer Technology', type: 'program' },
      { id: 'atc-eng', name: 'Engineering Technology', type: 'program' },
      { id: 'atc-nuc', name: 'Nuclear Quality Systems', type: 'program' },
    ]
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Get all organizations by type
export const getOrganizationsByType = (type: 'university' | 'community_college' | 'national_lab' | 'federal_agency'): Organization[] => {
  switch (type) {
    case 'university':
      return universities;
    case 'community_college':
      return communityColleges;
    case 'national_lab':
      return nationalLabs;
    case 'federal_agency':
      return federalAgencies;
    default:
      return [];
  }
};

// Get all educational institutions (universities + community colleges)
export const getAllEducationalInstitutions = (): Organization[] => {
  return [...universities, ...communityColleges];
};

// Search organizations by name (case-insensitive)
export const searchOrganizations = (
  query: string,
  type?: 'university' | 'community_college' | 'national_lab' | 'federal_agency' | 'education'
): Organization[] => {
  const searchQuery = query.toLowerCase().trim();
  if (!searchQuery) return [];

  let orgs: Organization[] = [];

  if (type === 'education') {
    orgs = getAllEducationalInstitutions();
  } else if (type) {
    orgs = getOrganizationsByType(type);
  } else {
    orgs = [...universities, ...communityColleges, ...nationalLabs, ...federalAgencies];
  }

  return orgs.filter(org =>
    org.name.toLowerCase().includes(searchQuery) ||
    org.shortName?.toLowerCase().includes(searchQuery) ||
    org.location?.toLowerCase().includes(searchQuery)
  ).slice(0, 15); // Limit results
};

// Get organization by ID
export const getOrganizationById = (id: string): Organization | undefined => {
  const allOrgs = [...universities, ...communityColleges, ...nationalLabs, ...federalAgencies];
  return allOrgs.find(org => org.id === id);
};

// Get subunits for an organization
export const getSubunits = (organizationId: string): SubUnit[] => {
  const org = getOrganizationById(organizationId);
  return org?.subunits || [];
};

// Get nested subunits (departments within a college/school)
export const getNestedSubunits = (organizationId: string, subunitId: string): SubUnit[] => {
  const org = getOrganizationById(organizationId);
  const subunit = org?.subunits?.find(s => s.id === subunitId);
  return subunit?.subunits || [];
};

// Map role to organization type
export const getRoleOrganizationType = (role: string): 'university' | 'community_college' | 'national_lab' | 'federal_agency' | 'education' | null => {
  if (role === 'educator' || role === 'partner_academic') return 'education'; // Returns both universities and community colleges
  if (role === 'partner_lab') return 'national_lab';
  if (role === 'partner_federal') return 'federal_agency';
  return null;
};

export default {
  universities,
  communityColleges,
  nationalLabs,
  federalAgencies,
  searchOrganizations,
  getOrganizationById,
  getSubunits,
  getNestedSubunits,
  getRoleOrganizationType,
  getAllEducationalInstitutions,
};
