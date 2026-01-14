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
      return res.status(500).json({ error: "GEMINI_API_KEY tiada" });
    }

    const prompt = `
Hasilkan 5 prompt visual untuk AI image/video.

Tema: "${input}"

Setiap prompt:
- Sudut kamera berbeza
- Gaya live selling / iklan
- Realistik
- Ayat lengkap

Susun seperti ini:

Angle 1:
Prompt...

Angle 2:
Prompt...

Angle 3:
Prompt...

Angle 4:
Prompt...

Angle 5:
Prompt...
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "Gemini tiada response" });
    }

    res.status(200).json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
