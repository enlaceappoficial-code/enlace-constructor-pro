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

function removeBetween(startNeedle, endNeedle) {
  const a = s.indexOf(startNeedle);
  if (a === -1) return false;
  const b = s.indexOf(endNeedle, a + startNeedle.length);
  if (b === -1) return false;
  s = s.slice(0, a) + s.slice(b + endNeedle.length);
  changed++;
  return true;
}

// 1) Sacar el botón "Ver APUs" (ahora el acceso queda en la columna APUs)
removeBetween(
  ',e.jsx("button",{style:c.btn("s"),onClick:()=>{try{var A=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus")',
  'children:"Ver APUs"})'
);

// 2) Hacer que la columna APUs sea un acceso directo visible (link) que abre la APU (o selector) en una pestaña nueva
replaceOnce(
  'e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:12,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}),title:y.__apuTitle||"",children:y.__apuShort||"ÔÇö"})',
  'e.jsx("td",{style:u(d({},c.td),{color:y.__apuTitle?a.accent:a.muted,fontSize:12,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:y.__apuTitle?"underline":"none",cursor:y.__apuTitle?"pointer":"default"}),title:y.__apuTitle||"",onClick:()=>{try{var A=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus")||"[]")||[],S=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales")||"[]")||[],O={};S.forEach(P=>{O[parseInt(P.id)]=P});var U=A.filter(P=>parseInt(P&&P.catalogId)===parseInt(y.id));if(!U.length){r("Sin APU");return}var Z=(x)=>String(x||"").replace(/[&<>"]/g,m=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",\"\\\"\":\"&quot;\"}[m]));var pickName=null;if(U.length>1){var list=U.map((P,ii)=>(ii+1)+") "+String(P.nombre||"APU")).join("\\n");var ans=prompt("APUs de esta partida:\\n\\n"+list+"\\n\\nEscribe número para abrir una APU (o deja vacío para ver todas):","");if(ans&&String(ans).trim()!==""){var n=parseInt(String(ans).trim());if(isFinite(n)&&n>=1&&n<=U.length)pickName=String(U[n-1].nombre||"").trim();}}if(pickName){U=U.filter(P=>String(P.nombre||"").trim()===pickName)}var W=U.map(P=>{var Y=Array.isArray(P.materiales)?P.materiales:[];var L=Y.map((E,ii)=>{var M=O[parseInt(E.materialId)]||{};var q=Number(E.cantidad)||0;var pr=Number(M.precio)||0;var st=q*pr;return `<tr><td>${ii+1}</td><td>${Z(M.nombre||(\"Material \"+E.materialId))}</td><td>${q}</td><td>${Z(M.unidad||\"unidad\")}</td><td>${ne(pr)}</td><td>${ne(Math.round(st))}</td></tr>`}).join(\"\");return `<div style=\\\"border:1px solid #243a58;border-radius:10px;overflow:hidden;margin:12px 0\\\"><div style=\\\"background:#1a3060;color:#fff;padding:10px 12px;font-weight:800\\\">${Z(P.nombre||\"APU\")}</div><div style=\\\"padding:10px 12px;color:#d6e1f0;background:#0b1220\\\"><div style=\\\"font-size:12px;opacity:.85\\\">Unidad: ${Z(P.unidad||\"unidad\")} · Categoría: ${Z(P.categoria||P.tipo||\"—\")} · Rendimiento: ${P.rendimiento||\"—\"}</div></div><div style=\\\"padding:10px 12px;background:#0f172a\\\"><table style=\\\"width:100%;border-collapse:collapse\\\"><thead><tr style=\\\"background:#111827\\\"><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">#</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Material</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Cant.</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Unidad</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Precio</th><th style=\\\"padding:8px;border-bottom:1px solid #243a58;text-align:left\\\">Subtotal</th></tr></thead><tbody>${L||\"<tr><td colspan=\\\"6\\\" style=\\\"padding:10px;color:#93a4b8\\\">Sin materiales</td></tr>\"}</tbody></table></div></div>`}).join(\"\");var html=`<html><head><title>APU</title><meta charset=\\\"utf-8\\\" /><style>body{margin:0;font-family:ui-sans-serif,system-ui,Segoe UI,Arial;background:#0b1220;color:#e5e7eb}h1{margin:0;font-size:16px} .top{position:sticky;top:0;background:#0b1220;border-bottom:1px solid #243a58;padding:12px 14px;display:flex;gap:10px;align-items:center} .btn{padding:8px 12px;border-radius:8px;border:1px solid #243a58;background:#111827;color:#e5e7eb;cursor:pointer} .wrap{padding:14px}</style></head><body><div class=\\\"top\\\"><button class=\\\"btn\\\" onclick=\\\"window.print()\\\">Imprimir / Guardar PDF</button><div><h1>Partida: ${Z(y.desc||\"\")}</h1><div style=\\\"font-size:12px;opacity:.8\\\">${Z(y.cat||\"\")} · ${Z(y.unidad||\"\")}</div></div></div><div class=\\\"wrap\\\">${W}</div></body></html>`;var win=window.open(\"\",\"_blank\");win.document.open();win.document.write(html);win.document.close()}catch(P){r("No se pudo abrir detalle")}},children:y.__apuShort||"ÔÇö"})'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: acceso directo APUs (${changed} cambios).`);

