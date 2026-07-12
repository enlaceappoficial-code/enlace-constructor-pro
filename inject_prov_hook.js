const fs = require('fs');

let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Add localStorage sync hook for proveedores to Jg
const hookTarget = 'ct(()=>{var H=setTimeout(()=>_t("clients",p),1500);return()=>clearTimeout(H)},[p]),';
const newHook = 'ct(()=>{var H=setTimeout(()=>_t("proveedores",proveedores),1500);return()=>clearTimeout(H)},[proveedores]),';

if (c.includes(hookTarget) && !c.includes('_t("proveedores"')) {
    c = c.replace(hookTarget, hookTarget + newHook);
}

fs.writeFileSync('src/assets/index.js', c);
console.log("Successfully injected proveedores sync hook.");
