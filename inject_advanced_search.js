const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const hsStartStr = 'var handleSearch = function () {';
const hsEndStr = 'var countdown = function (fecha) {';
const hsStartIndex = c.indexOf(hsStartStr);
const hsEndIndex = c.indexOf(hsEndStr, hsStartIndex);

// 1. Inject state before handleSearch
const stateInjection = `
    var _orgs = V([]), organismosList = _orgs[0], setOrganismosList = _orgs[1];
    var _orgSel = V(""), organismoSel = _orgSel[0], setOrganismoSel = _orgSel[1];

    e.useEffect(function() {
        var tk = (cfg && cfg.apiKeyMP) || "79B6AA40-A970-4164-ADEE-47CF3F378CBA";
        fetch("https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarComprador?ticket=" + tk)
            .then(function(r){ return r.json(); })
            .then(function(data){
                if(data && data.listaEmpresas) { setOrganismosList(data.listaEmpresas); }
            }).catch(function(){});
    }, [cfg]);

`;

// 2. Rewrite handleSearch entirely
const newHandleSearch = `var handleSearch = function () {
      if (!query.trim() && canal === "licitaciones" && !organismoSel)
        return props.setToast(
          "\\u26A0\\uFE0F Ingresa palabras clave u organismo",
        );
      setLoading(true);
      setPage(1);
      setResults([]);
      var tk = (cfg && cfg.apiKeyMP) || "79B6AA40-A970-4164-ADEE-47CF3F378CBA";
      var qLow = query.toLowerCase().split(" ").filter(function (w) { return w.length > 0; });
      var negWords = neg.toLowerCase().split(",").map(function (w) { return w.trim(); }).filter(function (w) { return w.length > 0; });

      var filterFn = function (items, source) {
        return items
          .filter(function (it) {
            var txt = ((it.Nombre || it.nombre || "") + " " + (it.Descripcion || it.descripcion || "")).toLowerCase();
            var matchQ = qLow.every(function (w) { return txt.indexOf(w) > -1; });
            var matchNeg = negWords.length === 0 || negWords.every(function (w) { return txt.indexOf(w) === -1; });
            return matchQ && matchNeg;
          })
          .map(function (it) {
            return u(d({}, it), { _source: source });
          });
      };

      var promises = [];

      if (canal === "todos" || canal === "licitaciones") {
        var urlLic = "https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?estado=activas&ticket=" + tk;
        if (organismoSel) {
           var org = organismosList.find(function(x) { return x.NombreEmpresa === organismoSel; });
           if (org) {
               urlLic = "https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigoOrganismo=" + org.CodigoEmpresa + "&estado=activas&ticket=" + tk;
           }
        }
        promises.push(
          fetch(urlLic)
            .then(function (r) { return r.json(); })
            .then(function (data) {
              return data && data.Listado ? filterFn(data.Listado, "licitacion") : [];
            })
            .catch(function () { return []; })
        );
      }

      if (canal === "todos" || canal === "compra_agil") {
        var regMap = {
            "Tarapacá": 1, "Antofagasta": 2, "Atacama": 3, "Coquimbo": 4, "Valparaíso": 5,
            "O'Higgins": 6, "Maule": 7, "Biobío": 8, "Araucanía": 9, "Los Lagos": 10,
            "Aysén": 11, "Magallanes": 12, "Metropolitana": 13, "Los Ríos": 14,
            "Arica y Parinacota": 15, "Ñuble": 16
        };
        var urlOC = "https://api2.mercadopublico.cl/v2/compra-agil?estado=publicada&tamano_pagina=50";
        if (query.trim()) { urlOC += "&q=" + encodeURIComponent(query.trim()); }
        if (region !== "Todas" && regMap[region]) { urlOC += "&region=" + regMap[region]; }
        
        promises.push(
          fetch(urlOC, { headers: { "ticket": tk } })
            .then(function (r) { return r.json(); })
            .then(function (data) {
              if (data && data.payload && data.payload.items) {
                 var mapped = data.payload.items.map(function(ca) {
                     return {
                        CodigoExterno: ca.codigo,
                        Nombre: ca.nombre,
                        Descripcion: ca.descripcion || "",
                        Comprador: {
                           NombreOrganismo: ca.institucion ? ca.institucion.organismo_comprador : "",
                           RegionUnidad: ca.institucion ? ca.institucion.nombre_region : ""
                        },
                        MontoEstimado: ca.montos ? ca.montos.monto_disponible_clp : 0,
                        Fechas: { FechaCierre: ca.fechas ? ca.fechas.fecha_cierre : "" },
                        Items: { Listado: [] },
                        _source: "compra_agil"
                     };
                 });
                 if (query.trim() === "" && region === "Todas") {
                     return filterFn(mapped, "compra_agil"); // filter fallback if nothing was sent
                 }
                 return mapped; 
              }
              return [];
            })
            .catch(function (e) { console.log(e); return []; })
        );
      }

      Promise.all(promises)
        .then(function (arrays) {
          var all = [];
          arrays.forEach(function (a) { all = all.concat(a); });
          setResults(all);
          setLoading(false);
          props.setToast("\\u2705 " + all.length + " oportunidades encontradas");
        })
        .catch(function () {
          setLoading(false);
          props.setToast("\\u274C Error de conexi\\u00F3n");
        });
    };
`;

c = c.substring(0, hsStartIndex) + stateInjection + newHandleSearch + c.substring(hsEndIndex);

// 3. Rewrite Grid UI
const gridStartStr = '              display: "grid",\n              gridTemplateColumns: "1fr 1fr",';
const gridStartIndex = c.indexOf(gridStartStr);

const gridEndStr = 'results.length > 0 &&';
const gridEndIndex = c.indexOf(gridEndStr, gridStartIndex);

const newGridUI = `              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 16,
            },
            children: [
              e.jsxs("div", {
                  style: { display: "grid", gridTemplateColumns: canal === "licitaciones" ? "1fr 1fr" : (canal === "compra_agil" ? "1fr 1fr" : "1fr 1fr 1fr"), gap: 12 },
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsx("div", {
                          style: { fontSize: 11, color: th.muted, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" },
                          children: "Palabras clave",
                        }),
                        e.jsx("input", {
                          list: "sugerencias-busqueda",
                          style: d({}, sty.inp),
                          value: query,
                          onChange: function (ev) { setQuery(ev.target.value); },
                          placeholder: "Ej: pintura, construcci\\u00F3n, mantenci\\u00F3n...",
                          onKeyDown: function (ev) { ev.key === "Enter" && handleSearch(); },
                        }),
                        e.jsx("datalist", {
                          id: "sugerencias-busqueda",
                          children: [
                            "construcci\\u00F3n", "reparaci\\u00F3n", "mantenci\\u00F3n", "obras civiles",
                            "pavimentaci\\u00F3n", "pintura", "techumbre", "demolici\\u00F3n",
                            "alba\\u00F1iler\\u00EDa", "carpinter\\u00EDa",
                          ].map(function (opt) {
                            return e.jsx("option", { value: opt }, opt);
                          }),
                        }),
                      ],
                    }),
                    (canal === "todos" || canal === "licitaciones") && e.jsxs("div", {
                        children: [
                            e.jsx("div", {
                                style: { fontSize: 11, color: th.muted, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" },
                                children: "Organismo (Licitaciones)",
                            }),
                            e.jsx("input", {
                                list: "lista-organismos",
                                style: d({}, sty.inp),
                                value: organismoSel,
                                onChange: function(ev) { setOrganismoSel(ev.target.value); },
                                placeholder: "Todas las entidades...",
                                onKeyDown: function (ev) { ev.key === "Enter" && handleSearch(); },
                            }),
                            e.jsx("datalist", {
                                id: "lista-organismos",
                                children: organismosList.map(function(org) {
                                    return e.jsx("option", { value: org.NombreEmpresa }, org.CodigoEmpresa);
                                })
                            })
                        ]
                    }),
                    (canal === "todos" || canal === "compra_agil") && e.jsxs("div", {
                        children: [
                            e.jsx("div", {
                                style: { fontSize: 11, color: th.muted, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" },
                                children: "Regi\\u00F3n (Compra \\u00C1gil)",
                            }),
                            e.jsx("select", {
                                style: d({}, sty.inp),
                                value: region,
                                onChange: function(ev) { setRegion(ev.target.value); },
                                children: regiones.map(function(r) {
                                    return e.jsx("option", { value: r, children: r }, r);
                                })
                            })
                        ]
                    })
                  ]
              }),
              e.jsx("button", {
                style: u(d({}, sty.btn("p")), { padding: "12px 32px", fontSize: 14, width: "100%" }),
                onClick: handleSearch,
                children: loading ? "\\u23F3 Buscando en Mercado P\\u00FAblico..." : "\\uD83D\\uDD0E Buscar Oportunidades",
              }),
            ],
          }),
        `;

c = c.substring(0, gridStartIndex - 25) + newGridUI + c.substring(gridEndIndex); // Note: -25 to replace the style block properly

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log("Injected advanced search logic!");
