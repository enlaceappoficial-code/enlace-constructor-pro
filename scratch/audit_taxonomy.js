const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('src/assets/index.js', 'utf8');

function extractArray(constName) {
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

const catalog = extractArray("DCAT");

let rubros = {};
let anomalies = [];

catalog.forEach(item => {
    let r = item.rubro ? item.rubro.trim() : "";
    let sr = item.subrubro ? item.subrubro.trim() : "";
    let t = item.tipoIntervencion ? item.tipoIntervencion.trim() : "";
    
    // Check if subrubro is actually coming from cat due to fallback, wait, the objects in the array have what they have.
    // In index.js `partida.subrubro || partida.cat` is used for display. I should evaluate if it's strictly empty.
    
    let isRMissing = !r;
    let isSrMissing = !sr;
    let isTMissing = !t;

    let displayR = r || "(Vacío)";
    let displaySr = sr || "(Vacío)";
    let displayT = t || "(Vacío)";

    if (!rubros[displayR]) rubros[displayR] = { count: 0, subrubros: {} };
    rubros[displayR].count++;
    
    if (!rubros[displayR].subrubros[displaySr]) rubros[displayR].subrubros[displaySr] = { count: 0, tipos: {} };
    rubros[displayR].subrubros[displaySr].count++;
    
    if (!rubros[displayR].subrubros[displaySr].tipos[displayT]) rubros[displayR].subrubros[displaySr].tipos[displayT] = 0;
    rubros[displayR].subrubros[displaySr].tipos[displayT]++;

    // Anomalies
    if (isRMissing || isSrMissing || isTMissing) {
        anomalies.push({ id: item.id, desc: item.desc, r: displayR, sr: displaySr, t: displayT, sug: "Valor vacío o no definido" });
    } else if (r === "General" || sr === "General" || t === "General" || sr === "Otros" || t === "Otros" || r === "Varios") {
        anomalies.push({ id: item.id, desc: item.desc, r: displayR, sr: displaySr, t: displayT, sug: "Clasificación demasiado genérica ('General', 'Otros')" });
    } else if (r === sr) {
        anomalies.push({ id: item.id, desc: item.desc, r: displayR, sr: displaySr, t: displayT, sug: "Subrubro es idéntico al Rubro" });
    }
});

let md = "# Auditoría de Taxonomía (311 Partidas)\n\n## Distribución de Rubros\n\n| Rubro | Cantidad | Subrubros (Cantidades) | Tipos de Intervención Presentes |\n|---|---|---|---|\n";

for (const [r, obj] of Object.entries(rubros)) {
    let countPerSr = [];
    let allTipos = new Set();
    for (const [sr, srObj] of Object.entries(obj.subrubros)) {
        countPerSr.push(`${sr} (${srObj.count})`);
        Object.keys(srObj.tipos).forEach(t => allTipos.add(t));
    }
    md += `| ${r} | ${obj.count} | ${countPerSr.join("<br>")} | ${[...allTipos].join("<br>")} |\n`;
}

md += "\n## Anomalías y Sugerencias de Corrección\n\n| ID | Descripción | Rubro | Subrubro | Tipo | Problema |\n|---|---|---|---|---|---|\n";
anomalies.forEach(a => {
    md += `| ${a.id} | ${a.desc} | ${a.r} | ${a.sr} | ${a.t} | ${a.sug} |\n`;
});

fs.mkdirSync('docs/taxonomia', { recursive: true });
fs.writeFileSync('docs/taxonomia/REPORTE_TAXONOMIA.md', md);
console.log("Reporte generado en docs/taxonomia/REPORTE_TAXONOMIA.md");
