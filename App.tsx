import React from "react";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui",
      background: "#f5f5f5"
    }}>
      <div style={{
        background: "white",
        padding: "32px",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 10px 30px rgba(0,0,0,.1)",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700" }}>
          AI Product Studio
        </h1>

        <p style={{ marginTop: "8px", color: "#666" }}>
          Generate gambar produk dengan AI
        </p>

        <div style={{
          marginTop: "24px",
          padding: "24px",
          border: "2px dashed #ddd",
          borderRadius: "12px"
        }}>
          <p>📸 Upload gambar produk</p>
          <input type="file" style={{ marginTop: "12px" }} />
        </div>

        <button style={{
          marginTop: "24px",
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
          color: "white",
          fontWeight: "700",
          fontSize: "16px"
        }}>
          ✨ GENERATE MAGIC
        </button>

        <p style={{
          marginTop: "16px",
          fontSize: "12px",
          color: "#aaa"
        }}>
          Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}
