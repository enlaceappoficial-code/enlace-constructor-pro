"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src", "assets", "index.js");
const outputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "exports", "ECP_BIBLIOTECA_IA_2026-07-26.json");
const sourceBuffer = fs.readFileSync(sourcePath);
const source = sourceBuffer.toString("utf8");

function extractArray(variableName) {
  const marker = `${variableName} = [`;
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) throw new Error(`No se encontró ${marker}`);
  const start = source.indexOf("[", markerAt);
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let depth = 0;
  let end = -1;

  for (let index = start; index < source.length; index++) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index++;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index++;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "[") depth++;
    if (char === "]" && --depth === 0) {
      end = index + 1;
      break;
    }
  }

  if (end < 0) throw new Error(`Array ${variableName} sin cierre`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(`value=${source.slice(start, end)}`, context);
  return JSON.parse(JSON.stringify(context.value));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), "es"),
  );
}

function nextId(records) {
  return Math.max(0, ...records.map((record) => Number(record.id) || 0)) + 1;
}

const partidas = extractArray("qi");
const materiales = extractArray("Qi");
const apus = extractArray("Ai");
const exportData = {
  metadata: {
    producto: "Enlace Constructor Pro",
    version: "1.0.3",
    generadoEn: new Date().toISOString(),
    fuente: "src/assets/index.js",
    sha256Fuente: crypto.createHash("sha256").update(sourceBuffer).digest("hex").toUpperCase(),
    alcance: "Biblioteca canónica para análisis externo; no contiene presupuestos ni clientes.",
    totales: {
      partidas: partidas.length,
      materiales: materiales.length,
      apus: apus.length,
    },
    proximoIdSugerido: {
      partida: nextId(partidas),
      material: nextId(materiales),
      apu: nextId(apus),
    },
  },
  contratoDeDatos: {
    partida: {
      requerido: ["id", "cat", "desc", "unidad", "precio"],
      descripcion: "Actividad presupuestable. El precio es referencial en CLP sin IVA.",
    },
    material: {
      requerido: ["id", "cat", "nombre", "unidad", "precio"],
      descripcion: "Insumo, equipo o recurso comprado. El precio es referencial en CLP sin IVA.",
    },
    apu: {
      requerido: [
        "id",
        "catalogId",
        "nombre",
        "unidad",
        "materiales",
        "rendimiento",
        "dotacion",
        "pctGG",
        "pctUtilidad",
      ],
      descripcion: "Análisis de precio unitario vinculado a una partida por catalogId.",
      lineaMaterial: {
        requerido: ["materialId", "cantidad"],
        regla: "cantidad corresponde al consumo por una unidad de la partida.",
      },
      manoDeObra: {
        regla: "Usar rendimiento y dotacion; precioMO solo cuando corresponda un valor explícito.",
      },
    },
    reglas: [
      "Todo APU debe referenciar una partida existente mediante catalogId.",
      "Todo materialId del APU debe existir en materiales.",
      "La unidad de la partida y la unidad del APU deben coincidir.",
      "Los IDs deben ser enteros únicos y no deben reutilizar IDs existentes.",
      "No crear duplicados por diferencias menores de redacción, acentos o mayúsculas.",
      "Los precios deben expresarse en pesos chilenos, sin IVA.",
    ],
  },
  taxonomiaActual: {
    categoriasPartidas: unique(partidas.map((item) => item.cat)),
    categoriasMateriales: unique(materiales.map((item) => item.cat)),
    unidadesPartidas: unique(partidas.map((item) => item.unidad)),
    unidadesMateriales: unique(materiales.map((item) => item.unidad)),
  },
  partidas,
  materiales,
  apus,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(exportData, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  outputPath,
  sha256Fuente: exportData.metadata.sha256Fuente,
  totales: exportData.metadata.totales,
  proximoIdSugerido: exportData.metadata.proximoIdSugerido,
}, null, 2));
