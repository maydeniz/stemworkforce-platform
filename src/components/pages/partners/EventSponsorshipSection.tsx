// ===========================================
// Shared Event Sponsorship & Collaboration Section
// Used across all partner landing pages
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Trophy,
  Megaphone,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  Briefcase,
  Globe,
  Video,
  MapPin,
  TrendingUp,
  Heart
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
export type PartnerType = 'national-labs' | 'government' | 'industry' | 'nonprofit' | 'education';

interface EventSponsorshipSectionProps {
  partnerType: PartnerType;
  primaryColor: string; // e.g., 'amber', 'blue', 'emerald', 'pink', 'indigo'
}

// ===========================================
// SPONSORSHIP TIERS
// ===========================================
const SPONSORSHIP_TIERS = [
  {
    name: 'Presenting Sponsor',
    price: '$15,000',
    description: 'Maximum visibility and thought leadership',
    icon: Trophy,
    color: 'from-yellow-500 to-amber-500',
    features: [
      'Logo on all event materials',
      'Keynote speaking slot (20 min)',
      'Premium booth placement',
      'VIP networking reception access',
      '10 complimentary registrations',
      'Lead capture from all attendees',
      'Post-event video feature',
      'Year-round platform branding'
    ],
    highlight: true
  },
  {
    name: 'Gold Sponsor',
    price: '$7,500',
    description: 'Strong presence and engagement',
    icon: Star,
    color: 'from-amber-400 to-yellow-500',
    features: [
      'Logo on event website & materials',
      'Workshop or panel session (45 min)',
      'Standard booth space',
      'Networking session access',
      '5 complimentary registrations',
      'Lead capture from booth visitors',
      'Social media mentions'
    ],
    highlight: false
  },
  {
    name: 'Silver Sponsor',
    price: '$3,500',
    description: 'Visibility and talent access',
    icon: Sparkles,
    color: 'from-gray-300 to-gray-400',
    features: [
      'Logo on event website',
      'Tabletop display space',
      '3 complimentary registrations',
      'Access to attendee list',
      'Social media mention'
    ],
    highlight: false
  },
  {
    name: 'Community Partner',
    price: 'In-Kind',
    description: 'Non-profit and community support',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    features: [
      'Logo recognition',
      'Event promotion to your audience',
      '2 complimentary registrations',
      'Community showcase opportunity'
    ],
    highlight: false
  }
];

// ===========================================
// EVENT TYPES BY PARTNER
// ===========================================
const EVENT_TYPES: Record<PartnerType, { name: string; icon: React.ElementType; description: string }[]> = {
  'national-labs': [
    { name: 'Clearance Career Fair', icon: Building2, description: 'Connect cleared candidates with national lab opportunities' },
    { name: 'Research Symposium', icon: GraduationCap, description: 'Showcase cutting-edge research and recruit postdocs' },
    { name: 'Fellowship Info Session', icon: Users, description: 'Promote fellowship programs to qualified candidates' },
    { name: 'Lab Tour Series', icon: MapPin, description: 'Virtual and in-person facility tours for prospects' }
  ],
  'government': [
    { name: 'CHIPS Act Workforce Summit', icon: Building2, description: 'Convene semiconductor training stakeholders' },
    { name: 'Regional Workforce Forum', icon: Globe, description: 'State and local workforce development collaboration' },
    { name: 'Grant Outcome Showcase', icon: TrendingUp, description: 'Highlight program successes for federal funders' },
    { name: 'Policy Roundtable', icon: Users, description: 'Discuss workforce policy with key stakeholders' }
  ],
  'industry': [
    { name: 'Early Talent Pipeline Day', icon: GraduationCap, description: 'Connect with students before graduation' },
    { name: 'Apprenticeship Showcase', icon: Briefcase, description: 'Promote your apprenticeship programs' },
    { name: 'Tech Talks Series', icon: Video, description: 'Thought leadership and employer branding' },
    { name: 'Diversity Recruiting Event', icon: Heart, description: 'Connect with underrepresented talent pools' }
  ],
  'nonprofit': [
    { name: 'Program Impact Showcase', icon: TrendingUp, description: 'Demonstrate outcomes to funders and partners' },
    { name: 'Coalition Convening', icon: Users, description: 'Bring together workforce ecosystem partners' },
    { name: 'Participant Success Stories', icon: Star, description: 'Celebrate and amplify participant achievements' },
    { name: 'Funder Networking Event', icon: Briefcase, description: 'Connect with grant-making organizations' }
  ],
  'education': [
    { name: 'Virtual Career Fair', icon: Video, description: 'Connect your students with employers' },
    { name: 'Industry Advisory Day', icon: Building2, description: 'Gather curriculum input from employers' },
    { name: 'Employer Partnership Summit', icon: Briefcase, description: 'Build work-based learning partnerships' },
    { name: 'Alumni Success Showcase', icon: GraduationCap, description: 'Highlight graduate outcomes to prospects' }
  ]
};

// ===========================================
// COLLABORATION OPPORTUNITIES
// ===========================================
const COLLABORATION_TYPES = [
  {
    title: 'Lead an Event',
    description: 'Host your own branded event on our platform with full marketing support',
    icon: Megaphone,
    benefits: ['Full event ownership', 'Marketing to 125K+ users', 'Registration management', 'Lead capture tools']
  },
  {
    title: 'Co-Host Partnership',
    description: 'Partner with other organizations for joint events with shared audiences',
    icon: Users,
    benefits: ['Combined audiences', 'Shared costs', 'Cross-promotion', 'Broader reach']
  },
  {
    title: 'Sponsor Existing Events',
    description: 'Gain visibility at platform-hosted events without planning overhead',
    icon: Star,
    benefits: ['Turnkey exposure', 'Qualified attendees', 'No logistics burden', 'Flexible tiers']
  },
  {
    title: 'Virtual Booth',
    description: 'Maintain a year-round presence at all virtual career events',
    icon: Globe,
    benefits: ['Always-on presence', 'Chat with candidates', 'Content library', 'Lead generation']
  }
];

// ===========================================
// UPCOMING EVENTS (Sample)
// ===========================================
const UPCOMING_EVENTS = [
  {
    title: 'Semiconductor Career Fair 2025',
    date: 'March 15, 2025',
    type: 'Virtual',
    attendees: '2,500+',
    sponsors: 12,
    sponsorLogos: ['Intel', 'AMD', 'TSMC']
  },
  {
    title: 'AI & ML Talent Summit',
    date: 'April 22, 2025',
    type: 'Hybrid',
    attendees: '1,800+',
    sponsors: 8,
    sponsorLogos: ['NVIDIA', 'Google', 'Microsoft']
  },
  {
    title: 'National Labs Research Day',
    date: 'May 10, 2025',
    type: 'Virtual',
    attendees: '1,200+',
    sponsors: 6,
    sponsorLogos: ['Sandia', 'ORNL', 'LLNL']
  }
];

// ===========================================
// COLOR MAPPINGS
// ===========================================
const COLOR_CLASSES: Record<string, { gradient: string; bg: string; border: string; text: string; button: string }> = {
  amber: {
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    button: 'bg-amber-500 hover:bg-amber-400'
  },
  blue: {
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    button: 'bg-blue-500 hover:bg-blue-400'
  },
  emerald: {
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    button: 'bg-emerald-500 hover:bg-emerald-400'
  },
  pink: {
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    button: 'bg-pink-500 hover:bg-pink-400'
  },
  indigo: {
    gradient: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    button: 'bg-indigo-500 hover:bg-indigo-400'
  }
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const EventSponsorshipSection: React.FC<EventSponsorshipSectionProps> = ({ partnerType, primaryColor }) => {
  const [activeTab, setActiveTab] = useState<'sponsor' | 'host' | 'upcoming'>('sponsor');
  const colors = COLOR_CLASSES[primaryColor] || COLOR_CLASSES.indigo;
  const eventTypes = EVENT_TYPES[partnerType] || EVENT_TYPES.education;

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg} border ${colors.border} rounded-full ${colors.text} text-sm font-medium mb-4`}
          >
            <Calendar className="w-4 h-4" />
            Events & Sponsorship
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Amplify Your Reach Through Events
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sponsor, host, or collaborate on events to connect with STEM talent and build your brand
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-800 rounded-xl p-1">
            {[
              { id: 'sponsor', label: 'Sponsorship Tiers', icon: Trophy },
              { id: 'host', label: 'Host Your Own', icon: Megaphone },
              { id: 'upcoming', label: 'Upcoming Events', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${colors.gradient} text-white`
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sponsorship Tiers Tab */}
        {activeTab === 'sponsor' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SPONSORSHIP_TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <div
                  key={idx}
                  className={`relative bg-gray-800 rounded-2xl p-6 border ${
                    tier.highlight ? `${colors.border} ring-2 ring-${primaryColor}-500/50` : 'border-gray-700'
                  }`}
                >
                  {tier.highlight && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${colors.gradient} rounded-full text-white text-xs font-bold`}>
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-2`}>
                    {tier.price}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">{tier.description}</p>

                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={`/events/sponsor?tier=${tier.name.toLowerCase().replace(' ', '-')}&partner=${partnerType}`}>
                    <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      tier.highlight
                        ? `${colors.button} text-white`
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}>
                      Select Tier
                    </button>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Host Your Own Tab */}
        {activeTab === 'host' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Event Types for This Partner */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Event Types Perfect for Your Organization
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {eventTypes.map((event, idx) => {
                  const Icon = event.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-5 bg-gray-800 rounded-xl border border-gray-700 hover:${colors.border} transition-all cursor-pointer group`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <h4 className="font-semibold text-white mb-1">{event.name}</h4>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collaboration Types */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Ways to Collaborate
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {COLLABORATION_TYPES.map((collab, idx) => {
                  const Icon = collab.icon;
                  return (
                    <div
                      key={idx}
                      className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{collab.title}</h4>
                      <p className="text-sm text-gray-400 mb-4">{collab.description}</p>
                      <ul className="space-y-1">
                        {collab.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle2 className={`w-3 h-3 ${colors.text}`} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link to={`/events/host?partner=${partnerType}`}>
                <button className={`px-8 py-4 ${colors.button} text-white font-semibold rounded-xl transition-all inline-flex items-center gap-2`}>
                  Start Planning Your Event
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Upcoming Events Tab */}
        {activeTab === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {UPCOMING_EVENTS.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all"
                >
                  {/* Event Header */}
                  <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{event.attendees} Expected</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm">{event.sponsors} Sponsors</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-500">Sponsored by:</span>
                      <div className="flex gap-2">
                        {event.sponsorLogos.map((sponsor, sIdx) => (
                          <span key={sIdx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                            {sponsor}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/events/${event.title.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                        <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </Link>
                      <Link to={`/events/sponsor?event=${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <button className={`px-4 py-2 ${colors.button} text-white rounded-lg text-sm font-medium transition-colors`}>
                          Sponsor
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Events */}
            <div className="text-center">
              <Link to="/events">
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2">
                  View All Upcoming Events
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Events Hosted', value: '250+', icon: Calendar },
            { label: 'Total Attendees', value: '125K+', icon: Users },
            { label: 'Sponsor Partners', value: '180+', icon: Building2 },
            { label: 'Avg. Lead Quality', value: '4.8/5', icon: Star }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center p-6 bg-gray-800/50 rounded-xl">
                <Icon className={`w-8 h-8 ${colors.text} mx-auto mb-2`} />
                <p className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventSponsorshipSection;
