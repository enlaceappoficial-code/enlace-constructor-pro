"use strict";

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2] || path.join(__dirname, "..", "src", "assets", "index.js");
let text = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

function replaceOnce(source, before, after, label) {
  const at = source.indexOf(before);
  if (at < 0) throw new Error(`No se encontro: ${label}`);
  if (source.indexOf(before, at + before.length) >= 0) throw new Error(`Coincidencia ambigua: ${label}`);
  return source.slice(0, at) + after + source.slice(at + before.length);
}

function transformSegment(source, startMarker, endMarker, transform, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`Segmento no encontrado: ${label}`);
  const segment = source.slice(start, end);
  const updated = transform(segment);
  if (updated === segment) throw new Error(`Segmento sin cambios: ${label}`);
  return source.slice(0, start) + updated + source.slice(end);
}

const oldCalculator = `    li = (t, i) => {
      if (t.esSubcontrato) {
        var r = parseFloat(t.precioSubcontrato) || 0,
          n = (r * (parseFloat(t.pctGG) || 0)) / 100,
          utilidad = ((r + n) * (parseFloat(t.pctUtilidad) || 0)) / 100;
        return {
          matTotal: 0,
          moTotal: 0,
          ggTotal: n,
          utilTotal: utilidad,
          precioFinal: Math.round(r + n + utilidad),
          base: r,
        };
      }
      var l = (t.materiales || []).reduce((h, j) => {
          var F = i.find((g) => g.id === j.materialId);
          return h + (F ? F.precio : 0) * (parseFloat(j.cantidad) || 0);
        }, 0),
        o = parseFloat(t.precioMO) || 0,
        s = o > 0 ? o : (l * (parseFloat(t.pctMO) || 0)) / 100,
        m = ((l + s) * (parseFloat(t.pctGG) || 0)) / 100,
        p = l + s + m,
        C = (p * (parseFloat(t.pctUtilidad) || 0)) / 100,
        b = Math.round(p + C);
      return {
        matTotal: l,
        moTotal: s,
        ggTotal: m,
        utilTotal: C,
        precioFinal: b,
        base: l,
      };
    },
`;

const newCalculator = `    calculaMO = (t, i) => {
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
      return p > 0 ? { total: p / r, costoCuadrillaDia: p, cuadrilla: o, label: o.map((b) => \`\${b.cantidad} \${b.rol}\`).join(" + ") } : null;
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
        etiquetaMO = o > 0 ? "Precio manual" : manoObra ? "Jornales / rendimiento" : \`Porcentaje \${parseFloat(t.pctMO) || 0}%\`;
      return { matTotal: l, moTotal: s, ggTotal: m, utilTotal: C, precioFinal: b, base: l, moSource: fuenteMO, moLabel: etiquetaMO, costoCuadrillaDia: manoObra && manoObra.costoCuadrillaDia, cuadrillaCalculada: manoObra && manoObra.cuadrilla, cuadrillaLabel: manoObra && manoObra.label };
    },
`;

text = replaceOnce(text, oldCalculator, newCalculator, "calculadora APU");

text = transformSegment(text, "  function Hf({", "  function $f({", (segment) => {
  segment = segment.replace("    setToast: o,\n", "    setToast: o,\n    cfg: cfgApu,\n");
  segment = segment.replaceAll("li(_, r)", "li(_, r, cfgApu)");
  segment = segment.replace("li(he, r).precioFinal", "li(he, r, cfgApu).precioFinal");
  segment = segment.replace("        r,\n      );", "        r,\n        cfgApu,\n      );");
  segment = segment.replace('label: "Mano de Obra (" + _.pctMO + "%)"', 'label: "Mano de Obra - " + ue.moLabel');
  segment = segment.replace('"Mano de Obra (" + b.pctMO + "%)"', '"Mano de Obra - " + Q.moLabel');
  return segment;
}, "pantalla APU");

text = transformSegment(text, "  function Yf({", "  function Jf({", (segment) => {
  segment = segment.replace("    customData: cd,\n", "    customData: cd,\n    cfg: cfgModal,\n");
  const formula = /    var v = s[\s\S]*?      R = \(y\) =>/;
  const replacement = `    var materialesActivos = s.filter((y) => y._activo && y._mat).map((y) => ({ materialId: y.materialId, cantidad: y.cantidad })),
      calculoModal = li(u(d({}, i), { materiales: materialesActivos, pctMO: p, pctGG: b, pctUtilidad: j, rendimiento: g, dotacion: B }), r, cfgModal),
      v = calculoModal.matTotal,
      x = calculoModal.moTotal,
      f = calculoModal.ggTotal,
      I = v + x + f,
      D = calculoModal.utilTotal,
      k = calculoModal.precioFinal,
      R = (y) =>`;
  if (!formula.test(segment)) throw new Error("Formula modal no encontrada");
  segment = segment.replace(formula, replacement);
  segment = segment.replace("[`MO (${p}%)`, x", "[`MO - ${calculoModal.moLabel}`, x");
  return segment;
}, "modal ajuste APU");

text = transformSegment(text, "  function kg({", "  var si =", (segment) => segment.replace("      setToast: C,\n", "      setToast: C,\n      cfg: s,\n"), "wrapper APU");
text = transformSegment(text, "  function Pg({", "  function Tg({", (segment) => segment.replace("li(le, r)", "li(le, r, l)"), "constructor oferta");
text = transformSegment(text, "  function Tg({", "  function Rg({", (segment) => segment.replace("li(U, r)", "li(U, r, l)"), "analizador oferta");
text = transformSegment(text, "  function lg({", "  function sg(", (segment) => {
  segment = segment.replace("li(T, l || [])", "li(T, l || [], r)");
  segment = segment.replace("            setMateriales: setMateriales,\n", "            setMateriales: setMateriales,\n            cfg: r,\n");
  segment = segment.replaceAll("li(je, l || [])", "li(je, l || [], r)");
  return segment;
}, "formulario presupuesto");
text = replaceOnce(text, "li(Ht, j || [])", "li(Ht, j || [], l)", "sincronizacion presupuesto");

fs.writeFileSync(filePath, text, "utf8");
console.log("Parche de mano de obra por jornales aplicado.");
