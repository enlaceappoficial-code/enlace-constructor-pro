const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /onClick:\(\)=>alert\("Fase 2[^"]+"\)/;

const newBtn = 'onClick:()=>{' +
  'if(!window.licData || !window.licData.Items || !window.licData.Items.Listado) return alert("Esta licitaci\u00F3n no tiene \u00EDtems detallados para importar.");' +
  'const nuevoId = l.nextNum || Date.now();' +
  'const items = window.licData.Items.Listado.map((it, idx) => ({' +
    'id: "lic_" + Date.now() + "_" + idx,' +
    'desc: (it.NombreProducto || "Item sin nombre").substring(0, 150),' +
    'uni: (it.UnidadMedida || "un").substring(0, 10),' +
    'cant: parseFloat(it.Cantidad) || 1,' +
    '_cid: "", _tipoCosto: "mo", precio: 0, mat: 0, mo: 0, eq: 0, sc: 0' +
  '}));' +
  'const pBase = {' +
    'id: nuevoId,' +
    'fecha: new Date().toISOString().split("T")[0],' +
    'estado: "Pendiente",' +
    'clienteId: "",' +
    'obra: "Licitaci\u00F3n " + window.licData.CodigoExterno,' +
    'descripcion: window.licData.Nombre,' +
    'items: items,' +
    'changelog: [{fecha: new Date().toLocaleString(), accion: "Generado desde Licitaci\u00F3n " + window.licData.CodigoExterno}]' +
  '};' +
  'o(me => Object.assign({}, me, {nextNum: nuevoId + 1}));' +
  'R(pBase);' +
  'f("edit");' +
'}';

if (content.match(regex)) {
    content = content.replace(regex, newBtn);
    fs.writeFileSync('src/assets/index.js', content, 'utf8');
    console.log("Button logic replaced successfully!");
} else {
    console.log("Could not find the button string!");
}
