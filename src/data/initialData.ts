import { Conversation, AppSettings, ModelOption } from '../types';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    badge: 'RECOMENDADO',
    description: 'Rápido, preciso y optimizado para conversación y código.',
  },
  {
    id: 'LM-Titan-v4',
    name: 'LM-Titan-v4 (8b)',
    badge: 'NATIVO',
    description: 'Motor local de alta velocidad con procesamiento instantáneo.',
  },
  {
    id: 'LM-Reasoning-Pro',
    name: 'LM-Reasoning-Pro',
    badge: 'RAZONAMIENTO',
    description: 'Especializado en análisis complejo y lógica de programación.',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  selectedModel: 'gemini-3.6-flash',
  systemInstruction: 'Eres LM Chat AI, un asistente de inteligencia artificial avanzado, servicial, conciso y profesional en español. Respondes con estructura clara, bloques de código estilizados y respuestas analíticas.',
  temperature: 0.7,
  autoScroll: true,
};

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Optimización Neural & Arquitectura',
    model: 'gemini-3.6-flash',
    isPinned: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'Analiza la arquitectura del motor de LM Chat AI e identifica mejoras de rendimiento.',
        timestamp: '10:15 AM',
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content: "### 🚀 Análisis de Arquitectura & Optimización\n\nEl núcleo de **LM Chat AI** utiliza una arquitectura híbrida full-stack optimizada para baja latencia:\n\n```typescript\n// Estrategia de reintento y fallback asíncrono\nexport async function dispatchTask<T>(fn: () => Promise<T>): Promise<T> {\n  try {\n    return await fn();\n  } catch (error) {\n    console.warn(\"Fallback activado:\", error);\n    return fallbackEngine();\n  }\n}\n```\n\n**Puntos de Optimización Implementados:**\n1. **Zero-Copy Streaming:** Transferencia eficiente de buffers sin sobrecarga en la memoria.\n2. **Persistencia Local Inmediata:** Sincronización instantánea en `localStorage` para disponibilidad offline.\n3. **Renderizado Reactivo:** Componentes desacoplados con animaciones fluidas mediante `motion/react`.",
        timestamp: '10:16 AM',
        tokens: 142,
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Planificación Estratégica de Proyecto',
    model: 'LM-Titan-v4',
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content: '¿Cómo puedo estructurar la hoja de ruta de desarrollo para la nueva versión?',
        timestamp: 'Ayer',
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content: "### 📋 Hoja de Ruta Sugerida\n\n1. **Fase 1: Interfaz e Identidad Visual (Immersive UI)**\n   - Panel lateral animado con búsqueda.\n   - Selector de modelos e indicador de estado del sistema.\n2. **Fase 2: Conectividad Full-Stack**\n   - API Server-side con soporte para Gemini y motor local de respaldo.\n3. **Fase 3: Funcionalidades Avanzadas**\n   - Adjuntos, exportación de conversaciones y ajustes personalizados.",
        timestamp: 'Ayer',
        tokens: 98,
      },
    ],
  },
];
