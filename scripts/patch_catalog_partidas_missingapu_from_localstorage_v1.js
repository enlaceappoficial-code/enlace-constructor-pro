const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceAll(find, replace) {
  if (!s.includes(find)) return 0;
  const parts = s.split(find);
  if (parts.length === 1) return 0;
  s = parts.join(replace);
  return parts.length - 1;
}

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

// Inject apSet sourced from localStorage apus into the catalog filter/search IIFE.
// Looks for ",S=y.reduce" immediately after the normalize function A=...
const injected = replaceOnce(
  ",S=y.reduce",
  ',ap=(function(){try{var Q=localStorage.getItem("enlace_constructor_pro_v1_apus");Q==null&&(Q=localStorage.getItem("apus"));return Q?JSON.parse(Q):[]}catch(Z){return[]}})(),apSet=new Set(ap.map(function(Q){return parseInt(Q&&Q.catalogId)}).filter(function(Q){return isFinite(Q)})),S=y.reduce'
);

if (!injected) {
  console.log("OK: no hubo cambios (no se encontró el punto de inyección).");
  process.exit(0);
}

// Replace the old (incorrect) APU detection based on catalog item fields.
changed += replaceAll(
  "oe=!!(Z.apuId||Z.apu||Z.apu_id)",
  "oe=apSet.has(parseInt(Z.id))"
);
changed += replaceAll(
  'ie=!!(Z.apuId||Z.apu||Z.apu_id)',
  "ie=apSet.has(parseInt(Z.id))"
);

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: missing APU ahora se calcula desde localStorage (apus.catalogId) (${changed} cambios).`);

