const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const changes = [
  {
    from: 'onConfirm:(W,T,L)=>Y(k.idx,W,T,L)',
    to: 'onConfirm:(W,T,L,E)=>Y(k.idx,W,T,L,E)',
  },
  {
    from: 'Y=(W,T,L,E)=>{D(J=>{var re=[...J.items];return re[W]=u(d({},re[W]),{precio:T,_rendimiento:L,_dotacion:E}),u(d({},J),{items:re})});',
    to: 'Y=(W,T,L,E,M)=>{D(J=>{var re=[...J.items];return re[W]=u(d({},re[W]),{precio:T,_rendimiento:L,_dotacion:E,_apuMatUnit:M}),u(d({},J),{items:re})});',
  },
  {
    from: 'if(q){D(J=>u(d({},J),{items:E})),["m┬▓","m┬│","ml","m2","m3"].includes(M.unidad)?A({idx:W,unidad:M.unidad,_apuPendiente:{idx:W,catItem:M,apu:q}}):R({idx:W,catItem:M,apu:q});return}}}D(J=>u(d({},J),{items:E}))},',
    to: 'if(q){E[W]._apuMatUnit=parseFloat(li(q,l||[]).matTotal)||0;D(J=>u(d({},J),{items:E})),["m┬▓","m┬│","ml","m2","m3"].includes(M.unidad)?A({idx:W,unidad:M.unidad,_apuPendiente:{idx:W,catItem:M,apu:q}}):R({idx:W,catItem:M,apu:q});return}}}D(J=>u(d({},J),{items:E}))},',
  },
  {
    from: 'le=W=>{var T=n&&n.find(q=>q.catalogId===W.id&&!q.esSubcontrato&&q.materiales&&q.materiales.length>0),L=u(d({},f()),{_cid:String(W.id),desc:W.desc,unidad:W.unidad,precio:W.precio,_tipoCosto:"auto"}),E=[...I.items,L],M=E.length-1;',
    to: 'le=W=>{var T=n&&n.find(q=>q.catalogId===W.id&&!q.esSubcontrato&&q.materiales&&q.materiales.length>0),L=u(d({},f()),{_cid:String(W.id),desc:W.desc,unidad:W.unidad,precio:W.precio,_tipoCosto:"auto"});T&&(L._apuMatUnit=parseFloat(li(T,l||[]).matTotal)||0);var E=[...I.items,L],M=E.length-1;',
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

