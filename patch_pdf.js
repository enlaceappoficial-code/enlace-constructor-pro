const fs = require('fs');

let c = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');

const oldBlockStart = 'if (isSC && includeLetter) {';
const oldBlockEnd = '                    doc.addPage();\n                    y = 14;\n                }';

const sIdx = c.indexOf(oldBlockStart);
const eIdx = c.indexOf(oldBlockEnd, sIdx);

if (sIdx > -1 && eIdx > -1) {
    const newBlock = `if (isSC && includeLetter) {
                    if (cfg?.logoCliente) {
                        try {
                            const { w, h } = await getImageSize(cfg.logoCliente);
                            if (w && h) {
                                const ratio = Math.min(45 / w, 20 / h);
                                doc.addImage(cfg.logoCliente, cfg.logoCliente.includes('png') ? 'PNG' : 'JPEG', 14, y, w * ratio, h * ratio);
                            }
                        } catch (e) {}
                    }
                    
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text(\`\${new Date().toLocaleDateString("es-CL", {day: 'numeric', month: 'long', year: 'numeric'})}\`, 196, y + 5, { align: "right" });
                    doc.text(\`Ref. Presupuesto N° \${budget.id}\`, 196, y + 10, { align: "right" });
                    
                    y += 25;
                    
                    doc.setFontSize(16);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(30, 50, 120);
                    const companyName = cfg?.empresa || "Constructora";
                    doc.text(companyName, 14, y);
                    
                    y += 6;
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(100);
                    const city = "Tu Ciudad, Chile";
                    doc.text(\`RUT: \${cfg?.rut || "Sin RUT"} | \${city}\`, 14, y);
                    y += 5;
                    doc.text(\`\${cfg?.telefono || "Sin Fono"} | \${cfg?.email || "Sin Email"}\`, 14, y);
                    
                    y += 10;
                    
                    doc.setDrawColor(...accentRGB);
                    doc.setLineWidth(0.6);
                    doc.line(14, y, 196, y);
                    
                    y += 15;
                    
                    doc.setFontSize(11);
                    doc.setTextColor(40);
                    doc.text("Estimado/a ", 14, y);
                    doc.setFont("helvetica", "bold");
                    const provName = prov.nombre || "Proveedor";
                    doc.text(provName + ",", 14 + doc.getTextWidth("Estimado/a "), y);
                    
                    y += 12;
                    doc.setFont("helvetica", "normal");
                    
                    const p1 = \`Por medio de la presente, \${companyName} se dirige a ustedes para solicitar su mejor propuesta técnica y económica para la provisión de materiales correspondientes a \${budget.descripcion}.\`;
                    const p2 = \`Contamos con amplia experiencia en proyectos de construcción, y buscamos establecer alianzas con proveedores comprometidos con la calidad, los plazos y el buen servicio.\`;
                    const p3 = \`Nuestra solicitud ha sido elaborada considerando un listado de materiales clave para la ejecución, detallado en la página siguiente.\`;
                    
                    doc.text(doc.splitTextToSize(p1, 180), 14, y);
                    y += 14;
                    doc.text(doc.splitTextToSize(p2, 180), 14, y);
                    y += 14;
                    doc.text(doc.splitTextToSize(p3, 180), 14, y);
                    
                    y += 15;
                    
                    doc.setDrawColor(...accentRGB);
                    doc.setLineWidth(1.5);
                    doc.line(14, y, 14, y + 25);
                    
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(120);
                    doc.text("RESUMEN DE LA SOLICITUD", 18, y + 4);
                    
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(100);
                    doc.text("Proyecto:", 18, y + 12);
                    doc.text("Materiales solicitados:", 105, y + 12);
                    
                    doc.setFontSize(11);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(30, 50, 120);
                    doc.text(budget.descripcion.substring(0, 45) + (budget.descripcion.length > 45 ? '...' : ''), 18, y + 18);
                    doc.setTextColor(...accentRGB);
                    doc.text(\`\${items.length} ítems\`, 105, y + 18);
                    
                    y += 35;
                    
                    doc.setFontSize(11);
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(40);
                    
                    const p4 = \`Quedamos a su entera disposición para resolver cualquier consulta o aclarar los alcances de los materiales requeridos.\`;
                    doc.text(doc.splitTextToSize(p4, 180), 14, y);
                    y += 10;
                    
                    const p5 = \`Agradecemos de antemano su pronta respuesta.\`;
                    doc.text(doc.splitTextToSize(p5, 180), 14, y);
                    
                    y += 15;
                    doc.text("Atentamente,", 14, y);
                    
                    y += 10;
                    
                    if (cfg?.firmaImg) {
                        try {
                            const { w, h } = await getImageSize(cfg.firmaImg);
                            if (w && h) {
                                const ratio = Math.min(56 / w, 24 / h);
                                doc.addImage(cfg.firmaImg, cfg.firmaImg.includes('png') ? 'PNG' : 'JPEG', 14, y, w*ratio, h*ratio);
                                y += (h*ratio) + 2;
                            }
                        } catch (e) { y += 20; }
                    } else {
                        y += 20;
                    }
                    
                    y += 10;
                    doc.setDrawColor(200);
                    doc.setLineWidth(0.5);
                    doc.line(14, y, 100, y);
                    doc.line(110, y, 196, y);
                    
                    y += 6;
                    
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(30, 50, 120);
                    doc.text(companyName, 57, y, { align: "center" });
                    doc.text(provName, 153, y, { align: "center" });
                    
                    y += 5;
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(100);
                    doc.text("Representante Legal — " + companyName, 57, y, { align: "center" });
                    doc.text("RUT: ____________________", 153, y, { align: "center" });
                    
                    doc.setFontSize(8);
                    doc.text(\`Enlace Constructor — \${companyName} · \${new Date().toLocaleDateString("es-CL")}\`, 105, 285, { align: "center" });
                    
                    doc.addPage();
                    y = 14;
                }`;

    c = c.substring(0, sIdx) + newBlock + c.substring(eIdx + oldBlockEnd.length);
    fs.writeFileSync('src/assets/generador_oc_modulo.js', c);
    console.log("Patched PDF format successfully!");
} else {
    console.log("Could not find blocks");
}
