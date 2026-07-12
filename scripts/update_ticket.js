const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const oldStr = 'if(!cfg.mpTicket) {\n            setError("Falta configurar el Ticket API de Mercado Público en Ajustes.");\n            setLoading(false);\n            return;\n        }\n        fetch("https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo="+idMP+"&ticket="+cfg.mpTicket)';

const newStr = 'const tk = cfg.apiKeyMP || "79B6AA40-A970-4164-ADEE-47CF3F378CBA";\n        if(!tk) {\n            setError("Falta configurar el Ticket API de Mercado Público en Ajustes.");\n            setLoading(false);\n            return;\n        }\n        fetch("https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo="+idMP+"&ticket="+tk)';

content = content.replace(oldStr, newStr);

const oldDep = '[idMP, cfg.mpTicket]';
const newDep = '[idMP, cfg.apiKeyMP]';
content = content.replace(oldDep, newDep);

fs.writeFileSync('src/assets/index.js', content, 'utf8');
console.log("ContextoMPModal ticket logic updated.");
