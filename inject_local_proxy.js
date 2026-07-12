const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetProxy = `      promises.push(
        tauriFetch(urlOC,{headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(data){`;

const proxyInject = `      // Proxy local para bypassear CORS en el navegador
      var finalUrl = "http://localhost:8081/" + urlOC;
      promises.push(
        tauriFetch(finalUrl,{headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(data){`;

if (c.includes(targetProxy)) {
    c = c.replace(targetProxy, proxyInject);
    console.log('Injected local CORS proxy fallback.');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
