// ===========================================
// University Research Portal API Service
// CRUD operations for research partnership features
// Supabase-first with sample data fallback
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  Researcher,
  ResearchInstitution,
  ResearchApplication,
  ResearchApplicationStatus,
  ResearchApplicationFormData,
  ResearchApplicationFilters,
  SchoolResearchRequest,
  SchoolResearchFilters,
  DataSharingRequest,
  DataUseAgreement,
  SecureDataRoom,
  ResearchFindings,
  ResearchReviewCommittee,
  ApplicationReview,
  ResearcherDashboardStats,
  DistrictResearchDashboard,
  ReviewStage,
} from '@/types/researchPortal';

// ===========================================
// SAMPLE DATA (fallback when DB tables don't exist yet)
// ===========================================

const SAMPLE_RESEARCHERS: Researcher[] = [
  {
    id: 'researcher-001',
    firstName: 'Dr. Emily',
    lastName: 'Watson',
    email: 'ewatson@stanford.edu',
    phone: '(650) 723-4000',
    title: 'Associate Professor',
    position: 'Faculty',
    institutionId: 'inst-001',
    department: 'Graduate School of Education',
    facultyPage: 'https://stanford.edu/~ewatson',
    orcidId: '0000-0002-1234-5678',
    researchAreas: ['student-achievement', 'assessment', 'educational-technology'],
    verificationStatus: 'verified',
    citiTrainingCompleted: true,
    citiTrainingDate: '2024-01-15',
    totalStudiesSubmitted: 5,
    studiesApproved: 4,
    studiesCompleted: 3,
    complianceScore: 95,
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    lastActiveAt: '2024-12-10T09:15:00Z',
  },
  {
    id: 'researcher-002',
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    email: 'mchen@berkeley.edu',
    phone: '(510) 642-0000',
    title: 'Assistant Professor',
    position: 'Faculty',
    institutionId: 'inst-002',
    department: 'School of Education',
    researchAreas: ['stem-education', 'equity-access', 'early-childhood'],
    verificationStatus: 'verified',
    citiTrainingCompleted: true,
    citiTrainingDate: '2024-03-20',
    totalStudiesSubmitted: 3,
    studiesApproved: 2,
    studiesCompleted: 1,
    complianceScore: 88,
    createdAt: '2023-09-15T10:00:00Z',
    updatedAt: '2024-11-15T11:00:00Z',
  },
  {
    id: 'researcher-003',
    firstName: 'Dr. Aisha',
    lastName: 'Patel',
    email: 'apatel@ucla.edu',
    phone: '(310) 825-4000',
    title: 'Professor',
    position: 'Faculty',
    institutionId: 'inst-003',
    department: 'Department of Education',
    facultyPage: 'https://ucla.edu/~apatel',
    orcidId: '0000-0003-5678-9012',
    researchAreas: ['special-education', 'inclusion', 'behavioral-interventions'],
    verificationStatus: 'verified',
    citiTrainingCompleted: true,
    citiTrainingDate: '2024-06-10',
    totalStudiesSubmitted: 8,
    studiesApproved: 7,
    studiesCompleted: 5,
    complianceScore: 98,
    createdAt: '2022-01-10T10:00:00Z',
    updatedAt: '2024-11-20T16:00:00Z',
    lastActiveAt: '2024-12-08T11:30:00Z',
  },
];

const SAMPLE_INSTITUTIONS: ResearchInstitution[] = [
  {
    id: 'inst-001',
    name: 'Stanford University',
    type: 'university',
    address: {
      street: '450 Jane Stanford Way',
      city: 'Stanford',
      state: 'CA',
      zipCode: '94305',
      country: 'USA',
    },
    website: 'https://stanford.edu',
    irbContact: {
      name: 'Dr. Jane Smith',
      email: 'irb@stanford.edu',
      phone: '(650) 723-2480',
    },
    dataUseAgreementOnFile: true,
    duaExpirationDate: '2025-12-31',
    federalwideAssuranceNumber: 'FWA00000935',
    verificationStatus: 'verified',
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'inst-002',
    name: 'UC Berkeley',
    type: 'university',
    address: {
      street: '200 California Hall',
      city: 'Berkeley',
      state: 'CA',
      zipCode: '94720',
      country: 'USA',
    },
    website: 'https://berkeley.edu',
    irbContact: {
      name: 'Dr. Robert Johnson',
      email: 'ophs@berkeley.edu',
      phone: '(510) 642-7461',
    },
    dataUseAgreementOnFile: true,
    duaExpirationDate: '2025-06-30',
    federalwideAssuranceNumber: 'FWA00006252',
    verificationStatus: 'verified',
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'inst-003',
    name: 'UCLA',
    type: 'university',
    address: {
      street: '405 Hilgard Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90095',
      country: 'USA',
    },
    website: 'https://ucla.edu',
    irbContact: {
      name: 'Dr. Maria Garcia',
      email: 'irb@research.ucla.edu',
      phone: '(310) 825-7122',
    },
    dataUseAgreementOnFile: true,
    duaExpirationDate: '2026-03-31',
    federalwideAssuranceNumber: 'FWA00004642',
    verificationStatus: 'verified',
    createdAt: '2020-01-01T00:00:00Z',
  },
];

const SAMPLE_APPLICATIONS: ResearchApplication[] = [
  {
    id: 'app-001',
    applicationNumber: 'RES-2026-0001',
    principalInvestigatorId: 'researcher-001',
    title: 'Impact of AI-Assisted Learning Tools on Student Achievement',
    shortDescription: 'A randomized controlled trial examining the effectiveness of AI tutoring systems in K-8 mathematics.',
    fullDescription: 'This study will examine the impact of AI-assisted learning tools on student mathematics achievement in grades 3-8...',
    researchType: 'experimental',
    researchFocus: ['student-achievement', 'educational-technology', 'assessment'],
    keywords: ['AI', 'mathematics', 'tutoring', 'RCT'],
    researchQuestions: [
      'What is the effect of AI tutoring on mathematics achievement?',
      'How do effects vary by student demographic characteristics?',
    ],
    objectives: [
      'Measure impact on standardized test scores',
      'Analyze usage patterns and engagement',
      'Identify effective implementation strategies',
    ],
    methodology: {
      design: 'experimental',
      approach: 'Cluster randomized controlled trial with schools as the unit of randomization',
      instruments: [
        {
          name: 'Student Survey',
          type: 'survey',
          description: 'Pre/post survey measuring attitudes toward mathematics',
          administrationMethod: 'online',
          estimatedDuration: 15,
          validationStatus: 'validated',
        },
      ],
      dataAnalysisPlan: 'Hierarchical linear modeling with students nested within schools',
    },
    participantInfo: {
      targetPopulation: 'Students in grades 3-8',
      gradelevels: ['3', '4', '5', '6', '7', '8'],
      estimatedSampleSize: 2000,
      recruitmentMethod: 'School-level recruitment through district partnership',
      consentProcess: 'Active parental consent with student assent',
      parentConsentRequired: true,
      studentAssentRequired: true,
      passiveConsentAllowed: false,
      involvesMinors: true,
      involvesSpecialEducation: false,
      involvesMentalHealth: false,
    },
    dataCollection: {
      startDate: '2026-09-01',
      endDate: '2027-05-31',
      frequency: 'monthly',
      dataTypes: ['survey-responses', 'assessment-scores', 'grades', 'demographic'],
      existingDataRequested: true,
      existingDataDescription: 'Historical mathematics assessment scores for baseline analysis',
      collectionLocation: 'classroom',
      instructionalTimeRequired: true,
      estimatedInstructionalMinutes: 30,
      teacherInvolvementRequired: true,
      teacherInvolvementDescription: 'Teachers will facilitate platform access and complete monthly surveys',
      audioRecording: false,
      videoRecording: false,
      photoCapture: false,
    },
    timeline: {
      phases: [
        {
          name: 'Recruitment',
          description: 'School and teacher recruitment',
          startDate: '2026-06-01',
          endDate: '2026-08-31',
          activities: ['Principal meetings', 'Teacher orientation', 'Consent collection'],
        },
        {
          name: 'Implementation',
          description: 'Intervention delivery',
          startDate: '2026-09-01',
          endDate: '2027-05-31',
          activities: ['Platform deployment', 'Ongoing support', 'Data collection'],
        },
      ],
      keyMilestones: [
        {
          name: 'Recruitment complete',
          date: '2026-08-15',
          description: 'All participating schools confirmed',
          status: 'pending',
        },
      ],
      totalDuration: '12 months',
      schoolYearSpan: '2026-2027',
    },
    irbInfo: {
      irbApprovalStatus: 'approved',
      irbProtocolNumber: 'IRB-67890',
      irbApprovalDate: '2026-02-15',
      irbExpirationDate: '2027-02-14',
      riskLevel: 'minimal',
      humanSubjectsProtection: true,
      ferpaCompliant: true,
    },
    documents: [
      {
        id: 'doc-001',
        type: 'irb-approval',
        name: 'IRB Approval Letter',
        url: '/documents/irb-approval.pdf',
        uploadedAt: '2026-02-16T10:00:00Z',
        uploadedBy: 'researcher-001',
        required: true,
        status: 'approved',
      },
    ],
    targetDistricts: ['district-001'],
    targetSchools: ['school-001', 'school-002', 'school-003'],
    status: 'approved',
    submittedAt: '2026-01-15T10:00:00Z',
    currentReviewStage: 'final-approval',
    reviewHistory: [
      {
        id: 'review-001',
        stage: 'initial-screening',
        reviewerId: 'admin-001',
        reviewerName: 'Research Coordinator',
        reviewerRole: 'Research Office',
        action: 'approved',
        comments: 'Application complete and ready for committee review',
        timestamp: '2026-01-20T14:00:00Z',
      },
    ],
    approvalConditions: [
      'Quarterly progress reports required',
      'Final report due within 90 days of study completion',
    ],
    approvedAt: '2026-03-01T10:00:00Z',
    approvedBy: 'superintendent-001',
    expirationDate: '2027-08-31',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    lastActivityAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'app-002',
    applicationNumber: 'RES-2026-0002',
    principalInvestigatorId: 'researcher-002',
    title: 'STEM Equity in Urban Schools: Access and Outcomes',
    shortDescription: 'Mixed methods study exploring STEM access and achievement gaps in urban school districts.',
    fullDescription: 'This study uses a mixed methods approach to examine STEM education equity in urban K-12 schools...',
    researchType: 'mixed-methods',
    researchFocus: ['stem-education', 'equity-access'],
    keywords: ['STEM', 'equity', 'urban', 'mixed-methods'],
    researchQuestions: [
      'What STEM opportunities are available across urban schools?',
      'How do outcomes vary by socioeconomic status?',
    ],
    objectives: [
      'Map STEM course offerings across district',
      'Analyze achievement data by demographics',
      'Interview teachers and administrators about barriers',
    ],
    methodology: {
      design: 'mixed-methods',
      approach: 'Sequential explanatory design with quantitative analysis followed by qualitative interviews',
      instruments: [
        {
          name: 'Teacher Interview Protocol',
          type: 'interview',
          description: 'Semi-structured interviews about STEM teaching',
          administrationMethod: 'in-person',
          estimatedDuration: 45,
        },
      ],
      dataAnalysisPlan: 'Multi-level modeling for quantitative data; thematic analysis for qualitative data',
    },
    participantInfo: {
      targetPopulation: 'Students and teachers in grades 6-12',
      gradelevels: ['6', '7', '8', '9', '10', '11', '12'],
      estimatedSampleSize: 500,
      recruitmentMethod: 'Purposeful sampling of schools with varying STEM offerings',
      consentProcess: 'Active parental consent for students; informed consent for teachers',
      parentConsentRequired: true,
      studentAssentRequired: true,
      passiveConsentAllowed: false,
      involvesMinors: true,
      involvesSpecialEducation: false,
      involvesMentalHealth: false,
    },
    dataCollection: {
      startDate: '2026-10-01',
      endDate: '2027-03-31',
      frequency: 'one-time',
      dataTypes: ['survey-responses', 'assessment-scores', 'interview-transcripts'],
      existingDataRequested: true,
      existingDataDescription: 'Course enrollment and achievement data for 3 years',
      collectionLocation: 'school',
      instructionalTimeRequired: false,
      teacherInvolvementRequired: true,
      teacherInvolvementDescription: 'Teachers participate in optional interviews',
      audioRecording: true,
      videoRecording: false,
      photoCapture: false,
    },
    timeline: {
      phases: [
        {
          name: 'Data Analysis',
          description: 'Quantitative analysis of existing data',
          startDate: '2026-10-01',
          endDate: '2026-12-31',
          activities: ['Data cleaning', 'Statistical modeling'],
        },
        {
          name: 'Interviews',
          description: 'Qualitative data collection',
          startDate: '2027-01-01',
          endDate: '2027-03-31',
          activities: ['Teacher interviews', 'Admin interviews', 'Transcription'],
        },
      ],
      keyMilestones: [],
      totalDuration: '6 months',
      schoolYearSpan: '2026-2027',
    },
    irbInfo: {
      irbApprovalStatus: 'approved',
      irbProtocolNumber: 'IRB-78901',
      irbApprovalDate: '2026-08-01',
      irbExpirationDate: '2027-08-01',
      riskLevel: 'minimal',
      humanSubjectsProtection: true,
      ferpaCompliant: true,
    },
    documents: [],
    targetDistricts: ['district-001'],
    targetSchools: ['school-001', 'school-002'],
    status: 'under-review',
    submittedAt: '2026-09-01T10:00:00Z',
    currentReviewStage: 'committee-review',
    reviewHistory: [
      {
        id: 'review-002',
        stage: 'initial-screening',
        reviewerId: 'admin-001',
        reviewerName: 'Research Coordinator',
        reviewerRole: 'Research Office',
        action: 'approved',
        comments: 'Passed initial screening',
        timestamp: '2026-09-05T10:00:00Z',
      },
    ],
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z',
    lastActivityAt: '2026-09-05T10:00:00Z',
  },
];

// ===========================================
// DB-to-frontend mappers
// ===========================================

function mapResearcher(row: Record<string, unknown>): Researcher {
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    phone: row.phone as string,
    title: row.title as string,
    position: row.position as string,
    institutionId: row.institution_id as string,
    department: row.department as string,
    facultyPage: row.faculty_page as string | undefined,
    orcidId: row.orcid_id as string | undefined,
    researchAreas: (row.research_areas as string[]) || [],
    verificationStatus: row.verification_status as Researcher['verificationStatus'],
    citiTrainingCompleted: row.citi_training_completed as boolean,
    citiTrainingDate: row.citi_training_date as string | undefined,
    totalStudiesSubmitted: (row.total_studies_submitted as number) || 0,
    studiesApproved: (row.studies_approved as number) || 0,
    studiesCompleted: (row.studies_completed as number) || 0,
    complianceScore: (row.compliance_score as number) || 100,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    lastActiveAt: row.last_active_at as string | undefined,
  };
}

function mapInstitution(row: Record<string, unknown>): ResearchInstitution {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as ResearchInstitution['type'],
    address: (row.address as ResearchInstitution['address']) || {
      street: '', city: '', state: '', zipCode: '', country: 'USA',
    },
    website: row.website as string,
    irbContact: (row.irb_contact as ResearchInstitution['irbContact']) || {
      name: '', email: '', phone: '',
    },
    dataUseAgreementOnFile: row.data_use_agreement_on_file as boolean,
    duaExpirationDate: row.dua_expiration_date as string | undefined,
    federalwideAssuranceNumber: row.federalwide_assurance_number as string | undefined,
    verificationStatus: row.verification_status as ResearchInstitution['verificationStatus'],
    createdAt: row.created_at as string,
  };
}

function mapApplication(row: Record<string, unknown>): ResearchApplication {
  return {
    id: row.id as string,
    applicationNumber: row.application_number as string,
    principalInvestigatorId: row.principal_investigator_id as string,
    title: row.title as string,
    shortDescription: row.short_description as string,
    fullDescription: row.full_description as string,
    researchType: row.research_type as ResearchApplication['researchType'],
    researchFocus: (row.research_focus as string[]) || [],
    keywords: (row.keywords as string[]) || [],
    researchQuestions: (row.research_questions as string[]) || [],
    objectives: (row.objectives as string[]) || [],
    methodology: (row.methodology as ResearchApplication['methodology']) || {
      design: 'observational', approach: '', instruments: [], dataAnalysisPlan: '',
    },
    participantInfo: (row.participant_info as ResearchApplication['participantInfo']) || {
      targetPopulation: '', gradelevels: [], estimatedSampleSize: 0,
      recruitmentMethod: '', consentProcess: '', parentConsentRequired: true,
      studentAssentRequired: true, passiveConsentAllowed: false,
      involvesMinors: true, involvesSpecialEducation: false, involvesMentalHealth: false,
    },
    dataCollection: (row.data_collection as ResearchApplication['dataCollection']) || {
      startDate: '', endDate: '', frequency: '', dataTypes: [],
      existingDataRequested: false, collectionLocation: 'school',
      instructionalTimeRequired: false, teacherInvolvementRequired: false,
      audioRecording: false, videoRecording: false, photoCapture: false,
    },
    timeline: (row.timeline as ResearchApplication['timeline']) || {
      phases: [], keyMilestones: [], totalDuration: '', schoolYearSpan: '',
    },
    irbInfo: (row.irb_info as ResearchApplication['irbInfo']) || {
      irbApprovalStatus: 'pending', riskLevel: 'minimal',
      humanSubjectsProtection: true, ferpaCompliant: true,
    },
    documents: (row.documents as ResearchApplication['documents']) || [],
    targetDistricts: (row.target_districts as string[]) || [],
    targetSchools: (row.target_schools as string[]) || [],
    status: row.status as ResearchApplication['status'],
    submittedAt: row.submitted_at as string | undefined,
    currentReviewStage: row.current_review_stage as string | undefined,
    reviewHistory: (row.review_history as ResearchApplication['reviewHistory']) || [],
    approvalConditions: (row.approval_conditions as string[]) || [],
    approvedAt: row.approved_at as string | undefined,
    approvedBy: row.approved_by as string | undefined,
    expirationDate: row.expiration_date as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    lastActivityAt: row.last_activity_at as string | undefined,
  };
}

// ===========================================
// Local filter helpers (applied to sample data)
// ===========================================

function filterApplications(
  applications: ResearchApplication[],
  filters?: ResearchApplicationFilters
): ResearchApplication[] {
  let result = [...applications];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(search) ||
        a.applicationNumber.toLowerCase().includes(search) ||
        a.shortDescription.toLowerCase().includes(search)
    );
  }

  if (filters?.status?.length) {
    result = result.filter((a) => filters.status!.includes(a.status));
  }

  if (filters?.researchType?.length) {
    result = result.filter((a) => filters.researchType!.includes(a.researchType));
  }

  if (filters?.researchFocus?.length) {
    result = result.filter((a) =>
      a.researchFocus.some((f) => filters.researchFocus!.includes(f))
    );
  }

  if (filters?.districtId) {
    result = result.filter((a) => a.targetDistricts.includes(filters.districtId!));
  }

  if (filters?.schoolId) {
    result = result.filter(
      (a) => a.targetSchools && a.targetSchools.includes(filters.schoolId!)
    );
  }

  if (filters?.researcherId) {
    result = result.filter(
      (a) => a.principalInvestigatorId === filters.researcherId
    );
  }

  return result;
}

// ===========================================
// RESEARCH PORTAL SERVICE
// ===========================================

class ResearchPortalService {
  // ===========================================
  // RESEARCHER MANAGEMENT
  // ===========================================

  async getResearchers(filters?: {
    search?: string;
    institutionId?: string;
    verificationStatus?: string[];
  }): Promise<Researcher[]> {
    try {
      let query = supabase.from('researchers').select('*');

      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }
      if (filters?.institutionId) {
        query = query.eq('institution_id', filters.institutionId);
      }
      if (filters?.verificationStatus?.length) {
        query = query.in('verification_status', filters.verificationStatus);
      }

      query = query.order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const researchers = (data || []).map(mapResearcher);
      if (researchers.length === 0) {
        // Fallback to sample data with local filtering
        let fallback = [...SAMPLE_RESEARCHERS];
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          fallback = fallback.filter(
            (r) =>
              r.firstName.toLowerCase().includes(search) ||
              r.lastName.toLowerCase().includes(search) ||
              r.email.toLowerCase().includes(search)
          );
        }
        if (filters?.institutionId) {
          fallback = fallback.filter((r) => r.institutionId === filters.institutionId);
        }
        if (filters?.verificationStatus?.length) {
          fallback = fallback.filter((r) =>
            filters.verificationStatus!.includes(r.verificationStatus)
          );
        }
        return fallback;
      }
      return researchers;
    } catch (err) {
      console.error('Error fetching researchers:', err);
      let fallback = [...SAMPLE_RESEARCHERS];
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        fallback = fallback.filter(
          (r) =>
            r.firstName.toLowerCase().includes(search) ||
            r.lastName.toLowerCase().includes(search) ||
            r.email.toLowerCase().includes(search)
        );
      }
      if (filters?.institutionId) {
        fallback = fallback.filter((r) => r.institutionId === filters.institutionId);
      }
      if (filters?.verificationStatus?.length) {
        fallback = fallback.filter((r) =>
          filters.verificationStatus!.includes(r.verificationStatus)
        );
      }
      return fallback;
    }
  }

  async getResearcher(id: string): Promise<Researcher | null> {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapResearcher(data) : null;
    } catch (err) {
      console.error('Error fetching researcher:', err);
      return SAMPLE_RESEARCHERS.find((r) => r.id === id) || null;
    }
  }

  async createResearcher(data: Partial<Researcher>): Promise<Researcher> {
    try {
      const insertPayload = {
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        title: data.title || '',
        position: data.position || '',
        institution_id: data.institutionId || '',
        department: data.department || '',
        faculty_page: data.facultyPage || null,
        orcid_id: data.orcidId || null,
        research_areas: data.researchAreas || [],
        verification_status: 'pending',
        citi_training_completed: false,
        total_studies_submitted: 0,
        studies_approved: 0,
        studies_completed: 0,
        compliance_score: 100,
      };

      const { data: row, error } = await supabase
        .from('researchers')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return mapResearcher(row);
    } catch (err) {
      console.error('Error creating researcher:', err);
      // Fallback: local creation
      const researcher: Researcher = {
        id: `researcher-${Date.now()}`,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        title: data.title || '',
        position: data.position || '',
        institutionId: data.institutionId || '',
        department: data.department || '',
        researchAreas: data.researchAreas || [],
        verificationStatus: 'pending',
        citiTrainingCompleted: false,
        totalStudiesSubmitted: 0,
        studiesApproved: 0,
        studiesCompleted: 0,
        complianceScore: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      SAMPLE_RESEARCHERS.push(researcher);
      return researcher;
    }
  }

  async updateResearcher(id: string, updates: Partial<Researcher>): Promise<Researcher> {
    try {
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.firstName !== undefined) updatePayload.first_name = updates.firstName;
      if (updates.lastName !== undefined) updatePayload.last_name = updates.lastName;
      if (updates.email !== undefined) updatePayload.email = updates.email;
      if (updates.phone !== undefined) updatePayload.phone = updates.phone;
      if (updates.title !== undefined) updatePayload.title = updates.title;
      if (updates.position !== undefined) updatePayload.position = updates.position;
      if (updates.institutionId !== undefined) updatePayload.institution_id = updates.institutionId;
      if (updates.department !== undefined) updatePayload.department = updates.department;
      if (updates.facultyPage !== undefined) updatePayload.faculty_page = updates.facultyPage;
      if (updates.orcidId !== undefined) updatePayload.orcid_id = updates.orcidId;
      if (updates.researchAreas !== undefined) updatePayload.research_areas = updates.researchAreas;
      if (updates.verificationStatus !== undefined) updatePayload.verification_status = updates.verificationStatus;
      if (updates.citiTrainingCompleted !== undefined) updatePayload.citi_training_completed = updates.citiTrainingCompleted;
      if (updates.citiTrainingDate !== undefined) updatePayload.citi_training_date = updates.citiTrainingDate;

      const { data, error } = await supabase
        .from('researchers')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapResearcher(data);
    } catch (err) {
      console.error('Error updating researcher:', err);
      // Fallback
      const index = SAMPLE_RESEARCHERS.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Researcher not found');
      SAMPLE_RESEARCHERS[index] = {
        ...SAMPLE_RESEARCHERS[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return SAMPLE_RESEARCHERS[index];
    }
  }

  // ===========================================
  // INSTITUTIONS
  // ===========================================

  async getInstitutions(): Promise<ResearchInstitution[]> {
    try {
      const { data, error } = await supabase
        .from('research_institutions')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const institutions = (data || []).map(mapInstitution);
      if (institutions.length === 0) {
        return [...SAMPLE_INSTITUTIONS];
      }
      return institutions;
    } catch (err) {
      console.error('Error fetching research institutions:', err);
      return [...SAMPLE_INSTITUTIONS];
    }
  }

  async getInstitution(id: string): Promise<ResearchInstitution | null> {
    try {
      const { data, error } = await supabase
        .from('research_institutions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapInstitution(data) : null;
    } catch (err) {
      console.error('Error fetching research institution:', err);
      return SAMPLE_INSTITUTIONS.find((i) => i.id === id) || null;
    }
  }

  // ===========================================
  // RESEARCH APPLICATIONS
  // ===========================================

  async getApplications(
    filters?: ResearchApplicationFilters
  ): Promise<{ applications: ResearchApplication[]; total: number }> {
    try {
      let query = supabase
        .from('research_applications')
        .select('*', { count: 'exact' });

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,application_number.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`
        );
      }
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.researchType?.length) {
        query = query.in('research_type', filters.researchType);
      }
      if (filters?.districtId) {
        query = query.contains('target_districts', [filters.districtId]);
      }
      if (filters?.schoolId) {
        query = query.contains('target_schools', [filters.schoolId]);
      }
      if (filters?.researcherId) {
        query = query.eq('principal_investigator_id', filters.researcherId);
      }

      query = query.order('updated_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;

      const applications = (data || []).map(mapApplication);
      if (applications.length === 0) {
        const filtered = filterApplications(SAMPLE_APPLICATIONS, filters);
        return { applications: filtered, total: filtered.length };
      }
      return { applications, total: count || applications.length };
    } catch (err) {
      console.error('Error fetching research applications:', err);
      const filtered = filterApplications(SAMPLE_APPLICATIONS, filters);
      return { applications: filtered, total: filtered.length };
    }
  }

  async getApplication(id: string): Promise<ResearchApplication | null> {
    try {
      const { data, error } = await supabase
        .from('research_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapApplication(data) : null;
    } catch (err) {
      console.error('Error fetching research application:', err);
      return SAMPLE_APPLICATIONS.find((a) => a.id === id) || null;
    }
  }

  async getApplicationByNumber(applicationNumber: string): Promise<ResearchApplication | null> {
    try {
      const { data, error } = await supabase
        .from('research_applications')
        .select('*')
        .eq('application_number', applicationNumber)
        .single();

      if (error) throw error;
      return data ? mapApplication(data) : null;
    } catch (err) {
      console.error('Error fetching application by number:', err);
      return SAMPLE_APPLICATIONS.find((a) => a.applicationNumber === applicationNumber) || null;
    }
  }

  async createApplication(
    researcherId: string,
    data: ResearchApplicationFormData
  ): Promise<ResearchApplication> {
    try {
      const applicationNumber = `RES-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 9999) + 1
      ).padStart(4, '0')}`;

      const insertPayload = {
        application_number: applicationNumber,
        principal_investigator_id: researcherId,
        title: data.title,
        short_description: data.shortDescription,
        full_description: data.shortDescription,
        research_type: data.researchType,
        research_focus: data.researchFocus,
        keywords: [],
        research_questions: data.researchQuestions,
        objectives: data.objectives,
        methodology: {
          design: data.methodologyDesign,
          approach: data.methodologyApproach,
          instruments: data.instruments,
          dataAnalysisPlan: data.dataAnalysisPlan,
        },
        participant_info: {
          targetPopulation: data.targetPopulation,
          gradelevels: data.gradeLevels,
          estimatedSampleSize: data.estimatedSampleSize,
          recruitmentMethod: data.recruitmentMethod,
          consentProcess: data.consentProcess,
          parentConsentRequired: true,
          studentAssentRequired: true,
          passiveConsentAllowed: false,
          involvesMinors: true,
          involvesSpecialEducation: data.specialPopulations.includes('special-education'),
          involvesMentalHealth: false,
        },
        data_collection: {
          startDate: data.dataCollectionStartDate,
          endDate: data.dataCollectionEndDate,
          frequency: 'one-time',
          dataTypes: data.dataTypes,
          existingDataRequested: false,
          collectionLocation: data.collectionLocation,
          instructionalTimeRequired: data.instructionalTimeRequired,
          estimatedInstructionalMinutes: data.instructionalMinutes,
          teacherInvolvementRequired: data.teacherInvolvementRequired,
          teacherInvolvementDescription: data.teacherInvolvementDescription,
          audioRecording: data.recordingTypes?.includes('audio') || false,
          videoRecording: data.recordingTypes?.includes('video') || false,
          photoCapture: data.recordingTypes?.includes('photo') || false,
        },
        timeline: {
          phases: data.phases,
          keyMilestones: [],
          totalDuration: data.totalDuration,
          schoolYearSpan: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        },
        irb_info: {
          irbApprovalStatus: data.irbApprovalStatus,
          irbProtocolNumber: data.irbProtocolNumber,
          riskLevel: data.riskLevel,
          humanSubjectsProtection: true,
          ferpaCompliant: data.ferpaCompliant,
        },
        documents: [],
        target_districts: data.targetDistricts,
        target_schools: data.targetSchools,
        status: 'draft',
        review_history: [],
      };

      const { data: row, error } = await supabase
        .from('research_applications')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return mapApplication(row);
    } catch (err) {
      console.error('Error creating research application:', err);
      // Fallback: local creation
      const applicationNumber = `RES-${new Date().getFullYear()}-${String(
        SAMPLE_APPLICATIONS.length + 1
      ).padStart(4, '0')}`;

      const application: ResearchApplication = {
        id: `app-${Date.now()}`,
        applicationNumber,
        principalInvestigatorId: researcherId,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.shortDescription,
        researchType: data.researchType as ResearchApplication['researchType'],
        researchFocus: data.researchFocus,
        keywords: [],
        researchQuestions: data.researchQuestions,
        objectives: data.objectives,
        methodology: {
          design: data.methodologyDesign as ResearchApplication['researchType'],
          approach: data.methodologyApproach,
          instruments: data.instruments.map((i) => ({
            name: i.name,
            type: i.type,
            description: i.description,
            administrationMethod: i.administrationMethod,
            estimatedDuration: i.estimatedDuration,
          })),
          dataAnalysisPlan: data.dataAnalysisPlan,
        },
        participantInfo: {
          targetPopulation: data.targetPopulation,
          gradelevels: data.gradeLevels,
          estimatedSampleSize: data.estimatedSampleSize,
          recruitmentMethod: data.recruitmentMethod,
          consentProcess: data.consentProcess,
          parentConsentRequired: true,
          studentAssentRequired: true,
          passiveConsentAllowed: false,
          involvesMinors: true,
          involvesSpecialEducation: data.specialPopulations.includes('special-education'),
          involvesMentalHealth: false,
        },
        dataCollection: {
          startDate: data.dataCollectionStartDate,
          endDate: data.dataCollectionEndDate,
          frequency: 'one-time',
          dataTypes: data.dataTypes,
          existingDataRequested: false,
          collectionLocation: data.collectionLocation as 'classroom' | 'school' | 'online' | 'mixed',
          instructionalTimeRequired: data.instructionalTimeRequired,
          estimatedInstructionalMinutes: data.instructionalMinutes,
          teacherInvolvementRequired: data.teacherInvolvementRequired,
          teacherInvolvementDescription: data.teacherInvolvementDescription,
          audioRecording: data.recordingTypes?.includes('audio') || false,
          videoRecording: data.recordingTypes?.includes('video') || false,
          photoCapture: data.recordingTypes?.includes('photo') || false,
        },
        timeline: {
          phases: data.phases.map((p) => ({
            name: p.name,
            description: p.description,
            startDate: p.startDate,
            endDate: p.endDate,
            activities: p.activities,
          })),
          keyMilestones: [],
          totalDuration: data.totalDuration,
          schoolYearSpan: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        },
        irbInfo: {
          irbApprovalStatus: data.irbApprovalStatus as ResearchApplication['irbInfo']['irbApprovalStatus'],
          irbProtocolNumber: data.irbProtocolNumber,
          riskLevel: data.riskLevel as 'minimal' | 'moderate' | 'high',
          humanSubjectsProtection: true,
          ferpaCompliant: data.ferpaCompliant,
        },
        documents: [],
        targetDistricts: data.targetDistricts,
        targetSchools: data.targetSchools,
        status: 'draft',
        reviewHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };

      SAMPLE_APPLICATIONS.push(application);
      return application;
    }
  }

  async updateApplication(
    id: string,
    updates: Partial<ResearchApplication>
  ): Promise<ResearchApplication> {
    try {
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) updatePayload.title = updates.title;
      if (updates.shortDescription !== undefined) updatePayload.short_description = updates.shortDescription;
      if (updates.fullDescription !== undefined) updatePayload.full_description = updates.fullDescription;
      if (updates.status !== undefined) updatePayload.status = updates.status;
      if (updates.submittedAt !== undefined) updatePayload.submitted_at = updates.submittedAt;
      if (updates.currentReviewStage !== undefined) updatePayload.current_review_stage = updates.currentReviewStage;
      if (updates.reviewHistory !== undefined) updatePayload.review_history = updates.reviewHistory;
      if (updates.approvedAt !== undefined) updatePayload.approved_at = updates.approvedAt;
      if (updates.approvedBy !== undefined) updatePayload.approved_by = updates.approvedBy;
      if (updates.approvalConditions !== undefined) updatePayload.approval_conditions = updates.approvalConditions;
      if (updates.expirationDate !== undefined) updatePayload.expiration_date = updates.expirationDate;

      const { data, error } = await supabase
        .from('research_applications')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapApplication(data);
    } catch (err) {
      console.error('Error updating research application:', err);
      // Fallback
      const index = SAMPLE_APPLICATIONS.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Application not found');
      SAMPLE_APPLICATIONS[index] = {
        ...SAMPLE_APPLICATIONS[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
      return SAMPLE_APPLICATIONS[index];
    }
  }

  async submitApplication(id: string): Promise<ResearchApplication> {
    return this.updateApplication(id, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      currentReviewStage: 'initial-screening',
    });
  }

  async updateApplicationStatus(
    id: string,
    status: ResearchApplicationStatus,
    reviewStage?: ReviewStage,
    comments?: string,
    reviewerId?: string
  ): Promise<ResearchApplication> {
    const application = await this.getApplication(id);
    if (!application) throw new Error('Application not found');

    const reviewEntry = {
      id: `review-${Date.now()}`,
      stage: reviewStage || application.currentReviewStage || 'initial-screening',
      reviewerId: reviewerId || 'system',
      reviewerName: 'Reviewer',
      reviewerRole: 'Staff',
      action: status === 'approved' ? 'approved' : status === 'denied' ? 'denied' : 'requested-changes',
      comments: comments || '',
      timestamp: new Date().toISOString(),
    } as ResearchApplication['reviewHistory'][0];

    return this.updateApplication(id, {
      status,
      currentReviewStage: reviewStage,
      reviewHistory: [...application.reviewHistory, reviewEntry],
      approvedAt: status === 'approved' ? new Date().toISOString() : undefined,
      approvedBy: status === 'approved' ? reviewerId : undefined,
    });
  }

  // ===========================================
  // SCHOOL-LEVEL COORDINATION
  // ===========================================

  async getSchoolResearchRequests(
    filters?: SchoolResearchFilters
  ): Promise<SchoolResearchRequest[]> {
    try {
      let query = supabase.from('school_research_requests').select('*');

      if (filters?.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }
      if (filters?.districtId) {
        query = query.eq('district_id', filters.districtId);
      }
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        applicationId: row.application_id as string,
        schoolId: row.school_id as string,
        schoolName: row.school_name as string,
        districtId: row.district_id as string,
        requestedParticipants: row.requested_participants as number,
        gradeLevels: (row.grade_levels as string[]) || [],
        estimatedTimeCommitment: row.estimated_time_commitment as string,
        schedulingNeeds: row.scheduling_needs as string,
        status: row.status as string,
        currentActiveStudies: (row.current_active_studies as number) || 0,
        researchBurdenScore: (row.research_burden_score as number) || 0,
        capacityAvailable: row.capacity_available as boolean,
        teachersRequested: (row.teachers_requested as number) || 0,
        teachersConfirmed: (row.teachers_confirmed as number) || 0,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })) as SchoolResearchRequest[];
    } catch (err) {
      console.error('Error fetching school research requests:', err);
      return [];
    }
  }

  async getSchoolResearchRequest(id: string): Promise<SchoolResearchRequest | null> {
    try {
      const { data, error } = await supabase
        .from('school_research_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        applicationId: data.application_id,
        schoolId: data.school_id,
        schoolName: data.school_name,
        districtId: data.district_id,
        requestedParticipants: data.requested_participants,
        gradeLevels: data.grade_levels || [],
        estimatedTimeCommitment: data.estimated_time_commitment,
        schedulingNeeds: data.scheduling_needs,
        status: data.status,
        currentActiveStudies: data.current_active_studies || 0,
        researchBurdenScore: data.research_burden_score || 0,
        capacityAvailable: data.capacity_available,
        teachersRequested: data.teachers_requested || 0,
        teachersConfirmed: data.teachers_confirmed || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as SchoolResearchRequest;
    } catch (err) {
      console.error('Error fetching school research request:', err);
      return null;
    }
  }

  async createSchoolResearchRequest(
    applicationId: string,
    schoolId: string
  ): Promise<SchoolResearchRequest> {
    try {
      const insertPayload = {
        application_id: applicationId,
        school_id: schoolId,
        school_name: 'School Name',
        district_id: 'district-001',
        requested_participants: 0,
        grade_levels: [],
        estimated_time_commitment: '',
        scheduling_needs: '',
        status: 'pending',
        current_active_studies: 0,
        research_burden_score: 0,
        capacity_available: true,
        teachers_requested: 0,
        teachers_confirmed: 0,
      };

      const { data, error } = await supabase
        .from('school_research_requests')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        applicationId: data.application_id,
        schoolId: data.school_id,
        schoolName: data.school_name,
        districtId: data.district_id,
        requestedParticipants: data.requested_participants,
        gradeLevels: data.grade_levels || [],
        estimatedTimeCommitment: data.estimated_time_commitment,
        schedulingNeeds: data.scheduling_needs,
        status: data.status,
        currentActiveStudies: data.current_active_studies || 0,
        researchBurdenScore: data.research_burden_score || 0,
        capacityAvailable: data.capacity_available,
        teachersRequested: data.teachers_requested || 0,
        teachersConfirmed: data.teachers_confirmed || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as SchoolResearchRequest;
    } catch (err) {
      console.error('Error creating school research request:', err);
      // Fallback
      const request: SchoolResearchRequest = {
        id: `school-req-${Date.now()}`,
        applicationId,
        schoolId,
        schoolName: 'School Name',
        districtId: 'district-001',
        requestedParticipants: 0,
        gradeLevels: [],
        estimatedTimeCommitment: '',
        schedulingNeeds: '',
        status: 'pending',
        currentActiveStudies: 0,
        researchBurdenScore: 0,
        capacityAvailable: true,
        teachersRequested: 0,
        teachersConfirmed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return request;
    }
  }

  async updateSchoolResearchRequest(
    id: string,
    updates: Partial<SchoolResearchRequest>
  ): Promise<SchoolResearchRequest> {
    try {
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.status !== undefined) updatePayload.status = updates.status;
      if (updates.requestedParticipants !== undefined) updatePayload.requested_participants = updates.requestedParticipants;
      if (updates.gradeLevels !== undefined) updatePayload.grade_levels = updates.gradeLevels;
      if (updates.teachersConfirmed !== undefined) updatePayload.teachers_confirmed = updates.teachersConfirmed;

      const { data, error } = await supabase
        .from('school_research_requests')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        applicationId: data.application_id,
        schoolId: data.school_id,
        schoolName: data.school_name,
        districtId: data.district_id,
        requestedParticipants: data.requested_participants,
        gradeLevels: data.grade_levels || [],
        estimatedTimeCommitment: data.estimated_time_commitment,
        schedulingNeeds: data.scheduling_needs,
        status: data.status,
        currentActiveStudies: data.current_active_studies || 0,
        researchBurdenScore: data.research_burden_score || 0,
        capacityAvailable: data.capacity_available,
        teachersRequested: data.teachers_requested || 0,
        teachersConfirmed: data.teachers_confirmed || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as SchoolResearchRequest;
    } catch (err) {
      console.error('Error updating school research request:', err);
      // Fallback
      return {
        id,
        applicationId: 'app-001',
        schoolId: 'school-001',
        schoolName: 'School Name',
        districtId: 'district-001',
        requestedParticipants: 0,
        gradeLevels: [],
        estimatedTimeCommitment: '',
        schedulingNeeds: '',
        status: updates.status || 'pending',
        currentActiveStudies: 0,
        researchBurdenScore: 0,
        capacityAvailable: true,
        teachersRequested: 0,
        teachersConfirmed: 0,
        ...updates,
        updatedAt: new Date().toISOString(),
      } as SchoolResearchRequest;
    }
  }

  // ===========================================
  // DATA SHARING & FERPA COMPLIANCE
  // ===========================================

  async getDataSharingRequests(applicationId: string): Promise<DataSharingRequest[]> {
    try {
      const { data, error } = await supabase
        .from('data_sharing_requests')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        applicationId: row.application_id as string,
        requesterId: row.requester_id as string,
        dataElements: (row.data_elements as string[]) || [],
        deIdentificationLevel: row.de_identification_level as string,
        studentCount: row.student_count as number,
        gradeSpan: row.grade_span as string,
        schoolIds: (row.school_ids as string[]) || [],
        ferpaExemption: row.ferpa_exemption as string,
        ferpaJustification: row.ferpa_justification as string,
        duaStatus: row.dua_status as string,
        transferMethod: row.transfer_method as string,
        status: row.status as string,
        retentionPeriod: row.retention_period as string,
        destructionDate: row.destruction_date as string,
        destructionVerified: row.destruction_verified as boolean,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })) as DataSharingRequest[];
    } catch (err) {
      console.error('Error fetching data sharing requests:', err);
      return [];
    }
  }

  async createDataSharingRequest(
    applicationId: string,
    data: Partial<DataSharingRequest>
  ): Promise<DataSharingRequest> {
    try {
      const insertPayload = {
        application_id: applicationId,
        requester_id: data.requesterId || '',
        data_elements: data.dataElements || [],
        de_identification_level: data.deIdentificationLevel || 'de-identified',
        student_count: data.studentCount || 0,
        grade_span: data.gradeSpan || '',
        school_ids: data.schoolIds || [],
        ferpa_exemption: data.ferpaExemption || 'studies-exception',
        ferpa_justification: data.ferpaJustification || '',
        dua_status: 'required',
        transfer_method: data.transferMethod || 'secure-portal',
        status: 'draft',
        retention_period: data.retentionPeriod || '5 years',
        destruction_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 5)
        ).toISOString(),
        destruction_verified: false,
      };

      const { data: row, error } = await supabase
        .from('data_sharing_requests')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: row.id,
        applicationId: row.application_id,
        requesterId: row.requester_id,
        dataElements: row.data_elements || [],
        deIdentificationLevel: row.de_identification_level,
        studentCount: row.student_count,
        gradeSpan: row.grade_span,
        schoolIds: row.school_ids || [],
        ferpaExemption: row.ferpa_exemption,
        ferpaJustification: row.ferpa_justification,
        duaStatus: row.dua_status,
        transferMethod: row.transfer_method,
        status: row.status,
        retentionPeriod: row.retention_period,
        destructionDate: row.destruction_date,
        destructionVerified: row.destruction_verified,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      } as DataSharingRequest;
    } catch (err) {
      console.error('Error creating data sharing request:', err);
      // Fallback
      const request: DataSharingRequest = {
        id: `dsr-${Date.now()}`,
        applicationId,
        requesterId: data.requesterId || '',
        dataElements: data.dataElements || [],
        deIdentificationLevel: data.deIdentificationLevel || 'de-identified',
        studentCount: data.studentCount || 0,
        gradeSpan: data.gradeSpan || '',
        schoolIds: data.schoolIds || [],
        ferpaExemption: data.ferpaExemption || 'studies-exception',
        ferpaJustification: data.ferpaJustification || '',
        duaStatus: 'required',
        transferMethod: data.transferMethod || 'secure-portal',
        status: 'draft',
        retentionPeriod: data.retentionPeriod || '5 years',
        destructionDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 5)
        ).toISOString(),
        destructionVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return request;
    }
  }

  async getDataUseAgreement(id: string): Promise<DataUseAgreement | null> {
    try {
      const { data, error } = await supabase
        .from('data_use_agreements')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        applicationId: data.application_id,
        institutionId: data.institution_id,
        districtId: data.district_id,
        version: data.version,
        effectiveDate: data.effective_date,
        expirationDate: data.expiration_date,
        autoRenewal: data.auto_renewal,
        institutionSignatory: data.institution_signatory || { name: '', title: '', email: '' },
        districtSignatory: data.district_signatory || { name: '', title: '', email: '' },
        permittedUses: data.permitted_uses || [],
        prohibitedUses: data.prohibited_uses || [],
        securityRequirements: data.security_requirements || [],
        reportingRequirements: data.reporting_requirements || [],
        breachNotificationProcedure: data.breach_notification_procedure || '',
        status: data.status,
        agreementDocumentUrl: data.agreement_document_url || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as DataUseAgreement;
    } catch (err) {
      console.error('Error fetching data use agreement:', err);
      return null;
    }
  }

  async createDataUseAgreement(
    applicationId: string,
    institutionId: string,
    districtId: string
  ): Promise<DataUseAgreement> {
    try {
      const insertPayload = {
        application_id: applicationId,
        institution_id: institutionId,
        district_id: districtId,
        version: '1.0',
        effective_date: new Date().toISOString(),
        expiration_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString(),
        auto_renewal: false,
        institution_signatory: { name: '', title: '', email: '' },
        district_signatory: { name: '', title: '', email: '' },
        permitted_uses: [],
        prohibited_uses: [],
        security_requirements: [],
        reporting_requirements: [],
        breach_notification_procedure: '',
        status: 'draft',
        agreement_document_url: '',
      };

      const { data, error } = await supabase
        .from('data_use_agreements')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        applicationId: data.application_id,
        institutionId: data.institution_id,
        districtId: data.district_id,
        version: data.version,
        effectiveDate: data.effective_date,
        expirationDate: data.expiration_date,
        autoRenewal: data.auto_renewal,
        institutionSignatory: data.institution_signatory,
        districtSignatory: data.district_signatory,
        permittedUses: data.permitted_uses || [],
        prohibitedUses: data.prohibited_uses || [],
        securityRequirements: data.security_requirements || [],
        reportingRequirements: data.reporting_requirements || [],
        breachNotificationProcedure: data.breach_notification_procedure,
        status: data.status,
        agreementDocumentUrl: data.agreement_document_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as DataUseAgreement;
    } catch (err) {
      console.error('Error creating data use agreement:', err);
      // Fallback
      const dua: DataUseAgreement = {
        id: `dua-${Date.now()}`,
        applicationId,
        institutionId,
        districtId,
        version: '1.0',
        effectiveDate: new Date().toISOString(),
        expirationDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString(),
        autoRenewal: false,
        institutionSignatory: { name: '', title: '', email: '' },
        districtSignatory: { name: '', title: '', email: '' },
        permittedUses: [],
        prohibitedUses: [],
        securityRequirements: [],
        reportingRequirements: [],
        breachNotificationProcedure: '',
        status: 'draft',
        agreementDocumentUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return dua;
    }
  }

  async getSecureDataRoom(applicationId: string): Promise<SecureDataRoom | null> {
    try {
      const { data, error } = await supabase
        .from('secure_data_rooms')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (error) throw error;
      return data as SecureDataRoom | null;
    } catch (err) {
      console.error('Error fetching secure data room:', err);
      return null;
    }
  }

  // ===========================================
  // RESEARCH FINDINGS
  // ===========================================

  async getResearchFindings(applicationId: string): Promise<ResearchFindings | null> {
    try {
      const { data, error } = await supabase
        .from('research_findings')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        applicationId: data.application_id,
        studyCompletedDate: data.study_completed_date,
        actualParticipantCount: data.actual_participant_count,
        dataCollectionSummary: data.data_collection_summary,
        executiveSummary: data.executive_summary,
        keyFindings: data.key_findings || [],
        practitionerSummary: data.practitioner_summary,
        limitationsAndFuturework: data.limitations_and_futurework,
        disseminationPlan: data.dissemination_plan,
        schoolsNotified: data.schools_notified,
        districtBriefingCompleted: data.district_briefing_completed,
        finalReportUrl: data.final_report_url,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as ResearchFindings;
    } catch (err) {
      console.error('Error fetching research findings:', err);
      return null;
    }
  }

  async submitResearchFindings(
    applicationId: string,
    data: Partial<ResearchFindings>
  ): Promise<ResearchFindings> {
    try {
      const insertPayload = {
        application_id: applicationId,
        study_completed_date: data.studyCompletedDate || new Date().toISOString(),
        actual_participant_count: data.actualParticipantCount || 0,
        data_collection_summary: data.dataCollectionSummary || '',
        executive_summary: data.executiveSummary || '',
        key_findings: data.keyFindings || [],
        practitioner_summary: data.practitionerSummary || '',
        limitations_and_futurework: data.limitationsAndFuturework || '',
        dissemination_plan: data.disseminationPlan || '',
        schools_notified: false,
        district_briefing_completed: false,
        final_report_url: data.finalReportUrl || '',
        status: 'draft',
      };

      const { data: row, error } = await supabase
        .from('research_findings')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: row.id,
        applicationId: row.application_id,
        studyCompletedDate: row.study_completed_date,
        actualParticipantCount: row.actual_participant_count,
        dataCollectionSummary: row.data_collection_summary,
        executiveSummary: row.executive_summary,
        keyFindings: row.key_findings || [],
        practitionerSummary: row.practitioner_summary,
        limitationsAndFuturework: row.limitations_and_futurework,
        disseminationPlan: row.dissemination_plan,
        schoolsNotified: row.schools_notified,
        districtBriefingCompleted: row.district_briefing_completed,
        finalReportUrl: row.final_report_url,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      } as ResearchFindings;
    } catch (err) {
      console.error('Error submitting research findings:', err);
      // Fallback
      const findings: ResearchFindings = {
        id: `findings-${Date.now()}`,
        applicationId,
        studyCompletedDate: data.studyCompletedDate || new Date().toISOString(),
        actualParticipantCount: data.actualParticipantCount || 0,
        dataCollectionSummary: data.dataCollectionSummary || '',
        executiveSummary: data.executiveSummary || '',
        keyFindings: data.keyFindings || [],
        practitionerSummary: data.practitionerSummary || '',
        limitationsAndFuturework: data.limitationsAndFuturework || '',
        disseminationPlan: data.disseminationPlan || '',
        schoolsNotified: false,
        districtBriefingCompleted: false,
        finalReportUrl: data.finalReportUrl || '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return findings;
    }
  }

  // ===========================================
  // REVIEW COMMITTEE
  // ===========================================

  async getReviewCommittee(districtId: string): Promise<ResearchReviewCommittee | null> {
    try {
      const { data, error } = await supabase
        .from('research_review_committees')
        .select('*')
        .eq('district_id', districtId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        districtId: data.district_id,
        name: data.name,
        description: data.description,
        members: data.members || [],
        meetingSchedule: data.meeting_schedule,
        reviewCriteria: data.review_criteria || [],
        createdAt: data.created_at,
      } as ResearchReviewCommittee;
    } catch (err) {
      console.error('Error fetching review committee:', err);
      // Fallback
      return {
        id: `committee-${districtId}`,
        districtId,
        name: 'District Research Review Committee',
        description: 'Reviews all external research applications',
        members: [],
        meetingSchedule: 'monthly',
        reviewCriteria: [],
        createdAt: new Date().toISOString(),
      };
    }
  }

  async getApplicationReviews(applicationId: string): Promise<ApplicationReview[]> {
    try {
      const { data, error } = await supabase
        .from('application_reviews')
        .select('*')
        .eq('application_id', applicationId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        applicationId: row.application_id as string,
        reviewerId: row.reviewer_id as string,
        stage: row.stage as string,
        criteriaScores: (row.criteria_scores as ApplicationReview['criteriaScores']) || [],
        overallScore: row.overall_score as number,
        recommendation: row.recommendation as string,
        conditions: row.conditions as string | undefined,
        concerns: row.concerns as string | undefined,
        strengths: row.strengths as string | undefined,
        publicComments: row.public_comments as string,
        privateComments: row.private_comments as string | undefined,
        submittedAt: row.submitted_at as string,
        status: row.status as string,
      })) as ApplicationReview[];
    } catch (err) {
      console.error('Error fetching application reviews:', err);
      return [];
    }
  }

  async submitApplicationReview(
    applicationId: string,
    reviewerId: string,
    data: Partial<ApplicationReview>
  ): Promise<ApplicationReview> {
    try {
      const insertPayload = {
        application_id: applicationId,
        reviewer_id: reviewerId,
        stage: data.stage || 'committee-review',
        criteria_scores: data.criteriaScores || [],
        overall_score: data.overallScore || 0,
        recommendation: data.recommendation || 'approve',
        conditions: data.conditions || null,
        concerns: data.concerns || null,
        strengths: data.strengths || null,
        public_comments: data.publicComments || '',
        private_comments: data.privateComments || null,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
      };

      const { data: row, error } = await supabase
        .from('application_reviews')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: row.id,
        applicationId: row.application_id,
        reviewerId: row.reviewer_id,
        stage: row.stage,
        criteriaScores: row.criteria_scores || [],
        overallScore: row.overall_score,
        recommendation: row.recommendation,
        conditions: row.conditions,
        concerns: row.concerns,
        strengths: row.strengths,
        publicComments: row.public_comments,
        privateComments: row.private_comments,
        submittedAt: row.submitted_at,
        status: row.status,
      } as ApplicationReview;
    } catch (err) {
      console.error('Error submitting application review:', err);
      // Fallback
      const review: ApplicationReview = {
        id: `review-${Date.now()}`,
        applicationId,
        reviewerId,
        stage: data.stage || 'committee-review',
        criteriaScores: data.criteriaScores || [],
        overallScore: data.overallScore || 0,
        recommendation: data.recommendation || 'approve',
        conditions: data.conditions,
        concerns: data.concerns,
        strengths: data.strengths,
        publicComments: data.publicComments || '',
        privateComments: data.privateComments,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      return review;
    }
  }

  // ===========================================
  // DASHBOARD & ANALYTICS
  // ===========================================

  async getResearcherDashboardStats(researcherId: string): Promise<ResearcherDashboardStats> {
    try {
      const [researcherResult, applicationsResult] = await Promise.all([
        supabase.from('researchers').select('*').eq('id', researcherId).single(),
        supabase.from('research_applications').select('*').eq('principal_investigator_id', researcherId),
      ]);

      if (researcherResult.error && applicationsResult.error) throw new Error('DB unavailable');

      const researcher = researcherResult.data ? mapResearcher(researcherResult.data) : null;
      const researcherApps = (applicationsResult.data || []).map(mapApplication);

      return this.computeDashboardStats(researcher, researcherApps);
    } catch (err) {
      console.error('Error fetching researcher dashboard stats:', err);
      // Fallback from sample data
      const researcher = SAMPLE_RESEARCHERS.find((r) => r.id === researcherId) || null;
      const researcherApps = SAMPLE_APPLICATIONS.filter(
        (a) => a.principalInvestigatorId === researcherId
      );
      return this.computeDashboardStats(researcher, researcherApps);
    }
  }

  private computeDashboardStats(
    researcher: Researcher | null,
    researcherApps: ResearchApplication[]
  ): ResearcherDashboardStats {
    return {
      totalApplications: researcherApps.length,
      pendingApplications: researcherApps.filter(
        (a) =>
          a.status === 'submitted' ||
          a.status === 'under-review' ||
          a.status === 'committee-review'
      ).length,
      activeStudies: researcherApps.filter((a) => a.status === 'approved').length,
      completedStudies: researcher?.studiesCompleted || 0,
      applicationsAwaitingAction: researcherApps.filter(
        (a) => a.status === 'additional-info-requested'
      ).length,
      upcomingDeadlines: [],
      citiCertificationValid: researcher?.citiTrainingCompleted || false,
      citiExpirationDate: researcher?.citiTrainingDate
        ? new Date(
            new Date(researcher.citiTrainingDate).setFullYear(
              new Date(researcher.citiTrainingDate).getFullYear() + 3
            )
          ).toISOString()
        : undefined,
      duasRequiringRenewal: 0,
      approvalRate:
        researcherApps.length > 0
          ? (researcherApps.filter((a) => a.status === 'approved').length /
              researcherApps.length) *
            100
          : 0,
      averageReviewTime: 30,
      complianceScore: researcher?.complianceScore || 100,
    };
  }

  async getDistrictResearchDashboard(districtId: string): Promise<DistrictResearchDashboard> {
    const { applications } = await this.getApplications({ districtId });

    return {
      totalActiveStudies: applications.filter((a) => a.status === 'approved').length,
      pendingApplications: applications.filter(
        (a) =>
          a.status === 'submitted' ||
          a.status === 'under-review' ||
          a.status === 'committee-review'
      ).length,
      studentsParticipating: 0,
      schoolsInvolved: 0,
      applicationsByStatus: [
        { status: 'submitted', count: applications.filter((a) => a.status === 'submitted').length },
        { status: 'under-review', count: applications.filter((a) => a.status === 'under-review').length },
        { status: 'approved', count: applications.filter((a) => a.status === 'approved').length },
        { status: 'denied', count: applications.filter((a) => a.status === 'denied').length },
      ],
      studiesBySchool: [],
      overallBurdenScore: 25,
      highBurdenSchools: [],
      expiringApprovals: 0,
      overdueFindingsReports: 0,
      dataDestructionPending: 0,
      recentApplications: applications.slice(0, 5),
      recentFindings: [],
    };
  }

  // ===========================================
  // SEARCH
  // ===========================================

  async searchSchools(query: string): Promise<{ id: string; name: string; district: string }[]> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name, district_name')
        .ilike('name', `%${query}%`)
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          name: s.name as string,
          district: s.district_name as string,
        }));
      }

      // Fallback
      return [
        { id: 'school-001', name: 'Lincoln Elementary', district: 'Unified School District' },
        { id: 'school-002', name: 'Washington Middle School', district: 'Unified School District' },
        { id: 'school-003', name: 'Jefferson High School', district: 'Unified School District' },
      ].filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
    } catch (err) {
      console.error('Error searching schools:', err);
      return [
        { id: 'school-001', name: 'Lincoln Elementary', district: 'Unified School District' },
        { id: 'school-002', name: 'Washington Middle School', district: 'Unified School District' },
        { id: 'school-003', name: 'Jefferson High School', district: 'Unified School District' },
      ].filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
    }
  }

  async searchDistricts(query: string): Promise<{ id: string; name: string; state: string }[]> {
    try {
      const { data, error } = await supabase
        .from('districts')
        .select('id, name, state')
        .ilike('name', `%${query}%`)
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          name: d.name as string,
          state: d.state as string,
        }));
      }

      // Fallback
      return [
        { id: 'district-001', name: 'Unified School District', state: 'CA' },
        { id: 'district-002', name: 'Metro School District', state: 'CA' },
      ].filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    } catch (err) {
      console.error('Error searching districts:', err);
      return [
        { id: 'district-001', name: 'Unified School District', state: 'CA' },
        { id: 'district-002', name: 'Metro School District', state: 'CA' },
      ].filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    }
  }
}

// Export singleton instance
export const researchPortalApi = new ResearchPortalService();

// Export class for testing
export { ResearchPortalService };
