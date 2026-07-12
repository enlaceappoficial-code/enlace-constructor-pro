const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetLogic = `      }
      setResults(all);setLoading(false);
      props.setToast("\\u2705 "+all.length+" oportunidades encontradas");`;

const replacementLogic = `      }
      if (urgentOnly) {
          all = all.filter(function(it){
              var f = it.Fechas ? (it.Fechas.FechaCierre || it.Fechas.fecha_cierre) : null;
              if(!f) return false;
              var diff = new Date(f) - new Date();
              return diff > 0 && diff <= 172800000;
          });
      }

      if (sortBy === "cierra_pronto") {
          all.sort(function(a,b){
              var fa = a.Fechas ? (a.Fechas.FechaCierre || a.Fechas.fecha_cierre) : null;
              var fb = b.Fechas ? (b.Fechas.FechaCierre || b.Fechas.fecha_cierre) : null;
              if(!fa) return 1; if(!fb) return -1;
              return new Date(fa) - new Date(fb);
          });
      } else if (sortBy === "recientes") {
          all.sort(function(a,b){
              var fa = a.Fechas ? (a.Fechas.FechaCreacion || a.Fechas.fecha_publicacion || a.Fechas.FechaPublicacion) : null;
              var fb = b.Fechas ? (b.Fechas.FechaCreacion || b.Fechas.fecha_publicacion || b.Fechas.FechaPublicacion) : null;
              if(!fa) return 1; if(!fb) return -1;
              return new Date(fb) - new Date(fa);
          });
      } else if (sortBy === "monto_mayor") {
          all.sort(function(a,b){
              var ma = a.MontoEstimado || 0;
              var mb = b.MontoEstimado || 0;
              return mb - ma;
          });
      }

      setResults(all);setLoading(false);
      props.setToast("\\u2705 "+all.length+" oportunidades encontradas");`;

if (c.includes(targetLogic)) {
    c = c.replace(targetLogic, replacementLogic);
    console.log('Injected filtering logic.');
} else {
    console.log('Target logic not found');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
