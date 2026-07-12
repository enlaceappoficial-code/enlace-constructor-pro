const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

const hsStart = c.indexOf('var handleSearch = function () {');
console.log('handleSearch start:', hsStart);

const gridStart = c.indexOf('gridTemplateColumns: "1fr 1fr"', hsStart);
console.log('Grid start:', gridStart);

const hsEnd = c.indexOf('var countdown = function (fecha) {', hsStart);
console.log('handleSearch end:', hsEnd);

const gridEnd = c.indexOf('results.length > 0 &&', gridStart);
console.log('Grid end:', gridEnd);
