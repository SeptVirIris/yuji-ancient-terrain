// yuji-to-hex.cjs - using MapDesigner's exact coord formula
const fs = require('fs');
const src = JSON.parse(fs.readFileSync('./public/sync-cities.json', 'utf8'));

const SQRT3 = Math.sqrt(3);
// MapDesigner: x = size*1.5*col, y = -size*SQRT3*(row + col/2)
// So: col = x/(size*1.5), row = -y/(size*SQRT3) - col/2

const KM_PER_DEG_LAT = 111;
const CENTER_LAT = 35, CENTER_LNG = 105;
const KM_PER_HEX = 15; // km per hex size unit

function toHex(lat, lng) {
  var kmLng = KM_PER_DEG_LAT * Math.cos(CENTER_LAT * Math.PI / 180);
  var px = (lng - CENTER_LNG) * kmLng / KM_PER_HEX;
  var py = (lat - CENTER_LAT) * KM_PER_DEG_LAT / KM_PER_HEX; // north=positive
  // MapDesigner uses -SQRT3*(row+col/2) for y, so py from above needs negation
  // y_svg = -SQRT3*(row+col/2), and y_svg increases downward
  // py increases northward, so y_svg = -py
  // -SQRT3*(row+col/2) = -py  => row+col/2 = py/SQRT3
  var col = Math.round(px / 1.5);
  var row = Math.round(py / SQRT3 - col / 2);
  return { row: row, col: col };
}

var AXIAL_DIRS = [
  { row: 1, col: 0 }, { row: 0, col: 1 }, { row: -1, col: 1 },
  { row: -1, col: 0 }, { row: 0, col: -1 }, { row: 1, col: -1 }
];

function neighbors(r, c) { return AXIAL_DIRS.map(function(d) { return { row: r + d.row, col: c + d.col }; }); }
function k(r, c) { return r + ',' + c; }

var occupied = {};
var cells = [];

function place(r, c, terrain, name, tags) {
  var key = k(r, c);
  if (occupied[key]) return false;
  occupied[key] = true;
  cells.push({ row: r, col: c, terrain: terrain, biome: 'grassland', tags: tags || [], note: name });
  return true;
}

function hasGap(r, c) {
  if (occupied[k(r, c)]) return false;
  var nb = neighbors(r, c);
  for (var i = 0; i < nb.length; i++) if (occupied[k(nb[i].row, nb[i].col)]) return false;
  return true;
}

src.smallcity.features.forEach(function(f) {
  var h = toHex(f.geometry.coordinates[1], f.geometry.coordinates[0]);
  var name = f.properties.name;
  place(h.row, h.col, 'plain', name, []);
  neighbors(h.row, h.col).forEach(function(n) { place(n.row, n.col, 'plain', name, []); });
});

src.pass.features.forEach(function(f) {
  var h = toHex(f.geometry.coordinates[1], f.geometry.coordinates[0]);
  var name = f.properties.name;
  if (hasGap(h.row, h.col)) { place(h.row, h.col, 'hill', name, ['peak']); return; }
  var bd = Infinity, bc = null;
  src.smallcity.features.forEach(function(cf) {
    var ch = toHex(cf.geometry.coordinates[1], cf.geometry.coordinates[0]);
    var d = Math.abs(h.row - ch.row) + Math.abs(h.col - ch.col);
    if (d < bd) { bd = d; bc = ch; }
  });
  if (!bc) return;
  var dr = h.row - bc.row, dc = h.col - bc.col;
  var mr = dr === 0 ? 0 : (dr > 0 ? 1 : -1), mc = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
  if (mr === 0 && mc === 0) mr = 1;
  for (var step = 2; step <= 25; step++) {
    var tried = [];
    for (var sx = -1; sx <= 1; sx++) for (var sy = -1; sy <= 1; sy++) tried.push({ row: h.row + mr * step + sx, col: h.col + mc * step + sy });
    tried.push({ row: h.row + mc * step, col: h.col - mr * step });
    tried.push({ row: h.row - mc * step, col: h.col + mr * step });
    for (var t = 0; t < tried.length; t++) if (hasGap(tried[t].row, tried[t].col)) { place(tried[t].row, tried[t].col, 'hill', name, ['peak']); return; }
  }
  console.log('WARN: ' + name);
});

var minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
cells.forEach(function(c) { minR=Math.min(minR,c.row); maxR=Math.max(maxR,c.row); minC=Math.min(minC,c.col); maxC=Math.max(maxC,c.col); });
console.log('Cities=' + src.smallcity.features.length + 'x7 Passes=' + src.pass.features.length + ' Total=' + cells.length + ' R:' + minR + '~' + maxR + ' C:' + minC + '~' + maxC + ' KM_PER_HEX=' + KM_PER_HEX);

var doc = {
  schema_version: 1, meta: { id: 'yuji-hex-v7', name: 'Yuji Hex Sandbox', description: 'cities(7)+passes(1)', tags: ['history','china'], created_at: new Date().toISOString(), updated_at: new Date().toISOString(), revision: 1 },
  grid: { layout: 'flat-top-even-q', origin: { row: 0, col: 0 } }, cells: cells, features: { rivers: [] }
};
fs.writeFileSync('D:/mapdesigner/storage/maps/yuji-hex-v7.json', JSON.stringify(doc, null, 2), 'utf8');
console.log('Done.');



