import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// ✅ URL yang telah dibetulkan (v1beta dan susunan model yang tepat)
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
                text: `Bina 5 prompt sudut kamera (camera angle) berbeza dalam Bahasa Inggeris untuk AI image generation berdasarkan tema ini: ${userPrompt}. Berikan senarai nombor 1 hingga 5 sahaja tanpa sebarang pengenalan atau ulasan tambahan.`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 1.0, // Memberi lebih variasi pada sudut kamera
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Menangkap mesej ralat spesifik daripada Google jika ada (seperti ralat model tidak dijumpai)
      throw new Error(data.error?.message || `Ralat API Gemini (${response.status})`);
    }

    // ✅ Ekstrak teks mengikut struktur data Google Gemini
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
    // Memastikan ralat dipaparkan dengan jelas di UI
    res.status(500).json({ error: e.message });
  }
}
