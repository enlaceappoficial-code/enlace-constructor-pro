const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldFunctions = `// Export Excel function
    function exportarPlantilla(prov) {
        let csvContent = "ID,Material,Categoria,Unidad,Precio Actual,PRECIO OFRECIDO\\n";
        materiales.forEach(m => {
            const row = [m.id, \`"\${m.nombre.replace(/"/g, '""')}"\`, \`"\${m.cat}"\`, m.unidad, m.precio, ""];
            csvContent += row.join(",") + "\\n";
        });
        const blob = new Blob(["\\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = \`Plantilla_Cotizacion_\${prov.nombre.replace(/\\s+/g, '_')}.csv\`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToast("✅ Plantilla CSV generada exitosamente. Ábrela con Excel.");
    }

    // Import Excel/CSV function
    async function importarCotizacion(ev, prov) {
        const file = ev.target.files[0];
        if(!file) return;
        
        try {
            // Check if XLSX library is loaded (from Actualizacion de Precios it might be, but let's load it if not)
            if(!window.XLSX) {
                await zt("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
            }
            const XLSX = window.XLSX;
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            if(!json.length || json[0][0] !== "ID") {
                return setToast("⚠️ Formato inválido. Usa la plantilla exportada.");
            }
            
            const compareItems = [];
            for(let i = 1; i < json.length; i++) {
                const row = json[i];
                if(!row[0]) continue;
                const matId = parseInt(row[0]);
                const offeredPrice = parseFloat(row[5]); // Index 5 is 'PRECIO OFRECIDO'
                
                const existingMat = materiales.find(m => m.id === matId);
                if(existingMat) {
                    compareItems.push({
                        id: existingMat.id,
                        nombre: existingMat.nombre,
                        cat: existingMat.cat,
                        precioActual: existingMat.precio,
                        nuevoPrecio: !isNaN(offeredPrice) ? offeredPrice : existingMat.precio
                    });
                }
            }
            
            setCompareData({
                proveedor: prov,
                items: compareItems
            });
            setSelectedChanges({});
            setView("compare");
            
        } catch(err) {
            setToast("⚠️ Error al leer el archivo: " + err.message);
        }
        ev.target.value = "";
    }`;

const newFunctions = `// Export Excel function natively
    async function exportarPlantilla(prov) {
        try {
            if(!window.XLSX) {
                await zt("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
            }
            const XLSX = window.XLSX;
            const wb = XLSX.utils.book_new();
            
            const categorias = {};
            materiales.forEach(m => {
                const cat = m.cat || "Sin Categoría";
                if(!categorias[cat]) categorias[cat] = [];
                categorias[cat].push(m);
            });
            
            Object.keys(categorias).forEach(cat => {
                let sheetName = cat.substring(0, 31).replace(/[\\\\\\/\\?\\*\\[\\]]/g, '');
                if(!sheetName) sheetName = "Materiales";
                
                const data = [["ID", "Material", "Categoria", "Unidad", "Precio Actual", "PRECIO OFRECIDO"]];
                categorias[cat].forEach(m => {
                    data.push([m.id, m.nombre, m.cat, m.unidad, m.precio, ""]);
                });
                
                const ws = XLSX.utils.aoa_to_sheet(data);
                ws['!cols'] = [{wch:10}, {wch:50}, {wch:25}, {wch:10}, {wch:15}, {wch:20}];
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
            });
            
            XLSX.writeFile(wb, \`Cotizacion_\${prov.nombre.replace(/\\s+/g, '_')}.xlsx\`);
            setToast("✅ Excel exportado exitosamente. Revisar pestañas.");
        } catch(err) {
            setToast("⚠️ Error al generar Excel: " + err.message);
        }
    }

    // Import Excel/CSV function
    async function importarCotizacion(ev, prov) {
        const file = ev.target.files[0];
        if(!file) return;
        
        try {
            if(!window.XLSX) {
                await zt("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
            }
            const XLSX = window.XLSX;
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });
            
            const compareItems = [];
            
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                
                if(!json.length || json[0][0] !== "ID") return;
                
                for(let i = 1; i < json.length; i++) {
                    const row = json[i];
                    if(!row[0]) continue;
                    const matId = parseInt(row[0]);
                    const offeredPrice = parseFloat(row[5]);
                    
                    const existingMat = materiales.find(m => m.id === matId);
                    if(existingMat) {
                        compareItems.push({
                            id: existingMat.id,
                            nombre: existingMat.nombre,
                            cat: existingMat.cat,
                            precioActual: existingMat.precio,
                            nuevoPrecio: !isNaN(offeredPrice) ? offeredPrice : existingMat.precio
                        });
                    }
                }
            });
            
            if(compareItems.length === 0) {
                return setToast("⚠️ No se encontraron materiales válidos en el archivo.");
            }
            
            setCompareData({
                proveedor: prov,
                items: compareItems
            });
            setSelectedChanges({});
            setView("compare");
            
        } catch(err) {
            setToast("⚠️ Error al leer el archivo: " + err.message);
        }
        ev.target.value = "";
    }`;

if(c.includes(oldFunctions.trim().substring(0, 50))) {
    // We can't do exact string replacement due to potential whitespace issues. Let's do it intelligently.
    const startIdx = c.indexOf('// Export Excel function\n    function exportarPlantilla(prov) {');
    const endIdx = c.indexOf('ev.target.value = "";\n    }', startIdx) + 26;
    
    if (startIdx > -1 && endIdx > -1) {
        const oldCode = c.substring(startIdx, endIdx);
        c = c.replace(oldCode, newFunctions);
        fs.writeFileSync('src/assets/index.js', c);
        console.log("Successfully replaced export/import functions for true XLSX generation.");
    } else {
        console.log("Could not resolve substring boundaries.");
    }
} else {
    console.log("Could not find the target code.");
}
