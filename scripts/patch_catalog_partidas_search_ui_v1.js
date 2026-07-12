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

// 1) Contador "Mostrando X de Y" + input con limpiar (✕) + chips de búsqueda rápida.
// Se inserta dentro del header de "Partidas de Obra", sin crear un buscador nuevo.
const find =
  'children:[e.jsxs("div",{style:{fontSize:16,fontWeight:700},children:["­ƒôè Partidas de Obra ",e.jsxs("span",{style:{fontSize:13,color:a.muted,fontWeight:400},children:["(",f.length,")"]})]}),e.jsx("input",{style:u(d({},c.inp),{width:200,fontSize:13}),placeholder:"­ƒöì Buscar partida…",value:B,onChange:y=>w(y.target.value)})]}),';

const replace =
  'children:[e.jsxs("div",{style:{fontSize:16,fontWeight:700,display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"},children:["­ƒôè Partidas de Obra ",e.jsxs("span",{style:{fontSize:13,color:a.muted,fontWeight:400},children:["(",f.length,")"]}),e.jsxs("span",{style:{fontSize:12,color:a.muted,fontWeight:500},children:["Mostrando ",f.length," de ",(l==="Todos"?t.length:t.filter(y=>y.cat===l).length)]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}},children:[e.jsxs("div",{style:{position:"relative"}},children:[e.jsx("input",{style:u(d({},c.inp),{width:220,fontSize:13,paddingRight:28}),placeholder:"­ƒöì Buscar partida…",value:B,onChange:y=>w(y.target.value)}),B?e.jsx("button",{onClick:()=>w(""),style:{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",width:20,height:20,borderRadius:6,border:"1px solid "+a.border,background:a.sb,color:a.muted,cursor:"pointer",fontSize:12,lineHeight:"18px",padding:0},children:"✕"}):null]}),e.jsx("div",{style:{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"} ,children:[["Techo","techo"],["Puertas/Vent.","puerta"],["Baño","baño"],["Cocina","cocina"],["Humedad/Gotera","humedad"],["Pintura","pintura"],["Pisos","piso"],["Eléctrica","electrica"]].map(([y,P])=>e.jsx("button",{onClick:()=>w(P),style:{fontSize:10,padding:"3px 8px",borderRadius:999,border:"1px solid "+a.border,background:"var(--surface)",color:a.muted,cursor:"pointer",fontWeight:700,letterSpacing:".02em"} ,children:y},y))})]} )]}),';

replaceOnce(find, replace);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: UI buscador Partidas de Obra aplicado (${changed} cambios).`);

