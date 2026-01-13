import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-002:generateImages?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: prompt,
          },
          imageCount: 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Imagen API error:", data);
      return res.status(500).json({ error: "Imagen API error", data });
    }

    const imageBase64 =
      data?.images?.[0]?.bytesBase64Encoded;

    if (!imageBase64) {
      return res.status(500).json({ error: "No image generated" });
    }

    return res.status(200).json({
      image: imageBase64,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
