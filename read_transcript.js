const fs = require('fs');
const lines = fs.readFileSync('C:/Users/johnn/.gemini/antigravity/brain/f9d4baa9-6a51-47fa-90f8-27a15d95811b/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
let out = '';
lines.forEach(l => {
  if(l.includes('multi_replace_file_content') || l.includes('replace_file_content')) {
    try {
      const j = JSON.parse(l);
      if(j.tool_calls) {
        j.tool_calls.forEach(tc => {
          if (tc.name === 'multi_replace_file_content' || tc.name === 'replace_file_content') {
             const inst = tc.args.Instruction || '';
             if (inst.toLowerCase().includes('iva') || inst.toLowerCase().includes('mo') || inst.toLowerCase().includes('unitario')) {
                 out += 'Step ' + j.step_index + ':\n';
                 out += 'Instruction: ' + inst + '\n';
                 if (tc.args.ReplacementChunks) {
                    out += 'Content: ' + tc.args.ReplacementChunks.substring(0, 1000) + '...\n\n';
                 } else if (tc.args.ReplacementContent) {
                    out += 'Content: ' + tc.args.ReplacementContent.substring(0, 1000) + '...\n\n';
                 }
             }
          }
        });
      }
    } catch(e) {}
  }
});
fs.writeFileSync('transcript_iva_mo.txt', out);
