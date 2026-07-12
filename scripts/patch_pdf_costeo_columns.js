const fs = require("fs");

const filePath =
  "d:/Enlace Mundo/enlace constructor/Proyecto Tauri/enlace-tauri/src/assets/index.js";

const src = fs.readFileSync(filePath, "utf8");

const startNeedle = "B=(M,q,J,re,Q)=>{var G=M;return o.setFillColor";
const start = src.indexOf(startNeedle);
if (start < 0) {
  throw new Error("No se encontró el inicio de la función B (drawItems) en index.js");
}

const endNeedle = "},w=(M,q)=>{";
const end = src.indexOf(endNeedle, start);
if (end < 0) {
  throw new Error("No se encontró el fin de la función B (drawItems) en index.js");
}

const end2 = end + 2;
const before = src.slice(0, start);
const after = src.slice(end2);

const replacement =
  'B=(M,q,J,re,Q)=>{var G=M,ie=t.modoCosteo||"completo",oe=ie==="separado"?[{l:"N°",x:16,r:!1},{l:"Descripción",x:25,r:!1},{l:"Cant.",x:118,r:!0},{l:"Unidad",x:136,r:!0},{l:"MO",x:160,r:!0},{l:"MAT",x:178,r:!0},{l:"Total",x:194,r:!0}]:[{l:"N°",x:16,r:!1},{l:"Descripción",x:25,r:!1},{l:"Cant.",x:126,r:!0},{l:"Unidad",x:147,r:!0},{l:"P.Unit.",x:170,r:!0},{l:"Total",x:194,r:!0}],ce=ie==="separado"?118:126,te=ie==="separado"?136:147,fe=ie==="separado"?46:52;return o.setFillColor(...q),o.rect(14,G,182,8,"F"),oe.forEach(ve=>{o.setFont("helvetica","bold"),o.setFontSize(7.5),o.setTextColor(...J),o.text(ve.l,ve.x,G+5.3,{align:ve.r?"right":"left"})}),G+=8,t.items.filter(ve=>ve.desc).forEach((ve,xr)=>{var Fr=8,gr=xr%2===0?re:Q;o.setFillColor(...gr),o.rect(14,G,182,Fr,"F"),o.setDrawColor(220,225,235),o.setLineWidth(.1),o.line(14,G+Fr,196,G+Fr),o.setFont("helvetica","normal"),o.setFontSize(8.5),o.setTextColor(50,60,75),o.text(""+(xr+1),16,G+5.3),o.text((ve.desc||"").slice(0,fe),25,G+5.3),o.text(""+ve.cant,ce,G+5.3,{align:"right"}),o.text(ve.unidad||"",te,G+5.3,{align:"right"});var hr=parseFloat(ve.cant)||0,jr=parseFloat(ve.precio)||0,Pr=hr*jr,Or=ve._tipoCosto||(ve._cid?"auto":"mo"),Ar=0,Sr=0;if(Or==="mat")Ar=Pr;else if(Or==="mo")Sr=Pr;else{var wr=parseFloat(ve._apuMatUnit)||0;Ar=Math.max(0,Math.min(Pr,wr*hr)),Sr=Math.max(0,Pr-Ar)}if(ie==="mo"){var Br=hr?Sr/hr:0;o.text(s(Br),170,G+5.3,{align:"right"}),o.setFont("helvetica","bold"),o.setTextColor(...F),o.text(s(Sr),194,G+5.3,{align:"right"})}else ie==="separado"?(o.text(s(Sr),160,G+5.3,{align:"right"}),o.text(s(Ar),178,G+5.3,{align:"right"}),o.setFont("helvetica","bold"),o.setTextColor(...F),o.text(s(Pr),194,G+5.3,{align:"right"})):(o.text(s(jr),170,G+5.3,{align:"right"}),o.setFont("helvetica","bold"),o.setTextColor(...F),o.text(s(Pr),194,G+5.3,{align:"right"})),G+=Fr,G>262&&(o.addPage(),G=18)}),G},';

if (!src.includes(replacement.slice(0, 120))) {
  const outPath = filePath + ".bak_pdf_drawitems";
  fs.copyFileSync(filePath, outPath);
  fs.writeFileSync(filePath, before + replacement + after, "utf8");
  console.log("OK: parche aplicado. Backup:", outPath);
} else {
  console.log("OK: el parche ya estaba aplicado");
}

