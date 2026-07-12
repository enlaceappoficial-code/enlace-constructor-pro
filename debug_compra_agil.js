const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetCatch = `          return [];
        }).catch(function(){return[]})`;

const replaceCatch = `          return [];
        }).catch(function(e){ 
             props.setToast("Error Compra Ágil: " + (e.message || e)); 
             console.error("Compra Agil Error:", e);
             return [];
        })`;

if (c.includes(targetCatch)) {
    c = c.replace(targetCatch, replaceCatch);
    console.log('Injected error reporting for Compra Agil.');
}

const targetTauri = `var tauriFetch = (typeof window !== "undefined" && window.__TAURI__ && window.__TAURI__.http && window.__TAURI__.http.fetch)`;
const replaceTauri = `if(typeof window !== "undefined" && !window.__TAURI__) { console.log("TAURI API NO DISPONIBLE"); }
      var tauriFetch = (typeof window !== "undefined" && window.__TAURI__ && window.__TAURI__.http && window.__TAURI__.http.fetch)`;

if (c.includes(targetTauri)) {
    c = c.replace(targetTauri, replaceTauri);
    console.log('Injected Tauri check.');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
