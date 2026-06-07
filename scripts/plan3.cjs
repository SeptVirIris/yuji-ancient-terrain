var fs = require('fs');
var src = fs.readFileSync('./src/map.ts', 'utf8');
// Gemini plan 3
src = src.replace('fs.push("grayscale(0.3) hue-rotate(30deg) saturate(0.6) contrast(1.2)");', 'fs.push("grayscale(1) sepia(0.5) hue-rotate(-10deg) contrast(1.4)");');
src = src.replace(/仿古染色.*?<\/label>/, '仿古染色 (Gemini方案三)</label>');
fs.writeFileSync('./src/map.ts', src, 'utf8');
console.log('Gemini plan 3 applied');
