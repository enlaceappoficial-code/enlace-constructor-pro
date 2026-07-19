"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src", "app.html");
const outputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "target", "auditoria_apu_tecnica.json");

const source = fs.readFileSync(sourcePath, "utf8");

function extractArray(constName) {
  const marker = `const ${constName}=`;
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) throw new Error(`No se encontro ${marker}`);
  const start = source.indexOf("[", markerAt + marker.length);
  if (start < 0) throw new Error(`No se encontro el array ${constName}`);

  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let depth = 0;
  let end = -1;

  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && next === "/") {
      lineComment = true;
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end < 0) throw new Error(`Array ${constName} sin cierre`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(`value=${source.slice(start, end)}`, context);
  return JSON.parse(JSON.stringify(context.value));
}

function norm(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normUnit(value) {
  return norm(String(value || "").replace(/²/g, "2").replace(/³/g, "3"))
    .replace(/^m 2$/, "m2")
    .replace(/^m 3$/, "m3")
    .replace(/^unidad es$/, "unidad")
    .replace(/^global$/, "gl");
}

function duplicateGroups(records, keyFn) {
  const groups = new Map();
  for (const record of records) {
    const key = keyFn(record);
    if (!key) continue;
    const list = groups.get(key) || [];
    list.push(record.id);
    groups.set(key, list);
  }
  return [...groups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, ids }));
}

function issue(level, code, apu, detail, extra = {}) {
  return {
    level,
    code,
    apuId: apu && apu.id,
    apu: apu && apu.nombre,
    detail,
    ...extra,
  };
}

const catalog = extractArray("DCAT");
const materials = extractArray("DMAT");
const apus = extractArray("DAPU");
const catalogById = new Map(catalog.map((x) => [x.id, x]));
const materialById = new Map(materials.map((x) => [x.id, x]));
const issues = [];
const apuAnalysis = [];

const duplicateIds = {
  catalog: duplicateGroups(catalog, (x) => String(x.id)),
  materials: duplicateGroups(materials, (x) => String(x.id)),
  apus: duplicateGroups(apus, (x) => String(x.id)),
};
const duplicateNames = {
  catalog: duplicateGroups(catalog, (x) => norm(x.desc)),
  materials: duplicateGroups(materials, (x) => norm(x.nombre)),
  apus: duplicateGroups(apus, (x) => norm(x.nombre)),
};
const duplicateCompositions = duplicateGroups(apus, (apu) => {
  const lines = (apu.materiales || [])
    .map((x) => `${x.materialId}:${Number(x.cantidad)}`)
    .sort()
    .join("|");
  if (!lines) return "";
  return `${normUnit(apu.unidad)}|${lines}|mo:${Number(apu.precioMO || 0)}`;
});

for (const apu of apus) {
  const catalogItem = catalogById.get(apu.catalogId);
  const lines = Array.isArray(apu.materiales) ? apu.materiales : [];
  const name = norm(apu.nombre);

  if (!catalogItem) {
    issues.push(issue("critical", "CATALOG_MISSING", apu, `Partida ${apu.catalogId} inexistente`));
  } else if (normUnit(catalogItem.unidad) !== normUnit(apu.unidad)) {
    issues.push(
      issue(
        "high",
        "UNIT_CATALOG_MISMATCH",
        apu,
        `APU ${apu.unidad}; partida ${catalogItem.unidad}`,
        { catalogId: catalogItem.id, catalog: catalogItem.desc },
      ),
    );
  }

  if (!apu.esSubcontrato && lines.length === 0 && !(Number(apu.precioMO) > 0)) {
    issues.push(issue("critical", "NO_COST_COMPONENT", apu, "Sin materiales, subcontrato ni precio base de mano de obra"));
  }
  if (apu.esSubcontrato && !(Number(apu.precioSubcontrato) > 0)) {
    issues.push(issue("critical", "INVALID_SUBCONTRACT_PRICE", apu, "Subcontrato sin precio positivo"));
  }
  if (!(Number(apu.pctGG) >= 0 && Number(apu.pctGG) <= 100)) {
    issues.push(issue("high", "INVALID_GG", apu, `GG fuera de rango: ${apu.pctGG}`));
  }
  if (!(Number(apu.pctUtilidad) >= 0 && Number(apu.pctUtilidad) <= 100)) {
    issues.push(issue("high", "INVALID_PROFIT", apu, `Utilidad fuera de rango: ${apu.pctUtilidad}`));
  }
  if (!apu.esSubcontrato && !(Number(apu.precioMO) > 0) && !(Number(apu.pctMO) >= 0 && Number(apu.pctMO) <= 300)) {
    issues.push(issue("high", "INVALID_LABOR", apu, `MO fuera de rango: ${apu.pctMO}`));
  }
  const productivity = Number(apu.rendimiento);
  const crew = Number(apu.dotacion);
  if (!Number.isFinite(productivity) || productivity <= 0 || !Number.isFinite(crew) || crew <= 0) {
    issues.push(issue("medium", "MISSING_PRODUCTIVITY", apu, `Rendimiento ${apu.rendimiento || 0}; dotacion ${apu.dotacion || 0}`));
  }

  let materialsCost = 0;
  const seen = new Set();
  const selectedNames = [];
  const selectedCategories = [];
  for (const line of lines) {
    const material = materialById.get(line.materialId);
    if (!material) {
      issues.push(issue("critical", "MATERIAL_MISSING", apu, `Material ${line.materialId} inexistente`));
      continue;
    }
    if (!(Number(line.cantidad) > 0)) {
      issues.push(issue("high", "INVALID_QUANTITY", apu, `${material.nombre}: cantidad ${line.cantidad}`));
    }
    if (!(Number(material.precio) >= 0)) {
      issues.push(issue("high", "INVALID_MATERIAL_PRICE", apu, `${material.nombre}: precio ${material.precio}`));
    }
    if (seen.has(line.materialId)) {
      issues.push(issue("medium", "DUPLICATE_MATERIAL_LINE", apu, `${material.nombre} repetido`));
    }
    seen.add(line.materialId);
    selectedNames.push(norm(material.nombre));
    selectedCategories.push(norm(material.cat));
    materialsCost += Number(material.precio || 0) * Number(line.cantidad || 0);
  }

  const selectedText = selectedNames.join(" | ");

  if (/muro perimetral metalcon|tabique metalcon/.test(name)) {
    const studQuantity = lines.reduce((sum, line) => {
      const material = materialById.get(line.materialId);
      return sum + (/montante/.test(norm(material && material.nombre)) ? Number(line.cantidad || 0) : 0);
    }, 0);
    const trackQuantity = lines.reduce((sum, line) => {
      const material = materialById.get(line.materialId);
      return sum + (/solera|canal tabique/.test(norm(material && material.nombre)) ? Number(line.cantidad || 0) : 0);
    }, 0);
    if (studQuantity > 0 && trackQuantity / studQuantity > 0.5) {
      issues.push(
        issue(
          "high",
          "METALCON_FRAME_RATIO_REVIEW",
          apu,
          `Montantes ${studQuantity} ml y soleras ${trackQuantity} ml por ${apu.unidad}; la relacion requiere recalculo segun altura y separacion`,
        ),
      );
    }
    if (!apu.baseTecnica || !(Number(apu.baseTecnica.separacionM) > 0)) {
      issues.push(issue("medium", "METALCON_BASE_MISSING", apu, "Falta registrar altura/separación usada para calcular la perfilería"));
    }
  }

  if (/metalcon 65mm/.test(name) && /100x50/.test(selectedText)) {
    issues.push(issue("high", "PROFILE_SIZE_MISMATCH", apu, "La APU de 65 mm utiliza perfiles de 100x50 mm"));
  }

  if (/cielo.*metalcon|ampliacion cielo/.test(name) && /solera 100x50|solera 150x50/.test(selectedText)) {
    issues.push(
      issue(
        "high",
        "CEILING_PROFILE_SYSTEM_REVIEW",
        apu,
        "El cielo usa soleras estructurales de muro 100/150 mm; falta definir el sistema portante y perimetral de cielo",
      ),
    );
  }
  if (/cielo.*metalcon|ampliacion cielo/.test(name)) {
    const hasPortante = /portante 40r/.test(selectedText);
    const hasAt = /perfil at/.test(selectedText);
    const hasTi = /conector ti/.test(selectedText);
    if (!(hasPortante && hasAt && hasTi)) {
      issues.push(issue("high", "CEILING_SYSTEM_INCOMPLETE", apu, "El cielo debe incluir Portante 40R, Perfil AT y Conector TI"));
    }
    if (!apu.baseTecnica || !(Number(apu.baseTecnica.separacionPortantesM) > 0)) {
      issues.push(issue("medium", "CEILING_BASE_MISSING", apu, "Falta registrar la separación usada para calcular los portantes"));
    }
  }

  const gypsumBoardCoverage = lines.reduce((sum, line) => {
    const material = materialById.get(line.materialId);
    return sum + (/placa yeso|volcanita/.test(norm(material && material.nombre)) ? Number(line.cantidad || 0) * 2.88 : 0);
  }, 0);
  if (/1 placa yeso/.test(name) && gypsumBoardCoverage > 0 && gypsumBoardCoverage < 0.9) {
    issues.push(
      issue(
        "high",
        "BOARD_COVERAGE_LOW",
        apu,
        `Las placas cubren aproximadamente ${gypsumBoardCoverage.toFixed(2)} m2 por m2 de tabique`,
      ),
    );
  }
  if (/doble placa yeso/.test(name) && gypsumBoardCoverage > 0 && gypsumBoardCoverage < 1.8) {
    issues.push(
      issue(
        "high",
        "BOARD_COVERAGE_LOW",
        apu,
        `La doble placa cubre aproximadamente ${gypsumBoardCoverage.toFixed(2)} m2 por m2; se esperaria cerca de 2 m2`,
      ),
    );
  }

  if (/zinc 0 5/.test(name) && /cumbrera zinc 0 35/.test(selectedText)) {
    issues.push(issue("high", "THICKNESS_COMPONENT_MISMATCH", apu, "Cubierta de 0,5 mm combinada con cumbrera de 0,35 mm"));
  }

  const sealantKinds = ["sikaflex", "silicona", "sellante poliuretano"].filter((token) => selectedText.includes(token));
  if (sealantKinds.length >= 2) {
    issues.push(
      issue(
        "medium",
        "ALTERNATIVE_SEALANTS_CUMULATIVE",
        apu,
        `Se cobran simultaneamente sellantes que normalmente son alternativas: ${sealantKinds.join(", ")}`,
      ),
    );
  }

  if (/estuco/.test(name) && /estuco (exterior|interior)/.test(selectedText) && /cemento/.test(selectedText) && /arena/.test(selectedText)) {
    issues.push(
      issue(
        "medium",
        "MIXED_PREMIX_RAW_SYSTEM",
        apu,
        "Combina estuco premezclado con cemento y arena; debe definirse una dosificacion propia o un producto premezclado",
      ),
    );
  }

  if (/hormigon h 20 premezclado/.test(selectedText) && /arena lavada|piedra chancada/.test(selectedText)) {
    issues.push(
      issue(
        "medium",
        "PREMIX_EXTRA_AGGREGATE_REVIEW",
        apu,
        "Combina hormigon premezclado con agregado adicional; confirmar si corresponde a una capa independiente",
      ),
    );
  }

  if (/enfierradura habilitada/.test(name)) {
    const steelLines = selectedNames.filter((materialName) => /acero corrugado/.test(materialName));
    if (steelLines.length > 1 && !/alambre/.test(selectedText)) {
      issues.push(
        issue(
          "high",
          "REBAR_COMPOSITION_REVIEW",
          apu,
          "Registra dos lineas de acero y no incorpora alambre de amarre; revisar la composicion por kg instalado",
        ),
      );
    }
  }

  const semanticRules = [
    { when: /h 20/, need: /h 20/, label: "H-20" },
    { when: /h 25/, need: /h 25/, label: "H-25" },
    { when: /h 30/, need: /h 30/, label: "H-30" },
    { when: /ppr/, need: /ppr/, label: "PPR" },
    { when: /pvc/, need: /pvc/, label: "PVC" },
    { when: /zinc 0 35/, need: /zinc.*0 35/, label: "zinc 0,35 mm" },
    { when: /zinc 0 5/, need: /zinc.*0 5/, label: "zinc 0,5 mm" },
    { when: /terciado 9mm/, need: /terciado.*9mm/, label: "terciado 9 mm" },
    { when: /terciado 12mm/, need: /terciado.*12mm/, label: "terciado 12 mm" },
    { when: /porcelanato/, need: /porcelanato/, label: "porcelanato" },
    { when: /ceramico/, need: /ceramic/, label: "ceramico" },
    { when: /vinilico/, need: /vinil/, label: "vinilico" },
    { when: /policarbonato/, need: /policarbonato/, label: "policarbonato" },
  ];
  for (const rule of semanticRules) {
    if (rule.when.test(name) && lines.length > 0 && !rule.need.test(selectedText)) {
      issues.push(issue("high", "NAME_MATERIAL_MISMATCH", apu, `El nombre exige ${rule.label}, pero no aparece en los materiales`));
    }
  }

  const incompatibleRules = [
    { apu: /ppr/, material: /pegamento pvc/, label: "PPR con pegamento PVC" },
    { apu: /vinilico.*click/, material: /adhesivo acrilico/, label: "vinilico click con adhesivo acrilico" },
    { apu: /radier.*premezclado|radier.*h 2/, material: /arena gruesa/, label: "hormigon premezclado con arena gruesa adicional" },
    { apu: /enfierradura/, material: /moldaje/, label: "enfierradura con moldaje" },
  ];
  for (const rule of incompatibleRules) {
    if (rule.apu.test(name) && rule.material.test(selectedText)) {
      issues.push(issue("high", "INCOMPATIBLE_MATERIAL", apu, rule.label));
    }
  }

  const laborCost = Number(apu.precioMO) > 0
    ? Number(apu.precioMO)
    : materialsCost * Number(apu.pctMO || 0) / 100;
  const base = apu.esSubcontrato ? Number(apu.precioSubcontrato || 0) : materialsCost + laborCost;
  const gg = base * Number(apu.pctGG || 0) / 100;
  const profit = (base + gg) * Number(apu.pctUtilidad || 0) / 100;
  const computed = base + gg + profit;
  apuAnalysis.push({
    id: apu.id,
    name: apu.nombre,
    catalogId: apu.catalogId,
    catalog: catalogItem && catalogItem.desc,
    unit: apu.unidad,
    category: apu.categoria,
    subcontract: Boolean(apu.esSubcontrato),
    productivity: Number(apu.rendimiento || 0),
    crew: Number(apu.dotacion || 0),
    materialsCost: Math.round(materialsCost),
    laborCost: Math.round(laborCost),
    computedPrice: Math.round(computed),
    referencePrice: Number(catalogItem && catalogItem.precio || 0),
    materials: lines.map((line) => {
      const material = materialById.get(line.materialId);
      return {
        id: line.materialId,
        name: material && material.nombre,
        unit: material && material.unidad,
        quantity: Number(line.cantidad || 0),
        price: Number(material && material.precio || 0),
      };
    }),
  });
  if (!(computed > 0)) {
    issues.push(issue("critical", "ZERO_COMPUTED_PRICE", apu, "Precio APU calculado igual a cero"));
  }
  if (catalogItem && Number(catalogItem.precio) > 0 && computed > 0) {
    const ratio = computed / Number(catalogItem.precio);
    if (ratio < 0.5 || ratio > 2) {
      issues.push(
        issue(
          "medium",
          "REFERENCE_PRICE_OUTLIER",
          apu,
          `Calculado $${Math.round(computed)} vs referencia $${catalogItem.precio} (${ratio.toFixed(2)}x)`,
        ),
      );
    }
  }
}

for (const group of duplicateIds.apus) {
  issues.push({ level: "critical", code: "DUPLICATE_APU_ID", apuId: group.ids[0], detail: `ID repetido: ${group.ids.join(", ")}` });
}

for (const group of duplicateCompositions) {
  const variants = group.ids.map((id) => apus.find((apu) => apu.id === id)).filter(Boolean);
  const hasInterventionVariant = variants.some((apu) => /cambio|retiro|reparacion|mantencion/.test(norm(apu.nombre)));
  const hasBaseVariant = variants.some((apu) => !/cambio|retiro|reparacion|mantencion/.test(norm(apu.nombre)));
  if (hasInterventionVariant && hasBaseVariant) {
    const target = variants.find((apu) => /cambio|retiro|reparacion|mantencion/.test(norm(apu.nombre)));
    issues.push(
      issue(
        "medium",
        "VARIANT_REUSES_BASE_COMPOSITION",
        target,
        `Comparte exactamente los materiales con la APU base: ${variants.map((apu) => `${apu.id} ${apu.nombre}`).join(" / ")}`,
      ),
    );
  }
}

const productivityFamilies = new Map();
for (const apu of apus) {
  const family = norm(apu.nombre)
    .replace(/h (20|25|30)/g, "h")
    .replace(/\s+/g, " ")
    .trim();
  const list = productivityFamilies.get(family) || [];
  list.push(apu);
  productivityFamilies.set(family, list);
}
for (const variants of productivityFamilies.values()) {
  if (variants.length < 2) continue;
  const valid = variants.filter((apu) => Number(apu.rendimiento) > 0);
  if (valid.length < 2) continue;
  const minimum = Math.min(...valid.map((apu) => Number(apu.rendimiento)));
  const maximum = Math.max(...valid.map((apu) => Number(apu.rendimiento)));
  if (maximum / minimum >= 5) {
    const target = valid.find((apu) => Number(apu.rendimiento) === maximum);
    issues.push(
      issue(
        "high",
        "PRODUCTIVITY_FAMILY_OUTLIER",
        target,
        `Rendimiento ${maximum} frente a ${minimum} en variantes equivalentes: ${valid.map((apu) => `${apu.id} ${apu.nombre}`).join(" / ")}`,
      ),
    );
  }
}

const rank = { critical: 0, high: 1, medium: 2, low: 3 };
issues.sort((a, b) =>
  (rank[a.level] ?? 9) - (rank[b.level] ?? 9) ||
  Number(a.apuId || 0) - Number(b.apuId || 0) ||
  a.code.localeCompare(b.code),
);

const byLevel = issues.reduce((acc, x) => {
  acc[x.level] = (acc[x.level] || 0) + 1;
  return acc;
}, {});
const byCode = issues.reduce((acc, x) => {
  acc[x.code] = (acc[x.code] || 0) + 1;
  return acc;
}, {});
const apusWithIssues = new Set(issues.map((x) => x.apuId).filter(Boolean));
const linkedCatalogIds = new Set(apus.map((x) => x.catalogId));
const usedMaterialIds = new Set(apus.flatMap((x) => (x.materiales || []).map((line) => line.materialId)));
const unlinkedCatalog = catalog
  .filter((x) => !linkedCatalogIds.has(x.id))
  .map((x) => ({ id: x.id, category: x.cat, description: x.desc, unit: x.unidad, referencePrice: x.precio }));
const unusedMaterials = materials
  .filter((x) => !usedMaterialIds.has(x.id))
  .map((x) => ({ id: x.id, category: x.cat, name: x.nombre, unit: x.unidad, price: x.precio }));

const report = {
  generatedAt: new Date().toISOString(),
  source: path.relative(root, sourcePath),
  totals: {
    catalog: catalog.length,
    materials: materials.length,
    apus: apus.length,
    apusWithIssues: apusWithIssues.size,
    apusWithoutIssues: apus.length - apusWithIssues.size,
    issues: issues.length,
    linkedCatalog: linkedCatalogIds.size,
    unlinkedCatalog: unlinkedCatalog.length,
    usedMaterials: usedMaterialIds.size,
    unusedMaterials: unusedMaterials.length,
  },
  byLevel,
  byCode,
  duplicates: {
    ids: duplicateIds,
    names: duplicateNames,
    compositions: duplicateCompositions,
  },
  coverage: { unlinkedCatalog, unusedMaterials },
  apuAnalysis,
  issues,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ outputPath, ...report.totals, byLevel, byCode }, null, 2));
