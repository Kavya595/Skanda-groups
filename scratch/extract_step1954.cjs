const fs = require('fs');
const readline = require('readline');
const stream = fs.createReadStream('C:/Users/Lenovo/.gemini/antigravity/brain/20a6c604-8932-495e-8ae3-9bc46296be63/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

rl.on('line', (line) => {
  if (line.includes('"step_index":1954')) {
    const obj = JSON.parse(line);
    const code = obj.tool_calls[0].args.ReplacementContent || obj.tool_calls[0].args.CodeContent;
    fs.writeFileSync('scratch/step1954_full.js', code);
    console.log('Saved step 1954 to scratch/step1954_full.js');
    process.exit(0);
  }
});
