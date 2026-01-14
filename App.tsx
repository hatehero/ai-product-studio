import { useState } from "react";

export default function App() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prompts, setPrompts] = useState<
    { angle: string; prompt: string }[]
  >([]);

  const generatePrompts = async () => {
    setLoading(true);
    setError("");
    setPrompts([]);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal generate prompt");
      }

      setPrompts(data.prompts);
    } catch (err: any) {
      setError(err.message || "Error");
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
          maxWidth: 600,
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 12 }}>
          AI Product Prompt Studio
        </h1>

        <textarea
          placeholder="Contoh: akak melayu jual gelang dalam live"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          style={{
            width: "100%",
            height: 90,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 12,
          }}
        />

        <button
          onClick={generatePrompts}
          disabled={loading || !idea}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(90deg,#ec4899,#8b5cf6)",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "✨ Generate 5 Angle Prompts"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 10, textAlign: "center" }}>
            {error}
          </p>
        )}

        {prompts.length > 0 && (
          <div style={{ marginTop: 20 }}>
            {prompts.map((p, i) => (
              <div
                key={i}
                style={{
                  background: "#f9fafb",
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 12,
                }}
              >
                <strong>{p.angle}</strong>
                <p style={{ marginTop: 6, fontSize: 14 }}>{p.prompt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
