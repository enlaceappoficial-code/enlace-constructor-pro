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
      title: "1. Crea tu Identidad Estatal",
      desc: "Para jugar en las grandes ligas, necesitas estar registrado. Ve a Mercado Público, inscribe tu empresa y prepárate para ofertar. ¡Es el único trámite manual que harás!",
      actionText: "Ir a Mercado Público",
      actionUrl: "https://www.mercadopublico.cl/Home",
      icon: "📝"
    },
    {
      title: "2. Solicita tu Llave Maestra",
      desc: "Entra a tu portal de Mercado Público, ve a Seguridad y solicita tu Ticket (API Key). Esta contraseña secreta es la que nos permitirá a nosotros (ECP) entrar al sistema y trabajar por ti 24/7.",
      actionText: "Pedir API Key",
      actionUrl: "https://www.chilecompra.cl/api/",
      icon: "🔑"
    },
    {
      title: "3. Sinergia Total con ECP",
      desc: "Pega tu llave aquí en las configuraciones de Enlace Constructor Pro. Al instante, nuestros motores empezarán a descargar todos los negocios disponibles. ¡Hagamos equipo y ganemos más licitaciones!",
      actionText: "Ir a Configuración",
      actionFn: props.onGoConfig,
      icon: "🚀",
      isPrimary: true
    }
  ];

  return e.jsxs("div",{style:{padding:"0 0 60px",maxWidth:1100,margin:"0 auto",fontFamily:"'DM Sans',sans-serif"},children:[
    // HERO
    e.jsx("div", {style:{background:"linear-gradient(135deg, "+th.accent+" 0%, #ff8c00 100%)", borderRadius:"0 0 40px 40px", padding:"80px 40px", textAlign:"center", color:"#fff", boxShadow:"0 10px 40px rgba(245,160,32,0.3)", marginBottom:50}, children:
      e.jsxs("div", {style:{maxWidth:800, margin:"0 auto"}, children:[
        e.jsx("div",{style:{fontSize:64,marginBottom:20},children:"🏆"}),
        e.jsx("h1",{style:{fontSize:44,fontWeight:900,marginBottom:20, lineHeight:1.15},children:"Deja de buscar. Empieza a ganar."}),
        e.jsx("p",{style:{fontSize:20,opacity:0.95,lineHeight:1.6},children:"Mercado Público mueve millones de dólares diarios en obras y proyectos. Entrar a este mundo puede parecer abrumador, pero ahí es donde entra Enlace Constructor Pro. Somos tu socio tecnológico estratégico."})
      ]})
    }),
    
    // PILARES
    e.jsxs("div",{style:{padding:"0 40px", marginBottom:60},children:[
      e.jsx("h2",{style:{fontSize:28,fontWeight:800,color:th.text,textAlign:"center",marginBottom:40},children:"¿Por qué hacer equipo con ECP?"}),
      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:30},children:[
        e.jsxs("div",{style:{background:th.card,padding:"32px",borderRadius:20,boxShadow:"0 8px 24px rgba(0,0,0,0.04)",border:"1px solid "+th.border},children:[
          e.jsx("div",{style:{fontSize:32,marginBottom:16},children:"🔍"}),
          e.jsx("h3",{style:{fontSize:20,fontWeight:800,color:th.text,marginBottom:12},children:"Búsqueda Inteligente"}),
          e.jsx("p",{style:{fontSize:15,color:th.muted,lineHeight:1.6},children:"Se acabaron las horas perdidas revisando Mercado Público manualmente. ECP encuentra las licitaciones exactas para tu perfil en tiempo real."})
        ]}),
        e.jsxs("div",{style:{background:th.card,padding:"32px",borderRadius:20,boxShadow:"0 8px 24px rgba(0,0,0,0.04)",border:"1px solid "+th.border},children:[
          e.jsx("div",{style:{fontSize:32,marginBottom:16},children:"⚡"}),
          e.jsx("h3",{style:{fontSize:20,fontWeight:800,color:th.text,marginBottom:12},children:"Presupuestos Flash"}),
          e.jsx("p",{style:{fontSize:15,color:th.muted,lineHeight:1.6},children:"Lo que antes te tomaba días cotizar, con nuestro motor APU lo haces en minutos. Sé el primero y el más preciso al ofertar."})
        ]}),
        e.jsxs("div",{style:{background:th.card,padding:"32px",borderRadius:20,boxShadow:"0 8px 24px rgba(0,0,0,0.04)",border:"1px solid "+th.border},children:[
          e.jsx("div",{style:{fontSize:32,marginBottom:16},children:"📈"}),
          e.jsx("h3",{style:{fontSize:20,fontWeight:800,color:th.text,marginBottom:12},children:"Aumenta tus Ganancias"}),
          e.jsx("p",{style:{fontSize:15,color:th.muted,lineHeight:1.6},children:"Al optimizar tu tiempo, podrás participar en el triple de licitaciones. Más propuestas enviadas significa más contratos ganados."})
        ]})
      ]})
    ]}),

    // PASOS
    e.jsxs("div",{style:{padding:"40px", background:"#f5f7fa", borderRadius:24, margin:"0 40px 60px"},children:[
      e.jsx("h2",{style:{fontSize:28,fontWeight:800,color:"#111",textAlign:"center",marginBottom:16},children:"Tu camino al éxito en 3 pasos"}),
      e.jsx("p",{style:{fontSize:16,color:"#666",textAlign:"center",marginBottom:40,maxWidth:600,margin:"0 auto 40px"},children:"Sigue esta breve guía para conectar tu cuenta y dejar que nosotros hagamos el trabajo duro."}),
      e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:24},children:
        steps.map(function(s, idx){
          return e.jsxs("div",{key:idx,style:{background:"#fff",border:"1px solid rgba(0,0,0,0.05)",borderRadius:16,padding:"32px",display:"flex",flexDirection:"column",boxShadow:"0 10px 20px rgba(0,0,0,0.02)",transition:"transform 0.3s", cursor:"default"},children:[
            e.jsx("div",{style:{width:64,height:64,borderRadius:16,background: s.isPrimary ? th.accent : "rgba(245,160,32,0.1)",color: s.isPrimary ? "#000" : th.accent,fontSize:32,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24},children:s.icon}),
            e.jsx("h3",{style:{fontSize:20,color:"#111",fontWeight:800,marginBottom:12},children:s.title}),
            e.jsx("p",{style:{fontSize:15,color:"#555",lineHeight:1.6,flex:1,marginBottom:32},children:s.desc}),
            s.actionText && e.jsx("button",{
              onClick: s.actionFn ? s.actionFn : function(){ window.open(s.actionUrl, '_blank'); },
              style:{
                background: s.isPrimary ? "#000" : "transparent",
                color: s.isPrimary ? "#fff" : "#111",
                border: s.isPrimary ? "none" : "2px solid rgba(0,0,0,0.1)",
                padding:"14px 28px", borderRadius:12, fontWeight:800, fontSize:15, cursor:"pointer", transition:"all 0.2s", alignSelf:"flex-start"
              },
              onMouseOver: function(ev){
                 if(s.isPrimary) ev.currentTarget.style.transform = "translateY(-2px)";
                 else { ev.currentTarget.style.borderColor = th.accent; ev.currentTarget.style.color = th.accent; }
              },
              onMouseOut: function(ev){
                 if(s.isPrimary) ev.currentTarget.style.transform = "translateY(0)";
                 else { ev.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; ev.currentTarget.style.color = "#111"; }
              },
              children:s.actionText
            })
          ]})
        })
      })
    ]}),

    // FAQ / TIPS
    e.jsxs("div",{style:{padding:"0 40px"},children:[
      e.jsx("h2",{style:{fontSize:24,fontWeight:800,color:th.text,marginBottom:30},children:"Derribando Miedos: Todo lo que debes saber"}),
      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:24},children:[
        e.jsxs("div",{style:{background:th.card,padding:"24px",borderRadius:16,border:"1px solid "+th.border},children:[
          e.jsx("h4",{style:{fontSize:16,fontWeight:700,color:th.text,marginBottom:8},children:"¿Es difícil venderle al Estado?"}),
          e.jsx("p",{style:{fontSize:14,color:th.muted,lineHeight:1.5},children:"Solía serlo. Pero con ECP, te entregamos las oportunidades masticadas y los cálculos pre-hechos. Hacemos que lo complejo sea pan comido."})
        ]}),
        e.jsxs("div",{style:{background:th.card,padding:"24px",borderRadius:16,border:"1px solid "+th.border},children:[
          e.jsx("h4",{style:{fontSize:16,fontWeight:700,color:th.text,marginBottom:8},children:"¿Tiene algún costo sacar la clave API?"}),
          e.jsx("p",{style:{fontSize:14,color:th.muted,lineHeight:1.5},children:"¡Absolutamente no! Es un trámite 100% gratuito que realizas dentro de tu cuenta de Mercado Público. Es tu derecho como proveedor del Estado."})
        ]})
      ]})
    ]})

  ]});
}
`;

c = c.substring(0, startIdx) + newComponent + '\n' + c.substring(nextFuncIdx);
fs.writeFileSync('src/assets/index.js', c);
console.log("Applied massive landing page redesign for Onboarding!");
