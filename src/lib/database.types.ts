// ===========================================
// Supabase Database Types
// Auto-generated types for Supabase tables
// ===========================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'intern' | 'jobseeker' | 'educator' | 'partner' | 'admin';
export type ClearanceLevel = 'none' | 'public_trust' | 'secret' | 'top_secret' | 'top_secret_sci';
export type OrganizationType = 'industry' | 'government' | 'national_lab' | 'academia' | 'nonprofit';
export type IndustryType = 'semiconductor' | 'nuclear' | 'ai' | 'quantum' | 'cybersecurity' | 'aerospace' | 'biotech' | 'robotics' | 'clean_energy' | 'manufacturing';
export type JobType = 'internship' | 'full_time' | 'part_time' | 'contract' | 'fellowship';
export type JobStatus = 'draft' | 'active' | 'closed' | 'expired';
export type SalaryPeriod = 'hourly' | 'monthly' | 'yearly';
export type ApplicationStatus = 'pending' | 'reviewing' | 'interview' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
export type EventType = 'conference' | 'job_fair' | 'networking' | 'workshop' | 'webinar' | 'hackathon';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type TrainingFormat = 'online' | 'in_person' | 'hybrid' | 'self_paced';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string | null;
          email: string;
          email_verified: boolean;
          first_name: string;
          last_name: string;
          avatar: string | null;
          phone: string | null;
          role: UserRole;
          organization: string | null;
          organization_id: string | null;
          clearance_level: ClearanceLevel;
          bio: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          resume_url: string | null;
          skills: string[] | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          email: string;
          email_verified?: boolean;
          first_name: string;
          last_name: string;
          avatar?: string | null;
          phone?: string | null;
          role?: UserRole;
          organization?: string | null;
          organization_id?: string | null;
          clearance_level?: ClearanceLevel;
          bio?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          skills?: string[] | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          email?: string;
          email_verified?: boolean;
          first_name?: string;
          last_name?: string;
          avatar?: string | null;
          phone?: string | null;
          role?: UserRole;
          organization?: string | null;
          organization_id?: string | null;
          clearance_level?: ClearanceLevel;
          bio?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          skills?: string[] | null;
          preferences?: Json;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: OrganizationType;
          logo: string | null;
          website: string | null;
          description: string | null;
          headquarters: string | null;
          locations: string[] | null;
          industries: IndustryType[] | null;
          size: string | null;
          founded: number | null;
          verified: boolean;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type: OrganizationType;
          logo?: string | null;
          website?: string | null;
          description?: string | null;
          headquarters?: string | null;
          locations?: string[] | null;
          industries?: IndustryType[] | null;
          size?: string | null;
          founded?: number | null;
          verified?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          type?: OrganizationType;
          logo?: string | null;
          website?: string | null;
          description?: string | null;
          headquarters?: string | null;
          locations?: string[] | null;
          industries?: IndustryType[] | null;
          size?: string | null;
          founded?: number | null;
          verified?: boolean;
          verified_at?: string | null;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          requirements: string[] | null;
          benefits: string[] | null;
          organization_id: string;
          posted_by_id: string;
          industry: IndustryType;
          type: JobType;
          location: string;
          remote: boolean;
          clearance: ClearanceLevel;
          skills: string[] | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          salary_period: SalaryPeriod;
          status: JobStatus;
          featured: boolean;
          view_count: number;
          posted_at: string;
          expires_at: string;
          closed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          requirements?: string[] | null;
          benefits?: string[] | null;
          organization_id: string;
          posted_by_id: string;
          industry: IndustryType;
          type: JobType;
          location: string;
          remote?: boolean;
          clearance?: ClearanceLevel;
          skills?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          salary_period?: SalaryPeriod;
          status?: JobStatus;
          featured?: boolean;
          view_count?: number;
          posted_at?: string;
          expires_at: string;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          requirements?: string[] | null;
          benefits?: string[] | null;
          organization_id?: string;
          industry?: IndustryType;
          type?: JobType;
          location?: string;
          remote?: boolean;
          clearance?: ClearanceLevel;
          skills?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          salary_period?: SalaryPeriod;
          status?: JobStatus;
          featured?: boolean;
          view_count?: number;
          expires_at?: string;
          closed_at?: string | null;
          updated_at?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          user_id: string;
          resume_url: string;
          cover_letter: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          availability: string | null;
          expected_salary: number | null;
          referral: string | null;
          answers: Json | null;
          status: ApplicationStatus;
          notes: string | null;
          rating: number | null;
          applied_at: string;
          reviewed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          user_id: string;
          resume_url: string;
          cover_letter?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          availability?: string | null;
          expected_salary?: number | null;
          referral?: string | null;
          answers?: Json | null;
          status?: ApplicationStatus;
          notes?: string | null;
          rating?: number | null;
          applied_at?: string;
          reviewed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          resume_url?: string;
          cover_letter?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          availability?: string | null;
          expected_salary?: number | null;
          referral?: string | null;
          answers?: Json | null;
          status?: ApplicationStatus;
          notes?: string | null;
          rating?: number | null;
          reviewed_at?: string | null;
          updated_at?: string;
        };
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          saved_at?: string;
        };
        Update: {
          user_id?: string;
          job_id?: string;
          saved_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          organization_id: string | null;
          organizer: string;
          type: EventType;
          industries: IndustryType[] | null;
          location: string;
          virtual: boolean;
          virtual_url: string | null;
          capacity: number | null;
          image: string | null;
          start_date: string;
          end_date: string | null;
          registration_deadline: string;
          status: EventStatus;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          organization_id?: string | null;
          organizer: string;
          type: EventType;
          industries?: IndustryType[] | null;
          location: string;
          virtual?: boolean;
          virtual_url?: string | null;
          capacity?: number | null;
          image?: string | null;
          start_date: string;
          end_date?: string | null;
          registration_deadline: string;
          status?: EventStatus;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          organization_id?: string | null;
          organizer?: string;
          type?: EventType;
          industries?: IndustryType[] | null;
          location?: string;
          virtual?: boolean;
          virtual_url?: string | null;
          capacity?: number | null;
          image?: string | null;
          start_date?: string;
          end_date?: string | null;
          registration_deadline?: string;
          status?: EventStatus;
          featured?: boolean;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          status: string;
          registered_at: string;
          attended_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          status?: string;
          registered_at?: string;
          attended_at?: string | null;
        };
        Update: {
          status?: string;
          attended_at?: string | null;
        };
      };
      training_programs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          provider: string;
          description: string;
          duration: string;
          format: TrainingFormat;
          level: SkillLevel;
          industries: IndustryType[] | null;
          skills: string[] | null;
          cost: number;
          placement_rate: number | null;
          rating: number;
          reviews_count: number;
          certification_type: string | null;
          start_dates: string[] | null;
          active: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          provider: string;
          description: string;
          duration: string;
          format: TrainingFormat;
          level: SkillLevel;
          industries?: IndustryType[] | null;
          skills?: string[] | null;
          cost?: number;
          placement_rate?: number | null;
          rating?: number;
          reviews_count?: number;
          certification_type?: string | null;
          start_dates?: string[] | null;
          active?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          provider?: string;
          description?: string;
          duration?: string;
          format?: TrainingFormat;
          level?: SkillLevel;
          industries?: IndustryType[] | null;
          skills?: string[] | null;
          cost?: number;
          placement_rate?: number | null;
          rating?: number;
          reviews_count?: number;
          certification_type?: string | null;
          start_dates?: string[] | null;
          active?: boolean;
          featured?: boolean;
          updated_at?: string;
        };
      };
      training_enrollments: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          status: string;
          progress: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_id: string;
          status?: string;
          progress?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          status?: string;
          progress?: number;
          completed_at?: string | null;
        };
      };
      state_workforce_data: {
        Row: {
          id: string;
          state_code: string;
          state_name: string;
          total_jobs: number;
          top_industry: IndustryType;
          growth_rate: number;
          average_salary: number;
          training_programs: number;
          universities: number;
          national_labs: string[] | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          state_code: string;
          state_name: string;
          total_jobs?: number;
          top_industry: IndustryType;
          growth_rate?: number;
          average_salary?: number;
          training_programs?: number;
          universities?: number;
          national_labs?: string[] | null;
          updated_at?: string;
        };
        Update: {
          state_code?: string;
          state_name?: string;
          total_jobs?: number;
          top_industry?: IndustryType;
          growth_rate?: number;
          average_salary?: number;
          training_programs?: number;
          universities?: number;
          national_labs?: string[] | null;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link: string | null;
          read: boolean;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link?: string | null;
          read?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          type?: string;
          title?: string;
          message?: string;
          link?: string | null;
          read?: boolean;
          read_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: UserRole;
      clearance_level: ClearanceLevel;
      organization_type: OrganizationType;
      industry_type: IndustryType;
      job_type: JobType;
      job_status: JobStatus;
      salary_period: SalaryPeriod;
      application_status: ApplicationStatus;
      event_type: EventType;
      event_status: EventStatus;
      training_format: TrainingFormat;
      skill_level: SkillLevel;
    };
  };
}
