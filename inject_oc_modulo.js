const fs = require('fs');

let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Add [ocBudget, setOcBudget] to gg
const ggStateTarget = 'const[B,w]=V("Todos"),[v,x]=V(null)';
if (!c.includes('const [ocBudget, setOcBudget] = Re.useState(null);')) {
    c = c.replace(ggStateTarget, 'const [ocBudget, setOcBudget] = Re.useState(null);\n' + ggStateTarget);
}

// 2. Add the dropdown menu item
const menuItemTarget = '{icon:"📄",label:"Cotización Formal"';
const newMenuItem = '{icon:"🛒",label:"Generar Órdenes de Compra",color:"#f5a020",action:()=>{setOcBudget(Q),I(null)}},\n';
if (!c.includes('"Generar Órdenes de Compra"')) {
    c = c.replace(menuItemTarget, newMenuItem + menuItemTarget);
}

// 3. Render GeneradorOCModulo at the end of gg
// Look for R&&e.jsx(Jf,{...})]})}
const ggReturnTarget = 'R&&e.jsx(Jf,{budget:R,budgets:t,clients:r,cfg:n,onClose:()=>K(null)})]})}';
const renderModulo = 'R&&e.jsx(Jf,{budget:R,budgets:t,clients:r,cfg:n,onClose:()=>K(null)}),\nocBudget && e.jsx(GeneradorOCModulo, { budget: ocBudget, onClose: () => setOcBudget(null), cfg: n, setToast: z })\n]})}';
if (!c.includes('ocBudget && e.jsx(GeneradorOCModulo')) {
    c = c.replace(ggReturnTarget, renderModulo);
}

// 4. Append GeneradorOCModulo function at the end of the file
const moduloCode = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');
if (!c.includes('function GeneradorOCModulo')) {
    c += '\n\n' + moduloCode;
}

fs.writeFileSync('src/assets/index.js', c);
console.log("Successfully injected Generador de Órdenes de Compra.");
