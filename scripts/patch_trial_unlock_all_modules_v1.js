const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

const FIND =
  "var we=Fe[Ce]||Fe.starter,ye=H=>we.modules.includes(H),_=[{g:";

const REPLACE =
  'var we=Fe[Ce]||Fe.starter,ye=H=>pe&&pe.active&&!(l.licenciaCodigo&&ve.valid&&!ve.expired)?!0:we.modules.includes(H),_=[{g:';

replaceOnce(FIND, REPLACE);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: trial desbloquea todos los módulos (${changed} cambios).`);

