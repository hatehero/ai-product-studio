import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_KEY = process.env.HF_API_KEY!;
// ✅ URL telah dibetulkan mengikut format router terkini
const MODEL_URL = "https://router.huggingface.co/hf-inference/v1/chat/completions";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callHF(userPrompt: string, retries = 5): Promise<string> {
  try {
    const res = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2", // ✅ Nyatakan model di sini
        messages: [
          {
            role: "user",
            content: `Bina 5 prompt sudut kamera (camera angle) berbeza dalam Bahasa Inggeris untuk AI image generation berdasarkan tema ini: ${userPrompt}. Berikan senarai 1 hingga 5 sahaja.`
          }
        ],
        max_tokens: 500,
      }),
    });

    // Semak jika respons bukan JSON (seperti kes 'Not Found')
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await res.text();
      throw new Error(`API memulangkan format bukan JSON: ${textError}`);
    }

    const data = await res.json();

    // ⏳ Pengendalian Loading
    if (data?.error && data.error.includes("loading")) {
      if (retries <= 0) throw new Error("Model masih loading selepas beberapa cubaan.");
      await sleep(10000); 
      return callHF(userPrompt, retries - 1);
    }

    // ✅ Ekstrak data menggunakan format Chat Completions
    if (data?.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }

    if (data?.error) {
      throw new Error(data.error.message || data.error);
    }

    throw new Error("Gagal memproses respons daripada AI.");
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
    return res.status(400).json({ error: "Prompt kosong" });

  try {
    const result = await callHF(prompt);
    res.status(200).json({ result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
