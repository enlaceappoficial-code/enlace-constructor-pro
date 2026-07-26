/*
 * Plantillas de presupuesto
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 31999-32220 ===== */
  function Kf({ budget: t, onSave: i, onClose: r }) {
    const [n, l] = V(t.descripcion || "");
    return e.jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.85)",
        zIndex: 6e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      },
      onClick: r,
      children: e.jsxs("div", {
        style: {
          background: a.card,
          border: `1px solid ${a.border}`,
          borderRadius: 14,
          padding: "24px",
          maxWidth: 440,
          width: "100%",
        },
        onClick: (o) => o.stopPropagation(),
        children: [
          e.jsx("div", {
            style: { fontSize: 17, fontWeight: 700, marginBottom: 4 },
            children: "📌 Guardar como plantilla",
          }),
          e.jsx("div", {
            style: { fontSize: 13, color: a.muted, marginBottom: 18 },
            children:
              "Esta plantilla estará disponible al crear nuevos presupuestos. Se guardarán las partidas con sus cantidades y unidades.",
          }),
          e.jsx("div", {
            style: {
              marginBottom: 8,
              fontSize: 12,
              color: a.muted,
              fontWeight: 700,
            },
            children: "NOMBRE DE LA PLANTILLA",
          }),
          e.jsx("input", {
            style: u(d({}, c.inp), {
              width: "100%",
              marginBottom: 12,
              fontSize: 14,
            }),
            value: n,
            onChange: (o) => l(o.target.value),
            placeholder: "Ej: Remodelación baño tipo, Casa 60m² estándar…",
            autoFocus: !0,
          }),
          e.jsxs("div", {
            style: {
              background: a.sb,
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              border: `1px solid ${a.border}`,
            },
            children: [
              e.jsxs("div", {
                style: {
                  fontSize: 12,
                  fontWeight: 700,
                  color: a.accent,
                  marginBottom: 6,
                },
                children: [t.items.length, " partidas incluidas:"],
              }),
              e.jsxs("div", {
                style: { maxHeight: 120, overflowY: "auto" },
                children: [
                  t.items
                    .slice(0, 8)
                    .map((o, s) =>
                      e.jsxs(
                        "div",
                        {
                          style: {
                            fontSize: 11,
                            color: a.muted,
                            marginBottom: 2,
                          },
                          children: [
                            "• ",
                            o.desc,
                            " — ",
                            o.cant,
                            " ",
                            o.unidad,
                          ],
                        },
                        s,
                      ),
                    ),
                  t.items.length > 8 &&
                    e.jsxs("div", {
                      style: { fontSize: 11, color: a.muted },
                      children: ["…y ", t.items.length - 8, " más"],
                    }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            style: { display: "flex", gap: 8 },
            children: [
              e.jsx("button", {
                style: u(d({}, c.btn("p")), {
                  flex: 1,
                  padding: "10px",
                  fontWeight: 700,
                }),
                disabled: !n.trim(),
                onClick: () => n.trim() && i(n.trim()),
                children: "📌 Guardar plantilla",
              }),
              e.jsx("button", {
                style: u(d({}, c.btn("s")), { padding: "10px 16px" }),
                onClick: r,
                children: "Cancelar",
              }),
            ],
          }),
        ],
      }),
    });
  }
  function Zf({ onSelect: t, onClose: i, plantillasUser: r, onDeleteUser: n }) {
    const [l, o] = V(null),
      [s, m] = V(r && r.length > 0 ? "user" : "std");
    var p = Xf,
      C = s === "user" ? r : p;
    return e.jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.85)",
        zIndex: 6e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      },
      onClick: i,
      children: e.jsxs("div", {
        style: {
          background: a.card,
          border: `1px solid ${a.border}`,
          borderRadius: 14,
          padding: "22px 24px",
          maxWidth: 700,
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
        },
        onClick: (b) => b.stopPropagation(),
        children: [
          e.jsx("div", {
            style: { fontSize: 17, fontWeight: 700, marginBottom: 4 },
            children: "📋 Usar plantilla",
          }),
          e.jsx("div", {
            style: { fontSize: 13, color: a.muted, marginBottom: 14 },
            children:
              "Carga partidas pre-configuradas. Podrás editarlas libremente.",
          }),
          e.jsx("div", {
            style: {
              display: "flex",
              gap: 0,
              marginBottom: 14,
              borderBottom: `1px solid ${a.border}`,
            },
            children: [
              [
                "user",
                "📌 Mis plantillas" +
                  (r && r.length > 0 ? " (" + r.length + ")" : ""),
              ],
              ["std", "🏗️ Tipos de obra"],
            ].map(([b, h]) =>
              e.jsx(
                "button",
                {
                  onClick: () => {
                    (m(b), o(null));
                  },
                  style: {
                    padding: "8px 16px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    background: "transparent",
                    color: s === b ? a.accent : a.muted,
                    borderBottom:
                      s === b
                        ? `2px solid ${a.accent}`
                        : "2px solid transparent",
                  },
                  children: h,
                },
                b,
              ),
            ),
          }),
          s === "user" &&
            (!r || r.length === 0) &&
            e.jsxs("div", {
              style: {
                textAlign: "center",
                padding: "30px 20px",
                color: a.muted,
              },
              children: [
                e.jsx("div", {
                  style: { fontSize: 28, marginBottom: 10 },
                  children: "📌",
