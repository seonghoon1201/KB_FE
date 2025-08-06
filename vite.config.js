import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        vue(),
        // vueDevTools(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: '지비',
                short_name: '지비',
                display: 'standalone',
                start_url: '/',
                background_color: '#ffffff',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
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
        // proxy: {
        //     '/v1': {
        //         // 로컬 대신 여기에 배포된 서버 URL
        //         target: 'http://15.165.143.27:8080',
        //         changeOrigin: true,
        //         // 클라이언트 요청 '/v1/...' → 서버의 '/v1/...' 로 매핑
        //         rewrite: (path) => path.replace(/^\/v1/, '/v1'),
        //     },
        // },
    },
})
