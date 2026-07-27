"use strict";
// Extrae qi (catalogo), Qi (materiales) y Ai (APU) crudos desde la fuente
// canonica, sin modificarla, para alimentar la propuesta de taxonomia.
// Reutiliza la misma tecnica de extraccion que scripts/audit_apu_technical.js.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src", "assets", "index.js");
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, "target");

const source = fs.readFileSync(sourcePath, "utf8");

function extractArray(constName) {
  const compiledNames = { DCAT: "qi", DMAT: "Qi", DAPU: "Ai" };
  const variableName = compiledNames[constName] || constName;
  const marker = `${variableName} = [`;
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) throw new Error(`No se encontro ${marker}`);
  const start = source.indexOf("[", markerAt);
  if (start < 0) throw new Error(`No se encontro el array ${constName}`);

  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let depth = 0;
  let end = -1;

  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && next === "/") {
      lineComment = true;
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end < 0) throw new Error(`Array ${constName} sin cierre`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(`value=${source.slice(start, end)}`, context);
  return JSON.parse(JSON.stringify(context.value));
}

const catalog = extractArray("DCAT");
const materials = extractArray("DMAT");
const apus = extractArray("DAPU");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "taxonomy_raw_catalog.json"), JSON.stringify(catalog, null, 2));
fs.writeFileSync(path.join(outDir, "taxonomy_raw_materials.json"), JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(outDir, "taxonomy_raw_apus.json"), JSON.stringify(apus, null, 2));

console.log(JSON.stringify({ catalog: catalog.length, materials: materials.length, apus: apus.length, outDir }, null, 2));
