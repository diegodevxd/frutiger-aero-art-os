# 🎨 Frutiger Aero OS - Fine Arts Digital Portfolio

An interactive, multi-window operating system simulation environment built to showcase the fine arts and plastic art portfolio of "Demian Tenorio". This platform is styled completely under the nostalgic, glossy, and fluid Web 2.0 *Frutiger Aero* / *Windows XP* design paradigm.

## 🚀 Key Technical Architectures

- **Custom Multi-Window Workspace Engine:** Implements an advanced vanilla JavaScript layout controller managing active desktop instances. Includes dynamic drag-and-drop state listeners (`initializeDragEvents`), active window layering via asynchronous Z-index manipulation, and structural minification states.
- **Embedded Native Applications Stack:**
  - **HTML5 Canvas Paint Utility:** A fully functional digital drawing sketchpad driven by mouse events (`isDrawing`), canvas stroke tracking, and pixel rendering pipelines.
  - **Asynchronous Audio Playlist Engine:** A modular media stream interface managing audio track array indexing, real-time progress bar recalculations, and dynamic iframe source manipulation.
  - **State-Driven Calculator Node:** A mathematical layout interpreter supporting immediate operand updates, floating operations, and error catching loops.
- **Intelligent Performance Optimization Guard (`performance-mode`):** To preserve a smooth rendering pipeline (60 FPS) during intense DOM interactions, the system contextually toggles a lightweight layout class during active window drags. This immediately pauses expensive CSS keyframe bubble animations and reduces background opacity vectors to mitigate rendering overhead.
- **Glossy Skeuomorphic Shader System:** A handcrafted UI library leveraging sophisticated CSS background layer filtering, liquid floating animations, glassmorphic taskbars, and custom system-level icon grids optimized for high fluid responsiveness.

## 🛠️ Technology Stack

- **System Architecture:** HTML5 (Semantic shell modeling)
- **Visual Interface Matrix:** CSS3 (Custom property tokens, glassmorphic filters, continuous coordinate animations, and mobile layout break configurations)
- **Core Kernel Scripting:** Vanilla JavaScript (ES6 Execution contexts, functional scope tracking, performance triggers, and interactive DOM mutations)

---

## 📦 Directory Layout & Assets

```
frutiger-art-os/
│
├── index.html          # Shell viewport and structural native window markup nodes
├── styles.css          # Skeuomorphic styling, taskbar layouts, window animations, and media arrays
└── script.js          # Window lifecycle managers, canvas event binders, calculations, and media pipelines
```

---

## 💻 Local Workspace Spawning

This application runs strictly client-side on any modern high-performance web runtime environment without compilation overhead.

### Direct Access
1. Clone this repository to your filesystem.
2. Open the root `index.html` file in your preferred internet browser terminal.

### Production Environment Simulation
To thoroughly audit asset resolution or review background media streams across standard network sockets, spin up the terminal directory inside a lightweight local web server:

```bash
# Servicing through Python
python -m http.server 8000

# Servicing through Node.js (http-server toolkit)
npx http-server -p 8000
```
Once initialized, form a persistent socket connection loop via `http://localhost:8000`.

## 📄 License

This digital portfolio core architecture is open-source software distributed under the terms of the **MIT License**.
