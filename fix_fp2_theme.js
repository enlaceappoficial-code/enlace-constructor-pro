const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetCall = 'e.jsx(Fp2,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q,setPage:f})';
const replaceCall = 'e.jsx(Fp2,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q,setPage:f,th:a,sty:c})';

const targetFp2 = `  var accent = props.cfg && props.cfg.accentColor || "#f5a020";
  var th = {
    bg:"#050a10", card:"rgba(255,255,255,.05)", sb:"rgba(0,0,0,.2)", text:"#fff",
    muted:"#8892a4", border:"rgba(255,255,255,.1)", accent:accent, surface:"rgba(255,255,255,.03)"
  };
  var sty = {
    inp:{background:"rgba(0,0,0,.3)",border:"1px solid "+th.border,color:th.text,padding:"10px 14px",borderRadius:8,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",fontSize:13},
    btn:function(t){return{background:t==="p"?th.accent:th.sb,color:t==="p"?"#000":th.text,border:t==="p"?"none":"1px solid "+th.border,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}},
    card:{background:th.card,border:"1px solid "+th.border,borderRadius:12,padding:"18px 22px",marginBottom:12}
  };`;

const replaceFp2 = `  var accent = props.cfg && props.cfg.accentColor || "#f5a020";
  var th = props.th;
  var sty = props.sty;`;

let modified = false;

if (c.includes(targetCall)) {
    c = c.replace(targetCall, replaceCall);
    modified = true;
    console.log("Updated Fp2 call");
} else {
    console.log("Could not find Fp2 call");
}

if (c.includes(targetFp2)) {
    c = c.replace(targetFp2, replaceFp2);
    modified = true;
    console.log("Updated Fp2 body");
} else {
    console.log("Could not find Fp2 body");
}

if (modified) {
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Saved index.js");
}
