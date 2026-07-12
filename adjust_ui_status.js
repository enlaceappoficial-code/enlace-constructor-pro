const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Rename tab in Fp2
const oldTab = `{id:"licit",icon:"\\uD83C\\uDFD7\\uFE0F",label:"Construir Oferta"}`;
const newTab = `{id:"licit",icon:"\\uD83D\\uDCC4",label:"Detalle de Licitaci\\u00F3n"}`;
if(c.includes(oldTab)) c = c.replace(oldTab, newTab);

// 2. Rename button in MpKanban
const oldBtn = `\\uD83C\\uDFD7\\uFE0F Construir Oferta`;
const newBtn = `\\uD83D\\uDCC4 Abrir Detalle y Docs`;
if(c.includes(oldBtn)) {
  c = c.replace(oldBtn, newBtn);
  // It might appear multiple times if the string is exactly the same, let's replace all via split/join
  c = c.split(oldBtn).join(newBtn);
}

// 3. Update onSave in MpDetalleLicitacion to automatically set to "Postulada" if it's new
const oldSave = `  var onSave = function(nLic){
    props.setLicitaciones(function(prev){return prev.map(function(x){return x.id === nLic.id ? nLic : x})});
    props.setToast("\\u2705 Oferta guardada correctamente");
    if (props.setActiveTab) props.setActiveTab("kanban");
  };`;
const newSave = `  var onSave = function(nLic){
    if(nLic.estado === "Borrador" || nLic.estado === "Pendiente" || nLic.estado === "En Estudio") {
      nLic.estado = "Postulada";
    }
    props.setLicitaciones(function(prev){return prev.map(function(x){return x.id === nLic.id ? nLic : x})});
    props.setToast("\\u2705 Oferta guardada y movida a Postulada");
    if (props.setActiveTab) props.setActiveTab("kanban");
  };`;
if(c.includes(oldSave)) c = c.replace(oldSave, newSave);

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('UI adjustments applied.');
