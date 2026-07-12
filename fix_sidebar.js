const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

// The sidebar target string
const sbTarget = '{k:"licitaciones",ic:"⚖️",l:"Licitaciones",locked:!ye("licitaciones")}';
const sbReplacement = '{k:"licitaciones",ic:"⚖️",l:"Licitaciones",locked:!ye("licitaciones")},{k:"compra_agil",ic:"🛒",l:"Compra Ágil",locked:!ye("licitaciones")}';

if (content.includes(sbTarget) && !content.includes('k:"compra_agil"')) {
    content = content.replace(sbTarget, sbReplacement);
    fs.writeFileSync('src/assets/index.js', content, 'utf8');
    console.log("Injected Compra Ágil into the sidebar array!");
} else {
    console.log("Could not find the target or it's already injected.");
}
