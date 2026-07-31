import React, { useEffect, useState } from 'react';
import { PageType } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Mic, MicOff, Radio, Sparkles } from 'lucide-react';

interface VoiceControllerProps {
  onSelectPage: (page: PageType) => void;
  onCommandTriggered: (command: string) => void;
  onClose: () => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  onSelectPage,
  onCommandTriggered,
  onClose
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Listening for voice commands...');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setTranscript('Web Speech API not supported in this browser environment. Use voice presets below.');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening... Speak a command like "Open Dashboard"');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript.toLowerCase().trim();
      setTranscript(`"${text}"`);

      // Match voice commands
      if (text.includes('dashboard')) {
        onSelectPage('dashboard');
        setLastCommand('Navigated to Dashboard');
      } else if (text.includes('assistant') || text.includes('ai')) {
        onSelectPage('assistant');
        setLastCommand('Opened AI Assistant');
      } else if (text.includes('analytics')) {
        onSelectPage('analytics');
        setLastCommand('Opened Analytics');
      } else if (text.includes('project')) {
        onSelectPage('projects');
        setLastCommand('Opened Projects');
      } else if (text.includes('media') || text.includes('music')) {
        onSelectPage('media');
        setLastCommand('Opened Media Hub');
      } else if (text.includes('file')) {
        onSelectPage('files');
        setLastCommand('Opened Files Explorer');
      } else if (text.includes('system') || text.includes('monitor')) {
        onSelectPage('system');
        setLastCommand('Opened System Monitor');
      } else if (text.includes('setting')) {
        onSelectPage('settings');
        setLastCommand('Opened Settings');
      } else if (text.includes('rotate') || text.includes('start globe')) {
        onCommandTriggered('rotate_globe');
        setLastCommand('Globe Rotation Active');
      } else if (text.includes('stop globe') || text.includes('pause globe')) {
        onCommandTriggered('stop_globe');
        setLastCommand('Globe Paused');
      } else if (text.includes('zoom in')) {
        onCommandTriggered('zoom_in');
        setLastCommand('Zoomed In');
      } else if (text.includes('zoom out')) {
        onCommandTriggered('zoom_out');
        setLastCommand('Zoomed Out');
      } else if (text.includes('mute')) {
        soundEngine.setSettings(0, 0, true);
        setLastCommand('Muted Audio');
      } else if (text.includes('unmute')) {
        soundEngine.setSettings(70, 50, false);
        setLastCommand('Unmuted Audio');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {}

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [onSelectPage, onCommandTriggered]);

  const executePreset = (cmdText: string, action: () => void) => {
    soundEngine.playClickSound();
    action();
    setLastCommand(cmdText);
  };

  return (
    <div className="fixed top-20 right-6 z-40 w-80 bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-xs font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50 mb-3">
        <div className="flex items-center gap-2 text-cyan-200 font-bold">
          <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>SPEECH RECOGNITION</span>
        </div>
        <button onClick={onClose} className="text-cyan-500 hover:text-cyan-200 cursor-pointer">
          ✕
        </button>
      </div>

      <div className="p-3 bg-black/80 rounded-xl border border-cyan-900/50 mb-3 flex items-center gap-3">
        <Radio className={`w-5 h-5 shrink-0 ${isListening ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
        <div className="overflow-hidden">
          <p className="text-[11px] text-cyan-300 italic truncate">{transcript}</p>
          {lastCommand && (
            <p className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {lastCommand}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] text-cyan-400/70 uppercase">Voice Command Shortcuts:</span>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <button
            onClick={() => executePreset('Dashboard', () => onSelectPage('dashboard'))}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 cursor-pointer text-left"
          >
            🗣️ "Open Dashboard"
          </button>
          <button
            onClick={() => executePreset('AI Assistant', () => onSelectPage('assistant'))}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 cursor-pointer text-left"
          >
            🗣️ "Open Assistant"
          </button>
          <button
            onClick={() => executePreset('Rotate Globe', () => onCommandTriggered('rotate_globe'))}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 cursor-pointer text-left"
          >
            🗣️ "Rotate Globe"
          </button>
          <button
            onClick={() => executePreset('Stop Globe', () => onCommandTriggered('stop_globe'))}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 cursor-pointer text-left"
          >
            🗣️ "Stop Globe"
          </button>
        </div>
      </div>
    </div>
  );
};
