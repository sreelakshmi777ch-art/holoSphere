import React, { useState, useEffect } from 'react';
import { AudioTrack } from '../types';
import { soundEngine } from '../services/soundEngine';
import { 
  Film, 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Music, 
  Radio, 
  Sparkles 
} from 'lucide-react';

const TRACKS: AudioTrack[] = [
  {
    id: 't1',
    title: 'Cyberpunk Horizon 2077',
    artist: 'HoloSphere Audio Labs',
    album: 'Quantum Oscillations',
    duration: 180,
    genre: 'Synthwave',
    frequencyType: 'synthwave'
  },
  {
    id: 't2',
    title: 'Quantum Field Echoes',
    artist: 'Neural Ambient Core',
    album: 'Deep Space Orbit',
    duration: 210,
    genre: 'Ambient Sci-Fi',
    frequencyType: 'ambient'
  },
  {
    id: 't3',
    title: 'Starlight Orbit Pulse',
    artist: 'HoloSphere Audio Labs',
    album: 'Quantum Oscillations',
    duration: 160,
    genre: 'Cyber Beats',
    frequencyType: 'cyber'
  },
  {
    id: 't4',
    title: 'Interstellar Warp Resonance',
    artist: 'JARVIS Synthesizer',
    album: 'Deep Space Orbit',
    duration: 240,
    genre: 'Quantum Drone',
    frequencyType: 'quantum'
  }
];

export const MediaPage: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const activeTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (isRepeat) return 0;
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, activeTrack.duration * 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex, isRepeat]);

  const handlePlayPause = () => {
    soundEngine.playClickSound();
    if (isPlaying) {
      soundEngine.stopSynthesizedTrack();
      setIsPlaying(false);
    } else {
      soundEngine.startSynthesizedTrack(activeTrack.frequencyType);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    soundEngine.playClickSound();
    soundEngine.stopSynthesizedTrack();
    setIsPlaying(false);
    setProgress(0);
  };

  const handleNextTrack = () => {
    soundEngine.playClickSound();
    soundEngine.stopSynthesizedTrack();
    let nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * TRACKS.length);
    }
    setCurrentTrackIndex(nextIdx);
    setProgress(0);
    if (isPlaying) {
      soundEngine.startSynthesizedTrack(TRACKS[nextIdx].frequencyType);
    }
  };

  const handlePrevTrack = () => {
    soundEngine.playClickSound();
    soundEngine.stopSynthesizedTrack();
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    setProgress(0);
    if (isPlaying) {
      soundEngine.startSynthesizedTrack(TRACKS[prevIdx].frequencyType);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setSettings(soundEngine.soundVolume * 100, newVol, isMuted);
  };

  const handleMuteToggle = () => {
    soundEngine.playClickSound();
    const newMute = !isMuted;
    setIsMuted(newMute);
    soundEngine.setSettings(soundEngine.soundVolume * 100, volume, newMute);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 p-4 lg:p-6 overflow-y-auto space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-cyan-500/20">
        <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Film className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-cyan-200 tracking-wider">
            MEDIA HUB & AUDIO SYNTHESIZER
          </h2>
          <p className="text-xs text-cyan-400/60">
            Real-Time Web Audio Synthesized Soundtrack Player
          </p>
        </div>
      </div>

      {/* Main Media Player Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Player Card & Visualizer */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.2)] flex flex-col justify-between space-y-6">
          {/* Track Header Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_#22d3ee]">
              <Music className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                {activeTrack.genre} • {activeTrack.album}
              </span>
              <h3 className="text-base font-extrabold text-cyan-100">{activeTrack.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{activeTrack.artist}</p>
            </div>
          </div>

          {/* Animated Audio Spectrum Visualizer */}
          <div className="h-28 bg-black/80 rounded-xl border border-cyan-900/50 p-4 flex items-end justify-between gap-1 overflow-hidden shadow-inner">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t shadow-[0_0_8px_#22d3ee] transition-all duration-150"
                style={{
                  height: isPlaying
                    ? `${Math.max(10, Math.sin(i + Date.now() * 0.005) * 45 + 50)}%`
                    : '8%'
                }}
              />
            ))}
          </div>

          {/* Progress Seek Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-cyan-400 font-bold mb-1">
              <span>{Math.floor((progress * activeTrack.duration) / 100)}s</span>
              <span>{activeTrack.duration}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Player Buttons Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 rounded-xl border cursor-pointer ${
                  isShuffle ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-900 border-cyan-900/50 text-slate-400'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2 rounded-xl border cursor-pointer ${
                  isRepeat ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-900 border-cyan-900/50 text-slate-400'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Main Play Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevTrack}
                className="p-3 rounded-xl bg-slate-900 border border-cyan-900/50 text-cyan-300 hover:border-cyan-400 cursor-pointer"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold shadow-[0_0_20px_#22d3ee] cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={handleStop}
                className="p-3 rounded-xl bg-slate-900 border border-cyan-900/50 text-pink-400 hover:border-pink-500 cursor-pointer"
              >
                <Square className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextTrack}
                className="p-3 rounded-xl bg-slate-900 border border-cyan-900/50 text-cyan-300 hover:border-cyan-400 cursor-pointer"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2">
              <button onClick={handleMuteToggle} className="text-cyan-400 cursor-pointer">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Playlist Panel */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 font-mono">
          <h3 className="font-bold text-cyan-200 mb-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            HOLOSPHERE PLAYLIST
          </h3>

          <div className="space-y-2">
            {TRACKS.map((track, idx) => {
              const isActive = idx === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    soundEngine.playClickSound();
                    soundEngine.stopSynthesizedTrack();
                    setCurrentTrackIndex(idx);
                    setProgress(0);
                    if (isPlaying) {
                      soundEngine.startSynthesizedTrack(track.frequencyType);
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-bold'
                      : 'bg-slate-950/60 border-cyan-900/40 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate text-xs">{track.title}</p>
                    <span className="text-[10px] text-cyan-500/70">{track.artist}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">{track.duration}s</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
