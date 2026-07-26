/*
 * Partidas de obra: búsqueda, integridad y listado
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 44121-44230 ===== */
  function vg({ catalog: t, setCatalog: i, setToast: r }) {
    var n = [...new Set(t.map((y) => y.cat))];
    const [l, o] = V("Todos"),
      [s, m] = V(!1),
      [p, C] = V(""),
      [b, h] = V("Pintura"),
      [j, F] = V({ desc: "", unidad: "unidad", precio: "" }),
      [g, z] = V(null),
      [B, w] = V(""),
      [v, x] = V(null);
    var f = (() => {
        var y = l === "Todos" ? t : t.filter((P) => P.cat === l);
        var A = (Q) => {
            var Z = String(Q || "");
            try {
              Z = Z.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            } catch (X) {}
            return Z.toLowerCase().trim();
          },
          ap = (function () {
            try {
              var Q = localStorage.getItem("enlace_constructor_pro_v1_apus");
              Q == null && (Q = localStorage.getItem("apus"));
              return Q ? JSON.parse(Q) : [];
            } catch (Z) {
              return [];
            }
          })(),
          apSet = new Set(
            ap
              .map(function (Q) {
                return parseInt(Q && Q.catalogId);
              })
              .filter(function (Q) {
                return isFinite(Q);
              }),
          ),
          apByCat = ap.reduce(function (Q, Z) {
            var X = parseInt(Z && Z.catalogId);
            if (!isFinite(X)) return Q;
            var G = String((Z && Z.nombre) || "").trim();
            if (!G) return Q;
            (Q[X] = Q[X] || []).push(G);
            return Q;
          }, {}),
          S = y.reduce((Q, Z) => {
            var X = A(Z.cat) + "|" + A(Z.desc);
            return ((Q[X] = (Q[X] || 0) + 1), Q);
          }, {}),
          O = (Z) => {
            var X = A(Z.cat) + "|" + A(Z.desc),
              G = parseFloat(Z.precio) || 0,
              ie = String(Z.unidad || "").trim(),
              ae = apByCat[parseInt(Z.id)] || [],
              oe = ae.length > 0,
              fe = oe
                ? ae.length <= 2
                  ? ae.join(", ")
                  : ae.slice(0, 2).join(", ") + " (+" + (ae.length - 2) + ")"
                : "—";
            return u(d({}, Z), {
              __dup: (S[X] || 0) > 1,
              __missingPrecio: !(G > 0),
              __missingUnidad: !ie || A(ie) === "unidad",
              __apuShort: fe,
              __apuTitle: ae.join(", "),
              __missingApu: !oe,
            });
          },
          U = String(B || "").trim(),
          R = A(U),
          K = R.split(/\s+/).filter(Boolean),
          D = { sp: !1, su: !1, sa: !1 },
          k = [];
        K.forEach((Q) => {
          Q === ":sinprecio"
            ? (D.sp = !0)
            : Q === ":sinunidad"
              ? (D.su = !0)
              : Q === ":sinapu"
                ? (D.sa = !0)
                : k.push(Q);
        });
        var le = (Z) => {
          var X = parseFloat(Z.precio) || 0,
            G = String(Z.unidad || "").trim(),
            ie = apSet.has(parseInt(Z.id));
          return (
            !(D.sp && X > 0) &&
            !(D.su && G && A(G) !== "unidad") &&
            !(D.sa && ie)
          );
        };
        var ee = (Q, Z) => {
          if (!Q) return !0;
          if (Z.indexOf(Q) !== -1) return !0;
          if (
            Q === "techo" ||
            Q === "techumbre" ||
            Q === "zinc" ||
            Q === "canaleta" ||
            Q === "cubierta"
          )
            return (
              Z.indexOf("techumbr") !== -1 ||
              Z.indexOf("zinc") !== -1 ||
              Z.indexOf("canalet") !== -1 ||
              Z.indexOf("cubiert") !== -1
            );
          if (

/* ===== Líneas originales aproximadas 44753-44830 ===== */
                e.jsxs("div", {
                  style: c.card,
                  children: [
                    e.jsxs("div", {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                        flexWrap: "wrap",
                        gap: 8,
                      },
                      children: [
                        e.jsxs("div", {
                          style: {
                            fontSize: 16,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "baseline",
                            gap: 10,
                            flexWrap: "wrap",
                          },
                          children: [
                            "Partidas de Obra ",
                            e.jsxs("span", {
                              style: {
                                fontSize: 12,
                                color: a.muted,
                                fontWeight: 500,
                              },
                              children: [
                                "Mostrando ",
                                f.length,
                                " de ",
                                l === "Todos"
                                  ? t.length
                                  : t.filter((y) => y.cat === l).length,
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 6,
                          },
                          children: [
                            e.jsxs("div", {
                              style: { position: "relative" },
                              children: [
                                e.jsx("input", {
                                  style: u(d({}, c.inp), {
                                    width: 220,
                                    fontSize: 13,
                                    paddingRight: 28,
                                  }),
                                  placeholder: "Buscar partida...",
                                  value: B,
                                  onChange: (y) => w(y.target.value),
                                }),
                                B
                                  ? e.jsx("button", {
                                      onClick: () => w(""),
                                      style: {
                                        position: "absolute",
                                        right: 6,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 20,
                                        height: 20,
                                        borderRadius: 6,
                                        border: "1px solid " + a.border,
                                        background: a.sb,
                                        color: a.muted,
                                        cursor: "pointer",
                                        fontSize: 12,
