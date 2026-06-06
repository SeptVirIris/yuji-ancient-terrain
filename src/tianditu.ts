import L from 'leaflet'
import { getTiandituKey } from './key'

const SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7']

// 天地图地形底图
export function createTerrainLayer(): L.TileLayer {
  return L.tileLayer(
    'https://t{s}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=' + getTiandituKey(),
    {
      subdomains: SUBDOMAINS,
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a>'
    }
  )
}

// 天地图地形图地名标注
export function createTerrainAnnotationLayer(): L.TileLayer {
  return L.tileLayer(
    'https://t{s}.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=' + getTiandituKey(),
    {
      subdomains: SUBDOMAINS,
      maxZoom: 18,
      minZoom: 3
    }
  )
}

// 天地图影像底图
export function createImageryLayer(): L.TileLayer {
  return L.tileLayer(
    'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + getTiandituKey(),
    {
      subdomains: SUBDOMAINS,
      maxZoom: 18,
      minZoom: 3
    }
  )
}

// 天地图影像图地名标注
export function createImageryAnnotationLayer(): L.TileLayer {
  return L.tileLayer(
    'https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + getTiandituKey(),
    {
      subdomains: SUBDOMAINS,
      maxZoom: 18,
      minZoom: 3
    }
  )
}
