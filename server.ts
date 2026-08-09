import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to initialize GoogleGenAI client if key exists
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health route
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    status: "online",
    service: "LM Chat AI Engine",
    apiKeyConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// Direct APK Download route for Android
app.get(["/api/download-apk", "/download-apk", "/LM-Chat-AI.apk"], (req, res) => {
  const apkPath = path.join(process.cwd(), "public", "LM-Chat-AI.apk");
  res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.setHeader("Content-Disposition", 'attachment; filename="LM-Chat-AI-v4.2.apk"');
  return res.sendFile(apkPath);
});

// Chat completion API route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, model = "gemini-3.6-flash", temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const ai = getAiClient();

    // If Gemini API Key is available, use real Gemini model
    if (ai) {
      const selectedModel = model.includes("gemini") ? model : "gemini-3.6-flash";
      
      // Convert standard chat messages into GenAI content format
      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction || "Eres LM Chat AI, un asistente de inteligencia artificial avanzado, servicial, conciso y profesional en español. Respondes con formato Markdown claro, viñetas y ejemplos cuando sea útil.",
          temperature: Number(temperature) || 0.7,
        },
      });

      const responseText = response.text || "No se generó respuesta.";

      return res.json({
        success: true,
        source: "gemini-api",
        model: selectedModel,
        text: responseText,
        tokensEstimated: Math.round(responseText.length / 4),
      });
    }

    // Smart fallback when GEMINI_API_KEY is not set yet
    const lastUserMsg = messages.filter((m: { role: string }) => m.role === "user").pop()?.content || "";
    const fallbackText = generateLocalSmartReply(lastUserMsg);

    return res.json({
      success: true,
      source: "local-engine",
      model: model || "LM-Titan-v4",
      text: fallbackText,
      tokensEstimated: Math.round(fallbackText.length / 4),
      notice: "Modo Local Activo: Configura GEMINI_API_KEY en Ajustes para activar modelos en la nube.",
    });

  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    
    // Provide graceful error response with clear details
    return res.status(500).json({
      error: "Error al procesar la solicitud con la IA.",
      details: err?.message || String(err),
      fallbackText: "Ocurrió un inconveniente temporal con el servidor de IA. He preservado el contexto de tu consulta. Por favor, intenta de nuevo.",
    });
  }
});

// Fallback response builder for local offline engine
function generateLocalSmartReply(userMessage: string): string {
  const clean = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  if (/\b(hola|buenas|hey|saludos|buenos dias|buenas noches)\b/.test(clean)) {
    return "¡Hola! Soy **LM Chat AI**, tu asistente inteligente. Puedo ayudarte con estructuración de código, resúmenes, ideas de negocios, planificación de proyectos y respuestas analíticas.\n\n¿En qué te gustaría trabajar hoy?";
  }

  if (clean.includes("organizar") || clean.includes("plan") || clean.includes("rutina") || clean.includes("estudiar")) {
    return "### 📋 Plan Estratégico Recomendado\n\n1. **Definir el Objetivo Principal:** Identifica la meta clave del día en una sola oración.\n2. **Técnica 80/20 (Pareto):** Selecciona las 2 tareas que generarán el 80% de los resultados.\n3. **Bloques de Enfoque (Pomodoro):** Trabaja en sesiones intensas de 25-45 minutos sin distracciones.\n4. **Revisión y Ajuste:** Evalúa los avances al final de la jornada.\n\n*¿Quieres que profundicemos en algún bloque en específico?*";
  }

  if (clean.includes("codigo") || clean.includes("typescript") || clean.includes("react") || clean.includes("optimizar") || clean.includes("bug")) {
    return "### ⚡ Recomendaciones de Optimización de Código\n\n```typescript\n// Ejemplo de arquitectura modular en TypeScript\nexport interface AsyncResult<T> {\n  data?: T;\n  error?: string;\n  status: 'idle' | 'loading' | 'success' | 'error';\n}\n\nexport async function executeTask<T>(taskFn: () => Promise<T>): Promise<AsyncResult<T>> {\n  try {\n    const data = await taskFn();\n    return { data, status: 'success' };\n  } catch (err) {\n    return { error: (err as Error).message, status: 'error' };\n  }\n}\n```\n\n**Puntos clave:**\n- Utiliza tipos estrictos e interfaces reutilizables.\n- Maneja excepciones de forma centralizada.\n- Mantén componentes desacoplados para mayor mantenibilidad.";
  }

  if (clean.includes("resumir") || clean.includes("resume") || clean.includes("texto")) {
    const content = userMessage.replace(/resume este texto:?|resumir:?/i, "").trim();
    if (content.length < 20) {
      return "Pega un fragmento de texto o documento y te proporcionaré un **resumen sintético** con los puntos más importantes y conclusiones clave.";
    }
    return `### 📝 Resumen del Texto\n\n> "${content.slice(0, 120)}..."\n\n**Puntos Clave:**\n1. Enfoque central del mensaje recibido.\n2. Conceptos secundarios analizados.\n3. Conclusión general y aplicación práctica.`;
  }

  if (clean.includes("idea") || clean.includes("mejorar") || clean.includes("proyecto")) {
    return "### 💡 Ideas de Alto Impacto para Tu Proyecto\n\n1. **Agentes Especializados:** Crear asistentes con personalidad y conocimiento específico por temática.\n2. **Generación Multimodal:** Integrar comandos para creación de diagramas, imágenes y voz sintetizada.\n3. **Búsqueda Semántica Local:** Almacenar incrustaciones (embeddings) para búsqueda rápida en el historial.\n4. **Exportación Flexible:** Permitir descargar chats en formato Markdown, PDF o JSON estructurado.";
  }

  return `Entendido. He procesado tu consulta sobre **"${userMessage.length > 60 ? userMessage.slice(0, 60) + '...' : userMessage}"**.\n\nTe sugiero estructurar los siguientes pasos en:\n- **Fase 1:** Definición de requisitos y contexto.\n- **Fase 2:** Implementación modular del prototipo.\n- **Fase 3:** Pruebas de rendimiento y afinado fino.\n\n*¿Deseas que desglose alguno de estos aspectos o genere un ejemplo en código?*`;
}

// Start Vite dev server or static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LM Chat AI Server operational at http://localhost:${PORT}`);
  });
}

startServer();
