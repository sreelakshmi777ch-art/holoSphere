import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Google GenAI client if GEMINI_API_KEY is available
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API Route: AI Assistant Chat
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!ai) {
        // Fallback response when GEMINI_API_KEY is not configured
        const fallbackText = `[HoloSphere Core Engine - Offline Intelligence Mode]\n\nI have received your instruction: "${message}".\n\nAll primary system modules (3D Earth Engine, MediaPipe Gesture Tracking, Web Speech Recognition, Audio Synthesizer, and Telemetry Monitors) are active and fully operational. To enable real-time Gemini AI neural queries, ensure your GEMINI_API_KEY is configured in the AI Studio Secrets panel.`;
        return res.json({ reply: fallbackText, model: "HoloSphere Local Core" });
      }

      const promptContext = `System Instruction: You are HoloSphere AI, an advanced holographic operating system assistant (JARVIS style). Answer the user accurately, intelligently, and clearly. Use concise formatting with markdown, bullet points, or code snippets when helpful.\n\nUser Question: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptContext,
      });

      const replyText = response.text || "HoloSphere AI: Processing query completed with no output text.";
      return res.json({ reply: replyText, model: "gemini-3.6-flash" });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: "AI Query Error",
        details: error?.message || "An unexpected error occurred during neural inference."
      });
    }
  });

  // API Route: System Diagnostics & Telemetry
  app.get("/api/system/metrics", (req, res) => {
    const memoryUsage = process.memoryUsage();
    res.json({
      status: "ONLINE",
      fps: 60,
      cpuUsagePercent: Math.floor(18 + Math.random() * 22),
      gpuMemoryMB: Math.floor(1420 + Math.random() * 300),
      gpuMemoryTotalMB: 8192,
      ramUsedGB: (memoryUsage.heapUsed / 1024 / 1024 / 1024).toFixed(2),
      ramTotalGB: 16,
      networkLatencyMs: Math.floor(12 + Math.random() * 8),
      uptimeSeconds: Math.floor(process.uptime()),
      coreTemperatureC: Math.floor(42 + Math.random() * 5),
    });
  });

  // Vite Middleware or Static Assets
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
    console.log(`[HoloSphere OS] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
