"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const appPath = path.join(root, "src", "app.html");
const bundlePath = path.join(root, "src", "assets", "index.js");
const app = fs.readFileSync(appPath, "utf8").replace(/\r\n/g, "\n");
let bundle = fs.readFileSync(bundlePath, "utf8").replace(/\r\n/g, "\n");

function extract(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  const end = app.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`No se encontró bloque ${startMarker}`);
  return app.slice(start, end).trimEnd();
}

function insertBefore(anchor, block, alreadyMarker) {
  if (bundle.includes(alreadyMarker)) return;
  const at = bundle.indexOf(anchor);
  if (at < 0) throw new Error(`No se encontró ancla ${anchor}`);
  const indented = block.split("\n").map((line) => `      ${line.trimStart()}`).join("\n");
  bundle = bundle.slice(0, at) + `${indented}\n` + bundle.slice(at);
}

const catalogBlock = extract(
  "  /* ═══ AMPLIACIÓN PROFESIONAL 1 — VIVIENDA, EDIFICIO Y LOCAL ═══ */",
  "\n\n];",
);
const materialBlock = extract(
  "  {id:442, cat:",
  "\n];\n\n\nconst MO_PCT_CAT",
);
const apuStart = app.indexOf(
  "  /* ═══ AMPLIACIÓN PROFESIONAL 1 — VIVIENDA, EDIFICIO Y LOCAL ═══ */",
  app.indexOf("const DAPU=["),
);
const apuEnd = app.indexOf("\n].map(a=>", apuStart);
if (apuStart < 0 || apuEnd < 0) throw new Error("No se encontró bloque APU profesional");
const apuBlock = app.slice(apuStart, apuEnd).trimEnd();

insertBefore("    ],\n    Rn = [", catalogBlock, "id:321,cat:");
insertBefore("    ],\n    Ip = {", materialBlock, "id:442, cat:");
insertBefore("    ].map((t) =>", apuBlock, "id:40401,");

fs.writeFileSync(bundlePath, bundle, "utf8");
console.log("Ampliación profesional 1 sincronizada con src/assets/index.js");
