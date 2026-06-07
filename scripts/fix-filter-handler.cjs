var fs = require('fs');
var src = fs.readFileSync('./src/map.ts', 'utf8');

// Replace the old filter handler (using CSS classes) with dynamic filter values
var oldHandler = "var mc=document.getElementById(\"map\")!;function uf(){[\"sepia\",\"saturate\",\"contrast\",\"brightness\"].forEach(function(k){var cb=document.getElementById(\"af-\"+k)as HTMLInputElement;mc.classList.toggle(\"af-\"+k,cb?cb.checked:false);});var p=document.getElementById(\"yj-parchment\");var v=document.getElementById(\"yj-vignette\");var cp=document.getElementById(\"af-parch\")as HTMLInputElement;var cv=document.getElementById(\"af-vign\")as HTMLInputElement;if(p)p.classList.toggle(\"af-on\",cp?cp.checked:false);if(v)v.classList.toggle(\"af-on\",cv?cv.checked:false);}[\"sepia\",\"saturate\",\"contrast\",\"brightness\",\"parch\",\"vign\"].forEach(function(k){var cb=document.getElementById(\"af-\"+k);if(cb)cb.addEventListener(\"change\",uf);});uf();";

var newHandler = 'var tp=document.querySelector("#map .leaflet-tile-pane")as HTMLElement;function uf(){var f=[];var sepia=document.getElementById("af-sepia")as HTMLInputElement;var sat=document.getElementById("af-saturate")as HTMLInputElement;var con=document.getElementById("af-contrast")as HTMLInputElement;var bri=document.getElementById("af-brightness")as HTMLInputElement;if(sepia&&sepia.checked)f.push("sepia(60%)");if(sat&&sat.checked)f.push("saturate(70%)");if(con&&con.checked)f.push("contrast(90%)");if(bri&&bri.checked)f.push("brightness(105%)");if(tp)tp.style.filter=f.join(" ");var p=document.getElementById("yj-parchment");var v=document.getElementById("yj-vignette");var cp=document.getElementById("af-parch")as HTMLInputElement;var cv=document.getElementById("af-vign")as HTMLInputElement;if(p)p.classList.toggle("af-on",cp?cp.checked:false);if(v)v.classList.toggle("af-on",cv?cv.checked:false);}["sepia","saturate","contrast","brightness","parch","vign"].forEach(function(k){var cb=document.getElementById("af-"+k);if(cb)cb.addEventListener("change",uf);});uf();';

src = src.replace(oldHandler, newHandler);
fs.writeFileSync('./src/map.ts', src, 'utf8');
console.log('Filter handler updated to dynamic values');
