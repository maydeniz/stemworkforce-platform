import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface TrainingProgram {
  id: string;
  title: string;
  provider: string;
  description: string;
  duration: string;
  format: string;
  level: string;
  industries: string[];
  skills: string[];
  cost: number;
  placement_rate: number | null;
  rating: number;
  reviews_count: number;
  certification_type: string | null;
  featured: boolean;
}

const FORMATS = [
  { value: '', label: 'All Formats' },
  { value: 'online', label: 'Online' },
  { value: 'in_person', label: 'In Person' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'self_paced', label: 'Self-Paced' },
];

const LEVELS = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const TrainingPage: React.FC = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState('');
  const [level, setLevel] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, [format, level, freeOnly]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('training_programs')
        .select('*')
        .eq('active', true)
        .order('rating', { ascending: false });

      if (format) {
        query = query.eq('format', format);
      }
      if (level) {
        query = query.eq('level', level);
      }
      if (freeOnly) {
        query = query.eq('cost', 0);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching programs:', error);
        return;
      }

      setPrograms((data as TrainingProgram[]) || []);
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return 'Free';
    return `$${cost.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Training Programs</h1>
          <p className="text-gray-400 text-lg">
            Explore 850+ training programs to advance your STEM career.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FORMATS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="w-4 h-4 rounded border-dark-border bg-dark-bg text-blue-500 focus:ring-blue-500"
              />
              Free Programs Only
            </label>
          </div>
        </div>

        {/* Programs List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : programs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400 text-lg">No training programs found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(program => (
              <Card key={program.id} className="flex flex-col">
                {program.featured && (
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-t-lg -mt-4 -mx-4 mb-4 text-center">
                    FEATURED PROGRAM
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    program.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    program.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    program.level === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {program.level}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    program.cost === 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {formatCost(program.cost)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{program.title}</h3>
                <p className="text-blue-400 text-sm mb-2">{program.provider}</p>
                <p className="text-gray-300 mb-4 flex-1 line-clamp-3">{program.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{program.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white capitalize">{program.format.replace('_', ' ')}</span>
                  </div>
                  {program.placement_rate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Placement Rate:</span>
                      <span className="text-green-400">{program.placement_rate}%</span>
                    </div>
                  )}
                  {program.certification_type && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Certificate:</span>
                      <span className="text-white text-xs">{program.certification_type}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  {renderStars(program.rating)}
                  <span className="text-gray-400 text-sm">
                    ({program.reviews_count.toLocaleString()} reviews)
                  </span>
                </div>

                {program.skills && program.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {program.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-dark-bg text-gray-400 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {program.skills.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{program.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <Button fullWidth className="mt-auto">
                  Enroll Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingPage;
