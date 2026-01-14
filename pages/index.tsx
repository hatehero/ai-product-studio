import { useState } from "react";

export default function Home() {
  const [kategori, setKategori] = useState("Fashion");
  const [model, setModel] = useState("Tanpa Model (Produk Sahaja)");
  const [latar, setLatar] = useState("Studio Foto Minimalis");
  const [vibe, setVibe] = useState("Aesthetic");
  const [angle, setAngle] = useState("Full Body / Wide Shot");
  const [ratio, setRatio] = useState("9:16");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        padding: 12,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* HEADER */}
        <h1
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 6,
            color: "#4f46e5",
          }}
        >
          👋 AI Affiliate POV Studio
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#6b7280",
            marginBottom: 18,
          }}
        >
          Gabungkan foto produk & latar belakang menjadi konten POV affiliate
        </p>

        {/* CARD */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            marginBottom: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h4>1️⃣ Upload Produk</h4>

          <div
            style={{
              marginTop: 10,
              padding: 18,
              borderRadius: 14,
              border: "2px dashed #ec4899",
              textAlign: "center",
              fontSize: 13,
            }}
          >
            Klik atau seret foto produk di sini  
            <br />
            JPG / PNG (Dummy)
          </div>

          <h5 style={{ marginTop: 16 }}>Kategori Produk</h5>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {["Fashion", "Aksesori & Beg", "Makanan & Minuman", "Lain-lain"].map(
              (k) => (
                <button
                  key={k}
                  onClick={() => setKategori(k)}
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 600,
                    border:
                      kategori === k
                        ? "2px solid #ec4899"
                        : "1px solid #e5e7eb",
                    background:
                      kategori === k ? "#fff0f6" : "#ffffff",
                  }}
                >
                  {k}
                </button>
              )
            )}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            marginBottom: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h4>2️⃣ Tetapan Scene</h4>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
          >
            <option>Tanpa Model (Produk Sahaja)</option>
            <option>Wanita Tidak Berhijab</option>
            <option>Wanita Berhijab</option>
            <option>Lelaki</option>
          </select>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            marginBottom: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h4>3️⃣ Gaya & Styling</h4>

          <select
            value={latar}
            onChange={(e) => setLatar(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 10 }}
          >
            <option>Studio Foto Minimalis</option>
            <option>Jalanan Bandar</option>
            <option>Kafe Outdoor</option>
            <option>Pantai</option>
          </select>

          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 10 }}
          >
            <option>Aesthetic</option>
            <option>Minimalis</option>
            <option>Vintage</option>
          </select>

          <select
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            style={{ width: "100%", padding: 12 }}
          >
            <option>Full Body / Wide Shot</option>
            <option>Close Up</option>
            <option>Medium Shot</option>
          </select>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 16,
              border: "none",
              color: "#fff",
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#ec4899,#8b5cf6)",
            }}
          >
            ✨ GENERATE MAGIC
          </button>
        </div>
      </div>
    </div>
  );
}
