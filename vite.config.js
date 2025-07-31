import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: '지비',
                short_name: '지비',
                description: '청약 도우미 웹앱',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/pwa.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/v1': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/v1/, '/v1'),
            },
        },
    },
})
