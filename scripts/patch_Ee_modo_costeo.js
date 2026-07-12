const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'Ee=(t,i,r,n)=>{t=Array.isArray(t)?t:[];var l=Math.round(t.reduce((h,j)=>h+(parseFloat(j.cant)||0)*(parseFloat(j.precio)||0),0)),o=i&&i.moneda?i.moneda.impuesto/100:i&&i.iva||.19,s=l*o,m=l+s,p=r?m*(i&&i.descuento||0):0,C=m-p,b=C*(i&&i.anticipo||.6);return{sub:l,iva:s,bruto:m,desc:p,total:C,anticipo:b}},';

const to =
  'Ee=(t,i,r,n)=>{t=Array.isArray(t)?t:[];var l0=0,matS=0,noMatS=0;t.forEach(h=>{var cant=parseFloat(h.cant)||0,precio=parseFloat(h.precio)||0,tot=cant*precio,tipo=h._tipoCosto||(h._cid?"auto":"mo"),mat=0,noMat=0;if(tipo==="mat")mat=tot;else if(tipo==="mo")noMat=tot;else{var mu=parseFloat(h._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*cant)),noMat=Math.max(0,tot-mat)}matS+=mat,noMatS+=noMat,l0+=tot});var l=n==="mo"?Math.round(noMatS):Math.round(l0),o=i&&i.moneda?i.moneda.impuesto/100:i&&i.iva||.19,s=l*o,m=l+s,p=r?m*(i&&i.descuento||0):0,C=m-p,b=C*(i&&i.anticipo||.6);return{sub:l,iva:s,bruto:m,desc:p,total:C,anticipo:b,matSub:Math.round(matS),noMatSub:Math.round(noMatS)}},';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");

