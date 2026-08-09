import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Sparkles, 
  X, 
  Image as ImageIcon,
  Zap,
  CornerDownLeft
} from 'lucide-react';

interface MessageComposerProps {
  onSendMessage: (text: string, attachment?: { name: string; type: 'image' | 'file' }) => void;
  isGenerating: boolean;
  onSelectSuggestion?: (prompt: string) => void;
}

const QUICK_SUGGESTIONS = [
  'Organizar mi día',
  'Optimizar código TypeScript',
  'Ideas de proyecto IA',
  'Resumir documento',
];

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  isGenerating,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; type: 'image' | 'file' } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !attachment) || isGenerating) return;

    onSendMessage(inputText.trim(), attachment || undefined);
    setInputText('');
    setAttachment(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      setAttachment({
        name: file.name,
        type: isImg ? 'image' : 'file',
      });
    }
  };

  const handleEnhancePrompt = () => {
    if (!inputText.trim()) return;
    setInputText(`Por favor, analiza en detalle el siguiente requerimiento, proporcionando ejemplos claros y estructura profesional: "${inputText.trim()}"`);
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate voice dictation text insertion
      setTimeout(() => {
        setInputText(prev => (prev ? `${prev} ` : '') + 'Generar resumen estratégico de rendimiento...');
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pb-6 pt-2 select-none">
      {/* Quick Suggestions Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-indigo-400" />
          Sugerencias:
        </span>
        {QUICK_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(s)}
            className="py-1 px-3 rounded-full bg-white/5 border border-white/10 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer text-[11px]"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Attachment Chip Preview */}
      {attachment && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 w-fit">
          {attachment.type === 'image' ? <ImageIcon className="w-3.5 h-3.5" /> : <Paperclip className="w-3.5 h-3.5" />}
          <span className="truncate max-w-xs">{attachment.name}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-0.5 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Box Shell */}
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-2xl bg-[var(--bg-input)] border transition-all shadow-2xl overflow-hidden ${
          inputText.trim()
            ? 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)]'
            : 'border-[var(--border-subtle)]'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje a LM Chat AI..."
          rows={1}
          maxLength={4000}
          className="w-full bg-transparent px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder:text-slate-500 focus:outline-none resize-none max-h-48 leading-relaxed"
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.txt,.js,.ts,.json"
        />

        {/* Composer Toolbar Bottom */}
        <div className="px-3 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
          {/* Left Action Tools */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Adjuntar archivo o imagen"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Dictado por voz"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleEnhancePrompt}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
              title="Mejorar prompt con IA"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Tools & Send Button */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] text-slate-500 font-mono">
              {inputText.length} / 4,000
            </span>

            <button
              type="submit"
              disabled={(!inputText.trim() && !attachment) || isGenerating}
              className={`py-2 px-4 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                inputText.trim() && !isGenerating
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:scale-105'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
