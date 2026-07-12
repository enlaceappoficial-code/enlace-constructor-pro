const fs = require("fs");
const path = require("path");

function pad(n) {
  return String(n).padStart(2, "0");
}

function stamp(d) {
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "_" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

const root = path.resolve(__dirname, "..");
const srcPath = path.join(root, "src", "assets", "index.js");
const outDir = path.join(root, "_backups", stamp(new Date()), "src", "assets");
const outPath = path.join(outDir, "index.js");

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(srcPath, outPath);
console.log(outPath);

