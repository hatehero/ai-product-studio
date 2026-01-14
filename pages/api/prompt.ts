import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_KEY = process.env.HF_API_KEY!;
const MODEL_URL =
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callHF(prompt: string, retries = 5): Promise<string> {
  const res = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `
Bina 5 prompt sudut kamera berbeza untuk AI image generation.
Tema: ${prompt}

Format:
1. Angle 1: ...
2. Angle 2: ...
3. Angle 3: ...
4. Angle 4: ...
5. Angle 5: ...
`,
    }),
  });

  const data = await res.json();

  // ⏳ MODEL SEDANG LOADING
  if (data?.error && data.error.includes("loading")) {
    if (retries <= 0) throw new Error("Model masih loading");
    await sleep(5000); // tunggu 5 saat
    return callHF(prompt, retries - 1);
  }

  // ⏳ MODEL BAGI ETA
  if (data?.estimated_time) {
    await sleep((data.estimated_time + 2) * 1000);
    return callHF(prompt, retries - 1);
  }

  // ✅ RESPONSE OK
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }

  throw new Error("HF tidak pulangkan teks");
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
