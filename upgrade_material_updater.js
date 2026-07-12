const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetU = 'U=()=>{if(b){var T=f!==""&&!isNaN(parseFloat(f))?parseFloat(f):b.ipc,L=T/100,E=S.slice(0,20).map(M=>({id:M.id,nombre:M.nombre,cat:M.cat,unidad:M.unidad,precioActual:M.precio,precioSugerido:Math.round(M.precio*(1+L)),variacion:T,fuente:(f!==""&&!isNaN(parseFloat(f))?"Manual":"INE IPMC")+" "+new Date().toLocaleDateString("es-CL",{month:"long",year:"numeric"}),aprobado:!1}));z(E),E.length===0&&y("✅ Todos tus materiales están actualizados")}}';

const newU = 'U=()=>{if(b){var T=f!==""&&!isNaN(parseFloat(f))?parseFloat(f):b.ipc,L=T/100,E=t.map(M=>({id:M.id,nombre:M.nombre,cat:M.cat,unidad:M.unidad,precioActual:M.precio,precioSugerido:Math.round(M.precio*(1+L)),variacion:T,fuente:(f!==""&&!isNaN(parseFloat(f))?"Manual":"INE IPMC")+" "+new Date().toLocaleDateString("es-CL",{month:"long",year:"numeric"}),aprobado:!1}));z(E),E.length===0&&y("✅ Todos tus materiales están actualizados")}}';

if(c.includes(targetU)) {
    c = c.replace(targetU, newU);
    console.log("Replaced U function to process ALL materials instead of S.slice(0,20).");
} else {
    console.log("Could not find targetU.");
}

const targetUI = 'S.length>0&&e.jsxs("div",{style:{marginTop:12,background:a.sb,borderRadius:10,padding:"12px 14px",border:`1px solid ${a.border}`},children:[e.jsxs("div",{style:{fontSize:13,color:a.text,marginBottom:10},children:["Tienes ",e.jsxs("strong",{style:{color:"#f87171"},children:[S.length," materiales"]})," sin actualizar hace más de 30 días."]}),e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("div",{style:{fontSize:12,color:a.muted},children:"% a aplicar:"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"number",step:"0.1",min:"0",max:"50",value:f,onChange:T=>I(T.target.value),placeholder:(X=b.ipc)==null?void 0:X.toFixed(1),style:u(d({},c.inp),{width:70,padding:"5px 8px",fontSize:13,textAlign:"center",margin:0})}),e.jsx("span",{style:{fontSize:13,color:a.muted},children:"%"}),e.jsx("span",{style:{fontSize:11,color:a.muted},children:f!==""&&!isNaN(parseFloat(f))?e.jsx("span",{style:{color:a.accent},children:"✏️ Manual"}):e.jsxs("span",{children:["IPC: ",e.jsxs("strong",{style:{color:a.accent},children:["+",(W=b.ipc)==null?void 0:W.toFixed(1),"%"]})]})})]}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"7px 16px",fontSize:13}),onClick:U,children:"Generar sugerencias →"}),f!==""&&e.jsx("button",{style:u(d({},c.btn("s")),{padding:"5px 10px",fontSize:11}),onClick:()=>I(""),children:"Usar IPC"})]})]})';

const newUI = 'e.jsxs("div",{style:{marginTop:12,background:a.sb,borderRadius:10,padding:"12px 14px",border:`1px solid ${a.border}`},children:[e.jsxs("div",{style:{fontSize:13,color:a.text,marginBottom:10},children:[e.jsxs("strong",{style:{color:a.accent},children:["Ajuste Masivo de Precios"]})," — Aplica un porcentaje a toda tu base de datos."]}),e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("div",{style:{fontSize:12,color:a.muted},children:"% a aplicar a TODOS los materiales:"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"number",step:"0.1",min:"-99",max:"100",value:f,onChange:T=>I(T.target.value),placeholder:(X=b.ipc)==null?void 0:X.toFixed(1),style:u(d({},c.inp),{width:70,padding:"5px 8px",fontSize:13,textAlign:"center",margin:0})}),e.jsx("span",{style:{fontSize:13,color:a.muted},children:"%"}),e.jsx("span",{style:{fontSize:11,color:a.muted},children:f!==""&&!isNaN(parseFloat(f))?e.jsx("span",{style:{color:a.accent},children:"✏️ Manual"}):e.jsxs("span",{children:["IPC: ",e.jsxs("strong",{style:{color:a.accent},children:["+",(W=b.ipc)==null?void 0:W.toFixed(1),"%"]})]})})]}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"7px 16px",fontSize:13}),onClick:U,children:"Calcular precios masivos →"}),f!==""&&e.jsx("button",{style:u(d({},c.btn("s")),{padding:"5px 10px",fontSize:11}),onClick:()=>I(""),children:"Usar IPC"})]})]})';

if(c.includes(targetUI)) {
    c = c.replace(targetUI, newUI);
    console.log("Replaced UI.");
} else {
    console.log("Could not find targetUI.");
}

fs.writeFileSync('src/assets/index.js', c);
