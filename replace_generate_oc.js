const fs = require('fs');

let content = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');

const sIdx = content.indexOf('    const generateOC = async () => {');
const eIdx = content.indexOf('    return e.jsxs("div", {', sIdx);

const newGenerateOC = `    const generateOC = async () => {
        const assigned = consolidatedItems.filter(m => m.proveedorId !== "");
        if (assigned.length === 0) return setToast("⚠️ Debes asignar al menos un proveedor a algún material.");
        
        const byProv = {};
        assigned.forEach(m => {
            if (!byProv[m.proveedorId]) byProv[m.proveedorId] = [];
            byProv[m.proveedorId].push(m);
        });

        if (!window.jspdf) {
            await zt("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
            await zt("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js");
        }
        
        const { jsPDF } = window.jspdf;
        
        const accentColor = cfg?.accentColor || "#f5a020";
        const accentRGB = accentColor.match(/\\w\\w/g).map(c => parseInt(c, 16));
        
        const getImageSize = (src) => new Promise(resolve => {
            const img = new window.Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ w: 0, h: 0 });
            img.src = src;
        });

        for (const provId of Object.keys(byProv)) {
            const prov = proveedores.find(p => String(p.id) === String(provId));
            if (!prov) continue;
            
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const items = byProv[provId];
            
            let y = 14;
            
            // Draw Logo
            if (cfg?.logoCliente) {
                try {
                    const { w, h } = await getImageSize(cfg.logoCliente);
                    if (w && h) {
                        const ratio = Math.min(45 / w, 20 / h);
                        const imgW = w * ratio;
                        const imgH = h * ratio;
                        doc.addImage(cfg.logoCliente, cfg.logoCliente.includes('png') ? 'PNG' : 'JPEG', 14, y, imgW, imgH);
                        y += Math.max(imgH, 15) + 5;
                    }
                } catch (e) {}
            }
            
            // Header
            doc.setFontSize(22);
            doc.setTextColor(40, 40, 40);
            doc.text("ORDEN DE COMPRA", 14, y + 8);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(\`N° Presupuesto Ref: \${budget.id}\`, 14, y + 15);
            doc.text(\`Fecha: \${new Date().toLocaleDateString("es-CL")}\`, 14, y + 20);
            
            y += 35;
            
            // Emisor y Receptor
            doc.setFontSize(11);
            doc.setTextColor(...accentRGB);
            doc.text("DATOS DE FACTURACIÓN (EMISOR)", 14, y);
            doc.text("PROVEEDOR (RECEPTOR)", 105, y);
            
            y += 6;
            doc.setFontSize(9);
            doc.setTextColor(70, 80, 95);
            doc.text(\`Empresa: \${cfg?.empresa || "Constructora"}\`, 14, y);
            doc.text(\`Empresa: \${prov.nombre}\`, 105, y);
            
            y += 5;
            doc.text(\`RUT: \${cfg?.rut || "Sin RUT"}\`, 14, y);
            doc.text(\`Vendedor: \${prov.vendedor || "No especificado"}\`, 105, y);
            
            y += 5;
            if (cfg?.telefono) doc.text(\`Fono: \${cfg?.telefono}\`, 14, y);
            doc.text(\`Email: \${prov.email || "No especificado"}\`, 105, y);
            
            y += 5;
            doc.text(\`Fono: \${prov.telefono || "No especificado"}\`, 105, y);
            
            y += 12;
            
            // Table
            let subtotal = 0;
            const tableData = items.map(item => {
                const total = item.cantidadTotal * item.precioReferencia;
                subtotal += total;
                return [
                    item.nombre,
                    item.cantidadTotal.toFixed(2),
                    item.unidad,
                    "$" + Math.round(item.precioReferencia).toLocaleString("es-CL"),
                    "$" + Math.round(total).toLocaleString("es-CL")
                ];
            });
            
            doc.autoTable({
                startY: y,
                head: [["Descripción del Material", "Cantidad", "Unidad", "Precio Unitario", "Total"]],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: accentRGB },
                styles: { fontSize: 8, textColor: [50, 60, 75] },
                alternateRowStyles: { fillColor: [248, 250, 252] }
            });
            
            const iva = subtotal * 0.19;
            const total = subtotal + iva;
            
            let finalY = doc.lastAutoTable.finalY + 12;
            
            // Totals section
            doc.setFontSize(9);
            doc.setTextColor(90, 100, 115);
            doc.text("Subtotal Neto", 130, finalY);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30, 40, 55);
            doc.text(\`$\${Math.round(subtotal).toLocaleString("es-CL")}\`, 194, finalY, { align: "right" });
            
            finalY += 6;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(90, 100, 115);
            doc.text("IVA (19%)", 130, finalY);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30, 40, 55);
            doc.text(\`$\${Math.round(iva).toLocaleString("es-CL")}\`, 194, finalY, { align: "right" });
            
            finalY += 2;
            doc.setDrawColor(180, 185, 200);
            doc.setLineWidth(0.4);
            doc.line(130, finalY, 194, finalY);
            
            finalY += 2;
            doc.setFillColor(...accentRGB);
            doc.roundedRect(128, finalY, 68, 11, 2, 2, "F");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.text("TOTAL O.C.", 130, finalY + 7.5);
            doc.text(\`$\${Math.round(total).toLocaleString("es-CL")}\`, 193, finalY + 7.5, { align: "right" });
            
            finalY += 30; // Jump for signatures
            
            // Check page overflow for signatures
            if (finalY + (cfg?.firmaImg ? 20 : 0) + 30 > 280) {
                doc.addPage();
                finalY = 30;
            }
            
            // Signatures
            if (cfg?.firmaImg) {
                try {
                    doc.addImage(cfg.firmaImg, 'PNG', 14, finalY, 35, 20);
                    finalY += 22;
                } catch (e) {
                    finalY += 4;
                }
            }
            
            doc.setDrawColor(160, 170, 185);
            doc.setLineWidth(0.4);
            doc.line(14, finalY, 70, finalY);
            finalY += 5;
            
            if (cfg?.firmaNombre) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(...accentRGB);
                doc.text(cfg.firmaNombre, 14, finalY);
                finalY += 5;
            }
            
            if (cfg?.firmaCargo) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 115, 130);
                doc.text(cfg.firmaCargo, 14, finalY);
                finalY += 5;
            }
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 115, 130);
            doc.text(cfg?.empresa || "Firma Autorizada", 14, finalY);
            
            // Auto download
            doc.save(\`Orden_Compra_\${prov.nombre.replace(/\\s+/g, '_')}_P\${budget.id}.pdf\`);
        }
        
        setToast("✅ Órdenes de compra generadas con formato oficial.");
        onClose();
    };
`;

content = content.substring(0, sIdx) + newGenerateOC + content.substring(eIdx);

fs.writeFileSync('src/assets/generador_oc_modulo.js', content);
console.log("Successfully replaced generateOC.");
