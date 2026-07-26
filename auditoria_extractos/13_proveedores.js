/*
 * Proveedores y cotizaciones
 * Copia de lectura extraída de src/assets/index.js.
 * El archivo canónico no fue modificado.
 */

/* ===== Líneas originales aproximadas 79907-80145 ===== */
  function ModuloProveedores({ budgets, apus, materiales, cfg, setToast }) {
    const [proveedores, setProveedores] = Re.useState(() => {
      try {
        const provs = JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_proveedores") || "[]",
        );
        if (provs && provs.length > 0) return provs;
      } catch {}
      return [];
    });
    const [presupuestosLocal, setPresupuestos] = Re.useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_presupuestos") ||
            "[]",
        );
      } catch {
        return [];
      }
    });
    const presupuestosArray = budgets || presupuestosLocal;

    const [materialesLocal, setMateriales] = Re.useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_materiales") || "[]",
        );
      } catch {
        return [];
      }
    });
    const materialesArray = materiales || materialesLocal;

    const [apusLocal, setApus] = Re.useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_apus") || "[]",
        );
      } catch {
        return [];
      }
    });
    const apusArray = apus || apusLocal;

    const [catalogLocal, setCatalogLocal] = Re.useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_catalog") || "[]",
        );
      } catch {
        return [];
      }
    });
    const catalogArray = catalogLocal;

    const [adquisiciones, setAdquisiciones] = Re.useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_adquisiciones") ||
            "[]",
        );
      } catch {
        return [];
      }
    });

    // "list" | "compare" | "history"
    const [view, setView] = Re.useState("list");
    const [attachmentUrl, setAttachmentUrl] = Re.useState(null);

    // Excel Import/Export states
    const [compareData, setCompareData] = Re.useState(null);
    const [selectedChanges, setSelectedChanges] = Re.useState({});

    // Price Upload History
    const [priceHistory, setPriceHistory] = Re.useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("enlace_constructor_pro_v1_price_history") ||
            "[]",
        );
      } catch {
        return [];
      }
    });

    // Editing Providers
    const [editingProv, setEditingProv] = Re.useState(null);
    const [provForm, setProvForm] = Re.useState({});
    const [searchProv, setSearchProv] = Re.useState("");

    const saveProv = () => {
      if (!provForm.nombre) return setToast("⚠️ El nombre es obligatorio");
      let newProvs;
      if (provForm.id) {
        newProvs = proveedores.map((p) =>
          p.id === provForm.id ? provForm : p,
        );
      } else {
        newProvs = [...proveedores, { ...provForm, id: Date.now().toString() }];
      }
      setProveedores(newProvs);
      localStorage.setItem(
        "enlace_constructor_pro_v1_proveedores",
        JSON.stringify(newProvs),
      );
      setEditingProv(null);
      setToast("✅ Proveedor guardado");
    };

    const deleteProv = (id) => {
      if (!window.confirm("¿Eliminar proveedor?")) return;
      const newProvs = proveedores.filter((p) => p.id !== id);
      setProveedores(newProvs);
      localStorage.setItem(
        "enlace_constructor_pro_v1_proveedores",
        JSON.stringify(newProvs),
      );
    };

    // Export Excel function natively
    async function exportarPlantilla(prov) {
      try {
        if (!window.XLSX) {
          await zt(
            "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
          );
        }
        const XLSX = window.XLSX;
        const wb = XLSX.utils.book_new();

        const categorias = {};
        materialesArray.forEach((m) => {
          const cat = m.cat || "Sin Categoría";
          if (!categorias[cat]) categorias[cat] = [];
          categorias[cat].push(m);
        });

        Object.keys(categorias).forEach((cat) => {
          let sheetName = cat.substring(0, 31).replace(/[\\\/\?\*\[\]]/g, "");
          if (!sheetName) sheetName = "Materiales";

          const data = [
            [
              "ID",
              "Material",
              "Categoria",
              "Unidad",
              "PRECIO OFRECIDO (Sin IVA)",
            ],
          ];
          categorias[cat].forEach((m) => {
            data.push([m.id, m.nombre, m.cat, m.unidad, ""]);
          });

          const ws = XLSX.utils.aoa_to_sheet(data);
          ws["!cols"] = [
            { wch: 10 },
            { wch: 50 },
            { wch: 25 },
            { wch: 10 },
            { wch: 25 },
          ];
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });

        XLSX.writeFile(
          wb,
          `Cotizacion_${prov.nombre.replace(/\s+/g, "_")}.xlsx`,
        );
        setToast("✅ Excel exportado exitosamente. Revisar pestañas.");
      } catch (err) {
        setToast("⚠️ Error al generar Excel: " + err.message);
      }
    }

    // Import Excel function
    async function importarCotizacion(ev, prov) {
      const file = ev.target.files[0];
      if (!file) return;

      try {
        if (!window.XLSX) {
          await zt(
            "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
          );
        }
        const XLSX = window.XLSX;
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });

        const compareItems = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (!json.length || json[0][0] !== "ID") return;

          for (let i = 1; i < json.length; i++) {
            const row = json[i];
            if (!row[0]) continue;
            const matId = parseInt(row[0]);
            const offeredPrice = parseFloat(row[4]); // Index 4 is PRECIO OFRECIDO

            const existingMat = materialesArray.find((m) => m.id === matId);
            if (existingMat) {
              compareItems.push({
                id: existingMat.id,
                nombre: existingMat.nombre,
                cat: existingMat.cat,
                precioActual: existingMat.precio,
                nuevoPrecio: !isNaN(offeredPrice)
                  ? offeredPrice
                  : existingMat.precio,
              });
            }
          }
        });

        if (compareItems.length === 0) {
          return setToast(
            "⚠️ No se encontraron materiales válidos en el archivo.",
          );
        }

        setCompareData({
          proveedor: prov,
          items: compareItems,
        });
        setSelectedChanges({});
      } catch (err) {
        setToast("⚠️ Error al leer el archivo: " + err.message);
      }
      ev.target.value = "";
    }

    // Compare View
    const [selectedBudget, setSelectedBudget] = Re.useState("");
