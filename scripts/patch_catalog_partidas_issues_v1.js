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

// 1) Smart search: add special tokens (:sinprecio/:sinunidad/:sinapu) + flags (__dup/__missingPrecio/__missingUnidad/__missingApu)
{
  const startNeedle = 'var f=(()=>{var y=(l==="Todos"?t:t.filter(P=>P.cat===l));';
  const start = s.indexOf(startNeedle);
  if (start !== -1) {
    const endNeedle = '})(),I=';
    const end = s.indexOf(endNeedle, start);
    if (end !== -1) {
      const before = s.slice(0, start);
      const after = s.slice(end); // includes endNeedle
      const replacement =
        'var f=(()=>{var y=(l==="Todos"?t:t.filter(P=>P.cat===l));var A=Q=>{var Z=String(Q||"");try{Z=Z.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"")}catch(X){}return Z.toLowerCase().trim()},S=y.reduce((Q,Z)=>{var X=A(Z.cat)+"|"+A(Z.desc);return Q[X]=(Q[X]||0)+1,Q},{}),O=Z=>{var X=A(Z.cat)+"|"+A(Z.desc),G=parseFloat(Z.precio)||0,ie=String(Z.unidad||"").trim(),oe=!!(Z.apuId||Z.apu||Z.apu_id);return u(d({},Z),{__dup:(S[X]||0)>1,__missingPrecio:!(G>0),__missingUnidad:!ie||A(ie)==="unidad",__missingApu:!oe})},U=String(B||"").trim(),R=A(U),K=R.split(/\\s+/).filter(Boolean),D={sp:!1,su:!1,sa:!1},k=[];K.forEach(Q=>{Q===":sinprecio"?D.sp=!0:Q===":sinunidad"?D.su=!0:Q===":sinapu"?D.sa=!0:k.push(Q)});var le=(Z=>{var X=parseFloat(Z.precio)||0,G=String(Z.unidad||"").trim(),ie=!!(Z.apuId||Z.apu||Z.apu_id);return!(D.sp&&X>0)&&!(D.su&&G&&A(G)!=="unidad")&&!(D.sa&&ie)});var ee=(Q,Z)=>{if(!Q)return!0;if(Z.indexOf(Q)!==-1)return!0;if(Q==="techo"||Q==="techumbre"||Q==="zinc"||Q==="canaleta"||Q==="cubierta")return Z.indexOf("techumbr")!==-1||Z.indexOf("zinc")!==-1||Z.indexOf("canalet")!==-1||Z.indexOf("cubiert")!==-1;if(Q==="puerta"||Q==="ventana"||Q==="cerradura"||Q==="bisagra"||Q==="chapa")return Z.indexOf("puert")!==-1||Z.indexOf("ventan")!==-1||Z.indexOf("cerradur")!==-1||Z.indexOf("bisagr")!==-1||Z.indexOf("chapa")!==-1;if(Q==="cocina"||Q==="lavanderia"||Q==="lavandería"||Q==="lavadero")return Z.indexOf("cocin")!==-1||Z.indexOf("lavander")!==-1||Z.indexOf("lavader")!==-1;if(Q==="bano"||Q==="baño"||Q==="wc"||Q==="lavamanos"||Q==="griferi"||Q==="griferia"||Q==="grifería"||Q==="ducha"||Q==="fuga")return Z.indexOf("sanitar")!==-1||Z.indexOf("wc")!==-1||Z.indexOf("lavaman")!==-1||Z.indexOf("grif")!==-1||Z.indexOf("duch")!==-1||Z.indexOf("fuga")!==-1;if(Q==="humedad"||Q==="filtracion"||Q==="filtración"||Q==="goter"||Q==="gotera")return Z.indexOf("humed")!==-1||Z.indexOf("filtr")!==-1||Z.indexOf("goter")!==-1;if(Q==="mueble"||Q==="melamina")return Z.indexOf("muebl")!==-1||Z.indexOf("melamin")!==-1;return!1};var Y=Z=>{var X=A(Z.desc)+" "+A(Z.cat)+" "+A(Z.unidad);return k.every(G=>ee(G,X))};var P=y.filter(Z=>le(Z)&&(k.length?Y(Z):!0));if(!k.length)return P.map(O);var $=Z=>{var X=A(Z.desc),G=A(Z.cat),ie=A(Z.unidad),oe=X+" "+G+" "+ie,ce=0;return k.forEach(re=>{X.startsWith(re)?ce+=6:X.indexOf(re)!==-1?ce+=4:G.indexOf(re)!==-1?ce+=2:ie.indexOf(re)!==-1?ce+=1:ee(re,oe)&&(ce+=1)}),ce};return P.map(Z=>({Q:Z,sc:$(Z)})).sort((Z,X)=>X.sc-Z.sc||A(Z.Q.cat).localeCompare(A(X.Q.cat),"es")||A(Z.Q.desc).localeCompare(A(X.Q.desc),"es")).map(Z=>O(Z.Q))})(),I=';
      s = before + replacement + after.slice(endNeedle.length);
      changed++;
    }
  }
}

// 2) Chips: add issue chips to existing quick chip list
replaceOnce(
  'children:[["Techo","techo"],["Puertas/Vent.","puerta"],["Bano","bano"],["Cocina","cocina"],["Humedad/Gotera","humedad"],["Pintura","pintura"],["Pisos","piso"],["Electrica","electrica"]].map(([y,P])=>',
  'children:[["Techo","techo"],["Puertas/Vent.","puerta"],["Bano","bano"],["Cocina","cocina"],["Humedad/Gotera","humedad"],["Pintura","pintura"],["Pisos","piso"],["Electrica","electrica"],["Sin precio",":sinprecio"],["Sin unidad",":sinunidad"],["Sin APU",":sinapu"]].map(([y,P])=>'
);

// 3) Chips: toggle special tokens instead of overwriting (only for tokens starting with ":")
replaceOnce(
  'onClick:()=>w(P)',
  'onClick:()=>{var A=String(B||"").trim();if(P&&P[0]===":"){var S=A?A.split(/\\s+/).filter(Boolean):[];var O=S.indexOf(P)!==-1;w((O?S.filter(U=>U!==P):S.concat([P])).join(" ").trim())}else w(P)}'
);

// 4) Badges next to description
replaceOnce(
  'e.jsx("td",{style:c.td,children:y.desc})',
  'e.jsxs("td",{style:c.td,children:[y.desc,y.__dup&&e.jsx("span",{style:{marginLeft:8,fontSize:10,padding:"2px 6px",borderRadius:8,border:"1px solid "+a.border,color:"#f59e0b",background:"#f59e0b22",fontWeight:800},children:"Dup"}),y.__missingPrecio&&e.jsx("span",{style:{marginLeft:6,fontSize:10,padding:"2px 6px",borderRadius:8,border:"1px solid "+a.border,color:"#f87171",background:"#f8717122",fontWeight:800},children:"Sin precio"}),y.__missingUnidad&&e.jsx("span",{style:{marginLeft:6,fontSize:10,padding:"2px 6px",borderRadius:8,border:"1px solid "+a.border,color:"#fb923c",background:"#fb923c22",fontWeight:800},children:"Sin unidad"}),y.__missingApu&&e.jsx("span",{style:{marginLeft:6,fontSize:10,padding:"2px 6px",borderRadius:8,border:"1px solid "+a.border,color:"#38bdf8",background:"#38bdf822",fontWeight:800},children:"Sin APU"})]}'
);

// 5) Save normalization + prevent duplicates (desc+cat) for new/edited
{
  const needleA = 'I=s?p.trim():b,D=()=>{!I||!j.desc||j.precio===""||(';
  const idx = s.indexOf(needleA);
  if (idx !== -1) {
    const endNeedle = '},k={Pintura:';
    const end = s.indexOf(endNeedle, idx);
    if (end !== -1) {
      const segment = s.slice(idx, end);
      // Replace the whole D=()=>{...} segment safely by finding D=()=>{ and the closing } before ,k=
      const dStart = segment.indexOf('D=()=>{');
      const dEnd = segment.lastIndexOf('}');
      if (dStart !== -1 && dEnd !== -1 && dEnd > dStart) {
        const before = s.slice(0, idx) + segment.slice(0, dStart);
        const after = segment.slice(dEnd + 1) + s.slice(end);
        const newD =
          'D=()=>{var y=String(I||"").trim(),P=String(j.desc||"").trim().replace(/\\s+/g," "),A=String(j.unidad||"").trim(),S=parseFloat(j.precio);A=A.replace("m²","m2").replace("M²","m2");if(!y||!P||j.precio==="")return;var O=A.toLowerCase()==="unidad"?"unidad":A;var U=t.some(Q=>Q.cat===y&&String(Q.desc||"").trim().replace(/\\s+/g," ").toLowerCase()===P.toLowerCase()&&(g===null||Q.id!==g));if(U){r("⚠️ Ya existe una partida similar en esa categoría");return}var R=isNaN(S)?0:S;g!==null?(i(t.map(Q=>Q.id===g?{id:g,cat:y,desc:P,unidad:O,precio:R}:Q)),z(null)):i([...t,{id:Math.max(0,...t.map(Q=>Q.id))+1,cat:y,desc:P,unidad:O,precio:R}]),F({desc:"",unidad:"unidad",precio:""}),m(!1),C(""))}';
        s = before + newD + after;
        changed++;
      }
    }
  }
}

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: Partidas de Obra (punto 2 y 3) aplicado (${changed} cambios).`);

