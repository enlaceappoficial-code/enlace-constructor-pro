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

// 1) Hooks + helpers + guardar con validación/normalización/dedupe
replaceOnce(
  'function hg({clients:t,setClients:i,budgets:r,cfg:n,setToast:l}){const[o,s]=V({tipo:"empresa",rut:"",nombre:"",contacto:"",email:"",telefono:""}),[m,p]=V(null),[q,J]=V(""),[C,b]=V(!1),[h,j]=V(null),[F,g]=V(null);var z=()=>{o.nombre&&(m!==null?(i(t.map(I=>I.id===m?u(d({},o),{contacto:o.tipo==="persona"?o.nombre:o.contacto,id:m}):I)),p(null)):i([...t,u(d({},o),{contacto:o.tipo==="persona"?o.nombre:o.contacto,id:Math.max(0,...t.map(I=>I.id))+1})]),s({tipo:"empresa",rut:"",nombre:"",contacto:"",email:"",telefono:""}))}',
  'function hg({clients:t,setClients:i,budgets:r,cfg:n,setToast:l}){const[o,s]=V({tipo:"empresa",rut:"",nombre:"",contacto:"",email:"",telefono:""}),[m,p]=V(null),[q,J]=V(""),[C,b]=V(!1),[h,j]=V(null),[F,g]=V(null),[sort,setSort]=V({k:"nombre",d:1}),[fil,setFil]=V({deuda:!1,presup:!1,sinEmail:!1,sinTel:!1}),[page,setPage]=V(1),[pageSize,setPageSize]=V(25);var Qn=I=>{var D=String(I||"");try{D=D.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"")}catch(k){}return D.toLowerCase().trim()},Rn=I=>{var D=String(I||"").toUpperCase().replace(/[^0-9K]/g,"");if(D.length<2)return"";var k=D.slice(0,-1),R=D.slice(-1);return k+"-"+R},Kn=I=>{var D=Rn(I);if(!D)return!0;var k=D.split("-")[0],R=D.split("-")[1];if(!k||!R)return!1;var K=0,y=2;for(var P=k.length-1;P>=0;P--){K+=parseInt(k[P],10)*y;y=y===7?2:y+1}var A=11-(K%11),S=A===11?"0":A===10?"K":String(A);return S===R},En=I=>String(I||"").trim().toLowerCase(),Nn=I=>String(I||"").replace(/[^0-9]/g,""),Pn=I=>{var D=String(I||"").trim();if(!D)return"";var k=Nn(D);if(k.length===9&&k[0]==="9")return"+56"+k;if(k.length===11&&k.slice(0,2)==="56")return"+"+k;if(D[0]==="+")return"+"+k;return k},Mn=I=>{var D=Pn(I).replace(/[^0-9]/g,"");return D?("https://wa.me/"+D):""},z=()=>{var I=String(o.nombre||"").trim();if(!I)return;var D=o.tipo||"empresa",k=String(o.contacto||"").trim(),R=Rn(o.rut||""),K=En(o.email||""),y=Pn(o.telefono||"");if(R&&!Kn(R))return l("⚠ RUT inválido"),void 0;D==="persona"&&(k=I);var P=u(d({},o),{tipo:D,rut:R,nombre:I,contacto:k,email:K,telefono:y}),A=t.filter(S=>S.id!==(m==null?void 0:m));if(R&&A.some(S=>Rn(S.rut||"")===R))return l("⚠ Ya existe un cliente con ese RUT."),void 0;if(K&&A.some(S=>En(S.email||"")===K))return l("⚠ Ya existe un cliente con ese email."),void 0;var O=Nn(y);if(O&&A.some(S=>Nn(S.telefono||"")===O))return l("⚠ Ya existe un cliente con ese teléfono."),void 0;m!==null?(i(t.map(S=>S.id===m?u(d({},P),{id:m}):S)),p(null)):i([...t,u(d({},P),{id:Math.max(0,...t.map(S=>S.id))+1})]),s({tipo:"empresa",rut:"",nombre:"",contacto:"",email:"",telefono:""}),setPage(1)}'
);

// 2) Insertar "view model" Vw antes del return del listado
replaceOnce(
  '}return e.jsxs(e.Fragment,{children:[F&&e.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9100,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("div",{style:{background:a.card,border:`1px solid ${a.border}`',
  '}var Vw=(()=>{var I=String(q||"").trim(),D=Qn(I),k=I.replace(/[^0-9]/g,""),R=I.replace(/[^0-9kK]/g,"").toUpperCase(),K=t.filter(P=>{if(!I)return!0;var A=(Qn(P.nombre||"")+" "+Qn(P.contacto||"")+" "+Qn(P.email||""));if(D&&A.includes(D))return!0;if(k&&Nn(P.telefono||"").includes(k))return!0;var S=Rn(P.rut||"");return R&&S.replace(/[^0-9K]/g,"").includes(R.replace(/[^0-9K]/g,""))}),y=K.filter(P=>{if(fil.sinEmail&&P.email)return!1;if(fil.sinTel&&P.telefono)return!1;if(fil.presup&&B(P.id).total<=0)return!1;if(fil.deuda){var A=B(P.id);if(!(A.total>0&&A.deuda>0))return!1}return!0});y.sort((P,A)=>{var S=sort.k,O=(S==="deuda"?B(P.id).deuda:S==="presup"?B(P.id).total:S==="id"?P.id:S==="estado"?(B(P.id).enEjecucion>0?3:B(P.id).deuda>0?2:B(P.id).total>0?1:0):String(P[S]||"")),U=(S==="deuda"?B(A.id).deuda:S==="presup"?B(A.id).total:S==="id"?A.id:S==="estado"?(B(A.id).enEjecucion>0?3:B(A.id).deuda>0?2:B(A.id).total>0?1:0):String(A[S]||""));if(typeof O=="string"){var $=Qn(O),ee=Qn(U);return ($<ee?-1:$>ee?1:0)*sort.d}return (O-U)*sort.d});var P=Math.max(1,Math.ceil(y.length/pageSize)),A=Math.min(page,P),S=(A-1)*pageSize,O=S+pageSize;return{items:y.slice(S,O),total:y.length,pages:P,page:A}})();return e.jsxs(e.Fragment,{children:[F&&e.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9100,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("div",{style:{background:a.card,border:`1px solid ${a.border}`'
);

// 3) Header: filtros + paginación + reset page al buscar
replaceOnce(
  'children:[e.jsx("input",{value:q,onChange:I=>J(I.target.value),placeholder:"Buscar cliente...",style:u(d({},c.inp),{width:240})}),e.jsx("button",{style:u(d({},c.btn("s")),{fontSize:12,padding:"6px 12px"}),onClick:w,children:"',
  'children:[e.jsx("input",{value:q,onChange:I=>{J(I.target.value),setPage(1)},placeholder:"Buscar cliente...",style:u(d({},c.inp),{width:240})}),e.jsx("button",{style:u(d({},c.btn(fil.deuda?"p":"s")),{fontSize:11,padding:"6px 10px"}),onClick:()=>{setFil(D=>u(d({},D),{deuda:!D.deuda})),setPage(1)},children:"Deuda"}),e.jsx("button",{style:u(d({},c.btn(fil.presup?"p":"s")),{fontSize:11,padding:"6px 10px"}),onClick:()=>{setFil(D=>u(d({},D),{presup:!D.presup})),setPage(1)},children:"Presup"}),e.jsx("button",{style:u(d({},c.btn(fil.sinEmail?"p":"s")),{fontSize:11,padding:"6px 10px"}),onClick:()=>{setFil(D=>u(d({},D),{sinEmail:!D.sinEmail})),setPage(1)},children:"Sin email"}),e.jsx("button",{style:u(d({},c.btn(fil.sinTel?"p":"s")),{fontSize:11,padding:"6px 10px"}),onClick:()=>{setFil(D=>u(d({},D),{sinTel:!D.sinTel})),setPage(1)},children:"Sin tel"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginLeft:4},children:[e.jsx("button",{style:u(d({},c.btn("s")),{fontSize:11,padding:"6px 10px"}),disabled:Vw.page<=1,onClick:()=>setPage(D=>Math.max(1,D-1)),children:"‹"}),e.jsx("div",{style:{fontSize:11,color:a.muted,minWidth:64,textAlign:"center"},children:Vw.page+"/"+Vw.pages}),e.jsx("button",{style:u(d({},c.btn("s")),{fontSize:11,padding:"6px 10px"}),disabled:Vw.page>=Vw.pages,onClick:()=>setPage(D=>D+1),children:"›"}),e.jsx("select",{value:pageSize,onChange:D=>{setPageSize(parseInt(D.target.value,10)||25),setPage(1)},style:u(d({},c.inp),{width:72,padding:"6px 8px",fontSize:11})},[25,50,100].map(D=>e.jsx("option",{value:D,children:D},D)))]}),e.jsx("button",{style:u(d({},c.btn("s")),{fontSize:12,padding:"6px 12px"}),onClick:w,children:"'
);

// 4) Headers clickeables (ordenamiento)
replaceOnce(
  'children:["ID","Nombre","Contacto","Email","Tel├®fono","Presup.","Deuda","Estado",""].map(I=>e.jsx("th",{style:c.th,children:I},I))',
  'children:[["ID","id"],["Nombre","nombre"],["Contacto","contacto"],["Email","email"],["Teléfono","telefono"],["Presup.","presup"],["Deuda","deuda"],["Estado","estado"],["",""]].map(([I,D])=>e.jsx("th",{style:u(d({},c.th),D?{cursor:"pointer",userSelect:"none"}:{}),onClick:D?()=>{setSort(k=>k.k===D?u(d({},k),{d:-k.d}):{k:D,d:1}),setPage(1)}:void 0,children:e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[I,D&&sort.k===D?e.jsx("span",{style:{opacity:.7,fontSize:11},children:sort.d===1?"▲":"▼"}):null]})},I))'
);

// 5) TBody: usar Vw.items (ya filtrado/ordenado/paginado)
replaceOnce(
  'children:t.filter(I=>{var D=(q||"").toLowerCase().trim();return!D||((I.nombre||"").toLowerCase().includes(D)||(I.contacto||"").toLowerCase().includes(D)||(I.email||"").toLowerCase().includes(D)||(I.telefono||"").toLowerCase().includes(D)||(I.rut||"").toLowerCase().includes(D))}).map(I=>{var D=B(I.id),k=D.deuda>0&&D.total>0,R=D.enEjecucion>0;return e.jsxs("tr",{style:{cursor:"pointer"},onMouseEnter:K=>K.currentTarget.style.background=a.hover,onMouseLeave:K=>K.currentTarget.style.background="",onClick:()=>j(I),children:[',
  'children:Vw.items.map(I=>{var D=B(I.id),k=D.deuda>0&&D.total>0,R=D.enEjecucion>0;return e.jsxs("tr",{style:{cursor:"pointer"},onMouseEnter:K=>K.currentTarget.style.background=a.hover,onMouseLeave:K=>K.currentTarget.style.background="",onClick:()=>j(I),children:['
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: Clientes mejoras v2 aplicado (${changed} cambios).`);

