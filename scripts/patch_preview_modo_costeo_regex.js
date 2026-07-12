const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function replaceRegexOnce(re, replacement, label) {
  const m = s.match(re);
  if (!m) throw new Error(`No se encontró: ${label}`);
  const m2 = s.slice(m.index + 1).match(re);
  if (m2) throw new Error(`No-único: ${label}`);
  s = s.replace(re, replacement);
}

// 1) Header de tabla en Vista Previa (Uf)
//    Reemplaza el array fijo de columnas por uno dependiente de s.modoCosteo.
replaceRegexOnce(
  /style:\{background:I\.header\},children:\[\[[\s\S]*?\]\]\.map\(\(\[D,k\]\)=>e\.jsx\("th",\{style:\{padding:"8px 10px",fontSize:12,color:"#fff",textAlign:k,fontFamily:"sans-serif",textTransform:"uppercase"\},children:D\},D\)\)/,
  'style:{background:I.header},children:(s.modoCosteo==="separado"?[["N┬░","center"],["Descripci├│n","left"],["Cant.","right"],["Unidad","right"],["MO","right"],["MAT","right"],["Total","right"]]:s.modoCosteo==="mo"?[["N┬░","center"],["Descripci├│n","left"],["Cant.","right"],["Unidad","right"],["MO Unit.","right"],["Total","right"]]:[["N┬░","center"],["Descripci├│n","left"],["Cant.","right"],["Unidad","right"],["Precio Unit.","right"],["Total","right"]]).map(([D,k])=>e.jsx("th",{style:{padding:"8px 10px",fontSize:12,color:"#fff",textAlign:k,fontFamily:"sans-serif",textTransform:"uppercase"},children:D},D))',
  "header tabla vista previa"
);

// 2) Celdas de precio/total en Vista Previa (Uf)
replaceRegexOnce(
  /e\.jsx\("td",\{style:\{padding:"8px 10px",textAlign:"right",fontSize:13,color:"#777",borderBottom:"1px solid #f0f0f0"\},children:D\.unidad\}\),e\.jsx\("td",\{style:\{padding:"8px 10px",textAlign:"right",fontSize:14,borderBottom:"1px solid #f0f0f0"\},children:ne\(D\.precio\)\}\),e\.jsx\("td",\{style:\{padding:"8px 10px",textAlign:"right",fontSize:14,fontWeight:600,color:I\.header,borderBottom:"1px solid #f0f0f0"\},children:ne\(D\.cant\*D\.precio\)\}\)/,
  'e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:13,color:"#777",borderBottom:"1px solid #f0f0f0"},children:D.unidad}),(s.modoCosteo==="separado"?(()=>{var hr=parseFloat(D.cant)||0,jr=parseFloat(D.precio)||0,Pr=hr*jr,Or=D._tipoCosto||(D._cid?"auto":"mo"),Ar=0,Sr=0;if(Or==="mat")Ar=Pr;else if(Or==="mo")Sr=Pr;else{var wr=parseFloat(D._apuMatUnit)||0;Ar=Math.max(0,Math.min(Pr,wr*hr)),Sr=Math.max(0,Pr-Ar)}return e.jsxs(e.Fragment,{children:[e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:14,borderBottom:"1px solid #f0f0f0"},children:ne(Sr)}),e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:14,borderBottom:"1px solid #f0f0f0"},children:ne(Ar)}),e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:14,fontWeight:600,color:I.header,borderBottom:"1px solid #f0f0f0"},children:ne(Pr)})]})})():s.modoCosteo==="mo"?(()=>{var hr=parseFloat(D.cant)||0,jr=parseFloat(D.precio)||0,Pr=hr*jr,Or=D._tipoCosto||(D._cid?"auto":"mo"),Ar=0,Sr=0;if(Or==="mat")Ar=Pr;else if(Or==="mo")Sr=Pr;else{var wr=parseFloat(D._apuMatUnit)||0;Ar=Math.max(0,Math.min(Pr,wr*hr)),Sr=Math.max(0,Pr-Ar)}var Br=hr?Sr/hr:0;return e.jsxs(e.Fragment,{children:[e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:14,borderBottom:"1px solid #f0f0f0"},children:ne(Br)}),e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:14,fontWeight:600,color:I.header,borderBottom:"1px solid #f0f0f0"},children:ne(Sr)})]})})():e.jsxs(e.Fragment,{children:[e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:14,borderBottom:"1px solid #f0f0f0"},children:ne(D.precio)}),e.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontSize:14,fontWeight:600,color:I.header,borderBottom:"1px solid #f0f0f0"},children:ne(D.cant*D.precio)})]}))',
  "celdas precio/total vista previa"
);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_preview_modo_costeo_regex");

