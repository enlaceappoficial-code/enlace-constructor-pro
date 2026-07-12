const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s = fs.readFileSync(filePath, "utf8");

// Heurística: buscar objetos de navegación tipo {k:"dashboard",ic:"📋",l:"Inicio"} (orden variable).
const re = /\{[^{}]*\bk\s*:\s*"([^"]+)"[^{}]*\bic\s*:\s*"([^"]*)"[^{}]*\bl\s*:\s*"([^"]+)"[^{}]*\}/g;
let m;
const out = [];
while ((m = re.exec(s))) out.push({ k: m[1], ic: m[2], t: m[3], pos: m.index });

console.log("Nav matches:", out.length);
for (const x of out.slice(0, 80)) console.log(`${x.k}\t${x.ic}\t${x.t}\t@${x.pos}`);

console.log("\nMatches containing 'infor':");
for (const x of out.filter((o) => o.k.includes("infor") || o.t.toLowerCase().includes("infor")).slice(0, 50)) {
  console.log(`${x.k}\t${x.ic}\t${x.t}\t@${x.pos}`);
}
