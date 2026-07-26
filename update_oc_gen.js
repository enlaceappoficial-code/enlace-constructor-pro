
function WhatsAppProviderModal({ doc, budget, docType, cfg, onClose, setToast }) {
    const isSC = docType === "sc";
    const [includeIntro, setIncludeIntro] = Re.useState(false);
    const [includeItems, setIncludeItems] = Re.useState(true);
    const [includeTotals, setIncludeTotals] = Re.useState(!isSC);
    const [includeCond, setIncludeCond] = Re.useState(true);
    const [includeValidez, setIncludeValidez] = Re.useState(true);
    const [customNote, setCustomNote] = Re.useState("");

    const formatMessage = () => {
        const provName = doc.prov.vendedor || doc.prov.nombre.split(' ')[0] || "Proveedor";
        let msg = `Hola ${provName} 👋\n\n`;
        
        if (includeIntro) {
            msg += `Junto con saludar, somos la empresa *${cfg?.empresa || "Constructora"}*. Nos estamos contactando porque nos gustaría considerarlos como proveedores para nuestros proyectos actuales y futuros.\n\n`;
        }
        
        if (isSC) {
            msg += `Te comparto nuestra Solicitud de Cotización para la obra:\n📄 *${budget.descripcion}*\n\n`;
        } else {
            msg += `Te comparto la Orden de Compra para la obra:\n🛒 *${budget.descripcion}*\n\n`;
        }

        if (includeItems) {
            msg += `DETALLE DE REQUERIMIENTOS:\n`;
            doc.items.forEach(it => {
                msg += `▪ ${it.nombre} — ${it.cantidadTotal.toFixed(2)} ${it.unidad}\n`;
            });
            msg += `\n`;
        }

        if (includeTotals && !isSC && doc.subtotal) {
            const iva = doc.subtotal * 0.19;
            const total = doc.subtotal + iva;
            msg += `💰 Subtotal neto: $${Math.round(doc.subtotal).toLocaleString("es-CL")}\n`;
            msg += `📄 IVA (19%): $${Math.round(iva).toLocaleString("es-CL")}\n`;
            msg += `✅ TOTAL O.C.: $${Math.round(total).toLocaleString("es-CL")}\n\n`;
        }

        if (includeCond) {
            if (isSC) {
                msg += `💳 *Condiciones:*
Agradecería su pronta respuesta con los valores comerciales, indicando forma de pago y plazos de entrega.\n\n`;
            } else {
                msg += `💳 *Condiciones:*
Favor confirmar recepción y plazos de entrega oportunos.\n\n`;
            }
        }
        
        if (customNote.trim()) {
            msg += `*Nota:* ${customNote.trim()}\n\n`;
        }

        msg += `Quedo atento a cualquier consulta 🤝\n`;
        msg += `*${cfg?.empresa || "Constructora"}*\n`;
        if (cfg?.telefono) msg += `📞 ${cfg.telefono}`;
        
        return msg.trim();
    };

    const finalMsg = formatMessage();
    const phone = (doc.prov.telefono || "").replace(/[^0-9]/g, "");

    const handleCopy = () => {
        navigator.clipboard.writeText(finalMsg);
        setToast("✅ Mensaje copiado al portapapeles");
    };

    const handleSend = () => {
        if (!phone) return setToast("⚠️ Este proveedor no tiene número de teléfono registrado.");
        
        // Implicit PDF download if needed, or simply WhatsApp link
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(finalMsg)}`, "_blank");
    };

    return e.jsxs("div", {
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
        children: [
            e.jsxs("div", {
                style: { background: "var(--bg)", width: "100%", maxWidth: 850, maxHeight: "90vh", borderRadius: 12, display: "flex", flexDirection: "column", border: "1px solid var(--border)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", overflow: "hidden" },
                children: [
                    e.jsxs("div", {
                        style: { padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)" },
                        children: [
                            e.jsxs("div", {
                                children: [
                                    e.jsx("div", { style: { fontSize: 18, fontWeight: 700 }, children: "📲 Compartir por WhatsApp" }),
                                    e.jsxs("div", { style: { fontSize: 13, color: "var(--muted)", marginTop: 2 }, children: [isSC ? "SC" : "OC", " — ", doc.prov.nombre] })
                                ]
                            }),
                            e.jsx("button", { onClick: onClose, style: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }, children: "✕" })
                        ]
                    }),
                    e.jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1, overflowY: "auto", minHeight: 0 },
                        children: [
                            e.jsxs("div", {
                                style: { padding: "20px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 16 },
                                children: [
                                    e.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: 1, textTransform: "uppercase" }, children: "⚙️ Configurar mensaje" }),
                                    
                                    e.jsxs("label", {
                                        style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: 8, cursor: "pointer" },
                                        children: [
                                            e.jsxs("span", { style: { fontSize: 14, fontWeight: 600, color: "#38bdf8" }, children: ["🤝 Saludo / Presentación", e.jsx("div", { style: { fontSize: 11, fontWeight: "normal", color: "var(--muted)", marginTop: 2 }, children: "Ideal para proveedores nuevos" })] }),
                                            e.jsx("input", { type: "checkbox", checked: includeIntro, onChange: (ev) => setIncludeIntro(ev.target.checked), style: { width: 40, height: 20, accentColor: "#38bdf8", cursor: "pointer" } })
                                        ]
                                    }),

                                    e.jsxs("label", {
                                        style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--sb)", borderRadius: 8, cursor: "pointer" },
                                        children: [
                                            e.jsx("span", { style: { fontSize: 14, fontWeight: 500 }, children: "📋 Incluir detalle de materiales" }),
                                            e.jsx("input", { type: "checkbox", checked: includeItems, onChange: (ev) => setIncludeItems(ev.target.checked), style: { width: 40, height: 20, accentColor: "#25D366", cursor: "pointer" } })
                                        ]
                                    }),
                                    
                                    !isSC && e.jsxs("label", {
                                        style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--sb)", borderRadius: 8, cursor: "pointer" },
                                        children: [
                                            e.jsx("span", { style: { fontSize: 14, fontWeight: 500 }, children: "💰 Incluir totales (neto + IVA)" }),
                                            e.jsx("input", { type: "checkbox", checked: includeTotals, onChange: (ev) => setIncludeTotals(ev.target.checked), style: { width: 40, height: 20, accentColor: "#25D366", cursor: "pointer" } })
                                        ]
                                    }),
                                    
                                    e.jsxs("label", {
                                        style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--sb)", borderRadius: 8, cursor: "pointer" },
                                        children: [
                                            e.jsx("span", { style: { fontSize: 14, fontWeight: 500 }, children: "💳 Incluir condiciones de cierre" }),
                                            e.jsx("input", { type: "checkbox", checked: includeCond, onChange: (ev) => setIncludeCond(ev.target.checked), style: { width: 40, height: 20, accentColor: "#25D366", cursor: "pointer" } })
                                        ]
                                    }),
                                    
                                    e.jsxs("div", {
                                        style: { marginTop: 8 },
                                        children: [
                                            e.jsx("div", { style: { fontSize: 13, color: "var(--muted)", marginBottom: 8 }, children: "📝 Nota personalizada (opcional)" }),
                                            e.jsx("textarea", {
                                                style: { width: "100%", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", padding: 12, borderRadius: 8, minHeight: 80, fontSize: 14, resize: "vertical" },
                                                placeholder: "Ej: Favor despachar a la brevedad posible en obra...",
                                                value: customNote,
                                                onChange: (ev) => setCustomNote(ev.target.value)
                                            }),
                                            e.jsxs("div", { style: { fontSize: 12, color: "var(--muted)", marginTop: 8 }, children: ["Enviando a: ", e.jsx("span", { style: { color: "#25D366", fontWeight: 600 }, children: phone ? ("+" + phone) : "⚠️ Sin teléfono" })] })
                                        ]
                                    })
                                ]
                            }),
                            
                            e.jsxs("div", {
                                style: { padding: "20px", display: "flex", flexDirection: "column", gap: 16, background: "rgba(0,0,0,0.1)" },
                                children: [
                                    e.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: 1, textTransform: "uppercase" }, children: "👁️ Vista previa del mensaje" }),
                                    e.jsxs("div", {
                                        style: { flex: 1, background: "#111b21", borderRadius: 12, padding: 16, position: "relative", display: "flex", flexDirection: "column", overflowY: "auto" },
                                        children: [
                                            e.jsxs("div", {
                                                style: { background: "#005c4b", color: "#e9edef", padding: "10px 14px", borderRadius: "12px 12px 12px 0", maxWidth: "95%", alignSelf: "flex-start", fontSize: 14.5, lineHeight: "1.4", whiteSpace: "pre-wrap", boxShadow: "0 1px 2px rgba(0,0,0,0.3)" },
                                                children: [
                                                    finalMsg,
                                                    e.jsx("div", { style: { textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }, children: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " ✓✓" })
                                                ]
                                            }),
                                            e.jsx("div", { style: { marginTop: "auto", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", paddingTop: 16 }, children: finalMsg.length + " caracteres" })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    
                    e.jsxs("div", {
                        style: { padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", gap: 12, background: "var(--surface)" },
                        children: [
                            e.jsx("button", {
                                onClick: handleCopy,
                                style: { flex: 1, padding: "12px", background: "var(--sb)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
                                children: "📋 Copiar mensaje"
                            }),
                            e.jsx("button", {
                                onClick: handleSend,
                                style: { flex: 2, padding: "12px", background: "#25D366", border: "none", color: "#fff", borderRadius: 8, cursor: phone ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)" },
                                disabled: !phone,
                                children: "📲 Enviar por WhatsApp"
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

function GeneradorOCModulo({budget, onClose, cfg, setToast}) {
    const [proveedores, setProveedores] = Re.useState(() => {
        try { 
            const provs = JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_proveedores") || "[]");
            if (provs && provs.length > 0) return provs;
        } catch {}
        return [];
    });
    const [materiales, setMateriales] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales") || "[]"); } catch { return []; }
    });
    const [apus, setApus] = Re.useState(() => {
        try { return JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus") || "[]"); } catch { return []; }
    });
    
    const [consolidatedItems, setConsolidatedItems] = Re.useState([]);
    const [docType, setDocType] = Re.useState("sc"); // "sc" or "oc"
    const [includeLetter, setIncludeLetter] = Re.useState(true);
    const [generatedDocs, setGeneratedDocs] = Re.useState(null);
    const [activeDocIndex, setActiveDocIndex] = Re.useState(0);
    const [activeWhatsAppDoc, setActiveWhatsAppDoc] = Re.useState(null);
    const [isGenerating, setIsGenerating] = Re.useState(false);
    
    Re.useEffect(() => {
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
                                precioReferencia: parseFloat(materialDef.precio || m.precio) || 0,
                                proveedorId: ""
                            };
                        }
                        reqs[mId].cantidadTotal += requiredCant;
                    }
                });
            }
        });
        
        setConsolidatedItems(Object.values(reqs));
    }, [budget, apus, materiales]);

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

    const autoAssign = () => {
        if (proveedores.length === 0) return setToast("⚠️ No hay proveedores disponibles.");
        setConsolidatedItems(prev => prev.map(m => ({ ...m, proveedorId: proveedores[0].id })));
        setToast("✅ Proveedores auto-asignados (Sugerencia)");
    };

    const generatePreview = async () => {
        const assigned = consolidatedItems.filter(m => m.proveedorId !== "");
        if (assigned.length === 0) return setToast("⚠️ Debes asignar al menos un proveedor a algún material.");
        
        setIsGenerating(true);
        try {
            const byProv = {};
            assigned.forEach(m => {
                if (!byProv[m.proveedorId]) byProv[m.proveedorId] = [];
                byProv[m.proveedorId].push(m);
            });

            if (!window.jspdf) {
                await zt("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
                await zt("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js");
            }
            
            const { jsPDF } = window.jspdf;
            const accentColor = cfg?.accentColor || "#f5a020";
            const accentRGB = accentColor.match(/\w\w/g).map(c => parseInt(c, 16));
            
            const getImageSize = (src) => new Promise(resolve => {
                const img = new window.Image();
                img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
                img.onerror = () => resolve({ w: 0, h: 0 });
                img.src = src;
            });
            
            const docsGenerated = [];

            for (const provId of Object.keys(byProv)) {
                const prov = proveedores.find(p => String(p.id) === String(provId));
                if (!prov) continue;
                
                const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
                const items = byProv[provId];
                const isSC = docType === "sc";
                
                let y = 14;
                
                if (isSC && includeLetter) {
                    if (cfg?.logoCliente) {
                        try {
                            const { w, h } = await getImageSize(cfg.logoCliente);
                            if (w && h) {
                                const ratio = Math.min(45 / w, 20 / h);
                                doc.addImage(cfg.logoCliente, cfg.logoCliente.includes('png') ? 'PNG' : 'JPEG', 14, y, w * ratio, h * ratio);
                            }
                        } catch (e) {}
                    }
                    
                    y += 30;
                    doc.setFontSize(10);
                    doc.setTextColor(50);
                    doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`, 14, y);
                    y += 10;
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text("CARTA DE INVITACIÓN A COTIZAR", 14, y);
                    y += 10;
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    doc.text(`Señores ${prov.nombre},`, 14, y);
                    y += 10;
                    const letterText = `Por medio de la presente, nos dirigimos a ustedes para solicitar una cotización formal de los materiales y/o servicios detallados en la página adjunta, requeridos para nuestro proyecto "${budget.descripcion}".\n\nAgradeceremos que su cotización incluya:\n- Precios unitarios netos y totales.\n- Disponibilidad y tiempos de entrega.\n- Condiciones de pago.\n- Vigencia de la oferta.\n\nQuedamos a la espera de su pronta respuesta para proceder con el análisis comercial y eventual emisión de la orden de compra.\n\nSin otro particular, saluda atentamente a usted,`;
                    
                    const splitText = doc.splitTextToSize(letterText, 180);
                    doc.text(splitText, 14, y);
                    y += 80;
                    
                    if (cfg?.firmaImg) {
                        try {
                            const { w, h } = await getImageSize(cfg.firmaImg);
                            if (w && h) {
                                const ratio = Math.min(56 / w, 24 / h);
                                doc.addImage(cfg.firmaImg, cfg.firmaImg.includes('png') ? 'PNG' : 'JPEG', 14, y, w*ratio, h*ratio);
                                y += (h*ratio) + 2;
                            }
                        } catch (e) { y += 4; }
                    }
                    
                    doc.setDrawColor(160, 170, 185);
                    doc.setLineWidth(0.4);
                    doc.line(14, y, 70, y);
                    y += 5;
                    if (cfg?.firmaNombre) {
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(9);
                        doc.text(cfg.firmaNombre, 14, y);
                        y += 5;
                    }
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(cfg?.empresa || "Constructora", 14, y);
                    
                    doc.addPage();
                    y = 14;
                }
                
                if (cfg?.logoCliente) {
                    try {
                        const { w, h } = await getImageSize(cfg.logoCliente);
                        if (w && h) {
                            const ratio = Math.min(45 / w, 20 / h);
                            doc.addImage(cfg.logoCliente, cfg.logoCliente.includes('png') ? 'PNG' : 'JPEG', 14, y, w * ratio, h * ratio);
                            y += Math.max(h * ratio, 15) + 5;
                        }
                    } catch (e) {}
                }
                
                doc.setFontSize(22);
                doc.setTextColor(40, 40, 40);
                doc.text(isSC ? "SOLICITUD DE COTIZACIÓN" : "ORDEN DE COMPRA", 14, y + 8);
                
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text(`N° Presupuesto Ref: ${budget.id}`, 14, y + 15);
                doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`, 14, y + 20);
                
                y += 35;
                
                doc.setFontSize(11);
                doc.setTextColor(...accentRGB);
                doc.text("DATOS DEL SOLICITANTE", 14, y);
                doc.text("PROVEEDOR", 105, y);
                
                y += 6;
                doc.setFontSize(9);
                doc.setTextColor(70, 80, 95);
                doc.text(`Empresa: ${cfg?.empresa || "Constructora"}`, 14, y);
                doc.text(`Empresa: ${prov.nombre}`, 105, y);
                
                y += 5;
                doc.text(`RUT: ${cfg?.rut || "Sin RUT"}`, 14, y);
                doc.text(`Vendedor: ${prov.vendedor || "No especificado"}`, 105, y);
                
                y += 5;
                if (cfg?.telefono) doc.text(`Fono: ${cfg?.telefono}`, 14, y);
                doc.text(`Email: ${prov.email || "No especificado"}`, 105, y);
                
                y += 5;
                doc.text(`Fono: ${prov.telefono || "No especificado"}`, 105, y);
                
                y += 12;
                
                let subtotal = 0;
                const tableData = items.map(item => {
                    const total = item.cantidadTotal * item.precioReferencia;
                    subtotal += total;
                    if (isSC) {
                        return [
                            item.nombre,
                            item.cantidadTotal.toFixed(2),
                            item.unidad,
                            "", 
                            ""
                        ];
                    }
                    return [
                        item.nombre,
                        item.cantidadTotal.toFixed(2),
                        item.unidad,
                        "$" + Math.round(item.precioReferencia).toLocaleString("es-CL"),
                        "$" + Math.round(total).toLocaleString("es-CL")
                    ];
                });
                
                doc.autoTable({
                    startY: y,
                    head: [["Descripción del Material", "Cantidad", "Unidad", "Precio Unitario", "Total"]],
                    body: tableData,
                    theme: 'grid',
                    headStyles: { fillColor: accentRGB },
                    styles: { fontSize: 8, textColor: [50, 60, 75] },
                    alternateRowStyles: { fillColor: [248, 250, 252] }
                });
                
                let finalY = doc.lastAutoTable.finalY + 12;
                
                if (!isSC) {
                    const iva = subtotal * 0.19;
                    const total = subtotal + iva;
                    
                    doc.setFontSize(9);
                    doc.setTextColor(90, 100, 115);
                    doc.text("Subtotal Neto", 130, finalY);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(30, 40, 55);
                    doc.text(`$${Math.round(subtotal).toLocaleString("es-CL")}`, 194, finalY, { align: "right" });
                    
                    finalY += 6;
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(90, 100, 115);
                    doc.text("IVA (19%)", 130, finalY);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(30, 40, 55);
                    doc.text(`$${Math.round(iva).toLocaleString("es-CL")}`, 194, finalY, { align: "right" });
                    
                    finalY += 2;
                    doc.setDrawColor(180, 185, 200);
                    doc.setLineWidth(0.4);
                    doc.line(130, finalY, 194, finalY);
                    
                    finalY += 2;
                    doc.setFillColor(...accentRGB);
                    doc.roundedRect(128, finalY, 68, 11, 2, 2, "F");
                    doc.setFontSize(10);
                    doc.setTextColor(255, 255, 255);
                    doc.text("TOTAL O.C.", 130, finalY + 7.5);
                    doc.text(`$${Math.round(total).toLocaleString("es-CL")}`, 193, finalY + 7.5, { align: "right" });
                    
                    finalY += 30;
                } else {
                    doc.setFont("helvetica", "italic");
                    doc.setFontSize(9);
                    doc.setTextColor(100);
                    doc.text("Nota: Por favor completar las columnas de Precio Unitario y Total para su cotización.", 14, finalY);
                    finalY += 20;
                }
                
                if (finalY + (cfg?.firmaImg ? 20 : 0) + 30 > 280) {
                    doc.addPage();
                    finalY = 30;
                }
                
                if (cfg?.firmaImg) {
                    try {
                        const { w, h } = await getImageSize(cfg.firmaImg);
                        if (w && h) {
                            const maxW = 56;
                            const maxH = 24;
                            const ratio = Math.min(maxW / w, maxH / h);
                            const imgW = w * ratio;
                            const imgH = h * ratio;
                            doc.addImage(cfg.firmaImg, cfg.firmaImg.includes('png') ? 'PNG' : 'JPEG', 14, finalY, imgW, imgH);
                            finalY += imgH + 2;
                        } else {
                            doc.addImage(cfg.firmaImg, 'PNG', 14, finalY, 35, 20);
                            finalY += 22;
                        }
                    } catch (e) {
                        finalY += 4;
                    }
                }
                
                doc.setDrawColor(160, 170, 185);
                doc.setLineWidth(0.4);
                doc.line(14, finalY, 70, finalY);
                finalY += 5;
                
                if (cfg?.firmaNombre) {
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.setTextColor(...accentRGB);
                    doc.text(cfg.firmaNombre, 14, finalY);
                    finalY += 5;
                }
                
                if (cfg?.firmaCargo) {
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(100, 115, 130);
                    doc.text(cfg.firmaCargo, 14, finalY);
                    finalY += 5;
                }
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 115, 130);
                doc.text(cfg?.empresa || "Firma Autorizada", 14, finalY);
                
                const pdfName = `${isSC ? "Cotizacion" : "Orden_Compra"}_${prov.nombre.replace(/\s+/g, '_')}_P${budget.id}.pdf`;
                const pdfBlob = doc.output("blob");
                const pdfDataUri = URL.createObjectURL(pdfBlob);
                
                docsGenerated.push({ prov, items, subtotal, pdfName, pdfDataUri });
            }
            
            setGeneratedDocs(docsGenerated);
            setActiveDocIndex(0);
        } catch (error) {
            console.error("Error generating preview:", error);
            setToast("❌ Hubo un error al generar los documentos.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (activeWhatsAppDoc) {
        return e.jsx(WhatsAppProviderModal, {
            doc: activeWhatsAppDoc,
            budget,
            docType,
            cfg,
            setToast,
            onClose: () => setActiveWhatsAppDoc(null)
        });
    }

    if (generatedDocs && generatedDocs.length > 0) {
        const activeDoc = generatedDocs[activeDocIndex];
        return e.jsxs("div", {
            style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
            children: [
                e.jsxs("div", {
                    style: { background: "var(--bg)", width: "100%", maxWidth: 1000, height: "90vh", borderRadius: 12, display: "flex", flexDirection: "column", border: "1px solid var(--border)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", overflow: "hidden" },
                    children: [
                        e.jsxs("div", {
                            style: { padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)" },
                            children: [
                                e.jsxs("div", {
                                    children: [
                                        e.jsx("div", { style: { fontSize: 18, fontWeight: 700 }, children: "👁️ Vista Previa de Documentos" }),
                                        e.jsxs("div", { style: { fontSize: 13, color: "var(--muted)", marginTop: 2 }, children: [generatedDocs.length, " documento(s) generado(s)"] })
                                    ]
                                }),
                                e.jsx("button", { onClick: () => setGeneratedDocs(null), style: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }, children: "✕" })
                            ]
                        }),
                        
                        e.jsxs("div", {
                            style: { display: "flex", flex: 1, overflow: "hidden" },
                            children: [
                                e.jsx("div", {
                                    style: { width: "250px", borderRight: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column", overflowY: "auto" },
                                    children: generatedDocs.map((doc, idx) => e.jsxs("div", {
                                        key: idx,
                                        onClick: () => setActiveDocIndex(idx),
                                        style: { padding: "16px", borderBottom: "1px solid var(--border)", cursor: "pointer", background: activeDocIndex === idx ? "rgba(var(--accent-rgb), 0.15)" : "transparent", borderLeft: activeDocIndex === idx ? "4px solid var(--accent)" : "4px solid transparent", transition: "all 0.2s" },
                                        children: [
                                            e.jsx("div", { style: { fontWeight: 700, fontSize: 14, color: activeDocIndex === idx ? "var(--text)" : "var(--muted)", marginBottom: 4 }, children: doc.prov.nombre }),
                                            e.jsx("div", { style: { fontSize: 12, color: "var(--muted)" }, children: doc.items.length + " material(es)" })
                                        ]
                                    }))
                                }),
                                
                                e.jsxs("div", {
                                    style: { flex: 1, display: "flex", flexDirection: "column", background: "#f1f5f9" },
                                    children: [
                                        e.jsx("div", {
                                            style: { flex: 1, padding: 20, display: "flex", justifyContent: "center" },
                                            children: e.jsx("iframe", {
                                                src: activeDoc.pdfDataUri,
                                                style: { width: "100%", height: "100%", border: "none", borderRadius: 8, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)", background: "white" }
                                            })
                                        }),
                                        e.jsxs("div", {
                                            style: { padding: "16px 24px", background: "var(--bg)", borderTop: "1px solid var(--border)", display: "flex", gap: 12, justifyContent: "flex-end" },
                                            children: [
                                                e.jsx("a", {
                                                    href: activeDoc.pdfDataUri,
                                                    download: activeDoc.pdfName,
                                                    style: { padding: "10px 20px", background: "var(--sb)", border: "1px solid var(--border)", color: "var(--text)", textDecoration: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 },
                                                    children: "⬇ Descargar PDF"
                                                }),
                                                e.jsx("a", {
                                                    href: `mailto:${activeDoc.prov.email||""}?subject=${encodeURIComponent("Solicitud de " + (docType==="sc"?"Cotización":"Compra") + " - " + budget.descripcion)}&body=${encodeURIComponent("Adjunto encontrará el documento del requerimiento.\n\nQuedamos atentos.\nSaludos.")}`,
                                                    style: { padding: "10px 20px", background: "var(--sb)", border: "1px solid var(--accent)", color: "var(--accent)", textDecoration: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 },
                                                    children: "✉️ Email"
                                                }),
                                                e.jsx("button", {
                                                    onClick: () => setActiveWhatsAppDoc(activeDoc),
                                                    style: { padding: "10px 20px", background: "#25D366", border: "none", color: "white", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 },
                                                    children: "📲 Enviar por WhatsApp"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }

    return e.jsxs("div", {
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
        onClick: (ev) => ev.target === ev.currentTarget && onClose(),
        children: [
            e.jsxs("div", {
                style: { background: "var(--bg)", width: "100%", maxWidth: 1000, maxHeight: "90vh", borderRadius: 12, display: "flex", flexDirection: "column", border: "1px solid var(--border)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" },
                children: [
                    e.jsxs("div", {
                        style: { padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
                        children: [
                            e.jsxs("div", {
                                children: [
                                    e.jsx("div", { style: { fontSize: 20, fontWeight: 700 }, children: "📦 Centro de Adquisiciones" }),
                                    e.jsxs("div", { style: { fontSize: 13, color: "var(--muted)" }, children: ["Presupuesto base: N° ", budget.id, " - ", budget.descripcion] })
                                ]
                            }),
                            e.jsx("button", {
                                style: { background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" },
                                onClick: onClose,
                                children: "✕"
                            })
                        ]
                    }),
                    
                    e.jsx("div", {
                        style: { padding: "20px 24px", overflowY: "auto", flex: 1 },
                        children: consolidatedItems.length === 0 ? e.jsx("div", { style: { textAlign: "center", color: "var(--muted)", padding: 40 }, children: "Este presupuesto no tiene materiales asignados en sus APUs." }) : e.jsxs("div", {
                            style: { display: "flex", gap: 24, flexDirection: "column" },
                            children: [
                                e.jsxs("div", {
                                    style: { display: "flex", gap: 16, background: "var(--surface)", padding: 16, borderRadius: 8, border: "1px solid var(--border)" },
                                    children: [
                                        e.jsxs("div", {
                                            style: { flex: 1 },
                                            children: [
                                                e.jsx("label", { style: { display: "block", marginBottom: 8, fontWeight: 600, fontSize: 13 }, children: "Tipo de Operación:" }),
                                                e.jsxs("div", {
                                                    style: { display: "flex", gap: 12 },
                                                    children: [
                                                        e.jsx("button", {
                                                            style: { flex: 1, padding: "10px", borderRadius: 6, border: docType === "sc" ? "2px solid var(--accent)" : "1px solid var(--border)", background: docType === "sc" ? "rgba(var(--accent-rgb), 0.1)" : "var(--bg)", color: "var(--text)", fontWeight: docType === "sc" ? 700 : 400, cursor: "pointer" },
                                                            onClick: () => setDocType("sc"),
                                                            children: "📝 Solicitud de Cotización"
                                                        }),
                                                        e.jsx("button", {
                                                            style: { flex: 1, padding: "10px", borderRadius: 6, border: docType === "oc" ? "2px solid var(--accent)" : "1px solid var(--border)", background: docType === "oc" ? "rgba(var(--accent-rgb), 0.1)" : "var(--bg)", color: "var(--text)", fontWeight: docType === "oc" ? 700 : 400, cursor: "pointer" },
                                                            onClick: () => setDocType("oc"),
                                                            children: "🛒 Orden de Compra"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        docType === "sc" && e.jsxs("div", {
                                            style: { flex: 1, borderLeft: "1px solid var(--border)", paddingLeft: 16 },
                                            children: [
                                                e.jsx("label", { style: { display: "block", marginBottom: 8, fontWeight: 600, fontSize: 13 }, children: "Opciones Adicionales:" }),
                                                e.jsxs("label", {
                                                    style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 },
                                                    children: [
                                                        e.jsx("input", { type: "checkbox", checked: includeLetter, onChange: (e) => setIncludeLetter(e.target.checked) }),
                                                        "Incluir Carta Formal de Presentación (PDF)"
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                
                                e.jsxs("div", {
                                    children: [
                                        e.jsxs("div", {
                                            style: { display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" },
                                            children: [
                                                e.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--accent)" }, children: "Materiales Requeridos (" + consolidatedItems.length + ")" }),
                                                e.jsx("button", {
                                                    style: { padding: "6px 12px", background: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: 6, cursor: "pointer", fontSize: 12 },
                                                    onClick: autoAssign,
                                                    children: "⚡ Auto-asignar Proveedores"
                                                })
                                            ]
                                        }),
                                        e.jsx("table", {
                                            style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                                            children: e.jsxs("thead", {
                                                children: [
                                                    e.jsxs("tr", {
                                                        style: { borderBottom: "1px solid var(--border)" },
                                                        children: [
                                                            e.jsx("th", { style: { padding: "10px", color: "var(--muted)", fontSize: 12 }, children: "Material" }),
                                                            e.jsx("th", { style: { padding: "10px", color: "var(--muted)", fontSize: 12 }, children: "Cant. Total" }),
                                                            e.jsx("th", { style: { padding: "10px", color: "var(--muted)", fontSize: 12 }, children: "Precio Ref." }),
                                                            e.jsx("th", { style: { padding: "10px", color: "var(--muted)", fontSize: 12 }, children: "Asignado A" }),
                                                            e.jsx("th", { style: { padding: "10px", width: 40 }, children: "" })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        e.jsxs("div", {
                                            style: { maxHeight: "35vh", overflowY: "auto" },
                                            children: [
                                                e.jsx("table", {
                                                    style: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
                                                    children: e.jsx("tbody", {
                                                        children: consolidatedItems.map(item => e.jsxs("tr", {
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
                                                                e.jsxs("td", { style: { padding: "10px", color: "var(--muted)" }, children: ["$", Math.round(item.precioReferencia).toLocaleString("es-CL")] }),
                                                                e.jsx("td", { style: { padding: "10px" }, children: e.jsxs("select", {
                                                                    style: { background: "var(--sb)", border: "1px solid var(--border)", color: "var(--text)", padding: "6px", borderRadius: 4, width: "100%", fontSize: 13 },
                                                                    value: item.proveedorId,
                                                                    onChange: (ev) => handleAssignProvider(item.id, ev.target.value),
                                                                    children: [
                                                                        e.jsx("option", { value: "", children: "-- Seleccione Proveedor --" }),
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
                                                        }))
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
                                                                e.jsx("option", { value: "", children: "Añadir material extra al requerimiento..." }),
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
                                                                })()
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
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    
                    e.jsxs("div", {
                        style: { padding: "16px 24px", borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.15)", display: "flex", justifyContent: "flex-end", gap: 12 },
                        children: [
                            e.jsx("button", {
                                style: { padding: "10px 24px", fontSize: 14, background: "var(--sb)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, cursor: "pointer" },
                                onClick: onClose,
                                children: "Cancelar"
                            }),
                            e.jsx("button", {
                                style: { 
                                    padding: "10px 24px", 
                                    fontSize: 14, 
                                    background: consolidatedItems.length === 0 ? "var(--border)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
                                    border: "none", 
                                    color: consolidatedItems.length === 0 ? "var(--muted)" : "#fff", 
                                    fontWeight: 700, 
                                    borderRadius: 8, 
                                    cursor: consolidatedItems.length === 0 || isGenerating ? "not-allowed" : "pointer",
                                    boxShadow: consolidatedItems.length === 0 ? "none" : "0 4px 12px rgba(16, 185, 129, 0.3)"
                                },
                                onClick: generatePreview,
                                disabled: consolidatedItems.length === 0 || isGenerating,
                                children: isGenerating ? "⏳ Generando..." : (docType === "sc" ? "📄 Revisar Solicitud de Cotización" : "🛒 Revisar Orden de Compra")
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
