// server/server.js
import 'dotenv/config';  // loads .env automatically
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/ping', (req, res) => res.json({ status: 'alive' }));

/*app.post('/parse-job', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract key info from this job description:\n\n${text}`,
    });
    res.json({ parsed: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse text' });
  }
});*/
app.post('/parse-job', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract key info from this job description:\n\n${text}`,
    });
    res.json({ parsed: response.text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: err.message || "Failed to parse text" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
