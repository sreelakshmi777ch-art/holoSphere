/**
 * HoloSphere Web Audio Engine
 * Generates futuristic sci-fi sound effects and synthesized ambient music tracks
 * cleanly without requiring external binary audio files.
 */

let audioCtx: AudioContext | null = null;
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let musicInterval: any = null;
let currentTrackGain: GainNode | null = null;
let isMusicPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundEngine = {
  // Master settings
  soundVolume: 0.7,
  musicVolume: 0.5,
  isMuted: false,

  setSettings(soundVol: number, musicVol: number, muted: boolean) {
    this.soundVolume = soundVol / 100;
    this.musicVolume = musicVol / 100;
    this.isMuted = muted;

    if (currentTrackGain && audioCtx) {
      currentTrackGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.musicVolume,
        audioCtx.currentTime
      );
    }
  },

  playBootSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Power-up sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3 * this.soundVolume, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);

      // Harmony chime
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(523.25, now + 0.8); // C5
      chime.frequency.setValueAtTime(659.25, now + 1.0); // E5
      chime.frequency.setValueAtTime(783.99, now + 1.2); // G5
      chime.frequency.setValueAtTime(1046.50, now + 1.4); // C6

      chimeGain.gain.setValueAtTime(0.001, now + 0.8);
      chimeGain.gain.linearRampToValueAtTime(0.2 * this.soundVolume, now + 0.9);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chime.start(now + 0.8);
      chime.stop(now + 2.0);
    } catch (e) {
      console.warn('Audio Context boot sound error:', e);
    }
  },

  playClickSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.2 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // ignore user interaction audio context restrictions
    }
  },

  playHoverSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.03 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  },

  playNotificationSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      [587.33, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.15 * this.soundVolume, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch (e) {}
  },

  playSuccessSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15 * this.soundVolume, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  },

  playErrorSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);

      gain.gain.setValueAtTime(0.2 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  },

  // Synthesized Cyber Ambient Track Generator
  startSynthesizedTrack(trackType: 'synthwave' | 'ambient' | 'quantum' | 'cyber') {
    this.stopSynthesizedTrack();
    try {
      const ctx = getAudioContext();
      isMusicPlaying = true;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume * 0.3, ctx.currentTime);
      masterGain.connect(ctx.destination);
      currentTrackGain = masterGain;

      // Sub drone
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      const baseFreq = trackType === 'synthwave' ? 65.41 : trackType === 'cyber' ? 55.00 : 73.42;
      subOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.2, ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();
      ambientOscillator = subOsc;

      // Generative chord sequence
      const chords = [
        [baseFreq, baseFreq * 1.5, baseFreq * 1.875],
        [baseFreq * 1.2, baseFreq * 1.5, baseFreq * 2.0],
        [baseFreq * 1.33, baseFreq * 1.66, baseFreq * 2.25],
      ];

      let chordIndex = 0;
      musicInterval = setInterval(() => {
        if (!isMusicPlaying || this.isMuted) return;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((f) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f * 2, ctx.currentTime);

          g.gain.setValueAtTime(0.001, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.0);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

          osc.connect(g);
          g.connect(masterGain);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 4.0);
        });
      }, 4000);
    } catch (e) {
      console.warn('Synthesized music start error:', e);
    }
  },

  stopSynthesizedTrack() {
    isMusicPlaying = false;
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
    if (ambientOscillator) {
      try {
        ambientOscillator.stop();
      } catch (e) {}
      ambientOscillator = null;
    }
    if (currentTrackGain) {
      currentTrackGain.disconnect();
      currentTrackGain = null;
    }
  }
};
