const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// ========================================================
// Add organismosList state and datalist to MpBuscador
// ========================================================

// 1. Add state declaration after existing state variables
const stateTarget = '  var _pg=V(1),page=_pg[0],setPage=_pg[1];';
const stateReplacement = `  var _pg=V(1),page=_pg[0],setPage=_pg[1];
  var _orgs=V([]),organismosList=_orgs[0],setOrganismosList=_orgs[1];
  var _orgSel=V(""),organismoSel=_orgSel[0],setOrganismoSel=_orgSel[1];
  ct(function(){
    var tk=cfg&&cfg.apiKeyMP||"79B6AA40-A970-4164-ADEE-47CF3F378CBA";
    fetch("https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarComprador?ticket="+tk)
      .then(function(r){return r.json()})
      .then(function(data){if(data&&data.listaEmpresas)setOrganismosList(data.listaEmpresas)})
      .catch(function(){});
  },[]);`;

if (c.includes(stateTarget)) {
  c = c.replace(stateTarget, stateReplacement);
  console.log('State injection: OK');
} else {
  console.error('Could not find state target');
  process.exit(1);
}

// 2. Add list attribute to the query input + add organismo input after
// Current: e.jsx("input",{style:d({},sty.inp),value:query,...})
const queryInputTarget = 'e.jsx("input",{style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: pintura, construcci\\u00F3n, mantenci\\u00F3n...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}})';

const queryInputReplacement = `e.jsx("input",{list:"sugerencias-mp",style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: pintura, construcci\\u00F3n, mantenci\\u00F3n...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"sugerencias-mp",children:["construcci\\u00F3n","reparaci\\u00F3n","mantenci\\u00F3n","obras civiles","pavimentaci\\u00F3n","pintura","techumbre","demolici\\u00F3n","alba\\u00F1iler\\u00EDa","carpinter\\u00EDa","instalaci\\u00F3n el\\u00E9ctrica","gasfiter\\u00EDa","aseo","jardiner\\u00EDa"].map(function(opt){return e.jsx("option",{value:opt},opt)})})`;

if (c.includes(queryInputTarget)) {
  c = c.replace(queryInputTarget, queryInputReplacement);
  console.log('Datalist injection: OK');
} else {
  console.log('Could not find exact query input target, checking variant...');
  // Try with double-escaped unicode
  const alt = 'e.jsx("input",{style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: pintura, construcci\\\\u00F3n, mantenci\\\\u00F3n...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}})';
  if (c.includes(alt)) {
    c = c.replace(alt, queryInputReplacement.replace('\\u00F3n', '\\\\u00F3n').replace('\\u00F3', '\\\\u00F3'));
    console.log('Datalist injection (alt): OK');
  } else {
    console.error('Could not find query input');
  }
}

// 3. Add organismo filter next to region filter
// Find the neg words div (which is adjacent to the query input) and add after
const negSectionTarget = 'e.jsxs("div",{children:[\n          e.jsx("div",{style:{fontSize:11,color:"#f87171",fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"\\\\u26D4 Palabras negativas (excluir)"}),';

const negSectionIdx = c.indexOf('\\u26D4 Palabras negativas');
if (negSectionIdx === -1) {
  const altIdx = c.indexOf('\\\\u26D4 Palabras negativas');
  console.log('Neg words at (alt):', altIdx);
} else {
  console.log('Neg words at:', negSectionIdx);
}

// 4. Add organismo filter to the search row (with region, tipo, etc)
// After the region select, add an organismo input
const organismoTarget = 'e.jsx("div",{}),\n        e.jsx("button",{style:u(d({},sty.btn("p"))';

if (c.includes(organismoTarget)) {
  const organismoSection = `e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Organismo"}),
          e.jsx("input",{list:"lista-organismos-mp",style:d({},sty.inp),value:organismoSel,onChange:function(ev){setOrganismoSel(ev.target.value)},placeholder:"Todas las entidades..."}),
          e.jsx("datalist",{id:"lista-organismos-mp",children:organismosList.map(function(org){return e.jsx("option",{value:org.NombreEmpresa},org.CodigoEmpresa)})})
        ]}),
        e.jsx("button",{style:u(d({},sty.btn("p"))`;
  c = c.replace(organismoTarget, organismoSection);
  console.log('Organismo filter injection: OK');
} else {
  console.log('Could not find empty div before button');
}

// Verify syntax
try {
  new Function(c);
  console.log('Syntax OK!');
} catch(err) {
  console.log('Syntax check failed:', err.message.substring(0, 100));
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Done!');
