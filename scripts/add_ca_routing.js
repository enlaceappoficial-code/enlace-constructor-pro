const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');
let changes = 0;

// 1. Add "Compra Ágil" to sidebar menu
const oldSidebar = '{k:"licitaciones",ic:"⚖️",l:"Licitaciones",locked:!ye("licitaciones")}';
const newSidebar = '{k:"licitaciones",ic:"⚖️",l:"Licitaciones",locked:!ye("licitaciones")},{k:"compra_agil",ic:"🛒",l:"Compra Ágil",locked:!ye("licitaciones")}';
if (content.includes(oldSidebar) && !content.includes('{k:"compra_agil"')) {
    content = content.replace(oldSidebar, newSidebar);
    changes++;
    console.log('1. Sidebar menu updated');
}

// 2. Add state for comprasAgiles in Jg
const sStateMatch = '=>!de.has(pe.id));return N.length>0?[...me,...N]:me})';
const caStateStr = ',[caState,setCaState]=V(()=>pt("compraagil",[]))';
if (content.includes(sStateMatch) && !content.includes('caState')) {
    content = content.replace(sStateMatch, sStateMatch + caStateStr);
    changes++;
    console.log('2. State caState added');
}

// 3. Add persistence effect
const persistMatch = 'ct(()=>{var H=setTimeout(()=>_t("licitaciones",s),2e3);return()=>clearTimeout(H)},[s]),';
const caPersistStr = 'ct(()=>{var H=setTimeout(()=>_t("compraagil",caState),2e3);return()=>clearTimeout(H)},[caState]),';
if (content.includes(persistMatch) && !content.includes('_t("compraagil"')) {
    content = content.replace(persistMatch, persistMatch + caPersistStr);
    changes++;
    console.log('3. Persistence effect added');
}

// 4. Add routing logic
const oldRoute = 'if(x==="licitaciones")return ye("licitaciones")?e.jsx(Mg,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q, setPage:f, setEditB:R, setCfg:o}):e.jsx(di,{modulo:"licitaciones",planActual:Ce,onGoConfig:()=>f("config")});';
const newRoute = oldRoute + 'if(x==="compra_agil")return ye("licitaciones")?e.jsx(window.CompraAgilComponent||(()=>{const [tk,setTk]=Re.useState("");return e.jsxs("div",{style:{padding:20},children:[e.jsx("h2",{children:"🛒 Compra Ágil"}),e.jsx("p",{children:"Cargando módulo..."})]})}),{comprasAgiles:caState,setComprasAgiles:setCaState,cfg:l,setToast:Q,setPage:f,budgets:B,apus:g,materiales:j,catalog:b}):e.jsx(di,{modulo:"licitaciones",planActual:Ce,onGoConfig:()=>f("config")});';
if (content.includes(oldRoute) && !content.includes('x==="compra_agil"')) {
    content = content.replace(oldRoute, newRoute);
    changes++;
    console.log('4. Route added');
}

fs.writeFileSync('src/assets/index.js', content, 'utf8');
console.log('Changes:', changes);
