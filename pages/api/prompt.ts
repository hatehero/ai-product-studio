import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_KEY = process.env.HF_API_KEY!;
// ✅ Gunakan URL Inference API yang stabil
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callHF(userPrompt: string, retries = 5): Promise<string> {
  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<s>[INST] Bina 5 prompt sudut kamera (camera angle) berbeza dalam Bahasa Inggeris untuk AI image generation berdasarkan tema ini: ${userPrompt}. Berikan senarai 1 hingga 5 sahaja tanpa ulasan tambahan. [/INST]`,
        parameters: {
          max_new_tokens: 500,
          return_full_text: false, // Hanya ambil teks baru yang dijana
        },
      }),
    });

    // 1. Semak jika ralat bukan JSON (Not Found/Bad Gateway)
    if (!response.ok) {
      const errorText = await response.text();
      
      // Jika model sedang loading, buat percubaan semula (retry)
      if (errorText.includes("loading") || response.status === 503) {
        if (retries <= 0) throw new Error("Model masih dimuatkan oleh server. Sila cuba sebentar lagi.");
        await sleep(10000); 
        return callHF(userPrompt, retries - 1);
      }
      
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // 2. Ekstrak teks daripada array (Format standard Inference API)
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }

    // 3. Jika data adalah objek terus
    if (data?.generated_text) {
      return data.generated_text.trim();
    }

    throw new Error("Format respons tidak dikenali.");
  } catch (error: any) {
    throw new Error(error.message || "Ralat sambungan API");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt)
    return res.status(400).json({ error: "Prompt tidak boleh kosong" });

  try {
    const result = await callHF(prompt);
    res.status(200).json({ result });
  } catch (e: any) {
    // Pastikan kita hantar mesej ralat yang bersih ke frontend
    res.status(500).json({ error: e.message });
  }
}
