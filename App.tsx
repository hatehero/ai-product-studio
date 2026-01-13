import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            "Professional ecommerce product photo, studio lighting, clean white background, realistic shadow, ultra high quality",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.image) {
        throw new Error("Gagal generate gambar");
      }

      setResultImage(`data:image/png;base64,${data.image}`);
    } catch (err) {
      setError("Gagal generate gambar");
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
        background: "#f5f5f5",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1>AI Product Studio</h1>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(90deg,#ff4ecd,#7c5cff)",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
            marginTop: 10,
          }}
        >
          {loading ? "Generating..." : "✨ Generate Magic"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 15 }}>{error}</p>
        )}

        {resultImage && (
          <div style={{ marginTop: 20 }}>
            <img
              src={resultImage}
              alt="Generated"
              style={{
                width: "100%",
                borderRadius: 10,
                boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        )}

        <p style={{ marginTop: 15, fontSize: 12, color: "#999" }}>
          Powered by Google Imagen
        </p>
      </div>
    </div>
  );
}
