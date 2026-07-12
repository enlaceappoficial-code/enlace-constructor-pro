const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const re =
  /var x=u\(d\(\{\},h\),\{onboardingDone:!0\}\);i\(x\),j\(x\),o\([\s\S]*?\),s&&s\(!1\)\}/;

if (!re.test(s)) process.exit(2);

const replacement =
  'var _ecpPctMO=(()=>{const W=h.moItems||[],T=parseFloat(h.moFacturacionPromedio)||0,L=W.reduce((E,M)=>(parseFloat(M.jornal)||0)*22+E,0);return T>0?Math.round(L/T*100*10)/10:h.pctMO||35})(),_ecpPctGG=(()=>{const W=h.ggItems||[],T=parseFloat(h.ggFacturacionPromedio)||0,L=W.reduce((E,M)=>{const q={mensual:1,anual:.08333333333333333,por_obra:1};return E+(parseFloat(M.monto)||0)*(q[M.periodo]||1)},0);return T>0?Math.round(L/T*100*10)/10:h.pctGG||20})(),_ecpPctUtil=(()=>{const T=(h.utilItems||[]).reduce((L,E)=>L+(parseFloat(E.pct)||0),0);return T>0?Math.round(T*10)/10:h.pctUtil||15})();var x=u(d({},h),{onboardingDone:!0,pctMO:_ecpPctMO,pctGG:_ecpPctGG,pctUtil:_ecpPctUtil});i(x),j(x),b&&b(W=>(W||[]).map(T=>T&&(T.pctSource||"cfg")==="apu"?T:u(d({},T),{pctMO:_ecpPctMO,pctGG:_ecpPctGG,pctUtilidad:_ecpPctUtil,pctSource:T.pctSource||"cfg"}))),o("Ô£à Configuraci├│n guardada"),s&&s(!1)}';

s = s.replace(re, replacement);

if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");

