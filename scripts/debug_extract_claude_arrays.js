const fs = require("fs");
const path = require("path");

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

const file = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!file) process.exit(1);
const src = fs.readFileSync(file, "utf8");

for (const name of ["DMAT", "DCAT", "DAPU"]) {
  const expr = extractArrayLiteral(src, `const ${name}=`) || "";
  console.log(
    JSON.stringify(
      {
        name,
        found: !!expr,
        len: expr.length,
        hasMarker: expr.includes("NUEVAS APUs PARTIDAS FALTANTES"),
        hasCatalog66: expr.includes("catalogId:66"),
        tail: expr.slice(-140),
      },
      null,
      2
    )
  );
}

