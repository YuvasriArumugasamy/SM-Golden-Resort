/**
 * update-image-refs.js
 * After converting images to WebP, run this to update ALL code references.
 * Run: node update-image-refs.js
 */
const fs = require("fs");
const path = require("path");

// Files to update (all files that reference images)
const FILES_TO_UPDATE = [
  "src/pages/Home.jsx",
  "src/pages/Rooms.jsx",
  "src/pages/Gallery.jsx",
  "src/pages/Booking.jsx",
  "src/pages/Blog.jsx",
  "src/pages/admin/AdminLogin.jsx",
  "src/pages/admin/AdminSettings.jsx",
  "src/components/Navbar.jsx",
  "src/components/Footer.jsx",
  "src/components/SplashScreen.jsx",
  "src/notification.js",
  "index.html",
  "public/sitemap.xml",
];

// Image extensions to replace
const REPLACEMENTS = [
  // ChatGPT images: .png → .webp
  { find: /ChatGPT Image ([^"']+?)\.png/g, replace: "ChatGPT Image $1.webp" },
  // WhatsApp images: .jpeg → .webp (except logo.jpeg)
  { find: /WhatsApp Image ([^"']+?)\.jpeg/g, replace: "WhatsApp Image $1.webp" },
  // WhatsApp Image in index.html OG tags (URL-encoded spaces)
  { find: /WhatsApp%20Image%20([^"']+?)\.jpeg/g, replace: "WhatsApp%20Image%20$1.webp" },
];

const ROOT = __dirname;
let totalChanges = 0;

for (const relPath of FILES_TO_UPDATE) {
  const filePath = path.join(ROOT, relPath);

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipped (not found): ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let changed = false;

  for (const { find, replace } of REPLACEMENTS) {
    const before = content;
    content = content.replace(find, replace);
    if (content !== before) changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf-8");
    totalChanges++;
    console.log(`✅ Updated: ${relPath}`);
  } else {
    console.log(`⚪ No changes: ${relPath}`);
  }
}

console.log(`\n🎉 Done! Updated ${totalChanges} files.`);
console.log("📝 Note: logo.jpeg and favicon references are NOT changed (they stay as-is).");
