import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  Sliders, 
  Cpu, 
  Trash2, 
  Download, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Database
} from 'lucide-react';
import { AppSettings } from '../types';
import { AVAILABLE_MODELS } from '../data/initialData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearAllData: () => void;
  onExportData: (format: 'json' | 'markdown') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllData,
  onExportData,
}) => {
  const [systemInst, setSystemInst] = useState(settings.systemInstruction);
  const [temp, setTemp] = useState(settings.temperature);
  const [apiStatus, setApiStatus] = useState<{ checked: boolean; online: boolean; message: string }>({
    checked: false,
    online: false,
    message: '',
  });

  useEffect(() => {
    setSystemInst(settings.systemInstruction);
    setTemp(settings.temperature);
  }, [settings]);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiStatus({
        checked: true,
        online: data.status === 'online',
        message: `Servidor Operativo (${data.service}). API Key Gemini: ${data.apiKeyConfigured ? 'Configurada' : 'No configurada (Modo Local Activo)'}`,
      });
    } catch (err) {
      setApiStatus({
        checked: true,
        online: false,
        message: 'No se pudo conectar con el servidor backend.',
      });
    }
  };

  const handleSave = () => {
    onUpdateSettings({
      systemInstruction: systemInst,
      temperature: temp,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl overflow-hidden relative text-slate-200 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-white">Configuración del Sistema</h2>
                <p className="text-xs text-slate-400">Personaliza la conducta de la IA y tus preferencias.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* System Prompt Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Instrucciones del Sistema (System Prompt)
              </label>
              <textarea
                value={systemInst}
                onChange={(e) => setSystemInst(e.target.value)}
                rows={3}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 leading-relaxed"
                placeholder="Define el comportamiento predeterminado de la IA..."
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Creatividad / Temperatura ({temp})</span>
                </label>
                <span className="text-[10px] text-indigo-400 font-mono">
                  {temp < 0.4 ? 'Preciso' : temp > 0.8 ? 'Creativo' : 'Equilibrado'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* API Health Inspector */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Estado del Servidor API</span>
                </div>
                <button
                  type="button"
                  onClick={checkHealth}
                  className="py-1 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono transition-colors"
                >
                  Verificar Estado
                </button>
              </div>
              {apiStatus.checked && (
                <div className="mt-2 text-xs flex items-start gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  {apiStatus.online ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-slate-300 text-[11px]">{apiStatus.message}</span>
                </div>
              )}
            </div>

            {/* Export & Data Management */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Gestión de Datos
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onExportData('markdown')}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Exportar Markdown</span>
                </button>

                <button
                  type="button"
                  onClick={() => onExportData('json')}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Exportar JSON</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClearAllData}
                className="w-full mt-3 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Borrar Todo el Histórico Local</span>
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="pt-5 border-t border-[var(--border-subtle)] mt-5 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
