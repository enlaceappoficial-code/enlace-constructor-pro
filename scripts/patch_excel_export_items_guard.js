const fs = require("fs");

const filePath =
  "d:/Enlace Mundo/enlace constructor/Proyecto Tauri/enlace-tauri/src/assets/index.js";

const src = fs.readFileSync(filePath, "utf8");

const from1 = "var ee=$.length;s.items.forEach((G,ie)=>{";
const to1 = "var ee=$.length,tt=Array.isArray(s.items)?s.items:[];tt.forEach((G,ie)=>{";

const from2 = "}),s.items.forEach((G,ie)=>{var oe=E+ie+1,ce=ie%2===0?\"FFFFFF\":\"F8FAFC\";";
const to2 = "}),tt.forEach((G,ie)=>{var oe=E+ie+1,ce=ie%2===0?\"FFFFFF\":\"F8FAFC\";";

if (src.includes(to1) && src.includes(to2)) {
  console.log("OK: guard de items en export Excel ya estaba aplicado");
  process.exit(0);
}

let out = src;
let c1 = 0;
let c2 = 0;
if (out.includes(from1)) {
  out = out.replace(from1, to1);
  c1++;
}
if (out.includes(from2)) {
  out = out.replace(from2, to2);
  c2++;
}

if (c1 !== 1 || c2 !== 1) {
  throw new Error(
    `No se pudo aplicar el parche Excel (matches: part1=${c1}, part2=${c2}).`
  );
}

const outPath = filePath + ".bak_excel_items_guard";
fs.copyFileSync(filePath, outPath);
fs.writeFileSync(filePath, out, "utf8");
console.log("OK: parche aplicado. Backup:", outPath);

