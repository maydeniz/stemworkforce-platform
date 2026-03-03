// ===========================================
// Provider Dashboard - Main Component
// ===========================================

// Static color class maps for Tailwind JIT compatibility
const providerColors: Record<string, { iconBg: string; iconText: string }> = {
  emerald: { iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400' },
  blue: { iconBg: 'bg-blue-500/20', iconText: 'text-blue-400' },
  amber: { iconBg: 'bg-amber-500/20', iconText: 'text-amber-400' },
  violet: { iconBg: 'bg-violet-500/20', iconText: 'text-violet-400' },
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Calendar, ClipboardList, Star,
  DollarSign, FileText, Settings, Users,
  ArrowUpRight, ArrowDownRight,
  Plus, Eye, MessageSquare, CreditCard, Download
} from 'lucide-react';

// ===========================================
// TAB COMPONENTS
// ===========================================

// Overview Tab
const OverviewTab: React.FC = () => {
  const stats = [
    { label: 'Total Earnings', value: '$24,850', change: '+18.5%', positive: true, icon: DollarSign, color: 'emerald' },
    { label: 'Active Bookings', value: '12', change: '+3', positive: true, icon: Calendar, color: 'blue' },
    { label: 'Average Rating', value: '4.9', change: '+0.2', positive: true, icon: Star, color: 'amber' },
    { label: 'Total Sessions', value: '156', change: '+24', positive: true, icon: Users, color: 'violet' },
  ];

  const recentBookings = [
    { id: 1, client: 'Michael Chen', service: 'Career Strategy Session', date: 'Jan 5, 2025', time: '2:00 PM', status: 'confirmed' },
    { id: 2, client: 'Sarah Johnson', service: 'Resume Review', date: 'Jan 6, 2025', time: '10:00 AM', status: 'pending' },
    { id: 3, client: 'David Park', service: 'Interview Prep', date: 'Jan 7, 2025', time: '3:00 PM', status: 'confirmed' },
  ];

  const recentReviews = [
    { id: 1, client: 'Jennifer T.', rating: 5, text: 'Excellent coaching session. Very insightful!', date: '2 days ago' },
    { id: 2, client: 'Robert S.', rating: 5, text: 'Best career advice I\'ve received.', date: '4 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${providerColors[stat.color]?.iconBg || 'bg-slate-500/20'}`}>
                <stat.icon size={20} className={providerColors[stat.color]?.iconText || 'text-slate-400'} />
              </div>
              <span className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Upcoming Bookings</h3>
            <Link to="#bookings" className="text-sm text-violet-400 hover:text-violet-300">View all</Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{booking.client}</p>
                  <p className="text-sm text-slate-400">{booking.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{booking.date}</p>
                  <p className="text-xs text-slate-400">{booking.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Reviews</h3>
            <Link to="#reviews" className="text-sm text-violet-400 hover:text-violet-300">View all</Link>
          </div>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{review.client}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-300">{review.text}</p>
                <p className="text-xs text-slate-500 mt-2">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-colors">
            <Plus size={24} className="mx-auto text-violet-400 mb-2" />
            <span className="text-sm text-white">Add Service</span>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-colors">
            <Calendar size={24} className="mx-auto text-blue-400 mb-2" />
            <span className="text-sm text-white">Update Availability</span>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-colors">
            <MessageSquare size={24} className="mx-auto text-emerald-400 mb-2" />
            <span className="text-sm text-white">View Messages</span>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-colors">
            <Download size={24} className="mx-auto text-amber-400 mb-2" />
            <span className="text-sm text-white">Download Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Services Tab
const ServicesTab: React.FC = () => {
  const services = [
    { id: 1, title: 'Career Strategy Session', type: 'hourly', price: 350, duration: 60, bookings: 45, status: 'active' },
    { id: 2, title: 'Resume & LinkedIn Transformation', type: 'fixed', price: 1500, duration: null, bookings: 28, status: 'active' },
    { id: 3, title: 'Interview Preparation Intensive', type: 'package', price: 2500, duration: null, bookings: 15, status: 'active' },
    { id: 4, title: 'Salary Negotiation Coaching', type: 'fixed', price: 800, duration: null, bookings: 22, status: 'active' },
    { id: 5, title: '90-Day Executive Transition Program', type: 'package', price: 8500, duration: null, bookings: 8, status: 'draft' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Services</h2>
          <p className="text-slate-400 text-sm">Manage your service offerings and pricing</p>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-sm font-medium text-slate-400">Service</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Type</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Price</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Bookings</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
              <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                <td className="p-4">
                  <span className="font-medium text-white">{service.title}</span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs capitalize">
                    {service.type}
                  </span>
                </td>
                <td className="p-4 text-white">${service.price.toLocaleString()}</td>
                <td className="p-4 text-slate-300">{service.bookings}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-slate-400 hover:text-white p-1">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Scheduling Tab
const SchedulingTab: React.FC = () => {
  const availability = [
    { day: 'Monday', slots: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'] },
    { day: 'Tuesday', slots: ['10:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'] },
    { day: 'Wednesday', slots: ['9:00 AM - 12:00 PM'] },
    { day: 'Thursday', slots: ['2:00 PM - 6:00 PM'] },
    { day: 'Friday', slots: ['9:00 AM - 3:00 PM'] },
    { day: 'Saturday', slots: [] },
    { day: 'Sunday', slots: [] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Availability & Scheduling</h2>
          <p className="text-slate-400 text-sm">Set your available hours for client bookings</p>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Weekly Availability</h3>
          <div className="space-y-3">
            {availability.map((day) => (
              <div key={day.day} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="font-medium text-white w-28">{day.day}</span>
                <div className="flex-1 flex flex-wrap gap-2 justify-end">
                  {day.slots.length > 0 ? (
                    day.slots.map((slot, i) => (
                      <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">Unavailable</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Blocked Dates</h3>
            <button className="text-sm text-violet-400 hover:text-violet-300">+ Add Date</button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white">Jan 15-20, 2025</p>
                <p className="text-xs text-slate-400">Vacation</p>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white">Feb 1, 2025</p>
                <p className="text-xs text-slate-400">Conference</p>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
            </div>
          </div>
        </div>
      </div>

      {/* Timezone */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Timezone Settings</h3>
        <select className="w-full md:w-80 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
          <option>America/Los_Angeles (Pacific Time)</option>
          <option>America/New_York (Eastern Time)</option>
          <option>America/Chicago (Central Time)</option>
          <option>Europe/London (GMT)</option>
        </select>
      </div>
    </div>
  );
};

// Bookings Tab
const BookingsTab: React.FC = () => {
  const bookings = [
    { id: 'BK001', client: 'Michael Chen', service: 'Career Strategy Session', date: 'Jan 5, 2025', time: '2:00 PM', status: 'confirmed', amount: 350 },
    { id: 'BK002', client: 'Sarah Johnson', service: 'Resume Review', date: 'Jan 6, 2025', time: '10:00 AM', status: 'pending', amount: 1500 },
    { id: 'BK003', client: 'David Park', service: 'Interview Prep', date: 'Jan 7, 2025', time: '3:00 PM', status: 'confirmed', amount: 2500 },
    { id: 'BK004', client: 'Lisa Wong', service: 'Salary Negotiation', date: 'Jan 8, 2025', time: '11:00 AM', status: 'completed', amount: 800 },
    { id: 'BK005', client: 'James Lee', service: 'Career Strategy Session', date: 'Jan 3, 2025', time: '4:00 PM', status: 'completed', amount: 350 },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Bookings</h2>
          <p className="text-slate-400 text-sm">Manage your client sessions and appointments</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
            <option>All Statuses</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-sm font-medium text-slate-400">Booking ID</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Client</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Service</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Date & Time</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
              <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                <td className="p-4 text-slate-300 font-mono text-sm">{booking.id}</td>
                <td className="p-4 text-white">{booking.client}</td>
                <td className="p-4 text-slate-300">{booking.service}</td>
                <td className="p-4">
                  <p className="text-white">{booking.date}</p>
                  <p className="text-xs text-slate-400">{booking.time}</p>
                </td>
                <td className="p-4 text-white">${booking.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-violet-400 hover:text-violet-300 text-sm">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Evaluations Tab
const EvaluationsTab: React.FC = () => {
  const reviews = [
    { id: 1, client: 'Michael R.', rating: 5, title: 'Landed my dream role', text: 'Sarah\'s coaching was transformative...', date: '2024-12-15', responded: true },
    { id: 2, client: 'Jennifer T.', rating: 5, title: 'Worth every penny', text: 'I was skeptical but Sarah delivered...', date: '2024-11-28', responded: false },
    { id: 3, client: 'David K.', rating: 5, title: 'Expert guidance', text: 'Transitioning from finance to tech seemed impossible...', date: '2024-11-10', responded: true },
    { id: 4, client: 'Lisa M.', rating: 4, title: 'Great coaching', text: 'Sarah is exceptional at what she does...', date: '2024-10-22', responded: false },
  ];

  const ratingStats = { 5: 85, 4: 12, 3: 2, 2: 1, 1: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Reviews & Ratings</h2>
          <p className="text-slate-400 text-sm">Monitor and respond to client feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-white">4.9</div>
            <div className="flex items-center justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-400 text-sm">156 total reviews</p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-slate-400 w-8">{rating}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${ratingStats[rating as keyof typeof ratingStats]}%` }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-10">{ratingStats[rating as keyof typeof ratingStats]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{review.client}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{review.date}</p>
                </div>
                {review.responded ? (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Responded</span>
                ) : (
                  <button className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded text-xs">
                    Respond
                  </button>
                )}
              </div>
              <h4 className="font-medium text-white mb-1">{review.title}</h4>
              <p className="text-slate-300 text-sm">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Earnings Tab
const EarningsTab: React.FC = () => {
  const payouts = [
    { id: 'PO001', period: 'Dec 23-29, 2024', gross: 4200, fees: 630, net: 3570, status: 'paid', date: 'Jan 2, 2025' },
    { id: 'PO002', period: 'Dec 16-22, 2024', gross: 3850, fees: 578, net: 3272, status: 'paid', date: 'Dec 26, 2024' },
    { id: 'PO003', period: 'Dec 9-15, 2024', gross: 5100, fees: 765, net: 4335, status: 'paid', date: 'Dec 19, 2024' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Earnings & Payouts</h2>
          <p className="text-slate-400 text-sm">Track your earnings and payout history</p>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-emerald-400">$2,450</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Pending Earnings</p>
          <p className="text-2xl font-bold text-white">$1,850</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">This Month</p>
          <p className="text-2xl font-bold text-white">$8,320</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Lifetime Earnings</p>
          <p className="text-2xl font-bold text-white">$124,850</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Payout History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-sm font-medium text-slate-400">Payout ID</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Period</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Gross</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Fees</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Net</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                <td className="p-4 text-slate-300 font-mono text-sm">{payout.id}</td>
                <td className="p-4 text-white">{payout.period}</td>
                <td className="p-4 text-white">${payout.gross.toLocaleString()}</td>
                <td className="p-4 text-red-400">-${payout.fees}</td>
                <td className="p-4 text-emerald-400 font-medium">${payout.net.toLocaleString()}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs capitalize">
                    {payout.status}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{payout.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Billing Documents Tab
const BillingDocsTab: React.FC = () => {
  const documents = [
    { id: 1, type: '1099-NEC', year: 2024, status: 'available', date: 'Jan 15, 2025' },
    { id: 2, type: '1099-NEC', year: 2023, status: 'available', date: 'Jan 15, 2024' },
    { id: 3, type: 'W-9', year: 2024, status: 'verified', date: 'Mar 1, 2024' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Tax Documents</h2>
          <p className="text-slate-400 text-sm">Access your tax forms and billing documents</p>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors">
          Submit W-9
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Available Documents</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-violet-400" />
                  <div>
                    <p className="font-medium text-white">{doc.type}</p>
                    <p className="text-xs text-slate-400">Tax Year {doc.year}</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Tax Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">W-9 Status</span>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tax ID (last 4)</span>
              <span className="text-white font-mono">****1234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">2024 Earnings</span>
              <span className="text-white">$124,850</span>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              1099-NEC forms are issued by January 31st for the previous tax year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Account Settings</h2>
        <p className="text-slate-400 text-sm">Manage your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                defaultValue="Dr. Sarah Mitchell"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Title</label>
              <input
                type="text"
                defaultValue="Executive Career Strategist"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Bio</label>
              <textarea
                rows={4}
                defaultValue="Former VP of Talent at Fortune 100 companies..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Payout Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-violet-400" />
                  <div>
                    <p className="font-medium text-white">Bank Account</p>
                    <p className="text-xs text-slate-400">****1234 (Chase)</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Connected</span>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Payout Schedule</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                  <option>Weekly (Every Monday)</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-slate-300">New booking notifications</span>
                <input type="checkbox" defaultChecked className="form-checkbox" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-slate-300">Review notifications</span>
                <input type="checkbox" defaultChecked className="form-checkbox" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-slate-300">Payout notifications</span>
                <input type="checkbox" defaultChecked className="form-checkbox" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-slate-300">Marketing emails</span>
                <input type="checkbox" className="form-checkbox" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const ProviderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: ClipboardList },
    { id: 'evaluations', label: 'Evaluations', icon: Star },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'billing-docs', label: 'Tax Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'services': return <ServicesTab />;
      case 'scheduling': return <SchedulingTab />;
      case 'bookings': return <BookingsTab />;
      case 'evaluations': return <EvaluationsTab />;
      case 'earnings': return <EarningsTab />;
      case 'billing-docs': return <BillingDocsTab />;
      case 'settings': return <SettingsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage your services, bookings, and earnings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ProviderDashboard;
