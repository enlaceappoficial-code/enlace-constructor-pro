const fs = require('fs');
const path = require('path');

function searchDir(dir, term) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchDir(fullPath, term);
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(term)) {
                console.log(Found in: );
            }
        }
    }
}

searchDir('src', 'Pintura muros');
