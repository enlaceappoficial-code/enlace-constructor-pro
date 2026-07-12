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

const anchor =
  '}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:16},children:[';

const insert =
  '}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16},children:[' +
  'e.jsxs("div",{style:c.card,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("div",{style:c.ct,children:"Top Clientes por Monto"}),e.jsx("span",{style:{fontSize:11,color:a.muted,opacity:.7},children:"(Inicio)"})]}),e.jsx(Lp,{budgets:r,clients:t,cfg:n})]}),' +
  'e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:c.ct,children:"Resumen Clientes"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:10,marginTop:12},children:[' +
  'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Total"}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:a.text},children:t.length})]}),' +
  'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Con email"}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#38bdf8"},children:t.filter(S=>S.email).length})]}),' +
  'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Con teléfono"}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#4ade80"},children:t.filter(S=>S.telefono).length})]}),' +
  'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Con presup."}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#f5a020"},children:(()=>{var S=new Set((r||[]).map(O=>O.clienteId));return t.filter(O=>S.has(O.id)).length})()})]})' +
  ']})]}))' +
  ']}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:16},children:[';

if (!replaceOnce(anchor, insert)) {
  console.log("OK: no se encontró ancla (no hubo cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: gráfico clientes aplicado (${changed} cambios).`);

