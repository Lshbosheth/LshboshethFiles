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
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon-512x512.png'],
          manifest: {
              name: 'My Awesome App',
              short_name: 'MyApp',
              description: 'My Awesome App description',
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
              ]
          }
      })
  ],
  server: {
    port: 1030
  }
})
