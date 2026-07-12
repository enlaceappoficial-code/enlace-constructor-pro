const https = require('https');
const url = 'https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarComprador?ticket=79B6AA40-A970-4164-ADEE-47CF3F378CBA';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(`Total organisms: ${json.listaEmpresas ? json.listaEmpresas.length : 0}`);
      if (json.listaEmpresas && json.listaEmpresas.length > 0) {
        console.log("Sample organisms:");
        console.log(json.listaEmpresas.slice(0, 5));
      }
    } catch (e) {
      console.log("Error parsing JSON:", e.message);
      console.log("Raw output start:", data.substring(0, 500));
    }
  });
});
