const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Update export function
const oldExportData = 'const data = [["ID", "Material", "Categoria", "Unidad", "Precio Actual", "PRECIO OFRECIDO"]];';
const newExportData = 'const data = [["ID", "Material", "Categoria", "Unidad", "PRECIO OFRECIDO (Sin IVA)"]];';
const oldExportPush = 'data.push([m.id, m.nombre, m.cat, m.unidad, m.precio, ""]);';
const newExportPush = 'data.push([m.id, m.nombre, m.cat, m.unidad, ""]);';
const oldCols = "ws['!cols'] = [{wch:10}, {wch:50}, {wch:25}, {wch:10}, {wch:15}, {wch:20}];";
const newCols = "ws['!cols'] = [{wch:10}, {wch:50}, {wch:25}, {wch:10}, {wch:25}];";

// Update import function
const oldImportParse = 'const offeredPrice = parseFloat(row[5]);';
const newImportParse = 'const offeredPrice = parseFloat(row[4]); // Index 4 is PRECIO OFRECIDO (Sin IVA)';

if(c.includes(oldExportData) && c.includes(oldExportPush) && c.includes(oldImportParse)) {
    c = c.replace(oldExportData, newExportData);
    c = c.replace(oldExportPush, newExportPush);
    c = c.replace(oldCols, newCols);
    c = c.replace(oldImportParse, newImportParse);
    
    // Create mock providers
    // We will inject a localStorage item if it doesn't exist.
    // The state is initialized via: pt("proveedores",[])
    // Let's add a script at the end of ProveedoresModulo to seed localStorage for demonstration.
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Export and Import updated to remove internal prices.");
} else {
    console.log("Could not find targets for replacement.");
}
