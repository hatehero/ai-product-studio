import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setError("");
    setResult("");

    if (!prompt.trim()) {
      setError("Prompt kosong");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal generate");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Tidak dapat hubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 20,
        fontFamily: "serif",
      }}
    >
      <h1>📸 AI Prompt Studio</h1>

      <textarea
        rows={6}
        placeholder="Contoh: wanita jual jam premium di studio putih"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: 12 }}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "12px 20px",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate 5 Angle Prompt"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>❌ {error}</p>
      )}

      {result && (
        <pre
          style={{
            marginTop: 20,
            padding: 16,
            background: "#f5f5f5",
            whiteSpace: "pre-wrap",
          }}
        >
{result}
        </pre>
      )}
    </main>
  );
}
