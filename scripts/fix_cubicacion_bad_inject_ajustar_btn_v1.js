const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const badStart = 'e.jsx("button",{e.jsx("button",{title:"Ajustar cantidad"';
const a = s.indexOf(badStart);
if (a === -1) {
  console.log("No bad injection found.");
  process.exit(0);
}

const marker = ",title:U?";
const b = s.indexOf(marker, a);
if (b === -1) throw new Error("No se encontró el marker de continuación ',title:U?' tras la inyección.");

s = s.slice(0, a) + 'e.jsx("button",{title:U?' + s.slice(b + marker.length);

fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_cubicacion_bad_inject_ajustar_btn_v1");

if (s === before) throw new Error("No se aplicaron cambios.");

