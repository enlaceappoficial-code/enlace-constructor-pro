const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetCard = `cd&&e.jsx("div",{style:{position:"absolute",top:12,right:14,background:cd.color+"22",color:cd.color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700},children:"\\u23F1 "+cd.txt}),`;

const replacementCard = `cd&&e.jsx("div",{style:{position:"absolute",top:12,right:14,background:cd.color+"22",color:cd.color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700},children:"\\u23F1 "+cd.txt}),
        cd&&cd.badge&&e.jsx("div",{style:{position:"absolute",top:36,right:14,background:cd.color,color:"#fff",padding:"3px 8px",borderRadius:12,fontSize:10,fontWeight:800,boxShadow:"0 2px 4px rgba(0,0,0,0.15)",zIndex:1},children:cd.badge}),`;

if (c.includes(targetCard)) {
    c = c.replace(targetCard, replacementCard);
    console.log('Injected card badge.');
} else {
    console.log('Card target not found');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
