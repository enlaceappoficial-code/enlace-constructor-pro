const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function replaceOnce(needle, replacement, label) {
  const at = s.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró: ${label}`);
  const at2 = s.indexOf(needle, at + needle.length);
  if (at2 !== -1) throw new Error(`No-único: ${label}`);
  s = s.slice(0, at) + replacement + s.slice(at + needle.length);
}

function replaceRegexOnce(re, replacement, label) {
  const m = s.match(re);
  if (!m) throw new Error(`No se encontró: ${label}`);
  const m2 = s.slice(m.index + 1).match(re);
  if (m2) throw new Error(`No-único: ${label}`);
  s = s.replace(re, replacement);
}

function replaceRegexFirst(re, replacement, label) {
  const m = s.match(re);
  if (!m) throw new Error(`No se encontró: ${label}`);
  s = s.replace(re, replacement);
}

replaceOnce(
  'function ts(t,i,r){const{total:n,sub:l,iva:o,anticipo:s}=Ee(t.items,r,t.descuento,t.modoCosteo);',
  'function ts(t,i,r){const{total:n,sub:l,iva:o,anticipo:s,matSub:ms,noMatSub:nms}=Ee(t.items,r,t.descuento,t.modoCosteo);var modo=t.modoCosteo||"completo",ivaPct=r&&r.moneda&&r.moneda.impuesto!==void 0?r.moneda.impuesto:Math.round(((r&&r.iva)||.19)*100),subLabel=modo==="mo"?"Subtotal Mano de Obra":"Subtotal Neto",extraTot=modo==="separado"?\'<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eee;font-size:12px"><span>Subtotal MO</span><span>$\'+nms.toLocaleString("es-CL")+\'</span></div><div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eee;font-size:12px"><span>Subtotal MAT</span><span>$\'+ms.toLocaleString("es-CL")+\'</span></div>\':"";',
  "desestructuración Ee + modo/ivaPct"
);

replaceRegexOnce(
  /v=i\.nombre\|\|"Cliente",x=\(t\.items\|\|\[\]\)\.map\(function\(I,D\)\{var k=\(parseFloat\(I\.cant\)\|\|0\)\*\(parseFloat\(I\.precio\)\|\|0\);return'<tr>[\s\S]*?\}\)\.join\(\"\"\)/,
  'v=i.nombre||"Cliente",x=(()=>{var idx=0;return(t.items||[]).reduce(function(acc,I){var cant=parseFloat(I.cant)||0,precio=parseFloat(I.precio)||0,tot=cant*precio,tipo=I._tipoCosto||(I._cid?"auto":"mo"),mat=0,noMat=0;if(tipo==="mat")mat=tot;else if(tipo==="mo")noMat=tot;else{var mu=parseFloat(I._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*cant)),noMat=Math.max(0,tot-mat)}if(modo==="mo"&&noMat<=0)return acc;idx++;var qty=(I.cant||0)+" "+(I.unidad||"");if(modo==="separado")return acc+\'<tr><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;color:#999;font-size:12px">\'+idx+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px">\'+(I.desc||"")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px">\'+qty+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\' + Math.round(noMat).toLocaleString("es-CL") + \'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\' + Math.round(mat).toLocaleString("es-CL") + \'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:12px">$\' + Math.round(tot).toLocaleString("es-CL") + \'</td></tr>\';if(modo==="mo"){var moUnit=cant?noMat/cant:0;return acc+\'<tr><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;color:#999;font-size:12px">\'+idx+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px">\'+(I.desc||"")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px">\'+qty+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\' + Math.round(moUnit).toLocaleString("es-CL") + \'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:12px">$\' + Math.round(noMat).toLocaleString("es-CL") + \'</td></tr>\';}return acc+\'<tr><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;color:#999;font-size:12px">\'+idx+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px">\'+(I.desc||"")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px">\'+qty+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\' + Math.round(precio).toLocaleString("es-CL") + \'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:12px">$\' + Math.round(tot).toLocaleString("es-CL") + \'</td></tr>\';},"")})()',
  "tabla items contrato por modo"
);

replaceRegexFirst(
  /(Partes del Contrato[\s\S]*?Proyecto: <\/strong>'\+\(t\.descripcion\|\|""\)\+'<\/p>)<table style=[\s\S]*?margin-bottom:16px[\s\S]*?<thead><tr>[\s\S]*?P\. Unit\.[\s\S]*?<\/tr><\/thead><tbody>'\+x\+'<\/tbody><\/table>/,
  '$1<table style=\\"margin-bottom:16px\\"><thead><tr>\'+(modo==="separado"?\'<th style=\\"width:36px\\">#</th><th>Descripci├│n</th><th style=\\"width:100px;text-align:center\\">Cantidad</th><th style=\\"width:110px;text-align:right\\">MO</th><th style=\\"width:110px;text-align:right\\">MAT</th><th style=\\"width:110px;text-align:right\\">Total</th>\':modo==="mo"?\'<th style=\\"width:36px\\">#</th><th>Descripci├│n</th><th style=\\"width:100px;text-align:center\\">Cantidad</th><th style=\\"width:110px;text-align:right\\">MO Unit.</th><th style=\\"width:110px;text-align:right\\">Total</th>\':\'<th style=\\"width:36px\\">#</th><th>Descripci├│n</th><th style=\\"width:100px;text-align:center\\">Cantidad</th><th style=\\"width:110px;text-align:right\\">P. Unit.</th><th style=\\"width:110px;text-align:right\\">Total</th>\')+\'</tr></thead><tbody>\'+x+\'</tbody></table>',
  "thead contrato por modo"
);

replaceRegexFirst(
  /(<title>Contrato de Obra[\s\S]*?<div style=[\s\S]*?justify-content:flex-end[\s\S]*?min-width:280px[\s\S]*?)<div style=[\s\S]*?<span>Subtotal Neto<\/span><span>\$'\+l\.toLocaleString\([\s\S]*?\)\+'<\/span><\/div><div style=[\s\S]*?<span>IVA \(19%\)<\/span><span>\$'\+o\.toLocaleString\([\s\S]*?\)\+'<\/span><\/div>(<div style=[\s\S]*?padding:10px 14px[\s\S]*?)/,
  '$1<div style=\\"display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eee;font-size:12px\\"><span>\'+subLabel+\'</span><span>$\'+l.toLocaleString(\\"es-CL\\")+\'</span></div>\'+extraTot+\'<div style=\\"display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eee;font-size:12px\\"><span>IVA (\'+ivaPct+\'%)</span><span>$\'+o.toLocaleString(\\"es-CL\\")+\'</span></div>$2',
  "resumen contrato por modo"
);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_contrato_modo_costeo");
