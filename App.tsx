import { useState } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");

  const generate = async () => {
    if (!file) return alert("Upload gambar dulu");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Product Studio</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <br /><br />
      <button onClick={generate}>Generate Magic</button>
      <pre>{result}</pre>
    </div>
  );
}
