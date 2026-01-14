import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setError("");
    setResult("");

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setError("Prompt kosong");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: cleanPrompt, // 🔴 INI PENTING
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ralat tidak diketahui");
      } else {
        setResult(data.result);
      }
    } catch (e) {
      setError("Gagal hubungi server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          width: "100%",
          maxWidth: 520,
        }}
      >
        <h1>AI Product Prompt Studio</h1>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: perempuan buat live jual tudung premium di studio putih"
          style={{
            width: "100%",
            minHeight: 120,
            padding: 12,
            fontSize: 16,
          }}
        />

        <button
          onClick={generate}
          disabled={loading}
          style={{
            marginTop: 12,
            width: "100%",
            padding: 12,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {loading ? "Menjana..." : "Generate 5 Angle Prompt"}
        </button>

        {error && (
          <div style={{ marginTop: 12, color: "red" }}>❌ {error}</div>
        )}

        {result && (
          <pre
            style={{
              marginTop: 16,
              whiteSpace: "pre-wrap",
              background: "#fafafa",
              padding: 12,
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
