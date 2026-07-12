const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  "}),Object.values(s).sort((m,p)=>m.mat.cat.localeCompare(p.mat.cat)||m.mat.nombre.localeCompare(p.mat.nombre))}";

const to =
  "});var m=Object.values(s).sort((p,C)=>p.mat.cat.localeCompare(C.mat.cat)||p.mat.nombre.localeCompare(C.mat.nombre));try{var o=JSON.parse(localStorage.getItem(\"cubicaciones_guardadas\")||\"[]\"),b=o.find(p=>p.presupuestoId===t.id);if(b&&b.materiales&&b.materiales.length){var h=new Map;b.materiales.forEach(p=>{p&&p.id!=null&&h.set(\"id:\"+p.id,p),h.set(\"n:\"+String(p.nombre||\"\").trim().toLowerCase(),p)});var j=new Set;m=m.map(p=>{var C=h.get(\"id:\"+p.mat.id)||h.get(\"n:\"+String(p.mat.nombre||\"\").trim().toLowerCase());if(!C)return null;j.add(C);var g=parseFloat(C.cantidad)||0,z=parseFloat(p.totalCant)||0;if(g>0&&z>0&&p.aparece&&p.aparece.length){var B=g/z;p.aparece=p.aparece.map(w=>({desc:w.desc,cant:(parseFloat(w.cant)||0)*B,unidadAPU:w.unidadAPU}));}p.totalCant=g;return p.totalCant>0?p:null}).filter(Boolean),b.materiales.forEach(p=>{if(j.has(p))return;var C=n&&n.find(g=>g.id===p.id)||n&&n.find(g=>String(g.nombre||\"\").trim().toLowerCase()===String(p.nombre||\"\").trim().toLowerCase()),g=C||{id:p.id||(\"ex_\"+Math.random()),nombre:p.nombre||\"Extra\",unidad:p.unidad||\"unidad\",cat:\"Extra\",precio:0,uc:null};m.push({mat:g,totalCant:parseFloat(p.cantidad)||0,aparece:[{desc:\"Extra (Cubicación)\",cant:parseFloat(p.cantidad)||0,unidadAPU:\"\"}]})}),m=m.sort((p,C)=>p.mat.cat.localeCompare(C.mat.cat)||p.mat.nombre.localeCompare(C.mat.nombre))}}catch(p){}return m}";

if (!s.includes(from)) throw new Error("No se encontró el retorno esperado de bg() para aplicar sync con cubicación.");
s = s.replace(from, to);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_lista_compras_sync_cubicacion_v1");

