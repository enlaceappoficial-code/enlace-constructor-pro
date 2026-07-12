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

// Remove duplicated tail introduced near D=()=>
replaceOnce('C(""))}),m(!1),C(""))', 'C(""))');

// Clean duplicate warning toast (ASCII-safe)
{
  const re = /r\(".*?Ya existe una partida similar.*?"\)/;
  if (re.test(s)) {
    s = s.replace(re, 'r("Ya existe una partida similar en esa categoria")');
    changed++;
  }
}

// Fix unit normalization (avoid mojibake "m²" literal)
replaceOnce(
  'A=A.replace("m┬▓","m2").replace("M┬▓","m2");',
  'A=A.replace(/\\u00b2/g,"2");A=A.replace(/m\\s*2/i,"m2");'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: fix Partidas de Obra aplicado (${changed} cambios).`);

