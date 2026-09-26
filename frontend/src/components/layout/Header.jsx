import React from 'react';
import { Shield } from 'lucide-react';

export const Header = ({ activeTab, setActiveTab, systemTime, isLive = true }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Left: Platform Logo & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
            <Shield className="w-5 h-5 text-blue-600"/>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-slate-900 tracking-tight text-base">EXAMGUARD AI</h1>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-medium border border-slate-200">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Intelligent Examination Reliability & Continuity Platform
            </p>
          </div>
        </div>

        {/* Center: Portal Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
              activeTab === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NOC Command Center
          </button>
          <button
            onClick={() => setActiveTab('candidate')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
              activeTab === 'candidate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Candidate Exam Portal
          </button>
        </div>

        {/* Right: Real-time System Heartbeat */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>System Live</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Last updated: <span className="text-slate-700 font-medium">{systemTime}</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;