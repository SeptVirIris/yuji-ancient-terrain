var fs = require('fs');
var src = fs.readFileSync('./src/map.ts', 'utf8');

var oldStart = 'function uf(){';
var oldEnd = 'setupSearch()';

var idxStart = src.indexOf(oldStart);
var idxEnd = src.indexOf(oldEnd, idxStart);
if (idxStart === -1 || idxEnd === -1) { console.log('Not found'); process.exit(1); }

var newCode = 'function uf(){' +
  'var tp=document.querySelector("#map .leaflet-tile-pane")as HTMLElement;' +
  'var fs=[];' +
  'var s=document.getElementById("af-sepia")as HTMLInputElement;if(s&&s.checked)fs.push("sepia(60%)");' +
  'var sa=document.getElementById("af-saturate")as HTMLInputElement;if(sa&&sa.checked)fs.push("saturate(70%)");' +
  'var c=document.getElementById("af-contrast")as HTMLInputElement;if(c&&c.checked)fs.push("contrast(90%)");' +
  'var b=document.getElementById("af-brightness")as HTMLInputElement;if(b&&b.checked)fs.push("brightness(105%)");' +
  'if(tp)tp.style.filter=fs.join(" ");' +
  'var p=document.getElementById("yj-parchment");' +
  'var v=document.getElementById("yj-vignette");' +
  'var cp=document.getElementById("af-parch")as HTMLInputElement;' +
  'var cv=document.getElementById("af-vign")as HTMLInputElement;' +
  'if(p)p.classList.toggle("af-on",cp?cp.checked:false);' +
  'if(v)v.classList.toggle("af-on",cv?cv.checked:false);' +
  '}' +
  '["sepia","saturate","contrast","brightness","parch","vign"].forEach(function(k){' +
  '  var cb=document.getElementById("af-"+k);' +
  '  if(cb)cb.addEventListener("change",uf);' +
  '});' +
  'uf();';

src = src.substring(0, idxStart) + newCode + src.substring(idxEnd);
fs.writeFileSync('./src/map.ts', src, 'utf8');
console.log('Fixed - listeners and uf() call included');
