export default async function handler(req, res) {
  try {
    const { prompt, imageBase64 } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "prompt required" });
    }

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-image:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                imageBase64
                  ? {
                      inlineData: {
                        mimeType: "image/png",
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

    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "generate failed" });
  }
}
