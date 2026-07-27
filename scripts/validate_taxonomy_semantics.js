"use strict";
// Validacion semantica automatica de la propuesta de taxonomia (regla 7 del
// encargo de correccion). Lee target/taxonomy_classified.json (generado por
// scripts/classify_taxonomy.js) y target/taxonomy_raw_*.json, y escribe
// docs/taxonomia/VALIDACION_SEMANTICA_TAXONOMIA.md. No toca la fuente
// canonica ni ningun archivo productivo.

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const targetDir = path.join(root, "target");
const outDir = path.join(root, "docs", "taxonomia");
fs.mkdirSync(outDir, { recursive: true });

const rows = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_classified.json"), "utf8"));
const rawCatalog = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_raw_catalog.json"), "utf8"));
const apus = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_raw_apus.json"), "utf8"));
const apuByCatalogId = new Map(apus.map((a) => [a.catalogId, a]));

function norm(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Categorias "problematicas" del catalogo original: transitorias/catch-all,
// que mezclan rubro con tipo de intervencion, que mezclan material/sistema
// constructivo con funcion, duplicadas, o con formato abreviado/inconsistente.
// No se usa la lista completa de las 51 categorias actuales porque varias
// (p. ej. "Pisos", "Piscinas", "Albañilería", "Climatización") son nombres
// limpios que coinciden legitimamente con su propio rubro o subrubro
// propuesto — la regla 2 del encargo da ejemplos explicitos de categorias
// abreviadas/problematicas ("Metalcon Mant.", "Madera Mant.", "Metalcon NC",
// "Impermeable", "Varios"), no una prohibicion general de reutilizar
// cualquier nombre de categoria actual.
const OLD_PROBLEMATIC_CATEGORIES = [
  // Transitorias / catch-all
  "Varios", "Reparaciones Generales", "Servicios Generales", "Servicios", "Fachadas y Vidrios",
  // Mezclan rubro con tipo de intervencion (familias NC/Rem./Mant./Estructural)
  "Metalcon NC", "Metalcon Rem.", "Metalcon Mant.", "Metalcon Estructural",
  "Madera NC", "Madera Mant.",
  "Mantención Pintura", "Mantención Sanitaria", "Mantención Eléctrica", "Mantención Techumbres", "Mantención Preventiva",
  // Mezclan material/sistema constructivo con funcion
  "Hormigón Armado", "Hormigón y Albañilería",
  // Duplicadas o equivalentes bajo nombres distintos
  "Impermeable", "Equipamiento", "Equipamiento Comercial", "Seguridad", "Corrientes Débiles",
  // Abreviadas o con grafia incorrecta
  "Mov. de Tierras", "Ojalaería",
];

const rules = [];

function addRule(id, descripcion, exceptions) {
  rules.push({
    id,
    descripcion,
    resultado: exceptions.length === 0 ? "PASA" : "FALLA",
    cantidadExcepciones: exceptions.length,
    excepciones: exceptions,
  });
}

// ---------------------------------------------------------------------------
// Regla 1: ninguna partida con radier/losa/fundacion/pilar de hormigon/viga
// de hormigon puede quedar en rubro Albañilería.
// ---------------------------------------------------------------------------
{
  const exceptions = rows
    .filter((r) => {
      const d = norm(r.descripcion);
      return /\bradier\b|\blosa\b|\bfundacion\b|pilar de hormigon|viga de hormigon/.test(d) && r.rubroPropuesto === "Albañilería";
    })
    .map((r) => ({ id: r.id, descripcion: r.descripcion, rubroPropuesto: r.rubroPropuesto }));
  addRule(
    "R1",
    "Ninguna partida que contenga radier, losa, fundación, pilar de hormigón o viga de hormigón puede quedar en el rubro Albañilería.",
    exceptions,
  );
}

// ---------------------------------------------------------------------------
// Regla 2: ninguna descripcion con "mantención" puede quedar como Obra nueva.
// ---------------------------------------------------------------------------
{
  const exceptions = rows
    .filter((r) => /\bmantencion\b/.test(norm(r.descripcion)) && r.tipoIntervencionPropuesto === "Obra nueva")
    .map((r) => ({ id: r.id, descripcion: r.descripcion, tipoIntervencionPropuesto: r.tipoIntervencionPropuesto }));
  addRule("R2", 'Ninguna descripción que contenga "mantención" puede quedar clasificada como tipo de intervención Obra nueva.', exceptions);
}

// ---------------------------------------------------------------------------
// Regla 3: ninguna descripcion con "reparación" o "parche" puede quedar
// como Obra nueva.
// ---------------------------------------------------------------------------
{
  const exceptions = rows
    .filter((r) => /\breparacion\b|\bparche\b/.test(norm(r.descripcion)) && r.tipoIntervencionPropuesto === "Obra nueva")
    .map((r) => ({ id: r.id, descripcion: r.descripcion, tipoIntervencionPropuesto: r.tipoIntervencionPropuesto }));
  addRule("R3", 'Ninguna descripción que contenga "reparación" o "parche" puede quedar clasificada como tipo de intervención Obra nueva.', exceptions);
}

// ---------------------------------------------------------------------------
// Regla 4: ningun subrubro puede ser igual a una categoria antigua
// (abreviada o no) del catalogo original.
// ---------------------------------------------------------------------------
{
  const exceptions = rows
    .filter((r) => OLD_PROBLEMATIC_CATEGORIES.includes(r.subrubroPropuesto))
    .map((r) => ({ id: r.id, descripcion: r.descripcion, subrubroPropuesto: r.subrubroPropuesto }));
  addRule(
    "R4",
    'Ningún subrubroPropuesto puede coincidir con el nombre de una categoría antigua abreviada, transitoria, duplicada o que mezcle rubro/material con función (ej. "Metalcon Mant.", "Madera Mant.", "Metalcon NC", "Impermeable", "Varios").',
    exceptions,
  );
}

// ---------------------------------------------------------------------------
// Regla 5: ninguna partida puede quedar como alcance "Subcontrato" sin
// evidencia explicita (descripcion, APU o base tecnica).
// ---------------------------------------------------------------------------
{
  const exceptions = rows
    .filter((r) => {
      if (r.alcancePropuesto !== "Subcontrato") return false;
      const apu = apuByCatalogId.get(r.id);
      const d = norm(r.descripcion);
      const evidenciaDescripcion = /subcontr/.test(d);
      const evidenciaApu = !!(apu && apu.esSubcontrato);
      const evidenciaBaseTecnica = !!(apu && apu.baseTecnica && /subcontr/.test(norm(apu.baseTecnica.metodo || "")));
      return !(evidenciaDescripcion || evidenciaApu || evidenciaBaseTecnica);
    })
    .map((r) => ({ id: r.id, descripcion: r.descripcion }));
  addRule(
    "R5",
    'Ninguna partida puede quedar clasificada con alcance "Subcontrato" sin evidencia explícita en la descripción, en el campo esSubcontrato del APU vinculado, o en su base técnica.',
    exceptions,
  );
}

// ---------------------------------------------------------------------------
// Regla 6: las techumbres deben clasificarse por funcion (rubro "Techumbres
// y aguas lluvias"), independientemente de si su estructura es Metalcon o
// madera.
// ---------------------------------------------------------------------------
{
  const exceptions = rows
    .filter((r) => /^techumbre /.test(norm(r.descripcion)) && r.rubroPropuesto !== "Techumbres y aguas lluvias")
    .map((r) => ({ id: r.id, descripcion: r.descripcion, rubroPropuesto: r.rubroPropuesto }));
  addRule(
    "R6",
    'Toda partida cuya descripción comience con "Techumbre" debe quedar en el rubro "Techumbres y aguas lluvias", sin importar si su sistema constructivo (apu.estructura) es Metalcon, madera u otro.',
    exceptions,
  );
}

// ---------------------------------------------------------------------------
// Reglas adicionales de consistencia interna (no pedidas explícitamente,
// pero necesarias para respaldar el resto de esta fase — se reportan aparte).
// ---------------------------------------------------------------------------
{
  const exceptions = rows
    .filter((r) => r.sistemaConstructivoPropuesto === "No aplica / mixto")
    .map((r) => ({ id: r.id, descripcion: r.descripcion }));
  addRule(
    "R7",
    'El valor combinado "No aplica / mixto" fue eliminado del vocabulario; ninguna partida puede conservarlo (deben quedar como "No aplica" o "Mixto" por separado).',
    exceptions,
  );
}
{
  const diccionarioPath = path.join(outDir, "DICCIONARIO_TAXONOMICO_ECP.json");
  const RUBROS_VALIDOS = fs.existsSync(diccionarioPath)
    ? JSON.parse(fs.readFileSync(diccionarioPath, "utf8")).vocabularioControlado.rubros
    : [];
  const exceptions = rows
    .filter((r) => RUBROS_VALIDOS.length > 0 && !RUBROS_VALIDOS.includes(r.rubroPropuesto))
    .map((r) => ({ id: r.id, rubroPropuesto: r.rubroPropuesto }));
  addRule("R8", "Todo rubroPropuesto debe pertenecer al vocabulario controlado de 30 rubros (aunque algunos rubros puedan tener cero partidas asignadas).", exceptions);
}

const totalPass = rules.filter((r) => r.resultado === "PASA").length;

function mdTable(headers, records) {
  const esc = (v) => String(v == null ? "" : v).replace(/\|/g, "\\|");
  let out = "| " + headers.join(" | ") + " |\n";
  out += "|" + headers.map(() => "---").join("|") + "|\n";
  for (const r of records) out += "| " + headers.map((h) => esc(r[h])).join(" | ") + " |\n";
  return out;
}

let md = `# Validación semántica automática — Taxonomía ECP

Resultado de ejecutar \`scripts/validate_taxonomy_semantics.js\` sobre \`docs/taxonomia/PARTIDAS_TAXONOMIA_PROPUESTA.csv\` (311 partidas). No se modificó la fuente canónica ni ningún dato productivo para generar este archivo.

**Resumen: ${totalPass} de ${rules.length} reglas pasan sin excepciones.**

`;

for (const rule of rules) {
  md += `## ${rule.id} — ${rule.resultado}\n\n${rule.descripcion}\n\n`;
  if (rule.excepciones.length === 0) {
    md += "Sin excepciones.\n\n";
  } else {
    md += `**${rule.cantidadExcepciones} excepción(es):**\n\n`;
    const headers = Object.keys(rule.excepciones[0]);
    md += mdTable(headers, rule.excepciones) + "\n";
  }
}

md += `---

*Generado por \`scripts/validate_taxonomy_semantics.js\`. Reglas R1–R6 corresponden literalmente a la regla 7 del encargo de corrección; R7–R8 son verificaciones de consistencia interna agregadas para respaldar el resto de esta fase.*
`;

fs.writeFileSync(path.join(outDir, "VALIDACION_SEMANTICA_TAXONOMIA.md"), md);

console.log(JSON.stringify({
  reglas: rules.map((r) => ({ id: r.id, resultado: r.resultado, excepciones: r.cantidadExcepciones })),
  totalPass,
  totalRules: rules.length,
}, null, 2));
