const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  '(ae.key==="F5"||((ae.ctrlKey||ae.metaKey)&&ae.key==="r")||((ae.ctrlKey||ae.metaKey)&&ae.shiftKey&&ae.key==="R"))&&(ae.preventDefault(),window.location.reload()),';

const to =
  '((window.__TAURI_IPC__||window.__TAURI__)&&(ae.key==="F5"||((ae.ctrlKey||ae.metaKey)&&ae.key==="r")||((ae.ctrlKey||ae.metaKey)&&ae.shiftKey&&ae.key==="R")))&&(ae.preventDefault(),window.location.reload()),';

if (!s.includes(from)) {
  throw new Error("No se encontró el atajo de recarga para ajustar (F5/Ctrl+R).");
}

s = s.replace(from, to);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_reload_shortcut_tauri_only_v1");

