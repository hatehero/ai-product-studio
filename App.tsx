import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            prompt ||
            "Professional product photo, studio lighting, clean background, ecommerce style",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generate failed");
      }

      setImage(`data:image/png;base64,${data.image}`);
    } catch (err: any) {
      setError(err.message || "Gagal generate gambar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f3f3",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          width: 320,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2>AI Product Studio</h2>

        <textarea
          placeholder="Contoh: Produk botol air estetik, studio lighting"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: "100%",
            minHeight: 80,
            marginBottom: 12,
            padding: 8,
          }}
        />

        <button
          onClick={generateImage}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 8,
            background: "linear-gradient(90deg,#ff5ec4,#7b6cff)",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "✨ Generate Magic"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 12 }}>{error}</p>
        )}

        {image && (
          <img
            src={image}
            alt="Generated"
            style={{
              width: "100%",
              marginTop: 16,
              borderRadius: 8,
            }}
          />
        )}

        <p style={{ fontSize: 12, marginTop: 16, color: "#888" }}>
          Powered by Google Imagen
        </p>
      </div>
    </div>
  );
}
