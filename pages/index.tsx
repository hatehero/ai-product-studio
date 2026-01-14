import { useState } from "react";

export default function Home() {
  const [kategori, setKategori] = useState("Fashion");
  const [model, setModel] = useState("Tanpa Model (Produk Sahaja)");
  const [latar, setLatar] = useState("Studio Foto Minimalis");
  const [vibe, setVibe] = useState("Aesthetic");
  const [angle, setAngle] = useState("Full Body / Wide Shot");
  const [ratio, setRatio] = useState("9:16");

  const Card = ({ children }: { children: React.ReactNode }) => (
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
        <option key={o} value={o}>
          {o}
        </option>
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
        {/* HEADER */}
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

        {/* STEP 1 */}
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
              color: "#555",
            }}
          >
            Klik atau seret foto produk di sini
            <br />
            Format JPG / PNG (Dummy UI)
          </div>

          <h5 style={{ marginTop: 16 }}>Kategori Produk</h5>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 10,
            }}
          >
            <KategoriBtn nama="Fashion" />
            <KategoriBtn nama="Aksesori & Beg" />
            <KategoriBtn nama="Makanan & Minuman" />
            <KategoriBtn nama="Lain-lain" />
          </div>
        </Card>

        {/* STEP 2 */}
        <Card>
          <h4>2️⃣ Tetapan Scene</h4>
          <p style={{ fontSize: 13 }}>Pilih Model</p>
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

        {/* STEP 3 */}
        <Card>
          <h4>3️⃣ Gaya & Styling</h4>

          <p style={{ fontSize: 13 }}>Pilih Latar Scene</p>
          <Select
            value={latar}
            set={setLatar}
            options={[
              "Studio Foto Minimalis",
              "Jalanan Bandar (Street Style)",
              "Kafe Outdoor",
              "Pantai",
              "Taman Bunga",
              "Bilik Tidur",
              "Perpustakaan",
              "Seni Bina Moden",
              "Pergunungan",
              "Pejabat (Office Style)",
              "Dalam Pusat Beli-belah",
            ]}
          />

          <p style={{ fontSize: 13, marginTop: 12 }}>Pilih Vibe</p>
          <Select
            value={vibe}
            set={setVibe}
            options={[
              "Aesthetic",
              "Minimalis",
              "Berwarna-warni",
              "Pastel Dreamy",
              "Futuristik",
              "Vintage",
              "Moden Mewah",
              "Cozy / Hangat",
              "Dark Academia",
              "Natural",
              "Tenang & Lembut",
            ]}
          />

          <p style={{ fontSize: 13, marginTop: 12 }}>Pilih Sudut Kamera</p>
          <Select
            value={angle}
            set={setAngle}
            options={[
              "Close Up",
              "Medium Shot",
              "Full Body / Wide Shot",
              "High Angle",
              "Low Angle",
              "Over The Shoulder",
              "Dutch Angle (Artistik)",
            ]}
          />

          <p style={{ fontSize: 13, marginTop: 12 }}>Nisbah Gambar</p>
          <div style={{ display: "flex", gap: 10 }}>
            {["9:16", "1:1", "3:4"].map((r) => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 12,
                  border:
                    ratio === r
                      ? "2px solid #ec4899"
                      : "1px solid #e5e7eb",
                  background: ratio === r ? "#fff0f6" : "#fff",
                  fontWeight: 600,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </Card>

        {/* GENERATE */}
        <Card>
          <button
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 16,
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #ec4899, #8b5cf6)",
            }}
          >
            ✨ GENERATE MAGIC
          </button>
        </Card>

        {/* HASIL */}
        <Card>
          <h4>✨ Hasil Studio</h4>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            Kandungan AI akan dipaparkan di sini (dummy preview)
          </p>
        </Card>
      </div>
    </div>
  );
}
