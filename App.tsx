// App.tsx
import { useState } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!file) return alert("Upload gambar dulu");

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            "Generate gambar promosi produk yang cantik, studio lighting, background clean",
          imageBase64: base64,
        }),
      });

      const data = await res.json();
      setResult(data);
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 30, maxWidth: 500, margin: "auto" }}>
      <h1>AI Product Studio</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br />
      <br />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "✨ Generate Magic"}
      </button>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
        {result && JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
