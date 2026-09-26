import React, { useState, useMemo } from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  BadgeCheck,
  Search,
  Filter,
  Download,
  Lock,
  Cpu,
  UserCheck,
  Server,
  FileCheck,
  RefreshCw,
  Clock,
  ExternalLink,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Database,
  Link2,
  Layers,
  ArrowRight
} from 'lucide-react';

// --- Demo Audit Events Dataset ---
const MOCK_EVENTS = [
  {
    id: 'EVT-2026-98421',
    timestamp: '10:42:18',
    date: '2026-09-27',
    category: 'AI Detection',
    title: 'Candidate risk score recalculated',
    description: 'Candidate CND-4821 risk score changed from 08 to 12 based on ambient audio anomaly detection.',
    source: 'AI-Risk-Engine',
    actor: 'System (AI-Automated)',
    severity: 'Info',
    verified: true,
    blockHeight: 18421,
    prevHash: '0x8f4a21...93c1',
    currHash: '0x3e1d90...41b8'
  },
  {
    id: 'EVT-2026-98420',
    timestamp: '10:39:04',
    date: '2026-09-27',
    category: 'Authentication',
    title: 'Proctor authenticated successfully',
    description: 'Admin session established from Center BPL-04 using multi-factor biometric key.',
    source: 'Auth-Service',
    actor: 'Proctor-BPL-Admin',
    severity: 'Info',
    verified: true,
    blockHeight: 18420,
    prevHash: '0x1c8b32...02f4',
    currHash: '0x8f4a21...93c1'
  },
  {
    id: 'EVT-2026-98419',
    timestamp: '10:34:51',
    date: '2026-09-27',
    category: 'Infrastructure',
    title: 'Edge node latency increased',
    description: 'Node EDGE-BPL-07 reported 84ms latency. Secondary routing bypass automatically primed.',
    source: 'Infra-Monitor',
    actor: 'Auto-Scaler',
    severity: 'Warning',
    verified: true,
    blockHeight: 18419,
    prevHash: '0x7a9d00...84e2',
    currHash: '0x1c8b32...02f4'
  },
  {
    id: 'EVT-2026-98418',
    timestamp: '10:28:12',
    date: '2026-09-27',
    category: 'Examination',
    title: 'Exam session started',
    description: 'Session EXM-2026-0912 started with 184 active candidates at Frankfurt Center.',
    source: 'Session-Manager',
    actor: 'System Auto-Scheduler',
    severity: 'Info',
    verified: true,
    blockHeight: 18418,
    prevHash: '0x4e2c99...11a0',
    currHash: '0x7a9d00...84e2'
  },
  {
    id: 'EVT-2026-98417',
    timestamp: '10:21:33',
    date: '2026-09-27',
    category: 'Security',
    title: 'Integrity verification completed',
    description: 'Hash chain block #18,421 verified successfully with zero state discrepancies.',
    source: 'Ledger-Audit-Service',
    actor: 'Merkle-Validator-Daemon',
    severity: 'Info',
    verified: true,
    blockHeight: 18417,
    prevHash: '0x2b0f44...33c9',
    currHash: '0x4e2c99...11a0'
  },
  {
    id: 'EVT-2026-98416',
    timestamp: '10:15:02',
    date: '2026-09-27',
    category: 'Security',
    title: 'Unauthorized process termination attempt',
    description: 'Workstation CND-1092 blocked secondary display process injection. Flagged for review.',
    source: 'Client-Guard-Daemon',
    actor: 'Candidate Workstation',
    severity: 'Critical',
    verified: true,
    blockHeight: 18416,
    prevHash: '0x9d11a7...55b2',
    currHash: '0x2b0f44...33c9'
  },
  {
    id: 'EVT-2026-98415',
    timestamp: '10:08:44',
    date: '2026-09-27',
    category: 'Recovery',
    title: 'Failover snapshot synchronized',
    description: 'Disaster recovery sync point created for Region EU-Central-1.',
    source: 'DR-Controller',
    actor: 'Backup Orchestrator',
    severity: 'Info',
    verified: true,
    blockHeight: 18415,
    prevHash: '0x6e88e1...77d3',
    currHash: '0x9d11a7...55b2'
  }
];

export default function AuditTimeline() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Events');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filtered timeline data
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All Events' || evt.category === categoryFilter;

      const matchesSeverity =
        severityFilter === 'All' || evt.severity === severityFilter;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [searchTerm, categoryFilter, severityFilter]);

  const getEventIcon = (category) => {
    switch (category) {
      case 'AI Detection':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'Authentication':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'Infrastructure':
        return <Server className="w-4 h-4 text-amber-600" />;
      case 'Examination':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      case 'Security':
        return <Lock className="w-4 h-4 text-red-600" />;
      case 'Recovery':
        return <RefreshCw className="w-4 h-4 text-teal-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Critical
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Warning
          </span>
        );
      case 'Info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Info className="w-3 h-3 text-slate-500" />
            Info
          </span>
        );
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-indigo-600" />
            Audit Timeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Immutable examination events, security actions, and system activity
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Ledger Stream Live
          </span>
        </div>
      </div>

      {/* TOP SUMMARY CARDS (4 KPI CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              TOTAL EVENTS
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono">24,891</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Today's activity</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SECURITY EVENTS
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono">184</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">7 requiring review</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              VERIFIED EVENTS
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono">24,876</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">99.9% verified</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              LAST VERIFICATION
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono">2 min ago</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hash chain verified</div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, sources, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 overflow-x-auto">
            {[
              'All Events',
              'Security',
              'Examination',
              'Infrastructure',
              'AI Detection',
              'Authentication',
              'Recovery'
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Severity</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm transition-all ml-auto lg:ml-0">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Audit</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: TIMELINE (~70%) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                System Activity Timeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological record of examination and platform events
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Showing {filteredEvents.length} events</span>
          </div>

          {/* Vertical Timeline */}
          <div className="mt-6 relative pl-6 border-l-2 border-slate-100 space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="relative group cursor-pointer transition-all"
                >
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-[35px] top-0 p-1.5 bg-white border-2 border-slate-200 rounded-full group-hover:border-indigo-500 group-hover:scale-110 transition-all shadow-sm">
                    {getEventIcon(evt.category)}
                  </div>

                  {/* Timeline Item Card */}
                  <div className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-4 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{evt.timestamp}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {evt.category}
                        </span>
                        {getSeverityBadge(evt.severity)}
                      </div>

                      {evt.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          VERIFIED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Source: <strong className="text-slate-600">{evt.source}</strong></span>
                      <span>ID: <strong className="text-slate-600">{evt.id}</strong></span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No events match the selected filter parameters.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AUDIT INTEGRITY PANEL (~30%) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Audit Integrity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Cryptographic verification status</p>
            </div>

            {/* Status Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Hash Chain</div>
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  VERIFIED
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Blocks</div>
                <div className="text-xs font-bold text-slate-800 font-mono mt-1">18,421</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Verified</div>
                <div className="text-xs font-bold text-slate-800 font-mono mt-1">99.9%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Last Check</div>
                <div className="text-xs font-bold text-slate-800 font-mono mt-1">10:42:21</div>
              </div>
            </div>

            {/* Visual Block Chain Representation */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                Recent Hash Blocks
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl text-white font-mono text-[11px] overflow-x-auto gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="p-1.5 bg-slate-800 rounded border border-slate-700 text-slate-300">#18419</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="p-1.5 bg-slate-800 rounded border border-slate-700 text-slate-300">#18420</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="p-1.5 bg-indigo-900/80 rounded border border-indigo-500 text-indigo-200 font-bold">#18421</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="p-1.5 bg-slate-800 rounded border border-slate-700 text-slate-400">#18422</span>
                </div>
              </div>
            </div>

            {/* Security Controls Checklist */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="text-xs font-bold text-slate-700">Security Controls</div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Immutable event logging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hash-chain verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Role-based access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Timestamp validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tamper detection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {getEventIcon(selectedEvent.category)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Event Telemetry Details</h3>
                  <span className="text-[11px] font-mono text-slate-400">{selectedEvent.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Timestamp</span>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedEvent.timestamp} ({selectedEvent.date})</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Event Type</span>
                  <div className="font-bold text-indigo-600 mt-0.5">{selectedEvent.category}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Source</span>
                  <div className="font-mono text-slate-800 mt-0.5">{selectedEvent.source}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Severity</span>
                  <div className="mt-0.5">{getSeverityBadge(selectedEvent.severity)}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Actor</span>
                <div className="font-semibold text-slate-800 mt-0.5">{selectedEvent.actor}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Description</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 mt-1 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Hashes Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-white">
                  <span className="text-slate-400">Previous Hash:</span>
                  <span className="text-slate-200">{selectedEvent.prevHash}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-white">
                  <span className="text-slate-400">Current Hash:</span>
                  <span className="text-indigo-300 font-bold">{selectedEvent.currHash}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">Block Height: <strong>#{selectedEvent.blockHeight}</strong></span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verification Cryptographically Confirmed
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}