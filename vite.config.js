import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
<<<<<<< HEAD
import path from 'path'
=======
>>>>>>> upstream/main

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
<<<<<<< HEAD
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
=======
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
>>>>>>> upstream/main
    },
  },
})
