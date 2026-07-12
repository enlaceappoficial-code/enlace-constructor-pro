function ProveedoresModulo({proveedores, setProveedores, materiales, setMateriales, cfg, setToast}) {
    const [view, setView] = Re.useState("list");
    const [editing, setEditing] = Re.useState(null);
    const [compareData, setCompareData] = Re.useState(null);
    const [selectedChanges, setSelectedChanges] = Re.useState({});
    
    // Directorio View
    if(view === "list") {
        return e.jsxs("div", {
            style: { padding: "24px 28px", maxWidth: 1100, margin: "0 auto" },
            children: [
                e.jsxs("div", {
                    style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
                    children: [
                        e.jsxs("div", {
                            children: [
                                e.jsx("div", { style: { fontSize: 24, fontWeight: 700 }, children: "🚚 Proveedores" }),
                                e.jsx("div", { style: { fontSize: 14, color: a.muted }, children: "Directorio de proveedores y comparación de cotizaciones" })
                            ]
                        }),
                        e.jsx("button", {
                            style: d(d({}, c.btn("p")), { padding: "8px 16px" }),
                            onClick: () => { setEditing({ nombre: "", vendedor: "", telefono: "", email: "" }); setView("edit"); },
                            children: "➕ Nuevo Proveedor"
                        })
                    ]
                }),
                (!proveedores || proveedores.length === 0) ? e.jsx("div", {
                    style: { textAlign: "center", padding: "40px", color: a.muted, background: a.card, borderRadius: 10 },
                    children: "No tienes proveedores guardados. Crea uno para empezar a comparar precios."
                }) : e.jsx("div", {
                    style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
                    children: proveedores.map(p => e.jsxs("div", {
                        key: p.id,
                        style: d(d({}, c.card), { position: "relative" }),
                        children: [
                            e.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: a.accent, marginBottom: 4 }, children: p.nombre }),
                            e.jsxs("div", { style: { fontSize: 13, color: a.text, marginBottom: 12 }, children: ["👤 ", p.vendedor || "Sin vendedor"] }),
                            e.jsxs("div", { style: { fontSize: 12, color: a.muted, marginBottom: 4 }, children: ["📞 ", p.telefono || "-"] }),
                            e.jsxs("div", { style: { fontSize: 12, color: a.muted, marginBottom: 16 }, children: ["✉️ ", p.email || "-"] }),
                            e.jsxs("div", {
                                style: { display: "flex", gap: 8, flexWrap: "wrap" },
                                children: [
                                    e.jsx("button", {
                                        style: d(d({}, c.btn("s")), { fontSize: 12, padding: "5px 10px", flex: 1 }),
                                        onClick: () => { setEditing(p); setView("edit"); },
                                        children: "✏️ Editar"
                                    }),
                                    e.jsx("button", {
                                        style: d(d({}, c.btn("s")), { fontSize: 12, padding: "5px 10px", flex: 1 }),
                                        onClick: () => {
                                            if(!p.telefono) return setToast("⚠️ Agrega un teléfono primero");
                                            window.open(`https://wa.me/${p.telefono.replace(/\+/g,'')}`, "_blank");
                                        },
                                        children: "💬 WhatsApp"
                                    })
                                ]
                            }),
                            e.jsxs("div", {
                                style: { display: "flex", gap: 8, marginTop: 8 },
                                children: [
                                    e.jsx("button", {
                                        style: d(d({}, c.btn("s")), { fontSize: 12, padding: "5px 10px", flex: 1, background: "#1e3a8a", color: "#fff", border: "none" }),
                                        onClick: () => exportarPlantilla(p),
                                        children: "📤 Exportar Plantilla Excel"
                                    }),
                                    e.jsxs("label", {
                                        style: d(d({}, c.btn("p")), { fontSize: 12, padding: "5px 10px", flex: 1, textAlign: "center", cursor: "pointer" }),
                                        children: [
                                            "📥 Importar Cotización",
                                            e.jsx("input", {
                                                type: "file", accept: ".xlsx,.xls", style: { display: "none" },
                                                onChange: (ev) => importarCotizacion(ev, p)
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }))
                })
            ]
        });
    }

    if(view === "edit") {
        return e.jsxs("div", {
            style: { padding: "24px 28px", maxWidth: 600, margin: "0 auto" },
            children: [
                e.jsxs("div", {
                    style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
                    children: [
                        e.jsx("div", { style: { fontSize: 20, fontWeight: 700 }, children: editing.id ? "Editar Proveedor" : "Nuevo Proveedor" }),
                        e.jsx("button", { style: c.btn("s"), onClick: () => setView("list"), children: "Volver" })
                    ]
                }),
                e.jsxs("div", {
                    style: c.card,
                    children: [
                        e.jsxs("div", {
                            style: { marginBottom: 12 },
                            children: [
                                e.jsx("div", { style: { fontSize: 12, color: a.muted, marginBottom: 4 }, children: "Nombre de la Empresa / Ferretería" }),
                                e.jsx("input", {
                                    style: c.inp, value: editing.nombre,
                                    onChange: ev => setEditing(prev => d(d({}, prev), { nombre: ev.target.value }))
                                })
                            ]
                        }),
                        e.jsxs("div", {
                            style: { marginBottom: 12 },
                            children: [
                                e.jsx("div", { style: { fontSize: 12, color: a.muted, marginBottom: 4 }, children: "Vendedor / Contacto" }),
                                e.jsx("input", {
                                    style: c.inp, value: editing.vendedor,
                                    onChange: ev => setEditing(prev => d(d({}, prev), { vendedor: ev.target.value }))
                                })
                            ]
                        }),
                        e.jsxs("div", {
                            style: { marginBottom: 12 },
                            children: [
                                e.jsx("div", { style: { fontSize: 12, color: a.muted, marginBottom: 4 }, children: "Teléfono (formato +569...)" }),
                                e.jsx("input", {
                                    style: c.inp, value: editing.telefono,
                                    onChange: ev => setEditing(prev => d(d({}, prev), { telefono: ev.target.value }))
                                })
                            ]
                        }),
                        e.jsxs("div", {
                            style: { marginBottom: 20 },
                            children: [
                                e.jsx("div", { style: { fontSize: 12, color: a.muted, marginBottom: 4 }, children: "Correo Electrónico" }),
                                e.jsx("input", {
                                    style: c.inp, value: editing.email,
                                    onChange: ev => setEditing(prev => d(d({}, prev), { email: ev.target.value }))
                                })
                            ]
                        }),
                        e.jsx("button", {
                            style: d(d({}, c.btn("p")), { width: "100%", padding: 12 }),
                            onClick: () => {
                                if(!editing.nombre) return setToast("⚠️ Ingresa el nombre del proveedor");
                                if(editing.id) {
                                    setProveedores(prev => prev.map(x => x.id === editing.id ? editing : x));
                                } else {
                                    setProveedores(prev => [...prev, d(d({}, editing), { id: Date.now() })]);
                                }
                                setToast("✅ Proveedor guardado");
                                setView("list");
                            },
                            children: "💾 Guardar Proveedor"
                        })
                    ]
                })
            ]
        });
    }

    if(view === "compare" && compareData) {
        return e.jsxs("div", {
            style: { padding: "24px 28px", maxWidth: 1100, margin: "0 auto" },
            children: [
                e.jsxs("div", {
                    style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
                    children: [
                        e.jsxs("div", {
                            children: [
                                e.jsx("div", { style: { fontSize: 24, fontWeight: 700 }, children: "⚖️ Cuadro Comparativo" }),
                                e.jsxs("div", { style: { fontSize: 14, color: a.muted }, children: ["Cotización importada de: ", e.jsx("strong", { style: { color: a.accent }, children: compareData.proveedor.nombre })] })
                            ]
                        }),
                        e.jsxs("div", {
                            style: { display: "flex", gap: 8 },
                            children: [
                                e.jsx("button", { style: c.btn("s"), onClick: () => setView("list"), children: "Cancelar" }),
                                e.jsx("button", {
                                    style: c.btn("p"),
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
                                        setToast(`✅ ${idsToUpdate.length} precios adoptados exitosamente`);
                                        setView("list");
                                    },
                                    children: "💾 Adoptar Precios Seleccionados"
                                })
                            ]
                        })
                    ]
                }),
                e.jsxs("div", {
                    style: c.card,
                    children: [
                        e.jsx("table", {
                            style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                            children: e.jsxs("thead", {
                                children: [
                                    e.jsx("tr", {
                                        style: { borderBottom: `1px solid ${a.border}` },
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
                            style: { maxHeight: "60vh", overflowY: "auto" },
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
                                            style: { borderBottom: `1px solid ${a.border}`, background: selectedChanges[item.id] ? "var(--bdg-comp-bg)" : "transparent" },
                                            children: [
                                                e.jsx("td", { style: { padding: "10px", width: 40 }, children: hasChanged && e.jsx("input", {
                                                    type: "checkbox",
                                                    checked: !!selectedChanges[item.id],
                                                    onChange: (ev) => setSelectedChanges(prev => d(d({}, prev), { [item.id]: ev.target.checked }))
                                                }) }),
                                                e.jsx("td", { style: { padding: "10px", fontWeight: 600 }, children: item.nombre }),
                                                e.jsx("td", { style: { padding: "10px", fontSize: 12, color: a.muted }, children: item.cat }),
                                                e.jsxs("td", { style: { padding: "10px", color: a.muted }, children: ["$", item.precioActual.toLocaleString("es-CL")] }),
                                                e.jsxs("td", { style: { padding: "10px", fontWeight: 700, color: hasChanged ? a.text : a.muted }, children: ["$", item.nuevoPrecio.toLocaleString("es-CL")] }),
                                                e.jsx("td", { style: { padding: "10px", fontWeight: 700, color: isCheaper ? "#4ade80" : (isMore ? "#f87171" : a.muted) }, children: hasChanged ? (isCheaper ? `${pct}% (Más barato)` : `${pct}% (Más caro)`) : "-" })
                                            ]
                                        });
                                    })
                                })
                            })
                        })
                    ]
                })
            ]
        });
    }

    // Export Excel function
    function exportarPlantilla(prov) {
        let csvContent = "ID,Material,Categoria,Unidad,Precio Actual,PRECIO OFRECIDO\n";
        materiales.forEach(m => {
            const row = [m.id, `"${m.nombre.replace(/"/g, '""')}"`, `"${m.cat}"`, m.unidad, m.precio, ""];
            csvContent += row.join(",") + "\n";
        });
        const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Plantilla_Cotizacion_${prov.nombre.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToast("✅ Plantilla CSV generada exitosamente. Ábrela con Excel.");
    }

    // Import Excel/CSV function
    async function importarCotizacion(ev, prov) {
        const file = ev.target.files[0];
        if(!file) return;
        
        try {
            // Check if XLSX library is loaded (from Actualizacion de Precios it might be, but let's load it if not)
            if(!window.XLSX) {
                await zt("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
            }
            const XLSX = window.XLSX;
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            if(!json.length || json[0][0] !== "ID") {
                return setToast("⚠️ Formato inválido. Usa la plantilla exportada.");
            }
            
            const compareItems = [];
            for(let i = 1; i < json.length; i++) {
                const row = json[i];
                if(!row[0]) continue;
                const matId = parseInt(row[0]);
                const offeredPrice = parseFloat(row[5]); // Index 5 is 'PRECIO OFRECIDO'
                
                const existingMat = materiales.find(m => m.id === matId);
                if(existingMat) {
                    compareItems.push({
                        id: existingMat.id,
                        nombre: existingMat.nombre,
                        cat: existingMat.cat,
                        precioActual: existingMat.precio,
                        nuevoPrecio: !isNaN(offeredPrice) ? offeredPrice : existingMat.precio
                    });
                }
            }
            
            setCompareData({
                proveedor: prov,
                items: compareItems
            });
            setSelectedChanges({});
            setView("compare");
            
        } catch(err) {
            setToast("⚠️ Error al leer el archivo: " + err.message);
        }
        ev.target.value = "";
    }

    return null;
}
