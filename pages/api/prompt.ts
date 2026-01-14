import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY tidak dijumpai" });
  }

  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt kosong" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Berdasarkan ayat berikut:
"${prompt}"

Hasilkan 5 prompt AI gambar berbeza (angle kamera berbeza).
Setiap satu ayat penuh, jelas, realistik, gaya studio / live / katalog.
Jangan nombor, jangan bullet. Pisahkan setiap prompt dengan baris baru.
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res
        .status(500)
        .json({ error: "Gemini tidak pulangkan teks" });
    }

    const angles = text
      .split("\n")
      .map((t: string) => t.trim())
      .filter(Boolean)
      .slice(0, 5);

    return res.status(200).json({ angles });
  } catch (err) {
    return res.status(500).json({ error: "Gagal hubungi Gemini API" });
  }
}
