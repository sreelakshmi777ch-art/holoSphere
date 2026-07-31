import React, { useState } from 'react';
import { FileItem } from '../types';
import { 
  FolderGit2, 
  FileCode, 
  FileText, 
  FileAudio, 
  Box, 
  Folder, 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Edit3, 
  X, 
  Sparkles 
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'core_kernel.ts', type: 'code', size: '24.2 KB', updatedAt: '2026-07-31', content: 'export function initKernel() { console.log("HoloSphere Kernel Online"); }' },
  { id: 'f2', name: 'earth_shader.glsl', type: 'model', size: '12.8 KB', updatedAt: '2026-07-30', content: 'uniform vec3 uAtmosphereColor; void main() { gl_FragColor = vec4(uAtmosphereColor, 0.8); }' },
  { id: 'f3', name: 'jarvis_neural_weights.bin', type: 'doc', size: '1.4 MB', updatedAt: '2026-07-29', content: 'Binary neural weights tensor for Gemini 3.6 Flash interface' },
  { id: 'f4', name: 'ambient_synth.wav', type: 'audio', size: '3.2 MB', updatedAt: '2026-07-28', content: 'Web Audio procedural wave buffer' },
  { id: 'f5', name: 'telemetry_logs', type: 'folder', size: '--', updatedAt: '2026-07-27' },
];

export const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'code' | 'doc' | 'folder'>('code');

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    soundEngine.playSuccessSound();

    const created: FileItem = {
      id: Date.now().toString(),
      name: newName,
      type: newType,
      size: newType === 'folder' ? '--' : '4.8 KB',
      updatedAt: new Date().toISOString().split('T')[0],
      content: `// HoloSphere Generated ${newName}\nconsole.log("Active file buffer");`
    };

    setFiles([created, ...files]);
    setShowAddModal(false);
    setNewName('');
  };

  const handleDeleteFile = (id: string) => {
    soundEngine.playClickSound();
    setFiles(files.filter((f) => f.id !== id));
    if (selectedFile?.id === id) setSelectedFile(null);
  };

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'folder': return <Folder className="w-4 h-4 text-amber-400" />;
      case 'code': return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'doc': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'audio': return <FileAudio className="w-4 h-4 text-emerald-400" />;
      case 'model': return <Box className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 p-4 lg:p-6 overflow-y-auto space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-cyan-200 tracking-wider">
              HOLOGRAPHIC FILE EXPLORER
            </h2>
            <p className="text-xs text-cyan-400/60">
              Encrypted Quantum Storage & Shader Directory
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
          NEW FILE / FOLDER
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter files by name..."
          className="w-full bg-slate-900/80 border border-cyan-500/30 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-cyan-100 placeholder-cyan-600/60 focus:outline-none shadow-inner"
        />
      </div>

      {/* Files List Table */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 overflow-x-auto shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cyan-900/50 text-cyan-400 text-[10px] uppercase">
              <th className="pb-3 pl-2">NAME</th>
              <th className="pb-3">TYPE</th>
              <th className="pb-3">SIZE</th>
              <th className="pb-3">LAST MODIFIED</th>
              <th className="pb-3 pr-2 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/30">
            {filteredFiles.map((f) => (
              <tr key={f.id} className="hover:bg-cyan-950/40 transition-colors group">
                <td className="py-3 pl-2 flex items-center gap-2.5 text-cyan-200 font-bold">
                  {getFileIcon(f.type)}
                  <span>{f.name}</span>
                </td>
                <td className="py-3 text-slate-400 capitalize">{f.type}</td>
                <td className="py-3 text-cyan-400">{f.size}</td>
                <td className="py-3 text-slate-400">{f.updatedAt}</td>
                <td className="py-3 pr-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playClickSound();
                        setSelectedFile(f);
                      }}
                      title="Preview File"
                      className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(f.id)}
                      title="Delete File"
                      className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* File Inspector Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
              <div className="flex items-center gap-2 text-cyan-200 font-bold">
                {getFileIcon(selectedFile.type)}
                <span>{selectedFile.name}</span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-cyan-500 hover:text-cyan-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-black/80 rounded-xl border border-cyan-900/50 text-cyan-300 text-xs font-mono max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedFile.content || 'Directory folder contents verified online.'}
            </div>

            <div className="flex justify-between items-center text-[10px] text-cyan-500/80 pt-2 border-t border-cyan-900/40">
              <span>Size: {selectedFile.size}</span>
              <span>Updated: {selectedFile.updatedAt}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add File Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
              <div className="flex items-center gap-2 text-cyan-200 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>CREATE FILE OR FOLDER</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-cyan-500 hover:text-cyan-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className="text-[11px] text-cyan-400 block mb-1">NAME</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. quantum_mesh.ts"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-cyan-400 block mb-1">TYPE</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-cyan-100 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="code">Code File (.ts / .js)</option>
                  <option value="doc">Document (.doc / .txt)</option>
                  <option value="folder">Directory Folder</option>
                </select>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
