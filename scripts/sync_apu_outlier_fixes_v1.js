"use strict";

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2] || path.join(__dirname, "..", "src", "assets", "index.js");
let source = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

function replaceOnce(before, after, label) {
  const at = source.indexOf(before);
  if (at < 0) throw new Error(`${label}: texto no encontrado`);
  if (source.indexOf(before, at + before.length) >= 0) throw new Error(`${label}: coincidencia ambigua`);
  source = source.slice(0, at) + after + source.slice(at + before.length);
}

function transformObject(marker, transform, label) {
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) throw new Error(`${label}: inicio no encontrado`);
  const start = source.lastIndexOf("\n      {", markerAt);
  const end = source.indexOf("\n      },", markerAt);
  if (start < 0 || end < 0) throw new Error(`${label}: límites no encontrados`);
  const before = source.slice(start, end + 9);
  const after = transform(before);
  if (before === after) throw new Error(`${label}: parche sin cambios`);
  source = source.slice(0, start) + after + source.slice(end + 9);
}

function replaceIn(segment, before, after, label) {
  const at = segment.indexOf(before);
  if (at < 0) throw new Error(`${label}: campo no encontrado`);
  return segment.slice(0, at) + after + segment.slice(at + before.length);
}

for (const [id, oldPrice, newPrice] of [
  [6, 3500, 7500],
  [310, 25000, 82000],
  [318, 12500, 25500],
  [319, 28000, 58000],
]) {
  transformObject(
    `\n        id: ${id},\n        cat:`,
    (segment) => replaceIn(segment, `precio: ${oldPrice}`, `precio: ${newPrice}`, `Catálogo ${id}`),
    `Catálogo ${id}`,
  );
}

const changes = [
  [79, "        rendimiento: 12,\n        dotacion: 1,", `        rendimiento: 12,
        dotacion: 1,
        baseTecnica: {
          metodo: "Repaso de una mano sobre superficie compatible y preparada",
          supuestos: "Precio mínimo coherente con material, protección y jornal configurado",
          editable: !0,
        },`],
  [95, "        rendimiento: 2,\n        dotacion: 2,", `        rendimiento: 0.6,
        dotacion: 2,
        baseTecnica: {
          metodo: "Fabricación, soldadura, terminación e instalación en obra",
          supuestos: "Rendimiento por metro lineal de desarrollo; diseño estructural y anclajes especiales se ajustan por proyecto",
          editable: !0,
        },`],
  [96, "        rendimiento: 5,\n        dotacion: 2,", `        rendimiento: 1.5,
        dotacion: 2,
        baseTecnica: {
          metodo: "Fabricación soldada, protección anticorrosiva e instalación",
          supuestos: "Geometría recta estándar; curvas, vidrio y anclajes especiales se ajustan por proyecto",
          editable: !0,
        },`],
  [101, "        precioSubcontrato: 85e3,", `        precioSubcontrato: 19600,`],
  [125, "        rendimiento: 10,\n        dotacion: 2,", `        rendimiento: 4,
        dotacion: 2,
        baseTecnica: {
          metodo: "Tendido, unión, alineación y prueba de colector",
          supuestos: "Excavación, cama de apoyo, relleno y cámaras se presupuestan por separado",
          editable: !0,
        },`],
  [126, "        rendimiento: 8,\n        dotacion: 2,", `        rendimiento: 3.5,
        dotacion: 2,
        baseTecnica: {
          metodo: "Tendido, unión, alineación y prueba de colector",
          supuestos: "Excavación, cama de apoyo, relleno y cámaras se presupuestan por separado",
          editable: !0,
        },`],
  [137, "        rendimiento: 30,\n        dotacion: 1,", `        rendimiento: 10,
        dotacion: 1,
        baseTecnica: {
          metodo: "Replanteo, enmascarado y aplicación de pintura vial",
          supuestos: "Línea estándar sobre superficie limpia; símbolos y demarcaciones especiales se miden aparte",
          editable: !0,
        },`],
  [31001, "        rendimiento: 1,\n        dotacion: 1,", `        rendimiento: 1,
        dotacion: 1,
        baseTecnica: {
          metodo: "Visita en terreno, levantamiento básico y diagnóstico",
          supuestos: "Incluye movilización local y hasta una jornada profesional; estudios o ensayos se cotizan aparte",
          editable: !0,
        },`],
  [31004, "        rendimiento: 1.5,\n        dotacion: 1,", `        rendimiento: 1.5,
        dotacion: 1,
        baseTecnica: {
          metodo: "Retiro, ajuste e instalación de cerradura estándar",
          supuestos: "Incluye visita y ajuste menor; reparación de hoja o marco se presupuesta aparte",
          editable: !0,
        },`],
  [31005, "        rendimiento: 3,\n        dotacion: 1,", `        rendimiento: 3,
        dotacion: 1,
        baseTecnica: {
          metodo: "Desenergización, reemplazo de módulo, conexión y prueba",
          supuestos: "Circuito existente operativo; canalización y reparación de cableado se presupuesta aparte",
          editable: !0,
        },`],
];

for (const [id, before, after] of changes) {
  transformObject(
    `\n        id: ${id},\n        tipo:`,
    (segment) => replaceIn(segment, before, after, `APU ${id}`),
    `APU ${id}`,
  );
}

transformObject(
  "\n        id: 101,\n        tipo:",
  (segment) => replaceIn(
    segment,
    "        dotacion: 1,\n        materiales:",
    `        dotacion: 1,
        baseTecnica: {
          metodo: "Costo de equipo y operador prorrateado por rendimiento",
          supuestos: "Valor unitario por m³; movilización, entibación, roca y retiro se presupuestan aparte",
          editable: !0,
        },
        materiales:`,
    "APU 101 base técnica",
  ),
  "APU 101 base técnica",
);

transformObject(
  "\n        id: 134,\n        tipo:",
  (segment) => {
    let updated = replaceIn(
      segment,
      "        rendimiento: 20,\n        dotacion: 1,\n        rendimiento: 20,\n        dotacion: 1,",
      `        rendimiento: 6,
        dotacion: 2,
        baseTecnica: {
          metodo: "Dos aplicaciones de emulsión con gravilla y compactación entre capas",
          supuestos: "Superficie base preparada; consumo ajustable por absorción y especificación vial",
          editable: !0,
        },`,
      "APU 134 rendimiento",
    );
    updated = replaceIn(updated, "{ materialId: 295, cantidad: 0.003 }", "{ materialId: 295, cantidad: 0.012 }", "APU 134 emulsión");
    return updated;
  },
  "APU 134",
);

fs.writeFileSync(filePath, source, "utf8");
console.log(`APU outlier fixes synchronized: ${filePath}`);
