# 🤖 LM Chat AI

LM Chat AI es una aplicación web local e interactiva en español que funciona como asistente conversacional, incorporando persistencia de historial local, modo claro y oscuro, y un tema visual **Immersive UI**.

---

## 🌟 Características Principales

- **Diseño Immersive UI**: Tema moderno con efectos de brillo ambiental, tarjetas translúcidas, tipografía cuidada y soporte completo para modo claro/oscuro.
- **Historial Persistente**: Guarda automáticamente las conversaciones en el `localStorage` del navegador sin necesidad de servidores externos.
- **Lógica de Respuestas Local**: Maneja saludos, solicitudes de resúmenes, planificación de tareas, ideas y sugerencias de mejora.
- **Sugerencias Rápidas**: Incluye botones interactivos con prompts predefinidos para iniciar conversaciones al instante.
- **Renderizado Seguro y Accesible**: Uso directo de nodos DOM para prevenir vulnerabilidades de inyección HTML, atributos ARIA e indicadores de estado en tiempo real.

---

## 📂 Estructura del Proyecto

```
/
├── index.html        # Estructura principal y maquetación HTML5
├── css/
│   └── style.css     # Estilos globales, variables CSS y diseño Immersive UI
├── js/
│   └── app.js        # Lógica de la aplicación, manejo de estado e historial
├── metadata.json     # Metadatos del proyecto
├── package.json      # Configuración de dependencias y scripts de Vite
├── vite.config.ts    # Configuración del servidor de desarrollo y empaquetado
└── README.md         # Documentación oficial del proyecto
```

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** (o yarn/pnpm)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/luismiguel4953-stack/LM-Chat-AI.git
   cd LM-Chat-AI
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:3000` (o la dirección indicada en la consola).

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los archivos listos para despliegue se generarán en la carpeta `dist/`.

---

## 🚀 Cómo Sincronizar y Exportar a GitHub desde Google AI Studio

Para mantener este repositorio sincronizado con tus cambios desde Google AI Studio:

1. Dirígete al menú superior de **Ajustes / Configuración (Settings)** en Google AI Studio.
2. Haz clic en **Export to GitHub** (o conectar con GitHub).
3. Selecciona tu repositorio `luismiguel4953-stack/LM-Chat-AI` y autoriza la vinculación para empujar todos los archivos y actualizaciones directamente a la rama principal (`main`).

---

## 📝 Modificación y Extensión

- Para agregar nuevas reglas de respuesta local, modifica la función `buildReply` en `js/app.js`.
- Para ajustar paletas de color o sombras, edita las variables CSS en `:root` y `[data-theme="light"]` dentro de `css/style.css`.
- Para conectar un proveedor de IA real (como la API de Gemini), crea un endpoint backend en Node.js/Express para realizar las peticiones de forma segura.

