const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s = fs.readFileSync(filePath, "utf8");

console.log("dupAnual", s.includes(",anual:!0,anual:!0,"));
console.log('hasLabelBasico', s.includes('label:"Básico"'));
console.log('hasPagoUnico', s.includes("Pago único"));
console.log('hasMercadoPublico', s.includes("Mercado Público"));
console.log("hasSepDot", s.includes(" · "));
console.log("hasMojibakeSep", s.includes("\u252C\u00C0"));
console.log("hasMojibakeBox", s.includes("\u251C\u2502"));

const idxFe = s.indexOf("var Fe={");
console.log("idxFe", idxFe);
const feSlice = s.slice(idxFe, idxFe + 1200);
console.log("feHasBox", feSlice.includes("\u251C"));
console.log("feHasMojibakeSep", feSlice.includes("\u252C\u00C0"));
console.log(feSlice.slice(0, 420));

const idxHg = s.indexOf("function Hg(");
const hgSlice = idxHg === -1 ? "" : s.slice(idxHg, idxHg + 8000);
console.log("idxHg", idxHg);
console.log("hgHasBox", hgSlice.includes("\u251C"));
console.log('hgHasCuestion', hgSlice.includes("¿Cuál es el plan ideal para ti?"));
