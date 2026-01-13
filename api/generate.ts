export default async function handler(req, res) {
  try {
    // Ambil data dari frontend
    const { prompt, imageBase64 } = req.body || {};

    // Prompt default (WAJIB ADA)
    const finalPrompt =
      prompt ||
      "Generate a clean professional product photo, studio lighting, realistic shadows, high quality, ecommerce style";

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-image:generateContent?key=" +
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
                { text: finalPrompt },
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

    // Hantar balik ke frontend
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "generate failed" });
  }
}
