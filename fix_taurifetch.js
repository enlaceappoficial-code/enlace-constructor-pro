const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

if (c.includes('tauriFetch(url, {headers:{"ticket":tk}})')) {
    c = c.replace('tauriFetch(url, {headers:{"ticket":tk}})', 'fetch(url, {headers:{"ticket":tk}})');
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Fixed tauriFetch reference to standard fetch.');
} else {
    console.log('Target string not found.');
}
