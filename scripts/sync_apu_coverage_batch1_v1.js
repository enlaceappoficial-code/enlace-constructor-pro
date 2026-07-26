"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const appPath = path.join(root, "src", "app.html");
const bundlePath = process.argv[2] || path.join(root, "src", "assets", "index.js");
const app = fs.readFileSync(appPath, "utf8").replace(/\r\n/g, "\n");
let bundle = fs.readFileSync(bundlePath, "utf8").replace(/\r\n/g, "\n");

const blockStartMarker = "  /* ═══ COBERTURA COMERCIAL — REPARACIONES Y ESPECIALIDADES PRIORITARIAS ═══ */";
const blockEndMarker = "  {id:31001, tipo:";
const blockStart = app.indexOf(blockStartMarker);
const blockEnd = app.indexOf(blockEndMarker, blockStart);
if (blockStart < 0 || blockEnd < 0) throw new Error("Bloque de cobertura no encontrado en src/app.html");
const coverageBlock = app.slice(blockStart, blockEnd).trimEnd();

for (let id = 40001; id <= 40016; id += 1) {
  if (!coverageBlock.includes(`{id:${id},`)) throw new Error(`APU ${id} no está en el bloque canónico`);
  if (bundle.includes(`id: ${id},`) || bundle.includes(`id:${id},`)) throw new Error(`APU ${id} ya existe en el paquete`);
}

const bundleMarker = "\n      {\n        id: 31001,\n        tipo:";
const bundleAt = bundle.indexOf(bundleMarker);
if (bundleAt < 0) throw new Error("Punto de inserción APU 31001 no encontrado en el paquete");
const indentedBlock = coverageBlock
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n");
bundle = bundle.slice(0, bundleAt) + `\n${indentedBlock}\n` + bundle.slice(bundleAt);

const apu67Marker = "\n        id: 67,\n        tipo:";
const apu67At = bundle.indexOf(apu67Marker);
const apu67End = bundle.indexOf("\n      },", apu67At);
if (apu67At < 0 || apu67End < 0) throw new Error("APU 67 no encontrada en el paquete");
const apu67 = bundle.slice(apu67At, apu67End);
const oldLine = "          { materialId: 175, cantidad: 0.3 },\n";
if (!apu67.includes(oldLine)) throw new Error("Composición esperada de APU 67 no encontrada");
const updatedApu67 = apu67.replace(oldLine, `${oldLine}          { materialId: 305, cantidad: 0.1 },\n`);
bundle = bundle.slice(0, apu67At) + updatedApu67 + bundle.slice(apu67End);

fs.writeFileSync(bundlePath, bundle, "utf8");
console.log(`Coverage batch 1 synchronized: ${bundlePath}`);
