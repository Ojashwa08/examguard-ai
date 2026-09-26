import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export const LiveMonitor = ({ candidateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const defaultCandidates = candidateData || [
    { id: 'EXM-10291', center: 'Bhopal', session: 'Active', latency: '98ms', progress: 72, lastHeartbeat: '12 sec ago', status: 'Healthy' },
    { id: 'EXM-10292', center: 'Indore', session: 'Active', latency: '112ms', progress: 68, lastHeartbeat: '5 sec ago', status: 'Healthy' },
    { id: 'EXM-10293', center: 'Delhi', session: 'Active', latency: '284ms', progress: 45, lastHeartbeat: '42 sec ago', status: 'Warning' },
    { id: 'EXM-10294', center: 'Mumbai', session: 'Active', latency: '85ms', progress: 80, lastHeartbeat: '3 sec ago', status: 'Healthy' },
    { id: 'EXM-10295', center: 'Pune', session: 'Active', latency: '—', progress: 30, lastHeartbeat: '2 min ago', status: 'Disconnected' },
  ];

  const filtered = defaultCandidates.filter((c) => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.center.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Disconnected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      
      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Live Candidate Monitor</h2>
          <p className="text-xs text-slate-500">Real-time candidate connectivity and session status</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
            <input
              type="text"
              placeholder="Search Candidate ID or Center..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs w-64 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1"/>
            {['ALL', 'HEALTHY', 'WARNING', 'DISCONNECTED'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                  statusFilter === f ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
              <th className="py-3 px-4">Candidate ID</th>
              <th className="py-3 px-4">Exam Center</th>
              <th className="py-3 px-4">Session</th>
              <th className="py-3 px-4">Latency</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Last Heartbeat</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.id}</td>
                <td className="py-3 px-4">{item.center}</td>
                <td className="py-3 px-4">{item.session}</td>
                <td className="py-3 px-4 font-mono">{item.latency}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">{item.progress}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-500">{item.lastHeartbeat}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveMonitor;