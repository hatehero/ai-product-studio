import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePrompt = async () => {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();
    setResult(data.result || "Failed");
    setLoading(false);
  };

  return (
    <main style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h1>AI Product Prompt Studio</h1>

      <textarea
        placeholder="Contoh: akak melayu jual gelang dalam live"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10 }}
      />

      <button
        onClick={generatePrompt}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate 5 Angle Prompt"}
      </button>

      {result && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            marginTop: 20,
            background: "#f4f4f4",
            padding: 15,
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}
