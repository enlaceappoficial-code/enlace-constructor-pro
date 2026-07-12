const fs = require('fs');
let c = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');

const targetStr = `e.jsx("option", { value: "", children: "Añadir material extra al presupuesto..." }),
                                                        materiales.filter(m => !consolidatedItems.find(c => String(c.id) === String(m.id))).map(m => e.jsxs("option", { value: m.id, key: m.id, children: [m.nombre, " - $", m.precio] }))`;

const replaceStr = `e.jsx("option", { value: "", children: "Añadir material extra al presupuesto..." }),
                                                        ...(() => {
                                                            const grouped = {};
                                                            materiales.filter(m => !consolidatedItems.find(c => String(c.id) === String(m.id))).forEach(m => {
                                                                const cat = m.cat || "Otros";
                                                                if (!grouped[cat]) grouped[cat] = [];
                                                                grouped[cat].push(m);
                                                            });
                                                            return Object.keys(grouped).sort().map(cat => 
                                                                e.jsx("optgroup", { label: cat, key: cat, children: 
                                                                    grouped[cat].map(m => e.jsxs("option", { value: m.id, key: m.id, children: [m.nombre, " - $", m.precio] }))
                                                                })
                                                            );
                                                        })()`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replaceStr);
    fs.writeFileSync('src/assets/generador_oc_modulo.js', c);
    console.log("Successfully updated materials grouping.");
} else {
    console.log("Could not find the target string. Maybe it was modified?");
}
