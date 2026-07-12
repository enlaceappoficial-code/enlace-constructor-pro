const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

// 1) Inserta generador HTML simple para Informe de Entrega (vista previa)
const vgNeedle = "})}function Vg({budgets:t,clients:";
if (!s.includes(vgNeedle)) {
  throw new Error("No se encontró el ancla de Vg() para insertar generador de Informe.");
}

if (!s.includes("function Jf0(t,i,r){")) {
  const informeFn =
    'function Jf0(t,i,r){r=r||{};i=i||{};t=t||{};var n=r&&r.empresa||"Empresa",l=r&&((r.logoCliente||r.logo)||""),o=l?\'<img src="\'+l+\'" style="height:70px;object-fit:contain;margin-bottom:6px;display:block"/>\' :"";var s=i&&i.nombre||"Cliente",m=t&&t.descripcion||"",p=t&&t.id||"";var C=new Date().toLocaleDateString("es-CL");var b=(t.items||[]).filter(function(f){return f&&f.desc}).map(function(f,I){return\'<tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:12px;width:34px;text-align:center">\'+(I+1)+\'</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">\'+(f.desc||"")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:center;white-space:nowrap">\'+(f.cant||"")+" "+(f.unidad||"")+\'</td></tr>\'}).join("");var h=\'<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Informe de Entrega de Obra</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#0f172a;padding:40px;max-width:900px;margin:0 auto}h1{font-size:22px;margin:0;color:#1e3a5f}h2{font-size:12px;margin:18px 0 10px;color:#1e3a5f;text-transform:uppercase;letter-spacing:.08em}table{width:100%;border-collapse:collapse}th{background:#1e3a5f;color:#fff;padding:9px 10px;font-size:11px;text-align:left;text-transform:uppercase} .box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px} .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px} .muted{color:#64748b} .pill{display:inline-block;padding:2px 10px;border-radius:999px;background:#dcfce7;color:#14532d;font-weight:700;font-size:11px} @media print{.np{display:none}}</style></head><body><button class="np" onclick="window.print()" style="margin-bottom:18px;padding:8px 20px;background:#1e3a5f;color:#fff;border:none;cursor:pointer;border-radius:6px">🖨 Imprimir / Guardar PDF</button><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:3px solid #14b8a6"><div>\'+o+\'<div style="font-size:18px;font-weight:800;color:#1e3a5f">\'+n+\'</div><div class="muted" style="font-size:12px;margin-top:3px">\'+C+\'</div></div><div style="text-align:right"><div class="pill">ENTREGA FINAL</div><div style="font-size:18px;font-weight:800;color:#1e3a5f;margin-top:6px">Informe de Entrega</div><div class="muted" style="font-size:12px;margin-top:2px">Presupuesto N° \'+p+\'</div></div></div><div class="box" style="margin-bottom:14px"><div class="grid"><div><div class="muted" style="font-size:11px;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">Cliente / Mandante</div><div style="font-size:13px;font-weight:700">\'+s+\'</div><div class="muted" style="font-size:12px;margin-top:2px">\'+m+\'</div></div><div><div class="muted" style="font-size:11px;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">Datos (a completar)</div><div class="muted" style="font-size:12px;line-height:1.7">Responsable: ________<br/>Cargo: ________<br/>Ubicación: ________<br/>Clima: ________<br/>Avance: ____%</div></div></div></div><h2>Partidas del Presupuesto</h2><table><thead><tr><th style="width:34px">#</th><th>Descripción</th><th style="width:140px;text-align:center">Cantidad</th></tr></thead><tbody>\'+(b||\'<tr><td colspan="3" style="padding:12px;color:#64748b">Sin partidas</td></tr>\')+\'</tbody></table><h2>Checklist de Entrega</h2><div class="box"><div class="muted" style="font-size:12px;line-height:1.7">Este es un resumen de vista previa. Para completar el informe con checklist y fotos, usa el módulo <strong>Informe de Entrega de Obra</strong> en el menú lateral.</div></div><div class="muted" style="margin-top:16px;font-size:10px;text-align:center;border-top:1px solid #e5e7eb;padding-top:10px">Generado por Enlace Constructor Pro — \'+n+\' · \'+C+\'</div></body></html>\';return h}';

  s = s.replace(vgNeedle, "})}" + informeFn + "function Vg({budgets:t,clients:");
}

// 2) En Documentos de Obra, evita navegar a la página "informe" y muestra vista previa abajo
const from =
  'w=f=>{if(f.id==="informe"){l("informe");return}if(p===f.id){C(null),h("");return}if(C(f.id),!z(f.id)){h("locked");return}f.id==="carta"?h(Af(j,F,r)):f.id==="resumen"?h(Rf(j,F,r)):f.id==="negociacion"?h(Df(j,F,r,"return")):f.id==="contrato"?h(ts(j,F,r)):f.id==="desglose"?h(Pp(j,F,r)):f.id==="dotacion"?h(Tp(j,F,r)):f.id==="contrato"&&h(ts(j,F,r))}';
const to =
  'w=f=>{if(p===f.id){C(null),h("");return}if(C(f.id),!z(f.id)){h("locked");return}f.id==="carta"?h(Af(j,F,r)):f.id==="resumen"?h(Rf(j,F,r)):f.id==="negociacion"?h(Df(j,F,r,"return")):f.id==="contrato"?h(ts(j,F,r)):f.id==="informe"?h(Jf0(j,F,r)):f.id==="desglose"?h(Pp(j,F,r)):f.id==="dotacion"?h(Tp(j,F,r)):f.id==="contrato"&&h(ts(j,F,r))}';

if (!s.includes(from)) {
  throw new Error("No se encontró el handler w() esperado (Documentos de Obra) para Informe.");
}
s = s.replace(from, to);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_documentos_obra_informe_preview_v1");

