const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Add ContextoMPModal component definition before Pg
const contextoMPModalStr = `function ContextoMPModal({idMP, cfg, onClose}) {
    const [loading, setLoading] = V(true);
    const [data, setData] = V(null);
    const [error, setError] = V("");

    Re.useEffect(()=>{
        if(!idMP) {
            setError("Licitación sin código ID de Mercado Público.");
            setLoading(false);
            return;
        }
        if(!cfg.mpTicket) {
            setError("Falta configurar el Ticket API de Mercado Público en Ajustes.");
            setLoading(false);
            return;
        }
        fetch("https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo="+idMP+"&ticket="+cfg.mpTicket)
            .then(res=>res.json())
            .then(res=>{
                if(res.Listado && res.Listado.length > 0) {
                    setData(res.Listado[0]);
                } else {
                    setError("No se encontraron detalles para esta licitación en MP.");
                }
                setLoading(false);
            })
            .catch(err=>{
                setError("Error de conexión con Mercado Público.");
                setLoading(false);
            });
    }, [idMP, cfg.mpTicket]);

    return e.jsxs("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999,backdropFilter:"blur(2px)"},children:[
        e.jsxs("div",{style:u(d({},c.card),{width:800,maxWidth:"95vw",maxHeight:"90vh",display:"flex",flexDirection:"column",padding:0,overflow:"hidden"}),children:[
            e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid "+a.border,display:"flex",justifyContent:"space-between",alignItems:"center",background:a.sb},children:[
                e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:18,fontWeight:800,color:a.text},children:"📑 Contexto de Licitación"}),e.jsx("div",{style:{fontSize:13,color:a.accent,fontWeight:600,marginTop:4},children:idMP})]}),
                e.jsx("button",{style:c.btn("d"),onClick:onClose,children:"✕"})
            ]}),
            e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"20px",background:a.bg},children:
                loading ? e.jsx("div",{style:{textAlign:"center",padding:40,color:a.muted},children:"Cargando bases desde Mercado Público..."}) :
                error ? e.jsxs("div",{style:{textAlign:"center",padding:40,color:"#f87171"},children:[e.jsx("div",{style:{fontSize:32,marginBottom:10},children:"⚠️"}),error]}) :
                data && e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[
                    e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:700,color:a.text,fontSize:15,marginBottom:6},children:"Descripción General"}),e.jsx("div",{style:{fontSize:13,color:a.muted,lineHeight:"1.5",background:a.card,padding:14,borderRadius:8,border:"1px solid "+a.border},children:data.Descripcion})]}),
                    e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:700,color:a.text,fontSize:15,marginBottom:6},children:"Fechas Clave"}),
                        e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,background:a.card,padding:14,borderRadius:8,border:"1px solid "+a.border},children:[
                            e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11,color:a.muted},children:"Cierre"}),e.jsx("div",{style:{fontSize:13,fontWeight:600},children:(data.Fechas.FechaCierre||"").replace("T"," ")})]}),
                            e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11,color:a.muted},children:"Adjudicación"}),e.jsx("div",{style:{fontSize:13,fontWeight:600},children:(data.Fechas.FechaAdjudicacion||"").replace("T"," ")})]}),
                            e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11,color:a.muted},children:"Visita a Terreno"}),e.jsx("div",{style:{fontSize:13,fontWeight:600},children:(data.Fechas.FechaVisitaTerreno||"").replace("T"," ")})]}),
                            e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11,color:a.muted},children:"Preguntas"}),e.jsx("div",{style:{fontSize:13,fontWeight:600},children:(data.Fechas.FechaInicioPreguntas||"").replace("T"," ")})]}),
                        ]})
                    ]}),
                    e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:700,color:a.text,fontSize:15,marginBottom:10},children:"Bases y Archivos Adjuntos"}),
                        data.Adjuntos && data.Adjuntos.Adjunto && data.Adjuntos.Adjunto.length > 0 ? e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:data.Adjuntos.Adjunto.map((adj, idx)=>e.jsxs("a",{href:adj.Url,target:"_blank",style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:14,border:"1px solid "+a.border,borderRadius:8,textDecoration:"none",color:a.text,background:a.card,transition:"all .2s"},children:[
                            e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("span",{style:{fontSize:20},children:"📄"}),e.jsx("span",{style:{fontSize:13,fontWeight:600},children:adj.NombreArchivo})]}),
                            e.jsx("div",{style:{fontSize:11,color:a.accent,fontWeight:700,background:a.accent+"22",padding:"4px 8px",borderRadius:4},children:"Descargar"})
                        ]},idx))}) : e.jsx("div",{style:{fontSize:13,color:a.muted,fontStyle:"italic"},children:"No hay archivos adjuntos disponibles en MP para esta licitación."})
                    ]})
                ]})
            })
        ]})
    ]});
}`;

content = content.replace('function Pg({', contextoMPModalStr + '\nfunction Pg({');

// 2. Add state to Pg
content = content.replace('[apuSearch,setApuSearch]=V("");', '[apuSearch,setApuSearch]=V(""),[showContextoMP,setShowContextoMP]=V(!1);');

// 3. Add Contexto button in Pg
const oldHeader = 'e.jsx("span",{children:"📝 Precios de tu oferta"}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"4px 10px",fontSize:12}),onClick:()=>{let newG={...g},changes=!1;v.forEach(it=>{if(it.tieneAPU){newG[it.idx]=it.precioSugerido;changes=!0;}});if(changes)z(newG);else alert("No hay APUs vinculados para sugerir precios.");},children:"⚡ Usar Todos los Sugeridos"})]})';
const newHeader = 'e.jsx("span",{children:"📝 Precios de tu oferta"}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx("button",{style:u(d({},c.btn("s")),{padding:"4px 10px",fontSize:12,border:"1px solid "+a.accent,color:a.accent,background:"transparent"}),onClick:()=>setShowContextoMP(!0),children:"📑 Leer Bases y Contexto"}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"4px 10px",fontSize:12}),onClick:()=>{let newG={...g},changes=!1;v.forEach(it=>{if(it.tieneAPU){newG[it.idx]=it.precioSugerido;changes=!0;}});if(changes)z(newG);else alert("No hay APUs vinculados para sugerir precios.");},children:"⚡ Usar Todos los Sugeridos"})]})]})';
content = content.split(oldHeader).join(newHeader);

// 4. Inject Modal into Pg
const modalJSX = ',showContextoMP&&e.jsx(ContextoMPModal,{idMP:t.idMP,cfg:l,onClose:()=>setShowContextoMP(!1)})';
// We need to inject it before the closing of Pg.
const strToFind = 'apuModalIdx!==null&&e.jsxs("div",{style:{position:"fixed"';
content = content.split(strToFind).join(modalJSX + ',' + strToFind);

fs.writeFileSync('src/assets/index.js', content, 'utf8');
console.log("ContextoMPModal integrated into Pg");
