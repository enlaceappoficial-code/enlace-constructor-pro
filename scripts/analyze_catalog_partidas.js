const fs = require("fs");
const path = require("path");
const vm = require("vm");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s = fs.readFileSync(filePath, "utf8");

const at = s.indexOf("qi=[");
if (at === -1) {
  console.log("No se encontró qi=[");
  process.exit(2);
}

const start = at + "qi=".length;

let i = start;
let mode = "code";
let quote = null;
let tplDepth = 0;
const stack = [];

function push(ch) {
  stack.push(ch);
}
function pop(expect) {
  const top = stack.pop();
  if (top !== expect) throw new Error(`Mismatch ${expect} vs ${top}`);
}

for (; i < s.length; i++) {
  const ch = s[i];
  const next = s[i + 1];

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
    while (i < s.length && s[i] !== "\n") i++;
  } else if (ch === "/" && next === "*") {
    i += 2;
    while (i < s.length - 1 && !(s[i] === "*" && s[i + 1] === "/")) i++;
    i++;
  }
}

const expr = s.slice(start, i);
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`qi=${expr}`, sandbox);

const qi = sandbox.qi;
if (!Array.isArray(qi)) {
  console.log("qi no es array");
  process.exit(3);
}

const byCat = new Map();
for (const it of qi) {
  const cat = String(it.cat || "Sin categoría");
  if (!byCat.has(cat)) byCat.set(cat, []);
  byCat.get(cat).push(it);
}

const cats = [...byCat.entries()]
  .map(([cat, arr]) => ({ cat, count: arr.length }))
  .sort((a, b) => b.count - a.count || a.cat.localeCompare(b.cat, "es"));

console.log(`Total catálogo (qi): ${qi.length}`);
console.log(`Categorías: ${cats.length}`);
console.log("");
console.log("Top categorías (conteo):");
cats.slice(0, 20).forEach((c) => console.log(`- ${c.cat}: ${c.count}`));

console.log("");
console.log("Ejemplos por categoría (primeros 3):");
cats.slice(0, 20).forEach(({ cat }) => {
  const ex = byCat
    .get(cat)
    .slice(0, 3)
    .map((x) => x.desc)
    .filter(Boolean);
  console.log(`- ${cat}: ${ex.join(" | ")}`);
});

