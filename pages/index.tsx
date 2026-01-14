import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setError("");
    setOutput("");

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
        setError(data?.error || "Ralat tidak diketahui");
      } else {
        setOutput(data.result);
      }
    } catch (e: any) {
      setError("Client error: " + e.message);
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "auto" }}>
      <h1>📸 AI Prompt Studio</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: 12 }}
        placeholder="Contoh: wanita jual jam di pasar"
      />

      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "Menjana..." : "Generate 5 Angle Prompt"}
      </button>

      <br /><br />

      {error && (
        <div style={{ color: "red", whiteSpace: "pre-wrap" }}>
          ❌ {error}
        </div>
      )}

      {output && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          {output}
        </pre>
      )}
    </main>
  );
}
