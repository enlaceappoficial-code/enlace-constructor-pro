const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetModal = `    results.length>0&&e.jsxs("div",{style:{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[`;

const replacementModal = `    detailView&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20},onClick:function(){setDetailView(null)},children:
      e.jsxs("div",{style:{background:th.bg,width:"100%",maxWidth:800,maxHeight:"90vh",borderRadius:12,boxShadow:"0 10px 25px rgba(0,0,0,0.3)",overflow:"hidden",display:"flex",flexDirection:"column"},onClick:function(ev){ev.stopPropagation()},children:[
        e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid "+th.border,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
           e.jsx("div",{style:{fontWeight:800,fontSize:18,color:th.text},children:"Detalle de la Oportunidad"}),
           e.jsx("button",{style:{background:"transparent",border:"none",fontSize:20,cursor:"pointer",color:th.muted},onClick:function(){setDetailView(null)},children:"\\u2716"})
        ]}),
        e.jsx("div",{style:{padding:"20px",overflowY:"auto",flex:1},children:
           detailLoading ? e.jsx("div",{style:{textAlign:"center",padding:40,color:th.muted},children:"\\u23F3 Cargando detalles desde Mercado P\\u00FAblico..."}) :
           e.jsxs("div",{children:[
              e.jsx("h3",{style:{fontSize:18,fontWeight:700,color:th.fg,marginBottom:8},children:detailView.Nombre}),
              e.jsx("div",{style:{fontSize:13,color:th.muted,marginBottom:20},children:detailView.Descripcion||"Sin descripci\\u00F3n adicional."}),
              e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24},children:[
                 e.jsxs("div",{style:{background:th.border,padding:12,borderRadius:8},children:[
                    e.jsx("div",{style:{fontSize:11,textTransform:"uppercase",fontWeight:700,color:th.muted,marginBottom:4},children:"Organismo"}),
                    e.jsx("div",{style:{fontSize:14,fontWeight:600,color:th.fg},children:detailView.Comprador?detailView.Comprador.NombreOrganismo:"-"})
                 ]}),
                 e.jsxs("div",{style:{background:th.border,padding:12,borderRadius:8},children:[
                    e.jsx("div",{style:{fontSize:11,textTransform:"uppercase",fontWeight:700,color:th.muted,marginBottom:4},children:"Fechas"}),
                    e.jsx("div",{style:{fontSize:14,fontWeight:600,color:th.fg},children:"Cierre: "+(detailView.Fechas&&detailView.Fechas.FechaCierre?detailView.Fechas.FechaCierre.replace("T"," "):"-")})
                 ]})
              ]}),
              (function(){
                 var items = detailView.fullData && detailView.fullData.Items && detailView.fullData.Items.Listado ? detailView.fullData.Items.Listado : (detailView.fullData && detailView.fullData.items ? detailView.fullData.items : []);
                 if(!items || items.length===0) return e.jsx("div",{style:{color:th.muted,marginBottom:20},children:"No hay \\u00EDtems detallados."});
                 return e.jsxs("div",{children:[
                    e.jsx("h4",{style:{fontSize:15,fontWeight:700,color:th.text,marginBottom:10,borderBottom:"1px solid "+th.border,paddingBottom:6},children:"\\u00CDtems Solicitados ("+items.length+")"}),
                    e.jsx("div",{style:{background:th.bg,border:"1px solid "+th.border,borderRadius:8,overflow:"hidden",marginBottom:24},children:
                       items.map(function(it, idx){
                          return e.jsxs("div",{style:{padding:"10px 14px",borderBottom:idx<items.length-1?"1px solid "+th.border:"none",fontSize:13,display:"flex",justifyContent:"space-between"},children:[
                             e.jsx("div",{style:{color:th.fg,paddingRight:20},children:it.NombreProducto || it.nombre_producto || "Ítem"}),
                             e.jsx("div",{style:{fontWeight:700,color:th.text,whiteSpace:"nowrap"},children:(it.Cantidad||it.cantidad||1)+" "+(it.UnidadMedida||it.unidad_medida||"Unidades")})
                          ]}, idx);
                       })
                    })
                 ]});
              })(),
              e.jsxs("div",{style:{background:"rgba(52,211,153,0.1)",border:"1px solid #34d399",padding:16,borderRadius:8,marginBottom:24},children:[
                 e.jsx("div",{style:{fontSize:14,fontWeight:700,color:"#10b981",marginBottom:8},children:"\\uD83D\\uDCCA Mini-Calculadora de Margen"}),
                 e.jsx("div",{style:{fontSize:12,color:th.muted,marginBottom:12},children:"Ingresa tu costo estimado para calcular tu margen de ganancia respecto al presupuesto oficial de esta oportunidad."}),
                 e.jsxs("div",{style:{display:"flex",gap:12,alignItems:"flex-end"},children:[
                    e.jsxs("div",{style:{flex:1},children:[
                       e.jsx("label",{style:{fontSize:11,fontWeight:700,color:th.muted,display:"block",marginBottom:4},children:"Costo Estimado ($)"}),
                       e.jsx("input",{type:"number",id:"calc-cost",placeholder:"Ej: 500000",style:d(d({},sty.inp),{width:"100%",background:th.bg,border:"1px solid "+th.border,padding:"8px 12px",borderRadius:6,color:th.text})})
                    ]}),
                    e.jsxs("div",{style:{flex:1},children:[
                       e.jsx("label",{style:{fontSize:11,fontWeight:700,color:th.muted,display:"block",marginBottom:4},children:"Monto Disponible / Presupuesto"}),
                       e.jsx("div",{style:{fontSize:16,fontWeight:800,color:th.text,padding:"8px 0"},children:detailView.MontoEstimado ? "$"+parseInt(detailView.MontoEstimado).toLocaleString("es-CL") : "No especificado"})
                    ]}),
                    e.jsx("button",{style:u(d({},sty.btn("p")),{padding:"10px 20px",height:"max-content"}),onClick:function(){
                       var cost=parseFloat(document.getElementById("calc-cost").value);
                       if(isNaN(cost)||cost<=0)return alert("Ingresa un costo válido");
                       var monto=detailView.MontoEstimado||0;
                       if(!monto)return alert("Esta licitación no tiene monto estimado público.");
                       var margin=((monto-cost)/monto)*100;
                       alert("Tu margen estimado sería del " + margin.toFixed(1) + "% ($"+(monto-cost).toLocaleString("es-CL")+" de ganancia bruta)");
                    },children:"Calcular"})
                 ]})
              ]}),
              e.jsx("a",{href:detailView._source==="compra_agil"?"https://www.mercadopublico.cl/Portal/Modules/Site/ComprasMicro/DetalleCompraMicro.aspx?qs="+detailView.CodigoExterno:"https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs="+detailView.CodigoExterno,target:"_blank",style:u(d({},sty.btn("s")),{display:"block",textAlign:"center",textDecoration:"none",padding:"12px",width:"100%"}),children:"\\uD83D\\uDD17 Ver Original en Mercado Público"})
           ]})
        })
      ]})
    }),
    results.length>0&&e.jsxs("div",{style:{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[`;

if (c.includes(targetModal)) {
    c = c.replace(targetModal, replacementModal);
    console.log('Injected modal UI.');
} else {
    console.log('Modal target not found');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
