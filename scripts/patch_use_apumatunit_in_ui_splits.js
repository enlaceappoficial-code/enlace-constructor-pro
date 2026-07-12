const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const changes = [
  {
    from:
      'var ce=W._tipoCosto||(W._cid?"auto":"mo"),me=0,de=0;if(!W._cid){if(ce==="mat"){me=ie,de=0}else if(ce==="mo"){me=0,de=ie}else{me=0,de=ie}}else{var he=i.find(At=>At.id===parseInt(W._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}me=ci,de=Math.max(0,At-ci)}else{me=0,de=ie}if(ce==="mat"){de=0}else if(ce==="mo"){me=0}}var mt=Math.round(G*me),nm=Math.round(G*de),tt=Math.round(G*(me+de));if(oe==="mo")return ne(nm);if(oe==="separado"){if(ce==="mat")return ne(mt);if(ce==="mo")return ne(nm);return "MAT "+ne(mt)+" + MO "+ne(nm)+" = "+ne(tt)}return ne(tt)',
    to:
      'var ce=W._tipoCosto||(W._cid?"auto":"mo"),me=0,de=0,pe=parseFloat(W._apuMatUnit)||0;if(pe>0){me=pe,de=Math.max(0,ie-pe)}else if(!W._cid){if(ce==="mat"){me=ie,de=0}else if(ce==="mo"){me=0,de=ie}else{me=0,de=ie}}else{var he=i.find(At=>At.id===parseInt(W._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}me=ci,de=Math.max(0,At-ci)}else{me=0,de=ie}}if(ce==="mat"){de=0}else if(ce==="mo"){me=0}var mt=Math.round(G*me),nm=Math.round(G*de),tt=Math.round(G*(me+de));if(oe==="mo")return ne(nm);if(oe==="separado"){if(ce==="mat")return ne(mt);if(ce==="mo")return ne(nm);return "MAT "+ne(mt)+" + MO "+ne(nm)+" = "+ne(tt)}return ne(tt)',
  },
  {
    from:
      'var G=parseFloat(Q.cant)||0,ie=parseFloat(Q.precio)||0,oe=Q._tipoCosto||(Q._cid?"auto":"mo"),ce=0,de=0;if(!Q._cid){if(oe==="mat"){ce=ie,de=0}else if(oe==="mo"){ce=0,de=ie}else{ce=0,de=ie}}else{var he=i.find(At=>At.id===parseInt(Q._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}ce=ci,de=Math.max(0,At-ci)}else{ce=0,de=ie}if(oe==="mat"){de=0}else if(oe==="mo"){ce=0}}te+=ce*G,fe+=de*G,ve+=(ce+de)*G',
    to:
      'var G=parseFloat(Q.cant)||0,ie=parseFloat(Q.precio)||0,oe=Q._tipoCosto||(Q._cid?"auto":"mo"),ce=0,de=0,pe=parseFloat(Q._apuMatUnit)||0;if(pe>0){ce=pe,de=Math.max(0,ie-pe)}else if(!Q._cid){if(oe==="mat"){ce=ie,de=0}else if(oe==="mo"){ce=0,de=ie}else{ce=0,de=ie}}else{var he=i.find(At=>At.id===parseInt(Q._cid));var je=he&&n&&n.find(At=>At.catalogId===he.id&&!At.esSubcontrato&&At.materiales&&At.materiales.length>0);if(je){var ke=li(je,l||[]),At=ke&&ke.precioFinal||ie,ci=ke&&ke.matTotal||0;if(At>0&&ie>0){var ri=ie/At;ci*=ri,At=ie}ce=ci,de=Math.max(0,At-ci)}else{ce=0,de=ie}}if(oe==="mat"){de=0}else if(oe==="mo"){ce=0}te+=ce*G,fe+=de*G,ve+=(ce+de)*G',
  },
];

let ok = false;
for (const c of changes) {
  if (s.includes(c.from)) {
    s = s.split(c.from).join(c.to);
    ok = true;
  }
}

if (!ok) process.exit(2);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");

