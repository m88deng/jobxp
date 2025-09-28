// server/server.js
require('dotenv').config(); // loads .env automatically
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // adjust if your frontend is on a different port
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON body
app.use(bodyParser.json());

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Test route to confirm server is alive
app.get('/ping', (req, res) => {
  res.json({ status: 'alive' });
});

// Endpoint to parse job descriptions
app.post('/parse-job', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `ONLY RETURN JSON. DO NOT WRITE ANY TEXT OUTSIDE OF THE JSON OBJECT.
Do not add explanations, summaries, or headers. Do not add greetings.
Return only valid JSON with the exact fields below. 
Do NOT add explanations, bullet points, or any text. 
Do not include backticks or markdown. 
Do not include quotes around keys other than standard JSON double quotes.
Respond strictly in the following JSON format:
{
  "position": "",
  "company": "",
  "dateApplied": "YYYY-MM-DD",
  "salary": "",
  "location": "", 
  "keySkills": [],
  "dailyResponsibilities": [],
  "companyDescription": "",
  "rawText": "original job description"
}
Use today's date for dateApplied. Below is the job description you should extract data from.
For companyDescription, use at most 3 sentences to summarize the company.
Please only return me a json file. DO NOT ADD ANY EXTRA WORDS OR TEXT.
Job description:
${text}
    `
    });
    let parsedData;
    try {
      parsedData = JSON.parse(response.text.trim());
    } catch (err) {
      console.error("Failed to parse JSON from Gemini response:", response.text);
      return res.status(500).json({ error: "Failed to parse JSON from Gemini" });
    }

    console.log("PARSED DATA IN JSON?")
    console.log(parsedData)
    console.log("PARSED DATA IN JSON?")

    res.json(parsedData);

  } catch (err) {
    console.error("Gemini error failed to send json:", err);
    res.status(500).json({ error: err.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
