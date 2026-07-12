const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetFunc = `  var countdown=function(fecha){`;

const replacementFunc = `  var openDetail = function(item) {
    setDetailView(item);
    setDetailLoading(true);
    var tk = cfg&&cfg.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";
    if (item._source === "compra_agil") {
       var url = "http://localhost:8081/https://api2.mercadopublico.cl/v2/compra-agil/" + item.CodigoExterno;
       tauriFetch(url, {headers:{"ticket":tk}}).then(function(r){return r.json()}).then(function(d){
           var fullItem = d.data || d.payload || d;
           setDetailView(Object.assign({}, item, { fullData: fullItem }));
           setDetailLoading(false);
       }).catch(function(){ setDetailLoading(false); });
    } else {
       var url = "https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=" + item.CodigoExterno + "&ticket=" + tk;
       fetch(url).then(function(r){return r.json()}).then(function(d){
           var fullItem = d.Listado && d.Listado[0] ? d.Listado[0] : null;
           if (fullItem) {
               setDetailView(Object.assign({}, item, { fullData: fullItem }));
           }
           setDetailLoading(false);
       }).catch(function(){ setDetailLoading(false); });
    }
  };

  var countdown=function(fecha){`;

if (c.includes(targetFunc)) {
    c = c.replace(targetFunc, replacementFunc);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Injected openDetail function.');
}
