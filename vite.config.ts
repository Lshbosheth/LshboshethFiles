import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: {
        '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      VitePWA({
          manifest: {
              name: 'File Manager',
              short_name: 'File Manager',
              description: 'Lshbosheth File Manager',
              theme_color: '#ffffff',
              icons: [
                  {
                      src: 'pwa-192x192.png',
                      sizes: '192x192',
                      type: 'image/png'
                  },
                  {
                      src: 'pwa-512x512.png',
                      sizes: '512x512',
                      type: 'image/png'
                  }
              ],
              shortcuts: [
                  {
                      name: "新建",
                      short_name: "新建short_name",
                      description: "新建short_name description",
                      url: "/",
                      icons: [{ src: "/pwa-192x192.png", sizes: "192x192" }],
                  },
                  {
                      name: "test",
                      short_name: "test short_name",
                      description: "test short_name description",
                      url: "/",
                      icons: [{ src: "/pwa-192x192.png", sizes: "192x192" }],
                  },
              ],
          },
          registerType: "autoUpdate",
          devOptions: {
              enabled: true,
          },
          workbox: {
              globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          },
      })
  ],
  server: {
    port: 1030
  }
})
