const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'if(oe==="mat"){ce=ie,de=0}else if(oe==="mo"){ce=0,de=ie}else{var he=i.find(At=>At.id===parseInt(Q._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}ce=ci,de=Math.max(0,At-ci)}else{ce=0,de=ie}}te+=ce*G,fe+=de*G,ve+=ie*G';

const to =
  'if(!Q._cid){if(oe==="mat"){ce=ie,de=0}else if(oe==="mo"){ce=0,de=ie}else{ce=0,de=ie}}else{var he=i.find(At=>At.id===parseInt(Q._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}ce=ci,de=Math.max(0,At-ci)}else{ce=0,de=ie}if(oe==="mat"){de=0}else if(oe==="mo"){ce=0}}te+=ce*G,fe+=de*G,ve+=(ce+de)*G';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");
