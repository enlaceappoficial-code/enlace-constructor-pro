const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'var x=u(d({},h),{onboardingDone:!0});i(x),j(x),o("Ô£à Configuraci├│n guardada"),s&&s(!1)};return e.jsxs("div",{style:{maxWidth:680,margin:"0 auto",padding:"0 0 40px"},children:[';

const to =
  'var te=(()=>{const W=h.moItems||[],T=parseFloat(h.moFacturacionPromedio)||0,L=W.reduce((E,M)=>(parseFloat(M.jornal)||0)*22+E,0);return T>0?Math.round(L/T*100*10)/10:h.pctMO||35})(),fe=(()=>{const W=h.ggItems||[],T=parseFloat(h.ggFacturacionPromedio)||0,L=W.reduce((E,M)=>{const q={mensual:1,anual:.08333333333333333,por_obra:1};return E+(parseFloat(M.monto)||0)*(q[M.periodo]||1)},0);return T>0?Math.round(L/T*100*10)/10:h.pctGG||20})(),ve=(()=>{const T=(h.utilItems||[]).reduce((L,E)=>L+(parseFloat(E.pct)||0),0);return T>0?Math.round(T*10)/10:h.pctUtil||15})();var x=u(d({},h),{onboardingDone:!0,pctMO:te,pctGG:fe,pctUtil:ve});i(x),j(x),b&&b(W=>(W||[]).map(T=>T&&T.pctSource==="apu"?T:u(d({},T),{pctMO:te,pctGG:fe,pctUtilidad:ve,pctSource:T.pctSource||"cfg"}))),o("Ô£à Configuraci├│n guardada"),s&&s(!1)};return e.jsxs("div",{style:{maxWidth:680,margin:"0 auto",padding:"0 0 40px"},children:[';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");
