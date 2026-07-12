const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Update the validation logic
const oldValidation = 'if(!query.trim() && canal==="licitaciones" && !organismoSel) return props.setToast("\\u26A0\\uFE0F Ingresa palabras clave u organismo");';
const newValidation = 'if(!query.trim() && !organismoSel && region==="Todas") return props.setToast("\\u26A0\\uFE0F Selecciona una regi\\u00F3n, organismo o ingresa palabras clave");';

if (c.includes(oldValidation)) {
    c = c.replace(oldValidation, newValidation);
    console.log('Validation logic updated.');
} else {
    console.error('Could not find validation logic.');
}

// 2. Reorder the UI fields
// The current UI layout is: Palabras Clave -> Organismo -> Región
const oldUIBlock = `      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:canal==="licitaciones"?"1fr 1fr":"(canal==='compra_agil'?'1fr 1fr':'1fr 1fr 1fr')",gap:12,marginBottom:12},children:[
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Palabras clave"}),
          e.jsx("input",{list:"sugerencias-mp",style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: pintura, construcci\\\\u00F3n, mantenci\\\\u00F3n...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"sugerencias-mp",children:["construcci\\\\u00F3n","reparaci\\\\u00F3n","mantenci\\\\u00F3n","obras civiles","pavimentaci\\\\u00F3n","pintura","techumbre","demolici\\\\u00F3n","alba\\\\u00F1iler\\\\u00EDa","carpinter\\\\u00EDa","instalaci\\\\u00F3n el\\\\u00E9ctrica","gasfiter\\\\u00EDa","aseo","jardiner\\\\u00EDa"].map(function(opt){return e.jsx("option",{value:opt},opt)})})
        ]}),
        (canal==="todos"||canal==="licitaciones")&&e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Organismo (Licitaciones)"}),
          e.jsx("input",{list:"lista-organismos-mp",style:d({},sty.inp),value:organismoSel,onChange:function(ev){setOrganismoSel(ev.target.value)},placeholder:"Todas las entidades...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"lista-organismos-mp",children:orgsFiltrados.map(function(org){return e.jsx("option",{value:org.NombreEmpresa},org.CodigoEmpresa)})})
        ]}),
        (canal==="todos"||canal==="compra_agil")&&e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"Regi\\\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value)},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]})
      ]}),`;

const newUIBlock = `      e.jsxs("div",{style:{display:"grid",gridTemplateColumns:canal==="licitaciones"?"1fr 1fr 1fr":"(canal==='compra_agil'?'1fr 1fr':'1fr 1fr 1fr')",gap:12,marginBottom:12},children:[
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"1. Regi\\\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value)},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]}),
        (canal==="todos"||canal==="licitaciones")&&e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"2. Organismo"}),
          e.jsx("input",{list:"lista-organismos-mp",style:d({},sty.inp),value:organismoSel,onChange:function(ev){setOrganismoSel(ev.target.value)},placeholder:"Todas las entidades...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"lista-organismos-mp",children:orgsFiltrados.map(function(org){return e.jsx("option",{value:org.NombreEmpresa},org.CodigoEmpresa)})})
        ]}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:(canal==="todos"||canal==="licitaciones")?"3. Palabras clave (Opcional)":"2. Palabras clave (Opcional)"}),
          e.jsx("input",{list:"sugerencias-mp",style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: construcci\\\\u00F3n, pintura...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"sugerencias-mp",children:["construcci\\\\u00F3n","reparaci\\\\u00F3n","mantenci\\\\u00F3n","obras civiles","pavimentaci\\\\u00F3n","pintura","techumbre","demolici\\\\u00F3n","alba\\\\u00F1iler\\\\u00EDa","carpinter\\\\u00EDa","instalaci\\\\u00F3n el\\\\u00E9ctrica","gasfiter\\\\u00EDa","aseo","jardiner\\\\u00EDa"].map(function(opt){return e.jsx("option",{value:opt},opt)})})
        ]})
      ]}),`;

// Since formatting might differ slightly, I'll use regex or manual replace
// Let's do a substring replace for safety
const gridStartIdx = c.indexOf('e.jsxs("div",{style:{display:"grid",gridTemplateColumns:canal==="licitaciones"?"1fr 1fr":"(canal===\'compra_agil\'?\'1fr 1fr\':\'1fr 1fr 1fr\')",gap:12,marginBottom:12},children:[');
const gridEndIdx = c.indexOf('e.jsx("button",{style:u(d({},sty.btn("p"))', gridStartIdx);

if (gridStartIdx > -1 && gridEndIdx > -1) {
    c = c.substring(0, gridStartIdx) + newUIBlock + '\n      ' + c.substring(gridEndIdx);
    console.log('UI Reordered successfully.');
} else {
    console.error('Could not find UI block boundaries.');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
