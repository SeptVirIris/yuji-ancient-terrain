// 从 localStorage 读取用户自己的天地图 Key；未设置时返回空字符串
const STORAGE_KEY = 'yuji-tianditu-key'

export function getTiandituKey(): string {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function setTiandituKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim())
}

export function hasTiandituKey(): boolean {
  return !!localStorage.getItem(STORAGE_KEY)
}
