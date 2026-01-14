import { useState } from "react";

export default function Home() {
  const [kategori, setKategori] = useState("Fashion");
  const [model, setModel] = useState("Tanpa Model (Produk Sahaja)");
  const [latar, setLatar] = useState("Studio Foto Minimalis");
  const [vibe, setVibe] = useState("Aesthetic");
  const [angle, setAngle] = useState("Full Body / Wide Shot");

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", padding: 12 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#4f46e5" }}>
          👋 AI Affiliate POV Studio
        </h1>
        <p style={{ textAlign: "center", fontSize: 13 }}>
          Gabungkan foto produk & latar belakang menjadi konten POV affiliate
        </p>

        <div style={card}>
          <h4>1️⃣ Upload Produk</h4>
          <div style={drop}>
            Klik atau seret foto produk di sini<br />
            JPG / PNG (Dummy)
          </div>

          <h5>Kategori Produk</h5>
          <div style={grid}>
            {["Fashion", "Aksesori & Beg", "Makanan & Minuman", "Lain-lain"].map(
              (k) => (
                <button
                  key={k}
                  onClick={() => setKategori(k)}
                  style={btn(kategori === k)}
                >
                  {k}
                </button>
              )
            )}
          </div>
        </div>

        <div style={card}>
          <h4>2️⃣ Tetapan Scene</h4>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={select}>
            <option>Tanpa Model (Produk Sahaja)</option>
            <option>Wanita Tidak Berhijab</option>
            <option>Wanita Berhijab</option>
            <option>Lelaki</option>
          </select>
        </div>

        <div style={card}>
          <h4>3️⃣ Gaya & Styling</h4>
          <select value={latar} onChange={(e) => setLatar(e.target.value)} style={select}>
            <option>Studio Foto Minimalis</option>
            <option>Jalanan Bandar</option>
            <option>Kafe Outdoor</option>
            <option>Pantai</option>
          </select>

          <select value={vibe} onChange={(e) => setVibe(e.target.value)} style={select}>
            <option>Aesthetic</option>
            <option>Minimalis</option>
            <option>Vintage</option>
          </select>

          <select value={angle} onChange={(e) => setAngle(e.target.value)} style={select}>
            <option>Full Body / Wide Shot</option>
            <option>Close Up</option>
            <option>Medium Shot</option>
          </select>
        </div>

        <button style={generate}>✨ GENERATE MAGIC</button>
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: 18,
  padding: 18,
  marginBottom: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const drop = {
  padding: 18,
  border: "2px dashed #ec4899",
  borderRadius: 14,
  textAlign: "center",
  fontSize: 13,
  marginBottom: 14,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const btn = (active) => ({
  padding: 12,
  borderRadius: 14,
  border: active ? "2px solid #ec4899" : "1px solid #e5e7eb",
  background: active ? "#fff0f6" : "#fff",
  fontWeight: 600,
});

const select = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
};

const generate = {
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: "none",
  color: "#fff",
  fontWeight: 700,
  background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
};
