/*
 * Ajuste de materiales por partida
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 30134-30480 ===== */
  function Yf({
    catItem: t,
    apu: i,
    materiales: r,
    setMateriales: setMat,
    cantItem: n,
    onConfirm: l,
    onSkip: o,
    customData: cd,
    cfg: cfgModal,
  }) {
    const [s, m] = V(
        cd && cd._customApuMaterials ? cd._customApuMaterials :
        i.materiales.map((y) => {
          var P = r.find((A) => A.id === y.materialId);
          return u(d({}, y), { _activo: !0, _mat: P });
        }),
      ),
      [p, C] = V(cd && cd._customMO !== undefined ? cd._customMO : i.pctMO),
      [b, h] = V(cd && cd._customGG !== undefined ? cd._customGG : i.pctGG),
      [j, F] = V(cd && cd._customUtil !== undefined ? cd._customUtil : i.pctUtilidad),
      [g, z] = V(cd && cd._rendimiento !== undefined ? cd._rendimiento : i.rendimiento || 0),
      [B, w] = V(cd && cd._dotacion !== undefined ? cd._dotacion : i.dotacion || 1),
      [showManualMat, setShowManualMat] = V(false),
      [manualName, setManualName] = V(""),
      [manualUnit, setManualUnit] = V("und"),
      [manualPrice, setManualPrice] = V("0"),
      [manualSave, setManualSave] = V(true),
      [materialSearch, setMaterialSearch] = V(""),
      [materialPickerOpen, setMaterialPickerOpen] = V(false);
    var materialesActivos = s.filter((y) => y._activo && y._mat).map((y) => ({ materialId: y.materialId, cantidad: y.cantidad })),
      calculoModal = li(u(d({}, i), { materiales: materialesActivos, pctMO: p, pctGG: b, pctUtilidad: j, rendimiento: g, dotacion: B }), r, cfgModal),
      v = calculoModal.matTotal,
      x = calculoModal.moTotal,
      f = calculoModal.ggTotal,
      I = v + x + f,
      D = calculoModal.utilTotal,
      k = calculoModal.precioFinal,
      R = (y) =>
        m((P) =>
          P.map((A, S) => (S === y ? u(d({}, A), { _activo: !A._activo }) : A)),
        ),
      K = (y, P) =>
        m((A) => A.map((S, O) => (O === y ? u(d({}, S), { cantidad: P }) : S)));
    var normalizeMaterialSearch = (value) =>
        String(value || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, " ")
          .trim(),
      materialSearchTerms = normalizeMaterialSearch(materialSearch).split(/\s+/).filter(Boolean),
      filteredMaterials = materialSearchTerms.length
        ? r.filter((mat) => {
            var searchable = normalizeMaterialSearch([mat.nombre, mat.cat, mat.unidad].join(" "));
            return materialSearchTerms.every((term) => searchable.includes(term));
          })
        : r;
    var selectExtraMaterial = (newId) => {
      if (!newId) return;
      if (s.some((line) => line.materialId === newId)) {
        m(s.map((line) => line.materialId === newId ? u(d({}, line), { _activo: true }) : line));
      } else {
        var newMat = r.find((line) => line.id === newId);
        if (newMat) m([...s, { materialId: newId, cantidad: 1, _activo: true, _mat: newMat }]);
      }
      setMaterialSearch("");
      setMaterialPickerOpen(false);
    };
    return e.jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.92)",
        zIndex: 5e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      },
      children: e.jsxs("div", {
        style: {
          background: a.card,
          border: `1px solid ${a.border}`,
          borderRadius: 16,
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        children: [
          e.jsxs("div", {
            style: {
              padding: "18px 22px",
              borderBottom: `1px solid ${a.border}`,
              position: "relative",
            },
            children: [
              e.jsx("button", {
                onClick: o,
                style: {
                  position: "absolute",
                  top: 14,
                  right: 16,
                  background: "transparent",
                  border: "none",
                  fontSize: 20,
                  color: a.muted,
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "2px 6px",
                  borderRadius: 6,
                },
                title: "Cerrar sin guardar",
                children: "✕",
              }),
              e.jsx("div", {
                style: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
                children: "🔧 Ajustar materiales de la partida",
              }),
              e.jsxs("div", {
                style: { fontSize: 14, color: a.muted },
                children: [
                  e.jsx("span", {
                    style: { color: a.accent, fontWeight: 600 },
                    children: t ? t.desc : i.nombre,
                  }),
                  " · ",
                  n,
                  " ",
                  t ? t.unidad : i.unidad,
                ],
              }),
              e.jsx("div", {
                style: { fontSize: 13, color: a.muted, marginTop: 4 },
                children:
                  "Activa, desactiva o ajusta cantidades. El precio se recalcula automáticamente.",
              }),
            ],
          }),
          e.jsxs("div", {
            style: { overflowY: "auto", flex: 1, padding: "16px 22px" },
            children: [
              e.jsx("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                },
                children: [
                  ["MO (%)", p, C, "#34d399"],
                  ["GG (%)", b, h, "#c084fc"],
                  ["Utilidad (%)", j, F, a.accent],
                ].map(([y, P, A, S]) =>
                  e.jsxs(
                    "div",
                    {
                      style: {
                        background: a.sb,
                        borderRadius: 8,
                        padding: "8px 12px",
                      },
                      children: [
                        e.jsx("div", {
                          style: {
                            fontSize: 11,
                            color: a.muted,
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: 5,
                          },
                          children: y,
                        }),
                        e.jsx("input", {
                          style: u(d({}, c.inp), {
                            fontSize: 16,
                            fontWeight: 700,
                            color: S,
                            padding: "4px 8px",
                          }),
                          type: "number",
                          value: P,
                          onChange: (O) => A(O.target.value),
                          min: "0",
                          max: "100",
                        }),
                      ],
                    },
                    y,
                  ),
                ),
              }),
              e.jsxs("div", {
                style: {
                  fontSize: 11,
                  color: a.muted,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 8,
                },
                children: ["Insumos por ", i.unidad, " de partida"],
              }),
              s.map((y, P) => {
                var A = y._mat;
                if (!A) return null;
                var S =
                  y._activo && parseFloat(y.cantidad) > 0
                    ? A.precio * (parseFloat(y.cantidad) || 0)
                    : 0;
                return e.jsxs(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "28px 1fr 80px 80px 90px",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 8,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: y._activo
                        ? "var(--dark-surface)"
                        : "var(--bg)",
                      border: `1px solid ${y._activo ? a.border : "var(--border)"}`,
                      opacity: y._activo ? 1 : 0.5,
                      transition: "all .15s",
                    },
                    children: [
                      e.jsx("div", {
                        onClick: () => R(P),
                        style: {
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          border: `2px solid ${y._activo ? a.accent : a.border}`,
                          background: y._activo ? a.accent : "transparent",
                          cursor: "pointer",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          color: "#050a10",
                          fontWeight: 700,
                        },
                        children: y._activo ? "✓" : "",
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("div", {
                            style: {
                              fontSize: 13,
                              fontWeight: 500,
                              color: y._activo ? a.text : a.muted,
                            },
                            children: A.nombre,
                          }),
                          e.jsxs("div", {
                            style: { fontSize: 11, color: a.muted },
                            children: [A.unidad, " · ", ne(A.precio), " c/u"],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("div", {
                            style: {
                              fontSize: 10,
                              color: a.muted,
                              marginBottom: 2,
                            },
                            children: "Cant.",
                          }),
                          e.jsx("input", {
                            style: u(d({}, c.inp), {
                              fontSize: 13,
                              padding: "4px 7px",
                              textAlign: "right",
                              opacity: y._activo ? 1 : 0.5,
                            }),
                            type: "number",
                            value: y.cantidad,
                            step: "0.01",
                            min: "0",
                            disabled: !y._activo,
                            onChange: (O) => K(P, O.target.value),
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        style: {
                          fontSize: 12,
                          color: a.muted,
                          textAlign: "center",
                        },
                        children: A.unidad,
                      }),
                      e.jsxs("div", {
                        style: { textAlign: "right" },
                        children: [
                          e.jsx("div", {
                            style: {
                              fontSize: 11,
                              color: a.muted,
                              marginBottom: 2,
                            },
                            children: "Subtotal",
                          }),
                          e.jsx("div", {
                            style: {
                              fontSize: 14,
                              fontWeight: 700,
                              color: S > 0 ? "#60a5fa" : a.muted,
                            },
                            children: ne(Math.round(S)),
                          }),
                        ],
                      }),
                    ],
                  },
                  P,
                );
              }),
              e.jsxs("div", {
                style: {
                  marginTop: 10,
                  padding: "10px 14px",
                  background: "var(--bg)",
                  borderRadius: 8,
                  border: `1px dashed ${a.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10
                },
                children: [
                  e.jsxs("div", {
                    style: { display: "flex", alignItems: "center", gap: 10 },
                    children: [
                      e.jsx("div", {
                        style: { fontSize: 13, fontWeight: 600, color: a.text, whiteSpace: "nowrap" },
                        children: "➕ Agregar extra:"
                      }),
                      e.jsxs("div", {
                        style: { position: "relative", flex: 1, minWidth: 0 },
