const fs = require('fs');

const file = 'src/assets/index.js';
let content = fs.readFileSync(file, 'utf8');

// New Catalog Items
const newCatalog = `,{id:300,cat:"Aislación Térmica",desc:"Sistema EIFS completo (EPS 50mm + malla + basecoat)",unidad:"m²",precio:28500},{id:301,cat:"Revestimientos Exteriores",desc:"Instalación Siding Fibrocemento c/barrera humedad",unidad:"m²",precio:22000},{id:302,cat:"Cubiertas y Techumbres",desc:"Cubierta Teja Asfáltica s/OSB 11mm",unidad:"m²",precio:35000},{id:303,cat:"Cubiertas y Techumbres",desc:"Cubierta plancha PV4 (Galvalume)",unidad:"m²",precio:28000},{id:304,cat:"Cierres Perimetrales",desc:"Pandereta Bulldog h=1.8m (placa vibrada)",unidad:"ml",precio:32000},{id:305,cat:"Cierres Perimetrales",desc:"Cierre Acmafor 3D 2.5m verde c/postes",unidad:"ml",precio:38000},{id:306,cat:"Hormigón y Albañilería",desc:"Muro ladrillo Princesa 14x19x29",unidad:"m²",precio:55000},{id:307,cat:"Pisos y Revestimientos",desc:"Piso vinílico SPC click 4mm",unidad:"m²",precio:25000},{id:308,cat:"Pisos y Revestimientos",desc:"Porcelanato rectificado 60x120cm",unidad:"m²",precio:45000}`;

// New Materials
const newMaterials = `,{id:400,cat:"Aislación",nombre:"Placa Poliestireno EPS Alta Densidad 50mm",unidad:"m²",precio:4500},{id:401,cat:"Aislación",nombre:"Malla fibra vidrio EIFS rollo 50m",unidad:"rollo",precio:22000},{id:402,cat:"Aislación",nombre:"Basecoat / Adhesivo EIFS 25kg",unidad:"saco",precio:9500},{id:403,cat:"Aislación",nombre:"Finish coat texturado EIFS (tineta)",unidad:"tineta",precio:38000},{id:404,cat:"Revestimientos",nombre:"Siding fibrocemento 190x3000mm",unidad:"unidad",precio:4200},{id:405,cat:"Techumbres",nombre:"Teja asfáltica paquete 3m²",unidad:"paquete",precio:28500},{id:406,cat:"Techumbres",nombre:"Plancha PV4 prepintada ml",unidad:"ml",precio:7800},{id:407,cat:"Obras Exteriores",nombre:"Placa hormigón vibrado 50x200cm",unidad:"unidad",precio:6500},{id:408,cat:"Obras Exteriores",nombre:"Poste hormigón pandereta tipo H",unidad:"unidad",precio:12500},{id:409,cat:"Obras Exteriores",nombre:"Panel Acmafor 3D verde 2.08x2.5m",unidad:"unidad",precio:35000},{id:410,cat:"Obras Exteriores",nombre:"Poste Acmafor verde c/fijaciones",unidad:"unidad",precio:18500},{id:411,cat:"Hormigón y Albañilería",nombre:"Ladrillo Princesa 14x19x29cm",unidad:"unidad",precio:750}`;

// New APUs
const newApus = `,{id:100,tipo:"Nueva Construcción",estructura:"General",nombre:"Sistema EIFS completo (EPS 50mm + malla + basecoat)",categoria:"Aislación Térmica",unidad:"m²",catalogId:300,esSubcontrato:false,precioSubcontrato:0,pctMO:45,pctGG:12,pctUtilidad:15,rendimiento:6,dotacion:2,materiales:[{materialId:400,cantidad:1.05},{materialId:401,cantidad:1.1},{materialId:402,cantidad:0.4},{materialId:403,cantidad:0.1}]},{id:101,tipo:"Nueva Construcción",estructura:"General",nombre:"Instalación Siding Fibrocemento c/barrera humedad",categoria:"Revestimientos Exteriores",unidad:"m²",catalogId:301,esSubcontrato:false,precioSubcontrato:0,pctMO:50,pctGG:10,pctUtilidad:15,rendimiento:8,dotacion:2,materiales:[{materialId:404,cantidad:1.8},{materialId:113,cantidad:0.05},{materialId:70,cantidad:0.05}]},{id:102,tipo:"Nueva Construcción",estructura:"General",nombre:"Pandereta Bulldog h=1.8m (placa vibrada)",categoria:"Cierres Perimetrales",unidad:"ml",catalogId:304,esSubcontrato:false,precioSubcontrato:0,pctMO:55,pctGG:10,pctUtilidad:15,rendimiento:10,dotacion:3,materiales:[{materialId:407,cantidad:1.8},{materialId:408,cantidad:0.5},{materialId:26,cantidad:0.05}]},{id:103,tipo:"Nueva Construcción",estructura:"General",nombre:"Cubierta Teja Asfáltica s/OSB 11mm",categoria:"Techumbres",unidad:"m²",catalogId:302,esSubcontrato:false,precioSubcontrato:0,pctMO:45,pctGG:10,pctUtilidad:15,rendimiento:12,dotacion:2,materiales:[{materialId:405,cantidad:0.35},{materialId:128,cantidad:0.36},{materialId:113,cantidad:0.06},{materialId:134,cantidad:0.02}]},{id:104,tipo:"Nueva Construcción",estructura:"General",nombre:"Muro ladrillo Princesa 14x19x29",categoria:"Hormigón y Albañilería",unidad:"m²",catalogId:306,esSubcontrato:false,precioSubcontrato:0,pctMO:55,pctGG:12,pctUtilidad:15,rendimiento:5,dotacion:2,materiales:[{materialId:411,cantidad:17},{materialId:31,cantidad:0.6}]}`;

// Inject Catalog
content = content.replace(/(qi=\[.*?)(\])/, "$1" + newCatalog + "$2");
// Inject Materials
content = content.replace(/(Rn=\[.*?)(\])/, "$1" + newMaterials + "$2");
// Inject APUs
content = content.replace(/(Ai=\[.*?)(\])/, "$1" + newApus + "$2");

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully injected new items.');
