/*
 * Creación y guardado de presupuesto
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 37605-37822 ===== */
  function lg({
    clients: t,
    catalog: i,
    cfg: r,
    apus: n,
    materiales: l,
    onSave: o,
    onCancel: s,
    editing: m,
    plantillasUser: p,
    onDeletePlantillaUser: C,
    setToast: b,
    setMateriales: setMateriales,
  }) {
    var h = () => {
        const W = r.moItems || [],
          T = parseFloat(r.moFacturacionPromedio) || 3e6,
          L = W.reduce((E, M) => (parseFloat(M.jornal) || 0) * 22 + E, 0);
        return T > 0 ? Math.round((L / T) * 100 * 10) / 10 : r.pctMO || 35;
      },
      j = () => {
        const W = r.ggItems || [],
          T = parseFloat(r.ggFacturacionPromedio) || 3e6,
          L = W.reduce((E, M) => {
            const q = { mensual: 1, anual: 0.08333333333333333, por_obra: 1 };
            return E + (parseFloat(M.monto) || 0) * (q[M.periodo] || 1);
          }, 0);
        return T > 0 ? Math.round((L / T) * 100 * 10) / 10 : r.pctGG || 20;
      },
      F = () => {
        const T = (r.utilItems || []).reduce(
          (L, E) => L + (parseFloat(E.pct) || 0),
          0,
        );
        return T > 0 ? Math.round(T * 10) / 10 : r.pctUtil || 15;
      };
    const [g, z] = V(() => (m && m.pctMO != null ? m.pctMO : h())),
      [B, w] = V(() => (m && m.pctGG != null ? m.pctGG : j())),
      [v, x] = V(() => (m && m.pctUtil != null ? m.pctUtil : F()));
    [...new Set(i.map((W) => W.cat))];
    var f = () => ({
      desc: "",
      cant: 1,
      unidad: "unidad",
      precio: 0,
      _cid: "",
      _tipoCosto: "mo",
    });
    const [I, D] = V(() =>
        m
          ? {
              clienteId: m.clienteId,
              descripcion: m.descripcion,
              fecha: m.fecha,
              items: (m.items || []).map((W) =>
                u(d({}, W), {
                  _cid: W._cid || "",
                  _tipoCosto: W._tipoCosto || (W._cid ? "auto" : "mo"),
                }),
              ),
              descuento: m.descuento,
              estado: m.estado,
              notas: m.notas,
              notasInternas: m.notasInternas || m.notas || "",
              plazoEjecucion: m.plazoEjecucion || r.plazoEjecucion || 30,
              modoCosteo: m.modoCosteo || "completo",
              customId: m.id,
              licitacionIdMP: m.licitacionIdMP || "",
              licitacionOpportunityId: m.licitacionOpportunityId || "",
              licitacionNombre: m.licitacionNombre || "",
              licitacionOrganismo: m.licitacionOrganismo || "",
              _pendingClientName: m._pendingClientName || "",
              _isTenderDraft: !!m._isTenderDraft,
              sinIva: !!m.sinIva,
              hitosPago: m.hitosPago || null,
            }
          : {
              clienteId: (t[0] && t[0].id) || "",
              descripcion: "",
              fecha: Xt(),
              items: [f()],
              descuento: !1,
              estado: "Pendiente",
              notas: "",
              notasInternas: "",
              plazoEjecucion: r.plazoEjecucion || 30,
              modoCosteo: "completo",
              customId: null,
              licitacionIdMP: "",
              licitacionOpportunityId: "",
              licitacionNombre: "",
              licitacionOrganismo: "",
              _pendingClientName: "",
              _isTenderDraft: false,
              sinIva: false,
              hitosPago: null,
            },
      ),
      [k, R] = V(null),
      [K, y] = V(!1),
      [P, A] = V(null),
      [S, O] = V(!0);
    var U = (() => {
        if (!r || !r.ultimaActualizacionCatalogo) return !0;
        var W = new Date(r.ultimaActualizacionCatalogo);
        return Math.floor((new Date() - W) / (1e3 * 60 * 60 * 24)) > 90;
      })(),
      $ = t.find((W) => W.id === parseInt(I.clienteId));
    Ee(I.items, r, I.descuento, I.modoCosteo, I.sinIva);
    var ee = (W, T, L) => {
        var E = [...I.items];
        if (((E[W] = u(d({}, E[W]), { [T]: L })), T === "_cid" && L)) {
          var M = i.find((J) => J.id === parseInt(L));
          if (M) {
            ((E[W].desc = M.desc),
              (E[W].unidad = M.unidad),
              (E[W].precio = M.precio),
              (E[W]._tipoCosto = E[W]._tipoCosto || "auto"));
            var q =
              n &&
              n.find(
                (J) =>
                  J.catalogId === M.id &&
                  !J.esSubcontrato &&
                  J.materiales.length > 0,
              );
            if (q) {
              (D((J) => u(d({}, J), { items: E })),
                ["m²", "m³", "ml", "m2", "m3"].includes(M.unidad)
                  ? A({
                      idx: W,
                      unidad: M.unidad,
                      _apuPendiente: { idx: W, catItem: M, apu: q },
                    })
                  : R({ idx: W, catItem: M, apu: q }));
              return;
            }
          }
        }
        D((J) => u(d({}, J), { items: E }));
      },
      Y = (W, T, L, E, M_val, customMats, pMO, pGG, pUtil) => {
        D((J) => {
          var re = [...J.items];
          return (
            (re[W] = u(d({}, re[W]), {
              precio: T,
              _rendimiento: L,
              _dotacion: E,
              _apuMatUnit: M_val,
              _customApuMaterials: customMats,
              _customMO: pMO,
              _customGG: pGG,
              _customUtil: pUtil,
              _apuId: k && k.apu ? k.apu.id : re[W]._apuId,
              _apuNombre: k && k.apu ? k.apu.nombre : re[W]._apuNombre,
              _tipoCosto: "auto",
            })),
            u(d({}, J), { items: re })
          );
        });
        var M = k && k._fromCatalog,
          q = k && k.catItem && k.catItem.unidad;
        (R(null),
          M &&
            ["m²", "m³", "ml", "m2", "m3"].includes(q) &&
            A({ idx: W, unidad: q }));
      },
      le = (W, apuElegido) => {
        var T =
            apuElegido ||
            (n || []).find(
              (q) =>
                q.catalogId === W.id &&
                !q.esSubcontrato &&
                ((q.materiales && q.materiales.length > 0) ||
                  parseFloat(q.precioMO) > 0),
            ),
          L = u(d({}, f()), {
            _cid: String(W.id),
            desc: W.desc,
            unidad: W.unidad,
            precio: W.precio,
            _tipoCosto: "auto",
          });
        T && (L._apuMatUnit = parseFloat(li(T, l || [], r).matTotal) || 0);
        var E = [...I.items, L],
          M = E.length - 1;
        (D((q) => u(d({}, q), { items: E })),
          T && ["m²", "m³", "ml"].includes(W.unidad)
            ? A({
                idx: M,
                unidad: W.unidad,
                _apuPendiente: { idx: M, catItem: W, apu: T },
              })
            : T
              ? R({ idx: M, catItem: W, apu: T, _fromCatalog: !0 })
              : ["m²", "m³", "ml", "m2", "m3"].includes(W.unidad) &&
                A({ idx: M, unidad: W.unidad }));
      },
      Z = () => {
        if (!I.clienteId || !I.descripcion) {
          b("⚠️ Completa cliente y descripción");
          return;
        }
        if (I.items.every((W) => !W.desc)) {
          b("⚠️ Agrega al menos un ítem");
          return;
        }
        o(
          d(
            u(d({}, I), { pctMO: g, pctGG: B, pctUtil: v }),
            m && I.customId && parseInt(I.customId) !== parseInt(m.id)
              ? { _newId: parseInt(I.customId) }
              : {},
          ),
        );
      },

/* ===== Líneas originales aproximadas 38820-38970 ===== */
                            onClick: () =>
                              D((re) =>
                                u(d({}, re), { descuento: !re.descuento }),
                              ),
                            style: {
                              width: 32,
                              height: 18,
                              borderRadius: 9,
                              background: I.descuento ? a.accent : a.border,
                              position: "relative",
                              cursor: "pointer",
                            },
                            children: e.jsx("div", {
                              style: {
                                position: "absolute",
                                width: 12,
                                height: 12,
                                background: "#fff",
                                borderRadius: "50%",
                                top: 3,
                                left: I.descuento ? 17 : 3,
                                transition: "left .2s",
                              },
                            }),
                          }),
                        ],
                      }),
                      I.descuento &&
                        M > 0 &&
                        e.jsxs("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "6px 12px",
                            borderRadius: 7,
                            marginBottom: 4,
                            background: "rgba(239,68,68,.08)",
                          },
                          children: [
                            e.jsx("span", {
                              style: { fontSize: 13, color: "#f87171" },
                              children: "− Descuento aplicado",
                            }),
                            e.jsxs("span", {
                              style: {
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#f87171",
                              },
                              children: ["− ", ne(M)],
                            }),
                          ],
                        }),
                      e.jsx("div", {
                        style: {
                          height: 1,
                          background: a.border,
                          margin: "12px 0",
                        },
                      }),
                      e.jsxs("div", {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          background: a.sb,
                          border: `1px solid ${a.border}`,
                          borderRadius: 8,
                          marginBottom: 6,
                        },
                        children: [
                          e.jsx("span", {
                            style: {
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#34d399",
                            },
                            children: "TOTAL",
                          }),
                          e.jsx("span", {
                            style: {
                              fontSize: 22,
                              fontWeight: 700,
                              color: "#34d399",
                            },
                            children: ne(q),
                          }),
                        ],
                      }),
                      (typeof window.renderHitosSidebar === 'function' ? window.renderHitosSidebar(e, I, D, r, ne, J, a, c, ze, Pe, u, d, typeof Re !== "undefined" ? Re : null) :                       e.jsxs("div", {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          background: a.sb,
                          borderRadius: 7,
                          marginBottom: 14,
                        },
                        children: [
                          e.jsxs("span", {
                            style: { fontSize: 13, color: a.muted },
                            children: [
                              "Anticipo (",
                              Math.round(r.anticipo * 100),
                              "%)",
                            ],
                          }),
                          e.jsx("span", {
                            style: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#86efac",
                            },
                            children: ne(J),
                          }),
                        ],
                      })),
                      e.jsx(ze, {
                        label: "Estado",
                        children: e.jsx(Mi, {
                          value: I.estado,
                          onChange: (re) =>
                            D((Q) => u(d({}, Q), { estado: re })),
                          children: [
                            "Pendiente",
                            "Aprobado",
                            "En progreso",
                            "Completado",
                            "Rechazado",
                            "Vencido",
                          ].map((re) => e.jsx("option", { children: re }, re)),
                        }),
                      }),
                      e.jsx("button", {
                        style: u(d({}, c.btn("p")), {
                          width: "100%",
                          padding: "12px",
                          fontSize: 17,
                        }),
                        onClick: Z,
                        children: "💾 Guardar Presupuesto",
                      }),
                    ],
                  });
                })(),
              ],
            }),
          ],
        }),
      ],
    });
