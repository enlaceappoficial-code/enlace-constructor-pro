/*
 * Validación local de licencia y panel de planes
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 56372-56820 ===== */
  var Fe = {
      starter: {
        label: "Starter",
        color: "#10b981",
        precio: 19990,
        modules: ["dashboard", "new", "history", "clients", "config"],
        desc: "Pago único · Plan base para comenzar",
        limite: { presupuestos: 30, historialDias: 30 },
      },
      basico: {
        label: "Básico",
        color: "#34d399",
        precio: 59990,
        anual: !0,
        modules: [
          "dashboard",
          "new",
          "history",
          "clients",
          "config",
          "documentos",
        ],
        desc: "Plan anual · Presupuestos + Clientes + PDF + Contratos",
      },
      constructor: {
        label: "Constructor",
        color: "#38bdf8",
        precio: 89990,
        anual: !0,
        modules: [
          "dashboard",
          "new",
          "history",
          "clients",
          "config",
          "documentos",
          "catalog",
          "materiales",
          "proveedores",
          "apu",
        ],
        desc: "Plan anual · Básico + APU + Catálogo + Materiales",
      },
      pro: {
        label: "Pro",
        color: "#a78bfa",
        precio: 129990,
        anual: !0,
        modules: [
          "dashboard",
          "new",
          "history",
          "clients",
          "config",
          "documentos",
          "catalog",
          "materiales",
          "proveedores",
          "apu",
          "lista",
          "cubicacion",
          "gantt",
          "informe",
          "calendario",
        ],
        desc: "Plan anual · Constructor + Cubicación + Gantt + Documentos + Calendario",
      },
      plus: {
        label: "Plus",
        color: "#f5a020",
        precio: 179990,
        anual: !0,
        modules: [
          "dashboard",
          "new",
          "history",
          "clients",
          "config",
          "documentos",
          "catalog",
          "materiales",
          "proveedores",
          "apu",
          "lista",
          "cubicacion",
          "gantt",
          "informe",
          "calendario",
          "licitaciones",
          "indices",
        ],
        desc: "Plan anual · Pro + Licitaciones Mercado Público",
      },
      procloud: {
        label: "Pro Cloud",
        color: "#3b82f6",
        precio: 24990,
        modules: [
          "dashboard",
          "new",
          "history",
          "clients",
          "config",
          "documentos",
          "catalog",
          "materiales",
          "proveedores",
          "apu",
          "lista",
          "cubicacion",
          "gantt",
          "informe",
          "calendario",
          "licitaciones",
          "indices",
        ],
        desc: "Mensual · Todo Plus + soporte y actualizaciones",
        suscripcion: !0,
      },
    },
    wr = ["starter", "basico", "constructor", "pro", "plus", "procloud"],
    Bg = {
      catalog: "constructor",
      materiales: "constructor",
      proveedores: "constructor",
      apu: "constructor",
      lista: "pro",
      cubicacion: "pro",
      gantt: "pro",
      informe: "pro",
      calendario: "pro",
      documentos: "basico",
      licitaciones: "plus",
    },
    Up = {
      carta: "constructor",
      resumen: "constructor",
      negociacion: "constructor",
      contrato: "basico",
      informe: "pro",
      desglose: "basico",
      dotacion: "basico",
    };
  function Gt(t, i) {
    if (!t) {
      try {
        const r = "enlace_constructor_pro_v1_trial_start_v1";
        let f = localStorage.getItem(r);
        f || ((f = String(Date.now())), localStorage.setItem(r, f));
        const n = parseInt(f, 10);
        if (!isNaN(n)) {
          const l = n + 864e5 * 10,
            o = l - Date.now(),
            s = o > 0,
            m = Math.max(0, Math.ceil(o / 864e5)),
            p = new Date(l).toISOString().split("T")[0];
          return {
            valid: !0,
            expired: !s,
            version: "starter",
            dias: m,
            fechaStr: p,
            trial: !0,
          };
        }
      } catch (r) {}
      return { valid: !1, expired: !0, version: "starter", dias: -1 };
    }
    var r = t.toUpperCase().trim();
    if (r.startsWith("ECP-")) {
      var f = r.split("-");
      if (f.length < 4)
        return { valid: !1, expired: !0, version: "starter", dias: -1 };
      var n = f[1],
        l = f[2],
        o = f.slice(3).join("-"),
        s = "ECPv2#B7k$mP9@vX",
        m = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ",
        p = ($) => {
          if ((($ = Math.abs(Math.floor($))), !$)) return "0";
          let ee = "";
          for (; $;) ((ee = m[$ % 34] + ee), ($ = Math.floor($ / 34)));
          return ee;
        },
        C = ($) => {
          let ee = 0;
          for (const Y of $.toUpperCase()) ee = ee * 34 + m.indexOf(Y);
          return ee;
        },
        b = ($) => {
          let ee = 5381;
          for (let Y = 0; Y < $.length; Y++)
            ee = ((ee << 5) + ee + $.charCodeAt(Y)) & 4294967295;
          return ee;
        },
        h = p(Math.abs(b(n + s + o)) % 34 ** 4).padStart(4, "0");
      if (l !== h)
        return {
          valid: !1,
          expired: !0,
          version: "starter",
          dias: -1,
          reason: "adulterado",
        };
      var j = {
          1: "starter",
          2: "basico",
          3: "constructor",
          4: "pro",
          5: "plus",
          6: "procloud",
        },
        F = C(n),
        g = Math.floor(F / 1e5),
        z = F % 1e5,
        D = j[g] || "basico",
        B = new Date("2025-01-01T00:00:00"),
        y = new Date(B.getTime() + z * 864e5);
      if (o !== "ENLACE") {
        var w = i
          ? i
              .replace(/[^0-9]/g, "")
              .slice(0, -1)
              .toUpperCase()
              .slice(-8)
          : "";
        if (w !== o)
          return {
            valid: !1,
            expired: !1,
            version: "starter",
            dias: -1,
            reason: "rut_mismatch",
          };
      }
      var v = new Date(),
        x = Math.floor((y - v) / 864e5),
        k = y.toISOString().split("T")[0];
      return { valid: !0, expired: x < 0, version: D, dias: x, fechaStr: k };
    }
    var f = r.split("-");
    if (f.length < 5)
      return { valid: !1, expired: !0, version: "basico", dias: -1 };
    var I = {
        STARTER: "starter",
        BASICO: "basico",
        CONSTRUCTOR: "constructor",
        PRO: "pro",
        PLUS: "plus",
        PROCLOUD: "plus",
        DEMO: "pro",
      },
      D = I[f[0]] || null;
    if (!D) return { valid: !1, expired: !0, version: "basico", dias: -1 };
    var k = f[1] + "-" + f[2] + "-" + f[3],
      R = f.slice(4).join("-"),
      K = i ? i.replace(/[^0-9]/g, "").slice(0, -1) : "";
    if (R !== "ENLACE" && R !== K)
      return {
        valid: !1,
        expired: !1,
        version: "starter",
        dias: -1,
        reason: "rut_mismatch",
      };
    var y = new Date(k + "T23:59:59"),
      P = Math.floor((y - new Date()) / 864e5);
    return { valid: !0, expired: P < 0, version: D, dias: P, fechaStr: k };
  }
  function Lg({ cfg: t, onActivate: i }) {
    const [r, n] = Re.useState(""),
      [l, o] = Re.useState("");
    var s = () => {
      var m = Gt(r, t && t.rut);
      if (!m.valid) {
        if (m.reason === "rut_mismatch") {
          o(
            "El RUT no coincide con este código. Corrige el RUT en Configuración y vuelve a intentar.",
          );
          return;
        }
        o("Código inválido. Verifica que copiaste el código completo.");
        return;
      }
      if (m.expired) {
        o(`Código vencido (${m.fechaStr}). Solicita uno nuevo.`);
        return;
      }
      (i(r, m), o(""));
    };
    return e.jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(6,13,30,.97)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      children: e.jsxs("div", {
        style: { maxWidth: 460, width: "100%", padding: "0 20px" },
        children: [
          e.jsxs("div", {
            style: { textAlign: "center", marginBottom: 32 },
            children: [
              e.jsx("div", {
                style: { fontSize: 48, marginBottom: 8 },
                children: "🔐",
              }),
              e.jsx("div", {
                style: {
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f5a020",
                  marginBottom: 6,
                },
                children: "Enlace Constructor Pro",
              }),
              e.jsx("div", {
                style: { fontSize: 14, color: "#8892a4" },
                children: "Tu prueba gratuita de 10 dias ha finalizado.",
              }),
              e.jsx("div", {
                style: { fontSize: 13, color: "#8892a4", marginTop: 4 },
                children:
                  "Para continuar, solicita tu codigo si eres parte de la Red Enlace o compra tu licencia y pega el codigo recibido.",
              }),
            ],
          }),
          e.jsxs("div", {
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "24px",
            },
            children: [
              e.jsx("div", {
                style: { fontSize: 13, color: "#8892a4", marginBottom: 8 },
                children: "Código de activación",
              }),
              e.jsx("input", {
                style: {
                  width: "100%",
                  background: a.sb,
                  border: `1px solid ${a.border}`,
                  borderRadius: 7,
                  padding: "10px 12px",
                  color: a.text,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                },
                placeholder: "Ej: ECP-00CR5B-548G-ENLACE",
                value: r,
                onChange: (m) => n(m.target.value),
                onKeyDown: (m) => m.key === "Enter" && s(),
              }),
              l &&
                e.jsx("div", {
                  style: { marginTop: 8, fontSize: 13, color: "#f87171" },
                  children: l,
                }),
              e.jsx("button", {
                style: {
                  marginTop: 14,
                  width: "100%",
                  padding: "11px",
                  background: "#f5a020",
                  color: "#000",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                },
                onClick: s,
                children: "✅ Activar",
              }),
              e.jsx("div", {
                style: {
                  marginTop: 16,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#8892a4",
                },
                children: "📞 +56 9 4127 8725 · info@redenlace.cl",
              }),
            ],
          }),
        ],
      }),
    });
  }
  function Dg({ l: t, setL: i, compact: r = !1 }) {
    const [n, l] = V(t.licenciaCodigo || ""),
      [o, s] = V("");
    var m = Gt(t.licenciaCodigo, t.rut),
      p = (m.valid && !m.expired && t.version) || "starter",
      C = Fe[p] || Fe.starter,
      b = () => {
        var h = n
            .trim()
            .toUpperCase()
            .split("")
            .filter((F) => "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789-#@$".includes(F))
            .join(""),
          j = Gt(h, t.rut);
        if (!j.valid) {
          if (j.reason === "rut_mismatch") {
            s(
              "⚠️ El RUT no coincide con este código. Corrige el RUT (en Configuración) y vuelve a intentar.",
            );
            return;
          }
          s("❌ Código inválido. Verifica que copiaste el código completo.");
          return;
        }
        if (j.expired) {
          s("⚠️ Código vencido. Solicita uno nuevo.");
          return;
        }
        (i(u(d({}, t), { licenciaCodigo: h, version: j.version })),
          s(
            "✅ Activado — " +
              Fe[j.version].label +
              " válido por " +
              j.dias +
              " días",
          ));
      };
    return e.jsxs("div", {
      style: u(d({}, c.card), {
        marginBottom: 10,
        border: "1px solid " + C.color + "30",
      }),
      children: [
        e.jsx("div", {
          style: {
            fontSize: 14,
            fontWeight: 700,
            color: a.text,
            marginBottom: 14,
          },
          children: "🔑 Licencia y Plan",
        }),
        e.jsxs("div", {
          style: {
