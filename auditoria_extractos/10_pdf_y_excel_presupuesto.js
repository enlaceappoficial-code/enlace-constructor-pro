/*
 * Carga de librerías, PDF y Excel de presupuesto
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 18359-18450 ===== */
  function zt(t) {
    return new Promise((i, r) => {
      var n = {
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js":
            "jspdf.umd.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js":
            "qrcode.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js":
            "xlsx.full.min.js",
        },
        l = n[t] || t;
      if (document.querySelector(`script[src="${l}"]`)) {
        i();
        return;
      }
      const o = document.createElement("script");
      ((o.src = l),
        (o.onload = i),
        (o.onerror = r),
        document.head.appendChild(o));
    });
  }
  async function zr(t, i, r, n) {
    ((n = n || pt("pdfTplPref", "simple")),
      await zt(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      ));
    const { jsPDF: l } = window.jspdf;
    var o = new l({ orientation: "portrait", unit: "mm", format: "a4" }),
      s = (M) =>
        M
          ? new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              maximumFractionDigits: 0,
            }).format(M)
          : "$0";
    const {
      sub: m,
      iva: p,
      desc: C,
      total: b,
      anticipo: h,
    } = Ee(t.items, r, t.descuento, t.modoCosteo, t.sinIva);
    var j = r.accentColor || "#f5a020",
      F = j.match(/\w\w/g).map((M) => parseInt(M, 16)),
      g = (M) =>
        new Promise((q) => {
          var J = new window.Image();
          ((J.onload = () => q({ w: J.naturalWidth, h: J.naturalHeight })),
            (J.onerror = () => q({ w: 0, h: 0 })),
            (J.src = M));
        }),
      z = async (M, q, J, re) => {
        var Q = r.logoCliente || "";
        if (!Q) return 0;
        try {
          const { w: te, h: fe } = await g(Q);
          if (!te || !fe) return 0;
          var G = Math.min(J / te, re / fe),
            ie = Math.round(te * G * 10) / 10,
            oe = Math.round(fe * G * 10) / 10,
            ce = Q.startsWith("data:image/png") ? "PNG" : "JPEG";
          return (o.addImage(Q, ce, M, q, ie, oe), oe);
        } catch (te) {
          return 0;
        }
      },
      B = (M, q, J, re, Q) => {
        var G = M,
          ie = t.modoCosteo || "completo",
          oe =
            ie === "separado"
              ? [
                  { l: "N°", x: 16, r: !1 },
                  { l: "Descripción", x: 25, r: !1 },
                  { l: "Cant.", x: 118, r: !0 },
                  { l: "Unidad", x: 136, r: !0 },
                  { l: "MO", x: 160, r: !0 },
                  { l: "MAT", x: 178, r: !0 },
                  { l: "Total", x: 194, r: !0 },
                ]
              : [
                  { l: "N°", x: 16, r: !1 },
                  { l: "Descripción", x: 25, r: !1 },
                  { l: "Cant.", x: 126, r: !0 },
                  { l: "Unidad", x: 147, r: !0 },
                  { l: "P.Unit.", x: 170, r: !0 },
                  { l: "Total", x: 194, r: !0 },
                ],
          ce = ie === "separado" ? 118 : 126,
          te = ie === "separado" ? 136 : 147,

/* ===== Líneas originales aproximadas 21328-21400 ===== */
  function Uf({
    budgetId: t,
    budgets: i,
    clients: r,
    cfg: n,
    onClose: l,
    onDownload: o,
  }) {
    var s = i.find((D) => D.id === t);
    if (!s) return null;
    var m = r.find((D) => D.id === s.clienteId) || {};
    const {
      sub: p,
      iva: C,
      desc: b,
      total: h,
      anticipo: j,
    } = Ee(s.items, n, s.descuento, s.modoCosteo, s.sinIva);
    var F = (n && n.version) || "starter",
      g = F === "starter";
    const [z, B] = V(g ? "simple" : pt("pdfTplPref", "simple")),
      [w, v] = V(!1);
    var x = [
        ["simple", "Simple"],
        ["azul", "Azul"],
        ["verde", "Verde"],
        ["naranja", "Naranja"],
        ["gris", "Gris"],
      ],
      f = {
        simple: {
          header: "#1a3a5c",
          accent: "#f5a020",
          total: "#1a3a5c",
          totalText: "#f5a020",
          stripe: "#f8fafc",
        },
        azul: {
          header: "#1e40af",
          accent: "#3b82f6",
          total: "#1e40af",
          totalText: "#93c5fd",
          stripe: "#eff6ff",
        },
        verde: {
          header: "#14532d",
          accent: "#16a34a",
          total: "#14532d",
          totalText: "#86efac",
          stripe: "#f0fdf4",
        },
        naranja: {
          header: "#92400e",
          accent: "#f97316",
          total: "#92400e",
          totalText: "#fed7aa",
          stripe: "#fff7ed",
        },
        gris: {
          header: "#1f2937",
          accent: "#6b7280",
          total: "#1f2937",
          totalText: "#d1d5db",
          stripe: "#f9fafb",
        },
      },
      I = f[z] || f.simple;
    return e.jsxs(e.Fragment, {
      children: [
        w && e.jsx(Ap, { budget: s, client: m, cfg: n, onClose: () => v(!1) }),
        e.jsx("div", {
          style: {
            position: "fixed",

/* ===== Líneas originales aproximadas 21700-22020 ===== */
                        }),
                        onClick: async () => {
                          await zt(
                            "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
                          );
                          var D = window.XLSX,
                            k = D.utils.book_new(),
                            {
                              sub: R,
                              iva: K,
                              desc: y,
                              total: P,
                              anticipo: A,
                            } = Ee(s.items, n, s.descuento, s.modoCosteo, s.sinIva),
                            S = {
                              simple: "1A3A5C",
                              azul: "1E40AF",
                              verde: "14532D",
                              naranja: "92400E",
                              gris: "1F2937",
                            },
                            O = S[z] || "1A3A5C",
                            U =
                              {
                                simple: "F5A020",
                                azul: "3B82F6",
                                verde: "16A34A",
                                naranja: "F97316",
                                gris: "6B7280",
                              }[z] || "F5A020",
                            $ = [];
                          ($.push([
                            n.empresa || "",
                            "",
                            "",
                            "",
                            "",
                            "N° " + s.id,
                          ]),
                            $.push([
                              n.direccion || "",
                              "",
                              "",
                              "",
                              "",
                              "PRESUPUESTO",
                            ]),
                            $.push([
                              "RUT: " +
                                (n.rut || "") +
                                " | " +
                                (n.ciudad || ""),
                              "",
                              "",
                              "",
                              "",
                              "Fecha: " + s.fecha,
                            ]),
                            $.push([
                              (n.telefono ? "Tel: " + n.telefono + " " : "") +
                                (n.email || ""),
                              "",
                              "",
                              "",
                              "",
                              "Estado: " + s.estado,
                            ]),
                            $.push([""]),
                            $.push(["CLIENTE", "", "", "", "", ""]),
                            $.push([
                              "Empresa: " + (m.nombre || ""),
                              "",
                              "",
                              "Contacto: " + (m.contacto || ""),
                              "",
                              "",
                            ]),
                            m.telefono &&
                              $.push([
                                "Teléfono: " + m.telefono,
                                "",
                                "",
                                "Email: " + (m.email || ""),
                                "",
                                "",
                              ]),
                            s.descripcion &&
                              $.push([
                                "Proyecto: " + s.descripcion,
                                "",
                                "",
                                "",
                                "",
                                "",
                              ]),
                            $.push([""]),
                            $.push([
                              "N°",
                              "DESCRIPCIÓN",
                              "CANT.",
                              "UNIDAD",
                              "PRECIO UNIT.",
                              "TOTAL",
                            ]));
                          var ee = $.length,
                            tt = Array.isArray(s.items) ? s.items : [];
                          (tt.forEach((G, ie) => {
                            var oe =
                              (parseFloat(G.cant) || 0) *
                              (parseFloat(G.precio) || 0);
                            $.push([
                              ie + 1,
                              G.desc || "",
                              G.cant,
                              G.unidad || "",
                              parseFloat(G.precio) || 0,
                              oe,
                            ]);
                          }),
                            $.push([""]),
                            $.push(["", "", "", "", "Subtotal Neto:", R]),
                            $.push([
                              "",
                              "",
                              "",
                              "",
                              "IVA (" + Math.round(n.iva * 100) + "%): ",
                              K,
                            ]),
                            s.descuento &&
                              $.push([
                                "",
                                "",
                                "",
                                "",
                                "Descuento (" +
                                  Math.round(n.descuento * 100) +
                                  "%): ",
                                -y,
                              ]),
                            $.push(["", "", "", "", "TOTAL A PAGAR:", P]),
                            $.push([
                              "",
                              "",
                              "",
                              "",
                              "Anticipo (" +
                                Math.round(n.anticipo * 100) +
                                "%): ",
                              A,
                            ]),
                            $.push([""]),
                            (
                              n.terminosCondiciones ||
                              `• Presupuesto válido por {validez} días corridos desde la fecha de emisión.
• El plazo de entrega se coordinará previo al anticipo.`
                            )
                              .split(
                                `
`,
                              )
                              .filter(Boolean)
                              .forEach((G) => {
                                $.push([G.replace("{validez}", n.validez)]);
                              }),
                            $.push([
                              "• Cheques y transferencias a nombre de " +
                                n.empresa +
                                ".",
                            ]),
                            s.notas && $.push(["• " + s.notas]));
                          var Y = D.utils.aoa_to_sheet($);
                          ((Y["!cols"] = [
                            { wch: 6 },
                            { wch: 45 },
                            { wch: 10 },
                            { wch: 10 },
                            { wch: 18 },
                            { wch: 18 },
                          ]),
                            (Y["!merges"] = [
                              { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
                              { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
                              { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
                              { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } },
                              { s: { r: 5, c: 0 }, e: { r: 5, c: 5 } },
                              { s: { r: 6, c: 0 }, e: { r: 6, c: 2 } },
                              { s: { r: 6, c: 3 }, e: { r: 6, c: 5 } },
                            ]));
                          var le = {
                              font: { bold: !0, sz: 16, color: { rgb: O } },
                              alignment: { vertical: "center" },
                            },
                            Z = {
                              font: {
                                bold: !0,
                                sz: 10,
                                color: { rgb: "FFFFFF" },
                              },
                              fill: { fgColor: { rgb: O } },
                              alignment: {
                                horizontal: "center",
                                vertical: "center",
                              },
                              border: {
                                bottom: {
                                  style: "thin",
                                  color: { rgb: "FFFFFF" },
                                },
                              },
                            },
                            X = {
                              numFmt: '"$"#,##0',
                              alignment: { horizontal: "right" },
                            },
                            W = {
                              font: { bold: !0 },
                              alignment: { horizontal: "right" },
                            },
                            T = {
                              font: { bold: !0, sz: 11, color: { rgb: O } },
                              fill: { fgColor: { rgb: "F0F4F8" } },
                            };
                          (Y.A1 && (Y.A1.s = le),
                            Y.F1 &&
                              (Y.F1.s = {
                                font: { bold: !0, sz: 20, color: { rgb: U } },
                                alignment: { horizontal: "right" },
                              }),
                            Y.F2 &&
                              (Y.F2.s = {
                                font: { bold: !0, sz: 10 },
                                alignment: { horizontal: "right" },
                              }),
                            Y.F3 &&
                              (Y.F3.s = { alignment: { horizontal: "right" } }),
                            Y.F4 &&
                              (Y.F4.s = {
                                alignment: { horizontal: "right" },
                              }));
                          var L = 6;
                          ["A", "B", "C", "D", "E", "F"].forEach((G) => {
                            var ie = Y[G + L];
                            ie && (ie.s = T);
                          });
                          var E = ee;
                          (["A", "B", "C", "D", "E", "F"].forEach((G, ie) => {
                            var oe = Y[G + E];
                            oe && (oe.s = Z);
                          }),
                            tt.forEach((G, ie) => {
                              var oe = E + ie + 1,
                                ce = ie % 2 === 0 ? "FFFFFF" : "F8FAFC";
                              (["A", "B", "C", "D"].forEach((te) => {
                                var fe = Y[te + oe];
                                fe &&
                                  (fe.s = {
                                    fill: { fgColor: { rgb: ce } },
                                    border: {
                                      bottom: {
                                        style: "thin",
                                        color: { rgb: "E5E7EB" },
                                      },
                                    },
                                  });
                              }),
                                ["E", "F"].forEach((te) => {
                                  var fe = Y[te + oe];
                                  fe &&
                                    (fe.s = u(d({}, X), {
                                      fill: { fgColor: { rgb: ce } },
                                      border: {
                                        bottom: {
                                          style: "thin",
                                          color: { rgb: "E5E7EB" },
                                        },
                                      },
                                    }));
                                }));
                            }));
                          var M = s.items.length,
                            q = E + M + 2;
                          [q, q + 1, q + 2].forEach((G) => {
                            var ie = Y["E" + G],
                              oe = Y["F" + G];
                            (ie && (ie.s = W), oe && (oe.s = X));
                          });
                          var J = s.descuento ? q + 3 : q + 2,
                            re = Y["E" + J],
                            Q = Y["F" + J];
                          (re &&
                            (re.s = {
                              font: {
                                bold: !0,
                                sz: 12,
                                color: { rgb: "FFFFFF" },
                              },
                              fill: { fgColor: { rgb: O } },
                              alignment: { horizontal: "right" },
                            }),
                            Q &&
                              (Q.s = {
                                font: { bold: !0, sz: 12, color: { rgb: U } },
                                fill: { fgColor: { rgb: O } },
                                numFmt: '"$"#,##0',
                                alignment: { horizontal: "right" },
                              }),
                            D.utils.book_append_sheet(k, Y, "Presupuesto"),
                            D.writeFile(
                              k,
                              `Presupuesto_N${s.id}_${((m == null ? void 0 : m.nombre) || "").replace(/\s/g, "_")}.xlsx`,
                            ));
                        },
                        children: "📊 Excel",
                      }),
                      e.jsx("button", {
                        style: c.btn("s"),
                        onClick: l,
                        children: "✕",
                      }),
                    ],

/* ===== Líneas originales aproximadas 23078-23230 ===== */
  function _f({ budget: t, client: i, cfg: r, onClose: n, setToast: l }) {
    const [o, s] = V(null);
    var m = [
      { id: "simple", name: "Simple", desc: "Sin logo · Texto limpio" },
      {
        id: "azul",
        name: "Formal Azul",
        desc: "Header azul · Logo · Condiciones",
      },
      {
        id: "verde",
        name: "Formal Verde",
        desc: "Franja verde · Logo · Firma",
      },
      {
        id: "naranja",
        name: "Ejecutivo",
        desc: "Líneas naranja · Logo · Minimalista",
      },
      {
        id: "gris",
        name: "Gris Formal",
        desc: "Institucional · Gris · Logo · Firma",
      },
    ];
    return e.jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.93)",
        zIndex: 3e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overflowY: "auto",
      },
      children: e.jsxs("div", {
        style: {
          background: a.card,
          border: `1px solid ${a.border}`,
          borderRadius: 16,
          padding: "24px 26px",
          maxWidth: 720,
          width: "100%",
        },
        children: [
          e.jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
            },
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("div", {
                    style: { fontSize: 18, fontWeight: 700 },
                    children: "Elegir Plantilla PDF",
                  }),
                  e.jsxs("div", {
                    style: { fontSize: 13, color: a.muted, marginTop: 2 },
                    children: [
                      "Presupuesto ",
                      e.jsxs("span", {
                        style: { color: a.accent, fontWeight: 600 },
                        children: ["N° ", t.id],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx("button", { style: c.btn("s"), onClick: n, children: "✕" }),
            ],
          }),
          e.jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            },
            children: m.map((p) =>
              e.jsxs(
                "div",
                {
                  style: {
                    background: "var(--dark-surface)",
                    border: `1px solid ${a.border}`,
                    borderRadius: 12,
                    overflow: "hidden",
                  },
                  children: [
                    e.jsx(Gf, { id: p.id }),
                    e.jsxs("div", {
                      style: { padding: "10px 12px" },
                      children: [
                        e.jsx("div", {
                          style: {
                            fontSize: 13,
                            fontWeight: 700,
                            marginBottom: 2,
                          },
                          children: p.name,
                        }),
                        e.jsx("div", {
                          style: {
                            fontSize: 12,
                            color: a.muted,
                            marginBottom: 10,
                          },
                          children: p.desc,
                        }),
                        e.jsxs("div", {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          },
                          children: [
                            e.jsx("button", {
                              disabled: !!o,
                              style: u(d({}, c.btn("p")), {
                                padding: "7px",
                                fontSize: 13,
                                opacity: o === p.id + "_p" ? 0.6 : 1,
                              }),
                              onClick: async () => {
                                s(p.id + "_p");
                                try {
                                  await zr(t, i, r, p.id);
                                } catch (C) {
                                  l &&
                                    l("❌ Error al generar PDF: " + C.message);
                                }
                                s(null);
                              },
                              children: "⬇ Descargar PDF",
                            }),
                            e.jsx("button", {
                              disabled: !!o,
                              style: {
                                background: "var(--bdg-comp-bg)",
                                color: "var(--bdg-comp-fg)",
                                border: "1px solid var(--bdg-comp-fg)",
                                borderRadius: 7,
                                padding: "7px",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                                opacity: o === p.id + "_w" ? 0.6 : 1,
                              },
                              onClick: async () => {
