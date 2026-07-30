const fs = require('fs');
const vm = require('vm');

function extractArray(constName) {
  const source = fs.readFileSync('src/assets/index.js', 'utf8');
  const compiledNames = { DCAT: "qi", DMAT: "Qi", DAPU: "Ai" };
  const variableName = compiledNames[constName] || constName;
  const marker = `${variableName} = [`;
  const markerAt = source.indexOf(marker);
  const start = source.indexOf("[", markerAt);

  let quote = "", escaped = false, lineComment = false, blockComment = false, depth = 0, end = -1;

  for (let i = start; i < source.length; i++) {
    const ch = source[i], next = source[i + 1];
    if (lineComment) { if (ch === "\n") lineComment = false; continue; }
    if (blockComment) { if (ch === "*" && next === "/") { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && next === "/") { lineComment = true; i++; continue; }
    if (ch === "/" && next === "*") { blockComment = true; i++; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "[") depth++;
    if (ch === "]") { depth--; if (depth === 0) { end = i + 1; break; } }
  }

  const context = {};
  vm.createContext(context);
  vm.runInContext(`value=${source.slice(start, end)}`, context);
  return JSON.parse(JSON.stringify(context.value));
}

const items = extractArray("DCAT");

// 1. Audit Subrubros (the 74 items)
const eqItems = items.filter(it => it.rubro && it.subrubro && it.rubro === it.subrubro);

function inferSubrubro(desc, rubro) {
  const d = desc.toLowerCase();
  if (rubro === 'Accesibilidad universal') {
    if (d.includes('rampa')) return 'Rampas accesibles';
    if (d.includes('podotáctil')) return 'Pavimentos podotáctiles';
    if (d.includes('pasamanos') || d.includes('baranda')) return 'Pasamanos y barandas';
    if (d.includes('baño') || d.includes('sanitario')) return 'Baños accesibles';
    if (d.includes('señal')) return 'Señalización accesible';
  }
  if (rubro === 'Albañilería') {
    if (d.includes('muro') || d.includes('ladrillo') || d.includes('bloque')) return 'Muros de albañilería';
    if (d.includes('estuco')) return 'Estucos y revoques';
  }
  if (rubro === 'Techumbres y aguas lluvias') {
    if (d.includes('zinc') || d.includes('teja') || d.includes('cubierta')) return 'Cubiertas';
    if (d.includes('cercha') || d.includes('estructura')) return 'Estructuras de techumbre';
    if (d.includes('canaleta') || d.includes('bajante')) return 'Hojalatería y aguas lluvias';
  }
  if (rubro === 'Impermeabilización') {
    if (d.includes('muro')) return 'Impermeabilización de muros';
    if (d.includes('cubierta') || d.includes('techo')) return 'Impermeabilización de cubiertas';
    if (d.includes('piscina') || d.includes('estanque')) return 'Impermeabilización de piscinas y estanques';
  }
  if (rubro === 'Puertas, ventanas y carpinterías') {
    if (d.includes('puerta')) return 'Puertas';
    if (d.includes('ventana')) return 'Ventanas';
    if (d.includes('cornisa') || d.includes('guardapolvo') || d.includes('pilastra')) return 'Molduras y terminaciones';
    if (d.includes('quincallería') || d.includes('cerradura')) return 'Quincallería';
  }
  if (rubro === 'Instalaciones eléctricas') {
    if (d.includes('luz') || d.includes('foco') || d.includes('iluminación')) return 'Iluminación';
    if (d.includes('toma') || d.includes('enchufe') || d.includes('punto')) return 'Puntos de conexión';
    if (d.includes('tablero') || d.includes('protección')) return 'Tableros y protecciones';
    if (d.includes('cable') || d.includes('canalización') || d.includes('completa')) return 'Redes y canalizaciones';
  }
  if (rubro === 'Instalaciones sanitarias') {
    if (d.includes('artefacto') || d.includes('ducha') || d.includes('lavamanos') || d.includes('wc')) return 'Artefactos sanitarios';
    if (d.includes('grifería') || d.includes('llave')) return 'Grifería';
    if (d.includes('completa') || d.includes('red') || d.includes('cañería')) return 'Redes de agua potable';
    if (d.includes('estanque')) return 'Sistemas de almacenamiento';
  }
  if (rubro === 'Instalaciones de gas') {
    if (d.includes('cilindro') || d.includes('balón') || d.includes('red')) return 'Redes y suministro';
    if (d.includes('calefón') || d.includes('caldera')) return 'Equipos a gas';
  }
  if (rubro === 'Estructuras metálicas') {
    if (d.includes('portón') || d.includes('reja') || d.includes('cerco')) return 'Cierres y accesos';
    if (d.includes('cobertizo') || d.includes('pérgola')) return 'Estructuras exteriores';
    if (d.includes('correa') || d.includes('omega') || d.includes('perfil') || d.includes('poste') || d.includes('angular')) return 'Perfiles y arriostramientos';
  }
  if (rubro === 'Movimiento de tierras') {
    if (d.includes('excavación')) return 'Excavaciones';
    if (d.includes('relleno') || d.includes('compactación') || d.includes('nivelación')) return 'Rellenos y nivelación';
    if (d.includes('escombro')) return 'Retiro de escombros';
  }
  if (rubro === 'Obras exteriores y urbanización') {
    if (d.includes('muro')) return 'Muros de contención';
    if (d.includes('cerco') || d.includes('cierre')) return 'Cierres perimetrales';
    if (d.includes('sello') || d.includes('base') || d.includes('asfalto') || d.includes('pavimento')) return 'Pavimentos y calzadas';
    if (d.includes('quincho') || d.includes('pérgola') || d.includes('deck') || d.includes('terraza')) return 'Estructuras de paisajismo';
    if (d.includes('gravilla') || d.includes('hormigón decorativo') || d.includes('limpieza')) return 'Terminaciones exteriores';
  }
  if (rubro === 'Piscinas') {
    if (d.includes('hormigón') || d.includes('estructura')) return 'Estructura de piscina';
    if (d.includes('impermeabilización') || d.includes('membrana') || d.includes('pintura')) return 'Revestimientos';
    if (d.includes('filtro') || d.includes('bomba') || d.includes('canaleta') || d.includes('skimmer')) return 'Equipos y recirculación';
    if (d.includes('escalera') || d.includes('pasamano')) return 'Accesorios';
  }
  if (rubro === 'Hormigón y fundaciones') {
    if (d.includes('revalse') || d.includes('muro') || d.includes('pilar')) return 'Hormigón estructural';
  }
  if (rubro === 'Protección contra incendios') {
    if (d.includes('red') || d.includes('gabinete')) return 'Sistemas de agua (Redes)';
    if (d.includes('extintor')) return 'Extintores portátiles';
  }
  if (rubro === 'Equipamiento y mobiliario') {
    if (d.includes('mesón') || d.includes('mueble')) return 'Mobiliario a medida';
  }
  if (rubro === 'Mantención general') {
    if (d.includes('sellado') || d.includes('fisura')) return 'Mantención de fachadas';
  }
  return "Otros componentes";
}

let csvSub = "catalogId,descripcion,rubroActual,subrubroActual,subrubroPropuesto,justificacion,confianza\n";
eqItems.forEach(it => {
  const prop = inferSubrubro(it.desc, it.rubro);
  const conf = prop === "Otros componentes" ? "Baja" : "Alta";
  const just = "Clasificación funcional según descripción";
  csvSub += `${it.id},"${it.desc}","${it.rubro}","${it.subrubro}","${prop}","${just}","${conf}"\n`;
});
fs.writeFileSync('docs/taxonomia/PROPUESTA_REFINAMIENTO_SUBRUBROS.csv', csvSub);


// 2. Audit Tipos
let typeCounts = {};
items.forEach(it => {
  const t = it.tipoIntervencion || "Sin clasificar";
  typeCounts[t] = (typeCounts[t] || 0) + 1;
});

const total = items.length;
console.log("Distribución de tipos de intervención:");
Object.keys(typeCounts).sort((a,b) => typeCounts[b] - typeCounts[a]).forEach(k => {
  console.log(`${k} | ${typeCounts[k]} | ${(typeCounts[k]/total*100).toFixed(1)}%`);
});

function inferTipo(desc, currentTipo) {
  const d = desc.toLowerCase();
  let prop = currentTipo;
  let conf = "Baja";
  let just = "No aplica";

  if (d.includes('reparación') || d.includes('reparar') || d.includes('sello') || d.includes('sellado') && d.includes('fisura')) {
    prop = "Reparación";
  } else if (d.includes('cambio ') || d.includes('reemplazo') || d.includes('reposición')) {
    prop = "Reposición";
  } else if (d.includes('mantención') || d.includes('limpieza') || d.includes('destape')) {
    if (d.includes('preventivo') || d.includes('preventiva')) prop = "Mantención preventiva";
    else prop = "Mantención correctiva";
  } else if (d.includes('demolición') || d.includes('retiro') || d.includes('desmontaje')) {
    if (d.includes('demolición')) prop = "Demolición";
    else prop = "Desmontaje";
  } else if (d.includes('diagnóstico') || d.includes('visita')) {
    prop = "Servicio profesional";
  } else if (d.includes('instalación') && currentTipo !== "Obra nueva") {
    // Instalación usually correlates to Obra nueva unless it's a specific retrofit
  }
  
  if (prop !== currentTipo) {
    if (prop === "Reparación" && currentTipo === "Mantención correctiva") {
      // both valid, stick to current if it's already mantencion
      return null;
    }
    return { prop, just: "Término explícito en la descripción", conf: "Alta" };
  }
  
  return null;
}

let csvTipos = "catalogId,descripcion,tipoActual,tipoPropuesto,justificacion,confianza\n";
let tipoCorrections = 0;
items.forEach(it => {
  const diff = inferTipo(it.desc, it.tipoIntervencion);
  if (diff) {
    tipoCorrections++;
    csvTipos += `${it.id},"${it.desc}","${it.tipoIntervencion}","${diff.prop}","${diff.just}","${diff.conf}"\n`;
  }
});
fs.writeFileSync('docs/taxonomia/PROPUESTA_REFINAMIENTO_TIPOS.csv', csvTipos);

console.log("\\nSubrubros sugeridos:", eqItems.length);
console.log("Tipos sugeridos:", tipoCorrections);
