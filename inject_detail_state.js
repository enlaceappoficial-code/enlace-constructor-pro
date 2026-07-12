const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetState = `var _urg=V(false),urgentOnly=_urg[0],setUrgentOnly=_urg[1];`;

const replaceState = `var _urg=V(false),urgentOnly=_urg[0],setUrgentOnly=_urg[1];
  var _det=V(null),detailView=_det[0],setDetailView=_det[1];
  var _detLd=V(false),detailLoading=_detLd[0],setDetailLoading=_detLd[1];`;

if (c.includes(targetState)) {
    c = c.replace(targetState, replaceState);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Injected detailView state.');
}
