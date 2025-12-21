const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "..", "images");
const outputDir = path.join(__dirname, "..", "public");
const outputFile = path.join(outputDir, "index.html");

// 1. Leggi i file e filtrali per estensione
const files = fs.readdirSync(imagesDir)
  .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
  .map(name => {
    // Recupera le info del file (data di creazione/modifica)
    const filePath = path.join(imagesDir, name);
    const stats = fs.statSync(filePath);
    return {
      name: name,
      time: stats.mtime.getTime() // Prende la data di ultima modifica
    };
  })
  // 2. Ordina dal più recente al più vecchio
  .sort((a, b) => b.time - a.time)
  // 3. Torna ad avere solo il nome del file
  .map(file => file.name);

const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Puzzle Gallery</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #fafafa; }
    .topbar { display: flex; align-items: center; gap: 12px; padding: 10px 16px; background: #111; color: #fff; position: sticky; top: 0; z-index: 100; }
    .topbar a { color: #9cf; text-decoration: none; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; padding: 16px; }
    .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #fff; transition: transform 0.2s; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }
    .card-footer { display: flex; gap: 8px; padding: 8px; justify-content: space-between; }
    button { padding: 6px 10px; border: 1px solid #ccc; background: #f7f7f7; border-radius: 6px; cursor: pointer; font-size: 0.8rem; }
    .btn-open { text-decoration: none; color: #333; border: 1px solid #ccc; padding: 6px 10px; border-radius: 6px; background: #fff; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="topbar">
    <strong>Puzzle Gallery</strong>
    <button id="copyPageLink">Copia link galleria</button>
    <a href="https://www.facebook.com/groups/1886743115264003" target="_blank">Gruppo Facebook</a>
  </div>

  <div class="gallery" id="gallery">
    ${files.map(name => `
      <div class="card">
        <img src="images/${name}" alt="${name}" loading="lazy">
        <div class="card-footer">
          <button class="copy" data-url="images/${name}">Copia link</button>
          <a href="images/${name}" target="_blank" class="btn-open">Apri</a>
        </div>
      </div>
    `).join("")}
  </div>

  <script>
    document.getElementById("copyPageLink").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link della galleria copiato!");
      } catch {
        alert("Errore copia.");
      }
    });

    document.querySelector(".gallery").addEventListener("click", async (e) => {
      const btn = e.target.closest("button.copy");
      if (!btn) return;
      const url = btn.dataset.url;
      try {
        const fullUrl = window.location.origin + window.location.pathname.replace('index.html', '') + url;
        await navigator.clipboard.writeText(fullUrl);
        alert("Link immagine copiato!");
      } catch {
        alert("Errore copia.");
      }
    });
  </script>
</body>
</html>`;

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
fs.writeFileSync(outputFile, html, "utf-8");

console.log(`✅ Galleria generata con ${files.length} immagini (ordinate per data)`);
