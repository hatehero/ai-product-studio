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
      setError("Sila masukkan tema atau deskripsi produk.");
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
          prompt: cleanPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ralat pelayan berlaku");
      } else {
        setResult(data.result);
      }
    } catch (e: any) {
      setError(e.message || "Gagal menghubungi pelayan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5", padding: "20px" }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 16, width: "100%", maxWidth: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h1 style={{ marginBottom: 24, fontSize: "24px", textAlign: "center", color: "#333" }}>📸 AI Product Prompt Studio</h1>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Seorang wanita menggayakan tudung satin premium di dalam studio minimalis, pencahayaan lembut"
          style={{ width: "100%", minHeight: 120, padding: 15, fontSize: 16, borderRadius: 8, border: "1px solid #ddd", marginBottom: 16, outline: "none" }}
        />

        <button
          onClick={generate}
          disabled={loading}
          style={{ width: "100%", padding: 14, fontSize: 16, fontWeight: "bold", background: loading ? "#ccc" : "#0070f3", color: "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", transition: "0.3s" }}
        >
          {loading ? "Sedang Menjana Prompt..." : "Generate 5 Angle Prompt"}
        </button>

        {error && (
          <div style={{ marginTop: 16, padding: 12, background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: 8, color: "#cf1322" }}>
            ❌ <strong>Ralat:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Hasil Prompt:</h3>
            <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: 16, borderRadius: 8, border: "1px solid #eee", fontSize: 14, color: "#444", lineHeight: "1.6" }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
