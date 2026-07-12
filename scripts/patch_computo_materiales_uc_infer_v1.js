const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

// 1) Cantidad Total: mostrar decimales (no ceil)
{
  const from =
    'e.jsx("td",{style:u(d({},c.td),{fontWeight:700,color:a.text,padding:"8px 10px",textAlign:"right"}),children:Math.ceil(P.totalCant)})';
  const to =
    'e.jsx("td",{style:u(d({},c.td),{fontWeight:700,color:a.text,padding:"8px 10px",textAlign:"right"}),children:+(P.totalCant||0).toFixed(3)})';
  if (!s.includes(from)) throw new Error("No se encontró el td de Cantidad Total (Math.ceil).");
  s = s.replace(from, to);
}

// 2) A comprar: usar uc si existe; si no, inferir por nombre/unidad; si no, fallback a unidad base
{
  const from =
    'e.jsx("td",{style:u(d({},c.td),{padding:"8px 10px",textAlign:"right"}),children:P.mat.uc?e.jsxs("span",{style:{color:"#f5a020",fontWeight:700,fontSize:13},children:[Math.ceil(P.totalCant/P.mat.uc.q)," ",e.jsx("span",{style:{fontSize:11,color:a.muted,fontWeight:400},children:P.mat.uc.label})]}):e.jsx("span",{style:{color:a.muted,fontSize:12},children:"—"})})';

  const to =
    'e.jsx("td",{style:u(d({},c.td),{padding:"8px 10px",textAlign:"right"}),children:P.totalCant>0?(()=>{var U=P.mat&&P.mat.uc&&P.mat.uc.q>0?P.mat.uc:null;if(!U){var G=String(P.mat&&P.mat.nombre||"").toLowerCase(),ie=String(P.mat&&P.mat.unidad||"").toLowerCase(),oe=String(P.mat&&P.mat.cat||"").toLowerCase();var ce=ie==="ml"||ie==="m"||ie.indexOf("ml")!==-1,te=ie==="m²"||ie==="m2"||ie.indexOf("m²")!==-1||ie.indexOf("m2")!==-1,fe=ie==="m³"||ie==="m3"||ie.indexOf("m³")!==-1||ie.indexOf("m3")!==-1;if(ce&&/corniza|guardapolvo|moldura|tapacan|tapacanto/i.test(G))U={q:2.4,label:"unidades 2.4m"};else if(ce&&(/perfil|canal|solera|montante|omega|correa|angulo|viga|tubo|fierro|barra|varilla|pletina/i.test(G)||/metalcon|acero/i.test(oe)))U=/(tubo|ppr|pvc|conduit)/i.test(G)?{q:6,label:"barras 6m"}:{q:3,label:"barras 3m"};else if(te&&/(osb|volcanita|placa|plancha|terciado|yeso|fibrocemento)/i.test(G)){var ve=G.replace(",","."),be=ve.match(/(\\d+(?:\\.\\d+)?)\\s*x\\s*(\\d+(?:\\.\\d+)?)\\s*m\\b/i);if(be){var je=(parseFloat(be[1])||0)*(parseFloat(be[2])||0);je>0.05?U={q:je,label:`planchas ${parseFloat(be[1])}x${parseFloat(be[2])}m`}:U=null}U||(U={q:2.88,label:"planchas 1.2x2.4m"})}else if(fe&&/(arena|ripio|grava|gravilla)/i.test(G))U={q:.025,label:"sacos 25L"}}return U&&U.q>0?e.jsxs("span",{style:{color:"#f5a020",fontWeight:700,fontSize:13},children:[Math.ceil((P.totalCant||0)/U.q)," ",e.jsx("span",{style:{fontSize:11,color:a.muted,fontWeight:400},children:U.label})]}):e.jsxs("span",{style:{color:"#f5a020",fontWeight:700,fontSize:13},children:[Math.ceil(P.totalCant)," ",e.jsx("span",{style:{fontSize:11,color:a.muted,fontWeight:400},children:P.mat.unidad})]})})():e.jsx("span",{style:{color:a.muted,fontSize:12},children:"—"})})';

  if (!s.includes(from)) throw new Error("No se encontró el td de A comprar basado en P.mat.uc.");
  s = s.replace(from, to);
}

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_computo_materiales_uc_infer_v1");

