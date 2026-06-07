var fs = require('fs');
var src = fs.readFileSync('./src/map.ts', 'utf8');

// Replace sepia with hue-rotate approach
src = src.replace('fs.push("sepia(60%)");', 'fs.push("hue-rotate(25deg) saturate(55%)");');
src = src.replace('仿古染色</label>', '仿古染色 (色相偏移)</label>');

fs.writeFileSync('./src/map.ts', src, 'utf8');
console.log('Switched to hue-rotate');
