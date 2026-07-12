const fs = require("fs");
const path = require("path");
const vm = require("vm");

function extractArrayLiteral(src, needle) {
  const at = src.indexOf(needle);
  if (at === -1) return null;
  let i = at + needle.length;
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] !== "[") return null;
  const start = i;

  let mode = "code";
  let quote = null;
  let tplDepth = 0;
  const stack = [];
  const push = (ch) => stack.push(ch);
  const pop = (expect) => {
    const top = stack.pop();
    if (top !== expect) throw new Error(`Mismatch ${expect} vs ${top}`);
  };

  for (; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];

    if (mode === "string") {
      if (ch === "\\" && next) {
        i++;
        continue;
      }
      if (ch === quote) {
        mode = "code";
        quote = null;
      }
      continue;
    }

    if (mode === "template") {
      if (ch === "\\" && next) {
        i++;
        continue;
      }
      if (ch === "`") {
        mode = "code";
        continue;
      }
      if (ch === "$" && next === "{") {
        tplDepth++;
        mode = "code";
        push("{");
        i++;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      mode = "string";
      quote = ch;
      continue;
    }
    if (ch === "`") {
      mode = "template";
      continue;
    }

    if (ch === "[") push("[");
    else if (ch === "]") {
      pop("[");
      if (stack.length === 0) {
        i++;
        break;
      }
    } else if (ch === "{") push("{");
    else if (ch === "}") {
      pop("{");
      if (tplDepth > 0 && stack.length > 0 && stack[stack.length - 1] !== "{") {
        tplDepth--;
        mode = "template";
      }
    } else if (ch === "(") push("(");
    else if (ch === ")") pop("(");
    else if (ch === "/" && next === "/") {
      while (i < src.length && src[i] !== "\n") i++;
    } else if (ch === "/" && next === "*") {
      i += 2;
      while (i < src.length - 1 && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i++;
    }
  }

  return src.slice(start, i);
}

function evalExpr(expr) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`__x = (${expr})`, sandbox);
  return sandbox.__x;
}

function extractFirstObjectLiteral(src) {
  let mode = "code";
  let quote = null;
  let depth = 0;
  let started = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];

    if (mode === "string") {
      if (ch === "\\" && next) {
        i++;
        continue;
      }
      if (ch === quote) {
        mode = "code";
        quote = null;
      }
      continue;
    }

    if (mode === "template") {
      if (ch === "\\" && next) {
        i++;
        continue;
      }
      if (ch === "`") {
        mode = "code";
        continue;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      mode = "string";
      quote = ch;
      continue;
    }
    if (ch === "`") {
      mode = "template";
      continue;
    }

    if (ch === "/" && next === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < src.length - 1 && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i++;
      continue;
    }

    if (ch === "{") {
      depth++;
      started = true;
      continue;
    }
    if (ch === "}" && started) {
      depth--;
      if (depth === 0) return src.slice(0, i + 1);
      continue;
    }
  }

  return null;
}

function fixMojibake(s) {
  try {
    s = String(s == null ? "" : s);
    return decodeURIComponent(escape(s));
  } catch {
    return String(s == null ? "" : s);
  }
}

function fixStringsInArray(arr, keys) {
  if (!Array.isArray(arr)) return arr;
  for (const o of arr) {
    if (!o) continue;
    for (const k of keys) {
      if (o[k] != null) o[k] = fixMojibake(o[k]);
    }
  }
  return arr;
}

function normKey(s) {
  return fixMojibake(String(s == null ? "" : s))
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

const htmlPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
const outPath = process.argv[3] ? path.resolve(process.argv[3]) : null;
if (!htmlPath || !outPath) process.exit(1);

const s = fs.readFileSync(htmlPath, "utf8");
const DMAT = evalExpr(extractArrayLiteral(s, "const DMAT="));
const DCAT = evalExpr(extractArrayLiteral(s, "const DCAT="));
const DAPU = evalExpr(extractArrayLiteral(s, "const DAPU="));

if (!Array.isArray(DMAT) || !Array.isArray(DCAT) || !Array.isArray(DAPU)) {
  console.error("No se pudo extraer DMAT/DCAT/DAPU");
  process.exit(2);
}

fixStringsInArray(DMAT, ["cat", "nombre", "unidad"]);
fixStringsInArray(DCAT, ["cat", "desc", "unidad"]);
fixStringsInArray(DAPU, ["tipo", "estructura", "nombre", "categoria", "unidad"]);

let extraApus = [];
let extraFailed = 0;
let extraMatched = 0;
let extraFailedSamples = [];
try {
  const marker = s.indexOf("NUEVAS APUs PARTIDAS FALTANTES");
  if (marker !== -1) {
    const start = s.indexOf("{id:", marker);
    let end = -1;
    const tail = s.slice(marker);
    const m = tail.match(/\r?\n\];\s*const\s+DLICIT\s*=/);
    if (m && typeof m.index === "number") end = marker + m.index;
    if (start !== -1 && end !== -1 && end > start) {
      const snippet = s.slice(start, end);
      const starts = [];
      for (let at = 0; at < snippet.length; ) {
        const idx = snippet.indexOf("{id:", at);
        if (idx === -1) break;
        starts.push(idx);
        at = idx + 4;
      }
      extraMatched = starts.length;
      for (let si = 0; si < starts.length; si++) {
        const a0 = starts[si];
        const a1 = si + 1 < starts.length ? starts[si + 1] : snippet.length;
        const chunk = snippet.slice(a0, a1);
        const raw0 = extractFirstObjectLiteral(chunk);
        if (!raw0) {
          extraFailed++;
          if (extraFailedSamples.length < 3) extraFailedSamples.push({ message: "No closing brace", raw: chunk.slice(0, 4000) });
          continue;
        }
        try {
          const expr = String(raw0)
            .replace(/pctGG:\s*,/g, "pctGG:12,")
            .replace(/pctMO:\s*,/g, "pctMO:70,")
            .replace(/pctUtilidad:\s*,/g, "pctUtilidad:15,")
            .replace(/precioSubcontrato:\s*,/g, "precioSubcontrato:0,")
            .replace(/rendimiento:\s*,/g, "rendimiento:1,")
            .replace(/dotacion:\s*,/g, "dotacion:1,")
            .replace(/cantidad:\s*,/g, "cantidad:1,")
            .replace(/cantidad:\s*}/g, "cantidad:1}")
            .replace(/materialId:\s*,/g, "materialId:0,");
          const obj = evalExpr(expr);
          if (obj && typeof obj.catalogId === "number" && Array.isArray(obj.materiales)) {
            obj.materiales = obj.materiales.filter((it) => it && typeof it.materialId === "number" && isFinite(it.materialId) && typeof it.cantidad === "number" && isFinite(it.cantidad));
            if (obj.materiales.length) extraApus.push(obj);
          }
        } catch (e) {
          extraFailed++;
          if (extraFailedSamples.length < 3) extraFailedSamples.push({ message: String(e && e.message ? e.message : e), raw: raw0 });
        }
      }
      fixStringsInArray(extraApus, ["tipo", "estructura", "nombre", "categoria", "unidad"]);
    }
  }
} catch (e) {}

if (extraApus.length) {
  const seen = new Set();
  for (const a of DAPU) {
    const cid = Number(a && a.catalogId);
    if (!Number.isFinite(cid)) continue;
    const key = `${cid}|${normKey(a && a.nombre)}`;
    seen.add(key);
  }
  for (const a of extraApus) {
    const cid = Number(a && a.catalogId);
    if (!Number.isFinite(cid)) continue;
    const key = `${cid}|${normKey(a && a.nombre)}`;
    if (seen.has(key)) continue;
    DAPU.push(a);
    seen.add(key);
  }
}

const payload = { DMAT, DCAT, DAPU, generatedAt: new Date().toISOString() };
fs.writeFileSync(outPath, JSON.stringify(payload), "utf8");
console.log(`OK: ${outPath}`);
console.log(`DMAT=${DMAT.length} DCAT=${DCAT.length} DAPU=${DAPU.length} (+extra ${extraApus.length} fromMatches ${extraMatched} failed ${extraFailed})`);
if (extraFailedSamples.length) {
  const failPath = `${outPath}.extra_failed_samples.json`;
  fs.writeFileSync(failPath, JSON.stringify({ count: extraFailed, samples: extraFailedSamples }, null, 2), "utf8");
  console.log(`Wrote: ${failPath}`);
}
