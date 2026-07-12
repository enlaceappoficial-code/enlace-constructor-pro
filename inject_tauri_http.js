const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetFetch = `fetch(urlOC,{headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(data){`;

const replaceFetch = `var tauriFetch = (window.__TAURI__ && window.__TAURI__.http && window.__TAURI__.http.fetch) 
           ? function(u, o) {
               o = o || {};
               return window.__TAURI__.http.fetch(u, {
                  method: o.method || "GET",
                  headers: o.headers || {},
                  responseType: 1 // JSON
               }).then(function(res){
                  return {json: function(){return Promise.resolve(res.data)}};
               });
           } 
           : fetch;
        tauriFetch(urlOC,{headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(data){`;

if (c.includes(targetFetch)) {
    c = c.replace(targetFetch, replaceFetch);
    console.log('Injected Tauri HTTP fallback.');
} else {
    console.log('Could not find fetch for urlOC');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
