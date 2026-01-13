const generate = async () => {
  if (!file) return alert("Upload gambar dulu");

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const canvas = document.createElement("canvas");
    const maxSize = 512;

    let w = img.width;
    let h = img.height;

    if (w > h) {
      if (w > maxSize) {
        h *= maxSize / w;
        w = maxSize;
      }
    } else {
      if (h > maxSize) {
        w *= maxSize / h;
        h = maxSize;
      }
    }

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);

    const base64 = canvas
      .toDataURL("image/jpeg", 0.7)
      .split(",")[1];

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64 }),
    });

    const json = await res.json();
    console.log(json);
    alert("CHECK CONSOLE");
  };
};
