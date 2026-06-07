var fs = require('fs');
var src = fs.readFileSync('./src/main.ts', 'utf8');
var idx = src.lastIndexOf('setupKeySection()');
if (idx === -1) { console.log('not found'); process.exit(1); }
var after = ';\n(function() {\n  var p = document.createElement("div"); p.id = "yj-parchment"; document.body.appendChild(p);\n  var v = document.createElement("div"); v.id = "yj-vignette"; document.body.appendChild(v);\n})();\n';
src = src.substring(0, idx + 18) + after + src.substring(idx + 18);
fs.writeFileSync('./src/main.ts', src, 'utf8');
console.log('Done');
