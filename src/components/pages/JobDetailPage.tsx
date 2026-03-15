import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, DollarSign, Shield,
  Users, Briefcase, CheckCircle, ExternalLink, Loader2, AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface JobDetail {
  id: string | number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  clearance?: string;
  citizenship?: string;
  experience?: string;
  workType?: string;
  type?: string;
  posted?: string;
  applicants?: number;
  description?: string;
  skills?: string[];
  logo?: string;
  source?: string;
  industry?: string;
  featured?: boolean;
  organization_id?: string;
  job_type?: string;
  created_at?: string;
  requirements?: string;
  benefits?: string;
}

// Static job data mirror from JobsPage for fallback lookup
const STATIC_JOBS: Record<number, Partial<JobDetail>> = {
  1: { title: 'Process Integration Engineer (PIE)', company: 'TSMC Arizona', location: 'Phoenix, AZ', salary: '$95,000 – $145,000', clearance: 'None', experience: 'Mid-level', workType: 'On-site', description: 'Lead process integration for advanced 4nm/3nm node semiconductor manufacturing. Solve process issues to ensure wafer delivery and ramp up new technology.', skills: ['Photolithography', 'Etch', 'Process Control', 'Statistical Analysis', 'Yield Enhancement'], logo: '💎', source: 'TSMC Careers', industry: 'Semiconductor' },
  2: { title: 'Equipment Maintenance Technician', company: 'TSMC Arizona', location: 'Phoenix, AZ', salary: '$24 – $35/hour', clearance: 'None', experience: 'Entry-level', workType: 'On-site', description: 'Maintain, warm-up and troubleshoot semiconductor manufacturing equipment. Improve operation efficiency of fab tools.', skills: ['Equipment Maintenance', 'Clean Room Protocol', 'Troubleshooting', 'Preventive Maintenance'], logo: '💎', source: 'TSMC Careers', industry: 'Semiconductor' },
  3: { title: 'Semiconductor Manufacturing Professional', company: 'Samsung Austin Semiconductor', location: 'Austin, TX', salary: '$55,000 – $85,000', clearance: 'None', experience: 'Entry-level', workType: 'On-site', description: 'Support silicon wafer manufacturing processes at world-class 14nm FinFET fab. Work in clean room environment processing WIP.', skills: ['Clean Room Protocol', 'Wafer Processing', 'Quality Control', 'Computer Literacy'], logo: '💎', source: 'Samsung SAS Careers', industry: 'Semiconductor' },
  101: { title: 'Nuclear Engineer – Reactor Physics', company: 'Idaho National Laboratory', location: 'Idaho Falls, ID', salary: '$95,000 – $140,000', clearance: 'Q Clearance', experience: 'Mid-level', workType: 'On-site', description: 'Support advanced reactor research including MARVEL microreactor. Perform neutronics analysis and core design.', skills: ['MCNP', 'SCALE', 'Reactor Physics', 'Thermal Hydraulics', 'Python'], logo: '☢️', source: 'INL Careers', industry: 'Nuclear' },
};

const CLEARANCE_COLORS: Record<string, string> = {
  'None': 'text-gray-400 border-gray-700',
  'none': 'text-gray-400 border-gray-700',
  'eligible': 'text-blue-400 border-blue-800',
  'q_clearance': 'text-yellow-400 border-yellow-800',
  'Q Clearance': 'text-yellow-400 border-yellow-800',
  'secret': 'text-orange-400 border-orange-800',
  'top_secret': 'text-red-400 border-red-800',
  'ts_sci': 'text-red-400 border-red-800',
  'TS/SCI': 'text-red-400 border-red-800',
};

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);

      // Try Supabase first
      try {
        const { data, error: dbError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (!dbError && data) {
          setJob(data as JobDetail);
          setLoading(false);
          return;
        }
      } catch {
        // fall through to static lookup
      }

      // Fall back to static data
      const numId = Number(id);
      const staticJob = STATIC_JOBS[numId];
      if (staticJob) {
        setJob({ id: numId, ...staticJob } as JobDetail);
      } else {
        setError('Job not found. It may have been removed or the link is invalid.');
      }
      setLoading(false);
    };

    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Simulate application submission (replace with real API when ready)
    await new Promise(r => setTimeout(r, 800));
    setApplying(false);
    setApplied(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold text-white">Job Not Found</h1>
        <p className="text-gray-400 max-w-sm">{error || 'This job listing could not be loaded.'}</p>
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 mt-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
      </div>
    );
  }

  const clearanceKey = job.clearance || job.clearance || 'None';
  const clearanceColor = CLEARANCE_COLORS[clearanceKey] || 'text-gray-400 border-gray-700';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Back nav */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              {job.logo && (
                <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {job.logo}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white leading-tight">{job.title}</h1>
                <p className="text-indigo-400 font-medium mt-1">{job.company}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-400">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                  )}
                  {job.workType && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> {job.workType}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" /> {job.salary}
                    </span>
                  )}
                  {job.posted && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {job.posted}
                    </span>
                  )}
                  {job.applicants != null && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> {job.applicants} applicants
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {job.clearance && (
                <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${clearanceColor}`}>
                  <Shield className="w-3 h-3" /> {job.clearance === 'none' ? 'No Clearance Required' : job.clearance}
                </span>
              )}
              {job.experience && (
                <span className="text-xs px-2.5 py-1 rounded-full border border-gray-700 text-gray-400">
                  {job.experience}
                </span>
              )}
              {job.industry && (
                <span className="text-xs px-2.5 py-1 rounded-full border border-indigo-800 text-indigo-400 bg-indigo-900/20">
                  {job.industry}
                </span>
              )}
              {job.featured && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-900/30 border border-amber-800/50 text-amber-400">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">About This Role</h2>
              <p className="text-gray-300 leading-relaxed">{job.description}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Requirements</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800/50 text-gray-300"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Benefits</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{job.benefits}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply card */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 sticky top-4">
            <h3 className="font-semibold text-white mb-4">Ready to Apply?</h3>

            {applied ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
                <p className="text-emerald-400 font-medium">Application Submitted!</p>
                <p className="text-gray-500 text-sm">We'll notify you of any updates.</p>
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-3 rounded-xl transition-all"
              >
                {applying ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  'Apply Now'
                )}
              </button>
            )}

            <button
              onClick={() => navigate('/jobs')}
              className="w-full mt-3 text-sm text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 transition-all"
            >
              Browse More Jobs
            </button>

            {job.source && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-2">Original posting</p>
                <span className="flex items-center gap-1.5 text-xs text-indigo-400">
                  <ExternalLink className="w-3 h-3" /> {job.source}
                </span>
              </div>
            )}
          </div>

          {/* Job summary card */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Job Summary</h3>
            <dl className="space-y-3 text-sm">
              {job.type && (
                <div>
                  <dt className="text-gray-500">Type</dt>
                  <dd className="text-gray-300 mt-0.5">{job.type}</dd>
                </div>
              )}
              {job.experience && (
                <div>
                  <dt className="text-gray-500">Experience</dt>
                  <dd className="text-gray-300 mt-0.5">{job.experience}</dd>
                </div>
              )}
              {job.citizenship && (
                <div>
                  <dt className="text-gray-500">Citizenship</dt>
                  <dd className="text-gray-300 mt-0.5 capitalize">
                    {job.citizenship.replace(/_/g, ' ')}
                  </dd>
                </div>
              )}
              {job.industry && (
                <div>
                  <dt className="text-gray-500">Industry</dt>
                  <dd className="text-gray-300 mt-0.5 capitalize">{job.industry}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
