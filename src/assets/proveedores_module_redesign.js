function ProveedoresModulo({proveedores, setProveedores, materiales, setMateriales, cfg, setToast}) {
    Re.useEffect(() => {
        if (!proveedores || proveedores.length === 0) {
            const mock = [
                { id: 101, nombre: "Ferretería El Maestro", vendedor: "Juan Pérez", telefono: "+56912345678", email: "ventas@elmaestro.cl" },
                { id: 102, nombre: "Sodimac Constructor", vendedor: "Venta Empresas", telefono: "+56987654321", email: "empresas@sodimac.cl" }
            ];
            setProveedores(mock);
        }
    }, []);

    const [view, setView] = Re.useState("list");
    const [editing, setEditing] = Re.useState({ id: null, nombre: "", vendedor: "", telefono: "", email: "" });
    const [compareData, setCompareData] = Re.useState(null);
    const [selectedChanges, setSelectedChanges] = Re.useState({});
    const [search, setSearch] = Re.useState("");

    // Export Excel function natively
    async function exportarPlantilla(prov) {
        try {
            if(!window.XLSX) {
                await zt("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
            }
            const XLSX = window.XLSX;
            const wb = XLSX.utils.book_new();
            
            const categorias = {};
            materiales.forEach(m => {
                const cat = m.cat || "Sin Categoría";
                if(!categorias[cat]) categorias[cat] = [];
                categorias[cat].push(m);
            });
            
            Object.keys(categorias).forEach(cat => {
                let sheetName = cat.substring(0, 31).replace(/[\\\/\?\*\[\]]/g, '');
                if(!sheetName) sheetName = "Materiales";
                
                const data = [["ID", "Material", "Categoria", "Unidad", "PRECIO OFRECIDO (Sin IVA)"]];
                categorias[cat].forEach(m => {
                    data.push([m.id, m.nombre, m.cat, m.unidad, ""]);
                });
                
                const ws = XLSX.utils.aoa_to_sheet(data);
                ws['!cols'] = [{wch:10}, {wch:50}, {wch:25}, {wch:10}, {wch:25}];
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
            });
            
            XLSX.writeFile(wb, `Cotizacion_${prov.nombre.replace(/\s+/g, '_')}.xlsx`);
            setToast("✅ Excel exportado exitosamente. Revisar pestañas.");
        } catch(err) {
            setToast("⚠️ Error al generar Excel: " + err.message);
        }
    }

    // Import Excel function
    async function importarCotizacion(ev, prov) {
        const file = ev.target.files[0];
        if(!file) return;
        
        try {
            if(!window.XLSX) {
                await zt("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
            }
            const XLSX = window.XLSX;
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });
            
            const compareItems = [];
            
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                
                if(!json.length || json[0][0] !== "ID") return;
                
                for(let i = 1; i < json.length; i++) {
                    const row = json[i];
                    if(!row[0]) continue;
                    const matId = parseInt(row[0]);
                    const offeredPrice = parseFloat(row[4]); // Index 4 is PRECIO OFRECIDO
                    
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
            });
            
            if(compareItems.length === 0) {
                return setToast("⚠️ No se encontraron materiales válidos en el archivo.");
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

    const guardarProveedor = () => {
        if(!editing.nombre.trim()) return setToast("⚠️ El nombre de la empresa es obligatorio");
        if(editing.id) {
            setProveedores(prev => prev.map(p => p.id === editing.id ? editing : p));
            setToast("✅ Proveedor actualizado");
        } else {
            const newId = proveedores.length > 0 ? Math.max(...proveedores.map(p => p.id)) + 1 : 1;
            setProveedores(prev => [...prev, d(d({}, editing), { id: newId })]);
            setToast("✅ Proveedor agregado");
        }
        setEditing({ id: null, nombre: "", vendedor: "", telefono: "", email: "" });
    };

    const eliminarProveedor = (id) => {
        if(confirm("¿Estás seguro de eliminar este proveedor?")) {
            setProveedores(prev => prev.filter(p => p.id !== id));
            setToast("✅ Proveedor eliminado");
        }
    };

    const filteredProv = proveedores.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || (p.vendedor && p.vendedor.toLowerCase().includes(search.toLowerCase())));
    const totalEmail = proveedores.filter(p => p.email && p.email.trim() !== "").length;
    const totalTel = proveedores.filter(p => p.telefono && p.telefono.trim() !== "").length;

    return e.jsxs("div", {
        style: { padding: "16px 20px" },
        children: [

            // COMPARE MODAL (MERCADO PUBLICO STYLE)
            view === "compare" && compareData && e.jsxs("div", {
                style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" },
                children: [
                    e.jsxs("div", {
                        style: { background: a.sb || "#1e293b", width: "100%", maxWidth: 1000, maxHeight: "90vh", borderRadius: 12, display: "flex", flexDirection: "column", border: `1px solid ${a.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" },
                        children: [
                            // Header
                            e.jsxs("div", {
                                style: { padding: "20px 24px", borderBottom: `1px solid ${a.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
                                children: [
                                    e.jsxs("div", {
                                        children: [
                                            e.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: a.text, marginBottom: 4 }, children: "Detalle de la Cotización" }),
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
                                                            style: { borderBottom: `1px solid ${a.border}`, background: selectedChanges[item.id] ? "var(--bdg-comp-bg)" : "transparent" },
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
                                                                e.jsx("td", { style: { padding: "10px", fontWeight: 700, color: isCheaper ? "#4ade80" : (isMore ? "#f87171" : a.muted) }, children: hasChanged ? (isCheaper ? `${pct}% (Más barato)` : `${pct}% (Más caro)`) : "-" })
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
                                style: { padding: "16px 24px", borderTop: `1px solid ${a.border}`, background: "rgba(0,0,0,0.15)", display: "flex", justifyContent: "flex-end", gap: 12 },
                                children: [
                                    e.jsx("button", {
                                        style: u(d({}, c.btn("s")), { padding: "10px 24px", fontSize: 14 }),
                                        onClick: () => setView("list"),
                                        children: "Cancelar"
                                    }),
                                    e.jsx("button", {
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
                                            setToast(`✅ ${idsToUpdate.length} precios adoptados exitosamente`);
                                            setView("list");
                                        },
                                        children: "💾 Guardar Precios Seleccionados"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),

            // Top Dashboard Section
            e.jsxs("div", {
                style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 20, marginBottom: 20 },
                children: [
                    // Empty left space (Top Clientes equivalent)
                    e.jsx("div", {}),
                    // Resumen (Right)
                    e.jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
                        children: [
                            e.jsxs("div", {
                                style: u(d({}, c.card), { textAlign: "center", padding: "16px", minWidth: 100 }),
                                children: [
                                    e.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: a.muted, textTransform: "uppercase", marginBottom: 8 }, children: "Total" }),
                                    e.jsx("div", { style: { fontSize: 24, fontWeight: 800, color: a.text }, children: proveedores.length })
                                ]
                            }),
                            e.jsxs("div", {
                                style: u(d({}, c.card), { textAlign: "center", padding: "16px", minWidth: 100 }),
                                children: [
                                    e.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: a.muted, textTransform: "uppercase", marginBottom: 8 }, children: "Con Email" }),
                                    e.jsx("div", { style: { fontSize: 24, fontWeight: 800, color: "#38bdf8" }, children: totalEmail })
                                ]
                            }),
                            e.jsxs("div", {
                                style: u(d({}, c.card), { textAlign: "center", padding: "16px", minWidth: 100 }),
                                children: [
                                    e.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: a.muted, textTransform: "uppercase", marginBottom: 8 }, children: "Con Tel." }),
                                    e.jsx("div", { style: { fontSize: 24, fontWeight: 800, color: "#34d399" }, children: totalTel })
                                ]
                            })
                        ]
                    })
                ]
            }),
            
            // Main Content Area (Table + Form)
            e.jsxs("div", {
                style: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" },
                children: [
                    // Left Column (Table)
                    e.jsxs("div", {
                        style: c.card,
                        children: [
                            e.jsxs("div", {
                                style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
                                children: [
                                    e.jsxs("div", {
                                        style: { display: "flex", alignItems: "center", gap: 10 },
                                        children: [
                                            e.jsx("div", { style: { color: a.accent, fontSize: 16 }, children: "🚚" }),
                                            e.jsxs("div", { style: { fontSize: 14, fontWeight: 700, color: a.accent, textTransform: "uppercase" }, children: ["PROVEEDORES (", filteredProv.length, ")"] })
                                        ]
                                    }),
                                    e.jsxs("div", {
                                        style: { display: "flex", alignItems: "center", gap: 12 },
                                        children: [
                                            e.jsx("input", {
                                                type: "text",
                                                placeholder: "Buscar proveedor...",
                                                style: u(d({}, c.inp), { width: 200, margin: 0 }),
                                                value: search,
                                                onChange: (ev) => setSearch(ev.target.value)
                                            })
                                        ]
                                    })
                                ]
                            }),
                            
                            e.jsx("table", {
                                style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                                children: e.jsxs("thead", {
                                    children: [
                                        e.jsx("tr", {
                                            style: { borderBottom: `1px solid ${a.border}` },
                                            children: [
                                                e.jsx("th", { style: { padding: "10px", color: a.accent, fontSize: 11, textTransform: "uppercase", width: 40 }, children: "ID" }),
                                                e.jsx("th", { style: { padding: "10px", color: a.accent, fontSize: 11, textTransform: "uppercase" }, children: "EMPRESA" }),
                                                e.jsx("th", { style: { padding: "10px", color: a.accent, fontSize: 11, textTransform: "uppercase" }, children: "VENDEDOR" }),
                                                e.jsx("th", { style: { padding: "10px", color: a.accent, fontSize: 11, textTransform: "uppercase" }, children: "EMAIL" }),
                                                e.jsx("th", { style: { padding: "10px", color: a.accent, fontSize: 11, textTransform: "uppercase" }, children: "TELÉFONO" }),
                                                e.jsx("th", { style: { padding: "10px", color: a.accent, fontSize: 11, textTransform: "uppercase", textAlign: "right" }, children: "ACCIÓN" })
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
                                        children: filteredProv.map(p => e.jsxs("tr", {
                                            key: p.id,
                                            style: { borderBottom: `1px solid ${a.border}` },
                                            children: [
                                                e.jsx("td", { style: { padding: "12px 10px", fontSize: 13, color: "#f5a020", fontWeight: 700, width: 40 }, children: p.id }),
                                                e.jsx("td", { style: { padding: "12px 10px", fontSize: 13, fontWeight: 700, color: a.text }, children: p.nombre }),
                                                e.jsx("td", { style: { padding: "12px 10px", fontSize: 13, color: a.muted }, children: p.vendedor || "—" }),
                                                e.jsx("td", { style: { padding: "12px 10px", fontSize: 13, color: "#38bdf8" }, children: p.email || "—" }),
                                                e.jsx("td", { style: { padding: "12px 10px", fontSize: 13, color: "#34d399" }, children: p.telefono || "—" }),
                                                e.jsx("td", { style: { padding: "12px 10px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 6 }, children: [
                                                    e.jsx("button", {
                                                        style: u(d({}, c.btn("s")), { padding: "4px 8px", fontSize: 11, background: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }),
                                                        title: "Exportar Plantilla Excel",
                                                        onClick: () => exportarPlantilla(p),
                                                        children: "📤 Export"
                                                    }),
                                                    e.jsxs("label", {
                                                        style: u(d({}, c.btn("s")), { padding: "4px 8px", fontSize: 11, background: "rgba(52, 211, 153, 0.1)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)", cursor: "pointer", display: "inline-flex", alignItems: "center", margin: 0 }),
                                                        title: "Importar Cotización",
                                                        children: [
                                                            "📥 Import",
                                                            e.jsx("input", {
                                                                type: "file", accept: ".xlsx,.xls", style: { display: "none" },
                                                                onChange: (ev) => importarCotizacion(ev, p)
                                                            })
                                                        ]
                                                    }),
                                                    e.jsx("button", {
                                                        style: u(d({}, c.btn("s")), { padding: "4px 8px", fontSize: 11 }),
                                                        title: "Hablar por WhatsApp",
                                                        onClick: () => p.telefono ? window.open(`https://wa.me/${p.telefono.replace(/\+/g,'')}`, "_blank") : setToast("⚠️ Este proveedor no tiene teléfono"),
                                                        children: "💬"
                                                    }),
                                                    e.jsx("button", {
                                                        style: u(d({}, c.btn("s")), { padding: "4px 8px", fontSize: 11 }),
                                                        title: "Editar",
                                                        onClick: () => setEditing(p),
                                                        children: "✏️"
                                                    }),
                                                    e.jsx("button", {
                                                        style: u(d({}, c.btn("d")), { padding: "4px 8px", fontSize: 11 }),
                                                        title: "Eliminar",
                                                        onClick: () => eliminarProveedor(p.id),
                                                        children: "✕"
                                                    })
                                                ] })
                                            ]
                                        }))
                                    })
                                })
                            })
                        ]
                    }),
                    
                    // Right Column (Form)
                    e.jsxs("div", {
                        style: u(d({}, c.card), { background: "rgba(255, 255, 255, 0.02)" }),
                        children: [
                            e.jsx("div", {
                                style: { color: "#f5a020", fontSize: 14, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 },
                                children: [
                                    editing.id ? "✏️" : "➕",
                                    editing.id ? "EDITAR PROVEEDOR" : "NUEVO PROVEEDOR"
                                ]
                            }),
                            e.jsxs("div", {
                                style: { display: "flex", flexDirection: "column", gap: 16 },
                                children: [
                                    e.jsxs("div", {
                                        children: [
                                            e.jsx("label", { style: { fontSize: 10, color: a.accent, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 6 }, children: "Empresa / Nombre" }),
                                            e.jsx("input", {
                                                type: "text",
                                                style: u(d({}, c.inp), { margin: 0, width: "100%", boxSizing: "border-box" }),
                                                value: editing.nombre,
                                                onChange: (ev) => setEditing(prev => d(d({}, prev), { nombre: ev.target.value }))
                                            })
                                        ]
                                    }),
                                    e.jsxs("div", {
                                        children: [
                                            e.jsx("label", { style: { fontSize: 10, color: a.accent, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 6 }, children: "Vendedor / Contacto" }),
                                            e.jsx("input", {
                                                type: "text",
                                                style: u(d({}, c.inp), { margin: 0, width: "100%", boxSizing: "border-box" }),
                                                value: editing.vendedor,
                                                onChange: (ev) => setEditing(prev => d(d({}, prev), { vendedor: ev.target.value }))
                                            })
                                        ]
                                    }),
                                    e.jsxs("div", {
                                        children: [
                                            e.jsx("label", { style: { fontSize: 10, color: a.accent, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 6 }, children: "Teléfono" }),
                                            e.jsx("input", {
                                                type: "text",
                                                placeholder: "+569...",
                                                style: u(d({}, c.inp), { margin: 0, width: "100%", boxSizing: "border-box" }),
                                                value: editing.telefono,
                                                onChange: (ev) => setEditing(prev => d(d({}, prev), { telefono: ev.target.value }))
                                            })
                                        ]
                                    }),
                                    e.jsxs("div", {
                                        children: [
                                            e.jsx("label", { style: { fontSize: 10, color: a.accent, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 6 }, children: "Email" }),
                                            e.jsx("input", {
                                                type: "email",
                                                style: u(d({}, c.inp), { margin: 0, width: "100%", boxSizing: "border-box" }),
                                                value: editing.email,
                                                onChange: (ev) => setEditing(prev => d(d({}, prev), { email: ev.target.value }))
                                            })
                                        ]
                                    }),
                                    
                                    e.jsx("div", { style: { marginTop: 10 }, children: e.jsx("button", {
                                        style: u(d({}, c.btn("p")), { width: "100%", padding: "12px", background: "#f5a020", color: "#000", fontWeight: 800, border: "none" }),
                                        onClick: guardarProveedor,
                                        children: editing.id ? "Guardar Cambios" : "Agregar"
                                    }) }),
                                    
                                    editing.id && e.jsx("div", { children: e.jsx("button", {
                                        style: u(d({}, c.btn("s")), { width: "100%", padding: "8px", fontSize: 12 }),
                                        onClick: () => setEditing({ id: null, nombre: "", vendedor: "", telefono: "", email: "" }),
                                        children: "Cancelar Edición"
                                    }) })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
