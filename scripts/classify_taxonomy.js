"use strict";
// Fase 1A de taxonomia ECP: clasifica las 311 partidas del catalogo canonico
// en la taxonomia normalizada propuesta, SIN tocar la fuente canonica.
// Solo lee target/taxonomy_raw_{catalog,materials,apus}.json (generados por
// scripts/extract_taxonomy_data.js) y escribe artefactos en docs/taxonomia/.

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const targetDir = path.join(root, "target");
const outDir = path.join(root, "docs", "taxonomia");
fs.mkdirSync(outDir, { recursive: true });

const catalog = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_raw_catalog.json"), "utf8"));
const apus = JSON.parse(fs.readFileSync(path.join(targetDir, "taxonomy_raw_apus.json"), "utf8"));
const apuByCatalogId = new Map(apus.map((a) => [a.catalogId, a]));

// ---------------------------------------------------------------------------
// Vocabularios controlados (dados por el usuario, no editar sin instruccion)
// ---------------------------------------------------------------------------

const RUBROS = [
  "Obras preliminares",
  "Demoliciones y desmontajes",
  "Movimiento de tierras",
  "Hormigón y fundaciones",
  "Albañilería",
  "Estructuras metálicas",
  "Construcción liviana",
  "Techumbres y aguas lluvias",
  "Impermeabilización",
  "Aislación y eficiencia energética",
  "Fachadas y cerramientos",
  "Puertas, ventanas y carpinterías",
  "Pisos y revestimientos",
  "Cielos y terminaciones",
  "Pinturas y recubrimientos",
  "Instalaciones sanitarias",
  "Alcantarillado y drenaje",
  "Instalaciones de gas",
  "Instalaciones eléctricas",
  "Corrientes débiles y seguridad electrónica",
  "Climatización y ventilación",
  "Protección contra incendios",
  "Accesibilidad universal",
  "Equipamiento y mobiliario",
  "Obras exteriores y urbanización",
  "Paisajismo y riego",
  "Piscinas",
  "Servicios profesionales",
  "Mantención general",
  "Limpieza, pruebas y entrega",
];
const RUBRO_SET = new Set(RUBROS);

const TIPOS_INTERVENCION = [
  "Obra nueva",
  "Ampliación",
  "Remodelación",
  "Reposición",
  "Reparación",
  "Mantención preventiva",
  "Mantención correctiva",
  "Demolición",
  "Desmontaje",
  "Regularización",
  "Servicio profesional",
];
const TIPO_SET = new Set(TIPOS_INTERVENCION);

const ALCANCES = [
  "Solo suministro",
  "Solo instalación",
  "Solo mano de obra",
  "Suministro e instalación",
  "Fabricación e instalación",
  "Desmontaje y retiro",
  "Reparación parcial",
  "Servicio completo",
  "Subcontrato",
];
const ALCANCE_SET = new Set(ALCANCES);

// Categorias transitorias / catch-all identificadas en la lectura manual del
// catalogo (ver REPORTE_TAXONOMIA_ECP.md, seccion de categorias mixtas).
const TRANSITIONAL_CATS = new Set([
  "Varios",
  "Reparaciones Generales",
  "Servicios Generales",
  "Servicios",
  "Fachadas y Vidrios",
]);

// ---------------------------------------------------------------------------
// Utilidades de texto
// ---------------------------------------------------------------------------

function norm(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function testAny(text, patterns) {
  return patterns.some((p) => p.test(text));
}

// ---------------------------------------------------------------------------
// 1) Rubro base por categoria actual (usado salvo que una regla por-item lo
//    anule). No asume que la categoria actual sea correcta: es solo un punto
//    de partida que luego se contrasta con la descripcion y el APU.
// ---------------------------------------------------------------------------

const CAT_TO_RUBRO_BASE = {
  "Accesibilidad": "Accesibilidad universal",
  "Aislación": "Aislación y eficiencia energética",
  "Albañilería": "Albañilería",
  "Áreas Exteriores": "Obras exteriores y urbanización",
  "Carpintería": "Puertas, ventanas y carpinterías",
  "Climatización": "Climatización y ventilación",
  "Corrientes Débiles": "Corrientes débiles y seguridad electrónica",
  "Demolición": "Demoliciones y desmontajes",
  "Eficiencia Energética": "Aislación y eficiencia energética",
  "Eléctrica": "Instalaciones eléctricas",
  "Equipamiento": "Equipamiento y mobiliario",
  "Equipamiento Comercial": "Equipamiento y mobiliario",
  "Estructuras Metálicas": "Estructuras metálicas",
  "Fachadas y Vidrios": "Fachadas y cerramientos", // ver overrides: 1 item es realmente carpinteria
  "Gas": "Instalaciones de gas",
  "Hormigón Armado": "Hormigón y fundaciones",
  "Hormigón y Albañilería": "Hormigón y fundaciones",
  "Impermeabilización": "Impermeabilización",
  "Impermeable": "Impermeabilización",
  "Instalaciones Eléctricas": "Instalaciones eléctricas",
  "Instalaciones Sanitarias": "Instalaciones sanitarias",
  "Madera Mant.": "Techumbres y aguas lluvias", // ambos items son de techumbre; ver overrides
  "Madera NC": "Construcción liviana",
  "Mantención Eléctrica": "Instalaciones eléctricas",
  "Mantención Pintura": "Pinturas y recubrimientos",
  "Mantención Preventiva": "Mantención general",
  "Mantención Sanitaria": "Instalaciones sanitarias", // 1 item es alcantarillado; ver overrides
  "Mantención Techumbres": "Techumbres y aguas lluvias",
  "Metalcon Estructural": "Estructuras metálicas",
  "Metalcon Mant.": "Techumbres y aguas lluvias",
  "Metalcon NC": "Construcción liviana",
  "Metalcon Rem.": "Construcción liviana",
  "Mov. de Tierras": "Movimiento de tierras",
  "Obras Exteriores": "Obras exteriores y urbanización",
  "Obras Provisorias": "Obras preliminares",
  "Ojalaería": "Techumbres y aguas lluvias",
  "Pavimentos": "Obras exteriores y urbanización",
  "Pintura": "Pinturas y recubrimientos",
  "Piscinas": "Piscinas",
  "Pisos": "Pisos y revestimientos",
  "Protección Incendio": "Protección contra incendios",
  "Regularización": "Servicios profesionales",
  "Reparaciones Generales": "Mantención general", // catch-all, override per-item
  "Retiro de Escombros": "Demoliciones y desmontajes",
  "Sanitario": "Instalaciones sanitarias", // varios items son alcantarillado; ver overrides
  "Seguridad": "Corrientes débiles y seguridad electrónica",
  "Servicios": "Servicios profesionales", // catch-all, override per-item
  "Servicios Generales": "Servicios profesionales", // catch-all, override per-item
  "Tabiquería": "Construcción liviana",
  "Techumbres": "Techumbres y aguas lluvias",
  "Varios": "Mantención general", // catch-all, override per-item
};

// ---------------------------------------------------------------------------
// 2) Reglas por-item que corrigen el rubro base cuando la descripcion indica
//    algo distinto de lo que sugiere la categoria original (regla explicita
//    del encargo: "no asumir que la categoria actual define correctamente
//    el rubro"). Se evaluan en orden; la primera que matchea gana.
// ---------------------------------------------------------------------------

const RUBRO_OVERRIDES = [
  // Alcantarillado / drenaje separado de agua potable dentro de "Sanitario" y
  // "Mantención Sanitaria" e "Instalaciones Sanitarias".
  { test: /camara de inspeccion|colector pvc|red alcantarillado|trampa de grasa|destape de wc|camara de inspeccion domiciliaria/, rubro: "Alcantarillado y drenaje", subrubro: "Alcantarillado domiciliario", confianza: "media" },
  { test: /ampliacion de red de desague/, rubro: "Alcantarillado y drenaje", subrubro: "Alcantarillado domiciliario", confianza: "media" },
  { test: /red de desague pvc/, rubro: "Alcantarillado y drenaje", subrubro: "Alcantarillado domiciliario", confianza: "media" },

  // Fachadas y Vidrios: solo el muro cortina es realmente fachada; la
  // ventana termopanel es carpinteria de vanos.
  { test: /ventana pvc termopanel instalada/, rubro: "Puertas, ventanas y carpinterías", subrubro: "Ventanas", confianza: "media" },
  { test: /muro cortina/, rubro: "Fachadas y cerramientos", subrubro: "Muro cortina", confianza: "alta" },

  // Ojalaeria / canaletas -> aguas lluvias (subrubro especifico)
  { test: /canal pvc|ojalaeria|canal y bajante|destape de canaletas|limpieza y destape de canaletas/, rubro: "Techumbres y aguas lluvias", subrubro: "Canales y bajantes (aguas lluvias)", confianza: "alta" },

  // Servicios Generales / Servicios / Varios / Reparaciones Generales: catch-all,
  // reclasificar item a item.
  { test: /limpieza fina post obra/, rubro: "Limpieza, pruebas y entrega", subrubro: "Limpieza final de obra", confianza: "alta" },
  { test: /traslado y acarreo de mobiliario/, rubro: "Obras preliminares", subrubro: "Logística de obra", confianza: "media" },
  { test: /jornada adicional de especialista/, rubro: "Servicios profesionales", subrubro: "Mano de obra a trato", confianza: "media" },
  { test: /visita tecnica.*diagnostico|diagnostico$/, rubro: "Servicios profesionales", subrubro: "Visita técnica y diagnóstico", confianza: "alta" },
  { test: /transporte en camion tolva/, rubro: "Demoliciones y desmontajes", subrubro: "Transporte de escombros", confianza: "media" },
  { test: /reinstalacion citofono/, rubro: "Corrientes débiles y seguridad electrónica", subrubro: "Citofonía / videoportero", confianza: "media" },
  { test: /celosias y cambio de ventanas/, rubro: "Puertas, ventanas y carpinterías", subrubro: "Ventanas", confianza: "baja" },
  { test: /cambio de chapa.*cerradura/, rubro: "Puertas, ventanas y carpinterías", subrubro: "Cerrajería", confianza: "media" },
  { test: /reparacion parche yeso.*empaste muro/, rubro: "Cielos y terminaciones", subrubro: "Empastes y terminaciones de muro", confianza: "media" },

  // Sello verde / prueba de hermeticidad de gas: es una prueba y
  // certificacion, no una instalacion nueva en si misma.
  { test: /sello verde y prueba hermeticidad/, rubro: "Instalaciones de gas", subrubro: "Pruebas y certificación de gas", confianza: "baja" },
  { test: /gestion convenio gasco/, rubro: "Servicios profesionales", subrubro: "Gestión y trámites con proveedor de gas", confianza: "baja" },

  // Regularizacion (tramites) -> servicios profesionales, no construccion.
  { test: /carpeta seremi salud|carpeta registro patentes/, rubro: "Servicios profesionales", subrubro: "Regularización y trámites", confianza: "alta" },

  // Tabique cortafuego: construccion liviana con funcion de proteccion
  // contra incendios (ambiguo a proposito).
  { test: /tabique cortafuego/, rubro: "Construcción liviana", subrubro: "Tabiques cortafuego", confianza: "baja" },

  // Impermeabilizacion de techumbre especifica: se mantiene en Techumbres
  // (no en Impermeabilizacion general) por ser parte del sistema de
  // cubierta, pero queda marcada de confianza media por la superposicion.
  { test: /impermeabilizacion acrilica de techumbre/, rubro: "Techumbres y aguas lluvias", subrubro: "Recubrimientos de cubierta", confianza: "media" },

  // Cielos: son un sistema de terminacion interior propio, aunque su
  // estructura de soporte sea Metalcon o madera (la categoria original los
  // agrupaba junto a tabiques/techumbres del mismo sistema constructivo).
  { test: /^cielo /, rubro: "Cielos y terminaciones", subrubro: "Cielos", confianza: "alta" },

  // Jardin / riego: la categoria "Areas Exteriores" los agrupaba junto a
  // pavimentos y quinchos, pero corresponden al rubro de paisajismo.
  { test: /^jardin |sistema riego automatico/, rubro: "Paisajismo y riego", subrubro: "Áreas verdes y riego", confianza: "alta" },

  // Obras Provisorias: baño quimico / letrero / bodega de faena
  { test: /bano quimico|bodega de faena|letrero de obra|cierre provisorio|instalacion electrica provisoria|agua provisoria faena|cerco perimetral obras/, rubro: "Obras preliminares", subrubro: "Instalaciones de faena", confianza: "alta" },
];

// ---------------------------------------------------------------------------
// 3) Subrubro por defecto (cuando ningun override aplica): agrupaciones mas
//    finas dentro del rubro, derivadas de palabras clave de la descripcion.
// ---------------------------------------------------------------------------

const SUBRUBRO_RULES = [
  { test: /techumbre|cubierta|limatesa/, subrubro: "Cubiertas y techumbres" },
  { test: /cielo/, subrubro: "Cielos" },
  { test: /tabique/, subrubro: "Tabiquería" },
  { test: /muro perimetral|muro metalcon|cierre perimetral|cierre acmafor|malla acma/, subrubro: "Cierres y muros perimetrales" },
  { test: /ventana/, subrubro: "Ventanas" },
  { test: /puerta/, subrubro: "Puertas" },
  { test: /piso flotante|ceramico|porcelanato|vinilico|parquet/, subrubro: "Pisos" },
  { test: /pintura|repintado|lijado y pintura|lavado a presion/, subrubro: "Pinturas" },
  { test: /tablero/, subrubro: "Tableros y protecciones eléctricas" },
  { test: /cableado|circuito/, subrubro: "Cableado" },
  { test: /luminaria|punto de luz|iluminacion/, subrubro: "Iluminación" },
  { test: /toma corriente|enchufe|interruptor/, subrubro: "Tomas e interruptores" },
  { test: /wc|wáter|inodoro|lavamanos|ducha|tina|banera|grifer/, subrubro: "Artefactos y grifería" },
  { test: /agua fria|agua caliente|punto agua/, subrubro: "Agua potable" },
  { test: /calefont|red de gas|gas licuado|detector de gas/, subrubro: "Redes de gas" },
  { test: /split|extractor|ventilador/, subrubro: "Climatización" },
  { test: /camara cctv|dvr|alarma|control acceso|citofonia|videoportero|punto de red/, subrubro: "Seguridad electrónica" },
  { test: /extintor|red humeda|puerta cortafuego/, subrubro: "Protección contra incendios" },
  { test: /rampa|podotactil/, subrubro: "Accesibilidad" },
  { test: /excavacion|relleno|nivelacion|compactacion|entibacion/, subrubro: "Movimiento de tierras" },
  { test: /vereda|solera|estacionamiento|pavimento|adoquin|asfalt|carpeta asfaltica|berma|señaletica|tachon/, subrubro: "Pavimentos y vialidad" },
  { test: /jardin|riego/, subrubro: "Áreas verdes y riego" },
  { test: /piscina/, subrubro: "Piscinas" },
  { test: /radier|fundacion|zapata|pilar|viga|losa|moldaje|enfierradura|dado de fundacion/, subrubro: "Hormigón estructural" },
  { test: /muro albañileria|ladrillo|bloques|estuco|enlucido/, subrubro: "Albañilería" },
  { test: /reja|portón|baranda|escalera metalica|pasamanos|marco metalico/, subrubro: "Cerrajería metálica" },
  { test: /aislacion termica|poliestireno eps/, subrubro: "Aislación térmica" },
  { test: /solar fotovoltaico|termo solar/, subrubro: "Energía solar" },
  { test: /mueble|mesón|vitrina|letrero/, subrubro: "Mobiliario y equipamiento" },
  { test: /demolicion/, subrubro: "Demoliciones" },
  { test: /retiro|traslado interno|acarreo/, subrubro: "Retiro y transporte de escombros" },
  { test: /impermeabiliz|sellado fisuras|membrana/, subrubro: "Impermeabilización" },
];

// ---------------------------------------------------------------------------
// 4) Tipo de intervencion: prioridad de palabras clave sobre la descripcion,
//    con apoyo del campo apu.tipo como señal secundaria.
// ---------------------------------------------------------------------------

function classifyTipoIntervencion(descN, cat, apuTipo) {
  if (/preventiv/.test(descN) || cat === "Mantención Preventiva") return "Mantención preventiva";
  if (/demolicion/.test(descN)) return "Demolición";
  if (/retiro y transporte|traslado interno de escombros|retiro escombros|retiro poste/.test(descN)) return "Desmontaje";
  if (/reinstalacion/.test(descN)) return "Reposición";
  if (/cambio |reposicion|reemplaz/.test(descN)) return "Reposición";
  if (/ampliacion/.test(descN)) return "Ampliación";
  if (/remodelacion/.test(descN)) return "Remodelación";
  if (/^mantencion|^mantención/.test(norm(cat))) return "Mantención correctiva";
  if (/\breparacion\b|parche|repaso 1 mano|gotera|\bdestape\b/.test(descN)) return "Reparación";
  if (cat === "Regularización" || /regulariz|carpeta seremi|carpeta registro/.test(descN)) return "Regularización";
  if (/visita tecnica|diagnostico|informe|proyecto|diseno|calculo|asesoria|gestion convenio|jornada adicional de especialista/.test(descN)) return "Servicio profesional";
  if (apuTipo === "Remodelación" && /instalacion|inst\./.test(descN)) return "Obra nueva";
  return "Obra nueva";
}

// ---------------------------------------------------------------------------
// 5) Alcance
// ---------------------------------------------------------------------------

function classifyAlcance(descN, unidad, apu) {
  if (apu && apu.esSubcontrato) return "Subcontrato";
  if (/demolicion/.test(descN)) return "Desmontaje y retiro";
  if (/sin instalacion|suministro de equipo/.test(descN)) return "Solo suministro";
  if (/mano de obra, equipo de cliente|instalacion de split \(mano de obra/.test(descN)) return "Solo instalación";
  if (/fabricacion.*instalacion|fabricado e instalado|fab\.\s*\+\s*inst/.test(descN)) return "Fabricación e instalación";
  if (/retiro y transporte|retiro escombros|traslado interno|^retiro |desmontaje/.test(descN)) return "Desmontaje y retiro";
  if (/reparacion parcial|\bparche\b|repaso 1 mano/.test(descN)) return "Reparación parcial";
  if (unidad === "jornada" || /solo mo$|solo mano de obra/.test(descN)) return "Solo mano de obra";
  if (/instalacion .*completa|red alcantarillado vivienda completa|instalacion sanitaria completa|instalacion electrica completa/.test(descN)) return "Servicio completo";
  return "Suministro e instalación";
}

// ---------------------------------------------------------------------------
// 6) Sistema constructivo (a partir de apu.estructura + palabras clave)
// ---------------------------------------------------------------------------

function classifySistemaConstructivo(descN, apu) {
  const estructura = apu && apu.estructura;
  // Palabras clave de material/sistema en la descripcion tienen prioridad
  // sobre el campo generico apu.estructura (que en esta fuente usa
  // "Hormigón" como categoria estructural amplia incluso para muros de
  // albañilería reforzada con pilares/cadenas de hormigón).
  if (/albañileria|ladrillo|bloques/.test(descN)) return "Albañilería";
  if (/pvc/.test(descN)) return "PVC";
  if (/ppr/.test(descN)) return "PPR";
  if (/cobre/.test(descN)) return "Cobre";
  if (/acma|malla electrosoldada/.test(descN)) return "Acero (malla/ACMA)";
  if (/aluminio/.test(descN)) return "Aluminio";
  if (/vidrio|termopanel/.test(descN)) return "Vidrio";
  if (/ceramico|porcelanato/.test(descN)) return "Cerámico";
  if (/vinilico/.test(descN)) return "Vinílico";
  if (/melamina/.test(descN)) return "Melamina";
  if (/zinc/.test(descN)) return "Zinc";
  if (/policarbonato/.test(descN)) return "Policarbonato";
  if (/poliestireno eps/.test(descN)) return "Poliestireno expandido (EPS)";
  if (estructura === "Metalcon") return "Metalcon (acero galvanizado liviano)";
  if (estructura === "Madera") return "Madera";
  if (estructura === "Estructuras Metálicas") return "Acero estructural";
  if (estructura === "Hormigón" || /hormigon/.test(descN)) return /armad/.test(descN) ? "Hormigón armado" : "Hormigón";
  return "No aplica / mixto";
}

// ---------------------------------------------------------------------------
// 7) Especialidad propuesta (derivada del rubro)
// ---------------------------------------------------------------------------

const RUBRO_TO_ESPECIALIDAD = {
  "Obras preliminares": "Administración de obra",
  "Demoliciones y desmontajes": "Construcción general",
  "Movimiento de tierras": "Ingeniería civil — movimiento de tierras",
  "Hormigón y fundaciones": "Ingeniería estructural",
  "Albañilería": "Construcción general",
  "Estructuras metálicas": "Ingeniería estructural / metalmecánica",
  "Construcción liviana": "Construcción en seco (steel framing / madera)",
  "Techumbres y aguas lluvias": "Techumbres",
  "Impermeabilización": "Impermeabilización",
  "Aislación y eficiencia energética": "Eficiencia energética",
  "Fachadas y cerramientos": "Fachadas",
  "Puertas, ventanas y carpinterías": "Carpintería / cerrajería",
  "Pisos y revestimientos": "Terminaciones",
  "Cielos y terminaciones": "Terminaciones",
  "Pinturas y recubrimientos": "Pintura",
  "Instalaciones sanitarias": "Ingeniería sanitaria",
  "Alcantarillado y drenaje": "Ingeniería sanitaria",
  "Instalaciones de gas": "Gasfitería certificada",
  "Instalaciones eléctricas": "Ingeniería eléctrica",
  "Corrientes débiles y seguridad electrónica": "Electrónica / seguridad",
  "Climatización y ventilación": "Climatización (HVAC)",
  "Protección contra incendios": "Protección contra incendios",
  "Accesibilidad universal": "Arquitectura / accesibilidad",
  "Equipamiento y mobiliario": "Carpintería / mobiliario",
  "Obras exteriores y urbanización": "Urbanización",
  "Paisajismo y riego": "Paisajismo",
  "Piscinas": "Piscinas",
  "Servicios profesionales": "Servicios profesionales",
  "Mantención general": "Mantención",
  "Limpieza, pruebas y entrega": "Servicios generales de obra",
};

// ---------------------------------------------------------------------------
// Clasificacion principal
// ---------------------------------------------------------------------------

const rows = catalog.map((item) => {
  const descN = norm(item.desc);
  const apu = apuByCatalogId.get(item.id);

  let rubro = CAT_TO_RUBRO_BASE[item.cat];
  let subrubro = null;
  let overrideConfianza = null;
  let overrideApplied = false;

  if (!rubro) {
    rubro = "Servicios profesionales"; // fallback defensivo; no deberia ocurrir
    overrideConfianza = "baja";
  }

  for (const rule of RUBRO_OVERRIDES) {
    if (rule.test.test(descN)) {
      rubro = rule.rubro;
      subrubro = rule.subrubro;
      overrideConfianza = rule.confianza;
      overrideApplied = true;
      break;
    }
  }

  if (!RUBRO_SET.has(rubro)) {
    throw new Error(`Rubro fuera de vocabulario controlado: "${rubro}" (item ${item.id})`);
  }

  if (!subrubro) {
    const hit = SUBRUBRO_RULES.find((r) => r.test.test(descN));
    subrubro = hit ? hit.subrubro : item.cat;
  }

  const tipoIntervencion = classifyTipoIntervencion(descN, item.cat, apu && apu.tipo);
  if (!TIPO_SET.has(tipoIntervencion)) {
    throw new Error(`Tipo de intervencion fuera de vocabulario controlado: "${tipoIntervencion}" (item ${item.id})`);
  }

  const alcance = classifyAlcance(descN, item.unidad, apu);
  if (!ALCANCE_SET.has(alcance)) {
    throw new Error(`Alcance fuera de vocabulario controlado: "${alcance}" (item ${item.id})`);
  }

  const sistemaConstructivo = classifySistemaConstructivo(descN, apu);
  const especialidad = RUBRO_TO_ESPECIALIDAD[rubro] || "Construcción general";

  // Confianza global del registro: una regla por-item explicita fija su
  // propia confianza (ya evaluada al redactar la regla); si no hubo regla,
  // una categoria transitoria/catch-all parte en "baja"; el resto en "alta".
  // Faltar un APU vinculado baja un nivel la confianza (alta->media).
  const isTransitionalCat = TRANSITIONAL_CATS.has(item.cat);
  let confianza;
  if (overrideConfianza) confianza = overrideConfianza;
  else if (isTransitionalCat) confianza = "baja";
  else confianza = "alta";
  if (!apu && confianza === "alta") confianza = "media";

  const requiereRevisionHumana = confianza !== "alta";

  const observaciones = [];
  if (isTransitionalCat) observaciones.push(`Categoría actual "${item.cat}" es transitoria/catch-all; reclasificado a nivel de partida.`);
  if (overrideApplied) observaciones.push("Rubro corregido respecto de la categoría actual original (ver DICCIONARIO_TAXONOMICO_ECP.json > overridesAplicados).");
  if (!apu) observaciones.push("Partida sin APU vinculado directamente por catalogId; clasificación basada solo en descripción y categoría.");
  if (subrubro === item.cat && !overrideApplied) observaciones.push("Subrubro heredado de la categoría actual (sin coincidencia de palabra clave más específica).");

  return {
    id: item.id,
    categoriaActual: item.cat,
    descripcion: item.desc,
    unidad: item.unidad,
    rubroPropuesto: rubro,
    subrubroPropuesto: subrubro,
    tipoIntervencionPropuesto: tipoIntervencion,
    sistemaConstructivoPropuesto: sistemaConstructivo,
    alcancePropuesto: alcance,
    especialidadPropuesta: especialidad,
    confianza,
    requiereRevisionHumana,
    observacion: observaciones.join(" "),
  };
});

fs.writeFileSync(path.join(targetDir, "taxonomy_classified.json"), JSON.stringify(rows, null, 2));

console.log(JSON.stringify({
  total: rows.length,
  requiereRevisionHumana: rows.filter((r) => r.requiereRevisionHumana).length,
  confianzaBaja: rows.filter((r) => r.confianza === "baja").length,
  confianzaMedia: rows.filter((r) => r.confianza === "media").length,
  confianzaAlta: rows.filter((r) => r.confianza === "alta").length,
}, null, 2));
