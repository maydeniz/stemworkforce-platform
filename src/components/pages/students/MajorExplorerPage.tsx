// ===========================================
// Major Explorer Page
// ===========================================
// Help students explore STEM majors and career paths
// Focus on day-in-the-life, not just salary projections
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Types
interface Major {
  id: string;
  name: string;
  category: string;
  description: string;
  whatYouLearn: string[];
  skillsBuilt: string[];
  typicalCareers: Career[];
  relatedMajors: string[];
  dayInTheLife: DayInTheLife;
  mythBusting: string;
  isInterdisciplinary: boolean;
}

interface Career {
  title: string;
  description: string;
  salaryRange: string;
  growthOutlook: 'high' | 'moderate' | 'stable';
}

interface DayInTheLife {
  studentPerspective: string;
  professionalPerspective: string;
  typicalDay: string[];
}

// Major categories
const CATEGORIES = [
  { id: 'engineering', label: 'Engineering & Technology', icon: '⚙️' },
  { id: 'life-sciences', label: 'Life Sciences', icon: '🧬' },
  { id: 'physical-sciences', label: 'Physical Sciences', icon: '⚛️' },
  { id: 'math-stats', label: 'Math & Statistics', icon: '📊' },
  { id: 'computing', label: 'Computing & Data', icon: '💻' },
  { id: 'interdisciplinary', label: 'Interdisciplinary STEM', icon: '🔗' },
];

// Sample majors data
const MAJORS: Major[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    category: 'computing',
    description: 'Study of computation, algorithms, and systems. Learn to solve complex problems through code and create technology that shapes our world.',
    whatYouLearn: [
      'Algorithms and data structures',
      'Programming in multiple languages',
      'Software engineering principles',
      'Computer systems and architecture',
      'Theory of computation',
    ],
    skillsBuilt: ['Problem solving', 'Logical thinking', 'System design', 'Collaboration', 'Technical communication'],
    typicalCareers: [
      { title: 'Software Engineer', description: 'Build applications and systems', salaryRange: '$80K-$200K+', growthOutlook: 'high' },
      { title: 'Data Scientist', description: 'Extract insights from data', salaryRange: '$90K-$180K', growthOutlook: 'high' },
      { title: 'Product Manager', description: 'Guide product development', salaryRange: '$100K-$200K', growthOutlook: 'high' },
      { title: 'Research Scientist', description: 'Advance computing frontiers', salaryRange: '$100K-$250K', growthOutlook: 'moderate' },
    ],
    relatedMajors: ['Computer Engineering', 'Data Science', 'Information Systems', 'Software Engineering'],
    dayInTheLife: {
      studentPerspective: 'My days involve a mix of lectures, coding assignments, and project work. The most rewarding part is when a complex algorithm finally clicks, or when I see my code come to life in a working application.',
      professionalPerspective: 'As a software engineer, I spend about 40% of my time coding, 30% in meetings and code reviews, and 30% on design and planning. The problems are always different, which keeps it interesting.',
      typicalDay: [
        '9am - Stand-up meeting with team',
        '10am - Deep work: coding or debugging',
        '12pm - Lunch with colleagues',
        '1pm - Code review or pair programming',
        '3pm - Design discussion for new feature',
        '4pm - More coding or documentation',
      ],
    },
    mythBusting: 'You don\'t need to have been coding since childhood. Many successful CS professionals started in college. What matters is curiosity and willingness to learn.',
    isInterdisciplinary: false,
  },
  {
    id: 'mecheng',
    name: 'Mechanical Engineering',
    category: 'engineering',
    description: 'Design, analyze, and manufacture mechanical systems. From tiny medical devices to massive spacecraft, mechanical engineers make things work.',
    whatYouLearn: [
      'Thermodynamics and heat transfer',
      'Mechanics and materials science',
      'CAD/CAM and manufacturing',
      'Control systems',
      'Fluid dynamics',
    ],
    skillsBuilt: ['Design thinking', 'Analytical skills', 'Hands-on prototyping', 'Project management', 'Technical drawing'],
    typicalCareers: [
      { title: 'Design Engineer', description: 'Create new products and systems', salaryRange: '$70K-$120K', growthOutlook: 'moderate' },
      { title: 'Manufacturing Engineer', description: 'Optimize production processes', salaryRange: '$65K-$110K', growthOutlook: 'stable' },
      { title: 'Aerospace Engineer', description: 'Design aircraft and spacecraft', salaryRange: '$80K-$150K', growthOutlook: 'moderate' },
      { title: 'Robotics Engineer', description: 'Build and program robots', salaryRange: '$85K-$150K', growthOutlook: 'high' },
    ],
    relatedMajors: ['Aerospace Engineering', 'Biomedical Engineering', 'Materials Science', 'Mechatronics'],
    dayInTheLife: {
      studentPerspective: 'Mechanical engineering is hands-on. Yes, there\'s math and physics, but I also spend time in machine shops and labs. Senior design project was the highlight—building something real.',
      professionalPerspective: 'I split my time between computer-based design work and testing in the lab. The best part is seeing products I designed actually being used.',
      typicalDay: [
        '8am - Review overnight test results',
        '9am - CAD design work',
        '11am - Cross-functional meeting',
        '1pm - Prototype testing in lab',
        '3pm - Analysis and documentation',
        '5pm - Plan next day\'s priorities',
      ],
    },
    mythBusting: 'Mechanical engineering isn\'t just about cars and machines. ME graduates work in healthcare, consumer electronics, renewable energy, and even entertainment.',
    isInterdisciplinary: false,
  },
  {
    id: 'biomedeng',
    name: 'Biomedical Engineering',
    category: 'engineering',
    description: 'Apply engineering principles to healthcare and medicine. Create devices, drugs, and technologies that improve and save lives.',
    whatYouLearn: [
      'Biology and physiology',
      'Biomechanics',
      'Medical imaging',
      'Biomaterials',
      'Drug delivery systems',
    ],
    skillsBuilt: ['Interdisciplinary thinking', 'Lab techniques', 'Regulatory knowledge', 'Ethical reasoning', 'Communication with clinicians'],
    typicalCareers: [
      { title: 'Medical Device Engineer', description: 'Design healthcare equipment', salaryRange: '$75K-$130K', growthOutlook: 'high' },
      { title: 'Clinical Engineer', description: 'Support hospital technology', salaryRange: '$60K-$100K', growthOutlook: 'moderate' },
      { title: 'Pharmaceutical Scientist', description: 'Develop new drugs', salaryRange: '$80K-$140K', growthOutlook: 'moderate' },
      { title: 'Research Scientist', description: 'Advance medical technology', salaryRange: '$70K-$150K', growthOutlook: 'high' },
    ],
    relatedMajors: ['Biology', 'Chemical Engineering', 'Electrical Engineering', 'Neuroscience'],
    dayInTheLife: {
      studentPerspective: 'BME is challenging because you need to understand both engineering AND biology. But that breadth is what makes it exciting—we\'re solving problems doctors can\'t solve alone.',
      professionalPerspective: 'My work involves close collaboration with surgeons and patients. When I see a device I designed helping real people, that\'s incredibly rewarding.',
      typicalDay: [
        '8am - Review clinical feedback on prototype',
        '10am - Lab work on device testing',
        '12pm - Lunch seminar on new research',
        '1pm - FDA documentation work',
        '3pm - Meeting with clinical partners',
        '5pm - Literature review for new project',
      ],
    },
    mythBusting: 'BME isn\'t "pre-med with engineering." While some go to medical school, most BME graduates have fulfilling careers as engineers.',
    isInterdisciplinary: true,
  },
  {
    id: 'datasci',
    name: 'Data Science',
    category: 'computing',
    description: 'Extract knowledge and insights from data using statistics, machine learning, and domain expertise. Make data-driven decisions at scale.',
    whatYouLearn: [
      'Statistical analysis',
      'Machine learning algorithms',
      'Data visualization',
      'Programming (Python, R)',
      'Database management',
    ],
    skillsBuilt: ['Statistical thinking', 'Programming', 'Storytelling with data', 'Critical thinking', 'Domain expertise'],
    typicalCareers: [
      { title: 'Data Scientist', description: 'Build predictive models', salaryRange: '$90K-$180K', growthOutlook: 'high' },
      { title: 'Machine Learning Engineer', description: 'Deploy ML systems at scale', salaryRange: '$100K-$200K', growthOutlook: 'high' },
      { title: 'Data Analyst', description: 'Analyze and report on data', salaryRange: '$60K-$100K', growthOutlook: 'high' },
      { title: 'Research Scientist', description: 'Advance ML/AI research', salaryRange: '$120K-$250K', growthOutlook: 'high' },
    ],
    relatedMajors: ['Statistics', 'Computer Science', 'Applied Mathematics', 'Business Analytics'],
    dayInTheLife: {
      studentPerspective: 'Data science combines coding, math, and real-world problem solving. Projects range from predicting disease outbreaks to recommending products—the applications are endless.',
      professionalPerspective: 'I spend a lot of time cleaning and understanding data before building models. Communication is key—the best model is useless if stakeholders don\'t understand it.',
      typicalDay: [
        '9am - Check model performance metrics',
        '10am - Data exploration and cleaning',
        '12pm - Team standup',
        '1pm - Model development and testing',
        '3pm - Meeting with product team',
        '4pm - Documentation and presentation prep',
      ],
    },
    mythBusting: 'Data science isn\'t just about building fancy AI. Much of the work is understanding the problem, cleaning data, and communicating results clearly.',
    isInterdisciplinary: true,
  },
  {
    id: 'physics',
    name: 'Physics',
    category: 'physical-sciences',
    description: 'Study the fundamental laws of nature. From quantum mechanics to cosmology, physics explains how the universe works at every scale.',
    whatYouLearn: [
      'Classical and quantum mechanics',
      'Electromagnetism',
      'Thermodynamics',
      'Mathematical methods',
      'Experimental techniques',
    ],
    skillsBuilt: ['Analytical thinking', 'Mathematical modeling', 'Experimental design', 'Abstract reasoning', 'Scientific writing'],
    typicalCareers: [
      { title: 'Research Physicist', description: 'Advance scientific knowledge', salaryRange: '$70K-$150K', growthOutlook: 'stable' },
      { title: 'Data Scientist', description: 'Apply analytical skills to data', salaryRange: '$90K-$180K', growthOutlook: 'high' },
      { title: 'Quantitative Analyst', description: 'Financial modeling', salaryRange: '$100K-$300K', growthOutlook: 'moderate' },
      { title: 'Engineer', description: 'Apply physics to real problems', salaryRange: '$75K-$130K', growthOutlook: 'moderate' },
    ],
    relatedMajors: ['Applied Physics', 'Astrophysics', 'Engineering Physics', 'Mathematics'],
    dayInTheLife: {
      studentPerspective: 'Physics is hard—there\'s no way around it. But there\'s nothing like the moment when you finally understand something fundamental about how the universe works.',
      professionalPerspective: 'Research involves lots of collaboration, debugging experiments, and writing. The path to discovery is rarely straight, but that\'s what makes it exciting.',
      typicalDay: [
        '9am - Review data from overnight experiment',
        '10am - Theory development / calculations',
        '12pm - Lunch with research group',
        '1pm - Lab work or simulation runs',
        '4pm - Group meeting to discuss results',
        '5pm - Reading recent papers',
      ],
    },
    mythBusting: 'Physics majors don\'t all become professors. The problem-solving skills are highly valued in tech, finance, and many other industries.',
    isInterdisciplinary: false,
  },
  {
    id: 'neuro',
    name: 'Neuroscience',
    category: 'life-sciences',
    description: 'Study the brain and nervous system. Understand how we think, feel, learn, and remember—and what happens when things go wrong.',
    whatYouLearn: [
      'Neural biology and physiology',
      'Cognitive psychology',
      'Research methods',
      'Neuroimaging techniques',
      'Computational neuroscience',
    ],
    skillsBuilt: ['Research design', 'Data analysis', 'Lab techniques', 'Critical reading', 'Scientific communication'],
    typicalCareers: [
      { title: 'Research Scientist', description: 'Study brain function and disease', salaryRange: '$60K-$120K', growthOutlook: 'moderate' },
      { title: 'Clinical Researcher', description: 'Develop treatments for neurological conditions', salaryRange: '$70K-$130K', growthOutlook: 'high' },
      { title: 'Data Scientist (Neurotech)', description: 'Apply AI to brain data', salaryRange: '$90K-$160K', growthOutlook: 'high' },
      { title: 'Science Writer', description: 'Communicate brain science', salaryRange: '$50K-$90K', growthOutlook: 'stable' },
    ],
    relatedMajors: ['Biology', 'Psychology', 'Cognitive Science', 'Biomedical Engineering'],
    dayInTheLife: {
      studentPerspective: 'Neuroscience is at the frontier of understanding consciousness. I love that we\'re studying questions humans have asked for centuries with modern tools.',
      professionalPerspective: 'Research is collaborative and iterative. We\'re constantly developing new methods to study the brain—it\'s a field where your creativity matters.',
      typicalDay: [
        '8am - Run behavioral experiments',
        '10am - Analyze imaging data',
        '12pm - Lab meeting',
        '2pm - Write up results',
        '4pm - Read and review papers',
        '5pm - Plan next experiments',
      ],
    },
    mythBusting: 'Neuroscience isn\'t just pre-med. Many graduates go into tech, especially as brain-computer interfaces and AI advance.',
    isInterdisciplinary: true,
  },
];

// Interest-to-major mapping
const INTEREST_MAPPINGS = [
  { interest: 'I like building and fixing things', majors: ['mecheng', 'civil', 'eleceng'] },
  { interest: 'I\'m fascinated by how the brain works', majors: ['neuro', 'psych', 'cogsci'] },
  { interest: 'I want to write code and build software', majors: ['cs', 'datasci', 'softeng'] },
  { interest: 'I care about the environment', majors: ['envsci', 'chemsci', 'civil'] },
  { interest: 'I want to help people stay healthy', majors: ['biomedeng', 'neuro', 'biology'] },
  { interest: 'I love solving puzzles and proofs', majors: ['math', 'physics', 'cs'] },
  { interest: 'I want to work with data', majors: ['datasci', 'stats', 'cs'] },
  { interest: 'I\'m interested in space', majors: ['aeroeng', 'physics', 'astro'] },
];

// Main Component
const MajorExplorerPage: React.FC = () => {
  const [view, setView] = useState<'browse' | 'interest' | 'detail' | 'compare'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [savedMajors, setSavedMajors] = useState<string[]>([]);
  const [compareMajors, setCompareMajors] = useState<Major[]>([]);

  const toggleSaveMajor = (id: string) => {
    setSavedMajors(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const filteredMajors = selectedCategory
    ? MAJORS.filter(m => m.category === selectedCategory)
    : MAJORS;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-violet-400">Major Explorer</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
                <span>🎓</span>
                <span>College Discovery</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Major <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Explorer</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Discover what STEM majors are really like. Explore careers, hear from real
                students and professionals, and find what fits you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* View Toggle */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[
                { id: 'browse', label: 'Browse by Category', icon: '📚' },
                { id: 'interest', label: 'By Interest', icon: '💡' },
                { id: 'compare', label: 'Compare', icon: '⚖️' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setView(v.id as typeof view); setSelectedMajor(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    view === v.id
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{v.icon}</span>
                  {v.label}
                </button>
              ))}
            </div>
            {savedMajors.length > 0 && (
              <div className="ml-auto text-sm text-gray-400">
                {savedMajors.length} major{savedMajors.length !== 1 ? 's' : ''} saved
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'browse' && !selectedMajor && (
            <BrowseView
              categories={CATEGORIES}
              majors={filteredMajors}
              selectedCategory={selectedCategory}
              savedMajors={savedMajors}
              onSelectCategory={setSelectedCategory}
              onSelectMajor={setSelectedMajor}
              onToggleSave={toggleSaveMajor}
            />
          )}

          {view === 'interest' && !selectedMajor && (
            <InterestView
              mappings={INTEREST_MAPPINGS}
              majors={MAJORS}
              onSelectMajor={setSelectedMajor}
            />
          )}

          {view === 'compare' && (
            <CompareView
              majors={MAJORS}
              savedMajors={savedMajors}
              compareMajors={compareMajors}
              onAddToCompare={(major) => setCompareMajors([...compareMajors, major])}
              onRemoveFromCompare={(id) => setCompareMajors(compareMajors.filter(m => m.id !== id))}
            />
          )}

          {selectedMajor && (
            <MajorDetail
              major={selectedMajor}
              isSaved={savedMajors.includes(selectedMajor.id)}
              onBack={() => setSelectedMajor(null)}
              onToggleSave={() => toggleSaveMajor(selectedMajor.id)}
              onCompare={() => {
                setCompareMajors([...compareMajors, selectedMajor]);
                setView('compare');
                setSelectedMajor(null);
              }}
            />
          )}
        </div>
      </section>

      {/* Disclaimer */}
      {!selectedMajor && (
        <section className="py-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500">
              Career paths are not linear or predetermined. Many successful professionals
              work in fields different from their major. Use this as exploration, not limitation.
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// ===========================================
// Browse View
// ===========================================
const BrowseView: React.FC<{
  categories: typeof CATEGORIES;
  majors: Major[];
  selectedCategory: string | null;
  savedMajors: string[];
  onSelectCategory: (id: string | null) => void;
  onSelectMajor: (major: Major) => void;
  onToggleSave: (id: string) => void;
}> = ({ categories, majors, selectedCategory, savedMajors, onSelectCategory, onSelectMajor, onToggleSave }) => {
  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              !selectedCategory
                ? 'bg-violet-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Majors
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Major Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {majors.map((major) => (
          <MajorCard
            key={major.id}
            major={major}
            isSaved={savedMajors.includes(major.id)}
            onSelect={() => onSelectMajor(major)}
            onToggleSave={() => onToggleSave(major.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ===========================================
// Major Card
// ===========================================
const MajorCard: React.FC<{
  major: Major;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
}> = ({ major, isSaved, onSelect, onToggleSave }) => {
  const category = CATEGORIES.find(c => c.id === major.category);

  return (
    <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5 hover:border-violet-500/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{category?.icon}</span>
            <button
              onClick={onSelect}
              className="font-semibold text-white hover:text-violet-400 transition-colors"
            >
              {major.name}
            </button>
          </div>
          {major.isInterdisciplinary && (
            <span className="px-2 py-0.5 bg-fuchsia-500/20 text-fuchsia-400 rounded text-xs">
              Interdisciplinary
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          className={`p-2 rounded-lg transition-all ${
            isSaved
              ? 'bg-violet-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{major.description}</p>

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">Top Careers</div>
        <div className="flex flex-wrap gap-1">
          {major.typicalCareers.slice(0, 2).map((career, i) => (
            <span key={i} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
              {career.title}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onSelect}
        className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
      >
        Learn more →
      </button>
    </div>
  );
};

// ===========================================
// Interest View
// ===========================================
const InterestView: React.FC<{
  mappings: typeof INTEREST_MAPPINGS;
  majors: Major[];
  onSelectMajor: (major: Major) => void;
}> = ({ mappings, majors, onSelectMajor }) => {
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const suggestedMajorIds = selectedInterest
    ? mappings.find(m => m.interest === selectedInterest)?.majors || []
    : [];

  const suggestedMajors = majors.filter(m => suggestedMajorIds.includes(m.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What interests you?</h2>
        <p className="text-gray-400">Select what resonates with you, and we'll suggest relevant majors.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {mappings.map((mapping) => (
          <button
            key={mapping.interest}
            onClick={() => setSelectedInterest(
              selectedInterest === mapping.interest ? null : mapping.interest
            )}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedInterest === mapping.interest
                ? 'border-violet-500 bg-violet-500/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-white">{mapping.interest}</span>
          </button>
        ))}
      </div>

      {selectedInterest && suggestedMajors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            Majors that might be a good fit:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestedMajors.map((major) => (
              <button
                key={major.id}
                onClick={() => onSelectMajor(major)}
                className="p-4 bg-gray-900/50 border border-white/5 rounded-xl text-left hover:border-violet-500/30 transition-all"
              >
                <div className="font-medium text-white mb-1">{major.name}</div>
                <p className="text-sm text-gray-400 line-clamp-2">{major.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// Major Detail
// ===========================================
const MajorDetail: React.FC<{
  major: Major;
  isSaved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onCompare: () => void;
}> = ({ major, isSaved, onBack, onToggleSave, onCompare }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'dayinlife'>('overview');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={onToggleSave}
            className={`px-4 py-2 rounded-lg transition-all ${
              isSaved
                ? 'bg-violet-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {isSaved ? '♥ Saved' : '♡ Save'}
          </button>
          <button
            onClick={onCompare}
            className="px-4 py-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg transition-all"
          >
            Compare
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{major.name}</h1>
        <p className="text-xl text-gray-400">{major.description}</p>
      </div>

      {/* Myth Busting */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-violet-400 text-xl">💡</span>
          <div>
            <div className="font-medium text-white mb-1">Common Misconception</div>
            <p className="text-gray-300">{major.mythBusting}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'careers', label: 'Careers' },
          { id: 'dayinlife', label: 'Day in the Life' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <h3 className="font-medium text-white mb-4">What You'll Learn</h3>
            <ul className="space-y-2">
              {major.whatYouLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-violet-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <h3 className="font-medium text-white mb-4">Skills You'll Build</h3>
            <div className="flex flex-wrap gap-2">
              {major.skillsBuilt.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <h3 className="font-medium text-white mb-4">Related Majors</h3>
            <div className="flex flex-wrap gap-2">
              {major.relatedMajors.map((rel, i) => (
                <span key={i} className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-sm">
                  {rel}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'careers' && (
        <div className="space-y-4">
          {major.typicalCareers.map((career, i) => (
            <div key={i} className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{career.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  career.growthOutlook === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                  career.growthOutlook === 'moderate' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {career.growthOutlook} growth
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{career.description}</p>
              <div className="text-sm text-gray-500">
                Typical salary range: <span className="text-gray-300">{career.salaryRange}</span>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500 text-center">
            Salary ranges vary by location, experience, and company. These are estimates.
          </div>
        </div>
      )}

      {activeTab === 'dayinlife' && (
        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <span>🎓</span>
              Student Perspective
            </h3>
            <blockquote className="text-gray-300 italic">
              "{major.dayInTheLife.studentPerspective}"
            </blockquote>
          </div>

          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <span>💼</span>
              Professional Perspective
            </h3>
            <blockquote className="text-gray-300 italic">
              "{major.dayInTheLife.professionalPerspective}"
            </blockquote>
          </div>

          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
            <h3 className="font-medium text-white mb-4 flex items-center gap-2">
              <span>⏰</span>
              A Typical Day
            </h3>
            <div className="space-y-2">
              {major.dayInTheLife.typicalDay.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-violet-400 font-mono">{item.split(' - ')[0]}</span>
                  <span className="text-gray-300">{item.split(' - ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// Compare View
// ===========================================
const CompareView: React.FC<{
  majors: Major[];
  savedMajors: string[];
  compareMajors: Major[];
  onAddToCompare: (major: Major) => void;
  onRemoveFromCompare: (id: string) => void;
}> = ({ majors, savedMajors, compareMajors, onAddToCompare, onRemoveFromCompare }) => {
  const availableToAdd = majors.filter(m => !compareMajors.find(cm => cm.id === m.id));

  if (compareMajors.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-3xl mx-auto mb-6">
          ⚖️
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Compare Majors</h2>
        <p className="text-gray-400 mb-8">
          Select majors to compare side-by-side. See the differences in what you'll
          learn, career paths, and day-to-day work.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {(savedMajors.length > 0 ? majors.filter(m => savedMajors.includes(m.id)) : majors.slice(0, 4)).map((major) => (
            <button
              key={major.id}
              onClick={() => onAddToCompare(major)}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-all"
            >
              + {major.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add More */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Comparing {compareMajors.length} Majors</h2>
        {compareMajors.length < 3 && availableToAdd.length > 0 && (
          <select
            onChange={(e) => {
              const major = majors.find(m => m.id === e.target.value);
              if (major) onAddToCompare(major);
              e.target.value = '';
            }}
            className="px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-gray-300"
          >
            <option value="">+ Add major</option>
            {availableToAdd.map((major) => (
              <option key={major.id} value={major.id}>{major.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left text-gray-400 font-medium">Category</th>
              {compareMajors.map((major) => (
                <th key={major.id} className="p-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{major.name}</span>
                    <button
                      onClick={() => onRemoveFromCompare(major.id)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">Description</td>
              {compareMajors.map((major) => (
                <td key={major.id} className="p-4 text-sm text-gray-300">{major.description}</td>
              ))}
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">Key Skills</td>
              {compareMajors.map((major) => (
                <td key={major.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {major.skillsBuilt.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">Top Careers</td>
              {compareMajors.map((major) => (
                <td key={major.id} className="p-4">
                  {major.typicalCareers.slice(0, 2).map((career, i) => (
                    <div key={i} className="text-sm text-gray-300 mb-1">{career.title}</div>
                  ))}
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">Interdisciplinary</td>
              {compareMajors.map((major) => (
                <td key={major.id} className="p-4 text-sm">
                  {major.isInterdisciplinary ? (
                    <span className="text-emerald-400">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MajorExplorerPage;
