import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MessageItem } from './components/MessageItem';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { MessageComposer } from './components/MessageComposer';
import { SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { MobileInstallModal } from './components/MobileInstallModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGate } from './components/auth/AuthGate';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { CyberpunkParticles } from './components/CyberpunkParticles';
import { Conversation, ChatMessage, AppSettings, AuthUser } from './types';
import { SEED_CONVERSATIONS, DEFAULT_SETTINGS } from './data/initialData';
import { sendChatMessage, sendChatMessageStream } from './services/chatService';
import { fetchCurrentUser, logoutUser, getStoredToken } from './services/authService';
import { Bot, Sparkles, Zap, Cpu, ShieldCheck, ArrowRight, Smartphone, LogIn, User, Volume2 } from 'lucide-react';

const STORAGE_KEY_CONVS = 'lm_chat_ai_conversations_v2';
const STORAGE_KEY_SETTINGS = 'lm_chat_ai_settings_v2';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load initial settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }; } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  // Load initial conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONVS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SEED_CONVERSATIONS;
  });

  // Active conversation ID
  const [activeId, setActiveId] = useState<string>(() => {
    return conversations[0]?.id || 'conv-1';
  });

  // Sidebar toggle state (open by default on desktop)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Settings modal open state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // AI generating status
  const [isGenerating, setIsGenerating] = useState(false);

  // Scroll ref for chat messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user on mount
  useEffect(() => {
    async function checkAuth() {
      const res = await fetchCurrentUser();
      if (res.success && res.user) {
        setUser(res.user);
        // Fetch user-specific conversations from backend
        const token = getStoredToken();
        if (token) {
          try {
            const convRes = await fetch('/api/user/conversations', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const convData = await convRes.json();
            if (convData.success && Array.isArray(convData.conversations) && convData.conversations.length > 0) {
              setConversations(convData.conversations);
              setActiveId(convData.conversations[0].id);
            }
          } catch (e) {
            console.error("Error fetching user conversations:", e);
          }
        }
      }
    }
    checkAuth();
  }, []);

  // Sync settings to localStorage & HTML attributes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-accent', settings.accentColor || 'indigo');
    document.documentElement.setAttribute('data-bg', settings.backgroundStyle || 'dark');
  }, [settings]);

  // Sync conversations to localStorage & backend if user logged in
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(conversations));
    if (user) {
      const token = getStoredToken();
      if (token) {
        fetch('/api/user/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ conversations })
        }).catch(() => {});
      }
    }
  }, [conversations, user]);

  // Return to Welcome & Login Gate screen
  const handleReturnToWelcomeScreen = () => {
    setGuestMode(false);
    setUser(null);
    setShowAuthModal(false);
  };

  // Handle User Auth Success
  const handleAuthSuccess = (authUser: AuthUser, token?: string) => {
    setUser(authUser);
    setGuestMode(false);
    if (authUser.preferences?.theme) {
      setSettings(s => ({ ...s, theme: authUser.preferences?.theme || s.theme }));
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setGuestMode(false);
    setConversations(SEED_CONVERSATIONS);
    setActiveId(SEED_CONVERSATIONS[0].id);
  };

  // Auto TTS Read Function for Assistant Messages
  const speakTextIfEnabled = (text: string, forceOverride = false) => {
    if ((!settings.autoVoiceResponse && !forceOverride) || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/[*#`_]/g, '').trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = settings.voiceSpeed || 1.0;
      utterance.pitch = settings.voicePitch || 1.0;

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      if (settings.voiceName) {
        selectedVoice = voices.find(v => v.name === settings.voiceName);
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Scroll to bottom when new messages arrive
  const activeConv = conversations.find(c => c.id === activeId) || conversations[0];

  useEffect(() => {
    if (settings.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages, isGenerating]);

  // Handle create new conversation
  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'Nueva Transmisión',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: settings.selectedModel,
      isPinned: false,
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  // Delete conversation
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id);
      if (next.length === 0) {
        const fresh: Conversation = {
          id: `conv-${Date.now()}`,
          title: 'Nueva Transmisión',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          model: settings.selectedModel,
        };
        setActiveId(fresh.id);
        return [fresh];
      }
      if (activeId === id) {
        setActiveId(next[0].id);
      }
      return next;
    });
  };

  // Rename conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  // Toggle pin conversation
  const handleTogglePin = (id: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Clear current active conversation history
  const handleClearChat = () => {
    if (!activeConv) return;
    setConversations(prev =>
      prev.map(c => (c.id === activeId ? { ...c, messages: [] } : c))
    );
  };

  // Toggle dark/light theme
  const handleToggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  // Handle sending a message
  const handleSendMessage = async (text: string, attachment?: { name: string; type: 'image' | 'file' }) => {
    if (!activeConv) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment,
    };

    // Auto-set title from first message if title is default
    const updatedMessages = [...activeConv.messages, userMsg];
    let newTitle = activeConv.title;
    if (activeConv.messages.length === 0 && text.trim()) {
      newTitle = text.length > 28 ? text.slice(0, 28) + '...' : text;
    }

    setConversations(prev =>
      prev.map(c =>
        c.id === activeId
          ? {
              ...c,
              title: newTitle,
              messages: updatedMessages,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setIsGenerating(true);

    try {
      // Prepare payload for API
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const assistantMsgId = `msg-${Date.now() + 1}`;
      const initialAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Create assistant message placeholder immediately
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId
            ? {
                ...c,
                messages: [...c.messages, initialAssistantMsg],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );

      let accumulatedText = '';
      await sendChatMessageStream(
        {
          messages: apiMessages,
          systemInstruction: settings.systemInstruction,
          model: settings.selectedModel,
          temperature: settings.temperature,
        },
        (chunk) => {
          accumulatedText += chunk;
          setConversations(prev =>
            prev.map(c => {
              if (c.id !== activeId) return c;
              const updated = c.messages.map(m =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: accumulatedText,
                      tokens: Math.round(accumulatedText.length / 4),
                    }
                  : m
              );
              return { ...c, messages: updated };
            })
          );
        }
      );

      // Speak response out loud if auto voice enabled
      if (accumulatedText) {
        speakTextIfEnabled(accumulatedText);
      }
    } catch (err) {
      console.error("Error generating reply:", err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: '⚠️ Ocurrió una interrupción al generar la respuesta. Por favor, reintenta tu mensaje.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === activeId ? { ...c, messages: [...c.messages, errorMsg] } : c
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate last assistant response
  const handleRegenerate = async () => {
    if (!activeConv || activeConv.messages.length < 2) return;
    
    // Remove last assistant message
    const lastUserIdx = [...activeConv.messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserIdx === -1) return;

    const actualIdx = activeConv.messages.length - 1 - lastUserIdx;
    const trimmed = activeConv.messages.slice(0, actualIdx + 1);

    setConversations(prev =>
      prev.map(c => (c.id === activeId ? { ...c, messages: trimmed } : c))
    );

    setIsGenerating(true);

    try {
      const newAssistantMsgId = `msg-${Date.now()}`;
      const initialMsg: ChatMessage = {
        id: newAssistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === activeId ? { ...c, messages: [...c.messages, initialMsg] } : c
        )
      );

      let accumulatedText = '';
      await sendChatMessageStream(
        {
          messages: trimmed.map(m => ({ role: m.role, content: m.content })),
          systemInstruction: settings.systemInstruction,
          model: settings.selectedModel,
          temperature: settings.temperature,
        },
        (chunk) => {
          accumulatedText += chunk;
          setConversations(prev =>
            prev.map(c => {
              if (c.id !== activeId) return c;
              const updated = c.messages.map(m =>
                m.id === newAssistantMsgId
                  ? {
                      ...m,
                      content: accumulatedText,
                      tokens: Math.round(accumulatedText.length / 4),
                    }
                  : m
              );
              return { ...c, messages: updated };
            })
          );
        }
      );

      if (accumulatedText) {
        speakTextIfEnabled(accumulatedText);
      }
    } catch (err) {
      console.error("Regeneration error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete specific message
  const handleDeleteMessage = (msgId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === activeId
          ? { ...c, messages: c.messages.filter(m => m.id !== msgId) }
          : c
      )
    );
  };

  // Export data
  const handleExportData = (format: 'json' | 'markdown') => {
    if (!activeConv) return;
    let dataStr = '';
    let fileName = `${activeConv.title.replace(/\s+/g, '_')}_export`;

    if (format === 'json') {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeConv, null, 2));
      fileName += '.json';
    } else {
      let mdText = `# ${activeConv.title}\n*Modelo: ${activeConv.model}* | *Fecha: ${activeConv.createdAt}*\n\n---\n\n`;
      activeConv.messages.forEach(m => {
        mdText += `### ${m.role === 'user' ? '👤 Usuario' : '🤖 LM Chat AI'} (${m.timestamp})\n${m.content}\n\n`;
      });
      dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdText);
      fileName += '.md';
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear all local storage
  const handleClearAllData = () => {
    if (window.confirm("¿Seguro que deseas eliminar todas las conversaciones e historial local?")) {
      localStorage.removeItem(STORAGE_KEY_CONVS);
      setConversations(SEED_CONVERSATIONS);
      setActiveId(SEED_CONVERSATIONS[0].id);
      setSettingsOpen(false);
    }
  };

  // Background style helper
  const getBgStyleClass = () => {
    switch (settings.backgroundStyle) {
      case 'grid':
        return 'bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] bg-[#070710]';
      case 'cosmos':
        return 'bg-gradient-to-br from-[#090a16] via-[#050611] to-[#0d091a]';
      case 'oled':
        return 'bg-black text-white';
      case 'cyberpunk':
        return 'bg-[#03001e] text-[#00f0ff]';
      default:
        return 'bg-[var(--bg-main)]';
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${getBgStyleClass()} text-[var(--text-primary)] transition-colors duration-300 relative`}>
      {/* Cyberpunk Particles Background Layer */}
      {settings.backgroundStyle === 'cyberpunk' && <CyberpunkParticles />}

      {/* 1. Animated Splash Screen Logo on Launch */}
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* 2. Mandatory Login / Auth Gate Screen if user not logged in after splash */}
      {!showSplash && !user && !guestMode ? (
        <AuthGate
          onSuccess={handleAuthSuccess}
          onContinueAsGuest={() => setGuestMode(true)}
        />
      ) : (
        <>
          {/* Sidebar Navigation */}
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onSelectConversation={(id) => {
              setActiveId(id);
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
            onTogglePinConversation={handleTogglePin}
            onOpenSettings={() => setSettingsOpen(true)}
            user={user}
            onOpenAuthModal={handleReturnToWelcomeScreen}
            onOpenProfileModal={() => setShowProfileModal(true)}
          />

          {/* Main Chat Stage Shell */}
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Top Header */}
            <Header
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              selectedModel={settings.selectedModel}
              onSelectModel={(modelId) => setSettings(s => ({ ...s, selectedModel: modelId }))}
              theme={settings.theme}
              onToggleTheme={handleToggleTheme}
              onClearChat={handleClearChat}
              onOpenSettings={() => setSettingsOpen(true)}
              onOpenInstallModal={() => setShowInstallModal(true)}
              conversationTitle={activeConv?.title}
              user={user}
              onOpenAuthModal={handleReturnToWelcomeScreen}
              onOpenProfileModal={() => setShowProfileModal(true)}
            />

            {/* Scrollable Message List */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {!activeConv || activeConv.messages.length === 0 ? (
                /* Welcome / Empty Conversation Canvas */
                <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4 py-8 select-none">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 p-0.5 shadow-[0_0_45px_rgba(99,102,241,0.5)] mb-6 flex items-center justify-center">
                    <img
                      src="/logo.jpg"
                      alt="LM Chat AI Logo"
                      className="w-full h-full object-cover rounded-[22px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-2">
                    🤖 LM Chat AI
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                    Asistente conversacional de inteligencia artificial con motor full-stack, respuesta por voz y personalización avanzada.
                  </p>

                  {/* Install Mobile App Banner */}
                  <div className="mb-8 flex items-center justify-center w-full max-w-md">
                    <button
                      onClick={() => setShowInstallModal(true)}
                      className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-indigo-600/30 border border-indigo-400/40"
                    >
                      <Smartphone className="w-4 h-4 text-indigo-200" />
                      <span>📱 Instalar en Celular / Obtener APK Android</span>
                    </button>
                  </div>

                  {/* Starter Capability Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-8 text-left">
                    <button
                      onClick={() => handleSendMessage("Ayúdame a organizar mi agenda de estudio para esta semana con bloques de enfoque.")}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-indigo-600/10 border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white group-hover:text-indigo-300">📋 Plan de Estudio</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="text-[11px] text-slate-400">Organizar agenda con técnica Pomodoro y metas diarias.</p>
                    </button>

                    <button
                      onClick={() => handleSendMessage("Genera una función modular en TypeScript para validación estricta de formularios.")}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-indigo-600/10 border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white group-hover:text-indigo-300">💻 Código TypeScript</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="text-[11px] text-slate-400">Ejemplo de validación de entradas con tipos e interfaces.</p>
                    </button>
                  </div>

                  {/* Badges bar */}
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Historial Local Privado
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-indigo-400" /> Respuesta por Voz (TTS)
                    </span>
                  </div>
                </div>
              ) : (
                /* Messages List */
                <div className="space-y-4">
                  {activeConv.messages.map((m) => (
                    <MessageItem
                      key={m.id}
                      message={m}
                      onCopyText={(txt) => navigator.clipboard.writeText(txt)}
                      onRegenerate={m.role === 'assistant' ? handleRegenerate : undefined}
                      onDeleteMessage={handleDeleteMessage}
                      voiceSettings={{
                        rate: settings.voiceSpeed,
                        pitch: settings.voicePitch,
                        voiceName: settings.voiceName,
                      }}
                    />
                  ))}

                  {isGenerating && <ThinkingIndicator modelName={settings.selectedModel} />}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input Composer */}
            <MessageComposer
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
            />
          </div>

          {/* Settings Modal */}
          <SettingsModal
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            onUpdateSettings={(newS) => setSettings(s => ({ ...s, ...newS }))}
            onClearAllData={handleClearAllData}
            onExportData={handleExportData}
          />

          {/* Mobile Install & GitHub APK Modal */}
          <MobileInstallModal
            isOpen={showInstallModal}
            onClose={() => setShowInstallModal(false)}
          />

          {/* Authentication Modal (Login / Register / Forgot Password) */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />

          {/* User Profile Modal */}
          {user && (
            <UserProfileModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onLogout={handleLogout}
            />
          )}
        </>
      )}
    </div>
  );
}

