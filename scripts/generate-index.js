const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "..", "images");
const outputDir = path.join(__dirname, "..", "public");
const outputFile = path.join(outputDir, "index.html");
const jsonFile = path.join(outputDir, "gallery.json");

// Legge i file e aggiunge timestamp locale
let files = fs.readdirSync(imagesDir)
  .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
  .map(name => {
    const fullPath = path.join(imagesDir, name);
    const time = fs.statSync(fullPath).mtime.getTime();
    return { name, time };
  })
  .sort((a, b) => b.time - a.time); // dal più recente al più vecchio

// HTML della galleria
const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Puzzle Gallery</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #fafafa; }
    .topbar { display: flex; align-items: center; gap: 12px; padding: 10px 16px; background: #111; color: #fff; position: sticky; top: 0; z-index: 10; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; padding: 16px; }
    .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #fff; }
    .card img { width: 100%; display: block; }
    .card-footer { display: flex; gap: 8px; padding: 8px; }
    button { padding: 6px 10px; border: 1px solid #ccc; background: #f7f7f7; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="topbar">
    <strong>Puzzle Gallery</strong>
    <button id="copyPageLink">Copia link galleria</button>
  </div>

  <div class="gallery" id="gallery">
    ${files.map(f => `
      <div class="card">
        <img src="images/${f.name}" alt="${f.name}" loading="lazy">
        <div class="card-footer">
          <button class="copy" data-url="images/${f.name}">Copia link</button>
          <a href="images/${f.name}" target="_blank">Apri</a>
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
        alert("Permesso clipboard negato.");
      }
    });

    document.querySelector(".gallery").addEventListener("click", async (e) => {
      const btn = e.target.closest("button.copy");
      if (!btn) return;
      const url = btn.dataset.url;
      try {
        const fullUrl = window.location.origin + window.location.pathname + url;
        await navigator.clipboard.writeText(fullUrl);
        alert("Link immagine copiato!");
      } catch {
        alert("Permesso clipboard negato.");
      }
    });
  </script>
</body>
</html>`;

// Crea la cartella di output se non esiste
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Scrive HTML
fs.writeFileSync(outputFile, html, "utf-8");

// Genera JSON con timestamp
const jsonData = files.map(f => ({
  name: f.name,
  url: `images/${f.name}`,
  time: f.time
}));
fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2), "utf-8");

console.log("✅ Galleria generata");
