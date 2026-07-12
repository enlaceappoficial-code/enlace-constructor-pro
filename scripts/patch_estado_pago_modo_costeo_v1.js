const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const fromRow =
  'var v=(parseFloat(B.precio)||0)*(parseFloat(B.cant)||0),x=parseFloat(n[w])||0,f=Math.round(v*x/100);';
const toRow =
  'var cant=parseFloat(B.cant)||0,precio=parseFloat(B.precio)||0,tot=cant*precio,tipo=B._tipoCosto||(B._cid?\"auto\":\"mo\"),mat=0,noMat=0;if(tipo===\"mat\")mat=tot;else if(tipo===\"mo\")noMat=tot;else{var mu=parseFloat(B._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*cant)),noMat=Math.max(0,tot-mat)}var v=i.modoCosteo===\"mo\"?noMat:tot;if(i.modoCosteo===\"mo\"&&v<=0)return\"\";var x=parseFloat(n[w])||0,f=Math.round(v*x/100);';

const fromTot =
  "F=h.reduce((B,w)=>B+(parseFloat(w.precio)||0)*(parseFloat(w.cant)||0),0),";
const toTot =
  "F=h.reduce((B,w)=>{var cant=parseFloat(w.cant)||0,precio=parseFloat(w.precio)||0,tot=cant*precio,tipo=w._tipoCosto||(w._cid?\"auto\":\"mo\"),mat=0,noMat=0;if(tipo===\"mat\")mat=tot;else if(tipo===\"mo\")noMat=tot;else{var mu=parseFloat(w._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*cant)),noMat=Math.max(0,tot-mat)}var v=i.modoCosteo===\"mo\"?noMat:tot;return i.modoCosteo===\"mo\"&&v<=0?B:B+v},0),";

if (!s.includes(fromRow)) throw new Error("No se encontró el cálculo de fila en Estado de Pago (needle exacto).");
if (!s.includes(fromTot)) throw new Error("No se encontró el total de obra en Estado de Pago (needle exacto).");

s = s.replace(fromRow, toRow);
s = s.replace(fromTot, toTot);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_estado_pago_modo_costeo_v1");

