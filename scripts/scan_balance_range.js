const fs = require("fs");

const filePath = process.argv[2];
const start = parseInt(process.argv[3] || "0", 10);
const end = parseInt(process.argv[4] || "0", 10);
if (!filePath || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) process.exit(1);

const s0 = fs.readFileSync(filePath, "utf8");
const s = s0.slice(start, end);

const stack = [];
let i = 0;
let mode = "code";
let quote = null;
let tplExprDepth = 0;

function push(ch) {
  stack.push({ ch, i });
}

function pop(expect) {
  const top = stack.pop();
  if (!top || top.ch !== expect) {
    throw new Error(`Mismatch: expected ${expect}, got ${top ? top.ch : "EMPTY"} at local ${i}`);
  }
}

try {
  for (i = 0; i < s.length; i++) {
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
        tplExprDepth++;
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

    if (ch === "{") push("{");
    else if (ch === "}") {
      pop("{");
      if (tplExprDepth > 0 && stack.length > 0 && stack[stack.length - 1].ch !== "{") {
        tplExprDepth--;
        mode = "template";
      }
    } else if (ch === "(") push("(");
    else if (ch === ")") pop("(");
    else if (ch === "[") push("[");
    else if (ch === "]") pop("[");
    else if (ch === "/" && next === "/") {
      while (i < s.length && s[i] !== "\n") i++;
    } else if (ch === "/" && next === "*") {
      i += 2;
      while (i < s.length - 1 && !(s[i] === "*" && s[i + 1] === "/")) i++;
      i++;
    }
  }

  if (mode !== "code") throw new Error(`Unclosed ${mode}`);
  if (stack.length) throw new Error(`Unclosed ${stack[stack.length - 1].ch} at local ${stack[stack.length - 1].i}`);
  console.log("OK");
} catch (e) {
  console.log(String(e && e.message ? e.message : e));
  if (stack.length) console.log("STACK_TOP", stack[stack.length - 1]);
  process.exit(2);
}

