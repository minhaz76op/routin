import type { Express } from "express";
import { createServer, type Server } from "node:http";
import ttsRoutes from "./routes/tts";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(ttsRoutes);

  app.post("/api/checkouts", async (req, res) => {
    try {
      const { amount, userId } = req.body;
      const checkout = await storage.createCheckout({ amount, userId, status: "completed" });
      res.json(checkout);
    } catch (error) {
      res.status(500).json({ error: "Failed to create checkout" });
    }
  });

  app.get("/api/checkouts", async (req, res) => {
    try {
      const checkouts = await storage.getCheckouts();
      res.json(checkouts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch checkouts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
