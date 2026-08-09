import React from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles, Cpu } from 'lucide-react';

interface ThinkingIndicatorProps {
  modelName?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ modelName = 'LM Chat AI' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 max-w-4xl mx-auto my-4 justify-start select-none"
    >
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
        <Bot className="w-4 h-4 text-white animate-pulse" />
      </div>

      {/* Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 backdrop-blur-md shadow-xl flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
            className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
            className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>{modelName} está procesando respuesta...</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Generando razonamiento neural</span>
        </div>
      </div>
    </motion.div>
  );
};
