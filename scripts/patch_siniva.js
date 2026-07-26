const fs = require('fs');
let data = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Add isSinIva to Ee signature
data = data.replace('Ee = (t, i, r, n) => {', 'Ee = (t, i, r, n, isSinIva) => {');

// 2. Make IVA multiplier 0 if isSinIva is true
data = data.replace(
  'o = i && i.moneda ? i.moneda.impuesto / 100 : (i && i.iva) || 0.19,',
  'o = isSinIva ? 0 : (i && i.moneda ? i.moneda.impuesto / 100 : (i && i.iva) || 0.19),'
);

// 3. Replace all generic Ee(budget.items, cfg, budget.descuento, budget.modoCosteo)
const regex = /Ee\(([a-zA-Z0-9_]+)\.items( \|\| \[\])?,\s*([^,]+),\s*\1\.descuento(?:,\s*\1\.modoCosteo)?( \|\| [^,)]+)?\)/g;
data = data.replace(regex, (match, p1, p2, p3, p4) => {
  return 'Ee(' + p1 + '.items' + (p2 || '') + ', ' + p3 + ', ' + p1 + '.descuento, ' + p1 + '.modoCosteo' + (p4 || '') + ', ' + p1 + '.sinIva)';
});

// 4. Manual edge cases
data = data.replace('Ee(h, r, t.descuento, m)', 'Ee(h, r, t.descuento, m, t.sinIva)');
data = data.replace('Ee(p, r, t.descuento, modo)', 'Ee(p, r, t.descuento, modo, t.sinIva)');
data = data.replace('Ee(t.items || [], r, t.descuento, modo)', 'Ee(t.items || [], r, t.descuento, modo, t.sinIva)');
data = data.replace('Ee(F, r, t.descuento, t.modoCosteo || "completo")', 'Ee(F, r, t.descuento, t.modoCosteo || "completo", t.sinIva)');
data = data.replace(/Ee\(\s*L\.items,\s*n,\s*L\.descuento,\s*L\.modoCosteo\s*,?\s*\)/g, 'Ee(L.items, n, L.descuento, L.modoCosteo, L.sinIva)');

// 5. Some missed Ee calls that are hardcoded or inside variables
data = data.replace('Ee(ae.items, l, ae.descuento, ae.modoCosteo)', 'Ee(ae.items, l, ae.descuento, ae.modoCosteo, ae.sinIva)');
data = data.replace('Ee(H.items, l, H.descuento, H.modoCosteo)', 'Ee(H.items, l, H.descuento, H.modoCosteo, H.sinIva)');

// Also replace the signature if it uses a minified name like 'function Ee('? No, we found 'Ee = (t, i, r, n) => {'.

fs.writeFileSync('src/assets/index.js', data);
console.log("Patched Ee successfully!");
