import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idea } = req.body;

  if (!idea || idea.trim().length < 3) {
    return res.status(400).json({ error: "Idea terlalu pendek" });
  }

  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `
Hasilkan 5 prompt visual berbeza (angle berbeza) untuk tujuan AI gambar/video.

Idea:
"${idea}"

Format WAJIB:
1. Angle 1: ...
2. Angle 2: ...
3. Angle 3: ...
4. Angle 4: ...
5. Angle 5: ...

Gaya: marketing, realistik, sesuai untuk AI image/video.
`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.8,
            top_p: 0.95,
            do_sample: true,
          },
        }),
      }
    );

    const data = await hfRes.json();

    // HANDLE SEMUA KES HF
    if (data.error) {
      return res.status(503).json({
        error: "Model sedang loading. Cuba lagi.",
        raw: data,
      });
    }

    const text =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : null;

    if (!text) {
      return res.status(500).json({
        error: "Hugging Face balas kosong",
        raw: data,
      });
    }

    res.status(200).json({ result: text });
  } catch (err: any) {
    res.status(500).json({
      error: "Gagal hubungi Hugging Face",
      message: err.message,
    });
  }
}
