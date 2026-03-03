// ===========================================
// FEDERATED LISTING CARD
// Displays aggregated jobs, internships, challenges with source attribution
// ===========================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Briefcase, ExternalLink, Building2,
  Bookmark, BookmarkCheck, Shield, Globe, Calendar, Trophy,
  GraduationCap, Sparkles, BadgeCheck
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import type { FederatedListing } from '@/types/federation';
import { federationApi } from '@/services/federationApi';

interface FederatedListingCardProps {
  listing: FederatedListing;
  variant?: 'default' | 'compact' | 'featured';
  onSave?: (listingId: string) => void;
  onUnsave?: (listingId: string) => void;
  isSaved?: boolean;
}

const getThemeClasses = (isDark: boolean) => ({
  bgPrimary: isDark ? 'bg-slate-900' : 'bg-white',
  bgSecondary: isDark ? 'bg-slate-800' : 'bg-slate-50',
  borderPrimary: isDark ? 'border-slate-800' : 'border-slate-200',
  textPrimary: isDark ? 'text-white' : 'text-slate-900',
  textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
  textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
  hoverBg: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
});

// Static color class maps for Tailwind JIT compatibility
const fedListingColors: Record<string, { badge: string; badgeSmall: string }> = {
  emerald: { badge: 'bg-emerald-500/20 text-emerald-400', badgeSmall: 'bg-emerald-500/10 text-emerald-400' },
  blue: { badge: 'bg-blue-500/20 text-blue-400', badgeSmall: 'bg-blue-500/10 text-blue-400' },
  amber: { badge: 'bg-amber-500/20 text-amber-400', badgeSmall: 'bg-amber-500/10 text-amber-400' },
  violet: { badge: 'bg-violet-500/20 text-violet-400', badgeSmall: 'bg-violet-500/10 text-violet-400' },
  pink: { badge: 'bg-pink-500/20 text-pink-400', badgeSmall: 'bg-pink-500/10 text-pink-400' },
  rose: { badge: 'bg-rose-500/20 text-rose-400', badgeSmall: 'bg-rose-500/10 text-rose-400' },
  cyan: { badge: 'bg-cyan-500/20 text-cyan-400', badgeSmall: 'bg-cyan-500/10 text-cyan-400' },
  slate: { badge: 'bg-slate-500/20 text-slate-400', badgeSmall: 'bg-slate-500/10 text-slate-400' },
};

// Content type icons and colors
const CONTENT_TYPE_CONFIG = {
  job: { icon: Briefcase, label: 'Job', color: 'emerald' },
  internship: { icon: GraduationCap, label: 'Internship', color: 'blue' },
  challenge: { icon: Trophy, label: 'Challenge', color: 'amber' },
  event: { icon: Calendar, label: 'Event', color: 'violet' },
  scholarship: { icon: Sparkles, label: 'Scholarship', color: 'pink' },
};

// Source type badges
const SOURCE_TYPE_CONFIG = {
  national_lab: { label: 'National Lab', color: 'blue' },
  federal_agency: { label: 'Federal', color: 'emerald' },
  industry_partner: { label: 'Industry', color: 'violet' },
  university: { label: 'University', color: 'amber' },
  nonprofit: { label: 'Nonprofit', color: 'rose' },
  challenge_platform: { label: 'Challenge Platform', color: 'cyan' },
};

export const FederatedListingCard = ({
  listing,
  variant = 'default',
  onSave,
  onUnsave,
  isSaved = false,
}: FederatedListingCardProps) => {
  const { isDark } = useTheme();
  const tc = getThemeClasses(isDark);
  const [saved, setSaved] = useState(isSaved);
  const [_isHovered, setIsHovered] = useState(false);

  const typeConfig = CONTENT_TYPE_CONFIG[listing.contentType];

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      const success = await federationApi.saves.unsave(listing.id);
      if (success) {
        setSaved(false);
        onUnsave?.(listing.id);
      }
    } else {
      const success = await federationApi.saves.save(listing.id);
      if (success) {
        setSaved(true);
        onSave?.(listing.id);
      }
    }
  };

  const handleCardClick = async () => {
    // Record click-through
    await federationApi.listings.recordClick(listing.id);
    // Open source URL in new tab
    window.open(listing.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  const formatSalary = () => {
    if (!listing.salaryMin && !listing.salaryMax) return null;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: listing.salaryCurrency || 'USD',
      maximumFractionDigits: 0,
    });

    if (listing.salaryMin && listing.salaryMax) {
      return `${formatter.format(listing.salaryMin)} - ${formatter.format(listing.salaryMax)}`;
    } else if (listing.salaryMax) {
      return `Up to ${formatter.format(listing.salaryMax)}`;
    } else if (listing.salaryMin) {
      return `From ${formatter.format(listing.salaryMin)}`;
    }

    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDeadlineText = () => {
    const deadline = listing.expiresAt || listing.submissionDeadline || listing.registrationDeadline;
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Closes today';
    if (daysLeft === 1) return 'Closes tomorrow';
    if (daysLeft <= 7) return `${daysLeft} days left`;
    return `Closes ${formatDate(deadline)}`;
  };

  const deadlineText = getDeadlineText();
  const salary = formatSalary();

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`${tc.bgPrimary} border ${tc.borderPrimary} rounded-lg p-4 cursor-pointer ${tc.hoverBg} transition-colors`}
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-3">
          {/* Organization Logo */}
          <div className={`w-10 h-10 rounded-lg ${tc.bgSecondary} flex items-center justify-center flex-shrink-0`}>
            {listing.organizationLogoUrl ? (
              <img
                src={listing.organizationLogoUrl}
                alt={listing.organizationName}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Building2 size={20} className={tc.textSecondary} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`font-semibold ${tc.textPrimary} line-clamp-1`}>{listing.title}</h3>
                <p className={`text-sm ${tc.textSecondary}`}>{listing.organizationName}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${fedListingColors[typeConfig.color]?.badge || 'bg-slate-500/20 text-slate-400'} flex-shrink-0`}>
                {typeConfig.label}
              </span>
            </div>

            <div className={`flex items-center gap-3 mt-2 text-xs ${tc.textMuted}`}>
              {listing.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {listing.location}
                </span>
              )}
              {listing.isRemote && (
                <span className="flex items-center gap-1">
                  <Globe size={12} />
                  Remote
                </span>
              )}
              {deadlineText && (
                <span className={`flex items-center gap-1 ${deadlineText.includes('today') || deadlineText.includes('tomorrow') ? 'text-amber-400' : ''}`}>
                  <Clock size={12} />
                  {deadlineText}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className={`${tc.bgPrimary} border ${tc.borderPrimary} rounded-2xl overflow-hidden cursor-pointer group`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Featured Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 flex items-center gap-2">
          <Sparkles size={14} className="text-white" />
          <span className="text-white text-sm font-medium">Featured Opportunity</span>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Organization Logo */}
            <div className={`w-16 h-16 rounded-xl ${tc.bgSecondary} flex items-center justify-center flex-shrink-0`}>
              {listing.organizationLogoUrl ? (
                <img
                  src={listing.organizationLogoUrl}
                  alt={listing.organizationName}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <Building2 size={28} className={tc.textSecondary} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={`text-xl font-bold ${tc.textPrimary} line-clamp-2 group-hover:text-emerald-400 transition-colors`}>
                    {listing.title}
                  </h3>
                  <p className={`${tc.textSecondary} mt-1`}>{listing.organizationName}</p>
                </div>

                <button
                  onClick={handleSaveToggle}
                  className={`p-2 rounded-lg ${tc.bgSecondary} ${tc.hoverBg} transition-colors`}
                >
                  {saved ? (
                    <BookmarkCheck size={20} className="text-emerald-400" />
                  ) : (
                    <Bookmark size={20} className={tc.textSecondary} />
                  )}
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${fedListingColors[typeConfig.color]?.badge || 'bg-slate-500/20 text-slate-400'}`}>
                  {typeConfig.label}
                </span>
                {listing.clearanceRequired && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 flex items-center gap-1">
                    <Shield size={12} />
                    {listing.clearanceRequired}
                  </span>
                )}
                {listing.isRemote && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 flex items-center gap-1">
                    <Globe size={12} />
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className={`${tc.textSecondary} mt-4 line-clamp-3`}>
            {listing.shortDescription || listing.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {listing.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className={tc.textMuted} />
                <span className={tc.textSecondary}>{listing.location}</span>
              </div>
            )}
            {salary && (
              <div className="flex items-center gap-2">
                <DollarSign size={16} className={tc.textMuted} />
                <span className={tc.textSecondary}>{salary}</span>
              </div>
            )}
            {listing.prizeAmount && (
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                <span className={tc.textSecondary}>
                  ${listing.prizeAmount.toLocaleString()} Prize
                </span>
              </div>
            )}
            {deadlineText && (
              <div className="flex items-center gap-2">
                <Clock size={16} className={deadlineText.includes('today') || deadlineText.includes('tomorrow') ? 'text-amber-400' : tc.textMuted} />
                <span className={`${tc.textSecondary} ${deadlineText.includes('today') || deadlineText.includes('tomorrow') ? 'text-amber-400' : ''}`}>
                  {deadlineText}
                </span>
              </div>
            )}
          </div>

          {/* Skills */}
          {listing.skills && listing.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {listing.skills.slice(0, 5).map(skill => (
                <span key={skill} className={`px-2 py-1 ${tc.bgSecondary} rounded text-xs ${tc.textSecondary}`}>
                  {skill}
                </span>
              ))}
              {listing.skills.length > 5 && (
                <span className={`px-2 py-1 ${tc.bgSecondary} rounded text-xs ${tc.textMuted}`}>
                  +{listing.skills.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Source Attribution - CRITICAL FOR LEGAL COMPLIANCE */}
          <SourceAttribution listing={listing} tc={tc} />

          {/* CTA */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <span className={`text-sm ${tc.textMuted}`}>Posted {formatDate(listing.postedAt)}</span>
            <span className={`flex items-center gap-1 text-emerald-400 font-medium text-sm group-hover:gap-2 transition-all`}>
              View & Apply
              <ExternalLink size={16} />
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`${tc.bgPrimary} border ${tc.borderPrimary} rounded-xl p-5 cursor-pointer group`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Organization Logo */}
        <div className={`w-12 h-12 rounded-xl ${tc.bgSecondary} flex items-center justify-center flex-shrink-0`}>
          {listing.organizationLogoUrl ? (
            <img
              src={listing.organizationLogoUrl}
              alt={listing.organizationName}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <Building2 size={24} className={tc.textSecondary} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-bold ${tc.textPrimary} line-clamp-2 group-hover:text-emerald-400 transition-colors`}>
                {listing.title}
              </h3>
              <p className={`text-sm ${tc.textSecondary} mt-0.5`}>{listing.organizationName}</p>
            </div>

            <button
              onClick={handleSaveToggle}
              className={`p-2 rounded-lg ${tc.bgSecondary} ${tc.hoverBg} transition-colors flex-shrink-0`}
            >
              {saved ? (
                <BookmarkCheck size={18} className="text-emerald-400" />
              ) : (
                <Bookmark size={18} className={tc.textSecondary} />
              )}
            </button>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${fedListingColors[typeConfig.color]?.badge || 'bg-slate-500/20 text-slate-400'}`}>
              {typeConfig.label}
            </span>
            {listing.clearanceRequired && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 flex items-center gap-1">
                <Shield size={10} />
                {listing.clearanceRequired}
              </span>
            )}
            {listing.jobType && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${tc.bgSecondary} ${tc.textSecondary}`}>
                {listing.jobType.charAt(0).toUpperCase() + listing.jobType.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className={`${tc.textSecondary} text-sm mt-3 line-clamp-2`}>
        {listing.shortDescription || listing.description}
      </p>

      {/* Meta Row */}
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm ${tc.textMuted}`}>
        {listing.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {listing.location}
          </span>
        )}
        {listing.isRemote && (
          <span className="flex items-center gap-1">
            <Globe size={14} />
            Remote
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1">
            <DollarSign size={14} />
            {salary}
          </span>
        )}
        {listing.prizeAmount && (
          <span className="flex items-center gap-1 text-amber-400">
            <Trophy size={14} />
            ${listing.prizeAmount.toLocaleString()}
          </span>
        )}
      </div>

      {/* Skills */}
      {listing.skills && listing.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {listing.skills.slice(0, 4).map(skill => (
            <span key={skill} className={`px-2 py-0.5 ${tc.bgSecondary} rounded text-xs ${tc.textMuted}`}>
              {skill}
            </span>
          ))}
          {listing.skills.length > 4 && (
            <span className={`px-2 py-0.5 ${tc.bgSecondary} rounded text-xs ${tc.textMuted}`}>
              +{listing.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Source Attribution - CRITICAL FOR LEGAL COMPLIANCE */}
      <SourceAttribution listing={listing} tc={tc} />

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          {deadlineText && (
            <span className={`text-xs ${deadlineText.includes('today') || deadlineText.includes('tomorrow') ? 'text-amber-400' : tc.textMuted}`}>
              {deadlineText}
            </span>
          )}
        </div>
        <span className={`flex items-center gap-1 text-emerald-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
          Apply
          <ExternalLink size={14} />
        </span>
      </div>
    </motion.div>
  );
};

// ===========================================
// SOURCE ATTRIBUTION COMPONENT
// Required for legal compliance when displaying federated content
// ===========================================

const SourceAttribution = ({
  listing,
  tc,
}: {
  listing: FederatedListing;
  tc: ReturnType<typeof getThemeClasses>;
}) => {
  const sourceType = listing.organizationType;
  const sourceConfig = sourceType ? SOURCE_TYPE_CONFIG[sourceType] : null;

  return (
    <div className={`flex items-center gap-2 mt-3 pt-3 border-t border-dashed ${tc.borderPrimary}`}>
      {/* Source Logo */}
      {listing.sourceLogoUrl && (
        <img
          src={listing.sourceLogoUrl}
          alt={listing.sourceName}
          className="w-4 h-4 object-contain"
        />
      )}

      {/* Source Name with Link */}
      <span className={`text-xs ${tc.textMuted} flex items-center gap-1`}>
        <span>via</span>
        <a
          href={listing.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {listing.sourceName}
        </a>
        {sourceConfig && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${fedListingColors[sourceConfig.color]?.badgeSmall || 'bg-slate-500/10 text-slate-400'}`}>
            {sourceConfig.label}
          </span>
        )}
      </span>

      {/* Verified Partner Badge */}
      {listing.organizationType === 'federal_agency' || listing.organizationType === 'national_lab' && (
        <BadgeCheck size={14} className="text-blue-400" />
      )}
    </div>
  );
};

export default FederatedListingCard;
