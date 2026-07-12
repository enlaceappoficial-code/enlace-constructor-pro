const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const fp2Start = 'function Fp2(props) {\n  var _t = V("buscar"), activeTab = _t[0], setActiveTab = _t[1];';
const fp2StartReplacement = 'function Fp2(props) {\n  var _t = V((props.cfg && props.cfg.apiKeyMP) ? "buscar" : "primeros_pasos"), activeTab = _t[0], setActiveTab = _t[1];';

const tabsOriginal = `var tabs=[
    {id:"buscar",icon:"\\uD83D\\uDD0E",label:"Buscar Oportunidades"},`;
const tabsReplacement = `var tabs=[
    {id:"primeros_pasos",icon:"\\uD83C\\uDF93",label:"Primeros Pasos"},
    {id:"buscar",icon:"\\uD83D\\uDD0E",label:"Buscar Oportunidades"},`;

const renderOriginal = `e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"0"},children:
      activeTab==="buscar"?e.jsx(MpBuscador,{`;
const renderReplacement = `e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"0"},children:
      activeTab==="primeros_pasos"?e.jsx(MpOnboarding,{th:props.th, sty:props.sty, cfg:props.cfg, onGoConfig:function(){props.setPage("config")}})
      :activeTab==="buscar"?e.jsx(MpBuscador,{`;

const componentCode = `function MpOnboarding(props) {
  var th=props.th,sty=props.sty;
  var steps = [
    {
      title: "¿Por qué venderle al Estado?",
      desc: "Mercado Público es la plataforma de compras del Estado de Chile. Cada día se publican cientos de licitaciones y compras ágiles para proyectos de construcción, mantenimiento y obras civiles. Con Enlace Constructor Pro, puedes buscar estas oportunidades y generar los presupuestos rápidamente.",
      icon: "🏢"
    },
    {
      title: "1. Regístrate en ChileProveedores",
      desc: "Para poder ofertar, tu empresa debe estar inscrita en el registro oficial del Estado. El proceso es online y te permite participar en cualquier licitación a nivel nacional.",
      actionText: "Ir a ChileProveedores",
      actionUrl: "https://www.chileproveedores.cl/",
      icon: "📝"
    },
    {
      title: "2. Genera tu Ticket (Clave API)",
      desc: "Una vez registrado, ingresa al portal de Mercado Público. Ve a 'Mi Cuenta' > 'Seguridad' y genera un 'Ticket' o 'API Key'. Este código es tu llave privada que permitirá a Enlace Constructor Pro buscar oportunidades en tiempo real por ti.",
      icon: "🔑"
    },
    {
      title: "3. Configura tu Clave en el Programa",
      desc: "Pega el código generado en la Configuración de Enlace Constructor Pro. ¡Una vez hecho esto, estarás listo para empezar a buscar y analizar licitaciones directamente desde aquí!",
      actionText: "Ir a Configuración",
      actionFn: props.onGoConfig,
      icon: "⚙️",
      isPrimary: true
    }
  ];

  return e.jsxs("div",{style:{padding:"30px 40px",maxWidth:900,margin:"0 auto",fontFamily:"'DM Sans',sans-serif"},children:[
    e.jsxs("div",{style:{textAlign:"center",marginBottom:40},children:[
      e.jsx("div",{style:{fontSize:48,marginBottom:16},children:"🎓"}),
      e.jsx("h2",{style:{fontSize:24,color:th.text,fontWeight:800,marginBottom:8},children:"Primeros Pasos con Mercado Público"}),
      e.jsx("p",{style:{fontSize:15,color:th.muted,maxWidth:600,margin:"0 auto",lineHeight:1.5},children:"Sigue esta breve guía para conectar tu cuenta y empezar a descubrir oportunidades de negocio."})
    ]}),
    e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:24},children:steps.map(function(s, idx){
      return e.jsxs("div",{key:idx,style:{background:th.card,border:"1px solid "+th.border,borderRadius:12,padding:"24px",display:"flex",gap:20,alignItems:"flex-start"},children:[
        e.jsx("div",{style:{width:48,height:48,borderRadius:12,background:"rgba(245,160,32,0.1)",color:th.accent,fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:s.icon}),
        e.jsxs("div",{style:{flex:1},children:[
          e.jsx("h3",{style:{fontSize:16,color:th.text,fontWeight:700,marginBottom:8},children:s.title}),
          e.jsx("p",{style:{fontSize:14,color:th.muted,lineHeight:1.6,marginBottom:s.actionText?16:0},children:s.desc}),
          s.actionText && e.jsx("button",{
            onClick: s.actionFn ? s.actionFn : function(){ window.open(s.actionUrl, '_blank'); },
            style:{
              background: s.isPrimary ? th.accent : "transparent",
              color: s.isPrimary ? "#000" : th.text,
              border: s.isPrimary ? "none" : "1px solid "+th.border,
              padding:"8px 16px", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.2s"
            },
            children:s.actionText
          })
        ]})
      ]})
    })})
  ]});
}
`;

let modified = false;

if (c.includes('function MpBuscador(props)')) {
    c = c.replace('function MpBuscador(props)', componentCode + '\nfunction MpBuscador(props)');
    modified = true;
    console.log("Added MpOnboarding component");
}

if (c.includes(fp2Start)) {
    c = c.replace(fp2Start, fp2StartReplacement);
    console.log("Updated Fp2 start state");
}

if (c.includes(tabsOriginal)) {
    c = c.replace(tabsOriginal, tabsReplacement);
    console.log("Updated tabs array");
}

if (c.includes(renderOriginal)) {
    c = c.replace(renderOriginal, renderReplacement);
    console.log("Updated render logic");
}

if (modified) {
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Saved index.js");
}
