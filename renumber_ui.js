const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

c = c.replace('children:"2. Organismo"', 'children:"3. Organismo"');
c = c.replace('children:(canal==="todos"||canal==="licitaciones")?"3. Palabras clave (Opcional)":"2. Palabras clave (Opcional)"', 'children:(canal==="todos"||canal==="licitaciones")?"4. Palabras clave (Opcional)":"3. Palabras clave (Opcional)"');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
