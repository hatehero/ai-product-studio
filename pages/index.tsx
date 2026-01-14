import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setError("");
    setResult([]);

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
        throw new Error(data.error || "API error");
      }

      setResult(data.angles);
    } catch (err: any) {
      setError(err.message || "Gagal jana prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "serif" }}>
      <h1>📸 AI Prompt Studio</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Contoh: wanita jual jam di pasar"
        style={{ width: "100%", height: 120, padding: 10 }}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={{ marginTop: 10, padding: 10, width: "100%" }}
      >
        {loading ? "Menjana..." : "Generate 5 Angle Prompt"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 15 }}>❌ {error}</p>
      )}

      {result.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil Prompt:</h3>
          <ol>
            {result.map((r, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                {r}
              </li>
            ))}
          </ol>
        </div>
      )}
    </main>
  );
}
