import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  Terminal, 
  Zap, 
  Cpu, 
  Database, 
  UserX, 
  FileCode,
  Download
} from 'lucide-react';

export const IncidentHub = ({
  incidents = defaultIncidents,
  onAcknowledgeIncident,
  onResolveIncident,
  onExportAuditLog
}) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(incidents[0] || null);

  // Filter logic
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          incident.affectedComponent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">Critical</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200">Warning</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">Info</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-1" />Active</span>;
      case 'acknowledged':
        return <span className="inline-flex items-center text-xs font-semibold text-amber-600">Investigating</span>;
      case 'resolved':
        return <span className="inline-flex items-center text-xs font-semibold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Resolved</span>;
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Incident Command & Telemetry Hub</h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time audit log of system failures, chaos injection events, and automated failover responses.
            </p>
          </div>
        </div>

        <button
          onClick={onExportAuditLog}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors duration-150 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident ID or component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <span className="font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="acknowledged">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Split View: Incident List & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Incident List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recorded Incidents ({filteredIncidents.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No incidents match your current filter parameters.
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className={`p-4 cursor-pointer transition-all duration-150 flex items-start justify-between space-x-3 ${
                    selectedIncident?.id === incident.id
                      ? 'bg-slate-100/80 border-l-4 border-l-slate-900'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500">{incident.id}</span>
                      {getSeverityBadge(incident.severity)}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 truncate">{incident.title}</h3>
                    <p className="text-[11px] text-slate-500 truncate">Component: {incident.affectedComponent}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">{incident.timestamp}</span>
                  </div>

                  <div className="flex flex-col items-end justify-between space-y-2 shrink-0">
                    {getStatusBadge(incident.status)}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Incident Detail View */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs p-6 flex flex-col justify-between h-[600px] overflow-y-auto">
          {selectedIncident ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="pb-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{selectedIncident.id}</span>
                    {getSeverityBadge(selectedIncident.severity)}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedIncident.title}</h2>
                  <span className="text-xs text-slate-500 font-mono">Timestamp: {selectedIncident.timestamp}</span>
                </div>

                <div>
                  {getStatusBadge(selectedIncident.status)}
                </div>
              </div>

              {/* Impact Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Subsystem</span>
                  <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">{selectedIncident.affectedComponent}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mitigation Status</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block capitalize">{selectedIncident.mitigationStrategy}</span>
                </div>
              </div>

              {/* Technical Description & Root Cause */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Diagnostic Analysis</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Simulated Log Output */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <Terminal className="w-3.5 h-3.5 text-amber-500" />
                  <span>Subsystem Log Excerpt</span>
                </div>
                <div className="bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-[11px] space-y-1">
                  <p className="text-slate-500">// Triggered by Chaos Engineering Subsystem</p>
                  <p className="text-amber-400">[WARN] Anomaly detected on {selectedIncident.affectedComponent}</p>
                  <p className="text-red-400">[FAIL] HealthCheckTimeout: {selectedIncident.title}</p>
                  <p className="text-emerald-400">[INFO] Automated failover protocol engaged.</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                {selectedIncident.status === 'active' && (
                  <button
                    onClick={() => onAcknowledgeIncident && onAcknowledgeIncident(selectedIncident.id)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Acknowledge Incident
                  </button>
                )}

                {selectedIncident.status !== 'resolved' && (
                  <button
                    onClick={() => onResolveIncident && onResolveIncident(selectedIncident.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Select an incident from the left panel to inspect diagnostics.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

// Default Fallback Incidents Data
const defaultIncidents = [
  {
    id: 'INC-8921',
    title: 'Primary Database Failover Triggered',
    affectedComponent: 'PostgreSQL-Primary (db-01)',
    severity: 'critical',
    status: 'active',
    timestamp: '2026-09-26 11:42:10 UTC',
    mitigationStrategy: 'Raft Auto-Promote Replica',
    description: 'Simulated connection drop on db-01. Raft consensus initialized automatic failover to read-replica db-02 without data loss.'
  },
  {
    id: 'INC-8919',
    title: 'High Latency Spike on Node-03',
    affectedComponent: 'Cluster Node-03',
    severity: 'warning',
    status: 'acknowledged',
    timestamp: '2026-09-26 11:30:00 UTC',
    mitigationStrategy: 'Traffic Throttling & Reroute',
    description: 'Node CPU spike reached 94% under artificial load. Non-essential candidate WebSocket sync messages throttled.'
  },
  {
    id: 'INC-8904',
    title: 'Candidate Disconnect Burst',
    affectedComponent: 'WebSocket Gateway',
    severity: 'info',
    status: 'resolved',
    timestamp: '2026-09-26 10:15:22 UTC',
    mitigationStrategy: 'Local IndexedDB Backup',
    description: 'Simulated loss of client internet connectivity. 42 candidates transitioned seamlessly to offline local response caching.'
  }
];

export default IncidentHub;