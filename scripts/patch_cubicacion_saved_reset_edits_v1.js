const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

// When leaving a saved cubicacion, clear inline edits
{
  const from = 'onClick:()=>v(null),children:"← Volver"}),e.jsxs("div",{children:[';
  const to = 'onClick:()=>{v(null);f0({});M0(null)},children:"← Volver"}),e.jsxs("div",{children:[';
  if (!s.includes(from)) throw new Error("No se encontró el botón '← Volver' en la vista de cubicación guardada.");
  s = s.replace(from, to);
}

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_saved_reset_edits_v1");

