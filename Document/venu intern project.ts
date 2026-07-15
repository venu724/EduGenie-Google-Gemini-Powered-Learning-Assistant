import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

export default askGemini;import express from "express";
import askGemini from "./gemini.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const reply = await askGemini(message);

        res.json({ reply });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

export default router;import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const send = async () => {
    const res = await axios.post("http://localhost:5000/chat", {
      message,
    });

    setReply(res.data.reply);
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={send}>Ask AI</button>

      <p>{reply}</p>
    </div>
  );
}