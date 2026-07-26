"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
  throw new Error("Uso: node recover_tauri_brotli_asset.js <entrada> <salida>");
}

const compressed = fs.readFileSync(path.resolve(input));
const recovered = zlib.brotliDecompressSync(compressed);
fs.writeFileSync(path.resolve(output), recovered);
console.log(JSON.stringify({
  input: path.resolve(input),
  output: path.resolve(output),
  compressedBytes: compressed.length,
  recoveredBytes: recovered.length,
}, null, 2));
