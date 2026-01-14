import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal");
      }

      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>AI Product Prompt Studio</h1>

      <textarea
        placeholder="Contoh: akak jual tudung dalam live"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: 120, padding: 12 }}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={{ marginTop: 12, padding: 10, width: "100%" }}
      >
        {loading ? "Generating..." : "Generate 5 Angle Prompt"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>❌ {error}</p>
      )}

      {result && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            marginTop: 16,
            background: "#f5f5f5",
            padding: 12
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
