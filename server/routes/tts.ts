import { Router, Request, Response } from "express";
import { textToSpeech } from "../replit_integrations/audio/client";

const router = Router();

const audioCache = new Map<string, Buffer>();

router.post("/api/tts", async (req: Request, res: Response) => {
  try {
    const { text, voice = "nova" } = req.body;

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

router.get("/api/tts/:hash", async (req: Request, res: Response) => {
  try {
    const hash = req.params.hash;
    if (typeof hash !== "string") {
      return res.status(400).json({ error: "Invalid hash" });
    }
    const text = Buffer.from(hash, "base64url").toString("utf-8");
    
    if (!text) {
      return res.status(400).json({ error: "Invalid hash" });
    }

    const cacheKey = `nova:${text}`;
    let audioBuffer = audioCache.get(cacheKey);
    
    if (!audioBuffer) {
      audioBuffer = await textToSpeech(text, "nova", "mp3");
      audioCache.set(cacheKey, audioBuffer);
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.length);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(audioBuffer);
  } catch (error) {
    console.error("Error generating TTS:", error);
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

export default router;
