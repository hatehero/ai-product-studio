import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [prompts, setPrompts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePrompt = async () => {
    setLoading(true);
    setError("");
    setPrompts(null);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setPrompts(data.prompts);
    } catch (e) {
      setError("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1>AI Product Prompt Studio</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="contoh: akak melayu jual gelang dalam live"
        style={{
          width: "100%",
          minHeight: 100,
          padding: 12,
          fontSize: 16,
        }}
      />

      <button
        onClick={generatePrompt}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          fontSize: 16,
        }}
      >
        {loading ? "Generating..." : "Generate 5 Angle Prompt"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>{error}</p>
      )}

      {prompts && (
        <div style={{ marginTop: 24 }}>
          {prompts.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <strong>{item.angle}</strong>
              <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {item.prompt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
