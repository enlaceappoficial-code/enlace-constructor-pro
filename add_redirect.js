const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldSave = `  var onSave = function(nLic){
    props.setLicitaciones(function(prev){return prev.map(function(x){return x.id === nLic.id ? nLic : x})});
    props.setToast("\\u2705 Oferta guardada correctamente");
  };`;
const newSave = `  var onSave = function(nLic){
    props.setLicitaciones(function(prev){return prev.map(function(x){return x.id === nLic.id ? nLic : x})});
    props.setToast("\\u2705 Oferta guardada correctamente");
    if (props.setActiveTab) props.setActiveTab("kanban");
  };`;

if(c.includes(oldSave)) c = c.replace(oldSave, newSave);
else console.log('oldSave not found');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Redirect added to onSave.');
