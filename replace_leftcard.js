const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const startStr = 'e.jsxs("div",{style:c.card,children:[e.jsxs("div",{style:{fontSize:15,fontWeight:700,color:a.text,marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:20},children:"\uD83D\uDCE5"})," Descargar Licitaci\u00F3n"]})';
const endStr = 'children:"ECP se conectar\u00E1 a la API usando tu Ticket para descargar las bases autom\u00E1ticamente."})]})]})';

const sIdx = content.indexOf(startStr);
const eIdx = content.indexOf(endStr, sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    const fullEndIdx = eIdx + endStr.length;
    
    const newLeftCard = 'e.jsxs("div",{style:u(d({},c.card),{display:"flex",flexDirection:"column",height:"600px"}),children:[e.jsxs("div",{style:{fontSize:15,fontWeight:700,color:a.text,marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:20},children:"\uD83D\uDD0D"})," Buscador de Licitaciones"]}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"10px",fontSize:13,width:"100%",marginBottom:12}),onClick:async ()=>{const tk=h.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";if(!tk)return alert("Falta Ticket API");try{window.licSyncing=true;y(Date.now().toString());const r=await fetch("https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?estado=activas&ticket="+tk);const d=await r.json();window.licSyncing=false;if(d.Listado){window.licList=d.Listado;alert("Sincronizadas "+d.Listado.length+" licitaciones activas.")}y(Date.now().toString())}catch(e){window.licSyncing=false;y(Date.now().toString());alert("Error descargando licitaciones.")}},children:window.licSyncing?"\u23F3 Sincronizando (Toma unos segundos)...":"\uD83D\uDD04 Sincronizar Licitaciones Activas"}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:12,color:a.muted,marginBottom:5,fontWeight:600},children:"FILTRAR POR PALABRA (T\u00CDTULO)"}),e.jsx("input",{style:u(d({},c.inp),{margin:"0 0 12px 0",width:"100%",boxSizing:"border-box"}),placeholder:"Ej: pavimentaci\u00F3n, pintura...",value:S,onChange:N=>O(N.target.value)})]}),e.jsx("div",{style:{flex:1,overflowY:"auto",background:"var(--surface)",border:"1px solid "+a.border,borderRadius:8},children:window.licList?window.licList.filter(l=>!S||l.Nombre.toLowerCase().includes(S.toLowerCase())).map((l,i)=>e.jsxs("div",{style:{padding:"10px",borderBottom:"1px solid "+a.border,cursor:"pointer",background:window.licData&&window.licData.CodigoExterno===l.CodigoExterno?"rgba(245,160,32,0.1)":"transparent"},onClick:async()=>{const tk=h.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";try{window.licLoading=true;y(Date.now().toString());const r=await fetch("https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo="+l.CodigoExterno+"&ticket="+tk);const d=await r.json();window.licLoading=false;if(d.Listado)window.licData=d.Listado[0];y(Date.now().toString())}catch(e){}},children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,color:a.accent,marginBottom:4},children:l.CodigoExterno}),e.jsx("div",{style:{fontSize:12,color:a.text,lineHeight:1.3},children:l.Nombre})]},l.CodigoExterno)):e.jsx("div",{style:{padding:20,textAlign:"center",color:a.muted,fontSize:12},children:"Haz clic en Sincronizar para descargar la base de datos de hoy."})})]})';

    const finalContent = content.substring(0, sIdx) + newLeftCard + content.substring(fullEndIdx);
    fs.writeFileSync('src/assets/index.js', finalContent, 'utf8');
    console.log("Left card replaced!");
} else {
    console.log("Not found.");
}
