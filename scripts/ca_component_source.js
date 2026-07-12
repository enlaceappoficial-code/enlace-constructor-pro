function CaComponent({comprasAgiles:t,setComprasAgiles:i,cfg:n,setToast:m,setPage:p,budgets:r,apus:l,materiales:o,catalog:s}){
  const [view, setView] = React.useState("buscador");
  const [searchId, setSearchId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState("Todos");

  const a = {
    bg: "#050a10",
    card: "rgba(255,255,255,.05)",
    sb: "rgba(0,0,0,.2)",
    text: "#fff",
    muted: "#8892a4",
    border: "rgba(255,255,255,.1)",
    accent: n?.accentColor || "#f5a020"
  };

  const c = {
    card: { background: a.card, border: `1px solid ${a.border}`, borderRadius: 12, padding: "18px 22px", marginBottom: 16 },
    inp: { background: "rgba(0,0,0,.3)", border: `1px solid ${a.border}`, color: a.text, padding: "8px 12px", borderRadius: 8, outline: "none", width: "100%", boxSizing: "border-box" },
    btn: (type) => ({ background: type === "p" ? a.accent : a.sb, color: type === "p" ? "#000" : a.text, border: type === "p" ? "none" : `1px solid ${a.border}`, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, transition: "all .2s" })
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return m("⚠️ Ingresa un código de Compra Ágil (Ej: 1111-22-LE23)");
    setLoading(true);
    try {
      const res = await fetch(`https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=${searchId.trim()}&ticket=79B6AA40-A970-4164-ADEE-47CF3F378CBA`);
      const data = await res.json();
      if (data && data.Listado && data.Listado.length > 0) {
        setResults(data.Listado);
        m("✅ Búsqueda exitosa");
      } else {
        setResults([]);
        m("⚠️ No se encontró la Compra Ágil");
      }
    } catch (err) {
      m("❌ Error de conexión con Mercado Público");
    }
    setLoading(false);
  };

  const saveToKanban = (item) => {
    if (t.some(x => x.CodigoExterno === item.CodigoExterno)) {
      return m("⚠️ Esta compra ágil ya está guardada");
    }
    const newItem = {
      ...item,
      id: "ca_" + Date.now(),
      estado: "Pendiente",
      fechaGuardado: new Date().toLocaleDateString("es-CL")
    };
    i([newItem, ...t]);
    m("✅ Guardada en Kanban");
  };

  return e.jsxs("div", {
    style: { padding: "24px 28px", maxWidth: 1200, margin: "0 auto" },
    children: [
      e.jsxs("div", {
        style: { marginBottom: 20 },
        children: [
          e.jsx("div", { style: { fontSize: 24, fontWeight: 700, marginBottom: 4 }, children: "🛒 Compras Ágiles" }),
          e.jsx("div", { style: { fontSize: 14, color: a.muted }, children: "Busca y gestiona oportunidades de compra ágil de Mercado Público" })
        ]
      }),
      e.jsx("div", {
        style: { display: "flex", gap: 0, borderBottom: `1px solid ${a.border}`, marginBottom: 20 },
        children: [["buscador", "🔍 Buscador API"], ["kanban", "⬛ Kanban (" + t.length + ")"]].map(([key, label]) => 
          e.jsx("button", {
            key,
            onClick: () => setView(key),
            style: { padding: "10px 18px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: "transparent", color: view === key ? a.accent : a.muted, borderBottom: view === key ? `2px solid ${a.accent}` : "2px solid transparent" },
            children: label
          })
        )
      }),
      view === "buscador" ? e.jsxs("div", {
        children: [
          e.jsxs("div", {
            style: c.card,
            children: [
              e.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: a.accent, marginBottom: 12, textTransform: "uppercase", letterSpacing: ".05em" }, children: "Búsqueda por Código" }),
              e.jsxs("div", {
                style: { display: "flex", gap: 10 },
                children: [
                  e.jsx("input", {
                    style: { ...c.inp, flex: 1, fontSize: 15 },
                    placeholder: "Ej: 1111-22-LE23",
                    value: searchId,
                    onChange: (ev) => setSearchId(ev.target.value),
                    onKeyDown: (ev) => ev.key === "Enter" && handleSearch()
                  }),
                  e.jsx("button", {
                    style: { ...c.btn("p"), fontSize: 15, padding: "10px 24px" },
                    onClick: handleSearch,
                    disabled: loading,
                    children: loading ? "⏳ Buscando..." : "🔍 Buscar"
                  })
                ]
              })
            ]
          }),
          results.length > 0 && e.jsx("div", {
            style: { display: "grid", gap: 16 },
            children: results.map(item => e.jsxs("div", {
              key: item.CodigoExterno,
              style: { ...c.card, display: "flex", flexDirection: "column", gap: 12 },
              children: [
                e.jsxs("div", {
                  style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsxs("div", { style: { fontSize: 16, fontWeight: 700, color: a.accent }, children: [item.CodigoExterno, " — ", item.Nombre] }),
                        e.jsx("div", { style: { fontSize: 13, color: a.text, marginTop: 4 }, children: item.Comprador?.NombreOrganismo })
                      ]
                    }),
                    e.jsx("button", {
                      style: { ...c.btn("s"), fontSize: 12 },
                      onClick: () => saveToKanban(item),
                      children: "📌 Guardar"
                    })
                  ]
                }),
                e.jsx("div", { style: { fontSize: 12, color: a.muted, lineHeight: 1.6 }, children: item.Descripcion }),
                e.jsxs("div", {
                  style: { display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" },
                  children: [
                    e.jsxs("span", { style: { fontSize: 12, color: a.muted }, children: ["📅 Cierre: ", e.jsx("strong", { style: { color: a.text }, children: item.FechaCierre ? new Date(item.FechaCierre).toLocaleDateString("es-CL") : "N/A" })] }),
                    e.jsxs("span", { style: { fontSize: 12, color: a.muted }, children: ["💰 Monto Est.: ", e.jsx("strong", { style: { color: a.text }, children: item.MontoEstimado ? `$${item.MontoEstimado.toLocaleString("es-CL")}` : "No definido" })] })
                  ]
                })
              ]
            }))
          })
        ]
      }) : e.jsxs("div", {
        children: [
          e.jsxs("div", {
            style: { display: "flex", gap: 10, marginBottom: 16 },
            children: ["Todos", "Pendiente", "En progreso", "Adjudicado", "Rechazado"].map(status => 
              e.jsx("button", {
                key: status,
                onClick: () => setFilterStatus(status),
                style: { ...c.btn(filterStatus === status ? "p" : "s"), padding: "6px 14px", fontSize: 12, borderRadius: 20 },
                children: status
              })
            )
          }),
          e.jsx("div", {
            style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
            children: t.filter(x => filterStatus === "Todos" || x.estado === filterStatus).map(item => e.jsxs("div", {
              key: item.id,
              style: { ...c.card, marginBottom: 0 },
              children: [
                e.jsxs("div", {
                  style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
                  children: [
                    e.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: a.accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: item.CodigoExterno }),
                    e.jsxs("select", {
                      value: item.estado,
                      onChange: (ev) => i(t.map(x => x.id === item.id ? { ...x, estado: ev.target.value } : x)),
                      style: { ...c.inp, padding: "2px 6px", fontSize: 11, width: "auto", background: item.estado === "Adjudicado" ? "rgba(74, 222, 128, 0.2)" : a.sb, color: item.estado === "Adjudicado" ? "#4ade80" : a.text, border: "none" },
                      children: [
                        e.jsx("option", { value: "Pendiente", children: "Pendiente" }),
                        e.jsx("option", { value: "En progreso", children: "En progreso" }),
                        e.jsx("option", { value: "Adjudicado", children: "Adjudicado" }),
                        e.jsx("option", { value: "Rechazado", children: "Rechazado" })
                      ]
                    })
                  ]
                }),
                e.jsx("div", { style: { fontSize: 13, fontWeight: 600, color: a.text, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }, children: item.Nombre }),
                e.jsx("div", { style: { fontSize: 11, color: a.muted, marginBottom: 12 }, children: item.Comprador?.NombreOrganismo }),
                e.jsxs("div", {
                  style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${a.border}`, paddingTop: 10 },
                  children: [
                    e.jsxs("div", { style: { fontSize: 11, color: a.muted }, children: ["📅 Cierre: ", item.FechaCierre ? new Date(item.FechaCierre).toLocaleDateString("es-CL") : "-"] }),
                    e.jsx("button", {
                      style: { ...c.btn("d"), padding: "4px 8px", fontSize: 11, background: "transparent", border: "none", color: "#f87171" },
                      onClick: () => {
                        if (confirm("¿Eliminar esta oportunidad?")) {
                          i(t.filter(x => x.id !== item.id));
                        }
                      },
                      children: "🗑️ Eliminar"
                    })
                  ]
                })
              ]
            }))
          })
        ]
      })
    ]
  });
}
