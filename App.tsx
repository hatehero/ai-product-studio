import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
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
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data.result);
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>AI Product Prompt Studio</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="contoh: akak jual tudung live tiktok"
        style={{ width: "100%", minHeight: 100, padding: 12 }}
      />

      <button
        onClick={generatePrompt}
        disabled={loading}
        style={{ marginTop: 16, padding: "10px 16px" }}
      >
        {loading ? "Generating..." : "Generate 5 Angle Prompt"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <pre
          style={{
            marginTop: 24,
            background: "#f4f4f4",
            padding: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
