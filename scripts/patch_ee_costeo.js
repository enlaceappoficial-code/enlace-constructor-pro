const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'Ee=(t,i,r,n)=>{t=Array.isArray(t)?t:[];var l=Math.round(t.reduce((h,j)=>h+(parseFloat(j.cant)||0)*(parseFloat(j.precio)||0),0)),o=i&&i.moneda?i.moneda.impuesto/100:i&&i.iva||.19,s=l*o,m=l+s,p=r?m*(i&&i.descuento||0):0,C=m-p';

const to =
  'Ee=(t,i,r,n)=>{t=Array.isArray(t)?t:[];var te=0,fe=0,ve=0;t.forEach(j=>{var G=parseFloat(j.cant)||0,ie=parseFloat(j.precio)||0,oe=j._tipoCosto||(j._cid?"auto":"mo"),ce=0,de=0,pe=parseFloat(j._apuMatUnit)||0;if(pe>0){ce=pe,de=Math.max(0,ie-pe)}else if(oe==="mat"){ce=ie,de=0}else if(oe==="mo"){ce=0,de=ie}else{ce=0,de=ie}if(oe==="mat")de=0;else if(oe==="mo")ce=0;te+=ce*G,fe+=de*G,ve+=(ce+de)*G});var l=(n==="mo"?Math.round(fe):Math.round(ve)),o=i&&i.moneda?i.moneda.impuesto/100:i&&i.iva||.19,s=l*o,m=l+s,p=r?m*(i&&i.descuento||0):0,C=m-p';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);
if (s === before) process.exit(3);

const fromReturn = 'b=Math.round(C*(i&&i.anticipo||.6));return{sub:l,iva:s,total:C,anticipo:b,desc:p}}';
const toReturn = 'b=Math.round(C*(i&&i.anticipo||.6));return{sub:l,iva:s,total:C,anticipo:b,desc:p,mat:Math.round(te),noMat:Math.round(fe)}}';

if (!s.includes(fromReturn)) process.exit(4);
s = s.split(fromReturn).join(toReturn);

fs.writeFileSync(filePath, s, "utf8");

