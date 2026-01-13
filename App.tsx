import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    if (!input.trim()) {
      alert("Sila masukkan nama produk");
      return;
    }

    const result = `Realistic studio product photo of ${input},
white background, soft studio lighting,
commercial photography, e-commerce style,
high detail, sharp focus, DSLR quality,
minimal shadow, professional product shoot`;

    setPrompt(result);
    setCopied(false);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Product Studio</h1>

        <textarea
          placeholder="Contoh: air gula botol"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.textarea}
        />

        <button style={styles.button} onClick={generatePrompt}>
          ✨ Generate Magic
        </button>

        {prompt && (
          <>
            <textarea
              value={prompt}
              readOnly
              style={{ ...styles.textarea, marginTop: 12 }}
            />

            <button style={styles.copyBtn} onClick={copyPrompt}>
              {copied ? "✅ Copied" : "📋 Copy Prompt"}
            </button>
          </>
        )}

        <p style={styles.footer}>Gunakan prompt ini di mana-mana AI Image Generator</p>
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
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
    resize: "vertical",
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
    cursor: "pointer",
  },
  copyBtn: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fafafa",
    cursor: "pointer",
  },
  footer: {
    marginTop: 12,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
};
