var fs = require('fs');

// ===== 1. Rebuild sync-cities.json =====
var yuji = JSON.parse(fs.readFileSync('./public/sync-cities.json', 'utf8'));
var geo = JSON.parse(fs.readFileSync('C:/Users/25055/Pictures/临时/中国古代军事地理.geojson', 'utf8'));

var layers = {
  capital: { type: 'FeatureCollection', features: [] },
  city: { type: 'FeatureCollection', features: [] },
  fort: { type: 'FeatureCollection', features: [] },
  harbor: { type: 'FeatureCollection', features: [] },
  battle: { type: 'FeatureCollection', features: [] },
  block: yuji.block,
  waterway: yuji.waterway,
  mountain: yuji.mountain,
  passage: yuji.passage
};

var seen = new Set();
var MARKER_COLORS = { capital: '#C0392B', county: '#2C3E50', chengshi: '#A0522D', guanai: '#8B0000', province: '#1A5276', harbor: '#006666', zhanchang: '#D4AC0D' };
var MARKER_SIZES = { capital: 14, province: 11, county: 9, chengshi: 9, guanai: 9, harbor: 8, zhanchang: 10 };
var mountainNames = new Set(['燕山', '恒山', '武当山', '云中山', '子午岭', '方斗山', '六盘山', '大娄山', '龙首山', '龙门山', '五莲山', '吕梁山', '阴山', '阿尔金山', '系舟山', '太岳山', '龙泉山', '华蓥山', '明月山', '嵩山', '伏牛山', '祁连山', '七老图山', '雪峰山']);
var seenW = new Set(yuji.waterway.features.map(function (f) { return f.properties.name; }));
var seenM = new Set(yuji.mountain.features.map(function (f) { return f.properties.name; }));
var seenP = new Set(yuji.passage.features.map(function (f) { return f.properties.name; }));

function add(layer, name, lng, lat, props) {
  var key = layer + '|' + name;
  if (seen.has(key)) return;
  seen.add(key);
  layers[layer].features.push({ type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: [lng, lat] } });
}

geo.features.forEach(function (f) {
  if (f.geometry.type !== 'Point') return;
  var p = f.properties || {};
  var sym = p['marker-symbol'] || '';
  var title = p.title || '';
  if (!title) return;
  var lng = f.geometry.coordinates[0], lat = f.geometry.coordinates[1];
  var color = p['marker-color'] || MARKER_COLORS[sym] || '#333';
  var size = MARKER_SIZES[sym] || 9;
  var props = { name: title, fontSize: size, fontColor: color, bgOpacity: 100, fontWeight: sym === 'capital' ? 700 : 400 };
  if (sym === 'capital') add('capital', title, lng, lat, props);
  else if (sym === 'county' || sym === 'province') add('city', title, lng, lat, props);
  else if (sym === 'chengshi' || sym === 'guanai') add('fort', title, lng, lat, props);
  else if (sym === 'harbor') add('harbor', title, lng, lat, props);
  else if (sym === 'zhanchang') add('battle', title, lng, lat, props);
});

geo.features.forEach(function (f) {
  if (f.geometry.type !== 'LineString') return;
  var p = f.properties || {};
  var title = p.title || '';
  if (!title) return;
  var stroke = p.stroke || '';
  if (mountainNames.has(title)) {
    if (seenM.has(title)) return; seenM.add(title);
    layers.mountain.features.push({ type: 'Feature', properties: { name: title }, geometry: f.geometry });
  } else if (stroke === '#CCFFFF' || title === '长江' || title === '淮河' || title === '黄河') {
    if (seenW.has(title)) return; seenW.add(title);
    layers.waterway.features.push({ type: 'Feature', properties: { name: title }, geometry: f.geometry });
  } else {
    var isRoad = title.indexOf('关') >= 0 || title.indexOf('道') >= 0 || title.indexOf('陉') >= 0 || title.indexOf('-') >= 0 || title.indexOf('—') >= 0 || stroke === '#808080';
    if (isRoad) {
      if (seenP.has(title)) return; seenP.add(title);
      layers.passage.features.push({ type: 'Feature', properties: { name: title }, geometry: f.geometry });
    }
  }
});

fs.writeFileSync('./public/sync-cities.json', JSON.stringify(layers, null, 2), 'utf8');
console.log('sync-cities: capital=' + layers.capital.features.length + ' city=' + layers.city.features.length +
  ' fort=' + layers.fort.features.length + ' harbor=' + layers.harbor.features.length +
  ' battle=' + layers.battle.features.length + ' waterway=' + layers.waterway.features.length +
  ' mountain=' + layers.mountain.features.length + ' passage=' + layers.passage.features.length);

// ===== 2. Update map.ts =====
var src = fs.readFileSync('./src/map.ts', 'utf8');
src = src.replace("type LayerId = 'block' | 'waterway' | 'mountain' | 'passage' | 'pass' | 'smallcity'",
  "type LayerId = 'capital' | 'city' | 'fort' | 'harbor' | 'battle' | 'block' | 'waterway' | 'mountain' | 'passage'");

var startIdx = src.indexOf('const LAYER_DEFS: LayerDef[] = [');
var endIdx = src.indexOf('const DEFAULT_ON_LAYERS');
var newDefs = 'const LAYER_DEFS: LayerDef[] = [\r\n' +
  '  { id:"capital", label:"都城", type:"point", color:"#C0392B", icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><polygon points="12,2 22,22 2,22" fill="rgba(192,57,43,0.15)" stroke="#C0392B" stroke-width="1.5"/></svg>\' },\r\n' +
  '  { id:"city", label:"府州", type:"point", color:"#2C3E50", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="6" width="18" height="12" rx="1" fill="rgba(44,62,80,0.12)" stroke="#2C3E50" stroke-width="1.5"/></svg>\' },\r\n' +
  '  { id:"fort", label:"关隘", type:"point", color:"#A0522D", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><line x1="7" y1="7" x2="17" y2="17" stroke="#A0522D" stroke-width="3" stroke-linecap="round"/><line x1="17" y1="7" x2="7" y2="17" stroke="#A0522D" stroke-width="3" stroke-linecap="round"/></svg>\' },\r\n' +
  '  { id:"harbor", label:"渡口", type:"point", color:"#006666", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="rgba(0,102,102,0.15)" stroke="#006666" stroke-width="1.5"/></svg>\' },\r\n' +
  '  { id:"battle", label:"战场", type:"point", color:"#D4AC0D", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><rect x="5" y="5" width="14" height="14" fill="rgba(212,172,13,0.15)" stroke="#D4AC0D" stroke-width="1.5" transform="rotate(45,12,12)"/></svg>\' },\r\n' +
  '  { id:"block", label:"区块", type:"polygon", color:"#e74c3c", weight:2, icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 5L12 2L21 5V19L12 22L3 19V5Z" fill="rgba(231,76,60,0.15)" stroke="#e74c3c" stroke-width="1.5" stroke-linejoin="round"/></svg>\' },\r\n' +
  '  { id:"waterway", label:"水路", type:"line", color:"#3498db", weight:3, dash:"8,6", icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M2 18Q8 10 12 14T22 12" fill="none" stroke="#3498db" stroke-width="2" stroke-linecap="round"/><path d="M2 20Q8 12 12 16T22 14" fill="none" stroke="#3498db" stroke-width="1" opacity="0.4" stroke-linecap="round"/></svg>\' },\r\n' +
  '  { id:"mountain", label:"山脉", type:"line", color:"#8e44ad", weight:3, icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M2 20L8 8L12 14L16 6L22 20" fill="none" stroke="#8e44ad" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\' },\r\n' +
  '  { id:"passage", label:"通道", type:"line", color:"#f39c12", weight:2.5, dash:"5,4", icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 6H20M4 12H20M4 18H20" stroke="#f39c12" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="4,3"/></svg>\' }\r\n' +
  ']\r\n';
src = src.substring(0, startIdx) + newDefs + '\r\n' + src.substring(endIdx);
src = src.replace(/const DEFAULT_ON_LAYERS = new Set\(\[.*?\]\)/, "const DEFAULT_ON_LAYERS = new Set(['capital','city','fort'])");

// Add filter panel section
var panelMarker = "value=\"imagery\"/><span>影像图</span></label></div>";
src = src.replace(panelMarker, panelMarker +
  '<div class="panel-section"><div class="section-title">古风滤镜</div>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-sepia" checked/> 仿古染色</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-saturate" checked/> 降饱和度</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-contrast" checked/> 柔化对比</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-brightness" checked/> 微提亮度</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-parch" checked/> 羊皮纸纹理</label>' +
  '<label class="checkbox-row"><input type="checkbox" id="af-vign" checked/> 边缘暗角</label>' +
  '</div>');

// Add filter handler
var keydownHandler = "document.addEventListener('keydown',function(e){if(e.key==='Escape'){exD();exDe();deselect()}});";
src = src.replace(keydownHandler, keydownHandler +
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
  'uf();');

fs.writeFileSync('./src/map.ts', src, 'utf8');
console.log('map.ts updated');

// ===== 3. Update main.ts =====
var mainSrc = fs.readFileSync('./src/main.ts', 'utf8');
mainSrc = "import './filters.css'\n" + mainSrc;
var idx = mainSrc.lastIndexOf('setupKeySection()');
mainSrc = mainSrc.substring(0, idx + 18) +
  ';\n(function(){var p=document.createElement("div");p.id="yj-parchment";document.body.appendChild(p);var v=document.createElement("div");v.id="yj-vignette";document.body.appendChild(v);})();\n' +
  mainSrc.substring(idx + 18);
fs.writeFileSync('./src/main.ts', mainSrc, 'utf8');
console.log('main.ts updated');
console.log('All done');
