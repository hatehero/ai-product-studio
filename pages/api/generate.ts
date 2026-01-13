import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.length < 5) {
    return res.status(400).json({ error: "Prompt terlalu pendek" });
  }

  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true, // ❗ penting untuk HF free
          },
        }),
      }
    );

    // ❌ HF bagi error JSON (model loading / rate limit)
    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error("HF error:", errText);
      return res.status(500).json({ error: "HF generate gagal" });
    }

    // ✅ HF image response = binary
    const arrayBuffer = await hfRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
