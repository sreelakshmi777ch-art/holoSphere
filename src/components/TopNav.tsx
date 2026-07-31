import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wifi, 
  Battery, 
  BatteryCharging, 
  Clock, 
  Mic, 
  MicOff, 
  Hand, 
  Volume2, 
  VolumeX, 
  Bell, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X,
  Activity
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { AppNotification } from '../types';

interface TopNavProps {
  voiceActive: boolean;
  onToggleVoice: () => void;
  gestureActive: boolean;
  onToggleGesture: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  notifications: AppNotification[];
  onClearNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  aiStatus: 'active' | 'thinking' | 'offline';
}

export const TopNav: React.FC<TopNavProps> = ({
  voiceActive,
  onToggleVoice,
  gestureActive,
  onToggleGesture,
  soundMuted,
  onToggleSound,
  notifications,
  onClearNotification,
  onClearAllNotifications,
  aiStatus
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(98);
  const [batteryCharging, setBatteryCharging] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Battery API check
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setBatteryCharging(battery.charging);
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setBatteryCharging(battery.charging);
        });
      }).catch(() => {});
    }

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="relative z-30 h-16 bg-slate-950/80 border-b border-cyan-500/20 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300">
              HOLOSPHERE
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
              AI OS
            </span>
          </div>
          <p className="text-[10px] text-cyan-400/60 font-mono hidden sm:block">
            3D HOLOGRAPHIC WORKSPACE
          </p>
        </div>
      </div>

      {/* Middle: Live System Telemetry Status (AI, Network, Time) */}
      <div className="hidden md:flex items-center gap-4 text-xs font-mono">
        {/* AI Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400/70">AI ENGINE:</span>
          <span className={`font-bold uppercase ${aiStatus === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {aiStatus === 'active' ? 'ONLINE' : 'THINKING'}
          </span>
        </div>

        {/* Network Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          <span>120 Mbps</span>
          <span className="text-[10px] text-emerald-400">14ms</span>
        </div>

        {/* Battery Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300">
          {batteryCharging ? (
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Battery className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>{batteryLevel}%</span>
        </div>

        {/* Time Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-200">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time}</span>
          <span className="text-[10px] text-cyan-400/60">{dateStr}</span>
        </div>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Voice Control Toggle */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            onToggleVoice();
          }}
          title={voiceActive ? "Voice Control Active (Click to Mute)" : "Enable Voice Control"}
          className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
            voiceActive
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse'
              : 'bg-slate-900/60 border-cyan-900/50 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50'
          }`}
        >
          {voiceActive ? <Mic className="w-4 h-4 text-cyan-300" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Gesture Control Toggle */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            onToggleGesture();
          }}
          title={gestureActive ? "MediaPipe Gesture Tracking Active" : "Enable Gesture Tracking"}
          className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
            gestureActive
              ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
              : 'bg-slate-900/60 border-cyan-900/50 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50'
          }`}
        >
          <Hand className="w-4 h-4" />
          {gestureActive && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          )}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            onToggleSound();
          }}
          title={soundMuted ? "Sound Muted (Click to Unmute)" : "Sound On"}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            !soundMuted
              ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900/60 border-cyan-900/50 text-slate-500 hover:text-slate-300'
          }`}
        >
          {!soundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              setShowNotifications(!showNotifications);
            }}
            title="Notifications"
            className="relative p-2.5 rounded-xl bg-slate-900/60 border border-cyan-900/50 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-cyan-500 text-black shadow-[0_0_8px_#22d3ee]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-950/95 border border-cyan-500/30 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>SYSTEM NOTIFICATIONS</span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAllNotifications}
                    className="text-xs text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-cyan-500/60 py-6">No active notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40 hover:border-cyan-500/40 transition-colors relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {n.type === 'alert' && <AlertCircle className="w-4 h-4 text-pink-400 shrink-0" />}
                          {n.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
                          <span className="text-xs font-semibold text-cyan-100">{n.title}</span>
                        </div>
                        <button
                          onClick={() => onClearNotification(n.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-300 transition-opacity cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.message}</p>
                      <span className="text-[9px] text-cyan-500/60 font-mono mt-1 block">{n.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            setShowProfileModal(!showProfileModal);
          }}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            <User className="w-4 h-4" />
          </div>
        </button>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="absolute right-4 top-18 w-72 bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-cyan-900/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_#22d3ee]">
                HS
              </div>
              <div>
                <h4 className="font-bold text-cyan-200">Commander Commander</h4>
                <p className="text-[10px] text-cyan-400/60">HoloSphere Prime Operator</p>
              </div>
            </div>
            <div className="py-3 space-y-2 font-mono text-[11px] text-cyan-300">
              <div className="flex justify-between">
                <span className="text-cyan-500/70">Role:</span>
                <span className="text-emerald-400">System Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-500/70">Security Clearance:</span>
                <span className="text-cyan-200">Level 5 (Quantum)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-500/70">Session Protocol:</span>
                <span className="text-blue-300">Encrypted TLS 1.3</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
