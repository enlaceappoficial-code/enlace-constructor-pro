/*
 * Clientes: validación, CRUD, métricas y Excel
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 42570-42850 ===== */
  function hg({ clients: t, setClients: i, budgets: r, cfg: n, setToast: l }) {
    const [o, s] = V({
        tipo: "empresa",
        rut: "",
        nombre: "",
        contacto: "",
        email: "",
        telefono: "",
      }),
      [m, p] = V(null),
      [q, J] = V(""),
      [C, b] = V(!1),
      [h, j] = V(null),
      [F, g] = V(null),
      [sort, setSort] = V({ k: "nombre", d: 1 }),
      [fil, setFil] = V({ deuda: !1, presup: !1, sinEmail: !1, sinTel: !1 }),
      [page, setPage] = V(1),
      [pageSize, setPageSize] = V(25);
    var Qn = (I) => {
        var D = String(I || "");
        try {
          D = D.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        } catch (k) {}
        return D.toLowerCase().trim();
      },
      Rn = (I) => {
        var D = String(I || "")
          .toUpperCase()
          .replace(/[^0-9K]/g, "");
        if (D.length < 2) return "";
        var k = D.slice(0, -1),
          R = D.slice(-1);
        return k + "-" + R;
      },
      Kn = (I) => {
        var D = Rn(I);
        if (!D) return !0;
        var k = D.split("-")[0],
          R = D.split("-")[1];
        if (!k || !R) return !1;
        var K = 0,
          y = 2;
        for (var P = k.length - 1; P >= 0; P--) {
          K += parseInt(k[P], 10) * y;
          y = y === 7 ? 2 : y + 1;
        }
        var A = 11 - (K % 11),
          S = A === 11 ? "0" : A === 10 ? "K" : String(A);
        return S === R;
      },
      En = (I) =>
        String(I || "")
          .trim()
          .toLowerCase(),
      Nn = (I) => String(I || "").replace(/[^0-9]/g, ""),
      Pn = (I) => {
        var D = String(I || "").trim();
        if (!D) return "";
        var k = Nn(D);
        if (k.length === 9 && k[0] === "9") return "+56" + k;
        if (k.length === 11 && k.slice(0, 2) === "56") return "+" + k;
        if (D[0] === "+") return "+" + k;
        return k;
      },
      Mn = (I) => {
        var D = Pn(I).replace(/[^0-9]/g, "");
        return D ? "https://wa.me/" + D : "";
      },
      z = () => {
        var I = String(o.nombre || "").trim();
        if (!I) return;
        var D = o.tipo || "empresa",
          k = String(o.contacto || "").trim(),
          R = Rn(o.rut || ""),
          K = En(o.email || ""),
          y = Pn(o.telefono || "");
        if (R && !Kn(R)) return (l("⚠ RUT inválido"), void 0);
        D === "persona" && (k = I);
        var P = u(d({}, o), {
            tipo: D,
            rut: R,
            nombre: I,
            contacto: k,
            email: K,
            telefono: y,
          }),
          A = t.filter((S) => S.id !== (m == null ? void 0 : m));
        if (R && A.some((S) => Rn(S.rut || "") === R))
          return (l("⚠ Ya existe un cliente con ese RUT."), void 0);
        if (K && A.some((S) => En(S.email || "") === K))
          return (l("⚠ Ya existe un cliente con ese email."), void 0);
        var O = Nn(y);
        if (O && A.some((S) => Nn(S.telefono || "") === O))
          return (l("⚠ Ya existe un cliente con ese teléfono."), void 0);
        (m !== null
          ? (i(t.map((S) => (S.id === m ? u(d({}, P), { id: m }) : S))),
            p(null))
          : i([
              ...t,
              u(d({}, P), { id: Math.max(0, ...t.map((S) => S.id)) + 1 }),
            ]),
          s({
            tipo: "empresa",
            rut: "",
            nombre: "",
            contacto: "",
            email: "",
            telefono: "",
          }),
          setPage(1));
      },
      B = Re.useCallback(
        (I) => {
          var D = (r || []).filter((O) => O.clienteId === I),
            k = 0,
            R = 0,
            K = 0,
            y = 0,
            P = 0,
            A = 0;
          D.forEach((O) => {
            const { total: U } = Ee(O.items, n || {}, O.descuento, O.modoCosteo, O.sinIva);
            var $ = (O.pagos || []).reduce(
              (ee, Y) => ee + (parseFloat(Y.monto) || 0),
              0,
            );
            (O.estado === "Completado"
              ? (y++, (k += U), (R += $ > 0 ? Math.min($, U) : U))
              : O.estado === "En progreso" &&
                (K++, (k += U), (R += Math.min($, U))),
              O.estado === "Pendiente" && P++,
              O.estado === "Rechazado" && A++);
          });
          var S = Math.max(0, k - R);
          return {
            total: D.length,
            totalActivo: k,
            totalCobrado: R,
            deuda: S,
            enEjecucion: K,
            completados: y,
            pendientes: P,
            rechazados: A,
          };
        },
        [r, n],
      ),
      w = async () => {
        await zt(
          "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
        );
        var I = window.XLSX,
          D = I.utils.book_new(),
          k = {},
          R = "1A3A5C",
          K = "F5A020",
          y = "F5F7FA",
          P = (U, $, ee, Y, le) => {
            const Z = I.utils.encode_cell({ r: U, c: $ });
            ((k[Z] = { v: ee, t: Y }), le && (k[Z].s = le));
          },
          A = (U, $, ee) => ({
            fill: { patternType: "solid", fgColor: { rgb: U || "FFFFFF" } },
            font: $ || { sz: 10 },
            alignment: ee || { vertical: "center" },
          }),
          S = {
            top: { style: "thin", color: { rgb: "D0DCE8" } },
            bottom: { style: "thin", color: { rgb: "D0DCE8" } },
            left: { style: "thin", color: { rgb: "D0DCE8" } },
            right: { style: "thin", color: { rgb: "D0DCE8" } },
          };
        (["DIRECTORIO DE CLIENTES", "", "", ""].forEach((U, $) =>
          P(
            0,
            $,
            U,
            "s",
            A(R, { bold: !0, sz: 14, color: { rgb: "FFFFFF" } }, {}),
          ),
        ),
          [
            "",
            (n && n.empresa) || "",
            "",
            "Enlace Constructor Pro — " +
              new Date().toLocaleDateString("es-CL"),
          ].forEach((U, $) =>
            P(
              1,
              $,
              U,
              "s",
              A(
                K,
                { bold: !0, sz: 9, color: { rgb: "FFFFFF" } },
                $ === 3 ? { horizontal: "right" } : {},
              ),
            ),
          ),
          ["NOMBRE / EMPRESA", "CONTACTO", "EMAIL", "TELÉFONO"].forEach(
            (U, $) =>
              P(2, $, U, "s", {
                fill: { patternType: "solid", fgColor: { rgb: "2563EB" } },
                font: { bold: !0, sz: 9, color: { rgb: "FFFFFF" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: S,
              }),
          ),
          t.forEach((U, $) => {
            var ee = 3 + $;
            const Y = $ % 2 === 0 ? "FFFFFF" : y;
            [
              U.nombre || "",
              U.contacto || "",
              U.email || "",
              U.telefono || "",
            ].forEach((le, Z) =>
              P(ee, Z, le, "s", {
                fill: { patternType: "solid", fgColor: { rgb: Y } },
                font: { sz: 10 },
                alignment: { vertical: "center" },
                border: S,
              }),
            );
          }));
        var O = 3 + t.length + 1;
        (P(
          O,
          0,
          t.length + " cliente(s) exportado(s)",
          "s",
          A("EEF4FF", { italic: !0, sz: 9, color: { rgb: "3B5F86" } }, {}),
        ),
          (k["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
            { s: { r: O, c: 0 }, e: { r: O, c: 3 } },
          ]),
          (k["!cols"] = [{ wch: 34 }, { wch: 24 }, { wch: 32 }, { wch: 18 }]),
          (k["!rows"] = [{ hpt: 26 }, { hpt: 16 }, { hpt: 20 }]),
          t.forEach(() => k["!rows"].push({ hpt: 18 })),
          (k["!ref"] = I.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: O, c: 3 },
          })),
          I.utils.book_append_sheet(D, k, "Clientes"),
          I.writeFile(D, "Clientes_EnlaceConstructor.xlsx"));
      },
      v = (I) => {
        var D = I.target.files[0];
        if (D) {
          b(!0);
          var k = new FileReader();
          ((k.onload = async (R) => {
            await zt(
              "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
            );
            try {
              var K = window.XLSX.read(R.target.result, { type: "binary" }),
                y = K.Sheets[K.SheetNames[0]],
                P = window.XLSX.utils.sheet_to_json(y, { header: 1 }),
                A = P.slice(1)
                  .filter((S) => S[0])
                  .map((S, O) => ({
                    id: Math.max(0, ...t.map((U) => U.id)) + O + 1,
                    nombre: String(S[0] || "").trim(),
                    contacto: String(S[1] || "").trim(),
                    email: String(S[2] || "").trim(),
                    telefono: String(S[3] || "").trim(),
                  }));
              A.length > 0
                ? (i((S) => [...S, ...A]),
                  l(
                    "✅ " +
                      A.length +
                      " cliente(s) importado(s) correctamente.",
                  ))
                : l("⚠️ No se encontraron datos válidos en el archivo.");
            } catch (S) {
              l("❌ Error al leer el archivo: " + S.message);
