import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input kosong" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key tiada" });
    }

    const prompt = `
Anda adalah AI prompt engineer.
Tugas: hasilkan 5 prompt berbeza untuk AI image/video.

Tema: "${input}"

Setiap prompt:
- Sudut kamera berbeza
- Sesuai untuk iklan / live jualan
- Realistik
- Ringkas tapi jelas

Format output JSON sahaja:

[
  { "angle": "Angle 1", "prompt": "..." },
  { "angle": "Angle 2", "prompt": "..." },
  { "angle": "Angle 3", "prompt": "..." },
  { "angle": "Angle 4", "prompt": "..." },
  { "angle": "Angle 5", "prompt": "..." }
]
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const parsed = JSON.parse(text);

    res.status(200).json({ prompts: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prompt generation gagal" });
  }
}
