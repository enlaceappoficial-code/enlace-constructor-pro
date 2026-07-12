const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetReturn = 'return e.jsxs("div",{style:{padding:"24px 32px",maxWidth:1300,margin:"0 auto"},children:[';

const filterCode = `
  var comunasPorRegion = {
    "Arica y Parinacota": ["arica", "camarones", "putre", "general lagos"],
    "Tarapac\\\\u00E1": ["iquique", "alto hospicio", "pozo almonte", "cami\\\\u00F1a", "colchane", "huara", "pica"],
    "Antofagasta": ["antofagasta", "mejillones", "sierra gorda", "taltal", "calama", "ollag\\\\u00FCe", "san pedro de atacama", "tocopilla", "mar\\\\u00EDa elena"],
    "Atacama": ["copiap\\\\u00F3", "caldera", "tierra amarilla", "cha\\\\u00F1aral", "diego de almagro", "vallenar", "alto del carmen", "freirina", "huasco"],
    "Coquimbo": ["coquimbo", "serena", "andacollo", "la higuera", "paiguano", "paihuano", "vicu\\\\u00F1a", "illapel", "canela", "los vilos", "salamanca", "ovalle", "combarbal\\\\u00E1", "monte patria", "punitaqui", "r\\\\u00EDo hurtado"],
    "Valpara\\\\u00EDso": ["valpara\\\\u00EDso", "casablanca", "conc\\\\u00F3n", "juan fern\\\\u00E1ndez", "puchuncav\\\\u00ED", "quintero", "vi\\\\u00F1a del mar", "isla de pascua", "los andes", "calle larga", "rinconada", "san esteban", "la ligua", "cabildo", "papudo", "petorca", "zapallar", "quillota", "calera", "hijuelas", "la cruz", "nogales", "san antonio", "algarrobo", "cartagena", "el quisco", "el tabo", "santo domingo", "san felipe", "catemu", "llaillay", "panquehue", "putaendo", "santa mar\\\\u00EDa", "quilpu\\\\u00E9", "limache", "olmu\\\\u00E9", "villa alemana"],
    "Metropolitana": ["cerrillos", "cerro navia", "conchal\\\\u00ED", "el bosque", "estaci\\\\u00F3n central", "huechuraba", "independencia", "la cisterna", "la florida", "la granja", "la pintana", "la reina", "las condes", "lo barnechea", "lo espejo", "lo prado", "macul", "maip\\\\u00FA", "\\\\u00F1u\\\\u00F1oa", "pedro aguirre cerda", "pe\\\\u00F1alol\\\\u00E9n", "providencia", "pudahuel", "quilicura", "quinta normal", "recoleta", "renca", "san joaqu\\\\u00EDn", "san miguel", "san ram\\\\u00F3n", "santiago", "vitacura", "puente alto", "pirque", "san jos\\\\u00E9 de maipo", "colina", "lampa", "tiltil", "san bernardo", "buin", "calera de tango", "paine", "melipilla", "alhu\\\\u00E9", "curacav\\\\u00ED", "mar\\\\u00EDa pinto", "san pedro", "talagante", "el monte", "isla de maipo", "padre hurtado", "pe\\\\u00F1aflor"],
    "O'Higgins": ["rancagua", "codegua", "coinco", "coltauco", "do\\\\u00F1ihue", "graneros", "las cabras", "machal\\\\u00ED", "malloa", "mostazal", "olivar", "peumo", "pichidegua", "quinta de tilcoco", "rengo", "requ\\\\u00EDnoa", "san vicente", "pichilemu", "la estrella", "litueche", "marchihue", "navidad", "paredones", "san fernando", "ch\\\\u00E9pica", "chimbarongo", "lolol", "nancagua", "palmilla", "peralillo", "placilla", "pumanque", "santa cruz"],
    "Maule": ["talca", "constituci\\\\u00F3n", "curepto", "empedrado", "maule", "pelarco", "pencahue", "r\\\\u00EDo claro", "san clemente", "san rafael", "cauquenes", "chanco", "pelluhue", "curic\\\\u00F3", "huala\\\\u00F1\\\\u00E9", "licant\\\\u00E9n", "molina", "rauco", "romeral", "sagrada familia", "teno", "vichuqu\\\\u00E9n", "linares", "colb\\\\u00FAn", "longav\\\\u00ED", "parral", "retiro", "san javier", "villa alegre", "yerbas buenas"],
    "\\\\u00D1uble": ["cobquecura", "coelemu", "ninhue", "portezuelo", "quirihue", "r\\\\u00E1nquil", "treguaco", "bulnes", "chill\\\\u00E1n viejo", "chill\\\\u00E1n", "el carmen", "pemuco", "pinto", "quill\\\\u00F3n", "san ignacio", "yungay", "coihueco", "\\\\u00F1iqu\\\\u00E9n", "san carlos", "san fabi\\\\u00E1n", "san nicol\\\\u00E1s"],
    "Biob\\\\u00EDo": ["concepci\\\\u00F3n", "coronel", "chiguayante", "florida", "hualqui", "lota", "penco", "san pedro de la paz", "santa juana", "talcahuano", "tom\\\\u00E9", "hualp\\\\u00E9n", "lebu", "arauco", "ca\\\\u00F1ete", "contulmo", "curanilahue", "los \\\\u00E1lamos", "tir\\\\u00FAa", "los \\\\u00E1ngeles", "antuco", "cabrero", "laja", "mulch\\\\u00E9n", "nacimiento", "negrete", "quilaco", "quilleco", "san rosendo", "santa b\\\\u00E1rbara", "tucapel", "yumbel", "alto biob\\\\u00EDo"],
    "Araucan\\\\u00EDa": ["temuco", "carahue", "cunco", "curarrehue", "freire", "galvarino", "gorbea", "lautaro", "loncoche", "melipeuco", "nueva imperial", "padre las casas", "perquenco", "pitrufqu\\\\u00E9n", "puc\\\\u00F3n", "saavedra", "teodoro schmidt", "tolt\\\\u00E9n", "vilc\\\\u00FAn", "villarrica", "cholchol", "angol", "collipulli", "curacaut\\\\u00EDn", "ercilla", "lonquimay", "los sauces", "lumaco", "pur\\\\u00E9n", "renaico", "traigu\\\\u00E9n", "victoria"],
    "Los R\\\\u00EDos": ["valdivia", "corral", "lanco", "los lagos", "m\\\\u00E1fil", "mariquina", "paillaco", "panguipulli", "la uni\\\\u00F3n", "futrono", "lago ranco", "r\\\\u00EDo bueno"],
    "Los Lagos": ["puerto montt", "calbuco", "cocham\\\\u00F3", "fresia", "frutillar", "los muermos", "llanquihue", "maull\\\\u00EDn", "puerto varas", "castro", "ancud", "chonchi", "curaco de v\\\\u00E9lez", "dalcahue", "puqueld\\\\u00F3n", "queil\\\\u00E9n", "quell\\\\u00F3n", "quemchi", "quinchao", "osorno", "puerto octay", "purranque", "puyehue", "r\\\\u00EDo negro", "san juan de la costa", "san pablo", "chait\\\\u00E9n", "futaleuf\\\\u00FA", "hualaihu\\\\u00E9", "palena"],
    "Ays\\\\u00E9n": ["coihaique", "lago verde", "ays\\\\u00E9n", "cisnes", "guaitecas", "cochrane", "o'higgins", "tortel", "chile chico", "r\\\\u00EDo ib\\\\u00E1\\\\u00F1ez"],
    "Magallanes": ["punta arenas", "laguna blanca", "r\\\\u00EDo verde", "san gregorio", "cabo de hornos", "ant\\\\u00E1rtica", "porvenir", "primavera", "timaukel", "natales", "torres del paine"]
  };

  var orgsFiltrados = (function() {
    if(region === "Todas") return organismosList;
    var regLiteral = region.replace(/\\\\u00ED/g,"í").replace(/\\\\u00E1/g,"á").replace(/\\\\u00E9/g,"é").replace(/\\\\u00F3/g,"ó").replace(/\\\\u00FA/g,"ú").replace(/\\\\u00D1/g,"Ñ");
    var keywords = comunasPorRegion[region] || comunasPorRegion[regLiteral] || [];
    var regLower = region.toLowerCase();
    return organismosList.filter(function(org) {
       var nom = (org.NombreEmpresa||"").toLowerCase();
       if(nom.indexOf(regLower) > -1) return true;
       for(var i=0; i<keywords.length; i++) {
          if(nom.indexOf(keywords[i]) > -1) return true;
       }
       return false;
    });
  })();

  return e.jsxs("div",{style:{padding:"24px 32px",maxWidth:1300,margin:"0 auto"},children:[`;

if (c.includes(targetReturn)) {
   c = c.replace(targetReturn, filterCode);
   console.log('Injected filtering logic.');
} else {
   console.error('Could not find target return block.');
   process.exit(1);
}

const datalistTarget = 'e.jsx("datalist",{id:"lista-organismos-mp",children:organismosList.map(function(org)';
const datalistReplacement = 'e.jsx("datalist",{id:"lista-organismos-mp",children:orgsFiltrados.map(function(org)';

if (c.includes(datalistTarget)) {
   c = c.replace(datalistTarget, datalistReplacement);
   console.log('Injected datalist mapping variable.');
} else {
   console.error('Could not find datalist target.');
   process.exit(1);
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
