// 从 localStorage 读取用户自己的天地图 Key；未设置时返回空字符串
const STORAGE_KEY = 'yuji-tianditu-key'

export function getTiandituKey(): string {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function setTiandituKey(key: string): void {
  var v = key.trim()
  // 如果用户粘贴了完整 API 地址，自动提取 tk= 后面的 Key
  var m = v.match(/[?&]tk=([^&\s]+)/)
  if (m) v = m[1]
  localStorage.setItem(STORAGE_KEY, v)
}

export function hasTiandituKey(): boolean {
  return !!localStorage.getItem(STORAGE_KEY)
}
