const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceRegex(label, re, replacement) {
  const before = s;
  s = s.replace(re, replacement);
  if (s !== before) changed++;
}

// 1) Tipos extra en el select (se inserta después de "seguimiento")
replaceRegex(
  "add-event-types",
  /e\.jsx\("option",\{value:"seguimiento",children:[^}]*\}\)/,
  (m) =>
    m +
    ',e.jsx("option",{value:"reunion",children:"Reunión"}),e.jsx("option",{value:"visita",children:"Visita a terreno"}),e.jsx("option",{value:"presupuesto_nuevo",children:"Visita presupuesto nuevo"}),e.jsx("option",{value:"inspeccion",children:"Inspección / QA"}),e.jsx("option",{value:"llamada",children:"Llamada"}),e.jsx("option",{value:"pago",children:"Pago / Cobro"}),e.jsx("option",{value:"entrega",children:"Entrega / Hito"}),e.jsx("option",{value:"otros",children:"Otros"})'
);

// 2) Al cambiar tipo, limpiar vínculo anterior
replaceRegex(
  "reset-link-on-type-change",
  /onChange:([A-Za-z_$][\w$]*)=>j\(u\(d\(\{\},h\),\{type:\1\.target\.value\}\)\)\)/,
  'onChange:$1=>{var w=$1.target.value;j(u(d({},h),{type:w,linkedId:"",linkedType:""}))}'
);

// 3) Vínculo a cliente también para reunión/visita/presupuesto nuevo/llamada
replaceRegex(
  "client-link-more-types",
  /h\.type==="seguimiento"&&/g,
  '(h.type==="seguimiento"||h.type==="reunion"||h.type==="visita"||h.type==="presupuesto_nuevo"||h.type==="llamada")&&'
);

// 4) Colores/etiquetas en Detalles del Evento (ag)
replaceRegex(
  "event-details-maps",
  /b=\{obra:[\s\S]*?\},h=\{obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6"\}/,
  'b={obra:"Obra",licitacion:"Licitación",seguimiento:"Seguimiento",tarea:"Tarea libre",reunion:"Reunión",visita:"Visita",presupuesto_nuevo:"Presupuesto nuevo",inspeccion:"Inspección / QA",llamada:"Llamada",pago:"Pago / Cobro",entrega:"Entrega / Hito",otros:"Otros"},h={obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6",reunion:"#06b6d4",visita:"#ec4899",presupuesto_nuevo:"#f59e0b",inspeccion:"#ef4444",llamada:"#a855f7",pago:"#22c55e",entrega:"#6366f1",otros:"#6b7280"}'
);

// 5) Color por tipo en eventos manuales
replaceRegex(
  "manual-event-color",
  /U=X=>\{var W=u\(d\(\{id:"manual_"\+Date\.now\(\)\},X\),\{date:X\.date\.toISOString\(\)\.split\("T"\)\[0\]\}\);m\(T=>\[\.\.\.T,W\]\),h\(!1\)\}/,
  'U=X=>{var _c={obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6",reunion:"#06b6d4",visita:"#ec4899",presupuesto_nuevo:"#f59e0b",inspeccion:"#ef4444",llamada:"#a855f7",pago:"#22c55e",entrega:"#6366f1",otros:"#6b7280"},W=u(d({id:"manual_"+Date.now()},X),{date:X.date.toISOString().split("T")[0],color:X.color||_c[X.type]||"#3b82f6"});m(T=>[...T,W]),h(!1)}'
);

// 6) Barra rápida de notas arriba del calendario (agregar justo después de la leyenda)
replaceRegex(
  "insert-notes-bar",
  /(\]\.map\(X=>e\.jsxs\("div",\{style:\{display:"flex",alignItems:"center",gap:6,fontSize:12\},children:\[e\.jsx\("div",\{style:\{width:12,height:12,borderRadius:2,background:X\.color\}\}\),e\.jsx\("span",\{children:X\.label\}\)\]\},X\.type\)\)\}\)\}\))/,
  '$1,e.jsxs("div",{style:{marginLeft:"auto",display:"flex",gap:8,alignItems:"center",background:a.sb,border:`1px solid ${a.border}`,borderRadius:10,padding:"8px 10px"},children:[e.jsx("span",{style:{fontSize:12,color:a.muted,fontWeight:700},children:"Notas"}),e.jsx("input",{id:"ecp_note_date",type:"date",defaultValue:new Date().toISOString().split("T")[0],style:{padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12}}),e.jsx("input",{id:"ecp_note_text",type:"text",placeholder:"Agregar nota…",style:{width:220,padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12}}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"6px 10px",fontSize:12}),onClick:()=>{var X=document.getElementById("ecp_note_date"),W=document.getElementById("ecp_note_text");X&&W&&(R(X.value,W.value),W.value="")},children:"+"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>{var X=document.getElementById("ecp_note_date");if(!X||!X.value)return;S(new Date(X.value+"T00:00:00"))},children:"Ver"})]})'
);

if (changed === 0) {
  console.log("OK: no hubo cambios (probablemente ya estaba aplicado o cambió el bundle).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: mejoras Agenda aplicadas (${changed} cambios).`);

