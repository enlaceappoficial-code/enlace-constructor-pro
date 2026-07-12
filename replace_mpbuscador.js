const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const startMarker = 'function MpBuscador(props) {';
const endMarker = '\n// ======================== KANBAN';
const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Cannot find MpBuscador boundaries');
  process.exit(1);
}

const newBuscador = `function MpBuscador(props) {
  var th=props.th,sty=props.sty,cfg=props.cfg;
  var _q=V(""),query=_q[0],setQuery=_q[1];
  var _neg=V(""),neg=_neg[0],setNeg=_neg[1];
  var _reg=V("Todas"),region=_reg[0],setRegion=_reg[1];
  var _canal=V("todos"),canal=_canal[0],setCanal=_canal[1];
  var _res=V([]),results=_res[0],setResults=_res[1];
  var _ld=V(false),loading=_ld[0],setLoading=_ld[1];
  var _pg=V(1),page=_pg[0],setPage=_pg[1];
  var _orgs=V([]),organismosList=_orgs[0],setOrganismosList=_orgs[1];
  var _orgSel=V(""),organismoSel=_orgSel[0],setOrganismoSel=_orgSel[1];

  ct(function(){
    var tk=cfg&&cfg.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";
    fetch("https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarComprador?ticket="+tk)
      .then(function(r){return r.json()})
      .then(function(data){if(data&&data.listaEmpresas)setOrganismosList(data.listaEmpresas)})
      .catch(function(){});
  },[]);

  var regiones=["Todas","Tarapac\\u00E1","Antofagasta","Atacama","Coquimbo","Valpara\\u00EDso","O'Higgins","Maule","Biob\\u00EDo","Araucan\\u00EDa","Los Lagos","Ays\\u00E9n","Magallanes","Metropolitana","Los R\\u00EDos","Arica y Parinacota","\\u00D1uble"];
  var canales=[
    {id:"todos",label:"\\uD83C\\uDF10 Todos",desc:"Licitaciones y Compra \\u00C1gil"},
    {id:"licitaciones",label:"\\u2696\\uFE0F Licitaciones",desc:"P\\u00FAblicas y privadas"},
    {id:"compra_agil",label:"\\uD83D\\uDED2 Compra \\u00C1gil",desc:"Compras directas"}
  ];

  var handleSearch = function(){
    if(!query.trim() && canal==="licitaciones" && !organismoSel) return props.setToast("\\u26A0\\uFE0F Ingresa palabras clave u organismo");
    setLoading(true);setPage(1);setResults([]);
    var tk=cfg&&cfg.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";
    var qLow=query.toLowerCase().split(" ").filter(function(w){return w.length>0});
    var negWords=neg.toLowerCase().split(",").map(function(w){return w.trim()}).filter(function(w){return w.length>0});

    var filterFn=function(items,source){
      return items.filter(function(it){
        var txt=((it.Nombre||it.nombre||"")+" "+(it.Descripcion||it.descripcion||"")).toLowerCase();
        var matchQ=qLow.length===0||qLow.every(function(w){return txt.indexOf(w)>-1});
        var matchNeg=negWords.length===0||negWords.every(function(w){return txt.indexOf(w)===-1});
        var orgName=((it.Comprador?it.Comprador.NombreOrganismo:"")+(it.proveedor||"")).toLowerCase();
        var matchOrg=!organismoSel||orgName.indexOf(organismoSel.toLowerCase())>-1;
        return matchQ&&matchNeg&&matchOrg;
      }).map(function(it){return u(d({},it),{_source:source})});
    };

    var promises=[];

    if(canal==="todos"||canal==="licitaciones"){
      var urlLic="https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?estado=activas&ticket="+tk;
      promises.push(
        fetch(urlLic).then(function(r){return r.json()}).then(function(data){
          return data&&data.Listado?filterFn(data.Listado,"licitacion"):[];
        }).catch(function(){return[]})
      );
    }

    if(canal==="todos"||canal==="compra_agil"){
      var regMap={
          "Tarapac\\u00E1": 1, "Antofagasta": 2, "Atacama": 3, "Coquimbo": 4, "Valpara\\u00EDso": 5,
          "O'Higgins": 6, "Maule": 7, "Biob\\u00EDo": 8, "Araucan\\u00EDa": 9, "Los Lagos": 10,
          "Ays\\u00E9n": 11, "Magallanes": 12, "Metropolitana": 13, "Los R\\u00EDos": 14,
          "Arica y Parinacota": 15, "\\u00D1uble": 16
      };
      var urlOC="https://api2.mercadopublico.cl/v2/compra-agil?estado=publicada&tamano_pagina=100";
      if(query.trim()){urlOC+="&q="+encodeURIComponent(query.trim());}
      if(region!=="Todas"&&regMap[region]){urlOC+="&region="+regMap[region];}
      
      promises.push(
        fetch(urlOC,{headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(data){
          if(data&&data.payload&&data.payload.items){
             var mapped=data.payload.items.map(function(ca){
                 return {
                    CodigoExterno: ca.codigo, Nombre: ca.nombre, Descripcion: ca.descripcion||"",
                    Comprador: { NombreOrganismo: ca.institucion?ca.institucion.organismo_comprador:"", RegionUnidad: ca.institucion?ca.institucion.nombre_region:"" },
                    MontoEstimado: ca.montos?ca.montos.monto_disponible_clp:0,
                    Fechas: { FechaCierre: ca.fechas?ca.fechas.fecha_cierre:"" },
                    Items: { Listado: [] }, _source: "compra_agil"
                 };
             });
             if(query.trim()===""&&region==="Todas") return filterFn(mapped,"compra_agil");
             return mapped; 
          }
          return [];
        }).catch(function(){return[]})
      );
    }

    Promise.all(promises).then(function(arrays){
      var all=[];
      arrays.forEach(function(a){all=all.concat(a)});
      if(region!=="Todas"){
        all=all.filter(function(it){
          if(it._source==="compra_agil" && canal==="todos") return true; // Region already filtered in API for compra agil if query was used
          if(it._source==="compra_agil" && !query.trim()) return true;
          var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          return reg.toLowerCase().indexOf(region.toLowerCase())>-1;
        });
      }
      setResults(all);setLoading(false);
      props.setToast("\\u2705 "+all.length+" oportunidades encontradas");
    }).catch(function(){setLoading(false);props.setToast("\\u274C Error de conexi\\u00F3n")});
  };

  var countdown=function(fecha){
    if(!fecha)return null;
    var diff=new Date(fecha)-new Date();
    if(diff<=0)return{txt:"Cerrada",color:"#f87171",days:-1};
    var dd=Math.floor(diff/864e5),hh=Math.floor(diff%864e5/36e5);
    var color=dd<3?"#f87171":dd<7?"#fbbf24":"#34d399";
    return{txt:dd+"d "+hh+"h",color:color,days:dd};
  };

  var saveToKanban=function(item){
    var idField=item.CodigoExterno||"";
    if(props.licitaciones.some(function(x){return x.idMP===idField})){
      return props.setToast("\\u26A0\\uFE0F Ya est\\u00E1 en tu tablero");
    }
    var src=item._source||"licitacion";
    var newItem={
      id:Date.now(), idMP:idField, nombreObra:item.Nombre||"",
      organismo:item.Comprador?item.Comprador.NombreOrganismo:"",
      region:item.Comprador?item.Comprador.RegionUnidad:"",
      montoEstimado:item.MontoEstimado||0, fechaCierre:item.Fechas?item.Fechas.FechaCierre:"",
      estado:"Pendiente", notas:"", fechaGuardado:new Date().toISOString().split("T")[0],
      tipo:item.Tipo||"", canal:src, items:item.Items?item.Items.Listado:[]
    };
    props.setLicitaciones(function(prev){return[newItem].concat(prev)});
    props.setToast("\\u2705 Guardado en Mis Oportunidades");
  };

  var perPage=12;
  var paged=results.slice((page-1)*perPage,page*perPage);
  var totalPages=Math.ceil(results.length/perPage)||1;

  var srcBadge=function(src){
    if(src==="compra_agil") return {bg:"rgba(52,211,153,.15)",color:"#34d399",label:"\\uD83D\\uDED2 Compra \\u00C1gil"};
    return {bg:"rgba(96,165,250,.15)",color:"#60a5fa",label:"\\u2696\\uFE0F Licitaci\\u00F3n"};
  };

  return e.jsxs("div",{style:{padding:"24px 32px",maxWidth:1300,margin:"0 auto"},children:[
    e.jsxs("div",{style:d({},sty.card),children:[
      e.jsx("div",{style:{fontSize:18,fontWeight:800,color:th.text,marginBottom:16},children:"\\uD83C\\uDFDB\\uFE0F Buscar en Mercado P\\u00FAblico"}),
      e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:16},children:canales.map(function(ch){
        return e.jsxs("button",{onClick:function(){setCanal(ch.id)},style:{
          padding:"10px 18px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:12,
          fontFamily:"'DM Sans',sans-serif",border:canal===ch.id?"2px solid "+th.accent:"1px solid "+th.border,
          background:canal===ch.id?"rgba(245,160,32,.12)":th.card,color:canal===ch.id?th.accent:th.muted,
          transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2
        },children:[
          e.jsx("span",{children:ch.label}),
          e.jsx("span",{style:{fontSize:10,fontWeight:400,opacity:.7},children:ch.desc})
        ]},ch.id)
      })}),
      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:canal==="licitaciones"?"1fr 1fr":"(canal==='compra_agil'?'1fr 1fr':'1fr 1fr 1fr')",gap:12,marginBottom:12},children:[
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Palabras clave"}),
          e.jsx("input",{list:"sugerencias-mp",style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: pintura, construcci\\u00F3n, mantenci\\u00F3n...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"sugerencias-mp",children:["construcci\\u00F3n","reparaci\\u00F3n","mantenci\\u00F3n","obras civiles","pavimentaci\\u00F3n","pintura","techumbre","demolici\\u00F3n","alba\\u00F1iler\\u00EDa","carpinter\\u00EDa","instalaci\\u00F3n el\\u00E9ctrica","gasfiter\\u00EDa","aseo","jardiner\\u00EDa"].map(function(opt){return e.jsx("option",{value:opt},opt)})})
        ]}),
        (canal==="todos"||canal==="licitaciones")&&e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Organismo (Licitaciones)"}),
          e.jsx("input",{list:"lista-organismos-mp",style:d({},sty.inp),value:organismoSel,onChange:function(ev){setOrganismoSel(ev.target.value)},placeholder:"Todas las entidades...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"lista-organismos-mp",children:organismosList.map(function(org){return e.jsx("option",{value:org.NombreEmpresa},org.CodigoEmpresa)})})
        ]}),
        (canal==="todos"||canal==="compra_agil")&&e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Regi\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value)},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]})
      ]}),
      e.jsx("button",{style:u(d({},sty.btn("p")),{padding:"12px 32px",fontSize:14,width:"100%"}),onClick:handleSearch,children:loading?"\\u23F3 Buscando...":"\\uD83D\\uDD0E Buscar Oportunidades"})
    ]}),
    results.length>0&&e.jsxs("div",{style:{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
      e.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[
        e.jsxs("span",{style:{fontSize:13,fontWeight:700,color:th.text},children:[results.length+" resultados"]}),
        e.jsxs("span",{style:{fontSize:12,color:th.muted},children:[
          results.filter(function(x){return x._source==="licitacion"}).length+" licitaciones, "+
          results.filter(function(x){return x._source==="compra_agil"}).length+" compra \\u00E1gil"
        ]})
      ]}),
      e.jsxs("div",{style:{display:"flex",gap:6},children:[
        e.jsx("button",{style:u(d({},sty.btn("s")),{padding:"6px 12px",fontSize:12}),onClick:function(){page>1&&setPage(page-1)},children:"\\u25C0"}),
        e.jsxs("span",{style:{fontSize:12,color:th.muted,padding:"6px 10px"},children:["P\\u00E1g. "+page+" de "+totalPages]}),
        e.jsx("button",{style:u(d({},sty.btn("s")),{padding:"6px 12px",fontSize:12}),onClick:function(){page<totalPages&&setPage(page+1)},children:"\\u25B6"})
      ]})
    ]}),
    e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12},children:paged.map(function(it,idx){
      var cd=countdown(it.Fechas?it.Fechas.FechaCierre:null);
      var badge=srcBadge(it._source);
      return e.jsxs("div",{style:u(d({},sty.card),{position:"relative",transition:"transform .15s,box-shadow .15s"}),children:[
        cd&&e.jsx("div",{style:{position:"absolute",top:12,right:14,background:cd.color+"22",color:cd.color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700},children:"\\u23F1 "+cd.txt}),
        e.jsx("div",{style:{fontSize:11,background:badge.bg,color:badge.color,padding:"4px 8px",borderRadius:4,fontWeight:800,marginBottom:8,display:"inline-block"},children:badge.label}),
        e.jsx("div",{style:{fontSize:14,fontWeight:700,color:th.text,marginBottom:6,paddingRight:80,lineHeight:1.3},children:it.Nombre||"Sin nombre"}),
        e.jsx("div",{style:{fontSize:12,color:th.muted,marginBottom:8},children:it.Comprador?it.Comprador.NombreOrganismo:"Organismo no disponible"}),
        e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10},children:[
          it.Comprador&&it.Comprador.RegionUnidad&&e.jsx("span",{style:{fontSize:11,background:"rgba(96,165,250,.15)",color:"#60a5fa",padding:"3px 8px",borderRadius:12,fontWeight:600},children:"\\uD83D\\uDCCD "+it.Comprador.RegionUnidad})
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
`;

c = c.substring(0, startIdx) + newBuscador + c.substring(endIdx);
fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('MpBuscador fully replaced with advanced search!');
