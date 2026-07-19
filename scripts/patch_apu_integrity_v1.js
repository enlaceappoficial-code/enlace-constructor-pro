const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let source = fs.readFileSync(filePath, "utf8");
const eol = source.includes("\r\n") ? "\r\n" : "\n";
const block = (value) => value.replace(/\n/g, eol);

function replaceOnce(label, before, after) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`${label}: no se encontro el bloque esperado`);
  if (source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${label}: el bloque aparece mas de una vez`);
  }
  source = source.slice(0, first) + after + source.slice(first + before.length);
}

replaceOnce(
  "estado selector APU",
  block(`    const [C, b] = V(""),
      [h, j] = V("Todas");`),
  block(`    const [C, b] = V(""),
      [h, j] = V("Todas"),
      [apuChoice, setApuChoice] = V({});`),
);

replaceOnce(
  "alternativas APU por partida",
  block(`                  var x = z.has(v.id),
                    f =
                      r &&
                      r.find(
                        (I) =>
                          I.catalogId === v.id &&
                          !I.esSubcontrato &&
                          I.materiales &&
                          I.materiales.length > 0,
                      );`),
  block(`                  var x = z.has(v.id),
                    apuLinks = (r || []).filter(
                      (I) =>
                        I.catalogId === v.id &&
                        !I.esSubcontrato &&
                        ((I.materiales && I.materiales.length > 0) ||
                          parseFloat(I.precioMO) > 0),
                    ),
                    selectedApuId = parseInt(apuChoice[v.id]),
                    f = apuLinks.find((I) => I.id === selectedApuId) || apuLinks[0];`),
);

replaceOnce(
  "badge alternativas APU",
  `                                        children: "APU",`,
  `                                        children: apuLinks.length > 1 ? apuLinks.length + " APUs" : "APU",`,
);

replaceOnce(
  "selector visual APU",
  block(`                        e.jsx("button", {
                          style: u(d({}, s.btn(x ? "b" : "g")), {`),
  block(`                        apuLinks.length > 1 &&
                          e.jsx("select", {
                            value: f.id,
                            onClick: (I) => I.stopPropagation(),
                            onChange: (I) =>
                              setApuChoice((D) =>
                                u(d({}, D), { [v.id]: I.target.value }),
                              ),
                            style: u(d({}, s.sel), {
                              width: "100%",
                              padding: "5px 8px",
                              fontSize: 10,
                              marginTop: 7,
                            }),
                            children: apuLinks.map((I) =>
                              e.jsx("option", { value: I.id, children: I.nombre }, I.id),
                            ),
                          }),
                        e.jsx("button", {
                          style: u(d({}, s.btn(x ? "b" : "g")), {`),
);

replaceOnce(
  "usar APU escogido",
  `                          onClick: () => l(v),`,
  `                          onClick: () => l(v, f),`,
);

replaceOnce(
  "recibir APU escogido",
  block(`      le = (W) => {
        var T =
            n &&
            n.find(
              (q) =>
                q.catalogId === W.id &&
                !q.esSubcontrato &&
                q.materiales &&
                q.materiales.length > 0,
            ),`),
  block(`      le = (W, apuElegido) => {
        var T =
            apuElegido ||
            (n || []).find(
              (q) =>
                q.catalogId === W.id &&
                !q.esSubcontrato &&
                ((q.materiales && q.materiales.length > 0) ||
                  parseFloat(q.precioMO) > 0),
            ),`),
);

replaceOnce(
  "materiales canonicos",
  "          de = Qi.map((pe) => (ae.has(pe.id) ? ae.get(pe.id) : pe)),",
  block(`          de = Qi.map((pe) => {
            var guardado = ae.get(pe.id);
            var nombreGuardado = String((guardado && guardado.nombre) || "")
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            var nombreCanonico = String(pe.nombre || "")
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            var mismaIdentidad = nombreGuardado === nombreCanonico;
            var precioGuardado = Number(guardado && guardado.precio);
            var precioConfiable =
              mismaIdentidad &&
              Number.isFinite(precioGuardado) &&
              Boolean(guardado._precioUsuario || guardado.fechaActualizacion);
            var reparado = u(d({}, pe), {
              precio: precioConfiable ? precioGuardado : pe.precio,
              uc: mismaIdentidad && guardado.uc ? guardado.uc : pe.uc,
            });
            if (guardado.historialPrecios)
              reparado.historialPrecios = guardado.historialPrecios;
            if (guardado.fechaActualizacion)
              reparado.fechaActualizacion = guardado.fechaActualizacion;
            if (
              !precioConfiable &&
              Number.isFinite(precioGuardado) &&
              precioGuardado !== pe.precio
            )
              reparado._precioAnterior = precioGuardado;
            return reparado;
          }),`),
);

replaceOnce(
  "marcar precio editado",
  block(`                    precio: A,
                    fechaActualizacion: new Date().toISOString().split("T")[0],`),
  block(`                    precio: A,
                    _precioUsuario: !0,
                    fechaActualizacion: new Date().toISOString().split("T")[0],`),
);

replaceOnce(
  "formulario precio MO",
  block(`        precioSubcontrato: "",
        pctMO: Ip[s[0]] || 50,`),
  block(`        precioSubcontrato: "",
        precioMO: "",
        pctMO: Ip[s[0]] || 50,`),
);

replaceOnce(
  "editar precio MO",
  block(`            precioSubcontrato: _.precioSubcontrato || "",
            pctMO: _.pctMO,`),
  block(`            precioSubcontrato: _.precioSubcontrato || "",
            precioMO: _.precioMO || "",
            pctMO: _.pctMO,`),
);

replaceOnce(
  "validar APU sin costo",
  block(`          return;
        }
        var _ = {`),
  block(`          return;
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
        var _ = {`),
);

replaceOnce(
  "guardar precio MO",
  block(`          precioSubcontrato: parseFloat(b.precioSubcontrato) || 0,
          pctMO: parseFloat(b.pctMO) || 0,`),
  block(`          precioSubcontrato: parseFloat(b.precioSubcontrato) || 0,
          precioMO: parseFloat(b.precioMO) || 0,
          pctMO: parseFloat(b.pctMO) || 0,`),
);

replaceOnce(
  "utilidad de subcontrato",
  block(`        var r = parseFloat(t.precioSubcontrato) || 0,
          n = (r * (parseFloat(t.pctGG) || 0)) / 100;
        return {
          matTotal: 0,
          moTotal: 0,
          ggTotal: n,
          utilTotal: 0,
          precioFinal: r + n,
          base: r,
        };`),
  block(`        var r = parseFloat(t.precioSubcontrato) || 0,
          n = (r * (parseFloat(t.pctGG) || 0)) / 100,
          utilidad = ((r + n) * (parseFloat(t.pctUtilidad) || 0)) / 100;
        return {
          matTotal: 0,
          moTotal: 0,
          ggTotal: n,
          utilTotal: utilidad,
          precioFinal: Math.round(r + n + utilidad),
          base: r,
        };`),
);

replaceOnce(
  "precio MO en ajuste",
  block(`      x = (v * (parseFloat(p) || 0)) / 100,
      f = ((v + x) * (parseFloat(b) || 0)) / 100,`),
  block(`      precioMOBase = parseFloat(i.precioMO) || 0,
      x = precioMOBase > 0 ? precioMOBase : (v * (parseFloat(p) || 0)) / 100,
      f = ((v + x) * (parseFloat(b) || 0)) / 100,`),
);

replaceOnce(
  "recordar APU seleccionado",
  block(`              _customGG: pGG,
              _customUtil: pUtil,
              _tipoCosto: "auto",`),
  block(`              _customGG: pGG,
              _customUtil: pUtil,
              _apuId: k && k.apu ? k.apu.id : re[W]._apuId,
              _apuNombre: k && k.apu ? k.apu.nombre : re[W]._apuNombre,
              _tipoCosto: "auto",`),
);

replaceOnce(
  "preservar metadatos APU",
  block(`        var _ = {
          id: j !== null ? j : Math.max(0, ...t.map((xe) => xe.id)) + 1,`),
  block(`        var anterior = j !== null ? t.find((xe) => xe.id === j) : null,
          _ = u(d({}, anterior || {}), {
          id: j !== null ? j : Math.max(0, ...t.map((xe) => xe.id)) + 1,`),
);

replaceOnce(
  "cerrar metadatos APU",
  block(`                : ue.bloqueado)) ||
            !1,
        };
        if (`),
  block(`                : ue.bloqueado)) ||
            !1,
        });
        if (`),
);

fs.writeFileSync(filePath, source, "utf8");
console.log("OK patch_apu_integrity_v1");
