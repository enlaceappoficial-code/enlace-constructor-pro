const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Replace the entire MpBuscador function with one that searches BOTH APIs
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

  var regiones=["Todas","Tarapac\\u00E1","Antofagasta","Atacama","Coquimbo","Valpara\\u00EDso","O'Higgins","Maule","Biob\\u00EDo","Araucan\\u00EDa","Los Lagos","Ays\\u00E9n","Magallanes","Metropolitana","Los R\\u00EDos","Arica y Parinacota","\\u00D1uble"];
  var canales=[
    {id:"todos",label:"\\uD83C\\uDF10 Todos los canales",desc:"Licitaciones + Compra \\u00C1gil"},
    {id:"licitaciones",label:"\\u2696\\uFE0F Solo Licitaciones",desc:"Licitaciones p\\u00FAblicas y privadas"},
    {id:"compra_agil",label:"\\uD83D\\uDED2 Solo Compra \\u00C1gil",desc:"\\u00D3rdenes de compra directas"}
  ];

  var handleSearch = function(){
    if(!query.trim()) return props.setToast("\\u26A0\\uFE0F Ingresa palabras clave para buscar");
    setLoading(true);setPage(1);setResults([]);
    var tk=cfg&&cfg.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";
    var qLow=query.toLowerCase().split(" ").filter(function(w){return w.length>0});
    var negWords=neg.toLowerCase().split(",").map(function(w){return w.trim()}).filter(function(w){return w.length>0});

    var filterFn=function(items,source){
      return items.filter(function(it){
        var txt=((it.Nombre||it.nombre||"")+" "+(it.Descripcion||it.descripcion||"")).toLowerCase();
        var matchQ=qLow.every(function(w){return txt.indexOf(w)>-1});
        var matchNeg=negWords.length===0||negWords.every(function(w){return txt.indexOf(w)===-1});
        return matchQ&&matchNeg;
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
      var urlOC="https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?estado=todos&ticket="+tk;
      promises.push(
        fetch(urlOC).then(function(r){return r.json()}).then(function(data){
          return data&&data.Listado?filterFn(data.Listado,"compra_agil"):[];
        }).catch(function(){return[]})
      );
    }

    Promise.all(promises).then(function(arrays){
      var all=[];
      arrays.forEach(function(a){all=all.concat(a)});
      if(region!=="Todas"){
        all=all.filter(function(it){
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
    var idField=item.CodigoExterno||item.Codigo||item.codigo||"";
    if(props.licitaciones.some(function(x){return x.idMP===idField})){
      return props.setToast("\\u26A0\\uFE0F Ya est\\u00E1 en tu tablero");
    }
    var src=item._source||"licitacion";
    var newItem={
      id:Date.now(),
      idMP:idField,
      nombreObra:item.Nombre||item.nombre||"",
      organismo:item.Comprador?item.Comprador.NombreOrganismo:item.proveedor||"",
      region:item.Comprador?item.Comprador.RegionUnidad:item.regionComprador||"",
      montoEstimado:item.MontoEstimado||item.Total||item.totalNeto||0,
      fechaCierre:item.Fechas?item.Fechas.FechaCierre:item.fechaEnvio||"",
      estado:"Pendiente",
      notas:"",
      fechaGuardado:new Date().toISOString().split("T")[0],
      tipo:item.Tipo||"",
      canal:src,
      items:item.Items?item.Items.Listado:[]
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
      e.jsx("div",{style:{fontSize:18,fontWeight:800,color:th.text,marginBottom:4},children:"\\uD83C\\uDFDB\\uFE0F Buscar Oportunidades en Mercado P\\u00FAblico"}),
      e.jsx("div",{style:{fontSize:12,color:th.muted,marginBottom:16},children:"Busca simult\\u00E1neamente en Licitaciones y Compra \\u00C1gil"}),
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
      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end"},children:[
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Regi\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value)},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]}),
        e.jsx("button",{style:u(d({},sty.btn("p")),{padding:"12px 32px",fontSize:14}),onClick:handleSearch,children:loading?"\\u23F3 Buscando en Mercado P\\u00FAblico...":"\\uD83D\\uDD0E Buscar Oportunidades"})
      ]})
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
      var cierre=it.Fechas?it.Fechas.FechaCierre:it.fechaEnvio||null;
      var cd=countdown(cierre);
      var badge=srcBadge(it._source);
      var monto=it.MontoEstimado||it.Total||it.totalNeto||0;
      var nombre=it.Nombre||it.nombre||"Sin nombre";
      var org=it.Comprador?it.Comprador.NombreOrganismo:it.proveedor||"Organismo no disponible";
      var reg=it.Comprador?it.Comprador.RegionUnidad:it.regionComprador||"";

      return e.jsxs("div",{style:u(d({},sty.card),{position:"relative",transition:"transform .15s,box-shadow .15s"}),children:[
        e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8},children:[
          e.jsx("span",{style:{fontSize:11,background:badge.bg,color:badge.color,padding:"3px 10px",borderRadius:20,fontWeight:700},children:badge.label}),
          cd&&e.jsx("span",{style:{fontSize:11,background:cd.color+"22",color:cd.color,padding:"3px 10px",borderRadius:20,fontWeight:700},children:"\\u23F1 "+cd.txt})
        ]}),
        e.jsx("div",{style:{fontSize:14,fontWeight:700,color:th.text,marginBottom:6,lineHeight:1.3},children:nombre}),
        e.jsx("div",{style:{fontSize:12,color:th.muted,marginBottom:8},children:org}),
        reg&&e.jsx("span",{style:{fontSize:11,background:"rgba(136,146,164,.15)",color:th.muted,padding:"3px 8px",borderRadius:12,fontWeight:600,marginBottom:8,display:"inline-block"},children:"\\uD83D\\uDCCD "+reg}),
        monto&&parseFloat(monto)>0?e.jsx("div",{style:{fontSize:16,fontWeight:800,color:"#34d399",marginBottom:10,marginTop:4},children:"$ "+Number(monto).toLocaleString("es-CL")}):null,
        e.jsxs("div",{style:{display:"flex",gap:8,marginTop:6},children:[
          e.jsx("button",{style:u(d({},sty.btn("p")),{flex:1,padding:"8px",fontSize:12}),onClick:function(){saveToKanban(it)},children:"\\uD83D\\uDCCB Guardar en Kanban"}),
          e.jsx("a",{href:"https://www.mercadopublico.cl/",target:"_blank",rel:"noopener",style:u(d({},sty.btn("s")),{flex:1,padding:"8px",fontSize:12,textAlign:"center",textDecoration:"none",display:"block"}),children:"\\uD83C\\uDFDB\\uFE0F Ver en MP"})
        ]})
      ]},idx)
    })})
  ]});
}
`;

c = c.substring(0, startIdx) + newBuscador + c.substring(endIdx);

// Also update the Kanban to show canal badges
// Find the kanban card where it shows nombreObra and add a canal badge
const kanbanNameLine = 'e.jsx("div",{style:{fontSize:13,fontWeight:700,color:th.text,marginBottom:4,lineHeight:1.3},children:it.nombreObra||it.Nombre||"Sin nombre"})';
const kanbanNameWithBadge = 'e.jsxs("div",{style:{marginBottom:4},children:[it.canal==="compra_agil"?e.jsx("span",{style:{fontSize:10,background:"rgba(52,211,153,.15)",color:"#34d399",padding:"2px 7px",borderRadius:10,fontWeight:700,marginRight:6},children:"\\uD83D\\uDED2 CA"}):e.jsx("span",{style:{fontSize:10,background:"rgba(96,165,250,.15)",color:"#60a5fa",padding:"2px 7px",borderRadius:10,fontWeight:700,marginRight:6},children:"\\u2696\\uFE0F LIC"}),e.jsx("span",{style:{fontSize:13,fontWeight:700,color:th.text,lineHeight:1.3},children:it.nombreObra||it.Nombre||"Sin nombre"})]})';

if (c.includes(kanbanNameLine)) {
  c = c.replace(kanbanNameLine, kanbanNameWithBadge);
  console.log('Updated Kanban cards with canal badges');
}

// Update the tab label to be more inclusive
c = c.replace('"Buscar Oportunidades"', '"Buscar en Mercado P\\u00FAblico"');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Done! Integrated Compra Ágil into the search.');
