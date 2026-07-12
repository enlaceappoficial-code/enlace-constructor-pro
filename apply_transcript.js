const fs = require('fs');

function unescapeString(str) {
    try {
        return JSON.parse('"' + str + '"');
    } catch(e) {
        return str.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
    }
}

function applyTranscript() {
    const transcriptText = fs.readFileSync('transcript_iva_mo.txt', 'utf8');
    const indexJsPath = 'src/assets/index.js';
    let code = fs.readFileSync(indexJsPath, 'utf8');
    
    // Split by "Step" to get blocks
    const blocks = transcriptText.split(/Step \d+:/);
    
    let appliedCount = 0;
    
    for (let block of blocks) {
        if (!block.trim()) continue;
        if (block.includes('Remove the rogue brackets')) break; // Stop at Step 3952
        
        let targetRegex = /"TargetContent":"(.*?)"(?=,"|$)/g;
        let replacementRegex = /"ReplacementContent":"(.*?)"(?=,"|\}$|\]\}|\]\.|\}\])/g;
        
        let targets = [];
        let match;
        while ((match = targetRegex.exec(block)) !== null) {
            targets.push(unescapeString(match[1]));
        }
        
        let replacements = [];
        while ((match = replacementRegex.exec(block)) !== null) {
            replacements.push(unescapeString(match[1]));
        }
        
        for (let i = 0; i < targets.length; i++) {
            let target = targets[i];
            let replacement = replacements[i] || '';
            
            if (code.includes(target)) {
                code = code.replace(target, replacement);
                console.log('Successfully replaced a chunk!');
                appliedCount++;
            } else if (code.includes(replacement)) {
                console.log('Chunk already applied!');
                appliedCount++;
            } else {
                console.log('Could not find chunk target in index.js');
                // try to see if part of the target exists
                let targetStart = target.substring(0, 30);
                if (code.includes(targetStart)) {
                    console.log('Found start of target. Might be a partial match.');
                }
            }
        }
    }
    
    console.log(`Applied ${appliedCount} chunks.`);
    if (appliedCount > 0) {
        fs.writeFileSync(indexJsPath, code);
    }
}

applyTranscript();
