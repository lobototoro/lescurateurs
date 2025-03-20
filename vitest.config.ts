import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul' // or 'v8'
    },
    setupFiles: ['vitest-setup.ts'],
  },
  resolve: {
    alias: {
      '@/': '/',
    },
  },
});