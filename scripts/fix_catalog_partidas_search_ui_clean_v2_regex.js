const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

let n = 0;
function rep(re, to) {
  const next = s.replace(re, to);
  if (next !== s) n++;
  s = next;
}

// Clean title mojibake prefix
rep(/children:\["[^"]*?Partidas de Obra ",/g, 'children:["Partidas de Obra ",');

// Clean placeholder mojibake prefix/suffix
rep(/placeholder:"[^"]*?Buscar partida[^"]*?"/g, 'placeholder:"Buscar partida..."');

// Clear button glyph -> ASCII
rep(/lineHeight:"18px",padding:0\},children:"[^"]*?"\}\):null/g, 'lineHeight:"18px",padding:0},children:"X"}):null');

// Chips: force a clean, predictable set (ASCII-safe labels)
rep(
  /justifyContent:"flex-end"\},children:\[\[[\s\S]*?\]\.map\(\(\[y,P\]\)=>/g,
  'justifyContent:"flex-end"},children:[["Techo","techo"],["Puertas/Vent.","puerta"],["Bano","bano"],["Cocina","cocina"],["Humedad/Gotera","humedad"],["Pintura","pintura"],["Pisos","piso"],["Electrica","electrica"]].map(([y,P])=>'
);

if (s === s0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: limpieza UI Partidas de Obra aplicada (${n} reglas).`);

