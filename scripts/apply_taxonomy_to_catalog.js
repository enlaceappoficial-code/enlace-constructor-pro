"use strict";
// Inyecta los 6 campos de taxonomia aprobada (rubro, subrubro,
// tipoIntervencion, sistemaConstructivo, alcance, especialidad) en cada uno
// de los 311 objetos del catalogo (qi) en src/assets/index.js.
//
// NO modifica id, cat, desc, unidad, precio ni ningun otro campo existente
// (incluidas las reglas comerciales agregadas en una fase anterior): solo
// agrega los 6 campos nuevos al final de cada objeto, preservando el texto
// original byte a byte salvo por esa insercion.
//
// Fuente de datos: docs/taxonomia/PARTIDAS_TAXONOMIA_PROPUESTA.csv (la
// version aprobada, ya con 0 partidas pendientes de revision humana).
//
// Uso:
//   node scripts/apply_taxonomy_to_catalog.js --dry-run   (solo valida, no escribe)
//   node scripts/apply_taxonomy_to_catalog.js             (aplica y escribe el archivo)

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src", "assets", "index.js");
const csvPath = path.join(root, "docs", "taxonomia", "PARTIDAS_TAXONOMIA_PROPUESTA.csv");
const dryRun = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// 1) Leer la matriz aprobada (CSV) a un mapa id -> campos taxonomicos
// ---------------------------------------------------------------------------

function parseCsv(text) {
  const lines = text.replace(/\r\n/g, "\n").trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const vals = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQ = false;
        } else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ",") {
        vals.push(cur);
        cur = "";
      } else cur += c;
    }
    vals.push(cur);
    const rec = {};
    headers.forEach((h, i) => (rec[h] = vals[i]));
    return rec;
  });
}

const csvRows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const byId = new Map();
for (const r of csvRows) {
  const id = parseInt(r.id, 10);
  byId.set(id, {
    rubro: r.rubroPropuesto,
    subrubro: r.subrubroPropuesto,
    tipoIntervencion: r.tipoIntervencionPropuesto,
    sistemaConstructivo: r.sistemaConstructivoPropuesto,
    alcance: r.alcancePropuesto,
    especialidad: r.especialidadPropuesta,
  });
}

if (byId.size !== 311) {
  throw new Error(`Se esperaban 311 partidas en el CSV, se leyeron ${byId.size}`);
}

// ---------------------------------------------------------------------------
// 2) Localizar el arreglo qi = [ ... ] en el bundle (misma tecnica de
//    scripts/audit_apu_technical.js / extract_taxonomy_data.js)
// ---------------------------------------------------------------------------

const source = fs.readFileSync(sourcePath, "utf8");
const marker = "qi = [";
const markerAt = source.indexOf(marker);
if (markerAt < 0) throw new Error("No se encontro 'qi = [' en el bundle");
const arrStart = source.indexOf("[", markerAt);

function findMatchingBracket(text, openIdx, openCh, closeCh) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
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
    if (ch === openCh) depth++;
    if (ch === closeCh) {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error(`No se encontro el cierre de ${openCh} iniciado en ${openIdx}`);
}

const arrEnd = findMatchingBracket(source, arrStart, "[", "]");
const arrayInner = source.slice(arrStart + 1, arrEnd);

// ---------------------------------------------------------------------------
// 3) Encontrar cada objeto {..} de nivel superior dentro del arreglo
// ---------------------------------------------------------------------------

function findTopLevelObjects(text) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let objStart = -1;
  const objects = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
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
    if (ch === "{") {
      if (depth === 0) objStart = i;
      depth++;
    }
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        objects.push({ start: objStart, end: i });
        objStart = -1;
      }
    }
  }
  return objects;
}

const objects = findTopLevelObjects(arrayInner);
if (objects.length !== 311) {
  throw new Error(`Se esperaban 311 objetos de catalogo en el bundle, se encontraron ${objects.length}`);
}

// ---------------------------------------------------------------------------
// 4) Construir el texto nuevo para cada objeto (agregando los 6 campos) y
//    aplicar los reemplazos de atras hacia adelante para no invalidar
//    offsets ya calculados.
// ---------------------------------------------------------------------------

const seenIds = new Set();
let newArrayInner = arrayInner;

for (let i = objects.length - 1; i >= 0; i--) {
  const { start, end } = objects[i];
  const objText = arrayInner.slice(start, end + 1);
  const idMatch = objText.match(/id:\s*(\d+)/);
  if (!idMatch) throw new Error(`Objeto sin campo id reconocible cerca de offset ${start}`);
  const id = parseInt(idMatch[1], 10);
  if (seenIds.has(id)) throw new Error(`ID duplicado detectado en el bundle: ${id}`);
  seenIds.add(id);

  const taxo = byId.get(id);
  if (!taxo) throw new Error(`No hay datos de taxonomia para el id ${id} (presente en el bundle pero no en el CSV)`);

  // Ya tiene campos de taxonomia? (evita duplicar si el script se corre dos veces)
  if (/\brubro:\s*"/.test(objText)) {
    throw new Error(`El objeto id ${id} ya tiene un campo "rubro"; aborta para no duplicar campos.`);
  }

  let inner = objText.slice(1, -1); // sin las llaves { }
  inner = inner.replace(/,\s*$/, ""); // sin coma final sobrante antes del cierre

  const addition =
    `,\n        rubro: ${JSON.stringify(taxo.rubro)}` +
    `,\n        subrubro: ${JSON.stringify(taxo.subrubro)}` +
    `,\n        tipoIntervencion: ${JSON.stringify(taxo.tipoIntervencion)}` +
    `,\n        sistemaConstructivo: ${JSON.stringify(taxo.sistemaConstructivo)}` +
    `,\n        alcance: ${JSON.stringify(taxo.alcance)}` +
    `,\n        especialidad: ${JSON.stringify(taxo.especialidad)}`;

  const newObjText = "{" + inner + addition + "\n      }";
  newArrayInner = newArrayInner.slice(0, start) + newObjText + newArrayInner.slice(end + 1);
}

if (seenIds.size !== 311) {
  throw new Error(`Se procesaron ${seenIds.size} IDs unicos, se esperaban 311`);
}

const missingFromBundle = [...byId.keys()].filter((id) => !seenIds.has(id));
if (missingFromBundle.length > 0) {
  throw new Error(`IDs del CSV que no aparecen en el bundle: ${missingFromBundle.join(", ")}`);
}

const newSource = source.slice(0, arrStart + 1) + newArrayInner + source.slice(arrEnd);

console.log(JSON.stringify({
  dryRun,
  objetosEncontrados: objects.length,
  idsUnicosProcesados: seenIds.size,
  bytesOriginal: source.length,
  bytesNuevo: newSource.length,
  diferenciaBytes: newSource.length - source.length,
}, null, 2));

if (!dryRun) {
  fs.writeFileSync(sourcePath, newSource, "utf8");
  console.log("Escrito: " + sourcePath);
}
