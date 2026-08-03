const fs = require('fs');
const vm = require('vm');

function extractArray(constName) {
  const source = fs.readFileSync('src/assets/index.js', 'utf8');
  const compiledNames = { DCAT: "qi" };
  const variableName = compiledNames[constName] || constName;
  const marker = `${variableName} = [`;
  const markerAt = source.indexOf(marker);
  const start = source.indexOf("[", markerAt);

  let quote = "", escaped = false, lineComment = false, blockComment = false, depth = 0, end = -1;

  for (let i = start; i < source.length; i++) {
    const ch = source[i], next = source[i + 1];
    if (lineComment) { if (ch === "\n") lineComment = false; continue; }
    if (blockComment) { if (ch === "*" && next === "/") { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && next === "/") { lineComment = true; i++; continue; }
    if (ch === "/" && next === "*") { blockComment = true; i++; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "[") depth++;
    if (ch === "]") { depth--; if (depth === 0) { end = i + 1; break; } }
  }

  const context = {};
  vm.createContext(context);
  vm.runInContext(`value=${source.slice(start, end)}`, context);
  return JSON.parse(JSON.stringify(context.value));
}

const items = extractArray("DCAT");
console.log("Total items en DCAT (qi):", items.length);

const types = items.filter(x => !x.tipoIntervencion);
console.log("Partidas sin tipoIntervencion:", types.length);

