"use strict";
// Genera los 4 artefactos de la Fase 1A de taxonomia a partir de
// target/taxonomy_classified.json (producido por scripts/classify_taxonomy.js).
// No lee ni modifica src/assets/index.js directamente.

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const targetDir = path.join(root, "target");
const outDir = path.join(root, "docs", "taxonomia");
fs.mkdirSync(outDir, { recursive: true });

const rows = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_classified.json"), "utf8"));
const vocabularios = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_vocabularios.json"), "utf8"));
const partidasHeredadasMixtas = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_partidas_heredadas_mixtas.json"), "utf8"));

// ---------------------------------------------------------------------------
// CSV helpers
// ---------------------------------------------------------------------------

function csvEscape(value) {
  const s = String(value == null ? "" : value);
  if (/[",\n;]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function toCsv(headers, records) {
  const lines = [headers.join(",")];
  for (const r of records) {
    lines.push(headers.map((h) => csvEscape(r[h])).join(","));
  }
  return lines.join("\r\n") + "\r\n";
}

// ---------------------------------------------------------------------------
// 1) PARTIDAS_TAXONOMIA_PROPUESTA.csv
// ---------------------------------------------------------------------------

const PARTIDA_HEADERS = [
  "id",
  "categoriaActual",
  "descripcion",
  "unidad",
  "rubroPropuesto",
  "subrubroPropuesto",
  "tipoIntervencionPropuesto",
  "sistemaConstructivoPropuesto",
  "alcancePropuesto",
  "especialidadPropuesta",
  "confianza",
  "requiereRevisionHumana",
  "observacion",
];

const partidasCsv = toCsv(
  PARTIDA_HEADERS,
  rows
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((r) => ({ ...r, requiereRevisionHumana: r.requiereRevisionHumana ? "true" : "false" })),
);
fs.writeFileSync(path.join(outDir, "PARTIDAS_TAXONOMIA_PROPUESTA.csv"), partidasCsv);

// ---------------------------------------------------------------------------
// 2) CATEGORIAS_ACTUALES_ECP.csv
// ---------------------------------------------------------------------------

const byCat = new Map();
for (const r of rows) {
  if (!byCat.has(r.categoriaActual)) byCat.set(r.categoriaActual, []);
  byCat.get(r.categoriaActual).push(r);
}

const categoriasRecords = [...byCat.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([cat, items]) => {
    const rubroCounts = new Map();
    for (const it of items) rubroCounts.set(it.rubroPropuesto, (rubroCounts.get(it.rubroPropuesto) || 0) + 1);
    const rubrosOrdenados = [...rubroCounts.entries()].sort((a, b) => b[1] - a[1]);
    const rubroPrincipal = rubrosOrdenados[0][0];
    const rubrosDistintos = rubrosOrdenados.length;
    const confBaja = items.filter((it) => it.confianza === "baja").length;
    const confMedia = items.filter((it) => it.confianza === "media").length;
    return {
      categoriaActual: cat,
      cantidadPartidas: items.length,
      rubroPropuestoPrincipal: rubroPrincipal,
      rubrosDistintosAsociados: rubrosDistintos,
      otrosRubrosAsociados: rubrosOrdenados.slice(1).map(([r]) => r).join(" | "),
      partidasConfianzaBaja: confBaja,
      partidasConfianzaMedia: confMedia,
      esCategoriaMixtaOTransitoria: rubrosDistintos > 1 || confBaja + confMedia > 0 ? "true" : "false",
    };
  });

const CATEGORIAS_HEADERS = [
  "categoriaActual",
  "cantidadPartidas",
  "rubroPropuestoPrincipal",
  "rubrosDistintosAsociados",
  "otrosRubrosAsociados",
  "partidasConfianzaBaja",
  "partidasConfianzaMedia",
  "esCategoriaMixtaOTransitoria",
];
fs.writeFileSync(
  path.join(outDir, "CATEGORIAS_ACTUALES_ECP.csv"),
  toCsv(CATEGORIAS_HEADERS, categoriasRecords),
);

// ---------------------------------------------------------------------------
// 3) DICCIONARIO_TAXONOMICO_ECP.json
// ---------------------------------------------------------------------------

const RUBROS = vocabularios.rubros;
const TIPOS_INTERVENCION = vocabularios.tiposIntervencion;
const ALCANCES = vocabularios.alcances;

const rubroPorCategoriaActual = {};
for (const [cat, items] of byCat.entries()) {
  const counts = new Map();
  for (const it of items) counts.set(it.rubroPropuesto, (counts.get(it.rubroPropuesto) || 0) + 1);
  rubroPorCategoriaActual[cat] = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([r, n]) => ({ rubro: r, partidas: n }));
}

// Especialidad por rubro para los 30 rubros del vocabulario controlado,
// tengan o no partidas asignadas actualmente (regla 6).
const especialidadPorRubro = vocabularios.especialidadPorRubro;

const rubrosSinPartidas = RUBROS.filter((r) => !rows.some((row) => row.rubroPropuesto === r));

const diccionario = {
  version: "1.0.0-fase1a",
  fase: "Fase 1A — propuesta de taxonomía (sin implementar)",
  generadoEl: new Date().toISOString(),
  fuente: {
    archivo: "src/assets/index.js",
    rama: "feature/taxonomia-ecp",
    nota: "Fuente canónica leída pero no modificada por esta fase.",
  },
  totales: {
    partidas: rows.length,
    materialesEnFuente: 327,
    apusEnFuente: 311,
  },
  vocabularioControlado: {
    rubros: RUBROS,
    tiposIntervencion: TIPOS_INTERVENCION,
    alcances: ALCANCES,
  },
  categoriasActualesARubroPropuesto: rubroPorCategoriaActual,
  especialidadPropuestaPorRubro: especialidadPorRubro,
  rubrosSinPartidasAsignadas: rubrosSinPartidas,
  partidasHeredadasMixtas: partidasHeredadasMixtas.map((id) => {
    const r = rows.find((row) => row.id === id);
    return { id, descripcion: r && r.descripcion, rubroPropuesto: r && r.rubroPropuesto, nota: "Partida proveniente de una categoría transitoria (\"Varios\") cuyo rubro final se fijó por decisión humana, agrupando conceptos que en la categoría original no tenían relación funcional directa." };
  }),
  categoriasTransitoriasIdentificadas: [
    "Varios",
    "Reparaciones Generales",
    "Servicios Generales",
    "Servicios",
    "Fachadas y Vidrios",
  ],
  categoriasDuplicadasOEquivalentes: [
    { categorias: ["Impermeable", "Impermeabilización"], rubroUnificado: "Impermeabilización" },
    { categorias: ["Servicios", "Servicios Generales"], rubroUnificado: "Servicios profesionales (parcial; ver overrides por ítem)" },
    { categorias: ["Equipamiento", "Equipamiento Comercial"], rubroUnificado: "Equipamiento y mobiliario" },
    { categorias: ["Seguridad", "Corrientes Débiles"], rubroUnificado: "Corrientes débiles y seguridad electrónica" },
  ],
  categoriasQueMezclanRubroEIntervencion: [
    "Metalcon NC", "Metalcon Rem.", "Metalcon Mant.", "Metalcon Estructural",
    "Madera NC", "Madera Mant.",
    "Mantención Pintura", "Mantención Sanitaria", "Mantención Eléctrica", "Mantención Techumbres", "Mantención Preventiva",
    "Demolición", "Regularización",
  ],
  categoriasQueMezclanMaterialOSistemaConstructivo: [
    "Metalcon NC", "Metalcon Rem.", "Metalcon Mant.", "Metalcon Estructural",
    "Madera NC", "Madera Mant.",
    "Hormigón Armado", "Hormigón y Albañilería",
  ],
  erroresOrtograficosDetectados: [
    { categoria: "Ojalaería", problema: 'Grafía incorrecta; el término correcto es "Hojalatería" (oficio de trabajar chapa/lámina metálica: canales, bajantes, cubiertas).', sugerencia: "Hojalatería" },
    { categoria: "Mov. de Tierras", problema: "Abreviatura inconsistente con el resto de las categorías (todas las demás usan el nombre completo).", sugerencia: "Movimiento de Tierras" },
  ],
};

fs.writeFileSync(path.join(outDir, "DICCIONARIO_TAXONOMICO_ECP.json"), JSON.stringify(diccionario, null, 2));

// ---------------------------------------------------------------------------
// 4) REPORTE_TAXONOMIA_ECP.md
// ---------------------------------------------------------------------------

const totalCategorias = byCat.size;
const totalRubrosUsados = new Set(rows.map((r) => r.rubroPropuesto)).size;
const rubroDist = [...rows.reduce((m, r) => m.set(r.rubroPropuesto, (m.get(r.rubroPropuesto) || 0) + 1), new Map())]
  .sort((a, b) => b[1] - a[1]);
const bajaItems = rows.filter((r) => r.confianza === "baja").sort((a, b) => a.id - b.id);
const mediaItems = rows.filter((r) => r.confianza === "media").sort((a, b) => a.id - b.id);
const revisionItems = rows.filter((r) => r.requiereRevisionHumana).sort((a, b) => a.id - b.id);

function mdTable(headers, records) {
  const esc = (v) => String(v == null ? "" : v).replace(/\|/g, "\\|");
  let out = "| " + headers.join(" | ") + " |\n";
  out += "|" + headers.map(() => "---").join("|") + "|\n";
  for (const r of records) out += "| " + headers.map((h) => esc(r[h])).join(" | ") + " |\n";
  return out;
}

const reporte = `# Reporte de taxonomía propuesta — ECP (Fase 1A)

Generado automáticamente a partir de la biblioteca canónica actual (\`src/assets/index.js\`, rama \`feature/taxonomia-ecp\`). **La fuente canónica no fue modificada**: este reporte y los archivos que lo acompañan (\`PARTIDAS_TAXONOMIA_PROPUESTA.csv\`, \`CATEGORIAS_ACTUALES_ECP.csv\`, \`DICCIONARIO_TAXONOMICO_ECP.json\`) son una **propuesta** para revisión humana antes de cualquier implementación.

## 0. Correcciones aplicadas en esta revisión

Esta es la segunda versión de la propuesta. La primera contenía errores sistemáticos entre partidas de confianza alta (el rubro se determinaba a veces por el material/sistema constructivo en vez de por la función de la partida). Se corrigió:

1. **Rubro por función, no por material**: radier, losas, pilares, vigas y fundaciones de hormigón dejaron de heredar el rubro Albañilería de su categoría original y pasaron a *Hormigón y fundaciones*; las techumbres de Metalcon o madera pasaron de *Construcción liviana* a *Techumbres y aguas lluvias*, independientemente de su sistema constructivo.
2. **Subrubro nunca igual a una categoría antigua**: el subrubro ya no hereda nombres como \`Metalcon Mant.\`, \`Madera Mant.\`, \`Metalcon NC\`, \`Impermeable\` o \`Varios\`; cuando no hay una palabra clave más específica, se usa el propio rubro propuesto.
3. **Prioridad semántica del tipo de intervención**: se reordenó para que "mantención"/"repaso" → Mantención; "reparación"/"parche"/"sellado de fisura" → Reparación; "cambio"/"reemplazo" → Reposición — en ese orden, antes que cualquier valor por defecto. Ninguna partida con esas palabras puede quedar como Obra nueva (ver \`VALIDACION_SEMANTICA_TAXONOMIA.md\`, reglas R2 y R3).
4. **Subcontrato solo con evidencia explícita**: el alcance "Subcontrato" exige que la descripción, el APU vinculado o su base técnica lo indiquen; sin esa evidencia se usa "Servicio completo" u otro alcance (ver \`VALIDACION_SEMANTICA_TAXONOMIA.md\`, regla R5).
5. **\`sistemaConstructivoPropuesto\`** separa ahora "No aplica" (sin sistema constructivo aplicable) de "Mixto" (partida que combina varios sistemas); se eliminó el valor combinado "No aplica / mixto".
6. **20 decisiones humanas explícitas** se aplicaron como corrección final sobre las partidas que en la revisión anterior quedaron con confianza baja o media (ver columna \`observacion\` de cada una); solo 2 partidas (id 363 y 432) permanecen deliberadamente marcadas para revisión humana, por instrucción explícita de no asignarlas automáticamente a un rubro.

El detalle regla por regla, con las excepciones encontradas (si las hay), está en **\`docs/taxonomia/VALIDACION_SEMANTICA_TAXONOMIA.md\`**.

## 1. Resumen cuantitativo

- **Categorías actuales (\`cat\`) distintas en el catálogo:** ${totalCategorias}
- **Rubros propuestos utilizados:** ${totalRubrosUsados} de 30 posibles (los 30 rubros del vocabulario controlado permanecen definidos aunque alguno tenga cero partidas asignadas; no es obligatorio usarlos todos)
- **Partidas clasificadas:** ${rows.length} de 311
- **Partidas que requieren revisión humana:** ${revisionItems.length} (${((revisionItems.length / rows.length) * 100).toFixed(1)}%)
  - Confianza **baja**: ${bajaItems.length}
  - Confianza **media**: ${mediaItems.length}
  - Confianza **alta** (no requiere revisión): ${rows.length - revisionItems.length}

## 2. Categorías duplicadas o equivalentes

Se detectaron categorías actuales que representan el mismo rubro real bajo nombres distintos:

| Categorías actuales | Rubro propuesto unificado |
|---|---|
| \`Impermeable\` / \`Impermeabilización\` | Impermeabilización |
| \`Servicios\` / \`Servicios Generales\` | Servicios profesionales (parcial — ambas son catch-all, ver sección 5) |
| \`Equipamiento\` / \`Equipamiento Comercial\` | Equipamiento y mobiliario |
| \`Seguridad\` / \`Corrientes Débiles\` | Corrientes débiles y seguridad electrónica (contenido muy similar: CCTV, alarmas, control de acceso) |

## 3. Errores ortográficos detectados

- **\`Ojalaería\`** — grafía incorrecta. El término correcto del oficio es **"Hojalatería"** (trabajo en chapa/lámina metálica: canales, bajantes, cubiertas de zinc). Falta la "h" inicial y la "t".
- **\`Mov. de Tierras\`** — es la única categoría abreviada; el resto de las 51 categorías usa el nombre completo (debería ser "Movimiento de Tierras" para consistencia, no es un error ortográfico estricto pero sí de formato).

## 4. Categorías que mezclan rubro (qué se hace) con tipo de intervención (cuándo/por qué se hace)

Varias categorías actuales codifican en el mismo nombre tanto el sistema constructivo como la etapa del proyecto, lo que impide filtrar por una sola dimensión:

- **Familia Metalcon**: \`Metalcon NC\` (obra nueva), \`Metalcon Rem.\` (remodelación), \`Metalcon Mant.\` (mantención), \`Metalcon Estructural\` (uso estructural/carga) — 4 categorías para un mismo sistema constructivo, separadas por intervención en vez de por rubro.
- **Familia Madera**: \`Madera NC\` (obra nueva) vs. \`Madera Mant.\` (mantención) — mismo patrón.
- **Familia "Mantención \\*"**: \`Mantención Pintura\`, \`Mantención Sanitaria\`, \`Mantención Eléctrica\`, \`Mantención Techumbres\`, \`Mantención Preventiva\` — el prefijo "Mantención" es en realidad un valor de \`tipoIntervencionPropuesto\`, no un rubro; cada una debería vivir dentro del rubro técnico correspondiente (Pinturas y recubrimientos, Instalaciones sanitarias, Instalaciones eléctricas, Techumbres y aguas lluvias) con \`tipoIntervencionPropuesto = "Mantención preventiva"\` o \`"Mantención correctiva"\`.
- **\`Demolición\` y \`Regularización\`**: coinciden por diseño con un valor del vocabulario de \`tipoIntervencionPropuesto\`; en este caso el rubro propuesto (Demoliciones y desmontajes / Servicios profesionales) es igualmente válido y se mantuvo, pero se documenta la coincidencia para que quede explícita.

## 5. Categorías que mezclan material/sistema constructivo con función

La misma familia Metalcon/Madera mezcla además **sistema constructivo** con **rubro funcional**: por ejemplo \`Metalcon NC\` agrupa tabiques, techumbres y cielos —tres rubros funcionales distintos (Construcción liviana, Techumbres y aguas lluvias, Cielos y terminaciones)— solo porque comparten el mismo material de estructura. Este trabajo de clasificación separó esas partidas por función real (ver columna \`rubroPropuesto\`) y dejó el material en \`sistemaConstructivoPropuesto\`.

También \`Hormigón Armado\` vs. \`Hormigón y Albañilería\` se superponen parcialmente (radieres y fundaciones aparecen repartidos entre ambas).

## 6. Categorías transitorias / catch-all identificadas

Estas categorías no representan un rubro técnico coherente; agrupan partidas heterogéneas y **cada partida fue reclasificada individualmente** en vez de heredar un rubro común:

- \`Varios\` (2 partidas)
- \`Reparaciones Generales\` (2 partidas)
- \`Servicios Generales\` (4 partidas)
- \`Servicios\` (1 partida)
- \`Fachadas y Vidrios\` (2 partidas — una es fachada real, la otra es una ventana que corresponde a carpintería)

**Partidas heredadas de categorías mixtas (\`partidaHeredadaMixta\`):** ${partidasHeredadasMixtas.length > 0 ? partidasHeredadasMixtas.map((id) => "id " + id).join(", ") + " — su rubro final se fijó por decisión humana explícita (ver \`observacion\` y \`DICCIONARIO_TAXONOMICO_ECP.json > partidasHeredadasMixtas\`), no por una regla automática." : "ninguna."}

## 7. Partidas ambiguas (requieren revisión humana)

${mdTable(
  ["id", "categoriaActual", "descripcion", "rubroPropuesto", "confianza", "motivo"],
  revisionItems.map((r) => ({
    id: r.id,
    categoriaActual: r.categoriaActual,
    descripcion: r.descripcion,
    rubroPropuesto: r.rubroPropuesto,
    confianza: r.confianza,
    motivo: r.observacion || "—",
  })),
)}

## 8. Distribución de partidas por rubro propuesto

${mdTable(
  ["rubroPropuesto", "cantidadPartidas", "porcentaje"],
  rubroDist.map(([rubro, n]) => ({ rubroPropuesto: rubro, cantidadPartidas: n, porcentaje: ((n / rows.length) * 100).toFixed(1) + "%" })),
)}

**Rubros del vocabulario controlado sin partidas asignadas actualmente (${rubrosSinPartidas.length}):** ${rubrosSinPartidas.length > 0 ? rubrosSinPartidas.map((r) => "\`" + r + "\`").join(", ") : "ninguno — los 30 rubros tienen al menos una partida."} Permanecen definidos en el vocabulario controlado (regla 6): no es obligatorio que todo rubro tenga partidas para seguir existiendo como categoría válida.

## 9. Partidas con confianza baja (prioridad de revisión)

${mdTable(
  ["id", "categoriaActual", "descripcion", "rubroPropuesto", "observacion"],
  bajaItems.map((r) => ({ id: r.id, categoriaActual: r.categoriaActual, descripcion: r.descripcion, rubroPropuesto: r.rubroPropuesto, observacion: r.observacion || "—" })),
)}

## 10. Metodología

La clasificación se generó con un script determinístico (\`scripts/classify_taxonomy.js\`) que:

1. Parte de un mapa categoría-actual → rubro-base, **sin asumir que ese mapeo es siempre correcto**.
2. Aplica un conjunto de reglas por ítem (por palabra clave en la descripción) que **corrige** el rubro base cuando la categoría original es transitoria, mezcla dos rubros, o el nombre de la partida indica claramente un rubro distinto (ej.: "Cámara de inspección" dentro de la categoría "Sanitario" se reclasifica a *Alcantarillado y drenaje* en vez de *Instalaciones sanitarias*).
3. Usa el campo \`estructura\` del APU vinculado (Hormigón / Metalcon / Madera / Estructuras Metálicas) y palabras clave de material (PVC, PPR, cobre, ACMA, aluminio, cerámico, etc.) para proponer \`sistemaConstructivoPropuesto\`, dando prioridad a las palabras clave de la descripción por sobre el campo genérico del APU (que en esta fuente usa "Hormigón" como etiqueta estructural amplia incluso para muros de albañilería reforzada).
4. Usa \`esSubcontrato\` del APU y palabras clave (fabricación, retiro, sin instalación, jornada, etc.) para proponer \`alcancePropuesto\`.
5. Asigna \`confianza\` según si hubo una regla explícita por ítem (que ya declara su propia confianza), si la categoría original es transitoria (confianza baja por defecto), o si el ítem no tiene APU vinculado (baja un nivel).

## 11. Recomendaciones antes de implementar

1. **Decidir el rubro final de las ${bajaItems.length} partidas aún marcadas de confianza baja** (sección 9: id 363 "Traslado y acarreo de mobiliario" e id 432 "Transporte en camión tolva") — quedaron deliberadamente sin asignación automática a "Obras preliminares" ni "Demoliciones y desmontajes" por instrucción explícita; hoy están en un rubro de resguardo ("Servicios profesionales") y requieren una decisión humana puntual.
2. **Resolver las categorías catch-all antes de cualquier migración de datos** (\`Varios\`, \`Servicios\`, \`Servicios Generales\`, \`Reparaciones Generales\`, \`Fachadas y Vidrios\`) — la mayoría de sus partidas ya recibieron una decisión humana explícita en esta fase (ver \`observacion\`), pero la fusión real de categorías en la fuente canónica sigue pendiente.
3. **Decidir si \`subrubroPropuesto\` se deja como campo libre o se convierte en un segundo vocabulario controlado** antes de implementar: hoy es una etiqueta descriptiva de apoyo (no validada contra una lista cerrada, aunque sí validada para que nunca repita el nombre de una categoría actual) y en ${rows.filter((r) => r.subrubroPropuesto === r.rubroPropuesto).length} partidas (${((rows.filter((r) => r.subrubroPropuesto === r.rubroPropuesto).length / rows.length) * 100).toFixed(0)}%) no se encontró un subrubro más específico que el propio rubro propuesto.
4. **No fusionar categorías automáticamente**: aunque \`Impermeable\`/\`Impermeabilización\` y \`Seguridad\`/\`Corrientes Débiles\` apuntan al mismo rubro propuesto, la fusión de categorías en la fuente canónica es una operación separada que debe hacerse partida por partida, con el mismo cuidado que cualquier cambio a \`src/assets/index.js\` (ver \`docs/FUENTE_CANONICA_ECP.md\`).
5. **Tratar \`especialidadPropuesta\` como una primera aproximación**, no como un campo validado: se derivó 1:1 desde el rubro propuesto y no distingue casos donde una misma partida podría requerir dos especialidades (ej. un muro cortina es a la vez fachada y carpintería de aluminio/vidrio).
6. **Esta propuesta no incluyó los 327 materiales ni los 311 APU** más allá de usarlos como señal de clasificación (campo \`estructura\`, \`esSubcontrato\`); una Fase 1B debería evaluar si materiales y APU necesitan su propia taxonomía o heredan la de su partida vinculada.
7. **No implementar los campos nuevos en \`src/assets/index.js\` todavía** — esta fase es solo de preparación y revisión, según lo solicitado explícitamente.

---

*Archivos generados en esta fase: \`CATEGORIAS_ACTUALES_ECP.csv\`, \`PARTIDAS_TAXONOMIA_PROPUESTA.csv\`, \`DICCIONARIO_TAXONOMICO_ECP.json\`, este reporte. Script generador: \`scripts/classify_taxonomy.js\` + \`scripts/generate_taxonomy_artifacts.js\` (reproducibles, no destructivos, no tocan la fuente canónica).*
`;

fs.writeFileSync(path.join(outDir, "REPORTE_TAXONOMIA_ECP.md"), reporte);

console.log(JSON.stringify({
  outDir,
  files: [
    "CATEGORIAS_ACTUALES_ECP.csv",
    "PARTIDAS_TAXONOMIA_PROPUESTA.csv",
    "DICCIONARIO_TAXONOMICO_ECP.json",
    "REPORTE_TAXONOMIA_ECP.md",
  ],
  totalCategorias,
  totalRubrosUsados,
  totalPartidas: rows.length,
  requiereRevisionHumana: revisionItems.length,
}, null, 2));
