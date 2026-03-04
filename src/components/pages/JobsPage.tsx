import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AIMetricsTooltip } from '@/components/common/AIMetricsTooltip';
import ExpertQASection from '@/components/shared/ExpertQASection';
import {
  industryAIMetrics,
  getExposureBgColor,
  getOpportunityBgColor,
  getExposureColor,
  getOpportunityColor,
} from '@/data/aiMetrics';
import { WorkforceMapContent } from './WorkforceMapPage';

// Job data type
interface JobData {
  id: number | string;
  type: string;
  title: string;
  company: string;
  industry: string;
  orgType: string;
  location: string;
  workType: string;
  salary: string;
  clearance: string;
  citizenship: string;
  experience: string;
  posted: string;
  applicants: number;
  description: string;
  skills: string[];
  logo: string;
  featured: boolean;
  source: string;
  duration?: string;
}

// Map job industry IDs to AI metrics industry codes
const jobIndustryToMetricsCode: Record<string, string> = {
  semiconductor: 'semiconductor',
  nuclear: 'nuclear',
  ai: 'ai',
  quantum: 'quantum',
  cybersecurity: 'cybersecurity',
  aerospace: 'aerospace',
  biotech: 'biotech',
  healthcare: 'healthcare',
  robotics: 'robotics',
  clean_energy: 'clean-energy',
  manufacturing: 'manufacturing',
};

// Get AI metrics for a job's industry
const getJobAIMetrics = (industry: string) => {
  const code = jobIndustryToMetricsCode[industry] || 'manufacturing';
  return industryAIMetrics[code] || industryAIMetrics['manufacturing'];
};

// Map federated listing industries to local industry codes
const mapFederatedIndustry = (industries: string[] | null): string => {
  if (!industries || industries.length === 0) return 'ai';
  const first = industries[0].toLowerCase();
  if (first.includes('nuclear') || first.includes('energy')) return 'nuclear';
  if (first.includes('semiconductor') || first.includes('chip')) return 'semiconductor';
  if (first.includes('quantum')) return 'quantum';
  if (first.includes('cyber') || first.includes('security')) return 'cybersecurity';
  if (first.includes('aerospace') || first.includes('defense')) return 'aerospace';
  if (first.includes('bio')) return 'biotech';
  if (first.includes('health') || first.includes('medical')) return 'healthcare';
  if (first.includes('robot') || first.includes('automat')) return 'robotics';
  if (first.includes('clean') || first.includes('renewable')) return 'clean_energy';
  if (first.includes('manufactur')) return 'manufacturing';
  if (first.includes('ai') || first.includes('artificial') || first.includes('software') || first.includes('data')) return 'ai';
  return 'ai';
};

// Industry sectors with icons
const industries = [
  { id: 'all', name: 'All Industries', icon: '🌐' },
  { id: 'semiconductor', name: 'Semiconductor', icon: '💎' },
  { id: 'nuclear', name: 'Nuclear Energy', icon: '☢️' },
  { id: 'ai', name: 'AI & Machine Learning', icon: '🤖' },
  { id: 'quantum', name: 'Quantum Technologies', icon: '⚛️' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️' },
  { id: 'aerospace', name: 'Aerospace & Defense', icon: '🚀' },
  { id: 'biotech', name: 'Biotechnology', icon: '🧬' },
  { id: 'healthcare', name: 'Healthcare & Medical Technology', icon: '🏥' },
  { id: 'robotics', name: 'Robotics & Automation', icon: '🦾' },
  { id: 'clean_energy', name: 'Clean Energy', icon: '⚡' },
  { id: 'manufacturing', name: 'Advanced Manufacturing', icon: '🏭' },
];

// Organization types
const organizationTypes = [
  { id: 'all', name: 'All Organizations', icon: '🏢', color: 'gray' },
  { id: 'industry', name: 'Private Industry', icon: '🏭', color: 'yellow' },
  { id: 'national_lab', name: 'National Labs', icon: '🔬', color: 'purple' },
  { id: 'academia', name: 'Academia', icon: '🎓', color: 'blue' },
  { id: 'federal', name: 'Federal Government', icon: '🏛️', color: 'green' },
  { id: 'nonprofit', name: 'Non-Profit', icon: '💚', color: 'teal' },
];

// Clearance requirements
const clearanceOptions = [
  { id: 'none', name: 'No Clearance' },
  { id: 'eligible', name: 'Able to Obtain' },
  { id: 'secret', name: 'Secret' },
  { id: 'top_secret', name: 'Top Secret' },
  { id: 'ts_sci', name: 'TS/SCI' },
  { id: 'q_clearance', name: 'Q Clearance (DOE)' },
];

// Citizenship requirements
const citizenshipOptions = [
  { id: 'any', name: 'Any' },
  { id: 'us_citizen', name: 'US Citizen Only' },
  { id: 'us_person', name: 'US Person' },
  { id: 'permanent_resident', name: 'Permanent Resident OK' },
  { id: 'visa_sponsor', name: 'Visa Sponsorship Available' },
];

// Experience levels
const experienceLevels = [
  { id: 'all', name: 'All Levels' },
  { id: 'entry', name: 'Entry Level' },
  { id: 'mid', name: 'Mid Level' },
  { id: 'senior', name: 'Senior Level' },
  { id: 'executive', name: 'Executive' },
];

// ============================================
// REAL JOB DATA - Web Crawled from Multiple Sources
// Sources: TSMC, Intel, Samsung, IBM, Google, OpenAI, Anthropic, 
// SpaceX, Lockheed Martin, ORNL, INL, Northrop Grumman, CrowdStrike, etc.
// ============================================
const realJobsData = [
  // ========== SEMICONDUCTOR JOBS (18 positions) ==========
  // Source: TSMC Arizona careers, Samsung Austin, Intel, Micron, Applied Materials
  { id: 1, type: 'job', title: 'Process Integration Engineer (PIE)', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$95,000 - $145,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '2 days ago', applicants: 156, description: 'Lead process integration for advanced 4nm/3nm node semiconductor manufacturing. Solve process issues to ensure wafer delivery and ramp up new technology.', skills: ['Photolithography', 'Etch', 'Process Control', 'Statistical Analysis', 'Yield Enhancement'], logo: '💎', featured: true, source: 'TSMC Careers' },
  { id: 2, type: 'job', title: 'Equipment Maintenance Technician', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$24 - $35/hour', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '1 week ago', applicants: 234, description: 'Maintain, warm-up and troubleshoot semiconductor manufacturing equipment. Improve operation efficiency of fab tools.', skills: ['Equipment Maintenance', 'Clean Room Protocol', 'Troubleshooting', 'Preventive Maintenance'], logo: '💎', featured: false, source: 'TSMC Careers' },
  { id: 3, type: 'job', title: 'Semiconductor Manufacturing Professional', company: 'Samsung Austin Semiconductor', industry: 'semiconductor', orgType: 'industry', location: 'Austin, TX', workType: 'onsite', salary: '$55,000 - $85,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '3 days ago', applicants: 189, description: 'Support silicon wafer manufacturing processes at world-class 14nm FinFET fab. Work in clean room environment processing WIP.', skills: ['Clean Room Protocol', 'Wafer Processing', 'Quality Control', 'Computer Literacy'], logo: '💎', featured: true, source: 'Samsung SAS Careers' },
  { id: 4, type: 'job', title: 'Senior Process Engineer - Advanced Node', company: 'Intel Corporation', industry: 'semiconductor', orgType: 'industry', location: 'Hillsboro, OR', workType: 'onsite', salary: '$130,000 - $175,000', clearance: 'none', citizenship: 'us_person', experience: 'senior', posted: '5 days ago', applicants: 87, description: 'Lead Intel 18A process development for next-gen processors. Drive yield enhancement and process optimization.', skills: ['Process Development', 'Yield Enhancement', 'DOE', 'SPC', 'EUV Lithography'], logo: '💎', featured: false, source: 'Intel Careers' },
  { id: 5, type: 'job', title: 'Fab Equipment Engineer', company: 'Micron Technology', industry: 'semiconductor', orgType: 'industry', location: 'Boise, ID', workType: 'onsite', salary: '$85,000 - $120,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 112, description: 'Maintain and optimize fab equipment for DRAM and NAND memory chip production. Lead equipment improvement projects.', skills: ['CVD', 'PVD', 'Equipment Optimization', 'Preventive Maintenance', 'Data Analysis'], logo: '💎', featured: false, source: 'Micron Careers' },
  { id: 6, type: 'job', title: 'Quality Management Engineer (AQE)', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$90,000 - $130,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 78, description: 'Support TSMC world-class quality systems. Monitor wafer fabrication, analyze parameters, apply statistical methods.', skills: ['Quality Systems', 'Statistical Methods', 'Process Monitoring', 'ISO Standards', 'Six Sigma'], logo: '💎', featured: false, source: 'TSMC Careers' },
  { id: 7, type: 'job', title: 'Software Engineer - Early Career', company: 'ASM Company', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'hybrid', salary: '$100,000 - $140,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '6 days ago', applicants: 145, description: 'Design, develop, test software for semiconductor manufacturing equipment. Work on Windows Real-time Operating Systems.', skills: ['C++', 'Python', 'Windows RT', 'Real-time Systems', 'Software Testing'], logo: '💎', featured: false, source: 'Lensa/ASM' },
  { id: 8, type: 'job', title: 'Facilities Gas & Chemical Engineer', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$85,000 - $125,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '2 weeks ago', applicants: 56, description: 'Manage gas and chemical systems for semiconductor fab. Maintain facility systems and safety management.', skills: ['Gas Systems', 'Chemical Safety', 'Facilities Engineering', 'Safety Compliance'], logo: '💎', featured: false, source: 'TSMC Careers' },
  { id: 9, type: 'job', title: 'Senior IC Design Engineer - Power Management', company: 'MaxLinear', industry: 'semiconductor', orgType: 'industry', location: 'San Jose, CA', workType: 'hybrid', salary: '$140,000 - $200,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '3 days ago', applicants: 67, description: 'Design integrated circuits for networking and connectivity solutions. Work on advanced analog mixed-signal designs.', skills: ['Verilog', 'ASIC Design', 'Power Management', 'Cadence Tools', 'SPICE'], logo: '💎', featured: false, source: 'Lensa/MaxLinear' },
  { id: 10, type: 'job', title: 'Product Engineer', company: 'Texas Instruments', industry: 'semiconductor', orgType: 'industry', location: 'Dallas, TX', workType: 'onsite', salary: '$95,000 - $135,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 123, description: 'Support product development and yield optimization for analog semiconductor products.', skills: ['Yield Analysis', 'Failure Analysis', 'Test Engineering', 'Data Analytics'], logo: '💎', featured: false, source: 'TI Careers' },
  { id: 11, type: 'job', title: 'Clean Room Operator', company: 'GlobalFoundries', industry: 'semiconductor', orgType: 'industry', location: 'Malta, NY', workType: 'onsite', salary: '$45,000 - $65,000', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '4 days ago', applicants: 198, description: 'Operate semiconductor equipment in clean room. Follow safety procedures and maintain equipment logs.', skills: ['Clean Room Protocol', 'Equipment Operation', 'Safety Procedures', 'Documentation'], logo: '💎', featured: false, source: 'GF Careers' },
  { id: 12, type: 'job', title: 'Metrology Engineer', company: 'Applied Materials', industry: 'semiconductor', orgType: 'industry', location: 'Santa Clara, CA', workType: 'onsite', salary: '$110,000 - $160,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '5 days ago', applicants: 89, description: 'Develop metrology solutions for semiconductor manufacturing. Work on optical and e-beam inspection systems.', skills: ['Metrology', 'Data Analysis', 'Process Control', 'Optics', 'Image Processing'], logo: '💎', featured: false, source: 'AMAT Careers' },
  { id: 13, type: 'job', title: 'Field Service Engineer', company: 'KLA Corporation', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$75,000 - $110,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 78, description: 'Provide on-site technical support for semiconductor inspection and metrology equipment at customer fabs.', skills: ['Field Service', 'Equipment Troubleshooting', 'Customer Support', 'Electronics'], logo: '💎', featured: false, source: 'KLA Careers' },
  { id: 14, type: 'job', title: 'Industrial/Semiconductor Electrical Designer', company: 'Burns & McDonnell', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'hybrid', salary: '$70,000 - $100,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '3 days ago', applicants: 45, description: 'Design electrical systems for semiconductor fab facilities. Create construction documentation and electrical plans.', skills: ['AutoCAD', 'Electrical Design', 'Power Systems', 'NEC Codes'], logo: '💎', featured: false, source: 'Lensa' },
  { id: 15, type: 'job', title: 'AMHS Technician - Semiconductor', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$50,000 - $75,000', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '2 weeks ago', applicants: 167, description: 'Maintain automated material handling systems (AMHS) in semiconductor fab. Support wafer transport systems.', skills: ['AMHS', 'Robotics', 'Mechanical Systems', 'PLC Programming'], logo: '💎', featured: false, source: 'TSMC Careers' },
  { id: 16, type: 'job', title: 'CIM Engineer - DevOps', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'hybrid', salary: '$95,000 - $140,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 89, description: 'Part of DevOps team tackling analytical projects and machine vision tasks. Implement ML models for production.', skills: ['Python', 'Machine Learning', 'Kubernetes', 'Azure DevOps', 'Prometheus'], logo: '💎', featured: false, source: 'Indeed/TSMC' },
  { id: 17, type: 'job', title: 'Industrial Safety & Health Engineer', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$80,000 - $115,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '5 days ago', applicants: 56, description: 'Support workplace safety and environmental sustainability in semiconductor facilities. Evaluate hazards and conduct risk assessments.', skills: ['Industrial Safety', 'Risk Assessment', 'OSHA Compliance', 'Environmental Health'], logo: '💎', featured: false, source: 'Indeed/TSMC' },
  { id: 18, type: 'job', title: 'Warehouse Management Supervisor', company: 'TSMC Arizona', industry: 'semiconductor', orgType: 'industry', location: 'Phoenix, AZ', workType: 'onsite', salary: '$65,000 - $90,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 56, description: 'Supervise warehouse operations for semiconductor fab materials and components inventory.', skills: ['Warehouse Management', 'Inventory Control', 'Leadership', 'SAP'], logo: '💎', featured: false, source: 'LinkedIn/TSMC' },

  // ========== NUCLEAR ENERGY JOBS (17 positions) ==========
  // Source: Oak Ridge National Lab, Idaho National Lab, DOE, Westinghouse, NuScale
  { id: 101, type: 'job', title: 'Nuclear Engineer - Reactor Physics', company: 'Idaho National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Idaho Falls, ID', workType: 'onsite', salary: '$95,000 - $140,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 67, description: 'Support advanced reactor research including MARVEL microreactor. Perform neutronics analysis and core design.', skills: ['MCNP', 'SCALE', 'Reactor Physics', 'Thermal Hydraulics', 'Python'], logo: '☢️', featured: true, source: 'INL Careers' },
  { id: 102, type: 'job', title: 'Health Physics Technician', company: 'Oak Ridge National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Oak Ridge, TN', workType: 'onsite', salary: '$55,000 - $80,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'entry', posted: '5 days ago', applicants: 89, description: 'Monitor radiation levels at HFIR and SNS facilities. Ensure safety compliance and ALARA principles.', skills: ['Radiation Protection', 'Dosimetry', 'Health Physics', 'ALARA', 'Contamination Control'], logo: '☢️', featured: false, source: 'ORNL Jobs' },
  { id: 103, type: 'job', title: 'Reactor Operator Trainee', company: 'Tennessee Valley Authority', industry: 'nuclear', orgType: 'federal', location: 'Spring City, TN', workType: 'onsite', salary: '$65,000 - $85,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '2 weeks ago', applicants: 234, description: 'Train to become NRC-licensed reactor operator at Watts Bar Nuclear Plant. 18-24 month training program.', skills: ['Nuclear Systems', 'Control Room Operations', 'NRC Regulations', 'Emergency Procedures'], logo: '☢️', featured: true, source: 'TVA Careers' },
  { id: 104, type: 'job', title: 'Senior Reactor Operator', company: 'Exelon Generation', industry: 'nuclear', orgType: 'industry', location: 'Morris, IL', workType: 'onsite', salary: '$120,000 - $160,000', clearance: 'none', citizenship: 'us_citizen', experience: 'senior', posted: '3 days ago', applicants: 45, description: 'Supervise control room operations at Dresden Nuclear Station. Direct reactor operator activities.', skills: ['NRC SRO License', 'Plant Operations', 'Emergency Procedures', 'Leadership'], logo: '☢️', featured: false, source: 'Exelon Careers' },
  { id: 105, type: 'job', title: 'Nuclear Safety Analyst', company: 'NuScale Power', industry: 'nuclear', orgType: 'industry', location: 'Portland, OR', workType: 'hybrid', salary: '$100,000 - $145,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 78, description: 'Perform safety analysis for VOYGR small modular reactor design. Support NRC licensing activities.', skills: ['PRA', 'Safety Analysis', 'RELAP', 'NRC Regulations', 'Technical Writing'], logo: '☢️', featured: false, source: 'NuScale Careers' },
  { id: 106, type: 'job', title: 'I&C Technician', company: 'Duke Energy', industry: 'nuclear', orgType: 'industry', location: 'Seneca, SC', workType: 'onsite', salary: '$70,000 - $95,000', clearance: 'none', citizenship: 'us_citizen', experience: 'mid', posted: '4 days ago', applicants: 67, description: 'Maintain instrumentation and control systems at Oconee Nuclear Station. Perform calibrations and testing.', skills: ['I&C Systems', 'Calibration', 'PLC', 'Electrical Systems', 'Troubleshooting'], logo: '☢️', featured: false, source: 'Duke Careers' },
  { id: 107, type: 'job', title: 'Nuclear Quality Engineer', company: 'Westinghouse Electric', industry: 'nuclear', orgType: 'industry', location: 'Cranberry Township, PA', workType: 'hybrid', salary: '$85,000 - $120,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '6 days ago', applicants: 56, description: 'Ensure quality compliance for AP1000 reactor components. Conduct supplier audits and NCR resolution.', skills: ['NQA-1', 'Quality Assurance', 'Auditing', '10CFR50 Appendix B', 'Root Cause'], logo: '☢️', featured: false, source: 'Westinghouse Careers' },
  { id: 108, type: 'job', title: 'Radiation Protection Specialist', company: 'Los Alamos National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Los Alamos, NM', workType: 'onsite', salary: '$80,000 - $115,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 45, description: 'Develop and implement radiation protection programs for plutonium facilities. Support DOE compliance.', skills: ['Health Physics', 'ALARA', 'Contamination Control', 'DOE Orders', 'Dosimetry'], logo: '☢️', featured: false, source: 'LANL Careers' },
  { id: 109, type: 'job', title: 'Nuclear Maintenance Mechanic', company: 'Dominion Energy', industry: 'nuclear', orgType: 'industry', location: 'Mineral, VA', workType: 'onsite', salary: '$65,000 - $90,000', clearance: 'none', citizenship: 'us_citizen', experience: 'mid', posted: '2 weeks ago', applicants: 123, description: 'Perform mechanical maintenance on primary and secondary systems at North Anna Nuclear Station.', skills: ['Mechanical Maintenance', 'Pumps', 'Valves', 'Rigging', 'Welding'], logo: '☢️', featured: false, source: 'Dominion Careers' },
  { id: 110, type: 'job', title: 'Nuclear Fuel Engineer', company: 'Framatome', industry: 'nuclear', orgType: 'industry', location: 'Lynchburg, VA', workType: 'hybrid', salary: '$90,000 - $130,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '5 days ago', applicants: 34, description: 'Design and analyze nuclear fuel assemblies for PWR reactors. Perform core physics calculations.', skills: ['Fuel Design', 'Neutronics', 'Core Physics', 'CASMO/SIMULATE', 'MATLAB'], logo: '☢️', featured: false, source: 'Framatome Careers' },
  { id: 111, type: 'job', title: 'Plasma-based Enrichment Scientist', company: 'Oak Ridge National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Oak Ridge, TN', workType: 'onsite', salary: '$100,000 - $150,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'senior', posted: '3 days ago', applicants: 23, description: 'Research plasma-based isotope separation technologies in Enrichment Science and Engineering Division.', skills: ['Plasma Physics', 'Isotope Separation', 'Vacuum Systems', 'Mass Spectrometry'], logo: '☢️', featured: false, source: 'Physics World Jobs/ORNL' },
  { id: 112, type: 'job', title: 'Nuclear Security Officer', company: 'Southern Nuclear', industry: 'nuclear', orgType: 'industry', location: 'Waynesboro, GA', workType: 'onsite', salary: '$50,000 - $70,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '1 week ago', applicants: 189, description: 'Protect Vogtle nuclear facility. Respond to security events and maintain access control.', skills: ['Security Operations', 'Firearms', 'Access Control', '10CFR73', 'Tactical Response'], logo: '☢️', featured: false, source: 'Southern Nuclear Careers' },
  { id: 113, type: 'job', title: 'Neutron Science Researcher', company: 'Oak Ridge National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Oak Ridge, TN', workType: 'onsite', salary: '$85,000 - $130,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 45, description: 'Conduct research using HFIR and SNS neutron scattering instruments. Support user program experiments.', skills: ['Neutron Scattering', 'Materials Science', 'Python', 'Data Analysis', 'Crystallography'], logo: '☢️', featured: false, source: 'Neutron Sciences ORNL' },
  { id: 114, type: 'job', title: 'Nuclear Chemist', company: 'Savannah River National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Aiken, SC', workType: 'onsite', salary: '$75,000 - $110,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'mid', posted: '2 weeks ago', applicants: 56, description: 'Analyze radiochemical samples for tritium and plutonium programs. Develop analytical methods.', skills: ['Radiochemistry', 'Analytical Chemistry', 'Mass Spectrometry', 'ICP-MS'], logo: '☢️', featured: false, source: 'SRNL Careers' },
  { id: 115, type: 'job', title: 'Nuclear Licensing Engineer', company: 'GE Hitachi Nuclear Energy', industry: 'nuclear', orgType: 'industry', location: 'Wilmington, NC', workType: 'hybrid', salary: '$95,000 - $135,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 34, description: 'Support NRC licensing activities for BWRX-300 small modular reactor deployment.', skills: ['NRC Regulations', 'Licensing', 'Technical Writing', 'NEPA', '10CFR52'], logo: '☢️', featured: false, source: 'GEH Careers' },
  { id: 116, type: 'job', title: 'Decommissioning Project Manager', company: 'EnergySolutions', industry: 'nuclear', orgType: 'industry', location: 'Salt Lake City, UT', workType: 'hybrid', salary: '$110,000 - $150,000', clearance: 'none', citizenship: 'us_citizen', experience: 'senior', posted: '6 days ago', applicants: 28, description: 'Manage nuclear facility decommissioning projects. Oversee waste characterization and disposal.', skills: ['Project Management', 'Decommissioning', 'Waste Management', 'Cost Control', 'PMP'], logo: '☢️', featured: false, source: 'EnergySolutions Careers' },
  { id: 117, type: 'job', title: 'Distinguished Research Fellow - Nuclear', company: 'Oak Ridge National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Oak Ridge, TN', workType: 'onsite', salary: '$150,000 - $200,000', clearance: 'none', citizenship: 'us_person', experience: 'executive', posted: '2 weeks ago', applicants: 18, description: 'Lead cutting-edge nuclear research. Represent ORNL in scientific community and advance DOE missions.', skills: ['Nuclear Physics', 'Research Leadership', 'Publications', 'Grant Writing'], logo: '☢️', featured: true, source: 'ORNL Distinguished Fellowships' },

  // ========== AI & MACHINE LEARNING JOBS (18 positions) ==========
  // Source: OpenAI, Anthropic, Google DeepMind, Meta, Microsoft, NVIDIA
  { id: 201, type: 'job', title: 'Research Scientist', company: 'OpenAI', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'hybrid', salary: '$300,000 - $500,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '2 days ago', applicants: 567, description: 'Conduct cutting-edge AI research advancing machine learning frontiers. Publish at NeurIPS, ICML, ICLR.', skills: ['Deep Learning', 'PyTorch', 'Research', 'NeurIPS Publications', 'Mathematics'], logo: '🤖', featured: true, source: 'OpenAI Careers' },
  { id: 202, type: 'job', title: 'Member of Technical Staff', company: 'Anthropic', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'hybrid', salary: '$250,000 - $450,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '3 days ago', applicants: 423, description: 'Build safe and beneficial AI systems. Work on Claude model development and AI safety research.', skills: ['Python', 'ML Systems', 'LLMs', 'AI Safety', 'Distributed Systems'], logo: '🤖', featured: true, source: 'Anthropic Careers' },
  { id: 203, type: 'job', title: 'Machine Learning Engineer', company: 'Meta AI', industry: 'ai', orgType: 'industry', location: 'Menlo Park, CA', workType: 'hybrid', salary: '$180,000 - $350,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '1 week ago', applicants: 789, description: 'Build and deploy ML models at massive scale for Llama and recommendation systems.', skills: ['PyTorch', 'TensorFlow', 'Distributed Systems', 'Python', 'C++'], logo: '🤖', featured: false, source: 'Meta Careers' },
  { id: 204, type: 'job', title: 'AI Research Engineer', company: 'Google DeepMind', industry: 'ai', orgType: 'industry', location: 'Mountain View, CA', workType: 'hybrid', salary: '$200,000 - $400,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '4 days ago', applicants: 345, description: 'Research and develop advanced AI algorithms for Gemini and AlphaFold projects.', skills: ['JAX', 'Reinforcement Learning', 'Neural Networks', 'Research', 'TensorFlow'], logo: '🤖', featured: false, source: 'DeepMind Careers' },
  { id: 205, type: 'job', title: 'Applied ML Scientist', company: 'Amazon AWS', industry: 'ai', orgType: 'industry', location: 'Seattle, WA', workType: 'hybrid', salary: '$160,000 - $300,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '5 days ago', applicants: 456, description: 'Apply ML to solve real-world problems at scale using SageMaker and Bedrock.', skills: ['SageMaker', 'Python', 'Deep Learning', 'MLOps', 'AWS'], logo: '🤖', featured: false, source: 'Amazon Jobs' },
  { id: 206, type: 'job', title: 'NLP Engineer - Copilot', company: 'Microsoft', industry: 'ai', orgType: 'industry', location: 'Redmond, WA', workType: 'hybrid', salary: '$150,000 - $250,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '3 days ago', applicants: 234, description: 'Build natural language processing systems for Microsoft Copilot and Azure AI services.', skills: ['NLP', 'Transformers', 'Python', 'Azure ML', 'LLMs'], logo: '🤖', featured: false, source: 'Microsoft Careers' },
  { id: 207, type: 'job', title: 'Computer Vision Engineer', company: 'NVIDIA', industry: 'ai', orgType: 'industry', location: 'Santa Clara, CA', workType: 'hybrid', salary: '$170,000 - $280,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '1 week ago', applicants: 289, description: 'Develop computer vision algorithms for autonomous vehicles and robotics using CUDA.', skills: ['CUDA', 'OpenCV', 'CNNs', 'C++', 'TensorRT'], logo: '🤖', featured: false, source: 'NVIDIA Careers' },
  { id: 208, type: 'job', title: 'AI Safety Researcher', company: 'Anthropic', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'hybrid', salary: '$220,000 - $380,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '2 days ago', applicants: 167, description: 'Research methods to make AI systems safe and aligned. Work on interpretability and constitutional AI.', skills: ['AI Safety', 'Interpretability', 'Research', 'Python', 'Mathematics'], logo: '🤖', featured: true, source: 'Anthropic Careers' },
  { id: 209, type: 'job', title: 'Data Scientist - Apple Intelligence', company: 'Apple', industry: 'ai', orgType: 'industry', location: 'Cupertino, CA', workType: 'hybrid', salary: '$140,000 - $220,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '6 days ago', applicants: 567, description: 'Apply data science to improve Siri and Apple Intelligence features.', skills: ['Python', 'SQL', 'ML', 'Statistics', 'On-Device ML'], logo: '🤖', featured: false, source: 'Apple Jobs' },
  { id: 210, type: 'job', title: 'MLOps Engineer', company: 'Databricks', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'remote', salary: '$150,000 - $230,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '4 days ago', applicants: 345, description: 'Build and maintain ML infrastructure and pipelines using MLflow and Spark.', skills: ['MLflow', 'Spark', 'Kubernetes', 'Python', 'Delta Lake'], logo: '🤖', featured: false, source: 'Databricks Careers' },
  { id: 211, type: 'job', title: 'Robotics ML Engineer', company: 'Tesla', industry: 'ai', orgType: 'industry', location: 'Palo Alto, CA', workType: 'onsite', salary: '$160,000 - $280,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 678, description: 'Develop ML for Autopilot and Optimus robot using neural networks for perception and planning.', skills: ['Computer Vision', 'PyTorch', 'C++', 'Robotics', 'Sensor Fusion'], logo: '🤖', featured: false, source: 'Tesla Careers' },
  { id: 212, type: 'job', title: 'AI Product Manager', company: 'Salesforce', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'hybrid', salary: '$180,000 - $280,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '3 days ago', applicants: 234, description: 'Lead AI product strategy for Einstein and Agentforce platforms.', skills: ['Product Management', 'AI/ML', 'Strategy', 'Stakeholder Management'], logo: '🤖', featured: false, source: 'Salesforce Careers' },
  { id: 213, type: 'job', title: 'Generative AI Engineer', company: 'Adobe', industry: 'ai', orgType: 'industry', location: 'San Jose, CA', workType: 'hybrid', salary: '$150,000 - $250,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '5 days ago', applicants: 456, description: 'Build generative AI features for Firefly and Creative Cloud applications.', skills: ['Diffusion Models', 'GANs', 'Python', 'Creative AI', 'PyTorch'], logo: '🤖', featured: false, source: 'Adobe Careers' },
  { id: 214, type: 'job', title: 'OpenAI Resident', company: 'OpenAI', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'onsite', salary: '$18,300/month', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '2 weeks ago', applicants: 2345, description: '6-month residency program working alongside research teams on ambitious AI projects.', skills: ['Python', 'ML', 'Research', 'Mathematics', 'Programming'], logo: '🤖', featured: false, source: 'Business Insider/OpenAI' },
  { id: 215, type: 'job', title: 'Deep Learning Engineer', company: 'Scale AI', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'hybrid', salary: '$180,000 - $300,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '4 days ago', applicants: 289, description: 'Build deep learning systems for data labeling and RLHF pipelines.', skills: ['PyTorch', 'Computer Vision', 'NLP', 'Python', 'RLHF'], logo: '🤖', featured: false, source: 'Scale AI Careers' },
  { id: 216, type: 'job', title: 'AI Infrastructure Engineer', company: 'Cerebras Systems', industry: 'ai', orgType: 'industry', location: 'Sunnyvale, CA', workType: 'onsite', salary: '$160,000 - $260,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 145, description: 'Build infrastructure for wafer-scale AI chip development and training systems.', skills: ['Distributed Systems', 'HPC', 'Python', 'C++', 'CUDA'], logo: '🤖', featured: false, source: 'Cerebras Careers' },
  { id: 217, type: 'job', title: 'Research Engineer - LLMs', company: 'Cohere', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'hybrid', salary: '$170,000 - $280,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '3 days ago', applicants: 234, description: 'Develop and optimize large language models for enterprise applications.', skills: ['LLMs', 'PyTorch', 'Transformers', 'Python', 'NLP'], logo: '🤖', featured: false, source: 'Cohere Careers' },
  { id: 218, type: 'job', title: 'Chief AI Officer', company: 'Fortune 500 Company', industry: 'ai', orgType: 'industry', location: 'New York, NY', workType: 'hybrid', salary: '$400,000 - $650,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'executive', posted: '1 week ago', applicants: 89, description: 'Set AI strategy for entire organization. Lead AI transformation initiatives.', skills: ['AI Strategy', 'Executive Leadership', 'Digital Transformation', 'Team Building'], logo: '🤖', featured: true, source: 'Analytics Insight' },

  // ========== QUANTUM TECHNOLOGIES JOBS (16 positions) ==========
  // Source: IBM Quantum, Google Quantum AI, IonQ, Rigetti, Amazon Braket
  { id: 301, type: 'job', title: 'Quantum Software Engineer', company: 'IBM Quantum', industry: 'quantum', orgType: 'industry', location: 'Yorktown Heights, NY', workType: 'hybrid', salary: '$140,000 - $200,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '3 days ago', applicants: 89, description: 'Develop quantum software and Qiskit ecosystem. Build tools for 1000+ qubit systems.', skills: ['Qiskit', 'Python', 'Quantum Algorithms', 'Linear Algebra', 'Software Engineering'], logo: '⚛️', featured: true, source: 'IBM Careers' },
  { id: 302, type: 'job', title: 'Quantum Research Scientist', company: 'Google Quantum AI', industry: 'quantum', orgType: 'industry', location: 'Santa Barbara, CA', workType: 'onsite', salary: '$180,000 - $280,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '1 week ago', applicants: 67, description: 'Research quantum error correction for fault-tolerant quantum computing using Sycamore processor.', skills: ['Quantum Technologies', 'Physics', 'Cirq', 'Research', 'Error Correction'], logo: '⚛️', featured: true, source: 'Google Careers' },
  { id: 303, type: 'job', title: 'Quantum Hardware Engineer', company: 'IonQ', industry: 'quantum', orgType: 'industry', location: 'College Park, MD', workType: 'onsite', salary: '$120,000 - $180,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 45, description: 'Design and build trapped ion quantum systems. Improve gate fidelities and qubit coherence.', skills: ['Ion Traps', 'Optics', 'Vacuum Systems', 'Electronics', 'RF Engineering'], logo: '⚛️', featured: false, source: 'IonQ Careers' },
  { id: 304, type: 'job', title: 'Quantum Algorithm Developer', company: 'Rigetti Computing', industry: 'quantum', orgType: 'industry', location: 'Berkeley, CA', workType: 'hybrid', salary: '$130,000 - $190,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '5 days ago', applicants: 56, description: 'Develop and implement quantum algorithms on Rigetti QPU using Forest SDK.', skills: ['Quil', 'Python', 'Quantum Algorithms', 'Linear Algebra', 'Optimization'], logo: '⚛️', featured: false, source: 'Rigetti Careers' },
  { id: 305, type: 'job', title: 'Quantum Applications Scientist', company: 'Amazon Braket', industry: 'quantum', orgType: 'industry', location: 'Seattle, WA', workType: 'hybrid', salary: '$150,000 - $220,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '3 days ago', applicants: 78, description: 'Develop quantum applications for AWS customers using Amazon Braket service.', skills: ['Amazon Braket', 'Python', 'Quantum Technologies', 'Cloud', 'Customer Solutions'], logo: '⚛️', featured: false, source: 'Amazon Jobs' },
  { id: 306, type: 'job', title: 'Quantum Control Engineer', company: 'Atom Computing', industry: 'quantum', orgType: 'industry', location: 'Boulder, CO', workType: 'onsite', salary: '$110,000 - $160,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 34, description: 'Develop control systems for 1000+ qubit neutral atom quantum computers.', skills: ['Control Systems', 'FPGA', 'Python', 'Optics', 'Real-time Systems'], logo: '⚛️', featured: false, source: 'ZipRecruiter' },
  { id: 307, type: 'job', title: 'Quantum Error Correction Researcher', company: 'Microsoft Quantum', industry: 'quantum', orgType: 'industry', location: 'Redmond, WA', workType: 'hybrid', salary: '$160,000 - $240,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '2 days ago', applicants: 45, description: 'Research topological quantum error correction for Azure Quantum.', skills: ['Quantum Error Correction', 'Q#', 'Physics', 'Research', 'Topology'], logo: '⚛️', featured: false, source: 'Microsoft Careers' },
  { id: 308, type: 'job', title: 'Cryogenic Engineer', company: 'PsiQuantum', industry: 'quantum', orgType: 'industry', location: 'Palo Alto, CA', workType: 'onsite', salary: '$100,000 - $150,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '6 days ago', applicants: 28, description: 'Design cryogenic systems for photonic quantum computer at manufacturing scale.', skills: ['Cryogenics', 'Vacuum Systems', 'Mechanical Engineering', 'Thermodynamics'], logo: '⚛️', featured: false, source: 'PsiQuantum Careers' },
  { id: 309, type: 'job', title: 'Quantum Machine Learning Researcher', company: 'Xanadu', industry: 'quantum', orgType: 'industry', location: 'Toronto, ON (Remote US)', workType: 'remote', salary: '$120,000 - $180,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '4 days ago', applicants: 67, description: 'Research quantum machine learning algorithms using PennyLane framework.', skills: ['PennyLane', 'ML', 'Quantum Technologies', 'Python', 'Research'], logo: '⚛️', featured: false, source: 'Xanadu Careers' },
  { id: 310, type: 'job', title: 'Quantum Network Engineer', company: 'Cisco Quantum', industry: 'quantum', orgType: 'industry', location: 'San Jose, CA', workType: 'hybrid', salary: '$130,000 - $190,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 34, description: 'Develop quantum networking protocols and QKD systems for secure communications.', skills: ['Quantum Networks', 'QKD', 'Networking', 'Python', 'Cryptography'], logo: '⚛️', featured: false, source: 'ZipRecruiter' },
  { id: 311, type: 'job', title: 'Quantum Physics Postdoc', company: 'Sandia National Laboratories', industry: 'quantum', orgType: 'national_lab', location: 'Albuquerque, NM', workType: 'onsite', salary: '$80,000 - $100,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'entry', posted: '2 weeks ago', applicants: 56, description: 'Conduct quantum physics research for national security applications.', skills: ['Physics', 'Quantum Systems', 'Research', 'Publications', 'Security'], logo: '⚛️', featured: false, source: 'Sandia Careers' },
  { id: 312, type: 'job', title: 'Quantum Systems Engineer', company: 'Honeywell Quantinuum', industry: 'quantum', orgType: 'industry', location: 'Broomfield, CO', workType: 'onsite', salary: '$120,000 - $170,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '5 days ago', applicants: 45, description: 'Integrate quantum systems and subsystems for H-Series quantum computers.', skills: ['Systems Engineering', 'Quantum Hardware', 'Testing', 'Integration'], logo: '⚛️', featured: false, source: 'Quantinuum Careers' },
  { id: 313, type: 'job', title: 'Quantum Algorithms Lead', company: 'JPMorgan Chase', industry: 'quantum', orgType: 'industry', location: 'New York, NY', workType: 'hybrid', salary: '$180,000 - $280,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '3 days ago', applicants: 78, description: 'Lead quantum algorithms research for financial optimization and Monte Carlo methods.', skills: ['Quantum Algorithms', 'Finance', 'Optimization', 'Python', 'Research'], logo: '⚛️', featured: false, source: 'JPMC Careers' },
  { id: 314, type: 'job', title: 'Quantum Firmware Engineer', company: 'D-Wave Systems', industry: 'quantum', orgType: 'industry', location: 'Burnaby, BC (Remote US)', workType: 'remote', salary: '$110,000 - $160,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '1 week ago', applicants: 34, description: 'Develop firmware for quantum annealing systems with 5000+ qubits.', skills: ['Embedded Systems', 'C/C++', 'FPGA', 'Python', 'Low-level Programming'], logo: '⚛️', featured: false, source: 'D-Wave Careers' },
  { id: 315, type: 'job', title: 'Quantum Education Specialist', company: 'IBM Quantum', industry: 'quantum', orgType: 'industry', location: 'Remote', workType: 'remote', salary: '$80,000 - $120,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '2 weeks ago', applicants: 123, description: 'Develop quantum computing educational content for IBM Quantum Learning platform.', skills: ['Qiskit', 'Education', 'Technical Writing', 'Python', 'Communication'], logo: '⚛️', featured: false, source: 'IBM Quantum Learning' },
  { id: 316, type: 'job', title: 'Senior Quantum Physicist', company: 'QuEra Computing', industry: 'quantum', orgType: 'industry', location: 'Boston, MA', workType: 'onsite', salary: '$140,000 - $200,000', clearance: 'none', citizenship: 'us_person', experience: 'senior', posted: '4 days ago', applicants: 38, description: 'Lead neutral atom quantum computing research. Develop new qubit architectures.', skills: ['Atomic Physics', 'Quantum Technologies', 'Optics', 'Research', 'Python'], logo: '⚛️', featured: false, source: 'QuEra Careers' },

  // ========== CYBERSECURITY JOBS (17 positions) ==========
  // Source: Northrop Grumman, NSA, CISA, CrowdStrike, Booz Allen Hamilton
  { id: 401, type: 'job', title: 'Cybersecurity Analyst', company: 'Northrop Grumman', industry: 'cybersecurity', orgType: 'industry', location: 'McLean, VA', workType: 'hybrid', salary: '$95,000 - $135,000', clearance: 'ts_sci', citizenship: 'us_citizen', experience: 'mid', posted: '2 days ago', applicants: 234, description: 'Analyze cyber threats and protect defense systems. Support DoD cybersecurity operations.', skills: ['SIEM', 'Threat Analysis', 'Incident Response', 'Security+', 'Splunk'], logo: '🛡️', featured: true, source: 'Glassdoor/Northrop' },
  { id: 402, type: 'job', title: 'Cyber Information Security Analyst', company: 'NSA', industry: 'cybersecurity', orgType: 'federal', location: 'Fort Meade, MD', workType: 'onsite', salary: '$80,000 - $130,000', clearance: 'ts_sci', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 456, description: 'Protect national security information systems. Support cybersecurity defense operations.', skills: ['Security Analysis', 'Network Security', 'Cryptography', 'Intelligence'], logo: '🛡️', featured: true, source: 'CyberSecurityEducation' },
  { id: 403, type: 'job', title: 'Penetration Tester', company: 'CrowdStrike', industry: 'cybersecurity', orgType: 'industry', location: 'Austin, TX', workType: 'remote', salary: '$120,000 - $180,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '3 days ago', applicants: 189, description: 'Conduct offensive security assessments for enterprise clients. Red team operations.', skills: ['Penetration Testing', 'Kali Linux', 'Python', 'OSCP', 'Burp Suite'], logo: '🛡️', featured: false, source: 'CrowdStrike Careers' },
  { id: 404, type: 'job', title: 'SOC Analyst', company: 'Booz Allen Hamilton', industry: 'cybersecurity', orgType: 'industry', location: 'Annapolis Junction, MD', workType: 'onsite', salary: '$85,000 - $120,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'entry', posted: '5 days ago', applicants: 345, description: 'Monitor and respond to security incidents in 24/7 Security Operations Center.', skills: ['SOC Operations', 'Splunk', 'Incident Response', 'SIEM', 'Triage'], logo: '🛡️', featured: false, source: 'CyberSecurityEducation' },
  { id: 405, type: 'job', title: 'Cloud Security Engineer', company: 'Palo Alto Networks', industry: 'cybersecurity', orgType: 'industry', location: 'Santa Clara, CA', workType: 'hybrid', salary: '$150,000 - $220,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '4 days ago', applicants: 167, description: 'Secure cloud infrastructure using Prisma Cloud. Develop cloud security solutions.', skills: ['AWS Security', 'Prisma Cloud', 'Terraform', 'Python', 'Kubernetes'], logo: '🛡️', featured: false, source: 'Palo Alto Careers' },
  { id: 406, type: 'job', title: 'Malware Analyst', company: 'Mandiant (Google Cloud)', industry: 'cybersecurity', orgType: 'industry', location: 'Reston, VA', workType: 'hybrid', salary: '$110,000 - $160,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 89, description: 'Reverse engineer malware and analyze APT threats. Support incident response.', skills: ['Reverse Engineering', 'IDA Pro', 'Assembly', 'Python', 'Threat Intelligence'], logo: '🛡️', featured: false, source: 'Mandiant Careers' },
  { id: 407, type: 'job', title: 'Cybersecurity Policy Analyst', company: 'CISA', industry: 'cybersecurity', orgType: 'federal', location: 'Arlington, VA', workType: 'hybrid', salary: '$90,000 - $140,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '6 days ago', applicants: 234, description: 'Develop cybersecurity policy for critical infrastructure sectors.', skills: ['Policy Analysis', 'Risk Management', 'NIST Framework', 'Critical Infrastructure'], logo: '🛡️', featured: false, source: 'CyberSecurityEducation' },
  { id: 408, type: 'job', title: 'Security Engineer', company: 'Lockheed Martin', industry: 'cybersecurity', orgType: 'industry', location: 'Bethesda, MD', workType: 'onsite', salary: '$100,000 - $150,000', clearance: 'top_secret', citizenship: 'us_citizen', experience: 'mid', posted: '3 days ago', applicants: 178, description: 'Engineer security solutions for defense and space systems.', skills: ['Security Engineering', 'Network Security', 'Linux', 'Python', 'NIST 800-53'], logo: '🛡️', featured: false, source: 'Lockheed Careers' },
  { id: 409, type: 'job', title: 'Threat Intelligence Analyst', company: 'Recorded Future', industry: 'cybersecurity', orgType: 'industry', location: 'Boston, MA', workType: 'hybrid', salary: '$95,000 - $140,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '2 weeks ago', applicants: 145, description: 'Analyze and report on cyber threat intelligence using AI-powered platform.', skills: ['Threat Intelligence', 'OSINT', 'Analysis', 'Reporting', 'MITRE ATT&CK'], logo: '🛡️', featured: false, source: 'Recorded Future Careers' },
  { id: 410, type: 'job', title: 'Application Security Engineer', company: 'Goldman Sachs', industry: 'cybersecurity', orgType: 'industry', location: 'New York, NY', workType: 'hybrid', salary: '$140,000 - $200,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '4 days ago', applicants: 234, description: 'Secure financial applications and trading infrastructure. Lead AppSec program.', skills: ['AppSec', 'SAST/DAST', 'Python', 'Cloud Security', 'DevSecOps'], logo: '🛡️', featured: false, source: 'Goldman Sachs Careers' },
  { id: 411, type: 'job', title: 'Cyber Operations Specialist', company: 'US Cyber Command', industry: 'cybersecurity', orgType: 'federal', location: 'Fort Meade, MD', workType: 'onsite', salary: '$85,000 - $130,000', clearance: 'ts_sci', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 189, description: 'Conduct cyber operations for national defense. Support offensive and defensive missions.', skills: ['Cyber Operations', 'Network Exploitation', 'Security', 'Scripting'], logo: '🛡️', featured: false, source: 'USAJobs' },
  { id: 412, type: 'job', title: 'Digital Forensics Analyst', company: 'SAIC', industry: 'cybersecurity', orgType: 'industry', location: 'Reston, VA', workType: 'onsite', salary: '$90,000 - $135,000', clearance: 'top_secret', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 123, description: 'Conduct digital forensics investigations for federal clients apply chain of custody.', skills: ['EnCase', 'FTK', 'Digital Forensics', 'Chain of Custody', 'Court Testimony'], logo: '🛡️', featured: false, source: 'SAIC Careers' },
  { id: 413, type: 'job', title: 'Identity and Access Management Engineer', company: 'Deloitte', industry: 'cybersecurity', orgType: 'industry', location: 'Washington, DC', workType: 'hybrid', salary: '$100,000 - $150,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '3 days ago', applicants: 156, description: 'Implement IAM solutions for federal clients using Okta and Azure AD.', skills: ['IAM', 'Okta', 'Azure AD', 'SAML/OAuth', 'Zero Trust'], logo: '🛡️', featured: false, source: 'Deloitte Careers' },
  { id: 414, type: 'job', title: 'Red Team Operator', company: 'Raytheon', industry: 'cybersecurity', orgType: 'industry', location: 'Dulles, VA', workType: 'onsite', salary: '$130,000 - $180,000', clearance: 'ts_sci', citizenship: 'us_citizen', experience: 'senior', posted: '1 week ago', applicants: 67, description: 'Conduct red team operations against DoD networks. Develop custom tools and TTPs.', skills: ['Red Teaming', 'Cobalt Strike', 'Exploitation', 'Evasion', 'C2'], logo: '🛡️', featured: false, source: 'Raytheon Careers' },
  { id: 415, type: 'job', title: 'Vulnerability Management Analyst', company: 'Capital One', industry: 'cybersecurity', orgType: 'industry', location: 'McLean, VA', workType: 'hybrid', salary: '$95,000 - $140,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '6 days ago', applicants: 234, description: 'Manage vulnerability scanning and remediation for financial infrastructure.', skills: ['Vulnerability Management', 'Qualys', 'Tenable', 'Risk Assessment', 'Patch Management'], logo: '🛡️', featured: false, source: 'Capital One Careers' },
  { id: 416, type: 'job', title: 'Cyber Information Assurance Analyst', company: 'Northrop Grumman', industry: 'cybersecurity', orgType: 'industry', location: 'San Diego, CA', workType: 'onsite', salary: '$110,000 - $156,000', clearance: 'ts_sci', citizenship: 'us_citizen', experience: 'mid', posted: '4 days ago', applicants: 123, description: 'Support information assurance for naval systems. Ensure RMF compliance.', skills: ['Information Assurance', 'RMF', 'NIST 800-53', 'STIGs', 'eMASS'], logo: '🛡️', featured: false, source: 'Glassdoor/Northrop' },
  { id: 417, type: 'job', title: 'Security Architect', company: 'Microsoft', industry: 'cybersecurity', orgType: 'industry', location: 'Redmond, WA', workType: 'hybrid', salary: '$160,000 - $250,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '2 days ago', applicants: 189, description: 'Design security architecture for Azure cloud services and M365.', skills: ['Security Architecture', 'Azure', 'Zero Trust', 'Cloud Security', 'Identity'], logo: '🛡️', featured: false, source: 'Microsoft Careers' },

  // ========== AEROSPACE & DEFENSE JOBS (17 positions) ==========
  // Source: SpaceX, Blue Origin, Lockheed Martin, Boeing, NASA JPL
  { id: 501, type: 'job', title: 'Aerospace Engineer', company: 'SpaceX', industry: 'aerospace', orgType: 'industry', location: 'Hawthorne, CA', workType: 'onsite', salary: '$95,000 - $150,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '2 days ago', applicants: 789, description: 'Design next-generation Starship spacecraft systems. Work on rapid iteration cycles.', skills: ['MATLAB', 'Systems Engineering', 'CAD', 'Thermal Analysis', 'FEA'], logo: '🚀', featured: true, source: 'Phys.org/SpaceX' },
  { id: 502, type: 'job', title: 'Flight Software Engineer', company: 'Blue Origin', industry: 'aerospace', orgType: 'industry', location: 'Kent, WA', workType: 'onsite', salary: '$120,000 - $180,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'mid', posted: '3 days ago', applicants: 345, description: 'Develop flight software for New Glenn rocket and lunar lander systems.', skills: ['C/C++', 'Real-time Systems', 'Avionics', 'RTOS', 'Embedded'], logo: '🚀', featured: true, source: 'Phys.org/Blue Origin' },
  { id: 503, type: 'job', title: 'Systems Engineer - F-35', company: 'Lockheed Martin', industry: 'aerospace', orgType: 'industry', location: 'Palmdale, CA', workType: 'onsite', salary: '$100,000 - $160,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 234, description: 'Support F-35 Lightning II systems engineering. Work on worlds largest defense program.', skills: ['Systems Engineering', 'Requirements', 'DOORS', 'MIL-STD', 'Model-Based SE'], logo: '🚀', featured: false, source: 'Lockheed Careers' },
  { id: 504, type: 'job', title: 'Propulsion Engineer', company: 'Aerojet Rocketdyne', industry: 'aerospace', orgType: 'industry', location: 'West Palm Beach, FL', workType: 'onsite', salary: '$90,000 - $140,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '4 days ago', applicants: 167, description: 'Design and analyze RS-25 rocket engine systems for SLS program.', skills: ['Propulsion', 'Thermodynamics', 'CFD', 'ANSYS', 'Turbomachinery'], logo: '🚀', featured: false, source: 'Aerojet Careers' },
  { id: 505, type: 'job', title: 'Avionics Engineer', company: 'Boeing', industry: 'aerospace', orgType: 'industry', location: 'St. Louis, MO', workType: 'onsite', salary: '$95,000 - $145,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 189, description: 'Design avionics systems for F-15EX and F-47 sixth-generation fighter.', skills: ['Avionics', 'DO-178C', 'VHDL', 'Systems Integration', 'Embedded Systems'], logo: '🚀', featured: false, source: 'SimpleFlying/Boeing' },
  { id: 506, type: 'job', title: 'Spacecraft Mission Planner', company: 'NASA JPL', industry: 'aerospace', orgType: 'federal', location: 'Pasadena, CA', workType: 'onsite', salary: '$100,000 - $150,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 456, description: 'Plan Mars sample return and Europa Clipper missions. Design trajectories.', skills: ['Mission Planning', 'Orbital Mechanics', 'GMAT', 'Python', 'Astrodynamics'], logo: '🚀', featured: false, source: 'NASA Careers' },
  { id: 507, type: 'job', title: 'Structural Engineer - B-21 Raider', company: 'Northrop Grumman', industry: 'aerospace', orgType: 'industry', location: 'El Segundo, CA', workType: 'onsite', salary: '$95,000 - $140,000', clearance: 'top_secret', citizenship: 'us_citizen', experience: 'mid', posted: '3 days ago', applicants: 145, description: 'Analyze structural integrity of B-21 stealth bomber. Work on classified program.', skills: ['FEA', 'NASTRAN', 'Composite Structures', 'CATIA', 'Structural Analysis'], logo: '🚀', featured: false, source: 'SimpleFlying/Northrop' },
  { id: 508, type: 'job', title: 'GNC Engineer', company: 'Rocket Lab', industry: 'aerospace', orgType: 'industry', location: 'Long Beach, CA', workType: 'onsite', salary: '$110,000 - $160,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '6 days ago', applicants: 123, description: 'Design guidance, navigation and control systems for Electron and Neutron rockets.', skills: ['GNC', 'MATLAB/Simulink', 'Control Theory', 'Python', 'Kalman Filters'], logo: '🚀', featured: false, source: 'Rocket Lab Careers' },
  { id: 509, type: 'job', title: 'Test Engineer', company: 'Virgin Galactic', industry: 'aerospace', orgType: 'industry', location: 'Mojave, CA', workType: 'onsite', salary: '$85,000 - $130,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '2 weeks ago', applicants: 189, description: 'Plan and execute SpaceShipTwo test campaigns for commercial spaceflight.', skills: ['Test Engineering', 'Data Analysis', 'LabVIEW', 'Hardware Testing', 'Flight Test'], logo: '🚀', featured: false, source: 'Space Crew Jobs' },
  { id: 510, type: 'job', title: 'Satellite Systems Engineer', company: 'Planet Labs', industry: 'aerospace', orgType: 'industry', location: 'San Francisco, CA', workType: 'hybrid', salary: '$120,000 - $170,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 234, description: 'Design small satellite systems for Earths largest imaging constellation.', skills: ['Satellite Systems', 'CubeSat', 'Systems Engineering', 'Python', 'Orbit Design'], logo: '🚀', featured: false, source: 'Planet Careers' },
  { id: 511, type: 'job', title: 'RF Engineer - Radar', company: 'Raytheon', industry: 'aerospace', orgType: 'industry', location: 'Tucson, AZ', workType: 'onsite', salary: '$95,000 - $145,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 167, description: 'Design RF systems for missile guidance radar and AESA arrays.', skills: ['RF Design', 'Radar', 'HFSS', 'Signal Processing', 'Antenna Design'], logo: '🚀', featured: false, source: 'Raytheon Careers' },
  { id: 512, type: 'job', title: 'Manufacturing Engineer - Starship', company: 'SpaceX', industry: 'aerospace', orgType: 'industry', location: 'Starbase, TX', workType: 'onsite', salary: '$85,000 - $130,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '2 days ago', applicants: 567, description: 'Optimize Starship Super Heavy manufacturing. Drive production rate increases.', skills: ['Manufacturing', 'Lean', 'CAD', 'Process Engineering', 'Welding'], logo: '🚀', featured: false, source: 'SpaceX Careers' },
  { id: 513, type: 'job', title: 'Thermal Engineer', company: 'Ball Aerospace', industry: 'aerospace', orgType: 'industry', location: 'Boulder, CO', workType: 'onsite', salary: '$95,000 - $140,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 89, description: 'Design thermal control systems for space telescopes and satellites.', skills: ['Thermal Analysis', 'Thermal Desktop', 'SINDA', 'Heat Transfer', 'Cryogenics'], logo: '🚀', featured: false, source: 'Ball Aerospace Careers' },
  { id: 514, type: 'job', title: 'Project Engineer - Entry Level', company: 'Lockheed Martin', industry: 'aerospace', orgType: 'industry', location: 'Fort Worth, TX', workType: 'onsite', salary: '$70,000 - $95,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '1 week ago', applicants: 456, description: 'Support F-35 project engineering activities. Great entry point to aerospace.', skills: ['Project Engineering', 'Technical Documentation', 'MS Project', 'Communication'], logo: '🚀', featured: false, source: 'Lockheed Martin Jobs' },
  { id: 515, type: 'job', title: 'Quality Assurance Engineer', company: 'General Dynamics', industry: 'aerospace', orgType: 'industry', location: 'Scottsdale, AZ', workType: 'onsite', salary: '$80,000 - $120,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '3 days ago', applicants: 134, description: 'Ensure AS9100 quality compliance for aerospace products and defense systems.', skills: ['AS9100', 'Quality Systems', 'Auditing', 'Root Cause Analysis', 'ISO 9001'], logo: '🚀', featured: false, source: 'GD Careers' },
  { id: 516, type: 'job', title: 'Senior SOC/ASIC DFT Engineer', company: 'SpaceX', industry: 'aerospace', orgType: 'industry', location: 'Hawthorne, CA', workType: 'onsite', salary: '$140,000 - $200,000', clearance: 'none', citizenship: 'us_person', experience: 'senior', posted: '4 days ago', applicants: 234, description: 'Design silicon for Starlink satellites and spacecraft avionics.', skills: ['ASIC Design', 'DFT', 'Verilog', 'JTAG', 'ATPG'], logo: '🚀', featured: false, source: 'Space Crew Jobs' },
  { id: 517, type: 'job', title: 'Engineering Support', company: 'Lockheed Martin', industry: 'aerospace', orgType: 'industry', location: 'Palmdale, CA', workType: 'onsite', salary: '$55,000 - $75,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '2 weeks ago', applicants: 345, description: 'Support engineering activities on classified aircraft programs.', skills: ['Engineering Support', 'CAD', 'Documentation', 'Technical Skills'], logo: '🚀', featured: false, source: 'Lockheed Martin Jobs' },

  // ========== INTERNSHIPS (Various Industries - 15 positions) ==========
  { id: 601, type: 'internship', title: 'Quantum Technologies Intern', company: 'IBM Quantum', industry: 'quantum', orgType: 'industry', location: 'Yorktown Heights, NY', workType: 'hybrid', salary: '$35/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '1 week ago', applicants: 456, description: 'Summer internship in quantum computing research. Work on Qiskit development.', skills: ['Qiskit', 'Python', 'Physics', 'Linear Algebra'], logo: '⚛️', featured: true, duration: '12 weeks', source: 'IBM Quantum' },
  { id: 602, type: 'internship', title: 'Nuclear Engineering Intern', company: 'Oak Ridge National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Oak Ridge, TN', workType: 'onsite', salary: '$25/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '2 weeks ago', applicants: 234, description: 'Support reactor modeling research at DOEs largest lab. HFIR and SNS access.', skills: ['MCNP', 'Python', 'Nuclear Physics', 'SCALE'], logo: '☢️', featured: true, duration: '10 weeks', source: 'ORNL Internships' },
  { id: 603, type: 'internship', title: 'AI Research Intern', company: 'Anthropic', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'onsite', salary: '$60/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '5 days ago', applicants: 1234, description: 'Research AI safety and alignment. Work on Claude model development.', skills: ['Python', 'ML', 'Research', 'Mathematics'], logo: '🤖', featured: true, duration: '12 weeks', source: 'Business Insider' },
  { id: 604, type: 'internship', title: 'Cybersecurity Intern', company: 'CISA', industry: 'cybersecurity', orgType: 'federal', location: 'Arlington, VA', workType: 'hybrid', salary: '$22/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '3 days ago', applicants: 345, description: 'Support federal cybersecurity initiatives. Pathways program eligible.', skills: ['Security+', 'Network Analysis', 'Python', 'Risk Assessment'], logo: '🛡️', featured: false, duration: '16 weeks', source: 'USAJobs' },
  { id: 605, type: 'internship', title: 'Aerospace Engineering Intern', company: 'NASA JPL', industry: 'aerospace', orgType: 'federal', location: 'Pasadena, CA', workType: 'onsite', salary: '$30/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '1 week ago', applicants: 678, description: 'Work on Mars mission technology. Support Europa Clipper development.', skills: ['MATLAB', 'CAD', 'Thermal Analysis', 'Python'], logo: '🚀', featured: true, duration: '10 weeks', source: 'NASA Pathways' },
  { id: 606, type: 'internship', title: 'Semiconductor Process Intern', company: 'Intel Corporation', industry: 'semiconductor', orgType: 'industry', location: 'Hillsboro, OR', workType: 'onsite', salary: '$32/hour', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '2 weeks ago', applicants: 456, description: 'Learn semiconductor process engineering. Work in advanced fab environment.', skills: ['Clean Room Protocol', 'Process Control', 'Data Analysis', 'Statistics'], logo: '💎', featured: false, duration: '12 weeks', source: 'Intel Internships' },
  { id: 607, type: 'internship', title: 'Robotics Research Intern', company: 'Boston Dynamics', industry: 'robotics', orgType: 'industry', location: 'Waltham, MA', workType: 'onsite', salary: '$35/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '4 days ago', applicants: 567, description: 'Research autonomous robot systems. Work on Spot and Atlas platforms.', skills: ['ROS', 'C++', 'Computer Vision', 'Python'], logo: '🦾', featured: false, duration: '12 weeks', source: 'Boston Dynamics' },
  { id: 608, type: 'internship', title: 'Clean Energy Research Intern', company: 'NREL', industry: 'clean_energy', orgType: 'national_lab', location: 'Golden, CO', workType: 'hybrid', salary: '$24/hour', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '1 week ago', applicants: 234, description: 'Support renewable energy research at DOEs premier clean energy lab.', skills: ['Solar PV', 'Data Analysis', 'Python', 'Energy Systems'], logo: '⚡', featured: false, duration: '10 weeks', source: 'NREL Careers' },
  { id: 609, type: 'internship', title: 'DeepMind Research Intern', company: 'Google DeepMind', industry: 'ai', orgType: 'industry', location: 'Mountain View, CA', workType: 'onsite', salary: '$55/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '2 weeks ago', applicants: 890, description: 'Research AI at worlds leading AI research lab. Work on Gemini.', skills: ['JAX', 'Python', 'ML', 'Research', 'Publications'], logo: '🤖', featured: true, duration: '12 weeks', source: 'Business Insider' },
  { id: 610, type: 'internship', title: 'SpaceX Engineering Intern', company: 'SpaceX', industry: 'aerospace', orgType: 'industry', location: 'Hawthorne, CA', workType: 'onsite', salary: '$34/hour', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '3 days ago', applicants: 1567, description: 'Work on Starship and Dragon spacecraft. Fast-paced hands-on experience.', skills: ['CAD', 'MATLAB', 'Manufacturing', 'Testing'], logo: '🚀', featured: true, duration: '12 weeks', source: 'SpaceX Internships' },
  { id: 611, type: 'internship', title: 'Semiconductor Engineer Intern', company: 'Samsung Austin Semiconductor', industry: 'semiconductor', orgType: 'industry', location: 'Austin, TX', workType: 'onsite', salary: '$30/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '1 week ago', applicants: 345, description: 'Learn semiconductor manufacturing at 14nm/7nm fab. Department-specific project.', skills: ['Clean Room', 'Process Engineering', 'Data Analysis'], logo: '💎', featured: false, duration: '12 weeks', source: 'Lensa/Samsung' },
  { id: 612, type: 'internship', title: 'Meta AI Research Intern', company: 'Meta AI', industry: 'ai', orgType: 'industry', location: 'Menlo Park, CA', workType: 'onsite', salary: '$50/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '2 weeks ago', applicants: 1234, description: 'Research fellowship in computer vision, NLP, or reinforcement learning.', skills: ['PyTorch', 'Python', 'ML', 'Research'], logo: '🤖', featured: false, duration: '12 weeks', source: 'Business Insider' },
  { id: 613, type: 'internship', title: 'IonQ Quantum Intern', company: 'IonQ', industry: 'quantum', orgType: 'industry', location: 'College Park, MD', workType: 'onsite', salary: '$32/hour', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '1 week ago', applicants: 234, description: 'Work on trapped ion quantum computing systems. Hardware or software tracks.', skills: ['Physics', 'Python', 'Quantum Technologies', 'Optics'], logo: '⚛️', featured: false, duration: '10 weeks', source: 'IonQ Careers' },
  { id: 614, type: 'internship', title: 'Blue Origin Propulsion Intern', company: 'Blue Origin', industry: 'aerospace', orgType: 'industry', location: 'Kent, WA', workType: 'onsite', salary: '$33/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '4 days ago', applicants: 456, description: 'Support BE-4 engine development for New Glenn rocket.', skills: ['Thermodynamics', 'MATLAB', 'CFD', 'Propulsion'], logo: '🚀', featured: false, duration: '12 weeks', source: 'Blue Origin Careers' },
  { id: 615, type: 'internship', title: 'Anthropic Research Fellow', company: 'Anthropic', industry: 'ai', orgType: 'industry', location: 'San Francisco, CA', workType: 'onsite', salary: '$65/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '1 week ago', applicants: 789, description: '6-month research fellowship program on AI safety and alignment.', skills: ['Python', 'ML', 'Research', 'Mathematics', 'AI Safety'], logo: '🤖', featured: true, duration: '24 weeks', source: 'Business Insider' },

  // === ACADEMIA JOBS ===
  { id: 700, type: 'job', title: 'Semiconductor Research Scientist', company: 'Stanford University', industry: 'semiconductor', orgType: 'academia', location: 'Stanford, CA', workType: 'onsite', salary: '$110,000 - $145,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '5 days ago', applicants: 89, description: 'Conduct research on next-generation semiconductor materials and device architectures in the Department of Electrical Engineering.', skills: ['CMOS Design', 'Cleanroom Fabrication', 'TCAD', 'Python', 'Material Characterization'], logo: '💎', featured: true, source: 'Stanford Careers' },
  { id: 701, type: 'job', title: 'IC Design Researcher', company: 'MIT', industry: 'semiconductor', orgType: 'academia', location: 'Cambridge, MA', workType: 'onsite', salary: '$105,000 - $140,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '1 week ago', applicants: 67, description: 'Research advanced integrated circuit design methodologies at the Microsystems Technology Laboratory.', skills: ['Verilog', 'Cadence', 'VLSI', 'SPICE Simulation', 'Python'], logo: '💎', featured: false, source: 'MIT Careers' },
  { id: 702, type: 'job', title: 'Nuclear Engineering Professor', company: 'MIT', industry: 'nuclear', orgType: 'academia', location: 'Cambridge, MA', workType: 'onsite', salary: '$140,000 - $195,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '2 weeks ago', applicants: 34, description: 'Tenure-track faculty position in the Department of Nuclear Science and Engineering. Research focus on advanced reactor concepts.', skills: ['Reactor Physics', 'Monte Carlo Methods', 'MCNP', 'Teaching', 'Grant Writing'], logo: '☢️', featured: true, source: 'MIT Careers' },
  { id: 703, type: 'job', title: 'Reactor Design Researcher', company: 'Georgia Tech Research Institute', industry: 'nuclear', orgType: 'academia', location: 'Atlanta, GA', workType: 'onsite', salary: '$95,000 - $130,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 42, description: 'Support advanced nuclear reactor design and simulation research at GTRI. Collaborate with DOE-funded programs.', skills: ['RELAP', 'Thermal Hydraulics', 'SERPENT', 'MATLAB', 'Python'], logo: '☢️', featured: false, source: 'GTRI Careers' },
  { id: 704, type: 'job', title: 'ML Research Scientist', company: 'Stanford University', industry: 'ai', orgType: 'academia', location: 'Stanford, CA', workType: 'hybrid', salary: '$130,000 - $175,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '3 days ago', applicants: 234, description: 'Join the Stanford AI Lab (SAIL) to conduct cutting-edge research in machine learning and deep learning.', skills: ['PyTorch', 'TensorFlow', 'Python', 'Research Publications', 'Statistics'], logo: '🤖', featured: true, source: 'Stanford Careers' },
  { id: 705, type: 'job', title: 'NLP Professor', company: 'Carnegie Mellon University', industry: 'ai', orgType: 'academia', location: 'Pittsburgh, PA', workType: 'onsite', salary: '$150,000 - $210,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '1 week ago', applicants: 56, description: 'Tenure-track faculty position in the Language Technologies Institute. Focus on large language models and NLP.', skills: ['NLP', 'Deep Learning', 'Python', 'Teaching', 'Grant Writing'], logo: '🤖', featured: false, source: 'CMU Careers' },
  { id: 706, type: 'job', title: 'AI Research Fellow', company: 'UC Berkeley', industry: 'ai', orgType: 'academia', location: 'Berkeley, CA', workType: 'hybrid', salary: '$90,000 - $120,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '6 days ago', applicants: 312, description: 'Postdoctoral research fellowship at Berkeley AI Research (BAIR). Work on foundational AI safety and alignment research.', skills: ['Python', 'JAX', 'ML Theory', 'Research', 'Mathematics'], logo: '🤖', featured: false, source: 'UC Berkeley Careers' },
  { id: 707, type: 'job', title: 'Quantum Computing Researcher', company: 'Caltech', industry: 'quantum', orgType: 'academia', location: 'Pasadena, CA', workType: 'onsite', salary: '$115,000 - $155,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '1 week ago', applicants: 45, description: 'Research position at the Institute for Quantum Information Science. Focus on superconducting qubit architectures.', skills: ['Quantum Mechanics', 'Cryogenics', 'Python', 'Qiskit', 'Microwave Engineering'], logo: '⚛️', featured: false, source: 'Caltech Careers' },
  { id: 708, type: 'job', title: 'Quantum Information Scientist', company: 'University of Michigan', industry: 'quantum', orgType: 'academia', location: 'Ann Arbor, MI', workType: 'onsite', salary: '$100,000 - $135,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '2 weeks ago', applicants: 38, description: 'Join the quantum information group to research quantum error correction and fault-tolerant quantum computing.', skills: ['Quantum Error Correction', 'Python', 'Linear Algebra', 'Cirq', 'Physics'], logo: '⚛️', featured: false, source: 'UMich Careers' },
  { id: 709, type: 'job', title: 'Cybersecurity Research Engineer', company: 'Johns Hopkins APL', industry: 'cybersecurity', orgType: 'academia', location: 'Laurel, MD', workType: 'onsite', salary: '$105,000 - $150,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 78, description: 'Develop advanced cybersecurity tools and techniques for national security applications at APL.', skills: ['Penetration Testing', 'Reverse Engineering', 'Python', 'Network Security', 'C++'], logo: '🛡️', featured: false, source: 'JHU APL Careers' },
  { id: 710, type: 'job', title: 'Security Researcher', company: 'Georgia Tech Research Institute', industry: 'cybersecurity', orgType: 'academia', location: 'Atlanta, GA', workType: 'hybrid', salary: '$95,000 - $130,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 56, description: 'Research novel cybersecurity defense mechanisms and threat detection systems at GTRI.', skills: ['Malware Analysis', 'Python', 'Machine Learning', 'IDS/IPS', 'Threat Intelligence'], logo: '🛡️', featured: false, source: 'GTRI Careers' },
  { id: 711, type: 'job', title: 'Aerospace Research Scientist', company: 'UT Austin', industry: 'aerospace', orgType: 'academia', location: 'Austin, TX', workType: 'onsite', salary: '$100,000 - $140,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '3 days ago', applicants: 65, description: 'Conduct research in orbital mechanics and spacecraft guidance at the Center for Space Research.', skills: ['Orbital Mechanics', 'MATLAB', 'Python', 'Astrodynamics', 'C++'], logo: '🚀', featured: false, source: 'UT Austin Careers' },
  { id: 712, type: 'job', title: 'Space Systems Engineer', company: 'MIT Lincoln Laboratory', industry: 'aerospace', orgType: 'academia', location: 'Lexington, MA', workType: 'onsite', salary: '$120,000 - $165,000', clearance: 'top_secret', citizenship: 'us_citizen', experience: 'mid', posted: '4 days ago', applicants: 87, description: 'Design and develop advanced space-based sensor and communication systems for national defense.', skills: ['Systems Engineering', 'RF Design', 'MATLAB', 'Signal Processing', 'Python'], logo: '🚀', featured: false, source: 'MIT Lincoln Lab Careers' },
  { id: 713, type: 'job', title: 'Computational Biology Researcher', company: 'Stanford University', industry: 'biotech', orgType: 'academia', location: 'Stanford, CA', workType: 'hybrid', salary: '$95,000 - $130,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '1 week ago', applicants: 112, description: 'Apply computational methods to genomics and drug discovery in the Department of Bioengineering.', skills: ['Bioinformatics', 'Python', 'R', 'Genomics', 'Machine Learning'], logo: '🧬', featured: false, source: 'Stanford Careers' },
  { id: 714, type: 'job', title: 'Synthetic Biology Postdoc', company: 'MIT', industry: 'biotech', orgType: 'academia', location: 'Cambridge, MA', workType: 'onsite', salary: '$70,000 - $85,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '6 days ago', applicants: 78, description: 'Postdoctoral position in the Synthetic Biology Center. Engineer biological systems for therapeutic applications.', skills: ['CRISPR', 'Molecular Biology', 'Python', 'Flow Cytometry', 'Gene Circuits'], logo: '🧬', featured: false, source: 'MIT Careers' },
  { id: 715, type: 'job', title: 'Biomedical Engineering Professor', company: 'Johns Hopkins APL', industry: 'healthcare', orgType: 'academia', location: 'Baltimore, MD', workType: 'onsite', salary: '$135,000 - $190,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'senior', posted: '2 weeks ago', applicants: 45, description: 'Tenure-track faculty in biomedical engineering with focus on neural interfaces and prosthetics.', skills: ['Neural Engineering', 'Signal Processing', 'MATLAB', 'Grant Writing', 'Teaching'], logo: '🏥', featured: false, source: 'JHU Careers' },
  { id: 716, type: 'job', title: 'Medical Imaging Researcher', company: 'Stanford University', industry: 'healthcare', orgType: 'academia', location: 'Stanford, CA', workType: 'onsite', salary: '$105,000 - $140,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '5 days ago', applicants: 67, description: 'Develop AI-powered medical imaging algorithms at the Stanford Center for Artificial Intelligence in Medicine.', skills: ['Deep Learning', 'Medical Imaging', 'Python', 'DICOM', 'PyTorch'], logo: '🏥', featured: false, source: 'Stanford Careers' },
  { id: 717, type: 'job', title: 'Robotics Research Scientist', company: 'Carnegie Mellon University', industry: 'robotics', orgType: 'academia', location: 'Pittsburgh, PA', workType: 'onsite', salary: '$110,000 - $150,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '3 days ago', applicants: 98, description: 'Research autonomous robot perception and manipulation at the Robotics Institute.', skills: ['ROS', 'C++', 'Python', 'Computer Vision', 'Motion Planning'], logo: '🦾', featured: false, source: 'CMU RI Careers' },
  { id: 718, type: 'job', title: 'Autonomous Systems Researcher', company: 'MIT', industry: 'robotics', orgType: 'academia', location: 'Cambridge, MA', workType: 'onsite', salary: '$105,000 - $145,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '1 week ago', applicants: 76, description: 'Research autonomous decision-making systems at CSAIL. Focus on safe autonomous navigation.', skills: ['ROS2', 'Python', 'Reinforcement Learning', 'C++', 'SLAM'], logo: '🦾', featured: false, source: 'MIT Careers' },
  { id: 719, type: 'job', title: 'Solar Energy Researcher', company: 'Stanford University', industry: 'clean_energy', orgType: 'academia', location: 'Stanford, CA', workType: 'onsite', salary: '$95,000 - $130,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '4 days ago', applicants: 54, description: 'Research next-generation perovskite solar cells at the Precourt Institute for Energy.', skills: ['Photovoltaics', 'Materials Science', 'Python', 'Characterization', 'Thin Films'], logo: '⚡', featured: false, source: 'Stanford Careers' },
  { id: 720, type: 'job', title: 'Battery Technology Postdoc', company: 'MIT', industry: 'clean_energy', orgType: 'academia', location: 'Cambridge, MA', workType: 'onsite', salary: '$72,000 - $88,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '1 week ago', applicants: 89, description: 'Postdoctoral research on solid-state batteries and energy storage at the MIT Energy Initiative.', skills: ['Electrochemistry', 'Materials Science', 'Python', 'Battery Testing', 'XRD'], logo: '⚡', featured: false, source: 'MIT Careers' },
  { id: 721, type: 'job', title: 'Additive Manufacturing Researcher', company: 'Purdue University', industry: 'manufacturing', orgType: 'academia', location: 'West Lafayette, IN', workType: 'onsite', salary: '$90,000 - $125,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '6 days ago', applicants: 43, description: 'Research metal additive manufacturing processes and quality control at the Purdue Engineering Research Center.', skills: ['3D Printing', 'Metallurgy', 'CAD', 'Python', 'DOE Methods'], logo: '🏭', featured: false, source: 'Purdue Careers' },
  { id: 722, type: 'job', title: 'Smart Manufacturing Scientist', company: 'Georgia Tech Research Institute', industry: 'manufacturing', orgType: 'academia', location: 'Atlanta, GA', workType: 'hybrid', salary: '$95,000 - $130,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 37, description: 'Develop Industry 4.0 solutions including digital twins and IoT-enabled manufacturing systems.', skills: ['Digital Twins', 'IoT', 'Python', 'PLC Programming', 'Data Analytics'], logo: '🏭', featured: false, source: 'GTRI Careers' },
  // Academia Internships
  { id: 723, type: 'internship', title: 'Radar Systems Research Intern', company: 'MIT Lincoln Laboratory', industry: 'aerospace', orgType: 'academia', location: 'Lexington, MA', workType: 'onsite', salary: '$32/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '5 days ago', applicants: 234, description: 'Summer research internship working on advanced radar and sensor systems for national security.', skills: ['MATLAB', 'Signal Processing', 'Python', 'RF Engineering'], logo: '🚀', featured: false, duration: '12 weeks', source: 'MIT Lincoln Lab' },
  { id: 724, type: 'internship', title: 'AI Research Intern', company: 'Stanford University', industry: 'ai', orgType: 'academia', location: 'Stanford, CA', workType: 'onsite', salary: '$28/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '1 week ago', applicants: 456, description: 'Summer research internship at Stanford AI Lab working on foundation models and multimodal learning.', skills: ['Python', 'PyTorch', 'ML', 'Research'], logo: '🤖', featured: false, duration: '10 weeks', source: 'Stanford Careers' },
  { id: 725, type: 'internship', title: 'Robotics Research Intern', company: 'Carnegie Mellon University', industry: 'robotics', orgType: 'academia', location: 'Pittsburgh, PA', workType: 'onsite', salary: '$26/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '4 days ago', applicants: 189, description: 'Summer internship at the Robotics Institute. Work on perception, planning, or manipulation projects.', skills: ['ROS', 'Python', 'C++', 'Computer Vision'], logo: '🦾', featured: false, duration: '10 weeks', source: 'CMU RI' },
  { id: 726, type: 'internship', title: 'Quantum Computing Research Intern', company: 'Caltech', industry: 'quantum', orgType: 'academia', location: 'Pasadena, CA', workType: 'onsite', salary: '$27/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '1 week ago', applicants: 112, description: 'Summer research at the Institute for Quantum Information Science. Experimental or theoretical tracks.', skills: ['Quantum Mechanics', 'Python', 'Linear Algebra', 'Physics'], logo: '⚛️', featured: false, duration: '10 weeks', source: 'Caltech SURF' },
  { id: 727, type: 'internship', title: 'Biotech Research Intern', company: 'UC Berkeley', industry: 'biotech', orgType: 'academia', location: 'Berkeley, CA', workType: 'onsite', salary: '$25/hour', clearance: 'none', citizenship: 'visa_sponsor', experience: 'entry', posted: '6 days ago', applicants: 145, description: 'Summer research internship in the Innovative Genomics Institute. CRISPR and gene editing focus.', skills: ['Molecular Biology', 'Python', 'Lab Techniques', 'Bioinformatics'], logo: '🧬', featured: false, duration: '10 weeks', source: 'UC Berkeley Careers' },

  // === NONPROFIT JOBS ===
  { id: 728, type: 'job', title: 'Senior Systems Engineer', company: 'MITRE Corporation', industry: 'cybersecurity', orgType: 'nonprofit', location: 'McLean, VA', workType: 'hybrid', salary: '$125,000 - $170,000', clearance: 'top_secret', citizenship: 'us_citizen', experience: 'senior', posted: '3 days ago', applicants: 134, description: 'Lead systems engineering for federal cybersecurity programs. Support DHS and DoD cyber initiatives.', skills: ['Systems Engineering', 'NIST Frameworks', 'Risk Assessment', 'Python', 'Cloud Security'], logo: '🛡️', featured: true, source: 'MITRE Careers' },
  { id: 729, type: 'job', title: 'AI Policy Researcher', company: 'RAND Corporation', industry: 'ai', orgType: 'nonprofit', location: 'Santa Monica, CA', workType: 'hybrid', salary: '$95,000 - $140,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 89, description: 'Research AI policy implications for national security and defense. Publish peer-reviewed analyses.', skills: ['Policy Analysis', 'Python', 'Machine Learning', 'Technical Writing', 'Statistics'], logo: '🤖', featured: false, source: 'RAND Careers' },
  { id: 730, type: 'job', title: 'Space Systems Analyst', company: 'Aerospace Corporation', industry: 'aerospace', orgType: 'nonprofit', location: 'El Segundo, CA', workType: 'onsite', salary: '$110,000 - $155,000', clearance: 'ts_sci', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 78, description: 'Provide technical analysis for national security space programs. Support satellite system acquisition.', skills: ['Orbital Mechanics', 'Systems Analysis', 'MATLAB', 'Python', 'Space Systems'], logo: '🚀', featured: false, source: 'Aerospace Corp Careers' },
  { id: 731, type: 'job', title: 'Nuclear Policy Analyst', company: 'RAND Corporation', industry: 'nuclear', orgType: 'nonprofit', location: 'Arlington, VA', workType: 'hybrid', salary: '$100,000 - $145,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '2 weeks ago', applicants: 34, description: 'Analyze nuclear energy and nonproliferation policy. Support government decision-making with rigorous research.', skills: ['Nuclear Policy', 'Quantitative Analysis', 'Python', 'Technical Writing', 'Game Theory'], logo: '☢️', featured: false, source: 'RAND Careers' },
  { id: 732, type: 'job', title: 'Cybersecurity Analyst', company: 'MITRE Corporation', industry: 'cybersecurity', orgType: 'nonprofit', location: 'Bedford, MA', workType: 'hybrid', salary: '$95,000 - $135,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '4 days ago', applicants: 156, description: 'Develop ATT&CK framework enhancements. Analyze adversary tactics, techniques, and procedures.', skills: ['MITRE ATT&CK', 'Threat Analysis', 'Python', 'Network Security', 'SIEM'], logo: '🛡️', featured: false, source: 'MITRE Careers' },
  { id: 733, type: 'job', title: 'Robotics Engineer', company: 'Charles Stark Draper Laboratory', industry: 'robotics', orgType: 'nonprofit', location: 'Cambridge, MA', workType: 'onsite', salary: '$105,000 - $150,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 67, description: 'Design autonomous navigation and guidance systems for defense and space applications.', skills: ['ROS', 'C++', 'Python', 'GNC Systems', 'Embedded Systems'], logo: '🦾', featured: false, source: 'Draper Careers' },
  { id: 734, type: 'job', title: 'Materials Scientist', company: 'Battelle Memorial Institute', industry: 'manufacturing', orgType: 'nonprofit', location: 'Columbus, OH', workType: 'onsite', salary: '$90,000 - $125,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '6 days ago', applicants: 45, description: 'Research advanced materials for defense and energy applications. Characterize novel alloys and composites.', skills: ['Materials Characterization', 'SEM/TEM', 'Python', 'Metallurgy', 'DOE Methods'], logo: '🏭', featured: false, source: 'Battelle Careers' },
  { id: 735, type: 'job', title: 'Energy Policy Researcher', company: 'RAND Corporation', industry: 'clean_energy', orgType: 'nonprofit', location: 'Pittsburgh, PA', workType: 'hybrid', salary: '$90,000 - $130,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 56, description: 'Research clean energy transition policies and grid modernization strategies for government clients.', skills: ['Energy Policy', 'Data Analysis', 'Python', 'Economic Modeling', 'Technical Writing'], logo: '⚡', featured: false, source: 'RAND Careers' },
  { id: 736, type: 'job', title: 'Biodefense Analyst', company: 'Battelle Memorial Institute', industry: 'biotech', orgType: 'nonprofit', location: 'Columbus, OH', workType: 'onsite', salary: '$95,000 - $135,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 38, description: 'Support biological threat assessment and countermeasure development for federal biodefense programs.', skills: ['Microbiology', 'Biosafety', 'Data Analysis', 'Python', 'Risk Assessment'], logo: '🧬', featured: false, source: 'Battelle Careers' },
  { id: 737, type: 'job', title: 'Health Systems Engineer', company: 'MITRE Corporation', industry: 'healthcare', orgType: 'nonprofit', location: 'McLean, VA', workType: 'hybrid', salary: '$105,000 - $145,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'mid', posted: '3 days ago', applicants: 67, description: 'Apply systems engineering to healthcare IT modernization for VA and CMS programs.', skills: ['HL7 FHIR', 'Systems Engineering', 'Python', 'Healthcare IT', 'Data Analytics'], logo: '🏥', featured: false, source: 'MITRE Careers' },
  { id: 738, type: 'job', title: 'STEM Curriculum Developer', company: 'Code.org', industry: 'ai', orgType: 'nonprofit', location: 'Seattle, WA', workType: 'remote', salary: '$85,000 - $115,000', clearance: 'none', citizenship: 'any', experience: 'mid', posted: '1 week ago', applicants: 234, description: 'Develop K-12 AI and computer science curriculum. Create interactive lessons on machine learning fundamentals.', skills: ['Curriculum Design', 'JavaScript', 'Python', 'Pedagogy', 'AI/ML Basics'], logo: '🤖', featured: true, source: 'Code.org Careers' },
  { id: 739, type: 'job', title: 'Semiconductor Test Engineer', company: 'SRI International', industry: 'semiconductor', orgType: 'nonprofit', location: 'Menlo Park, CA', workType: 'onsite', salary: '$100,000 - $140,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 52, description: 'Develop test methodologies for advanced semiconductor devices. Support DARPA-funded microelectronics programs.', skills: ['ATE Programming', 'Semiconductor Physics', 'Python', 'LabVIEW', 'Test Engineering'], logo: '💎', featured: false, source: 'SRI Careers' },
  { id: 740, type: 'job', title: 'Quantum Technology Analyst', company: 'Institute for Defense Analyses', industry: 'quantum', orgType: 'nonprofit', location: 'Alexandria, VA', workType: 'onsite', salary: '$110,000 - $155,000', clearance: 'ts_sci', citizenship: 'us_citizen', experience: 'senior', posted: '2 weeks ago', applicants: 28, description: 'Assess quantum computing and quantum sensing technologies for defense applications. Brief senior DoD leadership.', skills: ['Quantum Computing', 'Technical Analysis', 'Python', 'Briefing Skills', 'Physics'], logo: '⚛️', featured: false, source: 'IDA Careers' },
  { id: 741, type: 'job', title: 'Mechanical Systems Engineer', company: 'Southwest Research Institute', industry: 'manufacturing', orgType: 'nonprofit', location: 'San Antonio, TX', workType: 'onsite', salary: '$90,000 - $125,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 43, description: 'Design and test mechanical systems for automotive, defense, and energy sector clients.', skills: ['SolidWorks', 'FEA', 'MATLAB', 'Testing', 'GD&T'], logo: '🏭', featured: false, source: 'SwRI Careers' },
  { id: 742, type: 'job', title: 'Education Technology Specialist', company: 'Khan Academy', industry: 'ai', orgType: 'nonprofit', location: 'Mountain View, CA', workType: 'remote', salary: '$95,000 - $130,000', clearance: 'none', citizenship: 'any', experience: 'mid', posted: '6 days ago', applicants: 189, description: 'Build AI-powered tutoring features using LLMs. Help make world-class education accessible to everyone.', skills: ['Python', 'JavaScript', 'React', 'LLM APIs', 'EdTech'], logo: '🤖', featured: false, source: 'Khan Academy Careers' },
  // Nonprofit Internships
  { id: 743, type: 'internship', title: 'Cybersecurity Research Intern', company: 'MITRE Corporation', industry: 'cybersecurity', orgType: 'nonprofit', location: 'McLean, VA', workType: 'hybrid', salary: '$28/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '5 days ago', applicants: 267, description: 'Summer internship supporting ATT&CK framework research and cyber threat analysis.', skills: ['Python', 'Network Security', 'Linux', 'Cybersecurity Fundamentals'], logo: '🛡️', featured: false, duration: '12 weeks', source: 'MITRE Careers' },
  { id: 744, type: 'internship', title: 'Policy Research Intern', company: 'RAND Corporation', industry: 'ai', orgType: 'nonprofit', location: 'Santa Monica, CA', workType: 'hybrid', salary: '$24/hour', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '1 week ago', applicants: 145, description: 'Support AI and technology policy research. Assist senior researchers with data analysis and writing.', skills: ['Data Analysis', 'Python', 'Technical Writing', 'Research Methods'], logo: '🤖', featured: false, duration: '10 weeks', source: 'RAND Careers' },
  { id: 745, type: 'internship', title: 'Aerospace Engineering Intern', company: 'Aerospace Corporation', industry: 'aerospace', orgType: 'nonprofit', location: 'El Segundo, CA', workType: 'onsite', salary: '$30/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '4 days ago', applicants: 198, description: 'Summer internship in space systems engineering. Support satellite program technical evaluations.', skills: ['MATLAB', 'Python', 'Systems Engineering', 'Aerospace Fundamentals'], logo: '🚀', featured: false, duration: '12 weeks', source: 'Aerospace Corp' },

  // === NATIONAL LABS JOBS ===
  { id: 746, type: 'job', title: 'AI/ML Scientist', company: 'Argonne National Laboratory', industry: 'ai', orgType: 'national_lab', location: 'Lemont, IL', workType: 'hybrid', salary: '$115,000 - $155,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 87, description: 'Develop AI/ML models for scientific discovery on Aurora exascale supercomputer. Apply deep learning to materials science and climate.', skills: ['Python', 'PyTorch', 'HPC', 'Scientific Computing', 'Deep Learning'], logo: '🤖', featured: true, source: 'Argonne Careers' },
  { id: 747, type: 'job', title: 'Particle Accelerator Engineer', company: 'Fermi National Accelerator Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Batavia, IL', workType: 'onsite', salary: '$105,000 - $145,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 34, description: 'Design and maintain superconducting RF cavities for the PIP-II accelerator upgrade project.', skills: ['Accelerator Physics', 'RF Engineering', 'Cryogenics', 'MATLAB', 'CAD'], logo: '☢️', featured: false, source: 'Fermilab Careers' },
  { id: 748, type: 'job', title: 'Climate Modeling Scientist', company: 'Pacific Northwest National Laboratory', industry: 'clean_energy', orgType: 'national_lab', location: 'Richland, WA', workType: 'hybrid', salary: '$110,000 - $150,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '5 days ago', applicants: 56, description: 'Develop high-resolution Earth system models. Contribute to DOE climate research initiatives.', skills: ['Climate Modeling', 'Python', 'Fortran', 'HPC', 'Data Analysis'], logo: '⚡', featured: false, source: 'PNNL Careers' },
  { id: 749, type: 'job', title: 'Quantum Computing Researcher', company: 'Lawrence Berkeley National Laboratory', industry: 'quantum', orgType: 'national_lab', location: 'Berkeley, CA', workType: 'onsite', salary: '$120,000 - $160,000', clearance: 'none', citizenship: 'us_person', experience: 'senior', posted: '3 days ago', applicants: 45, description: 'Lead quantum computing research at the Advanced Quantum Testbed. Develop quantum algorithms for scientific applications.', skills: ['Quantum Algorithms', 'Python', 'Qiskit', 'Superconducting Qubits', 'Physics'], logo: '⚛️', featured: true, source: 'LBNL Careers' },
  { id: 750, type: 'job', title: 'Cybersecurity Engineer', company: 'Lawrence Livermore National Laboratory', industry: 'cybersecurity', orgType: 'national_lab', location: 'Livermore, CA', workType: 'onsite', salary: '$115,000 - $160,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 78, description: 'Protect classified computing infrastructure and develop advanced cyber defense tools for national security.', skills: ['Network Security', 'Python', 'Penetration Testing', 'SIEM', 'Linux'], logo: '🛡️', featured: false, source: 'LLNL Careers' },
  { id: 751, type: 'job', title: 'Astrophysics Researcher', company: 'SLAC National Accelerator Laboratory', industry: 'aerospace', orgType: 'national_lab', location: 'Menlo Park, CA', workType: 'onsite', salary: '$100,000 - $140,000', clearance: 'none', citizenship: 'visa_sponsor', experience: 'mid', posted: '6 days ago', applicants: 67, description: 'Conduct astrophysics research using data from the Vera C. Rubin Observatory. Dark energy and dark matter studies.', skills: ['Astrophysics', 'Python', 'Data Analysis', 'Statistics', 'C++'], logo: '🚀', featured: false, source: 'SLAC Careers' },
  { id: 752, type: 'job', title: 'Bioinformatics Scientist', company: 'Brookhaven National Laboratory', industry: 'biotech', orgType: 'national_lab', location: 'Upton, NY', workType: 'hybrid', salary: '$100,000 - $140,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 43, description: 'Apply computational biology methods to structural biology research using NSLS-II synchrotron data.', skills: ['Bioinformatics', 'Python', 'Structural Biology', 'HPC', 'Machine Learning'], logo: '🧬', featured: false, source: 'BNL Careers' },
  { id: 753, type: 'job', title: 'Semiconductor Materials Scientist', company: 'Argonne National Laboratory', industry: 'semiconductor', orgType: 'national_lab', location: 'Lemont, IL', workType: 'onsite', salary: '$105,000 - $145,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 38, description: 'Research next-generation semiconductor materials using Advanced Photon Source X-ray characterization.', skills: ['X-ray Diffraction', 'Materials Science', 'Python', 'Thin Film Deposition', 'Characterization'], logo: '💎', featured: false, source: 'Argonne Careers' },
  { id: 754, type: 'job', title: 'Robotics Engineer', company: 'NASA Jet Propulsion Laboratory', industry: 'robotics', orgType: 'national_lab', location: 'Pasadena, CA', workType: 'onsite', salary: '$120,000 - $165,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'mid', posted: '3 days ago', applicants: 234, description: 'Design autonomous robotic systems for planetary exploration missions. Support Mars Sample Return program.', skills: ['ROS', 'C++', 'Python', 'Autonomous Navigation', 'Embedded Systems'], logo: '🦾', featured: true, source: 'JPL Careers' },
  { id: 755, type: 'job', title: 'Advanced Manufacturing Engineer', company: 'Pacific Northwest National Laboratory', industry: 'manufacturing', orgType: 'national_lab', location: 'Richland, WA', workType: 'onsite', salary: '$95,000 - $135,000', clearance: 'eligible', citizenship: 'us_person', experience: 'mid', posted: '5 days ago', applicants: 32, description: 'Develop advanced manufacturing processes for energy and defense applications. Focus on friction stir welding and additive manufacturing.', skills: ['Additive Manufacturing', 'CAD', 'Materials Testing', 'Python', 'Process Engineering'], logo: '🏭', featured: false, source: 'PNNL Careers' },
  { id: 756, type: 'job', title: 'Medical Physics Researcher', company: 'Argonne National Laboratory', industry: 'healthcare', orgType: 'national_lab', location: 'Lemont, IL', workType: 'onsite', salary: '$100,000 - $140,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '1 week ago', applicants: 29, description: 'Develop advanced proton therapy techniques and medical imaging methods using synchrotron radiation.', skills: ['Medical Physics', 'Radiation Therapy', 'Python', 'GEANT4', 'Data Analysis'], logo: '🏥', featured: false, source: 'Argonne Careers' },
  { id: 757, type: 'job', title: 'Nuclear Fusion Scientist', company: 'Lawrence Livermore National Laboratory', industry: 'nuclear', orgType: 'national_lab', location: 'Livermore, CA', workType: 'onsite', salary: '$125,000 - $175,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'senior', posted: '2 weeks ago', applicants: 56, description: 'Advance inertial confinement fusion research at the National Ignition Facility. Analyze experimental data from fusion shots.', skills: ['Plasma Physics', 'Python', 'HPC', 'Laser Systems', 'Data Analysis'], logo: '☢️', featured: false, source: 'LLNL Careers' },
  { id: 758, type: 'job', title: 'Grid Modernization Engineer', company: 'Pacific Northwest National Laboratory', industry: 'clean_energy', orgType: 'national_lab', location: 'Richland, WA', workType: 'hybrid', salary: '$100,000 - $140,000', clearance: 'none', citizenship: 'us_person', experience: 'mid', posted: '4 days ago', applicants: 47, description: 'Research smart grid technologies and develop tools for grid resilience and renewable energy integration.', skills: ['Power Systems', 'Python', 'MATLAB', 'GridLAB-D', 'Data Analytics'], logo: '⚡', featured: false, source: 'PNNL Careers' },
  // National Labs Internships
  { id: 759, type: 'internship', title: 'Science Undergraduate Laboratory Intern', company: 'Argonne National Laboratory', industry: 'ai', orgType: 'national_lab', location: 'Lemont, IL', workType: 'onsite', salary: '$650/week', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '1 week ago', applicants: 345, description: 'DOE SULI program internship. Apply AI/ML to scientific research at a world-class national laboratory.', skills: ['Python', 'Data Science', 'Machine Learning', 'Scientific Computing'], logo: '🤖', featured: false, duration: '10 weeks', source: 'DOE SULI' },
  { id: 760, type: 'internship', title: 'Quantum Information Intern', company: 'Fermi National Accelerator Laboratory', industry: 'quantum', orgType: 'national_lab', location: 'Batavia, IL', workType: 'onsite', salary: '$625/week', clearance: 'none', citizenship: 'us_person', experience: 'entry', posted: '5 days ago', applicants: 123, description: 'Summer internship in Fermilabs quantum science division. Work on quantum networking and sensing experiments.', skills: ['Quantum Mechanics', 'Python', 'Optics', 'Lab Skills'], logo: '⚛️', featured: false, duration: '10 weeks', source: 'Fermilab Internships' },
  { id: 761, type: 'internship', title: 'Planetary Robotics Intern', company: 'NASA Jet Propulsion Laboratory', industry: 'robotics', orgType: 'national_lab', location: 'Pasadena, CA', workType: 'onsite', salary: '$30/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '3 days ago', applicants: 567, description: 'Summer internship in JPLs robotics section. Help develop autonomous systems for future planetary missions.', skills: ['ROS', 'Python', 'C++', 'Robotics Fundamentals'], logo: '🦾', featured: false, duration: '10 weeks', source: 'JPL Internships' },

  // === FEDERAL JOBS ===
  { id: 762, type: 'job', title: 'AI Research Program Manager', company: 'DARPA', industry: 'ai', orgType: 'federal', location: 'Arlington, VA', workType: 'onsite', salary: '$145,000 - $195,000', clearance: 'top_secret', citizenship: 'us_citizen', experience: 'senior', posted: '2 days ago', applicants: 67, description: 'Manage AI research programs that push the boundaries of machine learning for national security. Define multi-year research agendas.', skills: ['Program Management', 'AI/ML', 'Python', 'Strategic Planning', 'Technical Leadership'], logo: '🤖', featured: true, source: 'USAJobs' },
  { id: 763, type: 'job', title: 'Semiconductor Policy Analyst', company: 'Department of Energy', industry: 'semiconductor', orgType: 'federal', location: 'Washington, DC', workType: 'hybrid', salary: '$105,000 - $140,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 45, description: 'Analyze semiconductor supply chain policy and support CHIPS Act implementation. Coordinate with industry and academia.', skills: ['Policy Analysis', 'Semiconductor Industry', 'Technical Writing', 'Data Analysis', 'Stakeholder Engagement'], logo: '💎', featured: false, source: 'USAJobs' },
  { id: 764, type: 'job', title: 'Nuclear Regulatory Inspector', company: 'Nuclear Regulatory Commission', industry: 'nuclear', orgType: 'federal', location: 'Rockville, MD', workType: 'onsite', salary: '$95,000 - $135,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 56, description: 'Inspect nuclear power plants and ensure regulatory compliance. Evaluate safety systems and emergency procedures.', skills: ['Nuclear Safety', 'Reactor Operations', 'Regulatory Compliance', 'Technical Writing', 'Inspections'], logo: '☢️', featured: false, source: 'USAJobs' },
  { id: 765, type: 'job', title: 'Quantum Research Scientist', company: 'NIST', industry: 'quantum', orgType: 'federal', location: 'Gaithersburg, MD', workType: 'onsite', salary: '$120,000 - $165,000', clearance: 'none', citizenship: 'us_citizen', experience: 'senior', posted: '3 days ago', applicants: 38, description: 'Conduct quantum computing and quantum measurement research. Develop quantum standards and benchmarks for industry adoption.', skills: ['Quantum Computing', 'Python', 'Metrology', 'Physics', 'Research Publications'], logo: '⚛️', featured: true, source: 'USAJobs' },
  { id: 766, type: 'job', title: 'Cybersecurity Analyst', company: 'DHS Science & Technology', industry: 'cybersecurity', orgType: 'federal', location: 'Washington, DC', workType: 'hybrid', salary: '$100,000 - $145,000', clearance: 'top_secret', citizenship: 'us_citizen', experience: 'mid', posted: '4 days ago', applicants: 123, description: 'Analyze cyber threats to critical infrastructure. Develop cybersecurity tools and strategies for federal agencies.', skills: ['Threat Intelligence', 'Python', 'Network Security', 'Incident Response', 'NIST CSF'], logo: '🛡️', featured: false, source: 'USAJobs' },
  { id: 767, type: 'job', title: 'Aerospace Engineer', company: 'NASA Headquarters', industry: 'aerospace', orgType: 'federal', location: 'Washington, DC', workType: 'hybrid', salary: '$115,000 - $160,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'senior', posted: '1 week ago', applicants: 89, description: 'Support Artemis program engineering oversight. Coordinate technical requirements across NASA centers.', skills: ['Systems Engineering', 'Project Management', 'MATLAB', 'Requirements Analysis', 'Technical Review'], logo: '🚀', featured: false, source: 'USAJobs' },
  { id: 768, type: 'job', title: 'Biomedical Research Scientist', company: 'National Institutes of Health', industry: 'biotech', orgType: 'federal', location: 'Bethesda, MD', workType: 'hybrid', salary: '$110,000 - $155,000', clearance: 'none', citizenship: 'us_citizen', experience: 'senior', posted: '3 days ago', applicants: 78, description: 'Lead biomedical research at NIAID. Investigate emerging infectious diseases and develop therapeutic strategies.', skills: ['Immunology', 'Molecular Biology', 'Python', 'Clinical Research', 'Grant Management'], logo: '🧬', featured: false, source: 'USAJobs' },
  { id: 769, type: 'job', title: 'Health Data Scientist', company: 'National Institutes of Health', industry: 'healthcare', orgType: 'federal', location: 'Bethesda, MD', workType: 'hybrid', salary: '$105,000 - $145,000', clearance: 'none', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 112, description: 'Apply data science and ML to cancer research data at the National Cancer Institute. Analyze clinical trial outcomes.', skills: ['Python', 'R', 'Machine Learning', 'Biostatistics', 'Clinical Data'], logo: '🏥', featured: false, source: 'USAJobs' },
  { id: 770, type: 'job', title: 'Clean Energy Program Manager', company: 'Department of Energy', industry: 'clean_energy', orgType: 'federal', location: 'Washington, DC', workType: 'hybrid', salary: '$125,000 - $170,000', clearance: 'eligible', citizenship: 'us_citizen', experience: 'senior', posted: '1 week ago', applicants: 56, description: 'Manage DOE clean energy R&D portfolio. Oversee multi-million dollar grants for solar, wind, and storage technologies.', skills: ['Program Management', 'Clean Energy', 'Budget Management', 'Stakeholder Engagement', 'Technical Review'], logo: '⚡', featured: false, source: 'USAJobs' },
  { id: 771, type: 'job', title: 'Robotics Research Engineer', company: 'Army Research Laboratory', industry: 'robotics', orgType: 'federal', location: 'Adelphi, MD', workType: 'onsite', salary: '$100,000 - $140,000', clearance: 'secret', citizenship: 'us_citizen', experience: 'mid', posted: '4 days ago', applicants: 65, description: 'Develop autonomous ground robot systems for military applications. Research human-robot teaming and swarm behavior.', skills: ['ROS', 'C++', 'Python', 'Autonomous Systems', 'Computer Vision'], logo: '🦾', featured: false, source: 'USAJobs' },
  { id: 772, type: 'job', title: 'Manufacturing Technology Specialist', company: 'NIST', industry: 'manufacturing', orgType: 'federal', location: 'Gaithersburg, MD', workType: 'onsite', salary: '$95,000 - $135,000', clearance: 'none', citizenship: 'us_citizen', experience: 'mid', posted: '6 days ago', applicants: 34, description: 'Develop manufacturing standards and measurement science for smart manufacturing and advanced materials.', skills: ['Manufacturing Processes', 'Metrology', 'Python', 'Quality Systems', 'Standards Development'], logo: '🏭', featured: false, source: 'USAJobs' },
  { id: 773, type: 'job', title: 'Climate Data Scientist', company: 'NOAA', industry: 'ai', orgType: 'federal', location: 'Silver Spring, MD', workType: 'hybrid', salary: '$100,000 - $140,000', clearance: 'none', citizenship: 'us_citizen', experience: 'mid', posted: '3 days ago', applicants: 89, description: 'Apply AI/ML to climate and weather prediction models. Develop data-driven forecasting tools for NWS.', skills: ['Python', 'Machine Learning', 'Climate Science', 'HPC', 'Data Visualization'], logo: '🤖', featured: false, source: 'USAJobs' },
  { id: 774, type: 'job', title: 'Bioinformatics Program Director', company: 'National Institutes of Health', industry: 'biotech', orgType: 'federal', location: 'Bethesda, MD', workType: 'hybrid', salary: '$135,000 - $185,000', clearance: 'none', citizenship: 'us_citizen', experience: 'executive', posted: '2 weeks ago', applicants: 23, description: 'Direct NIH bioinformatics research programs. Oversee All of Us precision medicine computational initiatives.', skills: ['Bioinformatics', 'Program Management', 'Genomics', 'Strategic Planning', 'Budget Oversight'], logo: '🧬', featured: false, source: 'USAJobs' },
  { id: 775, type: 'job', title: 'Nuclear Safeguards Engineer', company: 'Department of Energy', industry: 'nuclear', orgType: 'federal', location: 'Germantown, MD', workType: 'onsite', salary: '$110,000 - $150,000', clearance: 'q_clearance', citizenship: 'us_citizen', experience: 'mid', posted: '1 week ago', applicants: 28, description: 'Support nuclear material safeguards and nonproliferation programs. Ensure compliance with IAEA standards.', skills: ['Nuclear Safeguards', 'Radiation Detection', 'Nonproliferation', 'Data Analysis', 'Technical Writing'], logo: '☢️', featured: false, source: 'USAJobs' },
  { id: 776, type: 'job', title: 'FDA Medical Device Reviewer', company: 'Food and Drug Administration', industry: 'healthcare', orgType: 'federal', location: 'Silver Spring, MD', workType: 'hybrid', salary: '$95,000 - $135,000', clearance: 'none', citizenship: 'us_citizen', experience: 'mid', posted: '5 days ago', applicants: 67, description: 'Review AI/ML-enabled medical device submissions. Evaluate safety and efficacy of digital health technologies.', skills: ['Medical Devices', 'Regulatory Science', 'AI/ML Evaluation', 'Technical Writing', 'Risk Analysis'], logo: '🏥', featured: false, source: 'USAJobs' },
  // Federal Internships
  { id: 777, type: 'internship', title: 'DARPA Innovation Fellow', company: 'DARPA', industry: 'ai', orgType: 'federal', location: 'Arlington, VA', workType: 'onsite', salary: '$35/hour', clearance: 'eligible', citizenship: 'us_citizen', experience: 'entry', posted: '4 days ago', applicants: 234, description: 'Prestigious fellowship supporting breakthrough AI research programs. Work directly with program managers.', skills: ['Python', 'AI/ML', 'Research', 'Technical Writing'], logo: '🤖', featured: true, duration: '12 weeks', source: 'USAJobs' },
  { id: 778, type: 'internship', title: 'NIST SURF Research Intern', company: 'NIST', industry: 'quantum', orgType: 'federal', location: 'Gaithersburg, MD', workType: 'onsite', salary: '$22/hour', clearance: 'none', citizenship: 'us_citizen', experience: 'entry', posted: '1 week ago', applicants: 178, description: 'Summer Undergraduate Research Fellowship in quantum science or measurement science at NIST.', skills: ['Physics', 'Python', 'Lab Skills', 'Data Analysis'], logo: '⚛️', featured: false, duration: '11 weeks', source: 'NIST SURF' },
  { id: 779, type: 'internship', title: 'DOE Scholars Intern', company: 'Department of Energy', industry: 'clean_energy', orgType: 'federal', location: 'Washington, DC', workType: 'hybrid', salary: '$20/hour', clearance: 'none', citizenship: 'us_citizen', experience: 'entry', posted: '6 days ago', applicants: 289, description: 'DOE Scholars program internship supporting clean energy research and policy. Rotational assignments available.', skills: ['Data Analysis', 'Python', 'Energy Policy', 'Technical Writing'], logo: '⚡', featured: false, duration: '10 weeks', source: 'DOE Scholars' },
];

// Quick Apply Modal Component
const QuickApplyModal: React.FC<{
  opportunity: JobData | null;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ opportunity, onClose, onSubmit }) => {
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">Quick Apply</h2>
              <p className="text-gray-400 text-sm mt-1">{opportunity.title} at {opportunity.company}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">✕</button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Resume *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-gray-900 file:font-medium"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter (Optional)</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell them why you're a great fit..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none"
            />
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Requirements Check</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-400">Citizenship: {citizenshipOptions.find(c => c.id === opportunity.citizenship)?.name}</span>
              </div>
              {opportunity.clearance !== 'none' && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⚠</span>
                  <span className="text-gray-400">Clearance: {clearanceOptions.find(c => c.id === opportunity.clearance)?.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting || !resume} className="flex-1 py-3 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {submitting ? (<><span className="animate-spin">⏳</span> Submitting...</>) : (<>📤 Submit Application</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Toast Component
const Toast: React.FC<{ message: string; type: 'success' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slide-up ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}>
      <span className="text-xl">{type === 'success' ? '✓' : 'ℹ'}</span>
      <span className="text-white font-medium">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white ml-2">✕</button>
    </div>
  );
};

// Helper to map organization type to filter category
const mapOrgTypeToFilter = (orgType: string | null): string => {
  if (!orgType) return 'industry';
  const typeMap: Record<string, string> = {
    'academia': 'academia',
    'university': 'academia',
    'college': 'academia',
    'national_lab': 'national_lab',
    'federal': 'federal',
    'government': 'federal',
    'nonprofit': 'nonprofit',
    'non-profit': 'nonprofit',
    'private': 'industry',
    'industry': 'industry',
    'corporation': 'industry',
  };
  return typeMap[orgType.toLowerCase()] || 'industry';
};

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [opportunityType, setOpportunityType] = useState<'job' | 'internship' | 'map'>('job');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>(['all']);
  const [workType, setWorkType] = useState('all');
  const [clearance, setClearance] = useState('all');
  const [citizenship, setCitizenship] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<(number | string)[]>([]);
  const [applyingTo, setApplyingTo] = useState<JobData | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Database jobs state
  const [databaseJobs, setDatabaseJobs] = useState<JobData[]>([]);
  const [federatedJobs, setFederatedJobs] = useState<JobData[]>([]);
  const [, setLoadingDbJobs] = useState(true);

  // Fetch jobs from database
  useEffect(() => {
    const fetchDatabaseJobs = async () => {
      try {
        // Fetch active jobs with organization info
        const { data: jobs, error } = await supabase
          .from('jobs')
          .select(`
            *,
            organizations:organization_id (
              id,
              name,
              type,
              logo_url
            )
          `)
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
          setLoadingDbJobs(false);
          return;
        }

        // Transform database jobs to match the expected format
        const transformedJobs: JobData[] = (jobs || []).map(job => ({
          id: job.id,
          title: job.title,
          company: job.organizations?.name || 'Unknown Organization',
          logo: job.organizations?.logo_url || '🏢',
          location: job.location || 'Location TBD',
          salary: job.salary_min && job.salary_max
            ? (job.salary_period === 'hourly'
              ? `$${job.salary_min} - $${job.salary_max}/hr`
              : `$${(job.salary_min/1000).toFixed(0)}K - $${(job.salary_max/1000).toFixed(0)}K`)
            : 'Competitive',
          type: job.type === 'internship' ? 'internship' : 'job',
          workType: job.remote ? 'remote' : (job.work_arrangement === 'hybrid' ? 'hybrid' : 'onsite'),
          clearance: job.clearance_level || 'none',
          citizenship: job.citizenship_required || 'any',
          experience: job.experience_level || 'entry',
          industry: job.industry || 'ai',
          orgType: mapOrgTypeToFilter(job.organizations?.type),
          skills: job.required_skills || [],
          description: job.description,
          posted: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          applicants: 0,
          featured: false,
          source: 'database',
        }));

        if (import.meta.env.DEV) console.log('Fetched database jobs:', transformedJobs.length, 'jobs');
        setDatabaseJobs(transformedJobs);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Error in fetchDatabaseJobs:', err);
      } finally {
        setLoadingDbJobs(false);
      }
    };

    fetchDatabaseJobs();
  }, []);

  // Fetch federated jobs (USAJobs, etc.)
  useEffect(() => {
    const fetchFederatedJobs = async () => {
      try {
        const { data: listings, error } = await supabase
          .from('federated_listings')
          .select(`
            id, title, description, short_description, source_url,
            organization_name, location, city, state, is_remote,
            industries, skills, tags, clearance_required,
            content_type, job_type, salary_min, salary_max, salary_period,
            posted_at, expires_at, source_name
          `)
          .eq('status', 'active')
          .in('content_type', ['job', 'internship'])
          .order('posted_at', { ascending: false })
          .limit(200);

        if (error) {
          console.error('Error fetching federated jobs:', error);
          return;
        }

        const transformed: JobData[] = (listings || []).map(listing => ({
          id: `fed-${listing.id}`,
          title: listing.title,
          company: listing.organization_name || listing.source_name || 'Federal Agency',
          logo: '🏛️',
          location: listing.location || [listing.city, listing.state].filter(Boolean).join(', ') || 'Multiple Locations',
          salary: listing.salary_min && listing.salary_max
            ? (listing.salary_period === 'hourly'
              ? `$${listing.salary_min} - $${listing.salary_max}/hr`
              : `$${(listing.salary_min/1000).toFixed(0)}K - $${(listing.salary_max/1000).toFixed(0)}K`)
            : 'See Posting',
          type: listing.content_type === 'internship' ? 'internship' : 'job',
          workType: listing.is_remote ? 'remote' : 'onsite',
          clearance: listing.clearance_required || 'none',
          citizenship: 'us',
          experience: 'mid',
          industry: mapFederatedIndustry(listing.industries),
          orgType: 'federal',
          skills: listing.skills || [],
          description: listing.short_description || listing.description || '',
          posted: listing.posted_at
            ? new Date(listing.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Recent',
          applicants: 0,
          featured: false,
          source: listing.source_url || 'usajobs',
          duration: listing.content_type === 'internship' ? 'varies' : undefined,
        }));

        if (import.meta.env.DEV) console.log('Fetched federated jobs:', transformed.length);
        setFederatedJobs(transformed);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Error in fetchFederatedJobs:', err);
      }
    };

    fetchFederatedJobs();
  }, []);

  useEffect(() => {
    const industry = searchParams.get('industry');
    const search = searchParams.get('search');
    const company = searchParams.get('company');
    if (industry) setSelectedIndustry(industry.toLowerCase());
    if (search) setSearchQuery(search);
    if (company) setSearchQuery(company);
  }, [searchParams]);

  const toggleOrgType = (orgType: string) => {
    setSelectedCompany('all');
    setSelectedLocation('all');
    if (orgType === 'all') {
      setSelectedOrgTypes(['all']);
    } else {
      const newTypes = selectedOrgTypes.includes(orgType)
        ? selectedOrgTypes.filter(t => t !== orgType)
        : [...selectedOrgTypes.filter(t => t !== 'all'), orgType];
      setSelectedOrgTypes(newTypes.length === 0 ? ['all'] : newTypes);
    }
  };

  // Combine static data + database jobs + federated jobs (USAJobs etc.)
  const allOpportunities = useMemo(() => {
    return [...realJobsData, ...databaseJobs, ...federatedJobs];
  }, [databaseJobs, federatedJobs]);

  // Pre-filter by type + industry + orgType to derive dynamic dropdown options
  const preFilteredOpportunities = useMemo(() => {
    return allOpportunities.filter(opp => {
      if (opp.type !== opportunityType) return false;
      if (selectedIndustry !== 'all' && opp.industry !== selectedIndustry) return false;
      if (!selectedOrgTypes.includes('all') && !selectedOrgTypes.includes(opp.orgType)) return false;
      return true;
    });
  }, [allOpportunities, opportunityType, selectedIndustry, selectedOrgTypes]);

  // Dynamic company options from pre-filtered results
  const availableCompanies = useMemo(() => {
    const counts: Record<string, number> = {};
    preFilteredOpportunities.forEach(opp => {
      counts[opp.company] = (counts[opp.company] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }));
  }, [preFilteredOpportunities]);

  // Dynamic location options from pre-filtered results
  const availableLocations = useMemo(() => {
    const counts: Record<string, number> = {};
    preFilteredOpportunities.forEach(opp => {
      counts[opp.location] = (counts[opp.location] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }));
  }, [preFilteredOpportunities]);

  const filteredOpportunities = useMemo(() => {
    return preFilteredOpportunities.filter(opp => {
      if (workType !== 'all' && opp.workType !== workType) return false;
      if (clearance !== 'all' && opp.clearance !== clearance) return false;
      if (citizenship !== 'all' && opp.citizenship !== citizenship) return false;
      if (experienceLevel !== 'all' && opp.experience !== experienceLevel) return false;
      if (selectedCompany !== 'all' && opp.company !== selectedCompany) return false;
      if (selectedLocation !== 'all' && opp.location !== selectedLocation) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const skills = opp.skills || [];
        return opp.title.toLowerCase().includes(query) || opp.company.toLowerCase().includes(query) || skills.some((s: string) => s.toLowerCase().includes(query));
      }
      return true;
    });
  }, [preFilteredOpportunities, workType, clearance, citizenship, experienceLevel, selectedCompany, selectedLocation, searchQuery]);

  const handleSaveJob = (jobId: number | string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      setToast({ message: 'Removed from saved jobs', type: 'info' });
    } else {
      setSavedJobs([...savedJobs, jobId]);
      setToast({ message: 'Saved to your dashboard!', type: 'success' });
    }
  };

  const handleApplySuccess = () => {
    setApplyingTo(null);
    setToast({ message: 'Application submitted successfully!', type: 'success' });
  };

  const jobCount = allOpportunities.filter(o => o.type === 'job').length;
  const internshipCount = allOpportunities.filter(o => o.type === 'internship').length;

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="bg-gradient-to-b from-gray-900 to-transparent px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Jobs, Internships & <span className="text-yellow-500">Workforce Map</span></h1>
          <p className="text-gray-400">Real opportunities from top employers in emerging technology sectors</p>
          <p className="text-xs text-gray-500 mt-2">📊 Data sourced from: TSMC, Intel, Samsung, IBM Quantum, Google DeepMind, OpenAI, Anthropic, SpaceX, Lockheed Martin, ORNL, INL, Northrop Grumman, CrowdStrike, and more</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Primary Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-2xl sm:rounded-full p-1 flex flex-col sm:flex-row w-full sm:w-auto">
            <button onClick={() => setOpportunityType('job')} className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 ${opportunityType === 'job' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}>
              💼 Job Opportunities <span className={`px-2 py-0.5 rounded-full text-xs ${opportunityType === 'job' ? 'bg-gray-900/20' : 'bg-gray-700'}`}>{jobCount}</span>
            </button>
            <button onClick={() => setOpportunityType('internship')} className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 ${opportunityType === 'internship' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}>
              🎓 Internships <span className={`px-2 py-0.5 rounded-full text-xs ${opportunityType === 'internship' ? 'bg-gray-900/20' : 'bg-gray-700'}`}>{internshipCount}</span>
            </button>
            <button onClick={() => setOpportunityType('map')} className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 ${opportunityType === 'map' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}>
              🗺️ Workforce Map
            </button>
          </div>
        </div>

        {opportunityType === 'map' ? (
          <WorkforceMapContent />
        ) : (
        <>
        {/* Industry Sector Pills */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">SELECT INDUSTRY SECTOR</h3>
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <button key={industry.id} onClick={() => { setSelectedIndustry(industry.id); setSelectedCompany('all'); setSelectedLocation('all'); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedIndustry === industry.id ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`}>
                <span>{industry.icon}</span>{industry.name}
              </button>
            ))}
          </div>
        </div>

        {/* Organization Type Chips */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">ORGANIZATION TYPE</h3>
          <div className="flex flex-wrap gap-2">
            {organizationTypes.map(org => (
              <button key={org.id} onClick={() => toggleOrgType(org.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${selectedOrgTypes.includes(org.id) ? org.id === 'all' ? 'bg-gray-600 text-white border-gray-500' : org.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : org.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : org.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : org.color === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-teal-500/20 text-teal-400 border-teal-500/50' : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600'}`}>
                <span>{org.icon}</span>{org.name}
              </button>
            ))}
          </div>
        </div>

        {/* Inline Sub-Filter Bar */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍 Search by title, company, or skills..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500" />
            </div>

            {/* Company Dropdown */}
            <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white min-w-[160px]">
              <option value="all">All Companies</option>
              {availableCompanies.map(c => (<option key={c.name} value={c.name}>{c.name} ({c.count})</option>))}
            </select>

            {/* Location Dropdown */}
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white min-w-[160px]">
              <option value="all">All Locations</option>
              {availableLocations.map(l => (<option key={l.name} value={l.name}>{l.name} ({l.count})</option>))}
            </select>

            {/* Work Type Pills */}
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              {['onsite', 'hybrid', 'remote'].map(wt => (
                <button key={wt} onClick={() => setWorkType(workType === wt ? 'all' : wt)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${workType === wt ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}>
                  {wt === 'onsite' ? '🏢 On-Site' : wt === 'hybrid' ? '🔄 Hybrid' : '🏠 Remote'}
                </button>
              ))}
            </div>

            {/* Experience Dropdown */}
            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white min-w-[130px]">
              {experienceLevels.map(e => (<option key={e.id} value={e.id}>{e.name}</option>))}
            </select>

            {/* More Filters Toggle */}
            <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${showFilters ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>
              ⚙️ More {showFilters ? '▲' : '▼'}
            </button>
          </div>

          {/* Expanded: Clearance + Citizenship */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Security Clearance</label>
                <select value={clearance} onChange={(e) => setClearance(e.target.value)} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white">
                  <option value="all">Any Clearance</option>
                  {clearanceOptions.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Citizenship Requirement</label>
                <select value={citizenship} onChange={(e) => setCitizenship(e.target.value)} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white">
                  <option value="all">Any Status</option>
                  {citizenshipOptions.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
            </div>
          )}

          {/* Active Filter Chips + Clear All */}
          {(selectedCompany !== 'all' || selectedLocation !== 'all' || workType !== 'all' || experienceLevel !== 'all' || clearance !== 'all' || citizenship !== 'all' || searchQuery) && (
            <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap items-center gap-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')} className="hover:text-white">✕</button>
                </span>
              )}
              {selectedCompany !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  {selectedCompany}
                  <button onClick={() => setSelectedCompany('all')} className="hover:text-white">✕</button>
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation('all')} className="hover:text-white">✕</button>
                </span>
              )}
              {workType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  {workType === 'onsite' ? 'On-Site' : workType === 'hybrid' ? 'Hybrid' : 'Remote'}
                  <button onClick={() => setWorkType('all')} className="hover:text-white">✕</button>
                </span>
              )}
              {experienceLevel !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                  {experienceLevels.find(e => e.id === experienceLevel)?.name}
                  <button onClick={() => setExperienceLevel('all')} className="hover:text-white">✕</button>
                </span>
              )}
              {clearance !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                  {clearanceOptions.find(c => c.id === clearance)?.name}
                  <button onClick={() => setClearance('all')} className="hover:text-white">✕</button>
                </span>
              )}
              {citizenship !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                  {citizenshipOptions.find(c => c.id === citizenship)?.name}
                  <button onClick={() => setCitizenship('all')} className="hover:text-white">✕</button>
                </span>
              )}
              <button onClick={() => { setSearchQuery(''); setSelectedCompany('all'); setSelectedLocation('all'); setWorkType('all'); setExperienceLevel('all'); setClearance('all'); setCitizenship('all'); }} className="text-yellow-500 hover:text-yellow-400 text-xs font-medium ml-auto">Clear All</button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">Showing <span className="text-white font-semibold">{filteredOpportunities.length}</span> {opportunityType === 'job' ? 'jobs' : 'internships'}{selectedIndustry !== 'all' && ` in ${industries.find(i => i.id === selectedIndustry)?.name}`}</p>
          {savedJobs.length > 0 && (<button onClick={() => navigate('/dashboard')} className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center gap-2">❤️ {savedJobs.length} Saved Jobs</button>)}
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map(opp => (
            <div key={opp.id} className={`bg-gray-900/50 rounded-2xl border transition-all hover:border-gray-600 ${opp.featured ? 'border-yellow-500/50' : 'border-gray-800'}`}>
              {opp.featured && (<div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1.5 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-t-2xl">⭐ Featured {opportunityType === 'job' ? 'Position' : 'Internship'}</div>)}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl">{opp.logo}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{opp.title}</h3>
                      <p className="text-yellow-500 font-medium">{opp.company}</p>
                      {'source' in opp && <p className="text-xs text-gray-500 mt-1">Source: {opp.source}</p>}
                    </div>
                  </div>
                  <button onClick={() => handleSaveJob(opp.id)} className={`p-2 rounded-lg transition-colors ${savedJobs.includes(opp.id) ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400 hover:text-red-400'}`}>{savedJobs.includes(opp.id) ? '❤️' : '🤍'}</button>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{opp.description}</p>

                <div className="flex flex-wrap gap-3 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-400">📍 {opp.location}</span>
                  <span className="flex items-center gap-1 text-green-400 font-medium">💰 {opp.salary}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${opp.workType === 'remote' ? 'bg-green-500/20 text-green-400' : opp.workType === 'hybrid' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300'}`}>
                    {opp.workType === 'onsite' ? '🏢 On-Site' : opp.workType === 'remote' ? '🏠 Remote' : '🔄 Hybrid'}
                  </span>
                  {opp.type === 'internship' && 'duration' in opp && (<span className="text-purple-400">⏱️ {opp.duration}</span>)}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.clearance !== 'none' && (<span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium flex items-center gap-1">🔒 {clearanceOptions.find(c => c.id === opp.clearance)?.name}</span>)}
                  {opp.citizenship === 'us_citizen' && (<span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">🇺🇸 US Citizen Only</span>)}
                  {opp.citizenship === 'visa_sponsor' && (<span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">✈️ Visa Sponsorship</span>)}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.skills.slice(0, 4).map((skill: string) => (<span key={skill} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">{skill}</span>))}
                  {opp.skills.length > 4 && (<span className="px-2 py-1 text-gray-500 text-xs">+{opp.skills.length - 4} more</span>)}
                </div>

                {/* AI Economy Metrics */}
                {(() => {
                  const aiMetrics = getJobAIMetrics(opp.industry);
                  return (
                    <div className="flex items-center gap-4 mb-4 py-3 px-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-gray-500 text-xs">AI Exposure:</span>
                        <AIMetricsTooltip type="exposure" value={aiMetrics.exposureIndex} />
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getExposureBgColor(aiMetrics.exposureIndex)} ${getExposureColor(aiMetrics.exposureIndex)}`}>
                          {aiMetrics.exposureIndex}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-gray-500 text-xs">AI Opportunity:</span>
                        <AIMetricsTooltip type="opportunity" value={aiMetrics.opportunityIndex} />
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getOpportunityBgColor(aiMetrics.opportunityIndex)} ${getOpportunityColor(aiMetrics.opportunityIndex)}`}>
                          {aiMetrics.opportunityIndex}%
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="text-sm text-gray-500"><span>📅 {opp.posted}</span><span className="mx-2">•</span><span>👥 {opp.applicants} applicants</span></div>
                  <button onClick={() => setApplyingTo(opp)} className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2">Apply Now →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No opportunities found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={() => { setSelectedIndustry('all'); setSelectedOrgTypes(['all']); setWorkType('all'); setClearance('all'); setCitizenship('all'); setExperienceLevel('all'); setSearchQuery(''); }} className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-bold">Clear All Filters</button>
          </div>
        )}
        </>
        )}
      </div>

      {/* Contextual Career Q&A */}
      {selectedIndustry !== 'all' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-white/5">
          <ExpertQASection
            industry={selectedIndustry}
            title={`Career Q&A: ${selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1).replace(/-/g, ' ')}`}
            description="Expert answers related to careers in this industry"
            limit={3}
            compactAttribution
            showTags
          />
        </div>
      )}

      {applyingTo && (<QuickApplyModal opportunity={applyingTo} onClose={() => setApplyingTo(null)} onSubmit={handleApplySuccess} />)}
      {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease; }
        .animate-slide-up { animation: slide-up 0.3s ease; }
      `}</style>
    </div>
  );
};

export default JobsPage;
