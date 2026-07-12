const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Regex for `ce`
// Matches: ce=H=>{var ae=l.nextNum,N=u(d({},H),{id:ae,fecha:Xt(),estado:"Pendiente",items:(H.items||[]).map(me=>u(d({},me),{_cid:me._cid||""})),_isDuplicate:!0,_srcId:H.id,_newId:ae}),de={fecha:Wt(),accion:"⧉ Duplicado desde N° "+H.id};w(B.map(me=>me.id===H.id?u(d({},me),{changelog:[...me.changelog||[],de].slice(-20)}):me)),o(me=>u(d({},me),{nextNum:ae+1})),R(N),f("edit")}
// Replaces with:
// ce=H=>{var ae=l.nextNum,N=u(d({},H),{id:"",fecha:Xt(),estado:"Pendiente",items:(H.items||[]).map(me=>u(d({},me),{_cid:me._cid||""})),_isDuplicate:!0,_srcId:H.id,_newId:ae}),de={fecha:Wt(),accion:"⧉ Duplicado hacia nuevo presupuesto"};w(B.map(me=>me.id===H.id?u(d({},me),{changelog:[...me.changelog||[],de].slice(-20)}):me)),R(N),f("edit")}

const rxCe = /ce\s*=\s*([a-zA-Z0-9_]+)\s*=>\s*\{\s*var\s+([a-zA-Z0-9_]+)\s*=\s*[a-zA-Z0-9_]+\.nextNum,([a-zA-Z0-9_]+)\s*=\s*u\(d\(\{\},\1\),\{id:\2([^}]+)\}\),([a-zA-Z0-9_]+)\s*=\s*\{([^}]+)Duplicado desde[^}]+\};\s*([a-zA-Z0-9_]+)\([^;]+\),\s*([a-zA-Z0-9_]+)\([^;]+nextNum:\2\+1\}\)\),\s*([a-zA-Z0-9_]+)\(\3\),\s*([a-zA-Z0-9_]+)\("edit"\)\}/g;

const matchCe = rxCe.exec(c);
if (matchCe) {
  const [full, H, ae, N, idRest, de, deRest, w, o, R, f] = matchCe;
  
  // Reconstruct ce
  // We need to keep everything but change id, the action string, and remove the `o(...)` call.
  // Wait, let's just do standard replace using index since we know it exactly.
}

// Let's just find the index of "ce=H=>" and "J=H=>" and slice them.
const idxCe = c.indexOf('ce=H=>{var ae=l.nextNum');
if (idxCe > -1) {
    const endCe = c.indexOf(',f("edit")}', idxCe) + ',f("edit")}'.length;
    const oldCe = c.substring(idxCe, endCe);
    
    // String replaces on oldCe
    let newCe = oldCe.replace('id:ae', 'id:""');
    newCe = newCe.replace(',o(me=>u(d({},me),{nextNum:ae+1}))', ''); // remove increment
    newCe = newCe.replace('"⧉ Duplicado desde N° "+H.id', '"⧉ Duplicado hacia nuevo presupuesto"'); // fix log
    
    c = c.replace(oldCe, newCe);
    console.log("Replaced ce successfully.");
} else {
    console.log("idxCe not found!");
}

const idxJ = c.indexOf('J=H=>{var ae=H.id?H.id:l.nextNum');
if (idxJ > -1) {
    const endJ = c.indexOf(',Q("✅ Presupuesto guardado")}', idxJ) + ',Q("✅ Presupuesto guardado")}'.length;
    let oldJ = c.substring(idxJ, endJ);
    if(oldJ.length === 0) {
        // Unicode check
        const endJ2 = c.indexOf('Presupuesto guardado")}', idxJ) + 'Presupuesto guardado")}'.length;
        oldJ = c.substring(idxJ, endJ2);
    }
    
    // String replaces on oldJ
    // J=H=>{var ae=H.id?H.id:l.nextNum;w(me=>me.find(pe=>pe.id===H.id)?me.map(pe=>pe.id===H.id?H:pe):[...me,u(d({},H),{id:ae})]),!H.id&&o(me=>u(d({},me),{nextNum:ae+1})),R(null),f("history"),Q("✅ Presupuesto guardado")}
    let newJ = oldJ.replace('u(d({},H),{id:ae})', 'u(d({},H),{id:ae,_isDuplicate:false,_srcId:undefined,_newId:undefined})');
    newJ = newJ.replace('H:pe', 'u(d({},H),{id:ae,_isDuplicate:false,_srcId:undefined,_newId:undefined}):pe');
    
    c = c.replace(oldJ, newJ);
    console.log("Replaced J successfully.");
} else {
    console.log("idxJ not found!");
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
