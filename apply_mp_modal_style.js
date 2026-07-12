const fs = require('fs');

let moduleCode = fs.readFileSync('src/assets/proveedores_module_redesign.js', 'utf8');

// Find the start of the modal definition
const modalStartStr = 'view === "compare" && compareData && e.jsxs("div", {';
const listStartStr = 'const filteredProv = proveedores.filter(';

const startIdx = moduleCode.indexOf(modalStartStr);
const endIdx = moduleCode.indexOf(listStartStr);

if (startIdx > -1 && endIdx > -1) {
    const newModalJSX = `
            view === "compare" && compareData && e.jsxs("div", {
                style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" },
                children: [
                    e.jsxs("div", {
                        style: { background: a.sb || "#1e293b", width: "100%", maxWidth: 1000, maxHeight: "90vh", borderRadius: 12, display: "flex", flexDirection: "column", border: "1px solid " + a.border, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" },
                        children: [
                            // Header
                            e.jsxs("div", {
                                style: { padding: "20px 24px", borderBottom: "1px solid " + a.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
                                children: [
                                    e.jsxs("div", {
                                        children: [
                                            e.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: a.text, marginBottom: 4 }, children: "⚖️ Cuadro Comparativo" }),
                                            e.jsxs("div", { style: { fontSize: 13, color: a.muted }, children: ["Cotización importada de: ", e.jsx("strong", { style: { color: a.accent }, children: compareData.proveedor.nombre })] })
                                        ]
                                    }),
                                    e.jsx("button", {
                                        style: { background: "none", border: "none", color: a.muted, fontSize: 20, cursor: "pointer", padding: 4, lineHeight: 1 },
                                        onClick: () => setView("list"),
                                        children: "✕"
                                    })
                                ]
                            }),
                            
                            // Content
                            e.jsx("div", {
                                style: { padding: "24px", overflowY: "auto", flex: 1, background: "rgba(0,0,0,0.1)" },
                                children: e.jsxs("div", {
                                    style: u(d({}, c.card), { margin: 0 }),
                                    children: [
                                        e.jsx("table", {
                                            style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                                            children: e.jsxs("thead", {
                                                children: [
                                                    e.jsx("tr", {
                                                        style: { borderBottom: "1px solid " + a.border },
                                                        children: [
                                                            e.jsx("th", { style: { padding: "10px", width: 40 }, children: e.jsx("input", {
                                                                type: "checkbox",
                                                                onChange: (ev) => {
                                                                    const checked = ev.target.checked;
                                                                    const newSel = {};
                                                                    compareData.items.forEach(item => { if(item.nuevoPrecio > 0 && item.nuevoPrecio !== item.precioActual) newSel[item.id] = checked; });
                                                                    setSelectedChanges(newSel);
                                                                }
                                                            }) }),
                                                            e.jsx("th", { style: { padding: "10px", color: a.muted, fontSize: 12 }, children: "Material" }),
                                                            e.jsx("th", { style: { padding: "10px", color: a.muted, fontSize: 12 }, children: "Categoría" }),
                                                            e.jsx("th", { style: { padding: "10px", color: a.muted, fontSize: 12 }, children: "Precio Actual (Tuyo)" }),
                                                            e.jsx("th", { style: { padding: "10px", color: a.muted, fontSize: 12 }, children: "Precio Ofrecido" }),
                                                            e.jsx("th", { style: { padding: "10px", color: a.muted, fontSize: 12 }, children: "Diferencia" })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        e.jsx("div", {
                                            style: { maxHeight: "45vh", overflowY: "auto" },
                                            children: e.jsx("table", {
                                                style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                                                children: e.jsx("tbody", {
                                                    children: compareData.items.map(item => {
                                                        const diff = item.nuevoPrecio - item.precioActual;
                                                        const pct = item.precioActual > 0 ? (diff / item.precioActual * 100).toFixed(1) : 0;
                                                        const isCheaper = diff < 0;
                                                        const isMore = diff > 0;
                                                        const hasChanged = item.nuevoPrecio > 0 && item.nuevoPrecio !== item.precioActual;
                                                        
                                                        return e.jsxs("tr", {
                                                            key: item.id,
                                                            style: { borderBottom: "1px solid " + a.border, background: selectedChanges[item.id] ? "var(--bdg-comp-bg)" : "transparent" },
                                                            children: [
                                                                e.jsx("td", { style: { padding: "10px", width: 40 }, children: hasChanged && e.jsx("input", {
                                                                    type: "checkbox",
                                                                    checked: !!selectedChanges[item.id],
                                                                    onChange: (ev) => setSelectedChanges(prev => d(d({}, prev), { [item.id]: ev.target.checked }))
                                                                }) }),
                                                                e.jsx("td", { style: { padding: "10px", fontWeight: 600, color: a.text }, children: item.nombre }),
                                                                e.jsx("td", { style: { padding: "10px", fontSize: 12, color: a.muted }, children: item.cat }),
                                                                e.jsxs("td", { style: { padding: "10px", color: a.muted }, children: ["$", item.precioActual.toLocaleString("es-CL")] }),
                                                                e.jsxs("td", { style: { padding: "10px", fontWeight: 700, color: hasChanged ? a.text : a.muted }, children: ["$", item.nuevoPrecio.toLocaleString("es-CL")] }),
                                                                e.jsx("td", { style: { padding: "10px", fontWeight: 700, color: isCheaper ? "#4ade80" : (isMore ? "#f87171" : a.muted) }, children: hasChanged ? (isCheaper ? pct + "% (Más barato)" : pct + "% (Más caro)") : "-" })
                                                            ]
                                                        });
                                                    })
                                                })
                                            })
                                        })
                                    ]
                                })
                            }),
                            
                            // Footer
                            e.jsx("div", {
                                style: { padding: "16px 24px", borderTop: "1px solid " + a.border, background: "rgba(0,0,0,0.15)", display: "flex", justifyContent: "flex-end" },
                                children: e.jsx("button", {
                                    style: u(d({}, c.btn("p")), { padding: "10px 24px", fontSize: 14 }),
                                    onClick: () => {
                                        const idsToUpdate = Object.keys(selectedChanges).filter(id => selectedChanges[id]);
                                        if(idsToUpdate.length === 0) return setToast("⚠️ Selecciona al menos un precio para adoptar");
                                        
                                        const newMaterials = materiales.map(mat => {
                                            if(idsToUpdate.includes(String(mat.id))) {
                                                const change = compareData.items.find(x => String(x.id) === String(mat.id));
                                                return d(d({}, mat), { 
                                                    precio: change.nuevoPrecio,
                                                    fechaActualizacion: new Date().toISOString().split("T")[0]
                                                });
                                            }
                                            return mat;
                                        });
                                        setMateriales(newMaterials);
                                        setToast("✅ " + idsToUpdate.length + " precios adoptados exitosamente");
                                        setView("list");
                                    },
                                    children: "💾 Adoptar Precios Seleccionados"
                                })
                            })
                        ]
                    })
                ]
            }),
    `;

    const finalCode = moduleCode.substring(0, startIdx) + newModalJSX + moduleCode.substring(endIdx);
    fs.writeFileSync('src/assets/proveedores_module_redesign.js', finalCode);
    console.log("Updated the modal format in proveedores_module_redesign.js to match Mercado Publico standard.");
} else {
    console.log("Could not find the modal bounds in the file.");
}
