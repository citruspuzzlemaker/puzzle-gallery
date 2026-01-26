/*const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "..", "images");
const outputDir = path.join(__dirname, "..", "public");
const outputFile = path.join(outputDir, "gallery.json");

// const baseUrl = "https://raw.githubusercontent.com/citruspuzzlemaker/puzzle-gallery/main/images";

// Il tuo nuovo baseUrl per ImageKit
const baseUrl = "https://ik.imagekit.io/cpuzzle";

const files = fs.readdirSync(imagesDir).filter(f =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
);

const urls = files.map(name => `${baseUrl}/${name}`);

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(outputFile, JSON.stringify(urls, null, 2));

console.log(`✅ gallery.json generato con ${files.length} immagini`);*/

const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "..", "images");
const outputDir = path.join(__dirname, "..", "public");
const outputFile = path.join(outputDir, "gallery.json");

// Base URL ImageKit
const baseUrl = "https://ik.imagekit.io/cpuzzle";

const files = fs.readdirSync(imagesDir)
  .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
  .sort()        // Ordina alfabeticamente (quindi cronologicamente)
  .reverse();    // Inverte: i più recenti per primi

//const urls = files.map(name => `${baseUrl}/${name}`);
const timestamp = Date.now();
const urls = files.map(name => `${baseUrl}/${name}?t=${timestamp}`);


if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(outputFile, JSON.stringify(urls, null, 2));

console.log(`✅ gallery.json generato con ${files.length} immagini`);

