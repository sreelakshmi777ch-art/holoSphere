import React, { useState } from 'react';
import { Globe3D } from '../components/Globe3D';
import { GestureType, HotspotNode, PageType } from '../types';
import { soundEngine } from '../services/soundEngine';
import { 
  Cpu, 
  Activity, 
  HardDrive, 
  Zap, 
  Sparkles, 
  Bot, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Maximize2 
} from 'lucide-react';

interface DashboardPageProps {
  gesture: GestureType;
  onSelectPage: (page: PageType) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ gesture, onSelectPage }) => {
  const [selectedNode, setSelectedNode] = useState<HotspotNode | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const triggerScan = () => {
    soundEngine.playSuccessSound();
    setScanMessage("SCANNING HOLOGRAPHIC MESH... ALL 6 GLOBAL NODES OPERATIONAL AT 99.8% EFFICIENCY");
    setTimeout(() => {
      setScanMessage(null);
    }, 4000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex flex-col md:flex-row">
      {/* 3D Earth Central Canvas Container */}
      <div className="relative flex-1 h-full min-h-[400px]">
        <Globe3D gesture={gesture} onSelectNode={(node) => setSelectedNode(node)} />

        {/* Scan Message Banner */}
        {scanMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 font-mono text-xs shadow-[0_0_25px_#22d3ee] flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* Right Holographic Control & Metrics Sidebar Panel */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-950/90 border-l border-cyan-500/20 backdrop-blur-2xl p-4 lg:p-5 flex flex-col justify-between overflow-y-auto space-y-4 font-mono z-10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
            <div className="flex items-center gap-2 text-cyan-200 font-bold text-sm">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>CORE METRICS</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
              60 FPS
            </span>
          </div>

          {/* Quick Metrics Grid Cards */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* CPU Metric Card */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px]">CPU LOAD</span>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-bold text-cyan-200">24.8%</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[25%]" />
              </div>
            </div>

            {/* GPU Memory Card */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px]">GPU MEMORY</span>
                <Zap className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-blue-200">1.82 GB</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-400 h-full w-[22%]" />
              </div>
            </div>

            {/* RAM Memory Card */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px]">RAM USED</span>
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-xl font-bold text-indigo-200">4.21 GB</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-400 h-full w-[26%]" />
              </div>
            </div>

            {/* Neural Latency Card */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px]">LATENCY</span>
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-emerald-300">14 ms</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-full w-[15%]" />
              </div>
            </div>
          </div>

          {/* Selected Node Inspector Detail Card */}
          {selectedNode && (
            <div className="mt-4 p-4 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-800/60">
                <span className="text-xs font-bold text-cyan-200">{selectedNode.name}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{selectedNode.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-cyan-300">
                <div>Latitude: {selectedNode.lat}°</div>
                <div>Longitude: {selectedNode.lng}°</div>
                <div>Node Ping: {selectedNode.pingMs}ms</div>
                <div>Throughput: {selectedNode.trafficGbps} Gbps</div>
              </div>
            </div>
          )}

          {/* Quick Action Control Buttons */}
          <div className="mt-5 space-y-2">
            <span className="text-[10px] text-cyan-400/70 uppercase tracking-wider block mb-1">
              SYSTEM COMMANDS
            </span>

            <button
              onClick={triggerScan}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 hover:border-cyan-300 hover:bg-cyan-900/40 text-cyan-200 transition-all cursor-pointer font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <Radio className="w-4 h-4 text-cyan-400 animate-ping" />
              EXECUTE HOLOGRAPHIC SCAN
            </button>

            <button
              onClick={() => {
                soundEngine.playClickSound();
                onSelectPage('assistant');
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 text-slate-200 transition-all cursor-pointer text-xs"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              LAUNCH AI ASSISTANT (JARVIS)
            </button>
          </div>
        </div>

        {/* Live System Log Stream */}
        <div className="p-3 bg-black/80 rounded-2xl border border-cyan-900/40 text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400/80 font-bold mb-2 pb-1 border-b border-cyan-900/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>REAL-TIME SYSTEM ACTIVITY</span>
          </div>
          <div className="space-y-1 text-slate-400 text-[10px]">
            <p className="text-cyan-300">• Three.js WebGL 2.0 Shaders online</p>
            <p className="text-slate-400">• MediaPipe Hands gesture engine bound</p>
            <p className="text-slate-400">• Web Speech voice command listener active</p>
            <p className="text-emerald-400">• Gemini 3.6 Flash neural connection connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};
