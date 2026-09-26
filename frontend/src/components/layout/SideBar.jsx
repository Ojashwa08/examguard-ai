import React from 'react';

import {
  LayoutDashboard,
  Activity,
  HardDrive,
  Cpu,
  AlertTriangle,
  RotateCcw,
  Link2,
  Clock,
  Building,
  Network,
  Zap,
  Database,
  RefreshCw,
  UserX,
  FileCode,
} from 'lucide-react';

export const Sidebar = ({
  activeRoute,
  onNavigate,
  onTriggerSimulation,
  simulationActive,
}) => {
  const navGroup = (title, items) => (
    <div className="mb-5">
      <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </div>

      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-blue-600' : 'text-slate-500'
                }`}
              />

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-57px)] flex flex-col justify-between overflow-y-auto p-4 shrink-0">
      <div>
        {navGroup('Operations', [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
          },
          {
            id: 'live-monitor',
            label: 'Live Exam Monitor',
            icon: Activity,
          },
          {
            id: 'infrastructure',
            label: 'Infrastructure Health',
            icon: HardDrive,
          },
          {
            id: 'ai-risk',
            label: 'AI Risk & Prediction',
            icon: Cpu,
          },
        ])}

        {navGroup('Resilience', [
          {
            id: 'incident-command',
            label: 'Incident Command',
            icon: AlertTriangle,
          },
          {
            id: 'disaster-recovery',
            label: 'Disaster Recovery',
            icon: RotateCcw,
          },
          {
            id: 'hash-chain',
            label: 'Hash Chain Integrity',
            icon: Link2,
          },
          {
            id: 'audit-timeline',
            label: 'Audit Timeline',
            icon: Clock,
          },
        ])}

        {navGroup('Examination', [
          {
            id: 'exam-centers',
            label: 'Exam Centers',
            icon: Building,
          },
          {
            id: 'system-architecture',
            label: 'System Architecture',
            icon: Network,
          },
        ])}
      </div>

      {/* Embedded Simulation Controls Panel */}
      <div className="pt-4 border-t border-slate-200">
        <div className="px-1 mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Simulation Controls
          </span>

          {simulationActive && (
            <span
              className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"
              title="Active Simulation Mode"
            ></span>
          )}
        </div>

        <div className="space-y-1">
          {/* Network Failure */}
          <button
            onClick={() => onTriggerSimulation('network')}
            className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-200 rounded transition-colors flex items-center space-x-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Network Failure</span>
          </button>

          {/* CPU Spike */}
          <button
            onClick={() => onTriggerSimulation('cpu')}
            className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-200 rounded transition-colors flex items-center space-x-2"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>CPU Spike</span>
          </button>

          {/* Database Failure */}
          <button
            onClick={() => onTriggerSimulation('database')}
            className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded transition-colors flex items-center space-x-2"
          >
            <Database className="w-3.5 h-3.5 text-red-500" />
            <span>Database Failure</span>
          </button>

          {/* Candidate Disconnect */}
          <button
            onClick={() => onTriggerSimulation('candidate')}
            className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-200 rounded transition-colors flex items-center space-x-2"
          >
            <UserX className="w-3.5 h-3.5 text-amber-500" />
            <span>Disconnects</span>
          </button>

          {/* Tamper Test */}
          <button
            onClick={() => onTriggerSimulation('tamper')}
            className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded transition-colors flex items-center space-x-2"
          >
            <FileCode className="w-3.5 h-3.5 text-red-500" />
            <span>Tamper Test</span>
          </button>

          {/* Restore System */}
          <button
            onClick={() => onTriggerSimulation('restore')}
            className="w-full text-center px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors flex items-center justify-center space-x-1.5 mt-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore System</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;