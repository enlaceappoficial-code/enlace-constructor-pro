const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// We need to inject MpDetalleLicitacion and modify Fp2 and MpKanban.
const fp2Start = c.indexOf('function Fp2(props) {');
const kanbanStart = c.indexOf('function MpKanban(props) {');
const analisisStart = c.indexOf('function MpAnalisis(props) {');

if (fp2Start === -1 || kanbanStart === -1 || analisisStart === -1) {
    console.error('Cannot find boundaries');
    process.exit(1);
}

// 1. New Fp2 definition
const newFp2 = `function Fp2(props) {
  var _t = V("buscar"), activeTab = _t[0], setActiveTab = _t[1];
  var _actL = V(null), activeLicitId = _actL[0], setActiveLicitId = _actL[1];
  var accent = props.cfg && props.cfg.accentColor || "#f5a020";
  var th = {
    bg:"#050a10", card:"rgba(255,255,255,.05)", sb:"rgba(0,0,0,.2)", text:"#fff",
    muted:"#8892a4", border:"rgba(255,255,255,.1)", accent:accent, surface:"rgba(255,255,255,.03)"
  };
  var sty = {
    inp:{background:"rgba(0,0,0,.3)",border:"1px solid "+th.border,color:th.text,padding:"10px 14px",borderRadius:8,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",fontSize:13},
    btn:function(t){return{background:t==="p"?th.accent:th.sb,color:t==="p"?"#000":th.text,border:t==="p"?"none":"1px solid "+th.border,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}},
    card:{background:th.card,border:"1px solid "+th.border,borderRadius:12,padding:"18px 22px",marginBottom:12}
  };
  var tabs=[
    {id:"buscar",icon:"\\uD83D\\uDD0E",label:"Buscar en Mercado P\\u00FAblico"},
    {id:"kanban",icon:"\\uD83D\\uDCCB",label:"Mis Oportunidades"},
    {id:"analisis",icon:"\\uD83D\\uDCCA",label:"An\\u00E1lisis"},
    {id:"licit",icon:"\\uD83C\\uDFD7\\uFE0F",label:"Construir Oferta"}
  ];
  return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%"},children:[
    e.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid "+th.border,padding:"0",background:th.surface,position:"sticky",top:0,zIndex:10},children:tabs.map(function(tb){return e.jsxs("button",{onClick:function(){setActiveTab(tb.id)},style:{padding:"14px 22px",background:"transparent",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif",color:activeTab===tb.id?accent:th.muted,borderBottom:activeTab===tb.id?"3px solid "+accent:"3px solid transparent",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6},children:[e.jsx("span",{children:tb.icon}),e.jsx("span",{children:tb.label})]},tb.id)})}),
    e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"0"},children:
      activeTab==="buscar"?e.jsx(MpBuscador,{licitaciones:props.licitaciones,setLicitaciones:props.setLicitaciones,cfg:props.cfg,setToast:props.setToast,th:th,sty:sty})
      :activeTab==="kanban"?e.jsx(MpKanban,{licitaciones:props.licitaciones,setLicitaciones:props.setLicitaciones,cfg:props.cfg,setToast:props.setToast,th:th,sty:sty,setPage:props.setPage, setActiveTab:setActiveTab, setActiveLicitId:setActiveLicitId})
      :activeTab==="analisis"?e.jsx(MpAnalisis,{licitaciones:props.licitaciones,th:th,sty:sty})
      :e.jsx(MpDetalleLicitacion,{licitaciones:props.licitaciones,setLicitaciones:props.setLicitaciones,budgets:props.budgets,cfg:props.cfg,apus:props.apus,materiales:props.materiales,catalog:props.catalog,setToast:props.setToast,activeLicitId:activeLicitId,setActiveTab:setActiveTab})
    })
  ]});
}
`;

// Extract MpBuscador string
const buscadorStart = c.indexOf('function MpBuscador(props) {');
const buscadorString = c.substring(buscadorStart, kanbanStart);

// 2. Modify Kanban to add the button
const newKanban = `function MpKanban(props) {
  var th=props.th,sty=props.sty;
  var lics=props.licitaciones||[];
  var estados=[
    {id:"Pendiente",color:"#8892a4",icon:"\\u23F3"},
    {id:"En Estudio",color:"#f5a020",icon:"\\uD83D\\uDD0D"},
    {id:"Postulada",color:"#60a5fa",icon:"\\uD83D\\uDCE4"},
    {id:"Adjudicada",color:"#34d399",icon:"\\u2705"},
    {id:"Perdida",color:"#f87171",icon:"\\u274C"}
  ];

  var countdown=function(fecha){
    if(!fecha)return null;
    var diff=new Date(fecha)-new Date();
    if(diff<=0)return{txt:"Cerrada",color:"#f87171",badge:"\\uD83D\\uDD34",days:-1};
    var dd=Math.floor(diff/864e5),hh=Math.floor(diff%864e5/36e5);
    if(dd<3)return{txt:dd+"d "+hh+"h",color:"#f87171",badge:"\\uD83D\\uDD34",days:dd};
    if(dd<7)return{txt:dd+"d "+hh+"h",color:"#fbbf24",badge:"\\uD83D\\uDFE1",days:dd};
    return{txt:dd+"d "+hh+"h",color:"#34d399",badge:"\\uD83D\\uDFE2",days:dd};
  };

  var changeState=function(id,newSt){props.setLicitaciones(function(prev){return prev.map(function(x){return x.id===id?u(d({},x),{estado:newSt}):x})})};
  var updateNotes=function(id,notes){props.setLicitaciones(function(prev){return prev.map(function(x){return x.id===id?u(d({},x),{notas:notes}):x})})};
  var deleteItem=function(id){if(confirm("\\u00BFEliminar esta oportunidad del tablero?")){props.setLicitaciones(function(prev){return prev.filter(function(x){return x.id!==id})})}};

  var totalVal=lics.filter(function(x){return x.estado!=="Perdida"}).reduce(function(s,x){return s+(parseFloat(x.montoEstimado)||0)},0);
  var nextClose=lics.filter(function(x){return x.fechaCierre&&x.estado!=="Adjudicada"&&x.estado!=="Perdida"&&new Date(x.fechaCierre)>new Date()}).sort(function(a,b){return new Date(a.fechaCierre)-new Date(b.fechaCierre)})[0];

  return e.jsxs("div",{style:{padding:"24px 32px",maxWidth:1500,margin:"0 auto"},children:[
    e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20},children:[
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"16px"}),children:[
        e.jsx("div",{style:{fontSize:28,fontWeight:800,color:th.text},children:lics.length}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Total Oportunidades"})
      ]}),
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"16px"}),children:[
        e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#34d399"},children:"$ "+(totalVal>0?Number(totalVal).toLocaleString("es-CL"):"0")}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Valor en Seguimiento"})
      ]}),
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"16px"}),children:[
        e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#60a5fa"},children:lics.filter(function(x){return x.estado==="Adjudicada"}).length}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Adjudicadas"})
      ]}),
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"16px"}),children:[
        e.jsx("div",{style:{fontSize:16,fontWeight:700,color:nextClose?countdown(nextClose.fechaCierre).color:th.muted},children:nextClose?countdown(nextClose.fechaCierre).txt:"--"}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Pr\\u00F3ximo Cierre"})
      ]})
    ]}),
    e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat("+estados.length+",1fr)",gap:10,alignItems:"start"},children:estados.map(function(est){
      var colItems=lics.filter(function(x){return x.estado===est.id});
      return e.jsxs("div",{style:{background:th.surface,border:"1px solid "+th.border,borderRadius:12,padding:"12px",minHeight:300},children:[
        e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,paddingBottom:8,borderBottom:"2px solid "+est.color},children:[
          e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[
            e.jsx("span",{children:est.icon}),
            e.jsx("span",{style:{fontSize:13,fontWeight:700,color:est.color},children:est.id})
          ]}),
          e.jsx("span",{style:{fontSize:11,fontWeight:700,background:est.color+"22",color:est.color,padding:"2px 8px",borderRadius:10},children:colItems.length})
        ]}),
        colItems.length===0?e.jsx("div",{style:{fontSize:12,color:th.muted,textAlign:"center",padding:"20px 0"},children:"Sin oportunidades"}):
        colItems.map(function(it){
          var cd=countdown(it.fechaCierre);
          return e.jsxs("div",{style:{background:th.card,border:"1px solid "+th.border,borderRadius:10,padding:"12px",marginBottom:8,transition:"transform .15s"},children:[
            cd&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,marginBottom:6,fontSize:11,fontWeight:700,color:cd.color},children:[
              e.jsx("span",{children:cd.badge}),
              e.jsx("span",{children:cd.txt})
            ]}),
            e.jsxs("div",{style:{marginBottom:4},children:[it.canal==="compra_agil"?e.jsx("span",{style:{fontSize:10,background:"rgba(52,211,153,.15)",color:"#34d399",padding:"2px 7px",borderRadius:10,fontWeight:700,marginRight:6},children:"\\uD83D\\uDED2 CA"}):e.jsx("span",{style:{fontSize:10,background:"rgba(96,165,250,.15)",color:"#60a5fa",padding:"2px 7px",borderRadius:10,fontWeight:700,marginRight:6},children:"\\u2696\\uFE0F LIC"}),e.jsx("span",{style:{fontSize:13,fontWeight:700,color:th.text,lineHeight:1.3},children:it.nombreObra||it.Nombre||"Sin nombre"})]}),
            e.jsx("div",{style:{fontSize:11,color:th.muted,marginBottom:6},children:it.organismo||""}),
            it.montoEstimado&&parseFloat(it.montoEstimado)>0?e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#34d399",marginBottom:6},children:"$ "+Number(it.montoEstimado).toLocaleString("es-CL")}):null,
            e.jsxs("div",{style:{display:"flex",gap:6,marginTop:4,marginBottom:8},children:[
              it.idMP?e.jsx("a",{href:"https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs=/K4x+FXMm/TmT4Myr/hLGQ==",target:"_blank",rel:"noopener",style:{fontSize:11,color:"#60a5fa",textDecoration:"none",fontWeight:600,padding:"2px 6px",background:"rgba(96,165,250,.15)",borderRadius:6},children:"\\uD83C\\uDFDB\\uFE0F Ver MP"}):null,
              e.jsx("button",{style:{fontSize:11,color:th.accent,background:"rgba(245,160,32,.15)",border:"1px solid rgba(245,160,32,.3)",padding:"2px 8px",borderRadius:6,fontWeight:700,cursor:"pointer",marginLeft:"auto"},onClick:function(){props.setActiveLicitId(it.id);props.setActiveTab("licit")},children:"\\uD83C\\uDFD7\\uFE0F Construir Oferta"})
            ]}),
            e.jsx("textarea",{rows:2,style:u(d({},sty.inp),{marginTop:0,fontSize:11,padding:"6px 8px",resize:"vertical"}),placeholder:"Notas...",value:it.notas||"",onChange:function(ev){updateNotes(it.id,ev.target.value)}}),
            e.jsxs("div",{style:{display:"flex",gap:4,marginTop:6},children:[
              e.jsx("select",{style:u(d({},sty.inp),{padding:"4px 6px",fontSize:11,flex:1}),value:it.estado,onChange:function(ev){changeState(it.id,ev.target.value)},children:estados.map(function(s){return e.jsx("option",{value:s.id,children:s.id},s.id)})}),
              e.jsx("button",{style:{background:"rgba(248,113,113,.15)",border:"none",color:"#f87171",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:12},onClick:function(){deleteItem(it.id)},children:"\\uD83D\\uDDD1"})
            ]})
          ]},it.id)
        })
      ]},est.id)
    })})
  ]});
}
`;

// 3. Extract MpAnalisis
const analisisEnd = c.indexOf('\n_n.createRoot');
const analisisString = c.substring(analisisStart, analisisEnd);

// 4. MpDetalleLicitacion
const newDetalle = `
function MpDetalleLicitacion(props) {
  var id = props.activeLicitId;
  var licit = id ? props.licitaciones.find(function(x){return x.id === id}) : null;

  var onSave = function(nLic){
    props.setLicitaciones(function(prev){return prev.map(function(x){return x.id === nLic.id ? nLic : x})});
    props.setToast("\\u2705 Oferta guardada correctamente");
  };

  if(!licit) {
    return e.jsxs("div",{style:{padding:"60px 20px",textAlign:"center",maxWidth:500,margin:"0 auto"},children:[
      e.jsx("div",{style:{fontSize:60,marginBottom:20},children:"\\uD83D\\uDEE0\\uFE0F"}),
      e.jsx("div",{style:{fontSize:20,fontWeight:700,marginBottom:10,color:"#fff"},children:"Ninguna Oportunidad Seleccionada"}),
      e.jsx("div",{style:{color:"#8892a4",marginBottom:30,lineHeight:1.5},children:"Para construir tu oferta, ve a tu tablero de oportunidades y selecciona una licitaci\\u00F3n haciendo clic en 'Construir Oferta'."}),
      e.jsx("button",{style:{background:"#f5a020",color:"#000",border:"none",padding:"12px 24px",borderRadius:8,fontWeight:700,cursor:"pointer"},onClick:function(){props.setActiveTab("kanban")},children:"Ir a Mis Oportunidades \\u2192"})
    ]});
  }

  // We reuse Ag, which is the internal component for the details and tabs.
  return e.jsxs("div",{style:{padding:"24px 32px",maxWidth:1400,margin:"0 auto"},children:[
    e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24},children:[
      e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[
        e.jsx("button",{style:{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontWeight:600},onClick:function(){props.setActiveTab("kanban")},children:"\\u2190 Volver"}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:20,fontWeight:800,color:"#fff"},children:"Construir Oferta"}),
          e.jsxs("div",{style:{fontSize:13,color:"#8892a4"},children:[licit.idMP," \\u2014 ",licit.nombreObra]})
        ]})
      ]}),
      e.jsx("div",{style:{background:"rgba(245,160,32,.15)",color:"#f5a020",padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700},children:licit.estado})
    ]}),
    e.jsx(Ag,{licit:licit, budgets:props.budgets, onSave:onSave, onCancel:function(){props.setActiveTab("kanban")}, cfg:props.cfg})
  ]});
}
`;

// Concatenate everything
const newCode = newFp2 + '\n' + buscadorString + '\n' + newKanban + '\n' + analisisString + '\n' + newDetalle + '\n';

c = c.substring(0, fp2Start) + newCode + c.substring(analisisEnd);

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Successfully refactored UI logic to remove redundancy.');
