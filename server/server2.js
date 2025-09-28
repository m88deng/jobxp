/*
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// JSON parsing
app.use(express.json());

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Test route
app.get("/ping", (req, res) => {
  res.json({ status: "alive" });
});

app.post("/parse-job", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract key info from this job description:\n\n${text}`,
    });
    res.json({ parsed: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse text" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
*/
// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

async function startServer() {
  // Initialize Gemini client
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('✅ Gemini client initialized');

  // Test route
  app.get('/ping', (req, res) => res.json({ status: 'alive' }));

  // Parse route
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
      console.error(err);
      res.status(500).json({ error: 'Failed to parse text' });
    }
  });

  // Start server
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

  // Keep process alive (needed on some macOS Node setups)
  await new Promise(() => {}); 
}

startServer().catch(err => console.error(err));
