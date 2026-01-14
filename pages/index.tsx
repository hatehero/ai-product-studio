
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        justifyContent: "center",
        padding: "12px 10px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* HEADER */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: 14,
            fontSize: "22px",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          ✨ AI Magic Affiliate Prompt
        </h1>

        {/* CARD */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          {/* STEP 1 */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ marginBottom: 8 }}>1️⃣ Idea Produk</h4>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: wanita jual baju di pasar"
              style={{
                width: "100%",
                minHeight: 90,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {/* STEP 2 */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ marginBottom: 8 }}>2️⃣ Gaya & Scene</h4>
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background: "#f9fafb",
                fontSize: 13,
                color: "#555",
              }}
            >
              Automatic (AI akan pilih angle & gaya terbaik)
            </div>
          </div>

          {/* STEP 3 */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ marginBottom: 10 }}>3️⃣ Generate</h4>
            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 14,
                border: "none",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                background:
                  "linear-gradient(135deg, #ec4899, #8b5cf6)",
              }}
            >
              {loading ? "Menjana..." : "✨ Generate Magic"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: 12,
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* OUTPUT */}
          {output && (
            <pre
              style={{
                marginTop: 16,
                background: "#f3f4f6",
                padding: 14,
                borderRadius: 12,
                whiteSpace: "pre-wrap",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
