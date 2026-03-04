import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Users,
  ArrowRight,
  Filter,
  ChevronUp,
} from 'lucide-react';

const INDUSTRIES = ['All Industries', 'AI & ML', 'Quantum', 'Cybersecurity', 'Clean Energy', 'Semiconductor', 'Aerospace', 'Biotech'];

const LEADERBOARD = [
  { rank: 1, name: 'Sarah Chen', institution: 'MIT', points: 4850, challenges: 12, wins: 5, streak: 8, badge: 'gold' },
  { rank: 2, name: 'Marcus Williams', institution: 'Georgia Tech', points: 4320, challenges: 15, wins: 4, streak: 6, badge: 'gold' },
  { rank: 3, name: 'Priya Patel', institution: 'Stanford', points: 3980, challenges: 10, wins: 4, streak: 5, badge: 'gold' },
  { rank: 4, name: 'James Rodriguez', institution: 'UT Austin', points: 3750, challenges: 11, wins: 3, streak: 4, badge: 'silver' },
  { rank: 5, name: 'Aisha Johnson', institution: 'Howard University', points: 3640, challenges: 9, wins: 3, streak: 7, badge: 'silver' },
  { rank: 6, name: 'David Kim', institution: 'Caltech', points: 3520, challenges: 8, wins: 3, streak: 3, badge: 'silver' },
  { rank: 7, name: 'Elena Vasquez', institution: 'University of Florida', points: 3380, challenges: 13, wins: 2, streak: 5, badge: 'silver' },
  { rank: 8, name: 'Tyler Washington', institution: 'Morehouse College', points: 3210, challenges: 7, wins: 2, streak: 4, badge: 'bronze' },
  { rank: 9, name: 'Maria Santos', institution: 'University of New Mexico', points: 3050, challenges: 10, wins: 2, streak: 3, badge: 'bronze' },
  { rank: 10, name: 'Chris Anderson', institution: 'Virginia Tech', points: 2940, challenges: 9, wins: 1, streak: 6, badge: 'bronze' },
];

const STATS = [
  { label: 'Total Solvers', value: '3,847' },
  { label: 'Challenges Completed', value: '1,256' },
  { label: 'Total Points Awarded', value: '847K' },
  { label: 'Hiring Offers Made', value: '342' },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy size={18} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={18} className="text-gray-300" />;
  if (rank === 3) return <Medal size={18} className="text-amber-600" />;
  return <span className="text-sm text-slate-500 font-mono w-[18px] text-center">{rank}</span>;
}

function getBadgeColor(badge: string) {
  if (badge === 'gold') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (badge === 'silver') return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
  return 'bg-amber-700/20 text-amber-500 border-amber-700/30';
}

export default function ChallengesLeaderboardPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={28} className="text-yellow-400" />
                <h1 className="text-3xl font-bold">Leaderboard</h1>
              </div>
              <p className="text-slate-400">Top STEM problem solvers ranked by challenge performance.</p>
            </div>
            <Link
              to="/challenges/solve"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors"
            >
              Solve Challenges <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          <Filter size={16} className="text-slate-500" />
          <div className="flex gap-2 flex-wrap">
            {INDUSTRIES.map(industry => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedIndustry === industry
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_120px_80px_80px_80px_80px] gap-4 px-6 py-3 border-b border-slate-800 text-xs text-slate-500 font-medium">
            <div>Rank</div>
            <div>Solver</div>
            <div>Institution</div>
            <div className="text-center">Points</div>
            <div className="text-center">Challenges</div>
            <div className="text-center">Wins</div>
            <div className="text-center">Streak</div>
          </div>
          {LEADERBOARD.map(solver => (
            <div
              key={solver.rank}
              className={`grid grid-cols-[60px_1fr_120px_80px_80px_80px_80px] gap-4 px-6 py-4 border-b border-slate-800/50 last:border-0 items-center hover:bg-slate-800/30 transition-colors ${
                solver.rank <= 3 ? 'bg-slate-800/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {getRankIcon(solver.rank)}
                {solver.rank <= 3 && <ChevronUp size={12} className="text-emerald-400" />}
              </div>
              <div>
                <div className="text-sm font-medium">{solver.name}</div>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${getBadgeColor(solver.badge)}`}>
                  {solver.badge.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate">{solver.institution}</div>
              <div className="text-center">
                <div className="text-sm font-bold text-emerald-400">{solver.points.toLocaleString()}</div>
              </div>
              <div className="text-center text-sm text-slate-300">{solver.challenges}</div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-sm text-amber-400">
                  <Star size={12} /> {solver.wins}
                </span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-sm text-blue-400">
                  <TrendingUp size={12} /> {solver.streak}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-xl p-8 text-center">
          <Users size={24} className="text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Ready to Compete?</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            Solve real STEM challenges from top employers and research labs. Build your skills, earn points, and get noticed by hiring managers.
          </p>
          <Link
            to="/challenges/solve"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors"
          >
            Start Solving <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
