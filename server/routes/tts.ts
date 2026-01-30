import { Router, Request, Response } from "express";
import { textToSpeech } from "../replit_integrations/audio/client";

const router = Router();

router.post("/api/tts", async (req: Request, res: Response) => {
  try {
    const { text, voice = "shimmer" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const audioBuffer = await textToSpeech(text, voice, "mp3");
    const base64Audio = audioBuffer.toString("base64");

    res.json({ audio: base64Audio });
  } catch (error) {
    console.error("Error generating TTS:", error);
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

export default router;
