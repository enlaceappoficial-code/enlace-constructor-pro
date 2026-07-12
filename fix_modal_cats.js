const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldArray = 'b=["Al presentar","Si hay dudas","Si piden rebaja","Al cerrar","Al cobrar","Uso interno"]';
const newArray = 'b=["Al presentar","Si hay dudas","Si piden rebaja","Al cerrar","Al cobrar","Al entregar","Uso interno"]';

if (c.includes(oldArray)) {
  c = c.replace(oldArray, newArray);
  console.log("Fixed b array");
}

const oldEmoji = 'F==="Al cerrar"?"🤝":"💰"," ",F]';
const newEmoji = 'F==="Al cerrar"?"🤝":F==="Al entregar"?"✅":"💰"," ",F]';

if (c.includes(oldEmoji)) {
  c = c.replace(oldEmoji, newEmoji);
  console.log("Fixed emoji rendering");
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
