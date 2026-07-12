const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const sIdx = c.indexOf('children:[\\n           e.jsx("button",{style:{flex:1,background:detailTab==="resumen"?(th.accent+"15"):"transparent",border:"none",padding:"14px",fontSize:14,fontWeight:800,cursor:"pointer",color:detailTab==="resumen"?th.accent:th.muted,borderBottom:detailTab==="resumen"?"3px solid "+th.accent:"3px solid transparent",transition:"all 0.2s"},onClick:function(){setDetailTab("resumen")},children:"\\uD83D\\uDCCA Resumen de Oportunidad"}),');

if (sIdx !== -1) {
    const divStart = c.lastIndexOf('e.jsxs("div",{style:{display:"flex",width:"100%",borderBottom:"1px solid "+th.border}', sIdx);
    if (divStart !== -1) {
        const divEnd = c.indexOf(']}),', sIdx) + 4;
        const targetStr = c.substring(divStart, divEnd);
        const replacement = `e.jsx("div",{style:{padding:"12px 24px",background:"var(--surface)"},children:
           e.jsxs("div",{style:{display:"flex",background:"var(--dark-surface)",borderRadius:"10px",padding:"4px",border:"1px solid var(--border)"},children:[
             e.jsx("button",{style:{flex:1,background:detailTab==="resumen"?th.accent:"transparent",border:"none",borderRadius:"8px",padding:"10px",fontSize:13,fontWeight:800,cursor:"pointer",color:detailTab==="resumen"?"#000":th.text,boxShadow:detailTab==="resumen"?"0 2px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.25s ease"},onClick:function(){setDetailTab("resumen")},children:"\\uD83D\\uDCCA Resumen de Licitación"}),
             e.jsx("button",{style:{flex:1,background:detailTab==="guia"?th.accent:"transparent",border:"none",borderRadius:"8px",padding:"10px",fontSize:13,fontWeight:800,cursor:"pointer",color:detailTab==="guia"?"#000":th.text,boxShadow:detailTab==="guia"?"0 2px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.25s ease"},onClick:function(){setDetailTab("guia")},children:"\\u200D\\uD83C\\uDFEB Asistente de Postulación"})
           ]})
         }),`;
        c = c.replace(targetStr, replacement);
        fs.writeFileSync('src/assets/index.js', c);
        console.log("Success! Tabs updated.");
    } else {
        console.log("Could not find start of div");
    }
} else {
    console.log("Could not find buttons");
}
