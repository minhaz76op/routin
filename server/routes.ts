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

  app.post("/api/checkins", async (req, res) => {
    try {
      const { routineId } = req.body;
      await storage.createCheckIn(routineId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Failed to create check-in" });
    }
  });

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getCheckInData();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
