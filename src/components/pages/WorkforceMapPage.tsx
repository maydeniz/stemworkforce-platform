import React, { useState, useEffect, useMemo } from 'react';
import { StateDetailPanel } from '@/components/common/StateDetailPanel';
import {
  industryDefinitions,
  stateNames,
  generateStateIndustries,
  topNuclearStates,
  topHealthcareStates,
} from '@/data/workforceStaticData';
import type { StateData } from '@/data/workforceStaticData';
import { useMapSummary, useStateDetail } from '@/hooks/useWorkforceMap';
import type { MapSummaryRow } from '@/services/workforceMapService';

// State positions for rectangular buttons on map (SVG coordinates)
const statePositions: Record<string, { x: number; y: number }> = {
  WA: { x: 12, y: 8 }, OR: { x: 10, y: 18 }, CA: { x: 8, y: 35 },
  NV: { x: 16, y: 28 }, ID: { x: 18, y: 14 }, MT: { x: 26, y: 8 }, WY: { x: 26, y: 18 },
  UT: { x: 20, y: 28 }, AZ: { x: 18, y: 40 }, CO: { x: 28, y: 28 }, NM: { x: 26, y: 40 },
  ND: { x: 38, y: 8 }, SD: { x: 38, y: 16 }, NE: { x: 40, y: 24 }, KS: { x: 40, y: 32 },
  OK: { x: 42, y: 40 }, TX: { x: 38, y: 50 },
  MN: { x: 48, y: 10 }, IA: { x: 50, y: 20 }, MO: { x: 52, y: 30 }, WI: { x: 54, y: 12 },
  IL: { x: 56, y: 24 },
  AR: { x: 52, y: 40 }, LA: { x: 52, y: 50 },
  MI: { x: 62, y: 14 }, IN: { x: 62, y: 26 }, OH: { x: 68, y: 26 },
  KY: { x: 66, y: 34 }, TN: { x: 64, y: 40 }, MS: { x: 58, y: 48 }, AL: { x: 64, y: 48 },
  WV: { x: 72, y: 32 }, VA: { x: 76, y: 36 }, NC: { x: 78, y: 42 }, SC: { x: 76, y: 48 },
  GA: { x: 70, y: 50 }, FL: { x: 74, y: 58 },
  PA: { x: 76, y: 24 }, NY: { x: 80, y: 16 }, NJ: { x: 82, y: 26 }, MD: { x: 80, y: 32 },
  DE: { x: 84, y: 30 }, CT: { x: 86, y: 20 }, RI: { x: 88, y: 20 }, MA: { x: 88, y: 16 },
  VT: { x: 84, y: 10 }, NH: { x: 86, y: 10 }, ME: { x: 90, y: 6 },
  AK: { x: 8, y: 58 }, HI: { x: 22, y: 62 }
};

// All states are clickable
const allStateCodes = Object.keys(stateNames);

// Color intensity based on job concentration
function getStateColor(row: MapSummaryRow | undefined, isSelected: boolean): string {
  if (isSelected) return '#F5C518';
  if (!row || row.bls_total_jobs === 0) return '#F5C518'; // Default gold for all states
  // Scale color intensity by total jobs
  const jobs = row.bls_total_jobs;
  if (jobs > 100000) return '#F5C518'; // High concentration
  if (jobs > 50000) return '#D4A91A';
  if (jobs > 10000) return '#B08D15';
  return '#8C7110';
}

/**
 * Reusable workforce map content (no page wrapper/header).
 * Used both by the standalone WorkforceMapPage and as an embedded tab in JobsPage.
 */
export const WorkforceMapContent: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Live data hooks
  const { data: summaryResult, isLoading: summaryLoading } = useMapSummary();
  const { data: detailResult, isLoading: detailLoading } = useStateDetail(selectedState);

  const dataSource = summaryResult?.dataSource || 'demo';
  const summaryMap = useMemo(() => {
    const map = new Map<string, MapSummaryRow>();
    if (summaryResult?.data) {
      for (const row of summaryResult.data) {
        map.set(row.state_code, row);
      }
    }
    return map;
  }, [summaryResult]);

  // Compute stats from live data or use static fallback
  const statsBar = useMemo(() => {
    if (summaryResult?.dataSource === 'live' && summaryResult.data.length > 0) {
      const totalJobs = summaryResult.data.reduce((sum, r) => sum + r.bls_total_jobs, 0);
      const totalListings = summaryResult.data.reduce((sum, r) => sum + r.active_listing_count + r.partner_posting_count, 0);
      return {
        totalJobs: totalJobs > 1000000 ? `${(totalJobs / 1000000).toFixed(1)}M+` : `${Math.round(totalJobs / 1000).toLocaleString()}K+`,
        statesCovered: summaryResult.data.filter(r => r.bls_total_jobs > 0).length.toString(),
        activeListings: totalListings.toLocaleString(),
        placementRate: '87%', // Static — no live source for this
      };
    }
    return { totalJobs: '1.2M+', statesCovered: '50', activeListings: '8.5K+', placementRate: '87%' };
  }, [summaryResult]);

  // Build state data from live detail or static fallback
  const selectedStateData: StateData | null = useMemo(() => {
    if (!selectedState) return null;
    if (detailResult?.stateData) return detailResult.stateData;
    // Fallback to static
    return {
      name: stateNames[selectedState] || selectedState,
      industries: generateStateIndustries(selectedState),
    };
  }, [selectedState, detailResult]);

  // Top states: use live data if available, otherwise static
  const liveTopNuclearStates = useMemo(() => {
    if (dataSource !== 'live') return topNuclearStates;
    const rows = summaryResult?.data || [];
    // Find states with most jobs where top_industry contains 'Nuclear'
    const nuclear = rows
      .filter(r => r.bls_total_jobs > 0)
      .sort((a, b) => b.bls_total_jobs - a.bls_total_jobs)
      .slice(0, 4)
      .map(r => ({ abbr: r.state_code, name: r.state_name, jobs: r.bls_total_jobs }));
    return nuclear.length > 0 ? nuclear : topNuclearStates;
  }, [summaryResult, dataSource]);

  const liveTopHealthcareStates = useMemo(() => {
    if (dataSource !== 'live') return topHealthcareStates;
    const rows = summaryResult?.data || [];
    const healthcare = rows
      .filter(r => r.active_listing_count > 0 || r.partner_posting_count > 0)
      .sort((a, b) => (b.active_listing_count + b.partner_posting_count) - (a.active_listing_count + a.partner_posting_count))
      .slice(0, 5)
      .map(r => ({ abbr: r.state_code, name: r.state_name, jobs: r.active_listing_count + r.partner_posting_count }));
    return healthcare.length > 0 ? healthcare : topHealthcareStates;
  }, [summaryResult, dataSource]);

  const availableIndustries = selectedStateData ? Object.keys(selectedStateData.industries) : [];

  useEffect(() => {
    if (selectedStateData && availableIndustries.length > 0) {
      if (!selectedIndustry || !availableIndustries.includes(selectedIndustry)) {
        setSelectedIndustry(availableIndustries[0]);
      }
    } else {
      setSelectedIndustry(null);
    }
  }, [selectedState, selectedStateData]);

  const handleClosePanel = () => {
    setSelectedState(null);
    setSelectedIndustry(null);
  };

  return (
    <>
      {/* Data source badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
          dataSource === 'live'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          {summaryLoading ? 'Loading...' : dataSource === 'live' ? 'Live Data' : 'Demo Data'}
        </div>
      </div>

      {/* Interactive Map Section */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Job Concentration by State
            </h2>
            {selectedState && (
              <span className="text-sm text-gray-400">
                Click on a state to view detailed workforce data
              </span>
            )}
          </div>

          {/* US Map */}
          <div className="relative bg-gray-900 rounded-xl p-4 mb-6 overflow-hidden" style={{ aspectRatio: '2' }}>
            {summaryLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 text-sm animate-pulse">Loading workforce data...</div>
              </div>
            ) : null}
            <svg viewBox="0 0 100 70" className="w-full h-full">
              {Object.entries(statePositions).map(([abbr, pos]) => {
                const isClickable = allStateCodes.includes(abbr);
                const isSelected = selectedState === abbr;
                const summaryRow = summaryMap.get(abbr);
                const fillColor = getStateColor(summaryRow, isSelected);

                return (
                  <g key={abbr} onClick={() => setSelectedState(abbr)} className="cursor-pointer">
                    <rect
                      x={pos.x - 4}
                      y={pos.y - 3}
                      width="8"
                      height="6"
                      rx="1"
                      fill={isClickable ? fillColor : '#374151'}
                      stroke={isSelected ? '#fff' : 'transparent'}
                      strokeWidth="0.5"
                      className="transition-all duration-200"
                      style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(245, 197, 24, 0.6))' : 'none' }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="2.5"
                      fill={isClickable ? '#0a0a0b' : '#9CA3AF'}
                      fontWeight="600"
                      className="pointer-events-none select-none"
                    >
                      {abbr}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-gray-800/95 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-xs mb-2">
                <div className="w-4 h-3 rounded bg-yellow-500"></div>
                <span className="text-gray-300">Click to view details</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-3 rounded bg-gray-600"></div>
                <span className="text-gray-300">No data available</span>
              </div>
            </div>

            {/* Selected state indicator */}
            {selectedState && selectedStateData && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                <span>Viewing: {selectedStateData.name}</span>
                {detailLoading && <span className="animate-spin text-xs">...</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClosePanel();
                  }}
                  className="hover:bg-yellow-600 rounded p-0.5"
                >
                  x
                </button>
              </div>
            )}
          </div>

          {/* Quick Access State Buttons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                Top {dataSource === 'live' ? 'STEM' : 'Nuclear'} States
              </h3>
              <div className="flex flex-wrap gap-2">
                {liveTopNuclearStates.map(state => (
                  <button
                    key={state.abbr}
                    onClick={() => setSelectedState(state.abbr)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedState === state.abbr
                        ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                        : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {state.name} <span className="opacity-70 ml-1">{state.jobs.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                Top {dataSource === 'live' ? 'Active Listings' : 'Healthcare'} States
              </h3>
              <div className="flex flex-wrap gap-2">
                {liveTopHealthcareStates.map(state => (
                  <button
                    key={state.abbr}
                    onClick={() => setSelectedState(state.abbr)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedState === state.abbr
                        ? 'bg-teal-500 text-gray-900 border-teal-500'
                        : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {state.name} <span className="opacity-70 ml-1">{state.jobs.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">{statsBar.totalJobs}</div>
            <div className="text-sm text-gray-400 mt-1">Total STEM Jobs</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{statsBar.statesCovered}</div>
            <div className="text-sm text-gray-400 mt-1">States Covered</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">{statsBar.activeListings}</div>
            <div className="text-sm text-gray-400 mt-1">{dataSource === 'live' ? 'Active Listings' : 'Training Programs'}</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{statsBar.placementRate}</div>
            <div className="text-sm text-gray-400 mt-1">Placement Rate</div>
          </div>
        </div>

      {/* Slide-Out State Detail Panel */}
      {selectedState && selectedStateData && selectedIndustry && (
        <StateDetailPanel
          stateCode={selectedState}
          stateData={selectedStateData}
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
          onClose={handleClosePanel}
          industryDefinitions={industryDefinitions}
          activeListings={detailResult?.listings || []}
          partnerPostings={detailResult?.partnerPostings || []}
          dataSource={detailResult?.dataSource || 'demo'}
        />
      )}
    </>
  );
};

/**
 * Full standalone page wrapper for /workforce-map route
 */
const WorkforceMapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="bg-gradient-to-b from-gray-900 to-transparent px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-block px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-500 text-sm font-medium">
              Workforce Intelligence
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            STEM Workforce <span className="text-yellow-500">Intelligence Map</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore workforce data across states with the highest concentration of emerging technology jobs
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <WorkforceMapContent />
      </div>
    </div>
  );
};

export default WorkforceMapPage;
