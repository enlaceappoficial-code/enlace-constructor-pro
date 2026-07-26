"use strict";

const fs = require("fs");

const [basePath, candidatePath] = process.argv.slice(2);
if (!basePath || !candidatePath) {
  throw new Error("Uso: node compare_index_variants.js <base> <candidato>");
}

const baseLines = fs.readFileSync(basePath, "utf8").replace(/\r\n/g, "\n").split("\n");
const candidateLines = fs.readFileSync(candidatePath, "utf8").replace(/\r\n/g, "\n").split("\n");
const normalizedBase = new Set(baseLines.map((line) => line.trim()).filter(Boolean));
const interesting = candidateLines
  .map((line, index) => ({ line: index + 1, text: line.trim() }))
  .filter(({ text }) => text && !normalizedBase.has(text))
  .filter(({ text }) => (
    /function\s+[A-ZÁÉÍÓÚÑ]|const\s+[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ0-9_]*\s*=/.test(text)
    || /children:\s*"[^"]{4,}"/.test(text)
    || /\{\s*k:\s*"[^"]+".*l:\s*"[^"]+"/.test(text)
    || /page===|page\s*===|setPage\("/.test(text)
    || /localStorage\.(getItem|setItem)/.test(text)
  ));

console.log(JSON.stringify({
  basePath,
  candidatePath,
  baseLines: baseLines.length,
  candidateLines: candidateLines.length,
  interestingCount: interesting.length,
  interesting: interesting.slice(0, 500),
}, null, 2));
