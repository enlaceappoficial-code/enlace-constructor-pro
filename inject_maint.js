const fs = require('fs');

const file = 'src/assets/index.js';
let content = fs.readFileSync(file, 'utf8');

// New Catalog Items (Maintenance)
const newCatalog = `,{id:310,cat:"Servicios Generales",desc:"Visita Técnica / Diagnóstico",unidad:"gl",precio:25000},{id:311,cat:"Mantención Techumbres",desc:"Reparación filtración techumbre (parche/tapagoteras)",unidad:"gl",precio:45000},{id:312,cat:"Mantención Techumbres",desc:"Limpieza y destape de canaletas y bajantes",unidad:"ml",precio:2500},{id:313,cat:"Mantención Pintura",desc:"Lijado y pintura esmalte/anticorrosivo reja o portón",unidad:"m²",precio:12500},{id:314,cat:"Mantención Sanitaria",desc:"Cambio herrajes / flotador estanque WC",unidad:"unidad",precio:25000},{id:315,cat:"Mantención Sanitaria",desc:"Destape de WC o cámara de inspección domiciliaria",unidad:"gl",precio:45000},{id:316,cat:"Mantención Sanitaria",desc:"Cambio de sifón lavamanos / lavaplatos",unidad:"unidad",precio:18500},{id:317,cat:"Mantención Eléctrica",desc:"Detección cortocircuito y revisión tablero",unidad:"gl",precio:35000},{id:318,cat:"Mantención Eléctrica",desc:"Cambio de enchufe/interruptor en mal estado",unidad:"unidad",precio:12500},{id:319,cat:"Reparaciones Generales",desc:"Cambio de chapa/cerradura puerta",unidad:"unidad",precio:28000},{id:320,cat:"Reparaciones Generales",desc:"Reparación parche yeso/empaste muro dañado",unidad:"m²",precio:15000}`;

// New Materials (Maintenance)
const newMaterials = `,{id:420,cat:"Techumbres",nombre:"Tapagoteras asfáltico/acrílico 1kg",unidad:"unidad",precio:8500},{id:421,cat:"Techumbres",nombre:"Membrana asfáltica aluminizada adhesiva 10cm x 10m",unidad:"rollo",precio:12500},{id:422,cat:"Sanitario",nombre:"Kit herrajes WC universal",unidad:"unidad",precio:7500},{id:423,cat:"Sanitario",nombre:"Sifón corrugado lavamanos universal",unidad:"unidad",precio:3500},{id:424,cat:"Sanitario",nombre:"Silicona antihongos baño/cocina",unidad:"tubo",precio:4200},{id:425,cat:"Eléctrica",nombre:"Módulo enchufe 10A/16A + placa",unidad:"unidad",precio:4500},{id:426,cat:"Carpintería",nombre:"Cerradura sobreponer/embutir estándar",unidad:"unidad",precio:14500},{id:427,cat:"Pintura",nombre:"Convertidor de óxido 1L",unidad:"litro",precio:9500},{id:428,cat:"Varios",nombre:"Viáticos y Movilización / Bencina",unidad:"gl",precio:15000}`;

// New APUs (Maintenance - High labor pct)
const newApus = `,{id:105,tipo:"Mantención",estructura:"General",nombre:"Visita Técnica / Diagnóstico",categoria:"Servicios Generales",unidad:"gl",catalogId:310,esSubcontrato:false,precioSubcontrato:0,pctMO:70,pctGG:15,pctUtilidad:15,rendimiento:1,dotacion:1,materiales:[{materialId:428,cantidad:1}]},{id:106,tipo:"Mantención",estructura:"General",nombre:"Reparación filtración techumbre (parche/tapagoteras)",categoria:"Mantención Techumbres",unidad:"gl",catalogId:311,esSubcontrato:false,precioSubcontrato:0,pctMO:60,pctGG:10,pctUtilidad:15,rendimiento:2,dotacion:1,materiales:[{materialId:420,cantidad:1},{materialId:421,cantidad:0.2},{materialId:428,cantidad:0.5}]},{id:107,tipo:"Mantención",estructura:"General",nombre:"Cambio herrajes / flotador estanque WC",categoria:"Mantención Sanitaria",unidad:"unidad",catalogId:314,esSubcontrato:false,precioSubcontrato:0,pctMO:65,pctGG:10,pctUtilidad:15,rendimiento:2,dotacion:1,materiales:[{materialId:422,cantidad:1},{materialId:424,cantidad:0.2}]},{id:108,tipo:"Mantención",estructura:"General",nombre:"Cambio de chapa/cerradura puerta",categoria:"Reparaciones Generales",unidad:"unidad",catalogId:319,esSubcontrato:false,precioSubcontrato:0,pctMO:65,pctGG:10,pctUtilidad:15,rendimiento:1.5,dotacion:1,materiales:[{materialId:426,cantidad:1}]},{id:109,tipo:"Mantención",estructura:"General",nombre:"Cambio de enchufe/interruptor en mal estado",categoria:"Mantención Eléctrica",unidad:"unidad",catalogId:318,esSubcontrato:false,precioSubcontrato:0,pctMO:70,pctGG:10,pctUtilidad:15,rendimiento:3,dotacion:1,materiales:[{materialId:425,cantidad:1}]}`;

// Inject Catalog
content = content.replace(/(qi=\[.*?)(\])/, "$1" + newCatalog + "$2");
// Inject Materials
content = content.replace(/(Rn=\[.*?)(\])/, "$1" + newMaterials + "$2");
// Inject APUs
content = content.replace(/(Ai=\[.*?)(\])/, "$1" + newApus + "$2");

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully injected maintenance items.');
