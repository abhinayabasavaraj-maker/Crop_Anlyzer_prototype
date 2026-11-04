import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';

// 12 Navigation Views
import OverviewView from './components/dashboard/OverviewView';
import LiveMonitoringView from './components/live/LiveMonitoringView';
import PlantManagementView from './components/plants/PlantManagementView';
import ExperimentManagementView from './components/experiments/ExperimentManagementView';
import PlantHealthScoreView from './components/health/PlantHealthScoreView';
import AnalyticsView from './components/analytics/AnalyticsView';
import AiDiseaseScreeningView from './components/ai/AiDiseaseScreeningView';
import TreatmentAssistanceView from './components/treatment/TreatmentAssistanceView';
import AlertsView from './components/alerts/AlertsView';
import DeviceManagementView from './components/devices/DeviceManagementView';
import ReportsView from './components/reports/ReportsView';
import SettingsView from './components/settings/SettingsView';

const MainLayout = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'live':
        return <LiveMonitoringView />;
      case 'plants':
        return <PlantManagementView />;
      case 'experiments':
        return <ExperimentManagementView />;
      case 'health-score':
        return <PlantHealthScoreView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai-screening':
        return <AiDiseaseScreeningView />;
      case 'treatment':
        return <TreatmentAssistanceView />;
      case 'alerts':
        return <AlertsView />;
      case 'devices':
        return <DeviceManagementView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic View Scrollable Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
