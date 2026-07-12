const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetState = `var _detLd=V(false),detailLoading=_detLd[0],setDetailLoading=_detLd[1];`;

const replaceState = `var _detLd=V(false),detailLoading=_detLd[0],setDetailLoading=_detLd[1];
  var _dTab=V("resumen"),detailTab=_dTab[0],setDetailTab=_dTab[1];
  var _chk=V({}),checkedSteps=_chk[0],setCheckedSteps=_chk[1];`;

if (c.includes(targetState)) {
    c = c.replace(targetState, replaceState);
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Injected detailTab state.');
}
