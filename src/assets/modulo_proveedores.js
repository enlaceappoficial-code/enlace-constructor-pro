
function ModuloProveedores({budgets, apus, materiales, cfg, setToast}) {
    const [proveedores, setProveedores] = Re.useState(() => {
        try { 
            const provs = JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_proveedores") || "[]");
            if (provs && provs.length > 0) return provs;
        } catch {}
        return [];
    });
    const [presupuestosLocal, setPresupuestos] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_presupuestos") || "[]"); } catch { return []; }
    });
    const presupuestosArray = budgets || presupuestosLocal;
    
    const [materialesLocal, setMateriales] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales") || "[]"); } catch { return []; }
    });
    const materialesArray = materiales || materialesLocal;
    
    const [apusLocal, setApus] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus") || "[]"); } catch { return []; }
    });
    const apusArray = apus || apusLocal;
    
    const [adquisiciones, setAdquisiciones] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_adquisiciones") || "[]"); } catch { return []; }
    });
    
    // "list" | "compare" | "history"
    const [view, setView] = Re.useState("list");
    // --- Excel Upload Support (via Tauri native API) ---
    const handleExcelUpload = async () => {
        try {
            if (!window.__TAURI__) {
                setToast('⚠️ API de Tauri no disponible');
                return;
            }
            if (!window.XLSX) {
                setToast('⚠️ La librería XLSX no está cargada');
                return;
            }
            const filePath = await window.__TAURI__.dialog.open({
                title: 'Seleccionar archivo Excel de cotización',
                filters: [{ name: 'Excel', extensions: ['xlsx', 'xls'] }],
                multiple: false
            });
            if (!filePath) return; // user cancelled
            const fileBytes = await window.__TAURI__.fs.readBinaryFile(filePath);
            const workbook = XLSX.read(fileBytes, { type: 'array' });
            const firstSheet = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheet];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            if (!rows || rows.length === 0) {
                setToast('⚠️ Excel vacío o no se pudo leer');
                return;
            }
            // Detect header indexes
            const header = rows[0].map(h => (h || '').toString().toLowerCase());
            const nameIdx = header.findIndex(h => h.includes('material') || h.includes('nombre') || h.includes('item') || h.includes('descripcion') || h.includes('descripción'));
            const priceIdx = header.findIndex(h => h.includes('precio') || h.includes('unit') || h.includes('price') || h.includes('valor'));
            if (nameIdx === -1 || priceIdx === -1) {
                setToast('⚠️ No se encontraron columnas de Material/Item y Precio en el Excel. Verifica los encabezados.');
                return;
            }
            const newCotizados = { ...cotizados };
            const lowerConsolidated = consolidatedItems.map(i => ({ ...i, lower: i.nombre.toLowerCase() }));
            let matchCount = 0;
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const rawName = row[nameIdx];
                const rawPrice = row[priceIdx];
                if (!rawName) continue;
                const name = rawName.toString().trim().toLowerCase();
                const priceNum = Number(rawPrice);
                if (isNaN(priceNum) || priceNum <= 0) continue;
                // Find matching item by fuzzy includes
                const match = lowerConsolidated.find(it => it.lower.includes(name) || name.includes(it.lower));
                if (match) {
                    newCotizados[match.id] = priceNum;
                    matchCount++;
                }
            }
            setCotizados(newCotizados);
            if (selectedRequest) {
                localStorage.setItem('enlace_constructor_pro_v1_cotiz_req_' + selectedRequest.id, JSON.stringify(newCotizados));
            }
            setToast('✅ ' + matchCount + ' precios importados desde Excel (' + rows.length + ' filas leídas)');
        } catch (err) {
            console.error('Error al procesar Excel:', err);
            setToast('⚠️ Error al procesar el Excel: ' + (err.message || err));
        }
    };

    const saveCotizadosToMateriales = () => {
        if (!selectedRequest) return setToast('⚠️ Selecciona primero un presupuesto');
        const updatedMaterials = materialesArray.map(mat => {
            // intentar encontrar cotizado por nombre
            const lowerName = mat.nombre.toLowerCase();
            const matchedItem = Object.entries(cotizados).find(([, price]) => {
                // buscamos coincidencia aproximada con el nombre del material
                return lowerName.includes(mat.nombre.toLowerCase()) || mat.nombre.toLowerCase().includes(lowerName);
            });
            if (matchedItem) {
                const [, price] = matchedItem;
                return { ...mat, precio: price };
            }
            return mat;
        });
        // guardar
        setMateriales(updatedMaterials);
        localStorage.setItem('enlace_constructor_pro_v1_materiales', JSON.stringify(updatedMaterials));
        setToast('✅ Precios guardados en la base de materiales');
    };
    const [attachmentUrl, setAttachmentUrl] = Re.useState(null);
    
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
    const [selectedRequest, setSelectedRequest] = Re.useState(null);
    const [consolidatedItems, setConsolidatedItems] = Re.useState([]);
    const [cotizados, setCotizados] = Re.useState({}); // matId -> { precio, disp }
    
    Re.useEffect(() => {
        if (selectedRequest) {
            setConsolidatedItems(selectedRequest.materiales.map(m => ({
                id: m.desc, // We use desc as ID if there is no true ID in the request, but we can match by name
                nombre: m.desc,
                unidad: m.unidad,
                cantidadTotal: m.cant,
                precioReferencia: m.precioRef || 0
            })));
            try {
                const saved = localStorage.getItem("enlace_constructor_pro_v1_cotiz_req_" + selectedRequest.id);
                if (saved) setCotizados(JSON.parse(saved));
                else setCotizados({});
            } catch { setCotizados({}); }
            return;
        }
        
        if (!selectedBudget) {
            setConsolidatedItems([]);
            return;
        }
        const budget = presupuestosArray.find(p => String(p.id) === String(selectedBudget));
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
                    
                    const materialDef = materialesArray.find(x => String(x.id) === String(mId)) || m;
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
        
    }, [selectedBudget, selectedProv, apusArray, materialesArray, presupuestosArray]);
    
    const updateCotizado = (matId, precio) => {
        const p = parseFloat(precio) || 0;
        setCotizados(prev => {
            const next = { ...prev, [matId]: p };
            if (selectedRequest) {
                localStorage.setItem("enlace_constructor_pro_v1_cotiz_req_" + selectedRequest.id, JSON.stringify(next));
                
                // Update request status if we are entering quotes
                if (selectedRequest.estado === "Esperando Cotización") {
                    const newAdq = adquisiciones.map(req => req.id === selectedRequest.id ? { ...req, estado: "Cotización Recibida" } : req);
                    setAdquisiciones(newAdq);
                    localStorage.setItem("enlace_constructor_pro_v1_adquisiciones", JSON.stringify(newAdq));
                }
            } else if (selectedBudget && selectedProv) {
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
                                style: { padding: "8px 16px", background: view === "history" ? "var(--accent)" : "var(--sb)", color: view === "history" ? "#fff" : "var(--text)", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
                                onClick: () => setView("history"),
                                children: "⏳ Historial y Solicitudes"
                            }),
                            e.jsx("button", {
                                style: { padding: "8px 16px", background: view === "compare" ? "var(--accent)" : "var(--sb)", color: view === "compare" ? "#fff" : "var(--text)", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
                                onClick: () => { setSelectedRequest(null); setView("compare"); },
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
            
            // VIEW: HISTORY
            view === "history" && e.jsxs("div", {
                style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" },
                children: [
                    e.jsxs("div", {
                        style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" },
                        children: [
                            e.jsxs("div", { style: { fontWeight: 600, fontSize: 15 }, children: ["Historial de Solicitudes (", adquisiciones.length, ")"] })
                        ]
                    }),
                    e.jsx("div", {
                        style: { flex: 1, overflowY: "auto", padding: 20 },
                        children: adquisiciones.length === 0 ? e.jsx("div", {
                            style: { textAlign: "center", padding: 60, color: "var(--muted)" },
                            children: "Aún no has generado ninguna Solicitud de Cotización u Orden de Compra desde el Centro de Adquisiciones."
                        }) : e.jsx("div", {
                            style: { display: "flex", flexDirection: "column", gap: 12 },
                            children: adquisiciones.map(req => {
                                const isSC = req.tipo === "sc";
                                const isReceived = req.estado === "Cotización Recibida" || req.estado === "Aprobado";
                                return e.jsxs("div", {
                                    key: req.id,
                                    style: { padding: "16px 20px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" },
                                    children: [
                                        e.jsxs("div", {
                                            children: [
                                                e.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
                                                    e.jsx("span", { style: { fontWeight: 700, fontSize: 15, color: "var(--accent)" }, children: req.id }),
                                                    e.jsx("span", { style: { fontSize: 11, padding: "2px 8px", background: isSC ? "rgba(59, 130, 246, 0.1)" : "rgba(245, 160, 32, 0.1)", color: isSC ? "#3b82f6" : "#f5a020", borderRadius: 12, fontWeight: 600 }, children: isSC ? "Cotización" : "Orden de Compra" }),
                                                    e.jsx("span", { style: { fontSize: 11, padding: "2px 8px", background: isReceived ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)", color: isReceived ? "#10b981" : "var(--muted)", borderRadius: 12, fontWeight: 600 }, children: req.estado })
                                                ]}),
                                                e.jsxs("div", { style: { fontSize: 13, color: "var(--text)", marginBottom: 4 }, children: ["🏢 Proveedor: ", e.jsx("strong", { children: req.proveedorNombre || "Desconocido" }), " | 🏗️ Presupuesto: ", e.jsx("strong", { children: "N° " + req.presupuestoId })]}),
                                                e.jsxs("div", { style: { fontSize: 12, color: "var(--muted)" }, children: ["📅 Emitida el ", req.fecha, " | ", req.materiales?.length || 0, " ítems solicitados"]})
                                            ]
                                        }),
                                        e.jsx("button", {
                                            style: { padding: "8px 16px", background: isReceived ? "var(--bg)" : "var(--accent)", color: isReceived ? "var(--text)" : "#fff", border: isReceived ? "1px solid var(--border)" : "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 },
                                            onClick: () => {
                                                setSelectedRequest(req);
                                                setView("compare");
                                            },
                                            children: isReceived ? "🔍 Ver Cotización" : "📝 Ingresar Precios Recibidos"
                                        })
                                    ]
                                });
                            })
                        })
                    })
                ]
            }),

            // VIEW: COMPARE
            view === "compare" && e.jsxs("div", {
                style: { display: "flex", flex: 1, gap: 20, minHeight: 0 },
                children: [
                    e.jsxs("div", {
                        style: { flex: attachmentUrl ? 1 : 2, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.3s ease" },
                        children: [
                    !selectedRequest && e.jsxs("div", {
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
                                            presupuestosArray.map(p => e.jsx("option", { key: p.id, value: p.id, children: "N° " + p.id + " - " + p.descripcion }))
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
                             }),
                             e.jsx("button", {
                                 style: { padding: "8px 16px", background: "var(--accent)", color: "white", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", alignSelf: "center", border: "none" },
                                 onClick: () => handleExcelUpload(),
                                 children: "📊 Cargar Excel Cotización"
                             })
                         ]
                     }),
                     
                    selectedRequest && e.jsxs("div", {
                        style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.1)" },
                        children: [
                            e.jsxs("div", {
                                children: [
                                    e.jsxs("div", { style: { fontWeight: 600, fontSize: 16, color: "var(--text)", marginBottom: 4 }, children: ["Comparando Solicitud: ", e.jsx("span", { style: { color: "var(--accent)" }, children: selectedRequest.id })] }),
                                    e.jsxs("div", { style: { fontSize: 13, color: "var(--muted)" }, children: ["Proveedor: ", selectedRequest.proveedorNombre, " | Presupuesto N° ", selectedRequest.presupuestoId] })
                                ]
                            }),
                            e.jsxs("div", {
                                style: { display: "flex", gap: 12, alignItems: "center" },
                                children: [
                                    e.jsxs("label", {
                                        style: { padding: "6px 12px", background: "var(--accent)", color: "white", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
                                        children: [
                                            "📎 Adjuntar Documento",
                                            e.jsx("input", {
                                                type: "file",
                                                accept: "image/*,.pdf",
                                                style: { display: "none" },
                                                onChange: (ev) => {
                                                    if (ev.target.files && ev.target.files[0]) {
                                                        const fileUrl = URL.createObjectURL(ev.target.files[0]);
                                                        setAttachmentUrl(fileUrl);
                                                    }
                                                }
                                            })
                                        ]
                                    }),
                                    e.jsx("button", {
                                        style: { padding: "6px 12px", background: "transparent", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 6, cursor: "pointer", fontSize: 13 },
                                        onClick: () => { setSelectedRequest(null); setView("history"); },
                                        children: "Volver al Historial"
                                    })
                                ]
                            })
                        ]
                    }),
                    
                    e.jsx("div", {
                        style: { flex: 1, overflowY: "auto" },
                        children: (!selectedBudget && !selectedRequest) ? e.jsx("div", {
                            style: { textAlign: "center", padding: 60, color: "var(--muted)" },
                            children: "Selecciona un Presupuesto y un Proveedor para comenzar a cargar su cotización y comparar precios."
                        }) : consolidatedItems.length === 0 ? e.jsx("div", {
                            style: { textAlign: "center", padding: 60, color: "var(--muted)" },
                            children: "Este presupuesto no tiene materiales en sus APUs."
                        }) : e.jsxs("table", {
                            style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                            children: [
                                e.jsx("thead", {
                                    children: e.jsxs("tr", {
                                        style: { background: "var(--bg)", borderBottom: "2px solid var(--border)" },
                                        children: [
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "MATERIAL / INSUMO" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "CANT." }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "P. UNIT REF" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "TOTAL REF" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "P. UNIT COTIZADO" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)" }, children: "TOTAL COTIZADO" }),
                                            e.jsx("th", { style: { padding: "12px 16px", color: "var(--muted)", fontSize: 12, position: "sticky", top: 0, background: "var(--bg)", textAlign: "right" }, children: "IMPACTO TOTAL" })
                                        ]
                                    })
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
                                                        e.jsxs("td", { style: { padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--text)" }, children: ["$", Math.round(item.precioReferencia * item.cantidadTotal).toLocaleString()] }),
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
                                                        e.jsxs("td", { style: { padding: "12px 16px", fontSize: 13, fontWeight: 600, color: cotiz > 0 ? "var(--text)" : "var(--muted)" }, children: [cotiz > 0 ? "$" : "", cotiz > 0 ? Math.round(cotiz * item.cantidadTotal).toLocaleString() : "-"] }),
                                                        e.jsx("td", { style: { padding: "12px 16px", textAlign: "right", fontWeight: 700, fontSize: 14, color: cotiz === 0 ? "var(--muted)" : (isSavings ? "#10b981" : (isLoss ? "#ef4444" : "var(--text)")) }, children: cotiz === 0 ? "-" : (impact > 0 ? "+$" : "-$") + Math.abs(Math.round(impact)).toLocaleString() })
                                                    ]
                                                });
                                            });
                                            
                                            rows.push(e.jsxs("tr", {
                                                key: "total",
                                                style: { background: "var(--bg)" },
                                                children: [
                                                    e.jsx("td", { colSpan: 6, style: { padding: "16px", textAlign: "right", fontWeight: 700, color: "var(--muted)" }, children: "IMPACTO TOTAL EN EL PROYECTO:" }),
                                                    e.jsx("td", { style: { padding: "16px", textAlign: "right", fontWeight: 800, fontSize: 18, color: totalImpact > 0 ? "#10b981" : (totalImpact < 0 ? "#ef4444" : "var(--text)") }, children: (totalImpact > 0 ? "+$" : (totalImpact < 0 ? "-$" : "$")) + Math.abs(Math.round(totalImpact)).toLocaleString() })
                                                ]
                                            }));
                                            
                                            return rows;
                                        })()
                                    })
                                ]
                            })
                        })
                    ]}),
                    attachmentUrl && e.jsxs("div", {
                        style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" },
                        children: [
                            e.jsxs("div", {
                                style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.1)" },
                                children: [
                                    e.jsx("span", { style: { fontWeight: 600, color: "var(--text)", fontSize: 15 }, children: "📄 Documento Adjunto" }),
                                    e.jsx("button", { 
                                        onClick: () => setAttachmentUrl(null), 
                                        style: { background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, padding: "0 8px" }, 
                                        children: "✖" 
                                    })
                                ]
                            }),
                            e.jsx("iframe", { src: attachmentUrl, style: { flex: 1, border: "none", width: "100%", background: "#fff" } })
                        ]
                    })
                ]
            })
        ]
    });
}
