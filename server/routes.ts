import type { Express } from "express";
import { createServer, type Server } from "node:http";
import ttsRoutes from "./routes/tts";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(ttsRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
