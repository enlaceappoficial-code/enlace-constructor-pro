const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function applyRegex(re, replacement) {
  const next = s.replace(re, replacement);
  if (next !== s) {
    s = next;
    changed++;
    return true;
  }
  return false;
}

applyRegex(
  /children:Fe\[m\.key\]\.suscripcion\?\"[^\"]*\":\"[^\"]*\"/,
  'children:Fe[m.key].suscripcion?"Mensual · cancela cuando quieras":Fe[m.key].anual?"Plan anual":"Pago único"'
);

applyRegex(
  /children:Fe\[m\.key\]\.suscripcion\?\"[^\"]*\":\"Quiero este plan [^\"]*\"/,
  'children:m.key==="starter"?"Obtener →":Fe[m.key].suscripcion?"Suscribirme →":"Solicitar →"'
);

applyRegex(
  /basico:\{label:\"[^\"]*\",color:\"#34d399\",precio:59990,/,
  'basico:{label:"Básico",color:"#34d399",precio:59990,anual:!0,'
);
applyRegex(
  /constructor:\{label:\"[^\"]*\",color:\"#38bdf8\",precio:89990,/,
  'constructor:{label:"Constructor",color:"#38bdf8",precio:89990,anual:!0,'
);
applyRegex(
  /pro:\{label:\"Pro\",color:\"#a78bfa\",precio:129990,/,
  'pro:{label:"Pro",color:"#a78bfa",precio:129990,anual:!0,'
);
applyRegex(
  /plus:\{label:\"Plus\",color:\"#f5a020\",precio:179990,/,
  'plus:{label:"Plus",color:"#f5a020",precio:179990,anual:!0,'
);

applyRegex(
  /starter:\{label:\"Starter\",color:\"#10b981\",precio:19990,modules:\[[^\]]*\],desc:\"[^\"]*\"/,
  'starter:{label:"Starter",color:"#10b981",precio:19990,modules:["dashboard","new","history","clients","config"],desc:"Pago único · Plan base para comenzar"'
);
applyRegex(
  /basico:\{label:\"Básico\",color:\"#34d399\",precio:59990,anual:!0,modules:\[[^\]]*\],desc:\"[^\"]*\"\}/,
  'basico:{label:"Básico",color:"#34d399",precio:59990,anual:!0,modules:["dashboard","new","history","clients","config","documentos"],desc:"Plan anual · Presupuestos + Clientes + PDF + Contratos"}'
);
applyRegex(
  /constructor:\{label:\"Constructor\",color:\"#38bdf8\",precio:89990,anual:!0,modules:\[[^\]]*\],desc:\"[^\"]*\"\}/,
  'constructor:{label:"Constructor",color:"#38bdf8",precio:89990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu"],desc:"Plan anual · Básico + APU + Catálogo + Materiales"}'
);
applyRegex(
  /pro:\{label:\"Pro\",color:\"#a78bfa\",precio:129990,anual:!0,modules:\[[^\]]*\],desc:\"[^\"]*\"\}/,
  'pro:{label:"Pro",color:"#a78bfa",precio:129990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario"],desc:"Plan anual · Constructor + Cubicación + Gantt + Documentos + Calendario"}'
);
applyRegex(
  /plus:\{label:\"Plus\",color:\"#f5a020\",precio:179990,anual:!0,modules:\[[^\]]*\],desc:\"[^\"]*\"\}/,
  'plus:{label:"Plus",color:"#f5a020",precio:179990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Plan anual · Pro + Licitaciones Mercado Público"}'
);
applyRegex(
  /procloud:\{label:\"Pro Cloud\",color:\"#3b82f6\",precio:24990,modules:\[[^\]]*\],desc:\"[^\"]*\",suscripcion:!0\}/,
  'procloud:{label:"Pro Cloud",color:"#3b82f6",precio:24990,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Mensual · Todo Plus + soporte y actualizaciones",suscripcion:!0}'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: planes actualizados (v3) (${changed} cambios).`);
