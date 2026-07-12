const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function replaceOnce(needle, replacement, label) {
  const at = s.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró: ${label}`);
  const at2 = s.indexOf(needle, at + needle.length);
  if (at2 !== -1) throw new Error(`No-único: ${label}`);
  s = s.slice(0, at) + replacement + s.slice(at + needle.length);
}

// 1) Permitir repetir partidas desde el catálogo (mostrar botón aunque ya exista)
replaceOnce(
  '!x&&e.jsx("button",{style:u(d({},s.btn("g")),{width:"100%",padding:"5px",fontSize:10,marginTop:7}),onClick:()=>l(v),children:"+ Agregar al presupuesto"})',
  'e.jsx("button",{style:u(d({},s.btn("g")),{width:"100%",padding:"5px",fontSize:10,marginTop:7,opacity:x?.7:1}),onClick:()=>l(v),children:x?"+ Agregar nuevamente":"+ Agregar al presupuesto"})',
  "botón agregar catálogo (duplicados)"
);

// 2) Si una partida no tiene APU, que no quede en AUTO (para que sea claramente editable)
//    - Al seleccionar _cid en una fila
replaceOnce(
  'E[W].desc=M.desc,E[W].unidad=M.unidad,E[W].precio=M.precio,E[W]._tipoCosto=E[W]._tipoCosto||"auto";var q=n&&n.find(J=>J.catalogId===M.id&&!J.esSubcontrato&&J.materiales.length>0);',
  'E[W].desc=M.desc,E[W].unidad=M.unidad,E[W].precio=M.precio;var q=n&&n.find(J=>J.catalogId===M.id&&!J.esSubcontrato&&J.materiales.length>0);E[W]._tipoCosto=E[W]._tipoCosto||(q?"auto":"mo");',
  "tipo costo al seleccionar catálogo"
);

//    - Al agregar desde el catálogo lateral
replaceOnce(
  ',precio:W.precio,_tipoCosto:"auto"});T&&',
  ',precio:W.precio,_tipoCosto:T?"auto":"mo"});T&&',
  "tipo costo al agregar desde catálogo"
);

// 3) Al cargar una plantilla, respetar el precio manual de ítems sin _cid
replaceOnce(
  'precio:M?M.precio:0,_cid:L._cid||"",_tipoCosto:L._tipoCosto||(L._cid?"auto":"mo")',
  'precio:M?M.precio:(parseFloat(L.precio)||0),_cid:L._cid||"",_tipoCosto:L._tipoCosto||(L._cid?"auto":"mo")',
  "precio manual en plantilla"
);

if (s === before) throw new Error("No se aplicaron cambios (contenido idéntico).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_budget_editor_ux");

