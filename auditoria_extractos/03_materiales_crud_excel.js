/*
 * Materiales: pantalla, estado e intercambio Excel
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 26867-26980 ===== */
  function Vf({ materiales: t, setMateriales: i, setToast: r }) {
    var n = [...new Set(t.map((A) => A.cat))].sort();
    const [l, o] = V("Todos"),
      [s, m] = V(""),
      [p, C] = V(null),
      [b, h] = V(!1),
      [j, F] = V(""),
      [g, z] = V(n[0] || ""),
      [B, w] = V({ nombre: "", unidad: "unidad", precio: "" }),
      [v, x] = V(null),
      [f, I] = V(null);
    const priceHistory = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_price_history") || "[]"
        );
      } catch {
        return [];
      }
    })();
    var D = Pf(
        () =>
          t.filter((A) => {
            var S = l === "Todos" || A.cat === l,
              O =
                !s ||
                A.nombre.toLowerCase().includes(s.toLowerCase()) ||
                A.cat.toLowerCase().includes(s.toLowerCase());
            return S && O;
          }),
        [t, l, s],
      ),
      k = b ? j.trim() : g,
      R = () => {
        (C(null),
          h(!1),
          F(""),
          z(n[0] || ""),
          w({ nombre: "", unidad: "unidad", precio: "" }));
      },
      K = () => {
        if (!k || !B.nombre || B.precio === "") {
          r("⚠️ Completa categoría, nombre y precio.");
          return;
        }
        var A = parseFloat(B.precio) || 0;
        (i(
          p !== null
            ? t.map((S) => {
                if (S.id !== p) return S;
                var O = [...(S.historialPrecios || [])];
                return (
                  S.precio !== A &&
                    (O.unshift({
                      precio: S.precio,
                      fecha: new Date().toISOString().split("T")[0],
                    }),
                    O.length > 12 && (O.length = 12)),
                  u(d({}, S), {
                    cat: k,
                    nombre: B.nombre,
                    unidad: B.unidad,
                    precio: A,
                    _precioUsuario: !0,
                    fechaActualizacion: new Date().toISOString().split("T")[0],
                    historialPrecios: O,
                  })
                );
              })
            : [
                ...t,
                {
                  id: Math.max(0, ...t.map((S) => S.id)) + 1,
                  cat: k,
                  nombre: B.nombre,
                  unidad: B.unidad,
                  precio: A,
                },
              ],
        ),
          R());
      },
      y = [
        "#f5a020",
        "#2563eb",
        "#34d399",
        "#c084fc",
        "#f87171",
        "#60a5fa",
        "#fbbf24",
        "#a78bfa",
        "#4ade80",
        "#fb923c",
      ],
      P = (A) => {
        const S = n.indexOf(A) % y.length;
        return y[S >= 0 ? S : 0];
      };
    return (
      t.length,
      t.length && Math.round(t.reduce((A, S) => A + S.precio, 0) / t.length),
      t.reduce((A, S) => (S.precio > A.precio ? S : A), { precio: 0 }),
      e.jsxs(e.Fragment, {
        children: [
          f &&
            e.jsx("div", {
              onClick: () => I(null),
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.75)",
                zIndex: 9e3,
                display: "flex",
                alignItems: "center",

/* ===== Líneas originales aproximadas 27670-27810 ===== */
                                    e.jsx("option", { children: A }, A),
                                  ),
                                ],
                              }),
                              e.jsx("button", {
                                style: u(d({}, c.btn("g")), {
                                  padding: "6px 12px",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                }),
                                onClick: () => {
                                  if (typeof window.XLSX == "undefined") {
                                    var A = document.createElement("script");
                                    ((A.src = "xlsx.full.min.js"),
                                      (A.onload = S),
                                      document.head.appendChild(A));
                                  } else S();
                                  function S() {
                                    var O = window.XLSX,
                                      U = new Date().toLocaleDateString(
                                        "es-CL",
                                      ),
                                      $ = [
                                        [
                                          "ID",
                                          "Nombre",
                                          "Categoría",
                                          "Unidad",
                                          "Precio s/IVA",
                                          "Precio c/IVA",
                                          "Última actualización",
                                        ],
                                      ];
                                    t.forEach((W) =>
                                      $.push([
                                        W.id,
                                        W.nombre,
                                        W.cat || "",
                                        W.unidad || "",
                                        W.precio || 0,
                                        Math.round((W.precio || 0) * 1.19),
                                        W.fechaActualizacion || "",
                                      ]),
                                    );
                                    var ee = O.utils.aoa_to_sheet($);
                                    ee["!cols"] = [
                                      { wch: 6 },
                                      { wch: 40 },
                                      { wch: 22 },
                                      { wch: 10 },
                                      { wch: 14 },
                                      { wch: 14 },
                                      { wch: 20 },
                                    ];
                                    var Y = {
                                      font: {
                                        bold: !0,
                                        color: { rgb: "FFFFFF" },
                                      },
                                      fill: { fgColor: { rgb: "1A3060" } },
                                      alignment: { horizontal: "center" },
                                    };
                                    [
                                      "A1",
                                      "B1",
                                      "C1",
                                      "D1",
                                      "E1",
                                      "F1",
                                      "G1",
                                    ].forEach((W) => {
                                      ee[W] && (ee[W].s = Y);
                                    });
                                    var le = O.utils.book_new();
                                    O.utils.book_append_sheet(
                                      le,
                                      ee,
                                      "Materiales",
                                    );
                                    var Z = [
                                        [
                                          "EXPORTACIÓN BASE DE MATERIALES — ENLACE CONSTRUCTOR PRO",
                                        ],
                                        ["Fecha de exportación:", U],
                                        ["Total materiales:", t.length],
                                        [
                                          "Categorías:",
                                          [...new Set(t.map((W) => W.cat))]
                                            .length,
                                        ],
                                        ["", ""],
                                        ["Instrucciones de uso:"],
                                        [
                                          "1. No modificar las columnas ID y Nombre",
                                        ],
                                        [
                                          "2. Actualizar solo la columna Precio s/IVA",
                                        ],
                                        [
                                          "3. Guardar y subir en Base de Materiales → Importar Excel",
                                        ],
                                      ],
                                      X = O.utils.aoa_to_sheet(Z);
                                    ((X["!cols"] = [{ wch: 30 }, { wch: 40 }]),
                                      O.utils.book_append_sheet(
                                        le,
                                        X,
                                        "Instrucciones",
                                      ),
                                      O.writeFile(
                                        le,
                                        "Base_Materiales_ECP_" +
                                          U.replace(/\//g, "-") +
                                          ".xlsx",
                                      ),
                                      r(
                                        "✅ Excel exportado — " +
                                          t.length +
                                          " materiales",
                                      ));
                                  }
                                },
                                children: "📥 Exportar Excel",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        style: { overflowY: "auto", maxHeight: 520 },
                        children: e.jsxs("table", {
                          style: { width: "100%", borderCollapse: "collapse" },
                          children: [
                            e.jsx("thead", {
                              style: {
                                position: "sticky",
                                top: 0,
                                background: a.card,
