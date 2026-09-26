import React, { useState } from 'react';
import { 
  Brain, 
  ShieldAlert, 
  Sliders, 
  Eye, 
  Mic, 
  UserX, 
  Monitor, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  Save, 
  Search,
  Filter
} from 'lucide-react';

export const AIRiskEngine = ({
  riskConfig = defaultConfig,
  flaggedSessions = defaultSessions,
  onSaveConfig,
  onResolveFlag
}) => {
  const [config, setConfig] = useState(riskConfig);
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'sessions'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isSaving, setIsSaving] = useState(false);

  const handleSliderChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: Number(value)
      }
    }));
  };

  const handleToggleModel = (modelKey) => {
    setConfig((prev) => ({
      ...prev,
      enabledModels: {
        ...prev.enabledModels,
        [modelKey]: !prev.enabledModels[modelKey]
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (onSaveConfig) onSaveConfig(config);
      setIsSaving(false);
    }, 600);
  };

  const filteredSessions = flaggedSessions.filter((session) => {
    const matchesSearch =
      session.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      filterSeverity === 'all' || session.riskLevel === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Risk & Proctoring Engine</h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure real-time computer vision models, sensitivity thresholds, and flag resolution triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'rules'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Model Thresholds
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'sessions'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Flagged Sessions ({flaggedSessions.length})
          </button>
        </div>
      </div>

      {activeTab === 'rules' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Proctoring Models Toggle Panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Detection Modules</h2>
                <p className="text-xs text-slate-500">Enable or disable real-time inference pipelines</p>
              </div>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>

            <div className="space-y-4">
              {/* Gaze Tracking */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Off-Screen Gaze Tracking</h4>
                    <p className="text-[11px] text-slate-500">Detects head rotation and eye drift away from monitor</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enabledModels.gazeTracking}
                  onChange={() => handleToggleModel('gazeTracking')}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Audio Frequency */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Acoustic Ambient Analysis</h4>
                    <p className="text-[11px] text-slate-500">Filters human voice chatter vs ambient background noise</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enabledModels.audioAnalysis}
                  onChange={() => handleToggleModel('audioAnalysis')}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Multiple Face Detection */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600">
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Secondary Person Detection</h4>
                    <p className="text-[11px] text-slate-500">Flags multiple faces or candidate absence in webcam feed</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enabledModels.multiFace}
                  onChange={() => handleToggleModel('multiFace')}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Browser Focus */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Tab Switch & Focus Guard</h4>
                    <p className="text-[11px] text-slate-500">Tracks window blur events and secondary display usage</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enabledModels.tabSwitch}
                  onChange={() => handleToggleModel('tabSwitch')}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Threshold Sliders */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Sensitivity & Risk Weights</h2>
                  <p className="text-xs text-slate-500">Adjust trigger points required to elevate a candidate's risk score</p>
                </div>
                <Sliders className="w-5 h-5 text-purple-600" />
              </div>

              <div className="space-y-6">
                {/* Critical Risk Threshold */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-800">Critical Risk Lockout Threshold</label>
                    <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      {config.thresholds.criticalRiskScore} / 100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={config.thresholds.criticalRiskScore}
                    onChange={(e) => handleSliderChange('criticalRiskScore', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">
                    Calculated score at which a session is automatically paused for human proctor review.
                  </p>
                </div>

                {/* Gaze Drift Tolerance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-800">Gaze Deviation Duration Limit</label>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {config.thresholds.gazeDurationSec} Seconds
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={config.thresholds.gazeDurationSec}
                    onChange={(e) => handleSliderChange('gazeDurationSec', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">
                    Continuous seconds looking off-screen before generating an anomaly warning.
                  </p>
                </div>

                {/* Tab Blur Allowance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-800">Max Allowed Window Blur Events</label>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {config.thresholds.maxTabBlurs} Swaps
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={config.thresholds.maxTabBlurs}
                    onChange={(e) => handleSliderChange('maxTabBlurs', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">
                    Number of focus losses permitted before deducting candidate integrity score.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Updating Engine...' : 'Apply & Save Rule Weights'}</span>
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Flagged Sessions List */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate or session ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical Risk</option>
                <option value="moderate">Moderate Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredSessions.map((session) => (
              <div key={session.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{session.id}</span>
                    <span className="text-xs font-bold text-slate-900">{session.candidateName}</span>
                    <span className="text-[10px] text-slate-400">({session.candidateId})</span>
                  </div>
                  <p className="text-xs text-slate-600">{session.triggerReason}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">Flagged at: {session.timestamp}</span>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Score</span>
                    <span className={`text-sm font-bold font-mono ${
                      session.riskScore >= 75 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {session.riskScore} / 100
                    </span>
                  </div>

                  <button
                    onClick={() => onResolveFlag && onResolveFlag(session.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Clear Flag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Default Configuration Data
const defaultConfig = {
  enabledModels: {
    gazeTracking: true,
    audioAnalysis: true,
    multiFace: true,
    tabSwitch: true
  },
  thresholds: {
    criticalRiskScore: 80,
    gazeDurationSec: 5,
    maxTabBlurs: 2
  }
};

// Default Flagged Sessions Data
const defaultSessions = [
  {
    id: 'SES-9921',
    candidateName: 'Alex Morgan',
    candidateId: 'CAND-8812',
    riskScore: 88,
    riskLevel: 'critical',
    triggerReason: 'Secondary person detected in webcam frame for >8 seconds',
    timestamp: '2026-09-26 11:40:12 UTC'
  },
  {
    id: 'SES-9904',
    candidateName: 'Jordan Lee',
    candidateId: 'CAND-3310',
    riskScore: 65,
    riskLevel: 'moderate',
    triggerReason: 'Continuous gaze drift off-screen during Section 2',
    timestamp: '2026-09-26 11:22:45 UTC'
  }
];

export default AIRiskEngine;