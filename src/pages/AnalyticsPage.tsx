import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

const THROUGHPUT_DATA = [
  { time: '00:00', throughput: 420, latency: 12 },
  { time: '04:00', throughput: 580, latency: 14 },
  { time: '08:00', throughput: 890, latency: 18 },
  { time: '12:00', throughput: 1120, latency: 15 },
  { time: '16:00', throughput: 950, latency: 13 },
  { time: '20:00', throughput: 740, latency: 11 },
  { time: '24:00', throughput: 610, latency: 12 },
];

const MEMORY_PIE = [
  { name: 'WebGL 3D Earth', value: 35, color: '#22d3ee' },
  { name: 'MediaPipe Vision', value: 25, color: '#3b82f6' },
  { name: 'Gemini AI Buffer', value: 20, color: '#a855f7' },
  { name: 'Web Audio Synth', value: 20, color: '#10b981' },
];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('24h');

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 p-4 lg:p-6 overflow-y-auto space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-cyan-200 tracking-wider">
              SYSTEM ANALYTICS & METRICS
            </h2>
            <p className="text-xs text-cyan-400/60">
              Holographic Network & Quantum Performance Telemetry
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-cyan-900/50">
          {(['24h', '7d', '30d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => {
                soundEngine.playClickSound();
                setTimeRange(range);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_#22d3ee]'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>TOTAL DATA FLOW</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-200">14.8 TB</p>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">+12.4% vs last period</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>AVG RESPONSE TIME</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-blue-200">13.2 ms</p>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">-3.1ms optimal boost</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>GESTURE ACCURACY</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-200">99.4%</p>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">21 landmark points</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>SYSTEM HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-300">100.0%</p>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Zero fatal faults</span>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Throughput Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
          <h3 className="font-bold text-cyan-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            GLOBAL HOLOGRAPHIC THROUGHPUT (Gbps)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={THROUGHPUT_DATA}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#082f49" />
                <XAxis dataKey="time" stroke="#0284c7" />
                <YAxis stroke="#0284c7" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#22d3ee', color: '#e0f2fe' }}
                />
                <Area type="monotone" dataKey="throughput" stroke="#22d3ee" fillOpacity={1} fill="url(#colorThroughput)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Allocation Donut Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
          <h3 className="font-bold text-cyan-200 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            MEMORY DISTRIBUTION
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MEMORY_PIE} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {MEMORY_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#22d3ee', color: '#e0f2fe' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-1.5">
            {MEMORY_PIE.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-cyan-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
