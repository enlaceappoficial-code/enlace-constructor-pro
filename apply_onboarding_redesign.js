const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const startStr = 'function MpOnboarding(props) {';
const startIdx = c.indexOf(startStr);
if (startIdx === -1) {
  console.log("Could not find MpOnboarding");
  process.exit(1);
}
const nextFuncIdx = c.indexOf('function ', startIdx + 10);
if (nextFuncIdx === -1) {
  console.log("Could not find the end of MpOnboarding");
  process.exit(1);
}

const newComponent = `function MpOnboarding(props) {
  var th=props.th,sty=props.sty;
  var steps = [
    {
      title: "1. Regístrate como Proveedor",
      desc: "Únete a las miles de empresas que ya venden al Estado. Inscríbete online para poder participar en cualquier licitación a nivel nacional de forma transparente.",
      actionText: "Ir a Mercado Público",
      actionUrl: "https://www.mercadopublico.cl/Home",
      icon: "📝"
    },
    {
      title: "2. Solicita tu Llave Maestra (API)",
      desc: "Una vez dentro del portal, genera tu 'Ticket' o 'API Key' desde la sección 'Seguridad'. Este código es tu pase VIP para que busquemos oportunidades por ti.",
      actionText: "Pedir API Key",
      actionUrl: "https://www.chilecompra.cl/api/",
      icon: "🔑"
    },
    {
      title: "3. Conecta el Programa",
      desc: "Ingresa tu API Key en la Configuración de Enlace Constructor Pro. ¡En segundos, estarás viendo negocios reales y armando presupuestos ganadores!",
      actionText: "Ir a Configuración",
      actionFn: props.onGoConfig,
      icon: "🚀",
      isPrimary: true
    }
  ];

  return e.jsxs("div",{style:{padding:"0 0 60px",maxWidth:1000,margin:"0 auto",fontFamily:"'DM Sans',sans-serif"},children:[
    e.jsx("div", {style:{background:"linear-gradient(135deg, "+th.accent+" 0%, #ff8c00 100%)", borderRadius:"0 0 40px 40px", padding:"60px 40px", textAlign:"center", color:"#fff", boxShadow:"0 10px 30px rgba(245,160,32,0.2)", marginBottom:40}, children:
      e.jsxs("div", {style:{maxWidth:700, margin:"0 auto"}, children:[
        e.jsx("div",{style:{fontSize:56,marginBottom:16},children:"📈"}),
        e.jsx("h2",{style:{fontSize:36,fontWeight:900,marginBottom:16, lineHeight:1.2},children:"¡El Estado puede ser tu próximo gran cliente!"}),
        e.jsx("p",{style:{fontSize:18,opacity:0.9,lineHeight:1.6},children:"Mercado Público mueve millones cada año. Descubre cómo multiplicar tus ingresos y hacer crecer tu negocio participando en proyectos y obras civiles hoy mismo."})
      ]})
    }),
    e.jsx("div",{style:{padding:"0 40px"},children:
      e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:24},children:
        steps.map(function(s, idx){
          return e.jsxs("div",{key:idx,style:{background:th.card,border:"1px solid "+th.border,borderRadius:16,padding:"32px",display:"flex",flexDirection:"column",boxShadow:"0 10px 20px rgba(0,0,0,0.03)",transition:"transform 0.3s, box-shadow 0.3s", cursor:"default"},children:[
            e.jsx("div",{style:{width:60,height:60,borderRadius:16,background: s.isPrimary ? th.accent : "rgba(245,160,32,0.1)",color: s.isPrimary ? "#000" : th.accent,fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20},children:s.icon}),
            e.jsx("h3",{style:{fontSize:18,color:th.text,fontWeight:800,marginBottom:12},children:s.title}),
            e.jsx("p",{style:{fontSize:15,color:th.muted,lineHeight:1.6,flex:1,marginBottom:24},children:s.desc}),
            s.actionText && e.jsx("button",{
              onClick: s.actionFn ? s.actionFn : function(){ window.open(s.actionUrl, '_blank'); },
              style:{
                background: s.isPrimary ? "#000" : "transparent",
                color: s.isPrimary ? "#fff" : th.text,
                border: s.isPrimary ? "none" : "2px solid "+th.border,
                padding:"12px 24px", borderRadius:12, fontWeight:800, fontSize:14, cursor:"pointer", transition:"all 0.2s", width:"100%"
              },
              onMouseOver: function(ev){
                 if(s.isPrimary) ev.currentTarget.style.transform = "translateY(-2px)";
                 else { ev.currentTarget.style.borderColor = th.accent; ev.currentTarget.style.color = th.accent; }
              },
              onMouseOut: function(ev){
                 if(s.isPrimary) ev.currentTarget.style.transform = "translateY(0)";
                 else { ev.currentTarget.style.borderColor = th.border; ev.currentTarget.style.color = th.text; }
              },
              children:s.actionText
            })
          ]})
        })
      })
    })
  ]});
}
`;

c = c.substring(0, startIdx) + newComponent + '\n' + c.substring(nextFuncIdx);
fs.writeFileSync('src/assets/index.js', c);
console.log("Successfully replaced MpOnboarding component with the redesigned version!");
