import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setError("");
    setResult("");
    if (!prompt.trim()) {
      setError("Masukkan tema dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ralat pelayan");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f7fa", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", width: "100%", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📸 AI Prompt Studio</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: wanita jual jam tangan mewah"
          style={{ width: "100%", height: "100px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", marginBottom: "15px" }}
        />
        <button
          onClick={generate}
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Menjana..." : "Generate Angle Prompt"}
        </button>

        {error && <div style={{ color: "#e53e3e", marginTop: "15px", padding: "10px", background: "#fff5f5", borderRadius: "5px", border: "1px solid #feb2b2" }}>⚠️ {error}</div>}
        {result && <pre style={{ marginTop: "20px", background: "#f8f9fa", padding: "15px", borderRadius: "8px", whiteSpace: "pre-wrap", fontSize: "14px", border: "1px solid #edf2f7" }}>{result}</pre>}
      </div>
    </div>
  );
}
