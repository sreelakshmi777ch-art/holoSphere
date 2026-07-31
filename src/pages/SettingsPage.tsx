import React from 'react';
import { SystemSettings, ThemeColor } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Settings, Volume2, Hand, Mic, Sliders, RotateCcw, Sparkles, Check, Monitor } from 'lucide-react';

interface SettingsPageProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onReplayBoot: () => void;
}

const THEME_OPTIONS: { id: ThemeColor; label: string; bgClass: string }[] = [
  { id: 'cyan', label: 'Cyan Hologram', bgClass: 'bg-cyan-400' },
  { id: 'pink', label: 'Neon Pink', bgClass: 'bg-pink-400' },
  { id: 'emerald', label: 'Matrix Emerald', bgClass: 'bg-emerald-400' },
  { id: 'amber', label: 'Solar Amber', bgClass: 'bg-amber-400' },
  { id: 'blue', label: 'Deep Blue', bgClass: 'bg-blue-400' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onReplayBoot
}) => {
  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    soundEngine.playClickSound();
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);

    if (key === 'soundVolume' || key === 'musicVolume' || key === 'masterMuted') {
      soundEngine.setSettings(updated.soundVolume, updated.musicVolume, updated.masterMuted);
    }
  };

  const handleReset = () => {
    soundEngine.playClickSound();
    const defaultSettings: SystemSettings = {
      themeColor: 'cyan',
      animationSpeed: 'normal',
      soundVolume: 70,
      musicVolume: 50,
      masterMuted: false,
      hologramBloom: true,
      gestureSensitivity: 5,
      voiceLanguage: 'en-US',
      performanceMode: 'ultra',
    };
    onUpdateSettings(defaultSettings);
    soundEngine.setSettings(70, 50, false);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 p-4 lg:p-6 overflow-y-auto space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-cyan-200 tracking-wider">
              WORKSPACE SYSTEM SETTINGS
            </h2>
            <p className="text-xs text-cyan-400/60">
              Customize Visual Shaders, Sound FX, MediaPipe & Voice Controls
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-cyan-900/50 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Visual Theme & Shaders */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
          <h3 className="font-bold text-cyan-200 flex items-center gap-2 border-b border-cyan-900/40 pb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            HOLOGRAPHIC THEME & ANIMATIONS
          </h3>

          <div>
            <label className="text-[11px] text-cyan-400/80 block mb-2">ACCENT THEME COLOR</label>
            <div className="grid grid-cols-5 gap-2">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSetting('themeColor', theme.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    settings.themeColor === theme.id
                      ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                      : 'border-cyan-900/40 bg-slate-950/60 hover:border-cyan-500/40'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${theme.bgClass}`} />
                  <span className="text-[9px] text-cyan-200 truncate">{theme.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-cyan-400/80 block mb-2">PERFORMANCE MODE</label>
            <div className="grid grid-cols-3 gap-2">
              {(['ultra', 'balanced', 'saver'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting('performanceMode', mode)}
                  className={`p-2.5 rounded-xl border font-bold uppercase transition-all cursor-pointer ${
                    settings.performanceMode === mode
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_#22d3ee]'
                      : 'bg-slate-950/60 border-cyan-900/40 text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Audio Engine Volumes */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
          <h3 className="font-bold text-cyan-200 flex items-center gap-2 border-b border-cyan-900/40 pb-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            WEB AUDIO SOUND ENGINE
          </h3>

          <div>
            <div className="flex justify-between text-[11px] text-cyan-300 mb-1">
              <span>SOUND FX VOLUME</span>
              <span className="font-bold">{settings.soundVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.soundVolume}
              onChange={(e) => updateSetting('soundVolume', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-cyan-300 mb-1">
              <span>MUSIC VOLUME</span>
              <span className="font-bold">{settings.musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.musicVolume}
              onChange={(e) => updateSetting('musicVolume', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. MediaPipe & Voice Controls */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
          <h3 className="font-bold text-cyan-200 flex items-center gap-2 border-b border-cyan-900/40 pb-2">
            <Hand className="w-4 h-4 text-cyan-400" />
            MEDIAPIPE GESTURE SENSITIVITY
          </h3>

          <div>
            <div className="flex justify-between text-[11px] text-cyan-300 mb-1">
              <span>GESTURE DETECTION THRESHOLD</span>
              <span className="font-bold">Level {settings.gestureSensitivity} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.gestureSensitivity}
              onChange={(e) => updateSetting('gestureSensitivity', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Boot Intro Replay */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-cyan-200 flex items-center gap-2 border-b border-cyan-900/40 pb-2">
              <Monitor className="w-4 h-4 text-cyan-400" />
              SYSTEM DIAGNOSTICS INTRO
            </h3>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Re-execute the cinematic boot startup sequence with sound and particles animation.
            </p>
          </div>

          <button
            onClick={() => {
              soundEngine.playClickSound();
              onReplayBoot();
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-extrabold cursor-pointer shadow-[0_0_15px_#22d3ee]"
          >
            <Sparkles className="w-4 h-4" />
            REPLAY BOOT DIAGNOSTICS INTRO
          </button>
        </div>
      </div>
    </div>
  );
};
