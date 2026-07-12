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

const filePath = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!filePath) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");
const dapuExpr = extractArrayLiteral(s, "const DAPU=");
if (!dapuExpr) process.exit(2);
const DAPU = evalExpr(dapuExpr);

const byCatalog = new Map();
for (const a of DAPU) {
  const cid = Number(a && a.catalogId);
  if (!Number.isFinite(cid)) continue;
  byCatalog.set(cid, (byCatalog.get(cid) || 0) + 1);
}
const dups = [...byCatalog.entries()].filter(([, v]) => v > 1).sort((a, b) => b[1] - a[1] || a[0] - b[0]);

console.log(
  JSON.stringify(
    {
      totalApus: Array.isArray(DAPU) ? DAPU.length : null,
      duplicatedCatalogIds: dups.length,
      topDuplicates: dups.slice(0, 25),
    },
    null,
    2
  )
);

