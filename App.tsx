import { useState } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResultImage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await res.json();

        const img =
          data?.candidates?.[0]?.content?.parts?.find(
            (p: any) => p.inlineData
          )?.inlineData?.data;

        if (!img) {
          throw new Error("No image returned");
        }

        setResultImage(`data:image/jpeg;base64,${img}`);
      } catch (e) {
        setError("Gagal generate gambar");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>AI Product Studio</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br />
      <br />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Magic"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultImage && (
        <>
          <h3>Hasil AI:</h3>
          <img
            src={resultImage}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </>
      )}
    </div>
  );
}
