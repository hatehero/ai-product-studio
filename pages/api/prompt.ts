import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_KEY = process.env.HF_API_KEY!;
// ✅ URL BARU: Menggunakan router.huggingface.co mengikut ralat yang anda terima
const MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callHF(prompt: string, retries = 5): Promise<string> {
  try {
    const res = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<s>[INST] Bina 5 prompt sudut kamera (camera angle) berbeza dalam Bahasa Inggeris untuk AI image generation berdasarkan tema ini: ${prompt}. Sediakan jawapan dalam format senarai nombor sahaja. [/INST]`,
        parameters: {
          max_new_tokens: 500,
          return_full_text: false,
        },
      }),
    });

    const data = await res.json();

    // ⏳ PENGENDALIAN LOADING (Hugging Face mungkin ambil masa bangunkan model)
    if (data?.error && (data.error.includes("loading") || data.error.includes("currently loading"))) {
      if (retries <= 0) throw new Error("Model sedang dimuatkan. Sila tunggu seminit dan cuba lagi.");
      await sleep(10000); // Tunggu 10 saat
      return callHF(prompt, retries - 1);
    }

    // ✅ EKSTRAK TEKS JIKA BERBENTUK ARRAY
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    
    // ✅ EKSTRAK TEKS JIKA BERBENTUK OBJEK TERUS
    if (data?.generated_text) {
      return data.generated_text.trim();
    }

    // Jika ada ralat spesifik dari API
    if (data?.error) {
      throw new Error(data.error);
    }

    throw new Error("Gagal menerima respons teks yang sah.");
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
    res.status(500).json({ error: e.message });
  }
}
