"use strict";

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2] || path.join(__dirname, "..", "src", "assets", "index.js");
let source = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

function transformApu(id, transform) {
  const marker = `\n      {\n        id: ${id},\n        tipo:`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`APU ${id}: inicio no encontrado`);
  const end = source.indexOf("\n      },\n      {", start + marker.length);
  if (end < 0) throw new Error(`APU ${id}: fin no encontrado`);
  const before = source.slice(start, end + 9);
  const after = transform(before);
  if (after === before) throw new Error(`APU ${id}: parche sin cambios`);
  source = source.slice(0, start) + after + source.slice(end + 9);
}

function replaceOnce(segment, before, after, label) {
  const at = segment.indexOf(before);
  if (at < 0) throw new Error(`${label}: texto no encontrado`);
  if (segment.indexOf(before, at + before.length) >= 0) throw new Error(`${label}: coincidencia ambigua`);
  return segment.slice(0, at) + after + segment.slice(at + before.length);
}

transformApu(35, (segment) => replaceOnce(
  segment,
  `        materiales: [
          { materialId: 33, cantidad: 0.35 },
          { materialId: 20, cantidad: 0.05 },
          { materialId: 22, cantidad: 0.015 },
        ],`,
  `        baseTecnica: {
          metodo: "Sistema de estuco exterior premezclado",
          supuestos: "No combina cemento y arena adicionales; ajustar consumo a ficha del fabricante",
          editable: !0,
        },
        materiales: [{ materialId: 33, cantidad: 0.35 }],`,
  "APU 35",
));

transformApu(36, (segment) => replaceOnce(
  segment,
  `        materiales: [
          { materialId: 20, cantidad: 0.12 },
          { materialId: 21, cantidad: 0.025 },
          { materialId: 32, cantidad: 0.08 },
          { materialId: 34, cantidad: 0.05 },
          { materialId: 35, cantidad: 0.03 },
        ],`,
  `        baseTecnica: {
          metodo: "Sistema de estuco interior premezclado con yeso",
          supuestos: "No combina cemento y arena adicionales; ajustar consumo a ficha del fabricante",
          editable: !0,
        },
        materiales: [
          { materialId: 34, cantidad: 0.35 },
          { materialId: 35, cantidad: 0.03 },
        ],`,
  "APU 36",
));

transformApu(63, (segment) => replaceOnce(
  segment,
  `        materiales: [
          { materialId: 140, cantidad: 1.08 },
          { materialId: 149, cantidad: 1.1 },
          { materialId: 150, cantidad: 1.05 },
        ],`,
  `        baseTecnica: {
          metodo: "Retiro de piso existente, embolsado e instalación de piso flotante nuevo",
          supuestos: "Incluye bolsas para retiro interior; transporte a botadero se presupuesta según distancia",
          editable: !0,
        },
        materiales: [
          { materialId: 140, cantidad: 1.08 },
          { materialId: 149, cantidad: 1.1 },
          { materialId: 150, cantidad: 1.05 },
          { materialId: 305, cantidad: 0.1 },
        ],`,
  "APU 63",
));

transformApu(64, (segment) => replaceOnce(
  segment,
  `          { materialId: 148, cantidad: 0.5 },
        ],`,
  `          { materialId: 148, cantidad: 0.5 },
          { materialId: 305, cantidad: 0.1 },
        ],`,
  "APU 64",
));

transformApu(67, (segment) => replaceOnce(
  segment,
  `        materiales: [
          { materialId: 162, cantidad: 1 },
          { materialId: 166, cantidad: 0.3 },
          { materialId: 175, cantidad: 0.2 },
        ],`,
  `        baseTecnica: {
          metodo: "Retiro e instalación de ventana con sello perimetral de poliuretano",
          supuestos: "Sellante canónico único; sustituible por producto compatible según especificación",
          editable: !0,
        },
        materiales: [
          { materialId: 162, cantidad: 1 },
          { materialId: 175, cantidad: 0.3 },
        ],`,
  "APU 67",
));

transformApu(75, (segment) => replaceOnce(
  segment,
  `        materiales: [
          { materialId: 105, cantidad: 1.15 },
          { materialId: 114, cantidad: 0.02 },
          { materialId: 73, cantidad: 0.3 },
          { materialId: 174, cantidad: 0.2 },
          { materialId: 166, cantidad: 0.15 },
        ],`,
  `        baseTecnica: {
          metodo: "Parche de zinc fijado y sellado con poliuretano tipo Sikaflex",
          supuestos: "No acumula sellantes alternativos; revisar origen de filtración antes de ejecutar",
          editable: !0,
        },
        materiales: [
          { materialId: 105, cantidad: 1.15 },
          { materialId: 114, cantidad: 0.02 },
          { materialId: 73, cantidad: 0.3 },
          { materialId: 174, cantidad: 0.25 },
        ],`,
  "APU 75",
));

transformApu(76, (segment) => replaceOnce(
  segment,
  `        materiales: [
          { materialId: 174, cantidad: 0.15 },
          { materialId: 166, cantidad: 0.1 },
          { materialId: 175, cantidad: 0.08 },
          { materialId: 33, cantidad: 0.02 },
        ],`,
  `        materiales: [
          { materialId: 175, cantidad: 0.25 },
          { materialId: 33, cantidad: 0.02 },
        ],`,
  "APU 76",
));

transformApu(77, (segment) => replaceOnce(
  segment,
  `        materiales: [
          { materialId: 33, cantidad: 0.3 },
          { materialId: 20, cantidad: 0.04 },
          { materialId: 21, cantidad: 0.01 },
          { materialId: 35, cantidad: 0.02 },
          { materialId: 90, cantidad: 0.05 },
        ],`,
  `        baseTecnica: {
          metodo: "Reparación localizada con estuco exterior premezclado y puente adherente",
          supuestos: "No combina dosificación artesanal con producto premezclado",
          editable: !0,
        },
        materiales: [
          { materialId: 33, cantidad: 0.35 },
          { materialId: 35, cantidad: 0.02 },
          { materialId: 90, cantidad: 0.05 },
        ],`,
  "APU 77",
));

for (const [id, baseTecnica] of [
  [105, {
    metodo: "Hormigón premezclado sobre cama de arena y refuerzo",
    supuestos: "La arena es una capa de apoyo independiente, no un agregado añadido al hormigón",
  }],
  [108, {
    metodo: "Hormigón premezclado sobre base de piedra chancada compactada",
    supuestos: "La piedra es una capa de base independiente, no un agregado añadido al hormigón",
  }],
]) {
  transformApu(id, (segment) => replaceOnce(
    segment,
    "        dotacion: 3,\n        materiales:",
    `        dotacion: 3,
        capaBaseIndependiente: !0,
        baseTecnica: {
          metodo: "${baseTecnica.metodo}",
          supuestos: "${baseTecnica.supuestos}",
          editable: !0,
        },
        materiales:`,
    `APU ${id}`,
  ));
}

fs.writeFileSync(filePath, source, "utf8");
console.log(`APU composition fixes synchronized: ${filePath}`);
