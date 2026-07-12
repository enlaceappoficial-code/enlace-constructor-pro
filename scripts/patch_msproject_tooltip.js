const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
let changed = 0;

function replaceAllExact(from, to) {
  const before = s;
  s = s.split(from).join(to);
  if (s !== before) changed++;
}

replaceAllExact(
  'onClick:Me,children:"🗂️ MS Project (XML)"',
  'title:"Descarga un .xml para importar en Microsoft Project.\\nLuego: Archivo → Abrir → selecciona el .xml",onClick:Me,children:"🗂️ MS Project (XML)"'
);

replaceAllExact(
  'n("✅ Exportado a Microsoft Project (XML)")',
  'n("✅ Exportado (XML). En Project: Archivo → Abrir → XML")'
);

if (changed === 0) process.exit(2);

fs.writeFileSync(filePath, s, "utf8");
