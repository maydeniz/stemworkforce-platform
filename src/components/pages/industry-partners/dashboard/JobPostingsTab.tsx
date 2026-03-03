// ===========================================
// Job Postings Tab - Industry Partner Dashboard
// CRUD operations for job postings
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  Eye,
  EyeOff,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  publishJobPosting
} from '@/services/industryPartnerApi';
import type { JobPosting, JobStatus, JobType, ExperienceLevel, WorkLocation, PartnerTier } from '@/types/industryPartner';

// ===========================================
// TYPES
// ===========================================

interface JobPostingsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  workLocation: WorkLocation;
  department: string;
  city: string;
  state: string;
  country: string;
  remoteAllowed: boolean;
  salaryMin: string;
  salaryMax: string;
  salaryType: 'hourly' | 'annual';
  showSalary: boolean;
  benefits: string;
  requiredSkills: string;
  preferredSkills: string;
  educationRequirement: string;
  clearanceRequired: string;
  applicationUrl: string;
  applicationEmail: string;
  featured: boolean;
}

// ===========================================
// CONSTANTS
// ===========================================

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'co_op', label: 'Co-op' }
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Principal' },
  { value: 'executive', label: 'Executive' }
];

const WORK_LOCATIONS: { value: WorkLocation; label: string }[] = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' }
];

const EMPTY_FORM: JobFormData = {
  title: '',
  description: '',
  requirements: '',
  responsibilities: '',
  jobType: 'full_time',
  experienceLevel: 'entry',
  workLocation: 'onsite',
  department: '',
  city: '',
  state: '',
  country: 'USA',
  remoteAllowed: false,
  salaryMin: '',
  salaryMax: '',
  salaryType: 'annual',
  showSalary: true,
  benefits: '',
  requiredSkills: '',
  preferredSkills: '',
  educationRequirement: '',
  clearanceRequired: '',
  applicationUrl: '',
  applicationEmail: '',
  featured: false
};

// ===========================================
// TIER LIMITS
// ===========================================

const TIER_LIMITS = {
  starter: { maxJobs: 5, maxFeatured: 0 },
  growth: { maxJobs: -1, maxFeatured: 5 },
  enterprise: { maxJobs: -1, maxFeatured: -1 }
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const JobPostingsTab: React.FC<JobPostingsTabProps> = ({ partnerId, tier }) => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [formData, setFormData] = useState<JobFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const limits = TIER_LIMITS[tier];

  useEffect(() => {
    loadJobs();
  }, [partnerId]);

  const loadJobs = async () => {
    setLoading(true);
    const data = await getJobPostings(partnerId);
    setJobs(data);
    setLoading(false);
  };

  // Filter jobs
  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Check tier limits
  const canAddJob = limits.maxJobs === -1 || jobs.length < limits.maxJobs;
  const canFeature = (job: JobPosting) => {
    if (limits.maxFeatured === -1) return true;
    const featuredCount = jobs.filter(j => j.featured && j.id !== job.id).length;
    return featuredCount < limits.maxFeatured;
  };

  const handleAddJob = () => {
    if (!canAddJob) {
      setError(`You've reached the limit of ${limits.maxJobs} job postings. Upgrade to add more.`);
      return;
    }
    setEditingJob(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      workLocation: job.workLocation,
      department: job.department || '',
      city: job.city || '',
      state: job.state || '',
      country: job.country,
      remoteAllowed: job.remoteAllowed,
      salaryMin: job.salaryMin?.toString() || '',
      salaryMax: job.salaryMax?.toString() || '',
      salaryType: job.salaryType,
      showSalary: job.showSalary,
      benefits: job.benefits?.join('\n') || '',
      requiredSkills: job.requiredSkills.join(', '),
      preferredSkills: job.preferredSkills.join(', '),
      educationRequirement: job.educationRequirement || '',
      clearanceRequired: job.clearanceRequired || '',
      applicationUrl: job.applicationUrl || '',
      applicationEmail: job.applicationEmail || '',
      featured: job.featured
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }

    setSaving(true);
    setError(null);

    const jobData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      workLocation: formData.workLocation,
      department: formData.department || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country,
      remoteAllowed: formData.remoteAllowed,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      salaryType: formData.salaryType,
      showSalary: formData.showSalary,
      benefits: formData.benefits.split('\n').filter(b => b.trim()),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(s => s),
      educationRequirement: formData.educationRequirement || undefined,
      clearanceRequired: formData.clearanceRequired || undefined,
      applicationUrl: formData.applicationUrl || undefined,
      applicationEmail: formData.applicationEmail || undefined,
      featured: formData.featured,
      status: 'draft' as JobStatus
    };

    if (editingJob) {
      const success = await updateJobPosting(editingJob.id, jobData);
      if (success) {
        await loadJobs();
        setShowModal(false);
      } else {
        setError('Failed to update job posting');
      }
    } else {
      const created = await createJobPosting(partnerId, jobData);
      if (created) {
        await loadJobs();
        setShowModal(false);
      } else {
        setError('Failed to create job posting');
      }
    }

    setSaving(false);
  };

  const handlePublish = async (jobId: string) => {
    const success = await publishJobPosting(jobId);
    if (success) {
      await loadJobs();
    }
  };

  const handleDelete = async (jobId: string) => {
    const success = await deleteJobPosting(jobId);
    if (success) {
      await loadJobs();
      setDeleteConfirm(null);
    }
  };

  const handleStatusChange = async (jobId: string, status: JobStatus) => {
    const success = await updateJobPosting(jobId, { status });
    if (success) {
      await loadJobs();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Job Postings</h2>
          <p className="text-gray-400">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
            {limits.maxJobs !== -1 && ` (${limits.maxJobs - jobs.length} remaining)`}
          </p>
        </div>
        <button
          onClick={handleAddJob}
          disabled={!canAddJob}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
          <option value="filled">Filled</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    {job.featured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                    {job.department && <span>{job.department}</span>}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.city && job.state ? `${job.city}, ${job.state}` : job.workLocation}
                    </span>
                    <span className="capitalize">{job.jobType.replace('_', ' ')}</span>
                    <span className="capitalize">{job.experienceLevel}</span>
                  </div>
                  {job.showSalary && job.salaryMin && job.salaryMax && (
                    <div className="flex items-center gap-1 mt-2 text-emerald-400">
                      <DollarSign className="w-4 h-4" />
                      {job.salaryType === 'annual'
                        ? `$${(job.salaryMin / 1000).toFixed(0)}K - $${(job.salaryMax / 1000).toFixed(0)}K/year`
                        : `$${job.salaryMin} - $${job.salaryMax}/hr`
                      }
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  job.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
                  job.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                  job.status === 'filled' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {job.viewCount} views
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {job.applicationCount} applications
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {job.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(job.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Publish
                  </button>
                )}
                {job.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(job.id, 'paused')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 text-sm rounded-lg transition-colors"
                  >
                    <EyeOff className="w-4 h-4" /> Pause
                  </button>
                )}
                {job.status === 'paused' && (
                  <button
                    onClick={() => handleStatusChange(job.id, 'active')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Resume
                  </button>
                )}
                <button
                  onClick={() => handleEditJob(job)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(job.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm === job.id && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400 mb-3">Are you sure you want to delete this job posting?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No job postings found</p>
            <button
              onClick={handleAddJob}
              className="mt-4 text-emerald-400 hover:text-emerald-300"
            >
              Post your first job
            </button>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Basic Information</h4>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Job Type</label>
                      <select
                        value={formData.jobType}
                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        {JOB_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Experience Level</label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        {EXPERIENCE_LEVELS.map(l => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Work Location</label>
                      <select
                        value={formData.workLocation}
                        onChange={(e) => setFormData({ ...formData, workLocation: e.target.value as WorkLocation })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        {WORK_LOCATIONS.map(l => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g., Engineering"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Location</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Compensation */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Compensation</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Min Salary</label>
                      <input
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="80000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Max Salary</label>
                      <input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="120000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Type</label>
                      <select
                        value={formData.salaryType}
                        onChange={(e) => setFormData({ ...formData, salaryType: e.target.value as 'hourly' | 'annual' })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="annual">Annual</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showSalary}
                          onChange={(e) => setFormData({ ...formData, showSalary: e.target.checked })}
                          className="rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-white text-sm">Show salary</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Job Details</h4>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Requirements (one per line)</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="5+ years of experience&#10;Bachelor's degree in CS or related field&#10;Strong communication skills"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Required Skills (comma separated)</label>
                    <input
                      type="text"
                      value={formData.requiredSkills}
                      onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Python, Machine Learning, TensorFlow, AWS"
                    />
                  </div>
                </div>

                {/* Application */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Application</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Application URL</label>
                      <input
                        type="url"
                        value={formData.applicationUrl}
                        onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="https://careers.yourcompany.com/apply"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Application Email</label>
                      <input
                        type="email"
                        value={formData.applicationEmail}
                        onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="recruiting@yourcompany.com"
                      />
                    </div>
                  </div>

                  {tier !== 'starter' && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        disabled={!canFeature({ id: editingJob?.id || '', featured: formData.featured } as JobPosting)}
                        className="rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-white">Feature this job posting</span>
                      <Star className="w-4 h-4 text-amber-400" />
                    </label>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-900 px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingJob ? 'Save Changes' : 'Create Job'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobPostingsTab;
