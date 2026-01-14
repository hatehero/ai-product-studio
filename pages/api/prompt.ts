import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// ✅ KEMASKINI: Gunakan v1beta untuk akses gemini-1.5-flash yang lebih fleksibel
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(userPrompt: string): Promise<string> {
  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional AI image prompt engineer. 
                Theme: ${userPrompt}
                Task: Generate 5 professional camera angle prompts for AI image generation.
                Output: Provide only a numbered list 1 to 5 in English.`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.8,
        }
      }),
    });

    const data = await response.json();

    // Semak ralat daripada Google AI Studio
    if (!response.ok) {
      throw new Error(data.error?.message || `API Error: ${response.status}`);
    }

    // Ekstrak hasil teks mengikut struktur JSON Gemini
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    throw new Error("AI tidak memulangkan sebarang teks.");
  } catch (error: any) {
    throw new Error(error.message || "Gagal menghubungi Google AI Studio");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt kosong" });

  try {
    const result = await callGemini(prompt);
    res.status(200).json({ result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
