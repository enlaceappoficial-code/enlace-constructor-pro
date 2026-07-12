const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Find the tabs array
const tabsArrayMatch = c.match(/\{id:"presupuestos",icon:"[^"]+",label:"Presupuestos"\}/);
if (tabsArrayMatch) {
    const orig = tabsArrayMatch[0];
    const newTab = orig + ',{id:"proveedores",icon:"🏢",label:"Proveedores"}';
    c = c.replace(orig, newTab);
    console.log("Tab injected!");
}

// Now we need to inject ModuloProveedores component and the switch case to render it
const newComponent = fs.readFileSync('src/assets/modulo_proveedores.js', 'utf8');

// We need to put it before Wg component or at the end
// Let's just append it before `function Wg`
const wgIndex = c.indexOf('function Wg(');
if (wgIndex > -1) {
    c = c.substring(0, wgIndex) + '\n' + newComponent + '\n' + c.substring(wgIndex);
    console.log("Component injected!");
    
    // Now find the switch case in Wg
    // It's probably something like: currentTab==="presupuestos"?... :currentTab==="apus"?...
    // We can inject `currentTab==="proveedores"?e.jsx(ModuloProveedores,{cfg,setToast:w}) :` 
    // Wait, let's find `n==="presupuestos"` or `currentTab==="presupuestos"`
    const switchMatch = c.match(/(.)==="presupuestos"\?e\.jsx\([^,]+,{(?:budget:.*?)*?}\)/);
    if (switchMatch) {
        const tabVar = switchMatch[1]; // e.g. "l"
        const injectSwitch = tabVar + '==="proveedores"?e.jsx(ModuloProveedores,{cfg:W,setToast:ee}):';
        c = c.replace(switchMatch[0], injectSwitch + switchMatch[0]);
        console.log("Switch injected! tabVar was " + tabVar);
    } else {
        // Fallback for switch case format
        const fallbackMatch = c.match(/(.)==="presupuestos"\?e\.jsx\(\w+,{/);
        if (fallbackMatch) {
            const tabVar = fallbackMatch[1];
            // need to find what W is for cfg and setToast.
            // In index.js `var W=Fe[n.version...` is cfg. `const [$,ee]=V("")` is setToast.
            const injectSwitch = tabVar + '==="proveedores"?e.jsx(ModuloProveedores,{cfg:W,setToast:ee}):';
            c = c.replace(fallbackMatch[0], injectSwitch + fallbackMatch[0]);
            console.log("Fallback Switch injected!");
        }
    }
}

fs.writeFileSync('src/assets/index.js', c);
