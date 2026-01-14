import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: "Idea kosong" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Anda adalah AI prompt engineer profesional.

Tugas:
Daripada IDEA berikut:
"${idea}"

Hasilkan 5 prompt visual BERBEZA untuk AI image/video.

Setiap prompt mesti:
- Gaya realistic / cinematic
- Sudut kamera berbeza
- Sesuai untuk iklan / live jualan
- Bahasa English (AI friendly)

Format output JSON sahaja:

[
  { "angle": "Angle 1", "prompt": "..." },
  { "angle": "Angle 2", "prompt": "..." },
  { "angle": "Angle 3", "prompt": "..." },
  { "angle": "Angle 4", "prompt": "..." },
  { "angle": "Angle 5", "prompt": "..." }
]
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    const prompts = JSON.parse(text);

    res.status(200).json({ prompts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal generate prompt" });
  }
}
