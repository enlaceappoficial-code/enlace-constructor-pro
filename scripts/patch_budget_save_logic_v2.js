const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'ie=Fp(B,p,l,s),oe=H=>{if(k&&!k._isDuplicate){var ae=B.find(Me=>Me.id===k.id),N=[];if(ae){var de=Ee(ae.items,l,ae.descuento,ae.modoCosteo).total,me=Ee(H.items,l,H.descuento,H.modoCosteo).total;';

const to =
  'ie=Fp(B,p,l,s),oe=H=>{H=u(d({},H),{items:(H.items||[]).map(Me=>{if(Me&&Me._cid&&(Me._apuMatUnit==null||parseFloat(Me._apuMatUnit)===0)){var Ht=g&&g.find(tx=>tx.catalogId===parseInt(Me._cid)&&!tx.esSubcontrato&&tx.materiales&&tx.materiales.length>0);if(Ht){var Yp=li(Ht,j||[]),Xp=Yp&&Yp.precioFinal||0,Jp=Yp&&Yp.matTotal||0,Kp=parseFloat(Me.precio)||0;if(Xp>0&&Kp>0){var Zp=Kp/Xp;Jp*=Zp}return u(d({},Me),{_apuMatUnit:Math.max(0,Jp)})}}return Me})});var ae=B.find(Me=>parseInt(Me.id)===parseInt(k&&k.id));if(ae){var N=[];var de=Ee(ae.items,l,ae.descuento,ae.modoCosteo).total,me=Ee(H.items,l,H.descuento,H.modoCosteo).total;';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");

