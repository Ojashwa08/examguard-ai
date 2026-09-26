import React, { useState } from 'react';
import {
  CheckCircle2,
  Server,
  Activity,
  Database,
  Wifi,
  Shield,
  ShieldCheck,
  Cpu,
  Eye,
  Mic,
  Monitor,
  Globe,
  Lock,
  Layers,
  Zap,
  HardDrive,
  FileText,
  AlertTriangle,
  RefreshCw,
  ArrowDown,
  ArrowRight,
  User,
  Key,
  Users
} from 'lucide-react';

export default function SystemArchitecture() {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Layer 1: Candidate Environment Nodes
  const candidateNodes = [
    { id: 'cand-portal', name: 'Candidate Portal', icon: User, desc: 'Web portal for exam authentication and session initialization' },
    { id: 'exam-interface', name: 'Exam Interface', icon: Monitor, desc: 'Secure lockdown browser view delivering questions' },
    { id: 'webcam-mic', name: 'Webcam / Microphone', icon: Mic, desc: 'Continuous encrypted AV telemetry stream capture' },
    { id: 'browser-telemetry', name: 'Browser Telemetry', icon: Eye, desc: 'Tracks focus loss, tab changes, and hardware events' }
  ];

  // Layer 2: Edge & Proctoring Nodes
  const edgeNodes = [
    { id: 'edge-proxy', name: 'Edge Proxy', icon: Globe, desc: 'Global CDN and DDoS filtering ingress proxies' },
    { id: 'ai-proctoring', name: 'AI Proctoring', icon: Cpu, desc: 'Real-time on-node video frame and pattern processor' },
    { id: 'face-detection', name: 'Face Detection', icon: User, desc: 'Facial presence, orientation, and identity validation' },
    { id: 'gaze-analysis', name: 'Gaze Analysis', icon: Eye, desc: 'Eye vector tracking to flag off-screen gazing' },
    { id: 'audio-analysis', name: 'Audio Analysis', icon: Mic, desc: 'Spectral speech and ambient sound classification' },
    { id: 'browser-monitoring', name: 'Browser Monitoring', icon: Shield, desc: 'Process injection and clipboard anomaly blocker' }
  ];

  // Layer 3: Core Platform Nodes
  const coreNodes = [
    { id: 'api-gateway', name: 'API Gateway', icon: Server, desc: 'Central routing, token authentication, and rate limiting' },
    { id: 'exam-service', name: 'Exam Service', icon: FileText, desc: 'Question delivery and encrypted answer submission' },
    { id: 'candidate-service', name: 'Candidate Service', icon: Users, desc: 'Session lifecycle and biometric verification engine' },
    { id: 'risk-engine', name: 'Risk Engine', icon: Cpu, desc: 'Real-time anomaly scoring and threat aggregation' },
    { id: 'incident-service', name: 'Incident Service', icon: AlertTriangle, desc: 'Automated alert dispatching and proctor notification' },
    { id: 'websocket-telemetry', name: 'WebSocket Telemetry', icon: Wifi, desc: 'Bi-directional live metric streaming to NOC' }
  ];

  // Layer 4: Data & Audit Nodes
  const dataNodes = [
    { id: 'postgres', name: 'PostgreSQL', icon: Database, desc: 'Primary ACID relational store for exam records' },
    { id: 'redis-cache', name: 'Redis Cache', icon: Zap, desc: 'In-memory session state and active token store' },
    { id: 'telemetry-store', name: 'Telemetry Store', icon: HardDrive, desc: 'High-throughput time-series event database' },
    { id: 'hash-ledger', name: 'Hash Ledger', icon: Lock, desc: 'Cryptographic SHA-256 block chain state ledger' },
    { id: 'audit-timeline', name: 'Audit Timeline', icon: FileText, desc: 'Tamper-proof event log stream aggregator' }
  ];

  // Layer 5: Resilience Nodes
  const resilienceNodes = [
    { id: 'monitoring', name: 'Monitoring', icon: Activity, desc: 'Platform health monitoring and SLO tracking' },
    { id: 'incident-mgmt', name: 'Incident Management', icon: AlertTriangle, desc: 'Auto-remediation and alert management' },
    { id: 'disaster-recovery', name: 'Disaster Recovery', icon: RefreshCw, desc: 'Multi-region failover and active sync' },
    { id: 'backup', name: 'Backup Service', icon: HardDrive, desc: 'Continuous snapshotting to immutable cold storage' },
    { id: 'integrity-verification', name: 'Integrity Verification', icon: ShieldCheck, desc: 'Merkle root verification and validation daemon' }
  ];

  // Data flow pipeline steps
  const dataFlowSteps = [
    { name: 'Candidate', icon: User, status: 'Active' },
    { name: 'Edge Proxy', icon: Globe, status: 'Optimal' },
    { name: 'AI Proctoring', icon: Cpu, status: 'Processing' },
    { name: 'Risk Engine', icon: Zap, status: 'Low Risk' },
    { name: 'Core Services', icon: Server, status: 'Healthy' },
    { name: 'Database', icon: Database, status: 'Synced' },
    { name: 'Audit / Recovery', icon: ShieldCheck, status: 'Verified' }
  ];

  // Security Controls list
  const securityControls = [
    { name: 'JWT Authentication', status: 'ACTIVE' },
    { name: 'Role-Based Access', status: 'ACTIVE' },
    { name: 'Hash-Chain Integrity', status: 'VERIFIED' },
    { name: 'Audit Logging', status: 'ACTIVE' },
    { name: 'AI Anomaly Detection', status: 'ACTIVE' }
  ];

  // Services health list
  const serviceHealthList = [
    { name: 'API Gateway', status: 'Healthy' },
    { name: 'Exam Service', status: 'Healthy' },
    { name: 'Risk Engine', status: 'Healthy' },
    { name: 'WebSocket Telemetry', status: 'Healthy' },
    { name: 'Database Primary', status: 'Healthy' },
    { name: 'Telemetry Store', status: 'Healthy' },
    { name: 'Audit Ledger', status: 'Healthy' },
    { name: 'Recovery Service', status: 'Healthy' }
  ];

  const renderComponentNode = (node, bgClass, borderClass, iconColorClass) => {
    const isHovered = hoveredNode?.id === node.id;
    return (
      <div
        key={node.id}
        onMouseEnter={() => setHoveredNode(node)}
        onMouseLeave={() => setHoveredNode(null)}
        className={`relative p-3 rounded-xl border transition-all cursor-pointer ${bgClass} ${borderClass} ${
          isHovered ? 'shadow-md border-indigo-400 -translate-y-0.5' : 'shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <node.icon className={`w-4 h-4 shrink-0 ${iconColorClass}`} />
            <span className="text-xs font-semibold text-slate-800 truncate">{node.name}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        </div>

        {/* Floating Tooltip */}
        {isHovered && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-20 pointer-events-none">
            <div className="font-bold text-slate-200">{node.name}</div>
            <div className="text-slate-300 mt-0.5 text-[10px] leading-tight">{node.desc}</div>
            <div className="mt-1.5 pt-1 border-t border-slate-700 text-[9.5px] text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> Status: Operational
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-blue-600" />
            System Architecture
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time architecture of the ExamGuard AI examination ecosystem
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">System Status</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800">All Systems Operational</span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SERVICES ONLINE</span>
            <Server className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">18 / 18</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Operational</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">API HEALTH</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">99.98%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Stable</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DATABASE</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">Healthy</div>
            <div className="text-[11px] text-slate-500 mt-0.5">PostgreSQL</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TELEMETRY</span>
            <Wifi className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 font-mono">Real-time</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">WebSocket Connected</div>
          </div>
        </div>
      </div>

      {/* MAIN ARCHITECTURE DIAGRAM */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              ExamGuard AI Platform Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">End-to-end examination data and telemetry flow</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Hover components for details</span>
        </div>

        {/* LAYERED DIAGRAM */}
        <div className="mt-6 space-y-4">
          {/* LAYER 1 */}
          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/80">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              LAYER 1: CANDIDATE ENVIRONMENT
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {candidateNodes.map((n) => renderComponentNode(n, 'bg-white', 'border-blue-200/70', 'text-blue-600'))}
            </div>
          </div>

          <div className="flex justify-center my-1 text-slate-300">
            <ArrowDown className="w-5 h-5 animate-bounce text-blue-400" />
          </div>

          {/* LAYER 2 */}
          <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/80">
            <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              LAYER 2: EDGE & PROCTORING
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {edgeNodes.map((n) => renderComponentNode(n, 'bg-white', 'border-purple-200/70', 'text-purple-600'))}
            </div>
          </div>

          <div className="flex justify-center my-1 text-slate-300">
            <ArrowDown className="w-5 h-5 text-purple-400" />
          </div>

          {/* LAYER 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-600" />
              LAYER 3: CORE PLATFORM
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {coreNodes.map((n) => renderComponentNode(n, 'bg-white', 'border-slate-200', 'text-slate-700'))}
            </div>
          </div>

          <div className="flex justify-center my-1 text-slate-300">
            <ArrowDown className="w-5 h-5 text-teal-400" />
          </div>

          {/* LAYER 4 */}
          <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100/80">
            <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-teal-600" />
              LAYER 4: DATA & AUDIT
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {dataNodes.map((n) => renderComponentNode(n, 'bg-white', 'border-teal-200/70', 'text-teal-600'))}
            </div>
          </div>

          <div className="flex justify-center my-1 text-slate-300">
            <ArrowDown className="w-5 h-5 text-emerald-400" />
          </div>

          {/* LAYER 5 */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/80">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              LAYER 5: RESILIENCE
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {resilienceNodes.map((n) => renderComponentNode(n, 'bg-white', 'border-emerald-200/70', 'text-emerald-600'))}
            </div>
          </div>
        </div>
      </div>

      {/* LIVE DATA FLOW */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Live Data Flow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Sequential streaming trajectory for active examination telemetry</p>
        </div>

        <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto pb-2">
          {dataFlowSteps.map((step, idx) => (
            <React.Fragment key={step.name}>
              <div className="flex-1 min-w-[130px] p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-blue-600 shadow-sm mb-1.5">
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">{step.name}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {step.status}
                </div>
              </div>
              {idx < dataFlowSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* BOTTOM PANELS: SECURITY CONTROLS & INFRASTRUCTURE STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              Security Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Enforced perimeter and platform security policies</p>
          </div>
          <div className="mt-4 space-y-2.5">
            {securityControls.map((sec) => (
              <div key={sec.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-slate-800">{sec.name}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {sec.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Status */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Service Health
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status check for system microservices</p>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {serviceHealthList.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-800">{svc.name}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}