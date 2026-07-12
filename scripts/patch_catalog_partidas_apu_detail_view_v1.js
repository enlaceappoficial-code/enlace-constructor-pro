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

// Revertir filtro apu: (volver a tokens :sinprecio/:sinunidad/:sinapu solamente)
replaceOnce(
  'D={sp:!1,su:!1,sa:!1},H=[],k=[];K.forEach(Q=>{Q===":sinprecio"?D.sp=!0:Q===":sinunidad"?D.su=!0:Q===":sinapu"?D.sa=!0:Q.slice(0,4)==="apu:"?H.push(Q.slice(4)):k.push(Q)});var le=Z=>{var X=parseFloat(Z.precio)||0,G=String(Z.unidad||"").trim(),ie=apSet.has(parseInt(Z.id)),ae=H.length?(apByCat[parseInt(Z.id)]||[]):null,fe=H.length?A(ae.join(" ")):"";return!(D.sp&&X>0)&&!(D.su&&G&&A(G)!=="unidad")&&!(D.sa&&ie)&&(!H.length||H.every(q=>fe.indexOf(A(q))!==-1))};',
  'D={sp:!1,su:!1,sa:!1},k=[];K.forEach(Q=>{Q===":sinprecio"?D.sp=!0:Q===":sinunidad"?D.su=!0:Q===":sinapu"?D.sa=!0:k.push(Q)});var le=Z=>{var X=parseFloat(Z.precio)||0,G=String(Z.unidad||"").trim(),ie=apSet.has(parseInt(Z.id));return!(D.sp&&X>0)&&!(D.su&&G&&A(G)!=="unidad")&&!(D.sa&&ie)};'
);

// Revertir click en celda APUs (sacar confirm)
replaceOnce(
  'title:y.__apuTitle||"",onClick:()=>{var A=y.__apuTitle||"";if(A){if(confirm("APUs vinculadas:\\n\\n"+A+"\\n\\n┬┐Filtrar por la primera APU?")){var S=A.split(",")[0].trim();S&&w(("apu:"+S).trim())}}else r("Sin APU")},children:y.__apuShort||',
  'title:y.__apuTitle||"",children:y.__apuShort||'
);

// Reemplazar botón "Copiar" por "Ver APUs" (abre detalle con materiales en nueva pestaña)
replaceOnce(
  'children:"Copiar"}),e.jsx("button",{style:c.btn("d"),onClick:()=>x(y),children:',
  'children:"Ver APUs"}),e.jsx("button",{style:c.btn("d"),onClick:()=>x(y),children:'
);

replaceOnce(
  'style:c.btn("s"),onClick:()=>{var A=[y.cat,y.desc,"("+y.unidad+")",ne(y.precio),"APUs:",(y.__apuTitle||"Sin APU")].join(" ");try{navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(A):(()=>{var S=document.createElement("textarea");S.value=A;document.body.appendChild(S);S.select();document.execCommand("copy");document.body.removeChild(S)})(),r("Copiado")}catch(S){r("No se pudo copiar")}},children:"Ver APUs"',
  'style:c.btn("s"),onClick:()=>{try{var A=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus")||"[]")||[],S=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales")||"[]")||[],O={};S.forEach(P=>{O[parseInt(P.id)]=P});var U=A.filter(P=>parseInt(P&&P.catalogId)===parseInt(y.id));var Z=(x)=>String(x||"").replace(/[&<>"]/g,m=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",\"\\\"\":\"&quot;\"}[m]));var W=U.map(P=>{var Y=Array.isArray(P.materiales)?P.materiales:[];var L=Y.map((E,ii)=>{var M=O[parseInt(E.materialId)]||{};var q=Number(E.cantidad)||0;var pr=Number(M.precio)||0;var st=q*pr;return `<tr><td>${ii+1}</td><td>${Z(M.nombre||(\"Material \"+E.materialId))}</td><td>${q}</td><td>${Z(M.unidad||\"unidad\")}</td><td>${ne(pr)}</td><td>${ne(Math.round(st))}</td></tr>`}).join(\"\");return `<div style=\\\"border:1px solid #243a58;border-radius:10px;overflow:hidden;margin:12px 0\\\"><div style=\\\"background:#1a3060;color:#fff;padding:10px 12px;font-weight:800\\\">${Z(P.nombre||\"APU\")}</div><div style=\\\"padding:10px 12px;color:#d6e1f0;background:#0b1220\\\"><div style=\\\"font-size:12px;opacity:.85\\\">Unidad: ${Z(P.unidad||\"unidad\")} · Categoría: ${Z(P.categoria||P.tipo||\"—\")} · Rendimiento: ${P.rendimiento||\"—\"}</div></div><div style=\\\"padding:10px 12px;background:#0f172a\\\"><table style=\\\"width:100%;border-collapse:collapse\\\"><thead><tr style=\\\"background:#111827\\\"><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">#</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Material</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Cant.</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Unidad</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Precio</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Subtotal</th></tr></thead><tbody>${L||\"<tr><td colspan=\\\"6\\\" style=\\\"padding:10px;color:#93a4b8\\\">Sin materiales</td></tr>\"}</tbody></table></div></div>`}).join(\"\");var html=`<html><head><title>APUs de Partida</title><meta charset=\\\"utf-8\\\" /><style>body{margin:0;font-family:ui-sans-serif,system-ui,Segoe UI,Arial;background:#0b1220;color:#e5e7eb}h1{margin:0;font-size:16px} .top{position:sticky;top:0;background:#0b1220;border-bottom:1px solid #243a58;padding:12px 14px;display:flex;gap:10px;align-items:center} .btn{padding:8px 12px;border-radius:8px;border:1px solid #243a58;background:#111827;color:#e5e7eb;cursor:pointer} .wrap{padding:14px}</style></head><body><div class=\\\"top\\\"><button class=\\\"btn\\\" onclick=\\\"window.print()\\\">Imprimir / Guardar PDF</button><div><h1>Partida: ${Z(y.desc||\"\")}</h1><div style=\\\"font-size:12px;opacity:.8\\\">${Z(y.cat||\"\")} · ${Z(y.unidad||\"\")}</div></div></div><div class=\\\"wrap\\\">${W||\"<div style=\\\"opacity:.8\\\">Sin APUs vinculadas.</div>\"}</div></body></html>`;var win=window.open(\"\",\"_blank\");win.document.open();win.document.write(html);win.document.close()}catch(P){r(\"No se pudo abrir detalle\")}},children:"Ver APUs"'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: detalle de APUs por partida (${changed} cambios).`);

