import { useState } from "react";

export default function App() {
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
        throw new Error(data.error || "Gagal jana prompt");
      }

      setResult(data.result);
    } catch (e: any) {
      setError("Gagal jana prompt AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>AI Product Prompt Studio</h1>

        <textarea
          placeholder="Contoh: akak melayu jual gelang dalam live"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          style={{
            width: "100%",
            height: 100,
            padding: 10,
            marginTop: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={generatePrompt}
          disabled={loading || !idea}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg,#ff4ecd,#7c6cff)",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {loading ? "Generating..." : "✨ Generate 5 Angle Prompt"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 12, textAlign: "center" }}>
            {error}
          </p>
        )}

        {result && (
          <pre
            style={{
              marginTop: 16,
              background: "#f4f4f4",
              padding: 12,
              borderRadius: 8,
              whiteSpace: "pre-wrap",
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
