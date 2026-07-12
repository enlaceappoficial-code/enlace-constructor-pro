const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const fgStartNeedle = "function fg({budget:t,client:i,cfg:r,onClose:n}){";
const fgStart = s.indexOf(fgStartNeedle);
if (fgStart === -1) throw new Error("No se encontró el inicio de la función fg (Cotización Formal).");

const fgEndNeedle = "}function gg(";
const fgEnd = s.indexOf(fgEndNeedle, fgStart);
if (fgEnd === -1) throw new Error("No se encontró el final de fg (needle: }function gg().");

let chunk = s.slice(fgStart, fgEnd + 1);
const chunkBefore = chunk;

chunk = chunk.replace(
  "g=F.reduce((x,f)=>x+(parseFloat(f.cant)||0)*(parseFloat(f.precio)||0),0),z=Math.round(g*.19),B=g+z,",
  'tt=Ee(F,r,t.descuento,t.modoCosteo||"completo")||{},g=Number(tt.sub)||0,z=Number(tt.iva)||0,B=Number(tt.total)||0,'
);

chunk = chunk.replace(
  'I=Z=>Z?new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(Z):"$0",',
  'I=Z=>{var mo=r&&r.moneda||{},lc=mo.locale||"es-CL",cc=mo.codigo||mo.currency||"CLP",dc=mo.decimales||0,sy=mo.simbolo||"$";try{return new Intl.NumberFormat(lc,{style:"currency",currency:cc,maximumFractionDigits:dc,minimumFractionDigits:dc}).format(Number(Z)||0)}catch(q){return sy+Math.round(Number(Z)||0).toLocaleString("es-CL")}},'
);

chunk = chunk.replace(
  ',S+=22,f.setFillColor(...R),f.rect(A,S,P,8,"F"),',
  ',S+=22;var ie=t.modoCosteo||"completo",G=ie==="mo"?F.filter(Z=>{var L=parseFloat(Z.cant)||0,E=parseFloat(Z.precio)||0,tot=L*E,tipo=Z._tipoCosto||(Z._cid?"auto":"mo"),mat=0,noMat=0;if(tipo==="mat")mat=tot;else if(tipo==="mo")noMat=tot;else{var mu=parseFloat(Z._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*L));noMat=Math.max(0,tot-mat)}return noMat>0}):F;f.setFillColor(...R),f.rect(A,S,P,8,"F"),'
);

chunk = chunk.replace(
  '[{l:"N┬░",x:A+2,w:10,r:!1},{l:"Descripci├│n",x:A+12,w:90,r:!1},{l:"Cant.",x:A+122,w:16,r:!0},{l:"Unidad",x:A+142,w:18,r:!0},{l:"P.Unit.Neto",x:A+162,w:24,r:!0},{l:"Total Neto",x:A+P-1,w:24,r:!0}]',
  'ie==="separado"?[{l:"N°",x:A+2,w:10,r:!1},{l:"Descripción",x:A+12,w:90,r:!1},{l:"Cant.",x:A+110,w:16,r:!0},{l:"Unidad",x:A+128,w:18,r:!0},{l:"MO",x:A+150,w:20,r:!0},{l:"MAT",x:A+170,w:20,r:!0},{l:"Total",x:A+P-1,w:24,r:!0}]:ie==="mo"?[{l:"N°",x:A+2,w:10,r:!1},{l:"Descripción",x:A+12,w:90,r:!1},{l:"Cant.",x:A+122,w:16,r:!0},{l:"Unidad",x:A+142,w:18,r:!0},{l:"MO Unit.",x:A+168,w:24,r:!0},{l:"Total MO",x:A+P-1,w:24,r:!0}]:[{l:"N°",x:A+2,w:10,r:!1},{l:"Descripción",x:A+12,w:90,r:!1},{l:"Cant.",x:A+122,w:16,r:!0},{l:"Unidad",x:A+142,w:18,r:!0},{l:"P.Unit.Neto",x:A+162,w:24,r:!0},{l:"Total Neto",x:A+P-1,w:24,r:!0}]'
);

chunk = chunk.replace("S+=8,F.forEach((Z,X)=>{", "S+=8,G.forEach((Z,X)=>{");

chunk = chunk.replace(
  "var L=parseFloat(Z.cant)||0,E=parseFloat(Z.precio)||0,M=Math.round(L*E);",
  'var L=parseFloat(Z.cant)||0,E=parseFloat(Z.precio)||0,tot=L*E,tipo=Z._tipoCosto||(Z._cid?"auto":"mo"),mat=0,noMat=0;if(tipo==="mat")mat=tot;else if(tipo==="mo")noMat=tot;else{var mu=parseFloat(Z._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*L));noMat=Math.max(0,tot-mat)}var M=Math.round(tot);'
);

chunk = chunk.replace(
  'f.text(""+L,A+122,S+5.3,{align:"right"}),f.text(Z.unidad||"",A+142,S+5.3,{align:"right"}),',
  'f.text(""+L,(ie==="separado"?A+110:A+122),S+5.3,{align:"right"}),f.text(Z.unidad||"",(ie==="separado"?A+128:A+142),S+5.3,{align:"right"}),'
);

chunk = chunk.replace(
  'f.text(I(E),A+162,S+5.3,{align:"right"}),f.setFont("helvetica","bold"),f.setTextColor(...k),f.text(I(M),A+P-1,S+5.3,{align:"right"})',
  'ie==="separado"?(f.text(I(Math.round(noMat)),A+150,S+5.3,{align:"right"}),f.text(I(Math.round(mat)),A+170,S+5.3,{align:"right"}),f.setFont("helvetica","bold"),f.setTextColor(...k),f.text(I(M),A+P-1,S+5.3,{align:"right"})):ie==="mo"?(f.text(I(L?Math.round(noMat/L):0),A+168,S+5.3,{align:"right"}),f.setFont("helvetica","bold"),f.setTextColor(...k),f.text(I(Math.round(noMat)),A+P-1,S+5.3,{align:"right"})):(f.text(I(E),A+162,S+5.3,{align:"right"}),f.setFont("helvetica","bold"),f.setTextColor(...k),f.text(I(M),A+P-1,S+5.3,{align:"right"}))'
);

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios dentro de fg (chunk igual).");

s = s.slice(0, fgStart) + chunk + s.slice(fgEnd + 1);

if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cotizacion_formal_modo_costeo_v2");

