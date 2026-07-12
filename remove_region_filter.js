const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Remove the region UI
const regionUIStart = `                e.jsxs("div", {
                  children: [
                    e.jsx("div", {
                      style: {
                        fontSize: 11,
                        color: th.muted,
                        fontWeight: 700,
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                      },
                      children: "Regi\\u00F3n",
                    }),
                    e.jsx("select", {
                      style: d({}, sty.inp),
                      value: region,
                      onChange: function (ev) {
                        setRegion(ev.target.value);
                      },
                      children: regiones.map(function (r) {
                        return e.jsx("option", { value: r, children: r }, r);
                      }),
                    }),
                  ],
                }),`;

c = c.replace(regionUIStart, '');

// 2. Remove the region filtering logic
const regionFilterLogic = `          if (region !== "Todas") {
            all = all.filter(function (it) {
              var reg = it.Comprador
                ? it.Comprador.RegionUnidad || ""
                : it.regionComprador || "";
              return reg.toLowerCase().indexOf(region.toLowerCase()) > -1;
            });
          }`;

c = c.replace(regionFilterLogic, '');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log("Region filter removed.");
