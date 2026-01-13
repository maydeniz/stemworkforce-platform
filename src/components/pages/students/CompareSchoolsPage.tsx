import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  X,
  Scale,
  Star,
  TrendingUp,
  DollarSign,
  MapPin,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Briefcase,
  Heart,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Minus,
  PenLine,
  Save,
  Search
} from 'lucide-react';

// Types
interface School {
  id: string;
  name: string;
  location: string;
  type: 'public' | 'private';
  size: 'small' | 'medium' | 'large';
  setting: 'urban' | 'suburban' | 'rural';
  acceptanceRate: number;
  netCost: number;
  graduationRate: number;
  studentFacultyRatio: string;
  avgSalaryAfter: number;
  stemPrograms: string[];
  campusLife: string[];
  ranking?: number;
  image?: string;
}

interface ComparisonFactor {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'academics' | 'financial' | 'campus' | 'outcomes';
  weight: number; // 0-100
}

interface ProCon {
  id: string;
  schoolId: string;
  type: 'pro' | 'con';
  text: string;
}

interface JournalEntry {
  id: string;
  date: string;
  schoolId?: string;
  title: string;
  content: string;
  mood: 'excited' | 'uncertain' | 'concerned' | 'neutral';
}

// Sample schools for adding
const SAMPLE_SCHOOLS: School[] = [
  {
    id: 'mit',
    name: 'MIT',
    location: 'Cambridge, MA',
    type: 'private',
    size: 'medium',
    setting: 'urban',
    acceptanceRate: 4,
    netCost: 24000,
    graduationRate: 95,
    studentFacultyRatio: '3:1',
    avgSalaryAfter: 104700,
    stemPrograms: ['Computer Science', 'Engineering', 'Physics', 'Mathematics'],
    campusLife: ['Research Opportunities', 'Hackathons', 'Innovation Labs'],
    ranking: 1
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    location: 'Stanford, CA',
    type: 'private',
    size: 'medium',
    setting: 'suburban',
    acceptanceRate: 4,
    netCost: 22000,
    graduationRate: 94,
    studentFacultyRatio: '5:1',
    avgSalaryAfter: 94000,
    stemPrograms: ['Computer Science', 'Engineering', 'Biology', 'Chemistry'],
    campusLife: ['Entrepreneurship', 'Silicon Valley Access', 'Research'],
    ranking: 3
  },
  {
    id: 'gatech',
    name: 'Georgia Tech',
    location: 'Atlanta, GA',
    type: 'public',
    size: 'large',
    setting: 'urban',
    acceptanceRate: 17,
    netCost: 15000,
    graduationRate: 90,
    studentFacultyRatio: '19:1',
    avgSalaryAfter: 79000,
    stemPrograms: ['Engineering', 'Computer Science', 'Industrial Engineering'],
    campusLife: ['Sports Culture', 'Co-op Programs', 'Research'],
    ranking: 8
  },
  {
    id: 'berkeley',
    name: 'UC Berkeley',
    location: 'Berkeley, CA',
    type: 'public',
    size: 'large',
    setting: 'urban',
    acceptanceRate: 11,
    netCost: 18000,
    graduationRate: 93,
    studentFacultyRatio: '20:1',
    avgSalaryAfter: 82000,
    stemPrograms: ['Computer Science', 'Engineering', 'Data Science', 'Chemistry'],
    campusLife: ['Diverse Community', 'Research Labs', 'Bay Area Access'],
    ranking: 4
  },
  {
    id: 'purdue',
    name: 'Purdue University',
    location: 'West Lafayette, IN',
    type: 'public',
    size: 'large',
    setting: 'suburban',
    acceptanceRate: 53,
    netCost: 12000,
    graduationRate: 83,
    studentFacultyRatio: '13:1',
    avgSalaryAfter: 68000,
    stemPrograms: ['Engineering', 'Computer Science', 'Aviation', 'Agriculture'],
    campusLife: ['Engineering Culture', 'Affordable', 'Strong Alumni'],
    ranking: 10
  },
  {
    id: 'umich',
    name: 'University of Michigan',
    location: 'Ann Arbor, MI',
    type: 'public',
    size: 'large',
    setting: 'suburban',
    acceptanceRate: 18,
    netCost: 17000,
    graduationRate: 92,
    studentFacultyRatio: '12:1',
    avgSalaryAfter: 74000,
    stemPrograms: ['Engineering', 'Computer Science', 'Biology', 'Chemistry'],
    campusLife: ['Sports Culture', 'Research', 'Vibrant Campus'],
    ranking: 6
  },
  {
    id: 'cmu',
    name: 'Carnegie Mellon',
    location: 'Pittsburgh, PA',
    type: 'private',
    size: 'medium',
    setting: 'urban',
    acceptanceRate: 11,
    netCost: 28000,
    graduationRate: 93,
    studentFacultyRatio: '5:1',
    avgSalaryAfter: 98000,
    stemPrograms: ['Computer Science', 'Robotics', 'Engineering', 'AI'],
    campusLife: ['Tech Innovation', 'Interdisciplinary', 'Industry Connections'],
    ranking: 5
  },
  {
    id: 'caltech',
    name: 'Caltech',
    location: 'Pasadena, CA',
    type: 'private',
    size: 'small',
    setting: 'suburban',
    acceptanceRate: 3,
    netCost: 26000,
    graduationRate: 93,
    studentFacultyRatio: '3:1',
    avgSalaryAfter: 91000,
    stemPrograms: ['Physics', 'Engineering', 'Chemistry', 'Biology'],
    campusLife: ['Intense Academics', 'Research Focus', 'Small Community'],
    ranking: 2
  }
];

const DEFAULT_FACTORS: ComparisonFactor[] = [
  { id: 'academics', name: 'Academic Quality', icon: <BookOpen className="w-4 h-4" />, category: 'academics', weight: 80 },
  { id: 'stem', name: 'STEM Programs', icon: <GraduationCap className="w-4 h-4" />, category: 'academics', weight: 85 },
  { id: 'cost', name: 'Net Cost', icon: <DollarSign className="w-4 h-4" />, category: 'financial', weight: 75 },
  { id: 'location', name: 'Location', icon: <MapPin className="w-4 h-4" />, category: 'campus', weight: 60 },
  { id: 'size', name: 'Campus Size', icon: <Building2 className="w-4 h-4" />, category: 'campus', weight: 50 },
  { id: 'culture', name: 'Campus Culture', icon: <Users className="w-4 h-4" />, category: 'campus', weight: 65 },
  { id: 'outcomes', name: 'Career Outcomes', icon: <Briefcase className="w-4 h-4" />, category: 'outcomes', weight: 70 },
  { id: 'fit', name: 'Personal Fit', icon: <Heart className="w-4 h-4" />, category: 'campus', weight: 90 }
];

// Views
type View = 'intro' | 'compare' | 'journal';

const CompareSchoolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('intro');
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [factors, setFactors] = useState<ComparisonFactor[]>(DEFAULT_FACTORS);
  const [prosCons, setProsCons] = useState<ProCon[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddSchool = (school: School) => {
    if (selectedSchools.length < 4 && !selectedSchools.find(s => s.id === school.id)) {
      setSelectedSchools([...selectedSchools, school]);
    }
    setShowAddSchool(false);
    setSearchQuery('');
  };

  const handleRemoveSchool = (schoolId: string) => {
    setSelectedSchools(selectedSchools.filter(s => s.id !== schoolId));
    setProsCons(prosCons.filter(pc => pc.schoolId !== schoolId));
  };

  const handleUpdateWeight = (factorId: string, weight: number) => {
    setFactors(factors.map(f => f.id === factorId ? { ...f, weight } : f));
  };

  const handleAddProCon = (schoolId: string, type: 'pro' | 'con', text: string) => {
    setProsCons([...prosCons, {
      id: Date.now().toString(),
      schoolId,
      type,
      text
    }]);
  };

  const handleRemoveProCon = (id: string) => {
    setProsCons(prosCons.filter(pc => pc.id !== id));
  };

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    setJournalEntries([{
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    }, ...journalEntries]);
  };

  const filteredSchools = SAMPLE_SCHOOLS.filter(school =>
    !selectedSchools.find(s => s.id === school.id) &&
    school.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'intro') {
    return (
      <IntroView
        onStart={() => setView('compare')}
        onBack={() => navigate('/student-dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView('intro')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Compare Schools</h1>
                <p className="text-sm text-gray-400">
                  {selectedSchools.length} of 4 schools selected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('compare')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'compare'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Scale className="w-4 h-4 inline mr-2" />
                Compare
              </button>
              <button
                onClick={() => setView('journal')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'journal'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <PenLine className="w-4 h-4 inline mr-2" />
                Journal
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'compare' ? (
        <CompareView
          schools={selectedSchools}
          factors={factors}
          prosCons={prosCons}
          showAddSchool={showAddSchool}
          searchQuery={searchQuery}
          filteredSchools={filteredSchools}
          onSetShowAddSchool={setShowAddSchool}
          onSetSearchQuery={setSearchQuery}
          onAddSchool={handleAddSchool}
          onRemoveSchool={handleRemoveSchool}
          onUpdateWeight={handleUpdateWeight}
          onAddProCon={handleAddProCon}
          onRemoveProCon={handleRemoveProCon}
        />
      ) : (
        <JournalView
          schools={selectedSchools}
          entries={journalEntries}
          onAddEntry={handleAddJournalEntry}
        />
      )}
    </div>
  );
};

// Intro View
const IntroView: React.FC<{
  onStart: () => void;
  onBack: () => void;
}> = ({ onStart, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Compare Schools</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Side-by-side comparison with weighted priorities and personal decision journaling
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FeatureCard
            icon={<Scale className="w-6 h-6" />}
            title="Multi-Dimensional Matrix"
            description="Compare up to 4 schools across academics, cost, culture, and outcomes"
            color="amber"
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Weighted Priorities"
            description="Adjust factor importance based on what matters most to you"
            color="orange"
          />
          <FeatureCard
            icon={<Star className="w-6 h-6" />}
            title="Pros & Cons Builder"
            description="Document advantages and concerns for each school"
            color="amber"
          />
          <FeatureCard
            icon={<PenLine className="w-6 h-6" />}
            title="Decision Journal"
            description="Track your thoughts and feelings throughout the decision process"
            color="orange"
          />
        </div>

        {/* How It Works */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">How to Use This Tool</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium">Add Your Schools</h3>
                <p className="text-gray-400 text-sm">
                  Select up to 4 schools you're seriously considering
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium">Set Your Priorities</h3>
                <p className="text-gray-400 text-sm">
                  Adjust weight sliders to reflect what matters most to you
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium">Build Pros & Cons</h3>
                <p className="text-gray-400 text-sm">
                  Add personal notes about what excites or concerns you
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-medium">Journal Your Journey</h3>
                <p className="text-gray-400 text-sm">
                  Document thoughts, campus visits, and evolving feelings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-400 mb-2">A Tool for Reflection</h3>
              <p className="text-gray-300 text-sm">
                This comparison tool is designed to help organize your thoughts, not make decisions for you.
                Numbers and rankings can't capture everything—your gut feeling, campus visits, and conversations
                with current students are equally important.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl font-semibold transition-all"
        >
          Start Comparing Schools
        </button>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'amber' | 'orange';
}> = ({ icon, title, description, color }) => {
  const colors = {
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

// Compare View
const CompareView: React.FC<{
  schools: School[];
  factors: ComparisonFactor[];
  prosCons: ProCon[];
  showAddSchool: boolean;
  searchQuery: string;
  filteredSchools: School[];
  onSetShowAddSchool: (show: boolean) => void;
  onSetSearchQuery: (query: string) => void;
  onAddSchool: (school: School) => void;
  onRemoveSchool: (schoolId: string) => void;
  onUpdateWeight: (factorId: string, weight: number) => void;
  onAddProCon: (schoolId: string, type: 'pro' | 'con', text: string) => void;
  onRemoveProCon: (id: string) => void;
}> = ({
  schools,
  factors,
  prosCons,
  showAddSchool,
  searchQuery,
  filteredSchools,
  onSetShowAddSchool,
  onSetSearchQuery,
  onAddSchool,
  onRemoveSchool,
  onUpdateWeight,
  onAddProCon,
  onRemoveProCon
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('comparison');
  const [newProCon, setNewProCon] = useState<{ schoolId: string; type: 'pro' | 'con'; text: string } | null>(null);

  // Calculate scores for each school based on weighted factors
  const schoolScores = useMemo(() => {
    return schools.map(school => {
      let totalScore = 0;
      let totalWeight = 0;

      factors.forEach(factor => {
        let score = 0;
        switch (factor.id) {
          case 'academics':
            score = school.graduationRate;
            break;
          case 'stem':
            score = Math.min(100, school.stemPrograms.length * 25);
            break;
          case 'cost':
            // Lower cost = higher score
            score = Math.max(0, 100 - (school.netCost / 500));
            break;
          case 'outcomes':
            score = Math.min(100, (school.avgSalaryAfter / 1000));
            break;
          default:
            score = 70; // Default score for subjective factors
        }
        totalScore += score * (factor.weight / 100);
        totalWeight += factor.weight;
      });

      return {
        schoolId: school.id,
        score: totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0
      };
    });
  }, [schools, factors]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* School Cards Row */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {/* Factor Labels Column */}
        <div className="pt-[180px]">
          {/* Placeholder for alignment */}
        </div>

        {/* School Cards */}
        {schools.map(school => {
          const scoreData = schoolScores.find(s => s.schoolId === school.id);
          return (
            <SchoolCard
              key={school.id}
              school={school}
              score={scoreData?.score || 0}
              onRemove={() => onRemoveSchool(school.id)}
            />
          );
        })}

        {/* Add School Slots */}
        {Array.from({ length: 4 - schools.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            onClick={() => onSetShowAddSchool(true)}
            className="min-h-[180px] border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors"
          >
            <Plus className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-gray-500 text-sm">Add School</span>
          </div>
        ))}
      </div>

      {/* Add School Modal */}
      {showAddSchool && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add School to Compare</h3>
              <button
                onClick={() => {
                  onSetShowAddSchool(false);
                  onSetSearchQuery('');
                }}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSetSearchQuery(e.target.value)}
                  placeholder="Search schools..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredSchools.map(school => (
                  <button
                    key={school.id}
                    onClick={() => onAddSchool(school)}
                    className="w-full p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{school.name}</h4>
                        <p className="text-sm text-gray-400">{school.location}</p>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <p>{school.acceptanceRate}% acceptance</p>
                        <p>${school.netCost.toLocaleString()}/yr net</p>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredSchools.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No schools found matching your search
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Matrix */}
      <CollapsibleSection
        title="Comparison Matrix"
        icon={<Scale className="w-5 h-5" />}
        expanded={expandedSection === 'comparison'}
        onToggle={() => setExpandedSection(expandedSection === 'comparison' ? null : 'comparison')}
      >
        {schools.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Add schools above to start comparing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 text-gray-400 font-medium">Factor</th>
                  {schools.map(school => (
                    <th key={school.id} className="text-center p-3 text-gray-400 font-medium">
                      {school.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Info Rows */}
                <ComparisonRow
                  label="Location"
                  icon={<MapPin className="w-4 h-4" />}
                  values={schools.map(s => s.location)}
                />
                <ComparisonRow
                  label="Type"
                  icon={<Building2 className="w-4 h-4" />}
                  values={schools.map(s => s.type.charAt(0).toUpperCase() + s.type.slice(1))}
                />
                <ComparisonRow
                  label="Size"
                  icon={<Users className="w-4 h-4" />}
                  values={schools.map(s => s.size.charAt(0).toUpperCase() + s.size.slice(1))}
                />
                <ComparisonRow
                  label="Acceptance Rate"
                  icon={<TrendingUp className="w-4 h-4" />}
                  values={schools.map(s => `${s.acceptanceRate}%`)}
                  highlight="low"
                  numericValues={schools.map(s => s.acceptanceRate)}
                />
                <ComparisonRow
                  label="Net Cost"
                  icon={<DollarSign className="w-4 h-4" />}
                  values={schools.map(s => `$${s.netCost.toLocaleString()}`)}
                  highlight="low"
                  numericValues={schools.map(s => s.netCost)}
                />
                <ComparisonRow
                  label="Graduation Rate"
                  icon={<GraduationCap className="w-4 h-4" />}
                  values={schools.map(s => `${s.graduationRate}%`)}
                  highlight="high"
                  numericValues={schools.map(s => s.graduationRate)}
                />
                <ComparisonRow
                  label="Student:Faculty"
                  icon={<Users className="w-4 h-4" />}
                  values={schools.map(s => s.studentFacultyRatio)}
                />
                <ComparisonRow
                  label="Avg Salary (10yr)"
                  icon={<Briefcase className="w-4 h-4" />}
                  values={schools.map(s => `$${s.avgSalaryAfter.toLocaleString()}`)}
                  highlight="high"
                  numericValues={schools.map(s => s.avgSalaryAfter)}
                />
              </tbody>
            </table>
          </div>
        )}
      </CollapsibleSection>

      {/* Priority Weights */}
      <CollapsibleSection
        title="Priority Weights"
        icon={<TrendingUp className="w-5 h-5" />}
        expanded={expandedSection === 'weights'}
        onToggle={() => setExpandedSection(expandedSection === 'weights' ? null : 'weights')}
      >
        <p className="text-gray-400 text-sm mb-6">
          Adjust these sliders to reflect what's most important to you. Higher weights mean the factor matters more in your decision.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {factors.map(factor => (
            <WeightSlider
              key={factor.id}
              factor={factor}
              onChange={(weight) => onUpdateWeight(factor.id, weight)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Pros & Cons */}
      <CollapsibleSection
        title="Pros & Cons"
        icon={<Star className="w-5 h-5" />}
        expanded={expandedSection === 'proscons'}
        onToggle={() => setExpandedSection(expandedSection === 'proscons' ? null : 'proscons')}
      >
        {schools.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Add schools to build your pros and cons list</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {schools.map(school => {
              const schoolProsCons = prosCons.filter(pc => pc.schoolId === school.id);
              const pros = schoolProsCons.filter(pc => pc.type === 'pro');
              const cons = schoolProsCons.filter(pc => pc.type === 'con');

              return (
                <div key={school.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <h4 className="font-medium mb-4">{school.name}</h4>

                  {/* Pros */}
                  <div className="mb-4">
                    <h5 className="text-sm text-green-400 font-medium mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" /> Pros
                    </h5>
                    <div className="space-y-2">
                      {pros.map(pro => (
                        <div
                          key={pro.id}
                          className="flex items-start gap-2 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-2"
                        >
                          <span className="flex-1">{pro.text}</span>
                          <button
                            onClick={() => onRemoveProCon(pro.id)}
                            className="text-gray-500 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {newProCon?.schoolId === school.id && newProCon.type === 'pro' ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newProCon.text}
                            onChange={(e) => setNewProCon({ ...newProCon, text: e.target.value })}
                            placeholder="Add a pro..."
                            className="flex-1 text-sm px-2 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newProCon.text.trim()) {
                                onAddProCon(school.id, 'pro', newProCon.text.trim());
                                setNewProCon(null);
                              } else if (e.key === 'Escape') {
                                setNewProCon(null);
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              if (newProCon.text.trim()) {
                                onAddProCon(school.id, 'pro', newProCon.text.trim());
                              }
                              setNewProCon(null);
                            }}
                            className="p-1 text-green-400 hover:bg-green-500/20 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setNewProCon({ schoolId: school.id, type: 'pro', text: '' })}
                          className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add pro
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cons */}
                  <div>
                    <h5 className="text-sm text-red-400 font-medium mb-2 flex items-center gap-2">
                      <Minus className="w-4 h-4" /> Cons
                    </h5>
                    <div className="space-y-2">
                      {cons.map(con => (
                        <div
                          key={con.id}
                          className="flex items-start gap-2 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2"
                        >
                          <span className="flex-1">{con.text}</span>
                          <button
                            onClick={() => onRemoveProCon(con.id)}
                            className="text-gray-500 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {newProCon?.schoolId === school.id && newProCon.type === 'con' ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newProCon.text}
                            onChange={(e) => setNewProCon({ ...newProCon, text: e.target.value })}
                            placeholder="Add a con..."
                            className="flex-1 text-sm px-2 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-red-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newProCon.text.trim()) {
                                onAddProCon(school.id, 'con', newProCon.text.trim());
                                setNewProCon(null);
                              } else if (e.key === 'Escape') {
                                setNewProCon(null);
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              if (newProCon.text.trim()) {
                                onAddProCon(school.id, 'con', newProCon.text.trim());
                              }
                              setNewProCon(null);
                            }}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setNewProCon({ schoolId: school.id, type: 'con', text: '' })}
                          className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add con
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
};

// School Card Component
const SchoolCard: React.FC<{
  school: School;
  score: number;
  onRemove: () => void;
}> = ({ school, score, onRemove }) => {
  return (
    <div className="relative bg-gray-800/50 border border-gray-700 rounded-xl p-4 min-h-[180px]">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-3">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-lg mb-1">{school.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{school.location}</p>

        {/* Score Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 font-medium">{Math.round(score)}% match</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        <div className="text-center p-2 bg-gray-700/50 rounded">
          <p className="text-gray-400">Acceptance</p>
          <p className="font-medium">{school.acceptanceRate}%</p>
        </div>
        <div className="text-center p-2 bg-gray-700/50 rounded">
          <p className="text-gray-400">Net Cost</p>
          <p className="font-medium">${(school.netCost / 1000).toFixed(0)}k</p>
        </div>
      </div>
    </div>
  );
};

// Comparison Row Component
const ComparisonRow: React.FC<{
  label: string;
  icon: React.ReactNode;
  values: string[];
  highlight?: 'high' | 'low';
  numericValues?: number[];
}> = ({ label, icon, values, highlight, numericValues }) => {
  const getBestIndex = () => {
    if (!numericValues || numericValues.length === 0) return -1;
    if (highlight === 'high') {
      return numericValues.indexOf(Math.max(...numericValues));
    } else if (highlight === 'low') {
      return numericValues.indexOf(Math.min(...numericValues));
    }
    return -1;
  };

  const bestIndex = getBestIndex();

  return (
    <tr className="border-t border-gray-800">
      <td className="p-3">
        <div className="flex items-center gap-2 text-gray-300">
          {icon}
          <span>{label}</span>
        </div>
      </td>
      {values.map((value, index) => (
        <td
          key={index}
          className={`p-3 text-center ${
            index === bestIndex
              ? 'text-amber-400 font-medium'
              : 'text-gray-300'
          }`}
        >
          {value}
          {index === bestIndex && (
            <Star className="w-3 h-3 inline ml-1 text-amber-400" />
          )}
        </td>
      ))}
    </tr>
  );
};

// Weight Slider Component
const WeightSlider: React.FC<{
  factor: ComparisonFactor;
  onChange: (weight: number) => void;
}> = ({ factor, onChange }) => {
  const categoryColors = {
    academics: 'bg-blue-500',
    financial: 'bg-green-500',
    campus: 'bg-purple-500',
    outcomes: 'bg-amber-500'
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded ${categoryColors[factor.category]} bg-opacity-20`}>
            {factor.icon}
          </span>
          <span className="font-medium">{factor.name}</span>
        </div>
        <span className="text-amber-400 font-medium">{factor.weight}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={factor.weight}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-amber-500"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Not Important</span>
        <span>Very Important</span>
      </div>
    </div>
  );
};

// Collapsible Section Component
const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, expanded, onToggle, children }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl mb-6 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-amber-400">{icon}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="p-4 pt-0 border-t border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
};

// Journal View
const JournalView: React.FC<{
  schools: School[];
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
}> = ({ schools, entries, onAddEntry }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    schoolId: '',
    mood: 'neutral' as JournalEntry['mood']
  });

  const handleSave = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      onAddEntry({
        title: newEntry.title,
        content: newEntry.content,
        schoolId: newEntry.schoolId || undefined,
        mood: newEntry.mood
      });
      setNewEntry({ title: '', content: '', schoolId: '', mood: 'neutral' });
      setIsWriting(false);
    }
  };

  const moodEmojis = {
    excited: '😊',
    uncertain: '🤔',
    concerned: '😟',
    neutral: '😐'
  };

  const moodColors = {
    excited: 'bg-green-500/20 border-green-500/30 text-green-400',
    uncertain: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    concerned: 'bg-red-500/20 border-red-500/30 text-red-400',
    neutral: 'bg-gray-500/20 border-gray-500/30 text-gray-400'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Decision Journal</h2>
          <p className="text-gray-400">Track your thoughts and feelings throughout your college decision</p>
        </div>
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <PenLine className="w-4 h-4" />
            New Entry
          </button>
        )}
      </div>

      {/* New Entry Form */}
      {isWriting && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">New Journal Entry</h3>
            <button
              onClick={() => setIsWriting(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            placeholder="Entry title (e.g., 'Campus Visit to MIT')"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-amber-500"
          />

          <textarea
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            placeholder="Write your thoughts, feelings, observations..."
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-amber-500 resize-none"
          />

          <div className="flex flex-wrap gap-4 mb-4">
            {/* School selector */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-2">Related School (optional)</label>
              <select
                value={newEntry.schoolId}
                onChange={(e) => setNewEntry({ ...newEntry, schoolId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="">General thoughts</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>

            {/* Mood selector */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">How are you feeling?</label>
              <div className="flex gap-2">
                {(Object.keys(moodEmojis) as JournalEntry['mood'][]).map(mood => (
                  <button
                    key={mood}
                    onClick={() => setNewEntry({ ...newEntry, mood })}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      newEntry.mood === mood
                        ? moodColors[mood]
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {moodEmojis[mood]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!newEntry.title.trim() || !newEntry.content.trim()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Entry
            </button>
          </div>
        </div>
      )}

      {/* Journal Prompts */}
      {entries.length === 0 && !isWriting && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 mb-8">
          <h3 className="text-lg font-semibold mb-4">Journal Prompts to Get Started</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'What excited you most about your recent campus visit?',
              'What concerns do you have about leaving home for college?',
              'How do you imagine your ideal college experience?',
              'What would help you feel confident in your final decision?'
            ].map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewEntry({ ...newEntry, title: prompt });
                  setIsWriting(true);
                }}
                className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-left text-gray-300 hover:text-white transition-colors"
              >
                <PenLine className="w-4 h-4 text-amber-400 mb-2" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Journal Entries */}
      {entries.length > 0 && (
        <div className="space-y-4">
          {entries.map(entry => {
            const relatedSchool = schools.find(s => s.id === entry.schoolId);
            return (
              <div
                key={entry.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{entry.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      {relatedSchool && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {relatedSchool.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${moodColors[entry.mood]}`}>
                    {moodEmojis[entry.mood]} {entry.mood}
                  </span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{entry.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Journaling Tips */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mt-8">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-400 mb-2">Why Keep a Decision Journal?</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• <strong>Process emotions:</strong> Writing helps you understand your true feelings about each school</li>
              <li>• <strong>Track changes:</strong> Your preferences may shift—journaling helps you notice patterns</li>
              <li>• <strong>Reduce anxiety:</strong> Getting thoughts out of your head onto paper can ease decision stress</li>
              <li>• <strong>Future reference:</strong> Look back on your journey once you've made your choice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareSchoolsPage;
