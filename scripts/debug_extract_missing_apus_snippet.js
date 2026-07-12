const fs = require("fs");
const path = require("path");

const file = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!file) process.exit(1);
const s = fs.readFileSync(file, "utf8");

const marker = s.indexOf("NUEVAS APUs PARTIDAS FALTANTES");
const start = marker === -1 ? -1 : s.indexOf("{id:", marker);
let end = -1;
if (marker !== -1) {
  const tail = s.slice(marker);
  const m = tail.match(/\r?\n\];\s*const\s+DLICIT\s*=/);
  if (m && typeof m.index === "number") end = marker + m.index;
}

console.log(JSON.stringify({ marker, start, end, tailHasDLICIT: marker !== -1 ? s.slice(marker, marker + 5000).includes("const DLICIT") : false }, null, 2));
if (start !== -1 && end !== -1) {
  let snippet = s.slice(start, end);
  snippet = snippet
    .replace(/}\s*\r?\n\s*{id:/g, "},\n{id:")
    .replace(/pctGG:\s*,/g, "pctGG:12,")
    .replace(/pctMO:\s*,/g, "pctMO:70,")
    .replace(/pctUtilidad:\s*,/g, "pctUtilidad:15,")
    .replace(/precioSubcontrato:\s*,/g, "precioSubcontrato:0,")
    .replace(/rendimiento:\s*,/g, "rendimiento:1,")
    .replace(/dotacion:\s*,/g, "dotacion:1,");
  console.log("snippetLen", snippet.length);
  console.log("hasCatalog66", snippet.includes("catalogId:66"));
  const dd = snippet.indexOf(",,");
  console.log("doubleCommaAt", dd);
  const i207 = snippet.indexOf("{id:207");
  console.log("idx207", i207);
  if (i207 !== -1) console.log("before207", JSON.stringify(snippet.slice(Math.max(0, i207 - 80), i207 + 20)));
  console.log("snippetTail", snippet.slice(-120));
  const re = /\{id:\s*\d+[\s\S]*?catalogId:\s*\d+[\s\S]*?materiales:\s*\[[^\]]*\]\s*\}/g;
  const matches = snippet.match(re) || [];
  console.log("regexMatches", matches.length);
  console.log("firstMatchHead", matches[0] ? matches[0].slice(0, 120) : null);
  try {
    const vm = require("vm");
    const ctx = {};
    vm.createContext(ctx);
    vm.runInContext(`__x = ([${snippet}]);`, ctx);
    const arr = ctx.__x;
    console.log("evalOk", Array.isArray(arr), Array.isArray(arr) ? arr.length : null);
    if (Array.isArray(arr)) {
      const apus = arr.filter((o) => o && typeof o.catalogId === "number" && Array.isArray(o.materiales));
      console.log("apuLike", apus.length);
      console.log("has66InEval", apus.some((a) => a.catalogId === 66));
    }
  } catch (e) {
    console.log("evalError", String(e && e.message ? e.message : e));
    e && e.stack && console.log(e.stack.split("\n").slice(0, 5).join("\n"));
  }
}
