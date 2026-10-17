import fs from 'fs';
import path from 'path';

function findStringsInDir(dir, extFilter = ['.jsx', '.js', '.html']) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === 'dist' || f === '.git' || f === 'scratch') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(findStringsInDir(full, extFilter));
    } else if (extFilter.some(ext => f.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = findStringsInDir('.', ['.jsx', '.js', '.html']);
const assetRegex = /['"](\/[a-zA-Z0-9_\-\.\/]+\.(png|jpg|jpeg|svg|webp|gif|pdf|json|ico))['"]/g;

const foundAssets = new Set();
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    foundAssets.add(match[1]);
  }
}

console.log('Total asset paths found in code:', foundAssets.size);
const missing = [];
for (const asset of foundAssets) {
  const localPath = path.join('public', asset.slice(1));
  if (!fs.existsSync(localPath)) {
    missing.push({ asset, localPath });
  }
}

console.log('Missing assets (potential 404s):', missing);
