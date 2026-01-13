
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "Product name required" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
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
You are a professional product photographer.
Generate ONE high-quality AI image prompt for this product:

Product: ${product}

The prompt must include:
- studio lighting
- clean background
- commercial product photography
- realistic, DSLR quality
- e-commerce style

Return ONLY the prompt text.
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "No prompt generated" });
    }

    res.status(200).json({ prompt: text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI prompt failed" });
  }
}
