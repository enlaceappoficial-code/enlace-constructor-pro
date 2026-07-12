const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const GgStart = c.indexOf('function Gg(');
if (GgStart === -1) process.exit(1);

const returnStart = c.indexOf('return e.jsxs("div",{style:{maxWidth:680', GgStart);
if (returnStart === -1) process.exit(1);

const formStart = c.indexOf('F==="identidad"', returnStart);
if (formStart === -1) process.exit(1);

const prefix = c.substring(returnStart, formStart);

const newPrefix = 'return e.jsxs("div",{style:{width:"100%",padding:"40px 30px 60px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[' +
  'e.jsx("div", {style:{flex:1,minWidth:220},children: e.jsxs("div", {style:{width:220,position:"sticky",top:40,display:"flex",flexDirection:"column",gap:20},children:[' +
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
  ']})}),' +
  'e.jsxs("div", {style:{width:740,maxWidth:"100%",background:a.card,border:"1px solid "+a.border,borderRadius:16,padding:"32px",boxShadow:"0 4px 24px rgba(0,0,0,0.05)",position:"relative",minHeight:500},children:[' +
    'e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:24,position:"sticky",top:30,background:a.card,paddingBottom:16,zIndex:10,borderBottom:"1px solid "+a.border},children:' +
      'e.jsx("button",{style:u(d({},c.btn("p")),{padding:"10px 24px",fontSize:15,boxShadow:"0 4px 12px rgba(245,160,32,0.3)"}),onClick:v,children:"💾 Guardar Cambios"})' +
    '}),';

c = c.substring(0, returnStart) + newPrefix + c.substring(formStart);

const targetEnd = 'children:"        💾 Guardar Configuración"})]})}var _p=';
const replaceEnd = 'children:"        💾 Guardar Configuración"})]}),e.jsx("div",{style:{flex:1,minWidth:220}})]})}var _p=';

if (c.includes(targetEnd)) {
    c = c.replace(targetEnd, replaceEnd);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Success! Fix applied perfectly.");
} else {
    console.log("Could not find targetEnd. Here is what is near the end of Gg:");
    const endGg = c.indexOf('var _p=');
    console.log(c.substring(Math.max(0, endGg - 100), endGg + 50));
}
