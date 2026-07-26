/*
 * APU: creación/edición y cálculo
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 23602-23768 ===== */
  function Hf({
    apus: t,
    setApus: i,
    materiales: r,
    catalog: n,
    setCatalog: l,
    setToast: o,
    cfg: cfgApu,
  }) {
    var s = [...new Set(r.map((_) => _.cat))].sort(),
      m = [
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
      p = (_) => {
        const ue = s.indexOf(_) % m.length;
        return m[ue >= 0 ? ue : 0];
      },
      C = () => ({
        nombre: "",
        categoria: s[0] || "",
        unidad: "m²",
        catalogId: "",
        esSubcontrato: !1,
        precioSubcontrato: "",
        precioMO: "",
        pctMO: Ip[s[0]] || 50,
        pctGG: 12,
        pctUtilidad: 15,
        pctSource: "cfg",
        materiales: [],
      });
    const [b, h] = V(C),
      [j, F] = V(null),
      [g, z] = V("Todos"),
      [B, w] = V(!1),
      [v, x] = V(""),
      [f, I] = V(null),
      [D, k] = V(null),
      [R, K] = V(0),
      [y, P] = V(1),
      [A, S] = V(null),
      [O, U] = V(() => {
        try {
          return JSON.parse(localStorage.getItem("apus_ignorados") || "[]");
        } catch (_) {
          return [];
        }
      }),
      [$, ee] = V("crear"),
      [Y, le] = V(""),
      [Z, X] = V({ apu: 0, custom: "" }),
      [W, T] = V("");
    var L = () => ({ materialId: "", cantidad: "" }),
      E = (_) => (ue) => h((xe) => u(d({}, xe), { [_]: ue })),
      M = () => {
        (F(null), h(C()), k(null));
      },
      q = (_) => {
        (F(_.id),
          h({
            nombre: _.nombre,
            categoria: _.categoria,
            unidad: _.unidad,
            catalogId: _.catalogId || "",
            esSubcontrato: _.esSubcontrato,
            precioSubcontrato: _.precioSubcontrato || "",
            precioMO: _.precioMO || "",
            pctMO: _.pctMO,
            pctGG: _.pctGG,
            pctUtilidad: _.pctUtilidad,
            pctSource: _.pctSource || "cfg",
            materiales: _.materiales.map((ue) => d({}, ue)),
          }),
          K(_.rendimiento || 0),
          P(_.dotacion || 1),
          k(null));
      },
      J = () => {
        var ue;
        if (!b.nombre.trim() || !b.categoria) {
          o("⚠️ Completa nombre y categoría.");
          return;
        }
        if (
          !b.esSubcontrato &&
          !b.materiales.some(
            (linea) => linea.materialId && parseFloat(linea.cantidad) > 0,
          ) &&
          !(parseFloat(b.precioMO) > 0)
        ) {
          o("⚠️ Agrega materiales o indica un precio base de mano de obra.");
          return;
        }
        var anterior = j !== null ? t.find((xe) => xe.id === j) : null,
          _ = u(d({}, anterior || {}), {
          id: j !== null ? j : Math.max(0, ...t.map((xe) => xe.id)) + 1,
          nombre: b.nombre.trim(),
          categoria: b.categoria,
          unidad: b.unidad,
          catalogId: b.catalogId ? parseInt(b.catalogId) : "",
          esSubcontrato: b.esSubcontrato,
          precioSubcontrato: parseFloat(b.precioSubcontrato) || 0,
          precioMO: parseFloat(b.precioMO) || 0,
          pctMO: parseFloat(b.pctMO) || 0,
          pctGG: parseFloat(b.pctGG) || 0,
          pctUtilidad: parseFloat(b.pctUtilidad) || 0,
          pctSource: b.pctSource || "cfg",
          rendimiento: parseFloat(R) || 0,
          dotacion: parseInt(y) || 1,
          materiales: b.materiales
            .filter((xe) => xe.materialId && xe.cantidad !== "")
            .map((xe) => ({
              materialId: parseInt(xe.materialId),
              cantidad: parseFloat(xe.cantidad) || 0,
            })),
          bloqueado:
            (j !== null &&
              ((ue = t.find((xe) => xe.id === j)) == null
                ? void 0
                : ue.bloqueado)) ||
            !1,
        });
        if (
          (i(j !== null ? t.map((xe) => (xe.id === j ? _ : xe)) : [...t, _]),
          _.catalogId && n)
        ) {
          const { precioFinal: xe } = li(_, r, cfgApu);
          l(
            n.map((se) =>
              se.id === _.catalogId ? u(d({}, se), { precio: xe }) : se,
            ),
          );
        }
        M();
      },
      re = (_) => {
        _.bloqueado && o("🔓 APU desbloqueado para edición");
        var ue = t.map((xe) =>
          xe.id === _.id ? u(d({}, xe), { bloqueado: !xe.bloqueado }) : xe,
        );
        (i(ue), _t("apus", ue));
      },
      Q = li(
        u(d({}, b), {
          pctMO: parseFloat(b.pctMO) || 0,
          pctGG: parseFloat(b.pctGG) || 0,
          pctUtilidad: parseFloat(b.pctUtilidad) || 0,
          precioSubcontrato: parseFloat(b.precioSubcontrato) || 0,
          materiales: b.materiales
            .filter((_) => _.materialId && _.cantidad !== "")
            .map((_) => ({
              materialId: parseInt(_.materialId),
              cantidad: parseFloat(_.cantidad) || 0,
            })),
        }),
        r,
        cfgApu,
      );
