const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetLogic = `        all=all.filter(function(it){
          if(it._source==="compra_agil" && canal==="todos") return true; // Region already filtered in API for compra agil if query was used
          if(it._source==="compra_agil" && !query.trim()) return true;
          var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          var orgName = (it.Comprador?it.Comprador.NombreOrganismo:it.proveedor||"").toLowerCase();
          var txt = ((it.Nombre||"")+" "+(it.Descripcion||"")).toLowerCase();
          
          if (comuna !== "Todas") {
             if (txt.indexOf(comuna.toLowerCase()) > -1 || orgName.indexOf(comuna.toLowerCase()) > -1) return true;
             return false;
          }
          
          if(reg.toLowerCase().indexOf(regLower)>-1) return true;
          if(txt.indexOf(regLower)>-1) return true;
          for(var i=0; i<keywords.length; i++) {
             if(txt.indexOf(keywords[i])>-1) return true;
          }
          return false;
        });`;

const replacementLogic = `        all=all.filter(function(it){
          var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          var orgName = (it.Comprador?it.Comprador.NombreOrganismo:it.proveedor||"").toLowerCase();
          var txt = ((it.Nombre||"")+" "+(it.Descripcion||"")).toLowerCase();
          
          // 1. Filtro estricto por Organismo (Aplica a Licitaciones y Compra Ágil)
          if(organismoSel && orgName.indexOf(organismoSel.toLowerCase()) === -1) return false;
          
          // 2. Filtro estricto por Comuna
          if (comuna !== "Todas") {
             if (txt.indexOf(comuna.toLowerCase()) > -1 || orgName.indexOf(comuna.toLowerCase()) > -1) {
                 // matched comuna
             } else {
                 return false; // Did not match comuna
             }
          }
          
          // Si es compra_agil y ya pasó los filtros de organismo y comuna, lo mostramos.
          // (No aplicamos filtro de región estricto en texto porque la API de Compra Ágil ya filtró por región exacto)
          if(it._source==="compra_agil") return true;
          
          // 3. Fallback de Región para Licitaciones (ya que la API de Licitaciones no trae región)
          if(reg.toLowerCase().indexOf(regLower)>-1) return true;
          if(txt.indexOf(regLower)>-1) return true;
          for(var i=0; i<keywords.length; i++) {
             if(txt.indexOf(keywords[i])>-1) return true;
          }
          return false;
        });`;

if (c.includes('all=all.filter(function(it){')) {
    c = c.replace(targetLogic, replacementLogic);
    console.log('Replaced local filtering logic to properly support Compra Agil with Organismo and Comuna.');
} else {
    console.error('Could not find all.filter logic');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
