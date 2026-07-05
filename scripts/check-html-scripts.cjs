const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);

for (let i = 0; i < scripts.length; i += 1) {
  if (!scripts[i].trim()) continue;
  // Parse only. Browser globals are not executed here.
  new Function(scripts[i]);
  console.log(`script ${i + 1}: OK`);
}

console.log('index checked');
