// ===========================================
// Career Q&A Detail Page
// SEO-optimized individual Q&A page with FAQ schema
// Source: CareerVillage.org via CareerNet (CC BY 4.0)
// ===========================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Eye,
  Tag,
  Calendar,
  MapPin,
  ThumbsUp,
  ChevronRight,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import ExpertQACard from '@/components/shared/ExpertQACard';
import CareerNetAttribution from '@/components/shared/CareerNetAttribution';
import { useCareerQASearch, useCareerQAByScenario } from '@/hooks/useCareerQA';
import { SCENARIO_DISPLAY_NAMES } from '@/types/careernet';
import type { CareerQA } from '@/types/careernet';

const CareerQADetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [qaItem, setQaItem] = useState<CareerQA | null>(null);

  // Parse question ID from slug (format: "question-title-123")
  const questionId = slug?.match(/-(\d+)$/)?.[1];

  // Search for the specific question
  const { data: searchResult, isLoading } = useCareerQASearch(
    questionId ? { search: questionId } : {},
    1,
    1
  );

  // Get related Q&A
  const scenario = qaItem?.scenarioLabels[0];
  const { data: relatedItems } = useCareerQAByScenario(scenario || '', 5);

  useEffect(() => {
    if (searchResult?.items[0]) {
      setQaItem(searchResult.items[0]);
    }
  }, [searchResult]);

  // Inject FAQ Schema JSON-LD
  useEffect(() => {
    if (!qaItem) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{
        '@type': 'Question',
        name: qaItem.questionTitle,
        acceptedAnswer: {
          '@type': 'Answer',
          text: qaItem.answerBody,
        },
      }],
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [qaItem]);

  // Update document title for SEO
  useEffect(() => {
    if (qaItem) {
      document.title = `${qaItem.questionTitle} | STEM Career Q&A | STEMWorkforce`;
    }
    return () => {
      document.title = 'STEMWorkforce';
    };
  }, [qaItem]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!qaItem) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Q&A Not Found</h1>
          <p className="text-gray-400 mb-6">This career question could not be found.</p>
          <Link
            to="/jobs"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const qualityBadge = qaItem.correctness === 4
    ? { label: 'Expert Verified', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' }
    : { label: 'Quality Reviewed', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs & Careers
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          {/* Question */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${qualityBadge.color}`}>
                <Star className="w-3 h-3" />
                {qualityBadge.label}
              </span>
              {qaItem.questionViews > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  {qaItem.questionViews.toLocaleString()} views
                </span>
              )}
              {qaItem.questionScore > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <ThumbsUp className="w-3 h-3" />
                  {qaItem.questionScore} upvotes
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
              {qaItem.questionTitle}
            </h1>

            {qaItem.questionBody && (
              <p className="text-gray-300 leading-relaxed">
                {qaItem.questionBody}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
              {qaItem.askerLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {qaItem.askerLocation}
                </span>
              )}
              {qaItem.questionAddedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(qaItem.questionAddedAt).toLocaleDateString()}
                </span>
              )}
              <span className="text-gray-600">
                Source: {qaItem.sourceDataset} dataset
              </span>
            </div>
          </header>

          {/* Answer */}
          <section className="bg-gray-800/30 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-white">Expert Answer</span>
                {qaItem.answererLocation && (
                  <span className="text-xs text-gray-500 ml-2">from {qaItem.answererLocation}</span>
                )}
              </div>
            </div>

            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {qaItem.answerBody}
            </div>

            {qaItem.answerScore > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <ThumbsUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{qaItem.answerScore} people found this helpful</span>
              </div>
            )}
          </section>

          {/* Tags */}
          {qaItem.questionTags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-2">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {qaItem.questionTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800/50 text-gray-300 rounded-lg text-sm border border-white/5"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Scenario Labels */}
          {qaItem.scenarioLabels.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-400 mb-2">Career Scenarios</h2>
              <div className="flex flex-wrap gap-2">
                {qaItem.scenarioLabels.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-lg text-sm border border-purple-500/20"
                  >
                    {SCENARIO_DISPLAY_NAMES[s] || s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Q&A */}
        {relatedItems && relatedItems.length > 1 && (
          <section className="mt-12 pt-8 border-t border-white/5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              Related Career Questions
            </h2>
            <div className="space-y-3">
              {relatedItems
                .filter((item) => item.questionId !== qaItem.questionId)
                .slice(0, 4)
                .map((item) => (
                  <ExpertQACard key={item.id} qa={item} showTags />
                ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/20 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Explore STEM Career Opportunities</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Find jobs, internships, and career resources tailored to your STEM interests.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/jobs"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              Browse Jobs <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/college/career-launch"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Career Launch Hub
            </Link>
          </div>
        </div>

        {/* Attribution */}
        <CareerNetAttribution className="mt-8" />
      </div>
    </div>
  );
};

export default CareerQADetailPage;
