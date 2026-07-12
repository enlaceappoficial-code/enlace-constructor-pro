const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const target1 = 'e.jsxs("div",{style:{margin:"0 auto",padding:"40px 20px 60px",display:"flex",justifyContent:"center",gap:40,alignItems:"flex-start"}';
const replace1 = 'e.jsxs("div",{style:{width:"100%",padding:"40px 30px 60px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}';

const target2 = 'e.jsxs("div", {style:{width:220,position:"sticky",top:40,display:"flex",flexDirection:"column",gap:20}';
const replace2 = 'e.jsx("div", {style:{flex:1,minWidth:220},children: e.jsxs("div", {style:{width:220,position:"sticky",top:40,display:"flex",flexDirection:"column",gap:20}';

const target3 = 'e.jsxs("div", {style:{width:680,background:a.card,border:"1px solid "+a.border,borderRadius:16,padding:"32px",boxShadow:"0 4px 24px rgba(0,0,0,0.05)",position:"relative",minHeight:500}';
const replace3 = 'e.jsxs("div", {style:{width:740,maxWidth:"100%",background:a.card,border:"1px solid "+a.border,borderRadius:16,padding:"32px",boxShadow:"0 4px 24px rgba(0,0,0,0.05)",position:"relative",minHeight:500}';

let modified = false;

if (c.includes(target1) && c.includes(target2) && c.includes(target3)) {
    c = c.replace(target1, replace1);
    c = c.replace(target2, replace2);
    c = c.replace(target3, ']})}),' + replace3); // close the flex:1 wrapper for the sidebar BEFORE the form panel
    
    // Now add the right spacer at the very end of the children array of the main container.
    // The main container ends with `]}` inside the `Gg` return statement.
    const GgStart = c.indexOf('function Gg(');
    const nextFunction = c.indexOf('function ', GgStart + 100);
    const endStr = ']})]})}';
    let componentEnd = c.lastIndexOf(endStr, nextFunction);
    
    if (componentEnd !== -1) {
        c = c.substring(0, componentEnd) + ']},e.jsx("div",{style:{flex:1,minWidth:220}})]})}'+ c.substring(componentEnd + endStr.length);
        modified = true;
    }
}

if (modified) {
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Saved index.js successfully.");
} else {
    console.log("Failed to find targets.");
}
