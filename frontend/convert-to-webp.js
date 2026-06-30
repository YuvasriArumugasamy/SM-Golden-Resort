/**
 * convert-to-webp.js
 * Converts all PNG and JPEG images in frontend/public/ to WebP format.
 * Run: node convert-to-webp.js
 * Requires: npm install sharp (run in frontend/ folder)
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "public");
const EXTENSIONS = [".png", ".jpeg", ".jpg"];

async function convert() {
  const files = fs.readdirSync(PUBLIC_DIR);
  let converted = 0;
  let totalSaved = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;

    // Skip logo.jpeg (keep as favicon/small file)
    if (file === "logo.jpeg") continue;

    const inputPath = path.join(PUBLIC_DIR, file);
    const outputName = file.replace(/\.(png|jpeg|jpg)$/i, ".webp");
    const outputPath = path.join(PUBLIC_DIR, outputName);

    const originalSize = fs.statSync(inputPath).size;

    try {
      await sharp(inputPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      const saved = originalSize - newSize;
      const pct = ((saved / originalSize) * 100).toFixed(1);
      totalSaved += saved;
      converted++;

      console.log(
        `✅ ${file} → ${outputName}  (${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB, saved ${pct}%)`
      );
    } catch (err) {
      console.error(`❌ Failed: ${file} → ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! Converted ${converted} images.`);
  console.log(`💾 Total saved: ${(totalSaved / (1024 * 1024)).toFixed(1)} MB`);
}

convert();
