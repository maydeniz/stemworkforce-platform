// ===========================================
// React Hooks for Student Platform Data
// Provides easy integration with the student API
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import {
  studentApi,
  StudentProfile,
  Scholarship,
  ScholarshipMatch,
  College,
  CollegeMatch,
  SavedScholarship,
  SavedCollege,
  CollegeApplication,
  AwardLetter,
  StudentLoan,
  CareerPath,
  STEMFundingProgram,
} from '@/services/studentApi';

// ===========================================
// Student Profile Hook
// ===========================================

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.profile.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<StudentProfile>) => {
    try {
      setLoading(true);
      const data = await studentApi.profile.updateProfile(updates);
      setProfile(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}

// ===========================================
// Scholarships Hook
// ===========================================

interface UseScholarshipsOptions {
  is_stem?: boolean;
  need_based?: boolean;
  merit_based?: boolean;
  min_amount?: number;
  max_amount?: number;
  deadline_after?: string;
  search?: string;
}

export function useScholarships(options?: UseScholarshipsOptions) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScholarships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.scholarships.list(options);
      setScholarships(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch scholarships'));
    } finally {
      setLoading(false);
    }
  }, [options?.is_stem, options?.need_based, options?.merit_based, options?.min_amount, options?.max_amount, options?.deadline_after, options?.search]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  return {
    scholarships,
    loading,
    error,
    refetch: fetchScholarships,
  };
}

export function useScholarshipMatches(profileData?: Partial<StudentProfile>) {
  const [matches, setMatches] = useState<ScholarshipMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.scholarships.getMatches(profileData);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch scholarship matches'));
    } finally {
      setLoading(false);
    }
  }, [profileData]);

  return {
    matches,
    loading,
    error,
    fetchMatches,
  };
}

export function useSavedScholarships() {
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSaved = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.scholarships.getSavedScholarships();
      setSavedScholarships(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch saved scholarships'));
    } finally {
      setLoading(false);
    }
  }, []);

  const saveScholarship = useCallback(async (scholarshipId: string, notes?: string) => {
    try {
      const saved = await studentApi.scholarships.saveScholarship(scholarshipId, notes);
      setSavedScholarships(prev => [...prev, saved]);
      return saved;
    } catch (err) {
      throw err;
    }
  }, []);

  const removeScholarship = useCallback(async (scholarshipId: string) => {
    try {
      await studentApi.scholarships.removeSavedScholarship(scholarshipId);
      setSavedScholarships(prev => prev.filter(s => s.scholarship_id !== scholarshipId));
    } catch (err) {
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: string, notes?: string) => {
    try {
      const updated = await studentApi.scholarships.updateSavedScholarship(id, { status, notes });
      setSavedScholarships(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  return {
    savedScholarships,
    loading,
    error,
    saveScholarship,
    removeScholarship,
    updateStatus,
    refetch: fetchSaved,
  };
}

// ===========================================
// Colleges Hook
// ===========================================

interface UseCollegesOptions {
  stem_focus?: boolean;
  type?: string;
  region?: string;
  state?: string;
  min_acceptance_rate?: number;
  max_tuition?: number;
  search?: string;
}

export function useColleges(options?: UseCollegesOptions) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.colleges.list(options);
      setColleges(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch colleges'));
    } finally {
      setLoading(false);
    }
  }, [options?.stem_focus, options?.type, options?.region, options?.state, options?.min_acceptance_rate, options?.max_tuition, options?.search]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  return {
    colleges,
    loading,
    error,
    refetch: fetchColleges,
  };
}

export function useCollegeMatches(profileData?: Partial<StudentProfile>) {
  const [matches, setMatches] = useState<{
    safety: CollegeMatch[];
    target: CollegeMatch[];
    reach: CollegeMatch[];
    all: CollegeMatch[];
  }>({ safety: [], target: [], reach: [], all: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.colleges.getMatches(profileData);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch college matches'));
    } finally {
      setLoading(false);
    }
  }, [profileData]);

  return {
    matches,
    loading,
    error,
    fetchMatches,
  };
}

export function useSavedColleges() {
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSaved = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.colleges.getSavedColleges();
      setSavedColleges(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch saved colleges'));
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCollege = useCallback(async (collegeId: string, notes?: string) => {
    try {
      const saved = await studentApi.colleges.saveCollege(collegeId, notes);
      setSavedColleges(prev => [...prev, saved]);
      return saved;
    } catch (err) {
      throw err;
    }
  }, []);

  const removeCollege = useCallback(async (collegeId: string) => {
    try {
      await studentApi.colleges.removeSavedCollege(collegeId);
      setSavedColleges(prev => prev.filter(s => s.college_id !== collegeId));
    } catch (err) {
      throw err;
    }
  }, []);

  const updateCollege = useCallback(async (id: string, updates: { notes?: string; interest_level?: number; visited?: boolean }) => {
    try {
      const updated = await studentApi.colleges.updateSavedCollege(id, updates);
      setSavedColleges(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  return {
    savedColleges,
    loading,
    error,
    saveCollege,
    removeCollege,
    updateCollege,
    refetch: fetchSaved,
  };
}

// ===========================================
// Applications Hook
// ===========================================

export function useApplications() {
  const [applications, setApplications] = useState<CollegeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.applications.list();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(async (application: {
    college_id: string;
    application_type: string;
    deadline_date?: string;
    notes?: string;
  }) => {
    try {
      const created = await studentApi.applications.create(application);
      setApplications(prev => [...prev, created]);
      return created;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateApplication = useCallback(async (id: string, updates: {
    status?: string;
    submitted_date?: string;
    decision_date?: string;
    decision?: string;
    notes?: string;
  }) => {
    try {
      const updated = await studentApi.applications.update(id, updates);
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    try {
      await studentApi.applications.delete(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications,
  };
}

// ===========================================
// Financial Aid Hook
// ===========================================

export function useFinancialAid() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateNetPrice = useCallback(async (
    financialProfile: {
      household_income: number;
      household_size: number;
      number_in_college: number;
      total_assets: number;
      parent_age: number;
      state_of_residence: string;
      filing_status: string;
    },
    collegeIds?: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.financialAid.calculateNetPrice(financialProfile, collegeIds);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to calculate net price'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeAwardLetters = useCallback(async (awardLetters: Array<{
    college_name: string;
    academic_year: string;
    cost_of_attendance: {
      tuition: number;
      fees: number;
      room_and_board: number;
      books: number;
      personal: number;
      transportation: number;
      total: number;
    };
    awards: Array<{
      name: string;
      amount: number;
    }>;
  }>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.financialAid.analyzeAwardLetters(awardLetters);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to analyze award letters'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    calculateNetPrice,
    analyzeAwardLetters,
  };
}

export function useAwardLetters() {
  const [awardLetters, setAwardLetters] = useState<AwardLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAwardLetters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.financialAid.getAwardLetters();
      setAwardLetters(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch award letters'));
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAwardLetter = useCallback(async (letter: Partial<AwardLetter>) => {
    try {
      const saved = await studentApi.financialAid.saveAwardLetter(letter);
      setAwardLetters(prev => {
        const existing = prev.findIndex(l => l.id === saved.id);
        if (existing >= 0) {
          return prev.map((l, i) => i === existing ? saved : l);
        }
        return [...prev, saved];
      });
      return saved;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAwardLetters();
  }, [fetchAwardLetters]);

  return {
    awardLetters,
    loading,
    error,
    saveAwardLetter,
    refetch: fetchAwardLetters,
  };
}

// ===========================================
// Loans Hook
// ===========================================

export function useStudentLoans() {
  const [loans, setLoans] = useState<StudentLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.loans.list();
      setLoans(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch loans'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addLoan = useCallback(async (loan: Partial<StudentLoan>) => {
    try {
      const created = await studentApi.loans.create(loan);
      setLoans(prev => [...prev, created]);
      return created;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateLoan = useCallback(async (id: string, updates: Partial<StudentLoan>) => {
    try {
      const updated = await studentApi.loans.update(id, updates);
      setLoans(prev => prev.map(l => l.id === id ? updated : l));
      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteLoan = useCallback(async (id: string) => {
    try {
      await studentApi.loans.delete(id);
      setLoans(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  const calculateRepayment = useCallback(async (params: {
    loans: Array<{
      name: string;
      principal: number;
      interest_rate: number;
      type: string;
    }>;
    monthly_income: number;
    monthly_payment_budget: number;
    repayment_strategy: string;
    income_driven_plan?: string;
    family_size?: number;
    compare_all?: boolean;
  }) => {
    try {
      setLoading(true);
      const data = await studentApi.loans.calculateRepayment(params);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    loans,
    loading,
    error,
    addLoan,
    updateLoan,
    deleteLoan,
    calculateRepayment,
    refetch: fetchLoans,
  };
}

// ===========================================
// Career Hook
// ===========================================

interface UseCareersOptions {
  is_stem?: boolean;
  field?: string;
  min_salary?: number;
  growth_rate?: number;
  remote_friendly?: boolean;
  search?: string;
}

export function useCareers(options?: UseCareersOptions) {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCareers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.career.list(options);
      setCareers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch careers'));
    } finally {
      setLoading(false);
    }
  }, [options?.is_stem, options?.field, options?.min_salary, options?.growth_rate, options?.remote_friendly, options?.search]);

  const calculateROI = useCallback(async (inputs: Array<{
    career_path_id?: string;
    career_title?: string;
    total_education_cost: number;
    years_of_education: number;
    expected_starting_salary?: number;
    expected_mid_career_salary?: number;
    include_opportunity_cost?: boolean;
  }>) => {
    try {
      setLoading(true);
      const data = await studentApi.career.calculateROI(inputs);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  return {
    careers,
    loading,
    error,
    calculateROI,
    refetch: fetchCareers,
  };
}

// ===========================================
// STEM Funding Hook
// ===========================================

interface UseSTEMFundingOptions {
  agency?: string;
  program_type?: string;
  citizenship_required?: boolean;
  security_clearance?: boolean;
  min_amount?: number;
  search?: string;
}

export function useSTEMFunding(options?: UseSTEMFundingOptions) {
  const [programs, setPrograms] = useState<STEMFundingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.stemFunding.list(options);
      setPrograms(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch STEM funding programs'));
    } finally {
      setLoading(false);
    }
  }, [options?.agency, options?.program_type, options?.citizenship_required, options?.security_clearance, options?.min_amount, options?.search]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return {
    programs,
    loading,
    error,
    refetch: fetchPrograms,
  };
}

export function useSTEMFundingByAgency() {
  const [programsByAgency, setProgramsByAgency] = useState<Record<string, STEMFundingProgram[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchByAgency = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.stemFunding.getByAgency();
      setProgramsByAgency(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch STEM funding by agency'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchByAgency();
  }, [fetchByAgency]);

  return {
    programsByAgency,
    loading,
    error,
    refetch: fetchByAgency,
  };
}
