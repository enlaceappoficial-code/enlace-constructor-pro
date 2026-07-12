const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceAll(find, replace) {
  const next = s.split(find).join(replace);
  if (next !== s) {
    s = next;
    changed++;
    return true;
  }
  return false;
}

function replaceRegex(re, replacement) {
  const next = s.replace(re, replacement);
  if (next !== s) {
    s = next;
    changed++;
    return true;
  }
  return false;
}

function replaceHgPlansArray() {
  const hgIdx = s.indexOf("function Hg(");
  if (hgIdx === -1) return false;

  const startNeedle = 's=[{key:"starter"';
  const start = s.indexOf(startNeedle, hgIdx);
  if (start === -1) return false;

  let i = start + 2;
  let depth = 0;
  let inStr = false;
  let strCh = "";
  let esc = false;

  for (; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === strCh) {
        inStr = false;
        strCh = "";
      }
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      strCh = c;
      continue;
    }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) break;
    }
  }
  if (i >= s.length) return false;

  const newArr =
    '[{key:"starter",color:"#10b981",emoji:"🟢",precio:19990,tagline:"Pago único + IVA · para siempre",para:"Plan base de Enlace Constructor Pro. Gratis con código de la Red Enlace.",si:["Dashboard de obras","Presupuestos ilimitados","PDF profesional con logo y firma","Clientes + Documentos de obra","Contratos y WhatsApp integrado"],no:["APU y Análisis de Precios Unitarios","Catálogo de partidas y Base de materiales","Cubicación y Carta Gantt","Licitaciones Mercado Público"],nota:"¿Eres de la Red Enlace? Solicita tu código de regalo o paga $19.990 + IVA"},{key:"basico",color:"#fb923c",emoji:"🟠",precio:59990,tagline:"Plan anual + IVA",para:"Presupuestos + Clientes + PDF + Contratos de obra.",si:["Presupuestos ilimitados","PDF profesional con logo y firma","Gestión de clientes"],no:["APU y Análisis de Precios Unitarios","Catálogo de partidas y Base de materiales","Cubicación y Carta Gantt","Licitaciones Mercado Público"]},{key:"constructor",color:"#60a5fa",emoji:"🔵",precio:89990,tagline:"Plan anual + IVA",para:"Todo el plan Básico + APU + Catálogo + Base de Materiales.",si:["Todo del plan Básico","Catálogo de partidas","Base de materiales propia","Análisis de Precios Unitarios"],no:["Cubicación y Carta Gantt","Licitaciones Mercado Público"]},{key:"pro",color:"#f97316",emoji:"🟧",precio:129990,tagline:"Plan anual + IVA",para:"Todo del Constructor + Cubicación + Gantt + Documentos de Obra + Calendario.",si:["Todo del plan Constructor","Cubicación inteligente","Carta Gantt integrada","Documentos de obra","Calendario + Estados de Pago"],no:["Licitaciones Mercado Público"]},{key:"plus",color:"#f5a020",emoji:"⭐",precio:179990,tagline:"Plan anual + IVA",para:"Todo incluido + Licitaciones Mercado Público completo.",si:["Todo del plan Pro","Licitaciones Mercado Público","Análisis de conveniencia con APU","Exportación Excel MP listo","Soporte prioritario"],no:[]},{key:"procloud",color:"#3b82f6",emoji:"☁️",precio:24990,tagline:"$24.990 / mes · cancela cuando quieras",para:"Para empresas que quieren soporte y actualizaciones continuas.",si:["Todo del plan Pro","Actualización mensual de precios de materiales","Soporte prioritario por WhatsApp","Nuevos módulos al lanzar","Capacitación inicial incluida"],no:[],nota:"Suscripción mensual · Sin permanencia mínima"}]';

  s = s.slice(0, start + 2) + newArr + s.slice(i + 1);
  changed++;
  return true;
}

replaceHgPlansArray();

replaceRegex(/,anual:!0,anual:!0,/g, ",anual:!0,");

replaceAll("B├ísico", "Básico");
replaceAll("Cubicaci├│n", "Cubicación");
replaceAll("Cat├ílogo", "Catálogo");
replaceAll("Mercado P├║blico", "Mercado Público");
replaceAll("Suscripci├│n", "Suscripción");
replaceAll("Actualizaci├│n", "Actualización");
replaceAll("pago ├║nico", "pago único");
replaceAll("Pago ├║nico", "Pago único");
replaceAll("sin suscripci├│n", "sin suscripción");
replaceAll("┬À", "·");
replaceAll("┬┐Cu├íl es el plan ideal para ti?", "¿Cuál es el plan ideal para ti?");

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: textos/planes pulidos (${changed} cambios).`);

