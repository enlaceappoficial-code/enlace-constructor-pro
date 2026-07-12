const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `                              e.jsx("input", {
                                style: u(d({}, c.inp), {
                                  margin: 0,
                                  width: "100%",
                                  boxSizing: "border-box",
                                  fontSize: 12,
                                }),
                                placeholder:
                                  "pavimentación, pintura, obras civiles...",
                                value: k.palabras,
                                onChange: (N) =>
                                  R(u(d({}, k), { palabras: N.target.value })),
                              }),`;

const replacement = `                              e.jsx("input", {
                                list: "sugerencias-construccion",
                                style: u(d({}, c.inp), {
                                  margin: 0,
                                  width: "100%",
                                  boxSizing: "border-box",
                                  fontSize: 12,
                                }),
                                placeholder:
                                  "pavimentación, pintura, obras civiles...",
                                value: k.palabras,
                                onChange: (N) =>
                                  R(u(d({}, k), { palabras: N.target.value })),
                              }),
                              e.jsx("datalist", {
                                id: "sugerencias-construccion",
                                children: [
                                  "construcción", "reparación", "mantención", "obras civiles",
                                  "pavimentación", "pintura", "techumbre", "demolición",
                                  "albañilería", "carpintería", "gasfitería", "electricidad",
                                  "movimiento de tierra", "remodelación", "cierre perimetral",
                                  "asfalto", "hormigón", "impermeabilización", "techos",
                                  "estructuras metálicas", "aislación", "radier"
                                ].map(word => e.jsx("option", { value: word, key: word }))
                              }),`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, replacement);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Datalist injected successfully!");
} else {
  console.log("Could not find the target block.");
}
