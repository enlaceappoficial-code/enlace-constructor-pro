const fs = require('fs');

const file = 'src/assets/index.js';
let content = fs.readFileSync(file, 'utf8');

// The new CaComponent implementation
const newComponent = `window.CompraAgilComponent = function CaComponent({comprasAgiles:t,setComprasAgiles:i,cfg:n,setToast:m}){
  const [view, setView] = V("kanban");
  const [searchId, setSearchId] = V("");
  const [loading, setLoading] = V(false);
  const [results, setResults] = V([]);

  const a = {
    bg: "#050a10",
    card: "rgba(255,255,255,.05)",
    sb: "rgba(0,0,0,.2)",
    text: "#fff",
    muted: "#8892a4",
    border: "rgba(255,255,255,.1)",
    accent: n?.accentColor || "#f5a020"
  };

  const estados = [
    { id: "Pendiente", color: "#8892a4" },
    { id: "En Estudio", color: "#f5a020" },
    { id: "Postulada", color: "#60a5fa" },
    { id: "Adjudicada", color: "#34d399" },
    { id: "Perdida", color: "#f87171" }
  ];

  const getStatusColor = (st) => estados.find(e => e.id === st)?.color || a.muted;

  const c = {
    card: { background: a.card, border: \`1px solid \${a.border}\`, borderRadius: 12, padding: "18px 22px", marginBottom: 16 },
    inp: { background: "rgba(0,0,0,.3)", border: \`1px solid \${a.border}\`, color: a.text, padding: "10px 14px", borderRadius: 8, outline: "none", width: "100%", boxSizing: "border-box" },
    btn: (type) => ({ background: type === "p" ? a.accent : a.sb, color: type === "p" ? "#000" : a.text, border: type === "p" ? "none" : \`1px solid \${a.border}\`, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, transition: "all .2s" }),
    tag: (bg, fg) => ({ background: bg, color: fg, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "inline-block" })
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return m("⚠️ Ingresa un código (Ej: 1111-22-LE23)");
    setLoading(true);
    try {
      const res = await fetch(\`https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=\${searchId.trim()}&ticket=79B6AA40-A970-4164-ADEE-47CF3F378CBA\`);
      const data = await res.json();
      if (data && data.Listado && data.Listado.length > 0) {
        setResults(data.Listado);
        m("✅ Búsqueda exitosa");
      } else {
        setResults([]);
        m("⚠️ No se encontró resultados");
      }
    } catch (err) {
      m("❌ Error de conexión con Mercado Público");
    }
    setLoading(false);
  };

  const saveToKanban = (item) => {
    if (t.some(x => x.CodigoExterno === item.CodigoExterno)) {
      return m("⚠️ Esta oportunidad ya está en tu Kanban");
    }
    const newItem = { ...item, id: "ca_" + Date.now(), estado: "Pendiente", fechaGuardado: new Date().toLocaleDateString("es-CL") };
    i([newItem, ...t]);
    m("✅ Agregado al Kanban");
  };

  const changeState = (id, newState) => {
    i(t.map(x => x.id === id ? { ...x, estado: newState } : x));
  };

  const deleteItem = (id) => {
    if (confirm("¿Eliminar esta licitación de tu tablero?")) {
      i(t.filter(x => x.id !== id));
    }
  };

  return e.jsxs("div", {
    style: { padding: "24px 32px", maxWidth: 1400, margin: "0 auto" },
    children: [
      e.jsxs("div", {
        style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("div", { style: { fontSize: 26, fontWeight: 700, marginBottom: 6 }, children: "🏢 Compra Ágil y Licitaciones" }),
              e.jsx("div", { style: { fontSize: 14, color: a.muted }, children: "Gestiona tus postulaciones a Mercado Público" })
            ]
          }),
          e.jsx("a", {
            href: "https://www.mercadopublico.cl/Home",
            target: "_blank",
            style: { ...c.btn("s"), textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 8 },
            children: "🔗 Abrir Portal Oficial"
          })
        ]
      }),
      e.jsx("div", {
        style: { display: "flex", gap: 8, borderBottom: \`1px solid \${a.border}\`, marginBottom: 24, paddingBottom: 16 },
        children: [
          { k: "kanban", l: \`📋 Tablero Kanban (\${t.length})\` },
          { k: "buscador", l: "🔍 Buscar Nueva Oportunidad" }
        ].map(({k, l}) => 
          e.jsx("button", {
            key: k, onClick: () => setView(k),
            style: { padding: "10px 20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, borderRadius: 8, background: view === k ? a.accent + "22" : "transparent", color: view === k ? a.accent : a.muted, transition: "all .2s" },
            children: l
          })
        )
      }),
      view === "buscador" ? e.jsxs("div", {
        children: [
          e.jsxs("div", {
            style: { ...c.card, background: a.sb, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", textAlign: "center", marginBottom: 24 },
            children: [
              e.jsx("div", { style: { fontSize: 18, fontWeight: 700, marginBottom: 12 }, children: "Importar Licitación por Código" }),
              e.jsx("div", { style: { fontSize: 14, color: a.muted, marginBottom: 24, maxWidth: 400 }, children: "Ingresa el código (Ej: 1111-22-LE23) para importar los datos desde la API oficial." }),
              e.jsxs("div", {
                style: { display: "flex", gap: 12, width: "100%", maxWidth: 500 },
                children: [
                  e.jsx("input", { style: { ...c.inp, fontSize: 16 }, placeholder: "Código de Licitación...", value: searchId, onChange: (ev) => setSearchId(ev.target.value), onKeyDown: (ev) => ev.key === "Enter" && handleSearch() }),
                  e.jsx("button", { style: { ...c.btn("p"), fontSize: 15, padding: "12px 28px" }, onClick: handleSearch, disabled: loading, children: loading ? "⏳" : "Buscar" })
                ]
              })
            ]
          }),
          results.length > 0 && e.jsx("div", {
            style: { display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))" },
            children: results.map(item => e.jsxs("div", {
              key: item.CodigoExterno,
              style: { ...c.card, display: "flex", flexDirection: "column", justifyContent: "space-between" },
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }, children: [
                      e.jsxs("div", { style: { fontSize: 18, fontWeight: 700, color: a.text }, children: [item.CodigoExterno] }),
                      e.jsx("div", { style: c.tag(a.sb, a.accent), children: item.Estado || "Publicada" })
                    ]}),
                    e.jsx("div", { style: { fontSize: 15, fontWeight: 600, color: a.accent, marginBottom: 6 }, children: item.Nombre }),
                    e.jsx("div", { style: { fontSize: 13, color: a.mutedL, marginBottom: 16 }, children: item.Comprador?.NombreOrganismo }),
                    e.jsx("div", { style: { fontSize: 13, color: a.muted, lineHeight: 1.5, marginBottom: 20 }, children: item.Descripcion }),
                  ]
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", { style: { display: "flex", justifyContent: "space-between", background: a.sb, padding: "10px 14px", borderRadius: 8, marginBottom: 16 }, children: [
                      e.jsxs("div", { children: [ e.jsx("div", { style: { fontSize: 11, color: a.muted, textTransform: "uppercase" }, children: "Cierre" }), e.jsx("div", { style: { fontSize: 14, fontWeight: 600, color: a.text }, children: item.FechaCierre ? new Date(item.FechaCierre).toLocaleDateString("es-CL") : "N/A" }) ] }),
                      e.jsxs("div", { style: { textAlign: "right" }, children: [ e.jsx("div", { style: { fontSize: 11, color: a.muted, textTransform: "uppercase" }, children: "Monto Est." }), e.jsx("div", { style: { fontSize: 14, fontWeight: 600, color: "#34d399" }, children: item.MontoEstimado ? \`\${item.MontoEstimado.toLocaleString("es-CL")}\` : "Sin definir" }) ] })
                    ]}),
                    e.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
                      e.jsx("button", { style: { ...c.btn("p"), flex: 1 }, onClick: () => saveToKanban(item), children: "📌 Añadir a Kanban" }),
                      e.jsx("a", { href: \`https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs=\${item.CodigoExterno}\`, target: "_blank", style: { ...c.btn("s"), flex: 1, textAlign: "center", textDecoration: "none" }, children: "Ver en MP ↗" })
                    ]})
                  ]
                })
              ]
            }))
          })
        ]
      }) : e.jsxs("div", {
        style: { display: "flex", gap: 16, overflowX: "auto", paddingBottom: 20 },
        children: estados.map(col => {
          const colItems = t.filter(x => (x.estado || "Pendiente") === col.id);
          return e.jsxs("div", {
            key: col.id,
            style: { minWidth: 300, flex: 1, background: "rgba(0,0,0,.15)", border: \`1px solid \${a.border}\`, borderRadius: 12, padding: "16px" },
            children: [
              e.jsxs("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
                children: [
                  e.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                    e.jsx("div", { style: { width: 12, height: 12, borderRadius: "50%", background: col.color } }),
                    e.jsx("span", { style: { fontSize: 15, fontWeight: 700, color: a.text }, children: col.id })
                  ]}),
                  e.jsx("span", { style: { background: a.sb, padding: "2px 8px", borderRadius: 12, fontSize: 12, color: a.muted }, children: colItems.length })
                ]
              }),
              e.jsx("div", {
                style: { display: "flex", flexDirection: "column", gap: 12 },
                children: colItems.map(it => e.jsxs("div", {
                  key: it.id,
                  style: { background: a.card, border: \`1px solid \${col.color}44\`, borderRadius: 10, padding: 14 },
                  children: [
                    e.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }, children: [
                      e.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: a.accent }, children: it.CodigoExterno }),
                      e.jsx("button", { style: { background: "transparent", border: "none", color: a.muted, cursor: "pointer", fontSize: 16 }, onClick: () => deleteItem(it.id), title: "Eliminar", children: "×" })
                    ]}),
                    e.jsx("div", { style: { fontSize: 14, fontWeight: 600, color: a.text, marginBottom: 8, lineHeight: 1.3 }, children: it.Nombre }),
                    e.jsx("div", { style: { fontSize: 12, color: a.muted, marginBottom: 12 }, children: it.Comprador?.NombreOrganismo }),
                    e.jsxs("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }, children: [
                      e.jsx("span", { style: { fontSize: 11, background: a.sb, color: a.muted, padding: "2px 6px", borderRadius: 4 }, children: "Cierre: " + (it.FechaCierre ? new Date(it.FechaCierre).toLocaleDateString("es-CL") : "-") }),
                      e.jsx("span", { style: { fontSize: 11, background: "rgba(52, 211, 153, 0.1)", color: "#34d399", padding: "2px 6px", borderRadius: 4 }, children: it.MontoEstimado ? \`$\${it.MontoEstimado.toLocaleString("es-CL")}\` : "-" })
                    ]}),
                    e.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
                      e.jsx("select", {
                        value: it.estado || "Pendiente",
                        onChange: (ev) => changeState(it.id, ev.target.value),
                        style: { flex: 1, background: a.sb, border: \`1px solid \${col.color}66\`, color: a.text, fontSize: 12, padding: "6px 8px", borderRadius: 6, cursor: "pointer", outline: "none" },
                        children: estados.map(es => e.jsx("option", { value: es.id, children: es.id }, es.id))
                      }),
                      e.jsx("a", { href: \`https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?qs=\${it.CodigoExterno}\`, target: "_blank", style: { ...c.btn("s"), padding: "6px 10px", fontSize: 12, textDecoration: "none" }, title: "Abrir en Mercado Público", children: "↗" })
                    ]})
                  ]
                }))
              })
            ]
          });
        })
      })
    ]
  });
};`;

// Replace everything from window.CompraAgilComponent = to the end of that assignment.
const startIdx = content.indexOf('window.CompraAgilComponent = function CaComponent');
if (startIdx > -1) {
  const before = content.substring(0, startIdx);
  // Find the end by looking for `_n.createRoot(document.getElementById("root")).render(e.jsx(Jg,{}))})();`
  const endIdx = content.indexOf('_n.createRoot', startIdx);
  const after = content.substring(endIdx);
  
  fs.writeFileSync(file, before + newComponent + '\n' + after, 'utf8');
  console.log('UI redesigned successfully.');
} else {
  console.log('Could not find CompraAgilComponent.');
}
