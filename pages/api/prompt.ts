import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text kosong" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY tiada" });
    }

    const prompt = `
Anda ialah AI prompt engineer.
Daripada ayat ini: "${text}"

Hasilkan 5 prompt visual BERBEZA sudut kamera
Untuk AI image/video generation.

Format:
1. ...
2. ...
3. ...
4. ...
5. ...
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tiada output";

    res.status(200).json({ result: output });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
}
