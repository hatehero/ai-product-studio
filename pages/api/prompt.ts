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
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `
Anda adalah AI pakar prompt gambar & video pemasaran.

Tugas:
Hasilkan 5 PROMPT BERBEZA (ANGLE BERBEZA) untuk idea berikut:

"${idea}"

Format wajib:
1. Angle 1: ...
2. Angle 2: ...
3. Angle 3: ...
4. Angle 4: ...
5. Angle 5: ...

Gunakan bahasa ringkas, jelas, sesuai untuk AI image/video.
`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    const data = await hfRes.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      return res.status(500).json({
        error: "Hugging Face tidak pulangkan teks",
        raw: data,
      });
    }

    res.status(200).json({
      result: data[0].generated_text,
    });
  } catch (err: any) {
    res.status(500).json({
      error: "Gagal hubungi Hugging Face",
      message: err.message,
    });
  }
}
