const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const target1 = 'e.jsxs("div",{style:{maxWidth:1100,margin:"0 auto",padding:"30px 40px 60px",display:"flex",gap:40,alignItems:"flex-start"}';
const replace1 = 'e.jsxs("div",{style:{margin:"0 auto",padding:"40px 20px 60px",display:"flex",justifyContent:"center",gap:40,alignItems:"flex-start"}';

const target2 = 'e.jsxs("div", {style:{width:240,position:"sticky",top:30,display:"flex",flexDirection:"column",gap:24}';
const replace2 = 'e.jsxs("div", {style:{width:220,position:"sticky",top:40,display:"flex",flexDirection:"column",gap:20}';

const target3 = 'e.jsxs("div", {style:{flex:1,background:a.card,border:"1px solid "+a.border,borderRadius:16,padding:"32px",boxShadow:"0 4px 24px rgba(0,0,0,0.05)",position:"relative",minHeight:500}';
const replace3 = 'e.jsxs("div", {style:{width:680,background:a.card,border:"1px solid "+a.border,borderRadius:16,padding:"32px",boxShadow:"0 4px 24px rgba(0,0,0,0.05)",position:"relative",minHeight:500}';

let modified = false;

if (c.includes(target1)) {
    c = c.replace(target1, replace1);
    modified = true;
    console.log("Updated container style");
}

if (c.includes(target2)) {
    c = c.replace(target2, replace2);
    modified = true;
    console.log("Updated sidebar style");
}

if (c.includes(target3)) {
    c = c.replace(target3, replace3);
    modified = true;
    console.log("Updated main panel style");
}

if (modified) {
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Saved index.js");
} else {
    console.log("No changes made. Could not find targets.");
}
