const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Fix Modal Container Background
const targetModalBg = `e.jsxs("div",{style:{background:th.bg,width:"100%",maxWidth:800,maxHeight:"90vh",borderRadius:12,boxShadow:"0 10px 25px rgba(0,0,0,0.3)",overflow:"hidden",display:"flex",flexDirection:"column"},onClick:function(ev){ev.stopPropagation()},children:[`;
const replaceModalBg = `e.jsxs("div",{style:{background:th.card||th.bg,width:"100%",maxWidth:800,maxHeight:"90vh",borderRadius:12,boxShadow:"0 10px 25px rgba(0,0,0,0.3)",overflow:"hidden",display:"flex",flexDirection:"column"},onClick:function(ev){ev.stopPropagation()},children:[`;

// 2. Fix Tabs
const targetTabs = `e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid "+th.border,background:th.bg},children:[
           e.jsx("button",{style:{flex:1,background:"transparent",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",color:detailTab==="resumen"?th.fg:th.muted,borderBottom:detailTab==="resumen"?"2px solid "+th.fg:"2px solid transparent"},onClick:function(){setDetailTab("resumen")},children:"\\uD83D\\uDCCA Resumen de Oportunidad"}),
           e.jsx("button",{style:{flex:1,background:"transparent",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",color:detailTab==="guia"?th.fg:th.muted,borderBottom:detailTab==="guia"?"2px solid "+th.fg:"2px solid transparent"},onClick:function(){setDetailTab("guia")},children:"\\u200D\\uD83C\\uDFEB Asistente de Postulación"})
        ]}),`;
const replaceTabs = `e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid "+th.border,background:th.sb||th.bg},children:[
           e.jsx("button",{style:{flex:1,background:detailTab==="resumen"?(th.accent+"15"):"transparent",border:"none",padding:"14px",fontSize:14,fontWeight:800,cursor:"pointer",color:detailTab==="resumen"?th.accent:th.muted,borderBottom:detailTab==="resumen"?"3px solid "+th.accent:"3px solid transparent",transition:"all 0.2s"},onClick:function(){setDetailTab("resumen")},children:"\\uD83D\\uDCCA Resumen de Oportunidad"}),
           e.jsx("button",{style:{flex:1,background:detailTab==="guia"?(th.accent+"15"):"transparent",border:"none",padding:"14px",fontSize:14,fontWeight:800,cursor:"pointer",color:detailTab==="guia"?th.accent:th.muted,borderBottom:detailTab==="guia"?"3px solid "+th.accent:"3px solid transparent",transition:"all 0.2s"},onClick:function(){setDetailTab("guia")},children:"\\u200D\\uD83C\\uDFEB Asistente de Postulación"})
        ]}),`;

// 3. Fix Checklist backgrounds
// Instead of matching exact long string, replace globally within the checklist context.
if (c.includes(targetModalBg)) c = c.replace(targetModalBg, replaceModalBg);
if (c.includes(targetTabs)) c = c.replace(targetTabs, replaceTabs);

// Replace checklist background (two occurrences in the file from the checklist map function)
const targetChecklistBg = `background:isChecked?"rgba(52,211,153,0.1)":th.bg`;
const replaceChecklistBg = `background:isChecked?"rgba(52,211,153,0.1)":"transparent"`;
c = c.replaceAll(targetChecklistBg, replaceChecklistBg);

// Replace "Criterios de evaluacion" box
const targetCrit = `e.jsx("div",{style:{background:th.bg,border:"1px solid "+th.border,borderLeft:"4px solid #3b82f6",padding:16,borderRadius:8},children:`;
const replaceCrit = `e.jsx("div",{style:{background:"transparent",border:"1px solid "+th.border,borderLeft:"4px solid #3b82f6",padding:16,borderRadius:8},children:`;
c = c.replaceAll(targetCrit, replaceCrit);

// Fix Organismo/Fechas block background
const targetOrgBox = `style:{background:th.border,padding:12,borderRadius:8}`;
const replaceOrgBox = `style:{background:th.sb||th.border,padding:12,borderRadius:8,border:"1px solid "+th.border}`;
c = c.replaceAll(targetOrgBox, replaceOrgBox);

// Fix Items box background
const targetItemsBox = `style:{background:th.bg,border:"1px solid "+th.border,borderRadius:8,overflow:"hidden",marginBottom:24}`;
const replaceItemsBox = `style:{background:"transparent",border:"1px solid "+th.border,borderRadius:8,overflow:"hidden",marginBottom:24}`;
c = c.replaceAll(targetItemsBox, replaceItemsBox);

// Fix calculator input background
const targetInputBg = `style:d(d({},sty.inp),{width:"100%",background:th.bg,border:"1px solid "+th.border,padding:"8px 12px",borderRadius:6,color:th.text})}`;
const replaceInputBg = `style:d(d({},sty.inp),{width:"100%",background:"transparent",border:"1px solid "+th.border,padding:"8px 12px",borderRadius:6,color:th.text})}`;
c = c.replaceAll(targetInputBg, replaceInputBg);

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('UI styling fixed for both themes.');
