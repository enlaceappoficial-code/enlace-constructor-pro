const fs = require('fs');

let content = fs.readFileSync('src/assets/index.js', 'utf8');

// Replace in Catalogo (lines 35008-35011)
let catSearch = `      var F = ["Todas", ...new Set(i.map((v) => v.cat))],
      rubrosPresentes = [...new Set(i.map((v) => v.rubro || v.cat))].sort((a2, b2) => a2.localeCompare(b2, "es")),
      subrubrosPresentes = [...new Set(i.filter((v) => rubroFiltro === "Todos" || (v.rubro || v.cat) === rubroFiltro).map((v) => v.subrubro).filter(Boolean))].sort((a2, b2) => a2.localeCompare(b2, "es")),
      tiposPresentes = [...new Set(i.map((v) => v.tipoIntervencion).filter(Boolean))].sort((a2, b2) => a2.localeCompare(b2, "es")),`;

let helperCat = `      var F = ["Todas", ...new Set(i.map((v) => v.cat))];
      var getOptions = (list, rFiltro, srFiltro) => {
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
      };
      var tOpts = getOptions(i, rubroFiltro, subrubroFiltro);
      var rubrosPresentes = tOpts.rubros;
      var subrubrosPresentes = tOpts.subrubros;
      var tiposPresentes = tOpts.tipos;`;
content = content.replace(catSearch, helperCat);

// Then replace the onChange logic to reset properly.
let catOnChange = `                  onChange: (v) => {
                    setRubroFiltro(v.target.value);
                    setSubrubroFiltro("Todos");
                  },`;
let catOnChangeNew = `                  onChange: (v) => {
                    let nextR = v.target.value;
                    setRubroFiltro(nextR);
                    setSubrubroFiltro("Todos");
                    setTipoFiltro("Todos");
                  },`;
content = content.replace(catOnChange, catOnChangeNew);

let catOnChangeSub = `                  onChange: (v) => setSubrubroFiltro(v.target.value),`;
let catOnChangeSubNew = `                  onChange: (v) => {
                    setSubrubroFiltro(v.target.value);
                    setTipoFiltro("Todos");
                  },`;
content = content.replace(catOnChangeSub, catOnChangeSubNew);

// Replace mapping in Catalogo
content = content.replace(`rubrosPresentes.map((v) => e.jsx("option", { value: v, children: v }, v))`, `rubrosPresentes.map((v) => e.jsx("option", { value: v.val, children: v.lbl }, v.val))`);
content = content.replace(`subrubrosPresentes.map((v) => e.jsx("option", { value: v, children: v }, v))`, `subrubrosPresentes.map((v) => e.jsx("option", { value: v.val, children: v.lbl }, v.val))`);
content = content.replace(`tiposPresentes.map((v) => e.jsx("option", { value: v, children: v }, v))`, `tiposPresentes.map((v) => e.jsx("option", { value: v.val, children: v.lbl }, v.val))`);

// Now for Partidas de Obra (lines 47814-47816)
let poSearch1 = `    var n = [...new Set(t.map((y) => y.cat))];
    var rubrosPresentes = [...new Set(t.map((y) => y.rubro || y.cat))].sort((a, b) => a.localeCompare(b, "es"));
    var tiposPresentes = [...new Set(t.map((y) => y.tipoIntervencion).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));`;
let poNew1 = `    var n = [...new Set(t.map((y) => y.cat))];`;
content = content.replace(poSearch1, poNew1);

let poSearch2 = `    var subrubrosPresentes = [
      ...new Set(
        t
          .filter((y) => rubroFiltro === "Todos" || (y.rubro || y.cat) === rubroFiltro)
          .map((y) => y.subrubro)
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "es"));`;
let poNew2 = `      var getOptions = (list, rFiltro, srFiltro) => {
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
      };
      var tOpts = getOptions(t, rubroFiltro, subrubroFiltro);
      var rubrosPresentes = tOpts.rubros;
      var subrubrosPresentes = tOpts.subrubros;
      var tiposPresentes = tOpts.tipos;`;
content = content.replace(poSearch2, poNew2);

let poOnChange = `                          onChange: (y) => {
                            setRubroFiltro(y.target.value);
                            setSubrubroFiltro("Todos");
                          },`;
let poOnChangeNew = `                          onChange: (y) => {
                            setRubroFiltro(y.target.value);
                            setSubrubroFiltro("Todos");
                            setTipoFiltro("Todos");
                          },`;
content = content.replace(poOnChange, poOnChangeNew);

let poOnChangeSub = `                          onChange: (y) => setSubrubroFiltro(y.target.value),`;
let poOnChangeSubNew = `                          onChange: (y) => {
                            setSubrubroFiltro(y.target.value);
                            setTipoFiltro("Todos");
                          },`;
content = content.replace(poOnChangeSub, poOnChangeSubNew);

content = content.replace(`rubrosPresentes.map((y) => e.jsx("option", { value: y, children: y }, y))`, `rubrosPresentes.map((y) => e.jsx("option", { value: y.val, children: y.lbl }, y.val))`);
content = content.replace(`subrubrosPresentes.map((y) => e.jsx("option", { value: y, children: y }, y))`, `subrubrosPresentes.map((y) => e.jsx("option", { value: y.val, children: y.lbl }, y.val))`);
content = content.replace(`tiposPresentes.map((y) => e.jsx("option", { value: y, children: y }, y))`, `tiposPresentes.map((y) => e.jsx("option", { value: y.val, children: y.lbl }, y.val))`);


// AND FINALLY, the actual array filtering logic so that the items are actually filtered by the strict rubro, not cat fallback!
// In Catálogo:
let filterCatOrig = `          rOk = rubroFiltro === "Todos" || (v.rubro || v.cat) === rubroFiltro,
          sOk = subrubroFiltro === "Todos" || v.subrubro === subrubroFiltro,
          tOk = tipoFiltro === "Todos" || v.tipoIntervencion === tipoFiltro;`;
let filterCatNew = `          rOk = rubroFiltro === "Todos" || v.rubro === rubroFiltro,
          sOk = subrubroFiltro === "Todos" || v.subrubro === subrubroFiltro,
          tOk = tipoFiltro === "Todos" || v.tipoIntervencion === tipoFiltro;`;
content = content.replace(filterCatOrig, filterCatNew);

// In Partidas de Obra:
let filterPoOrig = `        rubroFiltro !== "Todos" && (y = y.filter((P) => (P.rubro || P.cat) === rubroFiltro));
        subrubroFiltro !== "Todos" && (y = y.filter((P) => P.subrubro === subrubroFiltro));
        tipoFiltro !== "Todos" && (y = y.filter((P) => P.tipoIntervencion === tipoFiltro));`;
let filterPoNew = `        rubroFiltro !== "Todos" && (y = y.filter((P) => P.rubro === rubroFiltro));
        subrubroFiltro !== "Todos" && (y = y.filter((P) => P.subrubro === subrubroFiltro));
        tipoFiltro !== "Todos" && (y = y.filter((P) => P.tipoIntervencion === tipoFiltro));`;
content = content.replace(filterPoOrig, filterPoNew);


// Save back
fs.writeFileSync('src/assets/index.js', content);
console.log("Done.");
