// ===========================================
// CHALLENGE DETAIL PAGE
// View full challenge details, register, submit
// ===========================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Clock,
  ChevronRight,
  ArrowLeft,
  Award,
  FileText,
  Link as LinkIcon,
  Download,
  ExternalLink,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Share2,
  CheckCircle,
  AlertCircle,
  Target,
  Briefcase,
  Slack,
  ChevronDown,
  ChevronUp,
  Play,
  Send,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { challengesApi } from '@/services/challengesApi';
import { Challenge, ChallengePhase, ChallengeAward, ChallengeResource, ChallengeComment, ChallengeSolver } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function formatPrize(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    open: 'bg-green-500/20 text-green-400 border-green-500/50',
    evaluating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    completed: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

// Timeline Phase Component
interface PhaseTimelineProps {
  phases: ChallengePhase[];
}

const PhaseTimeline: React.FC<PhaseTimelineProps> = ({ phases }) => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />

      {phases.map((phase, index) => {
        const isActive = phase.status === 'active';
        const isCompleted = phase.status === 'completed';

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-16 pb-8 last:pb-0"
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                isActive
                  ? 'bg-green-500 border-green-500'
                  : isCompleted
                  ? 'bg-purple-500 border-purple-500'
                  : 'bg-gray-800 border-gray-600'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
              )}
            </div>

            {/* Phase content */}
            <div
              className={`p-4 rounded-lg border ${
                isActive
                  ? 'bg-green-500/10 border-green-500/50'
                  : isCompleted
                  ? 'bg-purple-500/10 border-purple-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold ${isActive ? 'text-green-400' : 'text-white'}`}>
                  {phase.name}
                </h4>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive
                      ? 'bg-green-500/20 text-green-400'
                      : isCompleted
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{phase.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateShort(phase.startDate)} - {formatDateShort(phase.endDate)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Awards Section Component
interface AwardsSectionProps {
  awards: ChallengeAward[];
}

const AwardsSection: React.FC<AwardsSectionProps> = ({ awards }) => {
  const placeColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
  const placeBgs = ['bg-yellow-500/20', 'bg-gray-500/20', 'bg-amber-500/20'];

  return (
    <div className="space-y-4">
      {awards.map((award, index) => (
        <motion.div
          key={award.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-4 p-4 rounded-lg border border-gray-800 ${
            index < 3 ? placeBgs[index] : 'bg-gray-800/30'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              index < 3 ? placeBgs[index] : 'bg-gray-700'
            }`}
          >
            {index < 3 ? (
              <Trophy className={`w-6 h-6 ${placeColors[index]}`} />
            ) : (
              <Award className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold ${index < 3 ? placeColors[index] : 'text-white'}`}>
                {award.name}
              </h4>
              <span className="text-xl font-bold text-green-400">
                {formatPrize(award.cashAmount ?? award.prizeAmount)}
              </span>
            </div>
            {award.description && (
              <p className="text-sm text-gray-400">{award.description}</p>
            )}
            {award.nonCashBenefits && award.nonCashBenefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {award.nonCashBenefits.map((benefit, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Resources Section Component
interface ResourcesSectionProps {
  resources: ChallengeResource[];
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources }) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'dataset':
        return Download;
      case 'api':
        return LinkIcon;
      case 'video':
        return Play;
      case 'link':
      default:
        return ExternalLink;
    }
  };

  return (
    <div className="space-y-3">
      {resources.map((resource, index) => {
        const Icon = getResourceIcon(resource.type);
        return (
          <motion.a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">{resource.title}</h4>
              {resource.description && (
                <p className="text-sm text-gray-500 truncate">{resource.description}</p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
          </motion.a>
        );
      })}
    </div>
  );
};

// Comments Section Component
interface CommentsSectionProps {
  challengeId: string;
  comments: ChallengeComment[];
  onAddComment: (content: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div>
      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or leave a comment..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 font-medium">
                  {comment.authorName?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{comment.authorName}</span>
                  {comment.authorRole && (
                    <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                      {comment.authorRole}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No comments yet. Be the first to ask a question!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================
// MAIN CHALLENGE DETAIL PAGE
// ===========================================

const ChallengeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'resources' | 'timeline' | 'discussion'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<ChallengeSolver | null>(null);
  const [comments, setComments] = useState<ChallengeComment[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['eligibility', 'requirements']));

  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const challengeData = await challengesApi.challenges.get(slug);
        if (challengeData) {
          setChallenge(challengeData);

          // Fetch comments
          const commentsData = await challengesApi.comments.list(challengeData.id);
          setComments(commentsData);

          // Check if user is registered
          if (user) {
            const regData = await challengesApi.solvers.getRegistration(challengeData.id);
            if (regData) {
              setIsRegistered(true);
              setRegistration(regData);
            }

            // Check if saved
            const isSavedResult = await challengesApi.saves.isSaved(challengeData.id);
            setIsSaved(isSavedResult);
          }
        } else {
          setError('Challenge not found');
        }
      } catch (err) {
        setError('An error occurred while loading the challenge');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [slug, user]);

  // Handle registration
  const handleRegister = async () => {
    if (!challenge || !user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      const regData = await challengesApi.solvers.register(challenge.id);

      if (regData) {
        setIsRegistered(true);
        setRegistration(regData);
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  // Handle save/unsave
  const handleToggleSave = async () => {
    if (!challenge || !user) return;

    try {
      if (isSaved) {
        await challengesApi.saves.unsave(challenge.id);
      } else {
        await challengesApi.saves.save(challenge.id);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // Handle add comment
  const handleAddComment = async (content: string) => {
    if (!challenge || !user) return;

    try {
      const newComment = await challengesApi.comments.add(challenge.id, content);
      if (newComment) {
        setComments([newComment, ...comments]);
      }
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  // Toggle section
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Challenge Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The challenge you are looking for does not exist.'}</p>
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(challenge.endDate || challenge.submissionDeadline);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${
          challenge.industry === 'ai' ? 'from-purple-600/20 to-blue-600/20' :
          challenge.industry === 'semiconductor' ? 'from-blue-600/20 to-cyan-600/20' :
          challenge.industry === 'quantum' ? 'from-indigo-600/20 to-purple-600/20' :
          'from-gray-600/20 to-gray-500/20'
        }`} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/challenges" className="hover:text-white transition-colors">Challenges</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300">{challenge.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Status & Type Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(challenge.status)}`}>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </span>
                <span className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full">
                  {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1).replace('-', ' ')}
                </span>
                {challenge.featured && (
                  <span className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded-full">
                    <Sparkles className="w-4 h-4" />
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {challenge.title}
              </h1>

              {/* Short Description */}
              <p className="text-lg text-gray-300 mb-6">
                {challenge.shortDescription}
              </p>

              {/* Sponsor Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    {challenge.sponsor?.logoUrl ? (
                      <img
                        src={challenge.sponsor.logoUrl}
                        alt={challenge.sponsor.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Hosted by</div>
                    <div className="font-medium text-white">{challenge.sponsor?.name || 'Sponsor'}</div>
                  </div>
                </div>

                {challenge.coSponsors && challenge.coSponsors.length > 0 && (
                  <div className="flex items-center gap-2 pl-4 border-l border-gray-700">
                    <span className="text-sm text-gray-400">Partners:</span>
                    {challenge.coSponsors.slice(0, 3).map(sponsor => (
                      <div
                        key={sponsor.id}
                        className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center"
                        title={sponsor.name}
                      >
                        <Building2 className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                    {challenge.coSponsors.length > 3 && (
                      <span className="text-sm text-gray-500">+{challenge.coSponsors.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
                  <DollarSign className="w-6 h-6 mx-auto text-green-400 mb-2" />
                  <div className="text-xl font-bold text-white">{formatPrize(challenge.totalPrizePool)}</div>
                  <div className="text-sm text-gray-500">Prize Pool</div>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
                  <Users className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                  <div className="text-xl font-bold text-white">{challenge.registrationCount}</div>
                  <div className="text-sm text-gray-500">Registered</div>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
                  <Calendar className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                  <div className="text-xl font-bold text-white">{formatDateShort(challenge.endDate || challenge.submissionDeadline)}</div>
                  <div className="text-sm text-gray-500">Deadline</div>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
                  <Clock className="w-6 h-6 mx-auto text-yellow-400 mb-2" />
                  <div className="text-xl font-bold text-white">
                    {daysRemaining > 0 ? `${daysRemaining}d` : 'Closed'}
                  </div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
              </div>
            </div>

            {/* Sidebar - Registration Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-900/80 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                {/* Deadline Warning */}
                {challenge.status === 'open' && daysRemaining > 0 && daysRemaining <= 7 && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">
                      {daysRemaining === 1 ? 'Last day!' : `Only ${daysRemaining} days left!`}
                    </span>
                  </div>
                )}

                {/* Registration Status */}
                {isRegistered ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">You're Registered!</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Registered as {registration?.displayName}
                    </p>
                    <Link
                      to={`/challenges/${challenge.slug}/submit`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      Submit Solution
                    </Link>
                  </div>
                ) : challenge.status === 'open' ? (
                  <div className="mb-6">
                    <button
                      onClick={handleRegister}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors mb-3"
                    >
                      <Rocket className="w-5 h-5" />
                      Register Now
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      {challenge.registrationCount} solvers already registered
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-gray-400">
                      {challenge.status === 'upcoming'
                        ? 'Registration opens soon'
                        : 'Registration closed'}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={handleToggleSave}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg transition-colors ${
                      isSaved
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'border-gray-700 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-700 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Key Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Industry</span>
                    <span className="text-white">{challenge.industry}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Who Can Enter</span>
                    <span className="text-white">
                      {challenge.solverTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Submissions</span>
                    <span className="text-white">{challenge.submissionCount}</span>
                  </div>
                  {challenge.slackChannelId && (
                    <a
                      href="#"
                      className="flex items-center gap-2 py-2 text-blue-400 hover:text-blue-300"
                    >
                      <Slack className="w-4 h-4" />
                      Join Slack Channel
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <nav className="sticky top-16 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'rules', label: 'Rules & Eligibility', icon: FileText },
              { id: 'resources', label: 'Resources', icon: Download },
              { id: 'timeline', label: 'Timeline', icon: Calendar },
              { id: 'discussion', label: 'Discussion', icon: MessageSquare },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-blue-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-white mb-4">About This Challenge</h2>
                    <div
                      className="text-gray-300"
                      dangerouslySetInnerHTML={{ __html: challenge.description }}
                    />
                  </div>

                  {/* Judging Criteria */}
                  {challenge.judgingCriteria && challenge.judgingCriteria.length > 0 && (
                    <div className="mt-12">
                      <h2 className="text-2xl font-bold text-white mb-6">Judging Criteria</h2>
                      <div className="space-y-4">
                        {challenge.judgingCriteria.map((criteria) => (
                          <div
                            key={criteria.id}
                            className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-white">{criteria.name}</h3>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded">
                                {criteria.weight}%
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">{criteria.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Rules & Eligibility Tab */}
              {activeTab === 'rules' && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Eligibility */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleSection('eligibility')}
                      className="flex items-center justify-between w-full p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">Eligibility Requirements</h3>
                      </div>
                      {expandedSections.has('eligibility') ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSections.has('eligibility') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border-x border-b border-gray-800 rounded-b-lg">
                            {challenge.eligibility ? (
                              <div className="space-y-4">
                                {challenge.eligibility.geographic && challenge.eligibility.geographic.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Geographic Restrictions</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {challenge.eligibility.geographic.map((region, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded">
                                          {region}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {challenge.eligibility.experience && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Experience Level</h4>
                                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded">
                                      {challenge.eligibility.experience}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400">Open to all participants</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Requirements */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleSection('requirements')}
                      className="flex items-center justify-between w-full p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-green-400" />
                        <h3 className="font-semibold text-white">Submission Requirements</h3>
                      </div>
                      {expandedSections.has('requirements') ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSections.has('requirements') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border-x border-b border-gray-800 rounded-b-lg">
                            {challenge.requirements ? (
                              <div className="space-y-4">
                                {challenge.requirements.technical && challenge.requirements.technical.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Technical Requirements</h4>
                                    <ul className="space-y-2">
                                      {challenge.requirements.technical.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-300">
                                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                          {req}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {challenge.requirements.deliverables && challenge.requirements.deliverables.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Required Deliverables</h4>
                                    <ul className="space-y-2">
                                      {challenge.requirements.deliverables.map((del, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-300">
                                          <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                          <span>
                                            <strong>{del.name}</strong>
                                            {del.description && ` - ${del.description}`}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400">See challenge description for requirements</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* IP & Legal */}
                  <div>
                    <button
                      onClick={() => toggleSection('legal')}
                      className="flex items-center justify-between w-full p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-purple-400" />
                        <h3 className="font-semibold text-white">IP & Legal Terms</h3>
                      </div>
                      {expandedSections.has('legal') ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSections.has('legal') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border-x border-b border-gray-800 rounded-b-lg">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                                <span className="text-gray-400">IP Assignment</span>
                                <span className="text-white">
                                  {challenge.ipAssignment === 'solver-retains'
                                    ? 'Solver Retains IP'
                                    : challenge.ipAssignment === 'sponsor-owns'
                                    ? 'Sponsor Owns IP'
                                    : 'Shared/Licensed'}
                                </span>
                              </div>
                              {challenge.legalTermsUrl && (
                                <a
                                  href={challenge.legalTermsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Full Legal Terms
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Resources Tab */}
              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Challenge Resources</h2>
                  {challenge.resources && challenge.resources.length > 0 ? (
                    <ResourcesSection resources={challenge.resources} />
                  ) : (
                    <div className="text-center py-12 bg-gray-900/30 border border-gray-800 rounded-xl">
                      <Download className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No resources available yet</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Challenge Timeline</h2>
                  {challenge.phases && challenge.phases.length > 0 ? (
                    <PhaseTimeline phases={challenge.phases} />
                  ) : (
                    <div className="text-center py-12 bg-gray-900/30 border border-gray-800 rounded-xl">
                      <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Timeline not available</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Discussion Tab */}
              {activeTab === 'discussion' && (
                <motion.div
                  key="discussion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Discussion</h2>
                  <CommentsSection
                    challengeId={challenge.id}
                    comments={comments}
                    onAddComment={handleAddComment}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Awards */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Awards
              </h3>
              {challenge.awards && challenge.awards.length > 0 ? (
                <AwardsSection awards={challenge.awards} />
              ) : (
                <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-xl text-center">
                  <Award className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Awards to be announced</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChallengeDetailPage;
