import React from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

export const InfraHealth = ({
  telemetry = defaultTelemetry,
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header & Refresh Control */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Infrastructure & Node Telemetry</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Cluster
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time raft consensus state, node latency, memory allocation, and database pool health.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors duration-150 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Polling Metrics...' : 'Refresh Telemetry'}</span>
        </button>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Consensus Quorum KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Raft Quorum</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{telemetry.quorumStatus}</span>
            <span className="text-xs text-emerald-600 font-medium block mt-0.5">
              {telemetry.activeNodes} of {telemetry.totalNodes} Nodes Responding
            </span>
          </div>
        </div>

        {/* Average Cluster Latency KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Roundtrip Latency</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{telemetry.avgLatency}ms</span>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">
              P99: {telemetry.p99Latency}ms
            </span>
          </div>
        </div>

        {/* CPU Load KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cluster CPU Load</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{telemetry.cpuUtilization}%</span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  telemetry.cpuUtilization > 85 ? 'bg-red-500' : telemetry.cpuUtilization > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${telemetry.cpuUtilization}%` }}
              />
            </div>
          </div>
        </div>

        {/* DB Connection Pool KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">DB Connection Pool</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{telemetry.dbPoolActive}/{telemetry.dbPoolMax}</span>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">
              {telemetry.dbPoolIdle} Idle Connections
            </span>
          </div>
        </div>

      </div>

      {/* Cluster Node Telemetry Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-800">Node Cluster Status</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Raft Term: #{telemetry.raftTerm}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Node Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Health</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">CPU Utilization</th>
                <th className="py-3 px-4">Memory Used</th>
                <th className="py-3 px-4">Last Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {telemetry.nodes.map((node) => (
                <tr key={node.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-2">
                    <span className="font-mono text-slate-800">{node.name}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      node.role === 'Leader'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {node.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      {node.status === 'healthy' && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-medium text-emerald-700 capitalize">{node.status}</span>
                        </>
                      )}
                      {node.status === 'degraded' && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-medium text-amber-700 capitalize">{node.status}</span>
                        </>
                      )}
                      {node.status === 'offline' && (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="font-medium text-red-700 capitalize">{node.status}</span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {node.latency}ms
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${node.cpu > 80 ? 'bg-red-500' : 'bg-slate-700'}`}
                          style={{ width: `${node.cpu}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-700 font-medium">{node.cpu}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {node.memoryUsed} / {node.memoryTotal} GB
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {node.lastHeartbeat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// Fallback Telemetry Data
const defaultTelemetry = {
  quorumStatus: 'HEALTHY (3/3)',
  activeNodes: 5,
  totalNodes: 5,
  avgLatency: 14,
  p99Latency: 38,
  cpuUtilization: 34,
  dbPoolActive: 18,
  dbPoolMax: 50,
  dbPoolIdle: 32,
  raftTerm: 142,
  nodes: [
    { id: 'n1', name: 'us-east-node-01', role: 'Leader', status: 'healthy', latency: 8, cpu: 28, memoryUsed: '3.2', memoryTotal: '8.0', lastHeartbeat: '200ms ago' },
    { id: 'n2', name: 'us-east-node-02', role: 'Follower', status: 'healthy', latency: 12, cpu: 32, memoryUsed: '3.5', memoryTotal: '8.0', lastHeartbeat: '150ms ago' },
    { id: 'n3', name: 'us-west-node-03', role: 'Follower', status: 'degraded', latency: 145, cpu: 88, memoryUsed: '7.1', memoryTotal: '8.0', lastHeartbeat: '800ms ago' },
    { id: 'n4', name: 'eu-central-node-04', role: 'Follower', status: 'healthy', latency: 22, cpu: 24, memoryUsed: '2.9', memoryTotal: '8.0', lastHeartbeat: '300ms ago' },
    { id: 'n5', name: 'ap-south-node-05', role: 'Replica', status: 'healthy', latency: 18, cpu: 19, memoryUsed: '2.1', memoryTotal: '8.0', lastHeartbeat: '450ms ago' }
  ]
};

export default InfraHealth;