const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'var ce=W._tipoCosto||(W._cid?"auto":"mo"),me=0,de=0;if(ce==="mat"){me=ie,de=0}else if(ce==="mo"){me=0,de=ie}else{var he=i.find(At=>At.id===parseInt(W._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}me=ci,de=Math.max(0,At-ci)}else{me=0,de=ie}}var mt=Math.round(G*me),nm=Math.round(G*de),tt=Math.round(G*ie);if(oe==="mo")return ne(nm);if(oe==="separado")return ne(mt)+" + "+ne(nm)+" = "+ne(tt);return ne(tt)';

const to =
  'var ce=W._tipoCosto||(W._cid?"auto":"mo"),me=0,de=0;if(!W._cid){if(ce==="mat"){me=ie,de=0}else if(ce==="mo"){me=0,de=ie}else{me=0,de=ie}}else{var he=i.find(At=>At.id===parseInt(W._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}me=ci,de=Math.max(0,At-ci)}else{me=0,de=ie}if(ce==="mat"){de=0}else if(ce==="mo"){me=0}}var mt=Math.round(G*me),nm=Math.round(G*de),tt=Math.round(G*(me+de));if(oe==="mo")return ne(nm);if(oe==="separado"){if(ce==="mat")return ne(mt);if(ce==="mo")return ne(nm);return ne(mt)+" + "+ne(nm)+" = "+ne(tt)}return ne(tt)';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");
