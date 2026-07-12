const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

// 1) Token apu: en el buscador (filtrar por nombre de APU)
replaceOnce(
  'K=R.split(/\\s+/).filter(Boolean),D={sp:!1,su:!1,sa:!1},k=[];K.forEach(Q=>{Q===":sinprecio"?D.sp=!0:Q===":sinunidad"?D.su=!0:Q===":sinapu"?D.sa=!0:k.push(Q)});var le=Z=>{var X=parseFloat(Z.precio)||0,G=String(Z.unidad||"").trim(),ie=apSet.has(parseInt(Z.id));return!(D.sp&&X>0)&&!(D.su&&G&&A(G)!=="unidad")&&!(D.sa&&ie)};',
  'K=R.split(/\\s+/).filter(Boolean),D={sp:!1,su:!1,sa:!1},H=[],k=[];K.forEach(Q=>{Q===":sinprecio"?D.sp=!0:Q===":sinunidad"?D.su=!0:Q===":sinapu"?D.sa=!0:Q.slice(0,4)==="apu:"?H.push(Q.slice(4)):k.push(Q)});var le=Z=>{var X=parseFloat(Z.precio)||0,G=String(Z.unidad||"").trim(),ie=apSet.has(parseInt(Z.id)),ae=H.length?(apByCat[parseInt(Z.id)]||[]):null,fe=H.length?A(ae.join(" ")):"";return!(D.sp&&X>0)&&!(D.su&&G&&A(G)!=="unidad")&&!(D.sa&&ie)&&(!H.length||H.every(q=>fe.indexOf(A(q))!==-1))};'
);

// 2) Click en columna APUs: muestra lista y permite filtrar por la primera APU
replaceOnce(
  'title:y.__apuTitle||"",children:y.__apuShort||',
  'title:y.__apuTitle||"",onClick:()=>{var A=y.__apuTitle||"";if(A){if(confirm("APUs vinculadas:\\n\\n"+A+"\\n\\n¿Filtrar por la primera APU?")){var S=A.split(",")[0].trim();S&&w(("apu:"+S).trim())}}else r("Sin APU")},children:y.__apuShort||'
);

// 3) Botón Copiar en acciones por fila
replaceOnce(
  '}),e.jsx("button",{style:c.btn("d"),onClick:()=>x(y),children:',
  '}),e.jsx("button",{style:c.btn("s"),onClick:()=>{var A=[y.cat,y.desc,"("+y.unidad+")",ne(y.precio),"APUs:",(y.__apuTitle||"Sin APU")].join(" ");try{navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(A):(()=>{var S=document.createElement("textarea");S.value=A;document.body.appendChild(S);S.select();document.execCommand("copy");document.body.removeChild(S)})(),r("Copiado")}catch(S){r("No se pudo copiar")}},children:"Copiar"}),e.jsx("button",{style:c.btn("d"),onClick:()=>x(y),children:'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: acciones rápidas Partidas de Obra (${changed} cambios).`);
