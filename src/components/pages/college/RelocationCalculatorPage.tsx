// ===========================================
// Relocation Calculator Page - College Students
// Cost of living by city comparison
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Home,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Sun,
  Calculator,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface City {
  id: string;
  name: string;
  state: string;
  costIndex: number;
  avgRent: number;
  avgSalary: number;
  taxRate: number;
  techJobs: number;
  climate: string;
  highlights: string[];
}

// ===========================================
// SAMPLE DATA
// ===========================================
const CITIES: City[] = [
  {
    id: 'sf',
    name: 'San Francisco',
    state: 'CA',
    costIndex: 180,
    avgRent: 3500,
    avgSalary: 165000,
    taxRate: 37,
    techJobs: 95000,
    climate: 'Mild year-round',
    highlights: ['Tech hub', 'High salaries', 'Diverse culture'],
  },
  {
    id: 'nyc',
    name: 'New York City',
    state: 'NY',
    costIndex: 170,
    avgRent: 3200,
    avgSalary: 155000,
    taxRate: 38,
    techJobs: 85000,
    climate: 'Four seasons',
    highlights: ['Finance + Tech', 'Public transit', 'Culture'],
  },
  {
    id: 'seattle',
    name: 'Seattle',
    state: 'WA',
    costIndex: 145,
    avgRent: 2500,
    avgSalary: 155000,
    taxRate: 30,
    techJobs: 75000,
    climate: 'Rainy, mild',
    highlights: ['No state income tax', 'Amazon/Microsoft', 'Outdoors'],
  },
  {
    id: 'austin',
    name: 'Austin',
    state: 'TX',
    costIndex: 110,
    avgRent: 1800,
    avgSalary: 130000,
    taxRate: 28,
    techJobs: 55000,
    climate: 'Hot summers',
    highlights: ['No state income tax', 'Growing tech scene', 'Music'],
  },
  {
    id: 'denver',
    name: 'Denver',
    state: 'CO',
    costIndex: 115,
    avgRent: 2000,
    avgSalary: 125000,
    taxRate: 32,
    techJobs: 40000,
    climate: 'Sunny, cold winters',
    highlights: ['Outdoor lifestyle', 'Growing tech', 'Mountains'],
  },
  {
    id: 'boston',
    name: 'Boston',
    state: 'MA',
    costIndex: 140,
    avgRent: 2800,
    avgSalary: 145000,
    taxRate: 34,
    techJobs: 45000,
    climate: 'Four seasons',
    highlights: ['Biotech hub', 'Universities', 'History'],
  },
  {
    id: 'rtp',
    name: 'Research Triangle',
    state: 'NC',
    costIndex: 95,
    avgRent: 1500,
    avgSalary: 115000,
    taxRate: 30,
    techJobs: 35000,
    climate: 'Mild',
    highlights: ['Affordable', 'Research focus', 'Growing'],
  },
  {
    id: 'remote',
    name: 'Remote (Avg US)',
    state: 'US',
    costIndex: 100,
    avgRent: 1500,
    avgSalary: 125000,
    taxRate: 28,
    techJobs: 0,
    climate: 'Your choice',
    highlights: ['Flexibility', 'Lower costs', 'Work-life balance'],
  },
];

// ===========================================
// COMPONENT
// ===========================================
const RelocationCalculatorPage: React.FC = () => {
  const [fromCity, setFromCity] = useState<string>('sf');
  const [toCity, setToCity] = useState<string>('austin');
  const [salary, setSalary] = useState<number>(150000);

  const from = CITIES.find(c => c.id === fromCity)!;
  const to = CITIES.find(c => c.id === toCity)!;

  const adjustmentFactor = to.costIndex / from.costIndex;
  const equivalentSalary = Math.round(salary * adjustmentFactor);
  const monthlyDiff = Math.round((from.avgRent - to.avgRent) * 12);
  const taxDiff = Math.round(salary * (from.taxRate - to.taxRate) / 100);
  const totalSavings = monthlyDiff + taxDiff;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-gray-950 to-red-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-orange-400 mb-4">
            <Link to="/college/government-careers" className="hover:underline">Government & Finance</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Relocation Calculator</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Relocation
              <span className="text-orange-400"> Calculator</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Compare cost of living between cities. Understand what your salary is really worth
              and make informed decisions about where to live and work.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Calculator */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Compare Locations</h2>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* From City */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Moving From</label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              >
                {CITIES.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-8 h-8 text-orange-400" />
            </div>

            {/* To City */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Moving To</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              >
                {CITIES.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm text-gray-400 mb-2">
              Your Current Salary: ${salary.toLocaleString()}
            </label>
            <input
              type="range"
              min="50000"
              max="300000"
              step="5000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <h4 className="text-sm text-gray-400 mb-2">Equivalent Salary Needed</h4>
              <div className={`text-3xl font-bold ${equivalentSalary < salary ? 'text-green-400' : 'text-red-400'}`}>
                ${equivalentSalary.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                To maintain same lifestyle in {to.name}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <h4 className="text-sm text-gray-400 mb-2">Annual Housing Difference</h4>
              <div className={`text-3xl font-bold ${monthlyDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {monthlyDiff > 0 ? '+' : ''}{monthlyDiff.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monthlyDiff > 0 ? 'Save' : 'Spend'} per year on housing
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <h4 className="text-sm text-gray-400 mb-2">Tax Difference</h4>
              <div className={`text-3xl font-bold ${taxDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {taxDiff > 0 ? '+' : ''}{taxDiff.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {taxDiff > 0 ? 'Save' : 'Pay more'} in taxes
              </p>
            </div>
          </div>

          {totalSavings !== 0 && (
            <div className={`mt-6 p-4 rounded-xl text-center ${totalSavings > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <span className={`text-lg font-semibold ${totalSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                Moving to {to.name} could {totalSavings > 0 ? 'save' : 'cost'} you ${Math.abs(totalSavings).toLocaleString()}/year
              </span>
            </div>
          )}
        </div>

        {/* City Comparison */}
        <h2 className="text-2xl font-bold text-white mb-6">City Comparison</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[from, to].map((city, i) => (
            <div key={city.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className={`w-6 h-6 ${i === 0 ? 'text-blue-400' : 'text-orange-400'}`} />
                <div>
                  <h3 className="text-lg font-semibold text-white">{city.name}, {city.state}</h3>
                  <span className="text-sm text-gray-400">Cost Index: {city.costIndex}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Home className="w-4 h-4" />
                    Avg Rent
                  </div>
                  <div className="text-white font-semibold">${city.avgRent.toLocaleString()}/mo</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Avg Tech Salary
                  </div>
                  <div className="text-white font-semibold">${city.avgSalary.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Effective Tax Rate
                  </div>
                  <div className="text-white font-semibold">{city.taxRate}%</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Sun className="w-4 h-4" />
                    Climate
                  </div>
                  <div className="text-white font-semibold text-sm">{city.climate}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {city.highlights.map((h, j) => (
                  <span key={j} className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* All Cities Grid */}
        <h2 className="text-2xl font-bold text-white mb-6">All Tech Hubs</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900/50 rounded-xl border border-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">City</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Cost Index</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Avg Rent</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Avg Salary</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Tax Rate</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Tech Jobs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {CITIES.filter(c => c.id !== 'remote').map(city => (
                <tr key={city.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{city.name}</div>
                    <div className="text-sm text-gray-500">{city.state}</div>
                  </td>
                  <td className={`px-6 py-4 text-right ${
                    city.costIndex > 120 ? 'text-red-400' : city.costIndex < 110 ? 'text-green-400' : 'text-white'
                  }`}>
                    {city.costIndex}%
                  </td>
                  <td className="px-6 py-4 text-right text-white">${city.avgRent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-white">${city.avgSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-white">{city.taxRate}%</td>
                  <td className="px-6 py-4 text-right text-white">{city.techJobs.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-2xl border border-orange-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Planning Your Move?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Use our budget planner to map out your finances in your new city.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/budget-planner"
              className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Budget Planner
            </Link>
            <Link
              to="/college/offer-compare"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Compare Offers
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelocationCalculatorPage;
