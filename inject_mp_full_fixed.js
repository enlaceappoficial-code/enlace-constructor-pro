const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// ========================================================
// STEP 1: Replace Fp2 with the full 4-tab Mercado Público component
// ========================================================
const fp2Start = -1; // will insert before Jg
const fp2End = c.indexOf('\n_n.createRoot');
if (fp2End === -1) { console.error('Cannot find Jg'); process.exit(1); }

const newFp2 = `function Fp2(props) {
  var _t = V("buscar"), activeTab = _t[0], setActiveTab = _t[1];
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
    {id:"buscar",icon:"\\uD83D\\uDD0E",label:"Buscar Oportunidades"},
    {id:"kanban",icon:"\\uD83D\\uDCCB",label:"Mis Oportunidades"},
    {id:"analisis",icon:"\\uD83D\\uDCCA",label:"An\\u00E1lisis"},
    {id:"licit",icon:"\\u2696\\uFE0F",label:"An\\u00E1lisis de Licitaci\\u00F3n"}
  ];
  return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%"},children:[
    e.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid "+th.border,padding:"0",background:th.surface,position:"sticky",top:0,zIndex:10},children:tabs.map(function(tb){return e.jsxs("button",{onClick:function(){setActiveTab(tb.id)},style:{padding:"14px 22px",background:"transparent",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif",color:activeTab===tb.id?accent:th.muted,borderBottom:activeTab===tb.id?"3px solid "+accent:"3px solid transparent",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6},children:[e.jsx("span",{children:tb.icon}),e.jsx("span",{children:tb.label})]},tb.id)})}),
    e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"0"},children:
      activeTab==="buscar"?e.jsx(MpBuscador,{licitaciones:props.licitaciones,setLicitaciones:props.setLicitaciones,cfg:props.cfg,setToast:props.setToast,th:th,sty:sty})
      :activeTab==="kanban"?e.jsx(MpKanban,{licitaciones:props.licitaciones,setLicitaciones:props.setLicitaciones,cfg:props.cfg,setToast:props.setToast,th:th,sty:sty,setPage:props.setPage})
      :activeTab==="analisis"?e.jsx(MpAnalisis,{licitaciones:props.licitaciones,th:th,sty:sty})
      :e.jsx(Mg,{licitaciones:props.licitaciones,setLicitaciones:props.setLicitaciones,budgets:props.budgets,cfg:props.cfg,apus:props.apus,materiales:props.materiales,catalog:props.catalog,setToast:props.setToast})
    })
  ]});
}

// ======================== BUSCADOR ========================
function MpBuscador(props) {
  var th=props.th,sty=props.sty,cfg=props.cfg;
  var _q=V(""),query=_q[0],setQuery=_q[1];
  var _neg=V(""),neg=_neg[0],setNeg=_neg[1];
  var _reg=V("Todas"),region=_reg[0],setRegion=_reg[1];
  var _tipo=V("Todos"),tipo=_tipo[0],setTipo=_tipo[1];
  var _res=V([]),results=_res[0],setResults=_res[1];
  var _ld=V(false),loading=_ld[0],setLoading=_ld[1];
  var _pg=V(1),page=_pg[0],setPage=_pg[1];

  var regiones=["Todas","Tarapac\\u00E1","Antofagasta","Atacama","Coquimbo","Valpara\\u00EDso","O'Higgins","Maule","Biob\\u00EDo","Araucan\\u00EDa","Los Lagos","Ays\\u00E9n","Magallanes","Metropolitana","Los R\\u00EDos","Arica y Parinacota","\\u00D1uble"];
  var tipos=["Todos","L1","LE","LP","LQ","LR","E2","CO","B2","H2","I2","R2"];
  var tipoLabels={L1:"Licit. P\\u00FAblica",LE:"Licit. Privada",LP:"Licit. Priv. (cont.)",LQ:"Licit. Menor",LR:"Licit. Regulada",E2:"Compra \\u00C1gil",CO:"Conv. Marco",B2:"Bolsa Prod.",H2:"Pipe Innovaci\\u00F3n",I2:"Instrucciones",R2:"Resol. Compra",Todos:"Todos los tipos"};

  var handleSearch = function(){
    if(!query.trim()) return props.setToast("\\u26A0\\uFE0F Ingresa palabras clave para buscar");
    setLoading(true);setPage(1);
    var tk=cfg&&cfg.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";
    var url="https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?estado=activas&ticket="+tk;
    if(tipo!=="Todos")url+="&CodigoTipo="+tipo;
    fetch(url).then(function(r){return r.json()}).then(function(data){
      if(!data||!data.Listado){setResults([]);setLoading(false);props.setToast("\\u26A0\\uFE0F Sin resultados");return}
      var items=data.Listado;
      var qLow=query.toLowerCase().split(" ").filter(function(w){return w.length>0});
      var negWords=neg.toLowerCase().split(",").map(function(w){return w.trim()}).filter(function(w){return w.length>0});
      items=items.filter(function(it){
        var txt=(it.Nombre||"").toLowerCase()+" "+(it.Descripcion||"").toLowerCase();
        var matchQ=qLow.every(function(w){return txt.indexOf(w)>-1});
        var matchNeg=negWords.length===0||negWords.every(function(w){return txt.indexOf(w)===-1});
        var matchReg=region==="Todas"||!it.Comprador||(it.Comprador.RegionUnidad||"").indexOf(region)>-1;
        return matchQ&&matchNeg&&matchReg;
      });
      setResults(items);setLoading(false);
      props.setToast("\\u2705 "+items.length+" oportunidades encontradas");
    }).catch(function(){setLoading(false);props.setToast("\\u274C Error de conexi\\u00F3n con Mercado P\\u00FAblico")});
  };

  var countdown=function(fecha){
    if(!fecha)return null;
    var diff=new Date(fecha)-new Date();
    if(diff<=0)return{txt:"Cerrada",color:"#f87171",days:-1};
    var d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5);
    var color=d<3?"#f87171":d<7?"#fbbf24":"#34d399";
    return{txt:d+"d "+h+"h",color:color,days:d};
  };

  var saveToKanban=function(item){
    if(props.licitaciones.some(function(x){return x.idMP===item.CodigoExterno})){
      return props.setToast("\\u26A0\\uFE0F Ya est\\u00E1 en tu tablero");
    }
    var newItem={id:Date.now(),idMP:item.CodigoExterno||"",nombreObra:item.Nombre||"",organismo:item.Comprador?item.Comprador.NombreOrganismo:"",region:item.Comprador?item.Comprador.RegionUnidad:"",montoEstimado:item.MontoEstimado||0,fechaCierre:item.Fechas?item.Fechas.FechaCierre:"",estado:"Pendiente",notas:"",fechaGuardado:new Date().toISOString().split("T")[0],tipo:item.Tipo||"",items:item.Items?item.Items.Listado:[]};
    props.setLicitaciones(function(prev){return[newItem].concat(prev)});
    props.setToast("\\u2705 Guardado en Mis Oportunidades");
  };

  var perPage=12;
  var paged=results.slice((page-1)*perPage,page*perPage);
  var totalPages=Math.ceil(results.length/perPage)||1;

  return e.jsxs("div",{style:{padding:"24px 32px",maxWidth:1300,margin:"0 auto"},children:[
    e.jsxs("div",{style:d({},sty.card),children:[
      e.jsx("div",{style:{fontSize:18,fontWeight:800,color:th.text,marginBottom:16},children:"\\uD83D\\uDD0E Buscar Oportunidades en Mercado P\\u00FAblico"}),
      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12},children:[
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Palabras clave"}),
          e.jsx("input",{style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: pintura, construcci\\u00F3n, mantenci\\u00F3n...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}})
        ]}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:"#f87171",fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"\\u26D4 Palabras negativas (excluir)"}),
          e.jsx("input",{style:u(d({},sty.inp),{borderColor:"rgba(248,113,113,.3)"}),value:neg,onChange:function(ev){setNeg(ev.target.value)},placeholder:"Ej: mascarilla, alimentos (separar con coma)"})
        ]})
      ]}),
      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:12,alignItems:"end"},children:[
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Regi\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value)},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Tipo de Compra"}),
          e.jsx("select",{style:d({},sty.inp),value:tipo,onChange:function(ev){setTipo(ev.target.value)},children:tipos.map(function(t){return e.jsx("option",{value:t,children:tipoLabels[t]||t},t)})})
        ]}),
        e.jsx("div",{}),
        e.jsx("button",{style:u(d({},sty.btn("p")),{padding:"12px 28px",fontSize:14}),onClick:handleSearch,children:loading?"\\u23F3 Buscando...":"\\uD83D\\uDD0E Buscar"})
      ]})
    ]}),
    results.length>0&&e.jsxs("div",{style:{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
      e.jsxs("div",{style:{fontSize:13,color:th.muted},children:[results.length+" resultados encontrados"]}),
      e.jsxs("div",{style:{display:"flex",gap:6},children:[
        e.jsx("button",{style:u(d({},sty.btn("s")),{padding:"6px 12px",fontSize:12}),onClick:function(){page>1&&setPage(page-1)},children:"\\u25C0"}),
        e.jsxs("span",{style:{fontSize:12,color:th.muted,padding:"6px 10px"},children:["P\\u00E1g. "+page+" de "+totalPages]}),
        e.jsx("button",{style:u(d({},sty.btn("s")),{padding:"6px 12px",fontSize:12}),onClick:function(){page<totalPages&&setPage(page+1)},children:"\\u25B6"})
      ]})
    ]}),
    e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12},children:paged.map(function(it,idx){
      var cd=countdown(it.Fechas&&it.Fechas.FechaCierre);
      return e.jsxs("div",{style:u(d({},sty.card),{position:"relative",transition:"transform .15s,box-shadow .15s"}),children:[
        cd&&e.jsx("div",{style:{position:"absolute",top:12,right:14,background:cd.color+"22",color:cd.color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700},children:"\\u23F1 "+cd.txt}),
        e.jsx("div",{style:{fontSize:14,fontWeight:700,color:th.text,marginBottom:6,paddingRight:80,lineHeight:1.3},children:it.Nombre||"Sin nombre"}),
        e.jsx("div",{style:{fontSize:12,color:th.muted,marginBottom:8},children:it.Comprador?it.Comprador.NombreOrganismo:"Organismo no disponible"}),
        e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10},children:[
          it.Comprador&&it.Comprador.RegionUnidad&&e.jsx("span",{style:{fontSize:11,background:"rgba(96,165,250,.15)",color:"#60a5fa",padding:"3px 8px",borderRadius:12,fontWeight:600},children:"\\uD83D\\uDCCD "+it.Comprador.RegionUnidad}),
          it.Tipo&&e.jsx("span",{style:{fontSize:11,background:"rgba(245,160,32,.15)",color:accent,padding:"3px 8px",borderRadius:12,fontWeight:600},children:tipoLabels[it.Tipo]||it.Tipo})
        ]}),
        it.MontoEstimado&&it.MontoEstimado>0?e.jsx("div",{style:{fontSize:16,fontWeight:800,color:"#34d399",marginBottom:10},children:"$ "+Number(it.MontoEstimado).toLocaleString("es-CL")}):null,
        e.jsxs("div",{style:{display:"flex",gap:8,marginTop:6},children:[
          e.jsx("button",{style:u(d({},sty.btn("p")),{flex:1,padding:"8px",fontSize:12}),onClick:function(){saveToKanban(it)},children:"\\uD83D\\uDCCB Guardar"}),
          e.jsx("a",{href:"https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs=/K4x+FXMm/TmT4Myr/hLGQ==",target:"_blank",rel:"noopener",style:u(d({},sty.btn("s")),{flex:1,padding:"8px",fontSize:12,textAlign:"center",textDecoration:"none",display:"block"}),children:"\\uD83C\\uDFDB\\uFE0F Ver en MP"})
        ]})
      ]},idx)
    })})
  ]});
}

// ======================== KANBAN MEJORADO ========================
function MpKanban(props) {
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
            e.jsx("div",{style:{fontSize:13,fontWeight:700,color:th.text,marginBottom:4,lineHeight:1.3},children:it.nombreObra||it.Nombre||"Sin nombre"}),
            e.jsx("div",{style:{fontSize:11,color:th.muted,marginBottom:6},children:it.organismo||""}),
            it.montoEstimado&&parseFloat(it.montoEstimado)>0?e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#34d399",marginBottom:6},children:"$ "+Number(it.montoEstimado).toLocaleString("es-CL")}):null,
            it.idMP?e.jsx("a",{href:"https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs=/K4x+FXMm/TmT4Myr/hLGQ==",target:"_blank",rel:"noopener",style:{fontSize:11,color:"#60a5fa",textDecoration:"none",fontWeight:600},children:"\\uD83C\\uDFDB\\uFE0F "+it.idMP}):null,
            e.jsx("textarea",{rows:2,style:u(d({},sty.inp),{marginTop:8,fontSize:11,padding:"6px 8px",resize:"vertical"}),placeholder:"Notas...",value:it.notas||"",onChange:function(ev){updateNotes(it.id,ev.target.value)}}),
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

// ======================== ANÁLISIS ========================
function MpAnalisis(props) {
  var th=props.th,sty=props.sty;
  var lics=props.licitaciones||[];
  var estados=["Pendiente","En Estudio","Postulada","Adjudicada","Perdida"];
  var estColors={"Pendiente":"#8892a4","En Estudio":"#f5a020","Postulada":"#60a5fa","Adjudicada":"#34d399","Perdida":"#f87171"};

  var total=lics.length;
  var adjudicadas=lics.filter(function(x){return x.estado==="Adjudicada"}).length;
  var postuladas=lics.filter(function(x){return x.estado==="Postulada"||x.estado==="Adjudicada"||x.estado==="Perdida"}).length;
  var tasa=postuladas>0?Math.round(adjudicadas/postuladas*100):0;
  var montoAdj=lics.filter(function(x){return x.estado==="Adjudicada"}).reduce(function(s,x){return s+(parseFloat(x.montoEstimado)||0)},0);
  var montoTotal=lics.reduce(function(s,x){return s+(parseFloat(x.montoEstimado)||0)},0);

  var porEstado=estados.map(function(est){return{est:est,count:lics.filter(function(x){return x.estado===est}).length}});
  var maxCount=Math.max.apply(null,porEstado.map(function(x){return x.count}).concat([1]));

  var meses={};
  lics.forEach(function(x){
    if(x.fechaGuardado){var m=x.fechaGuardado.substring(0,7);meses[m]=(meses[m]||0)+1}
  });
  var mesesArr=Object.keys(meses).sort().slice(-6);
  var maxMes=Math.max.apply(null,mesesArr.map(function(m){return meses[m]}).concat([1]));

  return e.jsxs("div",{style:{padding:"24px 32px",maxWidth:1200,margin:"0 auto"},children:[
    e.jsx("div",{style:{fontSize:18,fontWeight:800,color:th.text,marginBottom:20},children:"\\uD83D\\uDCCA An\\u00E1lisis de Oportunidades"}),
    e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24},children:[
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"20px",borderLeft:"4px solid "+th.accent}),children:[
        e.jsx("div",{style:{fontSize:32,fontWeight:800,color:th.text},children:total}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Total Oportunidades"})
      ]}),
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"20px",borderLeft:"4px solid #34d399"}),children:[
        e.jsxs("div",{style:{fontSize:32,fontWeight:800,color:"#34d399"},children:[tasa+"%"]}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Tasa Adjudicaci\\u00F3n"})
      ]}),
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"20px",borderLeft:"4px solid #60a5fa"}),children:[
        e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#60a5fa"},children:"$ "+Number(montoAdj).toLocaleString("es-CL")}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Monto Adjudicado"})
      ]}),
      e.jsxs("div",{style:u(d({},sty.card),{textAlign:"center",padding:"20px",borderLeft:"4px solid "+th.accent}),children:[
        e.jsx("div",{style:{fontSize:22,fontWeight:800,color:th.accent},children:"$ "+Number(montoTotal).toLocaleString("es-CL")}),
        e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:600,textTransform:"uppercase"},children:"Valor Total Monitoreado"})
      ]})
    ]}),
    e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16},children:[
      e.jsxs("div",{style:u(d({},sty.card),{padding:"20px"}),children:[
        e.jsx("div",{style:{fontSize:14,fontWeight:700,color:th.text,marginBottom:16},children:"Oportunidades por Estado"}),
        porEstado.map(function(pe){
          return e.jsxs("div",{style:{marginBottom:10},children:[
            e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4},children:[
              e.jsx("span",{style:{fontSize:12,fontWeight:600,color:estColors[pe.est]||th.muted},children:pe.est}),
              e.jsx("span",{style:{fontSize:12,fontWeight:700,color:th.text},children:pe.count})
            ]}),
            e.jsx("div",{style:{height:8,background:"rgba(255,255,255,.06)",borderRadius:4,overflow:"hidden"},children:
              e.jsx("div",{style:{width:Math.round(pe.count/maxCount*100)+"%",height:"100%",background:estColors[pe.est]||th.accent,borderRadius:4,transition:"width .4s ease"}})
            })
          ]},pe.est)
        })
      ]}),
      e.jsxs("div",{style:u(d({},sty.card),{padding:"20px"}),children:[
        e.jsx("div",{style:{fontSize:14,fontWeight:700,color:th.text,marginBottom:16},children:"Oportunidades Guardadas por Mes"}),
        mesesArr.length===0?e.jsx("div",{style:{fontSize:12,color:th.muted,textAlign:"center",padding:"30px 0"},children:"A\\u00FAn no hay datos hist\\u00F3ricos"}):
        e.jsx("div",{style:{display:"flex",gap:8,alignItems:"flex-end",height:140},children:
          mesesArr.map(function(m){
            var pct=Math.round(meses[m]/maxMes*100);
            return e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4},children:[
              e.jsx("span",{style:{fontSize:11,fontWeight:700,color:th.text},children:meses[m]}),
              e.jsx("div",{style:{width:"100%",height:pct+"%",minHeight:4,background:"linear-gradient(180deg,"+th.accent+",rgba(245,160,32,.4))",borderRadius:4,transition:"height .4s ease"}}),
              e.jsx("span",{style:{fontSize:10,color:th.muted},children:m.split("-")[1]+"/"+m.split("-")[0].slice(2)})
            ]},m)
          })
        })
      ]})
    ]})
  ]});
}

`;

c = c.substring(0, fp2Start) + newFp2 + c.substring(fp2End + 1);

// Verify syntax by trying to parse
try {
  new Function(c);
  console.log('Syntax OK!');
} catch(err) {
  console.log('Syntax check failed:', err.message);
  // Try to find the error location
  const lines = c.split('\n');
  console.log('Total lines:', lines.length);
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Done! File written successfully.');
