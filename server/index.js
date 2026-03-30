import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env relative to server/ folder
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/api/predictRisk', async (req, res) => {
  try {
    const factors = req.body.factors;
    if (!factors) {
      return res.status(400).json({ error: 'Missing factors' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in the .env file!");
      return res.status(500).json({ error: 'LLM Key missing on server' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // We define the schema to strictly govern the LLM output into
    // the JSON properties we expect in the frontend.
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        score: {
          type: Type.NUMBER,
          description: "Float score between 0 and 10, indicating overall opportunity crime risk."
        },
        risk: {
          type: Type.STRING,
          description: "One of: 'low', 'medium', 'high'"
        },
        metrics: {
          type: Type.OBJECT,
          properties: {
            crimeImpact: { type: Type.INTEGER, description: "Scale 0-100" },
            lightingDeficiency: { type: Type.INTEGER, description: "Scale 0-100" },
            crowdExposure: { type: Type.INTEGER, description: "Scale 0-100" },
            policePresence: { type: Type.INTEGER, description: "Scale 0-100" },
            surveillanceGap: { type: Type.INTEGER, description: "Scale 0-100" },
            escapeVulnerability: { type: Type.INTEGER, description: "Scale 0-100" }
          },
          required: [
            "crimeImpact", "lightingDeficiency", "crowdExposure", 
            "policePresence", "surveillanceGap", "escapeVulnerability"
          ]
        }
      },
      required: ["score", "risk", "metrics"]
    };

    const prompt = `
      You are an expert Urban Planning and Police Governance AI. Evaluate a sector based on the following environmental factors (each out of 10):
      - Lighting Density: ${factors.lighting}
      - Crowd Volume: ${factors.crowd}
      - Police Law Enforcement: ${factors.police}
      - CCTV Density: ${factors.cctvDensity}
      - Escape Routes (Egress paths): ${factors.escapeRoutes}
      - Recent Incident History: ${factors.recentIncidents}

      Please compute the risk factors algorithmically, keeping in mind that sparse lighting, low police, high escapes, and high incidents severely increase risk. Evaluate compounding edge cases wisely. Do not explain, just return the JSON object defined by the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const result = JSON.parse(response.text);
    return res.json(result);

  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: 'Failed to evaluate risk' });
  }
});

app.listen(PORT, () => {
  console.log(`LLM Backend listening on http://localhost:${PORT}`);
});
