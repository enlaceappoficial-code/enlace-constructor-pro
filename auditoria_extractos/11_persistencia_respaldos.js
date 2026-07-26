/*
 * Persistencia local y respaldos
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 59685-59855 ===== */
  var _p = "enlace_constructor_pro_v1_backups",
    rs = 7;
  function Hp() {
    try {
      return JSON.parse(localStorage.getItem(_p) || "[]");
    } catch (t) {
      return [];
    }
  }
  function $p(t) {
    try {
      localStorage.setItem(_p, JSON.stringify(t));
    } catch (i) {}
  }
  function Vp(t, i) {
    var r = Hp(),
      n = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        etiqueta: i || "Manual",
        data: t,
        stats: {
          presupuestos: (t.budgets || []).length,
          clientes: (t.clients || []).length,
          materiales: (t.materiales || []).length,
          apus: (t.apus || []).length,
        },
      },
      l = [n, ...r].slice(0, rs);
    return ($p(l), l);
  }
  function _g({
    cfg: t,
    allData: i,
    onRestore: r,
    setToast: n,
    materiales: l,
    setMateriales: o,
    apus: s,
    setApus: m,
    onClearAll: p,
    onImportUpdatePack: Zu,
    updateHistory: Xu,
  }) {
    var [C, b] = V(Hp),
      [h, j] = V(null),
      [F, g] = V(() => {
        try {
          return localStorage.getItem("ecp_backup_auto") === "true";
        } catch (y) {
          return !0;
        }
      }),
      [z, B] = V(() => {
        try {
          const y = parseInt(localStorage.getItem("ecp_backup_hours") || "24");
          return [12, 24, 168, 360].includes(y) ? y : 24;
        } catch (y) {
          return 24;
        }
      }),
      [w, v] = V(() => {
        try {
          return localStorage.getItem("ecp_backup_last") || null;
        } catch (y) {
          return null;
        }
      });
    Re.useEffect(() => {
      if (F) {
        var y = Date.now(),
          P = w ? new Date(w).getTime() : 0,
          A = (y - P) / (1e3 * 60 * 60);
        if (A >= z) {
          var S = Vp(i, "Automático");
          b(S);
          var O = new Date().toISOString();
          (localStorage.setItem("ecp_backup_last", O), v(O));
        }
      }
    }, []);
    var x = () => {
        var y = Vp(i, "Manual");
        (b(y), n("✅ Respaldo creado correctamente"));
      },
      f = (y) => {
        var P = new Blob([JSON.stringify(y.data, null, 2)], {
            type: "application/json",
          }),
          A = URL.createObjectURL(P),
          S = document.createElement("a");
        ((S.href = A),
          (S.download =
            "ECP_Backup_" + y.fecha.split("T")[0] + "_" + y.etiqueta + ".json"),
          S.click(),
          URL.revokeObjectURL(A));
      },
      I = (y) => {
        (r(y.data),
          j(null),
          n(
            "✅ Datos restaurados desde respaldo del " +
              new Date(y.fecha).toLocaleDateString("es-CL"),
          ));
      },
      D = (y) => {
        var P = C.filter((A) => A.id !== y);
        ($p(P), b(P), n("Respaldo eliminado"));
      },
      k = (y) => {
        var P = y.target.files[0];
        if (P) {
          var A = new FileReader();
          ((A.onload = (S) => {
            try {
              var O = JSON.parse(S.target.result);
              if (!O.budgets && !O.cfg) {
                n("⚠️ Archivo no válido");
                return;
              }
              (r(O), n("✅ Datos importados desde archivo"));
            } catch (U) {
              n("⚠️ Error al leer el archivo");
            }
          }),
            A.readAsText(P));
        }
      },
      Yu = (y) => {
        var P = y.target.files[0];
        if (P) {
          var A = new FileReader();
          ((A.onload = (S) => {
            try {
              var O = JSON.parse(S.target.result);
              if (O.tipo !== "ecp_update_pack") {
                n("⚠️ Ese archivo no es un paquete de actualización de catálogo");
                return;
              }
              Zu(O);
            } catch (U) {
              n("⚠️ Error al leer el archivo");
            }
          }),
            A.readAsText(P));
        }
      },
      R = (y) => {
        var P = new Date(y);
        return (
          P.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          " " +
          P.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
        );
      },
      K = (() => {
        try {
          var y = 0;
          for (let P in localStorage)
            P.startsWith("enlace_constructor_pro_v1") &&
              (y += localStorage[P].length);
          return Math.round(y / 1024);
        } catch (P) {
          return 0;
        }
      })();
    return e.jsxs("div", {

/* ===== Líneas originales aproximadas 66102-66155 ===== */
  var Bn = "enlace_constructor_pro_v1";
  function pt(t, i) {
    try {
      const r = localStorage.getItem(Bn + "_" + t);
      return r ? JSON.parse(r) : i;
    } catch (r) {
      return i;
    }
  }
  function _t(t, i) {
    try {
      localStorage.setItem(Bn + "_" + t, JSON.stringify(i));
    } catch (r) {}
  }
  function firmaActualizacion(t, i) {
    var r = "ECP-UPD-2026#kL9$qW3nX",
      n = t + "|" + JSON.stringify(i) + "|" + r,
      l = 5381;
    for (var o = 0; o < n.length; o++)
      l = ((l << 5) + l + n.charCodeAt(o)) & 4294967295;
    return Math.abs(l).toString(36);
  }
  function normalizaRut(t) {
    return t
      ? String(t).replace(/[^0-9]/g, "").slice(0, -1).toUpperCase().slice(-8)
      : "";
  }
  function mergeUpdatePack(t, i) {
    var r = new Set((i || []).map((o) => o.id)),
      n = (t || []).filter((o) => !r.has(o.id));
    return [...(i || []), ...n];
  }
  function mergeMaterialesUpdatePack(t, i) {
    var r = new Map((t || []).map((o) => [o.id, o])),
      n = new Set((i || []).map((o) => o.id)),
      l = (i || []).map((o) => {
        var s = r.get(o.id);
        return s && s._precioUsuario ? s : o;
      }),
      f = (t || []).filter((o) => !n.has(o.id));
    return [...l, ...f];
  }
  function as() {
    try {
      [
        "cfg",
        "budgets",
        "clients",
        "catalog",
        "materiales",
        "apus",
        "licitaciones",
      ].forEach((t) => localStorage.removeItem(Bn + "_" + t));
    } catch (t) {}

/* ===== Líneas originales aproximadas 74608-74870 ===== */
    const [l, o] = V(() => {
        var H = pt("cfg", Ct),
          ae = d(d({}, Ct), H);
        return (
          (!ae.ggItems || ae.ggItems.length === 0) && (ae.ggItems = Ct.ggItems),
          (!ae.moItems ||
            ae.moItems.length === 0 ||
            ae.moItems.every((N) => !N.jornal || N.jornal === 0)) &&
            (ae.moItems = Ct.moItems),
          (!ae.utilItems ||
            ae.utilItems.length === 0 ||
            ae.utilItems.every((N) => !N.pct || N.pct === 0)) &&
            (ae.utilItems = Ct.utilItems),
          (!ae.pctMO || ae.pctMO === 0) && (ae.pctMO = Ct.pctMO),
          (!ae.pctGG || ae.pctGG === 0) && (ae.pctGG = Ct.pctGG),
          (!ae.pctUtil || ae.pctUtil === 0) && (ae.pctUtil = Ct.pctUtil),
          ae.moFacturacionPromedio ||
            (ae.moFacturacionPromedio = Ct.moFacturacionPromedio),
          ae.ggFacturacionPromedio ||
            (ae.ggFacturacionPromedio = Ct.ggFacturacionPromedio),
          ae
        );
      }),
      [s, m] = V(() => {
        var H = pt("licitaciones", null);
        if (!H || H.length === 0) return xa;
        var ae = new Set(H.map((pe) => pe.id)),
          N = xa.filter((pe) => !ae.has(pe.id)),
          de = new Set([10, 11, 12]),
          me = H.filter((pe) => !de.has(pe.id));
        return N.length > 0 ? [...me, ...N] : me;
      }),
      [p, C] = V(() => pt("clients", Fn)),
      [b, h] = V(() => {
        var H = pt("catalog", null);
        if (!H || H.length === 0) return qi;
        var ae = new Map(qi.map((je) => [je.id, je])),
          N = new Set(qi.map((je) => je.id)),
          de = H.map((je) => {
            if (je.id === 10 && je.unidad === "m²") {
              var refTecnico = ae.get(10);
              return u(d({}, je), {
                unidad: refTecnico.unidad,
                precio: Number(je.precio) === 22e3 ? refTecnico.precio : je.precio,
                _correccionTecnica: "2026-07-19",
              });
            }
            if (N.has(je.id) && (je.precio === 0 || je.precio === void 0)) {
              var ke = ae.get(je.id);
              return ke && ke.precio > 0
                ? u(d({}, je), { precio: ke.precio })
                : je;
            }
            return je;
          }),
          me = new Set(H.map((je) => je.id)),
          pe = qi.filter((je) => !me.has(je.id)),
          he = de.filter((je) => !N.has(je.id));
        return [...de.filter((je) => N.has(je.id)), ...he, ...pe];
      }),
      [j, F] = V(() => {
        var H = pt("materiales", null);
        if (!H || H.length === 0) return Qi;
        var ae = new Map(H.map((pe) => [pe.id, pe])),
          N = new Set(Qi.map((pe) => pe.id)),
          de = Qi.map((pe) => {
            var guardado = ae.get(pe.id);
            if (!guardado) return pe;
            var nombreGuardado = String((guardado && guardado.nombre) || "")
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[̀-ͯ]/g, "");
            var nombreCanonico = String(pe.nombre || "")
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[̀-ͯ]/g, "");
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
            if (guardado._precioUsuario) reparado._precioUsuario = !0;
            if (
              !precioConfiable &&
              Number.isFinite(precioGuardado) &&
              precioGuardado !== pe.precio
            )
              reparado._precioAnterior = precioGuardado;
            return reparado;
          }),
          me = H.filter((pe) => !N.has(pe.id));
        return [...de, ...me];
      }),
      [g, z] = V(() => {
        const H = pt("apus", null);
        if (!H || H.length === 0) return Ai;
        const ae = new Map(H.map((pe) => [pe.id, pe])),
          N = new Set(Ai.map((pe) => pe.id)),
          firmasAntiguas = {
            1: "26:1.05|36:0.18|39:0.25|22:0.4",
            2: "27:1.05|36:0.18|39:0.25|22:0.4",
            12: "51:3.2|55:3.2|95:1.05|80:0.18|87:0.14|85:0.08|86:0.12",
            13: "50:3|54:3|97:1.05|81:0.38|70:0.1|85:0.09|86:0.14|88:0.5|89:0.4",
            14: "50:3|54:3|80:0.36|70:0.1|85:0.08|86:0.12",
            15: "51:3.2|55:3.2|97:1.05|82:0.38|70:0.12|85:0.09|86:0.14",
            17: "61:1.2|58:2.5|55:0.8|106:1.1|69:0.05|114:0.02|113:0.08|110:0.15",
            30: "121:1.1|130:0.36|133:0.06|135:0.04",
            45: "144:1.1|145:0.25|146:0.1|213:0.02",
            50: "204:5|205:3|206:1|212:3|213:0.05",
            51: "204:5|205:3|206:1|212:3|213:0.05",
            100: "",
            103: "",
            123: "272:0.7|273:0.3|275:0.015",
            141: "301:1.05|302:0.05|303:0.15|304:0.05",
            142: "301:1.05|302:0.05|303:0.15|304:0.05|305:0.1",
          },
          firmasCorreccionDirecta = {
            26: "126:0.18|121:2.2|124:0.5|106:1.12|114:0.022|113:0.08|110:0.18|133:0.08|131:1.2",
            65: "50:3|54:3|97:1.05|80:0.36|70:0.1|85:0.09|86:0.12",
            117: "270:1.05|273:52|274:26|275:1.8|276:3.5|278:0.5|279:40",
          },
          firmasMetalconAnterior = {
            10: "52:3.8|56:3.8|70:0.06|71:0.04|129:0.45|33:0.28|20:0.04|100:1.1",
            11: "53:3.8|57:3.8|70:0.06|71:0.04|129:0.45|33:0.28|20:0.04|96:1.05",
            12: "429:3.2|430:3.2|95:1.05|80:0.18|87:0.14|85:0.08|86:0.12",
            13: "431:3|432:3|97:1.05|81:0.38|70:0.1|85:0.09|86:0.14|88:0.5|89:0.4",
            14: "431:3|432:3|80:0.36|70:0.1|85:0.08|86:0.12",
            15: "429:3.2|430:3.2|97:1.05|82:0.38|70:0.12|85:0.09|86:0.14",
            19: "80:0.36|54:0.85|55:0.4|85:0.12|86:0.05|87:0.08",
            20: "54:0.85|55:0.4|80:0.37|81:0.37|85:0.15|86:0.06|87:0.1|88:0.3|89:0.2",
            21: "54:0.85|55:0.4|82:0.36|85:0.12|86:0.05|87:0.08",
            65: "431:3|432:3|97:1.05|80:0.36|70:0.1|85:0.09|86:0.12",
            66: "54:0.85|55:0.4|80:0.36|85:0.15|86:0.1|87:0.08|90:0.15",
          },
          firmaTecnica = (pe) =>
            (pe.materiales || [])
              .map((item) => `${item.materialId}:${Number(item.cantidad)}`)
              .join("|"),
          de = Ai.map((pe) => {
            const guardado = ae.get(pe.id);
            if (!guardado) return pe;
            const base = Object.assign({}, pe, guardado, { id: pe.id }),
              firmaAnterior = firmasAntiguas[pe.id],
              esVersionAnterior =
                firmaAnterior !== void 0 &&
                firmaTecnica(guardado) === firmaAnterior &&
                (!(pe.id === 100 || pe.id === 103) ||
                  !(parseFloat(guardado.precioMO) > 0)),
              firmaDirecta = firmasCorreccionDirecta[pe.id],
              esCorreccionDirecta =
                firmaDirecta !== void 0 &&
                firmaTecnica(guardado) === firmaDirecta &&
                (pe.id !== 117 || Number(guardado.rendimiento) === 20),
              firmaMetalcon = firmasMetalconAnterior[pe.id],
              esMetalconAnterior =
                firmaMetalcon !== void 0 &&
                firmaTecnica(guardado) === firmaMetalcon;
            return esMetalconAnterior
              ? Object.assign({}, base, {
                  materiales: pe.materiales,
                  baseTecnica: pe.baseTecnica,
                  _reconstruccionMetalcon: "2026-07-19",
                })
              : esVersionAnterior
              ? u(d({}, base), {
                  unidad: pe.unidad,
                  materiales: pe.materiales,
                  ...(pe.precioMO ? { precioMO: pe.precioMO } : {}),
                  _correccionTecnica: "2026-07-19",
                })
              : esCorreccionDirecta
                ? Object.assign(
                    {},
                    base,
                    pe.id === 117
                      ? { rendimiento: pe.rendimiento }
                      : { materiales: pe.materiales },
                    { _correccionDirecta: "2026-07-19" },
                  )
                : base;
          }),
          me = H.filter((pe) => !N.has(pe.id));
        return [...de, ...me];
      }),
      [B, w] = V(() => pt("budgets", Rn));
    var v = Re.useMemo(() => {
      var H = l.validez || 30;
      return B.map((ae) => {
        if (ae.estado !== "Pendiente") return ae;
        var N = new Date(ae.fecha),
          de = Math.floor((Date.now() - N.getTime()) / (1e3 * 60 * 60 * 24));
        return de > H ? u(d({}, ae), { estado: "Vencido" }) : ae;
      });
    }, [B, l.validez]);
    const [x, f] = V("dashboard"),
      [configStartTab, setConfigStartTab] = V("identidad"),
      [I, D] = V(() => !pt("welcomeSeen", !1)),
      [k, R] = V(null),
      [K, y] = V(null),
      [P, A] = V(() => {
        try {
          return JSON.parse(localStorage.getItem("plantillas_user")) || [];
        } catch (H) {
          return [];
        }
      });
    var S = (H, ae) => {
        var N = {
            id: "u_" + Date.now(),
            nombre: "📌 " + ae,
            desc: H.descripcion || "Plantilla personalizada",
            items: (H.items || []).map((me) => ({
              desc: me.desc,
              cant: me.cant,
              unidad: me.unidad,
            })),
            esUsuario: !0,
            fecha: new Date().toLocaleDateString("es-CL"),
          },
          de = [N, ...P.slice(0, 19)];
        A(de);
        try {
          localStorage.setItem("plantillas_user", JSON.stringify(de));
        } catch (me) {}
      },
      O = (H) => {
        var ae = P.filter((N) => N.id !== H);
        A(ae);
        try {
          localStorage.setItem("plantillas_user", JSON.stringify(ae));
        } catch (N) {}
      };
    (ct(() => {
      var H = setTimeout(() => _t("cfg", l), 1500);
      return () => clearTimeout(H);
    }, [l]),
      ct(() => {
        var H = setTimeout(() => {
          var ae = new Map();
          B.forEach((N) => {
            var de = parseInt(N.id);
            (ae.has(de) && ae.delete(de), ae.set(de, N));
          });
          var me = Array.from(ae.values());
          me.length !== B.length && w(me);
          _t("budgets", me);
        }, 1500);
        return () => clearTimeout(H);
      }, [B]),
      ct(() => {
        var H = setTimeout(() => _t("clients", p), 1500);
        return () => clearTimeout(H);
