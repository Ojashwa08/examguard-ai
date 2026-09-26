import React from 'react';
import { 
  Zap, 
  Cpu, 
  Database, 
  UserX, 
  FileCode, 
  RefreshCw, 
  AlertTriangle 
} from 'lucide-react';

export const SimulatorBar = ({ onTriggerSimulation, activeSimulation }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-900/5 flex items-center space-x-3 transition-all duration-200">
      
      {/* Simulation Dock Header */}
      <div className="flex items-center space-x-2 pr-3 border-r border-slate-200">
        <div className="relative flex h-2.5 w-2.5">
          {activeSimulation ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-wider text-slate-800 uppercase">
            Simulator
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {activeSimulation ? 'Event Injected' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Simulation Action Triggers */}
      <div className="flex items-center space-x-1.5">
        
        {/* Network Failure Button */}
        <button
          onClick={() => onTriggerSimulation('network')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
            activeSimulation === 'network'
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border-slate-200 hover:border-amber-200'
          }`}
          title="Simulate Network Degradation & High Latency"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Network</span>
        </button>

        {/* CPU Spike Button */}
        <button
          onClick={() => onTriggerSimulation('cpu')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
            activeSimulation === 'cpu'
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border-slate-200 hover:border-amber-200'
          }`}
          title="Simulate CPU Load Spike & Resource Exhaustion"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-500" />
          <span>CPU Spike</span>
        </button>

        {/* Database Failure Button */}
        <button
          onClick={() => onTriggerSimulation('database')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
            activeSimulation === 'database'
              ? 'bg-red-600 text-white border-red-700 shadow-xs'
              : 'bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border-slate-200 hover:border-red-200'
          }`}
          title="Simulate Primary Database Failover Scenario"
        >
          <Database className="w-3.5 h-3.5 text-red-500" />
          <span>DB Failover</span>
        </button>

        {/* Candidate Disconnect Button */}
        <button
          onClick={() => onTriggerSimulation('candidate')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
            activeSimulation === 'candidate'
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border-slate-200 hover:border-amber-200'
          }`}
          title="Simulate Bulk Candidate Disconnections"
        >
          <UserX className="w-3.5 h-3.5 text-amber-500" />
          <span>Disconnect</span>
        </button>

        {/* Response Tamper Button */}
        <button
          onClick={() => onTriggerSimulation('tamper')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
            activeSimulation === 'tamper'
              ? 'bg-red-600 text-white border-red-700 shadow-xs'
              : 'bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border-slate-200 hover:border-red-200'
          }`}
          title="Simulate Response Ledger Hash Corruption"
        >
          <FileCode className="w-3.5 h-3.5 text-red-500" />
          <span>Tamper Test</span>
        </button>

      </div>

      {/* Restore Baseline Button */}
      <div className="pl-2 border-l border-slate-200">
        <button
          onClick={() => onTriggerSimulation('restore')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all duration-150 shadow-2xs"
          title="Restore System Telemetry to Normal State"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Restore System</span>
        </button>
      </div>

    </div>
  );
};

export default SimulatorBar;