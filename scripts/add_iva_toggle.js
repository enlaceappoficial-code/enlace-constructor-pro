const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');
let changes = 0;

// =============================================================
// 1. MODIFY Ee FUNCTION to accept 5th param (sinIva)
// =============================================================
const oldEe = 'Ee=(t,i,r,n)=>{t=Array.isArray(t)?t:[];var l0=0,matS=0,noMatS=0;t.forEach(h=>{var cant=parseFloat(h.cant)||0,precio=parseFloat(h.precio)||0,tot=cant*precio,tipo=h._tipoCosto||(h._cid?"auto":"mo"),mat=0,noMat=0;if(tipo==="mat")mat=tot;else if(tipo==="mo")noMat=tot;else{var mu=parseFloat(h._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*cant)),noMat=Math.max(0,tot-mat)}matS+=mat,noMatS+=noMat,l0+=tot});var l=n==="mo"?Math.round(noMatS):Math.round(l0),o=i&&i.moneda?i.moneda.impuesto/100:i&&i.iva||.19,s=l*o,m=l+s,p=r?m*(i&&i.descuento||0):0,C=m-p,b=C*(i&&i.anticipo||.6);return{sub:l,iva:s,bruto:m,desc:p,total:C,anticipo:b,matSub:Math.round(matS),noMatSub:Math.round(noMatS)}},';

const newEe = 'Ee=(t,i,r,n,sinIvaFlag)=>{t=Array.isArray(t)?t:[];var l0=0,matS=0,noMatS=0;t.forEach(h=>{var cant=parseFloat(h.cant)||0,precio=parseFloat(h.precio)||0,tot=cant*precio,tipo=h._tipoCosto||(h._cid?"auto":"mo"),mat=0,noMat=0;if(tipo==="mat")mat=tot;else if(tipo==="mo")noMat=tot;else{var mu=parseFloat(h._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*cant)),noMat=Math.max(0,tot-mat)}matS+=mat,noMatS+=noMat,l0+=tot});var l=n==="mo"?Math.round(noMatS):Math.round(l0),o=sinIvaFlag?0:i&&i.moneda?i.moneda.impuesto/100:i&&i.iva||.19,s=l*o,m=l+s,p=r?m*(i&&i.descuento||0):0,C=m-p,b=C*(i&&i.anticipo||.6);return{sub:l,iva:s,bruto:m,desc:p,total:C,anticipo:b,matSub:Math.round(matS),noMatSub:Math.round(noMatS)}},';

if (content.includes(oldEe)) {
    content = content.replace(oldEe, newEe);
    changes++;
    console.log('1. Ee function updated with sinIvaFlag parameter');
} else {
    console.log('ERROR: Could not find Ee function');
}

// =============================================================
// 2. ADD sinIva TO DEFAULT BUDGET OBJECT
// =============================================================
const oldDefault = 'descuento:!1,estado:"Pendiente"';
const newDefault = 'descuento:!1,sinIva:!1,estado:"Pendiente"';
if (content.includes(oldDefault)) {
    content = content.replace(oldDefault, newDefault);
    changes++;
    console.log('2. sinIva added to default budget object');
} else {
    console.log('WARNING: Could not find default budget object');
}

// Also add sinIva to the existing budget initialization
const oldExisting = 'descuento:m.descuento,estado:m.estado';
const newExisting = 'descuento:m.descuento,sinIva:m.sinIva||!1,estado:m.estado';
if (content.includes(oldExisting)) {
    content = content.replace(oldExisting, newExisting);
    changes++;
    console.log('2b. sinIva added to existing budget init');
} else {
    console.log('WARNING: Could not find existing budget init');
}

// =============================================================
// 3. UPDATE ALL Ee CALLS to pass sinIva
// =============================================================
// Pattern: Ee(X.items, Y, X.descuento, X.modoCosteo) -> add X.sinIva
const eeCallPatterns = [
    // t.items patterns
    { old: 'Ee(t.items,r,t.descuento,t.modoCosteo)', new: 'Ee(t.items,r,t.descuento,t.modoCosteo,t.sinIva)' },
    { old: 'Ee(t.items||[],r,t.descuento,t.modoCosteo)', new: 'Ee(t.items||[],r,t.descuento,t.modoCosteo,t.sinIva)' },
    { old: 'Ee(t.items||[],r,t.descuento,modo)', new: 'Ee(t.items||[],r,t.descuento,modo,t.sinIva)' },
    { old: 'Ee(t.items,r||{},t.descuento,t.modoCosteo)', new: 'Ee(t.items,r||{},t.descuento,t.modoCosteo,t.sinIva)' },
    { old: 'Ee(t.items,n,t.descuento,t.modoCosteo)', new: 'Ee(t.items,n,t.descuento,t.modoCosteo,t.sinIva)' },
    { old: 'Ee(t.items,i||{},t.descuento,t.modoCosteo)', new: 'Ee(t.items,i||{},t.descuento,t.modoCosteo,t.sinIva)' },
    // h,r pattern (inside HTML generator)
    { old: 'Ee(h,r,t.descuento,m)', new: 'Ee(h,r,t.descuento,m,t.sinIva)' },
    // p,r pattern
    { old: 'Ee(p,r,t.descuento,modo)', new: 'Ee(p,r,t.descuento,modo,t.sinIva)' },
    // s.items patterns
    { old: 'Ee(s.items,n,s.descuento,s.modoCosteo)', new: 'Ee(s.items,n,s.descuento,s.modoCosteo,s.sinIva)' },
    // I.items pattern
    { old: 'Ee(I.items,i,I.descuento,I.modoCosteo)', new: 'Ee(I.items,i,I.descuento,I.modoCosteo,I.sinIva)' },
    // p.items pattern
    { old: 'Ee(p.items,r,p.descuento,p.modoCosteo)', new: 'Ee(p.items,r,p.descuento,p.modoCosteo,p.sinIva)' },
    // L.items pattern
    { old: 'Ee(L.items,n,L.descuento,L.modoCosteo)', new: 'Ee(L.items,n,L.descuento,L.modoCosteo,L.sinIva)' },
    // re.items pattern
    { old: 'Ee(re.items,n,re.descuento,re.modoCosteo)', new: 'Ee(re.items,n,re.descuento,re.modoCosteo,re.sinIva)' },
    // q.items pattern
    { old: 'Ee(q.items,n,q.descuento,q.modoCosteo)', new: 'Ee(q.items,n,q.descuento,q.modoCosteo,q.sinIva)' },
    // m.items pattern
    { old: 'Ee(m.items,n,m.descuento,m.modoCosteo)', new: 'Ee(m.items,n,m.descuento,m.modoCosteo,m.sinIva)' },
    // Q.items pattern
    { old: 'Ee(Q.items,n,Q.descuento,Q.modoCosteo)', new: 'Ee(Q.items,n,Q.descuento,Q.modoCosteo,Q.sinIva)' },
    // F,r pattern
    { old: 'Ee(F,r,t.descuento,t.modoCosteo||"completo")', new: 'Ee(F,r,t.descuento,t.modoCosteo||"completo",t.sinIva)' },
    // I.items,r pattern
    { old: 'Ee(I.items,r,I.descuento,I.modoCosteo)', new: 'Ee(I.items,r,I.descuento,I.modoCosteo,I.sinIva)' },
];

eeCallPatterns.forEach(p => {
    const count = content.split(p.old).length - 1;
    if (count > 0) {
        content = content.split(p.old).join(p.new);
        changes++;
        console.log(`3. Updated ${count}x: ${p.old.substring(0, 40)}...`);
    }
});

// =============================================================
// 4. ADD IVA TOGGLE SWITCH in the editor UI (next to descuento)
// =============================================================
const descuentoSwitch = 'e.jsxs("span",{style:{fontSize:13,color:a.muted},children:["Descuento (",Math.round(r.descuento*100),"%)"]})';

const ivaToggleBlock = 'e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:a.sb,borderRadius:7,marginBottom:4},children:[e.jsx("span",{style:{fontSize:13,color:a.muted},children:"Incluir IVA"}),e.jsx("div",{onClick:()=>D(re=>u(d({},re),{sinIva:!re.sinIva})),style:{width:32,height:18,borderRadius:9,background:I.sinIva?a.border:a.accent,position:"relative",cursor:"pointer"},children:e.jsx("div",{style:{position:"absolute",width:12,height:12,background:"#fff",borderRadius:"50%",top:3,left:I.sinIva?3:17,transition:"left .2s"}})})]}),' + descuentoSwitch;

if (content.includes(descuentoSwitch)) {
    content = content.replace(descuentoSwitch, ivaToggleBlock);
    changes++;
    console.log('4. IVA toggle switch added to UI');
} else {
    console.log('ERROR: Could not find descuento switch location');
}

// =============================================================
// 5. ADD sinIva indicator in the totals display
// =============================================================
// The existing totals show IVA line - we need to hide it when sinIva is true
// Pattern: ["IVA (X%)", value] in the totals section
const oldIvaLine = '["IVA ("+Math.round(n.iva*100)+"%)"';
const newIvaLine = '...I.sinIva?[]:["IVA ("+Math.round(n.iva*100)+"%)"';
// This one is trickier - let's find the totals display
const totalsPattern = '[["Subtotal Neto",p],["IVA ("+Math.round(n.iva*100)+"%)",C],...s.descuento?[["Descuento",-b]]:[]]';
const newTotalsPattern = '[["Subtotal Neto",p],...I.sinIva?[["Sin IVA","—"]]:[[r.moneda&&r.moneda.nombreImp||"IVA"+" ("+Math.round(n.iva*100)+"%)",C]],...I.sinIva?[]:(s.descuento?[["Descuento",-b]]:[])]';

// Actually let's be more careful and just check if this string exists
if (content.includes(totalsPattern)) {
    content = content.replace(totalsPattern, newTotalsPattern);
    changes++;
    console.log('5. Totals display updated for sinIva');
} else {
    console.log('WARNING: Could not find totals display pattern - will try alternate');
    // Try simpler approach
    const oldT2 = '["Subtotal Neto",p],["IVA ("+Math.round(n.iva*100)+"%)",C]';
    const newT2 = '["Subtotal Neto",p],...I.sinIva?[]:[[r.moneda&&r.moneda.nombreImp||"IVA"+" ("+Math.round(n.iva*100)+"%)",C]]';
    if (content.includes(oldT2)) {
        content = content.replace(oldT2, newT2);
        changes++;
        console.log('5b. Totals display updated (alternate)');
    }
}

// =============================================================
// SAVE
// =============================================================
fs.writeFileSync('src/assets/index.js', content, 'utf8');
console.log('\nTotal changes applied:', changes);
