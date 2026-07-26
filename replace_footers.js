const fs = require('fs');
const file = 'src/assets/index.js';
let content = fs.readFileSync(file, 'utf8');

const disclaimer = 'Presupuesto generado con Enlace Constructor Pro. La verificación matemática, técnica y económica de los montos y mediciones es responsabilidad exclusiva del profesional a cargo.';

const replacements = [
  ['text-align:center\">Enlace Constructor — ', 'text-align:center\">' + disclaimer + ' — '],
  ['text-align:center\'>Enlace Constructor — ', 'text-align:center\'>' + disclaimer + ' — '],
  ['text-align:center\">Enlace Constructor Pro — ', 'text-align:center\">' + disclaimer + ' — '],
  ['text-align:center\'>Enlace Constructor Pro — ', 'text-align:center\'>' + disclaimer + ' — '],
  ['text-align:center\">Generado por Enlace Constructor Pro — ', 'text-align:center\">' + disclaimer + ' — '],
  ['text-align:center\'>Generado por Enlace Constructor Pro — ', 'text-align:center\'>' + disclaimer + ' — '],
  ['\"Generado con Enlace Constructor Pro — Plan Starter\"', '\"' + disclaimer + '\"'],
  ['>Generado por Enlace Constructor Pro</p>', '>' + disclaimer + '</p>'],
  ['>Enlace Constructor Pro</p>', '>' + disclaimer + '</p>'],
  [') · Generado por Enlace Constructor Pro\"', ') · ' + disclaimer + '\"'],
  ['\"Enlace Constructor Pro — \" +', '\"' + disclaimer + ' — \" +'],
  ['\"Generado por Enlace Constructor Pro — \" +', '\"' + disclaimer + ' — \" +'],
  ['Ley de Compras Públicas N° 19.886 · Generado por Enlace Constructor Pro\"', 'Ley de Compras Públicas N° 19.886 · ' + disclaimer + '\"'],
  ['Enlace Constructor Pro — ${K}', disclaimer + ' — ${K}'],
  ['Enlace Constructor — ${companyName}', disclaimer + ' — ${companyName}']
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync(file, content);
console.log('Done!');
