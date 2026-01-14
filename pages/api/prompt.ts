import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Input tidak sah" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY tiada" });
  }

  try {
    const systemPrompt = `
Anda ialah AI prompt engineer profesional.

Daripada ayat ringkas ini:
"${text}"

Hasilkan 5 prompt visual BERBEZA sudut kamera
sesuai untuk AI image / video generation.

WAJIB ikut format bernombor:
1. ...
2. ...
3. ...
4. ...
5. ...
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🔥 PARSE GEMINI DENGAN SELAMAT
    let output = "";

    if (data?.candidates?.length) {
      const parts = data.candidates[0]?.content?.parts;
      if (Array.isArray(parts)) {
        output = parts.map((p: any) => p.text).join("\n");
      }
    }

    if (!output) {
      return res.status(200).json({
        result: "❌ Gemini tidak pulangkan teks. Cuba ayat lain."
      });
    }

    return res.status(200).json({ result: output });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "Server error"
    });
  }
}
