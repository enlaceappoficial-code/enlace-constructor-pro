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
  'f=(l==="Todos"?t:t.filter(y=>y.cat===l)).filter(y=>!B||y.desc.toLowerCase().includes(B.toLowerCase()))';

const replace =
  'f=(()=>{var y=(l==="Todos"?t:t.filter(P=>P.cat===l));var P=String(B||"").trim();if(!P)return y;var A=Q=>{var Z=String(Q||"");try{Z=Z.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"")}catch(X){}return Z.toLowerCase().trim()},S=A(P),O=S.split(/\\s+/).filter(Boolean),U=(Q,Z)=>{if(!Q)return!0;if(Z.indexOf(Q)!==-1)return!0;if(Q==="techo"||Q==="techumbre"||Q==="zinc"||Q==="canaleta"||Q==="cubierta")return Z.indexOf("techumbr")!==-1||Z.indexOf("zinc")!==-1||Z.indexOf("canalet")!==-1||Z.indexOf("cubiert")!==-1;if(Q==="puerta"||Q==="ventana"||Q==="cerradura"||Q==="bisagra"||Q==="chapa")return Z.indexOf("puert")!==-1||Z.indexOf("ventan")!==-1||Z.indexOf("cerradur")!==-1||Z.indexOf("bisagr")!==-1||Z.indexOf("chapa")!==-1;if(Q==="cocina"||Q==="lavanderia"||Q==="lavandería"||Q==="lavadero")return Z.indexOf("cocin")!==-1||Z.indexOf("lavander")!==-1||Z.indexOf("lavader")!==-1;if(Q==="bano"||Q==="baño"||Q==="wc"||Q==="lavamanos"||Q==="griferi"||Q==="griferia"||Q==="grifería"||Q==="ducha"||Q==="fuga")return Z.indexOf("sanitar")!==-1||Z.indexOf("wc")!==-1||Z.indexOf("lavaman")!==-1||Z.indexOf("grif")!==-1||Z.indexOf("duch")!==-1||Z.indexOf("fuga")!==-1;if(Q==="humedad"||Q==="filtracion"||Q==="filtración"||Q==="goter"||Q==="gotera")return Z.indexOf("humed")!==-1||Z.indexOf("filtr")!==-1||Z.indexOf("goter")!==-1;if(Q==="mueble"||Q==="melamina")return Z.indexOf("muebl")!==-1||Z.indexOf("melamin")!==-1;return!1},R=Q=>{var Z=A(Q.desc)+" "+A(Q.cat)+" "+A(Q.unidad);return O.every(X=>U(X,Z))},K=y.filter(R),D=Q=>{var Z=A(Q.desc),X=A(Q.cat),G=A(Q.unidad),ie=Z+" "+X+" "+G,oe=0;return O.forEach(ce=>{Z.startsWith(ce)?oe+=6:Z.indexOf(ce)!==-1?oe+=4:X.indexOf(ce)!==-1?oe+=2:G.indexOf(ce)!==-1?oe+=1:U(ce,ie)&&(oe+=1)}),oe};return K.map(Q=>({Q,sc:D(Q)})).sort((Z,X)=>X.sc-Z.sc||A(Z.Q.cat).localeCompare(A(X.Q.cat),"es")||A(Z.Q.desc).localeCompare(A(X.Q.desc),"es")).map(Z=>Z.Q)})()';

replaceOnce(find, replace);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: buscador inteligente (Partidas de Obra) aplicado (${changed} cambios).`);

