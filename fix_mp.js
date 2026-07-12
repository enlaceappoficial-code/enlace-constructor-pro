const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
let changes = 0;

// 1. Remove the broken MercadoPublicoComponent that's outside the IIFE
const mpStart = c.indexOf('window.MercadoPublicoComponent = function MercadoPublicoComponent');
if (mpStart > -1) {
    // Find where the component ends (it's "};\n" before _n.createRoot)
    const mpEnd = c.indexOf('\n_n.createRoot', mpStart);
    if (mpEnd > -1) {
        c = c.substring(0, mpStart) + c.substring(mpEnd + 1); // +1 to skip the \n
        changes++;
        console.log('1. Removed external MercadoPublicoComponent');
    }
}

// 2. Now inject the MercadoPublicoComponent INSIDE the IIFE, right before "_n.createRoot"
// This time it will be inside the IIFE scope so it has access to V, e, Mg, etc.
const mpComponentInline = `
function Fp2(props) {
  var tab = V("compra_agil"), activeTab = tab[0], setActiveTab = tab[1];
  var accent = props.cfg && props.cfg.accentColor || "#f5a020";
  var tabs = [{id:"compra_agil",label:"\uD83D\uDED2 Compra \u00C1gil (Kanban)"},{id:"licitaciones",label:"\uD83D\uDD0E An\u00E1lisis de Licitaciones"}];
  return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%"},children:[
    e.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid rgba(255,255,255,.12)",padding:"0",background:"rgba(255,255,255,.03)",position:"sticky",top:0,zIndex:10},children:tabs.map(function(t){return e.jsx("button",{onClick:function(){setActiveTab(t.id)},style:{padding:"14px 28px",background:"transparent",border:"none",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:activeTab===t.id?accent:"#8892a4",borderBottom:activeTab===t.id?"3px solid "+accent:"3px solid transparent",transition:"all 0.2s"},children:t.label},t.id)})}),
    e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"0"},children:
      activeTab==="compra_agil"
        ? e.jsx(window.CompraAgilComponent||function(){return e.jsx("div",{children:"Cargando..."})},{comprasAgiles:props.licitaciones,setComprasAgiles:props.setLicitaciones,cfg:props.cfg,setToast:props.setToast,setPage:props.setPage,budgets:props.budgets,apus:props.apus,materiales:props.materiales,catalog:props.catalog})
        : e.jsx(Mg,{licitaciones:props.licitaciones,setLicitaciones:props.setLicitaciones,budgets:props.budgets,cfg:props.cfg,apus:props.apus,materiales:props.materiales,catalog:props.catalog,setToast:props.setToast})
    })
  ]});
}
`;

const createRootIdx = c.lastIndexOf('_n.createRoot');
if (createRootIdx > -1) {
    c = c.substring(0, createRootIdx) + mpComponentInline + '\n' + c.substring(createRootIdx);
    changes++;
    console.log('2. Injected Fp2 (MercadoPublicoComponent) inside IIFE');
}

// 3. Add the route for mercado_publico right before the licitaciones route
const licRoute = 'if(x==="licitaciones")return ye("licitaciones")?e.jsx(Mg,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q})';
const mpRoute = 'if(x==="mercado_publico")return ye("licitaciones")?e.jsx(Fp2,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q,setPage:f}):e.jsx(di,{modulo:"licitaciones",planActual:Ce,onGoConfig:function(){f("config")}});';

if (c.includes(licRoute) && !c.includes('x==="mercado_publico"')) {
    c = c.replace(licRoute, mpRoute + licRoute);
    changes++;
    console.log('3. Added mercado_publico route');
}

// 4. Also remove the old compra_agil route if it exists
const caRouteRegex = /if\(x==="compra_agil"\)return[^;]+;/;
if (caRouteRegex.test(c)) {
    c = c.replace(caRouteRegex, '');
    changes++;
    console.log('4. Removed old compra_agil route');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Done! Total changes:', changes);
