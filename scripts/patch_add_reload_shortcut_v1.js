const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const needle =
  '(ae.ctrlKey||ae.metaKey)&&ae.key==="k"&&(ae.preventDefault(),J(N=>!N)),(ae.ctrlKey||ae.metaKey)&&ae.shiftKey&&ae.key==="M"&&(ae.preventDefault(),f("mano_obra"))';

if (!s.includes(needle)) {
  throw new Error("No se encontró el handler global de atajos (Ctrl+K / Ctrl+Shift+M).");
}

const insert =
  '(ae.key==="F5"||((ae.ctrlKey||ae.metaKey)&&ae.key==="r")||((ae.ctrlKey||ae.metaKey)&&ae.shiftKey&&ae.key==="R"))&&(ae.preventDefault(),window.location.reload()),';

const replaced = needle.replace(
  ',(ae.ctrlKey||ae.metaKey)&&ae.shiftKey&&ae.key==="M"',
  "," + insert + '(ae.ctrlKey||ae.metaKey)&&ae.shiftKey&&ae.key==="M"'
);

s = s.replace(needle, replaced);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_add_reload_shortcut_v1");

