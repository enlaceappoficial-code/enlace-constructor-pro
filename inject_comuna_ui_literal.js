const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const strTarget = `e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"1. Regi\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value)},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]}),`;

const strReplace = `e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"1. Regi\\u00F3n"}),
          e.jsx("select",{style:d({},sty.inp),value:region,onChange:function(ev){setRegion(ev.target.value);setComuna("Todas");},children:regiones.map(function(r){return e.jsx("option",{value:r,children:r},r)})})
        ]}),
        e.jsxs("div",{children:[
          e.jsx("div",{style:{fontSize:11,color:th.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"},children:"2. Comuna (Opcional)"}),
          e.jsx("select",{style:d({},sty.inp),value:comuna,disabled:region==="Todas",onChange:function(ev){setComuna(ev.target.value)},children:[e.jsx("option",{value:"Todas",children:region==="Todas"?"Selecciona Regi\\u00F3n":"Todas las comunas"})].concat((function(){
             var rLit = region.replace(/\\u00ED/g,"í").replace(/\\u00E1/g,"á").replace(/\\u00E9/g,"é").replace(/\\u00F3/g,"ó").replace(/\\u00FA/g,"ú").replace(/\\u00D1/g,"Ñ");
             return (typeof comunasPorRegion!=="undefined"?(comunasPorRegion[region]||comunasPorRegion[rLit]||[]):[]);
          })().map(function(c){return e.jsx("option",{value:c,children:c.charAt(0).toUpperCase()+c.slice(1)},c)}))})
        ]}),`;

if (c.includes(strTarget)) {
    c = c.replace(strTarget, strReplace);
    console.log('UI block injected successfully.');
} else {
    console.error('Target string not found.');
}

c = c.replace('children:"2. Organismo"', 'children:"3. Organismo"');
c = c.replace('children:(canal==="todos"||canal==="licitaciones")?"3. Palabras clave (Opcional)":"2. Palabras clave (Opcional)"', 'children:(canal==="todos"||canal==="licitaciones")?"4. Palabras clave (Opcional)":"3. Palabras clave (Opcional)"');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
