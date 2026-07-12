const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(label, needle, replacement) {
  if (s.includes(replacement)) return;
  const idx = s.indexOf(needle);
  if (idx === -1) {
    console.error(`ERROR: no se encontró el patrón (${label}).`);
    process.exit(2);
  }
  s = s.replace(needle, replacement);
  changed++;
}

// 1) Más tipos de evento en el modal Crear/Editar evento + reset de vínculo al cambiar tipo
replaceOnce(
  "event-type-onchange-reset",
  'onChange:B=>j(u(d({},h),{type:B.target.value})),style:c.inp,children:[e.jsx("option",{value:"tarea",children:"Ô£à Tarea libre"}),e.jsx("option",{value:"obra",children:"­ƒÅù´©Å Obra (vinculado a presupuesto)"}),e.jsx("option",{value:"licitacion",children:"­ƒôï Licitaci├│n (vinculado a licitaci├│n)"}),e.jsx("option",{value:"seguimiento",children:"­ƒô× Seguimiento cliente"})]})]}),e.jsxs("div",{style:{marginBottom:16}',
  'onChange:B=>{var w=B.target.value;j(u(d({},h),{type:w,linkedId:"",linkedType:""}))},style:c.inp,children:[e.jsx("option",{value:"tarea",children:"Ô£à Tarea libre"}),e.jsx("option",{value:"obra",children:"­ƒÅù´©Å Obra (vinculado a presupuesto)"}),e.jsx("option",{value:"licitacion",children:"­ƒôï Licitaci├│n (vinculado a licitaci├│n)"}),e.jsx("option",{value:"seguimiento",children:"­ƒô× Seguimiento cliente"}),e.jsx("option",{value:"reunion",children:"­ƒôà Reuni├│n"}),e.jsx("option",{value:"visita",children:"­ƒÅè Visita a terreno"}),e.jsx("option",{value:"presupuesto_nuevo",children:"­ƒôï Visita presupuesto nuevo"}),e.jsx("option",{value:"inspeccion",children:"­ƒô¡ Inspecci├│n / QA"}),e.jsx("option",{value:"llamada",children:"­ƒô× Llamada"}),e.jsx("option",{value:"pago",children:"­ƒÆ░ Pago / Cobro"}),e.jsx("option",{value:"entrega",children:"­ƒô¶ Entrega / Hito"}),e.jsx("option",{value:"otros",children:"ÔÇª Otros"})]})]}),e.jsxs("div",{style:{marginBottom:16}'
);

// 2) Vincular a cliente también para reunión/visita/presupuesto nuevo/llamada
replaceOnce(
  "client-link-more-types",
  'h.type==="seguimiento"&&e.jsxs("div",{style:{marginBottom:20},children:[e.jsx("div",{style:c.lbl,children:"Vincular a cliente"}),e.jsxs("select",{value:h.linkedId,onChange:B=>{var w=B.target.value;j(u(d({},h),{linkedId:w,linkedType:"cliente"}))},style:c.inp,children:[e.jsx("option",{value:"",children:"-- Seleccionar cliente --"}),m.map(B=>e.jsxs("option",{value:B.id,children:[B.nombre," ",B.contacto?`(${B.contacto})`:""]},B.id))]})]})]}),e.jsxs("div",{style:{padding:"16px 20px",borderTop:`1px solid ${a.border}`},children:[e.jsx("div",{style:{fontSize:14,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:6},children:"­ƒôØ Notas del d├¡a"}),',
  '(h.type==="seguimiento"||h.type==="reunion"||h.type==="visita"||h.type==="presupuesto_nuevo"||h.type==="llamada")&&e.jsxs("div",{style:{marginBottom:20},children:[e.jsx("div",{style:c.lbl,children:"Vincular a cliente"}),e.jsxs("select",{value:h.linkedId,onChange:B=>{var w=B.target.value;j(u(d({},h),{linkedId:w,linkedType:"cliente"}))},style:c.inp,children:[e.jsx("option",{value:"",children:"-- Seleccionar cliente --"}),m.map(B=>e.jsxs("option",{value:B.id,children:[B.nombre," ",B.contacto?`(${B.contacto})`:""]},B.id))]})]})]}),e.jsxs("div",{style:{padding:"16px 20px",borderTop:`1px solid ${a.border}`},children:[e.jsx("div",{style:{fontSize:14,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:6},children:"­ƒôØ Notas del d├¡a"}),'
);

// 3) Colores y etiquetas para más tipos en "Detalles del Evento"
replaceOnce(
  "event-type-labels-colors",
  'b={obra:"­ƒÅù´©Å Obra",licitacion:"­ƒôï Licitaci├│n",seguimiento:"­ƒô× Seguimiento",tarea:"Ô£à Tarea libre"},h={obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6"}',
  'b={obra:"­ƒÅù´©Å Obra",licitacion:"­ƒôï Licitaci├│n",seguimiento:"­ƒô× Seguimiento",tarea:"Ô£à Tarea libre",reunion:"­ƒôà Reuni├│n",visita:"­ƒÅè Visita a terreno",presupuesto_nuevo:"­ƒôï Visita presupuesto nuevo",inspeccion:"­ƒô¡ Inspecci├│n / QA",llamada:"­ƒô× Llamada",pago:"­ƒÆ░ Pago / Cobro",entrega:"­ƒô¶ Entrega / Hito",otros:"ÔÇª Otros"},h={obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6",reunion:"#06b6d4",visita:"#ec4899",presupuesto_nuevo:"#f59e0b",inspeccion:"#ef4444",llamada:"#a855f7",pago:"#22c55e",entrega:"#6366f1",otros:"#6b7280"}'
);

// 4) Asignar color por tipo a eventos manuales (si no viene color)
replaceOnce(
  "manual-event-color",
  'U=X=>{var W=u(d({id:"manual_"+Date.now()},X),{date:X.date.toISOString().split("T")[0]});m(T=>[...T,W]),h(!1)}',
  'U=X=>{var _c={obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6",reunion:"#06b6d4",visita:"#ec4899",presupuesto_nuevo:"#f59e0b",inspeccion:"#ef4444",llamada:"#a855f7",pago:"#22c55e",entrega:"#6366f1",otros:"#6b7280"},W=u(d({id:"manual_"+Date.now()},X),{date:X.date.toISOString().split("T")[0],color:X.color||_c[X.type]||"#3b82f6"});m(T=>[...T,W]),h(!1)}'
);

// 5) Leyenda + barra rápida de notas arriba del calendario (sin obligar clicks en el calendario)
replaceOnce(
  "legend-and-notes-bar",
  'e.jsx("div",{style:{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"},children:[{type:"obra",label:"­ƒÅù´©Å Obra",color:"#3b82f6"},{type:"licitacion",label:"­ƒôï Licitaci├│n",color:"#f97316"},{type:"seguimiento",label:"­ƒô× Seguimiento",color:"#10b981"},{type:"tarea",label:"Ô£à Tarea libre",color:"#8b5cf6"}].map(X=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,fontSize:12},children:[e.jsx("div",{style:{width:12,height:12,borderRadius:2,background:X.color}}),e.jsx("span",{children:X.label})]},X.type))}),D==="mes"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(7, 1fr)"',
  'e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap",alignItems:"center"},children:[e.jsx("div",{style:{display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"},children:[{type:"obra",label:"­ƒÅù´©Å Obra",color:"#3b82f6"},{type:"licitacion",label:"­ƒôï Licitaci├│n",color:"#f97316"},{type:"seguimiento",label:"­ƒô× Seguimiento",color:"#10b981"},{type:"tarea",label:"Ô£à Tarea libre",color:"#8b5cf6"},{type:"reunion",label:"­ƒôà Reuni├│n",color:"#06b6d4"},{type:"visita",label:"­ƒÅè Visita",color:"#ec4899"},{type:"presupuesto_nuevo",label:"­ƒôï Presupuesto nuevo",color:"#f59e0b"},{type:"inspeccion",label:"­ƒô¡ Inspecci├│n",color:"#ef4444"},{type:"llamada",label:"­ƒô× Llamada",color:"#a855f7"},{type:"pago",label:"­ƒÆ░ Pago",color:"#22c55e"},{type:"entrega",label:"­ƒô¶ Entrega",color:"#6366f1"},{type:"otros",label:"ÔÇª Otros",color:"#6b7280"}].map(X=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,fontSize:12},children:[e.jsx("div",{style:{width:12,height:12,borderRadius:2,background:X.color}}),e.jsx("span",{children:X.label})]},X.type))}),e.jsxs("div",{style:{marginLeft:"auto",display:"flex",gap:8,alignItems:"center",background:a.sb,border:`1px solid ${a.border}`,borderRadius:10,padding:"8px 10px"},children:[e.jsx("span",{style:{fontSize:12,color:a.muted,fontWeight:700},children:"­ƒôØ Notas"}),e.jsx("input",{id:"ecp_note_date",type:"date",defaultValue:new Date().toISOString().split("T")[0],style:{padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12}}),e.jsx("input",{id:"ecp_note_text",type:"text",placeholder:"Agregar notaÔÇª",style:{width:220,padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12}}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"6px 10px",fontSize:12}),onClick:()=>{var X=document.getElementById("ecp_note_date"),W=document.getElementById("ecp_note_text");X&&W&&(R(X.value,W.value),W.value="")},children:"+"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>{var X=document.getElementById("ecp_note_date");if(!X||!X.value)return;S(new Date(X.value+"T00:00:00"))},children:"Ver"})]})]}),D==="mes"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(7, 1fr)"'
);

if (!changed) {
  console.log("OK: ya estaba aplicado (sin cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: mejoras Agenda aplicadas (${changed} cambios).`);

