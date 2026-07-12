const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Channel Badge & Title
const oldTitle = 'e.jsxs("div",{style:{marginBottom:4},children:[it.canal==="compra_agil"?e.jsx("span",{style:{fontSize:10,background:"rgba(52,211,153,.15)",color:"#34d399",padding:"2px 7px",borderRadius:10,fontWeight:700,marginRight:6},children:"\\uD83D\\uDED2 CA"}):e.jsx("span",{style:{fontSize:10,background:"rgba(96,165,250,.15)",color:"#60a5fa",padding:"2px 7px",borderRadius:10,fontWeight:700,marginRight:6},children:"\\u2696\\uFE0F LIC"}),e.jsx("span",{style:{fontSize:13,fontWeight:700,color:th.text,lineHeight:1.3},children:it.nombreObra||it.Nombre||"Sin nombre"})]}),';
const newTitle = 'e.jsxs("div",{style:{marginBottom:6},children:[it.canal==="compra_agil"?e.jsx("span",{style:{fontSize:12,background:"rgba(52,211,153,.15)",color:"#34d399",padding:"3px 8px",borderRadius:10,fontWeight:700,marginRight:6,display:"inline-block",marginBottom:4},children:"\\uD83D\\uDED2 Compra \\u00C1gil"}):e.jsx("span",{style:{fontSize:12,background:"rgba(96,165,250,.15)",color:"#60a5fa",padding:"3px 8px",borderRadius:10,fontWeight:700,marginRight:6,display:"inline-block",marginBottom:4},children:"\\u2696\\uFE0F Licitaci\\u00F3n"}),e.jsx("div",{style:{fontSize:14,fontWeight:700,color:th.text,lineHeight:1.3},children:it.nombreObra||it.Nombre||"Sin nombre"})]}),';

// 2. Buttons
const oldBtns = `            e.jsxs("div",{style:{display:"flex",gap:6,marginTop:4,marginBottom:8},children:[
              it.idMP?e.jsx("a",{href:"https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs=/K4x+FXMm/TmT4Myr/hLGQ==",target:"_blank",rel:"noopener",style:{fontSize:11,color:"#60a5fa",textDecoration:"none",fontWeight:600,padding:"2px 6px",background:"rgba(96,165,250,.15)",borderRadius:6},children:"\\uD83C\\uDFDB\\uFE0F Ver MP"}):null,
              e.jsx("button",{style:{fontSize:11,color:th.accent,background:"rgba(245,160,32,.15)",border:"1px solid rgba(245,160,32,.3)",padding:"2px 8px",borderRadius:6,fontWeight:700,cursor:"pointer",marginLeft:"auto"},onClick:function(){props.setActiveLicitId(it.id);props.setActiveTab("licit")},children:"\\uD83C\\uDFD7\\uFE0F Construir Oferta"})
            ]}),`;
const newBtns = `            e.jsxs("div",{style:{display:"flex",gap:8,marginTop:8,marginBottom:10,flexWrap:"wrap"},children:[
              it.idMP?e.jsx("a",{href:"https://www.mercadopublico.cl/",target:"_blank",rel:"noopener",style:{fontSize:12,color:"#60a5fa",textDecoration:"none",fontWeight:600,padding:"5px 10px",background:"rgba(96,165,250,.15)",borderRadius:6,display:"flex",alignItems:"center",gap:4},children:"\\uD83C\\uDFDB\\uFE0F Ver MP"}):null,
              e.jsx("button",{style:{fontSize:12,color:th.accent,background:"rgba(245,160,32,.15)",border:"1px solid rgba(245,160,32,.3)",padding:"5px 12px",borderRadius:6,fontWeight:700,cursor:"pointer",marginLeft:"auto",display:"flex",alignItems:"center",gap:6},onClick:function(){props.setActiveLicitId(it.id);props.setActiveTab("licit")},children:"\\uD83C\\uDFD7\\uFE0F Construir Oferta"})
            ]}),`;

// 3. Countdown
const oldCountdown = `            cd&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,marginBottom:6,fontSize:11,fontWeight:700,color:cd.color},children:[`;
const newCountdown = `            cd&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8,fontSize:13,fontWeight:700,color:cd.color},children:[`;

if(c.includes(oldTitle)) c = c.replace(oldTitle, newTitle);
else console.log('oldTitle not found');

if(c.includes(oldBtns)) c = c.replace(oldBtns, newBtns);
else console.log('oldBtns not found');

if(c.includes(oldCountdown)) c = c.replace(oldCountdown, newCountdown);
else console.log('oldCountdown not found');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Styles updated.');
