const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({ 
  input: fs.createReadStream('C:/Users/Lenovo/.gemini/antigravity/brain/20a6c604-8932-495e-8ae3-9bc46296be63/.system_generated/logs/transcript.jsonl') 
});

rl.on('line', (line) => {
  const d = JSON.parse(line);
  if (d.step_index === 3709) {
    const text = d.content;
    const matches = text.match(/https?:\/\/[^\s"'<>]+/g) || [];
    console.log('URLs:', [...new Set(matches)]);
    // check if any keywords like leaflet, mapbox, 3d, canvas exist
    const keywords = ['leaflet', 'mapbox', 'maplibre', 'three', 'cesium', 'google', 'satellite', '2d', '3d', 'pitch', 'tilt'];
    keywords.forEach(k => {
      const idx = text.toLowerCase().indexOf(k);
      if (idx !== -1) {
        console.log(`Keyword '${k}' at ${idx}:`, text.substring(Math.max(0, idx - 40), Math.min(text.length, idx + 100)));
      }
    });
  }
});
