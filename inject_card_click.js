const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetClick = `return e.jsxs("div",{style:u(d({},sty.card),{position:"relative",transition:"transform .15s,box-shadow .15s"}),children:[`;
const replaceClick = `return e.jsxs("div",{onClick:function(){openDetail(it)},style:u(d({},sty.card),{position:"relative",cursor:"pointer",transition:"transform .15s,box-shadow .15s"}),children:[`;

if (c.includes(targetClick)) {
    c = c.replace(targetClick, replaceClick);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Injected onClick to card.');
} else {
    console.log('Card wrapper not found.');
}
