const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const errorSnippet = 'Guardar Configuración"})]},e.jsx("div",{style:{flex:1,minWidth:220}})';
const fixSnippet = 'Guardar Configuración"})]})},e.jsx("div",{style:{flex:1,minWidth:220}})';

if (c.includes(errorSnippet)) {
    c = c.replace(errorSnippet, fixSnippet);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Fixed syntax error");
} else {
    console.log("Could not find syntax error snippet to fix.");
}
