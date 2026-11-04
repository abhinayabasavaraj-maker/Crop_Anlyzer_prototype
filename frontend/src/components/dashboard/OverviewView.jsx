import React from 'react';
import { 
  Sprout, 
  HeartHandshake, 
  AlertTriangle, 
  FlaskConical, 
  Cpu, 
  Activity,
  HeartPulse,
  Radio,
  WifiOff,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import ScientificNotice from '../common/ScientificNotice';
import PlantHealthChart from './PlantHealthChart';
import SensorTrendsChart from './SensorTrendsChart';
import DeviceStatusList from './DeviceStatusList';
import RecentActivityList from './RecentActivityList';
import PlantSummaryCards from './PlantSummaryCards';

const OverviewView = () => {
  const { plants, experiments, devices, alerts, readings, thresholds } = useApp();

  const totalPlants = plants.length;
  const healthyPlants = plants.filter(p => p.status === 'Healthy').length;
  const attentionPlants = plants.filter(p => p.status === 'Moderate Stress' || p.status === 'Severe Stress').length;
  const totalExperiments = experiments.length;
  const onlineDevices = devices.filter(d => d.status === 'Online').length;
  const offlineDevices = devices.filter(d => d.status === 'Offline').length;
  const totalReadingsCount = readings.length;
  const latestReading = readings[0];
  const latestHealthScore = latestReading?.plantHealthScore || 78;

  return (
    <div className="space-y-6 pb-12">
      
      {/* BMSCE Project Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 text-white rounded-xl p-3.5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>BMS College of Engineering — ECE + CSE Multidisciplinary Capstone</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                TRL 2 (Target TRL 3)
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Handheld optical sensing: Single BPW34 photodiode, sequential 660 nm RED / 850 nm NIR illumination, ADS1115 (16-bit ADC), ESP32 on-device index calculation.
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] uppercase text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/30 font-bold self-start sm:self-auto shrink-0">
          Index: [-1.0, +1.0]
        </span>
      </div>

      {/* Scientific Constraints Notice */}
      <ScientificNotice />

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <MetricCard
          title="Monitored Plants"
          value={totalPlants}
          subtext="Control & Stressed"
          icon={Sprout}
          color="emerald"
        />
        <MetricCard
          title="Healthy Plants"
          value={healthyPlants}
          subtext={`Index ≥ ${thresholds.optimal}`}
          icon={HeartHandshake}
          color="emerald"
          trend="up"
          trendValue={`${Math.round((healthyPlants / (totalPlants || 1)) * 100)}%`}
        />
        <MetricCard
          title="Needs Attention"
          value={attentionPlants}
          subtext="Moderate / Severe"
          icon={AlertTriangle}
          color={attentionPlants > 0 ? "rose" : "emerald"}
          trend={attentionPlants > 0 ? "down" : undefined}
          trendValue={attentionPlants > 0 ? `${attentionPlants} stressed` : "Clear"}
        />
        <MetricCard
          title="Online Nodes"
          value={onlineDevices}
          subtext="ESP32 Chambers"
          icon={Cpu}
          color="indigo"
        />
        <MetricCard
          title="Offline Nodes"
          value={offlineDevices}
          subtext="Disconnections"
          icon={WifiOff}
          color={offlineDevices > 0 ? "slate" : "emerald"}
        />
        <MetricCard
          title="Total Readings"
          value={totalReadingsCount}
          subtext="Sample packets"
          icon={Activity}
          color="blue"
        />
        <MetricCard
          title="Latest Index"
          value={latestReading ? latestReading.index : '0.00'}
          subtext={latestReading?.plantId || 'PLANT001'}
          icon={Radio}
          color="emerald"
        />
        <MetricCard
          title="Health Score"
          value={`${latestHealthScore}/100`}
          subtext="Derived rating"
          icon={HeartPulse}
          color="emerald"
        />
      </div>

      {/* Charts Section: Health Timeline & Reflectance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlantHealthChart />
        <SensorTrendsChart />
      </div>

      {/* Plant Monitoring Cards */}
      <PlantSummaryCards />

      {/* Devices Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceStatusList />
        <RecentActivityList />
      </div>

    </div>
  );
};

export default OverviewView;
