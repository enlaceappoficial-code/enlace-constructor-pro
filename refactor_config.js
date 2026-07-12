const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const GgStart = 'function Gg({cfg:t,setCfg:i,allData:r,onRestore:n,onClearAll:l,setToast:o,setConfigDirty:s,materiales:m,setMateriales:p,apus:C,setApus:b})';

if (!c.includes(GgStart)) {
    console.error("Gg component not found");
    process.exit(1);
}

const returnStart = c.indexOf('return e.jsxs("div",{style:{maxWidth:680', c.indexOf(GgStart));
if (returnStart === -1) {
    console.error("Could not find return statement in Gg");
    process.exit(1);
}

// We need to replace up to `F==="identidad"&&`
const contentStart = c.indexOf('F==="identidad"&&e.jsxs', returnStart);
if (contentStart === -1) {
    console.error("Could not find the start of the tabs content");
    process.exit(1);
}

const originalPrefix = c.substring(returnStart, contentStart);

const newPrefix = 'return e.jsxs("div",{style:{maxWidth:1100,margin:"0 auto",padding:"30px 40px 60px",display:"flex",gap:40,alignItems:"flex-start"},children:[' +
  'e.jsxs("div", {style:{width:240,position:"sticky",top:30,display:"flex",flexDirection:"column",gap:24},children:[' +
    'e.jsx("div",{style:{fontSize:22,fontWeight:800,color:a.text},children:"⚙️ Configuración"}),' +
    'e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:' +
      '[{id:"identidad",label:"🎨 Identidad"},{id:"empresa",label:"🏢 Empresa"},{id:"presupuesto",label:"💰 Presupuesto"},{id:"costos",label:"📊 Costos"},{id:"integraciones",label:"🔌 Integraciones"}].map(function(x){ return e.jsx("button",{' +
          'key:x.id,' +
          'onClick:function(){g(x.id)},' +
          'style:{' +
            'padding:"14px 20px",fontSize:14,fontWeight:700,borderRadius:12,cursor:"pointer",textAlign:"left",transition:"all 0.2s",' +
            'background:F===x.id?a.accent:"transparent",' +
            'color:F===x.id?"#000":a.muted,' +
            'border:F===x.id?"none":("1px solid "+a.border),' +
            'boxShadow:F===x.id?"0 4px 12px rgba(245,160,32,0.3)":"none"' +
          '},' +
          'children:x.label' +
        '})})' +
    '})' +
  ']}),' +
  'e.jsxs("div", {style:{flex:1,background:a.card,border:"1px solid "+a.border,borderRadius:16,padding:"32px",boxShadow:"0 4px 24px rgba(0,0,0,0.05)",position:"relative",minHeight:500},children:[' +
    'e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:24,position:"sticky",top:30,background:a.card,paddingBottom:16,zIndex:10,borderBottom:"1px solid "+a.border},children:' +
      'e.jsx("button",{style:u(d({},c.btn("p")),{padding:"10px 24px",fontSize:15,boxShadow:"0 4px 12px rgba(245,160,32,0.3)"}),onClick:v,children:"💾 Guardar Cambios"})' +
    '}),' +
    '';

c = c.substring(0, returnStart) + newPrefix + c.substring(contentStart);

const nextFunction = c.indexOf('function ', contentStart);
let componentEnd = c.lastIndexOf(']})}', nextFunction);
if (componentEnd === -1) componentEnd = c.lastIndexOf(']})', nextFunction);

if (componentEnd !== -1) {
    // We added a wrapper around the content, so we need one more `]}`
    c = c.substring(0, componentEnd) + ']})]})}' + c.substring(componentEnd + 4);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Success");
} else {
    console.log("Could not find end of component");
}
