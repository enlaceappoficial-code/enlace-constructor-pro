const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetModal = `           e.jsx("button",{style:{background:"transparent",border:"none",fontSize:20,cursor:"pointer",color:th.muted},onClick:function(){setDetailView(null)},children:"\\u2716"})
        ]}),
        e.jsx("div",{style:{padding:"20px",overflowY:"auto",flex:1},children:
           detailLoading ? e.jsx("div",{style:{textAlign:"center",padding:40,color:th.muted},children:"\\u23F3 Cargando detalles desde Mercado P\\u00FAblico..."}) :
           e.jsxs("div",{children:[
              e.jsx("h3",{style:{fontSize:18,fontWeight:700,color:th.fg,marginBottom:8},children:detailView.Nombre}),`;

const replacementModal = `           e.jsx("button",{style:{background:"transparent",border:"none",fontSize:20,cursor:"pointer",color:th.muted},onClick:function(){setDetailView(null)},children:"\\u2716"})
        ]}),
        e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid "+th.border,background:th.bg},children:[
           e.jsx("button",{style:{flex:1,background:"transparent",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",color:detailTab==="resumen"?th.fg:th.muted,borderBottom:detailTab==="resumen"?"2px solid "+th.fg:"2px solid transparent"},onClick:function(){setDetailTab("resumen")},children:"\\uD83D\\uDCCA Resumen de Oportunidad"}),
           e.jsx("button",{style:{flex:1,background:"transparent",border:"none",padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",color:detailTab==="guia"?th.fg:th.muted,borderBottom:detailTab==="guia"?"2px solid "+th.fg:"2px solid transparent"},onClick:function(){setDetailTab("guia")},children:"\\u200D\\uD83C\\uDFEB Asistente de Postulación"})
        ]}),
        e.jsx("div",{style:{padding:"20px",overflowY:"auto",flex:1},children:
           detailLoading ? e.jsx("div",{style:{textAlign:"center",padding:40,color:th.muted},children:"\\u23F3 Cargando detalles desde Mercado P\\u00FAblico..."}) :
           detailTab==="guia" ? e.jsxs("div",{children:[
              e.jsx("h3",{style:{fontSize:18,fontWeight:800,color:th.text,marginBottom:16},children:"Asistente de Postulación: Guía Paso a Paso"}),
              e.jsx("p",{style:{fontSize:13,color:th.muted,marginBottom:24,lineHeight:1.5},children:"Sigue estos pasos dentro de Mercado Público para evitar quedar fuera por errores administrativos. Marca las casillas a medida que avanzas."}),
              
              e.jsxs("div",{style:{marginBottom:24},children:[
                 e.jsx("h4",{style:{fontSize:15,fontWeight:700,color:th.text,marginBottom:12},children:"1. Documentos Obligatorios a Descargar"}),
                 e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:10},children:
                    [{id:"doc1",title:"Bases Administrativas",desc:"Lee los 'Requisitos Excluyentes', multas y plazos exactos de entrega."},
                     {id:"doc2",title:"Bases Técnicas",desc:"Verifica si exigen marcas específicas, certificaciones de materiales o planos."},
                     {id:"doc3",title:"Anexos Editables",desc:"Descarga los Word/Excel. Deberás llenarlos, firmarlos y volver a subirlos."},
                     {id:"doc4",title:"Foro de Preguntas",desc:"Lee las aclaraciones. A veces el organismo cambia las reglas ahí."}].map(function(st){
                        var isChecked = checkedSteps[st.id];
                        return e.jsxs("label",{style:{display:"flex",gap:12,padding:12,background:isChecked?"rgba(52,211,153,0.1)":th.bg,border:"1px solid "+(isChecked?"#34d399":th.border),borderRadius:8,cursor:"pointer",transition:"all 0.2s"},children:[
                           e.jsx("input",{type:"checkbox",checked:!!isChecked,onChange:function(ev){setCheckedSteps(d(d({},checkedSteps),{[st.id]:ev.target.checked}))},style:{marginTop:4}}),
                           e.jsxs("div",{children:[
                              e.jsx("div",{style:{fontSize:14,fontWeight:700,color:isChecked?"#10b981":th.fg,marginBottom:2},children:st.title}),
                              e.jsx("div",{style:{fontSize:12,color:th.muted},children:st.desc})
                           ]})
                        ]}, st.id);
                    })
                 })
              ]}),

              e.jsxs("div",{style:{marginBottom:24},children:[
                 e.jsx("h4",{style:{fontSize:15,fontWeight:700,color:th.text,marginBottom:12},children:"2. Criterios de Evaluación (La Estrategia)"}),
                 e.jsx("div",{style:{background:th.bg,border:"1px solid "+th.border,borderLeft:"4px solid #3b82f6",padding:16,borderRadius:8},children:
                    e.jsx("p",{style:{fontSize:13,color:th.fg,lineHeight:1.5},children:"Busca la tabla de 'Criterios de Evaluación' en las bases. Si el Precio vale un 80%, debes ajustar tu margen al mínimo. Si la Experiencia vale 60%, el precio no es tan importante, pero deberás adjuntar excelentes certificados de obras previas."})
                 })
              ]}),

              e.jsxs("div",{style:{marginBottom:24},children:[
                 e.jsx("h4",{style:{fontSize:15,fontWeight:700,color:th.text,marginBottom:12},children:"3. Checklist de Errores Fatales (Construcción)"}),
                 e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:10},children:
                    [{id:"err1",title:"Visita a Terreno",desc:"¿Es obligatoria? Si no vas y firmas el acta, tu oferta será rechazada automáticamente."},
                     {id:"err2",title:"Garantía de Seriedad",desc:"Si el monto es alto, pedirán boleta de garantía. Verifica el monto exacto y la glosa (texto) que debe llevar."},
                     {id:"err3",title:"Firma de Documentos",desc:"Si piden firma electrónica avanzada y mandas un PDF escaneado, quedas fuera."},
                     {id:"err4",title:"Certificados F30/F30-1",desc:"Asegúrate de tener tus certificados de la Inspección del Trabajo al día."},
                     {id:"err5",title:"El Colapso de las 15:00 hrs",desc:"Mercado Público suele caerse a la hora de cierre. Sube tu oferta al menos 2 horas antes."}].map(function(st){
                        var isChecked = checkedSteps[st.id];
                        return e.jsxs("label",{style:{display:"flex",gap:12,padding:12,background:isChecked?"rgba(52,211,153,0.1)":th.bg,border:"1px solid "+(isChecked?"#34d399":th.border),borderRadius:8,cursor:"pointer",transition:"all 0.2s"},children:[
                           e.jsx("input",{type:"checkbox",checked:!!isChecked,onChange:function(ev){setCheckedSteps(d(d({},checkedSteps),{[st.id]:ev.target.checked}))},style:{marginTop:4}}),
                           e.jsxs("div",{children:[
                              e.jsx("div",{style:{fontSize:14,fontWeight:700,color:isChecked?"#10b981":th.fg,marginBottom:2},children:st.title}),
                              e.jsx("div",{style:{fontSize:12,color:th.muted},children:st.desc})
                           ]})
                        ]}, st.id);
                    })
                 })
              ]}),
              e.jsx("a",{href:detailView._source==="compra_agil"?"https://www.mercadopublico.cl/Portal/Modules/Site/ComprasMicro/DetalleCompraMicro.aspx?qs="+detailView.CodigoExterno:"https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs="+detailView.CodigoExterno,target:"_blank",style:u(d({},sty.btn("p")),{display:"block",textAlign:"center",textDecoration:"none",padding:"12px",width:"100%"}),children:"\\uD83D\\uDE80 Ir a Mercado Público a Postular"})
           ]}) : 
           e.jsxs("div",{children:[
              e.jsx("h3",{style:{fontSize:18,fontWeight:700,color:th.fg,marginBottom:8},children:detailView.Nombre}),`;

if (c.includes(targetModal)) {
    c = c.replace(targetModal, replacementModal);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Injected tabs and guide into modal.');
} else {
    console.log('Target not found.');
}
