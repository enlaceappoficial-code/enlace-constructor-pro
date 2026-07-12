const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `        e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid "+th.border,background:th.bg},children:[
           e.jsx("button",{style:{flex:1,background:"transparent",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",color:detailTab==="resumen"?th.fg:th.muted,borderBottom:detailTab==="resumen"?"2px solid "+th.fg:"2px solid transparent"},onClick:function(){setDetailTab("resumen")},children:"\\uD83D\\uDCCA Resumen de Oportunidad"}),
           e.jsx("button",{style:{flex:1,background:"transparent",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",color:detailTab==="guia"?th.fg:th.muted,borderBottom:detailTab==="guia"?"2px solid "+th.fg:"2px solid transparent"},onClick:function(){setDetailTab("guia")},children:"\\u200D\\uD83C\\uDFEB Asistente de Postulación"})
        ]}),`;

const replacement = `        e.jsx("div",{style:{padding:"12px 24px",background:"var(--surface)"},children:
           e.jsxs("div",{style:{display:"flex",background:"var(--bg)",borderRadius:"12px",padding:"4px",border:"1px solid var(--border)",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.05)"},children:[
             e.jsx("button",{style:{flex:1,background:detailTab==="resumen"?th.accent:"transparent",border:"none",borderRadius:"8px",padding:"10px",fontSize:13,fontWeight:800,cursor:"pointer",color:detailTab==="resumen"?"#050a10":th.muted,boxShadow:detailTab==="resumen"?"0 2px 4px rgba(0,0,0,0.2)":"none",transition:"all 0.25s ease"},onClick:function(){setDetailTab("resumen")},children:"\\uD83D\\uDCCA Resumen de Licitación"}),
             e.jsx("button",{style:{flex:1,background:detailTab==="guia"?th.accent:"transparent",border:"none",borderRadius:"8px",padding:"10px",fontSize:13,fontWeight:800,cursor:"pointer",color:detailTab==="guia"?"#050a10":th.muted,boxShadow:detailTab==="guia"?"0 2px 4px rgba(0,0,0,0.2)":"none",transition:"all 0.25s ease"},onClick:function(){setDetailTab("guia")},children:"\\u200D\\uD83C\\uDFEB Asistente de Postulación"})
           ]})
        }),`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replacement);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Success! Modal tabs replaced with a colorful pill container.");
} else {
    console.log("Error: Could not find exact string. Please verify formatting.");
}
