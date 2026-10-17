const fs = require('fs');
const text = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/20a6c604-8932-495e-8ae3-9bc46296be63/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = text.split('\n');
for (const l of lines) {
  if (l.includes('"step_index":1954')) {
    const obj = JSON.parse(l);
    fs.writeFileSync('scratch/step1954_tree.txt', obj.tool_calls[0].args.ReplacementContent || obj.tool_calls[0].args.CodeContent);
    console.log('Saved step 1954 tree to scratch/step1954_tree.txt');
  }
}
