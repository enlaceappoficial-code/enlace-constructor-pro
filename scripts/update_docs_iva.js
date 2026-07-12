const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');
let changes = 0;

// =============================================================
// 1. PDF GENERATOR - totals rows with IVA line  
// The pattern is [[...],[IVA line],...].forEach
// We need to conditionally include the IVA line
// =============================================================

// Pattern in jsPDF: $.push(["","","","","IVA ("+Math.round(n.iva*100)+"%): ",K])
const oldPdfIva = '$.push(["","","","","IVA ("+Math.round(n.iva*100)+"%): ",K]),s.descuento';
const newPdfIva = '!s.sinIva&&$.push(["","","","","IVA ("+Math.round(n.iva*100)+"%): ",K]),s.descuento';
if (content.includes(oldPdfIva)) {
    content = content.replace(oldPdfIva, newPdfIva);
    changes++;
    console.log('1. PDF IVA line made conditional');
}

// Pattern in Excel generator: ["",...,"IVA (19%)",Math.round(x*.19),""]
const oldExcelIva = '["","","","","IVA (19%)",Math.round(x*.19),""]';
const newExcelIva = '...t.sinIva?[]:[[""," ","","","IVA (19%)",Math.round(x*.19),""]]';
if (content.includes(oldExcelIva)) {
    content = content.replace(oldExcelIva, newExcelIva);
    changes++;
    console.log('2. Excel IVA line made conditional');
}

// Pattern in HTML doc: <span>IVA (19%)</span><span>$...
const oldHtmlIva = `'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>IVA (19%)</span><span>$'+U.iva.toLocaleString("es-CL")+'</span></div>'`;
const newHtmlIva = `(t.sinIva?'':'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>IVA (19%)</span><span>$'+U.iva.toLocaleString("es-CL")+'</span></div>')`;
if (content.includes(oldHtmlIva)) {
    content = content.replace(oldHtmlIva, newHtmlIva);
    changes++;
    console.log('3. HTML doc IVA line made conditional');
}

// Pattern in WhatsApp: `🧾 *IVA (19%):* ${ne(o)}`
const oldWaIva = '`🧾 *IVA (19%):* ${ne(o)}`';
const newWaIva = 't.sinIva?"":"🧾 *IVA (19%):* "+ne(o)';
if (content.includes(oldWaIva)) {
    content = content.replace(oldWaIva, newWaIva);
    changes++;
    console.log('4. WhatsApp IVA line made conditional');
}

// =============================================================
// 2. PDF TOTAL ROW - when sinIva, total = subtotal (no IVA added)
// The Ee function already handles this by setting iva=0 when sinIvaFlag
// So we just need to make sure labels say "Total" not "Total con IVA"
// =============================================================

// Pattern in PDF jsPDF: [["Subtotal Neto",o,!1],["IVA (19%)",s,!1],["TOTAL OFERTA",m,!0]]
const oldPdfTotals = '[["Subtotal Neto",o,!1],["IVA (19%)",s,!1],["TOTAL OFERTA",m,!0]]';
const newPdfTotals = '[["Subtotal Neto",o,!1],...t.sinIva?[]:[["IVA (19%)",s,!1]],["TOTAL OFERTA",m,!0]]';
if (content.includes(oldPdfTotals)) {
    content = content.replace(oldPdfTotals, newPdfTotals);
    changes++;
    console.log('5. PDF totals rows made conditional');
}

// Pattern in Excel: [["Subtotal Neto (sin IVA)",n],["IVA (19%)",l]]
const oldExcelTotals = '[["Subtotal Neto (sin IVA)",n],["IVA (19%)",l]]';
const newExcelTotals = '[["Subtotal Neto (sin IVA)",n],...t.sinIva?[]:[["IVA (19%)",l]]]';
if (content.includes(oldExcelTotals)) {
    content = content.replace(oldExcelTotals, newExcelTotals);
    changes++;
    console.log('6. Excel totals rows made conditional');
}

// Pattern in Excel for offer: [[K,"Subtotal Neto"],[y,"IVA (19%)"],[P,"TOTAL A PAGAR"]]
const oldExcelOffer = '[[K,"Subtotal Neto"],[y,"IVA (19%)"],[P,"TOTAL A PAGAR"]]';
const newExcelOffer = '[[K,"Subtotal Neto"],...t.sinIva?[]:[[ y,"IVA (19%)"]],[P,"TOTAL A PAGAR"]]';
if (content.includes(oldExcelOffer)) {
    content = content.replace(oldExcelOffer, newExcelOffer);
    changes++;
    console.log('7. Excel offer totals made conditional');
}

// =============================================================
// 3. UI PREVIEWS - hide IVA in the budget summary cards
// =============================================================

// Pattern: e.jsx("span",{style:{color:a.muted},children:"IVA (19%)"})
// This is in the side preview. We need the `I` variable which is the budget state.
const oldUiIva = 'e.jsx("span",{style:{color:a.muted},children:"IVA (19%)"}),e.jsx("span",{children:ne(j)})';
if (content.includes(oldUiIva)) {
    content = content.replace(oldUiIva, 
        'e.jsx("span",{style:{color:a.muted},children:I.sinIva?"Sin IVA":"IVA (19%)"}),e.jsx("span",{children:I.sinIva?"—":ne(j)})');
    changes++;
    console.log('8. UI preview IVA made conditional');
}

// =============================================================
// SAVE
// =============================================================
fs.writeFileSync('src/assets/index.js', content, 'utf8');
console.log('\nTotal doc generator changes applied:', changes);
