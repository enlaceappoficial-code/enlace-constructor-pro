"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const appPath = path.join(root, "src", "app.html");
const bundlePath = process.argv[2] || path.join(root, "src", "assets", "index.js");
const app = fs.readFileSync(appPath, "utf8").replace(/\r\n/g, "\n");
let bundle = fs.readFileSync(bundlePath, "utf8").replace(/\r\n/g, "\n");

const startMarker = "  /* ═══ COBERTURA COMERCIAL — SANITARIO, MANTENCIONES Y ESPECIALIDADES ═══ */";
const endMarker = "  {id:31001, tipo:";
const start = app.indexOf(startMarker);
const end = app.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error("Bloque canónico del lote 2 no encontrado");
const block = app.slice(start, end).trimEnd();

for (let id = 40101; id <= 40118; id += 1) {
  if (!block.includes(`{id:${id},`)) throw new Error(`APU ${id} ausente del bloque canónico`);
  if (bundle.includes(`id: ${id},`) || bundle.includes(`id:${id},`)) throw new Error(`APU ${id} ya existe en el paquete`);
}

const insertionMarker = "\n      {\n        id: 31001,\n        tipo:";
const at = bundle.indexOf(insertionMarker);
if (at < 0) throw new Error("Punto de inserción APU 31001 no encontrado");
const indented = block.split("\n").map((line) => `    ${line}`).join("\n");
bundle = bundle.slice(0, at) + `\n${indented}\n` + bundle.slice(at);

fs.writeFileSync(bundlePath, bundle, "utf8");
console.log(`Coverage batch 2 synchronized: ${bundlePath}`);
