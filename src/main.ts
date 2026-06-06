import './style.css'
import { initMap } from './map'
import { hasTiandituKey, setTiandituKey, getTiandituKey } from './key'

// 自动从 sync-cities.json 同步六个图层数据
async function loadSyncData() {
  try {
    var resp = await fetch('/sync-cities.json')
    var data = await resp.json()
    localStorage.setItem('yuji-layer-data', JSON.stringify(data))
    console.log('已从读心·读城鉴同步'
      + data.smallcity.features.length + ' 城池、'
      + data.pass.features.length + ' 关口、'
      + data.block.features.length + ' 区块、'
      + data.waterway.features.length + ' 水路、'
      + data.mountain.features.length + ' 山脉、'
      + data.passage.features.length + ' 通道')
  } catch (e) { console.warn('同步数据加载失败', e) }
}

// 首次使用弹窗：让用户填入自己的天地图 Key
function showKeyPrompt(): Promise<void> {
  return new Promise(function (resolve) {
    if (hasTiandituKey()) { resolve(); return }

    var overlay = document.createElement('div')
    overlay.id = 'yj-key-overlay'
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10001;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;'
    overlay.innerHTML = '<div style="background:#fff;border-radius:8px;padding:30px;max-width:460px;width:90%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,0.4);">'+
      '<div style="font-size:18px;font-weight:700;color:#2c3e50;margin-bottom:8px;">请输入天地图 Key</div>'+
      '<div style="font-size:13px;color:#666;margin-bottom:20px;line-height:1.6;">本程序使用天地图底图，需要每个人<strong>自行申请</strong>免费 Key。<br/>你的 Key 只存在自己浏览器里，不会上传。<br/>'+
      '<a href="https://console.tianditu.gov.cn/" target="_blank" style="color:#3498db;">→ 点此去天地图控制台申请（浏览器端）</a></div>'+
      '<input id="yj-key" type="text" placeholder="粘贴 Key 到此处" style="width:100%;padding:10px 12px;border-radius:6px;border:2px solid #ddd;font-size:14px;outline:none;text-align:center;"/>'+
      '<button id="yj-key-confirm" style="width:100%;margin-top:14px;padding:10px;border:none;border-radius:6px;background:#2c3e50;color:#fff;font-size:15px;cursor:pointer;font-weight:600;">确认</button>'+
      '<div style="font-size:11px;color:#aaa;margin-top:10px;">申请后请在控制台勾选全部服务类型</div></div>'
    document.body.appendChild(overlay)

    var inp = document.getElementById('yj-key') as HTMLInputElement
    var btn = document.getElementById('yj-key-confirm') as HTMLButtonElement
    btn.onclick = function () {
      var v = inp.value.trim()
      if (!v) { inp.style.borderColor = '#e74c3c'; return }
      setTiandituKey(v)
      overlay.remove()
      resolve()
    }
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') btn.click() })
  })
}

// 在控制面板中追加 Key 管理区域
function setupKeySection() {
  if (!hasTiandituKey()) return
  // 等待面板渲染
  setTimeout(function () {
    var panel = document.querySelector('.yuji-panel .panel-body')
    if (!panel) return
    if (document.getElementById('yj-key-section')) return

    var section = document.createElement('div')
    section.id = 'yj-key-section'
    section.className = 'panel-section'
    section.innerHTML = '<div class="section-title">天地图 Key</div>'+
      '<div style="display:flex;gap:4px;">'+
      '<input id="yj-key-input" type="text" value="'+getTiandituKey().replace(/"/g,'&quot;')+'" style="flex:1;padding:4px 6px;border-radius:3px;border:1px solid #ddd;font-size:11px;background:#f9f9f9;outline:none;"/>'+
      '<button id="yj-key-save" style="padding:4px 8px;border:none;border-radius:3px;background:#2c3e50;color:#fff;cursor:pointer;font-size:11px;white-space:nowrap;">保存</button></div>'+
      '<div style="font-size:10px;color:#999;margin-top:3px;"><a href="https://console.tianditu.gov.cn/" target="_blank" style="color:#3498db;">申请新 Key</a></div>'
    panel.appendChild(section)

    var inp = document.getElementById('yj-key-input') as HTMLInputElement
    var btn = document.getElementById('yj-key-save') as HTMLButtonElement
    btn.onclick = function () {
      var v = inp.value.trim()
      if (!v) return
      setTiandituKey(v)
      // 刷新底图瓦片，使新 Key 生效
      location.reload()
    }
  }, 800)
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadSyncData()
  await showKeyPrompt()
  initMap('map')
  setupKeySection()
})
