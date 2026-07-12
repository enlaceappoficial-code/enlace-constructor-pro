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

const find =
  '}),f.length>0&&e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:u(d({},c.ct),{marginBottom:12}),children:"Presupuestos"}),f.map';

const insert =
  '}),e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:u(d({},c.ct),{marginBottom:12}),children:"Aging deuda"}),(function(){var I=new Date,D={d030:0,d3160:0,d60:0},k=[],R=(f||[]);R.forEach(K=>{const{total:y}=Ee(K.items,n||{},K.descuento);var P=(K.pagos||[]).reduce((A,S)=>A+(parseFloat(S.monto)||0),0),A=Math.max(0,y-Math.min(P,y));if(!(A>0))return;var S=K.fecha?new Date(String(K.fecha).includes("T")?K.fecha:K.fecha+"T00:00:00"):null,O=S&&isFinite(S.getTime())?Math.floor((I-S)/(1e3*60*60*24)):0;O<=30?D.d030+=A:O<=60?D.d3160+=A:D.d60+=A,O>30&&k.push({id:K.id,dias:O,deuda:A,desc:K.descripcion})});k.sort((K,y)=>y.dias-K.dias);var y=k.slice(0,3);return e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10},children:[["0–30",D.d030,"#38bdf8"],["31–60",D.d3160,"#fbbf24"],["61+",D.d60,"#f87171"]].map(([P,A,S])=>e.jsxs("div",{style:u(d({},c.card),{padding:"10px 12px",margin:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4},children:P}),e.jsx("div",{style:{fontSize:16,fontWeight:800,color:S},children:"$"+Math.round(A).toLocaleString("es-CL")})]},P))}),y.length>0&&e.jsxs("div",{style:{fontSize:12,color:a.muted,lineHeight:1.6},children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,color:a.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"},children:"Alertas"}),y.map(P=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:10,background:a.sb,border:`1px solid ${a.border}`,borderRadius:8,padding:"8px 10px",marginBottom:6},children:[e.jsxs("div",{children:[e.jsxs("span",{style:{color:"#f87171",fontWeight:700,marginRight:8},children:["N° ",P.id]}),e.jsx("span",{style:{color:a.text,fontSize:12},children:P.desc||""})]}),e.jsx("div",{style:{color:"#f87171",fontWeight:700,whiteSpace:"nowrap"},children:P.dias+"d"})]},P.id))})]})]})})()}]}),f.length>0&&e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:u(d({},c.ct),{marginBottom:12}),children:"Presupuestos"}),f.map';

replaceOnce(find, insert);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: aging clientes aplicado (${changed} cambios).`);

