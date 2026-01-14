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
    return res.status(400).json({ error: "Idea is required" });
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
              parts: [
                {
                  text: `
You are a professional AI prompt engineer.

User idea:
"${idea}"

TASK:
Generate EXACTLY 5 different image prompts.

RULES:
- English only
- Each prompt = different camera angle
- Product / person same
- Style: cinematic, realistic, commercial
- Mention lighting + camera angle
- Output as JSON array only
- No explanation

FORMAT:
[
  { "angle": "...", "prompt": "..." },
  ...
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.status(200).json({ result: text });
  } catch (err) {
    return res.status(500).json({ error: "Gemini API failed" });
  }
}
