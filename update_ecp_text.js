const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

let replacements = 0;

c = c.replace(
  'h2",{style:{fontSize:36,fontWeight:900,marginBottom:16, lineHeight:1.2},children:"¡El Estado puede ser tu próximo gran cliente!"}',
  'h2",{style:{fontSize:36,fontWeight:900,marginBottom:16, lineHeight:1.2},children:"¡Con ECP, el Estado es tu próximo gran cliente!"}'
);
c = c.replace(
  'p",{style:{fontSize:18,opacity:0.9,lineHeight:1.6},children:"Mercado Público mueve millones cada año. Descubre cómo multiplicar tus ingresos y hacer crecer tu negocio participando en proyectos y obras civiles hoy mismo."}',
  'p",{style:{fontSize:18,opacity:0.9,lineHeight:1.6},children:"Mercado Público mueve millones de dólares cada año. Únete a Enlace Constructor Pro (ECP) y deja que nosotros hagamos el trabajo pesado buscando y analizando las mejores obras para hacer crecer tu negocio."}'
);

c = c.replace(
  'desc: "Únete a las miles de empresas que ya venden al Estado. Inscríbete online para poder participar en cualquier licitación a nivel nacional de forma transparente."',
  'desc: "Inscríbete online y luego deja que ECP se encargue de buscar, filtrar y analizar las mejores oportunidades para ti. ¡Trabajaremos juntos en cada paso!"'
);

c = c.replace(
  'desc: "Una vez dentro del portal, genera tu \'Ticket\' o \'API Key\' desde la sección \'Seguridad\'. Este código es tu pase VIP para que busquemos oportunidades por ti."',
  'desc: "Genera tu \'Ticket\' (API Key) desde la sección de Seguridad en Mercado Público. Esta llave maestra nos permitirá conectarnos para que Enlace Constructor Pro rastree proyectos para ti 24/7."'
);

c = c.replace(
  'title: "3. Conecta el Programa",\n      desc: "Ingresa tu API Key en la Configuración de Enlace Constructor Pro. ¡En segundos, estarás viendo negocios reales y armando presupuestos ganadores!",',
  'title: "3. Conecta con ECP y Despega",\n      desc: "Pega tu llave en la Configuración de Enlace Constructor Pro. ¡Hagamos equipo! En segundos estaremos descubriendo negocios reales y armando presupuestos ganadores para tu empresa.",'
);

fs.writeFileSync('src/assets/index.js', c);
console.log("Updated texts to include more ECP integration and CTA.");
