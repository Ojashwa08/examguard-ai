import React, { useState } from 'react';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Admin Views
import Dashboard from './components/admin/Dashboard';
import LiveMonitor from './components/admin/LiveMonitor';
import InfraHealth from './components/admin/InfraHealth';
import AIRiskEngine from './components/admin/AIRiskEngine';
import IncidentHub from './components/admin/IncidentHub';
import RecoveryView from './components/admin/RecoveryView';
import HashLedger from './components/admin/HashLedger';
import CenterMap from './components/admin/CenterMap';

// New pages
import AuditTimeline from './components/admin/AuditTimeline';
import SystemArchitecture from './components/admin/SystemArchitecture';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [simulationActive, setSimulationActive] = useState(false);

  const handleSimulation = (type) => {
    console.log('Simulation triggered:', type);

    if (type === 'restore') {
      setSimulationActive(false);
      return;
    }

    setSimulationActive(true);
  };

  const renderContent = () => {
    switch (activeRoute) {
      // --------------------------------
      // OPERATIONS
      // --------------------------------

      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setActiveRoute}
          />
        );

      case 'live-monitor':
        return <LiveMonitor />;

      case 'infrastructure':
        return <InfraHealth />;

      case 'ai-risk':
        return <AIRiskEngine />;

      // --------------------------------
      // RESILIENCE
      // --------------------------------

      case 'incident-command':
        return <IncidentHub />;

      case 'disaster-recovery':
        return <RecoveryView />;

      case 'hash-chain':
        return <HashLedger />;

      case 'audit-timeline':
        return <AuditTimeline />;

      // --------------------------------
      // EXAMINATION
      // --------------------------------

      case 'exam-centers':
        return <CenterMap />;

      case 'system-architecture':
        return <SystemArchitecture />;

      // --------------------------------
      // FALLBACK
      // --------------------------------

      default:
        return (
          <Dashboard
            onNavigate={setActiveRoute}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

      {/* GLOBAL SIDEBAR */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        onTriggerSimulation={handleSimulation}
        simulationActive={simulationActive}
      />

      {/* MAIN APPLICATION AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* GLOBAL HEADER */}
        <Header />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>

      </div>
    </div>
  );
}