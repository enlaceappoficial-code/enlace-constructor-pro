const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `                    e.jsx("input", {
                      style: d({}, sty.inp),
                      value: query,
                      onChange: function (ev) {
                        setQuery(ev.target.value);
                      },
                      placeholder:
                        "Ej: pintura, construcci\\u00F3n, mantenci\\u00F3n...",
                      onKeyDown: function (ev) {
                        ev.key === "Enter" && handleSearch();
                      },
                    }),`;

const replacement = `                    e.jsx("input", {
                      list: "sugerencias-busqueda",
                      style: d({}, sty.inp),
                      value: query,
                      onChange: function (ev) {
                        setQuery(ev.target.value);
                      },
                      placeholder:
                        "Ej: pintura, construcci\\u00F3n, mantenci\\u00F3n...",
                      onKeyDown: function (ev) {
                        ev.key === "Enter" && handleSearch();
                      },
                    }),
                    e.jsx("datalist", {
                      id: "sugerencias-busqueda",
                      children: [
                        "construcci\\u00F3n", "reparaci\\u00F3n", "mantenci\\u00F3n", "obras civiles",
                        "pavimentaci\\u00F3n", "pintura", "techumbre", "demolici\\u00F3n",
                        "alba\\u00F1iler\\u00EDa", "carpinter\\u00EDa", "gasfiter\\u00EDa", "electricidad",
                        "movimiento de tierra", "remodelaci\\u00F3n", "cierre perimetral",
                        "asfalto", "hormig\\u00F3n", "impermeabilizaci\\u00F3n", "techos",
                        "estructuras met\\u00E1licas", "aislaci\\u00F3n", "radier"
                      ].map(word => e.jsx("option", { value: word, key: word }))
                    }),`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, replacement);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Datalist injected into the search bar successfully!");
} else {
  console.log("Could not find the target block.");
}
