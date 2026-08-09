import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Smartphone, 
  Download, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Share2,
  QrCode,
  Layers
} from 'lucide-react';

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileInstallModal: React.FC<MobileInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl relative text-slate-200 select-none overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md">
                <img src="/logo.jpg" alt="LM Chat AI" className="w-full h-full object-cover rounded-[14px]" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-white">Instalar en Teléfono / APK GitHub</h2>
                <p className="text-xs text-indigo-300">LM Chat AI en Android & iOS</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
            {/* Option 1: PWA Direct Installation */}
            <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30">
              <div className="flex items-center gap-2 font-bold text-xs text-indigo-300 uppercase tracking-wider mb-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Opción 1: Instalación Instantánea sin APK (PWA)</span>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Puedes instalar **LM Chat AI** como aplicación nativa en tu teléfono directamente desde el navegador de tu dispositivo sin necesidad de descargas externas:
              </p>
              <ol className="text-xs text-slate-300 space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Abre el menú de tu navegador (**Chrome** en Android o **Safari** en iPhone).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Selecciona **"Añadir a la pantalla de inicio"** o **"Instalar aplicación"**.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>¡Listo! Verás el nuevo icono de **LM Chat AI** en el menú de tu celular con pantalla de inicio y logo personalizado.</span>
                </li>
              </ol>
            </div>

            {/* Option 2: Build APK via GitHub Actions */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-400 uppercase tracking-wider mb-2">
                <Github className="w-4 h-4" />
                <span>Opción 2: Compilación Automática de APK en GitHub</span>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Hemos incluido el flujo de **GitHub Actions** (`.github/workflows/build-apk.yml`) y la configuración de **Capacitor**.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pasos para obtener tu APK desde GitHub:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal pl-6">
                  1. Haz clic en el menú superior derecho de **AI Studio** -&gt; **Exportar a GitHub**.<br/>
                  2. En tu repositorio de GitHub, la pestaña **Actions** compilará el archivo `.apk` de forma automática.<br/>
                  3. Descarga el archivo **LM-Chat-AI-Android-APK.zip** directamente en tu celular e instálalo.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="pt-4 border-t border-[var(--border-subtle)] mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
