const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Inject MercadoPublicoComponent
const mpComponent = `window.MercadoPublicoComponent = function MercadoPublicoComponent(props) {
  const [tab, setTab] = V("compra_agil"); // Default tab
  
  const a = {
    bg: "#050a10", border: "rgba(255,255,255,.1)", text: "#fff", muted: "#8892a4", accent: props.cfg?.accentColor || "#f5a020"
  };

  return e.jsxs("div", {
    style: { display: "flex", flexDirection: "column", height: "100%" },
    children: [
      e.jsx("div", {
        style: { display: "flex", gap: 10, borderBottom: \`1px solid \${a.border}\`, padding: "0 24px", background: a.bg, position: "sticky", top: 0, zIndex: 10, paddingTop: 16 },
        children: [
          { id: "compra_agil", label: "🛒 Compra Ágil (Kanban)" },
          { id: "licitaciones", label: "🔎 Análisis de Licitaciones" }
        ].map(t => e.jsx("button", {
          key: t.id,
          onClick: () => setTab(t.id),
          style: {
            padding: "12px 24px", background: "transparent", border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14, color: tab === t.id ? a.accent : a.muted,
            borderBottom: tab === t.id ? \`3px solid \${a.accent}\` : "3px solid transparent",
            transition: "all 0.2s"
          },
          children: t.label
        }))
      }),
      e.jsx("div", {
        style: { flex: 1, overflowY: "auto", padding: "16px 0" },
        children: tab === "compra_agil" 
          ? e.jsx(window.CompraAgilComponent, props) 
          : e.jsx(Mg, props)
      })
    ]
  });
};`;

// Insert the new component right before _n.createRoot
const endIdx = content.lastIndexOf('_n.createRoot');
if (endIdx > -1) {
    content = content.substring(0, endIdx) + '\\n' + mpComponent + '\\n' + content.substring(endIdx);
}

// 2. Update the sidebar array
const oldSidebar = '{k:"licitaciones",ic:"⚖️",l:"Licitaciones",locked:!ye("licitaciones")},{k:"compra_agil",ic:"🛒",l:"Compra Ágil",locked:!ye("licitaciones")}';
const newSidebar = '{k:"mercado_publico",ic:"🏛️",l:"Mercado Público",locked:!ye("licitaciones")}';
if (content.includes(oldSidebar)) {
    content = content.replace(oldSidebar, newSidebar);
} else {
    // maybe they are separated by something else or just the original one is there
    const altOld1 = '{k:"licitaciones",ic:"⚖️",l:"Licitaciones",locked:!ye("licitaciones")}';
    if (content.includes(altOld1)) {
        content = content.replace(altOld1, newSidebar);
    }
}

// 3. Update the page titles
content = content.replace('licitaciones:"Licitaciones — Mercado Público"', 'mercado_publico:"Ventas al Estado (Mercado Público)"');
content = content.replace('compra_agil:"Compra Ágil y Licitaciones"', ''); // remove old one if exists

// 4. Update router logic
const licRoute = 'if(x==="licitaciones")return ye("licitaciones")?e.jsx(Mg,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q}):e.jsx(di,{mo:!0});';
const caRoute = 'if(x==="compra_agil")return ye("licitaciones")?e.jsx(window.CompraAgilComponent||(()=>e.jsx("div",{children:"Cargando..."})),{comprasAgiles:s,setComprasAgiles:m,cfg:l,setToast:Q,setPage:f,budgets:B,apus:g,materiales:j,catalog:b}):e.jsx(di,{mo:!0});';
const newRoute = 'if(x==="mercado_publico")return ye("licitaciones")?e.jsx(window.MercadoPublicoComponent,{comprasAgiles:s,setComprasAgiles:m,cfg:l,setToast:Q,setPage:f,budgets:B,apus:g,materiales:j,catalog:b,licitaciones:s,setLicitaciones:m}):e.jsx(di,{mo:!0});';

if (content.includes(licRoute)) {
    content = content.replace(licRoute, newRoute);
} else {
    // Try to find the start of the licitaciones router block
    const licRegex = /if\(x==="licitaciones"\)return ye\("licitaciones"\)\?e\.jsx\(Mg.*?e\.jsx\(di,\{mo:!0\}\);/;
    content = content.replace(licRegex, newRoute);
}

if (content.includes(caRoute)) {
    content = content.replace(caRoute, '');
} else {
    const caRegex = /if\(x==="compra_agil"\)return ye\("licitaciones"\)\?e\.jsx\(window\.CompraAgilComponent.*?e\.jsx\(di,\{mo:!0\}\);/;
    content = content.replace(caRegex, '');
}

// Write the file
fs.writeFileSync('src/assets/index.js', content, 'utf8');
console.log("Unified Mercado Público module successfully!");

