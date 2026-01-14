import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// ✅ PEMBETULAN: Menggunakan versi /v1/ yang stabil untuk gemini-1.5-flash
const MODEL_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
                text: `You are an expert AI Image Prompt Engineer. 
                Based on this product theme: "${userPrompt}", generate 5 professional camera angle prompts for AI image generation. 
                Provide only the numbered list 1 to 5 in English.`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        }
      }),
    });

    const data = await response.json();

    // Semak ralat daripada Google
    if (!response.ok) {
      throw new Error(data.error?.message || `Ralat API: ${response.status}`);
    }

    // Ekstrak hasil teks daripada struktur respons Google Gemini
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    throw new Error("Gemini tidak memulangkan sebarang teks.");
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
    // Mesej ralat akan dipaparkan pada skrin UI anda
    res.status(500).json({ error: e.message });
  }
}
