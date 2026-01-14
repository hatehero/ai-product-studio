import { useState } from "react";

export default function Home() {
  const [kategori, setKategori] = useState("Fashion");
  const [model, setModel] = useState("Tanpa Model (Produk Sahaja)");
  const [latar, setLatar] = useState("Studio Foto Minimalis");
  const [vibe, setVibe] = useState("Aesthetic");
  const [angle, setAngle] = useState("Full Body / Wide Shot");
  const [ratio, setRatio] = useState("9:16");

  const Card = ({ children }: { children: any }) => (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );

  const Select = ({
    value,
    set,
    options,
  }: {
    value: string;
    set: (v: string) => void;
    options: string[];
  }) => (
    <select
      value={value}
      onChange={(e) => set(e.target.value)}
      style={{
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        fontSize: 14,
      }}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );

  const KategoriBtn = ({ nama }: { nama: string }) => (
    <button
      onClick={() => setKategori(nama)}
      style={{
        padding: 12,
        borderRadius: 14,
        fontSize: 13,
        fontWeight: 600,
        border:
          kategori === nama
            ? "2px solid #ec4899"
            : "1px solid #e5e7eb",
        background: kategori === nama ? "#fff0f6" : "#ffffff",
      }}
    >
      {nama}
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        padding: "12px 10px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 6,
            color: "#4f46e5",
            whiteSpace: "nowrap",
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
          yang estetik
        </p>

        <Card>
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
            <KategoriBtn nama="Fashion" />
            <KategoriBtn nama="Aksesori & Beg" />
            <KategoriBtn nama="Makanan & Minuman" />
            <KategoriBtn nama="Lain-lain" />
          </div>
        </Card>

        <Card>
          <h4>2️⃣ Tetapan Scene</h4>
          <Select
            value={model}
            set={setModel}
            options={[
              "Tanpa Model (Produk Sahaja)",
              "Wanita Tidak Berhijab",
              "Wanita Berhijab",
              "Lelaki",
              "Kanak-kanak Perempuan",
              "Kanak-kanak Lelaki",
            ]}
          />
        </Card>

        <Card>
          <h4>3️⃣ Gaya & Styling</h4>
          <Select
            value={latar}
            set={setLatar}
            options={[
              "Studio Foto Minimalis",
              "Jalanan Bandar",
              "Kafe Outdoor",
              "Pantai",
              "Bilik Tidur",
            ]}
          />

          <Select
            value={vibe}
            set={setVibe}
            options={[
              "Aesthetic",
              "Minimalis",
              "Vintage",
              "Moden Mewah",
            ]}
          />

          <Select
            value={angle}
            set={setAngle}
            options={[
              "Close Up",
              "Medium Shot",
              "Wide Shot",
            ]}
          />
        </Card>

        <Card>
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
        </Card>
      </div>
    </div>
  );
}
