const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const badInjection = `      promises.push(
        var tauriFetch = (window.__TAURI__ && window.__TAURI__.http && window.__TAURI__.http.fetch) 
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

const goodInjection = `      var tauriFetch = (typeof window !== "undefined" && window.__TAURI__ && window.__TAURI__.http && window.__TAURI__.http.fetch) 
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

if (c.includes(badInjection)) {
    c = c.replace(badInjection, goodInjection);
    console.log('Fixed syntax error by moving tauriFetch outside promises.push');
} else {
    console.error('Could not find bad injection to fix.');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
