var fs = require('fs');
var src = fs.readFileSync('./src/map.ts', 'utf8');

var newDefs = [
  'const LAYER_DEFS: LayerDef[] = [',
  '  { id:"capital", label:"都城", type:"point", color:"#C0392B", icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><polygon points="12,2 22,22 2,22" fill="rgba(192,57,43,0.15)" stroke="#C0392B" stroke-width="1.5"/></svg>\' },',
  '  { id:"city", label:"府州", type:"point", color:"#2C3E50", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="6" width="18" height="12" rx="1" fill="rgba(44,62,80,0.12)" stroke="#2C3E50" stroke-width="1.5"/></svg>\' },',
  '  { id:"fort", label:"关隘", type:"point", color:"#A0522D", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><line x1="7" y1="7" x2="17" y2="17" stroke="#A0522D" stroke-width="3" stroke-linecap="round"/><line x1="17" y1="7" x2="7" y2="17" stroke="#A0522D" stroke-width="3" stroke-linecap="round"/></svg>\' },',
  '  { id:"harbor", label:"渡口", type:"point", color:"#006666", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="rgba(0,102,102,0.15)" stroke="#006666" stroke-width="1.5"/></svg>\' },',
  '  { id:"battle", label:"战场", type:"point", color:"#D4AC0D", icon:\'<svg viewBox="0 0 24 24" width="20" height="20"><rect x="5" y="5" width="14" height="14" fill="rgba(212,172,13,0.15)" stroke="#D4AC0D" stroke-width="1.5" transform="rotate(45,12,12)"/></svg>\' },',
  '  { id:"block", label:"区块", type:"polygon", color:"#e74c3c", weight:2, icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 5L12 2L21 5V19L12 22L3 19V5Z" fill="rgba(231,76,60,0.15)" stroke="#e74c3c" stroke-width="1.5" stroke-linejoin="round"/></svg>\' },',
  '  { id:"waterway", label:"水路", type:"line", color:"#3498db", weight:3, dash:"8,6", icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M2 18Q8 10 12 14T22 12" fill="none" stroke="#3498db" stroke-width="2" stroke-linecap="round"/><path d="M2 20Q8 12 12 16T22 14" fill="none" stroke="#3498db" stroke-width="1" opacity="0.4" stroke-linecap="round"/></svg>\' },',
  '  { id:"mountain", label:"山脉", type:"line", color:"#8e44ad", weight:3, icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M2 20L8 8L12 14L16 6L22 20" fill="none" stroke="#8e44ad" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\' },',
  '  { id:"passage", label:"通道", type:"line", color:"#f39c12", weight:2.5, dash:"5,4", icon:\'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 6H20M4 12H20M4 18H20" stroke="#f39c12" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="4,3"/></svg>\' }',
  ']'
].join('\r\n');

var startIdx = src.indexOf('const LAYER_DEFS: LayerDef[] = [');
var endIdx = src.indexOf('const DEFAULT_ON_LAYERS');
if (startIdx === -1) { console.log('start not found'); process.exit(1); }
if (endIdx === -1) { console.log('end not found'); process.exit(1); }

src = src.substring(0, startIdx) + newDefs + '\r\n\r\n' + src.substring(endIdx);

src = src.replace("type LayerId = 'block' | 'waterway' | 'mountain' | 'passage' | 'pass' | 'smallcity'",
  "type LayerId = 'capital' | 'city' | 'fort' | 'harbor' | 'battle' | 'block' | 'waterway' | 'mountain' | 'passage'");

src = src.replace(/const DEFAULT_ON_LAYERS = new Set\(\[.*?\]\)/,
  "const DEFAULT_ON_LAYERS = new Set(['capital','city','fort'])");

fs.writeFileSync('./src/map.ts', src, 'utf8');
console.log('Done');
