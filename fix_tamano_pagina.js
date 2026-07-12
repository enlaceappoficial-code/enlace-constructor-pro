const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

if (c.includes('tamano_pagina=100')) {
    c = c.replace('tamano_pagina=100', 'tamano_pagina=50');
    console.log('Fixed tamano_pagina to 50');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
