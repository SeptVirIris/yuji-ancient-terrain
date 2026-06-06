import { getTiandituKey } from './key'

// Tianditu CDN Cesium (required for GeoTerrainProvider plugin)
const CESIUM_JS = 'https://api.tianditu.gov.cn/cdn/demo/sanwei/static/cesium/Cesium.js'
const CESIUM_CSS = 'https://api.tianditu.gov.cn/cdn/demo/sanwei/static/cesium/Widgets/widgets.css'
const PLUGINS = [
  'https://api.tianditu.gov.cn/cdn/plugins/cesium/bytebuffer.min.js',
  'https://api.tianditu.gov.cn/cdn/plugins/cesium/long.min.js',
  'https://api.tianditu.gov.cn/cdn/plugins/cesium/protobuf.min.js',
  'https://api.tianditu.gov.cn/cdn/plugins/cesium/Cesium_ext_min.js'
]

let viewer: any = null
let container: HTMLDivElement | null = null
let cesiumLoaded = false

function loadScript(src: string): Promise<void> {
  return new Promise(function (resolve) {
    var s = document.createElement('script')
    s.src = src
    s.onload = function () { resolve() }
    s.onerror = function () { resolve() }
    document.head.appendChild(s)
  })
}

async function ensureCesium(): Promise<any> {
  if (cesiumLoaded) return (window as any).Cesium

  // Load CSS
  if (!document.querySelector('link[data-cesium-css]')) {
    var link = document.createElement('link')
    link.rel = 'stylesheet'; link.href = CESIUM_CSS; link.setAttribute('data-cesium-css', '1')
    document.head.appendChild(link)
  }

  // Load Cesium.js from Tianditu CDN (this is the key - must match plugin build)
  if (!(window as any).Cesium?.Viewer) {
    await loadScript(CESIUM_JS)
  }

  // Load plugins
  for (var p of PLUGINS) {
    await loadScript(p)
  }

  cesiumLoaded = true
  return (window as any).Cesium
}

export async function open3D(lat: number, lng: number, name: string) {
  if (container) close3D()

  // Create container with loading indicator
  container = document.createElement('div')
  container.id = 'cesium-container'
  container.style.cssText = 'position:fixed;top:0;right:0;width:55%;height:100%;z-index:5000;box-shadow:-4px 0 20px rgba(0,0,0,0.5);background:#000;display:flex;align-items:center;justify-content:center;'
  container.innerHTML = '<div style="color:#fff;font-size:20px;text-align:center;"><div style="font-size:48px;margin-bottom:10px;">3D</div><div>Loading Cesium + Tianditu plugins...</div><div style="font-size:12px;color:#999;margin-top:10px;">May take 30-60s first time</div></div>'
  container.addEventListener('contextmenu', function (e) { e.preventDefault() })
  document.body.appendChild(container)

  var C = await ensureCesium()

  // Clear loading
  container.innerHTML = ''
  container.style.background = 'transparent'

  // Status display
  var status = document.createElement('div')
  status.style.cssText = 'position:absolute;bottom:10px;left:10px;z-index:5002;background:rgba(0,0,0,0.7);color:lime;padding:4px 10px;border-radius:4px;font-size:12px;font-family:monospace;'
  container.appendChild(status)

  // Close button
  var closeBtn = document.createElement('button')
  closeBtn.textContent = 'X'
  closeBtn.style.cssText = 'position:absolute;top:50px;right:10px;z-index:5002;background:rgba(0,0,0,0.7);color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:16px;'
  closeBtn.onclick = close3D
  container.appendChild(closeBtn)

  C.Ion.defaultAccessToken = ''

  viewer = new C.Viewer(container, {
    animation: false, timeline: false, baseLayerPicker: false,
    geocoder: false, infoBox: false, selectionIndicator: false,
    fullscreenButton: true, homeButton: true, sceneModePicker: true, navigationHelpButton: true, navigationInstructionsInitiallyVisible: false,
    sceneMode: C.SceneMode.SCENE3D
  })

  // Stop auto-rotation and animation
  viewer.clock.shouldAnimate = false

  viewer.imageryLayers.removeAll()

  // Configure camera like Tianditu
  var sc = (viewer.scene as any).screenSpaceCameraController
  if (sc) {
    sc.constrainedPitch = false;
    sc.minimumPitch = C.Math.toRadians(-89);
    sc.minimumZoomDistance = 50;
    sc.maximumZoomDistance = 20000000
  }

  // Tianditu satellite imagery
  viewer.imageryLayers.addImageryProvider(
    new C.UrlTemplateImageryProvider({
      url: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + getTiandituKey(),
      subdomains: ['0','1','2','3','4','5','6','7'], tilingScheme: new C.WebMercatorTilingScheme(), maximumLevel: 18
    })
  )

  // Tianditu labels
  viewer.imageryLayers.addImageryProvider(
    new C.UrlTemplateImageryProvider({
      url: 'https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + getTiandituKey(),
      subdomains: ['0','1','2','3','4','5','6','7'], maximumLevel: 18, minimumLevel: 0
    })
  )

  // Tianditu elevation terrain
  var Ts = (window as any).Cesium
  if (Ts?.GeoTerrainProvider) {
    var urls: string[] = []
    var subs = ['0','1','2','3','4','5','6','7']
    for (var si = 0; si < subs.length; si++) {
      urls.push('https://t' + subs[si] + '.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=' + getTiandituKey())
    }
    viewer.terrainProvider = new Ts.GeoTerrainProvider({ urls: urls, requestVertexNormals: true })
    status.textContent = 'Tianditu terrain | Ctrl+Left drag=tilt | Scroll=zoom | Right drag=zoom'
    status.style.color = 'lime'
  } else {
    status.textContent = 'Tianditu plugin failed, no terrain'
    status.style.color = 'red'
  }

  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.maximumScreenSpaceError = 2

  viewer.camera.flyTo({
    destination: C.Cartesian3.fromDegrees(lng, lat, 3000),
    orientation: { heading: 0, pitch: C.Math.toRadians(-35), roll: 0 }, duration: 2
  })

  viewer.entities.add({
    name: name, position: C.Cartesian3.fromDegrees(lng, lat),
    point: { pixelSize: 10, heightReference: C.HeightReference.CLAMP_TO_GROUND, color: C.Color.RED, outlineColor: C.Color.WHITE, outlineWidth: 2 },
    label: { text: name, font: '14px sans-serif', style: C.LabelStyle.FILL_AND_OUTLINE, outlineWidth: 2, verticalOrigin: C.VerticalOrigin.BOTTOM, pixelOffset: new C.Cartesian2(0, -20) }
  })
}

export function close3D() {
  if (viewer) { viewer.destroy(); viewer = null }
  if (container) { container.remove(); container = null }
}
