const XLSX = require('xlsx');

const wb = XLSX.utils.book_new();

// Obra Gruesa
const wsObraGruesa = XLSX.utils.aoa_to_sheet([
    ["ID", "Material", "Categoria", "Unidad", "PRECIO OFRECIDO (Sin IVA)"],
    [300, "Cemento Polpaico Especial 25kg", "Obra Gruesa", "saco", 4050], // Más barato (Era 4500 aprox)
    [27, "Hormigón premezclado H-30", "Obra Gruesa", "m3", 228781] // Igual
]);
XLSX.utils.book_append_sheet(wb, wsObraGruesa, "Obra Gruesa");

// Terminaciones
const wsTerminaciones = XLSX.utils.aoa_to_sheet([
    ["ID", "Material", "Categoria", "Unidad", "PRECIO OFRECIDO (Sin IVA)"],
    [45, "Pintura Latex interior blanco (tineta)", "Terminaciones", "tineta", 23800], // Más barato
    [10, "Cornisa MDF 60mm", "Terminaciones", "ml", 5600] // Más caro
]);
XLSX.utils.book_append_sheet(wb, wsTerminaciones, "Terminaciones");

XLSX.writeFile(wb, 'Cotizacion_Ferreteria_El_Maestro.xlsx');
console.log("Mock excel created!");
