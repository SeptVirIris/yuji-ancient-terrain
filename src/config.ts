// 天地图 Key 由用户自行在面板中输入，存入 localStorage
// 申请 Key：https://console.tianditu.gov.cn/ → 创建应用（浏览器端）

// 地图初始配置
export const MAP_CONFIG = {
  center: [35.0, 110.0] as [number, number],  // 中国居中
  zoom: 5,
  minZoom: 3,
  maxZoom: 18,
  maxBounds: [
    [0, 70],    // 西南角
    [55, 145]   // 东北角
  ] as [[number, number], [number, number]]
}
