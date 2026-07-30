const fs = require('fs');
const vm = require('vm');

function extractArray(constName) {
  const source = fs.readFileSync('src/assets/index.js', 'utf8');
  const compiledNames = { DCAT: "qi", DMAT: "Qi", DAPU: "Ai" };
  const variableName = compiledNames[constName] || constName;
  const marker = `${variableName} = [`;
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) throw new Error(`No se encontro ${marker}`);
  const start = source.indexOf("[", markerAt);
  if (start < 0) throw new Error(`No se encontro el array ${constName}`);

  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let depth = 0;
  let end = -1;

  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && next === "/") {
      lineComment = true;
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end < 0) throw new Error(`Array ${constName} sin cierre`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(`value=${source.slice(start, end)}`, context);
  return JSON.parse(JSON.stringify(context.value));
}

const items = extractArray("DCAT");

let emptyR=0, emptySr=0, emptyT=0, eq=0, gen=0, otros=0, vario=0;

items.forEach(it => {
  let r = it.rubro;
  let sr = it.subrubro;
  let t = it.tipoIntervencion;
  
  if (r === undefined || r === null || r === "") emptyR++;
  if (sr === undefined || sr === null || sr === "") emptySr++;
  if (t === undefined || t === null || t === "") emptyT++;
  
  if (r && sr && r === sr) eq++;
  
  if ([r, sr, t].includes('General')) gen++;
  if ([r, sr, t].includes('Otros')) otros++;
  if ([r, sr, t].includes('Varios')) vario++;
});

console.log('emptyR:', emptyR);
console.log('emptySr:', emptySr);
console.log('emptyT:', emptyT);
console.log('eq:', eq);
console.log('gen:', gen);
console.log('otros:', otros);
console.log('vario:', vario);

const keywords = ['Accesibilidad', 'Techumbre', 'Hormigón', 'Pintura', 'Sanitaria'];
const samples = [];
keywords.forEach(kw => {
  let found = items.filter(it => (it.desc && it.desc.includes(kw)) || (it.rubro && it.rubro.includes(kw)) || (it.cat && it.cat.includes(kw)));
  if (found.length > 0) {
    samples.push(found[0]);
    if (found.length > 1) samples.push(found[1]);
  }
});

console.log('\\nSAMPLES:');
samples.forEach(s => {
  let fallbackSubrubro = s.subrubro || s.cat;
  console.log(`${s.id} | ${s.desc} | realR: ${s.rubro} | realSr: ${s.subrubro} | realT: ${s.tipoIntervencion} | uiSr: ${fallbackSubrubro}`);
});
