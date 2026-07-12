const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const re =
  /var W=Math\.round\(I\.items\.reduce\(\(re,Q\)=>re\+\(parseFloat\(Q\.cant\)\|\|0\)\*\(parseFloat\(Q\.precio\)\|\|0\),0\)\),T=r&&r\.iva\|\|\.19,L=Math\.round\(W\*T\),E=W\+L,M=I\.descuento\?Math\.round\(E\*\(r\.descuento\|\|\.05\)\):0,q=E-M,J=Math\.round\(q\*\(r\.anticipo\|\|\.6\)\);/;

const m = s.match(re);
if (!m || m.length !== 1) process.exit(2);

const replacement =
  'var te=0,fe=0,ve=0;(I.items||[]).forEach(Q=>{var G=parseFloat(Q.cant)||0,ie=parseFloat(Q.precio)||0,oe=Q._tipoCosto||(Q._cid?"auto":"mo"),ce=0,de=0;if(oe==="mat"){ce=ie,de=0}else if(oe==="mo"){ce=0,de=ie}else{var he=i.find(At=>At.id===parseInt(Q._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var li=ie/At;ci*=li,At=ie}ce=ci,de=Math.max(0,At-ci)}else{ce=0,de=ie}}te+=ce*G,fe+=de*G,ve+=ie*G});var W=(I.modoCosteo||"completo")==="mo"?Math.round(fe):Math.round(ve),T=r&&r.iva||.19,L=Math.round(W*T),E=W+L,M=I.descuento?Math.round(E*(r.descuento||.05)):0,q=E-M,J=Math.round(q*(r.anticipo||.6));';

s = s.replace(re, replacement);
if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");
