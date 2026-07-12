const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function assertCount(label, count, min, max) {
  if (count < min || count > max) {
    console.error(`${label}: expected ${min}-${max} matches, got ${count}`);
    process.exit(2);
  }
}

function replaceRegexOnce(label, re, repl) {
  const m = s.match(re);
  const count = m ? m.length : 0;
  assertCount(label, count, 1, 1);
  s = s.replace(re, repl);
}

function replaceRegex(label, re, repl, min, max) {
  const m = s.match(re);
  const count = m ? m.length : 0;
  assertCount(label, count, min, max);
  s = s.replace(re, repl);
}

function replaceRegexOptional(label, re, repl) {
  const m = s.match(re);
  const count = m ? m.length : 0;
  if (count === 0) return;
  assertCount(label, count, 1, 1);
  s = s.replace(re, repl);
}

// 1) Default item factory: add _tipoCosto
replaceRegexOnce(
  "item_factory",
  /var f=\(\)=>\(\{desc:"",cant:1,unidad:"unidad",precio:0,_cid:""\}\)/,
  'var f=()=>({desc:"",cant:1,unidad:"unidad",precio:0,_cid:"",_tipoCosto:"mo"})'
);

// 2) Load/edit items: ensure _tipoCosto defaults
replaceRegexOnce(
  "edit_items_map",
  /items:\(m\.items\|\|\[\]\)\.map\(W=>u\(d\(\{\},W\),\{_cid:W\._cid\|\|""\}\)\)/,
  'items:(m.items||[]).map(W=>u(d({},W),{_cid:W._cid||"",_tipoCosto:W._tipoCosto||(W._cid?"auto":"mo")}))'
);

// 3) Add modoCosteo to edit/new budget state
replaceRegexOnce(
  "edit_state_add_modo",
  /plazoEjecucion:m\.plazoEjecucion\|\|r\.plazoEjecucion\|\|30,customId:m\.id\}/,
  'plazoEjecucion:m.plazoEjecucion||r.plazoEjecucion||30,modoCosteo:m.modoCosteo||"completo",customId:m.id}'
);
replaceRegexOnce(
  "new_state_add_modo",
  /plazoEjecucion:r\.plazoEjecucion\|\|30,customId:null\}\)/,
  'plazoEjecucion:r.plazoEjecucion||30,modoCosteo:"completo",customId:null})'
);

// 4) When selecting catalog on an existing row, default _tipoCosto to auto
replaceRegexOnce(
  "ee_set_tipo_auto",
  /E\[W\]\.desc=M\.desc,E\[W\]\.unidad=M\.unidad,E\[W\]\.precio=M\.precio;/,
  'E[W].desc=M.desc,E[W].unidad=M.unidad,E[W].precio=M.precio,E[W]._tipoCosto=E[W]._tipoCosto||"auto";'
);

// 5) addFromCatalog: set _tipoCosto auto
replaceRegexOnce(
  "add_from_catalog_tipo",
  /L=u\(d\(\{\},f\(\)\),\{_cid:String\(W\.id\),desc:W\.desc,unidad:W\.unidad,precio:W\.precio\}\)/,
  'L=u(d({},f()),{_cid:String(W.id),desc:W.desc,unidad:W.unidad,precio:W.precio,_tipoCosto:"auto"})'
);

// 6) Plantilla select: preserve _tipoCosto/defaults
replaceRegexOnce(
  "plantilla_tipo",
  /return u\(d\(\{\},f\(\)\),\{desc:L\.desc,cant:L\.cant,unidad:M\?M\.unidad:L\.unidad,precio:M\?M\.precio:0,_cid:L\._cid\|\|""\}\)/,
  'return u(d({},f()),{desc:L.desc,cant:L.cant,unidad:M?M.unidad:L.unidad,precio:M?M.precio:0,_cid:L._cid||"",_tipoCosto:L._tipoCosto||(L._cid?"auto":"mo")})'
);

// 7) Optional UI insertion (done later if pattern matches)
replaceRegexOptional(
  "insert_modo_selector",
  /e\.jsx\(ze,\{label:"Fecha",children:e\.jsx\(Pe,\{type:"date",value:I\.fecha,onChange:W=>D\(T=>u\(d\(\{\},T\),\{fecha:W\}\)\)\)\}\)\}\)\),m&&/,
  'e.jsx(ze,{label:"Fecha",children:e.jsx(Pe,{type:"date",value:I.fecha,onChange:W=>D(T=>u(d({},T),{fecha:W}))})}),e.jsx(ze,{label:"Modo",children:e.jsx(Mi,{value:I.modoCosteo||"completo",onChange:W=>D(T=>u(d({},T),{modoCosteo:W})),children:[e.jsx("option",{value:"completo",children:"Completo"}),e.jsx("option",{value:"mo",children:"Solo MO"}),e.jsx("option",{value:"separado",children:"Separado"})]})}),m&&'
);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");
