import React from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Sparkles,
  Activity,
  ShieldCheck,
  ArrowRight,
  Clock,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  // Demo Telemetry dataset for standard SVG line plot
  const telemetryData = [
    { time: '01:29:50 AM', cpu: 35, mem: 58, latency: 31 },
    { time: '01:29:53 AM', cpu: 37, mem: 62, latency: 33 },
    { time: '01:29:56 AM', cpu: 41, mem: 59, latency: 38 },
    { time: '01:29:59 AM', cpu: 38, mem: 61, latency: 39 },
    { time: '01:30:02 AM', cpu: 36, mem: 61, latency: 30 },
    { time: '01:30:05 AM', cpu: 45, mem: 58, latency: 31 },
    { time: '01:30:08 AM', cpu: 40, mem: 62, latency: 38 },
    { time: '01:30:11 AM', cpu: 41, mem: 59, latency: 35 },
    { time: '01:30:14 AM', cpu: 44, mem: 60, latency: 33 },
    { time: '01:30:17 AM', cpu: 47, mem: 60, latency: 37 },
    { time: '01:30:20 AM', cpu: 47, mem: 61, latency: 35 },
    { time: '01:30:23 AM', cpu: 46, mem: 61, latency: 33 },
    { time: '01:30:26 AM', cpu: 39, mem: 60, latency: 33 },
    { time: '01:30:29 AM', cpu: 45, mem: 61, latency: 35 },
    { time: '01:30:32 AM', cpu: 46, mem: 62, latency: 33 }
  ];

  // Helper SVG generator for telemetry streams
  const generateSvgPath = (key) => {
    const width = 600;
    const height = 220;
    const paddingX = 40;
    const paddingY = 20;

    const points = telemetryData.map((d, index) => {
      const x = paddingX + (index / (telemetryData.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (d[key] / 100) * (height - paddingY * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Examination Command Center
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Real-time reliability, infrastructure telemetry, and continuity monitoring
        </p>
      </div>

      {/* TOP KPI ROW (6 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* CARD 1: ACTIVE CANDIDATES */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ACTIVE CANDIDATES
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">4,827</div>
            <div className="text-[11px] text-slate-500 mt-0.5">+2.4% from previous interval</div>
          </div>
        </div>

        {/* CARD 2: HEALTHY SESSIONS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              HEALTHY SESSIONS
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">4,791</div>
            <div className="text-[11px] text-slate-500 mt-0.5">99.3% of active sessions</div>
          </div>
        </div>

        {/* CARD 3: ACTIVE INCIDENTS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ACTIVE INCIDENTS
            </span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">0</div>
            <div className="text-[11px] text-slate-500 mt-0.5">All systems operational</div>
          </div>
        </div>

        {/* CARD 4: INFRA HEALTH */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              INFRA HEALTH
            </span>
            <Server className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">98.4%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Normal range</div>
          </div>
        </div>

        {/* CARD 5: DATA SYNC */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              DATA SYNC
            </span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">99.99%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">All responses synced</div>
          </div>
        </div>

        {/* CARD 6: SYSTEM RISK */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SYSTEM RISK
            </span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-purple-700 font-mono">LOW</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Score: 12/100</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CARD — INFRASTRUCTURE HEALTH */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Infrastructure Health
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time telemetry stream across primary clusters
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  CPU: 46%
                </span>
                <span className="flex items-center gap-1.5 text-purple-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  Mem: 62%
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Latency: 33ms
                </span>
              </div>
            </div>

            {/* Custom Interactive Telemetry Line Chart */}
            <div className="mt-4 relative bg-slate-50/50 rounded-xl border border-slate-100 p-4">
              <svg viewBox="0 0 600 240" className="w-full h-56 overflow-visible">
                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = 200 - (val / 100) * 180 + 10;
                  return (
                    <g key={val}>
                      <line
                        x1="35"
                        y1={y}
                        x2="575"
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text x="25" y={y + 3} fill="#94a3b8" fontSize="10" textAnchor="end">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* SVG Paths for CPU, Memory, Latency */}
                <path
                  d={generateSvgPath('mem')}
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={generateSvgPath('cpu')}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={generateSvgPath('latency')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* X Axis Time Labels */}
                {telemetryData.map((d, i) => {
                  if (i % 2 === 0) {
                    const x = 40 + (i / (telemetryData.length - 1)) * 520;
                    return (
                      <text
                        key={i}
                        x={x}
                        y="232"
                        fill="#94a3b8"
                        fontSize="9"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {d.time}
                      </text>
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT CARD — AI PREDICTIVE RISK */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                AI PREDICTIVE RISK
              </span>
              <span className="text-xs text-slate-500 font-medium">Confidence 98%</span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-500 font-medium">System Risk Level</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-purple-700 tracking-tight">
                  LOW
                </span>
                <span className="text-xs text-slate-500 font-medium">(12/100)</span>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-purple-950 space-y-1.5">
              <div className="font-semibold text-purple-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Telemetry Insights
              </div>
              <p className="text-purple-900/80 leading-relaxed text-[11.5px]">
                No abnormal infrastructure pattern detected in current telemetry window. Session
                continuity guaranteed.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => onNavigate && onNavigate('ai-risk')}
              className="w-full py-2.5 px-4 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>View AI Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* LOWER DASHBOARD SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Recent Incidents */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Recent Alerts & Incidents
            </h3>
            <span className="text-[11px] text-slate-400">Past 24h</span>
          </div>
          <div className="mt-3 space-y-3">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Frankfurt Node B Latency Spike
                </div>
                <div className="text-[11px] text-slate-500">Auto-rerouted to Node C • Resolved</div>
              </div>
              <span className="text-[10px] text-slate-400">14m ago</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Tokyo Merkle Chain Sync Lag
                </div>
                <div className="text-[11px] text-slate-500">Buffer flushed successfully</div>
              </div>
              <span className="text-[10px] text-slate-400">1h ago</span>
            </div>
          </div>
        </div>

        {/* Active Exam Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              Active Exam Streams
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Live</span>
          </div>
          <div className="mt-3 space-y-3">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Global Engineering Assessment
                </div>
                <div className="text-[11px] text-slate-500">3,420 candidates active</div>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">Room A-4</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Medical Licensing Phase II
                </div>
                <div className="text-[11px] text-slate-500">1,371 candidates active</div>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">Room B-1</span>
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Automated Audit Stream
            </h3>
            <span className="text-[11px] text-slate-400">Continuous</span>
          </div>
          <div className="mt-3 space-y-3">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">Merkle Root Ledger Hash Committed</span>
              <span className="font-mono text-[10px] text-slate-400">#98214</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">Edge Heartbeat Check Complete</span>
              <span className="font-mono text-[10px] text-emerald-600">Pass</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}