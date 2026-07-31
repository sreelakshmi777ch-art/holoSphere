export type PageType = 
  | 'dashboard' 
  | 'assistant' 
  | 'analytics' 
  | 'projects' 
  | 'media' 
  | 'files' 
  | 'system' 
  | 'settings';

export type GestureType = 
  | 'NONE'
  | 'PALM_OPEN'
  | 'FIST_CLOSED'
  | 'PINCH'
  | 'POINT'
  | 'SWIPE_LEFT'
  | 'SWIPE_RIGHT'
  | 'ZOOM_IN'
  | 'ZOOM_OUT';

export type ThemeColor = 'cyan' | 'pink' | 'emerald' | 'amber' | 'blue';

export interface SystemSettings {
  themeColor: ThemeColor;
  animationSpeed: 'slow' | 'normal' | 'fast';
  soundVolume: number; // 0 to 100
  musicVolume: number; // 0 to 100
  masterMuted: boolean;
  hologramBloom: boolean;
  gestureSensitivity: number; // 1 to 10
  voiceLanguage: string;
  performanceMode: 'ultra' | 'balanced' | 'saver';
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  genre: string;
  frequencyType: 'synthwave' | 'ambient' | 'quantum' | 'cyber';
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'code' | 'image' | 'audio' | 'model' | 'doc';
  size: string;
  updatedAt: string;
  parentId?: string;
  content?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'completed' | 'in_progress' | 'queued';
  progress: number; // 0 - 100
  description: string;
  techStack: string[];
  updatedAt: string;
  members: string[];
}

export interface SystemMetrics {
  fps: number;
  cpuPercent: number;
  gpuMemoryMB: number;
  gpuMemoryTotalMB: number;
  ramUsedGB: number;
  ramTotalGB: number;
  networkLatencyMs: number;
  tempCelsius: number;
  batteryLevelPercent: number;
  batteryCharging: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
}

export interface HotspotNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'ONLINE' | 'OPTIMAL' | 'HEAVY_LOAD';
  pingMs: number;
  trafficGbps: number;
}
