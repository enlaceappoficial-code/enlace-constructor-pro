/*
 * Cubicación desde presupuesto, cubicación libre y consolidación
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 33931-34110 ===== */
  function ig({ budgets: t, materiales: i, catalog: r, apus: n, setToast: l }) {
    const [o, s] = V(""),
      [m, p] = V([]),
      [C, b] = V(new Set()),
      [h, j] = V(1),
      [F, g] = V(""),
      [z, B] = V(() => {
        try {
          const S = localStorage.getItem("cubicaciones_guardadas");
          return S ? JSON.parse(S) : [];
        } catch (S) {
          return [];
        }
      }),
      [w, v] = V(null),
      [x0, f0] = V({}),
      [I0, D0] = V(null),
      [E0, M0] = V(null);
    var x = t && o ? t.find((S) => S.id === parseInt(o)) : null;
    Re.useEffect(() => b(new Set()), [o]);
    var f = () => {
        if (!x) return [];
        var S = {};
        for (const Z of x.items) {
          var O = null;
          (Z._cid &&
            (O = (r && r.find((X) => X.id === parseInt(Z._cid))) || null),
            O || (O = (r && r.find((X) => X.desc === Z.desc)) || null));
          if (!O) {
            var Ue = String(Z.desc || "").toLowerCase(),
              $e = null;
            for (const X of r || []) {
              var ee = String(X.desc || "").toLowerCase();
              if (Ue.includes(ee) || ee.includes(Ue)) {
                $e = X;
                break;
              }
            }
            O = $e;
          }
          var activeMats = Z._customApuMaterials || null;
          var U = null;
          if (O) {
            U =
              n &&
              n.find(
                (X) =>
                  X.catalogId === O.id &&
                  !X.esSubcontrato &&
                  X.materiales &&
                  X.materiales.length > 0,
              );
            if (!activeMats && U) activeMats = U.materiales;
          }
          if (activeMats && activeMats.length > 0) {
            var $ = parseFloat(Z.cant) || 0;
            if (!($ <= 0))
              for (const X of activeMats) {
                if (X._activo === false) continue;
                var ee = X._mat ? X._mat : (i && i.find((W) => W.id === X.materialId));
                if (ee) {
                  var Y = ee.id;
                  S[Y] ||
                    (S[Y] = {
                      id: ee.id,
                      nombre: ee.nombre,
                      unidad: ee.unidad,
                      cantidad: 0,
                      partidas: [],
                      aparece: [],
                    });
                  var le = $ * (parseFloat(X.cantidad) || 0);
                  ((S[Y].cantidad += le),
                    S[Y].partidas.includes(Z.desc) ||
                      S[Y].partidas.push(Z.desc),
                    S[Y].aparece.push({
                      desc: Z.desc,
                      cant: le,
                      unidadAPU: U ? U.unidad : Z.und,
                    }));
                }
              }
          }
        }
        return Object.values(S)
          .filter((Z) => Z.cantidad > 0)
          .sort((Z, X) => Z.nombre.localeCompare(X.nombre));
      },
      I = f(),
      D = () => {
        var S = [
          ...I.filter((U) => !C.has(U.id)).map((U) =>
            u(d({}, U), {
              cantidad:
                x0[U.id] != null &&
                x0[U.id] !== "" &&
                !isNaN(parseFloat(x0[U.id]))
                  ? parseFloat(x0[U.id])
                  : parseFloat(U._cantAjustada) || U.cantidad,
            }),
          ),
        ];
        for (const U of m)
          if (!(!U.nombre || !parseFloat(U.cantidad))) {
            var O = S.find(
              ($) => $.nombre.toLowerCase() === U.nombre.toLowerCase(),
            );
            O
              ? (O.cantidad += parseFloat(U.cantidad))
              : S.push({
                  id: "ex_" + U.id,
                  nombre: U.nombre,
                  unidad: U.unidad,
                  cantidad: parseFloat(U.cantidad),
                  partidas: ["Extra"],
                });
          }
        return S.filter((U) => U.cantidad > 0);
      },
      k = () => {
        (p((S) => [
          ...S,
          { id: h, nombre: "", unidad: "unidad", cantidad: "1" },
        ]),
          j((S) => S + 1));
      },
      R = (S) => p((O) => O.filter((U) => U.id !== S)),
      K = (S, O, U) =>
        p(($) => $.map((ee) => (ee.id === S ? u(d({}, ee), { [O]: U }) : ee))),
      y = () => {
        if (!x) {
          l("⚠️ Selecciona un presupuesto primero.");
          return;
        }
        var S = {
            nombre: F || `Cubicación — ${x.descripcion}`,
            presupuestoId: x.id,
            presupuestoDesc: x.descripcion,
            materiales: D(),
            extras: m,
          },
          O = u(d({}, S), {
            id: Date.now(),
            fecha: new Date().toLocaleDateString("es-CL"),
          }),
          U = [O, ...z.slice(0, 19)];
        B(U);
        try {
          localStorage.setItem("cubicaciones_guardadas", JSON.stringify(U));
        } catch ($) {}
        l(`✅ Cubicación "${O.nombre}" guardada.`);
      },
      P = (S) => {
        var O = z.filter((U) => U.id !== S);
        B(O);
        try {
          localStorage.setItem("cubicaciones_guardadas", JSON.stringify(O));
        } catch (U) {}
        (l("🗑️ Cubicación eliminada"), w && w.id === S && v(null));
      },
      A = (S, O) => {
        var U = window.open("", "_blank");
        (U.document.write(`<html><head><title>${O}</title>
    <style>body{font-family:Arial,sans-serif;padding:30px}table{width:100%;border-collapse:collapse;margin-top:16px}
    th{background:#1a3060;color:#fff;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #ddd}
    .res{background:#f0f4f8;padding:12px;border-radius:6px;margin-top:20px}
    @media print{button{display:none}}</style></head><body>
    <h2>${O}</h2>
    <button onclick="window.print()" style="padding:8px 16px;background:#1a3060;color:#fff;border:none;cursor:pointer;border-radius:4px;margin-bottom:12px">🖨 Imprimir / PDF</button>
    <table><thead><tr><th>Material</th><th>Cantidad</th><th>Unidad</th><th>Partidas</th></tr></thead>
    <tbody>${S.map(($) => `<tr><td>${$.nombre}</td><td>${+$.cantidad.toFixed(3)}</td><td>${$.unidad}</td><td style="font-size:11px;color:#666">${($.partidas || []).join(", ")}</td></tr>`).join("")}</tbody>
    </table>
    <p style="font-size:11px;color:#888;margin-top:20px">Enlace Constructor Pro</p>
    </body></html>`),
          U.document.close());
      };
    return w
      ? e.jsxs("div", {
          children: [
            e.jsxs("div", {

/* ===== Líneas originales aproximadas 34827-35040 ===== */
  function rg({
    budgets: t,
    materiales: i,
    catalog: r,
    apus: n,
    clients: l,
    cfg: o,
    setToast: s,
  }) {
    const [m, p] = V("libre");
    var C = [
        {
          id: "mel18",
          nombre: "Melamina 18mm",
          ancho: 1830,
          alto: 2440,
          precio: 28e3,
        },
        {
          id: "mel15",
          nombre: "Melamina 15mm",
          ancho: 1830,
          alto: 2440,
          precio: 24e3,
        },
        {
          id: "mdf18",
          nombre: "MDF 18mm",
          ancho: 1830,
          alto: 2440,
          precio: 22e3,
        },
        {
          id: "mdf15",
          nombre: "MDF 15mm",
          ancho: 1830,
          alto: 2440,
          precio: 18500,
        },
        {
          id: "ter18",
          nombre: "Terciado estructural 18mm",
          ancho: 1220,
          alto: 2440,
          precio: 32e3,
        },
        {
          id: "ter15",
          nombre: "Terciado estructural 15mm",
          ancho: 1220,
          alto: 2440,
          precio: 26e3,
        },
        {
          id: "osb11",
          nombre: "OSB 11mm",
          ancho: 1220,
          alto: 2440,
          precio: 18500,
        },
        {
          id: "osb15",
          nombre: "OSB 15mm",
          ancho: 1220,
          alto: 2440,
          precio: 22e3,
        },
      ],
      b = 3;
    const [h, j] = V(() => {
        try {
          const G = localStorage.getItem("cub_libre");
          return G ? JSON.parse(G).proyNombre : "";
        } catch (G) {
          return "";
        }
      }),
      [F, g] = V(() => {
        try {
          const G = localStorage.getItem("cub_libre"),
            ie = G ? JSON.parse(G) : null;
          return ie && ie.elementos && ie.elementos.length > 0
            ? ie.elementos
            : [
                {
                  id: 1,
                  catalogId: "",
                  nombre: "",
                  unidad: "m²",
                  largo: "",
                  ancho: "",
                  alto: "",
                  espesor: "",
                  cantidad: "1",
                },
              ];
        } catch (G) {
          return [
            {
              id: 1,
              catalogId: "",
              nombre: "",
              unidad: "m²",
              largo: "",
              ancho: "",
              alto: "",
              espesor: "",
              cantidad: "1",
            },
          ];
        }
      }),
      [z, B] = V(() => {
        try {
          const G = localStorage.getItem("cub_libre");
          return (G && JSON.parse(G).nextId) || 2;
        } catch (G) {
          return 2;
        }
      }),
      [w, v] = V("mel18"),
      [x, f] = V([
        { id: 1, nombre: "Pieza 1", ancho: "", alto: "", cantidad: "1" },
      ]),
      [I, D] = V(2),
      [k, R] = V(null);
    Re.useEffect(() => {
      if (!(F.length === 0 && !h))
        try {
          localStorage.setItem(
            "cub_libre",
            JSON.stringify({ proyNombre: h, elementos: F, nextId: z }),
          );
        } catch (G) {}
    }, [h, F, z]);
    const [K, y] = V(""),
      [P, A] = V(""),
      [S, O] = V(() => {
        try {
          const G = localStorage.getItem("cortes_guardados");
          return G ? JSON.parse(G) : [];
        } catch (G) {
          return [];
        }
      });
    var U = () => {
        if (k) {
          var G =
              K.trim() ||
              "Proyecto de Cortes " + new Date().toLocaleDateString("es-CL"),
            ie = l && l.find((te) => te.id === parseInt(P)),
            oe = {
              id: Date.now(),
              nombre: G,
              clienteNombre: ie ? ie.nombre : "",
              material: X.nombre,
              planchas: k.planchas.length,
              piezas: k.totalPiezas,
              aprovechamiento: k.aprovechamiento,
              costTotal: k.costTotal,
              cortes: [...x],
              fecha: new Date().toLocaleDateString("es-CL"),
            },
            ce = [oe, ...S.slice(0, 19)];
          O(ce);
          try {
            localStorage.setItem("cortes_guardados", JSON.stringify(ce));
          } catch (te) {}
        }
      },
      $ = (G) => {
        const ie = S.filter((oe) => oe.id !== G);
        O(ie);
        try {
          localStorage.setItem("cortes_guardados", JSON.stringify(ie));
        } catch (oe) {}
      };
    const [ee, Y] = V({}),
      [le, Z] = V(() => {
        try {
          const G = localStorage.getItem("cubicaciones_guardadas");
          return G ? JSON.parse(G) : [];
        } catch (G) {
          return [];
        }
      });
    var X = C.find((G) => G.id === w) || C[0],
      W = (G) => g((ie) => ie.filter((oe) => oe.id !== G)),
      T = (G, ie, oe) =>
        g((ce) =>
          ce.map((te) => (te.id === G ? u(d({}, te), { [ie]: oe }) : te)),
        ),
      L = (G) => {
        var ie = parseFloat(G.largo) || 0,
          oe = parseFloat(G.ancho) || 0,
          ce = parseFloat(G.alto) || 0,
          te = parseFloat(G.cantidad) || 1;
        return G.unidad === "m³"
          ? +(ie * oe * ce * te).toFixed(4)
          : G.unidad === "m²"
            ? +(ie * oe * te).toFixed(4)
            : G.unidad === "ml"
              ? +(ie * te).toFixed(4)
              : +te.toFixed(4);
      };
    F.reduce((G, ie) => {
      const oe = L(ie);
      return (G[ie.unidad] || (G[ie.unidad] = 0), (G[ie.unidad] += oe), G);
    }, {});
    var E = () => {
        (f((G) => [
          ...G,
          { id: I, nombre: "Pieza " + I, ancho: "", alto: "", cantidad: "1" },
        ]),

/* ===== Líneas originales aproximadas 45438-45590 ===== */
  function bg(t, i, r, n) {
    var l = (m) =>
        m
          .toLowerCase()
          .replace(
            /[áéíóúü]/g,
            (p) => ({ á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u" })[p] || p,
          )
          .split(/[\s,\-\/()]+/)
          .filter(
            (p) =>
              p.length > 3 &&
              ![
                "para",
                "este",
                "esta",
                "como",
                "segun",
                "según",
                "tipo",
                "toda",
                "todo",
                "con",
                "sin",
                "los",
                "las",
                "por",
                "del",
                "una",
                "uno",
              ].includes(p),
          ),
      o = (m) => {
        if (m._cid) {
          var p = i.find((g) => g.id === parseInt(m._cid));
          if (p) return p;
        }
        var C = i.find((g) => g.desc === m.desc);
        if (C) return C;
        var b = i.find(
          (g) =>
            m.desc.toLowerCase().includes(g.desc.toLowerCase()) ||
            g.desc.toLowerCase().includes(m.desc.toLowerCase()),
        );
        if (b) return b;
        var h = l(m.desc);
        if (h.length === 0) return null;
        var j = null,
          F = 0;
        return (
          i.forEach((g) => {
            var z = l(g.desc),
              B = h.filter((v) =>
                z.some((x) => x.includes(v) || v.includes(x)),
              ).length,
              w = B / Math.max(h.length, z.length);
            B >= 2 && w > F && ((F = w), (j = g));
          }),
          j
        );
      },
      s = {};
    t.items.forEach((m) => {
      var p = parseFloat(m.cant) || 0;
      if (p !== 0) {
        var matList = m._customApuMaterials ? m._customApuMaterials.filter(x => x._activo) : null;
        var b = null;
        if (!matList) {
          var C = o(m);
          if (C) {
            b = r.find((h) => h.catalogId === C.id);
            if (b && !b.esSubcontrato) {
              matList = b.materiales;
            }
          }
        }
        if (matList && matList.length > 0) {
          matList.forEach((h) => {
            var j = h._mat ? h._mat : n.find((g) => g.id === h.materialId);
            if (j) {
              var F = (parseFloat(h.cantidad) || 0) * p;
              (s[j.id] || (s[j.id] = { mat: j, totalCant: 0, aparece: [] }),
                (s[j.id].totalCant += F),
                s[j.id].aparece.push({
                  desc: m.desc,
                  cant: F,
                  unidadAPU: b ? b.unidad : m.unidad || "u",
                }));
            }
          });
        }
      }
    });
    var m = Object.values(s).sort(
      (p, C) =>
        p.mat.cat.localeCompare(C.mat.cat) ||
        p.mat.nombre.localeCompare(C.mat.nombre),
    );
    try {
      var o = JSON.parse(
          localStorage.getItem("cubicaciones_guardadas") || "[]",
        ),
        b = o.find((p) => p.presupuestoId === t.id);
      if (b && b.materiales && b.materiales.length) {
        var h = new Map();
        b.materiales.forEach((p) => {
          (p && p.id != null && h.set("id:" + p.id, p),
            h.set(
              "n:" +
                String(p.nombre || "")
                  .trim()
                  .toLowerCase(),
              p,
            ));
        });
        var j = new Set();
        ((m = m
          .map((p) => {
            var C =
              h.get("id:" + p.mat.id) ||
              h.get(
                "n:" +
                  String(p.mat.nombre || "")
                    .trim()
                    .toLowerCase(),
              );
            if (!C) return null;
            j.add(C);
            var g = parseFloat(C.cantidad) || 0,
              z = parseFloat(p.totalCant) || 0;
            if (g > 0 && z > 0 && p.aparece && p.aparece.length) {
              var B = g / z;
              p.aparece = p.aparece.map((w) => ({
                desc: w.desc,
                cant: (parseFloat(w.cant) || 0) * B,
                unidadAPU: w.unidadAPU,
              }));
            }
            p.totalCant = g;
            return p.totalCant > 0 ? p : null;
          })
          .filter(Boolean)),
          b.materiales.forEach((p) => {
            if (j.has(p)) return;
            var C =
                (n && n.find((g) => g.id === p.id)) ||
                (n &&
                  n.find(
                    (g) =>
                      String(g.nombre || "")
                        .trim()
                        .toLowerCase() ===
                      String(p.nombre || "")
