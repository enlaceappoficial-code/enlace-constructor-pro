const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetUI = `        ]})
      ]}),
      e.jsx("button",{style:u(d({},sty.btn("p")),{padding:"12px 32px",fontSize:14,width:"100%"}),onClick:handleSearch,children:loading?"\\u23F3 Buscando...":"\\uD83D\\uDD0E Buscar Oportunidades"})`;

const replacementUI = `        ]}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Ordenar por"}),
          e.jsx("select",{style:d({},sty.inp),value:sortBy,onChange:function(ev){setSortBy(ev.target.value)},children:[
             e.jsx("option",{value:"relevance",children:"Más relevantes"}),
             e.jsx("option",{value:"cierra_pronto",children:"⏳ Cierra Pronto"}),
             e.jsx("option",{value:"recientes",children:"✨ Más Recientes"}),
             e.jsx("option",{value:"monto_mayor",children:"💰 Mayor Monto (Si aplica)"})
          ]})
        ]}),
        e.jsxs("div",{style:{display:"flex",alignItems:"flex-end",paddingBottom:4},children:[
          e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:th.fg,padding:"10px 14px",border:"1px solid "+th.border,borderRadius:8,background:urgentOnly?"rgba(239,68,68,0.1)":th.bg},children:[
             e.jsx("input",{type:"checkbox",checked:urgentOnly,onChange:function(ev){setUrgentOnly(ev.target.checked)},style:{cursor:"pointer"}}),
             e.jsx("span",{children:"🔥 Solo urgentes (<48hrs)"})
          ]})
        ]})
      ]}),
      e.jsx("button",{style:u(d({},sty.btn("p")),{padding:"12px 32px",fontSize:14,width:"100%"}),onClick:handleSearch,children:loading?"\\u23F3 Buscando...":"\\uD83D\\uDD0E Buscar Oportunidades"})`;

if (c.includes(targetUI)) {
    c = c.replace(targetUI, replacementUI);
    console.log('Injected filters UI.');
} else {
    console.log('Target UI not found');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
