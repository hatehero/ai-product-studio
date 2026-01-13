import { useState } from "react";

export default function App() {
  const [product, setProduct] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generatePrompt = async () => {
    if (!product.trim()) return;

    setLoading(true);
    setError("");
    setPrompt("");
    setCopied(false);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed");
      }

      setPrompt(data.prompt);
    } catch (e: any) {
      setError("Gagal jana prompt AI");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>AI Product Prompt Studio</h2>

        <textarea
          placeholder="Contoh: air gula botol"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={generatePrompt} style={styles.button}>
          {loading ? "Generating..." : "✨ Generate Prompt"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {prompt && (
          <>
            <textarea
              value={prompt}
              readOnly
              style={{ ...styles.textarea, marginTop: 12 }}
            />

            <button onClick={copyPrompt} style={styles.copyBtn}>
              {copied ? "✅ Copied" : "📋 Copy Prompt"}
            </button>
          </>
        )}

        <p style={styles.footer}>
          Prompt ini dijana oleh AI (Gemini) – guna di mana-mana AI Image Generator
        </p>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f2f2f2",
    padding: 16,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    width: "100%",
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    border: "none",
    color: "#fff",
    fontSize: 16,
    background: "linear-gradient(90deg,#ff5acd,#7b6cff)",
  },
  copyBtn: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fafafa",
  },
  footer: {
    marginTop: 12,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
};
