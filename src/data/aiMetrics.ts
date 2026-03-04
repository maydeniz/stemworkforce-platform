// ===========================================
// AI Exposure & Opportunity Metrics
// ===========================================
// Based on research from:
// - MIT's Iceberg Index (2025)
// - Federal Reserve's AIOE Methodology
// - CyberForward's Tech Proficiency Score
// - Felten et al.'s AI Occupational Exposure Index
// ===========================================

/**
 * AI EXPOSURE INDEX (0-100)
 * ===========================
 * Measures how much a program's curriculum and career outcomes
 * will be impacted by AI technologies.
 *
 * Components:
 * - Task Automation Risk (30%): % of graduate job tasks automatable by AI
 * - AI Tool Integration (25%): How much AI is used in the field
 * - Skill Displacement Rate (20%): How fast skills become obsolete
 * - Complementarity Factor (25%): How well humans work alongside AI
 *
 * Interpretation:
 * - 0-25: Low Exposure - Traditional hands-on roles, limited AI impact
 * - 26-50: Moderate Exposure - Some tasks enhanced/automated by AI
 * - 51-75: High Exposure - Significant AI integration, augmentation focus
 * - 76-100: Very High Exposure - AI-centric roles, rapid transformation
 *
 * Note: High exposure is NOT necessarily negative - it indicates
 * the field is at the forefront of AI transformation.
 */

/**
 * AI OPPORTUNITY INDEX (0-100)
 * =============================
 * Measures career growth potential and earning power in the AI economy.
 *
 * Components:
 * - AI Skill Demand (30%): Job postings requiring AI/ML skills
 * - Salary Premium (25%): Wage boost for AI-skilled workers
 * - Growth Trajectory (20%): Projected job growth with AI integration
 * - Innovation Potential (15%): Ability to create/improve AI solutions
 * - Cross-Industry Mobility (10%): Transferability of AI skills
 *
 * Interpretation:
 * - 0-25: Limited Opportunity - Few AI-related career paths
 * - 26-50: Moderate Opportunity - Some AI roles available
 * - 51-75: Strong Opportunity - Many AI career paths, good growth
 * - 76-100: Exceptional Opportunity - High demand, premium salaries
 */

export interface AIMetrics {
  exposureIndex: number; // 0-100
  opportunityIndex: number; // 0-100
  exposureLevel: 'low' | 'moderate' | 'high' | 'very-high';
  opportunityLevel: 'limited' | 'moderate' | 'strong' | 'exceptional';
  exposureBreakdown: {
    taskAutomationRisk: number; // 0-100
    aiToolIntegration: number; // 0-100
    skillDisplacementRate: number; // 0-100
    complementarityFactor: number; // 0-100
  };
  opportunityBreakdown: {
    aiSkillDemand: number; // 0-100
    salaryPremium: number; // 0-100
    growthTrajectory: number; // 0-100
    innovationPotential: number; // 0-100
    crossIndustryMobility: number; // 0-100
  };
  insights: string[];
  careerImplications: string[];
  recommendedAISkills: string[];
}

// ===========================================
// Industry AI Metrics
// ===========================================

export const industryAIMetrics: Record<string, AIMetrics> = {
  // AI & Machine Learning
  ai: {
    exposureIndex: 95,
    opportunityIndex: 98,
    exposureLevel: 'very-high',
    opportunityLevel: 'exceptional',
    exposureBreakdown: {
      taskAutomationRisk: 85,
      aiToolIntegration: 100,
      skillDisplacementRate: 70,
      complementarityFactor: 95,
    },
    opportunityBreakdown: {
      aiSkillDemand: 100,
      salaryPremium: 95,
      growthTrajectory: 98,
      innovationPotential: 100,
      crossIndustryMobility: 95,
    },
    insights: [
      'AI/ML roles are at the epicenter of technological transformation',
      'Skills in this field command the highest salary premiums (+35-50%)',
      'Continuous learning is essential as techniques evolve rapidly',
      'Strong demand across all industries seeking AI transformation',
    ],
    careerImplications: [
      'Expect to retrain on new frameworks every 2-3 years',
      'Leadership roles emerging in AI ethics and governance',
      'Hybrid roles combining AI with domain expertise are growing',
    ],
    recommendedAISkills: [
      'Large Language Models (LLMs)',
      'Prompt Engineering',
      'MLOps & Model Deployment',
      'AI Ethics & Responsible AI',
      'Generative AI Applications',
    ],
  },

  // Quantum Technologies
  quantum: {
    exposureIndex: 45,
    opportunityIndex: 82,
    exposureLevel: 'moderate',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 25,
      aiToolIntegration: 55,
      skillDisplacementRate: 30,
      complementarityFactor: 70,
    },
    opportunityBreakdown: {
      aiSkillDemand: 78,
      salaryPremium: 85,
      growthTrajectory: 90,
      innovationPotential: 95,
      crossIndustryMobility: 65,
    },
    insights: [
      'Quantum computing is emerging but not yet mainstream AI-integrated',
      'Quantum ML is a growing intersection with high future potential',
      'Hardware roles less AI-exposed than algorithm development',
      'Government and defense driving significant investment',
    ],
    careerImplications: [
      'Early movers will have significant career advantages',
      'Quantum-AI hybrid algorithms becoming important specialization',
      'Academic research partnerships remain valuable for advancement',
    ],
    recommendedAISkills: [
      'Quantum Machine Learning',
      'Hybrid Classical-Quantum Algorithms',
      'AI for Quantum Error Correction',
      'Quantum Simulation with AI',
    ],
  },

  // Semiconductor
  semiconductor: {
    exposureIndex: 72,
    opportunityIndex: 88,
    exposureLevel: 'high',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 55,
      aiToolIntegration: 85,
      skillDisplacementRate: 45,
      complementarityFactor: 90,
    },
    opportunityBreakdown: {
      aiSkillDemand: 88,
      salaryPremium: 82,
      growthTrajectory: 95,
      innovationPotential: 92,
      crossIndustryMobility: 78,
    },
    insights: [
      'AI is revolutionizing chip design and yield optimization',
      'CHIPS Act driving massive domestic investment and hiring',
      'AI accelerator design is the fastest-growing specialization',
      'Process engineering increasingly AI-augmented',
    ],
    careerImplications: [
      'AI chip design skills command 25-40% salary premiums',
      'Traditional fab roles augmented but not replaced by AI',
      'Cross-training in AI/ML highly valuable for advancement',
    ],
    recommendedAISkills: [
      'AI for Chip Design (EDA)',
      'Machine Learning for Yield Optimization',
      'AI Accelerator Architecture',
      'Predictive Maintenance ML',
      'Computer Vision for Defect Detection',
    ],
  },

  // Nuclear Technologies
  nuclear: {
    exposureIndex: 38,
    opportunityIndex: 65,
    exposureLevel: 'moderate',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 25,
      aiToolIntegration: 45,
      skillDisplacementRate: 20,
      complementarityFactor: 60,
    },
    opportunityBreakdown: {
      aiSkillDemand: 55,
      salaryPremium: 68,
      growthTrajectory: 72,
      innovationPotential: 65,
      crossIndustryMobility: 55,
    },
    insights: [
      'Safety-critical nature limits rapid AI automation adoption',
      'Predictive maintenance and monitoring benefiting from AI',
      'NRC regulations create structured adoption pathway',
      'SMR development incorporating more AI-driven design',
    ],
    careerImplications: [
      'Core reactor operations remain human-centric for safety',
      'AI skills valuable for maintenance and monitoring roles',
      'Digital twin expertise increasingly sought after',
    ],
    recommendedAISkills: [
      'Predictive Maintenance Analytics',
      'Digital Twin Modeling',
      'AI for Safety Systems Monitoring',
      'Anomaly Detection',
      'Natural Language Processing for Documentation',
    ],
  },

  // Cybersecurity
  cybersecurity: {
    exposureIndex: 78,
    opportunityIndex: 92,
    exposureLevel: 'high',
    opportunityLevel: 'exceptional',
    exposureBreakdown: {
      taskAutomationRisk: 60,
      aiToolIntegration: 90,
      skillDisplacementRate: 55,
      complementarityFactor: 95,
    },
    opportunityBreakdown: {
      aiSkillDemand: 95,
      salaryPremium: 88,
      growthTrajectory: 92,
      innovationPotential: 90,
      crossIndustryMobility: 90,
    },
    insights: [
      'AI is transforming both offensive and defensive security',
      'Threat detection increasingly AI-powered and real-time',
      'Human expertise critical for incident response and strategy',
      'AI-generated attacks creating new defensive requirements',
    ],
    careerImplications: [
      'Security analysts must understand AI-powered threats',
      'AI/ML security specialization commands premium salaries',
      'Roles shifting from reactive to proactive AI-augmented defense',
    ],
    recommendedAISkills: [
      'AI-Powered Threat Detection',
      'Security Automation & Orchestration',
      'Adversarial Machine Learning',
      'AI Red Teaming',
      'LLM Security & Prompt Injection Defense',
    ],
  },

  // Aerospace & Defense
  aerospace: {
    exposureIndex: 58,
    opportunityIndex: 76,
    exposureLevel: 'high',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 45,
      aiToolIntegration: 70,
      skillDisplacementRate: 35,
      complementarityFactor: 80,
    },
    opportunityBreakdown: {
      aiSkillDemand: 75,
      salaryPremium: 72,
      growthTrajectory: 78,
      innovationPotential: 85,
      crossIndustryMobility: 70,
    },
    insights: [
      'Autonomous systems driving significant AI integration',
      'Defense applications subject to security/clearance requirements',
      'AI for simulation and testing accelerating development',
      'Space exploration increasingly AI-augmented',
    ],
    careerImplications: [
      'Autonomous vehicle/drone expertise highly valued',
      'Security clearance + AI skills = premium career trajectory',
      'Systems integration roles expanding with AI adoption',
    ],
    recommendedAISkills: [
      'Autonomous Systems & Robotics',
      'Computer Vision for Navigation',
      'Reinforcement Learning',
      'AI for Simulation & Testing',
      'Edge AI for Embedded Systems',
    ],
  },

  // Biotechnology
  biotech: {
    exposureIndex: 68,
    opportunityIndex: 85,
    exposureLevel: 'high',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 50,
      aiToolIntegration: 80,
      skillDisplacementRate: 45,
      complementarityFactor: 85,
    },
    opportunityBreakdown: {
      aiSkillDemand: 85,
      salaryPremium: 80,
      growthTrajectory: 88,
      innovationPotential: 92,
      crossIndustryMobility: 75,
    },
    insights: [
      'AI revolutionizing drug discovery and protein folding',
      'Computational biology becoming essential skill set',
      'Lab automation integrating AI for experiment design',
      'Personalized medicine driving AI/genomics integration',
    ],
    careerImplications: [
      'Wet lab + computational skills highly valuable combination',
      'AI-driven drug discovery roles emerging rapidly',
      'Bioinformatics evolving into AI-first discipline',
    ],
    recommendedAISkills: [
      'AI for Drug Discovery',
      'Protein Structure Prediction',
      'Genomics & AI/ML',
      'Lab Automation & Robotics',
      'Clinical Trial Analytics',
    ],
  },

  // Healthcare IT
  healthcare: {
    exposureIndex: 65,
    opportunityIndex: 80,
    exposureLevel: 'high',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 55,
      aiToolIntegration: 75,
      skillDisplacementRate: 40,
      complementarityFactor: 80,
    },
    opportunityBreakdown: {
      aiSkillDemand: 82,
      salaryPremium: 75,
      growthTrajectory: 85,
      innovationPotential: 78,
      crossIndustryMobility: 72,
    },
    insights: [
      'Clinical decision support AI becoming standard of care',
      'HIPAA and regulatory compliance shaping AI adoption',
      'Administrative automation showing fastest AI adoption',
      'Imaging AI (radiology, pathology) most mature application',
    ],
    careerImplications: [
      'Clinical informatics roles require AI literacy',
      'Epic/Cerner + AI integration skills highly valued',
      'Medical coding being transformed by AI automation',
    ],
    recommendedAISkills: [
      'Clinical Decision Support Systems',
      'Medical Imaging AI',
      'Natural Language Processing for EHR',
      'Healthcare Analytics & Prediction',
      'AI Compliance & Privacy',
    ],
  },

  // Robotics & Automation
  robotics: {
    exposureIndex: 85,
    opportunityIndex: 90,
    exposureLevel: 'very-high',
    opportunityLevel: 'exceptional',
    exposureBreakdown: {
      taskAutomationRisk: 70,
      aiToolIntegration: 95,
      skillDisplacementRate: 60,
      complementarityFactor: 92,
    },
    opportunityBreakdown: {
      aiSkillDemand: 92,
      salaryPremium: 85,
      growthTrajectory: 90,
      innovationPotential: 95,
      crossIndustryMobility: 85,
    },
    insights: [
      'Robotics and AI are deeply intertwined disciplines',
      'Warehouse/logistics automation driving massive demand',
      'Humanoid robotics creating new specialization areas',
      'ROS2 and AI integration becoming essential skills',
    ],
    careerImplications: [
      'Traditional robotics roles evolving to require AI skills',
      'Computer vision expertise essential for most roles',
      'Simulation and digital twin skills increasingly valued',
    ],
    recommendedAISkills: [
      'Computer Vision & Perception',
      'Reinforcement Learning for Control',
      'Robot Learning from Demonstration',
      'Simulation & Synthetic Data',
      'Edge AI for Embedded Systems',
    ],
  },

  // Clean Energy
  'clean-energy': {
    exposureIndex: 52,
    opportunityIndex: 75,
    exposureLevel: 'high',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 40,
      aiToolIntegration: 65,
      skillDisplacementRate: 35,
      complementarityFactor: 70,
    },
    opportunityBreakdown: {
      aiSkillDemand: 72,
      salaryPremium: 70,
      growthTrajectory: 85,
      innovationPotential: 78,
      crossIndustryMobility: 68,
    },
    insights: [
      'Grid optimization increasingly AI-driven',
      'Predictive maintenance for wind/solar assets',
      'Energy storage management leveraging ML',
      'IRA driving massive sector investment and hiring',
    ],
    careerImplications: [
      'Operations roles augmented by AI analytics',
      'Grid modernization creating new AI-focused positions',
      'Energy trading/forecasting heavily AI-dependent',
    ],
    recommendedAISkills: [
      'Energy Forecasting & Prediction',
      'Smart Grid Analytics',
      'Predictive Maintenance',
      'Optimization Algorithms',
      'IoT & Sensor Data Analytics',
    ],
  },

  // Advanced Manufacturing
  manufacturing: {
    exposureIndex: 62,
    opportunityIndex: 78,
    exposureLevel: 'high',
    opportunityLevel: 'strong',
    exposureBreakdown: {
      taskAutomationRisk: 55,
      aiToolIntegration: 70,
      skillDisplacementRate: 45,
      complementarityFactor: 75,
    },
    opportunityBreakdown: {
      aiSkillDemand: 78,
      salaryPremium: 72,
      growthTrajectory: 80,
      innovationPotential: 82,
      crossIndustryMobility: 75,
    },
    insights: [
      'Industry 4.0 driving AI adoption across all processes',
      'Quality control transformed by computer vision',
      'Predictive maintenance reducing downtime significantly',
      'Digital twin adoption accelerating in large enterprises',
    ],
    careerImplications: [
      'Traditional manufacturing roles being augmented by AI',
      'Process engineers need data science fundamentals',
      'Maintenance technicians upskilling in predictive analytics',
    ],
    recommendedAISkills: [
      'Computer Vision for Quality Control',
      'Predictive Maintenance Analytics',
      'Digital Twin Development',
      'Process Optimization ML',
      'Industrial IoT Analytics',
    ],
  },
};

// ===========================================
// Program-Level AI Metrics Calculator
// ===========================================

export interface ProgramAIMetrics extends AIMetrics {
  programName: string;
  programType: string;
  industryContext: string;
  aiReadinessScore: number; // How well the program prepares for AI economy
  curriculumAIIntegration: 'none' | 'basic' | 'moderate' | 'advanced' | 'comprehensive';
}

/**
 * Calculate program-specific AI metrics based on program attributes
 */
export function calculateProgramAIMetrics(
  industry: string,
  programType: 'University' | 'Community College' | 'Employer Training' | 'Medical School' | 'Bootcamp' | 'Certification',
  programName: string,
  skills: string[]
): ProgramAIMetrics {
  const baseMetrics = industryAIMetrics[industry] || industryAIMetrics['manufacturing'];

  // Adjust based on program type
  let typeMultiplier = 1.0;
  let curriculumIntegration: ProgramAIMetrics['curriculumAIIntegration'] = 'basic';

  switch (programType) {
    case 'University':
      typeMultiplier = 1.1;
      curriculumIntegration = 'moderate';
      break;
    case 'Medical School':
      typeMultiplier = 1.15;
      curriculumIntegration = 'advanced';
      break;
    case 'Bootcamp':
      typeMultiplier = 1.2;
      curriculumIntegration = 'advanced';
      break;
    case 'Employer Training':
      typeMultiplier = 1.0;
      curriculumIntegration = 'moderate';
      break;
    case 'Community College':
      typeMultiplier = 0.95;
      curriculumIntegration = 'basic';
      break;
    case 'Certification':
      typeMultiplier = 1.05;
      curriculumIntegration = 'moderate';
      break;
  }

  // Check for AI-related skills in curriculum
  const aiSkillKeywords = ['AI', 'ML', 'Machine Learning', 'Deep Learning', 'Neural', 'Data Science', 'Analytics', 'Automation'];
  const hasAISkills = skills.some(skill =>
    aiSkillKeywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))
  );

  if (hasAISkills) {
    curriculumIntegration = curriculumIntegration === 'basic' ? 'moderate' :
                           curriculumIntegration === 'moderate' ? 'advanced' : 'comprehensive';
    typeMultiplier *= 1.1;
  }

  // Calculate AI readiness score (0-100)
  const aiReadinessScore = Math.min(100, Math.round(
    (baseMetrics.opportunityIndex * 0.4 +
     (curriculumIntegration === 'comprehensive' ? 100 :
      curriculumIntegration === 'advanced' ? 80 :
      curriculumIntegration === 'moderate' ? 60 :
      curriculumIntegration === 'basic' ? 40 : 20) * 0.3 +
     baseMetrics.exposureBreakdown.complementarityFactor * 0.3) * typeMultiplier
  ));

  return {
    ...baseMetrics,
    programName,
    programType,
    industryContext: industry,
    exposureIndex: Math.round(baseMetrics.exposureIndex * typeMultiplier),
    opportunityIndex: Math.round(baseMetrics.opportunityIndex * typeMultiplier),
    aiReadinessScore,
    curriculumAIIntegration: curriculumIntegration,
  };
}

// ===========================================
// Helper Functions
// ===========================================

export function getExposureLabel(index: number): string {
  if (index <= 25) return 'Low Exposure';
  if (index <= 50) return 'Moderate Exposure';
  if (index <= 75) return 'High Exposure';
  return 'Very High Exposure';
}

export function getOpportunityLabel(index: number): string {
  if (index <= 25) return 'Limited Opportunity';
  if (index <= 50) return 'Moderate Opportunity';
  if (index <= 75) return 'Strong Opportunity';
  return 'Exceptional Opportunity';
}

export function getExposureColor(index: number): string {
  if (index <= 25) return 'text-blue-400';
  if (index <= 50) return 'text-yellow-400';
  if (index <= 75) return 'text-orange-400';
  return 'text-red-400';
}

export function getOpportunityColor(index: number): string {
  if (index <= 25) return 'text-gray-400';
  if (index <= 50) return 'text-yellow-400';
  if (index <= 75) return 'text-green-400';
  return 'text-emerald-400';
}

export function getExposureBgColor(index: number): string {
  if (index <= 25) return 'bg-blue-500/20';
  if (index <= 50) return 'bg-yellow-500/20';
  if (index <= 75) return 'bg-orange-500/20';
  return 'bg-red-500/20';
}

export function getOpportunityBgColor(index: number): string {
  if (index <= 25) return 'bg-gray-500/20';
  if (index <= 50) return 'bg-yellow-500/20';
  if (index <= 75) return 'bg-green-500/20';
  return 'bg-emerald-500/20';
}
