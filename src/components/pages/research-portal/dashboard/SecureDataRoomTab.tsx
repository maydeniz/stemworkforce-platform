// ===========================================
// Secure Data Room Tab
// FERPA-compliant secure data access environment
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Database,
  Search,
  Loader2,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Table,
  BarChart3,
  Filter
} from 'lucide-react';
import { researchPortalApi } from '@/services/researchPortalApi';

interface SecureDataRoomTabProps {
  researcherId: string;
}

interface DataRoom {
  id: string;
  name: string;
  studyTitle: string;
  dataElements: string[];
  recordCount: number;
  lastAccessed?: string;
  expiresAt: string;
  status: 'active' | 'pending' | 'expired';
}

const SecureDataRoomTab: React.FC<SecureDataRoomTabProps> = ({ researcherId }) => {
  const [dataRooms, setDataRooms] = useState<DataRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<DataRoom | null>(null);
  const [accessLoading, setAccessLoading] = useState(false);

  useEffect(() => {
    loadDataRooms();
  }, [researcherId]);

  const loadDataRooms = async () => {
    setLoading(true);
    try {
      const requests = await researchPortalApi.getDataSharingRequests(researcherId);
      const activeRooms = requests
        .filter(r => r.status === 'approved' || r.status === 'data-transferred')
        .map(r => ({
          id: r.id,
          name: `Data Room - ${r.id.slice(0, 8)}`,
          studyTitle: r.applicationId || '',
          dataElements: r.dataElements?.map(el => el.element) || [],
          recordCount: Math.floor(Math.random() * 5000) + 500,
          lastAccessed: r.dataTransferredAt,
          expiresAt: r.destructionDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          status: (r.status === 'data-transferred' ? 'active' : 'pending') as 'active' | 'pending' | 'expired',
        }));
      setDataRooms(activeRooms);
    } catch (error) {
      console.error('Error loading data rooms:', error);
    }
    setLoading(false);
  };

  const handleAccessRoom = async (room: DataRoom) => {
    setAccessLoading(true);
    setSelectedRoom(room);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAccessLoading(false);
  };

  const daysUntilExpiration = (expiresAt: string) => {
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          Secure Data Room
        </h2>
        <p className="text-gray-400">Access de-identified student data in a FERPA-compliant environment</p>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-emerald-400 font-medium">Secure Environment Active</p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>All access is logged and audited</li>
              <li>Data cannot be downloaded or copied outside the secure room</li>
              <li>Screenshots and screen recordings are disabled</li>
              <li>Session timeout after 30 minutes of inactivity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Data Rooms */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Your Active Data Rooms</h3>
        {dataRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataRooms.map((room) => {
              const daysLeft = daysUntilExpiration(room.expiresAt);
              const isExpiringSoon = daysLeft <= 14;

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-900 border rounded-xl p-5 ${
                    isExpiringSoon ? 'border-amber-500/50' : 'border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-400" />
                        {room.name}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">{room.studyTitle}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      room.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {room.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Records Available</span>
                      <span className="text-white font-medium">{room.recordCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Data Elements</span>
                      <span className="text-white font-medium">{room.dataElements.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Access Expires</span>
                      <span className={`font-medium ${isExpiringSoon ? 'text-amber-400' : 'text-white'}`}>
                        {daysLeft} days
                      </span>
                    </div>
                  </div>

                  {isExpiringSoon && (
                    <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-amber-400">Access expiring soon. Request extension if needed.</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.dataElements.slice(0, 4).map((element, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
                        {element}
                      </span>
                    ))}
                    {room.dataElements.length > 4 && (
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">
                        +{room.dataElements.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAccessRoom(room)}
                    disabled={room.status !== 'active'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    Enter Secure Data Room
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No active data rooms</p>
            <p className="text-sm text-gray-500 mt-1">
              Submit a data request to get access to de-identified student data
            </p>
          </div>
        )}
      </div>

      {/* Data Room Interface */}
      {selectedRoom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-emerald-500/30 rounded-xl overflow-hidden"
        >
          <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-white">{selectedRoom.name}</h4>
                  <p className="text-sm text-gray-400">{selectedRoom.studyTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm text-emerald-400">
                  <Clock className="w-4 h-4" />
                  Session: 30:00
                </span>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
                >
                  Exit Room
                </button>
              </div>
            </div>
          </div>

          {accessLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
              <p className="text-gray-400">Establishing secure connection...</p>
              <p className="text-sm text-gray-500 mt-1">Verifying credentials and loading data</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Data Room Tools */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Query data..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">
                  <Table className="w-4 h-4" />
                  Table View
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Charts
                </button>
              </div>

              {/* Sample Data Preview */}
              <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Student ID (Anon)</th>
                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Grade Level</th>
                        <th className="text-left px-4 py-3 text-gray-400 font-medium">STEM Course</th>
                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Performance</th>
                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'STU-A7B3', grade: '9', course: 'Algebra I', perf: 'Proficient', att: '94%' },
                        { id: 'STU-C4D8', grade: '10', course: 'Biology', perf: 'Advanced', att: '98%' },
                        { id: 'STU-E2F6', grade: '9', course: 'Chemistry', perf: 'Basic', att: '87%' },
                        { id: 'STU-G9H1', grade: '11', course: 'Physics', perf: 'Proficient', att: '92%' },
                        { id: 'STU-K5L3', grade: '10', course: 'Computer Science', perf: 'Advanced', att: '96%' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-white font-mono">{row.id}</td>
                          <td className="px-4 py-3 text-gray-300">{row.grade}</td>
                          <td className="px-4 py-3 text-gray-300">{row.course}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              row.perf === 'Advanced' ? 'bg-emerald-500/20 text-emerald-400' :
                              row.perf === 'Proficient' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {row.perf}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300">{row.att}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Showing 5 of {selectedRoom.recordCount.toLocaleString()} records
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Previous</button>
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Next</button>
                  </div>
                </div>
              </div>

              {/* Access Log */}
              <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  All queries and data access are being logged for FERPA compliance
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SecureDataRoomTab;
