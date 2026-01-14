import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePrompt = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal generate");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f5f5f5" }}>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          padding: 24,
          borderRadius: 12,
        }}
      >
        <h1>AI Product Prompt Studio</h1>

        <textarea
          placeholder="Contoh: akak buat live jual tudung"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          style={{ width: "100%", height: 120, padding: 12 }}
        />

        <button
          onClick={generatePrompt}
          disabled={loading}
          style={{
            marginTop: 12,
            width: "100%",
            padding: 12,
            fontWeight: "bold",
          }}
        >
          {loading ? "Generate..." : "Generate 5 Angle Prompt"}
        </button>

        {error && (
          <div style={{ marginTop: 12, color: "red" }}>❌ {error}</div>
        )}

        {result && (
          <pre
            style={{
              marginTop: 16,
              whiteSpace: "pre-wrap",
              background: "#eee",
              padding: 12,
              borderRadius: 8,
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
