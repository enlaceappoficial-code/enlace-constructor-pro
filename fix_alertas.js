const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Replace G logic
const gRegex = /var G=N=>\{if\(!f\.length\)return\[\];var de=\(N\.nombreObra\+" "\+N\.organismo\+"\ "\+\(N\.notas\|\|""\)\)\.toLowerCase\(\);return f\.filter\(me=>\{var pe=!me\.palabras\|\|me\.palabras\.toLowerCase\(\)\.split\([^}]+\}\)\},ie=t\.map\(N=>u\(d\(\{\},N\),\{_alertas:G\(N\)\}\)\)\.filter\(N=>N\._alertas\.length>0\)/;
const newG = 'var G=N=>{if(!f.length)return[];var de=((N.Nombre||"")+" "+(N.Descripcion||"")).toLowerCase();return f.filter(me=>{var pe=!me.palabras||me.palabras.toLowerCase().split(",").map(je=>je.trim()).some(je=>je&&de.includes(je));return pe})},ie=(window.licList||[]).map(N=>Object.assign({},N,{_alertas:G(N)})).filter(N=>N._alertas.length>0)';

if (content.match(gRegex)) {
    content = content.replace(gRegex, newG);
    console.log("G replaced!");
} else {
    console.log("G not replaced!");
}

// 2. Replace ie.map logic
const ieMapRegex = /ie\.map\(N=>\{var de=si\[N\.estado\].+?me>0\?me\+"d cierre":"¡Hoy!"\}\)\]\}\)\]\},N\.id\)\}\)/s;

const newIeMap = 'ie.map(N=>{return e.jsxs("div",{style:{background:a.sb,borderRadius:10,padding:"12px",border:"1px solid "+a.border,marginBottom:8},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4},children:[e.jsx("span",{style:{fontSize:12,fontWeight:700,color:a.accent},children:N.CodigoExterno}),e.jsx("span",{style:{fontSize:11,color:a.muted,fontWeight:600},children:N.Estado||"Publicada"})]}),e.jsx("div",{style:{fontSize:13,fontWeight:600,color:a.text,marginBottom:8},children:N.Nombre}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:N._alertas.map((pe,he)=>e.jsxs("span",{style:{background:a.accent+"22",color:a.accent,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:600},children:["\uD83D\uDD14 ",pe.palabras.split(",")[0].trim()]},he))}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"6px 12px",fontSize:11}),onClick:()=>{window.open("https://www.mercadopublico.cl/FichaLicitacion.html?idLicitacion="+N.CodigoExterno,"_blank")},children:"Ver en MP"})]})]},N.CodigoExterno)})';

if (content.match(ieMapRegex)) {
    content = content.replace(ieMapRegex, newIeMap);
    console.log("ie.map replaced!");
} else {
    console.log("ie.map not replaced!");
}

// 3. Update the description texts
content = content.replace('De tus licitaciones registradas, estas coinciden con tus alertas.', 'De las licitaciones vigentes descargadas desde Mercado Público, estas coinciden con tus alertas automáticas.');
content = content.replace('Ninguna licitación registrada coincide aún.', 'Ninguna licitación descargada coincide aún.');
content = content.replace('Agrega licitaciones desde "Nueva Licitación".', 'Haz clic en "Sincronizar Licitaciones" en el panel principal para descargar las más recientes.');

fs.writeFileSync('src/assets/index.js', content, 'utf8');

