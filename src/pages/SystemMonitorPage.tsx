import React, { useState, useEffect } from 'react';
import { SystemMetrics } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Cpu, Zap, HardDrive, Wifi, Activity, Battery, Thermometer, ShieldAlert, XCircle, FastForward } from 'lucide-react';

interface ProcessItem {
  pid: number;
  name: string;
  cpuPercent: number;
  memoryMB: number;
  status: 'running' | 'idle' | 'boosted';
}

const INITIAL_PROCESSES: ProcessItem[] = [
  { pid: 4801, name: 'Three.js 3D Earth Renderer', cpuPercent: 8.4, memoryMB: 480, status: 'running' },
  { pid: 4802, name: 'MediaPipe Vision Hand Landmark', cpuPercent: 6.2, memoryMB: 310, status: 'running' },
  { pid: 4803, name: 'Web Audio Sound Engine', cpuPercent: 1.8, memoryMB: 120, status: 'running' },
  { pid: 4804, name: 'Gemini AI Bridge Thread', cpuPercent: 3.5, memoryMB: 260, status: 'running' },
  { pid: 4805, name: 'Vite HMR Ingress Reverse Proxy', cpuPercent: 0.9, memoryMB: 95, status: 'idle' },
];

export const SystemMonitorPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    fps: 60,
    cpuPercent: 22,
    gpuMemoryMB: 1540,
    gpuMemoryTotalMB: 8192,
    ramUsedGB: 4.2,
    ramTotalGB: 16,
    networkLatencyMs: 14,
    tempCelsius: 43,
    batteryLevelPercent: 98,
    batteryCharging: true
  });

  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuPercent: Math.floor(18 + Math.random() * 12),
        gpuMemoryMB: Math.floor(1500 + Math.random() * 200),
        networkLatencyMs: Math.floor(12 + Math.random() * 6),
        tempCelsius: Math.floor(42 + Math.random() * 4)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKillProcess = (pid: number) => {
    soundEngine.playErrorSound();
    setProcesses(processes.filter((p) => p.pid !== pid));
  };

  const handleBoostProcess = (pid: number) => {
    soundEngine.playSuccessSound();
    setProcesses(
      processes.map((p) => (p.pid === pid ? { ...p, status: 'boosted', cpuPercent: p.cpuPercent * 1.5 } : p))
    );
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 p-4 lg:p-6 overflow-y-auto space-y-6 font-mono text-xs">
      {/* Title Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-cyan-500/20">
        <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-cyan-200 tracking-wider">
            SYSTEM HARDWARE MONITOR
          </h2>
          <p className="text-xs text-cyan-400/60">
            Real-Time Diagnostic Gauges & Active Threads Task Manager
          </p>
        </div>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Gauge */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>CPU UTILIZATION</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-200">{metrics.cpuPercent}%</p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full shadow-[0_0_8px_#22d3ee]" style={{ width: `${metrics.cpuPercent}%` }} />
          </div>
          <span className="text-[10px] text-cyan-500/70 mt-2 block">8 Cores Active</span>
        </div>

        {/* GPU Memory Gauge */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>GPU VRAM</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-blue-200">{metrics.gpuMemoryMB} MB</p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-400 h-full shadow-[0_0_8px_#3b82f6]"
              style={{ width: `${(metrics.gpuMemoryMB / metrics.gpuMemoryTotalMB) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-blue-400/70 mt-2 block">Total: 8192 MB</span>
        </div>

        {/* Temperature Gauge */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>CORE TEMP</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-300">{metrics.tempCelsius} °C</p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full shadow-[0_0_8px_#f59e0b]" style={{ width: `${(metrics.tempCelsius / 100) * 100}%` }} />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold mt-2 block">Optimal Cooling</span>
        </div>

        {/* Network Ping Gauge */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>NETWORK LATENCY</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-300">{metrics.networkLatencyMs} ms</p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full shadow-[0_0_8px_#10b981]" style={{ width: '20%' }} />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold mt-2 block">Ultra Low Latency</span>
        </div>
      </div>

      {/* Active Processes Task Manager Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 overflow-x-auto shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between pb-4 border-b border-cyan-900/50 mb-4">
          <span className="font-bold text-cyan-200">ACTIVE SYSTEM PROCESSES</span>
          <span className="text-[10px] text-cyan-400">{processes.length} Threads Running</span>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cyan-900/50 text-cyan-400 text-[10px] uppercase">
              <th className="pb-3 pl-2">PID</th>
              <th className="pb-3">PROCESS NAME</th>
              <th className="pb-3">CPU</th>
              <th className="pb-3">MEMORY</th>
              <th className="pb-3">STATUS</th>
              <th className="pb-3 pr-2 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/30">
            {processes.map((p) => (
              <tr key={p.pid} className="hover:bg-cyan-950/40 transition-colors">
                <td className="py-3 pl-2 text-cyan-400 font-mono">{p.pid}</td>
                <td className="py-3 text-cyan-200 font-bold">{p.name}</td>
                <td className="py-3 text-cyan-300">{p.cpuPercent.toFixed(1)}%</td>
                <td className="py-3 text-blue-300">{p.memoryMB} MB</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'boosted'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 pr-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleBoostProcess(p.pid)}
                      title="Boost Thread Priority"
                      className="p-1.5 rounded bg-slate-800 text-emerald-400 hover:bg-emerald-950 transition-colors cursor-pointer"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleKillProcess(p.pid)}
                      title="Kill Process"
                      className="p-1.5 rounded bg-slate-800 text-pink-400 hover:bg-pink-950 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
