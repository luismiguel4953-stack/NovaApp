import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Pin, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Settings, 
  Cpu, 
  ShieldCheck, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePinConversation: (id: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  isOpen,
  onClose,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onTogglePinConversation,
  onOpenSettings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filtered = conversations.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinned = filtered.filter(c => c.isPinned);
  const unpinned = filtered.filter(c => !c.isPinned);

  const startEditing = (e: React.MouseEvent, c: Conversation) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditingTitle(c.title);
  };

  const saveEditing = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed lg:static top-0 left-0 bottom-0 w-80 z-50 flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] shadow-2xl overflow-hidden select-none"
          >
            {/* Header / Brand */}
            <div className="p-5 border-b border-[var(--border-subtle)] bg-black/10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base tracking-tight uppercase bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                      LM-CHAT AI
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ENGINE V4.2</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {/* New Conversation Button */}
              <button
                onClick={onNewConversation}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.35)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                <span>Nueva Transmisión</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar conversación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl py-2 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
              {/* Pinned Section */}
              {pinned.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-1.5 flex items-center gap-1">
                    <Pin className="w-3 h-3 text-indigo-400" />
                    <span>Fijadas</span>
                  </div>
                  <div className="space-y-1">
                    {pinned.map(c => renderItem(c))}
                  </div>
                </div>
              )}

              {/* Recent Section */}
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-1.5 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  <span>Recientes ({unpinned.length})</span>
                </div>
                {unpinned.length === 0 && pinned.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No se encontraron conversaciones.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {unpinned.map(c => renderItem(c))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Profile & Settings */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-black/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  LM
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">Luis Miguel</div>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    <span>PRO ACCOUNT</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenSettings}
                title="Ajustes de la Aplicación"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  function renderItem(c: Conversation) {
    const isActive = c.id === activeId;
    const isEditing = editingId === c.id;

    return (
      <div
        key={c.id}
        onClick={() => onSelectConversation(c.id)}
        className={`group relative p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer border ${
          isActive
            ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-300 shadow-sm'
            : 'hover:bg-white/5 border-transparent text-slate-300 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              isActive ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-slate-600'
            }`}
          />

          {isEditing ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditing(e, c.id);
                if (e.key === 'Escape') cancelEditing(e);
              }}
              className="bg-black/40 border border-indigo-500/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-full"
              autoFocus
            />
          ) : (
            <span className="truncate">{c.title}</span>
          )}
        </div>

        {/* Item Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={(e) => saveEditing(e, c.id)}
                className="p-1 hover:text-emerald-400 transition-colors"
                title="Guardar"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={cancelEditing}
                className="p-1 hover:text-rose-400 transition-colors"
                title="Cancelar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePinConversation(c.id);
                }}
                className={`p-1 hover:text-indigo-400 transition-colors ${c.isPinned ? 'text-indigo-400' : 'text-slate-500'}`}
                title={c.isPinned ? 'Desfijar' : 'Fijar'}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => startEditing(e, c)}
                className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                title="Editar nombre"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(c.id);
                }}
                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
};
