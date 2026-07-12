const fs = require('fs');
const transcript = fs.readFileSync('C:\\Users\\johnn\\.gemini\\antigravity\\brain\\f9d4baa9-6a51-47fa-90f8-27a15d95811b\\.system_generated\\logs\\transcript.jsonl', 'utf8');

const lines = transcript.split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('var LicitacionesDashboard = function')) {
        let obj = JSON.parse(lines[i]);
        if (obj.tool_calls) {
            for (let tc of obj.tool_calls) {
                if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                    const argStr = JSON.stringify(tc.args);
                    if (argStr.includes('var LicitacionesDashboard = function') && !argStr.includes('find_dashboard.js') && !argStr.includes('transcript.jsonl')) {
                        fs.writeFileSync('src/assets/original_dashboard.json', JSON.stringify(tc.args, null, 2), 'utf8');
                        console.log("Found original injection! Saved to src/assets/original_dashboard.json");
                        return;
                    }
                }
            }
        }
    }
}
console.log("Not found.");
