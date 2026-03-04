// ===========================================
// AI Career Guide Page
// ===========================================
// Comprehensive guide for parents and students
// explaining AI metrics and career implications
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  industryAIMetrics,
  getExposureLabel,
  getOpportunityLabel,
  getExposureColor,
  getOpportunityColor,
  getExposureBgColor,
  getOpportunityBgColor,
} from '@/data/aiMetrics';

// All industries with their display data
const industriesData = [
  { id: 'ai', name: 'AI & Machine Learning', icon: '🤖' },
  { id: 'quantum', name: 'Quantum Technologies', icon: '⚛️' },
  { id: 'semiconductor', name: 'Semiconductor', icon: '💎' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️' },
  { id: 'robotics', name: 'Robotics & Automation', icon: '🦾' },
  { id: 'aerospace', name: 'Aerospace & Defense', icon: '🚀' },
  { id: 'biotech', name: 'Biotechnology', icon: '🧬' },
  { id: 'healthcare', name: 'Healthcare IT', icon: '🏥' },
  { id: 'nuclear', name: 'Nuclear Technologies', icon: '☢️' },
  { id: 'clean-energy', name: 'Clean Energy', icon: '⚡' },
  { id: 'manufacturing', name: 'Advanced Manufacturing', icon: '🏭' },
];

const AICareerGuidePage: React.FC = () => {
  // Sort industries by opportunity index
  const sortedByOpportunity = [...industriesData].sort((a, b) => {
    const metricsA = industryAIMetrics[a.id] || { opportunityIndex: 0 };
    const metricsB = industryAIMetrics[b.id] || { opportunityIndex: 0 };
    return metricsB.opportunityIndex - metricsA.opportunityIndex;
  });

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(147,51,234,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-purple-400">AI Career Guide</span>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6">
              🤖 For Parents & Students
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Understanding <span className="text-purple-400">AI's Impact</span> on STEM Careers
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Make informed decisions about education and career paths with our AI metrics.
              Learn which fields offer the best opportunities in the AI-driven economy.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/training"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all"
              >
                Explore Training Programs
              </Link>
              <Link
                to="/jobs"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Are These Metrics Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Understanding Our <span className="text-purple-400">AI Metrics</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We use two key metrics to help you understand how AI will affect different career paths.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* AI Exposure Index */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <h3 className="text-2xl font-bold text-white">AI Exposure Index</h3>
              </div>

              <p className="text-gray-400 mb-6">
                Measures how much AI technology will <strong className="text-white">transform daily work</strong> in a field.
                A higher score means more job tasks will be affected by AI.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">Low (0-30%)</span>
                  <span className="text-gray-300 text-sm">Minimal AI impact on daily tasks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">Moderate (30-50%)</span>
                  <span className="text-gray-300 text-sm">Some tasks will be AI-assisted</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">High (50-70%)</span>
                  <span className="text-gray-300 text-sm">Significant AI integration expected</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">Very High (70%+)</span>
                  <span className="text-gray-300 text-sm">Major workflow transformation</span>
                </div>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-xl">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">💡 What it means:</strong> Higher exposure doesn't mean job loss—it means
                  workers will need to learn AI collaboration skills to stay competitive.
                </p>
              </div>
            </div>

            {/* AI Opportunity Index */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">
                  🚀
                </div>
                <h3 className="text-2xl font-bold text-white">AI Opportunity Index</h3>
              </div>

              <p className="text-gray-400 mb-6">
                Measures <strong className="text-white">career growth potential</strong> in the AI economy.
                A higher score means more job opportunities and earning potential for AI-skilled workers.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-medium">Limited (0-35%)</span>
                  <span className="text-gray-300 text-sm">Fewer AI-enhanced career paths</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">Moderate (35-55%)</span>
                  <span className="text-gray-300 text-sm">Growing AI-related opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">Strong (55-75%)</span>
                  <span className="text-gray-300 text-sm">Many AI-driven career paths</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">Exceptional (75%+)</span>
                  <span className="text-gray-300 text-sm">Highest AI career potential</span>
                </div>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-xl">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">💡 What it means:</strong> Higher opportunity scores indicate
                  fields where AI skills can significantly boost your career and earning potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Comparison Table */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI Impact by <span className="text-purple-400">Industry</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Compare AI exposure and opportunity across all STEM industries to find the best fit.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Industry</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">AI Exposure</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">AI Opportunity</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Top AI Skills Needed</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedByOpportunity.map((industry) => {
                  const metrics = industryAIMetrics[industry.id] || industryAIMetrics['manufacturing'];
                  return (
                    <tr key={industry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{industry.icon}</span>
                          <span className="text-white font-medium">{industry.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-semibold ${getExposureColor(metrics.exposureIndex)}`}>
                            {metrics.exposureIndex}%
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getExposureBgColor(metrics.exposureIndex)} ${getExposureColor(metrics.exposureIndex)}`}>
                            {getExposureLabel(metrics.exposureIndex)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-semibold ${getOpportunityColor(metrics.opportunityIndex)}`}>
                            {metrics.opportunityIndex}%
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getOpportunityBgColor(metrics.opportunityIndex)} ${getOpportunityColor(metrics.opportunityIndex)}`}>
                            {getOpportunityLabel(metrics.opportunityIndex)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {metrics.recommendedAISkills.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/training?industry=${industry.id}`}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Training
                          </Link>
                          <Link
                            to={`/jobs?industry=${industry.id}`}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Jobs
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Guidance for Parents Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Parents */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                  👨‍👩‍👧
                </div>
                <h3 className="text-2xl font-bold text-white">Guidance for Parents</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <h4 className="text-white font-medium">Don't fear high exposure</h4>
                    <p className="text-gray-400 text-sm">High AI exposure often means more opportunities for those who adapt. These fields need workers who can collaborate with AI.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <h4 className="text-white font-medium">Look at both metrics together</h4>
                    <p className="text-gray-400 text-sm">The ideal career path has high opportunity and exposure your child is comfortable with.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <h4 className="text-white font-medium">Encourage AI literacy</h4>
                    <p className="text-gray-400 text-sm">Regardless of field, basic AI literacy will be essential. Look for programs that include AI components.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <h4 className="text-white font-medium">Consider transferable skills</h4>
                    <p className="text-gray-400 text-sm">Skills like data analysis, programming, and critical thinking transfer across industries in the AI economy.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Students */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
                  🎓
                </div>
                <h3 className="text-2xl font-bold text-white">Guidance for Students</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <h4 className="text-white font-medium">Follow your interests</h4>
                    <p className="text-gray-400 text-sm">Passion leads to expertise. Choose a field you're genuinely curious about, then add AI skills.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <h4 className="text-white font-medium">Learn to work with AI</h4>
                    <p className="text-gray-400 text-sm">AI won't replace you—someone using AI will. Learn prompt engineering and AI tools in your field.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <h4 className="text-white font-medium">Build a T-shaped skillset</h4>
                    <p className="text-gray-400 text-sm">Deep expertise in one area plus broad knowledge of AI applications makes you highly valuable.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <h4 className="text-white font-medium">Stay adaptable</h4>
                    <p className="text-gray-400 text-sm">The AI landscape changes rapidly. Cultivate a growth mindset and commit to lifelong learning.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Methodology</h2>
            <p className="text-gray-400">
              How we calculate AI Exposure and Opportunity metrics
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Data Sources</h3>
              <p className="text-gray-400 text-sm">
                Our metrics are based on research from the <strong className="text-white">MIT Iceberg Index</strong>,
                the <strong className="text-white">Federal Reserve's AI Occupational Exposure (AIOE)</strong> methodology,
                and labor market data from the Bureau of Labor Statistics. We combine task automation analysis,
                AI tool adoption rates, and salary premium data to create actionable insights.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">AI Exposure Calculation</h3>
              <p className="text-gray-400 text-sm">
                We analyze: (1) <strong className="text-white">Task Automation Risk</strong> - what percentage of job tasks can be performed by AI,
                (2) <strong className="text-white">AI Tool Integration</strong> - how much workers already use AI tools,
                (3) <strong className="text-white">Skill Displacement Rate</strong> - how quickly AI is replacing specific skills,
                and (4) <strong className="text-white">Complementarity Factor</strong> - how well human skills work alongside AI.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">AI Opportunity Calculation</h3>
              <p className="text-gray-400 text-sm">
                We measure: (1) <strong className="text-white">AI Skill Demand</strong> - job postings requiring AI skills,
                (2) <strong className="text-white">Salary Premium</strong> - extra pay for AI-skilled workers,
                (3) <strong className="text-white">Growth Trajectory</strong> - 5-year job growth projections,
                (4) <strong className="text-white">Innovation Potential</strong> - opportunities to create new AI applications,
                and (5) <strong className="text-white">Cross-Industry Mobility</strong> - how transferable AI skills are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your AI-Ready Career?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Explore training programs and job opportunities that will prepare you for success in the AI economy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/training"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all"
              >
                Find Training Programs
              </Link>
              <Link
                to="/workforce-map"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
              >
                Explore Workforce Map
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AICareerGuidePage;
