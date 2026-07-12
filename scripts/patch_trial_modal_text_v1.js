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

replaceOnce(
  'children:"Esta versi├│n de demostraci├│n ha expirado."',
  'children:"Tu prueba gratuita de 10 dias ha finalizado."'
);

replaceOnce(
  'children:"Contacta a tu ejecutivo ENLACE para obtener un c├│digo de activaci├│n."',
  'children:"Para continuar, solicita tu codigo si eres parte de la Red Enlace o compra tu licencia y pega el codigo recibido."'
);

replaceOnce(
  'children:"Esta versi├│n de demostraci├│n ha expirado."',
  'children:"Tu prueba gratuita de 10 dias ha finalizado."'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: texto modal trial (${changed} cambios).`);
