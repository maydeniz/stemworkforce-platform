// ===========================================
// Graduate School Prep Page - College Students
// PhD/Masters Applications, Fellowships, Research
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Target,
  Clock,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Sparkles,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Star,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Fellowship {
  id: string;
  name: string;
  sponsor: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  fields: string[];
  type: 'government' | 'private' | 'university';
}

interface Program {
  id: string;
  name: string;
  university: string;
  ranking: number;
  acceptanceRate: string;
  funding: string;
  deadline: string;
  gre: 'required' | 'optional' | 'not-required';
}

interface TimelineItem {
  month: string;
  title: string;
  tasks: string[];
  priority: 'high' | 'medium' | 'low';
}

// ===========================================
// SAMPLE DATA
// ===========================================
const FELLOWSHIPS: Fellowship[] = [
  {
    id: '1',
    name: 'NSF Graduate Research Fellowship',
    sponsor: 'National Science Foundation',
    amount: '$147,000 over 3 years',
    deadline: 'October 2025',
    eligibility: ['US Citizen/Permanent Resident', 'Early-stage graduate or senior undergrad'],
    fields: ['STEM', 'STEM Education', 'Social Sciences'],
    type: 'government',
  },
  {
    id: '2',
    name: 'DOE SCGSR Program',
    sponsor: 'Department of Energy',
    amount: 'Living stipend + travel',
    deadline: 'May 2025',
    eligibility: ['PhD student', 'Research at DOE National Lab'],
    fields: ['Physics', 'Chemistry', 'Engineering', 'Computational Science'],
    type: 'government',
  },
  {
    id: '3',
    name: 'Hertz Foundation Fellowship',
    sponsor: 'Hertz Foundation',
    amount: '$250,000+ over 5 years',
    deadline: 'October 2025',
    eligibility: ['US Citizen/Permanent Resident', 'Applied Physical Sciences'],
    fields: ['Engineering', 'Applied Sciences', 'Mathematics'],
    type: 'private',
  },
  {
    id: '4',
    name: 'Ford Foundation Fellowship',
    sponsor: 'Ford Foundation',
    amount: '$28,000/year for 3 years',
    deadline: 'December 2025',
    eligibility: ['Underrepresented minorities', 'PhD pursuing academia'],
    fields: ['All STEM fields', 'Social Sciences', 'Humanities'],
    type: 'private',
  },
  {
    id: '5',
    name: 'SMART Scholarship',
    sponsor: 'Department of Defense',
    amount: 'Full tuition + stipend + job',
    deadline: 'December 2025',
    eligibility: ['US Citizen', 'STEM majors', 'Work for DoD after graduation'],
    fields: ['Engineering', 'Physics', 'Computer Science', 'Math'],
    type: 'government',
  },
];

const TOP_PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Computer Science PhD',
    university: 'MIT',
    ranking: 1,
    acceptanceRate: '6%',
    funding: 'Full funding guaranteed',
    deadline: 'December 15',
    gre: 'not-required',
  },
  {
    id: '2',
    name: 'Electrical Engineering PhD',
    university: 'Stanford',
    ranking: 2,
    acceptanceRate: '8%',
    funding: 'Full funding + RA/TA',
    deadline: 'December 1',
    gre: 'optional',
  },
  {
    id: '3',
    name: 'Physics PhD',
    university: 'Caltech',
    ranking: 3,
    acceptanceRate: '10%',
    funding: 'Full funding',
    deadline: 'December 15',
    gre: 'required',
  },
  {
    id: '4',
    name: 'Data Science Masters',
    university: 'UC Berkeley',
    ranking: 1,
    acceptanceRate: '12%',
    funding: 'Partial scholarships available',
    deadline: 'January 5',
    gre: 'not-required',
  },
];

const APPLICATION_TIMELINE: TimelineItem[] = [
  {
    month: 'Summer (Year Before)',
    title: 'Research & Prepare',
    tasks: [
      'Identify target programs and faculty',
      'Start studying for GRE if required',
      'Begin drafting statement of purpose',
      'Request transcripts',
    ],
    priority: 'high',
  },
  {
    month: 'September - October',
    title: 'Applications & Fellowships',
    tasks: [
      'Apply for NSF GRFP (Oct deadline)',
      'Finalize list of programs',
      'Ask for recommendation letters',
      'Take GRE if needed',
    ],
    priority: 'high',
  },
  {
    month: 'November - December',
    title: 'Submit Applications',
    tasks: [
      'Submit program applications',
      'Complete all supplemental materials',
      'Verify all documents received',
      'Apply for additional fellowships',
    ],
    priority: 'high',
  },
  {
    month: 'January - March',
    title: 'Interview Season',
    tasks: [
      'Attend interview weekends',
      'Meet potential advisors',
      'Evaluate program fit',
      'Negotiate funding packages',
    ],
    priority: 'medium',
  },
  {
    month: 'April',
    title: 'Decision Time',
    tasks: [
      'Compare all offers (deadline: April 15)',
      'Decline other offers professionally',
      'Connect with future labmates',
      'Plan summer transition',
    ],
    priority: 'high',
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const GraduateSchoolPrepPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fellowships' | 'timeline' | 'programs'>('overview');
  const { info, success } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              For College Students
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Graduate School{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Navigator
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Plan your path to graduate school with comprehensive resources for
              applications, fellowships, and research opportunities.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: 'Fellowships', value: '200+', icon: <Award className="w-5 h-5" /> },
                { label: 'PhD Programs', value: '500+', icon: <GraduationCap className="w-5 h-5" /> },
                { label: 'Avg Funding', value: '$35k/yr', icon: <DollarSign className="w-5 h-5" /> },
                { label: 'Success Rate', value: '89%', icon: <TrendingUp className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center text-emerald-400 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 z-30 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-4">
            {[
              { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'fellowships', label: 'Fellowships', icon: <Award className="w-4 h-4" /> },
              { id: 'timeline', label: 'Application Timeline', icon: <Calendar className="w-4 h-4" /> },
              { id: 'programs', label: 'Top Programs', icon: <Building2 className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* PhD vs Masters */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">PhD Programs</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      '4-7 years of research training',
                      'Usually fully funded with stipend',
                      'Leads to research/academic careers',
                      'Deep specialization in one area',
                      'Original dissertation required',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/college/phd-decision"
                    className="inline-flex items-center gap-2 mt-6 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Is a PhD right for me?
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Masters Programs</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      '1-2 years of focused study',
                      'Often self-funded or partial scholarships',
                      'Industry-oriented career prep',
                      'Broader skill development',
                      'Thesis or capstone project',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/college/masters-programs"
                    className="inline-flex items-center gap-2 mt-6 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Explore Masters Programs
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Statement of Purpose Coach',
                    description: 'AI-powered feedback on your research statement and personal narrative',
                    icon: <FileText className="w-6 h-6" />,
                    link: '/college/sop-coach',
                    color: 'emerald',
                  },
                  {
                    title: 'Faculty Research Matcher',
                    description: 'Find professors whose research aligns with your interests',
                    icon: <Users className="w-6 h-6" />,
                    link: '/college/faculty-match',
                    color: 'blue',
                  },
                  {
                    title: 'Research Opportunity Finder',
                    description: 'REUs, summer programs, and lab positions for undergrads',
                    icon: <Target className="w-6 h-6" />,
                    link: '/college/research-opportunities',
                    color: 'purple',
                  },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all group"
                  >
                    <div className={`p-3 rounded-lg inline-block mb-4 ${item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Fellowships Tab */}
          {activeTab === 'fellowships' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Graduate Fellowships</h2>
                  <p className="text-gray-400 mt-1">Prestigious awards that fund your graduate education</p>
                </div>
                <Link
                  to="/college/fellowships"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
                >
                  Find Fellowships
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid gap-6">
                {FELLOWSHIPS.map((fellowship) => (
                  <div
                    key={fellowship.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-white">{fellowship.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            fellowship.type === 'government' ? 'bg-blue-500/20 text-blue-400' :
                            fellowship.type === 'private' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {fellowship.type}
                          </span>
                        </div>
                        <p className="text-gray-400">{fellowship.sponsor}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-lg">{fellowship.amount}</div>
                        <div className="flex items-center gap-1 text-sm text-yellow-400 mt-1">
                          <Clock className="w-4 h-4" />
                          Deadline: {fellowship.deadline}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Eligibility</h4>
                        <div className="flex flex-wrap gap-2">
                          {fellowship.eligibility.map((req, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Fields</h4>
                        <div className="flex flex-wrap gap-2">
                          {fellowship.fields.map((field, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <button onClick={() => success('Fellowship saved to your list! (Save functionality coming soon)')} className="text-sm text-gray-400 hover:text-white transition-colors">
                        Save to list
                      </button>
                      <button onClick={() => info('Detailed fellowship information is coming soon!')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors">
                        Learn More
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">PhD Application Timeline</h2>
                <p className="text-gray-400">For applications due December of your senior year</p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-800 hidden md:block" />

                <div className="space-y-8">
                  {APPLICATION_TIMELINE.map((item, idx) => (
                    <div key={idx} className="relative flex gap-6">
                      {/* Timeline dot */}
                      <div className={`hidden md:flex w-16 h-16 rounded-full items-center justify-center flex-shrink-0 ${
                        item.priority === 'high' ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50' :
                        item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50' :
                        'bg-gray-800 text-gray-400 border-2 border-gray-700'
                      }`}>
                        <Calendar className="w-6 h-6" />
                      </div>

                      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-sm text-emerald-400 font-medium mb-1">{item.month}</div>
                            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {item.priority} priority
                          </span>
                        </div>

                        <ul className="space-y-2">
                          {item.tasks.map((task, taskIdx) => (
                            <li key={taskIdx} className="flex items-center gap-2 text-gray-300">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Pro Tip</h3>
                    <p className="text-gray-400">
                      Start the NSF GRFP application in the summer before your senior year.
                      Even if you don't win, it's excellent practice for your grad school statements,
                      and you can apply again in your first year of grad school.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Top STEM Graduate Programs</h2>
                  <p className="text-gray-400 mt-1">Explore highly-ranked programs in your field</p>
                </div>
                <Link
                  to="/college/program-search"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
                >
                  Search All Programs
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Program</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">University</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-medium">Rank</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-medium">Accept Rate</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Funding</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-medium">GRE</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_PROGRAMS.map((program) => (
                      <tr key={program.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                        <td className="py-4 px-4">
                          <span className="font-medium text-white">{program.name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300">{program.university}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            #{program.ranking}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-gray-300">{program.acceptanceRate}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-green-400 text-sm">{program.funding}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            program.gre === 'not-required' ? 'bg-green-500/20 text-green-400' :
                            program.gre === 'optional' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {program.gre.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300">{program.deadline}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Graduate School Journey?
          </h2>
          <p className="text-gray-400 mb-8">
            Create your profile to save programs, track applications, and get personalized
            recommendations for fellowships and research opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=student&type=college&goal=gradschool"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Create Free Profile
            </Link>
            <Link
              to="/college/sop-coach"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Start Your SOP
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GraduateSchoolPrepPage;
