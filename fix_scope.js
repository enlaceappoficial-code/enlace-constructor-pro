const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Update Mg call
const oldCall = 'Mg,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q}';
const newCall = 'Mg,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q, setPage:f, setEditB:R, setCfg:o}';
content = content.replace(oldCall, newCall);

// 2. Update Mg signature
const oldSig = 'function Mg({licitaciones:t,setLicitaciones:i,budgets:r,cfg:n,apus:l,materiales:o,catalog:s,setToast:m})';
const newSig = 'function Mg({licitaciones:t,setLicitaciones:i,budgets:r,cfg:n,apus:l,materiales:o,catalog:s,setToast:m, setPage, setEditB, setCfg})';
content = content.replace(oldSig, newSig);

// 3. Fix the Button logic
const oldBtnRegex = /const nuevoId = l\.nextNum \|\| Date\.now\(\);.+?f\("edit"\);/;
const newBtnStr = 'const nuevoId = n.nextNum || Date.now();' +
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
  'if(setCfg) setCfg(me => Object.assign({}, me, {nextNum: nuevoId + 1}));' +
  'if(setEditB) setEditB(pBase);' +
  'if(setPage) setPage("edit");';

content = content.replace(oldBtnRegex, newBtnStr);

fs.writeFileSync('src/assets/index.js', content, 'utf8');
console.log("Scope fixed!");
