// ===========================================
// Research Experience Writer Page
// ===========================================
// Helps students translate technical research work into
// compelling personal narratives for college applications
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Types
interface ResearchProject {
  id: string;
  title: string;
  lab: string;
  institution: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  step: number;
  description?: string;
  role?: string;
  reflections?: ReflectionResponses;
  outputs?: ProjectOutputs;
}

interface ReflectionResponses {
  plainLanguage?: string;
  specificRole?: string;
  tediousPart?: string;
  unexpected?: string;
  learned?: string;
  mentorLesson?: string;
  wouldChange?: string;
}

interface ProjectOutputs {
  activitiesList?: string;
  essayVersion?: string;
  interviewPoints?: string[];
}

// Wizard Steps
const STEPS = [
  { id: 1, title: 'Describe', subtitle: 'Tell us about the research' },
  { id: 2, title: 'Reflect', subtitle: 'Find the personal story' },
  { id: 3, title: 'Translate', subtitle: 'Review your outputs' },
  { id: 4, title: 'Polish', subtitle: 'Edit and finalize' },
];

// Sample Projects
const SAMPLE_PROJECTS: ResearchProject[] = [
  {
    id: '1',
    title: 'CRISPR Efficiency in T-Cell Modification',
    lab: 'Chen Lab',
    institution: 'Stanford School of Medicine',
    startDate: '2025-06',
    endDate: 'present',
    status: 'active',
    step: 3,
  },
];

// Main Component
const ResearchWriterPage: React.FC = () => {
  const [projects, setProjects] = useState<ResearchProject[]>(SAMPLE_PROJECTS);
  const [activeProject, setActiveProject] = useState<ResearchProject | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

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
            <span className="text-violet-400">Research Experience Writer</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
                <span>🔬</span>
                <span>Application Support</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Research Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Writer</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Transform your technical research into compelling stories. We help you find
                the human narrative in your lab work.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-6 py-3 bg-violet-500 hover:bg-violet-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>+</span>
                Add Research Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!activeProject ? (
            <ProjectDashboard
              projects={projects}
              onSelectProject={setActiveProject}
              onNewProject={() => setShowNewProjectModal(true)}
            />
          ) : (
            <ProjectWizard
              project={activeProject}
              onBack={() => setActiveProject(null)}
              onUpdate={(updated) => {
                setProjects(projects.map(p => p.id === updated.id ? updated : p));
                setActiveProject(updated);
              }}
            />
          )}
        </div>
      </section>

      {/* Why This Matters Section */}
      {!activeProject && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Research Narratives <span className="text-violet-400">Matter</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Admissions officers aren't scientists. They need to understand why your
                research matters—and what it says about you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: '🔬',
                  title: 'Technical → Personal',
                  description: 'Transform methodology descriptions into stories about curiosity, persistence, and discovery.',
                },
                {
                  icon: '📝',
                  title: 'Multiple Formats',
                  description: 'Generate activities list entries, essay versions, and interview talking points from the same source.',
                },
                {
                  icon: '✅',
                  title: 'Honest & Accurate',
                  description: 'We help you describe your actual contribution—neither underselling nor overclaiming.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gray-900/50 border border-white/5 hover:border-violet-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-2xl mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={(project) => {
            setProjects([...projects, project]);
            setActiveProject(project);
            setShowNewProjectModal(false);
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// Project Dashboard
// ===========================================
const ProjectDashboard: React.FC<{
  projects: ResearchProject[];
  onSelectProject: (project: ResearchProject) => void;
  onNewProject: () => void;
}> = ({ projects, onSelectProject, onNewProject }) => {
  return (
    <div className="space-y-8">
      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">My Research Projects</h2>
          <button
            onClick={onNewProject}
            className="px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <span>+</span>
            Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <EmptyState onNewProject={onNewProject} />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project)} />
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl p-6 border border-violet-500/20">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          What Makes Research Descriptions Stand Out
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-violet-400">✓</span>
              <p className="text-gray-300"><strong>Specific details</strong> over generic descriptions</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400">✓</span>
              <p className="text-gray-300"><strong>What you learned</strong>, not just what you did</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400">✓</span>
              <p className="text-gray-300"><strong>Setbacks and pivots</strong> show intellectual maturity</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <p className="text-gray-300">Jargon that only experts understand</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <p className="text-gray-300">Overclaiming your role or contributions</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <p className="text-gray-300">Just listing techniques without meaning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Project Card
// ===========================================
const ProjectCard: React.FC<{
  project: ResearchProject;
  onClick: () => void;
}> = ({ project, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-xl bg-gray-900/50 border border-white/5 hover:border-violet-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              project.status === 'active'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {project.status === 'active' ? 'Ongoing' : 'Completed'}
            </span>
          </div>
          <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500">
            {project.lab} • {project.institution}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div className={`flex-1 h-1 rounded-full ${
                index < project.step
                  ? 'bg-violet-500'
                  : index === project.step
                  ? 'bg-violet-500/50'
                  : 'bg-gray-700'
              }`} />
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          Step {project.step} of 4: {STEPS[project.step - 1]?.title || 'Complete'}
        </div>
      </div>

      <div className="text-sm text-gray-400">
        {project.startDate} – {project.endDate === 'present' ? 'Present' : project.endDate}
      </div>
    </button>
  );
};

// ===========================================
// Empty State
// ===========================================
const EmptyState: React.FC<{
  onNewProject: () => void;
}> = ({ onNewProject }) => {
  return (
    <div className="text-center py-16 px-4 rounded-2xl bg-gray-900/50 border border-white/5">
      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-3xl mx-auto mb-6">
        🔬
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Tell the story of your research
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Research is messy, surprising, and often frustrating. That's exactly what makes
        it worth writing about. Let's find the story in your science.
      </p>
      <button
        onClick={onNewProject}
        className="px-6 py-3 bg-violet-500 hover:bg-violet-400 text-white font-semibold rounded-xl transition-all"
      >
        Add Your First Project
      </button>
    </div>
  );
};

// ===========================================
// Project Wizard
// ===========================================
const ProjectWizard: React.FC<{
  project: ResearchProject;
  onBack: () => void;
  onUpdate: (project: ResearchProject) => void;
}> = ({ project, onBack, onUpdate }) => {
  const [currentStep, setCurrentStep] = useState(project.step);

  const goToNextStep = () => {
    const nextStep = Math.min(currentStep + 1, 4);
    setCurrentStep(nextStep);
    onUpdate({ ...project, step: nextStep });
  };

  const goToPrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Projects</span>
        </button>
        <div className="text-sm text-gray-400">
          {project.title}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 ${
                  step.id === currentStep
                    ? 'text-violet-400'
                    : step.id < currentStep
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep
                    ? 'bg-violet-500 text-white'
                    : step.id < currentStep
                    ? 'bg-violet-500/30 text-violet-300'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.subtitle}</div>
                </div>
              </button>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  step.id < currentStep ? 'bg-violet-500' : 'bg-gray-800'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-8">
        {currentStep === 1 && (
          <DescribeStep project={project} onUpdate={onUpdate} />
        )}
        {currentStep === 2 && (
          <ReflectStep project={project} onUpdate={onUpdate} />
        )}
        {currentStep === 3 && (
          <TranslateStep project={project} onUpdate={onUpdate} />
        )}
        {currentStep === 4 && (
          <PolishStep project={project} onUpdate={onUpdate} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={goToNextStep}
          disabled={currentStep === 4}
          className="px-6 py-2 bg-violet-500 hover:bg-violet-400 text-white font-medium rounded-xl transition-all disabled:opacity-50"
        >
          {currentStep === 4 ? 'Complete' : 'Continue →'}
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Step 1: Describe
// ===========================================
const DescribeStep: React.FC<{
  project: ResearchProject;
  onUpdate: (project: ResearchProject) => void;
}> = ({ project, onUpdate }) => {
  const [plainLanguage, setPlainLanguage] = useState(project.reflections?.plainLanguage || '');
  const [specificRole, setSpecificRole] = useState(project.reflections?.specificRole || '');

  const handleSave = () => {
    onUpdate({
      ...project,
      reflections: {
        ...project.reflections,
        plainLanguage,
        specificRole,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Describe Your Research</h2>
        <p className="text-gray-400">
          Let's start by capturing the basics. Don't worry about perfect language—we'll refine it later.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            In plain language, what was the research trying to figure out?
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Imagine explaining to a smart friend who isn't in your field. Starting with "We were trying to find out..." often helps.
          </p>
          <textarea
            value={plainLanguage}
            onChange={(e) => setPlainLanguage(e.target.value)}
            onBlur={handleSave}
            placeholder="We were trying to find out why..."
            className="w-full h-32 bg-gray-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What was YOUR specific role? What did YOU do?
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Be precise about your contribution. Did you design experiments? Run protocols? Analyze data? Train others?
          </p>
          <textarea
            value={specificRole}
            onChange={(e) => setSpecificRole(e.target.value)}
            onBlur={handleSave}
            placeholder="I was responsible for..."
            className="w-full h-32 bg-gray-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
        <div className="flex items-start gap-3">
          <span className="text-violet-400">💡</span>
          <div className="text-sm text-gray-300">
            <strong className="text-white">Honesty matters.</strong> It's completely okay—and actually impressive—to describe
            what you learned from expert guidance. Admissions officers value honest descriptions of your actual experience level.
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Step 2: Reflect
// ===========================================
const ReflectStep: React.FC<{
  project: ResearchProject;
  onUpdate: (project: ResearchProject) => void;
}> = ({ project, onUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({
    tediousPart: project.reflections?.tediousPart || '',
    unexpected: project.reflections?.unexpected || '',
    learned: project.reflections?.learned || '',
    mentorLesson: project.reflections?.mentorLesson || '',
    wouldChange: project.reflections?.wouldChange || '',
  });

  const questions = [
    {
      key: 'tediousPart',
      question: 'What was the most tedious part of your work?',
      hint: 'Admissions officers know research involves tedium. How you handled it reveals character.',
    },
    {
      key: 'unexpected',
      question: 'Describe a moment when something didn\'t go as expected.',
      hint: 'Setbacks are often the most interesting parts of research stories.',
    },
    {
      key: 'learned',
      question: 'What\'s one thing you understand now that you didn\'t before this experience?',
      hint: 'This is about intellectual growth, not just technical skills.',
    },
    {
      key: 'mentorLesson',
      question: 'What did your mentor or PI teach you that wasn\'t about science?',
      hint: 'Research mentorship often includes lessons about thinking, persistence, or collaboration.',
    },
    {
      key: 'wouldChange',
      question: 'If you could change one thing about the project, what would it be?',
      hint: 'This shows critical thinking and genuine engagement with the work.',
    },
  ];

  const handleResponseChange = (key: string, value: string) => {
    const updated = { ...responses, [key]: value };
    setResponses(updated);
    onUpdate({
      ...project,
      reflections: {
        ...project.reflections,
        ...updated,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Find the Personal Story</h2>
        <p className="text-gray-400">
          These questions help us find the story in your research. There are no wrong answers.
        </p>
      </div>

      {/* Question Navigator */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {questions.map((q, index) => (
          <button
            key={q.key}
            onClick={() => setCurrentQuestion(index)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
              index === currentQuestion
                ? 'bg-violet-500 text-white'
                : responses[q.key as keyof typeof responses]
                ? 'bg-violet-500/30 text-violet-300'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {index + 1}. {q.key.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">
            {questions[currentQuestion].question}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {questions[currentQuestion].hint}
          </p>
          <textarea
            value={responses[questions[currentQuestion].key as keyof typeof responses]}
            onChange={(e) => handleResponseChange(questions[currentQuestion].key, e.target.value)}
            placeholder="Take your time. Write what comes to mind..."
            className="w-full h-40 bg-gray-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
          />
        </div>
      </div>

      {/* Question Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous Question
        </button>
        <div className="text-sm text-gray-500">
          {Object.values(responses).filter(Boolean).length} of {questions.length} answered
        </div>
        <button
          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === questions.length - 1}
          className="text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Question →
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Step 3: Translate (Output Generation)
// ===========================================
const TranslateStep: React.FC<{
  project: ResearchProject;
  onUpdate: (project: ResearchProject) => void;
}> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'essay' | 'interview'>('activities');
  const [copied, setCopied] = useState<string | null>(null);

  // Generate outputs based on reflections
  const generateActivitiesList = () => {
    const parts = [];
    if (project.reflections?.plainLanguage) {
      parts.push(project.reflections.plainLanguage.split('.')[0]);
    }
    if (project.reflections?.specificRole) {
      parts.push(project.reflections.specificRole.split('.')[0]);
    }
    return parts.join('; ') + '.';
  };

  const generateEssayVersion = () => {
    if (project.reflections?.tediousPart) {
      return `The ${project.reflections.tediousPart.split('.')[0].toLowerCase()} taught me something unexpected about research. ${
        project.reflections?.unexpected || ''
      } Looking back, ${project.reflections?.learned || 'I understand now that the process matters as much as the results.'}`;
    }
    return 'Complete the reflection questions to generate your essay version.';
  };

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Your Research Story - Ready to Use</h2>
        <p className="text-gray-400">
          Based on your responses, we've generated different versions of your research experience.
          Use the format that fits your application.
        </p>
      </div>

      {/* Format Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'activities', label: 'Activities List', charLimit: '150 chars' },
          { id: 'essay', label: 'Essay Version', charLimit: 'Expandable' },
          { id: 'interview', label: 'Interview Prep', charLimit: 'Talking points' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-500/20 text-violet-400 border-b-2 border-violet-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            <span className="text-xs text-gray-500 ml-2">({tab.charLimit})</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'activities' && (
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Activities List Version</h3>
              <button
                onClick={() => handleCopy(generateActivitiesList(), 'activities')}
                className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded text-sm hover:bg-violet-500/30 transition-all"
              >
                {copied === 'activities' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {generateActivitiesList()}
            </p>
            <div className="text-xs text-gray-500 mt-3">
              {generateActivitiesList().length} / 150 characters
            </div>
          </div>
        )}

        {activeTab === 'essay' && (
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Essay Version</h3>
              <button
                onClick={() => handleCopy(generateEssayVersion(), 'essay')}
                className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded text-sm hover:bg-violet-500/30 transition-all"
              >
                {copied === 'essay' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {generateEssayVersion()}
            </p>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
            <h3 className="font-medium text-white mb-4">Interview Talking Points</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-violet-400 mt-1">•</span>
                <div>
                  <strong className="text-white">The research question:</strong>
                  <p className="text-gray-400 text-sm">{project.reflections?.plainLanguage || 'Complete Step 1 to generate'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-400 mt-1">•</span>
                <div>
                  <strong className="text-white">Your specific contribution:</strong>
                  <p className="text-gray-400 text-sm">{project.reflections?.specificRole || 'Complete Step 1 to generate'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-400 mt-1">•</span>
                <div>
                  <strong className="text-white">A challenge you overcame:</strong>
                  <p className="text-gray-400 text-sm">{project.reflections?.unexpected || 'Complete Step 2 to generate'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-400 mt-1">•</span>
                <div>
                  <strong className="text-white">What you learned:</strong>
                  <p className="text-gray-400 text-sm">{project.reflections?.learned || 'Complete Step 2 to generate'}</p>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <span className="text-amber-400">⚠️</span>
          <div className="text-sm text-gray-300">
            <strong className="text-white">Remember:</strong> These are starting points, not final drafts.
            Edit to make them fully yours. Show your PI/mentor your Activities List description to verify accuracy.
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Step 4: Polish
// ===========================================
const PolishStep: React.FC<{
  project: ResearchProject;
  onUpdate: (project: ResearchProject) => void;
}> = ({ project }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Review & Finalize</h2>
        <p className="text-gray-400">
          You've translated your research into multiple formats. Here's a summary of what you've created.
        </p>
      </div>

      {/* Completion Checklist */}
      <div className="space-y-4">
        <h3 className="font-medium text-white">Completion Checklist</h3>
        <div className="space-y-2">
          {[
            { label: 'Research description in plain language', done: !!project.reflections?.plainLanguage },
            { label: 'Your specific role documented', done: !!project.reflections?.specificRole },
            { label: 'Reflection questions answered', done: !!(project.reflections?.tediousPart || project.reflections?.unexpected) },
            { label: 'Activities list version reviewed', done: true },
            { label: 'Verified accuracy with mentor', done: false },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                item.done ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-500'
              }`}>
                {item.done ? '✓' : index + 1}
              </div>
              <span className={item.done ? 'text-gray-300' : 'text-gray-500'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-left hover:bg-violet-500/20 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📄</span>
            <h4 className="font-medium text-white">Download PDF</h4>
          </div>
          <p className="text-sm text-gray-400">Export all formats in a single document</p>
        </button>
        <button className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-left hover:bg-violet-500/20 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📧</span>
            <h4 className="font-medium text-white">Share with Counselor</h4>
          </div>
          <p className="text-sm text-gray-400">Send a copy for review and feedback</p>
        </button>
      </div>

      {/* Celebration */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          You've told your research story
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          The technical work was impressive. But the reflection and growth you've shown here?
          That's what admissions officers will remember.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// New Project Modal
// ===========================================
const NewProjectModal: React.FC<{
  onClose: () => void;
  onCreate: (project: ResearchProject) => void;
}> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [lab, setLab] = useState('');
  const [institution, setInstitution] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOngoing, setIsOngoing] = useState(false);

  const handleCreate = () => {
    const newProject: ResearchProject = {
      id: Date.now().toString(),
      title: title || 'Untitled Research Project',
      lab,
      institution,
      startDate,
      endDate: isOngoing ? 'present' : endDate,
      status: isOngoing ? 'active' : 'completed',
      step: 1,
    };
    onCreate(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add Research Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Research Title / Topic</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., CRISPR efficiency in T-cell modification"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Lab / Research Group</label>
            <input
              type="text"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              placeholder="e.g., Dr. Chen's Lab"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Institution</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g., Stanford School of Medicine"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Start Date</label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">End Date</label>
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isOngoing}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isOngoing}
              onChange={(e) => setIsOngoing(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-500 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-300">This research is still ongoing</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-violet-500 hover:bg-violet-400 text-white font-medium rounded-xl transition-all"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchWriterPage;
