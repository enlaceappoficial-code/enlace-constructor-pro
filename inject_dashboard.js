const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const startTag = 'p === "detalle" &&';
const endTag = '  async function ha(t, i, r) {';

const startIndex = c.indexOf(startTag);
const endIndex = c.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find start or end bounds.", startIndex, endIndex);
  process.exit(1);
}

const replacement = `p === "detalle" &&
          e.jsxs("div", {
            style: { display: "flex", flexDirection: "column", gap: 16 },
            children: [
              e.jsxs("div", {
                style: u(d({}, c.card), { borderLeft: "4px solid " + j.c }),
                children: [
                  e.jsxs("div", {
                    style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("div", { style: { fontSize: 20, fontWeight: 800, color: a.accent, marginBottom: 2 }, children: t.idMP }),
                          e.jsx("div", { style: { fontSize: 16, fontWeight: 700, color: a.text, marginBottom: 6 }, children: t.nombreObra }),
                          e.jsx("div", { style: { fontSize: 14, color: a.muted }, children: t.organismo + " · " + t.region }),
                        ]
                      }),
                      e.jsxs("div", {
                        style: { display: "flex", gap: 6 },
                        children: [
                          e.jsx("button", { style: u(d({}, c.btn("g")), { padding: "6px 14px" }), onClick: () => i(t), children: "✏ Editar" }),
                          e.jsx("button", { style: u(d({}, c.btn("p")), { padding: "6px 10px" }), onClick: () => n(t), title: "Duplicar" , children: "⧉" }),
                          e.jsx("button", { style: u(d({}, c.btn("d")), { padding: "6px 10px" }), onClick: () => r(t.id), children: "✕" }),
                        ]
                      })
                    ]
                  }),
                  e.jsx("div", {
                    style: { display: "flex", gap: 12, padding: "12px 0", borderTop: "1px solid " + a.border, borderBottom: "1px solid " + a.border, marginBottom: 12 },
                    children: [
                      { label: "Publicación", val: t.fechaPublicacion, icon: "📅" },
                      { label: "Preguntas", val: t.fechaPreguntas, icon: "❓" },
                      { label: "Cierre", val: t.fechaCierre, icon: "⏳" },
                      { label: "Adjudicación", val: t.fechaAdjudicacion, icon: "🏆" }
                    ].map(f => e.jsxs("div", {
                       key: f.label,
                       style: { flex: 1, background: a.sb, padding: "10px", borderRadius: 8, textAlign: "center" },
                       children: [
                         e.jsx("div", { style: { fontSize: 16, marginBottom: 4 }, children: f.icon }),
                         e.jsx("div", { style: { fontSize: 10, color: a.muted, textTransform: "uppercase", marginBottom: 2 }, children: f.label }),
                         e.jsx("div", { style: { fontSize: 12, fontWeight: 600, color: a.text }, children: f.val || "—" })
                       ]
                    }))
                  }),
                  e.jsxs("div", {
                    style: { display: "flex", alignItems: "center", gap: 12, marginTop: 12 },
                    children: [
                      e.jsx("span", { style: { fontSize: 13, fontWeight: 600, color: a.muted }, children: "Estado Actual:" }),
                      e.jsx("select", {
                        value: t.estado || "borrador",
                        onChange: (ev) => i(d({}, t, { estado: ev.target.value })),
                        style: u(d({}, c.input), { width: "160px", padding: "6px 10px", fontSize: 13, fontWeight: 600, color: j.c, borderColor: j.c }),
                        children: Object.keys(si).map(k => e.jsx("option", { value: k, key: k }, si[k].label))
                      }),
                      t.estado !== "postulada" && e.jsx("button", {
                        onClick: () => i(d({}, t, { estado: "postulada" })),
                        style: u(d({}, c.btn("s")), { background: si.postulada.c, color: "#fff", border: "none", padding: "6px 14px", fontWeight: 700 }),
                        children: "🚀 Marcar como Postulada"
                      })
                    ]
                  })
                ]
              }),
              
              e.jsxs("div", {
                style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
                children: [
                  e.jsxs("div", {
                    style: u(d({}, c.card), { display: "flex", flexDirection: "column", gap: 10 }),
                    children: [
                      e.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: a.text, borderBottom: "1px solid " + a.border, paddingBottom: 6 }, children: "📑 Documentos y Acciones" }),
                      e.jsx("button", {
                        onClick: () => setShowContextoMP(!0),
                        style: u(d({}, c.btn("s")), { background: a.accent + "15", color: a.accent, border: "1px solid " + a.accent, padding: "10px", justifyContent: "flex-start" }),
                        children: "📂 Ver Bases / Anexos Mercado Público"
                      }),
                      e.jsx("button", {
                        onClick: () => C("oferta"),
                        style: u(d({}, c.btn("p")), { padding: "10px", justifyContent: "flex-start", marginTop: 4 }),
                        children: "🏗️ Ir a Construir Oferta"
                      }),
                      e.jsxs("div", {
                        style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 },
                        children: [
                          e.jsx("button", { onClick: () => ha(t, "tecnica", l), style: u(d({}, c.btn("s")), { fontSize: 11, padding: "5px 10px", flex: 1 }), children: "⬇ Of. Técnica" }),
                          e.jsx("button", { onClick: () => ha(t, "economica", l), style: u(d({}, c.btn("s")), { fontSize: 11, padding: "5px 10px", flex: 1 }), children: "⬇ Of. Económica" }),
                          e.jsx("button", { onClick: () => ha(t, "carta", l), style: u(d({}, c.btn("s")), { fontSize: 11, padding: "5px 10px", flex: 1 }), children: "⬇ Carta" }),
                          e.jsx("button", { onClick: () => Wp(t, l), style: u(d({}, c.btn("s")), { fontSize: 11, padding: "5px 10px", flex: 1 }), children: "📊 Excel MP" })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    style: c.card,
                    children: [
                      e.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: a.text, borderBottom: "1px solid " + a.border, paddingBottom: 6, marginBottom: 12 }, children: "💰 Resumen Financiero" }),
                      e.jsxs("div", {
                        style: { display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "8px", background: a.sb, borderRadius: 6 },
                        children: [ e.jsx("span", { style: { color: a.muted, fontSize: 13 }, children: "Presupuesto Estimado MP:" }), e.jsx("span", { style: { fontWeight: 700, color: a.text }, children: t.montoEstimado ? ne(parseFloat(t.montoEstimado)) : "No informado" }) ]
                      }),
                      e.jsxs("div", {
                        style: { display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "8px", background: a.sb, borderRadius: 6 },
                        children: [ e.jsx("span", { style: { color: a.muted, fontSize: 13 }, children: "Costo Neto (Análisis):" }), e.jsx("span", { style: { fontWeight: 600, color: a.text }, children: ne(b) }) ]
                      }),
                      e.jsxs("div", {
                        style: { display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "8px", background: a.accent + "20", borderRadius: 6 },
                        children: [ e.jsx("span", { style: { color: a.accent, fontSize: 13, fontWeight: 700 }, children: "Total Oferta (con IVA):" }), e.jsx("span", { style: { fontWeight: 800, color: a.accent, fontSize: 15 }, children: ne(h) }) ]
                      }),
                      e.jsx("div", { style: { marginTop: 12, fontSize: 12, color: a.muted, textAlign: "center" }, children: "Ítems en la oferta: " + (t.items || []).length })
                    ]
                  })
                ]
              }),
              e.jsx(Op, { lic: t })
            ]
          }),
      ],
    });
  }
`;

const newC = c.substring(0, startIndex) + replacement + c.substring(endIndex);

fs.writeFileSync('src/assets/index.js', newC, 'utf8');
console.log("Replaced successfully!");
