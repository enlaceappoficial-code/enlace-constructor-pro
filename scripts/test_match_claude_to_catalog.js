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

function fixMojibake(s) {
  try {
    s = String(s == null ? "" : s);
    return decodeURIComponent(escape(s));
  } catch {
    return String(s == null ? "" : s);
  }
}

function norm(s) {
  return fixMojibake(String(s == null ? "" : s))
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function score(a, b) {
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return 0;
  if (x === y) return 100;
  if (x.includes(y) || y.includes(x)) return 85;
  const xt = x.split(" ");
  const yt = y.split(" ");
  const set = Object.create(null);
  for (const t of xt) set[t] = 1;
  let inter = 0;
  let union = xt.length;
  for (const t of yt) (set[t] ? inter++ : union++);
  return union ? Math.round((inter / union) * 60) : 0;
}

const htmlPath = path.resolve(process.argv[2]);
const backupPath = path.resolve(process.argv[3]);

const html = fs.readFileSync(htmlPath, "utf8");
const DCAT = evalExpr(extractArrayLiteral(html, "const DCAT="));

const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
const catalog = Array.isArray(backup.catalog) ? backup.catalog : [];

let matched70 = 0;
let matched80 = 0;
let matched90 = 0;

for (const c of catalog) {
  let bestSc = 0;
  for (const d of DCAT) {
    let sc = score(c && c.desc, d && d.desc);
    if (sc) {
      norm(c && c.cat) && norm(d && d.cat) && norm(c.cat) === norm(d.cat) && (sc += 20);
      norm(c && c.unidad) && norm(d && d.unidad) && norm(c.unidad) === norm(d.unidad) && (sc += 10);
    }
    if (sc > bestSc) bestSc = sc;
  }
  if (bestSc >= 70) matched70++;
  if (bestSc >= 80) matched80++;
  if (bestSc >= 90) matched90++;
}

console.log(
  JSON.stringify(
    {
      catalog: catalog.length,
      dcat: Array.isArray(DCAT) ? DCAT.length : null,
      matchedAtLeast70: matched70,
      matchedAtLeast80: matched80,
      matchedAtLeast90: matched90,
    },
    null,
    2
  )
);

