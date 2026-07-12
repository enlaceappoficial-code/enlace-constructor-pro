const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const startNeedle = "function Tp(t,i,r){";
const start = s.indexOf(startNeedle);
if (start === -1) throw new Error("No se encontró la función Tp (Resumen de Dotación).");

const endNeedle = "return B}function Ff(";
const end = s.indexOf(endNeedle, start);
if (end === -1) throw new Error("No se encontró el final de Tp (needle: return B}function Ff().");

let chunk = s.slice(start, end + "return B}".length);
const chunkBefore = chunk;

// 1) Recalcular base MO + GG + Util de forma coherente con configuración (pctGG / pctUtil).
const oldHeader =
  'var modo=t.modoCosteo||"completo",tot=Ee(p,r,t.descuento,modo)||{},moBudget=modo==="mo"?Number(tot.sub)||0:Number(tot.noMatSub||tot.sub)||0,avgJ=m.reduce((w,v)=>w+(parseFloat(v.jornal)||0),0)/Math.max(1,m.length),baseTotal=p.reduce((w,v)=>{var rr=parseFloat(v._rendimiento)||0,dd=parseFloat(v._dotacion)||1,cc=parseFloat(v.cant)||0,hh=rr>0?Math.round(cc/rr*dd*8*10)/10:0;return hh?w+(hh/8)*avgJ:w},0),scale=baseTotal>0&&moBudget>0?moBudget/baseTotal:1;';

const newHeader =
  'var modo=t.modoCosteo||"completo",tot=Ee(p,r,t.descuento,modo)||{},moTotal=modo==="mo"?Number(tot.sub)||0:Number(tot.noMatSub||tot.sub)||0,ggPct=parseFloat(r&&r.pctGG)||0,utilPct=parseFloat(r&&(r.pctUtil||r.pctUtilidad))||0,den=(1+ggPct/100)*(1+utilPct/100),moBase=den>0?moTotal/den:moTotal,avgJ=m.reduce((w,v)=>w+(parseFloat(v.jornal)||0),0)/Math.max(1,m.length),baseTotal=p.reduce((w,v)=>{var rr=parseFloat(v._rendimiento)||0,dd=parseFloat(v._dotacion)||1,cc=parseFloat(v.cant)||0,hh=rr>0?Math.round(cc/rr*dd*8*10)/10:0;return hh?w+(hh/8)*avgJ:w},0),scale=baseTotal>0&&moBase>0?moBase/baseTotal:1;';

if (!chunk.includes(oldHeader)) throw new Error("No se encontró el header actual (moBudget/baseTotal) en Tp.");
chunk = chunk.replace(oldHeader, newHeader);

// 2) Asegurar que la suma por rol calce exactamente con MO base (no con MO total).
const oldAdjustNeedle = "if(moBudget>0){var diff=Math.round(moBudget)-z;";
const newAdjustNeedle =
  "var moBaseR=Math.round(moBase)||0,moTotalR=Math.round(moTotal)||0,ggR=Math.round(moBaseR*(ggPct/100)),utilR=Math.round((moBaseR+ggR)*(utilPct/100));if(moTotalR>0){var _d=moTotalR-(moBaseR+ggR+utilR);_d&&(utilR+=_d)}if(moBaseR>0){var diff=moBaseR-z;";

if (!chunk.includes(oldAdjustNeedle)) throw new Error("No se encontró el ajuste actual (moBudget vs z) en Tp.");
chunk = chunk.replace(oldAdjustNeedle, newAdjustNeedle);

// 3) Cambiar el cuadro final para mostrar MO + GG + Util y total.
const oldBox =
  '<div style="margin-top:20px;padding:14px 18px;background:#f0f4ff;border-radius:8px;display:inline-block"><span style="font-size:13px;color:#1a3060">Total estimado pago mano de obra: </span><strong style="font-size:18px;color:\'+n+\'">\'+C(z)+\'</strong></div>';
const newBox =
  '<div style="margin-top:20px;padding:14px 18px;background:#f0f4ff;border-radius:8px;display:inline-block">'+
  '<div style="font-size:13px;color:#1a3060">MO (jornales): <strong style="font-size:16px;color:'+ "'+n+'" +'">'+ "'+C(z)+'" +'</strong></div>'+
  '<div style="font-size:12px;color:#475569;margin-top:6px">GG ('+ "'+Math.round(ggPct)+'" +'%) : <strong>'+ "'+C(ggR)+'" +'</strong> &nbsp;·&nbsp; Utilidad ('+ "'+Math.round(utilPct)+'" +'%) : <strong>'+ "'+C(utilR)+'" +'</strong></div>'+
  '<div style="font-size:13px;color:#1a3060;margin-top:8px">Total MO + GG + Util: <strong style="font-size:18px;color:'+ "'+n+'" +'">'+ "'+C(z+ggR+utilR)+'" +'</strong></div>'+
  "</div>";

if (!chunk.includes(oldBox)) throw new Error("No se encontró el cuadro de total (Total estimado pago mano de obra) en Tp.");
chunk = chunk.replace(oldBox, newBox);

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios dentro de Tp (chunk igual).");

s = s.slice(0, start) + chunk + s.slice(end + "return B}".length);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_resumen_dotacion_gg_util_v4");

