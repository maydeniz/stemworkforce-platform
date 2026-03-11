// ===========================================
// "Why This School" Generator Page
// ===========================================
// Helps students research schools deeply and articulate
// genuine, specific connections for supplemental essays
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

// Types
interface School {
  id: string;
  name: string;
  location: string;
  logo?: string;
  essayPrompt?: string;
  wordLimit: number;
  deadline?: string;
  researchTasks: ResearchTask[];
  connections: Connection[];
  essayDraft?: string;
  connectionScore: number;
}

interface ResearchTask {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'culture' | 'research' | 'career';
  completed: boolean;
  notes?: string;
}

interface Connection {
  id: string;
  type: 'program' | 'faculty' | 'opportunity' | 'culture' | 'location';
  title: string;
  description: string;
  yourConnection: string;
  strength: 'weak' | 'medium' | 'strong';
}

interface StudentProfile {
  interests: string[];
  values: string[];
  goals: string[];
  experiences: string[];
}

// Sample Data
const SAMPLE_SCHOOLS: School[] = [
  {
    id: '1',
    name: 'MIT',
    location: 'Cambridge, MA',
    essayPrompt: 'Describe the world you come from and how it has shaped you.',
    wordLimit: 250,
    deadline: '2026-01-01',
    researchTasks: [
      { id: 't1', title: 'Explore CSAIL research groups', description: 'Find 2-3 labs working on topics related to your interests', category: 'research', completed: true },
      { id: 't2', title: 'Review Course 6-7 curriculum', description: 'Look at the unique Computational Biology major', category: 'academic', completed: true },
      { id: 't3', title: 'Watch MIT Sandbox info session', description: 'Learn about entrepreneurship opportunities', category: 'career', completed: false },
      { id: 't4', title: 'Explore MISTI programs', description: 'International research and internship opportunities', category: 'career', completed: false },
    ],
    connections: [
      {
        id: 'c1',
        type: 'faculty',
        title: 'Prof. Tambe\'s AI for Social Good research',
        description: 'Using AI/ML to address healthcare disparities in underserved communities',
        yourConnection: 'My volunteer work at the free clinic showed me how AI could help with patient triage and resource allocation',
        strength: 'strong',
      },
      {
        id: 'c2',
        type: 'program',
        title: 'Course 6-7 (Computational Biology)',
        description: 'Interdisciplinary program combining CS and biology',
        yourConnection: 'Connects my CRISPR research experience with my interest in machine learning',
        strength: 'strong',
      },
    ],
    connectionScore: 78,
  },
];

const SAMPLE_PROFILE: StudentProfile = {
  interests: ['Machine Learning', 'Computational Biology', 'Healthcare Technology'],
  values: ['Social Impact', 'Interdisciplinary Thinking', 'Hands-on Building'],
  goals: ['Apply AI to healthcare', 'Research at intersection of CS and biology'],
  experiences: ['CRISPR research at Stanford', 'Free clinic volunteer', 'Robotics team lead'],
};

// Main Component
const WhySchoolPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>(SAMPLE_SCHOOLS);
  const [activeSchool, setActiveSchool] = useState<School | null>(null);
  const [profile] = useState<StudentProfile>(SAMPLE_PROFILE);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-cyan-400">"Why This School" Generator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
                <span>🎓</span>
                <span>Application Support</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                "Why This School" <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Generator</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Stop writing essays that could be about any school. Find genuine connections
                that show you've done your homework.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAddSchoolModal(true)}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>+</span>
                Add School
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!activeSchool ? (
            <SchoolDashboard
              schools={schools}
              profile={profile}
              onSelectSchool={setActiveSchool}
              onAddSchool={() => setShowAddSchoolModal(true)}
            />
          ) : (
            <SchoolWorkspace
              school={activeSchool}
              profile={profile}
              onBack={() => setActiveSchool(null)}
              onUpdate={(updated) => {
                setSchools(schools.map(s => s.id === updated.id ? updated : s));
                setActiveSchool(updated);
              }}
            />
          )}
        </div>
      </section>

      {/* Why It Matters */}
      {!activeSchool && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    💬
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      What Former Admissions Officers Say
                    </h3>
                    <blockquote className="text-gray-300 italic mb-4">
                      "The 'Why This School' essays are where students fail most. They Google the school,
                      find three facts, and string them together. What we want is: 'I read Professor X's
                      paper on Y, and it challenged my assumption about Z.' That shows genuine intellectual engagement."
                    </blockquote>
                    <p className="text-sm text-gray-500">
                      — Former MIT/Stanford Admissions Officer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add School Modal */}
      {showAddSchoolModal && (
        <AddSchoolModal
          onClose={() => setShowAddSchoolModal(false)}
          onAdd={(school) => {
            setSchools([...schools, school]);
            setActiveSchool(school);
            setShowAddSchoolModal(false);
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// School Dashboard
// ===========================================
const SchoolDashboard: React.FC<{
  schools: School[];
  profile: StudentProfile;
  onSelectSchool: (school: School) => void;
  onAddSchool: () => void;
}> = ({ schools, profile, onSelectSchool, onAddSchool }) => {
  const { info } = useNotifications();

  return (
    <div className="space-y-8">
      {/* Your Profile Summary */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span>👤</span>
            Your Profile
          </h3>
          <button
            onClick={() => info('Profile editing coming soon! Add a new school to update your preferences.')}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Edit Profile
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase mb-2">Interests</div>
            <div className="flex flex-wrap gap-1">
              {profile.interests.map((interest, i) => (
                <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase mb-2">Values</div>
            <div className="flex flex-wrap gap-1">
              {profile.values.map((value, i) => (
                <span key={i} className="px-2 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full">
                  {value}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase mb-2">Key Experiences</div>
            <div className="flex flex-wrap gap-1">
              {profile.experiences.slice(0, 2).map((exp, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">My Schools</h2>
          <button
            onClick={onAddSchool}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <span>+</span>
            Add School
          </button>
        </div>

        {schools.length === 0 ? (
          <EmptySchoolState onAddSchool={onAddSchool} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} onClick={() => onSelectSchool(school)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================
// School Card
// ===========================================
const SchoolCard: React.FC<{
  school: School;
  onClick: () => void;
}> = ({ school, onClick }) => {
  const completedTasks = school.researchTasks.filter(t => t.completed).length;
  const totalTasks = school.researchTasks.length;

  const getConnectionColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400 bg-emerald-500/20';
    if (score >= 40) return 'text-amber-400 bg-amber-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-xl bg-gray-900/50 border border-white/5 hover:border-cyan-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
            {school.name}
          </h3>
          <p className="text-sm text-gray-500">{school.location}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConnectionColor(school.connectionScore)}`}>
          {school.connectionScore}%
        </span>
      </div>

      {school.deadline && (
        <div className="text-xs text-gray-500 mb-3">
          Deadline: {new Date(school.deadline).toLocaleDateString()}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Research Tasks</span>
          <span className="text-gray-300">{completedTasks}/{totalTasks}</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-gray-500">{school.connections.length} connections found</span>
      </div>
    </button>
  );
};

// ===========================================
// Empty School State
// ===========================================
const EmptySchoolState: React.FC<{
  onAddSchool: () => void;
}> = ({ onAddSchool }) => {
  return (
    <div className="text-center py-16 px-4 rounded-2xl bg-gray-900/50 border border-white/5">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-3xl mx-auto mb-6">
        🎓
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Find your genuine fit
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Add schools to your list and we'll help you discover authentic connections—
        the kind that make admissions officers remember you.
      </p>
      <button
        onClick={onAddSchool}
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-xl transition-all"
      >
        Add Your First School
      </button>
    </div>
  );
};

// ===========================================
// School Workspace
// ===========================================
const SchoolWorkspace: React.FC<{
  school: School;
  profile: StudentProfile;
  onBack: () => void;
  onUpdate: (school: School) => void;
}> = ({ school, profile, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'research' | 'connections' | 'write'>('research');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{school.name}</h2>
            <p className="text-sm text-gray-400">{school.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Connection Strength</div>
            <div className="text-2xl font-bold text-cyan-400">{school.connectionScore}%</div>
          </div>
        </div>
      </div>

      {/* Essay Prompt */}
      {school.essayPrompt && (
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Essay Prompt</span>
            <span className="text-xs text-gray-500">{school.wordLimit} words</span>
          </div>
          <p className="text-gray-300 italic">"{school.essayPrompt}"</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: 'research', label: 'Research', icon: '🔍' },
          { id: 'connections', label: 'Connections', icon: '🔗' },
          { id: 'write', label: 'Write', icon: '✍️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-cyan-400 border-b-2 border-cyan-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'research' && (
        <ResearchTab school={school} onUpdate={onUpdate} />
      )}
      {activeTab === 'connections' && (
        <ConnectionsTab school={school} profile={profile} onUpdate={onUpdate} />
      )}
      {activeTab === 'write' && (
        <WriteTab school={school} onUpdate={onUpdate} />
      )}
    </div>
  );
};

// ===========================================
// Research Tab
// ===========================================
const ResearchTab: React.FC<{
  school: School;
  onUpdate: (school: School) => void;
}> = ({ school, onUpdate }) => {
  const toggleTask = (taskId: string) => {
    const updatedTasks = school.researchTasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdate({ ...school, researchTasks: updatedTasks });
  };

  const categories = [
    { id: 'academic', label: 'Academic Programs', icon: '📚' },
    { id: 'research', label: 'Research Opportunities', icon: '🔬' },
    { id: 'culture', label: 'Campus Culture', icon: '🏛️' },
    { id: 'career', label: 'Career & Outcomes', icon: '🚀' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/20">
        <div className="flex items-start gap-3">
          <span className="text-cyan-400 text-xl">💡</span>
          <div>
            <h4 className="font-medium text-white mb-1">Research Before You Write</h4>
            <p className="text-sm text-gray-400">
              Complete these tasks to discover authentic connections. Generic essays come from
              surface-level research. The more you explore, the more genuine your essay will be.
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {categories.map((category) => {
          const tasks = school.researchTasks.filter(t => t.category === category.id);
          const completed = tasks.filter(t => t.completed).length;

          return (
            <div key={category.id} className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.label}
                </h4>
                <span className="text-xs text-gray-500">
                  {completed}/{tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-all ${
                      task.completed
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-gray-800/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                      />
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${task.completed ? 'text-cyan-400' : 'text-white'}`}>
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {task.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===========================================
// Connections Tab
// ===========================================
const ConnectionsTab: React.FC<{
  school: School;
  profile: StudentProfile;
  onUpdate: (school: School) => void;
}> = ({ school, profile, onUpdate }) => {
  const [showAddConnection, setShowAddConnection] = useState(false);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-emerald-500/20 text-emerald-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'faculty': return '👨‍🏫';
      case 'program': return '📚';
      case 'opportunity': return '🚀';
      case 'culture': return '🏛️';
      case 'location': return '📍';
      default: return '🔗';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Connection Suggestions */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
        <h4 className="font-medium text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          Potential Connections Based on Your Profile
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {profile.interests.map((interest, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{interest}</span>
                <span className="text-xs text-gray-500">Your interest</span>
              </div>
              <p className="text-xs text-gray-400">
                Search for faculty, labs, or programs at {school.name} related to this interest.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Connections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Your Connections ({school.connections.length})</h4>
          <button
            onClick={() => setShowAddConnection(true)}
            className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/20 transition-all"
          >
            + Add Connection
          </button>
        </div>

        {school.connections.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-gray-900/30 border border-dashed border-white/10">
            <p className="text-gray-500 mb-3">No connections yet</p>
            <p className="text-sm text-gray-600">
              Complete research tasks to discover what connects you to {school.name}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {school.connections.map((connection) => (
              <div key={connection.id} className="p-5 rounded-xl bg-gray-900/50 border border-white/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getTypeIcon(connection.type)}</span>
                    <div>
                      <h5 className="font-medium text-white">{connection.title}</h5>
                      <p className="text-xs text-gray-500 capitalize">{connection.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStrengthColor(connection.strength)}`}>
                    {connection.strength}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{connection.description}</p>
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-xs text-cyan-400 mb-1">Your Connection</div>
                  <p className="text-sm text-gray-300">{connection.yourConnection}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Connection Modal */}
      {showAddConnection && (
        <AddConnectionModal
          school={school}
          onClose={() => setShowAddConnection(false)}
          onAdd={(connection) => {
            onUpdate({
              ...school,
              connections: [...school.connections, connection],
              connectionScore: Math.min(100, school.connectionScore + 15),
            });
            setShowAddConnection(false);
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// Write Tab
// ===========================================
const WriteTab: React.FC<{
  school: School;
  onUpdate: (school: School) => void;
}> = ({ school, onUpdate }) => {
  const [draft, setDraft] = useState(school.essayDraft || '');
  const wordCount = draft.split(/\s+/).filter(Boolean).length;

  const handleSave = () => {
    onUpdate({ ...school, essayDraft: draft });
  };

  const getConnectionStrengthFeedback = () => {
    if (school.connectionScore >= 70) {
      return {
        icon: '✓',
        color: 'text-emerald-400 bg-emerald-500/10',
        message: 'Strong connections identified. Your essay should reflect genuine research.',
      };
    }
    if (school.connectionScore >= 40) {
      return {
        icon: '💡',
        color: 'text-amber-400 bg-amber-500/10',
        message: 'Some connections found. Consider completing more research tasks.',
      };
    }
    return {
      icon: '⚠️',
      color: 'text-red-400 bg-red-500/10',
      message: 'Few connections identified. Complete research tasks before writing.',
    };
  };

  const feedback = getConnectionStrengthFeedback();

  return (
    <div className="space-y-6">
      {/* Connection Strength Reminder */}
      <div className={`p-4 rounded-xl ${feedback.color}`}>
        <div className="flex items-center gap-3">
          <span>{feedback.icon}</span>
          <p className="text-sm">{feedback.message}</p>
        </div>
      </div>

      {/* Connections to Reference */}
      {school.connections.length > 0 && (
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-4">
          <h4 className="text-sm font-medium text-white mb-3">Connections to Weave Into Your Essay</h4>
          <div className="flex flex-wrap gap-2">
            {school.connections.map((c) => (
              <span key={c.id} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs">
                {c.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Why {school.name}?</h4>
            {school.essayPrompt && (
              <p className="text-xs text-gray-500 mt-1 italic">"{school.essayPrompt}"</p>
            )}
          </div>
          <span className={`text-sm ${wordCount > school.wordLimit ? 'text-red-400' : 'text-gray-400'}`}>
            {wordCount} / {school.wordLimit}
          </span>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSave}
          placeholder={`Start with what genuinely excites you about ${school.name}...`}
          className="w-full h-80 p-6 bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      </div>

      {/* Writing Tips */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <h5 className="font-medium text-emerald-400 mb-2 flex items-center gap-2">
            <span>✓</span>
            Do This
          </h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Name specific programs, faculty, or opportunities</li>
            <li>• Connect them to YOUR experiences and goals</li>
            <li>• Show how you'd contribute, not just benefit</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <h5 className="font-medium text-red-400 mb-2 flex items-center gap-2">
            <span>✗</span>
            Avoid This
          </h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Generic phrases like "world-renowned faculty"</li>
            <li>• Facts you could find in 5 minutes of Googling</li>
            <li>• Statements that could apply to any top school</li>
          </ul>
        </div>
      </div>

      {/* Generic Check */}
      {draft.toLowerCase().includes('world-renowned') ||
       draft.toLowerCase().includes('prestigious') ||
       draft.toLowerCase().includes('cutting-edge research') ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <span className="text-amber-400">⚠️</span>
            <div>
              <h5 className="font-medium text-white mb-1">Generic Language Detected</h5>
              <p className="text-sm text-gray-400">
                Your essay contains phrases that appear in many applications. If you replaced
                "{school.name}" with another school, would this sentence still work? If so, it's
                not specific enough.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ===========================================
// Add School Modal
// ===========================================
const AddSchoolModal: React.FC<{
  onClose: () => void;
  onAdd: (school: School) => void;
}> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [essayPrompt, setEssayPrompt] = useState('');
  const [wordLimit, setWordLimit] = useState(250);
  const [deadline, setDeadline] = useState('');

  const handleAdd = () => {
    const newSchool: School = {
      id: Date.now().toString(),
      name,
      location,
      essayPrompt,
      wordLimit,
      deadline,
      researchTasks: [
        { id: 't1', title: 'Explore academic programs', description: 'Find unique majors, minors, or interdisciplinary programs', category: 'academic', completed: false },
        { id: 't2', title: 'Research faculty', description: 'Find 2-3 professors whose work aligns with your interests', category: 'research', completed: false },
        { id: 't3', title: 'Discover student life', description: 'Look at clubs, organizations, and campus culture', category: 'culture', completed: false },
        { id: 't4', title: 'Check career outcomes', description: 'Research where graduates work and what they do', category: 'career', completed: false },
      ],
      connections: [],
      connectionScore: 0,
    };
    onAdd(newSchool);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add School</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">School Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., MIT, Stanford, Georgia Tech"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Cambridge, MA"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Essay Prompt (optional)</label>
            <textarea
              value={essayPrompt}
              onChange={(e) => setEssayPrompt(e.target.value)}
              placeholder="Paste the 'Why Us' essay prompt..."
              className="w-full h-24 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Word Limit</label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(parseInt(e.target.value) || 250)}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-medium rounded-xl transition-all disabled:opacity-50"
          >
            Add School
          </button>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Add Connection Modal
// ===========================================
const AddConnectionModal: React.FC<{
  school: School;
  onClose: () => void;
  onAdd: (connection: Connection) => void;
}> = ({ school, onClose, onAdd }) => {
  const [type, setType] = useState<Connection['type']>('program');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [yourConnection, setYourConnection] = useState('');

  const handleAdd = () => {
    const newConnection: Connection = {
      id: Date.now().toString(),
      type,
      title,
      description,
      yourConnection,
      strength: yourConnection.length > 100 ? 'strong' : yourConnection.length > 50 ? 'medium' : 'weak',
    };
    onAdd(newConnection);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add Connection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Connection Type</label>
            <div className="flex flex-wrap gap-2">
              {['faculty', 'program', 'opportunity', 'culture', 'location'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as Connection['type'])}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                    type === t
                      ? 'bg-cyan-500 text-gray-900'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">What at {school.name}?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Prof. Smith's AI Lab, Course 6-7 major"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Brief description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is it? What makes it unique?"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              How does this connect to YOUR experiences, interests, or goals?
            </label>
            <textarea
              value={yourConnection}
              onChange={(e) => setYourConnection(e.target.value)}
              placeholder="This is the most important part. Be specific about WHY this matters to you."
              className="w-full h-32 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!title || !yourConnection}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-medium rounded-xl transition-all disabled:opacity-50"
          >
            Add Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhySchoolPage;
