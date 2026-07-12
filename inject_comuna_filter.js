const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Add state variable
const stateTarget = 'var _orgs=V([]),organismosList=_orgs[0],setOrganismosList=_orgs[1];';
const stateReplacement = 'var _com=V("Todas"),comuna=_com[0],setComuna=_com[1];\n  var _orgs=V([]),organismosList=_orgs[0],setOrganismosList=_orgs[1];';
if (c.includes(stateTarget)) {
    c = c.replace(stateTarget, stateReplacement);
    console.log('Injected comuna state.');
}

// 2. Update grid template
const gridTarget = 'e.jsxs("div",{style:{display:"grid",gridTemplateColumns:canal==="licitaciones"?"1fr 1fr 1fr":"(canal===\'compra_agil\'?\'1fr 1fr\':\'1fr 1fr 1fr\')",gap:12,marginBottom:12},children:[';
const gridReplacement = 'e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))",gap:12,marginBottom:12},children:[';
if (c.includes(gridTarget)) {
    c = c.replace(gridTarget, gridReplacement);
    console.log('Updated grid layout for filters.');
}

// 3. Replace the UI block for filters
const uiStart = c.indexOf('e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"1. Regi\\u00F3n"})');
const uiEnd = c.indexOf('e.jsx("button",{style:u(d({},sty.btn("p")),{padding:"12px 32px",fontSize:14,width:"100%"})');

if (uiStart > -1 && uiEnd > -1) {
    const oldUI = c.substring(uiStart, uiEnd);
    
    // We will build the new UI
    const newUI = `e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"1. Regi\\\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value);setComuna("Todas");},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"2. Comuna (Opcional)"}),
          e.jsx("select",{style:d({},sty.inp),value:comuna,disabled:region==="Todas",onChange:function(ev){setComuna(ev.target.value)},children:[e.jsx("option",{value:"Todas",children:region==="Todas"?"Selecciona Regi\\\\u00F3n primero":"Todas las comunas"})].concat((function(){
             var rLit = region.replace(/\\\\u00ED/g,"í").replace(/\\\\u00E1/g,"á").replace(/\\\\u00E9/g,"é").replace(/\\\\u00F3/g,"ó").replace(/\\\\u00FA/g,"ú").replace(/\\\\u00D1/g,"Ñ");
             return (typeof comunasPorRegion!=="undefined"?(comunasPorRegion[region]||comunasPorRegion[rLit]||[]):[]);
          })().map(function(c){return e.jsx("option",{value:c,children:c.charAt(0).toUpperCase()+c.slice(1)},c)}))})
        ]}),
        (canal==="todos"||canal==="licitaciones")&&e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"3. Organismo"}),
          e.jsx("input",{list:"lista-organismos-mp",style:d({},sty.inp),value:organismoSel,onChange:function(ev){setOrganismoSel(ev.target.value)},placeholder:"Todas las entidades...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"lista-organismos-mp",children:orgsFiltrados.map(function(org){return e.jsx("option",{value:org.NombreEmpresa},org.CodigoEmpresa)})})
        ]}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:(canal==="todos"||canal==="licitaciones")?"4. Palabras clave":"3. Palabras clave"}),
          e.jsx("input",{list:"sugerencias-mp",style:d({},sty.inp),value:query,onChange:function(ev){setQuery(ev.target.value)},placeholder:"Ej: construcci\\\\u00F3n, pintura...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"sugerencias-mp",children:["construcci\\\\u00F3n","reparaci\\\\u00F3n","mantenci\\\\u00F3n","obras civiles","pavimentaci\\\\u00F3n","pintura","techumbre","demolici\\\\u00F3n","alba\\\\u00F1iler\\\\u00EDa","carpinter\\\\u00EDa","instalaci\\\\u00F3n el\\\\u00E9ctrica","gasfiter\\\\u00EDa","aseo","jardiner\\\\u00EDa"].map(function(opt){return e.jsx("option",{value:opt},opt)})})
        ]})
      ]}),
      `;
    
    c = c.substring(0, uiStart) + newUI + c.substring(uiEnd);
    console.log('Replaced UI to include Comuna select.');
} else {
    console.error('Could not find UI boundaries.');
}

// 4. Update orgsFiltrados logic
const orgsTarget = 'var keywords = typeof comunasPorRegion !== "undefined" ? (comunasPorRegion[region] || comunasPorRegion[regLiteral] || []) : [];';
const orgsReplacement = 'var keywords = comuna !== "Todas" ? [comuna.toLowerCase()] : (typeof comunasPorRegion !== "undefined" ? (comunasPorRegion[region] || comunasPorRegion[regLiteral] || []) : []);';
if (c.includes(orgsTarget)) {
    c = c.replace(orgsTarget, orgsReplacement);
    console.log('Updated orgsFiltrados logic for Comuna.');
}

// 5. Update handleSearch fallback logic
const fallbackTarget = 'var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";\n          if(reg.toLowerCase().indexOf(regLower)>-1) return true;';
const fallbackReplacement = `var reg=it.Comprador?it.Comprador.RegionUnidad||"":it.regionComprador||"";
          var orgName = (it.Comprador?it.Comprador.NombreOrganismo:it.proveedor||"").toLowerCase();
          var txt = ((it.Nombre||"")+" "+(it.Descripcion||"")).toLowerCase();
          
          if (comuna !== "Todas") {
             if (txt.indexOf(comuna.toLowerCase()) > -1 || orgName.indexOf(comuna.toLowerCase()) > -1) return true;
             return false;
          }
          
          if(reg.toLowerCase().indexOf(regLower)>-1) return true;`;

if (c.includes(fallbackTarget)) {
    c = c.replace(fallbackTarget, fallbackReplacement);
    // Remove the redundant txt declaration below
    c = c.replace('var txt = ((it.Nombre||"")+" "+(it.Descripcion||"")).toLowerCase();', '');
    console.log('Updated handleSearch for Comuna.');
} else {
    console.log('Could not find handleSearch fallback block');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
