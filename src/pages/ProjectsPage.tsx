import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { Briefcase, Plus, Search, CheckCircle2, Clock, Layers, Sparkles, X } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Project JARVIS Core',
    category: 'AI Neural Mesh',
    status: 'active',
    progress: 88,
    description: 'High-speed Gemini 3.6 Flash neural assistant with real-time audio and gesture integration.',
    techStack: ['TypeScript', 'Express', '@google/genai', 'Web Speech'],
    updatedAt: '2026-07-31',
    members: ['Commander', 'JARVIS AI', 'Quantum Bot']
  },
  {
    id: 'p2',
    title: 'Holographic Earth 3D Engine',
    category: 'WebGL Shader Graphics',
    status: 'active',
    progress: 95,
    description: 'Three.js 3D Earth Globe with procedural continent maps, specular ocean shaders, clouds, and orbit nodes.',
    techStack: ['Three.js', 'Canvas 2D', 'GLSL', 'WebGL 2.0'],
    updatedAt: '2026-07-30',
    members: ['Commander', 'Graphics Dev']
  },
  {
    id: 'p3',
    title: 'MediaPipe Vision Landmark Tracker',
    category: 'Computer Vision',
    status: 'in_progress',
    progress: 72,
    description: 'Real-time 21-point hand skeleton landmark recognition engine with gesture mapping.',
    techStack: ['MediaPipe', 'Webcam API', 'Canvas Overlay'],
    updatedAt: '2026-07-29',
    members: ['Commander', 'Vision Engineer']
  },
  {
    id: 'p4',
    title: 'Quantum Audio Synthesizer',
    category: 'Audio Engine',
    status: 'completed',
    progress: 100,
    description: 'Web Audio API procedural sound effects synthesizer for sci-fi UI chirps and ambient pads.',
    techStack: ['Web Audio API', 'Oscillators', 'AudioContext'],
    updatedAt: '2026-07-28',
    members: ['Commander', 'Sound Architect']
  }
];

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundEngine.playSuccessSound();

    const created: ProjectItem = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory || 'Holographic Workspace',
      status: 'active',
      progress: 10,
      description: newDesc || 'Newly created holographic project workspace module.',
      techStack: ['HoloSphere OS', 'TypeScript'],
      updatedAt: new Date().toISOString().split('T')[0],
      members: ['Commander']
    };

    setProjects([created, ...projects]);
    setShowAddModal(false);
    setNewTitle('');
    setNewCategory('');
    setNewDesc('');
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 p-4 lg:p-6 overflow-y-auto space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-cyan-200 tracking-wider">
              HOLOGRAPHIC PROJECT WORKSPACES
            </h2>
            <p className="text-xs text-cyan-400/60">
              Active Neural Modules & Development Pipelines
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
          <Plus className="w-4 h-4" />
          NEW PROJECT
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-cyan-900/50 w-full sm:w-auto overflow-x-auto">
          {['all', 'active', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => {
                soundEngine.playClickSound();
                setFilterStatus(status);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs capitalize transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_#22d3ee]'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-slate-900/80 border border-cyan-500/30 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-cyan-100 placeholder-cyan-600/60 focus:outline-none shadow-inner"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-cyan-100 mt-0.5">{p.title}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                    p.status === 'completed'
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
                      : p.status === 'active'
                      ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                      : 'bg-amber-950 border border-amber-500/50 text-amber-300'
                  }`}
                >
                  {p.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">{p.description}</p>
            </div>

            {/* Progress Bar & Tech Stack */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-cyan-300 mb-1">
                  <span>PROGRESS</span>
                  <span className="font-bold">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_#22d3ee]"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-cyan-900/40">
                {p.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[10px] text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
              <div className="flex items-center gap-2 text-cyan-200 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>CREATE NEW PROJECT</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-cyan-500 hover:text-cyan-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-[11px] text-cyan-400 block mb-1">PROJECT TITLE</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Project Quantum AI"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-cyan-400 block mb-1">CATEGORY</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Neural Networks"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-cyan-400 block mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Module objectives and features..."
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-cyan-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs cursor-pointer shadow-[0_0_15px_#22d3ee]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
