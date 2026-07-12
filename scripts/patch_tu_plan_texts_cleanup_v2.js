const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const start = s.indexOf("var Fe={");
const end = s.indexOf(";function Gt", start);

if (start === -1 || end === -1) {
  console.log("OK: no se encontró el bloque Fe/Gt.");
  process.exit(0);
}

const newBlock =
  'var Fe={starter:{label:"Starter",color:"#10b981",precio:19990,modules:["dashboard","new","history","clients","config"],desc:"Pago único · Plan base para comenzar",limite:{presupuestos:30,historialDias:30}},basico:{label:"Básico",color:"#34d399",precio:59990,anual:!0,modules:["dashboard","new","history","clients","config","documentos"],desc:"Plan anual · Presupuestos + Clientes + PDF + Contratos"},constructor:{label:"Constructor",color:"#38bdf8",precio:89990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu"],desc:"Plan anual · Básico + APU + Catálogo + Materiales"},pro:{label:"Pro",color:"#a78bfa",precio:129990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario"],desc:"Plan anual · Constructor + Cubicación + Gantt + Documentos + Calendario"},plus:{label:"Plus",color:"#f5a020",precio:179990,anual:!0,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Plan anual · Pro + Licitaciones Mercado Público"},procloud:{label:"Pro Cloud",color:"#3b82f6",precio:24990,modules:["dashboard","new","history","clients","config","documentos","catalog","materiales","apu","lista","cubicacion","gantt","informe","calendario","licitaciones","indices"],desc:"Mensual · Todo Plus + soporte y actualizaciones",suscripcion:!0}},wr=["starter","basico","constructor","pro","plus","procloud"],Bg={catalog:"constructor",materiales:"constructor",apu:"constructor",lista:"pro",cubicacion:"pro",gantt:"pro",informe:"pro",calendario:"pro",documentos:"basico",licitaciones:"plus"},Up={carta:"constructor",resumen:"constructor",negociacion:"constructor",contrato:"basico",informe:"pro",desglose:"basico",dotacion:"basico"}';

const before = s.slice(0, start);
const after = s.slice(end);
const next = before + newBlock + after;

if (next === s) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, next, "utf8");
console.log("OK: bloque planes Fe pulido (v2).");

