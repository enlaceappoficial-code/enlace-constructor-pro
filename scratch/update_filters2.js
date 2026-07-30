const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const helper = `      var getOptions = (list, rFiltro, srFiltro) => {
        let rs = {}, srs = {}, ts = {};
        list.forEach(item => {
          let r = item.rubro ? item.rubro.trim() : "";
          let sr = item.subrubro ? item.subrubro.trim() : "";
          let t = item.tipoIntervencion ? item.tipoIntervencion.trim() : "";
          if (r) {
            rs[r] = (rs[r] || 0) + 1;
            let matchR = (rFiltro === "Todos" || r === rFiltro);
            if (matchR && sr && sr !== r) {
              srs[sr] = (srs[sr] || 0) + 1;
              let matchSr = (srFiltro === "Todos" || sr === srFiltro);
              if (matchSr && t) {
                ts[t] = (ts[t] || 0) + 1;
              }
            }
          }
        });
        const fmt = (obj) => Object.entries(obj).sort((a,b) => a[0].localeCompare(b[0])).map(x => ({ val: x[0], lbl: x[0] + " (" + x[1] + ")" }));
        return { rubros: fmt(rs), subrubros: fmt(srs), tipos: fmt(ts) };
      };`;

// In Catalogo
content = content.replace(
  /var F = \["Todas", \.\.\.new Set\(i\.map\(\(v\) => v\.cat\)\)\],[\s\S]*?tiposPresentes = \[\.\.\.new Set\(i\.map\(\(v\) => v\.tipoIntervencion\)\.filter\(Boolean\)\)\]\.sort\(\(a2, b2\) => a2\.localeCompare\(b2, "es"\)\),/g,
  `var F = ["Todas", ...new Set(i.map((v) => v.cat))];
${helper}
      var tOpts = getOptions(i, rubroFiltro, subrubroFiltro),
      rubrosPresentes = tOpts.rubros,
      subrubrosPresentes = tOpts.subrubros,
      tiposPresentes = tOpts.tipos,`
);

// In Partidas de Obra
content = content.replace(
  /var rubrosPresentes = \[\.\.\.new Set\(t\.map\(\(y\) => y\.rubro \|\| y\.cat\)\)\]\.sort\(\(a, b\) => a\.localeCompare\(b, "es"\)\);\s*var tiposPresentes = \[\.\.\.new Set\(t\.map\(\(y\) => y\.tipoIntervencion\)\.filter\(Boolean\)\)\]\.sort\(\(a, b\) => a\.localeCompare\(b, "es"\)\);/g,
  ""
);

content = content.replace(
  /var subrubrosPresentes = \[\s*\.\.\.new Set\(\s*t\s*\.filter\(\(y\) => rubroFiltro === "Todos" \|\| \(y\.rubro \|\| y\.cat\) === rubroFiltro\)\s*\.map\(\(y\) => y\.subrubro\)\s*\.filter\(Boolean\),\s*\),\s*\]\.sort\(\(a, b\) => a\.localeCompare\(b, "es"\)\);/g,
  `${helper}
    var tOpts = getOptions(t, rubroFiltro, subrubroFiltro);
    var rubrosPresentes = tOpts.rubros;
    var subrubrosPresentes = tOpts.subrubros;
    var tiposPresentes = tOpts.tipos;`
);

fs.writeFileSync('src/assets/index.js', content);
console.log("Replaced with regexes.");
