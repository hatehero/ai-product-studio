import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_KEY = process.env.HF_API_KEY!;
const MODEL_URL =
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

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
        inputs: `<s>[INST] Bina 5 prompt sudut kamera (camera angle) berbeza dalam Bahasa Inggeris untuk AI image generation berdasarkan tema ini.
        Tema: ${prompt}

        Format output:
        1. Angle 1: [Deskripsi dalam BI]
        2. Angle 2: [Deskripsi dalam BI]
        3. Angle 3: [Deskripsi dalam BI]
        4. Angle 4: [Deskripsi dalam BI]
        5. Angle 5: [Deskripsi dalam BI] [/INST]`,
        parameters: {
          max_new_tokens: 500,
          return_full_text: false,
        },
      }),
    });

    const data = await res.json();

    // ⏳ PENGENDALIAN MODEL LOADING / QUEUE
    if (data?.error && (data.error.includes("loading") || data.error.includes("currently loading"))) {
      if (retries <= 0) throw new Error("Model Hugging Face masih loading. Sila cuba sebentar lagi.");
      await sleep(8000); // Tunggu 8 saat jika loading
      return callHF(prompt, retries - 1);
    }

    if (data?.estimated_time) {
      const waitTime = Math.min(data.estimated_time + 2, 20); // Maksimum tunggu 20s
      await sleep(waitTime * 1000);
      return callHF(prompt, retries - 1);
    }

    // ✅ EKSTRAK TEKS DARIPADA ARRAY RESPONS
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }

    // Jika ada error mesej lain dari HF
    if (data?.error) {
      throw new Error(data.error);
    }

    throw new Error("Gagal mendapat respons teks yang sah.");
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
