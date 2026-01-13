import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key not found" });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          numberOfImages: 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: "Imagen API failed" });
    }

    const imageBase64 =
      data.images?.[0]?.bytesBase64Encoded || null;

    if (!imageBase64) {
      return res.status(500).json({ error: "No image generated" });
    }

    return res.status(200).json({
      image: imageBase64,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
