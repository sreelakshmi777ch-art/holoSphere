import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, Shield, Radio, Sparkles, FastForward } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING KERNEL 0x7F90...",
  "LOADING THREE.JS 3D GRAPHICS PIPELINE...",
  "CALIBRATING MEDIAPIPE GESTURE HANDS ENGINE...",
  "ACTIVATING WEB SPEECH SPECTRUM LISTENER...",
  "SYNCHRONIZING GEMINI NEURAL INTERACTION PROTOCOL...",
  "COMPLETING HOLOGRAPHIC FRAME BUFFER...",
  "HOLOSPHERE OS READY."
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [scanActive, setScanActive] = useState(false);

  useEffect(() => {
    soundEngine.playBootSound();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanActive(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev < BOOT_LOGS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-cyan-400 font-mono overflow-hidden select-none"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f49_1px,transparent_1px),linear-gradient(to_bottom,#082f49_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      {/* Blue Holographic Scan Line */}
      <AnimatePresence>
        {scanActive && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 0.6, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_25px_#22d3ee] z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Holographic Boot Node */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6">
        {/* Animated Radial Pulse Icon */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-cyan-400/20"
          />
          <div className="relative z-10 p-4 rounded-full bg-cyan-950/50 border border-cyan-400/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Sparkles className="w-10 h-10 text-cyan-300 animate-pulse" />
          </div>
        </div>

        {/* Title & Brand */}
        <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-100 mb-2">
          HOLOSPHERE AI
        </h1>
        <div className="text-xs tracking-widest text-cyan-400/70 uppercase mb-8 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          Holographic OS Kernel v4.2
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full bg-cyan-950/60 border border-cyan-500/30 rounded-full h-3 p-0.5 mb-6 overflow-hidden relative shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_12px_#38bdf8]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats Row */}
        <div className="w-full flex items-center justify-between text-xs text-cyan-300/80 mb-6 border-b border-cyan-900/50 pb-3">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
            SYSTEM DIAGNOSTICS
          </span>
          <span className="font-bold text-cyan-200">{progress}% COMPLETE</span>
        </div>

        {/* Console Log Terminal Window */}
        <div className="w-full bg-black/80 border border-cyan-500/30 rounded-lg p-4 font-mono text-xs text-cyan-400/90 shadow-inner h-24 overflow-hidden flex flex-col justify-end">
          <div className="flex items-center gap-2 text-cyan-500/60 mb-2 pb-1 border-b border-cyan-900/40">
            <Terminal className="w-3.5 h-3.5" />
            <span>BOOT LOG</span>
          </div>
          <div className="space-y-1">
            <div className="text-cyan-600/70">{BOOT_LOGS[Math.max(0, logIndex - 1)]}</div>
            <div className="text-cyan-300 font-semibold flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span>
              {BOOT_LOGS[logIndex]}
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            onComplete();
          }}
          className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/40 text-xs text-cyan-300 transition-all cursor-pointer group"
        >
          <FastForward className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          SKIP BOOT SEQUENCE
        </button>
      </div>
    </motion.div>
  );
};
