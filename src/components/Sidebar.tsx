import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  BarChart3, 
  Briefcase, 
  Film, 
  FolderGit2, 
  Activity, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { PageType } from '../types';
import { soundEngine } from '../services/soundEngine';

interface SidebarProps {
  activePage: PageType;
  onSelectPage: (page: PageType) => void;
}

interface MenuItem {
  id: PageType;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'JARVIS' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'media', label: 'Media Hub', icon: Film },
  { id: 'files', label: 'Files Explorer', icon: FolderGit2 },
  { id: 'system', label: 'System Monitor', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative z-20 h-[calc(100vh-4rem)] bg-slate-950/80 border-r border-cyan-500/20 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="p-3 space-y-1.5">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playClickSound();
                onSelectPage(item.id);
              }}
              onMouseEnter={() => soundEngine.playHoverSound()}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-mono text-xs transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 border border-cyan-400/40 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}

              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'
                }`}
              />

              {!collapsed && (
                <div className="flex items-center justify-between w-full overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-cyan-900/40">
        <button
          onClick={() => {
            soundEngine.playClickSound();
            setCollapsed(!collapsed);
          }}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-cyan-900/50 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer text-xs font-mono"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>COLLAPSE NAV</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
