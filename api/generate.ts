// api/generate.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, imageBase64 } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "prompt required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                imageBase64
                  ? {
                      inlineData: {
                        mimeType: "image/jpeg",
                        data: imageBase64,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Gemini API error",
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: "Server error",
      message: err?.message,
    });
  }
}
