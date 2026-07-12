const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /e\.jsx\("button",\{style:u\(d\(\{\},c\.btn\("p"\)\),\{padding:"10px",fontSize:13,width:"100%"\}\),onClick:\(\)=>\{if\(!window\.licData.+?Crear Presupuesto desde Licitación \(Borrador\)"\}\)/s;
const match = content.match(regex);
if (match) {
    const fullMatch = match[0];
    const newBtn = 'e.jsxs("div",{style:{display:"flex",gap:10},children:[' + 
      'e.jsx("button",{style:u(d({},c.btn("s")),{padding:"10px",fontSize:13,flex:1}),onClick:()=>window.open("https://www.mercadopublico.cl/FichaLicitacion.html?idLicitacion=" + window.licData.CodigoExterno, "_blank"),children:"\uD83D\uDCC4 Ver Bases en MP"}),' +
      fullMatch.replace('width:"100%"', 'flex:2').replace('Crear Presupuesto desde Licitación (Borrador)', 'Crear Presupuesto') +
      ']})';
    content = content.replace(regex, newBtn);
    fs.writeFileSync('src/assets/index.js', content, 'utf8');
    console.log("UX Button added!");
} else {
    console.log("Could not find the button!");
}
