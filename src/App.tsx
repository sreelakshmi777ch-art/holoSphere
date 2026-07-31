import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BootSequence } from './components/BootSequence';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { GestureDetector } from './components/GestureDetector';
import { VoiceController } from './components/VoiceController';
import { DashboardPage } from './pages/DashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MediaPage } from './pages/MediaPage';
import { FilesPage } from './pages/FilesPage';
import { SystemMonitorPage } from './pages/SystemMonitorPage';
import { SettingsPage } from './pages/SettingsPage';
import { PageType, GestureType, SystemSettings, AppNotification } from './types';
import { soundEngine } from './services/soundEngine';

const DEFAULT_SETTINGS: SystemSettings = {
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

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Holographic Kernel Online',
    message: 'Three.js 3D Earth, MediaPipe Hands & Web Speech initialized successfully.',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    type: 'success',
    read: false
  },
  {
    id: 'n2',
    title: 'Gemini 3.6 Flash Connected',
    message: 'Neural AI inference route /api/ai/chat active for natural conversation.',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    type: 'info',
    read: false
  }
];

export default function App() {
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [gesture, setGesture] = useState<GestureType>('NONE');

  const [voiceActive, setVoiceActive] = useState<boolean>(false);
  const [gestureActive, setGestureActive] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const handleSelectPage = (page: PageType) => {
    setActivePage(page);
  };

  const handleToggleVoice = () => {
    setVoiceActive(!voiceActive);
  };

  const handleToggleGesture = () => {
    setGestureActive(!gestureActive);
  };

  const handleToggleSound = () => {
    const newMuted = !settings.masterMuted;
    setSettings((prev) => ({ ...prev, masterMuted: newMuted }));
    soundEngine.setSettings(settings.soundVolume, settings.musicVolume, newMuted);
  };

  const handleClearNotification = (id: string) => {
    soundEngine.playClickSound();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    soundEngine.playClickSound();
    setNotifications([]);
  };

  const handleGestureDetected = (detected: GestureType) => {
    setGesture(detected);

    if (detected === 'SWIPE_LEFT') {
      // Navigate next page
      const pages: PageType[] = ['dashboard', 'assistant', 'analytics', 'projects', 'media', 'files', 'system', 'settings'];
      const currentIdx = pages.indexOf(activePage);
      const nextIdx = (currentIdx + 1) % pages.length;
      setActivePage(pages[nextIdx]);
    } else if (detected === 'SWIPE_RIGHT') {
      const pages: PageType[] = ['dashboard', 'assistant', 'analytics', 'projects', 'media', 'files', 'system', 'settings'];
      const currentIdx = pages.indexOf(activePage);
      const prevIdx = (currentIdx - 1 + pages.length) % pages.length;
      setActivePage(pages[prevIdx]);
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (command === 'rotate_globe') setGesture('PALM_OPEN');
    else if (command === 'stop_globe') setGesture('FIST_CLOSED');
    else if (command === 'zoom_in') setGesture('ZOOM_IN');
    else if (command === 'zoom_out') setGesture('ZOOM_OUT');
  };

  return (
    <div className="w-screen h-screen bg-black text-slate-100 overflow-hidden select-none flex flex-col font-sans">
      {/* Boot Startup Intro Sequence */}
      <AnimatePresence>
        {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      {!isBooting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex flex-col"
        >
          {/* Top Bar Navigation */}
          <TopNav
            voiceActive={voiceActive}
            onToggleVoice={handleToggleVoice}
            gestureActive={gestureActive}
            onToggleGesture={handleToggleGesture}
            soundMuted={settings.masterMuted}
            onToggleSound={handleToggleSound}
            notifications={notifications}
            onClearNotification={handleClearNotification}
            onClearAllNotifications={handleClearAllNotifications}
            aiStatus="active"
          />

          {/* Main Workspace Body (Sidebar + Page Content) */}
          <div className="flex-1 flex overflow-hidden relative">
            <Sidebar activePage={activePage} onSelectPage={handleSelectPage} />

            <main className="flex-1 h-full overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  {activePage === 'dashboard' && (
                    <DashboardPage gesture={gesture} onSelectPage={handleSelectPage} />
                  )}
                  {activePage === 'assistant' && <AIAssistantPage />}
                  {activePage === 'analytics' && <AnalyticsPage />}
                  {activePage === 'projects' && <ProjectsPage />}
                  {activePage === 'media' && <MediaPage />}
                  {activePage === 'files' && <FilesPage />}
                  {activePage === 'system' && <SystemMonitorPage />}
                  {activePage === 'settings' && (
                    <SettingsPage
                      settings={settings}
                      onUpdateSettings={(s) => setSettings(s)}
                      onReplayBoot={() => setIsBooting(true)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* GestureDetector Overlay HUD */}
            {gestureActive && (
              <GestureDetector
                onGestureDetected={handleGestureDetected}
                onClose={() => setGestureActive(false)}
              />
            )}

            {/* VoiceController Speech HUD */}
            {voiceActive && (
              <VoiceController
                onSelectPage={handleSelectPage}
                onCommandTriggered={handleVoiceCommand}
                onClose={() => setVoiceActive(false)}
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
