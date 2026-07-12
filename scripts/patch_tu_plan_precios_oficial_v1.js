const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

function replacePlansArray() {
  const startNeedle = 's=[{key:"starter"';
  const start = s.indexOf(startNeedle);
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
  const oldArr = s.slice(start + 2, i + 1);
  const newArr =
    '[{key:"starter",color:"#10b981",emoji:"🟢",precio:19990,tagline:"Pago único + IVA · para siempre",para:"Plan base de Enlace Constructor Pro. Gratis con código de la Red Enlace.",si:["Dashboard de obras","Presupuestos ilimitados","PDF profesional con logo y firma","Clientes + Documentos de obra","Contratos y WhatsApp integrado"],no:["APU y Análisis de Precios Unitarios","Catálogo de partidas y Base de materiales","Cubicación y Carta Gantt","Licitaciones Mercado Público"],nota:"¿Eres de la Red Enlace? Solicita tu código de regalo"},{key:"basico",color:"#fb923c",emoji:"🟠",precio:59990,tagline:"Plan anual + IVA",para:"Presupuestos + Clientes + PDF + Contratos de obra.",si:["Presupuestos ilimitados","PDF profesional con logo y firma","Gestión de clientes"],no:["APU y Análisis de Precios Unitarios","Catálogo de partidas y Base de materiales","Cubicación y Carta Gantt","Licitaciones Mercado Público"]},{key:"constructor",color:"#60a5fa",emoji:"🔵",precio:89990,tagline:"Plan anual + IVA",para:"Todo el plan Básico + APU + Catálogo + Base de Materiales.",si:["Todo del plan Básico","Catálogo de partidas","Base de materiales propia","Análisis de Precios Unitarios"],no:["Cubicación y Carta Gantt","Licitaciones Mercado Público"]},{key:"pro",color:"#f97316",emoji:"🟧",precio:129990,tagline:"Plan anual + IVA",para:"Todo del Constructor + Cubicación + Gantt + Documentos de Obra + Calendario.",si:["Todo del plan Constructor","Cubication inteligente","Carta Gantt integrada","Informe de Obra con fotos","Calendario + Estados de Pago"],no:["Licitaciones Mercado Público"]},{key:"plus",color:"#f5a020",emoji:"⭐",precio:179990,tagline:"Plan anual + IVA",para:"Todo incluido + Licitaciones Mercado Público completo.",si:["Todo del plan Pro","Licitaciones Mercado Público","Análisis de conveniencia con APU","Exportación Excel MP listo","Soporte prioritario"],no:[]},{key:"procloud",color:"#3b82f6",emoji:"☁️",precio:24990,tagline:"$24.990 / mes · cancela cuando quieras",para:"Para empresas que quieren soporte y actualizaciones continuas.",si:["Todo del plan Pro","Actualización mensual de precios de materiales","Soporte prioritario por WhatsApp","Nuevos módulos al lanzar","Capacitación inicial incluida"],no:[],nota:"Suscripción mensual · Sin permanencia mínima"}]';
  s = s.slice(0, start + 2) + newArr + s.slice(i + 1);
  changed++;
  return true;
}

replacePlansArray();

replaceOnce(
  "Todos los planes ÔÇö pago ├║nico, sin suscripci├│n",
  "Planes: Starter (pago único) · Básico/Constructor/Pro/Plus (anual) · Pro Cloud (mensual)"
);

replaceOnce(
  'children:Fe[m.key].suscripcion?"Mensual ┬À cancela cuando quieras":"Pago ├║nico"',
  'children:Fe[m.key].suscripcion?"Mensual · cancela cuando quieras":Fe[m.key].anual?"Plan anual":"Pago único"'
);

replaceOnce(
  'children:Fe[m.key].suscripcion?"Ôÿü´©Å Suscribirme ÔåÆ":"Quiero este plan ÔåÆ"',
  'children:m.key==="starter"?"Obtener →":Fe[m.key].suscripcion?"Suscribirme →":"Solicitar →"'
);

replaceOnce('label:"B├ísico"', 'label:"Básico"');

replaceOnce(
  'starter:{label:"Starter",color:"#10b981",precio:19990,modules:["dashboard","new","history","clients","config"],desc:"Hasta 30 presupuestos ┬À PDF b├ísico ┬À Sin contratos ni documentos",limite:{presupuestos:30,historialDias:30}}',
  'starter:{label:"Starter",color:"#10b981",precio:19990,modules:["dashboard","new","history","clients","config"],desc:"Pago único · Plan base para comenzar",limite:{presupuestos:30,historialDias:30}}'
);

replaceOnce(
  'basico:{label:"Básico",color:"#34d399",precio:59990,modules:["dashboard","new","history","clients","config","documentos"],desc:"Presupuestos + Clientes + PDF + Contratos"}',
  'basico:{label:"Básico",color:"#34d399",precio:59990,anual:!0,modules:["dashboard","new","history","clients","config","documentos"],desc:"Plan anual · Presupuestos + Clientes + PDF + Contratos"}'
);

replaceOnce(
  'constructor:{label:"Constructor",color:"#38bdf8",precio:89990,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu"],desc:"+ APU + Cat├ílogo + Base de Materiales"}',
  'constructor:{label:"Constructor",color:"#38bdf8",precio:89990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu"],desc:"Plan anual · Básico + APU + Catálogo + Materiales"}'
);

replaceOnce(
  'pro:{label:"Pro",color:"#a78bfa",precio:129990,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario"],desc:"+ Cubicaci├│n + Gantt + Documentos de Obra + Calendario"}',
  'pro:{label:"Pro",color:"#a78bfa",precio:129990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario"],desc:"Plan anual · Constructor + Cubicación + Gantt + Documentos + Calendario"}'
);

replaceOnce(
  'plus:{label:"Plus",color:"#f5a020",precio:179990,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Todo incluido + Licitaciones Mercado P├║blico"}',
  'plus:{label:"Plus",color:"#f5a020",precio:179990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Plan anual · Pro + Licitaciones Mercado Público"}'
);

replaceOnce(
  'procloud:{label:"Pro Cloud",color:"#3b82f6",precio:24990,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Todo Plus + Soporte + Actualizaciones mensuales ┬À Suscripci├│n",suscripcion:!0}',
  'procloud:{label:"Pro Cloud",color:"#3b82f6",precio:24990,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Mensual · Todo Plus + soporte y actualizaciones",suscripcion:!0}'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: planes actualizados (texto) (${changed} cambios).`);
