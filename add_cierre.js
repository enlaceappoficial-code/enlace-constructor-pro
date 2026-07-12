const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Inject the Hf function right before Af
const HfFunc = `
function Hf(t,i,r){
  const{total:n}=Ee(t.items,r,t.descuento,t.modoCosteo,t.sinIva);
  var o=r&&r.accentColor||"#f5a020",s=r&&r.empresa||"Empresa",m=r&&r.logoCliente||"",p=r&&r.firmaImg||"",C=r&&r.firmaNombre||s,b=r&&r.firmaCargo||"Representante Legal",j=new Date().toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"}),F=m?'<img src="'+m+'" style="height:70px;object-fit:contain;margin-bottom:8px;display:block"/>':"",g=p?'<img src="'+p+'" style="height:100px;object-fit:contain;display:block;margin:0 auto 8px"/>':'<div style="height:100px"></div>';
  var z='<!DOCTYPE html><html><head><title>Acta de Recepción Conforme</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;color:#111;padding:30px 50px;max-width:800px;margin:0 auto;font-size:14px;line-height:1.6}.firma-bloque{page-break-inside:avoid;page-break-before:avoid}@media print{.np{display:none}body{padding:15px 35px}}</style></head><body><button class="np" onclick="window.print()" style="margin-bottom:20px;padding:8px 20px;background:#1a3060;color:#fff;border:none;cursor:pointer;border-radius:4px;font-family:Arial,sans-serif;font-size:13px">🖸 Imprimir / PDF</button><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;padding-bottom:15px;border-bottom:2px solid '+o+'"><div>'+F+'<div style="font-size:22px;font-weight:bold;color:#1a3060;margin-bottom:4px">ACTA DE RECEPCIÓN CONFORME</div><div style="font-size:12px;color:#555">Presupuesto N° '+t.id+'</div></div><div style="text-align:right;font-size:13px;color:#444">'+j+'</div></div><div style="margin-bottom:25px">Mediante el presente documento, se deja constancia de la recepción conforme de los trabajos correspondientes al presupuesto <strong>N° '+t.id+'</strong>, denominado "<strong>'+(t.descripcion||"Sin descripción")+'</strong>", ejecutados por <strong>'+s+'</strong> para el cliente <strong>'+(i.nombre||"")+'</strong>.</div><div style="margin-bottom:25px">Las partes declaran que los trabajos descritos en dicho presupuesto han sido completados en su totalidad, cumpliendo con los estándares acordados y a entera satisfacción del mandante.</div><div style="background:#f8f9fa;padding:15px 20px;border-left:4px solid '+o+';margin-bottom:40px"><div style="font-size:12px;color:#666;text-transform:uppercase;margin-bottom:4px">Valor Total Acordado (Monto Neto / Sin IVA)</div><div style="font-size:18px;font-weight:bold;color:#111">$'+n.toLocaleString("es-CL")+'</div></div><div style="margin-bottom:50px">Con la firma de esta acta, se da por finalizado y cerrado el trabajo asociado a este presupuesto, no quedando reparos u observaciones pendientes por ninguna de las partes.</div><div class="firma-bloque" style="display:flex;justify-content:space-between;margin-top:60px"><div style="width:45%;text-align:center">'+g+'<div style="border-top:1px solid #333;padding-top:8px;font-weight:bold">'+C+'</div><div style="font-size:12px;color:#555">'+b+'<br>'+s+'</div></div><div style="width:45%;text-align:center"><div style="height:100px"></div><div style="border-top:1px solid #333;padding-top:8px;font-weight:bold">'+(i.nombre||"Cliente")+'</div><div style="font-size:12px;color:#555">Recepción Conforme<br>RUT: '+(i.rut||"______________")+'</div></div></div></body></html>';
  return z;
}
`;

const idxAf = c.indexOf('function Af(');
if (idxAf > -1) {
  c = c.substring(0, idxAf) + HfFunc + c.substring(idxAf);
  console.log("Injected Hf");
}

// 2. Inject in the array
const oldArrayItem = `{id:"pagos",icon:"\\uD83D\\uDCB0",label:"Estados de Pago / Acta",desc:"Registrar pagos y generar documentos de cobro con firma",etapa:"Al cobrar",color:"#f59e0b"}`;
const newArrayItem = oldArrayItem + `,{id:"cierre",icon:"\\u2705",label:"Acta de Recepci\\u00F3n Conforme",desc:"Cierre formal del trabajo sin factura, listo para firma",etapa:"Al entregar",color:"#34d399"}`;

if (c.includes(oldArrayItem)) {
  c = c.replace(oldArrayItem, newArrayItem);
  console.log("Injected in array");
} else {
  // Let's try alternative match
  const altOldItem = `{id:"pagos",icon:"💰",label:"Estados de Pago / Acta",desc:"Registrar pagos y generar documentos de cobro con firma",etapa:"Al cobrar",color:"#f59e0b"}`;
  const altNewItem = altOldItem + `,{id:"cierre",icon:"✅",label:"Acta de Recepción Conforme",desc:"Cierre formal del trabajo sin factura, listo para firma",etapa:"Al entregar",color:"#34d399"}`;
  if (c.includes(altOldItem)) {
      c = c.replace(altOldItem, altNewItem);
      console.log("Injected in array with alt");
  } else {
      console.log("Array item not found");
  }
}

// 3. Inject in ternary operator
const oldTernary = `f.id==="carta"?h(Af(j,F,r)):`;
const newTernary = `f.id==="cierre"?h(Hf(j,F,r)):f.id==="carta"?h(Af(j,F,r)):`;

if (c.includes(oldTernary)) {
  c = c.replace(oldTernary, newTernary);
  console.log("Injected in ternary");
} else {
  console.log("Ternary not found");
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
