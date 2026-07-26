/*
 * Motor de costos: total de presupuesto, MO, GG y utilidad
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 17687-17767 ===== */
    Ee = (t, i, r, n, isSinIva) => {
      t = Array.isArray(t) ? t : [];
      var l0 = 0,
        matS = 0,
        noMatS = 0;
      t.forEach((h) => {
        var cant = parseFloat(h.cant) || 0,
          precio = parseFloat(h.precio) || 0,
          tot = cant * precio,
          tipo = h._tipoCosto || (h._cid ? "auto" : "mo"),
          mat = 0,
          noMat = 0;
        if (tipo === "mat") mat = tot;
        else if (tipo === "mo") noMat = tot;
        else {
          var mu = parseFloat(h._apuMatUnit) || 0;
          ((mat = Math.max(0, Math.min(tot, mu * cant))),
            (noMat = Math.max(0, tot - mat)));
        }
        ((matS += mat), (noMatS += noMat), (l0 += tot));
      });
      var l = n === "mo" ? Math.round(noMatS) : Math.round(l0),
        o = isSinIva ? 0 : (i && i.moneda ? i.moneda.impuesto / 100 : (i && i.iva) || 0.19),
        s = l * o,
        m = l + s,
        p = r ? m * ((i && i.descuento) || 0) : 0,
        C = m - p,
        b = C * ((i && i.anticipo) || 0.6);
      return {
        sub: l,
        iva: s,
        bruto: m,
        desc: p,
        total: C,
        anticipo: b,
        matSub: Math.round(matS),
        noMatSub: Math.round(noMatS),
      };
    }, __Ee_export = (window.__Ee = Ee),
    calculaMO = (t, i) => {
      var r = parseFloat(t.rendimiento) || 0,
        n = Math.max(0, parseInt(t.dotacion) || 0),
        l = (i && Array.isArray(i.moItems) ? i.moItems : []).filter((b) => (parseFloat(b.jornal) || 0) > 0);
      if (!(r > 0) || !(n > 0) || l.length === 0) return null;
      var o = [];
      if (Array.isArray(t.cuadrilla) && t.cuadrilla.length > 0)
        o = t.cuadrilla.map((b) => {
          var h = l.find((j) => String(j.id) === String(b.rolId)) || l.find((j) => String(j.rol || "").toLowerCase() === String(b.rol || "").toLowerCase());
          return h ? { rol: h.rol, cantidad: Math.max(0, parseInt(b.cantidad) || 0), jornal: parseFloat(h.jornal) || 0 } : null;
        }).filter((b) => b && b.cantidad > 0);
      if (o.length === 0) {
        var s = l.find((b) => /maestro/i.test(b.rol || "")) || l[0],
          m = l.find((b) => /ayudante/i.test(b.rol || "")) || l.find((b) => b.id !== s.id) || s;
        o = [{ rol: s.rol, cantidad: 1, jornal: parseFloat(s.jornal) || 0 }];
        n > 1 && o.push({ rol: m.rol, cantidad: n - 1, jornal: parseFloat(m.jornal) || 0 });
      }
      var p = o.reduce((b, h) => b + h.jornal * h.cantidad, 0);
      return p > 0 ? { total: p / r, costoCuadrillaDia: p, cuadrilla: o, label: o.map((b) => `${b.cantidad} ${b.rol}`).join(" + ") } : null;
    },
    li = (t, i, r) => {
      if (t.esSubcontrato) {
        var costoBase = parseFloat(t.precioSubcontrato) || 0,
          n = (costoBase * (parseFloat(t.pctGG) || 0)) / 100,
          utilidad = ((costoBase + n) * (parseFloat(t.pctUtilidad) || 0)) / 100;
        return { matTotal: 0, moTotal: 0, ggTotal: n, utilTotal: utilidad, precioFinal: Math.round(costoBase + n + utilidad), base: costoBase, moSource: "subcontrato", moLabel: "Subcontrato" };
      }
      var l = (t.materiales || []).reduce((h, j) => {
          var F = i.find((g) => g.id === j.materialId);
          return h + (F ? F.precio : 0) * (parseFloat(j.cantidad) || 0);
        }, 0),
        o = parseFloat(t.precioMO) || 0,
        manoObra = o > 0 ? null : calculaMO(t, r),
        s = o > 0 ? o : manoObra ? manoObra.total : (l * (parseFloat(t.pctMO) || 0)) / 100,
        m = ((l + s) * (parseFloat(t.pctGG) || 0)) / 100,
        p = l + s + m,
        C = (p * (parseFloat(t.pctUtilidad) || 0)) / 100,
        b = Math.round(p + C),
        fuenteMO = o > 0 ? "manual" : manoObra ? "jornales" : "porcentaje",
        etiquetaMO = o > 0 ? "Precio manual" : manoObra ? "Jornales / rendimiento" : `Porcentaje ${parseFloat(t.pctMO) || 0}%`;
      return { matTotal: l, moTotal: s, ggTotal: m, utilTotal: C, precioFinal: b, base: l, moSource: fuenteMO, moLabel: etiquetaMO, costoCuadrillaDia: manoObra && manoObra.costoCuadrillaDia, cuadrillaCalculada: manoObra && manoObra.cuadrilla, cuadrillaLabel: manoObra && manoObra.label };
    },
