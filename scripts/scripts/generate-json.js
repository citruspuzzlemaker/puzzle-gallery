const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "..", "images");
const outputDir = path.join(__dirname, "..", "public");
const outputFile = path.join(outputDir, "gallery.json");

const baseUrl = "https://raw.githubusercontent.com/citruspuzzlemaker/puzzle-gallery/main/images";

const files = fs.readdirSync(imagesDir).filter(f =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
);

const urls = files.map(name => `${baseUrl}/${name}`);

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(outputFile, JSON.stringify(urls, null, 2));

console.log(`✅ gallery.json generato con ${files.length} immagini`);
