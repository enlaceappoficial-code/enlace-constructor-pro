const fs = require('fs');

let c = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');

const sIdx = c.indexOf('const handleAssignProvider = (matId, provId) => {');

const replaceStr = `
    const handleAssignProvider = (matId, provId) => {
        setConsolidatedItems(prev => prev.map(m => m.id === matId ? { ...m, proveedorId: provId } : m));
    };

    const handleUpdateQuantity = (matId, newCant) => {
        setConsolidatedItems(prev => prev.map(m => m.id === matId ? { ...m, cantidadTotal: parseFloat(newCant) || 0 } : m));
    };

    const handleRemoveItem = (matId) => {
        setConsolidatedItems(prev => prev.filter(m => m.id !== matId));
    };

    const [extraMaterialId, setExtraMaterialId] = Re.useState("");
    
    const handleAddExtra = () => {
        if (!extraMaterialId) return;
        const mat = materiales.find(m => String(m.id) === String(extraMaterialId));
        if (!mat) return;
        
        const exists = consolidatedItems.find(m => String(m.id) === String(mat.id));
        if (exists) {
            setToast("⚠️ El material ya está en la lista.");
            return;
        }
        
        setConsolidatedItems(prev => [...prev, {
            id: mat.id,
            nombre: mat.nombre,
            unidad: mat.unidad,
            cantidadTotal: 1,
            precioReferencia: parseFloat(mat.precio) || 0,
            proveedorId: ""
        }]);
        setExtraMaterialId("");
        setToast("✅ Material extra agregado.");
    };
`;

c = c.substring(0, sIdx) + replaceStr + c.substring(c.indexOf('const autoAssign = () => {', sIdx));

// Replace the table headers
c = c.replace('e.jsx("th", { style: { padding: "10px", color: "var(--muted)", fontSize: 12 }, children: "Cant. Total" }),',
              'e.jsx("th", { style: { padding: "10px", color: "var(--muted)", fontSize: 12 }, children: "Cant. Total" }),\n                                                    e.jsx("th", { style: { padding: "10px", color: "var(--muted)", fontSize: 12, width: 40 }, children: "" }),');

// Replace the table body mapping
const bodyStart = c.indexOf('children: consolidatedItems.map(item => e.jsxs("tr"');
const bodyEnd = c.indexOf('})', bodyStart) + 2;

const newBodyStr = `children: consolidatedItems.map(item => e.jsxs("tr", {
                                                key: item.id,
                                                style: { borderBottom: "1px solid var(--border)" },
                                                children: [
                                                    e.jsx("td", { style: { padding: "10px", fontWeight: 600 }, children: item.nombre }),
                                                    e.jsxs("td", { style: { padding: "10px", display: "flex", alignItems: "center", gap: 6 }, children: [
                                                        e.jsx("input", {
                                                            type: "number",
                                                            style: { width: 70, background: "var(--sb)", border: "1px solid var(--border)", color: "var(--text)", padding: "4px 8px", borderRadius: 4, textAlign: "right" },
                                                            value: item.cantidadTotal,
                                                            onChange: (ev) => handleUpdateQuantity(item.id, ev.target.value)
                                                        }),
                                                        e.jsx("span", { style: { fontSize: 13, color: "var(--muted)" }, children: item.unidad })
                                                    ]}),
                                                    e.jsxs("td", { style: { padding: "10px", color: "var(--muted)" }, children: ["$", item.precioReferencia.toLocaleString("es-CL")] }),
                                                    e.jsx("td", { style: { padding: "10px" }, children: e.jsxs("select", {
                                                        style: { background: "var(--sb)", border: "1px solid var(--border)", color: "var(--text)", padding: "6px", borderRadius: 4, width: "100%", fontSize: 13 },
                                                        value: item.proveedorId,
                                                        onChange: (ev) => handleAssignProvider(item.id, ev.target.value),
                                                        children: [
                                                            e.jsx("option", { value: "", children: "-- Sin Asignar --" }),
                                                            proveedores.map(p => e.jsx("option", { value: p.id, key: p.id, children: p.nombre }))
                                                        ]
                                                    }) }),
                                                    e.jsx("td", { style: { padding: "10px", textAlign: "right" }, children: e.jsx("button", {
                                                        style: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 },
                                                        title: "Remover",
                                                        onClick: () => handleRemoveItem(item.id),
                                                        children: "✕"
                                                    })})
                                                ]
                                            }))`;
c = c.substring(0, bodyStart) + newBodyStr + c.substring(bodyEnd);

// Add the extra material section right under the table
const extraUIStr = `}),
                                e.jsxs("div", {
                                    style: { padding: "12px 16px", background: "var(--sb)", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" },
                                    children: [
                                        e.jsxs("select", {
                                            style: { flex: 1, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px", borderRadius: 6 },
                                            value: extraMaterialId,
                                            onChange: (ev) => setExtraMaterialId(ev.target.value),
                                            children: [
                                                e.jsx("option", { value: "", children: "Buscar material adicional en catálogo..." }),
                                                materiales.filter(m => !consolidatedItems.find(c => String(c.id) === String(m.id))).map(m => e.jsxs("option", { value: m.id, key: m.id, children: [m.nombre, " - $", m.precio] }))
                                            ]
                                        }),
                                        e.jsx("button", {
                                            style: { padding: "8px 16px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.4)", borderRadius: 6, cursor: "pointer", fontWeight: 600 },
                                            onClick: handleAddExtra,
                                            disabled: !extraMaterialId,
                                            children: "➕ Agregar"
                                        })
                                    ]
                                })
`;
c = c.replace('}) // End of maxHeight table wrapper', extraUIStr + '\n                                }) // End of maxHeight table wrapper'); 

// Actually I can just replace the end of the maxHeight div
const tableWrapperEnd = c.indexOf('})', c.indexOf('children: e.jsx("table"')) + 2; // this is the end of tbody map, we need the end of the div
// Wait, the structure is: e.jsx("div", { style: { maxHeight: "45vh", overflowY: "auto" }, children: e.jsx("table", { ... children: e.jsx("tbody", { children: ...map(...) }) }) })
const divEndStr = `})
                                    })
                                })`;
c = c.replace(divEndStr, `})
                                    })
                                }),
                                e.jsxs("div", {
                                    style: { padding: "12px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" },
                                    children: [
                                        e.jsxs("select", {
                                            style: { flex: 1, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px", borderRadius: 6 },
                                            value: extraMaterialId,
                                            onChange: (ev) => setExtraMaterialId(ev.target.value),
                                            children: [
                                                e.jsx("option", { value: "", children: "Añadir material extra..." }),
                                                materiales.map(m => e.jsxs("option", { value: m.id, key: m.id, children: [m.nombre, " - $", m.precio] }))
                                            ]
                                        }),
                                        e.jsx("button", {
                                            style: { padding: "8px 16px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.4)", borderRadius: 6, cursor: "pointer", fontWeight: 600 },
                                            onClick: handleAddExtra,
                                            disabled: !extraMaterialId,
                                            children: "➕ Agregar"
                                        })
                                    ]
                                })`);

fs.writeFileSync('src/assets/generador_oc_modulo.js', c);
console.log("Updated UI!");
