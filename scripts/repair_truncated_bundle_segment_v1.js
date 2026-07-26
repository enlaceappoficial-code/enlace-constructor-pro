"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const targetPath = path.join(root, "src", "assets", "index.js");
const backupPath = path.join(root, "src", "assets", "index_ESTABLE_JULIO.js.bak");
let target = fs.readFileSync(targetPath, "utf8").replace(/\r\n/g, "\n");
const backup = fs.readFileSync(backupPath, "utf8").replace(/\r\n/g, "\n");

const startMarker = "                            E0 === S.id\n";
const endMarker = "                      te = oe.unidad,\n";
const targetStart = target.indexOf(startMarker);
const targetEnd = target.indexOf(endMarker, targetStart);
const backupStart = backup.indexOf(startMarker);
const backupEnd = backup.indexOf(endMarker, backupStart);

if ([targetStart, targetEnd, backupStart, backupEnd].some((pos) => pos < 0)) {
  throw new Error("No se encontraron las anclas del segmento truncado");
}

const knownCorruption = target.slice(targetStart, targetEnd).includes("String(Math.c`");
if (!knownCorruption) {
  console.log("El segmento no presenta la corrupción conocida; no se modifica");
  process.exit(0);
}

target = target.slice(0, targetStart)
  + backup.slice(backupStart, backupEnd)
  + target.slice(targetEnd);

fs.writeFileSync(targetPath, target, "utf8");
console.log("Segmento truncado restaurado desde respaldo estable");
