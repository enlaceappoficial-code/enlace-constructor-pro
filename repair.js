const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

// The fixed part of the file
const fixedEndStr = 'setPage("edit");},children:"⚡ Presupuestar Directamente"})]})';
const fixedEndIndex = content.indexOf(fixedEndStr) + fixedEndStr.length;
const fixedPart = content.substring(0, fixedEndIndex);

// The tail part from the original duplicated file
const tailStartStr = 'setPage("edit");},children:"📋 Crear Presupuesto"})]})';
const tailStartIndex = content.lastIndexOf(tailStartStr) + tailStartStr.length;

if (fixedEndIndex > fixedEndStr.length && tailStartIndex > tailStartStr.length) {
    const tailPart = content.substring(tailStartIndex);
    const repairedContent = fixedPart + tailPart;
    fs.writeFileSync('src/assets/index.js', repairedContent, 'utf8');
    console.log("File repaired! New size:", repairedContent.length);
} else {
    console.log("Could not find the parts.");
}
