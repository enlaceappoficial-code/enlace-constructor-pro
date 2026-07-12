const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetProxy = `var isTauri = typeof window !== "undefined" && window.__TAURI__ && window.__TAURI__.http && window.__TAURI__.http.fetch;
      var tauriFetch = isTauri
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
      
      // Si no estamos en Tauri (ej: Chrome), usamos un proxy CORS gratuito para saltarnos el bloqueo de la API2
      var finalUrlOC = isTauri ? urlOC : "https://corsproxy.io/?" + encodeURIComponent(urlOC);

      promises.push(
        tauriFetch(finalUrlOC,{headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(data){`;

const revertTauri = `var isTauri = typeof window !== "undefined" && window.__TAURI__ && window.__TAURI__.http && window.__TAURI__.http.fetch;
      var tauriFetch = isTauri
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
      
      promises.push(
        tauriFetch(urlOC,{headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(data){`;

if (c.includes('var finalUrlOC = isTauri ? urlOC : "https://corsproxy.io/?" + encodeURIComponent(urlOC);')) {
    c = c.replace(targetProxy, revertTauri);
    console.log('Reverted corsproxy.io injection.');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
