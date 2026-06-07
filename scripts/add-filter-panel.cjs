var fs = require('fs');
var src = fs.readFileSync('./src/map.ts', 'utf8');

// 1. Add filter section to panel HTML
var panelMarker = "value=\"imagery\"/><span>影像图</span></label></div>";
var panelSection = '<div class="panel-section"><div class="section-title">古风滤镜</div>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-sepia" checked/> 仿古染色</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-saturate" checked/> 降饱和度</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-contrast" checked/> 柔化对比</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-brightness" checked/> 微提亮度</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-parch" checked/> 羊皮纸纹理</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-vign" checked/> 边缘暗角</label>' +
  '</div>';
src = src.replace(panelMarker, panelMarker + panelSection);

// 2. Add filter handler code inside createPanel, AFTER the keydown listener
var keydownHandler = "document.addEventListener('keydown',function(e){if(e.key==='Escape'){exD();exDe();deselect()}});";
var filterCode = '' +
  'var mc=document.getElementById("map")!;' +
  'function uf(){' +
  '  ["sepia","saturate","contrast","brightness"].forEach(function(k){' +
  '    var cb=document.getElementById("af-"+k)as HTMLInputElement;' +
  '    mc.classList.toggle("af-"+k,cb?cb.checked:false);' +
  '  });' +
  '  var p=document.getElementById("yj-parchment");' +
  '  var v=document.getElementById("yj-vignette");' +
  '  var cp=document.getElementById("af-parch")as HTMLInputElement;' +
  '  var cv=document.getElementById("af-vign")as HTMLInputElement;' +
  '  if(p)p.classList.toggle("af-on",cp?cp.checked:false);' +
  '  if(v)v.classList.toggle("af-on",cv?cv.checked:false);' +
  '}' +
  '["sepia","saturate","contrast","brightness","parch","vign"].forEach(function(k){' +
  '  var cb=document.getElementById("af-"+k);' +
  '  if(cb)cb.addEventListener("change",uf);' +
  '});' +
  'uf();';

src = src.replace(keydownHandler, keydownHandler + filterCode);

fs.writeFileSync('./src/map.ts', src, 'utf8');
console.log('Done');
