const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetState = 'var _orgSel=V(""),organismoSel=_orgSel[0],setOrganismoSel=_orgSel[1];';
const replaceState = `var _orgSel=V(""),organismoSel=_orgSel[0],setOrganismoSel=_orgSel[1];
  var _srt=V("relevance"),sortBy=_srt[0],setSortBy=_srt[1];
  var _urg=V(false),urgentOnly=_urg[0],setUrgentOnly=_urg[1];`;

if (c.includes(targetState)) {
    c = c.replace(targetState, replaceState);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Injected states.');
}
