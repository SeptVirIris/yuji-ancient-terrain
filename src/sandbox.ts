import L from 'leaflet'

type Faction = { id: string; name: string; color: string }
type SandboxState = { factions: Faction[]; assignments: Record<string, string> }

var sandboxMap: L.Map | null = null
var factionLayer: L.FeatureGroup | null = null
var state: SandboxState = { factions: [], assignments: {} }
var selectedFactionId: string | null = null
var panelEl: HTMLDivElement | null = null
var drawMode = false

var DEFAULT_FACTIONS: Faction[] = [
  { id: 'wei', name: 'Wei', color: '#e74c3c' },
  { id: 'shu', name: 'Shu', color: '#27ae60' },
  { id: 'wu', name: 'Wu', color: '#3498db' }
]
var STORAGE_KEY_SB = 'yuji-sandbox'

function rndColor() { return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') }
function saveState() { try { localStorage.setItem(STORAGE_KEY_SB, JSON.stringify(state)) } catch (e) {} }
function loadState() {
  try {
    var r = localStorage.getItem(STORAGE_KEY_SB)
    if (r) { var p = JSON.parse(r); state.factions = p.factions || DEFAULT_FACTIONS; state.assignments = p.assignments || {} }
    else state.factions = DEFAULT_FACTIONS
  } catch (e) { state.factions = DEFAULT_FACTIONS }
}

// ===== Panel =====
function buildPanel() {
  if (panelEl) panelEl.remove()
  panelEl = document.createElement('div')
  panelEl.id = 'sandbox-panel'
  panelEl.style.cssText = 'position:fixed;top:10px;right:10px;z-index:10001;background:#fff;border-radius:6px;box-shadow:0 2px 12px rgba(0,0,0,0.25);width:220px;font-size:13px;color:#333;overflow:hidden;'
  var h = '<div style="padding:10px 14px;background:#2c3e50;color:#fff;font-weight:600;">Factions</div>'
  h += '<div style="max-height:260px;overflow-y:auto;padding:8px 0;">'
  state.factions.forEach(function (f) {
    var sel = selectedFactionId === f.id ? 'border:2px solid ' + f.color + ';background:' + f.color + '22;' : ''
    h += '<div class="sb-f-row" data-fid="' + f.id + '" style="display:flex;align-items:center;gap:8px;padding:6px 14px;cursor:pointer;' + sel + '">'
    h += '<span style="width:14px;height:14px;border-radius:3px;background:' + f.color + ';flex-shrink:0;"></span>'
    h += '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + f.name + '</span>'
    h += '<button class="sb-del" data-fid="' + f.id + '" style="background:none;border:none;cursor:pointer;color:#999;font-size:14px;padding:0 2px;">x</button>'
    h += '</div>'
  })
  h += '</div>'
  h += '<div style="padding:8px 14px;border-top:1px solid #eee;display:flex;gap:6px;">'
  h += '<button id="sb-add" style="flex:1;padding:4px 8px;border-radius:4px;border:1px solid #ccc;cursor:pointer;font-size:12px;">+ Add</button>'
  h += '<button id="sb-draw" style="flex:1;padding:4px 8px;border-radius:4px;border:1px solid #ccc;cursor:pointer;font-size:12px;' + (drawMode ? 'background:#e74c3c;color:#fff;' : '') + '">' + (drawMode ? 'Stop' : 'Draw') + '</button>'
  h += '</div>'
  h += '<div style="padding:4px 14px 8px;font-size:10px;color:#999;">Select faction, press Draw, click map to paint territory. Double-click to close polygon. Esc to cancel.</div>'
  panelEl.innerHTML = h
  document.body.appendChild(panelEl)

  document.getElementById('sb-add')!.onclick = function () { var n = window.prompt('Faction name'); if (!n) return; state.factions.push({ id: 'f' + Date.now(), name: n, color: rndColor() }); saveState(); buildPanel() }
  document.getElementById('sb-draw')!.onclick = function () { drawMode = !drawMode; if (!drawMode) { cancelDrawing(); if (sandboxMap) sandboxMap.doubleClickZoom.enable(); } buildPanel() }
  panelEl.querySelectorAll('.sb-f-row').forEach(function (r: any) { r.onclick = function (e: MouseEvent) { if ((e.target as HTMLElement).classList.contains('sb-del')) return; selectedFactionId = r.dataset.fid; buildPanel() } })
  panelEl.querySelectorAll('.sb-del').forEach(function (b: any) { b.onclick = function (e: Event) { e.stopPropagation(); var fid = b.dataset.fid; state.factions = state.factions.filter(function (f: any) { return f.id !== fid }); if (selectedFactionId === fid) selectedFactionId = null; Object.keys(state.assignments).forEach(function (k) { if (state.assignments[k] === fid) delete state.assignments[k] }); saveState(); buildPanel(); refreshFactions() } })
}

// ===== Drawing =====
var drawPts: L.LatLng[] = [], drawPoly: L.Polygon | null = null, drawMrks: L.CircleMarker[] = []

function cancelDrawing() {
  if (!sandboxMap) return
  sandboxMap.off('click'); sandboxMap.off('dblclick')
  if (drawPoly) sandboxMap.removeLayer(drawPoly)
  drawMrks.forEach(function (m) { sandboxMap!.removeLayer(m) })
  drawMrks = []; drawPts = []; drawPoly = null
  drawMode = false; buildPanel()
  sandboxMap.doubleClickZoom.enable(); sandboxMap.getContainer().style.cursor = ''
}

function startDraw() {
  if (!sandboxMap || !drawMode || !selectedFactionId) return
  drawPts = []; drawPoly = null; drawMrks = []
  if (!factionLayer) { factionLayer = L.featureGroup().addTo(sandboxMap) }
  sandboxMap.doubleClickZoom.disable(); sandboxMap.getContainer().style.cursor = 'crosshair'
  sandboxMap.on('click', addPt); sandboxMap.on('dblclick', finish)
}

function addPt(e: L.LeafletMouseEvent) {
  if (!sandboxMap || !drawMode) return
  drawPts.push(e.latlng)
  var m = L.circleMarker(e.latlng, { radius: 3, color: '#2c3e50', fillColor: '#fff', fillOpacity: 1, weight: 2 }).addTo(sandboxMap)
  drawMrks.push(m)
  if (drawPoly) sandboxMap.removeLayer(drawPoly)
  if (drawPts.length > 1) {
    var fc = state.factions.find(function (f) { return f.id === selectedFactionId })
    drawPoly = L.polygon(drawPts, { color: fc?.color || '#999', fillColor: fc?.color || '#999', fillOpacity: 0.2, weight: 2 }).addTo(sandboxMap)
  }
}

function finish() {
  if (!sandboxMap || !drawMode || drawPts.length < 3) { cancelDrawing(); return }
  sandboxMap.off('click', addPt); sandboxMap.off('dblclick', finish)
  if (drawPoly) sandboxMap.removeLayer(drawPoly)
  drawMrks.forEach(function (m) { sandboxMap!.removeLayer(m) }); drawMrks = []

  var fc = state.factions.find(function (f) { return f.id === selectedFactionId })
  var poly = L.polygon(drawPts, { color: fc?.color || '#999', fillColor: fc?.color || '#999', fillOpacity: 0.3, weight: 2 })
  var pid = 'p' + Date.now(); (poly as any)._pid = pid; state.assignments[pid] = selectedFactionId || ''
  if (fc) poly.bindTooltip(fc.name, { permanent: true, direction: 'center', className: 'sb-flabel' })
  poly.on('click', function (e) { L.DomEvent.stopPropagation(e); if (!drawMode && selectedFactionId) { var f = state.factions.find(function (x) { return x.id === selectedFactionId }); state.assignments[(poly as any)._pid] = selectedFactionId!; poly.setStyle({ color: f?.color || '#999', fillColor: f?.color || '#999' }); poly.unbindTooltip(); if (f) poly.bindTooltip(f.name, { permanent: true, direction: 'center', className: 'sb-flabel' }); saveState() } })
  if (factionLayer) factionLayer.addLayer(poly)
  saveState(); drawPts = []; drawPoly = null
  sandboxMap.doubleClickZoom.enable(); sandboxMap.getContainer().style.cursor = ''
}

function refreshFactions() {
  if (!factionLayer) return
  factionLayer.eachLayer(function (l: any) { var pid = l._pid; if (!pid) return; var fid = state.assignments[pid]; if (fid) { var f = state.factions.find(function (x: any) { return x.id === fid }); if (f) { l.setStyle({ color: f.color, fillColor: f.color }); l.unbindTooltip(); l.bindTooltip(f.name, { permanent: true, direction: 'center', className: 'sb-flabel' }) } } })
}

// ===== Init =====
export function initSandbox(containerId: string, imageUrl: string, imageBounds: [[number,number],[number,number]]) {
  if (sandboxMap) return
  loadState()

  sandboxMap = L.map(containerId, { center: [35, 110], zoom: 5, minZoom: 3, maxZoom: 10, zoomControl: true, attributionControl: true })

  // Static image as base
  L.imageOverlay(imageUrl, imageBounds).addTo(sandboxMap)

  factionLayer = L.featureGroup().addTo(sandboxMap)

  buildPanel()

  sandboxMap.on('click', function () { if (drawMode && selectedFactionId) startDraw() })
  sandboxMap.getContainer().addEventListener('keydown', function (e: KeyboardEvent) { if (e.key === 'Escape') { cancelDrawing() } })

  document.getElementById(containerId)!.style.display = 'block'
}

export function destroySandbox() {
  if (sandboxMap) { sandboxMap.remove(); sandboxMap = null }
  factionLayer = null
  if (panelEl) { panelEl.remove(); panelEl = null }
  drawMode = false
  var sb = document.getElementById('sandbox'); if (sb) sb.style.display = 'none'
}
