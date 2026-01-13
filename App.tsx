import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal generate");
      }

      setImage(data.image);
    } catch (e: any) {
      setError("Gagal generate gambar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>AI Product Studio</h1>

        <textarea
          placeholder="contoh: produk air gula, studio lighting, background putih, realistik"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: "100%",
            height: 100,
            padding: 10,
            marginTop: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={generateImage}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            border: "none",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            background:
              "linear-gradient(90deg, #ff5fcf 0%, #7b6cff 100%)",
          }}
        >
          ✨ {loading ? "Generating..." : "Generate Magic"}
        </button>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: 10 }}>
            {error}
          </p>
        )}

        {image && (
          <img
            src={image}
            alt="AI Result"
            style={{
              width: "100%",
              marginTop: 16,
              borderRadius: 12,
            }}
          />
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: 12,
            fontSize: 12,
            color: "#888",
          }}
        >
          Powered by Hugging Face (SDXL)
        </p>
      </div>
    </div>
  );
}
