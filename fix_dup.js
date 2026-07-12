const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Fix `ce` (onDuplicate function)
// Old: 
// ce=H=>{var ae=l.nextNum,N=u(d({},H),{id:ae,fecha:Xt(),estado:"Pendiente",items:(H.items||[]).map(me=>u(d({},me),{_cid:me._cid||""})),_isDuplicate:!0,_srcId:H.id,_newId:ae}),de={fecha:Wt(),accion:"⧉ Duplicado desde N° "+H.id};w(B.map(me=>me.id===H.id?u(d({},me),{changelog:[...me.changelog||[],de].slice(-20)}):me)),o(me=>u(d({},me),{nextNum:ae+1})),R(N),f("edit")},
// We want:
// - id: ""
// - do not call `o(me=>u(d({},me),{nextNum:ae+1}))`
// - change `accion: "⧉ Duplicado a nuevo presupuesto"` (since we don't know the exact new ID yet until it saves)

const oldCe = `ce=H=>{var ae=l.nextNum,N=u(d({},H),{id:ae,fecha:Xt(),estado:"Pendiente",items:(H.items||[]).map(me=>u(d({},me),{_cid:me._cid||""})),_isDuplicate:!0,_srcId:H.id,_newId:ae}),de={fecha:Wt(),accion:"\\u29C9 Duplicado desde N\\u00B0 "+H.id};w(B.map(me=>me.id===H.id?u(d({},me),{changelog:[...me.changelog||[],de].slice(-20)}):me)),o(me=>u(d({},me),{nextNum:ae+1})),R(N),f("edit")}`;

const newCe = `ce=H=>{var ae=l.nextNum,N=u(d({},H),{id:"",fecha:Xt(),estado:"Pendiente",items:(H.items||[]).map(me=>u(d({},me),{_cid:me._cid||""})),_isDuplicate:!0,_srcId:H.id,_newId:ae}),de={fecha:Wt(),accion:"\\u29C9 Duplicado hacia nuevo presupuesto"};w(B.map(me=>me.id===H.id?u(d({},me),{changelog:[...me.changelog||[],de].slice(-20)}):me)),R(N),f("edit")}`;

if (c.includes(oldCe)) {
  c = c.replace(oldCe, newCe);
} else {
  console.log("oldCe not found!");
}

// 2. Fix `J` (save function)
// Old:
// J=H=>{var ae=H.id?H.id:l.nextNum;w(me=>me.find(pe=>pe.id===H.id)?me.map(pe=>pe.id===H.id?H:pe):[...me,u(d({},H),{id:ae})]),!H.id&&o(me=>u(d({},me),{nextNum:ae+1})),R(null),f("history"),Q("✅ Presupuesto guardado")}
// We want to remove `_isDuplicate` and related props before saving.

const oldJ = `J=H=>{var ae=H.id?H.id:l.nextNum;w(me=>me.find(pe=>pe.id===H.id)?me.map(pe=>pe.id===H.id?H:pe):[...me,u(d({},H),{id:ae})]),!H.id&&o(me=>u(d({},me),{nextNum:ae+1})),R(null),f("history"),Q("\\u2705 Presupuesto guardado")}`;

const newJ = `J=H=>{var ae=H.id?H.id:l.nextNum;var HClean=u(d({},H),{id:ae,_isDuplicate:false,_srcId:undefined,_newId:undefined});w(me=>me.find(pe=>pe.id===H.id)?me.map(pe=>pe.id===H.id?HClean:pe):[...me,HClean]),!H.id&&o(me=>u(d({},me),{nextNum:ae+1})),R(null),f("history"),Q("\\u2705 Presupuesto guardado")}`;

if (c.includes(oldJ)) {
  c = c.replace(oldJ, newJ);
} else {
  console.log("oldJ not found!");
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Fixed duplication bug.');
