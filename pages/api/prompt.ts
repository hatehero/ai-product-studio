import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_KEY = process.env.HF_API_KEY!;
// ✅ URL Router yang betul untuk v1 chat completions
const MODEL_URL = "https://router.huggingface.co/hf-inference/v1/chat/completions";

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
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "user",
            content: `Bina 5 prompt sudut kamera (camera angle) berbeza dalam Bahasa Inggeris untuk AI image generation berdasarkan tema ini: ${userPrompt}. Berikan senarai 1 hingga 5 sahaja.`
          }
        ],
        max_tokens: 500,
        stream: false
      }),
    });

    // Semak jika respons bukan 200 OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Ralat tidak dikenali" }));
      
      // Jika model sedang loading (Service Unavailable)
      if (response.status === 503 || errorData.error?.includes("loading")) {
        if (retries <= 0) throw new Error("Model masih loading di server Hugging Face.");
        await sleep(10000); // Tunggu 10 saat
        return callHF(userPrompt, retries - 1);
      }
      
      throw new Error(errorData.error?.message || errorData.error || `Ralat API: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Ekstrak mengikut format Chat Completion (Router standard)
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }

    throw new Error("Format respons tidak sah atau kosong.");
  } catch (error: any) {
    throw new Error(error.message || "Gagal menghubungi API Hugging Face");
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
    return res.status(400).json({ error: "Sila masukkan tema" });

  try {
    const result = await callHF(prompt);
    res.status(200).json({ result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
