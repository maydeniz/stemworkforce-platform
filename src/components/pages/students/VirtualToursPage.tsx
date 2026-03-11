// ===========================================
// Virtual Campus Tours Page
// ===========================================
// Curated virtual exploration experiences
// Focus on authentic student perspectives, not marketing
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

// Types
interface VirtualTour {
  id: string;
  schoolName: string;
  location: string;
  thumbnailUrl: string;
  duration: number;
  areas: TourArea[];
  studentNarrators: Narrator[];
  stemHighlights: string[];
  visitQuestions: string[];
  lastUpdated: string;
}

interface TourArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number;
}

interface Narrator {
  name: string;
  major: string;
  year: string;
  perspective: string;
}

// Sample tour data
const SAMPLE_TOURS: VirtualTour[] = [
  {
    id: '1',
    schoolName: 'MIT',
    location: 'Cambridge, MA',
    thumbnailUrl: '/tours/mit.jpg',
    duration: 25,
    areas: [
      { id: 'stem', name: 'STEM Facilities', description: 'Labs, maker spaces, and research centers', icon: '🔬', duration: 8 },
      { id: 'student-life', name: 'Student Life', description: 'Dorms, dining, and common spaces', icon: '🏠', duration: 6 },
      { id: 'academics', name: 'Academic Buildings', description: 'Classrooms, libraries, and study spaces', icon: '📚', duration: 5 },
      { id: 'community', name: 'Campus Community', description: 'Clubs, events, and social spaces', icon: '👥', duration: 6 },
    ],
    studentNarrators: [
      { name: 'Marcus', major: 'Computer Science', year: 'Junior', perspective: 'First-gen student from rural Georgia' },
      { name: 'Priya', major: 'Biological Engineering', year: 'Senior', perspective: 'International student from India' },
      { name: 'Alex', major: 'Mechanical Engineering', year: 'Sophomore', perspective: 'Transfer from community college' },
    ],
    stemHighlights: ['MIT Media Lab', 'Maker Lodge', 'CSAIL Research Labs', 'Nuclear Reactor'],
    visitQuestions: [
      'What does collaboration look like in intro STEM courses?',
      'How accessible are research opportunities for first-years?',
      'What support exists for students who struggle academically?',
    ],
    lastUpdated: '2025-09',
  },
  {
    id: '2',
    schoolName: 'Georgia Tech',
    location: 'Atlanta, GA',
    thumbnailUrl: '/tours/gatech.jpg',
    duration: 22,
    areas: [
      { id: 'stem', name: 'Engineering Complex', description: 'State-of-the-art engineering facilities', icon: '⚙️', duration: 7 },
      { id: 'student-life', name: 'Campus Living', description: 'Residence halls and dining options', icon: '🏠', duration: 5 },
      { id: 'atlanta', name: 'Atlanta Connection', description: 'How the city enhances campus life', icon: '🌆', duration: 5 },
      { id: 'research', name: 'Research Centers', description: 'Undergraduate research opportunities', icon: '🔬', duration: 5 },
    ],
    studentNarrators: [
      { name: 'Jordan', major: 'Industrial Engineering', year: 'Senior', perspective: 'Atlanta native, first-gen' },
      { name: 'Wei', major: 'Computer Science', year: 'Junior', perspective: 'International student from China' },
    ],
    stemHighlights: ['GTRI Research Institute', 'Invention Studio', 'Carbon-Neutral Energy Lab'],
    visitQuestions: [
      'How competitive vs collaborative is the engineering culture?',
      'What opportunities exist for internships in Atlanta?',
      'How do Greek life and engineering studies balance?',
    ],
    lastUpdated: '2025-08',
  },
  {
    id: '3',
    schoolName: 'Harvey Mudd College',
    location: 'Claremont, CA',
    thumbnailUrl: '/tours/hmc.jpg',
    duration: 18,
    areas: [
      { id: 'campus', name: 'Intimate Campus', description: 'The whole campus in one walkable area', icon: '🌴', duration: 5 },
      { id: 'labs', name: 'Teaching Labs', description: 'Where you\'ll spend most of your time', icon: '🧪', duration: 5 },
      { id: '5c', name: 'Claremont Colleges', description: 'Accessing resources across 5 colleges', icon: '🤝', duration: 4 },
      { id: 'dorms', name: 'Dorm Life', description: 'Living in a tight-knit community', icon: '🛏️', duration: 4 },
    ],
    studentNarrators: [
      { name: 'Sam', major: 'Engineering', year: 'Senior', perspective: 'Queer student from the Midwest' },
      { name: 'Olivia', major: 'Math/CS', year: 'Junior', perspective: 'First-gen, low-income student' },
    ],
    stemHighlights: ['Machine Shop', 'Clinic Program', 'Makerspace', 'Joint Science Department'],
    visitQuestions: [
      'What\'s it really like being at a school of 900 students?',
      'How do students handle the Core curriculum workload?',
      'What resources at the other Claremont colleges do Mudders use?',
    ],
    lastUpdated: '2025-10',
  },
  {
    id: '4',
    schoolName: 'Purdue University',
    location: 'West Lafayette, IN',
    thumbnailUrl: '/tours/purdue.jpg',
    duration: 28,
    areas: [
      { id: 'engineering', name: 'Neil Armstrong Hall', description: 'Heart of engineering education', icon: '🚀', duration: 8 },
      { id: 'campus', name: 'Main Campus', description: 'Navigating a Big Ten campus', icon: '🏛️', duration: 7 },
      { id: 'traditions', name: 'Traditions', description: 'Boilermaker culture and community', icon: '🎉', duration: 5 },
      { id: 'living', name: 'Living-Learning', description: 'Engineering-specific housing options', icon: '🏠', duration: 8 },
    ],
    studentNarrators: [
      { name: 'Tyler', major: 'Aerospace Engineering', year: 'Senior', perspective: 'Indiana native, legacy student' },
      { name: 'Maria', major: 'Computer Science', year: 'Junior', perspective: 'First-gen Latina student' },
      { name: 'James', major: 'Mechanical Engineering', year: 'Sophomore', perspective: 'Out-of-state student from NYC' },
    ],
    stemHighlights: ['Zucrow Labs', 'Birck Nanotechnology Center', 'Purdue Polytechnic'],
    visitQuestions: [
      'How does the engineering learning community work?',
      'What\'s the balance between coursework and campus activities?',
      'How do out-of-state students build community?',
    ],
    lastUpdated: '2025-07',
  },
];

// Main Component
const VirtualToursPage: React.FC = () => {
  const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [savedTours, setSavedTours] = useState<string[]>([]);

  const toggleSaveTour = (id: string) => {
    setSavedTours(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-rose-400">Virtual Campus Tours</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-6">
                <span>🎥</span>
                <span>College Discovery</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Virtual Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Tours</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Explore campuses from anywhere. Hear from real students, see STEM facilities,
                and get an authentic feel for each school.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-rose-400">💡</span>
            <span>
              Virtual tours provide a preview but can't replace visiting in person.
              If possible, schedule a campus visit before making your final decision.
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!selectedTour ? (
            <TourBrowser
              tours={SAMPLE_TOURS}
              savedTours={savedTours}
              onSelectTour={setSelectedTour}
              onToggleSave={toggleSaveTour}
            />
          ) : (
            <TourExperience
              tour={selectedTour}
              activeArea={activeArea}
              isSaved={savedTours.includes(selectedTour.id)}
              onSelectArea={setActiveArea}
              onToggleSave={() => toggleSaveTour(selectedTour.id)}
              onBack={() => {
                setSelectedTour(null);
                setActiveArea(null);
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
};

// ===========================================
// Tour Browser
// ===========================================
const TourBrowser: React.FC<{
  tours: VirtualTour[];
  savedTours: string[];
  onSelectTour: (tour: VirtualTour) => void;
  onToggleSave: (id: string) => void;
}> = ({ tours, savedTours, onSelectTour, onToggleSave }) => {
  const [filter, setFilter] = useState<'all' | 'saved'>('all');

  const filteredTours = filter === 'saved'
    ? tours.filter(t => savedTours.includes(t.id))
    : tours;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Explore Campuses</h2>
          <p className="text-gray-400">
            Student-narrated tours featuring STEM facilities, campus life, and authentic perspectives.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Tours
          </button>
          <button
            onClick={() => setFilter('saved')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'saved'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Saved ({savedTours.length})
          </button>
        </div>
      </div>

      {/* What to Look For */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2">
          <span>👁️</span>
          What to Look For on Virtual Tours
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-rose-400 font-medium mb-1">STEM Spaces</div>
            <p className="text-gray-400">Labs, maker spaces, computing facilities</p>
          </div>
          <div>
            <div className="text-rose-400 font-medium mb-1">Student Energy</div>
            <p className="text-gray-400">How engaged do students seem?</p>
          </div>
          <div>
            <div className="text-rose-400 font-medium mb-1">Study Spaces</div>
            <p className="text-gray-400">Where will you actually work?</p>
          </div>
          <div>
            <div className="text-rose-400 font-medium mb-1">Community</div>
            <p className="text-gray-400">How do students interact?</p>
          </div>
        </div>
      </div>

      {/* Tour Cards */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="text-lg font-medium text-white mb-2">No saved tours yet</h3>
          <p className="text-gray-400">Save tours to easily find them later</p>
          <button
            onClick={() => setFilter('all')}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg"
          >
            Browse All Tours
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              isSaved={savedTours.includes(tour.id)}
              onSelect={() => onSelectTour(tour)}
              onToggleSave={() => onToggleSave(tour.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===========================================
// Tour Card
// ===========================================
const TourCard: React.FC<{
  tour: VirtualTour;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
}> = ({ tour, isSaved, onSelect, onToggleSave }) => {
  return (
    <div className="bg-gray-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-rose-500/30 transition-all group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">🏛️</div>
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-black/50 text-white hover:bg-rose-500'
            }`}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2 py-1 bg-black/50 text-white rounded text-xs">
            {tour.duration} min
          </span>
          <span className="px-2 py-1 bg-black/50 text-white rounded text-xs">
            {tour.studentNarrators.length} narrators
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-white mb-1 group-hover:text-rose-400 transition-colors">
          {tour.schoolName}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{tour.location}</p>

        {/* Areas */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tour.areas.slice(0, 3).map((area) => (
            <span key={area.id} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
              {area.icon} {area.name}
            </span>
          ))}
        </div>

        {/* STEM Highlights */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">STEM Highlights</div>
          <div className="flex flex-wrap gap-1">
            {tour.stemHighlights.slice(0, 2).map((highlight, i) => (
              <span key={i} className="px-2 py-1 bg-rose-500/10 text-rose-400 rounded text-xs">
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-white font-medium rounded-lg transition-all"
        >
          Start Tour →
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Tour Experience
// ===========================================
const TourExperience: React.FC<{
  tour: VirtualTour;
  activeArea: string | null;
  isSaved: boolean;
  onSelectArea: (id: string | null) => void;
  onToggleSave: () => void;
  onBack: () => void;
}> = ({ tour, activeArea, isSaved, onSelectArea, onToggleSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'tour' | 'narrators' | 'questions'>('tour');
  const { info, success } = useNotifications();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Tours</span>
        </button>
        <button
          onClick={onToggleSave}
          className={`px-4 py-2 rounded-lg transition-all ${
            isSaved
              ? 'bg-rose-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {isSaved ? '♥ Saved' : '♡ Save Tour'}
        </button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">{tour.schoolName}</h1>
        <p className="text-gray-400">{tour.location} • {tour.duration} minutes</p>
      </div>

      {/* Video Player Placeholder */}
      <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => info('Interactive virtual tours coming soon! Explore campus photos and student narratives below.')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); info('Interactive virtual tours coming soon! Explore campus photos and student narratives below.'); } }}
              className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-white text-3xl ml-1">▶</span>
            </div>
          </div>
          <p className="text-gray-400">Click to start the virtual tour</p>
        </div>

        {/* Area Navigation */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tour.areas.map((area) => (
              <button
                key={area.id}
                onClick={() => onSelectArea(area.id === activeArea ? null : area.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                  activeArea === area.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/50 text-white hover:bg-rose-500/50'
                }`}
              >
                {area.icon} {area.name} ({area.duration}m)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'tour', label: 'Tour Overview' },
          { id: 'narrators', label: 'Student Narrators' },
          { id: 'questions', label: 'Questions to Ask' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-rose-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'tour' && (
        <div className="space-y-6">
          {/* Areas Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {tour.areas.map((area) => (
              <div
                key={area.id}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  activeArea === area.id
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-white/5 bg-gray-900/50 hover:border-white/20'
                }`}
                onClick={() => onSelectArea(area.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{area.icon}</span>
                  <div>
                    <h3 className="font-medium text-white">{area.name}</h3>
                    <span className="text-xs text-gray-500">{area.duration} minutes</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{area.description}</p>
              </div>
            ))}
          </div>

          {/* STEM Highlights */}
          <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
            <h3 className="font-medium text-white mb-4 flex items-center gap-2">
              <span>🔬</span>
              STEM Facilities to Explore
            </h3>
            <div className="flex flex-wrap gap-2">
              {tour.stemHighlights.map((highlight, i) => (
                <span key={i} className="px-3 py-2 bg-rose-500/10 text-rose-400 rounded-lg text-sm">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'narrators' && (
        <div className="space-y-4">
          <p className="text-gray-400">
            Hear from students with different backgrounds and perspectives. Their authentic
            experiences help you understand what life is really like at {tour.schoolName}.
          </p>
          {tour.studentNarrators.map((narrator, i) => (
            <div key={i} className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-xl">
                  👤
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{narrator.name}</h3>
                  <p className="text-sm text-gray-400">
                    {narrator.major} • {narrator.year}
                  </p>
                  <p className="text-sm text-rose-400 mt-2">{narrator.perspective}</p>
                </div>
                <button
                  onClick={() => info(`${narrator.name}'s full story coming soon! Read their quote above for now.`)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-all"
                >
                  Hear Their Story
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-6">
          <p className="text-gray-400">
            These questions will help you dig deeper when you visit in person or connect
            with current students.
          </p>
          <div className="space-y-3">
            {tour.visitQuestions.map((question, i) => (
              <div
                key={i}
                className="p-4 bg-gray-900/50 border border-white/5 rounded-xl flex items-start gap-3"
              >
                <span className="text-rose-400 font-medium">{i + 1}.</span>
                <span className="text-gray-300">{question}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => info('Checklist download coming soon! Review the questions above before your campus visit.')}
            className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all"
          >
            📋 Download Questions as Checklist
          </button>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-white/5">
        <button
          onClick={() => success('School saved to your list!')}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white font-semibold rounded-xl transition-all"
        >
          Add to My List
        </button>
        <button
          onClick={() => info('Live virtual visit scheduling coming soon! Check the school\'s admissions page for current virtual events.')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Schedule Live Virtual Visit
        </button>
        <button
          onClick={() => info('Student connections coming soon! Visit the school\'s admissions page to find student ambassador programs.')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Connect with Current Students
        </button>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-gray-500">
        Tour last updated: {tour.lastUpdated}
      </div>
    </div>
  );
};

export default VirtualToursPage;
