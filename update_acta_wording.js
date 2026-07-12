const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Update the HTML inside ActaRecepcionHTML
const oldTitle = 'ACTA DE RECEPCIÓN CONFORME</div>';
const newTitle = 'COMPROBANTE DE PAGO Y RECEPCIÓN DE OBRAS</div>';

const oldP1 = 'Mediante el presente documento, se deja constancia de la recepción conforme de los trabajos correspondientes al presupuesto <strong>N° \'+t.id+\'</strong>, denominado "<strong>\'+(t.descripcion||"Sin descripción")+\'</strong>", ejecutados por <strong>\'+s+\'</strong> para el cliente <strong>\'+(i.nombre||"")+\'</strong>.';
const newP1 = 'Mediante el presente documento, <strong>\'+s+\'</strong> declara haber recibido conforme el pago total por los trabajos correspondientes al presupuesto <strong>N° \'+t.id+\'</strong>, denominado "<strong>\'+(t.descripcion||"Sin descripción")+\'</strong>", ejecutados para el cliente <strong>\'+(i.nombre||"")+\'</strong>.';

const oldP2 = 'Las partes declaran que los trabajos descritos en dicho presupuesto han sido completados en su totalidad, cumpliendo con los estándares acordados y a entera satisfacción del mandante.';
const newP2 = 'Asimismo, el cliente declara que los trabajos descritos en dicho presupuesto han sido recibidos a su entera satisfacción, dándose por entregada la obra.';

const oldP3 = 'Valor Total Acordado (Monto Neto / Sin IVA)';
const newP3 = 'Monto Total Pagado (Sin IVA / Honorarios)';

const oldP4 = 'Con la firma de esta acta, se da por finalizado y cerrado el trabajo asociado a este presupuesto, no quedando reparos u observaciones pendientes por ninguna de las partes.';
const newP4 = 'Este documento sirve como comprobante formal de que los fondos han sido desembolsados y recibidos, dando por cerrado administrativa y operativamente el trabajo asociado a este presupuesto sin observaciones pendientes por ninguna de las partes.';

// Replace the texts
c = c.replace(oldTitle, newTitle);
c = c.replace(oldP1, newP1);
c = c.replace(oldP2, newP2);
c = c.replace(oldP3, newP3);
c = c.replace(oldP4, newP4);

// Update array labels
c = c.replace('label:"Acta de Recepción Conforme"', 'label:"Comprobante de Pago y Recepción"');
c = c.replace('desc:"Cierre formal del trabajo sin factura, listo para firma"', 'desc:"Comprobante de pago recibido y cierre formal de los trabajos"');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log("Updated HTML strings");
