const fs = require('fs');

const file = 'src/assets/index.js';
let content = fs.readFileSync(file, 'utf8');

// Replace categories in catalog array (qi) and anywhere else if necessary.
const replacements = {
  '"Eléctrica"': '"Instalaciones Eléctricas"',
  '"Sanitario"': '"Instalaciones Sanitarias"',
  '"Techumbres"': '"Cubiertas y Techumbres"',
  '"Pisos"': '"Pisos y Revestimientos"',
  '"Impermeable"': '"Impermeabilización"',
  '"Ojalaería"': '"Hojalatería"',
  '"Metalcon NC"': '"Metalcon"',
  '"Metalcon Rem."': '"Metalcon"',
  '"Metalcon Mant."': '"Metalcon"',
  '"Madera NC"': '"Madera"',
  '"Madera Mant."': '"Madera"'
};

for (const [oldCat, newCat] of Object.entries(replacements)) {
  // Using global regex to replace all occurrences of cat:"OldName"
  const regex = new RegExp(`cat:${oldCat}`, 'g');
  content = content.replace(regex, `cat:${newCat}`);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Categories consolidated.');
