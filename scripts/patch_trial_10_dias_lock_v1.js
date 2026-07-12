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

const FIND =
  'fe=l.accentColor||"#f5a020",ve=Gt(l.licenciaCodigo,l.rut),be=l.licenciaCodigo&&ve.valid&&ve.expired,Ce=ve.valid&&!ve.expired&&l.version||"starter",Ie=l.licenciaCodigo&&ve.reason==="rut_mismatch"';

const REPLACE =
  'fe=l.accentColor||"#f5a020",pe=(()=>{try{const H="enlace_constructor_pro_v1_trial_start_v1",_=localStorage.getItem(H);let ue=_;if(!ue){ue=String(Date.now());localStorage.setItem(H,ue),setTimeout(()=>{try{localStorage.getItem("enlace_constructor_pro_v1_trial_notice_v1")||localStorage.setItem("enlace_constructor_pro_v1_trial_notice_v1","1")||Q("🎁 Prueba gratuita activada: 10 días. Luego podrás activar con código (Red Enlace o compra).")}catch{}},0)}const xe=parseInt(ue,10);if(!isNaN(xe)){const se=xe+864e5*10,me=se-Date.now(),be=me>0,Ce=Math.max(0,Math.ceil(me/864e5));return{active:be,expired:!be,dias:Ce,endStr:new Date(se).toISOString().split("T")[0]}}}catch(H){}return{active:!1,expired:!1,dias:0,endStr:""}})(),ve=Gt(l.licenciaCodigo,l.rut),be=(pe.expired&&!(l.licenciaCodigo&&ve.valid&&!ve.expired))||(l.licenciaCodigo&&ve.valid&&ve.expired),Ce=l.licenciaCodigo&&ve.valid&&!ve.expired&&l.version||"starter",Ie=l.licenciaCodigo&&ve.reason==="rut_mismatch"';

replaceOnce(FIND, REPLACE);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: trial 10 días + bloqueo (${changed} cambios).`);
