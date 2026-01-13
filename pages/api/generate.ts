import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return res.status(500).json({ error: text });
    }

    const buffer = Buffer.from(await hfRes.arrayBuffer());
    const base64 = buffer.toString("base64");

    res.status(200).json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Hugging Face request failed" });
  }
}
