const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Sidebar UI Replacement
const sidebarStr = `                      e.jsxs("div", {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          background: a.sb,
                          borderRadius: 7,
                          marginBottom: 14,
                        },
                        children: [
                          e.jsxs("span", {
                            style: { fontSize: 13, color: a.muted },
                            children: [
                              "Anticipo (",
                              Math.round(r.anticipo * 100),
                              "%)",
                            ],
                          }),
                          e.jsx("span", {
                            style: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#86efac",
                            },
                            children: ne(J),
                          }),
                        ],
                      }),`;

const sidebarReplacement = `                      (typeof window.renderHitosSidebar === 'function' ? window.renderHitosSidebar(e, I, D, r, ne, J, a, c, ze, Pe, u, d) : ` + sidebarStr + `),`;

if (code.includes(sidebarStr)) {
    code = code.replace(sidebarStr, sidebarReplacement);
    console.log("Successfully replaced sidebar UI block");
} else {
    console.error("Failed to find sidebar UI block");
}

// 2. Dashboard modal Replacement
const modalStr = `                        e.jsxs("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 12px",
                            background: "#e8f5e9",
                            borderRadius: 6,
                            marginTop: 7,
                            border: "1px solid #c8e6c9",
                          },
                          children: [
                            e.jsxs("span", {
                              style: { fontSize: 14, color: "#2e7d32" },
                              children: [
                                "Anticipo (",
                                Math.round(n.anticipo * 100),
                                "%)",
                              ],
                            }),
                            e.jsx("span", {
                              style: {
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#2e7d32",
                              },
                              children: ne(j),
                            }),
                          ],
                        }),`;

const modalReplacement = `                        (typeof window.renderHitosModal === 'function' ? window.renderHitosModal(e, h, n, ne, j) : ` + modalStr + `),`;
if (code.includes(modalStr)) {
    code = code.replace(modalStr, modalReplacement);
    console.log("Successfully replaced dashboard modal UI block");
} else {
    console.error("Failed to find dashboard modal UI block");
}

// 3. PDF Generator Replacement
const pdfStr = `          o.setFillColor(240, 248, 241),
          o.setDrawColor(180, 220, 185),
          o.setLineWidth(0.3),
          o.roundedRect(J - 2, M, 196 - J + 2, 10, 2, 2, "FD"),
          o.setFont("helvetica", "normal"),
          o.setFontSize(9),
          o.setTextColor(30, 110, 65),
          o.text(
            "Anticipo (" + Math.round(r.anticipo * 100) + "%)",
            J + 2,
            M + 6.5,
          ),
          o.setFont("helvetica", "bold"),
          o.text(s(h), 193, M + 6.5, { align: "right" }),
          M + 14`;

const pdfReplacement = `(typeof window.renderHitosPdf === 'function' ? window.renderHitosPdf(o, J, M, s, h, r, t) : (${pdfStr}))`;

if (code.includes(pdfStr)) {
    code = code.replace(pdfStr, pdfReplacement);
    console.log("Successfully replaced PDF block");
} else {
    console.error("Failed to find PDF block");
}

// 4. Inject global logic at the very beginning of the bundle.
const globalLogic = `
window.renderHitosSidebar = function(e, I, D, r, ne, J, a, c, ze, Pe, u, d) {
    if (!e || !e.jsxs) return null;
    const hitos = I.hitosPago || [{ desc: "Anticipo", tipo: "porcentaje", valor: Math.round(r.anticipo * 100) }];
    const total = J / (r.anticipo || 0.6); 
    
    const React = window.React || require('react');
    return e.jsx(window.HitosEditor, { e, I, D, r, ne, J, a, c, ze, Pe, u, d, hitos, total });
};

window.HitosEditor = function(props) {
    const { e, I, D, r, ne, a, u, d } = props;
    const React = require('react');
    const [isEditing, setIsEditing] = React.useState(false);
    
    const hitos = I.hitosPago || [{ desc: "Anticipo", tipo: "porcentaje", valor: Math.round(r.anticipo * 100) }];
    
    // We try to use Ee to get the exact total.
    const eeRes = window.__Ee ? window.__Ee(I.items, r, I.descuento, I.modoCosteo, I.sinIva) : null;
    const total = eeRes ? eeRes.total : (props.J / (r.anticipo || 0.6) || 1);
    
    const calculateAmount = (hito) => {
        if (hito.tipo === 'monto') return parseFloat(hito.valor) || 0;
        return Math.round((parseFloat(hito.valor) || 0) / 100 * total);
    };
    
    if (isEditing) {
        return e.jsxs("div", {
            style: { background: a.sb, padding: "12px", borderRadius: 8, marginBottom: 14, border: "1px solid #10b981" },
            children: [
                e.jsx("div", { style: { fontWeight: "bold", marginBottom: "8px", color: a.text, fontSize: 13 }, children: "Plan de Pagos (Hitos)" }),
                ...hitos.map((hito, idx) => {
                    return e.jsxs("div", {
                        style: { display: "flex", gap: "6px", marginBottom: "8px", alignItems: "center" },
                        children: [
                            e.jsx("input", {
                                value: hito.desc,
                                placeholder: "Descripción",
                                onChange: (ev) => {
                                    const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].desc = ev.target.value;
                                    D(Q => u(d({}, Q), { hitosPago: nh }));
                                },
                                style: { flex: 1, padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
                            }),
                            e.jsx("select", {
                                value: hito.tipo,
                                onChange: (ev) => {
                                    const nh = JSON.parse(JSON.stringify(hitos)); nh[idx].tipo = ev.target.value;
                                    D(Q => u(d({}, Q), { hitosPago: nh }));
                                },
                                style: { padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text },
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
                                style: { width: "70px", padding: "6px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
                            }),
                            e.jsx("button", {
                                onClick: () => {
                                    const nh = hitos.filter((_, i) => i !== idx);
                                    D(Q => u(d({}, Q), { hitosPago: nh }));
                                },
                                style: { background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "6px 10px", fontWeight: "bold" },
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
                e.jsx("span", { style: { fontSize: 13, color: a.muted }, children: hito.desc + (hito.tipo === 'porcentaje' ? ' (' + hito.valor + '%)' : '') }),
                e.jsx("span", { style: { fontSize: 14, fontWeight: 600, color: "#86efac" }, children: ne(calculateAmount(hito)) })
            ]
        }))
    });
};

window.renderHitosModal = function(e, h, n, ne, j) {
    const hitos = h.hitosPago || [{ desc: "Anticipo", tipo: "porcentaje", valor: Math.round(n.anticipo * 100) }];
    const total = j / (n.anticipo || 0.6);
    const calculateAmount = (hito) => {
        if (hito.tipo === 'monto') return parseFloat(hito.valor) || 0;
        return Math.round((parseFloat(hito.valor) || 0) / 100 * total);
    };

    return e.jsx("div", {
        style: { marginTop: 7 },
        children: hitos.map((hito, idx) => e.jsxs("div", {
            style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                background: "#e8f5e9",
                borderRadius: 6,
                border: "1px solid #c8e6c9",
                marginBottom: 4
            },
            children: [
                e.jsx("span", { style: { fontSize: 14, color: "#2e7d32" }, children: hito.desc + (hito.tipo === 'porcentaje' ? ' (' + hito.valor + '%)' : '') }),
                e.jsx("span", { style: { fontSize: 14, fontWeight: 700, color: "#2e7d32" }, children: ne(calculateAmount(hito)) })
            ]
        }))
    });
};

window.renderHitosPdf = function(o, J, M, s, h, r, t) {
    const hitos = t.hitosPago || [{ desc: "Anticipo", tipo: "porcentaje", valor: Math.round(r.anticipo * 100) }];
    const total = h / (r.anticipo || 0.6) || 0;
    
    const calculateAmount = (hito) => {
        if (hito.tipo === 'monto') return parseFloat(hito.valor) || 0;
        return Math.round((parseFloat(hito.valor) || 0) / 100 * total);
    };

    let curM = M;
    hitos.forEach(hito => {
        o.setFillColor(240, 248, 241);
        o.setDrawColor(180, 220, 185);
        o.setLineWidth(0.3);
        o.roundedRect(J - 2, curM, 196 - J + 2, 10, 2, 2, "FD");
        o.setFont("helvetica", "normal");
        o.setFontSize(9);
        o.setTextColor(30, 110, 65);
        o.text(
            hito.desc + (hito.tipo === 'porcentaje' ? ' (' + hito.valor + '%)' : ''),
            J + 2,
            curM + 6.5
        );
        o.setFont("helvetica", "bold");
        o.text(s(calculateAmount(hito)), 193, curM + 6.5, { align: "right" });
        curM += 12; 
    });
    
    return curM + 2;
};
`;

if (!code.includes('window.renderHitosSidebar = function')) {
    code = code.replace('"use strict";', '"use strict";\n' + globalLogic);
}

// 5. Expose Ee so HitosEditor can use it for exact calculations
const eeRegex = /Ee = \([^\)]+\) => \{/;
if (code.match(eeRegex) && !code.includes('window.__Ee = Ee;')) {
    code = code.replace(/(Ee = \([^\)]+\) => \{[\s\S]*?return \{[^\}]+\};\s*\},)/, '$1 window.__Ee = Ee,');
    console.log("Successfully exposed Ee");
}

fs.writeFileSync(targetPath, code);
console.log("Patch applied successfully!");
