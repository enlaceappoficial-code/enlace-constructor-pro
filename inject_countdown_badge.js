const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetCountdown = `    var color=dd<3?"#f87171":dd<7?"#fbbf24":"#34d399";
    return{txt:dd+"d "+hh+"h",color:color,days:dd};`;

const replacementCountdown = `    var color=dd<3?"#f87171":dd<7?"#fbbf24":"#34d399";
    var badge=dd===0?"🔥 ¡Cierra Hoy!":(dd===1?"⏳ Cierra Mañana":null);
    return{txt:dd+"d "+hh+"h",color:color,days:dd,badge:badge};`;

if (c.includes(targetCountdown)) {
    c = c.replace(targetCountdown, replacementCountdown);
    console.log('Injected countdown badge.');
} else {
    console.log('Countdown target not found');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
