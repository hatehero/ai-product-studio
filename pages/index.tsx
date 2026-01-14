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

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY tiada" });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
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
Anda ialah AI pakar promosi produk.

Daripada idea ringkas di bawah, hasilkan 5 PROMPT GAMBAR berbeza dengan ANGLE berbeza.

IDEA:
"${idea}"

FORMAT JAWAPAN (WAJIB JSON SAHAJA):
[
  { "angle": "Angle 1 – ...", "prompt": "..." },
  { "angle": "Angle 2 – ...", "prompt": "..." },
  { "angle": "Angle 3 – ...", "prompt": "..." },
  { "angle": "Angle 4 – ...", "prompt": "..." },
  { "angle": "Angle 5 – ...", "prompt": "..." }
]
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();

    const text =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Response Gemini kosong");
    }

    const prompts = JSON.parse(text);

    return res.status(200).json({ prompts });
  } catch (err: any) {
    return res.status(500).json({
      error: "Prompt generation failed",
      detail: err.message,
    });
  }
}
