import { defineConfig } from 'vite'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [cesium()],
  base: '/yuji-ancient-terrain/',
  server: {
    port: 5178,
    open: false
  }
})
