// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        base: resolve(__dirname, 'src/base/base.scss'),
        theme: resolve(__dirname, 'src/theme/theme.scss'),
      },
      output: {
        entryFileNames: `[name]/bundle.min.js`,
        chunkFileNames: `[name]/bundle.min.js`,
        assetFileNames: `[name]/bundle.min.css`,
      }
    },

  }
})