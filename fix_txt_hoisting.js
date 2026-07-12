const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const target = `          var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          var orgName = (it.Comprador?it.Comprador.NombreOrganismo:it.proveedor||"").toLowerCase();
          
          
          if (comuna !== "Todas") {
             if (txt.indexOf(comuna.toLowerCase()) > -1 || orgName.indexOf(comuna.toLowerCase()) > -1) return true;
             return false;
          }
          
          if(reg.toLowerCase().indexOf(regLower)>-1) return true;
          
          // Fallback: Si la API no trajo región (como pasa en Licitaciones activas), buscamos en el título
          var txt = ((it.Nombre||"")+" "+(it.Descripcion||"")).toLowerCase();`;

const replacement = `          var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          var orgName = (it.Comprador?it.Comprador.NombreOrganismo:it.proveedor||"").toLowerCase();
          var txt = ((it.Nombre||"")+" "+(it.Descripcion||"")).toLowerCase();
          
          if (comuna !== "Todas") {
             if (txt.indexOf(comuna.toLowerCase()) > -1 || orgName.indexOf(comuna.toLowerCase()) > -1) return true;
             return false;
          }
          
          if(reg.toLowerCase().indexOf(regLower)>-1) return true;`;

if (c.includes(target)) {
    c = c.replace(target, replacement);
    console.log('Fixed undefined txt error.');
} else {
    console.error('Could not find target error block.');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
