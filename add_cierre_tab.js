const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldArrayItem = '{id:"informe",icon:"\\uD83D\\uDCCB",label:"Informe de Entrega",etapa:"\\uD83D\\uDCCA Entrega final",color:"#14b8a6",desc:"Informe de entrega de obra emitido por el contratista"}';
const newArrayItem = oldArrayItem + ',{id:"cierre",icon:"\\u2705",label:"Acta de Recepci\\u00F3n Conforme",etapa:"\\u2705 Al cerrar",color:"#34d399",desc:"Cierre formal del trabajo sin factura, listo para firma"}';

if (c.includes(oldArrayItem)) {
  c = c.replace(oldArrayItem, newArrayItem);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Injected in Documentos tab array!");
} else {
  const altOldItem = '{id:"informe",icon:"📋",label:"Informe de Entrega",etapa:"📊 Entrega final",color:"#14b8a6",desc:"Informe de entrega de obra emitido por el contratista"}';
  const altNewItem = altOldItem + ',{id:"cierre",icon:"✅",label:"Acta de Recepción Conforme",etapa:"✅ Al cerrar",color:"#34d399",desc:"Cierre formal del trabajo sin factura, listo para firma"}';
  
  if (c.includes(altOldItem)) {
      c = c.replace(altOldItem, altNewItem);
      fs.writeFileSync('src/assets/index.js', c, 'utf8');
      console.log("Injected in Documentos tab array using alt string!");
  } else {
      console.log("Array item in tab not found! Looking for a partial match...");
      // Let's just find `id:"informe"` in a bigger chunk
      const idx = c.indexOf('id:"informe",icon:');
      if (idx > -1) {
          console.log("Found something similar at " + idx);
          console.log(c.substring(idx - 100, idx + 200));
      }
  }
}
