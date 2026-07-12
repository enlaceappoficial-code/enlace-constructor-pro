const fs = require("fs");
const vm = require("vm");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

const code = fs.readFileSync(filePath, "utf8");
try {
  new vm.Script(code, { filename: "index.js" });
  console.log("OK");
} catch (e) {
  const props = e ? Object.getOwnPropertyNames(e) : [];
  const info = {
    message: e && e.message ? e.message : String(e),
    props,
  };
  for (const k of ["lineNumber", "columnNumber", "pos", "position", "startPosition", "endPosition"]) {
    if (e && Object.prototype.hasOwnProperty.call(e, k)) info[k] = e[k];
  }
  console.log(JSON.stringify(info, null, 2));
  if (e && e.stack) {
    const lines = String(e.stack).split("\n");
    const loc = lines[0] || "";
    const codeLine = lines[1] || "";
    const caretLineIndex = lines.findIndex((l) => l.includes("^"));
    const caretLine = caretLineIndex >= 0 ? lines[caretLineIndex] : "";
    const caretCol = caretLine ? caretLine.indexOf("^") : -1;
    console.log(loc);
    console.log(codeLine.slice(0, 220));
    console.log(`(línea completa: ${codeLine.length} chars)`);
    if (caretLineIndex >= 0) console.log(`^ en columna: ${caretCol}`);
  }
  process.exit(2);
}
