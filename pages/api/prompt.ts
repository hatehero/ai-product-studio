import type { NextApiRequest, NextApiResponse } from "next";

// Masukkan API Key anda dalam .env.local sebagai GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
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
                text: `Bina 5 prompt sudut kamera (camera angle) berbeza dalam Bahasa Inggeris untuk AI image generation berdasarkan tema ini: ${userPrompt}. Berikan senarai nombor 1 hingga 5 sahaja.`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Ralat API Gemini");
    }

    // Ekstrak teks daripada struktur respons Gemini
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
    res.status(500).json({ error: e.message });
  }
}
