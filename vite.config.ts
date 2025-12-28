import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            outDir: 'dist/main',
            emptyOutDir: true,
            rollupOptions: {
              external: ['@ppbong/svg-converter'],
            }
          }
        }
      },
      preload: {
        input: 'electron/preload/index.ts',
        vite: {
          build: {
            outDir: 'dist/preload',
            emptyOutDir: true,
            rollupOptions: {
              external: [],
            }
          }
        }
      },
    }),
  ],
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('element-plus')) {
            return 'element-plus'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 3000,
  },
})
