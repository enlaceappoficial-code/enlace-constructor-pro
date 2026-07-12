const fs = require('fs');

const content = `
function ModuloProveedores({cfg, setToast}) {
    const [proveedores, setProveedores] = Re.useState(() => {
        try { 
            const provs = JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_proveedores") || "[]");
            if (provs && provs.length > 0) return provs;
        } catch {}
        return [];
    });
    const [presupuestos, setPresupuestos] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_presupuestos") || "[]"); } catch { return []; }
    });
    const [materiales, setMateriales] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales") || "[]"); } catch { return []; }
    });
    const [apus, setApus] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus") || "[]"); } catch { return []; }
    });
    
    // "list" | "compare"
    const [view, setView] = Re.useState("list");
    
    // Editing Providers
    const [editingProv, setEditingProv] = Re.useState(null);
    const [provForm, setProvForm] = Re.useState({});
    
    const saveProv = () => {
        if (!provForm.nombre) return setToast("⚠️ El nombre es obligatorio");
        let newProvs;
        if (provForm.id) {
            newProvs = proveedores.map(p => p.id === provForm.id ? provForm : p);
        } else {
            newProvs = [...proveedores, { ...provForm, id: Date.now().toString() }];
        }
        setProveedores(newProvs);
        localStorage.setItem("enlace_constructor_pro_v1_proveedores", JSON.stringify(newProvs));
        setEditingProv(null);
        setToast("✅ Proveedor guardado");
    };
    
    const deleteProv = (id) => {
        if (!window.confirm("¿Eliminar proveedor?")) return;
        const newProvs = proveedores.filter(p => p.id !== id);
        setProveedores(newProvs);
        localStorage.setItem("enlace_constructor_pro_v1_proveedores", JSON.stringify(newProvs));
    };

    // Compare View
    const [selectedBudget, setSelectedBudget] = Re.useState("");
    const [selectedProv, setSelectedProv] = Re.useState("");
    const [consolidatedItems, setConsolidatedItems] = Re.useState([]);
    const [cotizados, setCotizados] = Re.useState({}); // matId -> { precio, disp }
    
    Re.useEffect(() => {
        if (!selectedBudget) {
            setConsolidatedItems([]);
            return;
        }
        const budget = presupuestos.find(p => String(p.id) === String(selectedBudget));
        if (!budget || !budget.items) return;
        
        let reqs = {};
        budget.items.forEach(item => {
            const apuId = item._cid || item.apu;
            if (apuId || item.materiales) {
                const apuDef = apus.find(a => String(a.id) === String(apuId)) || item.apuDef || item; 
                const matList = (apuDef && apuDef.materiales) ? apuDef.materiales : (item.materiales || []);
                
                matList.forEach(m => {
                    const mId = m.materialId || m.id;
                    const mCant = parseFloat(m.cantidad || m.cant) || 0;
                    
                    const materialDef = materiales.find(x => String(x.id) === String(mId)) || m;
                    const requiredCant = mCant * (parseFloat(item.cant) || 0);
                    
                    if (requiredCant > 0 && mId) {
                        if (!reqs[mId]) {
                            reqs[mId] = {
                                id: mId,
                                nombre: materialDef.nombre || materialDef.desc || m.desc || "Material Desconocido",
                                unidad: materialDef.unidad || m.unidad || "UN",
                                cantidadTotal: 0,
                                precioReferencia: parseFloat(materialDef.precio || m.precio) || 0
                            };
                        }
                        reqs[mId].cantidadTotal += requiredCant;
                    }
                });
            }
        });
        
        setConsolidatedItems(Object.values(reqs).sort((a,b)=>b.cantidadTotal*b.precioReferencia - a.cantidadTotal*a.precioReferencia));
        
        // Try to load previous cotizados for this prov + budget combo from localStorage (Bonus feature)
        try {
            const saved = localStorage.getItem("enlace_constructor_pro_v1_cotiz_" + selectedBudget + "_" + selectedProv);
            if (saved) setCotizados(JSON.parse(saved));
            else setCotizados({});
        } catch { setCotizados({}); }
        
    }, [selectedBudget, selectedProv, apus, materiales, presupuestos]);
    
    const updateCotizado = (matId, precio) => {
        const p = parseFloat(precio) || 0;
        setCotizados(prev => {
            const next = { ...prev, [matId]: p };
            if (selectedBudget && selectedProv) {
                localStorage.setItem("enlace_constructor_pro_v1_cotiz_" + selectedBudget + "_" + selectedProv, JSON.stringify(next));
            }
            return next;
        });
    };
    
    return e.jsxs("div", {
        style: { display: "flex", flexDirection: "column", height: "100%", padding: 24, gap: 20 },
        children: [
            // HEADER
            e.jsxs("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center" },
                children: [
                    e.jsxs("div", {
                        children: [
                            e.jsx("h2", { style: { margin: 0, fontSize: 24, fontWeight: 700 }, children: "Directorio de Proveedores" }),
                            e.jsx("p", { style: { margin: 0, color: "var(--muted)", fontSize: 14 }, children: "Gestiona tu base de proveedores y compara cotizaciones." })
                        ]
                    }),
                    e.jsxs("div", {
                        style: { display: "flex", gap: 12 },
                        children: [
                            e.jsx("button", {
                                style: { padding: "8px 16px", background: view === "list" ? "var(--accent)" : "var(--sb)", color: view === "list" ? "#fff" : "var(--text)", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
                                onClick: () => setView("list"),
                                children: "🏢 Base de Proveedores"
                            }),
                            e.jsx("button", {
                                style: { padding: "8px 16px", background: view === "compare" ? "var(--accent)" : "var(--sb)", color: view === "compare" ? "#fff" : "var(--text)", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
                                onClick: () => setView("compare"),
                                children: "⚖️ Comparar Cotizaciones"
                            })
                        ]
                    })
                ]
            }),
            
            // VIEW: LIST
            view === "list" && e.jsxs("div", {
                style: { display: "flex", gap: 24, flex: 1, minHeight: 0 },
                children: [
                    e.jsxs("div", {
                        style: { flex: 2, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" },
                        children: [
                            e.jsxs("div", {
                                style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.1)" },
                                children: [
                                    e.jsxs("div", { style: { fontWeight: 600, fontSize: 15 }, children: ["Mis Proveedores (", proveedores.length, ")"] }),
                                    e.jsx("button", {
                                        style: { padding: "6px 12px", background: "#10b981", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 },
                                        onClick: () => { setProvForm({}); setEditingProv("new"); },
                                        children: "+ Añadir Proveedor"
                                    })
                                ]
                            }),
                            e.jsx("div", {
                                style: { overflowY: "auto", flex: 1, padding: 12 },
                                children: proveedores.length === 0 ? e.jsx("div", { style: { textAlign: "center", padding: 40, color: "var(--muted)" }, children: "No tienes proveedores registrados." }) : e.jsx("div", {
                                    style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 },
                                    children: proveedores.map(p => e.jsxs("div", {
                                        key: p.id,
                                        style: { padding: 16, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" },
                                        onClick: () => { setProvForm(p); setEditingProv(p.id); },
                                        children: [
                                            e.jsx("div", { style: { fontWeight: 700, fontSize: 16, marginBottom: 8, color: "var(--accent)" }, children: p.nombre }),
                                            p.vendedor && e.jsxs("div", { style: { fontSize: 13, color: "var(--muted)", marginBottom: 4 }, children: ["👤 ", p.vendedor] }),
                                            p.telefono && e.jsxs("div", { style: { fontSize: 13, color: "var(--muted)", marginBottom: 4 }, children: ["📞 ", p.telefono] }),
                                            p.email && e.jsxs("div", { style: { fontSize: 13, color: "var(--muted)" }, children: ["✉️ ", p.email] })
                                        ]
                                    }))
                                })
                            })
                        ]
                    }),
                    
                    editingProv && e.jsxs("div", {
                        style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column" },
                        children: [
                            e.jsxs("div", {
                                style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
                                children: [
                                    e.jsx("div", { style: { fontWeight: 600, fontSize: 15 }, children: editingProv === "new" ? "Nuevo Proveedor" : "Editar Proveedor" }),
                                    e.jsx("button", { style: { background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }, onClick: () => setEditingProv(null), children: "✕" })
                                ]
                            }),
                            e.jsxs("div", {
                                style: { padding: 20, display: "flex", flexDirection: "column", gap: 16, flex: 1, overflowY: "auto" },
                                children: [
                                    e.jsxs("label", {
                                        style: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text)" },
                                        children: ["Razón Social / Nombre", e.jsx("input", { style: { padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6 }, value: provForm.nombre || "", onChange: e => setProvForm({...provForm, nombre: e.target.value}) })]
                                    }),
                                    e.jsxs("label", {
                                        style: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text)" },
                                        children: ["RUT Proveedor", e.jsx("input", { style: { padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6 }, value: provForm.rut || "", onChange: e => setProvForm({...provForm, rut: e.target.value}) })]
                                    }),
                                    e.jsxs("label", {
                                        style: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text)" },
                                        children: ["Contacto / Vendedor", e.jsx("input", { style: { padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6 }, value: provForm.vendedor || "", onChange: e => setProvForm({...provForm, vendedor: e.target.value}) })]
                                    }),
                                    e.jsxs("label", {
                                        style: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text)" },
                                        children: ["Teléfono WhatsApp", e.jsx("input", { placeholder: "+569...", style: { padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6 }, value: provForm.telefono || "", onChange: e => setProvForm({...provForm, telefono: e.target.value}) })]
                                    }),
                                    e.jsxs("label", {
                                        style: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text)" },
                                        children: ["Correo Electrónico", e.jsx("input", { style: { padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6 }, value: provForm.email || "", onChange: e => setProvForm({...provForm, email: e.target.value}) })]
                                    })
                                ]
                            }),
                            e.jsxs("div", {
                                style: { padding: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" },
                                children: [
                                    editingProv !== "new" ? e.jsx("button", { style: { padding: "8px 16px", background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6, cursor: "pointer", fontWeight: 600 }, onClick: () => deleteProv(editingProv), children: "Eliminar" }) : e.jsx("div", {}),
                                    e.jsx("button", { style: { padding: "8px 16px", background: "var(--accent)", border: "none", color: "#fff", borderRadius: 6, cursor: "pointer", fontWeight: 600 }, onClick: saveProv, children: "Guardar" })
                                ]
                            })
                        ]
                    })
                ]
            }),
            
            // VIEW: COMPARE
            view === "compare" && e.jsxs("div", {
                style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" },
                children: [
                    e.jsxs("div", {
                        style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 20, alignItems: "center", background: "rgba(0,0,0,0.1)" },
                        children: [
                            e.jsxs("div", {
                                style: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
                                children: [
                                    e.jsx("label", { style: { fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }, children: "Proyecto / Presupuesto" }),
                                    e.jsxs("select", {
                                        style: { padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6, fontSize: 14, fontWeight: 600 },
                                        value: selectedBudget,
                                        onChange: e => setSelectedBudget(e.target.value),
                                        children: [
                                            e.jsx("option", { value: "", children: "-- Selecciona un Presupuesto --" }),
                                            presupuestos.map(p => e.jsx("option", { key: p.id, value: p.id, children: "N° " + p.id + " - " + p.descripcion }))
                                        ]
                                    })
                                ]
                            }),
                            e.jsxs("div", {
                                style: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
                                children: [
                                    e.jsx("label", { style: { fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }, children: "Proveedor a Comparar" }),
                                    e.jsxs("select", {
                                        style: { padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6, fontSize: 14, fontWeight: 600 },
                                        value: selectedProv,
                                        onChange: e => setSelectedProv(e.target.value),
                                        disabled: !selectedBudget,
                                        children: [
                                            e.jsx("option", { value: "", children: "-- Selecciona un Proveedor --" }),
                                            proveedores.map(p => e.jsx("option", { key: p.id, value: p.id, children: p.nombre }))
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    
                    e.jsx("div", {
                        style: { flex: 1, overflowY: "auto" },
                        children: (!selectedBudget || !selectedProv) ? e.jsx("div", {
                            style: { textAlign: "center", padding: 60, color: "var(--muted)" },
                            children: "Selecciona un Presupuesto y un Proveedor para comenzar a cargar su cotización y comparar precios."
                        }) : consolidatedItems.length === 0 ? e.jsx("div", {
                            style: { textAlign: "center", padding: 60, color: "var(--muted)" },
                            children: "Este presupuesto no tiene materiales en sus APUs."
                        }) : e.jsx("table", {
                            style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                            children: e.jsxs("thead", {
                                children: [
                                    e.jsxs("tr", {
                                        style: { background: "var(--bg)", borderBottom: "2px solid var(--border)" },
                                        children: [
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "MATERIAL / INSUMO" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "CANT." }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "P. UNIT REF (APU)" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "P. UNIT COTIZADO" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)", textAlign: "right" }, children: "IMPACTO TOTAL" })
                                        ]
                                    }),
                                    e.jsx("tbody", {
                                        children: (() => {
                                            let totalImpact = 0;
                                            const rows = consolidatedItems.map(item => {
                                                const cotiz = cotizados[item.id] || 0;
                                                const diff = cotiz > 0 ? (item.precioReferencia - cotiz) : 0;
                                                const impact = diff * item.cantidadTotal;
                                                totalImpact += impact;
                                                
                                                const isSavings = impact > 0;
                                                const isLoss = impact < 0;
                                                
                                                return e.jsxs("tr", {
                                                    key: item.id,
                                                    style: { borderBottom: "1px solid var(--border)", background: isSavings ? "rgba(16, 185, 129, 0.05)" : (isLoss ? "rgba(239, 68, 68, 0.05)" : "transparent") },
                                                    children: [
                                                        e.jsxs("td", { style: { padding: "12px 16px", fontWeight: 600, fontSize: 13 }, children: [item.nombre, e.jsx("br", {}), e.jsx("span", { style: { fontSize: 11, color: "var(--muted)", fontWeight: "normal" }, children: "Ref: $" + Math.round(item.precioReferencia).toLocaleString() + " x " + item.cantidadTotal.toFixed(2) + " " + item.unidad })] }),
                                                        e.jsx("td", { style: { padding: "12px 16px", fontSize: 13 }, children: item.cantidadTotal.toFixed(2) + " " + item.unidad }),
                                                        e.jsxs("td", { style: { padding: "12px 16px", fontSize: 13, color: "var(--muted)" }, children: ["$", Math.round(item.precioReferencia).toLocaleString()] }),
                                                        e.jsx("td", { style: { padding: "12px 16px" }, children: e.jsxs("div", {
                                                            style: { display: "flex", alignItems: "center", gap: 4 },
                                                            children: [
                                                                "$", e.jsx("input", {
                                                                    type: "number",
                                                                    placeholder: "0",
                                                                    style: { width: 100, padding: "8px 12px", background: "var(--bg)", border: isLoss ? "1px solid #ef4444" : (isSavings ? "1px solid #10b981" : "1px solid var(--border)"), color: "var(--text)", borderRadius: 6, fontWeight: 700 },
                                                                    value: cotizados[item.id] || "",
                                                                    onChange: (ev) => updateCotizado(item.id, ev.target.value)
                                                                })
                                                            ]
                                                        }) }),
                                                        e.jsx("td", { style: { padding: "12px 16px", textAlign: "right", fontWeight: 700, fontSize: 14, color: cotiz === 0 ? "var(--muted)" : (isSavings ? "#10b981" : (isLoss ? "#ef4444" : "var(--text)")) }, children: cotiz === 0 ? "-" : (impact > 0 ? "+$" : "-$") + Math.abs(Math.round(impact)).toLocaleString() })
                                                    ]
                                                });
                                            });
                                            
                                            rows.push(e.jsxs("tr", {
                                                key: "total",
                                                style: { background: "var(--bg)" },
                                                children: [
                                                    e.jsx("td", { colSpan: 4, style: { padding: "16px", textAlign: "right", fontWeight: 700, color: "var(--muted)" }, children: "IMPACTO TOTAL EN EL PROYECTO:" }),
                                                    e.jsx("td", { style: { padding: "16px", textAlign: "right", fontWeight: 800, fontSize: 18, color: totalImpact > 0 ? "#10b981" : (totalImpact < 0 ? "#ef4444" : "var(--text)") }, children: (totalImpact > 0 ? "+$" : (totalImpact < 0 ? "-$" : "$")) + Math.abs(Math.round(totalImpact)).toLocaleString() })
                                                ]
                                            }));
                                            
                                            return rows;
                                        })()
                                    })
                                ]
                            })
                        })
                    })
                ]
            })
        ]
    });
}
`;

fs.writeFileSync('src/assets/modulo_proveedores.js', content);
console.log('ModuloProveedores completely generated!');
