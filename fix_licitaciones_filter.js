const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldFilter = `      if(region!=="Todas"){
        all=all.filter(function(it){
          if(it._source==="compra_agil" && canal==="todos") return true; // Region already filtered in API for compra agil if query was used
          if(it._source==="compra_agil" && !query.trim()) return true;
          var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          return reg.toLowerCase().indexOf(region.toLowerCase())>-1;
        });
      }`;

const newFilter = `      if(region!=="Todas"){
        var regLiteral = region.replace(/\\\\u00ED/g,"í").replace(/\\\\u00E1/g,"á").replace(/\\\\u00E9/g,"é").replace(/\\\\u00F3/g,"ó").replace(/\\\\u00FA/g,"ú").replace(/\\\\u00D1/g,"Ñ");
        var keywords = typeof comunasPorRegion !== "undefined" ? (comunasPorRegion[region] || comunasPorRegion[regLiteral] || []) : [];
        var regLower = regLiteral.toLowerCase();

        all=all.filter(function(it){
          if(it._source==="compra_agil" && canal==="todos") return true; // Region already filtered in API for compra agil if query was used
          if(it._source==="compra_agil" && !query.trim()) return true;
          var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          if(reg.toLowerCase().indexOf(regLower)>-1) return true;
          
          // Fallback: Si la API no trajo región (como pasa en Licitaciones activas), buscamos en el título
          var txt = ((it.Nombre||"")+" "+(it.Descripcion||"")).toLowerCase();
          if(txt.indexOf(regLower)>-1) return true;
          for(var i=0; i<keywords.length; i++) {
             if(txt.indexOf(keywords[i])>-1) return true;
          }
          return false;
        });
      }`;

if (c.includes(oldFilter)) {
    c = c.replace(oldFilter, newFilter);
    console.log('Fixed Licitaciones region fallback filter');
} else {
    console.log('Could not find old filter block');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
