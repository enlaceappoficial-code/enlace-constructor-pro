const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

const search = `    if (isEditing) {
        return e.jsxs("div", {
            style: { background: a.sb, padding: "12px", borderRadius: 8, marginBottom: 14, border: "1px solid #10b981" },
            children: [
                e.jsx("div", { style: { fontWeight: "bold", marginBottom: "8px", color: a.text, fontSize: 13 }, children: "Plan de Pagos (Hitos)" }),
                ...hitos.map((hito, idx) => {
                    return e.jsxs("div", {
                        style: { display: "flex", gap: "4px", marginBottom: "8px", alignItems: "center", flexWrap: "nowrap" },
                        children: [
                            e.jsx("input", {
                                value: hito.desc,
                                placeholder: "Descripción",
                                onChange: (ev) => {
                                    const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].desc = ev.target.value;
                                    D(Q => u(d({}, Q), { hitosPago: nh }));
                                },
                                style: { flex: 1, minWidth: "40px", padding: "4px 6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
                            }),
                            e.jsx("select", {
                                value: hito.tipo,
                                onChange: (ev) => {
                                    const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].tipo = ev.target.value;
                                    D(Q => u(d({}, Q), { hitosPago: nh }));
                                },
                                style: { padding: "4px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text },
                                children: [
                                    e.jsx("option", { value: "porcentaje", children: "%" }),
                                    e.jsx("option", { value: "monto", children: "$" })
                                ]
                            }),
                            e.jsx("input", {
                                type: "number",
                                value: hito.valor,
                                onChange: (ev) => {
                                    const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].valor = parseFloat(ev.target.value) || 0;
                                    D(Q => u(d({}, Q), { hitosPago: nh }));
                                },
                                style: { width: "50px", padding: "4px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
                            }),
                            e.jsx("button", {
                                onClick: () => {
                                    const nh = hitos.filter((_, i) => i !== idx);
                                    D(Q => u(d({}, Q), { hitosPago: nh }));
                                },
                                style: { background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "4px 8px", fontWeight: "bold", flexShrink: 0 },
                                children: "X"
                            })
                        ]
                    });
                }),
                e.jsx("button", {
                    onClick: () => {
                        const nh = [...hitos, { desc: "Nuevo Avance", tipo: "porcentaje", valor: 10 }];
                        D(Q => u(d({}, Q), { hitosPago: nh }));
                    },
                    style: { display: "block", width: "100%", padding: "8px", background: "#3b82f6", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "13px", marginBottom: "8px", fontWeight: "bold" },
                    children: "+ Agregar Hito"
                }),
                e.jsx("button", {
                    onClick: () => setIsEditing(false),
                    style: { display: "block", width: "100%", padding: "8px", background: "#10b981", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "bold" },
                    children: "✓ Guardar Plan"
                })
            ]
        });
    }

    return e.jsxs("div", {
        onClick: () => setIsEditing(true),
        style: {
            background: a.sb,
            borderRadius: 7,
            marginBottom: 14,
            cursor: "pointer",
            border: "1px dashed transparent"
        },
        onMouseEnter: (ev) => ev.currentTarget.style.border = "1px dashed #10b981",
        onMouseLeave: (ev) => ev.currentTarget.style.border = "1px dashed transparent",
        children: hitos.map((hito, i) => e.jsxs("div", {
            style: { display: "flex", justifyContent: "space-between", padding: "8px 12px" },
            children: [
                e.jsx("span", { style: { color: a.text, fontSize: 13, fontWeight: "500" }, children: hito.desc }),
                e.jsx("span", { style: { color: a.text, fontSize: 13, fontWeight: "bold" }, children: hito.tipo === 'porcentaje' ? hito.valor + '%' : ne(parseFloat(hito.valor)||0) })
            ]
        }))
    });`;

let replace = `    return e.jsxs("div", {
        style: { background: a.sb, padding: "12px", borderRadius: 8, marginBottom: 14, border: "1px solid #10b981" },
        children: [
            e.jsx("div", { style: { fontWeight: "bold", marginBottom: "8px", color: a.text, fontSize: 13 }, children: "Plan de Pagos (Hitos)" }),
            ...hitos.map((hito, idx) => {
                return e.jsxs("div", {
                    style: { display: "flex", gap: "4px", marginBottom: "8px", alignItems: "center", flexWrap: "nowrap" },
                    children: [
                        e.jsx("input", {
                            value: hito.desc,
                            placeholder: "Descripción",
                            onChange: (ev) => {
                                const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].desc = ev.target.value;
                                D(Q => u(d({}, Q), { hitosPago: nh }));
                            },
                            style: { flex: 1, minWidth: "40px", padding: "4px 6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
                        }),
                        e.jsx("select", {
                            value: hito.tipo,
                            onChange: (ev) => {
                                const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].tipo = ev.target.value;
                                D(Q => u(d({}, Q), { hitosPago: nh }));
                            },
                            style: { padding: "4px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text },
                            children: [
                                e.jsx("option", { value: "porcentaje", children: "%" }),
                                e.jsx("option", { value: "monto", children: "$" })
                            ]
                        }),
                        e.jsx("input", {
                            type: "number",
                            value: hito.valor,
                            onChange: (ev) => {
                                const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].valor = parseFloat(ev.target.value) || 0;
                                D(Q => u(d({}, Q), { hitosPago: nh }));
                            },
                            style: { width: "50px", padding: "4px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
                        }),
                        e.jsx("button", {
                            onClick: () => {
                                const nh = hitos.filter((_, i) => i !== idx);
                                D(Q => u(d({}, Q), { hitosPago: nh }));
                            },
                            style: { background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "4px 8px", fontWeight: "bold", flexShrink: 0 },
                            children: "X"
                        })
                    ]
                });
            }),
            e.jsx("button", {
                onClick: () => {
                    const nh = [...hitos, { desc: "Nuevo Avance", tipo: "porcentaje", valor: 10 }];
                    D(Q => u(d({}, Q), { hitosPago: nh }));
                },
                style: { display: "block", width: "100%", padding: "8px", background: "#3b82f6", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "13px", marginBottom: "8px", fontWeight: "bold" },
                children: "+ Agregar Hito"
            })
        ]
    });`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    console.log("Successfully patched HitosEditor to always show editable mode.");
} else {
    console.log("Failed to find HitosEditor block to patch.");
}

fs.writeFileSync(targetPath, code);
