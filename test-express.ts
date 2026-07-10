import express from "express";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/test", async (req, res) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
     const response = await ai.models.generateContent({
         model: 'gemini-3.5-flash',
         contents: "say hi hello",
     });
     res.json({ text: response.text });
  } catch (e: any) {
     res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => {
   console.log("Listening 3001");
});
