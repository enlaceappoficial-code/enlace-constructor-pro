const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js.bak_pre_config_sidebar', 'utf8');
const regex = /e\.jsxs\("div",\{style:c\.card,children:\[e\.jsxs\("div",\{style:\{fontSize:15,fontWeight:700,color:a\.text,marginBottom:16,display:"flex",alignItems:"center",gap:8\},children:\[e\.jsx\("span",\{style:\{fontSize:20\},children:".{1,3}"\}\)," Buscar licitaciones.+?\]\},de\)\)\]\}\)\]\}\)\]\}\)\]\}\)/;
const match = content.match(regex);
if (match) {
    let str = match[0];
    console.log("LAST 50 CHARS OF MATCH:");
    console.log(str.substring(str.length - 50));
}
