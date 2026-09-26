import React, { useState } from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  HardDrive, 
  Server, 
  Terminal,
  FileCheck
} from 'lucide-react';

export const RecoveryView = ({
  nodes = [],
  ledgerStatus = 'healthy',
  onInitiateRecovery,
  onVerifyLedger,
  isRecovering = false
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [logs, setLogs] = useState([
    { timestamp: '10:42:01', level: 'INFO', text: 'Consensus health check completed across 5 nodes.' },
    { timestamp: '10:41:15', level: 'WARN', text: 'Node-03 latency spike detected (1420ms).' },
    { timestamp: '10:40:00', level: 'INFO', text: 'Ledger hash verification passed. Block height: #14,892.' }
  ]);

  const handleRunRecovery = (nodeId) => {
    if (onInitiateRecovery) {
      onInitiateRecovery(nodeId);
    }
    setLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        level: 'ACTION',
        text: `Triggered emergency re-sync protocol for Node [${nodeId || 'ALL'}].`
      },
      ...prev
    ]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Disaster Recovery & Node Resync</h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitor raft consensus integrity, resolve state divergence, and trigger emergency node recovery protocols.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onVerifyLedger}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
          >
            <FileCheck className="w-4 h-4 text-slate-600" />
            <span>Verify Ledger Integrity</span>
          </button>
          
          <button
            onClick={() => handleRunRecovery(null)}
            disabled={isRecovering}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors shadow-xs ${
              isRecovering
                ? 'bg-amber-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 border border-amber-700'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${isRecovering ? 'animate-spin' : ''}`} />
            <span>{isRecovering ? 'Executing Global Resync...' : 'Trigger Full Cluster Resync'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Node Health & Recovery Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cluster Node Status List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-800">Cluster Node State</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Active Nodes: {nodes.filter((n) => n.status === 'online').length} / {nodes.length || 5}
            </span>
          </div>

          <div className="space-y-3">
            {(nodes.length > 0 ? nodes : defaultNodes).map((node) => (
              <div
                key={node.id}
                className={`p-4 rounded-lg border transition-all duration-150 flex items-center justify-between ${
                  node.status === 'degraded' || node.status === 'desynced'
                    ? 'bg-amber-50/50 border-amber-200'
                    : node.status === 'offline'
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <HardDrive className="w-5 h-5 text-slate-600" />
                    <span
                      className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        node.status === 'online'
                          ? 'bg-emerald-500'
                          : node.status === 'degraded'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{node.name}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                        {node.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Hash: {node.lastBlockHash ? node.lastBlockHash.substring(0, 16) : '0x8f2a...1a4'} | Height: #{node.blockHeight || 14892}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-xs font-semibold block text-slate-700">
                      {node.latency ? `${node.latency}ms` : '12ms'}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{node.status}</span>
                  </div>

                  <button
                    onClick={() => handleRunRecovery(node.id)}
                    disabled={isRecovering}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors shadow-2xs"
                  >
                    Resync
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ledger Integrity Summary & Quick Diagnostics */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Database className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-800">Ledger Health</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-900">Cryptographic Proof</span>
                </div>
                <span className="text-xs font-bold text-emerald-700">VALID</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">Current Root Hash</span>
                <p className="text-xs font-mono font-semibold text-slate-800 break-all">
                  0xa4f82b991c0e3a22f719481bc1d88203f194726
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">Active Consensus Algorithm</span>
                <p className="text-xs font-semibold text-slate-800">Raft Consensus (3/5 Quorum)</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Terminal Live Recovery Log Output */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-200">Recovery Audit Terminal Output</span>
          </div>
          <span className="text-[10px] text-slate-500">Live Telemetry Feed</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs text-slate-300">
          {logs.map((log, index) => (
            <div key={index} className="flex space-x-3 items-start">
              <span className="text-slate-500 select-none">{log.timestamp}</span>
              <span
                className={`font-bold px-1 rounded text-[10px] ${
                  log.level === 'WARN'
                    ? 'bg-amber-950 text-amber-400'
                    : log.level === 'ACTION'
                    ? 'bg-sky-950 text-sky-400'
                    : 'bg-emerald-950 text-emerald-400'
                }`}
              >
                {log.level}
              </span>
              <span className="text-slate-300 flex-1">{log.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// Fallback Node Data for standard display
const defaultNodes = [
  { id: 'node-01', name: 'Node-01 (Primary Leader)', role: 'Leader', status: 'online', latency: 8, blockHeight: 14892 },
  { id: 'node-02', name: 'Node-02 (Follower)', role: 'Follower', status: 'online', latency: 14, blockHeight: 14892 },
  { id: 'node-03', name: 'Node-03 (Follower)', role: 'Follower', status: 'degraded', latency: 420, blockHeight: 14890 },
  { id: 'node-04', name: 'Node-04 (Follower)', role: 'Follower', status: 'online', latency: 19, blockHeight: 14892 },
  { id: 'node-05', name: 'Node-05 (Read Replica)', role: 'Replica', status: 'online', latency: 11, blockHeight: 14892 }
];

export default RecoveryView;