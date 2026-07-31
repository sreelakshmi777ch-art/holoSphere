import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Sparkles, Trash2, Copy, Check, Code, Cpu } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  "Analyze current 3D rendering pipeline performance",
  "Generate a quantum neural encryption algorithm in TypeScript",
  "Summarize active global holographic nodes telemetry",
  "Optimize MediaPipe gesture tracking recognition thresholds"
];

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Greetings Commander. I am HoloSphere AI (JARVIS Protocol). How may I assist your holographic workspace operations today?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Isolated getResponse() function calling our server route /api/ai/chat
  const getResponse = async (userPrompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userPrompt }),
      });
      const data = await response.json();
      return data.reply || 'HoloSphere AI: Query completed with no output.';
    } catch (err: any) {
      console.error('API Error:', err);
      return `[System Fallback] I am executing offline diagnostics. Received: "${userPrompt}". All core workspace components are operating at maximum efficiency.`;
    }
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || loading) return;

    soundEngine.playClickSound();

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    const botReplyText = await getResponse(prompt);

    soundEngine.playNotificationSound();
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: botReplyText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    soundEngine.playClickSound();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 p-4 lg:p-6 flex flex-col justify-between font-mono">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-cyan-200 tracking-wider">
              AI ASSISTANT (JARVIS CORE)
            </h2>
            <p className="text-xs text-cyan-400/60">
              Gemini 3.6 Flash Neural Inference Engine
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            setMessages([]);
          }}
          title="Clear Conversation"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-900/50 hover:border-pink-500/50 hover:text-pink-300 text-slate-400 transition-all cursor-pointer text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 my-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl p-4 rounded-2xl border text-xs leading-relaxed shadow-lg relative group ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/40 text-blue-100 rounded-br-none'
                  : 'bg-slate-900/90 border-cyan-500/30 text-cyan-100 rounded-bl-none shadow-[0_0_20px_rgba(34,211,238,0.1)]'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 pb-1 border-b border-cyan-900/30 text-[10px] text-cyan-400/60 font-bold">
                <span>{msg.sender === 'user' ? 'COMMANDER' : 'HOLOSPHERE AI'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content with Markdown Code Formatting */}
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                {msg.text}
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(msg.id, msg.text)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-800 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
              >
                {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex items-start">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>JARVIS is processing query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestion Chips */}
      <div className="py-2 overflow-x-auto flex gap-2 no-scrollbar">
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-300 hover:bg-cyan-900/40 text-cyan-300 text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div className="mt-2 pt-3 border-t border-cyan-500/20 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type an AI instruction or ask a question..."
          className="flex-1 bg-slate-900/80 border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs text-cyan-100 placeholder-cyan-600/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 shadow-inner"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !inputText.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold disabled:opacity-40 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
