const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetOrgs = `  var orgsFiltrados = (function() {`;
const replaceOrgs = `  var categorizeOrgs = function(orgs) {
    var cats = {
      "Municipalidades": [],
      "Salud": [],
      "Educación": [],
      "Fuerzas Armadas y Orden": [],
      "Ministerios y Servicios": [],
      "Otros": []
    };
    orgs.forEach(function(o) {
      var n = (o.NombreEmpresa||"").toUpperCase();
      if(n.indexOf("MUNICIPALIDAD")>-1 || n.indexOf("ILUSTRE")>-1 || n.indexOf("CORPORACION MUNICIPAL")>-1) cats["Municipalidades"].push(o);
      else if(n.indexOf("HOSPITAL")>-1 || n.indexOf("SALUD")>-1 || n.indexOf("CLINICA")>-1 || n.indexOf("CESFAM")>-1) cats["Salud"].push(o);
      else if(n.indexOf("UNIVERSIDAD")>-1 || n.indexOf("COLEGIO")>-1 || n.indexOf("LICEO")>-1 || n.indexOf("ESCUELA")>-1 || n.indexOf("EDUCACION")>-1 || n.indexOf("JUNJI")>-1) cats["Educación"].push(o);
      else if(n.indexOf("EJERCITO")>-1 || n.indexOf("ARMADA")>-1 || n.indexOf("FACH")>-1 || n.indexOf("CARABINEROS")>-1 || n.indexOf("POLICIA")>-1 || n.indexOf("PDI")>-1 || n.indexOf("GENDARMERIA")>-1) cats["Fuerzas Armadas y Orden"].push(o);
      else if(n.indexOf("MINISTERIO")>-1 || n.indexOf("DIRECCION")>-1 || n.indexOf("SERVICIO")>-1 || n.indexOf("SEREMI")>-1 || n.indexOf("SERVIU")>-1 || n.indexOf("GOBIERNO")>-1 || n.indexOf("SUBSECRETARIA")>-1 || n.indexOf("INTENDENCIA")>-1 || n.indexOf("SUPERINTENDENCIA")>-1 || n.indexOf("FISCALIA")>-1 || n.indexOf("PODER JUDICIAL")>-1) cats["Ministerios y Servicios"].push(o);
      else cats["Otros"].push(o);
    });
    return cats;
  };
  var orgsFiltrados = (function() {`;

if (c.includes(targetOrgs)) {
    c = c.replace(targetOrgs, replaceOrgs);
    console.log('Injected categorization function.');
}

const targetUI = `e.jsx("input",{list:"lista-organismos-mp",style:d({},sty.inp),value:organismoSel,onChange:function(ev){setOrganismoSel(ev.target.value)},placeholder:"Todas las entidades...",onKeyDown:function(ev){ev.key==="Enter"&&handleSearch()}}),
          e.jsx("datalist",{id:"lista-organismos-mp",children:orgsFiltrados.map(function(org){return e.jsx("option",{value:org.NombreEmpresa},org.CodigoEmpresa)})})`;

const replaceUI = `e.jsx("select",{style:d({},sty.inp),value:organismoSel,onChange:function(ev){setOrganismoSel(ev.target.value)},children:[
             e.jsx("option",{value:"",children:"Todas las entidades..."})
          ].concat((function(){
             var grouped = categorizeOrgs(orgsFiltrados);
             return Object.keys(grouped).filter(function(k){return grouped[k].length>0}).map(function(k){
                return e.jsx("optgroup",{label:k,children:grouped[k].map(function(org){
                   return e.jsx("option",{value:org.NombreEmpresa,children:org.NombreEmpresa},org.CodigoEmpresa);
                })},k);
             });
          })())})`;

if (c.includes(targetUI)) {
    c = c.replace(targetUI, replaceUI);
    console.log('Replaced datalist with grouped select.');
} else {
    console.error('Could not find datalist UI to replace.');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
