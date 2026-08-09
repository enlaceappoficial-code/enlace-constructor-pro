const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const source = path.join(projectRoot, "node_modules", "docx", "build", "index.mjs");
const destinationDirectory = path.join(projectRoot, "src", "assets", "vendor");
const destination = path.join(destinationDirectory, "docx-8.5.0.mjs");
const legacyUmd = path.join(destinationDirectory, "docx-8.5.0.umd.js");
const jszipSource = path.join(projectRoot, "node_modules", "jszip", "dist", "jszip.min.js");
const jszipDestination = path.join(destinationDirectory, "jszip-3.10.1.min.js");

if (!fs.existsSync(source)) {
  throw new Error("No se encontró docx 8.5.0 instalado. Ejecuta npm install.");
}

fs.mkdirSync(destinationDirectory, { recursive: true });
fs.copyFileSync(source, destination);
if (!fs.existsSync(jszipSource)) throw new Error("No se encontró JSZip 3.10.1 instalado como dependencia local.");
fs.copyFileSync(jszipSource, jszipDestination);
if (fs.existsSync(legacyUmd)) fs.unlinkSync(legacyUmd);
console.log(`DOCX local sincronizado: ${path.relative(projectRoot, destination)}`);
