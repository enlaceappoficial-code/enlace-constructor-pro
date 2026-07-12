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

function replaceRegex(re, replacement) {
  const before = s;
  s = s.replace(re, replacement);
  if (s !== before) changed++;
}

if (!s.includes("[ecpNoteDate,setEcpNoteDate]")) {
  replaceRegex(
    /,\[D,k\]=V\("mes"\);/,
    ',[D,k]=V("mes"),[ecpNoteDate,setEcpNoteDate]=V(()=>new Date().toISOString().split("T")[0]),[ecpNoteText,setEcpNoteText]=V("");'
  );
}

const notesPanel =
  'e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center",background:a.sb,border:`1px solid ${a.border}`,borderRadius:12,padding:"10px 12px",marginBottom:20,flexWrap:"wrap"},children:[e.jsx("span",{style:{fontSize:12,fontWeight:800,color:a.muted,textTransform:"uppercase",letterSpacing:".08em"},children:"Notas"}),e.jsx("input",{type:"date",value:ecpNoteDate,onChange:X=>setEcpNoteDate(X.target.value),style:{padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12}}),e.jsx("input",{type:"text",value:ecpNoteText,onChange:X=>setEcpNoteText(X.target.value),placeholder:"Agregar nota…",style:{width:260,padding:"6px 8px",border:`1px solid ${a.border}`,borderRadius:8,background:a.card,color:a.text,fontSize:12},onKeyPress:X=>{X.key==="Enter"&&ecpNoteText.trim()&&(R(ecpNoteDate,ecpNoteText),setEcpNoteText(""))}}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"6px 10px",fontSize:12}),disabled:!ecpNoteText.trim(),onClick:()=>{ecpNoteText.trim()&&(R(ecpNoteDate,ecpNoteText),setEcpNoteText(""))},children:"Agregar"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>{S(new Date(ecpNoteDate+"T00:00:00"))},children:"Ver día"}),(()=>{var X=f[ecpNoteDate]||[];return X.length?e.jsx("div",{style:{width:"100%",marginTop:6,display:"flex",flexDirection:"column",gap:6},children:X.slice(0,4).map((W,T)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"6px 10px",borderRadius:8,background:a.card,border:`1px solid ${a.border}`,fontSize:12},children:[e.jsx("span",{style:{color:a.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:W}),e.jsx("button",{title:"Eliminar",style:{background:"none",border:"none",cursor:"pointer",color:a.muted,fontSize:14},onClick:()=>K(ecpNoteDate,T),children:"✕"})]},T))}):null})()}]})';

if (!s.includes('placeholder:"Agregar nota…",style:{width:260')) {
  const monthGridAnchor =
    '}),D==="mes"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(7, 1fr)"';
  replaceOnce(monthGridAnchor, `}),${notesPanel},D==="mes"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(7, 1fr)"`);
}

replaceRegex(
  /\[\{type:"obra",label:"[^"]*",color:"#3b82f6"\},\{type:"licitacion",label:"[^"]*",color:"#f97316"\},\{type:"seguimiento",label:"[^"]*",color:"#10b981"\},\{type:"tarea",label:"[^"]*",color:"#8b5cf6"\}\]/,
  '[{type:"obra",label:"📋 Obra",color:"#3b82f6"},{type:"licitacion",label:"📑 Licitación",color:"#f97316"},{type:"seguimiento",label:"🔍 Seguimiento",color:"#10b981"},{type:"tarea",label:"⏰ Tarea libre",color:"#8b5cf6"},{type:"reunion",label:"🤝 Reunión",color:"#06b6d4"},{type:"visita",label:"📍 Visita",color:"#ec4899"},{type:"presupuesto_nuevo",label:"🧾 Presupuesto nuevo",color:"#f59e0b"},{type:"llamada",label:"📞 Llamada",color:"#a855f7"},{type:"pago",label:"💰 Pago / Cobro",color:"#16a34a"},{type:"otros",label:"🗂 Otros",color:"#6b7280"}]'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: mejoras Agenda v4 aplicadas (${changed} cambios).`);

