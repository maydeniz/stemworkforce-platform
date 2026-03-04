import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  Trophy,
  ArrowRight,
  Clock,
  Target,
  Zap,
} from 'lucide-react';

const METRICS = [
  { label: 'Active Challenges', value: '24', change: '+6 this month', icon: Target, color: 'emerald' },
  { label: 'Total Participants', value: '3,847', change: '+12% growth', icon: Users, color: 'blue' },
  { label: 'Submissions', value: '1,256', change: '892 reviewed', icon: BarChart3, color: 'purple' },
  { label: 'Prize Pool', value: '$485K', change: 'Across all active', icon: Trophy, color: 'amber' },
];

const TOP_CHALLENGES = [
  { title: 'Quantum Error Correction Algorithm', industry: 'Quantum Computing', participants: 342, submissions: 89, daysLeft: 14 },
  { title: 'AI-Powered Grid Optimization', industry: 'Clean Energy', participants: 256, submissions: 67, daysLeft: 21 },
  { title: 'Semiconductor Yield Prediction', industry: 'Semiconductor', participants: 198, submissions: 45, daysLeft: 7 },
  { title: 'Cybersecurity Threat Detection', industry: 'Cybersecurity', participants: 423, submissions: 112, daysLeft: 30 },
  { title: 'Biotech Drug Discovery Pipeline', industry: 'Biotechnology', participants: 167, submissions: 38, daysLeft: 45 },
];

const INDUSTRY_STATS = [
  { name: 'AI & Machine Learning', challenges: 8, participants: 1240 },
  { name: 'Cybersecurity', challenges: 5, participants: 890 },
  { name: 'Quantum Computing', challenges: 3, participants: 560 },
  { name: 'Clean Energy', challenges: 3, participants: 445 },
  { name: 'Semiconductor', challenges: 2, participants: 380 },
  { name: 'Biotechnology', challenges: 2, participants: 210 },
  { name: 'Aerospace', challenges: 1, participants: 122 },
];

export default function ChallengesAnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Challenges Analytics</h1>
              <p className="text-slate-400 mt-2">Platform-wide challenge performance and engagement metrics.</p>
            </div>
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors"
            >
              Browse Challenges <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {METRICS.map(metric => (
            <div key={metric.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <metric.icon size={20} className="text-emerald-400" />
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-xs text-slate-500 mt-1">{metric.change}</div>
              <div className="text-sm text-slate-400 mt-1">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Challenges */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Top Challenges by Participation</h2>
              <div className="space-y-3">
                {TOP_CHALLENGES.map((challenge, i) => (
                  <div key={challenge.title} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-emerald-400">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{challenge.title}</div>
                      <div className="text-xs text-slate-500">{challenge.industry}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-slate-300">{challenge.participants} participants</div>
                      <div className="text-slate-500">{challenge.submissions} submissions</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Clock size={12} />
                      {challenge.daysLeft}d
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Industry Breakdown */}
          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">By Industry</h2>
              <div className="space-y-3">
                {INDUSTRY_STATS.map(industry => {
                  const maxParticipants = Math.max(...INDUSTRY_STATS.map(i => i.participants));
                  const width = (industry.participants / maxParticipants) * 100;
                  return (
                    <div key={industry.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-300 truncate">{industry.name}</span>
                        <span className="text-slate-500 ml-2">{industry.challenges}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{industry.participants.toLocaleString()} participants</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-xl p-6 mt-4">
              <Zap size={20} className="text-amber-400 mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-slate-400 mb-3">
                Our AI analyzes submission patterns, skill gaps, and industry demand to surface workforce insights from challenge data.
              </p>
              <Link to="/workforce-analytics" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                View Workforce Analytics &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
