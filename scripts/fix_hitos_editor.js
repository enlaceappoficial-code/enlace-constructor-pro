const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/assets/index.js');
let code = fs.readFileSync(targetPath, 'utf8');

const hitosEditorStart = `window.HitosEditor = function(props) {`;
const hitosEditorEnd = `    });\n};`;

const startIndex = code.indexOf(hitosEditorStart);
const endIndex = code.indexOf(hitosEditorEnd, startIndex) + hitosEditorEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
    const newHitosEditor = `window.HitosEditor = function(props) {
    const { e, I, D, r, ne, a, u, d, Re } = props;
    const hitos = I.hitosPago || [{ desc: "Anticipo", tipo: "porcentaje", valor: Math.round(r.anticipo * 100) }];
    
    // We try to use Ee to get the exact total.
    const eeRes = window.__Ee ? window.__Ee(I.items, r, I.descuento, I.modoCosteo, I.sinIva) : null;
    const total = eeRes ? eeRes.total : (props.J / (r.anticipo || 0.6) || 1);
    
    const calculateAmount = (hito) => {
        if (hito.tipo === 'monto') return parseFloat(hito.valor) || 0;
        return Math.round((parseFloat(hito.valor) || 0) / 100 * total);
    };
    
    return e.jsxs("div", {
        style: { background: a.sb, padding: "12px", borderRadius: 8, marginBottom: 14, border: "1px solid " + a.border },
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
                            style: { width: "60px", padding: "4px", fontSize: "12px", borderRadius: "4px", border: "1px solid " + a.border, background: a.bg, color: a.text }
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
                style: { display: "block", width: "100%", padding: "8px", background: "var(--btn-b-color, #3b82f6)", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "13px", marginTop: "4px", fontWeight: "bold" },
                children: "+ Agregar Hito"
            })
        ]
    });
};`;
    
    code = code.substring(0, startIndex) + newHitosEditor + code.substring(endIndex);
    console.log("Successfully replaced window.HitosEditor");
    fs.writeFileSync(targetPath, code);
} else {
    console.log("Could not find window.HitosEditor bounds.");
}
