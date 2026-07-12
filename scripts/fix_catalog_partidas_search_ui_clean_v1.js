const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceAll(find, replace) {
  if (!s.includes(find)) return false;
  const before = s;
  s = s.split(find).join(replace);
  if (s !== before) changed++;
  return true;
}

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

// Remove mojibake prefixes from title + placeholder (introduced by copy/paste encoding).
replaceAll('"┬¡ãÆ├┤├¿ Partidas de Obra "', '"Partidas de Obra "');
replaceAll('placeholder:"┬¡ãÆ├Â├¼ Buscar partidaÔÇª"', 'placeholder:"Buscar partida..."');

// Clear button glyph -> ASCII
replaceAll('children:"Ô£ò"', 'children:"X"');

// Chip labels (avoid accent encoding issues in bundle)
replaceAll('["Ba├▒o","ba├▒o"]', '["Bano","bano"]');
replaceAll('["El├®ctrica","electrica"]', '["Electrica","electrica"]');

// Remove duplicate counter "(f.length)" to keep only "Mostrando X de Y"
replaceOnce(
  ',e.jsxs("span",{style:{fontSize:13,color:a.muted,fontWeight:400},children:["(",f.length,")"]}),',
  ","
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: UI Partidas de Obra limpiada (contadores y símbolos).");

