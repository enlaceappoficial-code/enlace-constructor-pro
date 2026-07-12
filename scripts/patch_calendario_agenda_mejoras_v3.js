const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceRegex(re, replacement) {
  const before = s;
  s = s.replace(re, replacement);
  if (s !== before) changed++;
}

const typesSegment =
  ',e.jsx("option",{value:"reunion",children:"Reunión"})' +
  ',e.jsx("option",{value:"visita",children:"Visita a terreno"})' +
  ',e.jsx("option",{value:"presupuesto_nuevo",children:"Visita presupuesto nuevo"})' +
  ',e.jsx("option",{value:"inspeccion",children:"Inspección / QA"})' +
  ',e.jsx("option",{value:"replanteo",children:"Replanteo"})' +
  ',e.jsx("option",{value:"cotizacion",children:"Cotización"})' +
  ',e.jsx("option",{value:"compra_materiales",children:"Compra materiales"})' +
  ',e.jsx("option",{value:"subcontrato",children:"Subcontrato"})' +
  ',e.jsx("option",{value:"postventa",children:"Postventa"})' +
  ',e.jsx("option",{value:"llamada",children:"Llamada"})' +
  ',e.jsx("option",{value:"pago",children:"Pago / Cobro"})' +
  ',e.jsx("option",{value:"entrega",children:"Entrega / Hito"})' +
  ',e.jsx("option",{value:"otros",children:"Otros"})';

replaceRegex(
  /,e\.jsx\("option",\{value:"reunion",children:"Reunión"\}\)[\s\S]*?e\.jsx\("option",\{value:"otros",children:"Otros"\}\)/,
  typesSegment
);

replaceRegex(
  /e\.jsx\("option",\{value:"seguimiento",children:[^}]*\}\)/,
  (m) => (s.includes('value:"reunion"') ? m : m + typesSegment)
);

replaceRegex(
  /\(h\.type==="seguimiento"\|\|h\.type==="reunion"\|\|h\.type==="visita"\|\|h\.type==="presupuesto_nuevo"\|\|h\.type==="llamada"\)&&/g,
  '(h.type==="seguimiento"||h.type==="reunion"||h.type==="visita"||h.type==="presupuesto_nuevo"||h.type==="llamada"||h.type==="cotizacion"||h.type==="postventa"||h.type==="pago")&&'
);

replaceRegex(
  /h\.type==="seguimiento"&&/g,
  '(h.type==="seguimiento"||h.type==="reunion"||h.type==="visita"||h.type==="presupuesto_nuevo"||h.type==="llamada"||h.type==="cotizacion"||h.type==="postventa"||h.type==="pago")&&'
);

replaceRegex(
  /b=\{obra:"Obra"[\s\S]*?\},h=\{obra:"#3b82f6"[\s\S]*?\}/,
  'b={obra:"Obra",licitacion:"Licitación",seguimiento:"Seguimiento",tarea:"Tarea libre",reunion:"Reunión",visita:"Visita a terreno",presupuesto_nuevo:"Visita presupuesto nuevo",inspeccion:"Inspección / QA",replanteo:"Replanteo",cotizacion:"Cotización",compra_materiales:"Compra materiales",subcontrato:"Subcontrato",postventa:"Postventa",llamada:"Llamada",pago:"Pago / Cobro",entrega:"Entrega / Hito",otros:"Otros"},h={obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6",reunion:"#06b6d4",visita:"#ec4899",presupuesto_nuevo:"#f59e0b",inspeccion:"#ef4444",replanteo:"#14b8a6",cotizacion:"#0ea5e9",compra_materiales:"#a16207",subcontrato:"#fb7185",postventa:"#22c55e",llamada:"#a855f7",pago:"#16a34a",entrega:"#6366f1",otros:"#6b7280"}'
);

replaceRegex(
  /var _c=\{obra:"#3b82f6"[\s\S]*?otros:"#6b7280"\}/,
  'var _c={obra:"#3b82f6",licitacion:"#f97316",seguimiento:"#10b981",tarea:"#8b5cf6",reunion:"#06b6d4",visita:"#ec4899",presupuesto_nuevo:"#f59e0b",inspeccion:"#ef4444",replanteo:"#14b8a6",cotizacion:"#0ea5e9",compra_materiales:"#a16207",subcontrato:"#fb7185",postventa:"#22c55e",llamada:"#a855f7",pago:"#16a34a",entrega:"#6366f1",otros:"#6b7280"}'
);

replaceRegex(
  /,\[D,k\]=V\("mes"\);/,
  ',[D,k]=V("mes"),[ecpNoteDate,setEcpNoteDate]=V(()=>new Date().toISOString().split("T")[0]),[ecpNoteText,setEcpNoteText]=V("");'
);

replaceRegex(
  /e\.jsx\("div",\{style:\{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"\},children:\[\{type:"obra"[\s\S]*?\]\.map\(X=>e\.jsxs\("div",\{style:\{display:"flex",alignItems:"center",gap:6,fontSize:12\},children:\[e\.jsx\("div",\{style:\{width:12,height:12,borderRadius:2,background:X\.color\}\}\),e\.jsx\("span",\{children:X\.label\}\)\]\},X\.type\)\)\}\)\),/,
  (m) =>
    m +
    'e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center",background:a.sb,border:`1px solid ${a.border}`,borderRadius:12,padding:"10px 12px",marginBottom:20,flexWrap:"wrap"},children:[e.jsx("span",{style:{fontSize:12,fontWeight:800,color:a.muted,textTransform:"uppercase",letterSpacing:".08em"},children:"Notas"}),e.jsx("input",{type:"date",value:ecpNoteDate,onChange:X=>setEcpNoteDate(X.target.value),style:{padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12}}),e.jsx("input",{type:"text",value:ecpNoteText,onChange:X=>setEcpNoteText(X.target.value),placeholder:"Agregar nota…",style:{width:260,padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12},onKeyPress:X=>{X.key==="Enter"&&ecpNoteText.trim()&&(R(ecpNoteDate,ecpNoteText),setEcpNoteText(""))}}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"6px 10px",fontSize:12}),disabled:!ecpNoteText.trim(),onClick:()=>{ecpNoteText.trim()&&(R(ecpNoteDate,ecpNoteText),setEcpNoteText(""))},children:"Agregar"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>{S(new Date(ecpNoteDate+"T00:00:00"))},children:"Ver día"}),(()=>{var X=f[ecpNoteDate]||[];return X.length?e.jsx("div",{style:{width:"100%",marginTop:6,display:"flex",flexDirection:"column",gap:6},children:X.slice(0,4).map((W,T)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"6px 10px",borderRadius:8,background:a.card,border:`1px solid ${a.border}`,fontSize:12},children:[e.jsx("span",{style:{color:a.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:W}),e.jsx("button",{title:"Eliminar",style:{background:"none",border:"none",cursor:"pointer",color:a.muted,fontSize:14},onClick:()=>K(ecpNoteDate,T),children:"✕"})]},T))}):null})()}]})' +
    ","
);

replaceRegex(
  /children:\["Tipo: ",g\.type\]/,
  'children:["Tipo: ",({obra:"Obra",licitacion:"Licitación",seguimiento:"Seguimiento",tarea:"Tarea libre",reunion:"Reunión",visita:"Visita a terreno",presupuesto_nuevo:"Visita presupuesto nuevo",inspeccion:"Inspección / QA",replanteo:"Replanteo",cotizacion:"Cotización",compra_materiales:"Compra materiales",subcontrato:"Subcontrato",postventa:"Postventa",llamada:"Llamada",pago:"Pago / Cobro",entrega:"Entrega / Hito",otros:"Otros"}[g.type]||g.type)]'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: mejoras Agenda aplicadas (${changed} cambios).`);
